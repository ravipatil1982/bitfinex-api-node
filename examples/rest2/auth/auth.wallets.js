const debug = require('debug')('bfx:examples:rest2_positions')
const bfx = require('../../bfx')
const rest = bfx.rest(2, { transform: true })

const crypto = require('crypto')
const request = require('request')

const apiKey = 'PhswPVMLUXXzFx1gTlA7d2pGFzzFblJFAq4HuQUP4MC'
const apiSecret = 'G3qjBa7rr9kckmQwqk1QXtUveaSDGSxI63t7xYtMEv9'

const apiPath = 'v2/auth/r/wallets'
const nonce = Date.now().toString()
const queryParams = ''

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
  colWidths: [15, 12, 16, 20, 20],
  head: [
    'Wallet Type', 'Currency', 'Balance', 'Unsettled interest', 'Balance Available'
  ]
})

request.post(options, (error, response, body) => {

  console.log('body: ', body)
  body.forEach(function(trade) {
    //trade = body[i]
    //console.log(' trade data : ', trade);
    t.push([
      trade[0], trade[1], trade[2], trade[3], trade[4]
    ])
  })

  console.log('====== Wallets ======',)
  if(t.length>0)
  {
    console.log(t.toString())
  }
  else
  {
    console.log('No data available')
  }
})
