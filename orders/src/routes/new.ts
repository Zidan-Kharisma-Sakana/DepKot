import mongoose from "mongoose";
import express, { Request, Response } from "express";
import {
  BadRequestError,
  NotFoundError,
  OrderStatus,
  requireAuth,
  validateRequest,
} from "@zpyon/common";
import { body } from "express-validator";
import { Order } from "../models/order";
import { Product } from "../models/product";

const router = express.Router();

const EXPIRATION_WINDOW_SECONDS = 3 * 60 * 60;

router.post(
  "/api/orders",
  requireAuth,
  [
    body("product_id")
      .not()
      .isEmpty()
      .withMessage("product_id must be provided"),
    body("courier").not().isEmpty().withMessage("Courier must be provided"),
    body("qty").isFloat({ gt: 0 }).withMessage("Qty must be greater than 0"),
    body("receiver").not().isEmpty().withMessage("receiver must be provided"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { product_id, courier, qty, receiver } = req.body;
    const product = await Product.findById(product_id).populate("store");
    if (!product) {
      throw new NotFoundError();
    }

    const { store } = product;

    const expired_time = new Date();
    expired_time.setSeconds(
      expired_time.getSeconds() + EXPIRATION_WINDOW_SECONDS
    );

    const shipping_fee = 10; // TODO: Implement rajaongkir api
    const order = Order.build({
      sender: {
        store_id: store._id,
        sender_name: store.store_name,
        sender_address: store.address,
        sender_number: store.store_number,
      },
      receiver: {
        ...receiver,
        buyer_id: req.currentUser!.buyer_id, //WTF IS THIS!!!
      },
      item: {
        product_id: product._id,
        item_name: product.title,
        item_price: product.price,
      },
      courier,
      qty,
      shipping_fee,
      status: OrderStatus.Created,
      expired_time,
    });
    await order.save();

    res.status(201).send(order);
  }
);

export { router as newOrderRouter };
