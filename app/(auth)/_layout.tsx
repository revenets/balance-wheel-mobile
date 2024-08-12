import { Stack } from 'expo-router';
import 'react-native-reanimated';

export default function UnauthorizedLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="sign-in" />
    </Stack>
  );
}
