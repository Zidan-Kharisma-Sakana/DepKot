import mongoose from "mongoose";
import request from "supertest";
import { app } from "../../../app";

it("buyer: return 204 when successfully update buyer info", async () => {
  const { cookie, response } = await global.signinWithResponse();
  const { buyer } = response.body;

  await request(app)
    .put("/api/users/buyer/" + buyer.buyer_id)
    .set("Cookie", cookie)
    .send({
      receiver_name: "Zidan",
      receiver_number: "0856",
      address: "BLABLA",
    })
    .expect(204);
});

it("buyer: return 404 when buyer isnt found", async () => {
  const { cookie, response } = await global.signinWithResponse();
  const { buyer } = response.body;

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

it("buyer: return 401 when trying to update illegitimately", async () => {
  const { cookie, response } = await global.signinWithResponse();
  const { buyer } = response.body;

  await request(app)
    .put("/api/users/buyer/" + buyer.buyer_id)
    .send({
      receiver_name: "Zidan",
      receiver_number: "0856",
      address: "BLABLA",
    })
    .expect(401);
});
