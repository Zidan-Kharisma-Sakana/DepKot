import mongoose from "mongoose";
import request from "supertest";
import { app } from "../../app";
import { Product } from "../../models/product";
import { Store, StoreDoc } from "../../models/store";
import { RECEIVER } from "./constant";

it("create: returns an error if the product does not exist", async () => {
  const product_id = new mongoose.Types.ObjectId();
  const { cookie } = await global.signin();

  await request(app)
    .post("/api/orders")
    .set("Cookie", cookie)
    .send({ product_id, courier: "Kurir", qty: 10, receiver: RECEIVER })
    .expect(404);
});

it("create: returns an error if the params not valid", async () => {
  const product_id = new mongoose.Types.ObjectId();
  const { cookie } = await global.signin();

  await request(app)
    .post("/api/orders")
    .set("Cookie", cookie)
    .send({ product_id, courier: "", qty: 10, receiver: RECEIVER })
    .expect(400);
  await request(app)
    .post("/api/orders")
    .set("Cookie", cookie)
    .send({ product_id, courier: "KKKK", qty: -10, receiver: RECEIVER })
    .expect(400);
  await request(app)
    .post("/api/orders")
    .set("Cookie", cookie)
    .send({ courier: "bla", qty: 10 })
    .expect(400);
  await request(app)
    .post("/api/orders")
    .set("Cookie", cookie)
    .send({ product_id, courier: "Kurir", qty: 10 })
    .expect(400);
});

it("create: returns an error if not logged in", async () => {
  const product_id = new mongoose.Types.ObjectId();

  await request(app)
    .post("/api/orders")
    .send({ product_id, courier: "Kurir", qty: 10, receiver: RECEIVER })
    .expect(401);
});

it("create: successfully order an item", async () => {

  const { store_id } = await global.signin();
  const store = (await Store.findById(store_id)) as StoreDoc;
  const product = Product.build({
    store: store,
    title: "Produk 1",
    price: 100,
    qty: 10,
    description: "BLABLAB:LA",
  });
  await product.save();


  const { cookie } = await global.signin();

  await request(app)
    .post("/api/orders")
    .set("Cookie", cookie)
    .send({
      product_id: product._id,
      courier: "Kurir",
      qty: 10,
      receiver: RECEIVER,
    })
    .expect(201);
});
