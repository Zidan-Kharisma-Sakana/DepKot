import { Router, Request, Response } from "express";
import { body, validationResult } from "express-validator";
const router = Router();

router.post(
  "/api/users/signup",
  [
    body("email").isEmail().withMessage("email must be provided"),
    body("password")
      .trim()
      .isLength({ min: 3 })
      .withMessage("password must be provided"),
  ],
  (req: Request, res: Response) => {
    const err = validationResult(req)
    if(!err.isEmpty()){
      return res.status(400).send(err.array())
    }
    res.send("signup");
  }
);

export { router as SignUpRouter };
