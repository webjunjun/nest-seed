export const getDateStr = (AddDayCount: number) => {
  const dd = new Date();
  dd.setDate(dd.getDate() + AddDayCount);
  const y = dd.getFullYear();
  const m = dd.getMonth() + 1;
  const _m = (m.toString())[1] ? m : `0${m}`;
  const d = dd.getDate();
  const _d = (d.toString())[1] ? d : `0${d}`;
  return y + '-' + _m + '-' + _d;
}

export const formatNumber = (n: string | number) => {
  n = n.toString()
  return n[1] ? n : `0${n}`
}

export const formatTime = (date: string) => {
  const curDate = new Date(date)
  const year = curDate.getFullYear()
  const month = curDate.getMonth() + 1
  const day = curDate.getDate()
  const hour = curDate.getHours()
  const minute = curDate.getMinutes()
  const second = '00'
  return `${[year, month, day].map(formatNumber).join('-')} ${[hour, minute, second].map(formatNumber).join(':')}`
}
