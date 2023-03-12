const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  // const second = date.getSeconds()
  const second = '00'

  return `${[year, month, day].map(formatNumber).join('-')} ${[hour, minute, second].map(formatNumber).join(':')}`
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : `0${n}`
}

const formatDate = date => {
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()

  return `${month}月${day}日 ${[hour, minute].map(formatNumber).join(':')}`
}

const formatDate2 = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  return `${[year, month, day].map(formatNumber).join('-')}`
}

const formatDate3 = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  return `${year}年${month}月${day}日}`
}

const formatDate4 = (start, end) => {
  const taotalTime = Math.ceil((new Date(end).getTime() - new Date(start).getTime()) / 1000)
  const hh = Math.floor(taotalTime / 3600)
  const mm = Math.floor((taotalTime - (3600 * hh)) / 60)
  const ss = Math.ceil(taotalTime - (3600 * hh) - (60 * mm))
  const _hh = (hh.toString())[1] ? hh : `0${hh}`
  const _mm = (mm.toString())[1] ? mm : `0${mm}`
  const _ss = (ss.toString())[1] ? ss : `0${ss}`
  const restTime = taotalTime - 1
  let str = ''
  if (hh > 0) {
    str = `${_hh}时`
  }
  if (mm > 0) {
    str += `${_mm}分`
  }
  if (ss > 0) {
    str += `${_ss}秒`
  }
  return { formatTime: str, restTime }
}

const formatDate5 = date => {
  const hour = date.getHours()
  const minute = date.getMinutes()

  return `${[hour, minute].map(formatNumber).join(':')}`
}

//版本号比较
const versionStringCompare = (preVersion='', lastVersion='') => {
  const sources = preVersion.split('.');
  const dests = lastVersion.split('.');
  const maxL = Math.max(sources.length, dests.length);
  let result = 0;
  for (let i = 0; i < maxL; i++) {  
      let preValue = sources.length>i ? sources[i]:0;
      let preNum = isNaN(Number(preValue)) ? preValue.charCodeAt() : Number(preValue);
      let lastValue = dests.length>i ? dests[i]:0;
      let lastNum =  isNaN(Number(lastValue)) ? lastValue.charCodeAt() : Number(lastValue);
      if (preNum < lastNum) {
          result = -1;
          break;
      } else if (preNum > lastNum) { 
          result = 1;
          break;
      }
  }
  return result;
}

// 校验手机号
const checkModbile = (mobile) => {
  const reg = /^1[3,4,5,6,7,8,9][0-9]{9}$/
  if(!reg.test(mobile)) {
    // 格式错误
    return false
  }
  return true
}

// 是否全是中文
const isChinese = (str) => {
  const reg = /[^\u4E00-\u9FA5]/
  const curStr = str.trim()
  if (curStr === '') {
    return false
  }
  if (reg.test(str)) {
    // 格式错误
    return false
  }
  return true
}

const isVehicleNumber = (vehicleNumber) => {
  // 新能源车
  const xreg=/^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}(([0-9]{5}[DF]$)|([DF][A-HJ-NP-Z0-9][0-9]{4}$))/;
  // 普通汽车
  const creg=/^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳]{1}$/;
 
  if(vehicleNumber.length == 7){
    return creg.test(vehicleNumber);
  } else if(vehicleNumber.length == 8){
    return xreg.test(vehicleNumber);
  } else{
    return false;
  }
}

// 获取前天、昨天、今天、明天、后天
const getDateStr = (AddDayCount) => {
  const dd = new Date();
  dd.setDate(dd.getDate()+AddDayCount); // 获取AddDayCount天后的日期
  const y = dd.getFullYear();
  const m = dd.getMonth()+1; // 获取当前月份的日期
  const _m = (m.toString())[1] ? m : `0${m}`;
  const d = dd.getDate();
  const _d = (d.toString())[1] ? d : `0${d}`;
  return y + '-' + _m + '-' + _d;
}

const timeIsBetween = (date, start, end) => {
  let dateNow = new Date(date); // 获取当前时间
  let dateBegin = new Date(start); // 将-转化为/，使用new Date
  let dateEnd = new Date(end); // 将-转化为/，使用new Date
  let beginDiff = dateNow.getTime() - dateBegin.getTime(); // 时间差的毫秒数
  let beginDayDiff = Math.floor(beginDiff / (24 * 3600 * 1000)); // 计算出相差天数
  let endDiff = dateEnd.getTime() - dateNow.getTime(); // 时间差的毫秒数
  let endDayDiff = Math.floor(endDiff / (24 * 3600 * 1000)); // 计算出相差天数
  if(endDayDiff < 0){
    // 已过期
    return 'right'
  }
  if(beginDayDiff < 0){
    // 还没到时间
    return 'left';
  }
  // 两者之间
  return 'center';
}

module.exports = {
  formatTime,
  formatDate,
  formatDate2,
  formatDate3,
  formatDate4,
  formatDate5,
  versionStringCompare,
  checkModbile,
  isChinese,
  isVehicleNumber,
  getDateStr,
  timeIsBetween
}
