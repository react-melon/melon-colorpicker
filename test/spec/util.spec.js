/**
 * @file util 测试
 * @author leon <ludafa@outlook.com>
  * @author jingyuanZhang<zhangjingyuan1108@outlook.com>
 */

import * as util from '../../src/util.js';

describe('colorpicker functions test', function () {

    it('toHex should work', function () {
        expect(util.toHex(10)).toBe('0A');
        expect(util.toHex(255)).toBe('FF');
    });
});
