import {getHash} from './utils.ts'

const kv = await Deno.openKv();

export const findToken = async (username: string, password: string) => {
    const hash = await getHash(username, password);
    const result = await kv.get([hash]);

    if (!result.value) {
        return null;
    }

    return result.value.token;
}

export const createUser = async () => {
    const username = Deno.env.get('USERNAME')
    const password = Deno.env.get('PASSWORD')
    const token = Deno.env.get('TOKEN')

    const hash = await getHash(username, password);

    await kv.set([hash], {token});
}

export const registerClass = async (dateString: string, place: string, duration: string) => {
    const date = new Date(dateString)
    const key = [`${date.getFullYear()}-${date.getMonth()}`];
    const result = await kv.get(key);

    if (!result.value) {
        await kv.set(key, [{place, duration, date: dateString}]);
    }else{
        const allClasses = [...result.value, {place, duration, date: dateString}];
        await kv.set(key, allClasses);
    }
}

export const getClasses = async (dateString: string) => {
    const date = new Date(dateString)
    const key = [`${date.getFullYear()}-${date.getMonth()}`];

    const result = await kv.get(key);

    if (!result) {
        return [];
    }

    return result.value;
}

export const putAllClasses = async (dateString: string, allClasses: Array) => {
    const date = new Date(dateString)
    const key = [`${date.getFullYear()}-${date.getMonth()}`];
    const result = await kv.get(key);

    if (!result.value) {
        return;
    }

    return await kv.set(key, allClasses);
}