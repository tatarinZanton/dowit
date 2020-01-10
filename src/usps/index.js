const API = require('usps-webtools');
const async = require('async');

const usps = new API({
  server: 'http://production.shippingapis.com/ShippingAPI.dll',
  userId: process.env.USPS_USER_ID,
});

class USPS {
  calculate(payload) {
    return async.mapLimit(payload, 200, function(delivery, callback) {
      usps.pricingRateV4(delivery, function(err, calculation) {
        if (err) {
          calculation = {
            err: err.Description,
          };
        }
        callback(null, calculation);
      });
    });
  }
}

module.exports = new USPS();
