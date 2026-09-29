import { Router, type IRouter } from "express";
import { getAuth } from "@clerk/express";
import catalogRouter, { createCatalogRouter } from "./catalog";
import healthRouter from "./health";
import { createAccountRouter } from "./account";
import { createInquiriesRouter } from "./inquiries";
import { createRequireStaffAuth, type AuthReader } from "../middlewares/requireStaffAuth";

export function createRouter(options: { authReader?: AuthReader } = {}): IRouter {
  const reader = options.authReader ?? getAuth;
  const router: IRouter = Router();

  router.use(healthRouter);
  router.use(createInquiriesRouter(reader));
  router.use(createAccountRouter(reader));
  router.use(options.authReader ? createCatalogRouter(createRequireStaffAuth(reader)) : catalogRouter);

  return router;
}

export default createRouter();
