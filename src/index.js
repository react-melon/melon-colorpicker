/**
 * @file ColorPicker
 * @author jingyuanZhang<zhangjingyuan1108@outlook.com>
 * @author leon<ludafa@outlook.com>
 */

import React, {PropTypes} from 'react';

import InputComponent from 'melon-core/InputComponent';
import {create} from 'melon-core/classname/cxBuilder';

import Icon  from 'melon/Icon';
import Button from 'melon/Button';
import dom from 'melon/common/util/dom';

import * as util from './util';

const cx = create('ColorPicker');

/**
 * melon 选色器
 */
export default class ColorPicker extends InputComponent {

    constructor(props, context) {

        super(props, context);

        this.onSubmit = this.onSubmit.bind(this);
        this.onHueChange = this.onHueChange.bind(this);
        this.onSaturationChange = this.onSaturationChange.bind(this);
        this.onBoxClick = this.onBoxClick.bind(this);
        this.onLabelClick = this.onLabelClick.bind(this);
        this.onHexChange = this.onHexChange.bind(this);
        this.isRawInputError = this.isRawInputError.bind(this);
        this.onClickAway = this.onClickAway.bind(this);

        this.state = {
            ...this.state,
            satValue: '00FFE7',
            color: '00FFE7',
            open: false,
            error: false
        };

    }

    componentWillUnmount() {
        dom.off(document, 'click', this.onClickAway);
    }

    /**
     * 当选色器打开后，根据点击事件位置判断是都关闭选色器，点击选色器组件外关闭选择器
     *
     * @param {Object} e 点击事件
     */
    onClickAway(e) {
        let open = this.state.open;
        // alert(dom.contains(this.refs.picker, e.target));
        if (open && !dom.contains(this.refs.picker, e.target)) {
            this.setState({open: false}, () => {
                dom.off(document, 'click', this.onClickAway);
            });
        }
    }

    /**
     * 点击TextBox时打开颜色选择器，当选择器打开后，再次点击关闭
     *
     * @param {Object} e 点击事件
     */
    onLabelClick(e) {
        let open = this.state.open;
        this.setState({
            open: !open,
            top: e.pageY + 20,
            left: e.pageX + 20
        }, () => {
            dom.on(document, 'click', this.onClickAway);
        });
    }

    /**
     * 检查用户输入的rgb是否正确
     *
     * @protected
     * @param {number} color 页数
     * @return {boolean} error 验证结果
     */
    isRawInputError(color) {
        return color !== '' && color.length !== 3 && color.length !== 6;
    }

    /**
     * 提交所选颜色
     *
     * @protected
     */
    onSubmit() {

        if (this.state.error) {
            return;
        }

        let color = this.state.color;

        this.setState({open: false});

        super.onChange({
            type: 'change',
            target: this,
            value: color ? '#' + color : ''
        });

    }

    /**
     * 用户点击色调块（hue div）选择基本色调时的响应函数
     *
     * @param {Object} e 用户点击色调块事件
     */
    onHueChange(e) {

        const {top, left} = this.state;

        let huel = e.pageX - left;
        let huet = e.pageY - top - 160;
        let red = 0;
        let green = 0;
        let blue = 0;

        if ((huel >= 0 && huel <= 240) && (huet >= 0 && huet <= 16)) {

            let quyu = parseInt(huel / 40, 10);
            let yushu = huel % 40;

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

            const colorHEX = `${util.toHex(red)}${util.toHex(green)}${util.toHex(blue)}`;

            this.setState({
                color: colorHEX,
                satValue: colorHEX
            });

        }
    }

    /**
     * 用户点击了选色器下面的颜色样例后的行为
     *
     * @protected
     * @param {Object} opt 即将验证value值的对象
     */
    onBoxClick(opt) {

        let err = this.isRawInputError(opt.val);

        this.setState({
            color: opt.val,
            satValue: opt.satVal,
            error: err
        });

    }

    /**
     * 当用户手动修改输入框的颜色值，旁边的颜色展示区跟着变化
     *
     * @protected
     * @param {Object} e 即将验证value值的对象
     */
    onHexChange(e) {
        let rgb = e.target.value;
        if (rgb.length > 6) {
            return;
        }
        rgb = rgb.replace(/[^0-9a-fA-F]/gi, '');
        this.setState({color: rgb.toUpperCase()});
    }

