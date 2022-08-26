import { OrderAcceptedEvent, Publisher, Subjects } from "@zpyon/common";

export class OrderAcceptedPublisher extends Publisher<OrderAcceptedEvent> {
  readonly subject = Subjects.OrderAccepted;
}
