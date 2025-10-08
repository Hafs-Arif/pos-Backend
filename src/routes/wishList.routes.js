// wishlist routes
import express from "express";
import {
  getWishLists,
  getWishListById,
  createWishList,
  updateWishList,
  deleteWishList
} from "../controllers/wishLists.controller.js";

const router = express.Router();

router.get("/", getWishLists);
router.get("/:id", getWishListById);
router.post("/", createWishList);
router.put("/:id", updateWishList);
router.delete("/:id", deleteWishList);

export default router;
