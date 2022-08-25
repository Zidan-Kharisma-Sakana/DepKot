import mongoose from "mongoose";
import request from "supertest";
import { app } from "../../../app";
import { Store } from "../../../models/store";
import { natsWrapper } from "../../../nats";

const defaultBuyer = {
  receiver_name: "X",
  receiver_number: "0872822",
  address: "Jln X"
};
jest.setTimeout(10000);

it("buyer: return 204 when successfully update buyer info", async () => {
  const { cookie, response } = await global.signinWithResponse();
  const { buyer } = response.body;
  const res = await request(app)
    .put("/api/users/buyer/" + buyer.buyer_id)
    .set("Cookie", cookie)
    .send(defaultBuyer);
  expect(res.statusCode).toEqual(204);
  expect(natsWrapper.client.publish).toBeCalledTimes(3)
});

it("buyer: return 404 when buyer isnt found", async () => {
  const { cookie } = await global.signinWithResponse();

  const randomMongoId = new mongoose.Types.ObjectId();
  const res = await request(app)
    .put("/api/users/buyer/" + randomMongoId)
    .set("Cookie", cookie)
    .send(defaultBuyer)
  expect(res.statusCode).toEqual(404)
});

it("buyer: return 401 when trying to update illegitimately", async () => {
  const { response } = await global.signinWithResponse();
  const { buyer } = response.body;

  await request(app)
  .put("/api/users/buyer/" + buyer.buyer_id)
  .send(defaultBuyer)
    .expect(401);
});
