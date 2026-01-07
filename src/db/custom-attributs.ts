import { lines } from "./lines"
import { users } from "./schema"
import { planes } from "./planes"
import { boolean, pgEnum, pgTable, text } from "drizzle-orm/pg-core"

export const customAttributTypes = pgEnum("custom_attribut_types",[
    "string",
    "number",
    "boolean",
])
export const customAttributs = pgTable("custom_attributs", { 
    customAttributId : text("custom_attributs_id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    name : text("name").notNull(),
    type : customAttributTypes(),

    plane : text("plane").references(() => planes.planeId, {onDelete : "cascade"}).notNull(),
    line : text("line").references(() => lines.lineId, {onDelete : "cascade"}),
    userId : text("user_id").references(() => users.id, {onDelete : "cascade"}).notNull(),

    appliesToChildrens : boolean("applies_to_childrens").notNull().default(false),
    requiredForChildrens : boolean("required_for_childrens").notNull().default(false),
    defaultValue : text("default_value")
})

export const customAttributLinks = pgTable("custom_attributs_links",{
    customAttributLinkId : text("custom_attributs_id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    
    customAttribut : text("custom_attributs_id").references(() => customAttributs.customAttributId, {onDelete : "cascade"}).notNull(),
    line : text("line").references(() => lines.lineId, {onDelete : "cascade"}).notNull(),

    value : text("value")
})