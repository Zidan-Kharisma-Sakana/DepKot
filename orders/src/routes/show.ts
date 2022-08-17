import express, { Request, Response } from "express";
import { requireAuth, NotFoundError, NotAuthorizedError } from "@zpyon/common";
import { Order } from "../models/order";

const router = express.Router();

router.get(
  "/api/orders/:order_id",
  requireAuth,
  async (req: Request, res: Response) => {
    const order = await Order.findById(req.params.order_id);

    if (!order) {
      throw new NotFoundError();
    }
    if (
      order.buyer_id.toString() !== req.currentUser!.buyer_id &&
      order.store_id.toString() !== req.currentUser!.store_id
    ) {
      throw new NotAuthorizedError();
    }

    res.send(order);
  }
);

export { router as showOrderRouter };
