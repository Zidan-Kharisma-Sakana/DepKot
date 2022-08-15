import mongoose from "mongoose";

interface ProductAttributes {
  store_id: string;
  title: string;
  price: number;
  qty: number;
}

interface ProductDoc extends mongoose.Document {
  store_id: string;
  title: string;
  price: number;
  qty: number;
}
interface ProductModel extends mongoose.Model<ProductDoc> {
  build(attrs: ProductAttributes): ProductDoc;
}

const ProductSchema = new mongoose.Schema(
  {
    store_id: {
      type: mongoose.Schema.Types.ObjectId,
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
    qty: {
      type: Number,
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
ProductSchema.set("versionKey", "version");

ProductSchema.statics.build = (attrs: ProductAttributes) => {
  return new Product({
    ...attrs,
  });
};

const Product = mongoose.model<ProductDoc, ProductModel>(
  "Product",
  ProductSchema
);

export { Product };
