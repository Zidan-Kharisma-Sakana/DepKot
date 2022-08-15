import request from "supertest";
import { app } from "../../../app";

it("store info: show store's information", async () => {
  const { store_id } = await global.signin();

  const response = await request(app).get(`/api/products/store/${store_id}`);

  expect(response.statusCode).toEqual(200);
  expect(response.body.store_name).toEqual("Zidan");
});
