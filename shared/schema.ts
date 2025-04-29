import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Payment form schema
export const paymentFormSchema = z.object({
  firstName: z.string().min(1, { message: "First name is required" }),
  lastName: z.string().min(1, { message: "Last name is required" }),
  cardNumber: z.string()
    .min(13, { message: "Card number must be at least 13 digits" })
    .max(19, { message: "Card number must be at most 19 digits" })
    .regex(/^[0-9]+$/, { message: "Card number must contain only digits" }),
  expiry: z.string()
    .regex(/^(0[1-9]|1[0-2])\/([0-9]{2})$/, { message: "Expiry date must be in MM/YY format" }),
  cvv: z.string()
    .min(3, { message: "CVV must be at least 3 digits" })
    .max(4, { message: "CVV must be at most 4 digits" })
    .regex(/^[0-9]+$/, { message: "CVV must contain only digits" }),
  nameOnCard: z.string().min(1, { message: "Name on card is required" }),
  address: z.string().min(1, { message: "Address is required" }),
});

export type PaymentFormData = z.infer<typeof paymentFormSchema>;
