/**
 * @file 测试入口
 * @author leon <ludafa@outlook.com>
 */

import {configure} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({
    adapter: new Adapter()
});

const specContext = require.context('./spec', true)
const specs = specContext
    .keys()
    .filter(spec => !/\.js$/.test(spec))
    .forEach(specContext)
