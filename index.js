/**
 * Created by jiachenpan on 16/11/18.
 */
import qs from 'qs'
import pako from 'pako'

export function parseTime (time, cFormat) {
  if (arguments.length === 0) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if (('' + time).length === 10) time = parseInt(time) * 1000
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const timeStr = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key]
    if (key === 'a') { return ['一', '二', '三', '四', '五', '六', '日'][value - 1] }
    if (result.length > 0 && value < 10) {
      value = '0' + value
    }
    return value || 0
  })
  return timeStr
}

export function formatTime (time, option) {
  time = +time * 1000
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return (
      d.getMonth() +
      1 +
      '月' +
      d.getDate() +
      '日' +
      d.getHours() +
      '时' +
      d.getMinutes() +
      '分'
    )
  }
}
/**
 * 毫秒转时间格式
 */
export function longMsTimeConvertToDateTime (time) {
  const myDate = new Date(time)
  return formatDateTime(myDate)
  function formatDateTime (date) {
    let result = '--'
    if (date && date !== null && date !== '') {
      const datetime = new Date(date)
      result = datetime.getFullYear() +
        '-' +// "年"
        ((datetime.getMonth() + 1) >= 10 ? (datetime.getMonth() + 1) : '0' +
          (datetime.getMonth() + 1)) +
        '-' +// "月"
        (datetime.getDate() < 10 ? '0' + datetime.getDate() : datetime
          .getDate()) +
        ' ' +
        (datetime.getHours() < 10 ? '0' + datetime.getHours() : datetime
          .getHours()) +
        ':' +
        (datetime.getMinutes() < 10 ? '0' + datetime.getMinutes() : datetime
          .getMinutes()) +
        ':' +
        (datetime.getSeconds() < 10 ? '0' + datetime.getSeconds() : datetime
          .getSeconds())
    }
    return result
  }
}
/**
 * @描述：格式化去日期（含时间）
 * @创建人：cth
 * @创建时间：2018年1月18日
 */
export function formatDateTime (date) {
  let result = '--'
  if (date && date !== null && date !== '') {
    const datetime = new Date(date)
    result = datetime.getFullYear() +
            '-' +// "年"
            ((datetime.getMonth() + 1) >= 10 ? (datetime.getMonth() + 1) : '0' +
                (datetime.getMonth() + 1)) +
            '-' +// "月"
            (datetime.getDate() < 10 ? '0' + datetime.getDate() : datetime
              .getDate()) +
            ' ' +
            (datetime.getHours() < 10 ? '0' + datetime.getHours() : datetime
              .getHours()) +
            ':' +
            (datetime.getMinutes() < 10 ? '0' + datetime.getMinutes() : datetime
              .getMinutes()) +
            ':' +
            (datetime.getSeconds() < 10 ? '0' + datetime.getSeconds() : datetime
              .getSeconds())
  }
  return result
}

export function queryString (str) {
  return qs.stringify(str, { allowDots: true, indices: false })
}

// export function baseUrl() {
//   return process.env.BASE_API
// }
export const baseUrl = process.env.VUE_APP_BASE_API

export const inDev = process.env.NODE_ENV === 'development'

export const basePath = inDev ? '' : (process.env.BASE_URL || '/client')

/**
 * 精度相加
 * @param v1
 * @param v2
 * @returns {number}
 */
export function add (v1, v2) {
  var r1, r2, m
  try {
    r1 = v1.toString().split('.')[1].length
  } catch (e) {
    r1 = 0
  }
  try {
    r2 = v2.toString().split('.')[1].length
  } catch (e) {
    r2 = 0
  }
  m = Math.pow(10, Math.max(r1, r2))

  return (v1 * m + v2 * m) / m
}
/**
 * @描述：格式化日期（不含时间）
 * @创建人：cth
 * @创建时间：2018年1月18日
 */
export function formatterDate (date) {
  const datetime = new Date(date)
  const result = datetime.getFullYear() + '-' + // '年'
    ((datetime.getMonth() + 1) >= 10 ? (datetime.getMonth() + 1) : '0' + (datetime.getMonth() + 1)) + '-' + // '月'
    (datetime.getDate() < 10 ? '0' + datetime.getDate() : datetime.getDate())
  return result
}
/**
 * @描述：获取今日日期（年月日）
 * @创建人：xfm
 * @创建时间：2018年5月29号
 */
export function getNowDate () {
  const datetime = new Date()
  const result = datetime.getFullYear() + '-' + // '年'
    ((datetime.getMonth() + 1) >= 10 ? (datetime.getMonth() + 1) : '0' + (datetime.getMonth() + 1)) + '-' + // '月'
    (datetime.getDate() < 10 ? '0' + datetime.getDate() : datetime.getDate())
  return result
}

/**
 * 时间格式化
 */
export function dateFormat (time) {
  const currentDate = new Date(time)
  const year = currentDate.getFullYear()
  let month = currentDate.getMonth()
  let date = currentDate.getDate()
  let hour = currentDate.getHours()
  let minutes = currentDate.getMinutes()
  let seconds = currentDate.getSeconds()
  if (month.toString().length < 2) {
    if ((month + 1).toString().length < 2) month = '0' + (month + 1)
    else month = month + 1
  } else {
    month = month + 1
  }
  if (date.toString().length < 2) date = '0' + date
  if (hour.toString().length < 2) hour = '0' + hour
  if (minutes.toString().length < 2) minutes = '0' + minutes
  if (seconds.toString().length < 2) seconds = '0' + seconds
  return year + '-' + month + '-' + date + ' ' + hour + ':' + minutes + ':' + seconds
}

export function downFile (blob, fileName) {
  if (window.navigator.msSaveOrOpenBlob) {
    navigator.msSaveBlob(blob, fileName)
  } else {
    var link = document.createElement('a')
    link.href = window.URL.createObjectURL(blob)
    link.download = fileName
    link.click()
    window.URL.revokeObjectURL(link.href)
  }
}

export function gzip (file, callback) {
  const reader = new FileReader()
  reader.onload = function (e) {
    const buffer = e.target.result  // 此时是arraybuffer类型
    // Compress the file
    const convertedData = new Uint8Array(buffer)

    // Zipping Uint8Array to Uint8Array
    const zippedResult = pako.gzip(convertedData, { to: 'Uint8Array' })

    const convertedZipped = zippedResult.buffer
    const arrayBlob = new Array(1)
    arrayBlob[0] = convertedZipped

    const myBlob = new Blob(arrayBlob, { type: 'application/octet-stream' })
    myBlob.name = file.name + '.gz'
    // downFile(myBlob, myBlob.name)

    const gzFile = new File([myBlob], file.name, { type: 'application/gzip' })
    // 执行回调
    callback && callback(gzFile)
  }
  reader.readAsArrayBuffer(file)
}
