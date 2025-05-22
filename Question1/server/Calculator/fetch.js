function delay(duration) {
  return new Promise(resolve => setTimeout(resolve, duration));
}
async function getNumberSequence(type) {
  await delay(100);

  switch (type) {
    case 'p':
      return [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31];
    case 'f':
      return [1, 1, 2, 3, 5, 8, 13, 21, 34, 55];
    case 'e':
      return Array.from({ length: 15 }, (_, idx) => (idx + 1) * 2);
    case 'r':
      const uniqueRandoms = new Set();
      while (uniqueRandoms.size < 10) {
        uniqueRandoms.add(Math.floor(Math.random() * 100) + 1);
      }
      return Array.from(uniqueRandoms);
    default:
      return [];
  }
}
module.exports = { getNumberSequence };
