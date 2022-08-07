import express, { Request, Response } from "express";
import {
  NotFoundError,
  NotAuthorizedError,
} from "@zpyon/common";

const router = express.Router();

router.delete(
  "/api/orders/:orderId",
  async (req: Request, res: Response) => {
    res.status(204).send();
  }
);

export { router as deleteOrderRouter };
