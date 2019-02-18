const Promise      = require(`bluebird`);
const chai         = require(`./Chai`);

class TestUnit
{
    /**
     * @returns {Chai}
     */
    chai()
    {
        return chai;
    }

    /**
     * @param {*} obj
     * @returns {Promise}
     */
    expect(obj)
    {
        return this.chai().expect(obj);
    }

    /**
     * @param {*} obj
     * @returns {Promise}
     */
    expectToHaveBeenCalled(obj)
    {
        return this.chai().expect(obj).to.have.been.called;
    }

    /**
     * @param {*} fun
     * @returns {*}
     */
    spy(fun)
    {
        return this.chai().spy(fun);
    }

    /**
     *
     * @param obj
     * @returns {*}
     */
    spyInterface(obj)
    {
        return this.chai().spy.interface(obj);
    }

    /**
     *
     */
    beforeEach()
    {
        // abstract
    }

    /**
     *
     */
    afterEach()
    {
        // abstract
    }

    /**
     * @returns {Function}
     */
    getTest()
    {
        const test = this;
        return function() {
            let proto = test.constructor.prototype;
            let protoKeys = [];
            let protoOwnKeys = [];
            while ((proto) && (protoOwnKeys = Reflect.ownKeys(proto)) && (protoOwnKeys.length > 0)) {
                protoKeys = [].concat(protoKeys, protoOwnKeys);
                proto = Reflect.getPrototypeOf(proto);
            }
            protoKeys = protoKeys.filter((item, index) => protoKeys.indexOf(item) === index);

            let methodsToTest = {};
            protoKeys.forEach((key) => {
                if (key.startsWith('test') && key.indexOf('_') !== -1) {
                    let tags = key.replace(/^test/, '').split('_');
                    let func = tags.shift();
                    let desc = tags.join(' - ');
                    func = func[0].toLowerCase() + func.slice(1) + '()';
                    if (methodsToTest[func] === undefined) {
                        methodsToTest[func] = [];
                    }
                    methodsToTest[func].push({ desc: desc, func: test[key] });
                }
            });

            Object.keys(methodsToTest).forEach((testMethod) => {
                describe(testMethod, function() {
                    methodsToTest[testMethod].forEach((fd) => {
                        let desc = fd.desc;
                        let func = fd.func;
                        test.beforeEach();
                        it(desc, function() {
                            return func.call(test);
                        });
                        test.afterEach();
                    });
                });
            });
        };
    }
}

module.exports = TestUnit;
