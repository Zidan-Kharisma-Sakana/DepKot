import { Listener, ProductCreatedEvent, Subjects } from "@zpyon/common";
import { Message } from "node-nats-streaming";
import { Product } from "../../models/product";
import { Store } from "../../models/store";
import { queueGroupName } from "./queueGroupName";

export class ProductCreatedListener extends Listener<ProductCreatedEvent> {
  queueGroupName = queueGroupName;
  readonly subject = Subjects.ProductCreated;
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
    const { id, title, price, qty, description, storeId } = data;
    const store = await Store.findById(storeId);
    if (!store) {
      throw new Error("No Store Found!");
    }
    const product = Product.build({
      _id: id,
      title,
      price,
      qty,
      description,
      store,
    });
    await product.save();

    msg.ack();
  }
}
