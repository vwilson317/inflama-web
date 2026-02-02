import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
} from 'react-native';
import { theme } from '../theme';

interface OutOfLikesModalProps {
  visible: boolean;
  onClose: () => void;
}

export function OutOfLikesModal({ visible, onClose }: OutOfLikesModalProps) {
  if (!visible) return null;

  return (
    <TouchableWithoutFeedback onPress={onClose}>
      <View style={styles.overlay}>
        <View style={styles.content}>
          <View style={styles.iconWrap}>
            <Text style={styles.emoji}>😢</Text>
          </View>
          <Text style={styles.title}>You're out of likes</Text>
          <Text style={styles.subtitle}>They refresh in 12 hours.</Text>
          <Text style={styles.tapHint}>Tap anywhere to continue</Text>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

// Pixel-based centering so layout isn't delayed by confetti reflows (RN doesn't support % in transform)
const CONTENT_WIDTH = 320;
const CONTENT_HEIGHT = 280;

const styles = StyleSheet.create({
  overlay: {
    position: 'fixed',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    minHeight: '100vh',
    backgroundColor: 'rgba(0,0,0,0.85)',
    zIndex: 10000,
  },
  content: {
    position: 'absolute',
    left: '50%',
    top: '50%',
    width: CONTENT_WIDTH,
    marginLeft: -CONTENT_WIDTH / 2,
    marginTop: -CONTENT_HEIGHT / 2,
    alignItems: 'center',
    paddingHorizontal: 32,
    zIndex: 1,
  },
  iconWrap: {
    marginBottom: 24,
  },
  emoji: {
    fontSize: 64,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: theme.gold,
    marginBottom: 12,
    textAlign: 'center',
    textShadowColor: theme.blue,
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 18,
    color: theme.textPrimary,
    opacity: 0.95,
    textAlign: 'center',
  },
  tapHint: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 32,
  },
});
