import { Listener, StoreUpdatedEvent, Subjects } from "@zpyon/common";
import { Message } from "node-nats-streaming";
import { Store } from "../../models/store";
import { queueGroupName } from "./queueGroup";

export class StoreUpdatedListener extends Listener<StoreUpdatedEvent> {
  queueGroupName = queueGroupName;
  readonly subject = Subjects.StoreUpdated;
  async onMessage(
    data: {
      id: string;
      store_name: string;
      store_number: string;
      couriers: string[];
      address: string;
      user_id: string;
    },
    msg: Message
  ) {
    const { id, address, store_name, store_number, couriers } = data;
    const store = await Store.findById(id);
    if (!store) {
      throw new Error("No Store Found!");
    } else {
      store.set({
        address,
        store_name,
        store_number,
        couriers,
      });
      await store.save();
    }

    msg.ack();
  }
}
