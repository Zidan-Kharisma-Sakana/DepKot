import mongoose from "mongoose";
import request from "supertest";
import { app } from "../../app";
jest.mock("../../nats.ts");

it("show: return 404 for unidentified product", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();

  await request(app).get(`/api/products/${id}`).send().expect(404);
});

it("show: returns a product if found", async () => {
  const title = "asldkfj";
  const price = 100;
  const qty = 10;
  const description = "Lorem ipsum";

  const { cookie } = await global.signin();
  const response = await request(app)
    .post("/api/products")
    .set("Cookie", cookie)
    .send({
      title,
      price,
      qty,
      description,
    })
    .expect(201);

  const product = await request(app)
    .get(`/api/products/${response.body.id}`)
    .send()
    .expect(200);

  expect(product.body.title).toEqual(title);
  expect(product.body.price).toEqual(price);
  expect(product.body.qty).toEqual(qty);
  expect(product.body.description).toEqual(description);
});
