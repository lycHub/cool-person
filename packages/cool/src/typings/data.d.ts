export interface MenuItem {
  key: string;
  name: string;
  nameEn: string;
  link: string;
}

export interface ContactWay {
  key: string;
  name: string;
  link: string;
  icon: string;
}

export interface ProjectInfo {
  name: string;
  description: string;
  coverPic: string;
  link: string;
  startTime: Date;
  endTime: Date;
}

interface Scene {
  key: string;
  path: string;
  rotate: number;
}
