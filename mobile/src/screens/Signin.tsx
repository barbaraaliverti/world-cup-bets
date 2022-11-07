import { Center, Text, Icon } from "native-base";
import Logo from '../assets/logo.svg';
import { Button } from '../components/Button';
import { Fontisto } from '@expo/vector-icons';
import { useAuth } from "../hooks/useAuth";

export function SignIn() {
  const { signIn, isUserLoading } = useAuth();

  return (
      <Center flex={1} bgColor="gray.900" px={5}>
        <Logo width={212} height={40} />
        <Button 
          type="SECONDARY"
          title="Sign in with Google"
          leftIcon={<Icon as={Fontisto} name="google" color="white" size="md" />}
          mt={12}
          onPress={signIn}
          isLoading={isUserLoading}
          _loading={{ _spinner: { color: 'white' }}}
        />
        <Text color="gray.200" textAlign="center" mt={4}>
          We do not use any information other than {'\n'} your e-mail to create your account.
        </Text>
      </Center>
  );
}