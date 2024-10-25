export default {
  suspensionConditions: (inputDate: Date | undefined) => {
    if (inputDate) {
      return new Date(inputDate).getTime() >= new Date().getTime();
    }

    return false;
  },
  fullDayMilliseconds: 1000 * 60 * 60 * 24,
};
