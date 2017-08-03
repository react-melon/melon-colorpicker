/**
 * @file ColorPicker
 * @author jingyuanZhang<zhangjingyuan1108@outlook.com>
 * @author leon<ludafa@outlook.com>
 */

import React, {PropTypes} from 'react';
import InputComponent from 'melon-core/InputComponent';
import {create} from 'melon-core/classname/cxBuilder';
import {Motion, spring} from 'react-motion';
import Layer from 'melon-layer';
import Icon from 'melon/Icon';
import Button from 'melon/Button';
import align from 'dom-align';
import kolor from 'kolor';
import DragPanel from './DragPanel';

const cx = create('ColorPicker');

const HUE_HEIGHT = 210;
const SV_SIZE = 210;

/**
 * melon colorpicker——选色器，主要由色调块、饱和度区、颜色值输入框、颜色展示区和常用颜色样例五部分组成
 * 用户最终选择的颜色取决于基色调和饱和度，选择的颜色在颜色展示区可以看见
 *
 * @class
 * @extends {InputComponent}
 */
export default class ColorPicker extends InputComponent {

    constructor(props, context) {

        // 继承 InputComponent
        super(props, context);

        this.onSubmit = this.onSubmit.bind(this);
        this.onHueChange = this.onHueChange.bind(this);
        this.onSaturationChange = this.onSaturationChange.bind(this);
        this.onLabelClick = this.onLabelClick.bind(this);
        this.onClickAway = this.onClickAway.bind(this);
        this.onAlphaChange = this.onAlphaChange.bind(this);
        this.renderLayer = this.renderLayer.bind(this);

        let k = kolor(this.state.value || '');

        if (!k) {
            k = kolor('#ff0000');
        }

        let [h, s, v, a] = k.hsva().toArray();
        let [r, g, b] = k.rgb().toArray();

        this.state = {

            ...this.state,

            // hua
            h,

            // saturation
            s,

            // value
            v,

            // alpha
            a,


            // 这四个值只是用来缓存输入
            r,

            g,

            b,

            hex: k.hex(),

            // 表示当前colorpicker选色器的状态，默认是没有显示
            open: false

        };

    }

    componentDidUpdate() {

        if (this.state.open && this.layer && this.main) {

            let {
                mainArchor,
                layerArchor
            } = this.props;

            align(
                this.layer,
                this.main,
                {
                    points: [layerArchor, mainArchor],
                    overflow: {
                        adjustX: true,
                        adjustY: true
                    }
                }
            );
        }

    }

    componentWillReceiveProps(nextProps) {

        if (this.props.value !== nextProps.value) {
            let k = kolor(nextProps.value);
            if (k) {
                this.updateValue(...k.hsva().toArray());
            }
        }

        super.componentWillReceiveProps(nextProps);

    }

    /**
     * 当选色器打开后，根据点击事件位置判断是都关闭选色器，点击选色器组件外关闭选择器
     *
     * @protected
     */
    onClickAway() {
        this.setState({closing: true});
    }


    /**
     * 给label标签TextBox绑定的点击事件，点击TextBox时打开颜色选择器，当选择器打开后，再次点击关闭
     *
     * @protected
     * @param {Object} e 点击事件
     */
    onLabelClick(e) {
        if (this.state.open) {
            this.onClickAway();
        }
        else {
            this.setState({open: true});
        }
    }

    /**
     * 点击OK键，提交输入框的颜色值rgb
     *
     * @protected
     */
    onSubmit() {

        let {h, s, v, a} = this.state;

        this.onClickAway();

        super.onChange({
            value: kolor.hsva(h, s, v, a).rgba().css(),
            target: this,
            type: 'change'
        });

    }

    /**
     * 用户点击色调块（hue div）,选择基本色调rgb值
     *
     * @protected
     * @param {Object} e 用户点击色调块hue事件
     */
    onHueChange(e) {

        this.setState({
            h: e.y * 360
        });

    }

    /**
     * 当用户点击饱和度（saturation）区域时，输入框和颜色展示区显示相应颜色，
     *
     * @protected
     * @param {number} e.x 用户在饱和度区域的点击事件
     * @param {number} e.y 用户在饱和度区域的点击事件
     */
    onSaturationChange({x, y}) {
        this.setState({s: x, v: 1 - y});
    }

    onAlphaChange({y}) {
        this.setState({
            a: y.toFixed(2)
        });
    }

