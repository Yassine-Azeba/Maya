import { lines } from "./lines"
import { users } from "./schema"
import { planes } from "./planes"
import { AnyPgColumn, pgTable, text } from "drizzle-orm/pg-core"

export const dots = pgTable("dots", {
    dotId : text("dot_id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    name : text("name").notNull(),
    description : text("description"),

    parent : text("parent").references(() : AnyPgColumn => dots.dotId, {onDelete: "cascade"}),
    line : text("line").references(() => lines.lineId, {onDelete : "cascade"}).notNull(),
    plane : text("plane").references(() => planes.planeId, {onDelete : "cascade"}).notNull(),
    user : text("user").references(() => users.id, {onDelete : "cascade"}).notNull()
})