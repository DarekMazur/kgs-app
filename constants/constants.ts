export default {
  suspensionConditions: (inputDate: Date | undefined) =>
    inputDate && inputDate >= new Date(),
  fullDayMilliseconds: 1000 * 60 * 60 * 24,
};
