const debug = require('debug')('bfx:examples:rest2_positions')
const bfx = require('../../bfx')
const rest = bfx.rest(2, { transform: true })

const crypto = require('crypto')
const request = require('request')

const apiKey = 'PhswPVMLUXXzFx1gTlA7d2pGFzzFblJFAq4HuQUP4MC'
const apiSecret = 'G3qjBa7rr9kckmQwqk1QXtUveaSDGSxI63t7xYtMEv9'

const apiPath = 'v2/auth/r/funding/offers/fUSD/hist'
const queryParams = ''

const body = {}
const nonce = Date.now().toString()
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
  colWidths: [13, 10,    16,             16,            14,           16,       10,       14],
  head: ['ID', 'SYMBOL', 'MTS_CREATED', 'MTS_UPDATED', 'AMOUNT', 'AMOUNT_ORIG', 'TYPE', 'FLAGS']
})

const t1 = new Table({
colWidths: [13,   10,      14,       14,         14,    14],
  head: ['STATUS','RATE', 'PERIOD', 'NOTIFY', 'HIDDEN', 'RENEW']
})

request.post(options, (error, response, body) => {

  body.forEach(function(trade) {
    t.push([trade[0], trade[1], trade[2], trade[3], trade[4], trade[5], trade[6], trade[7]])
    t1.push([ trade[8], trade[9], trade[10], trade[11], trade[12]])
  })

  console.log('====== Funding Offer History ======')
  console.log('body : ', body)

  if(t.length>0)
  {
    console.log(t.toString())
    console.log(t1.toString())
  }
  else
  {
    console.log('No data available')
  }

})
