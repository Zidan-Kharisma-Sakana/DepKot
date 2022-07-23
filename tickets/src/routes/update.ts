import express, { Request, Response } from "express";
import { body } from "express-validator";
import {
  BadRequestError,
  currentUser,
  NotAuthorizedError,
  NotFoundError,
  validateRequest,
} from "@zpyon/common";

const router = express.Router();

router.put(
  "/api/tickets/:id",
  currentUser,
  [
    body("title").not().isEmpty().withMessage("Title is required"),
    body("price")
      .isFloat({ gt: 0 })
      .withMessage("Price must be provided and must be greater than 0"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const ticket: any = req.params.id;

    if (!ticket) {
      throw new NotFoundError();
    }

    if (ticket.orderId) {
      throw new BadRequestError("Cannot Edit a reserved ticket");
    }

    if (ticket.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    res.send(ticket);
  }
);
