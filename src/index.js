const kefir = require('kefir')
const partial = require('lodash.partial')
// influxdb's minimum and maximum accepted times...
const defaultStart='1677-09-21 00:12:43.145224194'
const defaultEnd='2262-04-11T23:47:16.854775806Z'

function count (measurement, start, end) {
  return `
select count(*) from ${measurement}
where time >= '${start}' and time < '${end}'
`
}

function query (measurement,
                start, end,
                limit, offset) {
  const q = `
select * from ${measurement}
where time >= '${start}' and time < '${end}'
order by time asc
limit ${limit} offset ${offset}
`
  return q
}

function replaySection (influxdb, measurement,
                        start, end,
                        limit, offset) {
  return kefir.stream(function (emitter) {
    influxdb
      .query(query(measurement,
                   start, end,
                   limit, offset))
      .then(function (rows) {
        rows.forEach(emitter.emit)
      })
      .then(emitter.end)
  })
}

function replay (influxdb, measurement,
                 startTime=defaultStart, endTime=defaultEnd,
                 perQueryLimit=100000) {
  const countQuery = kefir.fromPromise(influxdb.query(count(measurement, startTime, endTime)))
      .map(c => c[0])
      .map(c => c[Object.keys(c)[2]])

  return countQuery
      .flatMap(rowCount => {
        const replayF = partial(replaySection,
                                influxdb, measurement,
                                startTime, endTime)
        const numQueries = Math.ceil(rowCount / perQueryLimit)
        const replays = []
        for (let i=0; i<numQueries; i+=1) {
          let offset = i*perQueryLimit
          replays.push(replayF(perQueryLimit, offset))
        }
        return kefir.concat(replays)
      })
}

module.exports = replay
