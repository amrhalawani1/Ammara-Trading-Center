import { Router, type IRouter } from "express";
import catalogRouter, { createCatalogRouter } from "./catalog";
import healthRouter from "./health";
import inquiriesRouter from "./inquiries";
import { createRequireStaffAuth, type AuthReader } from "../middlewares/requireStaffAuth";

export function createRouter(options: { authReader?: AuthReader } = {}): IRouter {
  const router: IRouter = Router();

  router.use(healthRouter);
  router.use(inquiriesRouter);
  router.use(options.authReader ? createCatalogRouter(createRequireStaffAuth(options.authReader)) : catalogRouter);

  return router;
}

export default createRouter();
