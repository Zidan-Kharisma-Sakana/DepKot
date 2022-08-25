import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { app } from "../app";
import request from "supertest";

declare global {
  var signin: () => Promise<string[]>;
  var signinWithResponse: () => Promise<{
    cookie: string[];
    response: any;
  }>;
}
jest.mock("../nats.ts");
let mongo: any;

beforeAll(async () => {
  process.env.JWT_KEY = "NicoNicoNii";

  mongo = await MongoMemoryServer.create();

  const uri = mongo.getUri();

  await mongoose.connect(uri);
});

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();
  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  if (!!mongo) {
    await mongo.stop();
  }
  await mongoose.connection.close();
});

global.signin = async () => {
  const email = "test@test.com";
  const password = "password";
  const username = "Zidan";

  const response = await request(app)
    .post("/api/users/signup")
    .send({
      email,
      password,
      username,
    })
    .expect(201);

  const cookie = response.get("Set-Cookie");

  return cookie;
};

global.signinWithResponse = async () => {
  const email = "test2@test.com";
  const password = "password";
  const username = "Zidan";

  const response = await request(app)
    .post("/api/users/signup")
    .send({
      email,
      password,
      username,
    })
    .expect(201);

  const cookie = String(response.get("Set-Cookie")).split(";");
  return {
    cookie: cookie,
    response: response,
  };
};
