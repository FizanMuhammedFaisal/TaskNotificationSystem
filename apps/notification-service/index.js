import { startConsumer } from './kafkaConsumer.js'

export const sendNotification = msg => {
  const { title, description, due_timestamp } = msg
  const scheduledTime = new Date(Number(due_timestamp) * 1000).toLocaleString()

  console.log('\n🔔 Task Notification')
  console.log('--------------------------')
  console.log(`📝 Title       : ${title}`)
  if (description) console.log(`📄 Description : ${description}`)
  console.log(
    `⏰ Due Time (UTC)  : ${new Date(Number(due_timestamp) * 1000).toISOString()}`
  )
  console.log(
    `⏰ Due Time (Local): ${new Date(Number(due_timestamp) * 1000).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}`
  )
  console.log('--------------------------\n')
}
startConsumer()
