import { pgTable, text } from "drizzle-orm/pg-core"
import { users } from "./schema"

export const spaces = pgTable("spaces", {
    spaceId : text("space_id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    name : text("name").notNull().unique(),
    description : text("description"),

    userId : text("user_id").references(() => users.id).notNull()
})