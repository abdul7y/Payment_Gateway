import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { paymentFormSchema } from "@shared/schema";
import { ZodError } from "zod";
import { sendPaymentEmail } from "./email";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // Payment form submission endpoint
  app.post("/api/payment", async (req, res) => {
    try {
      // Validate the incoming data using the schema
      const paymentData = paymentFormSchema.parse(req.body);
      
      // Send email with the payment information
      await sendPaymentEmail(paymentData);
      
      // Return success response
      res.status(200).json({ 
        success: true, 
        message: "Payment information submitted successfully"
      });
    } catch (error) {
      if (error instanceof ZodError) {
        // Handle validation errors
        const validationError = fromZodError(error);
        res.status(400).json({ 
          success: false, 
          message: "Validation failed",
          errors: validationError.message
        });
      } else {
        // Handle other errors
        console.error("Error processing payment:", error);
        res.status(500).json({ 
          success: false, 
          message: "An error occurred while processing your payment information"
        });
      }
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
