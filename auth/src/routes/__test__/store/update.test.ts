import mongoose from "mongoose";
import request from "supertest";
import { app } from "../../../app";
import Jwt from "jsonwebtoken";
import { Store } from "../../../models/store";
import { natsWrapper } from "../../../nats";

const defaultStore = {
  store_name: "Tokopedia",
  store_number: "12345678",
  address: "Jl. blablabla",
  couriers: ["JNE"],
};
jest.setTimeout(10000);

it("store: return 204 when successfully update store info", async () => {
  const { cookie, response } = await global.signinWithResponse();
  const { store } = response.body;
  const res = await request(app)
    .put("/api/users/store/" + store.store_id)
    .set("Cookie", cookie)
    .send(defaultStore);

  expect(res.statusCode).toEqual(204);
  const toko = await Store.findById(store.store_id);
  expect(toko?.store_name).toEqual(defaultStore.store_name);
  expect(toko?.couriers).toEqual(defaultStore.couriers);
  expect(natsWrapper.client.publish).toBeCalledTimes(3);
});

it("store: return 404 when store isnt found", async () => {
  const { cookie } = await global.signinWithResponse();

  const randomMongoId = new mongoose.Types.ObjectId();
  await request(app)
    .put("/api/users/store/" + randomMongoId)
    .set("Cookie", cookie)
    .send(defaultStore)
    .expect(404);
});

it("store: return 401 when trying to update illegitimately", async () => {
  const { response } = await global.signinWithResponse();
  const { store } = response.body;

  await request(app)
    .put("/api/users/store/" + store.store_id)
    .send(defaultStore)
    .expect(401);
});
