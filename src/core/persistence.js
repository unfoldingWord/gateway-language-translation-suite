import localforage from 'localforage';
import appPackage from '../../package.json';

const stateStore = localforage.createInstance({
  driver: [localforage.INDEXEDDB],
  name: `${appPackage.name}-state-store`,
});

export const loadState = async (key) => {
  let value = await stateStore.getItem(key);
  return value;
};

export const loadValue = async (store, key) => {
  let value = await store.getItem(key);
  return value;
};

export const saveState = async (key, value) => {
  let response;

  if (value === null || value === undefined) {
    response = await stateStore.removeItem(key);
  } else {
    response = await stateStore.setItem(key, value);
  }
  return response;
};

export const saveKeyValue = async (store, key, value) => {
  let response;

  if (value === null || value === undefined) {
    response = await store.removeItem(key);
  } else {
    response = await store.setItem(key, value);
  }
  return response;
};

export const loadAuthentication = async () => {
  let _authentication = await loadState('authentication');

  if (
    _authentication &&
    !(_authentication.user && _authentication.user.username)
  ) {
    _authentication = null;
  }
  return _authentication;
};

export const saveAuthentication = async (authentication) => {
  saveState('authentication', authentication);
};

const cacheStore = localforage.createInstance({
  driver: [localforage.INDEXEDDB],
  name: `${appPackage.name}-cache-store`,
});

export const saveFileCache = async (file, content) => {
  console.log("tcc saveFileCache", file, content);

  let response;
  const key = file.html_url;

  const cachedContent = {
    html_url: file.html_url,
    filepath: file.filepath,
    sha: file.sha,
    timestamp: new Date(),
    content: content
  };

  if (content === null || content === undefined) {
    console.log("tcc saveFileCache // REMOVING", file, content);
    response = await cacheStore.removeItem(key);
  } else {
    response = await cacheStore.setItem(key, cachedContent);
  }
  return response;
};

export const loadFileCache = async (html_url) => {
  const cachedFile = await loadValue(cacheStore, html_url);
  console.log("tc create loadCacheTargetFile", html_url, cachedFile);
  return cachedFile;
};