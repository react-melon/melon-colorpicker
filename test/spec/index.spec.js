/**
 * @file ColorPicker 测试
 * @author leon <ludafa@outlook.com>
 * @author jingyuanZhang<zhangjingyuan1108@outlook.com>
 */

import {mount} from 'enzyme';
import React from 'react';
import ColorPicker from '../../src/index';

describe('colorpicker functions test', function () {
    const colorpicker = mount(
        <ColorPicker
            name="rgbStr"
            placeholder="请选择"
            defaultValue="" />
    );

    it('isRawInputError can judge the input currectly', function () {
        expect(colorpicker.instance().isRawInputError('123123')).toBeFalsy();
        expect(colorpicker.instance().isRawInputError('aaa')).toBeFalsy();
        expect(colorpicker.instance().isRawInputError('1234')).toBeTruthy();
        expect(colorpicker.instance().isRawInputError('vv123')).toBeTruthy();
        expect(colorpicker.instance().isRawInputError('')).toBeFalsy();
    });

    describe('check the state of component ColorPicker', function () {

        beforeEach(function () {
            colorpicker.setState({open: false});
        });
        it('Open colorpicker, and click on picker-saturation, the state open can not change', function () {

            colorpicker.setState({open: true});
            let colorpickerSat = colorpicker.find('.ui-color-picker-saturation').at(0);
            colorpickerSat.simulate('click');
            expect(colorpicker.state('open')).toBeTruthy();
        });

        it('the colorpicker open', function () {
            let colorpickerLabel = colorpicker.find('.ui-color-picker-label').at(0);
            colorpickerLabel.simulate('click');
            expect(colorpicker.state('open')).toBeTruthy();
        });

        it('the colorpicker hide', function () {
            let colorpickerLabel = colorpicker.find('.ui-color-picker-label').at(0);
            colorpickerLabel.simulate('click');
            colorpickerLabel.simulate('click');
            expect(colorpicker.state('open')).toBeFalsy();
        });

        it('submit the input value, close the colorpicker', function () {
            colorpicker.setState({open: true});
            let colorpickerSubmit = colorpicker.find('.ui-color-picker-submit').at(0);
            colorpicker.setState({error: true});
            expect(colorpicker.state('open')).toBeTruthy();
            colorpicker.setState({error: false});
            colorpickerSubmit.simulate('click');
            expect(colorpicker.state('open')).toBeFalsy();


        });

        it('click the box, and get the color value of the box', function () {
            colorpicker.setState({open: true});
            let colorpickerBox = colorpicker.find('.ui-color-picker-box').at(0);
            colorpickerBox.simulate('click');
            expect(colorpicker.state('color')).toBe('FF425E');

        });

        it('submit the unlegal color value', function () {
            colorpicker.setState({open: true});
        });

        it('click the Hue area, you can get the basic color', function () {
            colorpicker.setState({open: true});
            let colorpickerHue = colorpicker.find('.ui-color-picker-hue').at(0);
            colorpickerHue.simulate('click');
            expect(colorpicker.state('color')).toMatch(/[0-9a-fA-F]/gi);
        });

        it('click the Hue area, you can get the detail basic color', function () {
            colorpicker.setState({open: true});
            let colorpickerHue = colorpicker.find('.ui-color-picker-hue').at(0);
            colorpickerHue.simulate('click', {
                pageX: 10,
                pageY: 13
            });
            expect(colorpicker.state('color')).toBe('FF4000');

            colorpickerHue.simulate('click', {
                pageX: 46,
                pageY: 13
            });
            expect(colorpicker.state('color')).toBe('D9FF00');

            colorpickerHue.simulate('click', {
                pageX: 90,
                pageY: 13
            });
            expect(colorpicker.state('color')).toBe('00FF40');

            colorpickerHue.simulate('click', {
                pageX: 150,
                pageY: 13
            });
            expect(colorpicker.state('color')).toBe('0040FF');

            colorpickerHue.simulate('click', {
                pageX: 170,
                pageY: 13
            });
            expect(colorpicker.state('color')).toBe('4000FF');

            colorpickerHue.simulate('click', {
                pageX: 222,
                pageY: 13
            });
            expect(colorpicker.state('color')).toBe('FF0073');

            colorpickerHue.simulate('click', {
                pageX: 262,
                pageY: 13
            });
            expect(colorpicker.state('color')).toBe('FF0073');
        });

        it('click on picker-saturation, the state color change', function () {
            colorpicker.setState({open: true});
            let colorpickerSat = colorpicker.find('.ui-color-picker-saturation').at(0);
            colorpickerSat.simulate('click', {
                pageX: 222,
                pageY: 53
            });
            expect(colorpicker.state('color')).toBe('A50C51');
        });

        it('input the right rgb value', function () {
            colorpicker.setState({open: true});
            let colorpickerRgbStrInput = colorpicker.find('.ui-color-picker-rgbstr').get(0);
            let colorpickerRgbStr = colorpicker.find('.ui-color-picker-rgbstr').at(0);
            colorpickerRgbStrInput.value = 'aaaaaa';
            colorpickerRgbStr.simulate('change');

            expect(colorpicker.state('color')).toBe('AAAAAA');
        });

        it('input the illegal rgb value', function () {
            colorpicker.setState({open: true});
            let colorpickerRgbStrInput = colorpicker.find('.ui-color-picker-rgbstr').get(0);
            let colorpickerRgbStr = colorpicker.find('.ui-color-picker-rgbstr').at(0);
            colorpickerRgbStrInput.value = '12345678';
            colorpickerRgbStr.simulate('change');

            expect(colorpicker.state('color')).toBe('AAAAAA');
        });

        it('click other div', function () {
            let ev = new MouseEvent('click', {
                bubbles: true,
                cancelable: true,
                view: window,
                target: '<div>test</div>'
            });
            colorpicker.setState({open: true});
            colorpicker.instance().onClickAway(ev);
            expect(colorpicker.state('open')).toBeFalsy();
        });

    });

});
