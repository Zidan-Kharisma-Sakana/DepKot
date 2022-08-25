import express, { Request, Response } from "express";
import { body } from "express-validator";
import {
  NotAuthorizedError,
  NotFoundError,
  requireAuth,
  validateRequest,
} from "@zpyon/common";
import { Buyer } from "../../models/buyer";
import { BuyerUpdatedPublisher } from "../../event/publisher/buyer";
import { natsWrapper } from "../../nats";

const router = express.Router();

router.put(
  "/api/users/buyer/:id",
  requireAuth,
  [
    body("receiver_name").not().isEmpty().withMessage("name is required"),
    body("receiver_number")
      .not()
      .isEmpty()
      .withMessage("receiver number is required"),
    body("address").not().isEmpty().withMessage("address is required"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const buyer_id = req.params.id;
    const { receiver_name, receiver_number, address } = req.body;
    const buyer = await Buyer.findById(buyer_id).populate("user");

    if (!buyer) {
      throw new NotFoundError();
    }
    if (buyer_id !== req.currentUser!.buyer_id) {
      throw new NotAuthorizedError();
    }
    buyer.set({
      receiver_name,
      receiver_number,
      address,
    });

    await buyer.save();

    new BuyerUpdatedPublisher(natsWrapper.client).publish({
      id: buyer._id,
      receiver_name: buyer.receiver_name,
      receiver_number: buyer.receiver_number,
      address: buyer.address,
      user_id: buyer.user._id,
    });
    res.status(204).send();
  }
);

export { router as UpdateProductRouter };
