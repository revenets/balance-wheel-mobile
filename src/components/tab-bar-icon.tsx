import type { FC, ComponentProps } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import type { IconProps } from '@expo/vector-icons/build/createIconSet';

type TabBarIconProps = IconProps<ComponentProps<typeof Ionicons>['name']>;

const TabBarIcon: FC<TabBarIconProps> = ({ style, ...rest }) => {
  // eslint-disable-next-line react-native/no-inline-styles
  return <Ionicons size={28} style={[{ marginBottom: -3 }, style]} {...rest} />;
};

export { TabBarIcon };
