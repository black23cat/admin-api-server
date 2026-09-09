function roundTotal(num) {
  if (typeof num !== 'number') {
    throw new Error('Input must be a number');
  }
  const stringNum = num.toString();
  const decimalNum = stringNum.toString().slice(-3);
  if (decimalNum === '000') {
    return num;
  } else if (Number(decimalNum) < 500) {
    return Math.round(num / 1000) * 1000;
  } else if (Number(decimalNum) >= 500) {
    return Math.ceil(num / 1000) * 1000;
  }
}

module.exports = { roundTotal };
