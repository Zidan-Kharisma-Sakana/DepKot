import mongoose from "mongoose";
import { UserDoc } from "./user";

interface StoreAttrs {
  user: UserDoc;
  store_name: string;
}

interface StoreModel extends mongoose.Model<StoreDoc> {
  build(attrs: StoreAttrs): StoreDoc;
}

export interface StoreDoc extends mongoose.Document {
  store_name: string;
  store_number: string;
  couriers: string[];
  address: string;
  user: UserDoc;
}

const StoreSchema = new mongoose.Schema(
  {
    store_name: {
      type: String,
      required: true,
    },
    couriers: [String],
    store_number: {
      type: String,
    },
    address: {
      type: String,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret, options) {
        ret.store_id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

StoreSchema.statics.build = (attrs: StoreAttrs) => {
  return new Store(attrs);
};

export const Store = mongoose.model<StoreDoc, StoreModel>("Store", StoreSchema);
