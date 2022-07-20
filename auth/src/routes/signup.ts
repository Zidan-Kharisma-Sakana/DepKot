import { Router, Request, Response } from "express";
import { body, validationResult } from "express-validator";
import { BadRequestError } from "../errors";
import { User } from "../models/user";
import Jwt from "jsonwebtoken";
const router = Router();

router.post(
  "/api/users/signup",
  [
    body("email").isEmail().withMessage("email must be provided"),
    body("password")
      .trim()
      .isLength({ min: 4 })
      .withMessage("password must be provided"),
  ],
  async (req: Request, res: Response) => {
    const err = validationResult(req);
    if (!err.isEmpty()) {
      return res.status(400).send(err.array());
    }

    const { email, password } = req.body;
    const existingUser = await User.findOne({ email: email });
    if (!!existingUser) {
      throw new BadRequestError("This email is already in use");
    }

    const user = User.build({ email, password });
    await user.save();

    // generate jwt
    const userjwt = Jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      "NicoNicoNii"
    );

    console.log(userjwt);

    req.session = {
      jwt: userjwt,
    };

    res.status(201).send(user);
  }
);

export { router as SignUpRouter };
