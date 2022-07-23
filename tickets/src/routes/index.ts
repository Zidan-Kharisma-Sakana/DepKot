import express, { Request, Response } from "express";
import { body } from "express-validator";
import { validateRequest } from "@zpyon/common";

const router = express.Router();

router.get("/api/tickets", async (req: Request, res: Response) => {
  // list all tickets

  res.send();
});
