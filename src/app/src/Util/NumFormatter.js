const BigNumber = require('bignumber.js');

BigNumber.config({
    FORMAT: {
        decimalSeparator: '.',
        groupSeparator: '',
    }
});

class NumFormatter
{
    /**
     * @param {String|Number} numStr
     * @param {String|Number} numPrecision
     * @returns {String}
     */
    format(numStr, numPrecision)
    {
        if (numPrecision < 0) {
            numPrecision = 0;
        }
        return (new BigNumber(numStr.toString())).toFormat(Number(numPrecision), BigNumber.ROUND_FLOOR);
    }
}

module.exports = NumFormatter;
