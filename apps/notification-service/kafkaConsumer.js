import { Kafka } from 'kafkajs'
import { sendNotification } from './index.js'

const kafka = new Kafka({
  clientId: 'notification-app',
  brokers: ['kafka:9092'],
  retry: {
    initialRetryTime: 1000, // Start with 1-second delay
    retries: 20, // Retry 20 times
    maxRetryTime: 30000 // Max 30 seconds between retries
  }
})

const consumer = kafka.consumer({ groupId: 'notif-group' })

export const startConsumer = async () => {
  await consumer.connect()
  await consumer.subscribe({ topic: 'task-topic' })

  await consumer.run({
    eachMessage: async ({ message }) => {
      console.log(message)
      const msg = JSON.parse(message.value.toString())
      console.log(msg)
      const scheduledTime = new Date(Number(msg.due_timestamp) * 1000)
      const now = new Date()

      const delay = scheduledTime - now

      if (delay <= 0) {
        // Time is now or passed
        sendNotification(msg)
      } else {
        // Delay execution
        console.log(`Delaying notification for ${delay}ms`)
        setTimeout(() => {
          sendNotification(msg)
        }, delay)
      }
    }
  })
}
