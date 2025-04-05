import protoLoader from '@grpc/proto-loader'
import grpc from '@grpc/grpc-js'
import { fileURLToPath } from 'url'
import path from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const PROTO_PATH = path.resolve(__dirname, '../../packages/proto/task.proto')
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
})

// Get the TaskService definition
const taskProto = grpc.loadPackageDefinition(packageDefinition).task

const client = new taskProto.TaskService(
  'localhost:50051',
  grpc.credentials.createInsecure()
)

const [title, description, dueTimestamp] = process.argv.slice(2)

if (!title || !dueTimestamp) {
  console.error('❌ Error: Title and due date are required.')
  process.exit(1)
}

// Prepare the request payload
const request = {
  title,
  description: description || '',
  due_timestamp: parseInt(dueTimestamp)
}

// Call the gRPC service
client.AddTask(request, (error, response) => {
  if (error) {
    console.error('❌ gRPC Error:', error.message)
    process.exit(1)
  }

  console.log('✅ Response from Task Service:', response.message)
})
