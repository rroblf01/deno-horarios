export const getHash = async (username: string, password: string) => {
    const messageBuffer = new TextEncoder().encode(`${username}:${password}`);
    const hashBuffer = await crypto.subtle.digest('SHA-256', messageBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
}

export const getDates =  () => {
    const date = new Date();
    date.setMonth(date.getMonth() - 5)
    const dates = Array.from({ length: 12 }, (_, i) => {
        const newDate = new Date(date);
        newDate.setMonth(date.getMonth() + i);
        return `${newDate.getFullYear()}-${newDate.getMonth() + 1}`
    });

    return dates;
}