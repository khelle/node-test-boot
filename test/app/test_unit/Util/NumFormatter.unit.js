const ParentUnit            = require(`${process.env.DEV_ROOT_PATH}/TestUnit`);
const NumFormatter          = require(`${process.env.SRC_ROOT_PATH}/Util/NumFormatter`);
const BigNumber             = require('bignumber.js');

class NumFormatterTest extends ParentUnit
{
    /**
     *
     */
    testFormat_FormatsTheNumber_UsingGivenPrecision()
    {
        const formatter = new NumFormatter();

        const scenarios = [
            { actual: '325.43223132', prec: 4, expected: '325.4322' },
            { actual: 4324.00019, prec: 4, expected: '4324.0001' },
            { actual: '123.23', prec: 6, expected: '123.230000' },
            { actual: '123.23', prec: -2, expected: '123' }
        ];
        scenarios.forEach((scenario) => {
            this.expect(formatter.format(scenario.actual, scenario.prec)).to.equal(scenario.expected);
        });
    }
}

module.exports = NumFormatterTest;
