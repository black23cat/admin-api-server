function calculateTotalPaid(array) {
  if (!Array.isArray(array)) {
    throw 'Must be an array';
  }
  return array.reduce((acc, curr) => {
    return acc + curr.amountPaid;
  }, 0);
}
module.exports = { calculateTotalPaid };
