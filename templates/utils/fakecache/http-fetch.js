const requests = new Map();

export const getCachedRequest = (url) => {
    return requests.get(url);
}

export const cacheRequest = (url, request) => {
    requests.set(url, request);
}

export const clearCachedRequest = (url) => {
    requests.delete(url);
}