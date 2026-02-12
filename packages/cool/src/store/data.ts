import { defineStore } from 'pinia';
import { shallowReactive } from 'vue';

import { ContactWays, Friends, getStackOptions, HobbyOptions, Projects, Sceneries } from '../utils';

import type { ContactWay, ProjectInfo } from '../typings/data';

// 给ssr做准备
export interface ApiData {
  stacks: ReturnType<typeof getStackOptions>;
  hobbys: typeof HobbyOptions;
  contactWays: ContactWay[];
  projects: ProjectInfo[];
  sceneries: string[];
  friends: string[];
  intro: string;
}

const ApiDataStoreKey = 'ApiDataStore';

const getDefaultValue: () => ApiData = () => ({
  stacks: getStackOptions(),
  hobbys: HobbyOptions,
  contactWays: ContactWays,
  projects: Projects,
  sceneries: Sceneries,
  friends: Friends,
  intro: `我是海拉鲁大地的守护者。平时总被人叫作“勇者”，其实我只是个热爱探索的普通少年，喜欢攀爬峭壁、收集各种稀奇古怪的材料。我的背包里总是装满弓箭、盾牌和从怪物营地“借”来的武器——没办法，它们总是不太友好。
      作为海拉鲁的旅行者，我经历过两次重大的冒险：一次是从百年沉睡中醒来，拯救了被灾厄盖侬侵蚀的世界；另一次是在探索地下时突然被传送到浮空岛，追寻着神秘的手臂和古老的传说。我不太爱说话——人们总说我是沉默的勇者，但我更习惯用行动表达：用希卡之石解谜，用大师剑斩除邪恶，用滑翔帆掠过湖泊与山谷。
      每当夕阳将海拉鲁城堡染成金色，我总会想起公主的嘱托。我不是天生的英雄，只是愿意为了保护重要的事物而握紧剑柄。如果你在海拉鲁遇见一个戴着绿色帽子、奔跑时会被石头绊倒的青年，那大概就是我了——一个仍在学习如何拯救世界，却总被烹饪和捉虫子分心的勇者。要一起爬山吗？我带了很多精力药水。`,
});

export const useApiDataStore = defineStore(ApiDataStoreKey, () => {
  const state = shallowReactive<ApiData>(getDefaultValue());
  const changeState = (data: ApiData) => {
    Object.assign(state, data);
  };

  return { state, changeState };
});
