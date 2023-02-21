import { Box, FlatList, useToast } from 'native-base';
import { JSXElementConstructor, ReactElement, useEffect, useState } from 'react';
import { ListRenderItemInfo } from 'react-native';
import { api } from '../services/api';
import { Game, GameProps } from './Game';
import { Loading } from './Loading';

interface Props {
  poolId: string;
}

export function Bets({ poolId }: Props) {
  const toast = useToast();
  const [ isLoading, setIsloading ] = useState<boolean>(false);
  const [ games, setGames ] = useState<GameProps[]>([]);
  const [ firstTeamPoints, setFirstTeamPoints ] = useState('');
  const [ secondTeamPoints, setSecondTeamPoints ] = useState('');

  async function fetchGames() {
    try {
      setIsloading(true);

      const response = await api.get(`/pools/${poolId}/games`);
      setGames(response.data.games)

    } catch (error) {
      console.log(error);

      toast.show({
        title: 'Error: unable to load games',
        placement: 'top',
        bgColor: 'red.500',
      });
    
    } finally {
      setIsloading(false);
    }
  }

  async function handleBetConfirm(gameId: string) {
    try {
      if(!firstTeamPoints.trim() || !secondTeamPoints.trim()) {
        return toast.show({
          title: 'Fill in both score fields',
          placement: 'top',
          bgColor: 'red.500',
        });
      }

      await api.post(`/pools/${poolId}/games/${gameId}/guesses`, {
        firstTeamPoints: Number(firstTeamPoints),
        secondTeamPoints: Number(secondTeamPoints),
      })

      toast.show({
        title: 'Bet sent!',
        placement: 'top',
        bgColor: 'green.500',
      });

      fetchGames();

    } catch (error) {
      console.log(error);

      toast.show({
        title: 'Error: unable to confirm bet',
        placement: 'top',
        bgColor: 'red.500',
      });
    
    } finally {
      setIsloading(false);
    }
  }

  useEffect(() => {
    fetchGames();
  }, [poolId]);

  if(isLoading) {
    return <Loading />
  }

  return (    
    <FlatList 
      data={games}
      keyExtractor={item => item.id} 
      renderItem={({ item }) => (
        <Game 
          data={item} 
          onGuessConfirm={() => handleBetConfirm(item.id)}
          setFirstTeamPoints={setFirstTeamPoints} 
          setSecondTeamPoints={setSecondTeamPoints}
        />
      )} 
    />
    
  );
}
