import axios from 'axios'
import { Message } from 'element-ui'
import store from '../store'
import { getToken } from '@/utils/auth'
import { basePath } from '@/utils'

// 创建axios实例
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // api的base_url
  timeout: 5000 // 请求超时时间
})

// post 请求默认使用表单方式
service.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'

// request拦截器
service.interceptors.request.use(
  config => {
    if (Object.prototype.toString.call(config.data) === '[object File]' && config.method === 'post') {
      config.headers = {
        'Content-Type': 'multipart/form-data; boundary=----WebKitFormBoundaryyHNOPAYS4tnTa20d'
      }
    }
    if (store.getters.token) {
      config.headers['X-Token'] = getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
    }
    return config
  },
  error => {
    // Do something with request error
    console.log(error) // for debug
    Promise.reject(error)
  }
)

// respone拦截器
service.interceptors.response.use(
  response => {
    return response.data
  },
  error => {
    console.log('err' + error) // for debug
    let msg = error.message
    const errorData = error.response ? error.response.data : null
    if (errorData) {
      if (error.response.status === 401 && errorData.code === 'E000001') {
        location.reload() // 判断用户不存在，执行退出
      }
      if (error.response.status === 400) {
        msg = `${errorData.code}: ${errorData.message}`
      }
      if (error.response.status === 403) {
        window.location.href = basePath + '/#/login'
        return Promise.resolve()
      }
    }
    Message({
      message: msg,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(errorData || error)
  }
)

export default service
