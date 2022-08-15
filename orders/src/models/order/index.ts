import mongoose from "mongoose";
import { OrderStatus } from "@zpyon/common";
import {
  ItemDoc,
  ItemSchema,
  ReceiverDoc,
  ReceiverSchema,
  SenderDoc,
  SenderSchema,
} from "./subdocument";
export { OrderStatus };

interface OrderAttrs {
  receiver: any;
  sender: any;
  item: any;
  status: string;
  qty: number;
  courier: string;
  shipping_fee: number;
  expired_time: Date;
}

interface OrderDoc extends mongoose.Document {
  receiver: ReceiverDoc;
  sender: SenderDoc;
  item: ItemDoc;
  qty: number;
  status: string;
  courier: string;
  shipping_fee: number;
  expired_time: Date;
}

interface OrderModel extends mongoose.Model<OrderDoc> {
  build(attrs: OrderAttrs): OrderDoc;
}

const orderSchema = new mongoose.Schema(
  {
    receiver: {
      type: ReceiverSchema,
      required: true,
    },
    sender: {
      type: SenderSchema,
      required: true,
    },
    item: {
      type: ItemSchema,
      required: true,
    },
    qty: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    courier: {
      type: String,
      required: true,
    },
    shipping_fee: {
      type: Number,
      required: true,
    },
    expired_time: {
      type: mongoose.Schema.Types.Date,
      required: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

orderSchema.set("versionKey", "version");

orderSchema.statics.build = (attrs: OrderAttrs) => {
  return new Order(attrs);
};

const Order = mongoose.model<OrderDoc, OrderModel>("Order", orderSchema);

export { Order };
