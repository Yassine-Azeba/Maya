import { users } from "./schema"
import { planes } from "./planes"
import { AnyPgColumn, pgTable, text } from "drizzle-orm/pg-core"

export const lines = pgTable("lines", { 
    lineId : text("line_id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    name : text("name").notNull(),
    description : text("description"),

    parent : text("parent").references(() : AnyPgColumn => lines.lineId, {onDelete: "cascade"}),
    plane : text("line").references(() => planes.planeId, {onDelete : "cascade"}).notNull(),
    user : text("user").references(() => users.id, {onDelete : "cascade"}).notNull()
})