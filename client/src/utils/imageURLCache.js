const imageCache = {};

export const getImageUrlFromCache = (avatarURL) => {
  return imageCache[avatarURL];
};

export const setImageUrlToCache = (avatarURL, url) => {
  imageCache[avatarURL] = url;
};
