import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { G, Path } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import Slider from '@react-native-community/slider';

const segments = {
  health: {
    color: '#FF0000',
    isActive: false,
    value: 10,
  },
  career: {
    color: '#00FF00',
    isActive: false,
    value: 5,
  },
  finance: {
    color: '#0000FF',
    isActive: false,
    value: 6.5,
  },
  family: {
    color: '#FFFF00',
    isActive: false,
    value: 7.5,
  },
  friends: {
    color: '#FF00FF',
    isActive: false,
    value: 10,
  },
  hobbies: {
    color: '#00FFFF',
    isActive: false,
    value: 9.3,
  },
  personalGrowth: {
    color: '#FFA500',
    isActive: false,
    value: 8.4,
  },
  romance: {
    color: '#800080',
    isActive: false,
    value: 7.4,
  },
};

const ACTIVE_SEGMENT_ADJUSTMENT = 20;
const WHEEL_RADIUS = 150;
const EXTRA_PADDING = 30;

interface PieSegmentProps {
  startAngle: number;
  endAngle: number;
  radius: number;
  color: string;
  onPress: () => void;
  multiplier: number;
  isActive: boolean;
}

const AnimatedPath = Animated.createAnimatedComponent(Path);

const PieSegment: React.FC<PieSegmentProps> = ({
  startAngle,
  endAngle,
  radius,
  color,
  onPress,
  multiplier,
  isActive,
}) => {
  const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';

  const midAngle = (startAngle + endAngle) / 2;
  const sharedMultiplier = useSharedValue(1);
  const adjustment = useSharedValue(0);
  const animatedColor = useSharedValue(color);

  const animatedProps = useAnimatedProps(() => {
    sharedMultiplier.value = withTiming(multiplier, { duration: 250 });
    adjustment.value = withSpring(isActive ? ACTIVE_SEGMENT_ADJUSTMENT : 0, {
      stiffness: 100,
      damping: 50,
    });
    const adjustedRadius = radius * sharedMultiplier.value / 10;

    const moveX = adjustment.value * Math.cos((Math.PI * midAngle) / 180);
    const moveY = adjustment.value * Math.sin((Math.PI * midAngle) / 180);

    const x1 =
      radius + adjustedRadius * Math.cos((Math.PI * startAngle) / 180) + moveX;
    const y1 =
      radius + adjustedRadius * Math.sin((Math.PI * startAngle) / 180) + moveY;
    const x2 =
      radius + adjustedRadius * Math.cos((Math.PI * endAngle) / 180) + moveX;
    const y2 =
      radius + adjustedRadius * Math.sin((Math.PI * endAngle) / 180) + moveY;

    const pathData = [
      `M${radius + moveX},${radius + moveY}`,
      `L${x1},${y1}`,
      `A${adjustedRadius},${adjustedRadius} 0 ${largeArcFlag} 1 ${x2},${y2}`,
      'Z',
    ].join(' ');

    return { d: pathData };
  });

  const animatedWrapperProps = useAnimatedProps(() => {
    const maxRadius = radius;

    const moveX = adjustment.value * Math.cos((Math.PI * midAngle) / 180);
    const moveY = adjustment.value * Math.sin((Math.PI * midAngle) / 180);

    const x1Wrapper =
      radius + maxRadius * Math.cos((Math.PI * startAngle) / 180) + moveX;
    const y1Wrapper =
      radius + maxRadius * Math.sin((Math.PI * startAngle) / 180) + moveY;
    const x2Wrapper =
      radius + maxRadius * Math.cos((Math.PI * endAngle) / 180) + moveX;
    const y2Wrapper =
      radius + maxRadius * Math.sin((Math.PI * endAngle) / 180) + moveY;

    const wrapperPathData = [
      `M${radius + moveX},${radius + moveY}`,
      `L${x1Wrapper},${y1Wrapper}`,
      `A${maxRadius},${maxRadius} 0 ${largeArcFlag} 1 ${x2Wrapper},${y2Wrapper}`,
      'Z',
    ].join(' ');

    return { d: wrapperPathData };
  });

  return (
    <>
      <AnimatedPath animatedProps={animatedProps} fill={animatedColor.value} />
      <AnimatedPath
        animatedProps={animatedWrapperProps}
        fill="transparent"
        onPress={onPress}
      />
    </>
  );
};

const PieChart: React.FC = () => {
  const [selectedSegment, setSelectedSegment] = useState<
    keyof typeof segments | null
  >(null);
  const [segmentMultipliers, setSegmentMultipliers] = useState<
    Record<keyof typeof segments, number>
  >(
    Object.entries(segments).reduce(
      (acc: Record<keyof typeof segments, number>, [key, value]) => {
        acc[key as keyof typeof segments] = value.value;
        return acc;
      },
      {} as Record<keyof typeof segments, number>
    )
  );

  const segmentAngle = 360 / Object.values(segments).length;

  const handlePress = (name: keyof typeof segments) => {
    if (selectedSegment === name) {
      segments[name].isActive = false;
      setSelectedSegment(null);
    } else {
      if (selectedSegment !== null) {
        segments[selectedSegment].isActive = false;
      }

      segments[name].isActive = true;
      setSelectedSegment(name);
    }
  };

  return (
    <>
      <View>
        <Svg
          width={(WHEEL_RADIUS + EXTRA_PADDING) * 2}
          height={(WHEEL_RADIUS + EXTRA_PADDING) * 2}
        >
          <G x={EXTRA_PADDING} y={EXTRA_PADDING}>
            {Object.entries(segments).map(([key, value], index) => {
              const startAngle = index * segmentAngle;
              const endAngle = (index + 1) * segmentAngle;

              return (
                <PieSegment
                  key={key}
                  startAngle={startAngle}
                  endAngle={endAngle}
                  radius={WHEEL_RADIUS}
                  color={value.color}
                  onPress={() => handlePress(key as keyof typeof segments)}
                  multiplier={segmentMultipliers[key as keyof typeof segments]}
                  isActive={value.isActive}
                />
              );
            })}
          </G>
        </Svg>
      </View>
      {selectedSegment !== null && (
        <Animated.View>
          <Animated.Text
            style={{ textAlign: 'center', fontSize: 24, fontWeight: 500 }}
          >
            {(segmentMultipliers[selectedSegment]).toPrecision(2)}
          </Animated.Text>
          <Slider
            style={styles.slider}
            minimumValue={1}
            maximumValue={10}
            step={0.1}
            tapToSeek
            minimumTrackTintColor={segments[selectedSegment].color}
            maximumTrackTintColor={'#123456'}
            value={segmentMultipliers[selectedSegment]}
            onValueChange={value =>
              setSegmentMultipliers({
                ...segmentMultipliers,
                [selectedSegment]: value,
              })
            }
          />
        </Animated.View>
      )}
    </>
  );
};

export default PieChart;

const styles = StyleSheet.create({
  slider: {
    width: 300,
    opacity: 1,
    marginTop: 10,
  },
});
