import { Subjects, Publisher, ExpirationCompleteEvent } from "@zpyon/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}
