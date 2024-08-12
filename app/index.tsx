import { useAppSelector } from '@app/hooks';
import { Redirect } from 'expo-router';

import { selectIsAuthenticated } from '@app/store/auth/auth-slice';

export default function Index() {
  const isAuthenticated = useAppSelector(state => selectIsAuthenticated(state));

  const redirectRoute = isAuthenticated ? '/(tabs)' : '/(auth)/sign-in';

  return <Redirect href={redirectRoute} />;
}
