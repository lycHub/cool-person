import { defineStore } from 'pinia';
import { shallowReactive } from 'vue';

import type { ContactWay } from '../typings/data';

// 给ssr做准备
export interface UserDto {
  name: string;
  job: string;
  avatarUrl: string;
  contactWays: ContactWay[];
}

const ApiDataStoreKey = 'ApiDataStore';

export const useUserStore = defineStore(ApiDataStoreKey, () => {
  const state = shallowReactive<Partial<UserDto>>({});
  const changeState = (data: UserDto) => {
    Object.assign(state, data);
  };
  return { state, changeState };
});
