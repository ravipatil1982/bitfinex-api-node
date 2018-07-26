const debug = require('debug')('bfx:examples:rest2_positions')
const bfx = require('../../bfx')
const rest = bfx.rest(2, { transform: true })

const crypto = require('crypto')
const request = require('request')

const apiKey = 'PhswPVMLUXXzFx1gTlA7d2pGFzzFblJFAq4HuQUP4MC'
const apiSecret = 'G3qjBa7rr9kckmQwqk1QXtUveaSDGSxI63t7xYtMEv9'

const apiPath = 'v2/auth/r/trades/tBTCUSD/hist'
const nonce = Date.now().toString()
const queryParams = 'start=24&end=26&limit=3'

const body = {}
let signature = `/api/${apiPath}${nonce}${JSON.stringify(body)}`

const sig = crypto.createHmac('sha384', apiSecret).update(signature)
const shex = sig.digest('hex')

const options = {
  url: `https://test.bitfinex.com/${apiPath}`,
  headers: {
    'bfx-nonce': nonce,
    'bfx-apikey': apiKey,
    'bfx-signature': shex
  },
  body: body,
  json: true
}

const Table = require('cli-table2')
const t = new Table({
  colWidths: [12, 12, 16, 14, 14, 14, 10, 10, 10, 16],
  head: [
    'ID', 'PAIR', 'MTS_CREATE', 'ORDER_ID', 'EXEC_AMOUNT', 'EXEC_PRICE', 'ORDER_TYPE', 'ORDER_PRICE',
    'MAKER', 'FEE'
  ]
})

request.post(options, (error, response, body) => {

  body.forEach(function(trade) {
    //trade = body[i]
    //console.log(' trade data : ', trade);
    t.push([
      trade[0], trade[1], trade[2], trade[3], trade[4], trade[5], trade[6], trade[7], trade[8], trade[9]
    ])
  })

  console.log('====== Trades ======',)
  if(t.length>0)
  {
    console.log(t.toString())
  }
  else
  {
    console.log('No data available')
  }
})
