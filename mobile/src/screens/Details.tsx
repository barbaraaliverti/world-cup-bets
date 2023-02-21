import { useRoute } from '@react-navigation/native';
import { HStack, useToast, VStack } from "native-base";
import { Header } from "../components/Header";
import { Loading } from '../components/Loading';
import { useEffect, useState } from "react";
import { api } from '../services/api';
import { PoolCardProps } from '../components/PoolCard';
import { PoolHeader } from '../components/PoolHeader';
import { EmptyMyPoolList } from '../components/EmptyMyPoolList';
import { Option } from '../components/Option';
import { Share } from 'react-native';
import { Bets } from '../components/Bets';

interface RouteParams {
    id: string;
}

export function Details() {

    const route = useRoute();
    const toast = useToast();
    const { id } = route.params as RouteParams;

    const [ isLoading, setIsloading ] = useState<boolean>(false);
    const [ poolDetails, setPoolDetails] = useState<PoolCardProps>({} as PoolCardProps);
    const [ optionSelected, setOptionSelected] = useState<'bets' | 'ranking'>('bets');

    async function fetchPoolDetails () {
      try {
        setIsloading(true);

        const response = await api.get(`/pools/${id}`);
        setPoolDetails(response.data.pool)

      } catch (error) {
        console.log(error);

        toast.show({
          title: 'Error: unable to load details of this pool',
          placement: 'top',
          bgColor: 'red.500',
        });
      
      } finally {
        setIsloading(false);
      }
    }

    async function handleCodeShare() {
      await Share.share({
        message: poolDetails.code,
      });
    }

    useEffect(() => {
      fetchPoolDetails();
    }, [id]);

    if (isLoading) {
      return <Loading />
    }

    return (
        <VStack flex={1} bgColor="gray.900">
            <Header title={poolDetails.title} 
              showBackButton 
              showShareButton 
              onShare={handleCodeShare}
            />

            { poolDetails._count?.participants > 0 ?
              <VStack px={5} flex={1}>
                <PoolHeader data={poolDetails}/>
                <HStack bgColor="gray.800" p={1} rounded="sm" mb={5}>
                  <Option 
                    title="Your bets" 
                    isSelected={optionSelected === 'bets'} 
                    onPress={() => setOptionSelected('bets')}
                  />
                  <Option 
                    title="Group ranking" 
                    isSelected={optionSelected === 'ranking'} 
                    onPress={() => setOptionSelected('ranking')}
                  />
                </HStack>

                <Bets poolId={poolDetails.id} />

              </VStack>
            : <EmptyMyPoolList code={poolDetails.code} />
          }

        </VStack>
    );
}