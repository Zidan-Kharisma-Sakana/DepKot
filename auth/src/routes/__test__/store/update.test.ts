import mongoose from "mongoose";
import request from "supertest";
import { app } from "../../../app";

it("store: return 204 when successfully update store info", async () => {
  const { cookie, response } = await global.signinWithResponse();
  const { store } = response.body;

  await request(app)
    .put("/api/users/store/" + store.store_id)
    .set("Cookie", cookie)
    .send({
      receiver_name: "Zidan",
      receiver_number: "0856",
      address: "BLABLA",
    })
    .expect(204);
});

it("store: return 404 when store isnt found", async () => {
  const { cookie, response } = await global.signinWithResponse();
  const { store } = response.body;

  const randomMongoId = new mongoose.Types.ObjectId();
  await request(app)
    .put("/api/users/buyer/" + randomMongoId)
    .set("Cookie", cookie)
    .send({
      receiver_name: "Zidan",
      receiver_number: "0856",
      address: "BLABLA",
    })
    .expect(404);
});

it("store: return 401 when trying to update illegitimately", async () => {
  const { cookie, response } = await global.signinWithResponse();
  const { store } = response.body;

  await request(app)
    .put("/api/users/store/" + store.store_id)
    .send({
      receiver_name: "Zidan",
      receiver_number: "0856",
      address: "BLABLA",
    })
    .expect(401);
});
