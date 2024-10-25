export default {
  suspensionConditions: (inputDate: Date | undefined) =>
    inputDate ? inputDate && inputDate >= new Date() : false,
  fullDayMilliseconds: 1000 * 60 * 60 * 24,
};
