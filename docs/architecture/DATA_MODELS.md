# 💾 Data Models and Schema Architecture

> [!NOTE]
> Dev Studio defines its database models under `shared/schema/` using Drizzle ORM schemas, which are aggregated and re-exported in `shared/schema.ts`. This document provides a reference of the PostgreSQL table structures, field definitions, indexes, and relations.

---

## 🗃️ Core Entity Schemas

### 🧑‍💻 1. Authentication User (`auth_users`)
Stores user profiles, login credentials, and OAuth tokens.

```typescript
export const authUsers = pgTable("auth_users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").unique(),
  passwordHash: text("password_hash"),
  googleId: text("google_id").unique(),
  displayName: text("display_name"),
  avatarUrl: text("avatar_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
```
- **Indexes**:
  - `auth_users_email_idx` on `email`
  - `auth_users_google_id_idx` on `googleId`

---

### 📝 2. Prompt Template (`prompts`)
Contains versioned prompts, customizable template variables, and usage analytics.

```typescript
export const prompts = pgTable("prompts", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  category: text("category"),
  tags: text("tags").array().default([]),
  body: text("body").notNull(),
  variables: text("variables").array().default([]),
  model: text("model"),
  favorite: boolean("favorite").default(false),
  usageCount: integer("usage_count").default(0),
  versions: jsonb("versions").default([]),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
```
- **Indexes**:
  - `prompts_user_id_idx` on `userId`

---

### 🤖 3. AI Agent (`agents`)
Configures autonomous LLM assistants with system prompts, parameters, and tool access list.

```typescript
export const agents = pgTable("agents", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id").notNull(),
  name: text("name").notNull(),
  role: text("role"),
  systemPrompt: text("system_prompt").notNull(),
  tools: text("tools").array().default([]),
  model: text("model"),
  temperature: real("temperature").default(0.7),
  status: text("status").default("draft"),
  tags: text("tags").array().default([]),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
```
- **Indexes**:
  - `agents_user_id_idx` on `userId`

---

### 🧩 4. Reusable Code Component (`components`)
Holds code blocks with pre-defined styles, category filters, and required package dependency tracking.

```typescript
export const components = pgTable("components", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id").notNull(),
  name: text("name").notNull(),
  description: text("description"),
  category: text("category"),
  tags: text("tags").array().default([]),
  code: text("code").notNull(),
  dependencies: text("dependencies").array().default([]),
  favorite: boolean("favorite").default(false),
  usageCount: integer("usage_count").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
```
- **Indexes**:
  - `components_user_id_idx` on `userId`

---

### 📦 5. Starter Project Template (`templates`)
Describes complete technology stack lists, folder directory layouts, and configuration notes.

```typescript
export const templates = pgTable("templates", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id").notNull(),
  name: text("name").notNull(),
  description: text("description"),
  stack: text("stack").array().default([]),
  tags: text("tags").array().default([]),
  structure: text("structure"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
```
- **Indexes**:
  - `templates_user_id_idx` on `userId`

---

### 📎 6. Code Snippet (`snippets`)
Organizes smaller, non-component code templates by language and title tags.

```typescript
export const snippets = pgTable("snippets", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id").notNull(),
  title: text("title").notNull(),
  language: text("language").notNull(),
  description: text("description"),
  code: text("code").notNull(),
  tags: text("tags").array().default([]),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
```
- **Indexes**:
  - `snippets_user_id_idx` on `userId`

---

### 🧠 7. Interview Q&A Bank (`interview_questions`)
A repository of interview preparation assets containing questions, target answers, difficulties, and tech domains.

```typescript
export const interviewQuestions = pgTable("interview_questions", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id"), // null if global seeded questions
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  difficulty: text("difficulty").default("mid"),
  domain: text("domain").notNull(),
  tags: text("tags").array().default([]),
  isGlobal: boolean("is_global").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
```
- **Indexes**:
  - `interview_questions_domain_idx` on `domain`
  - `interview_questions_user_id_idx` on `userId`

---

## 📈 Database Best Practices

> [!TIP]
> - **Self-Generating Identifiers**: All main schema tables use PostgreSQL `gen_random_uuid()` to assign strong primary keys automatically at write time.
> - **Date Handlers**: Database row creations default their `created_at` and `updated_at` timestamps using database-native `NOW()`.
> - **Automatic Query Indexing**: Every single table is index-optimized on the `user_id` query criteria to guarantee instant lookup speeds even as data tables scale.
