export default (value: number, maxValue: number) => {
  return Math.round((value / maxValue) * 100);
};
