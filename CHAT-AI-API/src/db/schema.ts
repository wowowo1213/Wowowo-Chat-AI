import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const charts = pgTable('chats', {
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull(),
  message: text('message').notNull(),
  reply: text('reply').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const users = pgTable('users', {
  userId: text('user_id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export type ChatInsert = typeof chats.$inferInsert;
export type ChatSelect = typeof chats.$inferInsert;
export type UserInsert = typeof chats.$inferInsert;
export type UserSelect = typeof chats.$inferInsert;