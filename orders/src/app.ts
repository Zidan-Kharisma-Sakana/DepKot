import express from "express";
import "express-async-errors";

import { currentUser, errorHandler, NotFoundError } from "@zpyon/common";
import cookieSession from "cookie-session";
import { showOrderRouter } from "./routes/show";
import { newOrderRouter } from "./routes/new";
import { indexOrderRouter } from "./routes";
import { deleteOrderRouter } from "./routes/delete";

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
app.use(showOrderRouter);
app.use(deleteOrderRouter);
app.use(newOrderRouter);
app.use(indexOrderRouter);

app.all("*", async (req, res) => {
  throw new NotFoundError();
});
app.use(errorHandler);
export { app };
