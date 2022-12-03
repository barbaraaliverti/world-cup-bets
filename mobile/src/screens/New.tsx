import { VStack, Text, Heading, useToast } from "native-base";
import { Button } from "../components/Button";
import { Header } from "../components/Header";
import Logo from '../assets/logo.svg';
import { Input } from "../components/Input";
import { useState } from "react";
import { api } from "../services/api";

export function New () {
  const [title, setTitle] = useState<string>('');
  const [isLoading, setIsloading] = useState<boolean>(false);

  const toast = useToast();

  async function handleCreatePool() {
    if(!title) {
      return toast.show({
        title: 'Please insert a title for your new pool.',
        placement: 'top',
        bgColor: 'red.500'
      });
    }

    try {
      setIsloading(true);

      await api.post('/pools', { title });

      toast.show({
        title: `New pool created: ${title}`,
        placement: 'top',
        bgColor: 'green.500'
      })

      setTitle('');

    } catch (error){
      console.log(error);

      toast.show({
        title: 'Error while creating a new pool. Your pool was not created.',
        placement: 'top',
        bgColor: 'red.500'
      })
    } finally {
      setIsloading(false);
    }

  }

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
          onChangeText={setTitle}
          value={title}
        />

        <Button 
          title="Create pool"
          onPress={handleCreatePool}
          isLoading={isLoading}
        />

        <Text color="gray.200" fontSize="sm" textAlign="center" px={10} mt={4}>
          After you create your betting pool, you will receive a unique code to share and 
          invite people to bet on your pool.
        </Text>
      </VStack>
    </VStack>
  );
}