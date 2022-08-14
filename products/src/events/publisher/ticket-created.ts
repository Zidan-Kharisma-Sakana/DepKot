import { Publisher, Subjects, TicketCreatedEvent } from "@zpyon/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}
