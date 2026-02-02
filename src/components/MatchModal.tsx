import React, { useEffect, useRef } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  TouchableWithoutFeedback,
} from 'react-native';
import { theme } from '../theme';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Carnival palette: green, gold, blue + pink/magenta
const CONFETTI_COLORS = [
  theme.green,
  theme.gold,
  theme.blue,
  '#e91e63',
  '#9c27b0',
  '#ff5722',
  '#00bcd4',
];

const CONFETTI_COUNT = 55;

interface MatchModalProps {
  visible: boolean;
  onClose: () => void;
  matchedName?: string;
}

function useConfetti(active: boolean) {
  const particles = useRef(
    Array.from({ length: CONFETTI_COUNT }, () => {
      const duration = 2000 + Math.random() * 1500;
      return {
        leftPos: Math.random() * SCREEN_WIDTH,
        translateY: new Animated.Value(0),
        rotate: new Animated.Value(0),
        delay: Math.random() * 400,
        duration,
        rotateEnd: 3 + Math.random() * 4,
        color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
        size: 8 + Math.random() * 12,
        shape: Math.random() > 0.5 ? 'rect' : 'circle',
      };
    })
  ).current;

  useEffect(() => {
    if (!active) return;
    particles.forEach((p) => {
      p.translateY.setValue(0);
      p.rotate.setValue(0);
    });
    const animations = particles.map((p) => {
      const fallAnim = Animated.timing(p.translateY, {
        toValue: SCREEN_HEIGHT + 50,
        duration: p.duration,
        useNativeDriver: true,
      });
      const rotateAnim = Animated.timing(p.rotate, {
        toValue: 1,
        duration: p.duration,
        useNativeDriver: true,
      });
      return Animated.delay(
        p.delay,
        Animated.parallel([fallAnim, rotateAnim])
      );
    });
    Animated.stagger(0, animations).start();
  }, [active]);

  return particles;
}

export function MatchModal({
  visible,
  onClose,
  matchedName,
}: MatchModalProps) {
  const kissOpacity = useRef(new Animated.Value(0)).current;
  const kissScale = useRef(new Animated.Value(0.8)).current;
  const particles = useConfetti(visible);

  useEffect(() => {
    if (!visible) return;
    kissOpacity.setValue(0);
    kissScale.setValue(0.8);

    const fadeIn = Animated.timing(kissOpacity, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    });
    const scaleIn = Animated.spring(kissScale, {
      toValue: 1,
      useNativeDriver: true,
      friction: 6,
      tension: 80,
    });
    const fadeOut = Animated.timing(kissOpacity, {
      toValue: 0.3,
      duration: 500,
      useNativeDriver: true,
    });
    const fadeInAgain = Animated.timing(kissOpacity, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    });
    const fadeOutAgain = Animated.timing(kissOpacity, {
      toValue: 0.4,
      duration: 500,
      useNativeDriver: true,
    });

    const loop = Animated.loop(
      Animated.sequence([
        Animated.parallel([fadeIn, scaleIn]),
        Animated.delay(200),
        fadeOut,
        Animated.delay(150),
        fadeInAgain,
        Animated.delay(200),
        fadeOutAgain,
        Animated.delay(300),
      ]),
      { iterations: 2 }
    );
    loop.start();
    return () => loop.stop();
  }, [visible]);

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          {/* Confetti layer - overflow visible so falling particles aren't clipped */}
          <View style={styles.confettiLayer} pointerEvents="none">
            {particles.map((p, i) => (
              <Animated.View
                key={i}
                style={[
                  styles.confetti,
                  {
                    left: p.leftPos,
                    width: p.size,
                    height: p.shape === 'rect' ? p.size * 1.4 : p.size,
                    borderRadius: p.shape === 'circle' ? p.size / 2 : 2,
                    backgroundColor: p.color,
                    transform: [
                      { translateY: p.translateY },
                      {
                        rotate: p.rotate.interpolate({
                          inputRange: [0, 1],
                          outputRange: ['0deg', `${p.rotateEnd * 360}deg`],
                        }),
                      },
                    ],
                  },
                ]}
              />
            ))}
          </View>

          {/* Content */}
          <View style={styles.content} pointerEvents="box-none">
            <Text style={styles.title}>It's a match!</Text>
            {matchedName ? (
              <Text style={styles.subtitle}>You and {matchedName} liked each other</Text>
            ) : null}
            <Animated.View
              style={[
                styles.kissWrap,
                {
                  opacity: kissOpacity,
                  transform: [{ scale: kissScale }],
                },
              ]}
            >
              <Text style={styles.kiss}>💋</Text>
            </Animated.View>
            <Text style={styles.tapHint}>Tap anywhere to continue</Text>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    position: 'relative',
    width: SCREEN_WIDTH,
    minHeight: SCREEN_HEIGHT,
    backgroundColor: 'rgba(0,0,0,0.75)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  confettiLayer: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
    overflow: 'visible',
  },
  content: {
    zIndex: 2,
    alignItems: 'center',
    paddingHorizontal: 32,
    position: 'relative',
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: theme.gold,
    marginBottom: 8,
    textShadowColor: theme.blue,
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 18,
    color: theme.textPrimary,
    marginBottom: 24,
    opacity: 0.95,
  },
  kissWrap: {
    marginVertical: 16,
  },
  kiss: {
    fontSize: 100,
    textAlign: 'center',
  },
  tapHint: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 16,
  },
  confetti: {
    position: 'absolute',
    top: -30,
  },
});
