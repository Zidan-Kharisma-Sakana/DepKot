import express, { Request, Response } from "express";
import { body } from "express-validator";
import { validateRequest } from "@zpyon/common";
import { Ticket } from "../models/tickets";

const router = express.Router();

router.get("/api/tickets", async (req: Request, res: Response) => {
  // list all tickets

  const tickets = await Ticket.find({
    orderId: undefined,
  });

  res.send(tickets);
});

export { router as ListTicketRouter };
