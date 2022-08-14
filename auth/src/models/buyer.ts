import mongoose from "mongoose";
import { UserDoc } from "./user";

interface BuyerAttrs {
  user: UserDoc;
  receiver_name: string;
}

interface BuyerModel extends mongoose.Model<BuyerDoc> {
  build(attrs: BuyerAttrs): BuyerDoc;
}

export interface BuyerDoc extends mongoose.Document {
  receiver_name: string;
  receiver_number: string;
  address: string;
  user: UserDoc;
}

const buyerSchema = new mongoose.Schema(
  {
    receiver_name: {
      type: String,
      required: true,
    },
    receiver_number: {
      type: String,
    },
    address: {
      type: String,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
  },
  {
    toJSON: {
      transform(doc, ret, options) {
        ret.buyer_id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

buyerSchema.statics.build = (attrs: BuyerAttrs) => {
  return new Buyer(attrs);
};

export const Buyer = mongoose.model<BuyerDoc, BuyerModel>("Buyer", buyerSchema);
