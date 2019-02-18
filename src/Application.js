const src = './app/src';
const NumFormatter = require(`${src}/Util/NumFormatter`);

class Application
{
    /**
     *
     */
    create()
    {
        const formatter = new NumFormatter();
        const formatted = formatter.format('325.43223132', 4);
        process.stdout.write(formatted+'\n');
    }
}

module.exports = Application;