    updateValue(h, s, v, a) {
        let k = kolor.hsva(h, s, v, a);
        let [r, g, b] = k.rgb().toArray();
        this.setState({h, s, v, a, r, g, b, hex: k.hex()});
    }

    /**
     * 渲染常用颜色样例区域的颜色样例结构
     *
     * @protected
     * @param {string} color 定义的常用颜色样例对象，包含颜色值和基色调两个属性
     * @return {React.Element}
     */
    renderBox(color) {
        return (
            <span
                key={color}
                className={cx.getPartClassName('box')}
                style={{
                    backgroundColor: color
                }}
                onClick={() => this.updateValue(...kolor(color).hsva().toArray())}>
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

        return boxes
            .reduce((groups, box, index) => {

                let i = Math.floor(index / 8);
                let group = groups[i];

                if (!group) {
                    group = groups[i] = [];
                }

                group.push(box);

                return groups;

            }, [])
            .map((boxes, index) => (
                <div key={index} className={cx.getPartClassName('box-panel')}>
                    {boxes.map(item => this.renderBox(item))}
                </div>
            ));

    }

    renderRGBAInputs() {

        let {r, g, b, a} = this.state;

        return ['r', 'g', 'b', 'a']
            .map(key => {

                let time = key === 'a' ? 100 : 1;
                let value = this.state[key];

                return (
                    <li
                        key={key}
                        className={cx.getPartClassName('input-box')}>
                        <input
                            className={cx.getPartClassName(`input-${key}`)}
                            value={value === '' ? value : Math.round(this.state[key] * time)}
                            onBlur={e => {

                                if (e.target.value) {
                                    return;
                                }

                                let {h, s, v, a} = this.state;

                                this.updateValue(h, s, v, a);

                            }}
                            onChange={e => {

                                let v = e.target.value;

                                if (!v) {
                                    this.setState({
                                        [key]: ''
                                    });
                                    return;
                                }

                                v = +v;

                                if (isNaN(v)) {
                                    return;
                                }

                                let k = kolor.rgba({
                                    r, g, b, a,
                                    [key]: v / time
                                });

                                if (!k) {
                                    k = kolor.rgba(r, g, b, a);
                                }

                                this.updateValue(...k.hsva().toArray());

                            }} />
                        <label className={cx.getPartClassName('input-label')}>
                            {key.toUpperCase()}
                        </label>
                    </li>
                );

            });

    }

    renderLayerContent() {

        let {
            // 用户可定义的选色器标签提示文字，'请选择'等提示语
            placeholder,
            // 用户可定义的常用颜色样例
            boxes
        } = this.props;

        let {
            h,
            s,
            v,
            a,
            hex
        } = this.state;

        let k = kolor.hsva(h, s, v, a);
        let [r, g, b] = k.rgb().toArray();
        let alphaStart = kolor.rgba(r, g, b, 0).css();
        let alphaStop = kolor.rgba(r, g, b, 1).css();
        let alphaForegroundColor = `linear-gradient(180deg, ${alphaStart}, ${alphaStop})`;

        return (
            <div>
                <div className={cx.getPartClassName('selector-panel')}>
                    <DragPanel
                        className={cx.getPartClassName('saturation')}
                        style={{backgroundColor: kolor.hsv(h, 1, 1).rgb().css()}}
                        onPositionChange={this.onSaturationChange}>
                        <div className={cx.getPartClassName('white')}>
                            <div className={cx.getPartClassName('black')}></div>
                        </div>
                        <div
                            className={cx.getPartClassName('sv-anchor')}
                            style={{
                                transform: `translate(${s * SV_SIZE}px, ${(1 - v) * SV_SIZE}px)`
                            }} />
                    </DragPanel>
                    <DragPanel
                        className={cx.getPartClassName('hue')}
                        onPositionChange={this.onHueChange}>
                        <div
                            className={cx.getPartClassName('hue-anchor')}
                            style={{
                                transform: `translateY(${HUE_HEIGHT * h / 360}px)`
                            }} />
                    </DragPanel>
                    <DragPanel
                        className={cx.getPartClassName('alpha')}
                        onPositionChange={this.onAlphaChange}>
                        <div
                            className={cx.getPartClassName('alpha-foreground')}
                            style={{
                                background: alphaForegroundColor
                            }}>
                            <div
                                className={cx.getPartClassName('alpha-anchor')}
                                style={{
                                    transform: `translateY(${Math.round(a * HUE_HEIGHT)}px)`
                                }} />
                        </div>
                    </DragPanel>
                </div>
                <ul className={cx.getPartClassName('input-panel')}>
                    <li className={cx.getPartClassName('input-box')}>
                        <input
                            className={cx.getPartClassName('input-hex')}
                            type="text"
                            onChange={e => this.setState({hex: e.target.value})}
                            onBlur={e => {
                                let k = kolor(e.target.value);
                                k = k ? k.hsva().a(a) : kolor.hsva(h, s, v, a);
                                this.updateValue(...k.toArray());
                            }}
                            placeholder={placeholder}
                            value={hex} />
                        <label className={cx.getPartClassName('input-label')}>HEX</label>
                    </li>
                    {this.renderRGBAInputs()}
                </ul>
                {this.renderBoxes(boxes)}
                <div className={cx.getPartClassName('button-panel')}>
                    <Button
                        label="cancel"
                        size="xxs"
                        type="button"
                        variants={['secondery']}
                        className={cx.getPartClassName('cancel')}
                        onClick={this.onClickAway}/>
                    <Button
                        label="OK"
                        size="xxs"
                        type="button"
                        variants={['secondery']}
                        className={cx.getPartClassName('submit')}
                        onClick={this.onSubmit}/>
                </div>
            </div>
        );
    }

    renderLayer() {

        let {open, closing} = this.state;
        let begin = open && !closing ? 0 : 1;
        let end = open && !closing ? 1 : 0;
        let content = this.renderLayerContent();

        return (
            <Motion
                defaultStyle={{
                    opacity: begin,
                    scale: begin
                }}
                style={{
                    opacity: spring(end),
                    scale: spring(end, {stiffness: 260, damping: 20})
                }}
                onRest={() => {
                    if (open && closing) {
                        this.setState({open: false, closing: false});
                    }
                }}>
                {({scale, opacity}) => (
                    <div
                        className={cx.getPartClassName('popup')}
                        style={{
                            opacity: opacity,
                            transform: `scale(${scale}, ${scale})`
                        }}
                        ref={layer => {
                            this.layer = layer;
                        }}>
                        {content}
                    </div>
                )}
            </Motion>
        );

    }

    /**
     * 渲染
     *
     * @public
     * @return {React.Element}
     */
    render() {

        // 输入组件的值，也就是选色器最终颜色值
        const {value, open, closing} = this.state;

        const {
            variants,
            states,
            size,
            placeholder
        } = this.props;

        const className = cx(this.props)
            .addVariants(variants)
            .addStates(states)
            .build();

        let label = !value
            ? (
                <span className={cx.getPartClassName('placeholder')}>
                    {placeholder}
                </span>
            )
            : (
                <span className={cx.getPartClassName('value')}>
                    <i
                        className={cx.getPartClassName('value-indicator')}
                        style={{backgroundColor: value}} />
                    {value}
                </span>
            );


        return (
            <div
                className={className}
                ref={main => {
                    this.main = main;
                }}>
                <label
                    className={cx.getPartClassName('label')}
                    onClick={this.onLabelClick}>
                    {label}
                    <Icon icon='expand-more' size={size} />
                </label>
                <Layer
                    open={open || closing}
                    render={this.renderLayer}
                    onClickAway={this.onClickAway} />
            </div>
        );

    }

}

ColorPicker.displayName = 'ColorPicker';

let archor = PropTypes.oneOf([
    'tl', 'tc', 'tr',
    'cl', 'cc', 'cr',
    'bl', 'bc', 'br'
]);

ColorPicker.propTypes = {
    ...InputComponent.propTypes,
    placeholder: PropTypes.string,
    boxes: PropTypes.arrayOf(PropTypes.string.isRequired),
    layerArchor: archor,
    mainArchor: archor
};

ColorPicker.defaultProps = {

    ...InputComponent.defaultProps,

    /**
     * 选色器标签文字
     */
    placeholder: '请选择',
    // 用户自行定义的常用颜色样例
    boxes: [
        '#FFFFFF',
        '#000000',
        '#FF425E',
        '#C6EDE8',
        '#66CCCC',
        '#CCCCCC',
        '#576069',
        '#E2D3AC',
        '#FDDA04',
        '#E58308',
        '#FF99CC',
        '#FC9D9B',
        '#59453E',
        '#CCFF00',
        '#333333',
        '#aaaaaa'
    ],
    layerArchor: 'tl',
    mainArchor: 'bl'
};
