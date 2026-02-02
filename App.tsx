import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { useCallback, useState } from 'react';
import { SwipeStack } from './src/components/SwipeStack';
import { Profile } from './src/types/profile';
import { MOCK_PROFILES } from './src/data/mockProfiles';
import { theme } from './src/theme';

export default function App() {
  const [profiles] = useState(() => [...MOCK_PROFILES]);

  const handleSwipeLeft = useCallback((profile: Profile) => {
    console.log('Nope:', profile.name);
  }, []);

  const handleSwipeRight = useCallback((profile: Profile) => {
    console.log('Like:', profile.name);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <Text style={styles.logo}>Carnival</Text>
        <Text style={styles.tagline}>Swipe under the sequins</Text>
      </View>
      <View style={styles.stackWrap}>
        <SwipeStack
          profiles={profiles}
          onSwipeLeft={handleSwipeLeft}
          onSwipeRight={handleSwipeRight}
        />
      </View>
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
    borderBottomWidth: 2,
    borderBottomColor: theme.gold,
  },
  logo: {
    fontSize: 32,
    fontWeight: '800',
    color: theme.gold,
    letterSpacing: 2,
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
