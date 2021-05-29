import nats, { Message } from 'node-nats-streaming'
import { randomBytes } from 'crypto'

console.clear()

const stan = nats.connect('ticketing', randomBytes(4).toString('hex'), {
  url: 'http://localhost:4222'
});

stan.on('connect', () => {
  console.log('Listener connected to NATS')

  stan.on('close', () => {
    console.log('NATS connection closed!')
    process.exit()
  })

  const options = stan.subscriptionOptions()
    .setManualAckMode(true)
    .setDeliverAllAvailable() // * ( * - need to be applied together )
    .setDurableName('lestentr-service') // *

  const subscription = stan.subscribe(
    'ticket:created',    // Subject name
    'listenerQueueGroup',// QueueGroup name  *
    options
  )

  subscription.on('message', (msg: Message) => {
    console.log('Message received:')

    const data = msg.getData()
    const subject = msg.getSubject()
    const messageId = msg.getSequence()

    console.log(data)
    console.log(subject)
    console.log(messageId)

    msg.ack() // tell the server - everything is ok, I received a message ( if options.setManualAckMode(true) )
  })
})

process.on('SIGINT', () => { stan.close() });
process.on('SIGNTERM', () => { stan.close() });