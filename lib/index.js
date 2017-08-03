(function (global, factory) {
    if (typeof define === "function" && define.amd) {
        define(['exports', 'react', 'melon-core/InputComponent', 'melon-core/classname/cxBuilder', 'react-motion', 'melon-layer', 'melon/Icon', 'melon/Button', 'dom-align', 'kolor', './DragPanel'], factory);
    } else if (typeof exports !== "undefined") {
        factory(exports, require('react'), require('melon-core/InputComponent'), require('melon-core/classname/cxBuilder'), require('react-motion'), require('melon-layer'), require('melon/Icon'), require('melon/Button'), require('dom-align'), require('kolor'), require('./DragPanel'));
    } else {
        var mod = {
            exports: {}
        };
        factory(mod.exports, global.react, global.InputComponent, global.cxBuilder, global.reactMotion, global.melonLayer, global.Icon, global.Button, global.domAlign, global.kolor, global.DragPanel);
        global.index = mod.exports;
    }
})(this, function (exports, _react, _InputComponent2, _cxBuilder, _reactMotion, _melonLayer, _Icon, _Button, _domAlign, _kolor, _DragPanel) {
    'use strict';

    exports.__esModule = true;

    var _react2 = _interopRequireDefault(_react);

    var _InputComponent3 = _interopRequireDefault(_InputComponent2);

    var _melonLayer2 = _interopRequireDefault(_melonLayer);

    var _Icon2 = _interopRequireDefault(_Icon);

    var _Button2 = _interopRequireDefault(_Button);

    var _domAlign2 = _interopRequireDefault(_domAlign);

    var _kolor2 = _interopRequireDefault(_kolor);

    var _DragPanel2 = _interopRequireDefault(_DragPanel);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    var _extends = Object.assign || function (target) {
        for (var i = 1; i < arguments.length; i++) {
            var source = arguments[i];

            for (var key in source) {
                if (Object.prototype.hasOwnProperty.call(source, key)) {
                    target[key] = source[key];
                }
            }
        }

        return target;
    };

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    function _possibleConstructorReturn(self, call) {
        if (!self) {
            throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        }

        return call && (typeof call === "object" || typeof call === "function") ? call : self;
    }

    function _inherits(subClass, superClass) {
        if (typeof superClass !== "function" && superClass !== null) {
            throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
        }

        subClass.prototype = Object.create(superClass && superClass.prototype, {
            constructor: {
                value: subClass,
                enumerable: false,
                writable: true,
                configurable: true
            }
        });
        if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
    }

    var cx = (0, _cxBuilder.create)('ColorPicker');

    var HUE_HEIGHT = 210;
    var SV_SIZE = 210;

    /**
     * melon colorpicker——选色器，主要由色调块、饱和度区、颜色值输入框、颜色展示区和常用颜色样例五部分组成
     * 用户最终选择的颜色取决于基色调和饱和度，选择的颜色在颜色展示区可以看见
     *
     * @class
     * @extends {InputComponent}
     */

    var ColorPicker = function (_InputComponent) {
        _inherits(ColorPicker, _InputComponent);

        function ColorPicker(props, context) {
            _classCallCheck(this, ColorPicker);

            var _this = _possibleConstructorReturn(this, _InputComponent.call(this, props, context));

            _this.onSubmit = _this.onSubmit.bind(_this);
            _this.onHueChange = _this.onHueChange.bind(_this);
            _this.onSaturationChange = _this.onSaturationChange.bind(_this);
            _this.onLabelClick = _this.onLabelClick.bind(_this);
            _this.onClickAway = _this.onClickAway.bind(_this);
            _this.onAlphaChange = _this.onAlphaChange.bind(_this);
            _this.renderLayer = _this.renderLayer.bind(_this);

            var k = (0, _kolor2['default'])(_this.state.value || '');

            if (!k) {
                k = (0, _kolor2['default'])('#ff0000');
            }

            var _k$hsva$toArray = k.hsva().toArray(),
                h = _k$hsva$toArray[0],
                s = _k$hsva$toArray[1],
                v = _k$hsva$toArray[2],
                a = _k$hsva$toArray[3];

            var _k$rgb$toArray = k.rgb().toArray(),
                r = _k$rgb$toArray[0],
                g = _k$rgb$toArray[1],
                b = _k$rgb$toArray[2];

            _this.state = _extends({}, _this.state, {

                // hua
                h: h,

                // saturation
                s: s,

                // value
                v: v,

                // alpha
                a: a,

                // 这四个值只是用来缓存输入
                r: r,

                g: g,

                b: b,

                hex: k.hex(),

                // 表示当前colorpicker选色器的状态，默认是没有显示
                open: false

            });

            return _this;
        }

        ColorPicker.prototype.componentDidUpdate = function componentDidUpdate() {

            if (this.state.open && this.layer && this.main) {
                var _props = this.props,
                    mainArchor = _props.mainArchor,
                    layerArchor = _props.layerArchor;


                (0, _domAlign2['default'])(this.layer, this.main, {
                    points: [layerArchor, mainArchor],
                    overflow: {
                        adjustX: true,
                        adjustY: true
                    }
                });
            }
        };

        ColorPicker.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {

            if (this.props.value !== nextProps.value) {
                var k = (0, _kolor2['default'])(nextProps.value);
                if (k) {
                    this.updateValue.apply(this, k.hsva().toArray());
                }
            }

            _InputComponent.prototype.componentWillReceiveProps.call(this, nextProps);
        };

        ColorPicker.prototype.onClickAway = function onClickAway() {
            this.setState({ closing: true });
        };

        ColorPicker.prototype.onLabelClick = function onLabelClick(e) {
            if (this.state.open) {
                this.onClickAway();
            } else {
                this.setState({ open: true });
            }
        };

        ColorPicker.prototype.onSubmit = function onSubmit() {
            var _state = this.state,
                h = _state.h,
                s = _state.s,
                v = _state.v,
                a = _state.a;


            this.onClickAway();

            _InputComponent.prototype.onChange.call(this, {
                value: _kolor2['default'].hsva(h, s, v, a).rgba().css(),
                target: this,
                type: 'change'
            });
        };

        ColorPicker.prototype.onHueChange = function onHueChange(e) {

            this.setState({
                h: e.y * 360
            });
        };

        ColorPicker.prototype.onSaturationChange = function onSaturationChange(_ref) {
            var x = _ref.x,
                y = _ref.y;

            this.setState({ s: x, v: 1 - y });
        };

        ColorPicker.prototype.onAlphaChange = function onAlphaChange(_ref2) {
            var y = _ref2.y;

            this.setState({
                a: y.toFixed(2)
            });
        };

        ColorPicker.prototype.updateValue = function updateValue(h, s, v, a) {
            var k = _kolor2['default'].hsva(h, s, v, a);

            var _k$rgb$toArray2 = k.rgb().toArray(),
                r = _k$rgb$toArray2[0],
                g = _k$rgb$toArray2[1],
                b = _k$rgb$toArray2[2];

            this.setState({ h: h, s: s, v: v, a: a, r: r, g: g, b: b, hex: k.hex() });
        };

        ColorPicker.prototype.renderBox = function renderBox(color) {
            var _this2 = this;

            return _react2['default'].createElement('span', {
                key: color,
                className: cx.getPartClassName('box'),
                style: {
                    backgroundColor: color
                },
                onClick: function onClick() {
                    return _this2.updateValue.apply(_this2, (0, _kolor2['default'])(color).hsva().toArray());
                } });
        };

        ColorPicker.prototype.renderBoxes = function renderBoxes(boxes) {
            var _this3 = this;

            return boxes.reduce(function (groups, box, index) {

                var i = Math.floor(index / 8);
                var group = groups[i];

                if (!group) {
                    group = groups[i] = [];
                }

                group.push(box);

                return groups;
            }, []).map(function (boxes, index) {
                return _react2['default'].createElement(
                    'div',
                    { key: index, className: cx.getPartClassName('box-panel') },
                    boxes.map(function (item) {
                        return _this3.renderBox(item);
                    })
                );
            });
        };

        ColorPicker.prototype.renderRGBAInputs = function renderRGBAInputs() {
            var _this4 = this;

            var _state2 = this.state,
                r = _state2.r,
                g = _state2.g,
                b = _state2.b,
                a = _state2.a;


            return ['r', 'g', 'b', 'a'].map(function (key) {

                var time = key === 'a' ? 100 : 1;
                var value = _this4.state[key];

                return _react2['default'].createElement(
                    'li',
                    {
                        key: key,
                        className: cx.getPartClassName('input-box') },
                    _react2['default'].createElement('input', {
                        className: cx.getPartClassName('input-' + key),
                        value: value === '' ? value : Math.round(_this4.state[key] * time),
                        onBlur: function onBlur(e) {

                            if (e.target.value) {
                                return;
                            }

                            var _state3 = _this4.state,
                                h = _state3.h,
                                s = _state3.s,
                                v = _state3.v,
                                a = _state3.a;


                            _this4.updateValue(h, s, v, a);
                        },
                        onChange: function onChange(e) {
                            var _kolor$rgba;

                            var v = e.target.value;

                            if (!v) {
                                var _this4$setState;

                                _this4.setState((_this4$setState = {}, _this4$setState[key] = '', _this4$setState));
                                return;
                            }

                            v = +v;

                            if (isNaN(v)) {
                                return;
                            }

                            var k = _kolor2['default'].rgba((_kolor$rgba = {
                                r: r, g: g, b: b, a: a
                            }, _kolor$rgba[key] = v / time, _kolor$rgba));

                            if (!k) {
                                k = _kolor2['default'].rgba(r, g, b, a);
                            }

                            _this4.updateValue.apply(_this4, k.hsva().toArray());
                        } }),
                    _react2['default'].createElement(
                        'label',
                        { className: cx.getPartClassName('input-label') },
                        key.toUpperCase()
                    )
                );
            });
        };

        ColorPicker.prototype.renderLayerContent = function renderLayerContent() {
            var _this5 = this;

            var _props2 = this.props,
                placeholder = _props2.placeholder,
                boxes = _props2.boxes;
            var _state4 = this.state,
                h = _state4.h,
                s = _state4.s,
                v = _state4.v,
                a = _state4.a,
                hex = _state4.hex;


            var k = _kolor2['default'].hsva(h, s, v, a);

            var _k$rgb$toArray3 = k.rgb().toArray(),
                r = _k$rgb$toArray3[0],
                g = _k$rgb$toArray3[1],
                b = _k$rgb$toArray3[2];

            var alphaStart = _kolor2['default'].rgba(r, g, b, 0).css();
            var alphaStop = _kolor2['default'].rgba(r, g, b, 1).css();
            var alphaForegroundColor = 'linear-gradient(180deg, ' + alphaStart + ', ' + alphaStop + ')';

            return _react2['default'].createElement(
                'div',
                null,
                _react2['default'].createElement(
                    'div',
                    { className: cx.getPartClassName('selector-panel') },
                    _react2['default'].createElement(
                        _DragPanel2['default'],
                        {
                            className: cx.getPartClassName('saturation'),
                            style: { backgroundColor: _kolor2['default'].hsv(h, 1, 1).rgb().css() },
                            onPositionChange: this.onSaturationChange },
                        _react2['default'].createElement(
                            'div',
                            { className: cx.getPartClassName('white') },
                            _react2['default'].createElement('div', { className: cx.getPartClassName('black') })
                        ),
                        _react2['default'].createElement('div', {
                            className: cx.getPartClassName('sv-anchor'),
                            style: {
                                transform: 'translate(' + s * SV_SIZE + 'px, ' + (1 - v) * SV_SIZE + 'px)'
                            } })
                    ),
                    _react2['default'].createElement(
                        _DragPanel2['default'],
                        {
                            className: cx.getPartClassName('hue'),
                            onPositionChange: this.onHueChange },
                        _react2['default'].createElement('div', {
                            className: cx.getPartClassName('hue-anchor'),
                            style: {
                                transform: 'translateY(' + HUE_HEIGHT * h / 360 + 'px)'
                            } })
                    ),
                    _react2['default'].createElement(
                        _DragPanel2['default'],
                        {
                            className: cx.getPartClassName('alpha'),
                            onPositionChange: this.onAlphaChange },
                        _react2['default'].createElement(
                            'div',
                            {
                                className: cx.getPartClassName('alpha-foreground'),
                                style: {
                                    background: alphaForegroundColor
                                } },
                            _react2['default'].createElement('div', {
                                className: cx.getPartClassName('alpha-anchor'),
                                style: {
                                    transform: 'translateY(' + Math.round(a * HUE_HEIGHT) + 'px)'
                                } })
                        )
                    )
                ),
                _react2['default'].createElement(
                    'ul',
                    { className: cx.getPartClassName('input-panel') },
                    _react2['default'].createElement(
                        'li',
                        { className: cx.getPartClassName('input-box') },
                        _react2['default'].createElement('input', {
                            className: cx.getPartClassName('input-hex'),
                            type: 'text',
                            onChange: function onChange(e) {
                                return _this5.setState({ hex: e.target.value });
                            },
                            onBlur: function onBlur(e) {
                                var k = (0, _kolor2['default'])(e.target.value);
                                k = k ? k.hsva().a(a) : _kolor2['default'].hsva(h, s, v, a);
                                _this5.updateValue.apply(_this5, k.toArray());
                            },
                            placeholder: placeholder,
                            value: hex }),
                        _react2['default'].createElement(
                            'label',
                            { className: cx.getPartClassName('input-label') },
                            'HEX'
                        )
                    ),
                    this.renderRGBAInputs()
                ),
                this.renderBoxes(boxes),
                _react2['default'].createElement(
                    'div',
                    { className: cx.getPartClassName('button-panel') },
                    _react2['default'].createElement(_Button2['default'], {
                        label: 'cancel',
                        size: 'xxs',
                        type: 'button',
                        variants: ['secondery'],
                        className: cx.getPartClassName('cancel'),
                        onClick: this.onClickAway }),
                    _react2['default'].createElement(_Button2['default'], {
                        label: 'OK',
                        size: 'xxs',
                        type: 'button',
                        variants: ['secondery'],
                        className: cx.getPartClassName('submit'),
                        onClick: this.onSubmit })
                )
            );
        };

        ColorPicker.prototype.renderLayer = function renderLayer() {
            var _this6 = this;

            var _state5 = this.state,
                open = _state5.open,
                closing = _state5.closing;

            var begin = open && !closing ? 0 : 1;
            var end = open && !closing ? 1 : 0;
            var content = this.renderLayerContent();

            return _react2['default'].createElement(
                _reactMotion.Motion,
                {
                    defaultStyle: {
                        opacity: begin,
                        scale: begin
                    },
                    style: {
                        opacity: (0, _reactMotion.spring)(end),
                        scale: (0, _reactMotion.spring)(end, { stiffness: 260, damping: 20 })
                    },
                    onRest: function onRest() {
                        if (open && closing) {
                            _this6.setState({ open: false, closing: false });
                        }
                    } },
                function (_ref3) {
                    var scale = _ref3.scale,
                        opacity = _ref3.opacity;
                    return _react2['default'].createElement(
                        'div',
                        {
                            className: cx.getPartClassName('popup'),
                            style: {
                                opacity: opacity,
                                transform: 'scale(' + scale + ', ' + scale + ')'
                            },
                            ref: function ref(layer) {
                                _this6.layer = layer;
                            } },
                        content
                    );
                }
            );
        };

        ColorPicker.prototype.render = function render() {
            var _this7 = this;

            var _state6 = this.state,
                value = _state6.value,
                open = _state6.open,
                closing = _state6.closing;
            var _props3 = this.props,
                variants = _props3.variants,
                states = _props3.states,
                size = _props3.size,
                placeholder = _props3.placeholder;


            var className = cx(this.props).addVariants(variants).addStates(states).build();

            var label = !value ? _react2['default'].createElement(
                'span',
                { className: cx.getPartClassName('placeholder') },
                placeholder
            ) : _react2['default'].createElement(
                'span',
                { className: cx.getPartClassName('value') },
                _react2['default'].createElement('i', {
                    className: cx.getPartClassName('value-indicator'),
                    style: { backgroundColor: value } }),
                value
            );

            return _react2['default'].createElement(
                'div',
                {
                    className: className,
                    ref: function ref(main) {
                        _this7.main = main;
                    } },
                _react2['default'].createElement(
                    'label',
                    {
                        className: cx.getPartClassName('label'),
                        onClick: this.onLabelClick },
                    label,
                    _react2['default'].createElement(_Icon2['default'], { icon: 'expand-more', size: size })
                ),
                _react2['default'].createElement(_melonLayer2['default'], {
                    open: open || closing,
                    render: this.renderLayer,
                    onClickAway: this.onClickAway })
            );
        };

        return ColorPicker;
    }(_InputComponent3['default']);

    exports['default'] = ColorPicker;


    ColorPicker.displayName = 'ColorPicker';

    var archor = _react.PropTypes.oneOf(['tl', 'tc', 'tr', 'cl', 'cc', 'cr', 'bl', 'bc', 'br']);

    ColorPicker.propTypes = _extends({}, _InputComponent3['default'].propTypes, {
        placeholder: _react.PropTypes.string,
        boxes: _react.PropTypes.arrayOf(_react.PropTypes.string.isRequired),
        layerArchor: archor,
        mainArchor: archor
    });

    ColorPicker.defaultProps = _extends({}, _InputComponent3['default'].defaultProps, {

        /**
         * 选色器标签文字
         */
        placeholder: '请选择',
        // 用户自行定义的常用颜色样例
        boxes: ['#FFFFFF', '#000000', '#FF425E', '#C6EDE8', '#66CCCC', '#CCCCCC', '#576069', '#E2D3AC', '#FDDA04', '#E58308', '#FF99CC', '#FC9D9B', '#59453E', '#CCFF00', '#333333', '#aaaaaa'],
        layerArchor: 'tl',
        mainArchor: 'bl'
    });
});
//# sourceMappingURL=index.js.map
