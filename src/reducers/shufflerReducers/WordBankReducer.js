import { CLASSIFY_WORDS, REMOVE_WORD_FROM_BANK } from "../../actions/types";

export default (state = null, action) => {
  const getWordsSorted = set => {
    const bank = { good: [], average: [], bad: [] };
    for (var i = 0; i < set.length; i++) {
      switch (true) {
        case i % 3 === 0:
          bank.bad.push(set[i]);
          break;
        case i % 2 === 0:
          bank.average.push(set[i]);
          break;
        default:
          bank.good.push(set[i]);
      }
    }
    return bank;
  };

  switch (action.type) {
    case CLASSIFY_WORDS:
      return !!action.payload.length ? getWordsSorted(action.payload) : state;

    case REMOVE_WORD_FROM_BANK:
      const newGoodGroup = state.good.filter(word => {
        return word !== action.payload;
      });

      const newAverageGroup = state.average.filter(word => {
        return word !== action.payload;
      });

      const newBadGroup = state.bad.filter(word => {
        return word !== action.payload;
      });

      return { good: newGoodGroup, bad: newBadGroup, average: newAverageGroup };

    default:
      return state;
  }
};
