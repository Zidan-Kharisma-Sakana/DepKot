import { Listener, StoreCreatedEvent, Subjects } from "@zpyon/common";
import { Message } from "node-nats-streaming";
import { Store } from "../../models/store";
import { queueGroupName } from "./queueGroup";

export class StoreCreatedListener extends Listener<StoreCreatedEvent> {
  queueGroupName = queueGroupName;
  readonly subject = Subjects.StoreCreated;
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
    const store = Store.build({
      _id: id,
      store_name,
      store_number,
      address,
      couriers,
    });
    await store.save();

    msg.ack();
  }
}
