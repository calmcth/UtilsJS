import Stomp from 'stompjs'
import SockJS from 'sockjs-client'
export default {
  data () {
    return {
      socket: null,
      stompClient: null
    }
  },
  created () {
    this.initWebSocket()
  },
  destroyed () {
    this.disconnect()
  },
  methods: {
    recevieWsMsg (msg) {
      this.$bus.$emit(msg.type, msg.data, 'websocket')
    },
    initWebSocket () {
      if (this.socket) {
        this.socket = null
      }
      if (this.stompClient) {
        this.stompClient = null
      }
      // 建立连接对象
      this.socket = new SockJS(`/socket/contactChatSocket`) // 连接服务端提供的通信接口，连接以后才可以订阅广播消息和个人消息
      // 获取STOMP子协议的客户端对象
      this.stompClient = Stomp.over(this.socket)
      // 定义客户端的认证信息,按需求配置
      // 向服务器发起websocket连接
      this.stompClient.connect({}, (frame) => {
        this.stompClient.subscribe(`/topic/dispatchstatus`, (msg) => { // 订阅服务端提供的某个topic
          const res = JSON.parse(msg.body)
          this.$bus.$emit(res.type, res.data)
        })
        this.stompClient.subscribe(`/user/queue/msg`, (msg) => { // 订阅服务端提供的某个topic
          const res = JSON.parse(msg.body)
          this.$bus.$emit(res.type, res.data)
        })
      }, (err) => {
        console.log(err)
      })
    },
    disconnect () {
      if (this.stompClient != null) {
        this.stompClient.disconnect()
      }
    }
  }
}
