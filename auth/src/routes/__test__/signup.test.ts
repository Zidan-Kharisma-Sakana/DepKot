import request from "supertest";
import { app } from "../../app";
import { Buyer } from "../../models/buyer";
import { Store } from "../../models/store";
import { natsWrapper } from "../../nats";

const signupuri = "/api/users/signup";

it("signup: return 201 on succesfully creating user", async () => {
  const response = await request(app).post("/api/users/signup").send({
    email: "Zidan@gmail.com",
    password: "1234",
    username: "Zidan",
  });
  expect(response.statusCode).toEqual(201);
  const { buyer, store } = response.body;
  expect(buyer).not.toEqual(undefined);
  expect(store).not.toEqual(undefined);

  const byr = await Buyer.findById(buyer.buyer_id);
  const str = await Store.findById(store.store_id);

  expect(byr).not.toEqual(undefined);
  expect(str).not.toEqual(undefined);
  expect(natsWrapper.client.publish).toHaveBeenCalled()
});

it("signup: returns 400 with invalid email and/or password", async () => {
  await request(app)
    .post(signupuri)
    .send({
      email: "",
      password: "",
      username: "Zidan",
    })
    .expect(400);

  await request(app)
    .post(signupuri)
    .send({
      email: "....",
      password: "12345",
      username: "Zidan",
    })
    .expect(400);

  await request(app)
    .post(signupuri)
    .send({
      email: "zidan@gmail.com",
      password: "x",
      username: "Zidan",
    })
    .expect(400);

  await request(app)
    .post(signupuri)
    .send({
      email: "zidan@gmail.com",
      password: "x",
      username: "",
    })
    .expect(400);
});

it("signup: disallow duplicate email", async () => {
  await request(app)
    .post(signupuri)
    .send({
      email: "Zidan@gmail.com",
      password: "1234",
      username: "Zidan",
    })
    .expect(201);

  await request(app)
    .post(signupuri)
    .send({
      email: "Zidan@gmail.com",
      password: "1234",
      username: "Zidan",
    })
    .expect(400);
});

it("signup: sets a cookie after successful signup", async () => {
  const response = await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "password",
      username: "Zidan",
    })
    .expect(201);

  expect(response.get("Set-Cookie")).toBeDefined();
});
