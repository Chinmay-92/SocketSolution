const prompt = require('prompt');

const createClients = (count, timeout) => {
  var client = 1;
  let socket = [];
  for (let i = 0; i < count; i++) {
    socket[i] = require('socket.io-client')('http://localhost:8000', {
      reconnection: true,
      reconnectionDelay: 10000
    });
    socket[i].client = client;
    client++;
    socket[i].on('connect', (data) => {
      socket[i].on('id', (data) => {
        socket[i].id = `'${data}'`;
      })
      setInterval(() => {
        socket[i].emit('data', 'Message from client #' + socket[i].client);
      }, timeout);
    });

    socket[i].on('disconnect', (reason) => {
      console.log("client disconnected");
      if (reason === 'io server disconnect') {
        console.log("server disconnected the client, trying to reconnect");
        socket[i].connect();
      } else {
        console.log("trying to reconnect again with server");
      }
    });

    socket[i].on('error', (error) => {
      console.log(error);
    });

  }
}

prompt.start();

const properties = [
  {
    name: 'clients',
    validator: /^\d+$/,
    warning: 'clients must be a number'
  },
  {
    name: 'timeout',
    validator: /^\d+$/,
    warning: 'timeout must be a number'
  }
];

prompt.get(properties, function (err, result) {
  if (err) { return onErr(err); }
  console.log('Input received:');
  console.log('  Clients: ' + result.clients);
  console.log('  Timeout(in seconds): ' + result.timeout);

  createClients(result.clients, result.timeout);
});

function onErr(err) {
  console.log(err);
  return 1;
}

