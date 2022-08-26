import { ProductUpdatedEvent, Publisher, Subjects } from "@zpyon/common";

export class ProductUpdatedPublisher extends Publisher<ProductUpdatedEvent> {
  readonly subject = Subjects.ProductUpdated;
}
