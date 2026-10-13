import { Router } from "express";
import {
  confirmStripeCheckout,
  createStripeCheckout,
  getSubscription,
  handleStripeCheckoutReturn,
} from "../controllers/subscription.controller.js";
import authenticate from "../middleware/auth.middleware.js";

const router = Router();

router.get("/stripe/return", handleStripeCheckoutReturn);
router.use(authenticate);
router.get("/me", getSubscription);
router.post("/stripe/checkout", createStripeCheckout);
router.post("/stripe/confirm", confirmStripeCheckout);

export default router;
