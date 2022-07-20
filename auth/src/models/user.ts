import mongoose, { CallbackWithoutResultAndOptionalError } from "mongoose";
import { Password } from "../services/password";

// properties to create a new User
interface UserAttrs {
  email: string;
  password: string;
}

// properties that a User Model has
interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}

// properties that a User Document has
interface UserDoc extends mongoose.Document {
  email: string;
  password: string;
}

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret, options) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
        delete ret.__v;
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
