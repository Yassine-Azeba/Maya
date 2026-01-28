import z from "zod";

export const createAttributSchema = z.object({
    name: z.string().min(2, {error:"2 characters minimum."}).max(255, {error:"255 characters maximum."}),
    type : z.enum(["Text","Number","Date","Email","Link","Phone","Line","Selection"]),
    selectionValues : z.string().max(2000, {error: "2000 characters maximum"}).array()
})

export const updateAttributSchema = z.object({
    name: z.string().max(255, {error:"255 characters maximum."}).optional(),
    type : z.enum(["Text","Number","Date","Email","Link","Phone","Line","Selection"]),
    selectionValues : z.string().max(2000, {error: "2000 characters maximum"}).array()
})