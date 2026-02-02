import { StatusBar } from 'expo-status-bar';
import { Image } from 'expo-image';
import { Platform, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCog, faHeart } from '@fortawesome/free-solid-svg-icons';
import type { IconProp } from '@fortawesome/fontawesome-svg-core';
import { polyfillCountryFlagEmojis } from 'country-flag-emoji-polyfill';
import { useCallback, useEffect, useState } from 'react';
import { SwipeStack } from './src/components/SwipeStack';
import { MatchModal } from './src/components/MatchModal';
import { OutOfLikesModal } from './src/components/OutOfLikesModal';
import { Profile } from './src/types/profile';
import { MOCK_PROFILES } from './src/data/mockProfiles';
import { theme } from './src/theme';

const MOBILE_MAX_WIDTH = 768;

export default function App() {
  const { width } = useWindowDimensions();
  const isWebDesktop = Platform.OS === 'web' && width > MOBILE_MAX_WIDTH;

  useEffect(() => {
    if (Platform.OS === 'web') {
      polyfillCountryFlagEmojis();
    }
  }, []);

  const [profiles] = useState(() => [...MOCK_PROFILES]);
  const [likesRemaining, setLikesRemaining] = useState(3);
  const [matchModal, setMatchModal] = useState<{ visible: boolean; name?: string; instagram?: string }>({
    visible: false,
    name: undefined,
    instagram: undefined,
  });
  const [outOfLikesModalVisible, setOutOfLikesModalVisible] = useState(false);

  const showOutOfLikesModal = useCallback(() => {
    setOutOfLikesModalVisible(true);
  }, []);

  const closeOutOfLikesModal = useCallback(() => {
    setOutOfLikesModalVisible(false);
  }, []);

  const handleSwipeLeft = useCallback((profile: Profile) => {
    console.log('Nope:', profile.name);
  }, []);

  const handleSwipeRight = useCallback((profile: Profile) => {
    console.log('Like:', profile.name);
    setLikesRemaining((n) => Math.max(0, n - 1));
    setMatchModal({ visible: true, name: profile.name, instagram: profile.instagram });
  }, []);

  const closeMatchModal = useCallback(() => {
    setMatchModal((m) => ({ ...m, visible: false }));
  }, []);

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
        <View style={styles.headerLeft}>
          <Image
            source={require('./assets/app-icon-v2.png')}
            style={styles.headerIcon}
            contentFit="contain"
          />
          <View>
            <Text style={styles.logo}>Inflama</Text>
            <Text style={styles.tagline}>Swipe under the sequins</Text>
          </View>
        </View>
        <View style={styles.headerRight}>
          <View style={styles.likesCounter}>
            <FontAwesomeIcon icon={faHeart as IconProp} size={18} color={theme.green} />
            <Text style={styles.likesCount}>{likesRemaining}</Text>
          </View>
          <FontAwesomeIcon icon={faCog} size={20} color={theme.textSecondary} style={styles.headerIconFa} />
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&h=80&fit=crop' }}
            style={styles.userAvatar}
            contentFit="cover"
          />
        </View>
      </View>
      <View style={styles.stackWrap}>
        <SwipeStack
          profiles={profiles}
          likesRemaining={likesRemaining}
          onSwipeLeft={handleSwipeLeft}
          onSwipeRight={handleSwipeRight}
          onOutOfLikes={showOutOfLikesModal}
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
    justifyContent: 'space-between',
    paddingTop: 52,
    paddingBottom: 16,
    paddingHorizontal: 24,
    borderBottomWidth: 3,
    borderBottomColor: theme.green,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerIcon: {
    width: 48,
    height: 48,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
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
  headerIconFa: {
    marginRight: 0,
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  logo: {
    fontSize: 32,
    fontWeight: '800',
    color: theme.gold,
    letterSpacing: 2,
    textShadowColor: theme.blue,
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  tagline: {
    fontSize: 14,
    color: theme.textSecondary,
    marginTop: 4,
    letterSpacing: 1,
  },
  stackWrap: {
    flex: 1,
    paddingTop: 24,
    paddingHorizontal: 20,
    paddingBottom: 100,
    overflow: 'visible',
  },
});
