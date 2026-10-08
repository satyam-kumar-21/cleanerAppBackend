import express from "express";
import { getMe, updateMe, deleteMe } from "../controllers/user.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

// All user routes require authentication
router.use(authMiddleware);

router.get("/me", getMe);       // GET    /api/v1/users/me
router.patch("/me", updateMe);  // PATCH  /api/v1/users/me
router.delete("/me", deleteMe); // DELETE /api/v1/users/me

export default router;