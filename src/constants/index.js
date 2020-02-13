export const allLetters = () => {
  const lettersArray = [];
  const letters = [
    { letter: "a", frequancy: 112 },
    { letter: "b", frequancy: 21 },
    { letter: "c", frequancy: 37 },
    { letter: "d", frequancy: 60 },
    { letter: "e", frequancy: 168 },
    { letter: "f", frequancy: 32 },
    { letter: "g", frequancy: 28 },
    { letter: "h", frequancy: 83 },
    { letter: "i", frequancy: 102 },
    { letter: "j", frequancy: 1 },
    { letter: "k", frequancy: 10 },
    { letter: "l", frequancy: 55 },
    { letter: "m", frequancy: 36 },
    { letter: "n", frequancy: 97 },
    { letter: "o", frequancy: 108 },
    { letter: "p", frequancy: 25 },
    { letter: "q", frequancy: 1 },
    { letter: "r", frequancy: 84 },
    { letter: "s", frequancy: 88 },
    { letter: "t", frequancy: 127 },
    { letter: "u", frequancy: 40 },
    { letter: "v", frequancy: 15 },
    { letter: "w", frequancy: 39 },
    { letter: "x", frequancy: 2 },
    { letter: "y", frequancy: 39 },
    { letter: "z", frequancy: 1 }
  ];

  letters.map(letter => {
    for (var i = 0; i < letter.frequancy; i++) {
      lettersArray.push(letter.letter);
    }
  });

  return lettersArray;
};
