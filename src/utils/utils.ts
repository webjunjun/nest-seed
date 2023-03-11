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