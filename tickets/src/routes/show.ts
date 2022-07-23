import express, { Request, Response } from "express";
import { body } from "express-validator";
import { NotFoundError, validateRequest } from "@zpyon/common";

const router = express.Router();

router.post("/api/tickets/:id", async (req: Request, res: Response) => {
  const ticket = req.params.id;

  if (!ticket) {
    throw new NotFoundError();
  }

  res.send(ticket);
});
