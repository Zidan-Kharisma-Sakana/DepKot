import mongoose from "mongoose";
import request from "supertest";
import { app } from "../../app";
import { Product } from "../../models/product";
import { RECEIVER } from "./constant";

it("show: fetches the order for buyer", async () => {
  // Create a product
  const { store } = await global.signin();
  const product = Product.build({
    title: "Product 1",
    description: "LMAO",
    price: 100,
    qty: 200,
    store,
  });
  await product.save();

  const { cookie: user } = await global.signin();

  // make a request to build an order with this product
  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", user)
    .send({
      product_id: product._id,
      courier: "Kurir",
      qty: 10,
      receiver: RECEIVER,
    })
    .expect(201);

  // make request to fetch the order
  const { body: fetchedOrder } = await request(app)
    .get(`/api/orders/${order.id}`)
    .set("Cookie", user)
    .send()
    .expect(200);

  expect(fetchedOrder.id).toEqual(order.id);
});

it("show: fetches the order for store", async () => {
  // Create a product
  const { cookie: sender, store } = await global.signin();
  const product = Product.build({
    title: "Product 1",
    description: "LMAO",
    price: 100,
    qty: 200,
    store,
  });
  await product.save();

  const { cookie: user } = await global.signin();

  // make a request to build an order with this product
  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", user)
    .send({
      product_id: product._id,
      courier: "Kurir",
      qty: 10,
      receiver: RECEIVER,
    })
    .expect(201);

  // make request to fetch the order
  const { body: fetchedOrder } = await request(app)
    .get(`/api/orders/${order.id}`)
    .set("Cookie", sender)
    .send()
    .expect(200);

  expect(fetchedOrder.id).toEqual(order.id);
});

it("show: returns an error if one user tries to fetch another users order", async () => {
  // Create a product
  const { store } = await global.signin();
  const product = Product.build({
    title: "Product 1",
    description: "LMAO",
    price: 100,
    qty: 200,
    store,
  });
  await product.save();

  const { cookie: user } = await global.signin();

  // make a request to build an order with this product
  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", user)
    .send({
      product_id: product._id,
      courier: "Kurir",
      qty: 10,
      receiver: RECEIVER,
    })
    .expect(201);

  const { cookie: user2 } = await global.signin();

  // make request to fetch the order
  await request(app)
    .get(`/api/orders/${order.id}`)
    .set("Cookie", user2)
    .send()
    .expect(401);
});
