import { Publisher, Subjects, TicketCreatedEvent } from '@amedtickets/common'

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
}