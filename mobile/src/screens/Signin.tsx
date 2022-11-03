import { NativeBaseProvider, Center, Text } from "native-base";
import { THEME } from '../styles/theme';

export function SignIn() {
  return (
    <NativeBaseProvider theme={ THEME }>
      <Center flex={1} bgColor="gray.900">
        <Text color="gray.200">Sign in</Text>
      </Center>
    </NativeBaseProvider>
  );
}