import { getScreenOrientation } from '@personal/shared';
import { defineStore } from 'pinia';
import { shallowReactive } from 'vue';

export interface LoadingStatus {
  initialed: boolean;
  status: 'ready' | 'loading' | 'finished';
  direction: 'right' | 'down';
  trigger: 'initial' | 'router';
  speed: number;
}

const LoadingStoreKey = 'LoadingStore';

const getDefaultValue: (event?: boolean) => LoadingStatus = (initialed = false) => ({
  initialed,
  status: 'ready',
  direction: getScreenOrientation() === 'horizontal' ? 'down' : 'right',
  trigger: 'initial',
  speed: 10,
});

export const useLoadingStore = defineStore(LoadingStoreKey, () => {
  const state = shallowReactive<LoadingStatus>(getDefaultValue());
  const changeState = (data: Partial<LoadingStatus>) => {
    Object.assign(state, data);
  };

  const reset = () => {
    Object.assign(state, getDefaultValue(true));
  };

  return { state, changeState, reset };
});
