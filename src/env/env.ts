import { z } from "zod";

const envSchema = z.object({
    VITE_API_BASE_URL: z.string(),
    VITE_GOOGLE_CLIENT_ID : z.string()
})


const _env = envSchema.safeParse(import.meta.env)

if (_env.success === false) {
    console.error("Variaveis de ambiente invalidas : ", _env.error.format())
    throw new Error("Variaveis de ambiente invalidas")
}


export const env = _env.data
