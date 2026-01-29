import { lines } from "./lines"
import { users } from "./schema"
import { planes } from "./planes"
import { pgEnum, pgTable, text } from "drizzle-orm/pg-core"

export const attributTypes = pgEnum("attribut_types",[
    "Text",
    "Number",
    "Date",
    "Email",
    "Link",
    "Phone",
    "Line",
    "Selection"
])
export const attributs = pgTable("attributs", { 
    attributId : text("attributs_id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    name : text("name").notNull(),
    type : attributTypes().notNull(),

    plane : text("plane").references(() => planes.planeId, {onDelete : "cascade"}).notNull(),
    userId : text("user_id").references(() => users.id, {onDelete : "cascade"}).notNull(),

    selectionValues : text("selection_values").array()
})

export const attributValues = pgTable("attributs_values",{
    attributValuesId : text("attribut_value_id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    
    attribut : text("attributs_id").references(() => attributs.attributId, {onDelete : "cascade"}).notNull(),
    line : text("line").references(() => lines.lineId, {onDelete : "cascade"}).notNull(),

    value : text("value")
})