import axios from 'axios';

export const api = axios.create({
  // can't use localhost with android
  baseURL: 'http://10.0.0.8:3333'
});