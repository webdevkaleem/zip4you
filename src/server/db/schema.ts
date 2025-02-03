// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { sql } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  pgEnum,
  pgTableCreator,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `zip4you${name}`);

// Enums
const visibilityObj = pgEnum("text", ["public", "private"]);
const visibilityEnum = visibilityObj("visibility").default("private");

export const media = createTable(
  "media",
  {
    id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
    name: varchar("name", { length: 256 }),
    key: varchar("key", { length: 256 }),
    size: integer("size"),
    userId: varchar("user_id", { length: 256 }),
    visibility: visibilityEnum,
    toBeDeleted: boolean("to_be_deleted").default(false),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
      () => new Date(),
    ),
  },
  (tableObj) => ({
    nameIndex: index("name_idx").on(tableObj.name),
  }),
);
