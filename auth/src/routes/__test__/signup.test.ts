import request from "supertest";
import { app } from "../../app";

it("return 201 on succesful", async () => {
  return request(app)
    .post("/api/users/signup")
    .send({
      email: "Zidan@gmail.com",
      password: "1234",
    })
    .expect(201);
});
