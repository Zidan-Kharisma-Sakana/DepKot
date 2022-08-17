import mongoose from "mongoose";
import request from "supertest";
import { app } from "../../app";
import { Order } from "../../models/order";
import { Product } from "../../models/product";
import { StoreDoc } from "../../models/store";
import { RECEIVER } from "./constant";

const buildProduct = async (store: StoreDoc) => {
  const product = Product.build({
    title: "Product 1",
    description: "LMAO",
    price: 100,
    qty: 200,
    store,
  });
  await product.save();

  return product;
};

it("list: fetches orders for an particular user", async () => {
  // Create three products
  const { store } = await global.signin();

  const productOne = await buildProduct(store);
  const productTwo = await buildProduct(store);
  const productThree = await buildProduct(store);

  const { cookie: userOne } = await global.signin();
  const { cookie: userTwo } = await global.signin();
  // Create one order as User #1
  let response = await request(app)
    .post("/api/orders")
    .set("Cookie", userOne)
    .send({
      product_id: productOne._id,
      courier: "Kurir",
      qty: 10,
      receiver: RECEIVER,
    })
    .expect(201);

  // Create two orders as User #2
  const { body: orderOne } = await request(app)
    .post("/api/orders")
    .set("Cookie", userTwo)
    .send({
      product_id: productTwo._id,
      courier: "Kurir",
      qty: 10,
      receiver: RECEIVER,
    })
    .expect(201);

  const { body: orderTwo } = await request(app)
    .post("/api/orders")
    .set("Cookie", userTwo)
    .send({
      product_id: productThree._id,
      courier: "Kurir",
      qty: 10,
      receiver: RECEIVER,
    })
    .expect(201);

  // Make request to get orders for User #2
  response = await request(app)
    .get("/api/orders/buyer")
    .set("Cookie", userTwo)
    .expect(200);

  // Make sure we only got the orders for User #2
  expect(response.body.length).toEqual(2);
  expect(response.body[0].id).toEqual(orderOne.id);
  expect(response.body[1].id).toEqual(orderTwo.id);
});
