const PubNub = require('pubnub');

const credentials = {
    publishKey: 'pub-c-3119-a910756d60b2',
    subscribeKey: 'sub-c-00cafe81137d4bc',
    secretKey: 'sec-c-Njc0'
};

const CHANNELS = {
    TEST: 'TEST',
    BLOCKCHAIN: 'BLOCKCHAIN',
    TRANSACTION: 'TRANSACTION'
};

class PubSub{
    constructor({ blockchain, transactionPool, wallet}) {

        this.blockchain = blockchain;
        this.transactionPool = transactionPool;
        this.wallet = wallet;

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

            switch(channel){
              case CHANNELS.BLOCKCHAIN:
                break;
                case CHANNELS.TRANSACTION:
            if (!this.transactionPool.existingTransaction({
              inputAddress: this.wallet.publicKey
            })) {
              this.transactionPool.setTransaction(parsedMessage);
            }
            break;

              default:
              return;

            }
    
          }
        }
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

  broadcastTransaction(transaction) {
    this.publish({
      channel: CHANNELS.TRANSACTION,
      message: JSON.stringify(transaction)
    });
  }

}

// const testPubSub = new PubSub();
// testPubSub.publish({ channel: CHANNELS.TEST, message: 'hello pubnub'});


module.exports = PubSub;
