import express, { Request, Response } from "express";
import {
  NotFoundError,
  NotAuthorizedError,
  OrderStatus,
  requireAuth,
  validateRequest,
} from "@zpyon/common";
import { Order } from "../models/order";
import { body } from "express-validator";

const router = express.Router();

router.put(
  "/api/orders/:orderId",
  requireAuth,
  [
    body("status")
      .not()
      .isEmpty()
      .custom((status) =>
        [
          OrderStatus.Accepted,
          OrderStatus.Cancelled,
          OrderStatus.Complete,
        ].includes(status)
      )
      .withMessage("Invalid Status"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { orderId } = req.params;
    const status = req.body.status as OrderStatus;

    const order = await Order.findById(orderId);

    if (!order) {
      throw new NotFoundError();
    }
    if (
      order.buyer_id.toString() !== req.currentUser!.buyer_id &&
      order.store_id.toString() !== req.currentUser!.store_id
    ) {
      throw new NotAuthorizedError();
    }

    order.status = status;
    await order.save();

    res.status(204).send();
  }
);

export { router as updateOrderRouter };
