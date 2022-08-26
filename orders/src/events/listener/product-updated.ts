import { Listener, ProductUpdatedEvent, Subjects } from "@zpyon/common";
import { Message } from "node-nats-streaming";
import { Product } from "../../models/product";
import { queueGroupName } from "./queueGroupName";

export class ProductUpdatedListener extends Listener<ProductUpdatedEvent> {
  queueGroupName = queueGroupName;
  readonly subject = Subjects.ProductUpdated;
  async onMessage(
    data: {
      id: string;
      title: string;
      price: number;
      qty: number;
      description: string;
      storeId: string;
    },
    msg: Message
  ) {
    const { id, description, price, qty, title } = data;
    const product = await Product.findById(id);
    if (!product) {
      throw new Error("Product not Found!");
    }
    product.set({
      title,
      price,
      qty,
      description,
    });
    await product.save();

    msg.ack();
  }
}
