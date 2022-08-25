import { Router, Request, Response } from "express";
import { body } from "express-validator";
import { BadRequestError, validateRequest } from "@zpyon/common";
import { User } from "../models/user";
import Jwt from "jsonwebtoken";
import { Buyer } from "../models/buyer";
import { Store } from "../models/store";
import { BuyerCreatedPublisher } from "../event/publisher/buyer";
import { natsWrapper } from "../nats";
import { StoreCreatedPublisher } from "../event/publisher/store";
const router = Router();

router.post(
  "/api/users/signup",
  [
    body("email").isEmail().withMessage("email must be provided"),
    body("password")
      .trim()
      .isLength({ min: 4 })
      .withMessage("password with length at least 4 must be provided"),
    body("username")
      .trim()
      .isLength({ min: 4 })
      .withMessage("username with length at least 4 must be provided"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password, username } = req.body;
    const existingUser = await User.findOne({ email: email });
    if (!!existingUser) {
      throw new BadRequestError("This email is already in use");
    }

    const user = User.build({ email, password, username });
    await user.save();

    const buyer = Buyer.build({ receiver_name: user.username, user: user });
    await buyer.save();

    const store = Store.build({ store_name: user.username, user: user });
    await store.save();

    user.set({ buyer, store });
    await user.save();

    // generate jwt
    const userjwt = Jwt.sign(
      {
        id: user.id,
        email: user.email,
        buyer_id: buyer._id,
        store_id: store._id,
      },
      process.env.JWT_KEY!
    );
    req.session = {
      jwt: userjwt,
    };

    new BuyerCreatedPublisher(natsWrapper.client).publish({
      id: buyer._id,
      address: buyer.address,
      receiver_name: buyer.receiver_name,
      receiver_number: buyer.receiver_number,
      user_id: user._id,
    });

    new StoreCreatedPublisher(natsWrapper.client).publish({
      id: store._id,
      address: store.address,
      store_name: store.store_name,
      couriers: store.couriers,
      store_number: store.store_number,
      user_id: user._id,
    });
    res.status(201).send(user);
  }
);

export { router as SignUpRouter };
