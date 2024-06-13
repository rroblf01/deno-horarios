import { cacheRequest } from './fakecache/http-fetch.js';

export const initFetch = async (url, headers) => {
    const response = await fetch(url, { headers });

    const allClasses = await response.json()
    allClasses.forEach(element => {
        const url = `/api/classes/${element.date}`;
        cacheRequest(url, element.classes)
    });
}
