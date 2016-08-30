(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports);
    global.util = mod.exports;
  }
})(this, function (exports) {
  "use strict";

  exports.__esModule = true;
  exports.toHex = toHex;
  /**
   * @file 颜色相关的小工具
   * @author jingyuanZhang<zhangjingyuan1108@outlook.com>
   * @author leon <ludafa@outlook.com>
   */

  /**
   * 将rgb三个值转为hex
   *
   * @param {number} n r,b,g当前值（0-255）
   * @return {boolean} hexstr 转化后的16进制字符串
   */
  function toHex(n) {

    n = (+n).toString(16);

    if (n.length === 1) {
      n = "0" + n;
    }

    return n.toUpperCase();
  }
});