import mongoose from "mongoose";
import express, { Request, Response } from "express";
import { validateRequest } from "@zpyon/common";
import { body } from "express-validator";

const router = express.Router();

const EXPIRATION_WINDOW_SECONDS = 15 * 60;

router.post(
  "/api/orders",
  [
    body("ticketId")
      .not()
      .isEmpty()
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
      .withMessage("TicketId must be provided"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    res.status(201).send();
  }
);

export { router as newOrderRouter };
