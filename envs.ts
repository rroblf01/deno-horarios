import { load } from "@std/dotenv";

export const inyectEnv = async () => {
    if (!Deno.env.get('USERNAME') || !Deno.env.get('PASSWORD') || !Deno.env.get('TOKEN')) {
        const env = await load();
        Deno.env.set('USERNAME', env['USERNAME']);
        Deno.env.set('PASSWORD', env['PASSWORD']);
        Deno.env.set('TOKEN', env['TOKEN']);
    }
}