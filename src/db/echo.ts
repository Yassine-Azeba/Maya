import { AnyPgColumn, pgTable, text } from "drizzle-orm/pg-core"
import { spaces } from "./spaces"
import { objects } from "./objects"
import { users } from "./schema"

export const echos = pgTable("echos", {
    echoId : text("echo_id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    name : text("name").notNull(),
    description : text("description"),

    parent : text("parent").references(() : AnyPgColumn => echos.echoId),
    object : text("object").references(() => objects.objectId).notNull(),
    space : text("space").references(() => spaces.spaceId).notNull(),
    user : text("user").references(() => users.id).notNull()
})