import { VStack, Heading } from "native-base";
import { Button } from "../components/Button";
import { Header } from "../components/Header";
import { Input } from "../components/Input";

export function Find () {
  return (
    <VStack flex={1} bgColor="gray.900">
      <Header title="Find a betting pool" showBackButton />
      <VStack mt={8} mx={5} alignItems="center">

        <Heading fontFamily="heading" color="white" fontSize="xl" mb={8} textAlign="center">
          Find a betting pool with a unique code
        </Heading>

        <Input 
          mb={2}
          placeholder="What is the pool's unique code?"
        />

        <Button 
          title="Find pool"
        />
      </VStack>
    </VStack>
  );
}