import { Router, type IRouter, type RequestHandler } from "express";
import rateLimit from "express-rate-limit";
import { and, desc, eq, isNull, sql } from "drizzle-orm";
import { getAuth } from "@clerk/express";
import {
  db,
  inquiriesTable,
  tradeProfilesTable,
  tradeShortlistsTable,
  type TradeShortlistState,
} from "@workspace/db";
import {
  GetAccountInquiriesResponse,
  GetAccountProfileResponse,
  GetAccountShortlistsResponse,
  PutAccountProfileBody,
  PutAccountProfileResponse,
  PutAccountShortlistsBody,
  PutAccountShortlistsResponse,
} from "@workspace/api-zod";
import { clerkUserIdFromAuth } from "../lib/clerk-user";
import { DEFAULT_LIST_NAME, mergeShortlistStates } from "../lib/shortlist-merge";
import { sendError } from "../lib/http";
import { createRequireSignedIn } from "../middlewares/requireSignedIn";
import type { AuthReader } from "../middlewares/requireStaffAuth";

const accountLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 60,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: { error: "Too many account requests. Please try again later." },
});

const emptyShortlists = (): TradeShortlistState => {
  const id = "default";
  return {
    version: 1,
    lists: [{ id, name: DEFAULT_LIST_NAME, createdAt: new Date().toISOString(), items: [] }],
    activeListId: id,
  };
};

const toProfile = (row: typeof tradeProfilesTable.$inferSelect) =>
  GetAccountProfileResponse.parse({
    clerkUserId: row.clerkUserId,
    email: row.email,
    name: row.name ?? null,
    company: row.company ?? null,
    role: row.role ?? null,
  });

async function claimGuestInquiries(clerkUserId: string, email: string): Promise<void> {
  const normalised = email.trim().toLowerCase();
  if (!normalised) return;
  await db
    .update(inquiriesTable)
    .set({ clerkUserId })
    .where(and(sql`lower(${inquiriesTable.email}) = ${normalised}`, isNull(inquiriesTable.clerkUserId)));
}

export function createAccountRouter(authReader: AuthReader = getAuth): IRouter {
  const router: IRouter = Router();
  const signedIn = createRequireSignedIn(authReader);

  const userIdOf = (req: Parameters<RequestHandler>[0]): string => clerkUserIdFromAuth(authReader(req))!;

  router.use("/account", accountLimiter, signedIn);

  router.get("/account/profile", async (req, res): Promise<void> => {
    const clerkUserId = userIdOf(req);
    const [row] = await db.select().from(tradeProfilesTable).where(eq(tradeProfilesTable.clerkUserId, clerkUserId));
    if (!row) {
      res.json(
        GetAccountProfileResponse.parse({
          clerkUserId,
          email: "",
          name: null,
          company: null,
          role: null,
        }),
      );
      return;
    }
    if (row.email) await claimGuestInquiries(clerkUserId, row.email);
    res.json(toProfile(row));
  });

  router.put("/account/profile", async (req, res): Promise<void> => {
    const clerkUserId = userIdOf(req);
    const parsed = PutAccountProfileBody.safeParse(req.body);
    if (!parsed.success) {
      sendError(res, 400, "Invalid profile", parsed.error.flatten());
      return;
    }
    const email = parsed.data.email.trim().toLowerCase();
    const values = {
      clerkUserId,
      email,
      name: parsed.data.name?.trim() || null,
      company: parsed.data.company?.trim() || null,
      role: parsed.data.role ?? null,
      updatedAt: new Date(),
    };
    const [row] = await db
      .insert(tradeProfilesTable)
      .values(values)
      .onConflictDoUpdate({
        target: tradeProfilesTable.clerkUserId,
        set: { email: values.email, name: values.name, company: values.company, role: values.role, updatedAt: values.updatedAt },
      })
      .returning();
    await claimGuestInquiries(clerkUserId, email);
    res.json(toProfile(row!));
  });

  router.get("/account/shortlists", async (req, res): Promise<void> => {
    const clerkUserId = userIdOf(req);
    const [row] = await db.select().from(tradeShortlistsTable).where(eq(tradeShortlistsTable.clerkUserId, clerkUserId));
    res.json(GetAccountShortlistsResponse.parse(row?.state ?? emptyShortlists()));
  });

  router.put("/account/shortlists", async (req, res): Promise<void> => {
    const clerkUserId = userIdOf(req);
    const parsed = PutAccountShortlistsBody.safeParse(req.body);
    if (!parsed.success) {
      sendError(res, 400, "Invalid shortlists", parsed.error.flatten());
      return;
    }
    const incoming = parsed.data.state as TradeShortlistState;
    const [existing] = await db.select().from(tradeShortlistsTable).where(eq(tradeShortlistsTable.clerkUserId, clerkUserId));
    const next = parsed.data.merge && existing ? mergeShortlistStates(incoming, existing.state) : incoming;
    const [row] = await db
      .insert(tradeShortlistsTable)
      .values({ clerkUserId, state: next, updatedAt: new Date() })
      .onConflictDoUpdate({
        target: tradeShortlistsTable.clerkUserId,
        set: { state: next, updatedAt: new Date() },
      })
      .returning();
    res.json(PutAccountShortlistsResponse.parse(row!.state));
  });

  router.get("/account/inquiries", async (req, res): Promise<void> => {
    const clerkUserId = userIdOf(req);
    const rows = await db
      .select()
      .from(inquiriesTable)
      .where(eq(inquiriesTable.clerkUserId, clerkUserId))
      .orderBy(desc(inquiriesTable.createdAt));
    res.json(
      GetAccountInquiriesResponse.parse(
        rows.map((row) => ({
          id: row.id,
          kind: row.kind,
          reference: row.reference ?? null,
          status: row.status,
          listName: row.listName ?? null,
          message: row.message,
          createdAt: row.createdAt.toISOString(),
          statusUpdatedAt: row.statusUpdatedAt?.toISOString() ?? null,
        })),
      ),
    );
  });

  return router;
}

export default createAccountRouter();
