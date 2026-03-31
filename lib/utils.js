
module.exports = {
  sleep: (ms) => new Promise(resolve => setTimeout(resolve, ms)),
  random: (arr) => arr[Math.floor(Math.random() * arr.length)],
};
