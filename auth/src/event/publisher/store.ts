import {
  Publisher,
  StoreCreatedEvent,
  StoreUpdatedEvent,
  Subjects,
} from "@zpyon/common";

export class StoreCreatedPublisher extends Publisher<StoreCreatedEvent> {
  readonly subject = Subjects.StoreCreated;
}

export class StoreUpdatedPublisher extends Publisher<StoreUpdatedEvent> {
  readonly subject = Subjects.StoreUpdated;
}
