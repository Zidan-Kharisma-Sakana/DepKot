import mongoose from "mongoose";
import request from "supertest";
import { app } from "../../app";
import { Order, OrderStatus } from "../../models/order";
import { Product } from "../../models/product";
import { RECEIVER } from "./constant";

it("delete: let buyer cancel order", async () => {
  const { store } = await global.signin();
  const product = Product.build({
    title: "Product 1",
    description: "LMAO",
    price: 100,
    qty: 200,
    store,
  });
  await product.save();

  const { cookie } = await global.signin();
  // make a request to create an order
  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", cookie)
    .send({
      product_id: product._id,
      courier: "Kurir",
      qty: 10,
      receiver: RECEIVER,
    })
    .expect(201);

  // make a request to cancel the order
  await request(app)
    .delete(`/api/orders/${order.id}`)
    .set("Cookie", cookie)
    .send()
    .expect(204);

  // expectation to make sure the thing is cancelled
  const updatedOrder = await Order.findById(order.id);

  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it("delete: let store cancel order", async () => {
  const { cookie: storeCookie, store } = await global.signin();
  const product = Product.build({
    title: "Product 1",
    description: "LMAO",
    price: 100,
    qty: 200,
    store,
  });
  await product.save();

  const { cookie: buyerCookie } = await global.signin();
  // make a request to create an order
  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", buyerCookie)
    .send({
      product_id: product._id,
      courier: "Kurir",
      qty: 10,
      receiver: RECEIVER,
    })
    .expect(201);

  // make a request to cancel the order
  await request(app)
    .delete(`/api/orders/${order.id}`)
    .set("Cookie", storeCookie)
    .send()
    .expect(204);

  // expectation to make sure the thing is cancelled
  const updatedOrder = await Order.findById(order.id);

  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it("delete: return an error if not authorized", async () => {
  // create a product with product Model
  const { store } = await global.signin();
  const product = Product.build({
    title: "Product 1",
    description: "LMAO",
    price: 100,
    qty: 200,
    store,
  });
  await product.save();

  const { cookie } = await global.signin();
  // make a request to create an order
  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", cookie)
    .send({
      product_id: product._id,
      courier: "Kurir",
      qty: 10,
      receiver: RECEIVER,
    })
    .expect(201);

  // make a request to cancel the order
  const { cookie: cookie2 } = await global.signin();

  await request(app)
    .delete(`/api/orders/${order.id}`)
    .set("Cookie", cookie2)
    .send()
    .expect(401);
});
