import request from "supertest";
import { app } from "../../app";
jest.mock("../../nats.ts");

const createAProduct = async (cookie: string[]) => {
  const title = "asldkfj";
  const price = 100;
  const qty = 10;
  const description = "Lorem ipsum";

  return request(app)
    .post("/api/products")
    .set("Cookie", cookie)
    .send({
      title,
      price,
      qty,
      description,
    })
    .expect(201);
};

it("list: can fetch a list of products", async () => {
  const { cookie } = await global.signin();
  await createAProduct(cookie);
  await createAProduct(cookie);
  await createAProduct(cookie);

  const response = await request(app).get("/api/products").send().expect(200);

  expect(response.body.length).toEqual(3);
});
