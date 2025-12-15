import { AnyPgColumn, pgTable, text } from "drizzle-orm/pg-core"
import { spaces } from "./spaces"
import { users } from "./schema"

export const objects = pgTable("objects", { 
    objectId : text("object_id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    name : text("name").notNull().unique(),
    description : text("description"),

    parent : text("parent").references(() : AnyPgColumn => objects.objectId),
    space : text("space").references(() => spaces.spaceId).notNull(),
    user : text("user").references(() => users.id).notNull()
})