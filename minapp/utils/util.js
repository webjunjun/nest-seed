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

module.exports = {
  formatTime,
  versionStringCompare,
  checkModbile,
  isChinese,
  isVehicleNumber
}
