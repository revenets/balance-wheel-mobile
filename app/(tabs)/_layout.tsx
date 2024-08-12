import { Tabs } from 'expo-router';
import React from 'react';

import { TabBarIcon } from '@app/components/navigation/tab-bar-icon';

export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: props => <TabBarIcon name="home" {...props} />,
        }}
      />
    </Tabs>
  );
}
