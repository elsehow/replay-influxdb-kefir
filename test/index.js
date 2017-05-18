const test = require('tape')
const Influx = require('influx');
const replay = require('..')

function strictlyOrdered (lst) {
  return lst.slice(1).reduce(function (one, two) {
    if (one && two>=one)
      return two
    throw 'err'
    return false
  }, lst[0])
}

function count (acc, cur) {
  return acc+= 1
}

/*
  tests main
  */

const influxdb = new Influx.InfluxDB({
  host: 'localhost',
  database: 'historical-poloniex',
})


test('replays are strictly ordered in time', t => {

  t.plan(3)
  stream = replay(influxdb, 'ticker', '2016-05-01', '2016-06-30')
    .map(measurement => measurement['time'])
  // produce a buffer of some size
    .bufferWithCount(300)
  // reduce over all values in the buffer
  // making sure each value is larger than the one before
    .map(strictlyOrdered)
    .debounce(10)
    // .log()
    .onValue(v => {
      t.ok(v)
    })
})

test('replays produce all values', t => {
  let planning = 22
  let i = 0
  const stream = replay(influxdb, 'ticker')
    .scan(count, 0)
    .debounce(10)
    .onValue(cnt => {
      console.log(cnt)
      i+=1
      if (i == planning) {
        t.equal(cnt, 2078970)
        t.end()
      }
    })
})

