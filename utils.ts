export const getHash = async (username: string, password: string) => {
    const messageBuffer = new TextEncoder().encode(`${username}:${password}`);
    const hashBuffer = await crypto.subtle.digest('SHA-256', messageBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
}
