import request from "supertest";
import { app } from "../../app";
jest.mock("../../nats.ts");

const createAProduct = async (title: string, cookie: string[]) => {
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
  await createAProduct("asldkfj", cookie);
  await createAProduct("asldkfj", cookie);
  await createAProduct("asldkfj", cookie);

  const response = await request(app).get("/api/products").send().expect(200);

  expect(response.body.length).toEqual(3);
});

it("list: can query a list of products", async () => {
  const { cookie } = await global.signin();
  await createAProduct("Fried Chicken cheap tasty", cookie);
  await createAProduct("Lenovo thinkpad t440", cookie);
  await createAProduct(
    "Calculus 9th edition by Varberg, Purcell, Rigdon",
    cookie
  );

  let response = await request(app).get("/api/products").send().expect(200);
  expect(response.body.length).toEqual(3);

  response = await request(app).get("/api/products?search=c").send().expect(200);
  expect(response.body.length).toEqual(2);

  response = await request(app).get("/api/products?search=40").send().expect(200);
  expect(response.body.length).toEqual(1);

  response = await request(app).get("/api/products?search=,").send().expect(200);
  expect(response.body.length).toEqual(1);

  response = await request(app).get("/api/products?search=blablabla").send().expect(200);
  expect(response.body.length).toEqual(0);
});
