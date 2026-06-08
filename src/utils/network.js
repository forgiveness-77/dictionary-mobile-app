// Lightweight connectivity check. NetInfo is treated as optional: if the native
// module is unavailable (or connectivity can't be determined), we assume online
// and let the request's own failure handling take over (reactive fallback).
let NetInfo = null;
try {
  // eslint-disable-next-line global-require
  NetInfo = require('@react-native-community/netinfo').default;
} catch (e) {
  NetInfo = null;
}

export async function isOnline() {
  if (!NetInfo) return true;
  try {
    const state = await NetInfo.fetch();
    if (!state || state.isConnected == null) return true; // unknown → assume online
    if (state.isInternetReachable === false) return false;
    return state.isConnected !== false;
  } catch (e) {
    return true;
  }
}
