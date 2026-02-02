import React, { useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  PanResponder,
  Dimensions,
  Text,
  TouchableOpacity,
} from 'react-native';
import { Profile } from '../types/profile';
import { ProfileCard } from './ProfileCard';
import { theme } from '../theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.25;
const SWIPE_OUT_DURATION = 200;

interface SwipeStackProps {
  profiles: Profile[];
  onSwipeLeft?: (profile: Profile) => void;
  onSwipeRight?: (profile: Profile) => void;
}

export function SwipeStack({
  profiles,
  onSwipeLeft,
  onSwipeRight,
}: SwipeStackProps) {
  const [index, setIndex] = useState(0);
  const translateX = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  const rotate = useRef(new Animated.Value(0)).current;

  const currentProfile = profiles[index];

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dx) > 10,
      onPanResponderMove: (_, gestureState) => {
        translateX.setValue(gestureState.dx);
        translateY.setValue(gestureState.dy * 0.3);
        rotate.setValue(gestureState.dx * 0.02);
      },
      onPanResponderRelease: (_, gestureState) => {
        const { dx, vx } = gestureState;
        const shouldSwipeLeft = dx < -SWIPE_THRESHOLD || vx < -0.5;
        const shouldSwipeRight = dx > SWIPE_THRESHOLD || vx > 0.5;

        if (shouldSwipeLeft || shouldSwipeRight) {
          const toValue = shouldSwipeLeft ? -SCREEN_WIDTH * 1.2 : SCREEN_WIDTH * 1.2;
          Animated.parallel([
            Animated.timing(translateX, {
              toValue,
              duration: SWIPE_OUT_DURATION,
              useNativeDriver: true,
            }),
            Animated.timing(rotate, {
              toValue: shouldSwipeLeft ? -0.4 : 0.4,
              duration: SWIPE_OUT_DURATION,
              useNativeDriver: true,
            }),
          ]).start(() => {
            if (currentProfile) {
              if (shouldSwipeLeft) onSwipeLeft?.(currentProfile);
              else onSwipeRight?.(currentProfile);
            }
            translateX.setValue(0);
            translateY.setValue(0);
            rotate.setValue(0);
            setIndex((i) => Math.min(i + 1, profiles.length));
          });
        } else {
          Animated.spring(translateX, {
            toValue: 0,
            useNativeDriver: true,
            friction: 8,
            tension: 80,
          }).start();
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
            friction: 8,
            tension: 80,
          }).start();
          Animated.spring(rotate, {
            toValue: 0,
            useNativeDriver: true,
            friction: 8,
            tension: 80,
          }).start();
        }
      },
    })
  ).current;

  const topCardStyle = {
    transform: [
      { translateX },
      { translateY },
      {
        rotate: rotate.interpolate({
          inputRange: [-1, 1],
          outputRange: ['-15deg', '15deg'],
        }),
      },
    ],
  };

  const nextCardScale = translateX.interpolate({
    inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
    outputRange: [0.92, 0.92, 0.92],
  });

  const nextCardOpacity = translateX.interpolate({
    inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
    outputRange: [1, 1, 1],
  });

  const handleSwipeLeft = () => {
    if (!currentProfile) return;
    Animated.timing(translateX, {
      toValue: -SCREEN_WIDTH * 1.2,
      duration: SWIPE_OUT_DURATION,
      useNativeDriver: true,
    }).start(() => {
      onSwipeLeft?.(currentProfile);
      translateX.setValue(0);
      translateY.setValue(0);
      rotate.setValue(0);
      setIndex((i) => Math.min(i + 1, profiles.length));
    });
  };

  const handleSwipeRight = () => {
    if (!currentProfile) return;
    Animated.timing(translateX, {
      toValue: SCREEN_WIDTH * 1.2,
      duration: SWIPE_OUT_DURATION,
      useNativeDriver: true,
    }).start(() => {
      onSwipeRight?.(currentProfile);
      translateX.setValue(0);
      translateY.setValue(0);
      rotate.setValue(0);
      setIndex((i) => Math.min(i + 1, profiles.length));
    });
  };

  const handleSuperLike = () => {
    // Super like - same as right swipe but could have different handling
    handleSwipeRight();
  };

  if (!currentProfile) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>No more profiles</Text>
        <Text style={styles.emptySub}>Flame went out — check back later!</Text>
      </View>
    );
  }

  return (
    <View style={styles.wrapper}>
      {/* Card area */}
      <View style={styles.container}>
        {/* Back cards (next in stack) */}
        {index + 1 < profiles.length && (
          <Animated.View
            style={[
              styles.cardContainer,
              styles.backCard,
              {
                transform: [{ scale: nextCardScale }],
                opacity: nextCardOpacity,
              },
            ]}
            pointerEvents="none"
          >
            <ProfileCard profile={profiles[index + 1]} />
          </Animated.View>
        )}
        {index + 2 < profiles.length && (
          <View style={[styles.cardContainer, styles.backCard2]} pointerEvents="none">
            <ProfileCard profile={profiles[index + 2]} />
          </View>
        )}

        {/* Top draggable card */}
        <Animated.View
          style={[styles.cardContainer, styles.topCard, topCardStyle]}
          {...panResponder.panHandlers}
        >
          <ProfileCard profile={currentProfile} />
        </Animated.View>

      </View>

      {/* Action buttons */}
      <View style={styles.actionRow}>
        <TouchableOpacity style={[styles.actionButton, styles.passButton]} onPress={handleSwipeLeft}>
          <View style={styles.xIcon}>
            <View style={[styles.xLine, styles.xLine1]} />
            <View style={[styles.xLine, styles.xLine2]} />
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionButton, styles.superButton]} onPress={handleSuperLike}>
          <View style={styles.starIcon}>
            <Text style={styles.starText}>★</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionButton, styles.kissButton]} onPress={handleSwipeRight}>
          <View style={styles.lipsIcon}>
            <View style={styles.lipTop} />
            <View style={styles.lipBottom} />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  cardContainer: {
    position: 'absolute',
    width: '100%',
    maxWidth: 360,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topCard: {
    zIndex: 3,
  },
  backCard: {
    zIndex: 2,
    top: 24,
    transform: [{ scale: 0.92 }],
  },
  backCard2: {
    zIndex: 1,
    top: 48,
    opacity: 0.9,
    transform: [{ scale: 0.84 }],
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  emptyText: {
    fontSize: 24,
    fontWeight: '800',
    color: theme.gold,
    marginBottom: 8,
  },
  emptySub: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.85)',
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 24,
    paddingVertical: 20,
  },
  actionButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  passButton: {
    backgroundColor: '#1a1a2e',
    borderWidth: 3,
    borderColor: theme.blue,
  },
  superButton: {
    backgroundColor: '#1a1a2e',
    borderWidth: 3,
    borderColor: theme.gold,
  },
  kissButton: {
    backgroundColor: '#1a1a2e',
    borderWidth: 3,
    borderColor: theme.green,
  },
  xIcon: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  xLine: {
    position: 'absolute',
    width: 28,
    height: 4,
    backgroundColor: theme.blue,
    borderRadius: 2,
  },
  xLine1: {
    transform: [{ rotate: '45deg' }],
  },
  xLine2: {
    transform: [{ rotate: '-45deg' }],
  },
  starIcon: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  starText: {
    fontSize: 32,
    color: theme.gold,
    lineHeight: 36,
  },
  lipsIcon: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  lipTop: {
    width: 24,
    height: 12,
    backgroundColor: theme.green,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    marginBottom: -2,
  },
  lipBottom: {
    width: 20,
    height: 10,
    backgroundColor: theme.green,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
});
