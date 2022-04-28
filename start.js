require('dotenv').config();

const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const { TikTokConnectionWrapper, getGlobalConnectionCount } = require('./connectionWrapper');

const app = express();
const httpServer = createServer(app);

// Enable cross origin resource sharing
const io = new Server(httpServer, {
    cors: {
        origin: '*'
    }
});

io.on('connection', (socket) => {
    let tiktokConnectionWrapper;

    socket.on('setUniqueId', (uniqueId, options) => {

        // Prohibit the client from specifying these options (for security reasons)
        if (typeof options === 'object') {
            delete options.requestOptions;
            delete options.websocketOptions;
        }

        // Is the client already connected to a stream? => Disconnect
        if (tiktokConnectionWrapper) {
            tiktokConnectionWrapper.disconnect();
        }

        // Connect to the given username (uniqueId)
        try {
            tiktokConnectionWrapper = new TikTokConnectionWrapper(uniqueId, options, true);
            tiktokConnectionWrapper.connect();            
        } catch(err) {
            socket.emit('disconnected', err.toString());
            return;
        }

        // Redirect wrapper control events once
        tiktokConnectionWrapper.once('connected', state => socket.emit('tiktokConnected', state));
        tiktokConnectionWrapper.once('disconnected', reason => socket.emit('tiktokDisconnected', reason));

        // Notify client when stream ends
        tiktokConnectionWrapper.connection.on('streamEnd', () => socket.emit('streamEnd'));

        // Redirect message events
        tiktokConnectionWrapper.connection.on('roomUser', msg => socket.emit('roomUser', msg));
        tiktokConnectionWrapper.connection.on('member', msg => socket.emit('member', msg));
        tiktokConnectionWrapper.connection.on('chat', msg => socket.emit('chat', msg));
        tiktokConnectionWrapper.connection.on('gift', msg => socket.emit('gift', msg));
        tiktokConnectionWrapper.connection.on('social', msg => socket.emit('social', msg));
        tiktokConnectionWrapper.connection.on('like', msg => socket.emit('like', msg));
        tiktokConnectionWrapper.connection.on('questionNew', msg => socket.emit('questionNew', msg));
        tiktokConnectionWrapper.connection.on('linkMicBattle', msg => socket.emit('linkMicBattle', msg));
        tiktokConnectionWrapper.connection.on('linkMicArmies', msg => socket.emit('linkMicArmies', msg));
        tiktokConnectionWrapper.connection.on('liveIntro', msg => socket.emit('liveIntro', msg));
    });

    socket.on('disconnect', () => {
        if(tiktokConnectionWrapper) {
            tiktokConnectionWrapper.disconnect();
        }
    });
});

// Emit global connection statistics
setInterval(() => {
    io.emit('statistic', { globalConnectionCount: getGlobalConnectionCount() });
}, 5000)

// Serve frontend files
app.use(express.static('public'));

// Start http listener
const port = process.env.PORT || 8081;
httpServer.listen(port);
console.info(`Server running! Please visit http://localhost:${port}`);



const tmi = require('tmi.js');

// Define configuration options
const opts = {
  identity: {
    username: process.env.BOT_USERNAME,
    password: process.env.OAUTH_TOKEN
  },
  channels: [
    process.env.CHANNEL_NAME
  ]
};

// Create a client with our options
const client = new tmi.client(opts);

// Register our event handlers (defined below)
client.on('message', onMessageHandler);
client.on('connected', onConnectedHandler);

// Connect to Twitch:
client.connect();

// Called every time a message comes in
function onMessageHandler (target, context, msg, self) {
  if (self) { return; } // Ignore messages from the bot

  // Remove whitespace from chat message
  const commandName = msg.trim().toLowerCase();
  const user = context['display-name'];
  const channelName = 'XStarWake'
  let chan = target.slice(1);
  
  
  
  
  // TEST CODE *****************************************
  
  
  const rp = require('request-promise');

    function getChatters(channelName, _attemptCount = 0) {
        return rp({
            uri: `https://tmi.twitch.tv/group/user/${channelName}/chatters`,
            json: true
        })
        .then(data => {
            return Object.entries(data.chatters)
                .reduce((p, [ type, list ]) => p.concat(list.map(name => {
                    if(name === channelName) type = 'broadcaster';
                    return { name, type };
                })), []);
        })
        .catch(err => {
            if(_attemptCount < 3) {
                return getChatters(channelName, _attemptCount + 1);
            }
            throw err;
        })
    }

    function getRandomChatter(channelName, opts = {}) {
        let {
            onlyViewers = false,
            noBroadcaster = false,
            skipList = []
        } = opts;
        return getChatters(channelName)
        .then(data => {
            let chatters = data
            .filter(({ name, type }) =>
                !(
                    (onlyViewers && type !== 'viewers') ||
                    (noBroadcaster && type === 'broadcaster') ||
                    skipList.includes(name)
                )
            );
        return chatters.length === 0 ?
            null :
            chatters[Math.floor(Math.random() * chatters.length)];
        });
    }

   if(commandName === '!randomuser') {
        // Get a random user but skip the user requesting a random user
        getRandomChatter(chan, { skipList: context['display-name'] })
        .then(userName => {
            if(userName === null) {
                client.say(chan, `${user}, there was no one to choose.`);
            }
            else {
                let { name, type } = userName;
                client.say(chan, `${user}, I chose "${name}" with type ${type}!`);
            }
        })
        .catch(err => console.log('[ERR]', err));
    }
}

function onConnectedHandler (addr, port) {
  console.log(`* Connected to ${addr}:${port}`);
}
