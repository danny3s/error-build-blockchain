const PubNub = require('pubnub');

const credentials = {
    publishKey: 'pub-9119-a910756d60b2',
    subscribeKey: 'sub-c-ee81137d4bc',
    secretKey: 'sec-c-NjcyODcwYjZm'
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

          this.pubnub.addListener(this.listener());
        
    }


    listener() {
        return {
          message: messageObject => {
            const { channel, message } = messageObject;
    
            console.log(`Message received. Channel: ${channel}. Message: ${message}`);
            const parsedMessage = JSON.parse(message);

        

            switch(channel){
              case CHANNELS.BLOCKCHAIN:
              this.blockchain.replaceChain(parsedMessage, () => {
                this.transactionPool.clearBlockchainTransactions(
                  { chain: parsedMessage.chain }
                );
              });
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
