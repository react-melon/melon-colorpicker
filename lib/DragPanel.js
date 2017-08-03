(function (global, factory) {
    if (typeof define === "function" && define.amd) {
        define(['exports', 'react', 'prop-types'], factory);
    } else if (typeof exports !== "undefined") {
        factory(exports, require('react'), require('prop-types'));
    } else {
        var mod = {
            exports: {}
        };
        factory(mod.exports, global.react, global.propTypes);
        global.DragPanel = mod.exports;
    }
})(this, function (exports, _react, _propTypes) {
    'use strict';

    exports.__esModule = true;

    var _react2 = _interopRequireDefault(_react);

    var _propTypes2 = _interopRequireDefault(_propTypes);

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

    function _objectWithoutProperties(obj, keys) {
        var target = {};

        for (var i in obj) {
            if (keys.indexOf(i) >= 0) continue;
            if (!Object.prototype.hasOwnProperty.call(obj, i)) continue;
            target[i] = obj[i];
        }

        return target;
    }

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

    var DragPanel = function (_PureComponent) {
        _inherits(DragPanel, _PureComponent);

        function DragPanel() {
            _classCallCheck(this, DragPanel);

            for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key];
            }

            var _this = _possibleConstructorReturn(this, _PureComponent.call.apply(_PureComponent, [this].concat(args)));

            _this.onMouseDown = _this.onMouseDown.bind(_this);
            _this.onMouseMove = _this.onMouseMove.bind(_this);
            _this.onMouseUp = _this.onMouseUp.bind(_this);
            _this.onClick = _this.onClick.bind(_this);
            return _this;
        }

        DragPanel.prototype.onMouseDown = function onMouseDown(e) {
            document.body.style.userSelect = 'none';
            this.position = this.main.getBoundingClientRect();
            window.addEventListener('mouseup', this.onMouseUp);
            window.addEventListener('mousemove', this.onMouseMove);
        };

        DragPanel.prototype.onMouseMove = function onMouseMove(e) {
            this.onPositionChange(e);
        };

        DragPanel.prototype.onMouseUp = function onMouseUp(e) {
            document.body.style.userSelect = '';
            this.onPositionChange(e);
            window.removeEventListener('mouseup', this.onMouseUp);
            window.removeEventListener('mousemove', this.onMouseMove);
        };

        DragPanel.prototype.onPositionChange = function onPositionChange(e) {
            var pageX = e.pageX,
                pageY = e.pageY;
            var _position = this.position,
                left = _position.left,
                top = _position.top,
                width = _position.width,
                height = _position.height;


            var x = pageX - left;
            var y = pageY - top;

            if (x < 0) {
                x = 0;
            } else if (x > width) {
                x = width;
            }

            if (y < 0) {
                y = 0;
            } else if (y > height) {
                y = height;
            }

            this.props.onPositionChange({
                x: x / width,
                y: y / height
            });
        };

        DragPanel.prototype.onClick = function onClick(e) {
            this.position = this.main.getBoundingClientRect();
            this.onPositionChange(e);
        };

        DragPanel.prototype.render = function render() {
            var _this2 = this;

            var _props = this.props,
                children = _props.children,
                onPositionChange = _props.onPositionChange,
                rest = _objectWithoutProperties(_props, ['children', 'onPositionChange']);

            /* eslint-enalbe no-unused-vars */

            return _react2['default'].createElement(
                'div',
                _extends({}, rest, {
                    ref: function ref(main) {
                        return _this2.main = main;
                    },
                    onMouseDown: this.onMouseDown,
                    onClick: this.onClick }),
                children
            );
        };

        return DragPanel;
    }(_react.PureComponent);

    DragPanel.propTypes = {
        onPositionChange: _propTypes2['default'].func.isRequired
    };
    exports['default'] = DragPanel;
});
//# sourceMappingURL=DragPanel.js.map
