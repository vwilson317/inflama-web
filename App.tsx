import { StatusBar } from 'expo-status-bar';
import { Image } from 'expo-image';
import { Platform, Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faBars, faHeart } from '@fortawesome/free-solid-svg-icons';
import type { IconProp } from '@fortawesome/fontawesome-svg-core';
import { polyfillCountryFlagEmojis } from 'country-flag-emoji-polyfill';
import { useCallback, useEffect, useState } from 'react';
import { SwipeStack } from './src/components/SwipeStack';
import { MatchModal } from './src/components/MatchModal';
import { OutOfLikesModal } from './src/components/OutOfLikesModal';
import { SignupModal } from './src/components/SignupModal';
import { Profile } from './src/types/profile';
import { MOCK_PROFILES } from './src/data/mockProfiles';
import { theme } from './src/theme';

const MOBILE_MAX_WIDTH = 768;
const INITIAL_LIKES = 3;
const MATCHES_STORAGE_KEY = 'inflama_matches';

type StoredMatch = {
  id: string;
  name: string;
  instagram?: string;
};

export default function App() {
  const { width } = useWindowDimensions();
  const isWebDesktop = Platform.OS === 'web' && width > MOBILE_MAX_WIDTH;

  useEffect(() => {
    if (Platform.OS === 'web') {
      polyfillCountryFlagEmojis();
    }
  }, []);

  const [matches, setMatches] = useState<StoredMatch[]>([]);
  const [profiles, setProfiles] = useState(() => [...MOCK_PROFILES]);
  const [likesRemaining, setLikesRemaining] = useState(INITIAL_LIKES);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [matchModal, setMatchModal] = useState<{ visible: boolean; name?: string; instagram?: string }>({
    visible: false,
    name: undefined,
    instagram: undefined,
  });
  const [outOfLikesModalVisible, setOutOfLikesModalVisible] = useState(false);
  const [signupModalVisible, setSignupModalVisible] = useState(false);
  const [pendingSignupPrompt, setPendingSignupPrompt] = useState(false);
  const [isSwipeLocked, setIsSwipeLocked] = useState(false);
  const [reloadToken, setReloadToken] = useState(0);

  useEffect(() => {
    if (Platform.OS !== 'web') return;
    try {
      const stored = window.localStorage.getItem(MATCHES_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as StoredMatch[];
        if (Array.isArray(parsed)) {
          setMatches(parsed);
          const matchedIds = new Set(parsed.map((m) => m.id));
          setProfiles(MOCK_PROFILES.filter((p) => !matchedIds.has(p.id)));
        }
      }
    } catch (err) {
      console.warn('Failed to load stored matches', err);
    }
  }, []);

  useEffect(() => {
    if (!matchModal.visible && pendingSignupPrompt) {
      setSignupModalVisible(true);
      setPendingSignupPrompt(false);
    }
  }, [matchModal.visible, pendingSignupPrompt]);

  const showOutOfLikesModal = useCallback(() => {
    if (isSwipeLocked) {
      setSignupModalVisible(true);
      return;
    }
    setOutOfLikesModalVisible(true);
  }, [isSwipeLocked]);

  const closeOutOfLikesModal = useCallback(() => {
    setOutOfLikesModalVisible(false);
  }, []);

  const handleSwipeLeft = useCallback((profile: Profile) => {
    console.log('Nope:', profile.name);
  }, []);

  const handleSwipeRight = useCallback((profile: Profile) => {
    if (isSwipeLocked) return;
    console.log('Like:', profile.name);
    setLikesRemaining((n) => {
      const next = Math.max(0, n - 1);
      if (next === 0) {
        setIsSwipeLocked(true);
        setPendingSignupPrompt(true);
      }
      return next;
    });
    setMatchModal({ visible: true, name: profile.name, instagram: profile.instagram });
    setMatches((prev) => {
      const next: StoredMatch[] = [
        ...prev,
        {
          id: profile.id,
          name: profile.name,
          instagram: profile.instagram,
        },
      ];
      if (Platform.OS === 'web') {
        try {
          window.localStorage.setItem(MATCHES_STORAGE_KEY, JSON.stringify(next));
        } catch (err) {
          console.warn('Failed to persist matches', err);
        }
      }
      return next;
    });
  }, [isSwipeLocked]);

  const closeMatchModal = useCallback(() => {
    setMatchModal((m) => ({ ...m, visible: false }));
  }, []);

  const closeSignupModal = useCallback(() => {
    setSignupModalVisible(false);
  }, []);

  const toggleMenu = useCallback(() => {
    setIsMenuOpen((open) => !open);
  }, []);

  const reloadUnmatchedProfiles = useCallback(() => {
    const matchedIds = new Set(matches.map((m) => m.id));
    setProfiles(MOCK_PROFILES.filter((p) => !matchedIds.has(p.id)));
    setReloadToken((t) => t + 1);
  }, [matches]);

  if (isWebDesktop) {
    return (
      <View style={styles.mobileOnly}>
        <Text style={styles.mobileOnlyTitle}>This is only available on mobile</Text>
        <Text style={styles.mobileOnlySubtitle}>
          Open this app on your phone or resize your browser to a mobile width to continue.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <View style={styles.headerCenter}>
          <Image
            source={require('./assets/icon.png')}
            style={styles.headerIcon}
            contentFit="contain"
          />
          <View style={styles.logoBlock}>
            <Image
              source={require('./assets/icon-text.png')}
              style={styles.logoImage}
              contentFit="contain"
            />
            <Text style={styles.tagline}>One photo. No chat. Just vibes.</Text>
          </View>
        </View>
        <View style={styles.headerRight}>
          <Pressable
            onPress={toggleMenu}
            style={styles.headerMenuButton}
            accessibilityRole="button"
            accessibilityLabel="Open menu"
          >
            <FontAwesomeIcon icon={faBars} size={28} color="#9ca3af" />
          </Pressable>
          {isMenuOpen ? (
            <View style={styles.headerMenuPanel}>
              <View style={styles.likesCounter}>
                <FontAwesomeIcon icon={faHeart as IconProp} size={18} color={theme.green} />
                <Text style={styles.likesCount}>{likesRemaining}</Text>
              </View>
              <Image
                source={{ uri: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&h=80&fit=crop' }}
                style={styles.userAvatar}
                contentFit="cover"
              />
            </View>
          ) : null}
        </View>
      </View>
      <View style={styles.stackWrap}>
        <SwipeStack
          key={reloadToken}
          profiles={profiles}
          likesRemaining={likesRemaining}
          isSwipeDisabled={isSwipeLocked}
          onSwipeLeft={handleSwipeLeft}
          onSwipeRight={handleSwipeRight}
          onOutOfLikes={showOutOfLikesModal}
          onReloadProfiles={reloadUnmatchedProfiles}
        />
      </View>
      <MatchModal
        visible={matchModal.visible}
        onClose={closeMatchModal}
        matchedName={matchModal.name}
        matchedInstagram={matchModal.instagram}
      />
      <OutOfLikesModal
        visible={outOfLikesModalVisible}
        onClose={closeOutOfLikesModal}
      />
      <SignupModal visible={signupModalVisible} onClose={closeSignupModal} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.bgDark,
  },
  mobileOnly: {
    flex: 1,
    backgroundColor: theme.bgDark,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  mobileOnlyTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: theme.gold,
    textAlign: 'center',
    marginBottom: 12,
  },
  mobileOnlySubtitle: {
    fontSize: 16,
    color: theme.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 20,
    paddingBottom: 10,
    paddingHorizontal: 24,
    zIndex: 10,
    elevation: 10,
  },
  headerCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  logoBlock: {
    alignItems: 'center',
  },
  headerIcon: {
    width: 72,
    height: 72,
    transform: [{ scaleX: 1.15 }, { scaleY: 1 }],
  },
  headerRight: {
    position: 'absolute',
    right: 24,
    top: 20,
    bottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    zIndex: 11,
  },
  headerMenuButton: {
    width: 52,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerMenuPanel: {
    position: 'absolute',
    top: 48,
    right: 0,
    backgroundColor: theme.white,
    borderWidth: 1,
    borderColor: 'rgba(0,39,118,0.12)',
    borderRadius: 18,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    shadowColor: '#002776',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 12,
    zIndex: 1000,
  },
  likesCounter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(0,151,57,0.12)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  likesCount: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.green,
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  logoImage: {
    height: 54,
    width: 190,
    marginLeft: -18,
  },
  tagline: {
    fontSize: 10,
    color: '#9ca3af',
    marginTop: -7,
    letterSpacing: 1.2,
    textAlign: 'center',
    width: 190,
  },
  stackWrap: {
    flex: 1,
    paddingTop: 5,
    paddingHorizontal: 20,
    paddingBottom: 100,
    overflow: 'visible',
  },
});
