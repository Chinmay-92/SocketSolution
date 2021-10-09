const io = require('socket.io-client');
const http = require('http');
const ioBack = require('socket.io');

let socket;
let httpServer;
let httpServerAddr;
let ioServer;

/**
 * Setup servers
 */
beforeAll((done) => {
  httpServer = http.createServer().listen();
  httpServerAddr = httpServer.address();
  ioServer = ioBack(httpServer);
  done();
});

/**
 *  Close server connections
 */
afterAll((done) => {
  ioServer.close();
  httpServer.close();
  done();
});

beforeEach((done) => {
  socket = io.connect(`http://[${httpServerAddr.address}]:${httpServerAddr.port}`, {
    'reconnection delay': 0,
    'reopen delay': 0,
    'force new connection': true,
    transports: ['websocket'],
  });
  socket.on('connect', () => {
    done();
  });
});

afterEach((done) => {
  // Close socket
  if (socket.connected) {
    socket.disconnect();
  }
  done();
});


describe('server tests', () => {
  test('should emit and read data', (done) => {
    ioServer.emit('echo', 'test message');
    socket.once('echo', (message) => {
      expect(message).toBe('test message');
      done();
    });
    ioServer.on('connection', (socket) => {
      expect(socket).toBeDefined();
    });
  });
  test('should emit and read data with timeout', (done) => {
    socket.emit('example', 'client1');
    setTimeout(() => {
      ioServer.on('example', (message) => {
        expect(message).toBeDefined();
        expect(message).toBe('client1');
      });
      done();
    }, 1000);
  });
});