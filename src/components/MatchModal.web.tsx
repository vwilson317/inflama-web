import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faInstagram } from '@fortawesome/free-brands-svg-icons';
import confetti from 'canvas-confetti';
import { theme } from '../theme';

interface MatchModalProps {
  visible: boolean;
  onClose: () => void;
  matchedName?: string;
  /** Instagram username (no @). Opens instagram.com on web, app on mobile when available. */
  matchedInstagram?: string;
}

function openInstagram(username: string) {
  const clean = username.replace(/^@/, '').trim();
  if (!clean) return;
  const url = `https://instagram.com/${encodeURIComponent(clean)}`;
  Linking.openURL(url);
}

// Carnival colors for canvas-confetti (hex without #)
const CONFETTI_COLORS = [
  theme.green,
  theme.gold,
  theme.blue,
  '#e91e63',
  '#9c27b0',
  '#ff5722',
  '#00bcd4',
];

export function MatchModal({
  visible,
  onClose,
  matchedName,
  matchedInstagram,
}: MatchModalProps) {
  const kissOpacity = useRef(new Animated.Value(0)).current;
  const kissScale = useRef(new Animated.Value(0.8)).current;
  const confettiFired = useRef(false);

  useEffect(() => {
    if (!visible) {
      confettiFired.current = false;
      return;
    }
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

  // Fire carnival confetti when modal opens (web only)
  useEffect(() => {
    if (!visible || confettiFired.current) return;
    confettiFired.current = true;

    const duration = 3500;
    const end = Date.now() + duration;
    let lastBurst = 0;
    const burstInterval = 120;

    const frame = () => {
      const now = Date.now();
      if (now < end && now - lastBurst >= burstInterval) {
        lastBurst = now;
        confetti({
          particleCount: 4,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: CONFETTI_COLORS,
        });
        confetti({
          particleCount: 4,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: CONFETTI_COLORS,
        });
      }
      if (now < end) {
        requestAnimationFrame(frame);
      }
    };
    requestAnimationFrame(frame);
  }, [visible]);

  if (!visible) return null;

  // Web: fixed overlay (no Modal) so it displays reliably; canvas-confetti for confetti
  return (
    <TouchableWithoutFeedback onPress={onClose}>
      <View style={styles.overlay}>
        <View style={styles.content} pointerEvents="box-none">
          <Text style={styles.title}>It's a match!</Text>
          {matchedName ? (
            <Text style={styles.subtitle}>
              You and {matchedName} liked each other
            </Text>
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
          {matchedInstagram ? (
            <TouchableOpacity
              style={styles.instagramButton}
              onPress={() => openInstagram(matchedInstagram)}
              activeOpacity={0.8}
            >
              <FontAwesomeIcon icon={faInstagram} size={22} color="#fff" />
              <Text style={styles.instagramText}>@{matchedInstagram.replace(/^@/, '')}</Text>
            </TouchableOpacity>
          ) : null}
          <Text style={styles.tapHint}>Tap anywhere to continue</Text>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'fixed',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 32,
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
  instagramButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginTop: 16,
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(225,48,108,0.9)',
    borderRadius: 24,
  },
  instagramText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});
