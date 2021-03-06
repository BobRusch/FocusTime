import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { TextInput } from 'react-native-paper';
import { useKeepAwake } from 'expo-keep-awake';

import { fontSizes, spacing } from '../utils/sizes';
import { colors } from '../utils/colors';

const minutesToMilli = (min) => min * 1000 * 60;

const formatTime = (time) => (time < 10 ? `0${time}` : time);

export const CountDown = ({ minutes = 20, isPaused, onProgress, onEnd }) => {
  useKeepAwake();

  const [millis, setMillis] = useState(null);

  const minute = Math.floor(millis / 1000 / 60) % 60;
  const seconds = Math.floor(millis / 1000) % 60;

  const internal = React.useRef(null);

  const countDown = () => {
    setMillis((time) => {
      if (time === 0) {
        clearInterval(internal.current);
        return time;
      }
      const timeLeft = time - 1000;

      return timeLeft;
    });
  };

  useEffect(() => {
    if (millis === 0) {
      onEnd();
    }
    onProgress(millis / minutesToMilli(minutes));
    console.log(millis);
  }, [millis]);

  useEffect(() => {
    if (isPaused) return;
    internal.current = setInterval(countDown, 1000);

    return () => clearInterval(internal.current);
  }, [isPaused]);

  useEffect(() => {
    setMillis(minutesToMilli(minutes));
  }, [minutes]);

  return (
    <Text style={styles.text}>
      {formatTime(minute)}:{formatTime(seconds)}
    </Text>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: fontSizes.xxl,
    fontWeight: 'bold',
    color: colors.white,
    padding: spacing.lg,
    backgroundColor: colors.mediumBlue,
  },
});
