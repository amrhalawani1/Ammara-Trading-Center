import { Router, type IRouter } from "express";
import rateLimit from "express-rate-limit";
import { z } from "zod";
import { inquiriesTable, db } from "@workspace/db";
import { CreateInquiryBody, CreateInquiryResponse } from "@workspace/api-zod";
import { sendError } from "../lib/http";
import { inquiryReference } from "../lib/inquiry-reference";
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

/** Postgres unique-constraint violation, whether raised directly or wrapped by drizzle. */
const isUniqueViolation = (err: unknown): boolean => {
  const code = (err as { code?: string } | null)?.code ?? (err as { cause?: { code?: string } } | null)?.cause?.code;
  return code === "23505";
};

const REFERENCE_ATTEMPTS = 5;

inquiriesRouter.post("/inquiries", inquiryLimiter, async (req, res): Promise<void> => {
  const parsed = CreateInquiryBody.safeParse(req.body);
  if (!parsed.success || !emailSchema.safeParse(parsed.data.email).success) {
    sendError(res, 400, "Invalid inquiry", parsed.success ? { email: "Invalid email address" } : parsed.error.flatten());
    return;
  }
  const data = parsed.data;

  // A shortlist enquiry carries its lines as structured data; an empty list has nothing to quote.
  const items = data.kind === "shortlist" ? (data.items ?? []) : null;
  if (items && items.length === 0) {
    sendError(res, 400, "Add at least one reference to the shortlist before sending an enquiry");
    return;
  }

  for (let attempt = 1; attempt <= REFERENCE_ATTEMPTS; attempt += 1) {
    const reference = inquiryReference();
    try {
      await db.insert(inquiriesTable).values({
        kind: data.kind,
        name: data.name,
        email: data.email,
        phone: data.phone ?? null,
        company: data.company ?? null,
        projectType: data.projectType ?? null,
        timeline: data.timeline ?? null,
        listName: data.listName ?? null,
        message: data.message,
        reference,
        items: items?.map((item) => ({
          slug: item.slug,
          name: item.name,
          brandName: item.brandName,
          reference: item.reference ?? null,
          variant: item.variant ?? null,
          quantity: item.quantity,
        })) ?? null,
      });
      res.status(201).json(CreateInquiryResponse.parse({ accepted: true, reference }));
      return;
    } catch (err) {
      if (isUniqueViolation(err) && attempt < REFERENCE_ATTEMPTS) continue;
      logger.error({ err }, "Failed to persist inquiry");
      sendError(res, 500, "Unable to submit inquiry");
      return;
    }
  }
});

export default inquiriesRouter;
