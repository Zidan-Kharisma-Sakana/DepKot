import mongoose from "mongoose";
import { StoreDoc } from "./store";

interface ProductAttributes {
  store: StoreDoc;
  title: string;
  price: number;
  description: string;
  qty: number;
}

interface ProductDoc extends mongoose.Document {
  store: StoreDoc;
  title: string;
  price: number;
  qty: number;
  description: string;
  order_id?: string[];
}
interface ProductModel extends mongoose.Model<ProductDoc> {
  build(attrs: ProductAttributes): ProductDoc;
  findByTitle(keyword: string): Promise<ProductDoc[] | null>;
}

const ProductSchema = new mongoose.Schema(
  {
    store: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Store",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    qty: {
      type: Number,
      required: true,
    },
    order_id: [
      {
        type: mongoose.Schema.Types.ObjectId,
      },
    ],
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
ProductSchema.set("versionKey", "version");

ProductSchema.statics.build = (attrs: ProductAttributes) => {
  return new Product({
    ...attrs,
    title_lower: attrs.title.toLowerCase(),
  });
};

ProductSchema.statics.findByTitle = (keyword: string) => {
  if (!keyword) {
    return Product.find({});
  }
  return Product.find({
    title: { $regex: new RegExp(keyword, "i") },
  });
};

const Product = mongoose.model<ProductDoc, ProductModel>(
  "Product",
  ProductSchema
);

export { Product };
