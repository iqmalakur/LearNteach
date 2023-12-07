module.exports = {
  priceFormat: (price) => {
    price = ("" + price).split("").reverse();
    let result = [];

    for (let i = 0; i < price.length; i++) {
      result.push(price[i]);
      if ((i + 1) % 3 === 0 && i + 1 !== price.length) {
        result.push(".");
      }
    }

    return "Rp" + result.reverse().join("");
  },
};
