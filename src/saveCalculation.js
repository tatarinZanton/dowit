module.exports.saveCalculation = async (calculationList, emailTo, fileName = null) => {
  const config = require('config');
  const knex = require('knex')({ ...config.db, useNullAsDefault: true });

  calculationList = calculationList.map(calculation => {
    let payload;

    if (!calculation.err) {
      payload = {
        duration: Number(calculation.MailService.split(';')[0].match(/\d/)[0]),
        rate: calculation.Rate * 100,
      };
    } else {
      payload = {
        duration: null,
        rate: null,
      };
    }
    return {
      ...payload,
      apiError: calculation.err,
      userEmail: emailTo,
      isAddressValid: calculation.err != 'The Destination ZIP Code you have entered is invalid.',
      csvFileName: fileName,
      isAddressValid: true,
    };
  });

  try {
    await knex.insert(calculationList).into('delivery_calculation');
  } catch (error) {
    console.log(error);
  }
  return true;
};
