import { StatusBar } from 'expo-status-bar';
import { Image } from 'expo-image';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { polyfillCountryFlagEmojis } from 'country-flag-emoji-polyfill';
import { useCallback, useEffect, useState } from 'react';
import { SwipeStack } from './src/components/SwipeStack';
import { MatchModal } from './src/components/MatchModal';
import { Profile } from './src/types/profile';
import { MOCK_PROFILES } from './src/data/mockProfiles';
import { theme } from './src/theme';

export default function App() {
  useEffect(() => {
    if (Platform.OS === 'web') {
      polyfillCountryFlagEmojis();
    }
  }, []);

  const [profiles] = useState(() => [...MOCK_PROFILES]);
  const [matchModal, setMatchModal] = useState<{ visible: boolean; name?: string }>({
    visible: false,
    name: undefined,
  });

  const handleSwipeLeft = useCallback((profile: Profile) => {
    console.log('Nope:', profile.name);
  }, []);

  const handleSwipeRight = useCallback((profile: Profile) => {
    console.log('Like:', profile.name);
    setMatchModal({ visible: true, name: profile.name });
  }, []);

  const closeMatchModal = useCallback(() => {
    setMatchModal((m) => ({ ...m, visible: false }));
  }, []);

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
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&h=80&fit=crop' }}
          style={styles.userAvatar}
          contentFit="cover"
        />
      </View>
      <View style={styles.stackWrap}>
        <SwipeStack
          profiles={profiles}
          onSwipeLeft={handleSwipeLeft}
          onSwipeRight={handleSwipeRight}
        />
      </View>
      <MatchModal
        visible={matchModal.visible}
        onClose={closeMatchModal}
        matchedName={matchModal.name}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.bgDark,
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
  },
});
