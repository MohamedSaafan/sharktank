const pickRandomNumber = (number1, number2) => {
  const randomNumber = Math.round(Math.random());
  return randomNumber === 1 ? number1 : number2;
};

module.exports = pickRandomNumber;
