const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')
const { Server: SocketServer } = require('socket.io')

const dev = process.env.NODE_ENV !== 'production'
const hostname = process.env.HOSTNAME || 'localhost'
const port = parseInt(process.env.PORT || '3000', 10)

const app = next({ dev, hostname, port })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url, true)
    handle(req, res, parsedUrl)
  })

  // Initialize Socket.io
  const io = new SocketServer(server, {
    cors: {
      origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
      methods: ['GET', 'POST'],
      credentials: true,
    },
    transports: ['websocket', 'polling'],
  })

  // Store io instance globally for API routes to access
  global.io = io

  // Track connected clients
  let connectedClients = 0

  io.on('connection', (socket) => {
    connectedClients++
    console.log(`[Socket.io] Client connected: ${socket.id} (Total: ${connectedClients})`)

    // Send welcome message with connection info
    socket.emit('connected', {
      socketId: socket.id,
      timestamp: new Date().toISOString(),
    })

    socket.on('disconnect', (reason) => {
      connectedClients--
      console.log(`[Socket.io] Client disconnected: ${socket.id} - Reason: ${reason} (Total: ${connectedClients})`)
    })

    socket.on('error', (error) => {
      console.error(`[Socket.io] Socket error for ${socket.id}:`, error)
    })
  })

  // Log periodic stats
  setInterval(() => {
    if (connectedClients > 0) {
      console.log(`[Socket.io] Active connections: ${connectedClients}`)
    }
  }, 60000) // Every minute

  server.listen(port, () => {
    console.log('\n╔════════════════════════════════════════════════════════╗')
    console.log('║        ShopPad Next.js Server with WebSocket           ║')
    console.log('╚════════════════════════════════════════════════════════╝\n')
    console.log(`🚀 Server running at http://${hostname}:${port}`)
    console.log(`📡 WebSocket server ready`)
    console.log(`🔧 Environment: ${dev ? 'development' : 'production'}`)
    console.log('\n📋 API Endpoints:')
    console.log('   POST /api/weight       - Receive ESP32 weight data')
    console.log('   POST /api/barcode      - Receive barcode scan')
    console.log('   POST /api/nfc-payment  - Receive NFC payment trigger')
    console.log('   GET  /api/products     - Get product catalog')
    console.log('   GET  /api/status       - Health check')
    console.log('\n📡 WebSocket Events:')
    console.log('   weight:update    - Real-time weight updates')
    console.log('   barcode:scan     - Barcode scan notifications')
    console.log('   nfc:payment      - NFC payment triggers')
    console.log('\n⌨️  Press Ctrl+C to stop the server\n')
  })

  // Graceful shutdown
  const shutdown = (signal) => {
    console.log(`\n${signal} received. Shutting down gracefully...`)
    io.close(() => {
      console.log('Socket.io connections closed')
      server.close(() => {
        console.log('HTTP server closed')
        process.exit(0)
      })
    })
  }

  process.on('SIGTERM', () => shutdown('SIGTERM'))
  process.on('SIGINT', () => shutdown('SIGINT'))
})
