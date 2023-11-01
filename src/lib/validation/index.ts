import * as z from 'zod'

export const SignupValidation = z.object({
    name: z
        .string()
        .min(2, { message: 'Too short' })
        .max(50, { message: 'Too long' }),
    username: z
        .string()
        .min(2, { message: 'Too short' })
        .max(50, { message: 'Too long' }),
    email: z.string().email(),
    password: z
        .string()
        .min(8, { message: 'Password must be at least 8 characters.' })
        .max(50, { message: 'Password must be at shorter 50 characters' }),
})
