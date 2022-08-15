import express from "express";
import "express-async-errors";

import { currentUser, errorHandler, NotFoundError } from "@zpyon/common";
import cookieSession from "cookie-session";
import { CreateProductRouter } from "./routes/create";
import { ShowProductRouter } from "./routes/show";
import { ListProductRouter } from "./routes";
import { UpdateProductRouter } from "./routes/update";

const app = express();
app.set("trust proxy", true); // karena pakai nginx

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  cookieSession({
    signed: false,
    // secure: true,
  })
);
app.use(currentUser);

app.use(CreateProductRouter);
app.use(ShowProductRouter);
app.use(ListProductRouter);
app.use(UpdateProductRouter);

app.all("*", async (req, res) => {
  throw new NotFoundError();
});
app.use(errorHandler);
export { app };
