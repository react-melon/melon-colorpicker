/**
 * @file ColorPicker
 * @author jingyuanZhang<zhangjingyuan1108@outlook.com zhangjingyuan02@baidu.com>
 * @author leon<ludafa@outlook.com>
 */

import React, {PropTypes} from 'react';
import Validity from 'melon-core/Validity';
import InputComponent from 'melon-core/InputComponent';
import {create} from 'melon-core/classname/cxBuilder';

import Icon  from 'melon/Icon';
import Button from 'melon/Button';
import dom from 'melon/common/util/dom';

import * as util from './util';

const cx = create('ColorPicker');

/**
 * melon colorpicker——选色器，主要由色调块、饱和度区、颜色值输入框、颜色展示区和常用颜色样例五部分组成
 * 用户最终选择的颜色取决于基色调和饱和度，选择的颜色在颜色展示区可以看见
 *
 * @class
 * @extends {InputComponent}
 */
export default class ColorPicker extends InputComponent {

    constructor(props, context) {
        // 继承InputComponent
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
            satValue: '00FFE7',     // 预设颜色选择器的基色调rgb值，颜色值饱和度区域变化取决于该值
            color: '00FFE7',        // 预设颜色选择器的最终选择的颜色值rgb，和选色器的颜色值hex输入框的值绑定，决定颜色展示区的颜色
            open: false,            // 表示当前colorpicker选色器的状态，默认是没有显示
            error: false            // 表示当前颜色值输入框的值是否不合法，默认是合法
        };

    }

    /**
     * react组件生命周期——组件销毁前调用
     *
     * @public
     */
    componentWillUnmount() {
        // colorpicker销毁时给document解绑click事件onClickAway
        dom.off(document, 'click', this.onClickAway);
    }

    /**
     * 当选色器打开后，根据点击事件位置判断是都关闭选色器，点击选色器组件外关闭选择器
     *
     * @protected
     * @param {Object} e 点击事件
     */
    onClickAway(e) {

        let open = this.state.open;
        // 当选色器已打开，且点击位置(e.target)没有点击在选色器上(this.refs.main)时，关闭选色器，并解绑点击事件onClickAway
        if (open && !dom.contains(this.refs.main, e.target)) {
            this.setState({open: false}, () => {
                dom.off(document, 'click', this.onClickAway);
            });
        }
    }

    /**
     * 给label标签TextBox绑定的点击事件，点击TextBox时打开颜色选择器，当选择器打开后，再次点击关闭
     *
     * @protected
     * @param {Object} e 点击事件
     */
    onLabelClick(e) {

        let open = this.state.open;

        this.setState({
            open: !open
        }, () => {
            if (!open) {
                // 当颜色选择器打开时，给document绑定事件
                dom.on(document, 'click', this.onClickAway);
            }
            else {
                // 关闭颜色选择器后，解绑该事件
                dom.off(document, 'click', this.onClickAway);
            }
        });
    }

    /**
     * 检查用户输入的rgb字符串的长度是否不合法
     *
     * @protected
     * @param {string} color 颜色值输入框的输入值
     * @return {boolean} 验证结果
     */
    isRawInputError(color) {
        // 输入的颜色值rgb不能为空，且长度只能为3或者6（不包含#）
        return color !== '' && color.length !== 3 && color.length !== 6;
    }

    /**
     * 点击OK键，提交输入框的颜色值rgb
     *
     * @protected
     */
    onSubmit() {
        // 如果颜色值rgb不合法，不能提交，并返回
        if (this.state.error) {
            return;
        }
        // 获取当前输入框的颜色值rgb
        let color = this.state.color;
        // 关闭颜色选择器
        this.setState({open: false});

        super.onChange({
            type: 'change',
            target: this,
            value: color ? '#' + color : ''
        });
    }

    /**
     * 用户点击色调块（hue div）,选择基本色调rgb值
     *
     * @protected
     * @param {Object} e 用户点击色调块hue事件
     */
    onHueChange(e) {

        // 获取当前选色器里色调块的位置
        const {top, left} = this.refs.hue.getBoundingClientRect();
        let huel = e.pageX - left;  // 获取用户点击位置相对色调块的位置——左
        let huet = e.pageY - top;   // 获取用户点击位置相对色调块的位置——高
        let red = 0;                // 初始化rgb值中r值（red），值域0~255
        let green = 0;              // 初始化rgb值中g值（green），值域0~255
        let blue = 0;               // 初始化rgb值中b值（blue），值域0~255

        // 选色器的色调块长240px，宽16px，判断用户是否点击在色调块上
        if ((huel >= 0 && huel <= 240) && (huet >= 0 && huet <= 16)) {
            // 色调块由六个颜色渐变区域组成，0: (255, 0, 0)~(255, 255, 0); 1: (255, 255, 0)~(0, 255, 0); 2: (0, 255, 0)~(0, 255, 255);
            // 3: (0, 255, 255)~(0, 0, 255); 4: (0, 0, 255)~(255, 0, 255); 5: (255, 0, 255)~(255, 0, 0);
            // 每个渐变区域长40px
            let quyu = parseInt(huel / 40, 10); // 获取用户点击的颜色渐变区
            let yushu = huel % 40; // 获取用户点击位置在相应渐变区的相对位置

            switch (quyu) {
                case 0:                                             // 渐变区域 0：(255, 0, 0)~(255, 255, 0)
                    red = 255;                                      // 区域0r值（red）一直保持不变，都是255
                    green = Math.round(255 * yushu / 40);           // 区域0g值（green）在 0 ~ 255间，根据点击的相对位置获取g值
                    blue = 0;                                       // 区域0b值（blue）一直保持不变，都是0
                    break;

                case 1:                                             // 渐变区域 1：(255, 255, 0)~(0, 255, 0)
                    red = Math.round(255 * (1 - yushu / 40));       // 区域1r值（red）在 255 ~ 0间，根据点击的相对位置获取r值
                    green = 255;                                    // 区域1g值（green）一直保持不变，都是255
                    blue = 0;                                       // 区域1b值（blue）一直保持不变，都是0
                    break;

                case 2:                                             // 渐变区域 2：(0, 255, 0)~(0, 255, 255)
                    red = 0;                                        // 区域2r值（red）一直保持不变，都是0
                    green = 255;                                    // 区域2g值（green）一直保持不变，都是255
                    blue = Math.round(255 * yushu / 40);            // 区域2b值（blue）在 0 ~ 255间，根据点击的相对位置获取b值
                    break;

                case 3:                                             // 渐变区域 3：(0, 255, 255)~(0, 0, 255)
                    red = 0;                                        // 区域3r值（red）一直保持不变，都是0
                    green = Math.round(255 * (1 - yushu / 40));     // 区域3g值（green）在 255 ~ 0间，根据点击的相对位置获取g值
                    blue = 255;                                     // 区域3b值（blue）一直保持不变，都是255
                    break;

                case 4:                                             // 渐变区域 4：(0, 0, 255)~(255, 0, 255)
                    red = Math.round(255 * yushu / 40);             // 区域4r值（red）在 0 ~ 255间，根据点击的相对位置获取r值
                    green = 0;                                      // 区域4g值（green）一直保持不变，都是0
                    blue = 255;                                     // 区域4b值（blue）一直保持不变，都是255
                    break;

                case 5:                                             // 渐变区域 5：(255, 0, 255)~(255, 0, 0)
                    red = 255;                                      // 区域5r值（red）一直保持不变，都是255
                    green = 0;                                      // 区域5g值（green）一直保持不变，都是255
                    blue = Math.round(255 * (1 - yushu / 40));      // 区域5b值（blue）在 255 ~ 0间，根据点击的相对位置获取b值
                    break;
            }
            // util.toHex函数将r、g、b值转化为16进制，（xxx, yyy, zzz）-> xxyyzz
            const colorHEX = `${util.toHex(red)}${util.toHex(green)}${util.toHex(blue)}`;

            this.setState({
                color: colorHEX,        // 实时更改输入框颜色值为当前选择的基本色调rgb值
                satValue: colorHEX      // 实时更改选色器的其色调值为当前输入值
            });
        }
    }

    /**
     * 选色器为用户提供了常用颜色样例，当用户点击颜色样例后，判断颜色样例色值是否合法，并更改输入框的颜色值、颜色展示区和基色调
     *
     * @protected
     * @param {Object} opt 用户点击的颜色样例，获取到其属性对象，有两个属性，颜色值和基色调
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
     * 当用户手动键入输入框的颜色值hex（16进制），相应的颜色展示区跟着变化，此时基色调不变
     *
     * @protected
     * @param {Object} e 颜色输入框内值发生改变时的事件
     * @return {boolean} 颜色改变是否成功
     */
    onHexChange(e) {
        // 获取当前输入框值
        let rgb = e.target.value;
        // 用户输入超过6个字符时，不显示后续输入并返回
        if (rgb.length > 6) {
            return false;
        }
        // 判断用户输入值是否符合规则（16进制），如有非法字符，则替换为''
        rgb = rgb.replace(/[^0-9a-fA-F]/gi, '');
        // 将结果赋给选色器的颜色值，并在颜色展示区显示该颜色
        this.setState({color: rgb.toUpperCase()});
        return true;
    }

    /**
     * 当用户点击饱和度（saturation）区域时，输入框和颜色展示区显示相应颜色，
     * 饱和度区域颜色变化，由基色调satValue rgb值向000000（白色）和FFFFFF（黑色）变化
     *
     * @protected
     * @param {Object} e 用户在饱和度区域的点击事件
     */
    onSaturationChange(e) {
        // 获取当前选色器里饱和度区域的位置
        const {top, left} = this.refs.saturation.getBoundingClientRect();
        const satValue = this.state.satValue;  // 获得当前其色调，饱和度的基本颜色

        let satl = e.pageX - left;  // 获取用户点击位置相对饱和度的位置——左
        let satt = e.pageY - top;   // 获取用户点击位置相对饱和度的位置——高

        // 选色器的饱和度区域长240px，宽150px，判断用户是否点击在饱和度区域内
        if ((satl >= 0 && satl <= 240) && (satt >= 0 && satt <= 150)) {
            let percentH = satt / 150; // 获取用户点击的饱和度的相对高度，越高颜色越接近黑色
            let percentW = satl / 240; // 获取用户点击的饱和度的相对宽度，越近越接近白色

            // rgb颜色值由三个元素表示：0 1 表示元素r；2 3 表示元素g；4 5表示元素b，0 2 4分别是元素r g b值的开始
            // 获取当前饱和度的颜色值rgb
            let colorHEX = [0, 2, 4].reduce((result, item) => {
                // 将颜色三个元素r g b的16进制值转化为10进制
                let part = parseInt('0x' + satValue.slice(item, item + 2), 16);
                part = 255 - (255 - part) * percentW; // 获取基色调各元素相对白色的饱和度（亮度）
                part = util.toHex(Math.round(part * (1 - percentH)));   // 再获取基色调各元素相对黑色的饱和度（暗度），将结果转为16进制
                return result + part; // 将结果保存
            }, '');
            // 将最终获得饱和度的颜色值输出，赋给输入框，并在相应颜色区展示
            this.setState({color: colorHEX});
        }
    }

    /**
     * 渲染常用颜色样例区域的颜色样例结构
     *
     * @protected
     * @param {Object} box 定义的常用颜色样例对象，包含颜色值和基色调两个属性
     * @return {React.Element}
     */
    renderBox(box) {

        const {
            color,  // 颜色样例的颜色值
            hue     // 颜色样例的基色调
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

    /**
     * 渲染常用颜色样例区域
     *
     * @protected
     * @param {Array} boxes 包含颜色样例的数组
     * @return {React.Element}
     */
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
            satValue,       // 当前基色调
            open,           // 选色器显示状态
            color,          // 当前选色器最终的选择颜色
            value,          // 输入组件的值，也就是选色器最终颜色值
            error           // 选色器输入框的输入值是否合法
        } = this.state;

        const {
            placeholder,    // 用户可定义的选色器标签提示文字，'请选择'等提示语
            boxes           // 用户可定义的常用颜色样例
        } = this.props;

        return (
            <div ref="main" className={cx(this.props).build()}>
                <label
                    className={cx.getPartClassName('label')}
                    onClick={this.onLabelClick}>
                        <span
                            className={cx.getPartClassName('placeholder')}
                            style={{color: value ? '#333' : ''}}>
                            {value ? value : placeholder}
                        </span>
                    <Icon icon='expand-more'/>
                </label>
                <Validity validity={this.state.validity} />
                <div
                    className={cx.getPartClassName('popup')}
                    style={{
                        display: open ? 'block' : 'none'
                    }}>
                    <div
                        ref="saturation"
                        className={cx.getPartClassName('saturation')}
                        style={{
                            backgroundColor: '#' + satValue
                        }}
                        onClick={this.onSaturationChange}>
                        <div className={cx.getPartClassName('white')}>
                            <div className={cx.getPartClassName('black')}></div>
                        </div>
                    </div>
                    <div
                        ref="hue"
                        className={cx.getPartClassName('hue')}
                        onClick={this.onHueChange} />
                    <div className={cx.getPartClassName('input-box')}>
                        <span>Hex</span>
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
                    </div>
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
    // 用户自行定义的常用颜色样例
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
