export default {
  data () {
    return {
      socket: null,
      datas: []
    }
  },
  created () {
    this.initWebSocket()
    this.$bus.$on('websocket:send', (userId, msg) => {
      this.sendWsMsg(userId, msg)
    })
    window.addEventListener('online', this.reinitWebSocketOnOnline)
  },
  destroyed () {
    window.removeEventListener('online', this.reinitWebSocketOnOnline)
  },
  methods: {
    recevieWsMsg (msg) {
      this.$bus.$emit(msg.type, msg.data, 'websocket')
    },
    sendWsMsg (userId, msg) {
      let data = JSON.stringify({
        type: 'msg',
        data: {
          toUser: userId,
          content: msg
        }
      })
      if (this.socket && this.socket.readyState === WebSocket.OPEN) {
        this.socket.send(data)
      } else {
        this.datas.push(data)
        this.reinitWebSocketOnOnline()
      }
    },
    reinitWebSocketOnOnline () {
      if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
        console.log('reinit WebSocket on online event')
        this.initWebSocket()
      }
    },
    initWebSocket () {
      if (this.socket) {
        this.socket.close()
        this.socket = null
      }
      this.socket = new WebSocket('ws://' + location.host + '/ws')
      this.socket.addEventListener('open', (event) => {
        let il = setInterval(() => {
          if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            this.socket.send('heartbeat')
          } else {
            clearInterval(il)
          }
        }, 1 * 60 * 1000)
        for (const data of this.datas) {
          this.socket.send(data)
        }
        this.datas = []
      })
      this.socket.addEventListener('message', (event) => {
        try {
          this.recevieWsMsg(JSON.parse(event.data))
        } catch (e) {
          console.error('websocket message json error', e)
        }
      })
      this.socket.addEventListener('close', (event) => {
        this.socket = null
      })
      this.socket.addEventListener('error', (event) => {
        if (window.navigator.onLine) {
          setTimeout(() => {
            console.log('try to reinit WebSocket on error')
            this.initWebSocket()
          }, 1 * 60 * 1000)
        }
      })
    }
  }
}
