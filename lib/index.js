(function (global, factory) {
    if (typeof define === "function" && define.amd) {
        define(['exports', 'react', 'melon-core/InputComponent', 'melon-core/classname/cxBuilder', 'melon/Icon', 'melon/Button', 'melon/common/util/dom', './util', './babelHelpers'], factory);
    } else if (typeof exports !== "undefined") {
        factory(exports, require('react'), require('melon-core/InputComponent'), require('melon-core/classname/cxBuilder'), require('melon/Icon'), require('melon/Button'), require('melon/common/util/dom'), require('./util'), require('./babelHelpers'));
    } else {
        var mod = {
            exports: {}
        };
        factory(mod.exports, global.react, global.InputComponent, global.cxBuilder, global.Icon, global.Button, global.dom, global.util, global.babelHelpers);
        global.index = mod.exports;
    }
})(this, function (exports, _react, _InputComponent2, _cxBuilder, _Icon, _Button, _dom, _util, babelHelpers) {
    'use strict';

    exports.__esModule = true;

    var _react2 = babelHelpers.interopRequireDefault(_react);

    var _InputComponent3 = babelHelpers.interopRequireDefault(_InputComponent2);

    var _Icon2 = babelHelpers.interopRequireDefault(_Icon);

    var _Button2 = babelHelpers.interopRequireDefault(_Button);

    var _dom2 = babelHelpers.interopRequireDefault(_dom);

    var util = babelHelpers.interopRequireWildcard(_util);
    /**
     * @file ColorPicker
     * @author jingyuanZhang<zhangjingyuan1108@outlook.com>
     * @author leon<ludafa@outlook.com>
     */

    var cx = (0, _cxBuilder.create)('ColorPicker');

    /**
     * melon 选色器
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
                satValue: '00FFE7',
                color: '00FFE7',
                open: false,
                error: false
            });

            return _this;
        }

        ColorPicker.prototype.componentWillUnmount = function componentWillUnmount() {
            _dom2['default'].off(document, 'click', this.onClickAway);
        };

        ColorPicker.prototype.onClickAway = function onClickAway(e) {
            var _this2 = this;

            var open = this.state.open;
            // alert(dom.contains(this.refs.picker, e.target));
            if (open && !_dom2['default'].contains(this.refs.picker, e.target)) {
                this.setState({ open: false }, function () {
                    _dom2['default'].off(document, 'click', _this2.onClickAway);
                });
            }
        };

        ColorPicker.prototype.onLabelClick = function onLabelClick(e) {
            var _this3 = this;

            var open = this.state.open;
            this.setState({
                open: !open,
                top: e.pageY + 20,
                left: e.pageX + 20
            }, function () {
                _dom2['default'].on(document, 'click', _this3.onClickAway);
            });
        };

        ColorPicker.prototype.isRawInputError = function isRawInputError(color) {
            return color !== '' && color.length !== 3 && color.length !== 6;
        };

        ColorPicker.prototype.onSubmit = function onSubmit() {

            if (this.state.error) {
                return;
            }

            var color = this.state.color;

            this.setState({ open: false });

            _InputComponent.prototype.onChange.call(this, {
                type: 'change',
                target: this,
                value: color ? '#' + color : ''
            });
        };

        ColorPicker.prototype.onHueChange = function onHueChange(e) {
            var _state = this.state;
            var top = _state.top;
            var left = _state.left;


            var huel = e.pageX - left;
            var huet = e.pageY - top - 160;
            var red = 0;
            var green = 0;
            var blue = 0;

            if (huel >= 0 && huel <= 240 && huet >= 0 && huet <= 16) {

                var quyu = parseInt(huel / 40, 10);
                var yushu = huel % 40;

                switch (quyu) {
                    case 0:
                        red = 255;
                        green = Math.round(255 * yushu / 40);
                        blue = 0;
                        break;

                    case 1:
                        red = Math.round(255 * (1 - yushu / 40));
                        green = 255;
                        blue = 0;
                        break;

                    case 2:
                        red = 0;
                        green = 255;
                        blue = Math.round(255 * yushu / 40);
                        break;

                    case 3:
                        red = 0;
                        green = Math.round(255 * (1 - yushu / 40));
                        blue = 255;
                        break;

                    case 4:
                        red = Math.round(255 * yushu / 40);
                        green = 0;
                        blue = 255;
                        break;

                    case 5:
                        red = 255;
                        green = 0;
                        blue = Math.round(255 * (1 - yushu / 40));
                        break;
                    default:
                        break;
                }

                var colorHEX = '' + util.toHex(red) + util.toHex(green) + util.toHex(blue);

                this.setState({
                    color: colorHEX,
                    satValue: colorHEX
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
            var rgb = e.target.value;
            if (rgb.length > 6) {
                return;
            }
            rgb = rgb.replace(/[^0-9a-fA-F]/gi, '');
            this.setState({ color: rgb.toUpperCase() });
        };

        ColorPicker.prototype.onSaturationChange = function onSaturationChange(e) {
            var _this4 = this;

            var _state2 = this.state;
            var top = _state2.top;
            var left = _state2.left;
            var satValue = _state2.satValue;

            var satl = e.pageX - left;
            var satt = e.pageY - top;

            if (satl >= 0 && satl <= 240 && satt >= 0 && satt <= 150) {
                (function () {
                    var percentH = satt / 150;
                    var percentW = satl / 240;
                    var colorHEX = [0, 2, 4].reduce(function (result, item) {
                        var part = parseInt('0x' + satValue.slice(item, item + 2), 16);
                        part = 255 - (255 - part) * percentW;
                        part = util.toHex(Math.round(part * (1 - percentH)));
                        return result + part;
                    }, '');
                    _this4.setState({ color: colorHEX });
                })();
            }
        };

        ColorPicker.prototype.renderBox = function renderBox(box) {
            var _this5 = this;

            var color = box.color;
            var hue = box.hue;


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

            var _state3 = this.state;
            var satValue = _state3.satValue;
            var open = _state3.open;
            var top = _state3.top;
            var left = _state3.left;
            var color = _state3.color;
            var value = _state3.value;
            var error = _state3.error;
            var _props = this.props;
            var placeholder = _props.placeholder;
            var boxes = _props.boxes;


            return _react2['default'].createElement(
                'div',
                { ref: 'picker', className: cx(this.props).build() },
                _react2['default'].createElement(
                    'label',
                    { onClick: this.onLabelClick },
                    _react2['default'].createElement(
                        'span',
                        { className: cx.getPartClassName('label-placeholder') },
                        value ? value : placeholder
                    ),
                    _react2['default'].createElement(_Icon2['default'], { icon: 'expand-more' })
                ),
                _react2['default'].createElement(
                    'div',
                    {
                        className: cx.getPartClassName('picker'),
                        style: {
                            display: open ? 'block' : 'none',
                            top: top,
                            left: left
                        },
                        onClick: this.onSaturationChange },
                    _react2['default'].createElement(
                        'div',
                        { className: cx.getPartClassName('saturation'),
                            style: {
                                backgroundColor: '#' + satValue
                            } },
                        _react2['default'].createElement(
                            'div',
                            { className: cx.getPartClassName('white') },
                            _react2['default'].createElement('div', { className: cx.getPartClassName('black') })
                        )
                    ),
                    _react2['default'].createElement('div', { className: cx.getPartClassName('hue'), onClick: this.onHueChange }),
                    _react2['default'].createElement(
                        'span',
                        { className: cx.getPartClassName('label') },
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
                        onClick: this.onSubmit }),
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