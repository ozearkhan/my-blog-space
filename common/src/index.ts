import z from 'zod'

export const signupinput= z.object({
    email: z.string().email(),
    password: z.string().min(6),
    name: z.string(),
})

export type SignupInput = z.infer<typeof signupinput>

export const signininput = z.object({
    email: z.string().email(),
    password: z.string().min(6),
})

export type SignupOutput = z.infer<typeof signininput>

export const createbloginput = z.object({
    title: z.string(),
    content: z.string(),
    published: z.boolean(),
})

export type CreateBlogInput = z.infer<typeof createbloginput>

export const updatebloginput = z.object({
    id: z.string(),
    title: z.string(),
    content: z.string(),
})

export type UpdateBlogInput = z.infer<typeof updatebloginput>