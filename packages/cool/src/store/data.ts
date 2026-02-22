import { defineStore } from 'pinia';
import { shallowReactive } from 'vue';

import type { ContactWay, ProjectInfo, Stack, Hobby } from '../typings/data';

// 给ssr做准备
export interface ApiData {
  stacks: Stack[];
  hobbies: Hobby[];
  contactWays: ContactWay[];
  projects: ProjectInfo[];
  sceneries: string[];
  friends: string[];
  intro: string;
}

const ApiDataStoreKey = 'ApiDataStore';

export const useApiDataStore = defineStore(ApiDataStoreKey, () => {
  const state = shallowReactive<Partial<ApiData>>({});
  const changeState = (data: ApiData) => {
    Object.assign(state, data);
  };
  return { state, changeState };
});
