import express, { Request, Response } from "express";
import { body } from "express-validator";
import { NotFoundError, validateRequest } from "@zpyon/common";
import { requireAuth } from "@zpyon/common";
import { Product } from "../models/product";
import { Store } from "../models/store";
import { ProductCreatedPublisher } from "../events/publisher/product-created";
import { natsWrapper } from "../nats";
const router = express.Router();

router.post(
  "/api/products",
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
    const { title, price, qty, description } = req.body;
    const store_id = req.currentUser?.store_id ?? "";
    const store = await Store.findById(store_id);
    if (!store) {
      throw new Error("Store isn't found");
    }
    const product = Product.build({
      store,
      title,
      price,
      qty,
      description,
    });
    await product.save();
    const store_products = store.products;
    store_products.push(product._id);
    store.set({
      products: store_products,
    });

    await store.save();
    new ProductCreatedPublisher(natsWrapper.client).publish({
      id: product._id,
      price: product.price,
      title: product.title,
      storeId: product.store._id,
      qty: product.qty,
      description: product.description,
    });

    res.status(201).send(product);
  }
);

export { router as CreateProductRouter };
