import redis from "redis"
import { promisifyAll } from "bluebird"
import config from "./index"

const options = {
  host: config.REDIS.host,
  port: config.REDIS.port,
  password: config.REDIS.password,
  detect_buffers: true,
  retry_strategy: function (options) {
    //重连redis的设置
    if (options.error && options.error.code === "ECONNREFUSED") {
      //options配置错误
      return new Error("The server refused the connection")
    }
    if (options.total_retry_time > 1000 * 60 * 60) {
      //超时
      return new Error("Retry time exhausted")
    }
    if (options.attempt > 10) {
      //尝试次数过多
      return undefined
    }
    // 返回以上的错误信息后，进行重新连接
    return Math.min(options.attempt * 100, 3000)
  },
}

const client = redis.createClient(options)
promisifyAll(client)

//监听连接状态
client.on("error", (err) => {
  console.log("Redis Client Error:" + err)
})

const setValue = (key, value, time) => {
  if (typeof value === "undefined" || value == null || value === "") {
    return
  }
  if (typeof value === "string") {
    if (typeof time !== "undefined") {
      client.set(key, value, "EX", time) //设置缓存过期时间
    } else {
      client.set(key, value)
    }
  } else if (typeof value === "object") {
    Object.keys(value).forEach((item) => {
      //value是对象，遍历赋值
      // { key1: value1, key2: value2}
      // Object.keys(value) => [key1, key2]
      client.hset(key, item, value[item], redis.print)
    })
  }
}

const getValue = (key) => {
  return client.getAsync(key)
}

const getHValue = (key) => {
  return client.hgetallAsync(key)
}

const delValue = (key) => {
  client.del(key, (err, res) => {
    if (res === 1) {
      console.log("删除成功")
    } else {
      console.log("删除失败：" + err)
    }
  })
}

export { client, setValue, getValue, getHValue, delValue }
