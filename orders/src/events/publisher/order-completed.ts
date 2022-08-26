import { OrderCompletedEvent, Publisher, Subjects } from "@zpyon/common";

export class OrderCompletedPublisher extends Publisher<OrderCompletedEvent> {
  readonly subject = Subjects.OrderCompleted;
}
