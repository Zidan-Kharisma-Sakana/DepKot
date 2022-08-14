import mongoose from "mongoose";
import { Password } from "../services/password";
import { BuyerDoc } from "./buyer";
import { StoreDoc } from "./store";

// properties to create a new User
interface UserAttrs {
  email: string;
  password: string;
  username: string;
}

// properties that a User Model has
 interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}

// properties that a User Document has
export interface UserDoc extends mongoose.Document {
  email: string;
  password: string;
  username: string;
  buyer?: BuyerDoc;
  store?: StoreDoc
}

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Buyer",
    },
    store : {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Store",
    }
  },
  {
    toJSON: {
      transform(doc, ret, options) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
        delete ret.__v;
        ret.buyer = {
          ...ret.buyer,
          user: undefined
        }
        ret.store = {
          ...ret.store,
          user: undefined
        }
      },
    },
  }
);
userSchema.pre(
  "save",
  async function (
    done: mongoose.CallbackWithoutResultAndOptionalError,
    _: mongoose.SaveOptions
  ) {
    if (this.isModified("password")) {
      const hashedPassword = await Password.toHash(this.get("password"));
      this.set("password", hashedPassword);
    }
    done();
  }
);

userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};

export const User = mongoose.model<UserDoc, UserModel>("User", userSchema);
