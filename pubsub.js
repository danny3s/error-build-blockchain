const PubNub = require('pubnub');

const credentials = {
    publishKey: 'pub-c-fooo',
    subscribeKey: 'sub-c-fpooo',
    secretKey: 'sec-c-foo'
};

const CHANNELS = {
    TEST: 'TEST',
    BLOCKCHAIN: 'BLOCKCHAIN',
};

class PubSub{
    constructor({ blockchain}) {

        this.blockchain = blockchain;

        this.pubnub = new PubNub(credentials);

        this.pubnub.subscribe({
            channels: [Object.values(CHANNELS)]
          });

        this.pubnub.addListener({
            message: messageObject => {
                const { channel, message } = messageObject;
                console.log(`Message received. Channel: ${channel}. Message: ${message}`);
            }
        });
        
    }



    listener() {
        return {
            message: messageObject => {
                const { channel, message } = messageObject;

                console.log(`Message received. Channel: ${channel}. Message: ${message}`);

                const parsedMessage = JSON.parse(message);

                if(chanel === CHANNELS.BLOCKCHAIN){
                    this.blockchain.replaceChain(parsedMessage);
                }
            }
        };
    }

   publish({ channel, message }) {
       this.pubnub.publish({ channel, message });
   }     

   broadcastChain() {
    this.publish({
      channel: CHANNELS.BLOCKCHAIN,
      message: JSON.stringify(this.blockchain.chain)
    });
  }
}

// const testPubSub = new PubSub();
// testPubSub.publish({ channel: CHANNELS.TEST, message: 'hello pubnub'});


module.exports = PubSub;
