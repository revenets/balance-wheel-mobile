import { Tabs } from 'expo-router';
import React from 'react';

import { TabBarIcon } from '@app/components';

const TabLayout = () => {
  return (
    <Tabs>
      <Tabs.Screen
        name="home"
        options={{
          title: 'Dashboard',
          tabBarIcon: props => <TabBarIcon name="home" {...props} />,
        }}
      />
      <Tabs.Screen
        name="wheel-of-life"
        options={{
          title: 'Wheel Of Life',
          tabBarIcon: props => <TabBarIcon name="settings" {...props} />,
          unmountOnBlur: true,
        }}
      />
    </Tabs>
  );
};

export default TabLayout;
