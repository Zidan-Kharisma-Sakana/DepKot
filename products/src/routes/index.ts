import express, { Request, Response } from "express";
import { body } from "express-validator";
import { validateRequest } from "@zpyon/common";
import { Product } from "../models/product";

const router = express.Router();

router.get("/api/products", async (req: Request, res: Response) => {
  // list all products

  const product = await Product.find({});
  res.send(product);
});

export { router as ListProductRouter };
