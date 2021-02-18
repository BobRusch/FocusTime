import React, { useState } from 'react';
import { Text, View, StyleSheet, Vibration, Platform } from 'react-native';
import { ProgressBar } from 'react-native-paper';

import { fontSizes, spacing } from '../../utils/sizes';
import { colors } from '../../utils/colors';
import { RoundedButton } from '../../components/RoundedButton';
import { CountDown } from '../../components/CountDown';
import { Timing } from './Timing';

export const Timer = ({ focusSubject, onTimerEnd, clearSubject }) => {
  const DEFAULT_TIME = 1;
  const [isStarted, setIsStarted] = useState(false);
  const [progress, setProgress] = useState(1);
  const [minutes, setMinutes] = useState(DEFAULT_TIME);

  const changeTime = (min) => () => {
    setProgress(1);
    setIsStarted(false);
    setMinutes(min);
  };

  const onEnd = () => {
    vibrate();
    setProgress(1);
    setIsStarted(false);
    setMinutes(DEFAULT_TIME);
    onTimerEnd();
  };

  const onProgress = (progress) => {
    setProgress(progress);
  };

  const vibrate = () => {
    if (Platform.OS === 'ios') {
      const interval = setInterval(() => Vibration.vibrate(), 1000);
      setTimeout(() => clearInterval(interval), 10000);
    } else {
      Vibration.vibrate(10000);
    }
  };

  return (
    <View style={[styles.container]}>
      <View style={styles.countdown}>
        <CountDown
          minutes={minutes}
          isPaused={!isStarted}
          onProgress={onProgress}
          onEnd={onEnd}
        />
      </View>
      <View style={{ paddingTop: spacing.xxl }}>
        <Text style={styles.title}>Focusing on:</Text>
        <Text style={styles.task}>{focusSubject}</Text>
        <View style={{ paddingTop: spacing.sm }}>
          <ProgressBar
            progress={progress}
            color={colors.royalBlue}
            style={{ height: 10 }}
          />
        </View>
      </View>
      <View style={styles.buttonWrapper()}>
        <Timing changeTime={changeTime} />
      </View>
      <View style={styles.buttonWrapper({ flex: 0.3 })}>
        {!isStarted ? (
          <RoundedButton title="start" onPress={() => setIsStarted(true)} />
        ) : (
          <RoundedButton title="pause" onPress={() => setIsStarted(false)} />
        )}
      </View>
      <View style={styles.clearSubject}>
        <RoundedButton title="-" size={50} onPress={clearSubject} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.darkBlue,
    flex: 1,
  },
  countdown: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: colors.white,
    textAlign: 'center',
  },
  task: {
    color: colors.white,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  countdown: {
    flex: 0.5,
    alignItems: 'center',
  },
  buttonWrapper: ({
    flex = 0.15,
    padding = 15,
    justifyContent = 'center',
  } = {}) => ({
    flex,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent,
    padding,
  }),
  clearSubject: {
    paddingBottom: 25,
    paddingLeft: 25,
  },
});