    /**
     * 当用户点击饱和度（saturation）区域时，输入框和颜色展示区显示相应颜色
     *
     * @protected
     * @param {Event} e 事件
     */
    onSaturationChange(e) {
        const {top, left, satValue} = this.state;
        let satl = e.pageX - left;
        let satt = e.pageY - top;

        if ((satl >= 0 && satl <= 240) && (satt >= 0 && satt <= 150)) {
            let percentH = satt / 150;
            let percentW = satl / 240;
            let colorHEX = [0, 2, 4].reduce((result, item) => {
                let part = parseInt('0x' + satValue.slice(item, item + 2), 16);
                part = 255 - (255 - part) * percentW;
                part = util.toHex(Math.round(part * (1 - percentH)));
                return result + part;
            }, '');
            this.setState({color: colorHEX});
        }
    }

    renderBox(box) {

        const {
            color,
            hue
        } = box;

        return (
            <span
                key={color}
                className={cx.getPartClassName('box')}
                style={{
                    backgroundColor: '#' + color
                }}
                onClick={() => this.onBoxClick({val: color, satVal: hue})}>
            </span>
        );

    }

    renderBoxes(boxes) {

        return (
            <div className={cx.getPartClassName('boxes')}>
                {boxes.map(item => this.renderBox(item))}
            </div>
        );

    }

    /**
     * 渲染
     *
     * @public
     * @return {React.Element}
     */
    render() {

        const {
            satValue,
            open,
            top,
            left,
            color,
            value,
            error
        } = this.state;

        const {
            placeholder,
            boxes
        } = this.props;

        return (
            <div ref="picker" className={cx(this.props).build()}>
                <label onClick={this.onLabelClick}>
                        <span className={cx.getPartClassName('label-placeholder')}>
                            {value ? value : placeholder}
                        </span>
                    <Icon icon='expand-more'/>
                </label>
                <div
                    className={cx.getPartClassName('picker')}
                    style={{
                        display: open ? 'block' : 'none',
                        top: top,
                        left: left
                    }}
                    onClick={this.onSaturationChange}>
                    <div className={cx.getPartClassName('saturation')}
                        style={{
                            backgroundColor: '#' + satValue
                        }}>
                        <div className={cx.getPartClassName('white')}>
                            <div className={cx.getPartClassName('black')}></div>
                        </div>
                    </div>
                    <div className={cx.getPartClassName('hue')} onClick={this.onHueChange}></div>
                    <span className={cx.getPartClassName('label')}>Hex</span>
                    <input
                        className={cx.getPartClassName('rgbstr')}
                        type="text"
                        onBlur={() => {
                            this.setState({
                                error: this.isRawInputError(color)
                            });
                        }}
                        ref="rgbStr"
                        placeholder={placeholder}
                        value={color}
                        onChange={this.onHexChange}
                        style={{
                            border: error ? '1px red solid' : null
                        }}/>
                    <div
                        className={cx.getPartClassName('result')}
                        style={{
                            backgroundColor: '#' + color
                        }}>
                    </div>
                    <Button
                        label="OK"
                        key="submit"
                        size="xxs"
                        type="button"
                        variants={['secondery']}
                        className={cx.getPartClassName('submit')}
                        onClick={this.onSubmit}/>
                    {this.renderBoxes(boxes)}
                </div>
            </div>

        );

    }

}

ColorPicker.displayName = 'ColorPicker';

ColorPicker.defaultProps = {

    ...InputComponent.defaultProps,

    /**
      * 选色器标签文字
      */
    placeholder: '请选择',

    boxes: [
        {color: 'FF425E', hue: 'FF0059'},
        {color: 'C6EDE8', hue: '00FFF9'},
        {color: '66CCCC', hue: '00FFF9'},
        {color: 'FFFFFF', hue: '00FFF9'},
        {color: '000000', hue: '0079FF'},
        {color: 'CCCCCC', hue: '00CCFF'},
        {color: '576069', hue: 'FF0026'},
        {color: 'E2D3AC', hue: 'FFC600'},
        {color: 'FDDA04', hue: 'FFDF00'},
        {color: 'E58308', hue: 'FF8C00'},
        {color: 'FF99CC', hue: 'FF00BF'},
        {color: 'FC9D9B', hue: 'FF0000'},
        {color: '59453E', hue: 'FF0000'},
        {color: 'CCFF00', hue: 'B3FF00'}
    ]

};

ColorPicker.propTypes = {
    ...InputComponent.propTypes,
    placeholder: PropTypes.string,
    boxes: PropTypes.arrayOf(PropTypes.shape({
        color: PropTypes.string.isRequired,
        hue: PropTypes.string.isRequired
    }))
};
