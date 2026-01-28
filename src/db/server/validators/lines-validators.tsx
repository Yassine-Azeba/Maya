import z from "zod";

export const createLineSchema = z.object({
    name: z.string().min(2, {error:"2 characters minimum."}).max(255, {error:"255 characters maximum."}),
    description : z.string().max(2000, {error:"2000 characters maximum."}).optional(),
    parentLineId : z.string().optional()
})

export const updateLineSchema = z.object({
    name: z.string().max(255, {error:"255 characters maximum."}).optional(),
    description : z.string().max(2000, {error:"2000 characters maximum."}).optional(),
    parentLineId : z.string().optional()
})