import { Kafka } from 'kafkajs'

const kafka = new Kafka({
  clientId: 'task-service',
  brokers: ['kafka:9092'],
  retry: {
    initialRetryTime: 1000, // Start with 1-second delay
    retries: 20, // Retry 20 times
    maxRetryTime: 30000 // Max 30 seconds between retries
  }
})

const producer = kafka.producer()
await producer.connect()
export async function publishTask(task) {
  await producer.send({
    topic: 'task-topic',
    messages: [{ value: JSON.stringify(task) }]
  })

  console.log('📤 Published to Kafka:', task)
}
