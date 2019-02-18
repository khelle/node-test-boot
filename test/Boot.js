const env  = process.env;
const Path = require('path');
const Fs   = require('fs');
const Glob = require('glob');
require('./Env');

const basePath = Path.resolve(__dirname, `..`);
const codePath = Path.resolve(basePath, `src`);
const testPath = Path.resolve(basePath, `test`);

const setEnvironment = (root) => {
    process.env.SRC_ROOT_PATH = Path.resolve(codePath, root, 'src');
    process.env.DEV_ROOT_PATH = Path.resolve(testPath);
    process.env.DEV_UNIT_PATH = Path.resolve(testPath, root, 'test_unit');
    process.env.DEV_INTG_PATH = Path.resolve(testPath, root, 'test_integrate');
};

const loadFiles = (dir, filelist = []) => {
    const files = Fs.readdirSync(dir);
    files.forEach((file) => {
        if (Fs.statSync(Path.join(dir, file)).isDirectory()) {
            filelist = loadFiles(Path.join(dir, file), filelist);
        } else {
            filelist.push(Path.join(dir, file));
        }
    });
    return filelist;
};

const loadTestFiles = (dir) => {
    return loadFiles(dir).filter((file) => file.endsWith('unit.js'));
};

const bootTestFiles = (dir, filter = '', root = '', type = '') => {
    if (!Fs.existsSync(dir)) return;
    setEnvironment(root);
    let files = loadTestFiles(dir);
    files.forEach((file) => {
        let name = file.replace(dir, '').replace(/^\//, '').replace(/\.unit\.js$/, '').replace(/\//g, '.');
        if (filter !== '' && filter !== name) { return; }
        let unit = require(file);
        describe(root + '@' + name + ' -- ' + type + ' testing', new unit().getTest());
    });
};

const services = [];
Glob.sync(`${codePath}/*`, { absolute: true }).forEach((path) => {
    if (path.indexOf('.') !== -1) return;
    const name = path.replace(codePath, '').replace('/', '');
    services.push(name);
});

let TEST_MODE = env.TEST_MODE ? env.TEST_MODE : 'MANY';
let TEST_FILE = env.TEST_FILE ? env.TEST_FILE : '';
let TEST_TYPE = env.TEST_TYPE ? env.TEST_TYPE : 'unit,integrate';

if (!TEST_MODE) {
    throw new Error('Invalid TEST_MODE variable!');
}
if (TEST_MODE !== 'MANY' && TEST_MODE !== 'ONCE') {
    throw new Error('Invalid TEST_MODE variable!');
}
if (!TEST_FILE && TEST_MODE === 'ONCE') {
    throw new Error('Invalid TEST_FILE variable!');
}

const testTypeList = TEST_TYPE.split(',');
const testFileList = TEST_FILE.indexOf("@") === -1 ? services.map((name) => `${name}@${TEST_FILE}`) : [].concat(TEST_FILE);

testFileList.forEach((file) => {
    testTypeList.forEach((fileType) => {
        const filePath = file.match(/^[^@]*@/)[0].replace('@', '');
        const fileName = file.match(/@[^@]*$/)[0].replace('@', '');
        bootTestFiles(testPath+'/'+filePath+'/test_'+fileType, fileName, filePath, fileType);
    });
});
