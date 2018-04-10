export default class Bus {
  constructor(scope) {
    this.scope = scope
    this.pool = {}
  }

  /**
   * register message handler
   * @param message {String}
   * @param handler {Function}
   */
  on(message, handler) {
    let bucket = this.pool[message]

    if (!bucket) {
      bucket = []
      this.pool[message] = bucket
    }

    if (bucket.includes(handler)) {
      // ignore already existed handler
    } else {
      bucket.push(handler)
    }
  }

  /**
   *
   * @param message {String}
   * @param handler {Function}
   */
  off(message, handler) {
    const bucket = this.pool[message]
    if (Array.isArray(bucket)) {
      const idx = bucket.indexOf(handler)
      if (idx !== -1) {
        bucket.splice(idx, 1)
      }
    }
  }

  /**
   *
   * @param message {String}
   * @param payload {Object}
   */
  trigger(message, payload = null) {
    const bucket = this.pool[message]
    if (Array.isArray(bucket)) {
      bucket.forEach(handler => handler(message, payload))
    }
  }
}
