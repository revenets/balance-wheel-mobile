import { Sector } from '@app/components';
import { ANGLES, DATA } from '@app/constants';
import React from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import { G, Svg } from 'react-native-svg';

const { width } = Dimensions.get('window');
const size = width * 0.8;
const center = size / 2;
const strokeWidth = 2;
const radius = center - strokeWidth;

const WheelOfLife = () => {
  return (
    <View style={styles.container}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <G>
          {ANGLES.map((angle, index) => (
            <Sector
              key={index}
              center={center}
              radius={radius}
              startAngle={angle}
              endAngle={angle + 45}
              value={DATA[index]?.value ?? 0}
              color={DATA[index]?.color ?? 'transparent'}
            />
          ))}
        </G>
      </Svg>
    </View>
  );
};

export default WheelOfLife;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
