import { pgTable, text } from "drizzle-orm/pg-core"
import { users } from "./schema"

export const planes = pgTable("planes", {
    planeId : text("plane_id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    name : text("name").notNull(),
    description : text("description"),

    userId : text("user_id").references(() => users.id, {onDelete : "cascade"}).notNull()
})