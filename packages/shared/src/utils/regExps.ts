export const numberReg = /^\d+$/;
export const decimalReg = /^(?!0\d)\d*(\.\d+)?$/; // 整数超过两位就不能以0开头
export const postcodeReg = /^\d{6}$/;
export const mobileReg = /^(1[3-9])\d{9}$/;
export const telephoneReg = /^(\+\d{2}-)?0\d{2,3}-\d{7,8}$/;
export const emailReg =
  /^[0-9A-Za-z_]+([-+.][0-9A-Za-z_]+)*@[0-9A-Za-z_]+([-.][0-9A-Za-z_]+)*\.[0-9A-Za-z_]+([-.][0-9A-Za-z_]+)*$/;

export const zhCN = /^[\u4e00-\u9fa5]+$/;

// 城市en
export const cityEn = /^[a-zA-Z'\\s]+$/;

// 小阔里的内容
export const parentheses = /\((.+?)\)/;
// const parentheses = /(?<=\()(.+?)(?=\))/;

export const passwordRegex =
  /^(?:(?=.*[A-Za-z])(?=.*\d)|(?=.*[A-Za-z])(?=.*[\W_])|(?=.*\d)(?=.*[\W_]))[A-Za-z\d\W_]{8,}$/;

export const lngRegex =
  /^[-+]?(0(\.\d{1,6})?|([1-9]\d?)(\.\d{1,6})?|1[0-7]\d(\.\d{1,6})?|180(\.0{1,6})?)$/;

export const latRegex = /^[-+]?(([1-8]\d?)(\.\d{1,6})?|90(\.0{1,6})?)$/;

export const isAndroid = (ua: string) => /Android/i.test(ua);
export const isIOS = (ua: string) => /iPhone|iPad|iPod/i.test(ua);
export const isWindowsPhone = (ua: string) => /Windows Phone/i.test(ua);
export const isMobile = (ua: string) => /Mobile/i.test(ua);
export const isTablet = (ua: string) => /Tablet|iPad/i.test(ua);
