export const getDateStr = (AddDayCount: number) => {
  const dd = new Date();
  dd.setDate(dd.getDate()+AddDayCount);
  const y = dd.getFullYear();
  const m = dd.getMonth()+1;
  const _m = (m.toString())[1] ? m : `0${m}`;
  const d = dd.getDate();
  const _d = (d.toString())[1] ? d : `0${d}`;
  return y + '-' + _m + '-' + _d;
}

export const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : `0${n}`
}

export const formatTime = date => {
  const curDate = new Date(date)
  const year = curDate.getFullYear()
  const month = curDate.getMonth() + 1
  const day = curDate.getDate()
  const hour = curDate.getHours()
  const minute = curDate.getMinutes()
  const second = '00'
  return `${[year, month, day].map(formatNumber).join('-')} ${[hour, minute, second].map(formatNumber).join(':')}`
}

export const generateMixed = (n) => {
  const chars = ['0','1','2','3','4','5','6','7','8','9','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
  let res = "";
  for(let i = 0; i < n ; i++) {
    var id = Math.floor(Math.random()*36);
    res += chars[id];
  }
  return res;
}