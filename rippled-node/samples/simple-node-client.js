const RippledWsClient = require('../')

new RippledWsClient('ws://127.0.0.1:6005', 'protocol://host/url').then((Connection) => {
  console.log('<< Connected, now in "then" >>')

  Connection.on('error', (error) => {
    console.error('EVENT=error: Error', error)
  })
  Connection.on('state', (stateEvent) => {
    console.info('EVENT=state: State is now', stateEvent)
  })
  /*
  Connection.on('retry', (retryEvent) => {
    console.log('EVENT=retry: << Retry connect >>', retryEvent)
  })
  */
  Connection.on('reconnect', (reconnectEvent) => {
    console.log('EVENT=reconnect: << Reconnected >>', reconnectEvent)
  })
  Connection.on('close', (closeEvent) => {
    console.log('EVENT=close: Connection closed', closeEvent.reason || '')
  })
  Connection.on('ledger', (ledgerInfo) => {
    console.log('EVENT=ledger: ledgerInfo:', ledgerInfo);
    Connection.send(
      {
        'id':2,
        'command': 'account_info',
        'account': 'rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh',
        'strict': true,
        'ledger_index': 'current',
        'queue': true
      }
    ).then((r) => {
      console.log('subscribe Response', r)
    }).catch((e) => {
      console.log('subscribe Catch', e)
    })
  })
  Connection.on('transaction', (transaction) => {
    console.log('EVENT=transaction: transaction:', transaction)
  })
  Connection.on('validation', (validation) => {
    console.log('EVENT=validation: validation', validation)
  })

  let getStateInterval = setInterval(() => {
    // Get the client state with some stats every 5 seconds
    const state = Connection.getState()
    if (state.online) {
      console.log('-- state --', state);

      Connection.send(
        {
          "id": 2,
          "command": "sign",
          "tx_json" : {
              "TransactionType" : "Payment",
              "Account" : "rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh",
              "Destination" : "ra5nK24KXen9AHvsdFTKHSANinZseWnPcX",
              "Amount" : {
                 "currency" : "XRP",
                 "value" : "1"
              }
           },
           "secret" : "s████████████████████████████",
           "offline": false,
           "fee_mult_max": 1000
        }
      ).then((r) => {
        console.log('subscribe Response', r)
      }).catch((e) => {
        console.log('subscribe Catch', e)
      })

    }
  }, 5 * 1000)

  setTimeout(() => {
    Connection.send({
      command: 'server_info'
    }).then((r) => {
      console.log('server_info Response', r)
    }).catch((e) => {
      console.log('server_info Catch', e)
    })
  }, 10 * 1000)

  Connection.send({
    command: 'subscribe',
    accounts: [ 'rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh']
  }).then((r) => {
    console.log('subscribe Response', r)
  }).catch((e) => {
    console.log('subscribe Catch', e)
  })

  setTimeout(() => {
    clearTimeout(getStateInterval)
    /*
    Connection.close().then((CloseState) => {
      // console.log('<< Closed socket after 120 seconds >>', CloseState)
      console.log('<< Closed socket after 120 seconds >>')
    }).catch(CloseError => {
      console.log('<< Closed socket ERROR after 120 seconds >>', CloseError)
    })
    */
  }, 120 * 1000)
}).catch((r) => {
  // E.g.: when WebSocket URI is faulty
  console.log('Couldn\'t connect', r)
})
