export default class Regular {
  constructor () {
    this.expiredTime = 24 * 60 * 60 * 1000
  };

  // 去除空格
  static Trim (str) {
    return str.replace(/\s+/g, '')
  }

  // 验证用户名 （以字母开头，英文、数字、下划线和减号 4-20位）
  static checkUsername (str) {
    const reg1 = /^[a-zA-Z]([_a-zA-Z0-9]{3,19})$/
    return reg1.test(str)
  }

  // 验证密码 （可以包含数字、字母、下划线，并且要同时含有数字和字母，且长度要在6-16位之间。）
  static checkPassword (str) {
    const reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z_]{6,16}$/
    return reg.test(str)
  }

  // 验证中文
  static checkChinese (str) {
    const rgEx = /^([\u4e00-\u9fa5]){0,5}$/
    return rgEx.test(str)
  }

  // 去除换行
  static ClearBr (key, replaceStr) {
    if (replaceStr === undefined || key === null) {
      replaceStr = ''
    }
    if (key === undefined || key === null) { key = '' }
    key = key.replace(/<\/?.+?>/g, replaceStr)
    key = key.replace(/[\r\n]/g, replaceStr)
    return key
  }

  // 判断是否是电话号码
  static checkMobileNumber (theObj) {
    const reg1 = /^((13[0-9])|(15[0-9])|(18[0-9])|(14[0-9])|(17[0-3,5-8]))\d{8}$/
    const reg2 = /^((166)|(198)|(199)|(149))\d{8}$/
    return reg1.test(theObj) || reg2.test(theObj)
  }

  // 判断是否是固定电话
  static checkfixedNumber (theObj) {
    const reg1 = /^([0-9]{3,4}-)?[0-9]{7,8}$/
    return reg1.test(theObj)
  }

  // 判断是否是电话号码
  static checkI18nMobileNumber (theObj) {
    const reg3 = /^00\d{7,19}$/ // 国际号码
    return reg3.test(theObj)
  }

  // 以换行和逗号进行分组
  static splitByBrOrSpace (str) {
    return str.split(/([\r\n])|(,)/g)
  }

  // 运营商号过滤
  static OperationCommercialNumberFilter (mobile, providerIds) {
    if (!this.checkMobileNumber(mobile)) {
      return false
    }
    // 移动
    const mobileOperator = /^(((13[4-9])|(14[1,2,7,8])|(15[0,1,2,4,7-9])|(17[2,8]|(18[2-4,7,8])|(198)))\d{8})$|^(170[3,5,6]\d{7})$ |^(17161\d{6})$/
    // 联通
    const unicomOperator = /^(((13[0-2])|(145)|(15[5,6])|(17[5,6]|(18[5,6])|(166)))\d{8})$ | ^(17((0[4,7,8,9])|(1[0,2-9]))\d{7})$ |^(171619\d{5})$/
    // 电信
    const telecomOperator = /^(((133)|(149)|(153)|(17[3,7]|(18[0,1,9])|(199)))\d{8})$ | ^(170[0-2]\d{7})$/

    let isMatch = false
    if (providerIds.indexOf('1') > -1) {
      isMatch = mobileOperator.test(mobile)
      if (isMatch) { return isMatch }
    }
    if (providerIds.indexOf('2') > -1) {
      isMatch = unicomOperator.test(mobile)
      if (isMatch) { return isMatch }
    }
    if (providerIds.indexOf('3') > -1) {
      isMatch = telecomOperator.test(mobile)
      if (isMatch) { return isMatch }
    }

    return isMatch
  }
  // 检验多媒体格式
  static checkMultimediaType (src) {
    // 图片
    const image = /.jpg$|.jpeg$|.gif$|.png$/i
    // 视频
    const video = /\.wav$|\.mp4$|\.avi$|\.flv$/i
    // 音频 mp3|wma|flac|aac|mmf|amr|m4a|m4r|ogg
    const audio = /\.mp3|\.midi$|\.wma$/i
    let type = 0
    if (image.test(src)) { type = 1 }
    if (audio.test(src)) { type = 2 }
    if (video.test(src)) { type = 3 }
    return type
  }
  // 检验特殊字符
  static checkSpecialChar (str) {
    const pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>《》/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]")
    return pattern.test(str)
  }
  // 判断是否是金额
  static isMoney (s) {
    const regu = /(^[1-9](\d+)?(\.\d{1,2})?$)|(^0$)|(^\d\.\d{1,2}$)/
    const re = new RegExp(regu)
    if (re.test(s)) {
      return true
    } else {
      return false
    }
  }
}
