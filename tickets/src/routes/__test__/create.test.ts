import request from "supertest";
import { app } from "../../app";

const post = request(app).post("/api/tickets");

it("create ticket: must sign in to create ticket", async () => {
  await post.send({}).expect(401);
});

it("create ticket: return anything other than 401 when signed in", async () => {
  await post.set("Cookie", global.signin()).send({});
});

it("create ticket: need valid title and price", async () => {
  await post
    .set("Cookie", global.signin())
    .send({
      price: 10,
    })
    .expect(400);

  await post
    .set("Cookie", global.signin())
    .send({
      title: "",
    })
    .expect(400);
});

it("create ticket: creates a ticket succesfully", async () => {
  await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({
      title: "Blablabla",
      price: 20,
    })
    .expect(201);
});
