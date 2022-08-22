import {
  BuyerCreatedEvent,
  BuyerUpdatedEvent,
  Publisher,
  Subjects,
} from "@zpyon/common";

export class BuyerCreatedPublisher extends Publisher<BuyerCreatedEvent> {
  readonly subject = Subjects.BuyerCreated;
}

export class BuyerUpdatedPublisher extends Publisher<BuyerUpdatedEvent> {
  readonly subject = Subjects.BuyerUpdated;
}
