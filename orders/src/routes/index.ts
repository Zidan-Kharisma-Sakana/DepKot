import { requireAuth } from "@zpyon/common";
import express, { Request, Response } from "express";
import { Order } from "../models/order";

const router = express.Router();

router.get(
  "/api/orders/buyer",
  requireAuth,
  async (req: Request, res: Response) => {
    const orders = await Order.find({
      buyer_id: req.currentUser!.buyer_id,
    });
    const order_2 = await Order.find({});
    res.send(orders);
  }
);

router.get(
  "/api/orders/store",
  requireAuth,
  async (req: Request, res: Response) => {
    const orders = await Order.find({
      store_id: req.currentUser!.store_id,
    });

    res.send(orders);
  }
);

export { router as indexOrderRouter };
