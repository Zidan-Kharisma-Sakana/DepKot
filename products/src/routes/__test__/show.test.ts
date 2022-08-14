import mongoose from "mongoose";
import request from "supertest";
import { app } from "../../app";
jest.mock('../../nats.ts')

it("show a ticket: return 404 for unidentified ticket", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();

  await request(app).get(`/api/tickets/${id}`).send().expect(404);
});

it("show a ticket: returns a ticket if found", async () => {
  const title = "bla";
  const price = 100;
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({
      title,
      price,
    })
    .expect(201);

  const ticketResp = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .send()
    .expect(200);

  expect(ticketResp.body.title).toEqual(title);
  expect(ticketResp.body.price).toEqual(price);
});
