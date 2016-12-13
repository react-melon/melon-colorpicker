(function (global, factory) {
    if (typeof define === "function" && define.amd) {
        define(['exports', 'react', 'melon-core/Validity', 'melon-core/InputComponent', 'melon-core/classname/cxBuilder', 'melon/Icon', 'melon/Button', 'melon/common/util/dom', './util', './babelHelpers'], factory);
    } else if (typeof exports !== "undefined") {
        factory(exports, require('react'), require('melon-core/Validity'), require('melon-core/InputComponent'), require('melon-core/classname/cxBuilder'), require('melon/Icon'), require('melon/Button'), require('melon/common/util/dom'), require('./util'), require('./babelHelpers'));
    } else {
        var mod = {
            exports: {}
        };
        factory(mod.exports, global.react, global.Validity, global.InputComponent, global.cxBuilder, global.Icon, global.Button, global.dom, global.util, global.babelHelpers);
        global.index = mod.exports;
    }
})(this, function (exports, _react, _Validity, _InputComponent2, _cxBuilder, _Icon, _Button, _dom, _util, babelHelpers) {
    'use strict';

    exports.__esModule = true;

    var _react2 = babelHelpers.interopRequireDefault(_react);

    var _Validity2 = babelHelpers.interopRequireDefault(_Validity);

    var _InputComponent3 = babelHelpers.interopRequireDefault(_InputComponent2);

    var _Icon2 = babelHelpers.interopRequireDefault(_Icon);

    var _Button2 = babelHelpers.interopRequireDefault(_Button);

    var _dom2 = babelHelpers.interopRequireDefault(_dom);

    var util = babelHelpers.interopRequireWildcard(_util);
    /**
     * @file ColorPicker
     * @author jingyuanZhang<zhangjingyuan1108@outlook.com zhangjingyuan02@baidu.com>
     * @author leon<ludafa@outlook.com>
     */

    var cx = (0, _cxBuilder.create)('ColorPicker');

    /**
     * melon colorpicker——选色器，主要由色调块、饱和度区、颜色值输入框、颜色展示区和常用颜色样例五部分组成
     * 用户最终选择的颜色取决于基色调和饱和度，选择的颜色在颜色展示区可以看见
     *
     * @class
     * @extends {InputComponent}
     */

    var ColorPicker = function (_InputComponent) {
        babelHelpers.inherits(ColorPicker, _InputComponent);

        function ColorPicker(props, context) {
            babelHelpers.classCallCheck(this, ColorPicker);

            var _this = babelHelpers.possibleConstructorReturn(this, _InputComponent.call(this, props, context));

            _this.onSubmit = _this.onSubmit.bind(_this);
            _this.onHueChange = _this.onHueChange.bind(_this);
            _this.onSaturationChange = _this.onSaturationChange.bind(_this);
            _this.onBoxClick = _this.onBoxClick.bind(_this);
            _this.onLabelClick = _this.onLabelClick.bind(_this);
            _this.onHexChange = _this.onHexChange.bind(_this);
            _this.isRawInputError = _this.isRawInputError.bind(_this);
            _this.onClickAway = _this.onClickAway.bind(_this);

            _this.state = babelHelpers['extends']({}, _this.state, {
                satValue: '00FFE7', // 预设颜色选择器的基色调rgb值，颜色值饱和度区域变化取决于该值
                color: '00FFE7', // 预设颜色选择器的最终选择的颜色值rgb，和选色器的颜色值hex输入框的值绑定，决定颜色展示区的颜色
                open: false, // 表示当前colorpicker选色器的状态，默认是没有显示
                error: false // 表示当前颜色值输入框的值是否不合法，默认是合法
            });

            return _this;
        }

        /**
         * react组件生命周期——组件销毁前调用
         *
         * @public
         */


        ColorPicker.prototype.componentWillUnmount = function componentWillUnmount() {
            // colorpicker销毁时给document解绑click事件onClickAway
            _dom2['default'].off(document, 'click', this.onClickAway);
        };

        ColorPicker.prototype.onClickAway = function onClickAway(e) {
            var _this2 = this;

            var open = this.state.open;
            // 当选色器已打开，且点击位置(e.target)没有点击在选色器上(this.refs.main)时，关闭选色器，并解绑点击事件onClickAway
            if (open && !_dom2['default'].contains(this.refs.main, e.target)) {
                this.setState({ open: false }, function () {
                    _dom2['default'].off(document, 'click', _this2.onClickAway);
                });
            }
        };

        ColorPicker.prototype.onLabelClick = function onLabelClick(e) {
            var _this3 = this;

            var open = this.state.open;

            this.setState({
                open: !open
            }, function () {
                if (!open) {
                    // 当颜色选择器打开时，给document绑定事件
                    _dom2['default'].on(document, 'click', _this3.onClickAway);
                } else {
                    // 关闭颜色选择器后，解绑该事件
                    _dom2['default'].off(document, 'click', _this3.onClickAway);
                }
            });
        };

        ColorPicker.prototype.isRawInputError = function isRawInputError(color) {
            // 输入的颜色值rgb不能为空，且长度只能为3或者6（不包含#）
            return color !== '' && color.length !== 3 && color.length !== 6;
        };

        ColorPicker.prototype.onSubmit = function onSubmit() {
            // 如果颜色值rgb不合法，不能提交，并返回
            if (this.state.error) {
                return;
            }
            // 获取当前输入框的颜色值rgb
            var color = this.state.color;
            // 关闭颜色选择器
            this.setState({ open: false });

            _InputComponent.prototype.onChange.call(this, {
                type: 'change',
                target: this,
                value: color ? '#' + color : ''
            });
        };

        ColorPicker.prototype.onHueChange = function onHueChange(e) {
            var _refs$hue$getBounding = this.refs.hue.getBoundingClientRect(),
                top = _refs$hue$getBounding.top,
                left = _refs$hue$getBounding.left;

            var huel = e.pageX - left; // 获取用户点击位置相对色调块的位置——左
            var huet = e.pageY - top; // 获取用户点击位置相对色调块的位置——高
            var red = 0; // 初始化rgb值中r值（red），值域0~255
            var green = 0; // 初始化rgb值中g值（green），值域0~255
            var blue = 0; // 初始化rgb值中b值（blue），值域0~255

            // 选色器的色调块长240px，宽16px，判断用户是否点击在色调块上
            if (huel >= 0 && huel <= 240 && huet >= 0 && huet <= 16) {
                // 色调块由六个颜色渐变区域组成，0: (255, 0, 0)~(255, 255, 0); 1: (255, 255, 0)~(0, 255, 0); 2: (0, 255, 0)~(0, 255, 255);
                // 3: (0, 255, 255)~(0, 0, 255); 4: (0, 0, 255)~(255, 0, 255); 5: (255, 0, 255)~(255, 0, 0);
                // 每个渐变区域长40px
                var quyu = parseInt(huel / 40, 10); // 获取用户点击的颜色渐变区
                var yushu = huel % 40; // 获取用户点击位置在相应渐变区的相对位置

                switch (quyu) {
                    case 0:
                        // 渐变区域 0：(255, 0, 0)~(255, 255, 0)
                        red = 255; // 区域0r值（red）一直保持不变，都是255
                        green = Math.round(255 * yushu / 40); // 区域0g值（green）在 0 ~ 255间，根据点击的相对位置获取g值
                        blue = 0; // 区域0b值（blue）一直保持不变，都是0
                        break;

                    case 1:
                        // 渐变区域 1：(255, 255, 0)~(0, 255, 0)
                        red = Math.round(255 * (1 - yushu / 40)); // 区域1r值（red）在 255 ~ 0间，根据点击的相对位置获取r值
                        green = 255; // 区域1g值（green）一直保持不变，都是255
                        blue = 0; // 区域1b值（blue）一直保持不变，都是0
                        break;

                    case 2:
                        // 渐变区域 2：(0, 255, 0)~(0, 255, 255)
                        red = 0; // 区域2r值（red）一直保持不变，都是0
                        green = 255; // 区域2g值（green）一直保持不变，都是255
                        blue = Math.round(255 * yushu / 40); // 区域2b值（blue）在 0 ~ 255间，根据点击的相对位置获取b值
                        break;

                    case 3:
                        // 渐变区域 3：(0, 255, 255)~(0, 0, 255)
                        red = 0; // 区域3r值（red）一直保持不变，都是0
                        green = Math.round(255 * (1 - yushu / 40)); // 区域3g值（green）在 255 ~ 0间，根据点击的相对位置获取g值
                        blue = 255; // 区域3b值（blue）一直保持不变，都是255
                        break;

                    case 4:
                        // 渐变区域 4：(0, 0, 255)~(255, 0, 255)
                        red = Math.round(255 * yushu / 40); // 区域4r值（red）在 0 ~ 255间，根据点击的相对位置获取r值
                        green = 0; // 区域4g值（green）一直保持不变，都是0
                        blue = 255; // 区域4b值（blue）一直保持不变，都是255
                        break;

                    case 5:
                        // 渐变区域 5：(255, 0, 255)~(255, 0, 0)
                        red = 255; // 区域5r值（red）一直保持不变，都是255
                        green = 0; // 区域5g值（green）一直保持不变，都是255
                        blue = Math.round(255 * (1 - yushu / 40)); // 区域5b值（blue）在 255 ~ 0间，根据点击的相对位置获取b值
                        break;
                    default:
                        break;
                }
                // util.toHex函数将r、g、b值转化为16进制，（xxx, yyy, zzz）-> xxyyzz
                var colorHEX = '' + util.toHex(red) + util.toHex(green) + util.toHex(blue);

                this.setState({
                    color: colorHEX, // 实时更改输入框颜色值为当前选择的基本色调rgb值
                    satValue: colorHEX // 实时更改选色器的其色调值为当前输入值
                });
            }
        };

        ColorPicker.prototype.onBoxClick = function onBoxClick(opt) {

            var err = this.isRawInputError(opt.val);

            this.setState({
                color: opt.val,
                satValue: opt.satVal,
                error: err
            });
        };

        ColorPicker.prototype.onHexChange = function onHexChange(e) {
            // 获取当前输入框值
            var rgb = e.target.value;
            // 用户输入超过6个字符时，不显示后续输入并返回
            if (rgb.length > 6) {
                return;
            }
            // 判断用户输入值是否符合规则（16进制），如有非法字符，则替换为''
            rgb = rgb.replace(/[^0-9a-fA-F]/gi, '');
            // 将结果赋给选色器的颜色值，并在颜色展示区显示该颜色
            this.setState({ color: rgb.toUpperCase() });
        };

        ColorPicker.prototype.onSaturationChange = function onSaturationChange(e) {
            var _this4 = this;

            var _refs$saturation$getB = this.refs.saturation.getBoundingClientRect(),
                top = _refs$saturation$getB.top,
                left = _refs$saturation$getB.left;

            var satValue = this.state.satValue; // 获得当前其色调，饱和度的基本颜色

            var satl = e.pageX - left; // 获取用户点击位置相对饱和度的位置——左
            var satt = e.pageY - top; // 获取用户点击位置相对饱和度的位置——高

            // 选色器的饱和度区域长240px，宽150px，判断用户是否点击在饱和度区域内
            if (satl >= 0 && satl <= 240 && satt >= 0 && satt <= 150) {
                (function () {
                    var percentH = satt / 150; // 获取用户点击的饱和度的相对高度，越高颜色越接近黑色
                    var percentW = satl / 240; // 获取用户点击的饱和度的相对宽度，越近越接近白色

                    // rgb颜色值由三个元素表示：0 1 表示元素r；2 3 表示元素g；4 5表示元素b，0 2 4分别是元素r g b值的开始
                    // 获取当前饱和度的颜色值rgb
                    var colorHEX = [0, 2, 4].reduce(function (result, item) {
                        // 将颜色三个元素r g b的16进制值转化为10进制
                        var part = parseInt('0x' + satValue.slice(item, item + 2), 16);
                        part = 255 - (255 - part) * percentW; // 获取基色调各元素相对白色的饱和度（亮度）
                        part = util.toHex(Math.round(part * (1 - percentH))); // 再获取基色调各元素相对黑色的饱和度（暗度），将结果转为16进制
                        return result + part; // 将结果保存
                    }, '');
                    // 将最终获得饱和度的颜色值输出，赋给输入框，并在相应颜色区展示
                    _this4.setState({ color: colorHEX });
                })();
            }
        };

        ColorPicker.prototype.renderBox = function renderBox(box) {
            var _this5 = this;

            var color = box.color,
                hue = box.hue;


            return _react2['default'].createElement('span', {
                key: color,
                className: cx.getPartClassName('box'),
                style: {
                    backgroundColor: '#' + color
                },
                onClick: function onClick() {
                    return _this5.onBoxClick({ val: color, satVal: hue });
                } });
        };

        ColorPicker.prototype.renderBoxes = function renderBoxes(boxes) {
            var _this6 = this;

            return _react2['default'].createElement(
                'div',
                { className: cx.getPartClassName('boxes') },
                boxes.map(function (item) {
                    return _this6.renderBox(item);
                })
            );
        };

        ColorPicker.prototype.render = function render() {
            var _this7 = this;

            var _state = this.state,
                satValue = _state.satValue,
                open = _state.open,
                color = _state.color,
                value = _state.value,
                error = _state.error;
            var _props = this.props,
                placeholder = _props.placeholder,
                boxes = _props.boxes;


            return _react2['default'].createElement(
                'div',
                { ref: 'main', className: cx(this.props).build() },
                _react2['default'].createElement(
                    'label',
                    {
                        className: cx.getPartClassName('label'),
                        onClick: this.onLabelClick },
                    _react2['default'].createElement(
                        'span',
                        {
                            className: cx.getPartClassName('placeholder'),
                            style: { color: value ? '#333' : '' } },
                        value ? value : placeholder
                    ),
                    _react2['default'].createElement(_Icon2['default'], { icon: 'expand-more' })
                ),
                _react2['default'].createElement(_Validity2['default'], { validity: this.state.validity }),
                _react2['default'].createElement(
                    'div',
                    {
                        className: cx.getPartClassName('popup'),
                        style: {
                            display: open ? 'block' : 'none'
                        } },
                    _react2['default'].createElement(
                        'div',
                        {
                            ref: 'saturation',
                            className: cx.getPartClassName('saturation'),
                            style: {
                                backgroundColor: '#' + satValue
                            },
                            onClick: this.onSaturationChange },
                        _react2['default'].createElement(
                            'div',
                            { className: cx.getPartClassName('white') },
                            _react2['default'].createElement('div', { className: cx.getPartClassName('black') })
                        )
                    ),
                    _react2['default'].createElement('div', {
                        ref: 'hue',
                        className: cx.getPartClassName('hue'),
                        onClick: this.onHueChange }),
                    _react2['default'].createElement(
                        'div',
                        { className: cx.getPartClassName('input-box') },
                        _react2['default'].createElement(
                            'span',
                            null,
                            'Hex'
                        ),
                        _react2['default'].createElement('input', {
                            className: cx.getPartClassName('rgbstr'),
                            type: 'text',
                            onBlur: function onBlur() {
                                _this7.setState({
                                    error: _this7.isRawInputError(color)
                                });
                            },
                            ref: 'rgbStr',
                            placeholder: placeholder,
                            value: color,
                            onChange: this.onHexChange,
                            style: {
                                border: error ? '1px red solid' : null
                            } }),
                        _react2['default'].createElement('div', {
                            className: cx.getPartClassName('result'),
                            style: {
                                backgroundColor: '#' + color
                            } }),
                        _react2['default'].createElement(_Button2['default'], {
                            label: 'OK',
                            key: 'submit',
                            size: 'xxs',
                            type: 'button',
                            variants: ['secondery'],
                            className: cx.getPartClassName('submit'),
                            onClick: this.onSubmit })
                    ),
                    this.renderBoxes(boxes)
                )
            );
        };

        return ColorPicker;
    }(_InputComponent3['default']);

    exports['default'] = ColorPicker;


    ColorPicker.displayName = 'ColorPicker';

    ColorPicker.defaultProps = babelHelpers['extends']({}, _InputComponent3['default'].defaultProps, {

        /**
         * 选色器标签文字
         */
        placeholder: '请选择',
        // 用户自行定义的常用颜色样例
        boxes: [{ color: 'FF425E', hue: 'FF0059' }, { color: 'C6EDE8', hue: '00FFF9' }, { color: '66CCCC', hue: '00FFF9' }, { color: 'FFFFFF', hue: '00FFF9' }, { color: '000000', hue: '0079FF' }, { color: 'CCCCCC', hue: '00CCFF' }, { color: '576069', hue: 'FF0026' }, { color: 'E2D3AC', hue: 'FFC600' }, { color: 'FDDA04', hue: 'FFDF00' }, { color: 'E58308', hue: 'FF8C00' }, { color: 'FF99CC', hue: 'FF00BF' }, { color: 'FC9D9B', hue: 'FF0000' }, { color: '59453E', hue: 'FF0000' }, { color: 'CCFF00', hue: 'B3FF00' }]

    });

    ColorPicker.propTypes = babelHelpers['extends']({}, _InputComponent3['default'].propTypes, {
        placeholder: _react.PropTypes.string,
        boxes: _react.PropTypes.arrayOf(_react.PropTypes.shape({
            color: _react.PropTypes.string.isRequired,
            hue: _react.PropTypes.string.isRequired
        }))
    });
});
//# sourceMappingURL=index.js.map
