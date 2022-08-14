import { Publisher, Subjects, TicketUpdatedEvent } from "@zpyon/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}
