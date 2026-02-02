import React, { useState, useEffect, useRef } from 'react';
import { Platform, StyleSheet, Text, View, Animated } from 'react-native';
import { Image } from 'expo-image';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import type { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faCircleCheck } from '../icons/fontAwesome';
import { Profile } from '../types/profile';
import { getFlagEmoji } from '../utils/flags';
import { getCountdownText, isLeavingInLessThan24Hours } from '../utils/countdown';
import { theme } from '../theme';

interface ProfileCardProps {
  profile: Profile;
  style?: object;
}

export function ProfileCard({ profile, style }: ProfileCardProps) {
  const isLiving = profile.livingInLocation === true;
  const [countdown, setCountdown] = useState(() =>
    isLiving ? '' : getCountdownText(profile.leavingAt)
  );
  const [isLeavingSoon, setIsLeavingSoon] = useState(
    () => !isLiving && profile.leavingAt != null && isLeavingInLessThan24Hours(profile.leavingAt)
  );
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const flag = getFlagEmoji(profile.countryCode);

  useEffect(() => {
    if (isLiving) return;
    const tick = () => {
      const at = profile.leavingAt as Date;
      setCountdown(getCountdownText(at));
      setIsLeavingSoon(isLeavingInLessThan24Hours(at));
    };
    tick();
    const interval = setInterval(tick, 60_000);
    return () => clearInterval(interval);
  }, [isLiving, profile.leavingAt]);

  useEffect(() => {
    if (!isLeavingSoon) return;
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 0.75,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, [isLeavingSoon, pulseAnim]);

  return (
    <View style={[styles.card, style]}>
      <View style={styles.imageWrap}>
        <Image
          source={{ uri: profile.imageUri }}
          style={styles.image}
          contentFit="cover"
        />
        <View style={styles.verifiedWrap}>
          <FontAwesomeIcon
            icon={faCircleCheck as IconProp}
            size={16}
            color="#1DA1F2"
          />
          <Text style={styles.verifiedText}>Verified</Text>
        </View>
      </View>
      <View style={styles.info}>
        <View style={styles.row}>
          <Text style={styles.name}>
            {profile.name}, {profile.age}
          </Text>
          <Text style={styles.flag}>{flag}</Text>
        </View>
        <View style={styles.locationRow}>
          <Text style={styles.location}>📍 {profile.currentLocation}</Text>
        </View>
        <Animated.View
          style={[
            styles.countdownWrap,
            isLiving && styles.countdownWrapLiving,
            isLeavingSoon && styles.countdownWrapUrgent,
            isLeavingSoon && { opacity: pulseAnim },
          ]}
        >
          <Text style={[styles.countdown, isLeavingSoon && styles.countdownUrgent]}>
            {isLiving ? 'Lives here' : countdown}
          </Text>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    maxWidth: 360,
    aspectRatio: 3 / 4,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: theme.cardBg,
    ...theme.shadow,
  },
  imageWrap: {
    flex: 1,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  info: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingTop: 48,
    backgroundColor: 'rgba(0,0,0,0.55)',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  name: {
    fontSize: 26,
    fontWeight: '800',
    color: '#ffffff',
  },
  verifiedWrap: {
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },
  verifiedText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#ffffff',
  },
  flag: {
    fontSize: 28,
    fontFamily: Platform.OS === 'web' ? '"Twemoji Country Flags", sans-serif' : undefined,
  },
  locationRow: {
    marginTop: 4,
  },
  location: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
  },
  countdownWrap: {
    marginTop: 8,
    alignSelf: 'flex-start',
    backgroundColor: theme.gold,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  countdownWrapLiving: {
    backgroundColor: theme.green,
  },
  countdownWrapUrgent: {
    backgroundColor: 'rgba(220, 53, 69, 0.75)',
  },
  countdown: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.textPrimary,
  },
  countdownUrgent: {
    color: '#ffffff',
  },
});
