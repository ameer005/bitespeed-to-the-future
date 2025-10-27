import express from "express";
import { identifyCustomer } from "../controllers/identify.controller";

const router = express.Router();

router.route("/").post(identifyCustomer);

export { router as IdentityRoutes };
