// return routes
import express from "express";
import {
  getReturns,
  getReturnById,
  createReturn,
  updateReturn,
  deleteReturn
} from "../controllers/returns.controller.js";

const router = express.Router();

router.get("/", getReturns);
router.get("/:id", getReturnById);
router.post("/", createReturn);
router.put("/:id", updateReturn);
router.delete("/:id", deleteReturn);

export default router;
