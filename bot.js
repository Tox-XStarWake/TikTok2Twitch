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
  
  

  
  
  
  
  
  
  
  
  
  
  
  
//  var RandomChatter = 
  
  
  
  
  
  
  
  
  
  
  
  // END TEST CODE ******************************
  
  
  // Commands Based on Sender
  
  
  
//  if (user === 'Toxic__Salt') {
//    client.say(target, 'ERROR 8675309');
//  } else {
//    console.log(`Mesage not from Tox from ${user} instead`);
//  }
    
//   if (user === 'Toxic__Salt') {
//      process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
//      const request = require('request');
//      request('https://api.thefyrewire.com/twitch/pastebin/fmqCQrrP?user=${user}&randuser=${random.chatter}', function (error, response, body) {
//          console.error('error:', error); 
//         console.log('statusCode:', response && response.statusCode); 
//         client.say(target, `Who ${user} created ${body}`);
//     });  
     
//    } else {
//    console.log(`* Unknown command ${commandName}`);
//  }  
  
  
//    if (user === 'Proto_Peach') {
   if (commandName === '!rude') {
      process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
      const request = require('request');
      request('https://api.thefyrewire.com/twitch/pastebin/fmqCQrrP?user=${user}&randuser=${random.chatter}', function (error, response, body) {
          console.error('error:', error); 
          console.log('statusCode:', response && response.statusCode); 
        
          getRandomChatter(chan, { skipList: context['display-name'] })
          .then(userName => {
              if(userName === null) {
                client.say(chan, `${user}, there was no one to choose.`);
              }
              else {
                let { name, type } = userName;
                client.say(target, `By the way ${user} one of our awesome viewers, ${name} ${body}`);
              }
        })
        .catch(err => console.log('[ERR]', err));
        
        
        
        
//          client.say(target, `By the way ${user} one of our awesome viewers, ${name} ${body}`);
      });  
     
    } else {
    console.log(`* Unknown command ${commandName}`);
  }  
  
  
  
  
  
  
  
  



  
  
  
  
  
  // Commands based on message
 
  if (commandName === '!hunt') {
    
    let ArrDBDItems = ['Null Item', 'Flashlight', 'Toolbox', 'Key', 'Medkit', 'Map'];
    
    var randomnumber = Math.floor(Math.random() * (5 - 1 + 1)) + 1;    
    var item = ArrDBDItems[(randomnumber)]  
    client.say(target, `Here are the Rules... Whomever brings a ${item} to Max in this game, will win a cup of the new Entity Ver 2 Commands!`);
    
    console.log(`* Executed ${commandName} command`);

  } else {
    console.log(`* Unknown command ${commandName}`);
  }

  if (commandName === '!hardhunt') {
    
    let ArrDBDItems = ['Null Item', 'Yellow Flashlight', 'Green Flashlight', 'Purple Flashlight', 'Gray Toolbox', 'Yellow Toolbox', 'Green Toolbox', 'Purple Toolbox', 'Green Key', 'Puprple Key', 'Pink Key', 'Grey Medkit', 'Yellow Medkit', 'Green Medkit', 'Purple Medkit', 'Green Map', 'Pink Map'];
    
    var randomnumber = Math.floor(Math.random() * (16 - 1 + 1)) + 1;    
    var item = ArrDBDItems[(randomnumber)]  
    client.say(target, `Here are the Rules... Whomever brings a ${item} to Max in this game, will win a bucket of the new Entity Ver 2 Commands!`);
    
    console.log(`* Executed ${commandName} command`);

  } else {
    console.log(`* Unknown command ${commandName}`);
  }
  
  
  
//  if (commandName === '!max') {
//    client.say(target, `Toxic Fixes Everything and Max Sucks Giant Peepee no he sucks tiny peepee he isn't good enough for giant peepee`);
//    console.log(`* Executed ${commandName} command`);
//  } else {
//    console.log(`* Unknown command ${commandName}`);
//  }

  if (commandName === '!proto_peach') {
    client.say(target, `PrOto lIk3s iT wHeN cAp1TalizAt10n iS c0reCt!!!`);
    console.log(`* Executed ${commandName} command`);
  } else {
    console.log(`* Unknown command ${commandName}`);
  }

//  if (commandName === '!bbtest') {
//    client.say(target, `Context is ${contextName} for reference`);
//    console.log(`* Executed ${commandName} command`);
//  } else {
//    console.log(`* Unknown command ${commandName}`);
//  }

  if (commandName === '!new-survivor') {
    client.say(target, `The new survivor is Yoichi Asakawa. His three new teachable perks are:`);
    client.say(target, `BOON: Dark Theory; Any Survivors within the Boon Totem’s range gain a 2% Haste status effect. This effect lingers for 2/3/4 seconds after leaving the Boon Totem’s range.`);
    client.say(target, `EMPATHIC CONNECTION; Whenever another Survivor is injured, they can see your aura within a range of 32/48/96 meters. You heal other Survivors 10% faster.`);
    client.say(target, `PARENTAL GUIDANCE; After stunning the Killer by any means, your scratch marks, pools of blood and grunts of pain are hidden for 8/9/10 seconds.`);
    console.log(`* Executed ${commandName} command`);
  } else {
    console.log(`* Unknown command ${commandName}`);
  }
  
  if (commandName === '!new-killer') {
    client.say(target, `The new Killer is The ONRYŌ. Her three new teachable perks are:`);
    client.say(target, `SCOURGE HOOK: Floods of Rage; At the start of the trial, up to 4 random hooks are changed into scourge hooks. You see their auras in white. When a Survivor is unhooked from a scourge hook, all other Survivors have their auras revealed for 5/6/7 seconds.`);
    client.say(target, `CALL OF BRINE; After damaging a generator this perk becomes active for 60 seconds. The generator regresses at 150%/175%/200% of the normal regression speed and its aura is revealed to you. Each time a Survivor completes a good Skill Check on a generator affected by this perk, you receive a loud noise notification.`);
    client.say(target, `MERCILESS STORM; When a generator reaches 90% progress, Survivors working on the generator will be faced with continuous Skill Checks. If they miss or stop repairing, the generator is blocked for 16/18/20 seconds. Merciless Storm can only trigger once per generator per trial.`);
    console.log(`* Executed ${commandName} command`);
  } else {
    console.log(`* Unknown command ${commandName}`);
  }  

     if (commandName === '!lurk') { 
      process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
      const request = require('request');
      request('https://api.thefyrewire.com/twitch/pastebin/setqsT6W', function (error, response, body) {
          console.error('error:', error); 
          console.log('statusCode:', response && response.statusCode); 
          client.say(target, `/me ${user} ${body}`);
      });  
     
    } else {
    console.log(`* Unknown command ${commandName}`);
  }   
  
//   if (commandName === '!test') { 
//      process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
//      const request = require('request');
//      request('http://api.thefyrewire.com/twitch/pastebin/LJRWJZQw?return=4', function (error, response, body) {
//          console.error('error:', error); 
//          console.log('statusCode:', response && response.statusCode); 
//          client.say(target, `4 perks are: ${body}`);
//      });  
//     
//    } else {
//    console.log(`* Unknown command ${commandName}`);
//  }  
  
  
  
  
  
}


// Called every time the bot connects to Twitch chat
function onConnectedHandler (addr, port) {
  console.log(`* Connected to ${addr}:${port}`);
}
