import { createContext, useState, useEffect } from 'react';

import * as Google from 'expo-auth-session/providers/google';
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import { api } from '../services/api';

WebBrowser.maybeCompleteAuthSession();

interface UserProps {
  name: string;
  avatarUrl: string;
}

export interface AuthContextDataProps {
  user: UserProps;
  isUserLoading: boolean;
  signIn: () => Promise<void>;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

// {} is the initial value
export const AuthContext = createContext({} as AuthContextDataProps);

export function AuthContextProvider({ children }: AuthProviderProps) {
  const [ user, setUser ] = useState<UserProps>({} as UserProps);
  const [ isUserLoading, setIsUserLoading ] = useState(false);

  const [ request, response, promptAsync ] = Google.useAuthRequest({
    clientId: '48314061331-22muev4s7nbf44bpgofbv8b9mpsui106.apps.googleusercontent.com',
    redirectUri: 'https://auth.expo.io/@barbaraalv/worldcupbetsmobile',
    scopes: ['profile', 'email']
  })

  // Get redirect URI for Google console
  // console.log(AuthSession.makeRedirectUri({ useProxy: true}));

  async function signIn() {
    try {
      setIsUserLoading(true);

      // starts auth flow 
      await promptAsync();

    } catch (err) {
      console.log(err);
      throw err;    
    } finally {
      setIsUserLoading(false);
    }
  }

  async function signInWithGoogle(access_token: string) {
    try {
      setIsUserLoading(true);

      const tokenResponse = await api.post('/users', { access_token });

      // Add auth token to all requests
      api.defaults.headers.common['Authorization'] = `Bearer ${tokenResponse.data.token}`;

      const userInfoResponse = await (await api.get('/me'));
      setUser(userInfoResponse.data.user);

    } catch(err) {
      console.log(err);
      throw err;
    } finally {
      setIsUserLoading(false);
    }
  }

  useEffect(() => {
    if(response?.type === 'success' && response.authentication?.accessToken) {
      signInWithGoogle(response.authentication.accessToken)
    } 

  }, [response])

  return (
    <AuthContext.Provider value={{
      signIn,
      isUserLoading,
      user
    }}>
      {children}
    </AuthContext.Provider>
  )
}