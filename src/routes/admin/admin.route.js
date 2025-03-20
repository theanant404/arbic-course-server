
import { Router } from "express";
import { createSubscription } from "../../controllers//admin/subscriptions/subscriptions.controllers.js";
const router = Router();
router.post("/create-subscription", createSubscription);

export default router;