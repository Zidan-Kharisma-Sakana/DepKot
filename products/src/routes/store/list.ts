import { NotFoundError } from "@zpyon/common";
import express, { Request, Response } from "express";
import { Store } from "../../models/store";

const router = express.Router();

router.get(
  "/api/products/store/list/:id",
  async (req: Request, res: Response) => {
    const store_id = req.params.id;
    const store = await Store.findById(store_id).populate("products");
    if (!store) {
      throw new NotFoundError();
    }
    res.status(200).send(store.products);
  }
);

export { router as ListStoreRouter };
