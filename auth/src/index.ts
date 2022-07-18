import express from "express";
import 'express-async-errors'
import {
  CurrentUserRouter,
  SignInRouter,
  SignOutRouter,
  SignUpRouter,
} from "./routes";
import { errorHandler } from "./middlewares/error_handler";
import { NotFoundError } from "./errors";

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(SignInRouter);
app.use(SignUpRouter);
app.use(SignOutRouter);
app.use(CurrentUserRouter);
app.all("*", async (req, res) => {
  throw new NotFoundError();
});
app.use(errorHandler);
app.listen(3000, () => {
  console.log("Teta");
});
