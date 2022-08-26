import mongoose from "mongoose";

interface StoreAttrs {
  _id: string;
  store_name: string;
  store_number: string;
  couriers: string[];
  address: string;
}

interface StoreModel extends mongoose.Model<StoreDoc> {
  build(attrs: StoreAttrs): StoreDoc;
}

export interface StoreDoc extends mongoose.Document {
  store_name: string;
  store_number: string;
  couriers: string[];
  products: string[];
  address: string;
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
    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
      },
    ],
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
  return new Store({
    ...attrs,
  });
};

export const Store = mongoose.model<StoreDoc, StoreModel>("Store", StoreSchema);
