import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableWithoutFeedback,
} from 'react-native';
import { theme } from '../theme';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface OutOfLikesModalProps {
  visible: boolean;
  onClose: () => void;
}

export function OutOfLikesModal({ visible, onClose }: OutOfLikesModalProps) {
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
          <View style={styles.content} pointerEvents="box-none">
            <View style={styles.iconWrap}>
              <Text style={styles.emoji}>😢</Text>
            </View>
            <Text style={styles.title}>You're out of likes</Text>
            <Text style={styles.subtitle}>They refresh in 12 hours.</Text>
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
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 32,
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
