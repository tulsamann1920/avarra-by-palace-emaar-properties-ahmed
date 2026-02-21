import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertLeadSchema } from "@shared/schema";
import { getResendClient } from "./resend";

const NOTIFICATION_EMAIL = "info@thepropertylook.com";
const FROM_EMAIL = "t.mann@develop-propertylook.com";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  app.post("/api/leads", async (req, res) => {
    try {
      const result = insertLeadSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: result.error.flatten() });
      }
      const lead = await storage.createLead(result.data);

      try {
        console.log("Attempting to get Resend client...");
        const { client } = await getResendClient();
        console.log("Got Resend client, using fromEmail:", FROM_EMAIL);
        
        const emailResult = await client.emails.send({
          from: FROM_EMAIL,
          to: NOTIFICATION_EMAIL,
          subject: `New Lead: ${lead.name} - ${lead.propertyId}`,
          html: `
            <h2>New Property Inquiry</h2>
            <p><strong>Name:</strong> ${lead.name}</p>
            <p><strong>Email:</strong> ${lead.email}</p>
            <p><strong>Phone:</strong> ${lead.phone || 'Not provided'}</p>
            <hr/>
            <h3>Property Interest</h3>
            <p><strong>Property:</strong> ${lead.propertyId}</p>
            <p><strong>Price:</strong> AED ${lead.propertyPrice.toLocaleString()}</p>
            <hr/>
            <h3>Calculator Inputs</h3>
            <p><strong>Current Rent:</strong> AED ${lead.currentRent.toLocaleString()}/month</p>
            <p><strong>Deposit Available:</strong> AED ${lead.depositAmount.toLocaleString()}</p>
            <p><strong>Timeframe:</strong> ${lead.yearsSelected} years</p>
            <p><strong>Projected Wealth Gap:</strong> AED ${lead.wealthGap.toLocaleString()}</p>
          `
        });
        console.log("Email send result:", JSON.stringify(emailResult));
      } catch (emailError: any) {
        console.error("Failed to send notification email:", emailError?.message || emailError);
        console.error("Email error details:", JSON.stringify(emailError, null, 2));
      }

      res.status(201).json(lead);
    } catch (error) {
      console.error("Failed to create lead:", error);
      res.status(500).json({ error: "Failed to submit your details" });
    }
  });

  app.get("/api/leads", async (_req, res) => {
    try {
      const leads = await storage.getLeads();
      res.json(leads);
    } catch (error) {
      console.error("Failed to fetch leads:", error);
      res.status(500).json({ error: "Failed to fetch leads" });
    }
  });

  return httpServer;
}
