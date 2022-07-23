import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/tickets";

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
  let tickets = await Ticket.find({});
  expect(tickets.length).toEqual(0);

  const title = "asldkfj";

  await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({
      title,
      price: 20,
    })
    .expect(201);

  tickets = await Ticket.find({});
  expect(tickets.length).toEqual(1);
  expect(tickets[0].price).toEqual(20);
  expect(tickets[0].title).toEqual(title);
});
