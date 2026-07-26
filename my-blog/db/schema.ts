// ─── DATABASE SCHEMA ─────────────────────────────────────────────
// This file defines the database structure using Drizzle ORM.
// Each table is defined with columns, types, and relations.
// The schema is used by Drizzle for type-safe queries and migrations.

import { pgTable, serial, text, timestamp, integer, boolean, unique } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// ─── TABLES ──────────────────────────────────────────────────────

// Users — stores registered users (email/password + OAuth users)
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: text('email').unique().notNull(),
  name: text('name'),
  password: text('password'), // null for OAuth users (Google/GitHub)
  createdAt: timestamp('created_at').defaultNow(),
});

// Posts — blog posts written by admin
export const posts = pgTable('posts', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  slug: text('slug').unique().notNull(), // URL-friendly identifier
  content: text('content').notNull(),
  excerpt: text('excerpt'),
  published: boolean('published').default(false),
  authorId: integer('author_id').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Comments — user comments on posts (with nested replies)
export const comments = pgTable('comments', {
  id: serial('id').primaryKey(),
  content: text('content').notNull(),
  postId: integer('post_id').references(() => posts.id, { onDelete: 'cascade' }),
  authorId: integer('author_id').references(() => users.id, { onDelete: 'cascade' }),
  parentId: integer('parent_id'), // null = top-level, not null = reply to another comment
  approved: boolean('approved').default(false), // requires admin approval before showing
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Likes — post likes (one per user per post)
export const likes = pgTable('likes', {
  id: serial('id').primaryKey(),
  postId: integer('post_id').references(() => posts.id, { onDelete: 'cascade' }),
  userId: integer('user_id').references(() => users.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => ({
  uniqueLike: unique().on(table.postId, table.userId), // prevents duplicate likes
}));

// Comment Likes — likes on individual comments
export const commentLikes = pgTable('comment_likes', {
  id: serial('id').primaryKey(),
  commentId: integer('comment_id').references(() => comments.id, { onDelete: 'cascade' }),
  userId: integer('user_id').references(() => users.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => ({
  uniqueLike: unique().on(table.commentId, table.userId), // prevents duplicate likes
}));

// ─── RELATIONS ────────────────────────────────────────────────────
// Define relationships between tables for Drizzle's query builder.
// This enables `.with()` and `.findMany()` with nested relations.

// Users → Posts, Comments, Likes
export const usersRelations = relations(users, ({ many }) => ({
  posts: many(posts),
  comments: many(comments),
  likes: many(likes),
}));

// Posts → User (author), Comments, Likes
export const postsRelations = relations(posts, ({ one, many }) => ({
  author: one(users, { fields: [posts.authorId], references: [users.id] }),
  comments: many(comments),
  likes: many(likes),
}));

// Comments → User (author), Post, Parent/Child replies, Likes
export const commentsRelations = relations(comments, ({ one, many }) => ({
  post: one(posts, { fields: [comments.postId], references: [posts.id] }),
  author: one(users, { fields: [comments.authorId], references: [users.id] }),
  parent: one(comments, { fields: [comments.parentId], references: [comments.id] }),
  replies: many(comments),
  commentLikes: many(commentLikes),
}));

// Likes → User and Post
export const likesRelations = relations(likes, ({ one }) => ({
  post: one(posts, { fields: [likes.postId], references: [posts.id] }),
  user: one(users, { fields: [likes.userId], references: [users.id] }),
}));

// Comment Likes → User and Comment
export const commentLikesRelations = relations(commentLikes, ({ one }) => ({
  comment: one(comments, { fields: [commentLikes.commentId], references: [comments.id] }),
  user: one(users, { fields: [commentLikes.userId], references: [users.id] }),
}));

// ─── TYPES ────────────────────────────────────────────────────────
// Export types for use in the rest of the app.
// `$inferSelect` = type of a row when SELECTing from the table
// `$inferInsert` = type for INSERT operations

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Post = typeof posts.$inferSelect;
export type NewPost = typeof posts.$inferInsert;
export type Comment = typeof comments.$inferSelect;
export type NewComment = typeof comments.$inferInsert;
export type Like = typeof likes.$inferSelect;
export type NewLike = typeof likes.$inferInsert;