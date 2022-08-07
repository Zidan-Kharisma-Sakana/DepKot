import { Subjects, Publisher, OrderCancelledEvent } from '@zpyon/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
}