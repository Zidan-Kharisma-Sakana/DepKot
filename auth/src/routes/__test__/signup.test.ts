import request from "supertest";
import { app } from "../../app";

const signupuri = "/api/users/signup";

it("signup: return 201 on succesfully creating user", async () => {
  return request(app)
    .post(signupuri)
    .send({
      email: "Zidan@gmail.com",
      password: "1234",
    })
    .expect(201);
});

it("signup: returns 400 with invalid email and/or password", async () => {
  await request(app)
    .post(signupuri)
    .send({
      email: "",
      password: "",
    })
    .expect(400);

  await request(app)
    .post(signupuri)
    .send({
      email: "....",
      password: "12345",
    })
    .expect(400);

  await request(app)
    .post(signupuri)
    .send({
      email: "zidan@gmail.com",
      password: "x",
    })
    .expect(400);
});

it("signup: disallow duplicate email", async () => {
  await request(app)
    .post(signupuri)
    .send({
      email: "Zidan@gmail.com",
      password: "1234",
    })
    .expect(201);

  await request(app)
    .post(signupuri)
    .send({
      email: "Zidan@gmail.com",
      password: "1234",
    })
    .expect(400);
});

it('signup: sets a cookie after successful signup', async () => {
  const response = await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password'
    })
    .expect(201);

  expect(response.get('Set-Cookie')).toBeDefined();
});