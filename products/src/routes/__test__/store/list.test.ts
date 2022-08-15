import request from "supertest";
import { app } from "../../../app";

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

it("store list: show store's product", async () => {
  const { cookie, store_id } = await global.signin();
  await createAProduct("Fried Chicken cheap tasty", cookie);
  await createAProduct("Lenovo thinkpad t440", cookie);
  await createAProduct(
    "Calculus 9th edition by Varberg, Purcell, Rigdon",
    cookie
  );

  const response = await request(app).get(`/api/products/store/list/${store_id}`);
  expect(response.statusCode).toEqual(200)
  expect(response.body.length).toEqual(3);
});
