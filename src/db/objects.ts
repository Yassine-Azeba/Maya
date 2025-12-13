import { AnyPgColumn, pgTable, text } from "drizzle-orm/pg-core"
import { spaces } from "./space"

export const objects = pgTable("objects", { 
    objectId : text("object_id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    name : text("name").notNull(),
    description : text("description"),

    parent : text("parent").references(() : AnyPgColumn => objects.objectId),
    space : text("space").references(() => spaces.spaceId)
})