import {
  pgTable,
  text,
  uuid,
  boolean,
  integer,
  timestamp,
  index,
} from "drizzle-orm/pg-core";

export const savedJobs = pgTable(
  "saved_jobs",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id").notNull(),
    title: text("title").notNull(),
    company: text("company").default(""),
    location: text("location").default(""),
    url: text("url").default(""),
    platform: text("platform").default(""),
    status: text("status").default("saved"),
    salary: text("salary").default(""),
    remote: boolean("remote").default(false),
    tags: text("tags").array().default([]),
    notes: text("notes").default(""),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [index("saved_jobs_user_id_idx").on(t.userId)],
);

export const freelanceOffers = pgTable(
  "freelance_offers",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id").notNull(),
    title: text("title").notNull(),
    client: text("client").default(""),
    platform: text("platform").default(""),
    budget: text("budget").default(""),
    currency: text("currency").default("USD"),
    status: text("status").default("new"),
    description: text("description").default(""),
    url: text("url").default(""),
    deadline: text("deadline").default(""),
    tags: text("tags").array().default([]),
    notes: text("notes").default(""),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [index("freelance_offers_user_id_idx").on(t.userId)],
);

export const myServices = pgTable(
  "my_services",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id").notNull(),
    title: text("title").notNull(),
    platform: text("platform").default(""),
    url: text("url").default(""),
    category: text("category").default(""),
    price: text("price").default(""),
    currency: text("currency").default("USD"),
    status: text("status").default("active"),
    description: text("description").default(""),
    deliveryDays: integer("delivery_days").default(3),
    tags: text("tags").array().default([]),
    notes: text("notes").default(""),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [index("my_services_user_id_idx").on(t.userId)],
);
