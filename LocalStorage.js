/**
 * 本地缓存 类
 */
export default class LocalStorage {
  constructor () {
    this.expiredTime = 24 * 60 * 60 * 1000
  }
  /**
     * 默认获取是否支持本地缓存
     * @returns {Storage}
     */
  static getLocalStorage () {
    if (!localStorage) {
      throw new Error('Need localStorage')
    }
    return localStorage
  }

  /**
     * 添加本地缓存
     */
  static add (key, value) {
    if (value === undefined) {
      value = null
    }

    const localStorage = this.getLocalStorage()
    const obj = {
      data: value,
      expired: key,
      time: +new Date().getTime()
    }
    localStorage.setItem(key, JSON.stringify(obj))
  }

  /**
     * 获取本地缓存的KEY,过期的回调函数返回过期前的数据.
     * @param key
     * @param callback
     * @returns {null}
       */
  static get (key, callback) {
    const localStorage = this.getLocalStorage()
    const _value = localStorage.getItem(key)
    if (_value) {
      const JSON_VALUE = JSON.parse(_value)
      // 如果过期执行的方法
      if (this.getExp(JSON_VALUE.time)) {
        callback && callback(JSON_VALUE)
        this.remove(key)
      } else {
        return JSON_VALUE.data
      }
    }
    return null
  }

  /**
    * d更新本地缓存,存在就更新 不存在就返回NULL;
    * @param key
    * @param value
      * @returns {null}
      */
  static update (key, value) {
    const json = JSON.parse(localStorage.getItem(key))
    if (json != null) {
      const obj = {
        data: value,
        expired: key,
        time: +new Date().getTime()
      }
      localStorage.setItem(key, JSON.stringify(obj))
    } else {
      return null
    }
  }

  /**
      * 删除相对应KEY的本地缓存
      * @param key
        */
  static remove (key) {
    const localStorage = this.getLocalStorage()
    localStorage.removeItem(key)
  }

  /**
     * 清除所有本地缓存
     */
  static clear () {
    const localStorage = this.getLocalStorage()
    localStorage.clear()
  }

  static getExp (time) {
    // 当过期
    const expiredTime = 24 * 60 * 60 * 1000
    if (new Date().getTime() - time <= expiredTime) {
      return false// 未过期
    } else {
      return true// 过期
    }
  }
}
