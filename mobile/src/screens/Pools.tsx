import { VStack, Icon, useToast, Toast, FlatList } from 'native-base';
import { Octicons } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

import { Header } from '../components/Header';
import { Button } from '../components/Button';
import { api } from '../services/api';
import { useCallback, useState } from 'react';
import { PoolCard, PoolProps } from '../components/PoolCard';
import { EmptyPoolList } from '../components/EmptyPoolList';
import { Loading } from '../components/Loading';

export function Pools () {
  const [ isLoading, setIsloading ] = useState<boolean>(true);
  const [ pools, setPools ] = useState<PoolProps[]>([]);

  const { navigate } = useNavigation();
  const toast = useToast();

  async function fetchPools() {
    try {
      setIsloading(true);

      const response = await api.get('/pools');
      setPools(response.data.pools);

    } catch (error) {
      console.log(error);
      toast.show({
        title: 'Error: unable to load pools',
        placement: 'top',
        bgColor: 'red.500',
      });
    } finally {
      setIsloading(false);
    }
  }

  // fetch everytime the focus is on Pools tab - if useEffect is used, it will only fetch on mount
  useFocusEffect(useCallback(() => {
    fetchPools();
  }, []));
  
  return (
    <VStack flex={1} bgColor="gray.900">
      <Header title="My pools" />
      <VStack mt={6} mx={5} borderBottomWidth={1} borderBottomColor="gray.600" pb={4} mb={4}>
        <Button 
        title="Search pool by code"
        leftIcon={<Icon as={Octicons} name="search" color="black" size="md" />}
        onPress={() => navigate('find')}
        />
      </VStack>

      {isLoading?
      <Loading /> 
      :<FlatList 
        data={pools}
        keyExtractor={ item => item.id }
        renderItem={({ item }) => (
          <PoolCard 
            data={item} 
            onPress={() => navigate('details', {id: item.id})}
          />)}
        px={5}
        showsVerticalScrollIndicator={false}
        _contentContainerStyle={{ pb: 10 }}
        ListEmptyComponent={() => <EmptyPoolList />}
      />}
    </VStack>
  );
}
