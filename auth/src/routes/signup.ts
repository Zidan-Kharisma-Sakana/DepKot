import { Router, Request, Response } from "express";
import { body } from "express-validator";
import { BadRequestError, validateRequest } from "@zpyon/common";
import { User } from "../models/user";
import Jwt from "jsonwebtoken";
import { Buyer } from "../models/buyer";
import { Store } from "../models/store";
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
      },
      process.env.JWT_KEY!
    );
    req.session = {
      jwt: userjwt,
    };
    res.status(201).send(user);
  }
);

export { router as SignUpRouter };
