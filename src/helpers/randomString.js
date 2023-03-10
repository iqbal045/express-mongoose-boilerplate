// eslint-disable-next-line func-names
const randomString = function (length) {
  return Math.round(
    // eslint-disable-next-line no-restricted-properties
    Math.pow(36, length + 1) - Math.random() * Math.pow(36, length),
  )
    .toString(36)
    .slice(1);
};

module.exports = randomString;
