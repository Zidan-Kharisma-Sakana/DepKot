import request from "supertest";
import { app } from "../../app";
import { Product } from "../../models/product";

jest.mock("../../nats.ts");
it("create: must sign in to create product", async () => {
  const r = await request(app).post("/api/products").send({});
  expect(r.status).toEqual(401);
});

it("create: creates a product succesfully", async () => {
  let products = await Product.find({});
  expect(products.length).toEqual(0);

  const title = "asldkfj";
  const price = 100;
  const qty = 10;
  const description = "Lorem ipsum";

  const { cookie } = await global.signin();

  await request(app)
    .post("/api/products")
    .set("Cookie", cookie)
    .send({
      title,
      price,
      qty,
      description,
    })
    .expect(201);

  products = await Product.find({});
  expect(products.length).toEqual(1);
});
