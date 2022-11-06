import { VStack, Text, Heading } from "native-base";
import { Button } from "../components/Button";
import { Header } from "../components/Header";
import Logo from '../assets/logo.svg';
import { Input } from "../components/Input";

export function New () {
  return (
    <VStack flex={1} bgColor="gray.900">
      <Header title="Create new betting pool" showBackButton />
      <VStack mt={8} mx={5} alignItems="center">
        <Logo />

        <Heading fontFamily="heading" color="white" fontSize="xl" my={8} textAlign="center">
          Create your own betting pool and share it with friends!
        </Heading>

        <Input 
          mb={2}
          placeholder="Choose a title for your pool"
        />

        <Button 
          title="Create pool"
        />

        <Text color="gray.200" fontSize="sm" textAlign="center" px={10} mt={4}>
          After you create your betting pool, you will receive a unique code to share and 
          invite people to bet on your pool.
        </Text>
      </VStack>
    </VStack>
  );
}