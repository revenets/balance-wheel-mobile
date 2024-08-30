import React, { type FC, useEffect } from 'react';
import Animated, {
  Easing,
  useAnimatedProps,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { Path } from 'react-native-svg';

type Properties = {
  center: number;
  radius: number;
  startAngle: number;
  endAngle: number;
  value: number;
  color: string;
};

const AnimatedPath = Animated.createAnimatedComponent(Path);

const Sector: FC<Properties> = ({
  center,
  radius,
  startAngle,
  endAngle,
  value,
  color,
}) => {
  const animatedEndAngle = useSharedValue(startAngle);
  const normalizedValue = value / 10;

  const animatedProps = useAnimatedProps(() => {
    const toRadians = (angle: number): number => (angle * Math.PI) / 180;

    const x1 =
      center + radius * normalizedValue * Math.cos(toRadians(startAngle));
    const y1 =
      center + radius * normalizedValue * Math.sin(toRadians(startAngle));

    const x2 =
      center +
      radius * normalizedValue * Math.cos(toRadians(animatedEndAngle.value));
    const y2 =
      center +
      radius * normalizedValue * Math.sin(toRadians(animatedEndAngle.value));

    const pathData = `M ${center} ${center} L ${x1} ${y1} A ${radius} ${radius} 0 0 1 ${x2} ${y2} Z`;

    return { d: pathData };
  });

  useEffect(() => {
    animatedEndAngle.value = startAngle;
    animatedEndAngle.value = withTiming(endAngle, {
      duration: 2_000,
      easing: Easing.out(Easing.cubic),
    });
  }, [animatedEndAngle, endAngle, startAngle]);

  return (
    <AnimatedPath
      animatedProps={animatedProps}
      fill={color}
      strokeWidth={1}
      stroke="white"
    />
  );
};

export { Sector };
