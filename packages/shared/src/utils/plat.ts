import { isAndroid, isIOS, isMobile, isTablet, isWindowsPhone } from './regExps';

export function getDeviceTypeByUserAgent() {
  const ua = navigator.userAgent;
  if (isAndroid(ua) || isIOS(ua) || isWindowsPhone(ua) || isMobile(ua)) {
    if (isTablet(ua)) {
      return 'tablet';
    }
    return 'mobile';
  }
  return 'desktop';
}
