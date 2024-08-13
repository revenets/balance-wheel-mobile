import React, { useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Svg, { G, Path, Line } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import Slider from '@react-native-community/slider';
import { Ionicons } from '@expo/vector-icons';

type Segment = {
  color: string;
  isActive: boolean;
  value: number;
  icon: keyof typeof Ionicons.glyphMap;
};
type SegmentKey =
  | 'health'
  | 'career'
  | 'finance'
  | 'family'
  | 'friends'
  | 'hobbies'
  | 'personalGrowth'
  | 'romance';

const segments: Record<SegmentKey, Segment> = {
  health: {
    color: '#FF0000',
    isActive: false,
    value: 10,
    icon: 'medkit',
  },
  career: {
    color: '#00FF00',
    isActive: false,
    value: 5,
    icon: 'briefcase',
  },
  finance: {
    color: '#0000FF',
    isActive: false,
    value: 6.5,
    icon: 'cash',
  },
  family: {
    color: '#FFFF00',
    isActive: false,
    value: 7.5,
    icon: 'people',
  },
  friends: {
    color: '#FF00FF',
    isActive: false,
    value: 10,
    icon: 'person',
  },
  hobbies: {
    color: '#00FFFF',
    isActive: false,
    value: 9.3,
    icon: 'game-controller',
  },
  personalGrowth: {
    color: '#FFA500',
    isActive: false,
    value: 8.4,
    icon: 'scale',
  },
  romance: {
    color: '#800080',
    isActive: false,
    value: 7.4,
    icon: 'heart',
  },
};

type NamedMultiplier = Record<SegmentKey, number>;

const namedMultipliers = Object.entries(segments).reduce(
  (acc: NamedMultiplier, [key, value]) => {
    acc[key as SegmentKey] = value.value;
    return acc;
  },
  {} as NamedMultiplier
);

const ACTIVE_SEGMENT_ADJUSTMENT = 20;
const WHEEL_RADIUS = 100;
const EXTRA_PADDING = 30;
const SLIDER_MIN_VALUE = 1;
const SLIDER_MAX_VALUE = 10;
const ICON_SIZE = 24;

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
    const adjustedRadius = (radius * sharedMultiplier.value) / 10;

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

  useEffect(() => {
    sharedMultiplier.value = withTiming(multiplier, { duration: 250 });
    adjustment.value = withSpring(isActive ? ACTIVE_SEGMENT_ADJUSTMENT : 0, {
      stiffness: 100,
      damping: 50,
    });
  }, [sharedMultiplier, adjustment, multiplier, isActive]);

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
  const [selectedSegment, setSelectedSegment] = useState<SegmentKey | null>(
    null
  );
  const [segmentMultipliers, setSegmentMultipliers] =
    useState<NamedMultiplier>(namedMultipliers);

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
    <View style={styles.container}>
      <View>
        <Svg
          width={(WHEEL_RADIUS + EXTRA_PADDING) * 2}
          height={(WHEEL_RADIUS + EXTRA_PADDING) * 2}
        >
          <G x={EXTRA_PADDING} y={EXTRA_PADDING}>
            {Object.entries(segments).map(([key, value], index) => {
              const startAngle = index * segmentAngle;
              const endAngle = (index + 1) * segmentAngle;

              const lineX =
                WHEEL_RADIUS +
                (WHEEL_RADIUS + EXTRA_PADDING) *
                  Math.cos((Math.PI * startAngle) / 180);
              const lineY =
                WHEEL_RADIUS +
                (WHEEL_RADIUS + EXTRA_PADDING) *
                  Math.sin((Math.PI * startAngle) / 180);

              return (
                <React.Fragment key={key}>
                  <PieSegment
                    startAngle={startAngle}
                    endAngle={endAngle}
                    radius={WHEEL_RADIUS}
                    color={value.color}
                    onPress={() => handlePress(key as SegmentKey)}
                    multiplier={segmentMultipliers[key as SegmentKey]}
                    isActive={value.isActive}
                  />

                  <Line
                    x1={WHEEL_RADIUS}
                    y1={WHEEL_RADIUS}
                    x2={lineX}
                    y2={lineY}
                    stroke="#b5b5b5"
                    strokeWidth="1"
                  />
                </React.Fragment>
              );
            })}
          </G>
        </Svg>
        {Object.entries(segments).map(([key, value], index) => {
          const startAngle = index * segmentAngle;
          const endAngle = (index + 1) * segmentAngle;
          const midAngle = (startAngle + endAngle) / 2;
          const labelX =
            WHEEL_RADIUS +
            (WHEEL_RADIUS + EXTRA_PADDING + ICON_SIZE) *
              Math.cos((Math.PI * midAngle) / 180);
          const labelY =
            WHEEL_RADIUS +
            (WHEEL_RADIUS + EXTRA_PADDING + ICON_SIZE) *
              Math.sin((Math.PI * midAngle) / 180);

          return (
            <TouchableOpacity
              key={key}
              hitSlop={20}
              style={[styles.labelContainer, { top: labelY, left: labelX }]}
              onPress={() => handlePress(key as SegmentKey)}
            >
              <Ionicons
                size={ICON_SIZE}
                color={value.color}
                name={value.icon}
              />
            </TouchableOpacity>
          );
        })}
      </View>
      <Animated.View style={styles.sliderBox}>
        {selectedSegment !== null && (
          <>
            <Animated.Text
              style={{ textAlign: 'center', fontSize: 24, fontWeight: '500' }}
            >
              {segmentMultipliers[selectedSegment].toPrecision(2)}
            </Animated.Text>
            <Slider
              style={styles.slider}
              minimumValue={SLIDER_MIN_VALUE}
              maximumValue={SLIDER_MAX_VALUE}
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
          </>
        )}
      </Animated.View>
    </View>
  );
};

export default PieChart;

const styles = StyleSheet.create({
  container: {
    paddingVertical: ICON_SIZE * 2,
    width: '100%',
    alignItems: 'center',
  },
  slider: {
    width: 300,
    opacity: 1,
    marginTop: 10,
  },
  labelContainer: {
    position: 'absolute',
    transform: [{ translateX: ICON_SIZE / 2 }, { translateY: ICON_SIZE / 2 }],
    zIndex: 100,
  },
  sliderBox: {
    marginTop: 50,
    height: 50,
  },
});
