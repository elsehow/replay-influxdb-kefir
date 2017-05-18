# replay-influxdb-kefir

replay [influx](https://node-influx.github.io/) databases as [kefir streams](https://rpominov.github.io/kefir/)

## example

```javascript
const influxdb = new Influx.InfluxDB({
  host: 'localhost',
  database: 'river-measurements',
})

stream = replay(influxdb, 'ticker', '2016-01-01', '2016-01-30')
  .filter(measurement => measurement['tags']['location'] === 'santa monica')
  .map(measurement => measurement['fields']['depth'])
  .log()

```

## install

```
npm i replay-influxdb-kefir
```

## api


### replay(influxdb, measurement, [startTime, endTime, limitPerQuery])

`startTime` is an optional string, representing datetime at which replay will start. (by default, will start from the beginning of time).

`endTime` is an optional string, representing datetime at which replay will start. (by default, will query until the end of time).

`limitPerQuery` is an optional integer. this module will auto-split queries for large amounts of data, and this integer represents how many rows will be queried, at maximum, at a time. larger values will move through databases at a greater speed, where smaller values will return batches more rapidly. the default value is 100000.

## license

BSD
