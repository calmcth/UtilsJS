// 全局Bus插件
export default {
  install (Vue, options) {
    function Bus () {
      this.cbs = []
    }
    Object.assign(Bus.prototype, {
      _origin_bus: new Vue(),
      $emit (event, ...args) {
        this._origin_bus.$emit(event, ...args)
      },
      $on (event, callback) {
        this._origin_bus.$on(event, callback)
        this.cbs.push([event, callback])
      },
      $once (event, callback) {
        this._origin_bus.$once(event, callback)
        this.cbs.push([event, callback])
      },
      $off (...args) {
        // 参考api的事件移除策略 https://cn.vuejs.org/v2/api/#vm-off-event-callback
        if (args.length > 0) {
          this._origin_bus.$off(...args)
          let [event, fn] = args
          let es = Array.isArray(event) ? event.map(e => [e, fn]) : args
          for (let x = 0, l = es.length; x < l; x++) {
            let ecb = es[x]
            let cb
            let i = this.cbs.length
            while (i--) {
              cb = this.cbs[i]
              if (cb[1] === ecb[1] || cb[0] === ecb[0]) {
                this.cbs.splice(i, 1)
                break
              }
            }
          }
        } else {
          for (let i = 0, l = this.cbs.length; i < l; i++) {
            this._origin_bus.$off(...this.cbs[i])
          }
          this.cbs = []
        }
      }
    })
    Object.defineProperty(Vue.prototype, '$bus', {
      get () {
        if (!this._bus) {
          this._bus = new Bus()
        }
        return this._bus
      }
    })
    Vue.mixin({
      beforeDestroy () {
        if (this._bus) {
          this._bus.$off()
        }
      }
    })
  }
}
