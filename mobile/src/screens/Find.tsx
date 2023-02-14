import { VStack, Heading, useToast } from "native-base";
import { useCallback, useState } from "react";

import { api } from '../services/api';

import { Button } from "../components/Button";
import { Header } from "../components/Header";
import { Input } from "../components/Input";
import { useFocusEffect, useNavigation } from "@react-navigation/native";

export function Find () {
  const [isLoading, setIsloading] = useState(false);
  const [code, setCode] = useState('');

  const toast = useToast();
  const { navigate } = useNavigation();
 
  async function handleJoinPool() {
    try {
      setIsloading(true);

      if(!code.trim()){
        return toast.show({
          title: 'Enter a pool code',
          placement: 'top',
          bgColor: 'red.500'
        });
      }
      
      await api.post('/pools/join', { code });
      toast.show({
        title: 'You joined the pool!',
        placement: 'top',
        bgColor: 'green.500'
      });
      navigate('pools');

    } catch (error) {
      console.log(error);
      setIsloading(false);

      if(error.response?.data?.message === 'Pool not found.') {
        return toast.show({
          title: 'Pool not found',
          placement: 'top',
          bgColor: 'red.500'
        });
      }

      if(error.response?.data?.message === 'You already joined this pool.') {
        return toast.show({
          title: 'You already joined this pool.',
          placement: 'top',
          bgColor: 'red.500'
        });
      }

      toast.show({
        title: 'Pool not found',
        placement: 'top',
        bgColor: 'red.500'
      });
      
    }
  }
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
          autoCapitalize="characters"
          onChangeText={setCode}
        />

        <Button 
          title="Find pool"
          onPress={handleJoinPool}
        />
      </VStack>
    </VStack>
  );
}