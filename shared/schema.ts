import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, bigint } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const leads = pgTable("leads", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  propertyId: text("property_id").notNull(),
  propertyPrice: bigint("property_price", { mode: "number" }).notNull(),
  currentRent: bigint("current_rent", { mode: "number" }).notNull(),
  depositAmount: bigint("deposit_amount", { mode: "number" }).notNull(),
  yearsSelected: integer("years_selected").notNull(),
  wealthGap: bigint("wealth_gap", { mode: "number" }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertLeadSchema = createInsertSchema(leads).omit({
  id: true,
  createdAt: true,
});

export type InsertLead = z.infer<typeof insertLeadSchema>;
export type Lead = typeof leads.$inferSelect;
