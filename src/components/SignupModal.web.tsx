import React from 'react';
import { View, Text, StyleSheet, TouchableWithoutFeedback, TouchableOpacity } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faLock } from '@fortawesome/free-solid-svg-icons';
import type { IconProp } from '@fortawesome/fontawesome-svg-core';
import { theme } from '../theme';

interface SignupModalProps {
  visible: boolean;
  onClose: () => void;
  onSignUp?: () => void;
}

// Pixel-based centering so layout isn't delayed by reflows (RN doesn't support % in transform)
const CONTENT_WIDTH = 340;
const CONTENT_HEIGHT = 320;

export function SignupModal({ visible, onClose, onSignUp }: SignupModalProps) {
  if (!visible) return null;

  const handleSignUp = () => {
    if (onSignUp) {
      onSignUp();
      return;
    }
    onClose();
  };

  return (
    <View style={styles.overlay}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.backdrop} />
      </TouchableWithoutFeedback>
      <View style={styles.content}>
        <View style={styles.iconWrap}>
          <FontAwesomeIcon icon={faLock as IconProp} size={28} color={theme.blue} />
        </View>
        <Text style={styles.title}>Sign up to keep matching</Text>
        <Text style={styles.subtitle}>You won't see their response unless you sign up.</Text>
        <TouchableOpacity style={styles.signupButton} onPress={handleSignUp} activeOpacity={0.9}>
          <Text style={styles.signupButtonText}>Sign up</Text>
        </TouchableOpacity>
        <Text style={styles.tapHint}>Tap anywhere to continue</Text>
      </View>
    </View>
  );
}

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
  backdrop: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
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
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,39,118,0.18)',
    marginBottom: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: theme.gold,
    marginBottom: 12,
    textAlign: 'center',
    textShadowColor: theme.blue,
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 16,
    color: theme.textPrimary,
    opacity: 0.95,
    textAlign: 'center',
  },
  signupButton: {
    marginTop: 24,
    paddingHorizontal: 26,
    paddingVertical: 12,
    borderRadius: 24,
    backgroundColor: theme.blue,
  },
  signupButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.white,
  },
  tapHint: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 20,
  },
});
