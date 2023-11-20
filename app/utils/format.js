module.exports = {
  priceFormat: (price) => {
    price = "" + price;
    let result = "Rp";

    for (let i = 0; i < price.length; i++) {
      result += price[i];
      if ((i + 1) % 3 === 0 && i + 1 !== price.length) {
        result += ".";
      }
    }

    return result;
  },
};
