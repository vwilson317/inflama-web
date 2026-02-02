import { StatusBar } from 'expo-status-bar';
import { Image } from 'expo-image';
import { StyleSheet, Text, View } from 'react-native';
import { useCallback, useState } from 'react';
import { SwipeStack } from './src/components/SwipeStack';
import { MatchModal } from './src/components/MatchModal';
import { Profile } from './src/types/profile';
import { MOCK_PROFILES } from './src/data/mockProfiles';
import { theme } from './src/theme';

export default function App() {
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
        <Image
          source={require('./assets/app-icon-v2.png')}
          style={styles.headerIcon}
          contentFit="contain"
        />
        <Text style={styles.logo}>Inflama</Text>
        <Text style={styles.tagline}>Swipe under the sequins</Text>
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
    paddingTop: 52,
    paddingBottom: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    borderBottomWidth: 3,
    borderBottomColor: theme.green,
  },
  headerIcon: {
    width: 48,
    height: 48,
    marginBottom: 8,
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
