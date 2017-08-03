/**
 * @file ColorPicker 测试
 * @author leon <ludafa@outlook.com>
 * @author jingyuanZhang<zhangjingyuan1108@outlook.com>
 */

import {mount, shallow} from 'enzyme';
import React from 'react';
import ColorPicker from '../../src/index';
import ReactTestUtils from 'react-addons-test-utils';

import './index.styl';

describe('colorpicker', function () {

    it('open / close', done => {

        const colorpicker = mount(
            <ColorPicker
                name="rgbStr"
                placeholder="请选择"
                value=""
                onChange={() => {}}
            />
        );

        let colorpickerLabel = colorpicker.find('.ui-color-picker-label').at(0);

        colorpickerLabel.simulate('click');

        // 这里先等展开的动画播完
        setTimeout(() => {

            expect(colorpicker.state('open')).toBeTruthy();

            let saturation = document.querySelector('.ui-color-picker-saturation');

            saturation.click();

            expect(colorpicker.state('open')).toBeTruthy();

            colorpickerLabel.simulate('click');

            // 这个时候收起的动画还没完
            expect(colorpicker.state('open')).toBeTruthy();
            expect(colorpicker.state('closing')).toBeTruthy();

            setTimeout(() => {

                expect(colorpicker.state('open')).toBeFalsy();
                expect(colorpicker.state('closing')).toBeFalsy();
                colorpicker.unmount();
                done();

            }, 1000);


        }, 1000);

    });

    it('select color from box', done => {

        const colorpicker = mount(
            <ColorPicker
                name="rgbStr"
                placeholder="请选择"
                value=""
                onChange={() => {}}
            />
        );

        let colorpickerLabel = colorpicker.find('.ui-color-picker-label').at(0);

        colorpickerLabel.simulate('click');

        // 这里先等展开的动画播完
        setTimeout(() => {

            let saturation = document.querySelector('.ui-color-picker-box');

            saturation.click();

            expect(colorpicker.state('r')).toBe(255);
            expect(colorpicker.state('g')).toBe(255);
            expect(colorpicker.state('b')).toBe(255);

            colorpicker.unmount();

            done();


        }, 1000);

    });

    it('select a color from panels', done => {

        const colorpicker = mount(
            <ColorPicker
                name="rgbStr"
                placeholder="请选择"
                value=""
                onChange={() => {}}
            />
        );

        let colorpickerLabel = colorpicker.find('.ui-color-picker-label').at(0);

        colorpickerLabel.simulate('click');

        // 这里先等展开的动画播完
        setTimeout(() => {

            colorpicker.instance().onSaturationChange({
                x: 0,
                y: 0
            });

            expect(colorpicker.state('h')).toBe(0);
            expect(colorpicker.state('s')).toBe(0);
            expect(colorpicker.state('v')).toBe(1);

            colorpicker.instance().onHueChange({
                x: 0.5,
                y: 0.5
            });

            expect(colorpicker.state('h')).toBe(180);

            colorpicker.instance().onAlphaChange({
                x: 0.5,
                y: 0.5
            });

            expect(colorpicker.state('a') - 0.5).toBe(0);

            colorpicker.unmount();

            done();

        }, 1000);

    });

    it('input in rgba boxes', done => {

        const colorpicker = mount(
            <ColorPicker
                name="rgbStr"
                placeholder="请选择"
                value="#00ff00"
                onChange={() => {}}
            />
        );

        let colorpickerLabel = colorpicker.find('.ui-color-picker-label').at(0);

        colorpickerLabel.simulate('click');

        // 这里先等展开的动画播完
        setTimeout(() => {

            let rInput = document.querySelector('.ui-color-picker-input-r');

            expect(colorpicker.state('h')).toBe(120);

            ReactTestUtils.Simulate.change(rInput, {target: {value: ''}});

            expect(colorpicker.state('r')).toBe('');

            ReactTestUtils.Simulate.blur(rInput);

            expect(colorpicker.state('r')).toBe(0);

            ReactTestUtils.Simulate.change(rInput, {target: {value: 'a'}});

            expect(colorpicker.state('r')).toBe(0);

            ReactTestUtils.Simulate.blur(rInput);

            expect(colorpicker.state('r')).toBe(0);

            ReactTestUtils.Simulate.change(rInput, {target: {value: '300'}});

            expect(colorpicker.state('r')).toBe(255);
            expect(colorpicker.state('h')).toBe(60);

            ReactTestUtils.Simulate.change(rInput, {target: {value: '255'}});

            expect(colorpicker.state('r')).toBe(255);
            expect(colorpicker.state('h')).toBe(60);

            let hexInput = document.querySelector('.ui-color-picker-input-hex');

            ReactTestUtils.Simulate.change(hexInput, {target: {value: '#'}});

            expect(colorpicker.state('hex')).toBe('#');
            expect(colorpicker.state('h')).toBe(60);

            ReactTestUtils.Simulate.blur(hexInput);

            expect(colorpicker.state('hex')).toBe('#ffff00');

            ReactTestUtils.Simulate.change(hexInput, {target: {value: '#f00'}});
            ReactTestUtils.Simulate.blur(hexInput);

            expect(colorpicker.state('hex')).toBe('#ff0000');
            expect(colorpicker.state('h')).toBe(0);
            expect(colorpicker.state('r')).toBe(255);
            expect(colorpicker.state('g')).toBe(0);

            colorpicker.unmount();

            done();

        }, 1000);

    });

    it('submit', done => {

        const colorpicker = mount(
            <ColorPicker
                name="rgbStr"
                placeholder="请选择"
                value=""
                onChange={e => {
                    expect(e.value).toBe('rgba(255, 255, 255, 1)');
                }}
            />
        );

        let colorpickerLabel = colorpicker.find('.ui-color-picker-label').at(0);

        colorpickerLabel.simulate('click');

        // 这里先等展开的动画播完
        setTimeout(() => {

            let saturation = document.querySelector('.ui-color-picker-box');

            saturation.click();

            let submit = document.querySelector('.ui-color-picker-submit');

            submit.click();

            colorpicker.unmount();

            done();


        }, 1000);

    });

    it('receive new value will sync state', () => {

        const colorpicker = shallow(
            <ColorPicker
                name="rgbStr"
                placeholder="请选择"
                value="#f00"
                onChange={() => {}}
            />
        );

        colorpicker.setProps({value: ''});

        expect(colorpicker.state('h')).toBe(0);
        expect(colorpicker.state('hex')).toBe('#ff0000');

        colorpicker.setProps({value: '#ff0'});

        expect(colorpicker.state('h')).toBe(60);
        expect(colorpicker.state('hex')).toBe('#ffff00');

    });

    // describe('check the state of component ColorPicker', function () {


        //
        // it('the colorpicker hide', function () {
        //     let colorpickerLabel = colorpicker.find('.ui-color-picker-label').at(0);
        //     colorpickerLabel.simulate('click');
        //     colorpickerLabel.simulate('click');
        //     expect(colorpicker.state('open')).toBeFalsy();
        // });
        //
        // it('submit the input value, close the colorpicker', function () {
        //     colorpicker.setState({open: true});
        //     let colorpickerSubmit = colorpicker.find('.ui-color-picker-submit').at(0);
        //     colorpicker.setState({error: true});
        //     expect(colorpicker.state('open')).toBeTruthy();
        //     colorpicker.setState({error: false});
        //     colorpickerSubmit.simulate('click');
        //     expect(colorpicker.state('open')).toBeFalsy();
        //
        //
        // });
        //
        // it('click the box, and get the color value of the box', function () {
        //     colorpicker.setState({open: true});
        //     let colorpickerBox = colorpicker.find('.ui-color-picker-box').at(0);
        //     colorpickerBox.simulate('click');
        //     expect(colorpicker.state('color')).toBe('FF425E');
        //
        // });
        //
        // it('submit the unlegal color value', function () {
        //     colorpicker.setState({open: true});
        // });
        //
        // it('click the Hue area, you can get the basic color', function () {
        //     colorpicker.setState({open: true});
        //     let colorpickerHue = colorpicker.find('.ui-color-picker-hue').at(0);
        //     colorpickerHue.simulate('click');
        //     expect(colorpicker.state('color')).toMatch(/[0-9a-fA-F]/gi);
        // });
        //
        // it('click the Hue area, you can get the detail basic color', function () {
        //     colorpicker.setState({open: true});
        //     let colorpickerHue = colorpicker.find('.ui-color-picker-hue').at(0);
        //     colorpickerHue.simulate('click', {
        //         pageX: 10,
        //         pageY: 13
        //     });
        //     expect(colorpicker.state('color')).toBe('FF4000');
        //
        //     colorpickerHue.simulate('click', {
        //         pageX: 46,
        //         pageY: 13
        //     });
        //     expect(colorpicker.state('color')).toBe('D9FF00');
        //
        //     colorpickerHue.simulate('click', {
        //         pageX: 90,
        //         pageY: 13
        //     });
        //     expect(colorpicker.state('color')).toBe('00FF40');
        //
        //     colorpickerHue.simulate('click', {
        //         pageX: 150,
        //         pageY: 13
        //     });
        //     expect(colorpicker.state('color')).toBe('0040FF');
        //
        //     colorpickerHue.simulate('click', {
        //         pageX: 170,
        //         pageY: 13
        //     });
        //     expect(colorpicker.state('color')).toBe('4000FF');
        //
        //     colorpickerHue.simulate('click', {
        //         pageX: 222,
        //         pageY: 13
        //     });
        //     expect(colorpicker.state('color')).toBe('FF0073');
        //
        //     colorpickerHue.simulate('click', {
        //         pageX: 262,
        //         pageY: 13
        //     });
        //     expect(colorpicker.state('color')).toBe('FF0073');
        // });
        //
        // it('click on picker-saturation, the state color change', function () {
        //     colorpicker.setState({open: true});
        //     let colorpickerSat = colorpicker.find('.ui-color-picker-saturation').at(0);
        //     colorpickerSat.simulate('click', {
        //         pageX: 222,
        //         pageY: 53
        //     });
        //     expect(colorpicker.state('color')).toBe('A50C51');
        // });
        //
        // it('input the right rgb value', function () {
        //     colorpicker.setState({open: true});
        //     let colorpickerRgbStrInput = colorpicker.find('.ui-color-picker-rgbstr').get(0);
        //     let colorpickerRgbStr = colorpicker.find('.ui-color-picker-rgbstr').at(0);
        //     colorpickerRgbStrInput.value = 'aaaaaa';
        //     colorpickerRgbStr.simulate('change');
        //
        //     expect(colorpicker.state('color')).toBe('AAAAAA');
        // });
        //
        // it('input the illegal rgb value', function () {
        //     colorpicker.setState({open: true});
        //     let colorpickerRgbStrInput = colorpicker.find('.ui-color-picker-rgbstr').get(0);
        //     let colorpickerRgbStr = colorpicker.find('.ui-color-picker-rgbstr').at(0);
        //     colorpickerRgbStrInput.value = '12345678';
        //     colorpickerRgbStr.simulate('change');
        //
        //     expect(colorpicker.state('color')).toBe('AAAAAA');
        // });
        //
        // it('click other div', function () {
        //     let ev = new MouseEvent('click', {
        //         bubbles: true,
        //         cancelable: true,
        //         view: window,
        //         target: '<div>test</div>'
        //     });
        //     colorpicker.setState({open: true});
        //     colorpicker.instance().onClickAway(ev);
        //     expect(colorpicker.state('open')).toBeFalsy();
        // });

    // });

});
