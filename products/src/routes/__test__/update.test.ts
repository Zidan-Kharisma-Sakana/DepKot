import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";
import { natsWrapper } from "../../nats";
jest.mock("../../nats.ts");

const title = "asldkfj";
const price = 100;
const qty = 10;
const description = "Lorem ipsum";

it("update: returns a 404 if the provided id does not exist", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  const { cookie } = await global.signin();
  await request(app)
    .put(`/api/products/${id}`)
    .set("Cookie", cookie)
    .send({
      title,
      price,
      qty,
      description,
    })
    .expect(404);
});

it("update: returns a 401 if the user is not authenticated", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  const response = await request(app).put(`/api/products/${id}`).send({
    title,
    price,
    qty,
    description,
  });
  console.log(response.body);
  expect(response.statusCode).toEqual(401);
});

it("update: returns a 401 if the user does not own the ticket", async () => {
  const { cookie } = await global.signin();

  const response = await request(app)
    .post("/api/products")
    .set("Cookie", cookie)
    .send({
      title,
      price,
      qty,
      description,
    });

  const { cookie: cookie2 } = await global.signin();

  await request(app)
    .put(`/api/products/${response.body.id}`)
    .set("Cookie", cookie2)
    .send({
      title,
      price,
      qty,
      description,
    })
    .expect(401);
});

it("update: returns a 400 if the user provides an invalid title or price", async () => {
  const { cookie } = await global.signin();

  const response = await request(app)
    .post("/api/products")
    .set("Cookie", cookie)
    .send({
      title: "asldkfj",
      price: 20,
    });

  await request(app)
    .put(`/api/products/${response.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: "",
      price: 20,
    })
    .expect(400);

  await request(app)
    .put(`/api/products/${response.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: "alskdfjj",
      price: -10,
    })
    .expect(400);
});

it("update: updates the product provided valid inputs", async () => {
  const { cookie } = await global.signin();

  const response = await request(app)
    .post("/api/products")
    .set("Cookie", cookie)
    .send({
      title,
      price,
      qty,
      description,
    });

  expect(response.statusCode).toEqual(201);

  const latestProduct = {
    title: "Latest Product",
    price: 100,
    qty: 20,
    description: "new description",
  };

  await request(app)
    .put(`/api/products/${response.body.id}`)
    .set("Cookie", cookie)
    .send(latestProduct)
    .expect(200);

  const product = await request(app)
    .get(`/api/products/${response.body.id}`)
    .send();

  expect(product.body.title).toEqual(latestProduct.title);
  expect(product.body.price).toEqual(latestProduct.price);
  expect(product.body.qty).toEqual(latestProduct.qty);
  expect(product.body.description).toEqual(latestProduct.description);
  expect(natsWrapper.client.publish).toBeCalled()
});
