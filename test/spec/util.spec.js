/**
 * @file util 测试
 * @author leon <ludafa@outlook.com>
 */

import * as util from '../../src/util.js';

describe('util', function () {

    it('should work', function () {
        expect(util.toHex(10)).toBe('0A');
        expect(util.toHex(255)).toBe('FF');
    });

});
