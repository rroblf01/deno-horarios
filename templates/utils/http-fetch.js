import { getCachedRequest, cacheRequest, clearCachedRequest } from './fakecache/http-fetch.js';

export const customGet = async (url, headers, clearCache = false) => {
    if (clearCache) {
        clearCachedRequest(url);
    } else {
        const cachedRequest = getCachedRequest(url);
        if (cachedRequest) {
            return cachedRequest;
        }
    }

    console.log('fetching from server')
    try {
        const response = await fetch(url, { headers });
        const res = await response.json();
        if (res) {
            cacheRequest(url, res);
            return res;
        }
    } catch (error) {
        console.error(error);
        return []
    }
}

export const customPost = async (url, headers, body) => {
    clearCachedRequest(url);

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers,
            body
        });
        return await response.json();
    } catch (error) {
        console.error(error);
        return undefined
    }
}

export const customPut = async (url, headers, body) => {
    clearCachedRequest(url);

    try {
        const response = await fetch(url, {
            method: 'PUT',
            headers,
            body
        });
        return await response.json();
    } catch (error) {
        console.error(error);
        return undefined
    }
}