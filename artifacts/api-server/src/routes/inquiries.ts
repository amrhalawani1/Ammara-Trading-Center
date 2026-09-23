import { Router, type IRouter } from "express";
import rateLimit from "express-rate-limit";
import { z } from "zod";
import { inquiriesTable, db } from "@workspace/db";
import { CreateInquiryBody, CreateInquiryResponse } from "@workspace/api-zod";
import { sendError } from "../lib/http";
import { logger } from "../lib/logger";

const emailSchema = z.string().email();

const inquiryLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: { error: "Too many inquiries. Please try again later." },
});

const inquiriesRouter: IRouter = Router();

inquiriesRouter.post("/inquiries", inquiryLimiter, async (req, res): Promise<void> => {
  const parsed = CreateInquiryBody.safeParse(req.body);
  if (!parsed.success || !emailSchema.safeParse(parsed.data.email).success) {
    sendError(res, 400, "Invalid inquiry", parsed.success ? { email: "Invalid email address" } : parsed.error.flatten());
    return;
  }

  try {
    await db.insert(inquiriesTable).values({
      kind: parsed.data.kind,
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone ?? null,
      company: parsed.data.company ?? null,
      projectType: parsed.data.projectType ?? null,
      message: parsed.data.message,
    });
  } catch (err) {
    logger.error({ err }, "Failed to persist inquiry");
    sendError(res, 500, "Unable to submit inquiry");
    return;
  }

  res.status(201).json(CreateInquiryResponse.parse({ accepted: true }));
});

export default inquiriesRouter;
