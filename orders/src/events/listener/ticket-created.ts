import { Listener, TicketCreatedEvent, Subjects } from "@zpyon/common";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/ticket";
import { queueGroupName } from "./queueGroupName";

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: TicketCreatedEvent["data"], msg: Message) {
    const { id, price, title } = data;
    console.log("---")
    const ticket = Ticket.build({
      id,
      price,
      title,
    });
    await ticket.save();

    msg.ack();
  }
}
