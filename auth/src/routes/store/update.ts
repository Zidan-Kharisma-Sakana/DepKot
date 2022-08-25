import express, { Request, Response } from "express";
import { body } from "express-validator";
import {
  NotAuthorizedError,
  NotFoundError,
  requireAuth,
  validateRequest,
} from "@zpyon/common";
import { Store } from "../../models/store";
import { StoreUpdatedPublisher } from "../../event/publisher/store";
import { natsWrapper } from "../../nats";

const router = express.Router();

router.put(
  "/api/users/store/:id",
  requireAuth,
  [
    body("store_name").not().isEmpty().withMessage("name is required"),
    body("store_number")
      .not()
      .isEmpty()
      .withMessage("store number is required"),
    body("couriers").isArray().withMessage("couriers is required"),
    body("address").not().isEmpty().withMessage("address is required"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const store_id = req.params.id;
    const { store_name, store_number, couriers, address } = req.body;
    const store = await Store.findById(store_id).populate("user");
    if (!store) {
      throw new NotFoundError();
    }
    if (store_id !== req.currentUser!.store_id) {
      throw new NotAuthorizedError();
    }
    store.set({
      store_name,
      store_number,
      couriers,
      address,
    });

    await store.save();
    new StoreUpdatedPublisher(natsWrapper.client).publish({
      id: store._id,
      store_name: store.store_name,
      store_number: store.store_number,
      address: store.address,
      couriers: store.couriers,
      user_id: store.user._id,
    });
    res.status(204).send();
  }
);

export { router as UpdateStoreRouter };
