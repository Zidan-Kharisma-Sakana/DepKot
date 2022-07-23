import express from "express";
import "express-async-errors";

import { currentUser, errorHandler, NotFoundError } from "@zpyon/common";
import cookieSession from "cookie-session";
import { CreateTicketRouter } from "./routes/create";
import { ShowTicketRouter } from "./routes/show";
import { ListTicketRouter } from "./routes";
import { UpdateTicketRouter } from "./routes/update";

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

app.use(CreateTicketRouter);
app.use(ShowTicketRouter);
app.use(ListTicketRouter);
app.use(UpdateTicketRouter);

app.all("*", async (req, res) => {
  throw new NotFoundError();
});
app.use(errorHandler);
export { app };
