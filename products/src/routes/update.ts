import express, { Request, Response } from "express";
import { body } from "express-validator";
import {
  NotAuthorizedError,
  NotFoundError,
  validateRequest,
} from "@zpyon/common";
import { requireAuth } from "@zpyon/common";

import { Product } from "../models/product";
import { natsWrapper } from "../nats";
import { ProductUpdatedPublisher } from "../events/publisher/product-updated";

const router = express.Router();

router.put(
  "/api/products/:id",
  requireAuth,
  [
    body("title").not().isEmpty().withMessage("Title is required"),
    body("price")
      .isFloat({ gt: 0 })
      .withMessage("Price must be greater than 0"),
    body("description").not().isEmpty().withMessage("Description is required"),
    body("qty")
      .isFloat({ gt: 0 })
      .withMessage("Quantity must be greater than 0"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    console.log(req.currentUser);
    const product = await Product.findById(req.params.id).populate("store");
    const { title, price, description, qty } = req.body;
    if (!product) {
      throw new NotFoundError();
    }
    if (product.store._id.toString() !== req.currentUser!.store_id) {
      throw new NotAuthorizedError();
    }

    product.set({
      title,
      price,
      description,
      qty,
    });

    await product.save();

    new ProductUpdatedPublisher(natsWrapper.client).publish({
      id: product._id,
      price:product.price,
      title: product.title, 
      userId: product.store._id, 
      version: product.__v, 
    })

    res.send(product);
  }
);

export { router as UpdateProductRouter };
