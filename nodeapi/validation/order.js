exports.checkCreditCard = (function(credit) {
  return function(ccNum) {
    var len = ccNum.length,
      bit = 1,
      sum = 0,
      val;
    while (len) {
      val = parseInt(ccNum.charAt(--len), 10);
      sum += (bit ^= 1) ? credit[val] : val;
    }
    return sum && sum % 10 === 0;
  };
})([0, 2, 4, 6, 8, 1, 3, 5, 7, 9]);

exports.checkShipDate = ship => {
  let shipDate = new Date(ship).getTime(),
    orderDate = new Date(Date.now()).getTime();
  if (
    ship.match(/^[0-9]{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])/) &&
    (shipDate >= orderDate || ship === new Date().toISOString().split("T")[0])
  )
    return true;
  else return false;
};

exports.calcOrderTotal = function(products, productTotal) {
  return products.reduce(function(a, b) {
    return a + b[productTotal];
  }, 0);
};
