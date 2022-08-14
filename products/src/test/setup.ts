import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { Store } from "../models/store";

declare global {
  var signin: () => Promise<{
    cookie: string[];
    store_id: string;
  }>;
}

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
  // Build a JWT payload.  { id, email }
  const store_id = new mongoose.Types.ObjectId().toHexString();
  const payload = {
    id: new mongoose.Types.ObjectId().toHexString(),
    email: "test@test.com",
    store_id,
  };

  const store = Store.build({
    store_id,
    store_name: "Zidan",
  });
  await store.save()

  const token = jwt.sign(payload, process.env.JWT_KEY!);

  const session = { jwt: token };

  const sessionJSON = JSON.stringify(session);

  const base64 = Buffer.from(sessionJSON).toString("base64");

  return {
    cookie: [`session=${base64}`],
    store_id,
  };
};
