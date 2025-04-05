import grpc from '@grpc/grpc-js'
import protoLoader from '@grpc/proto-loader'
import { publishTask } from './kafkaPublisher.js'

const PROTO_PATH = '../../packages/proto/task.proto'

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
})

const taskProto = grpc.loadPackageDefinition(packageDefinition).task

function AddTask(call, callback) {
  const task = call.request

  console.log('📥 Received task:', task)

  publishTask(task)

  callback(null, {
    success: true,
    message: 'Task published successfully!'
  })
}

const server = new grpc.Server()
server.addService(taskProto.TaskService.service, { AddTask })

const PORT = '0.0.0.0:50051'
server.bindAsync(PORT, grpc.ServerCredentials.createInsecure(), (err, port) => {
  if (err) {
    console.error('❌ Failed to bind gRPC server:', err)
    return
  }

  console.log(`🚀 gRPC server listening on ${PORT} (port ${port})`)
})
