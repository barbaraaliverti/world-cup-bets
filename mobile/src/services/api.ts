import axios from 'axios';

export const api = axios.create({
  // can't use localhost with android
  // check IP when working on a new machine!
  baseURL: 'http://10.0.0.6:3333'
});