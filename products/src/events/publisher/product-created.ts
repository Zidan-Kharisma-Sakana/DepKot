import { ProductUpdatedEvent, Publisher, Subjects } from "@zpyon/common";

export class ProductCreatedPublisher extends Publisher<ProductUpdatedEvent> {
  readonly subject = Subjects.ProductUpdated;
}
