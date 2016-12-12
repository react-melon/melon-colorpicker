/**
 * @file util 测试
 * @author leon <ludafa@outlook.com>
  * @author jingyuanZhang<zhangjingyuan1108@outlook.com>
 */

import TestUtils, {createRenderer} from 'react-addons-test-utils';
import {shallow, mount} from 'enzyme';
import React from 'react';

import ColorPicker from '../../src/index';

describe('colorpicker functions test', function () {
    const colorpicker = mount(<ColorPicker
        name = "rgbStr"
        placeholder = "请选择"
        value = "" />
    );
    it('isRawInputError can judge the input currectly', function () {
        expect(colorpicker.instance().isRawInputError('123123')).toBeFalsy();
        expect(colorpicker.instance().isRawInputError('aaa')).toBeFalsy();
        expect(colorpicker.instance().isRawInputError('1234')).toBeTruthy();
        expect(colorpicker.instance().isRawInputError('vv123')).toBeTruthy();
        expect(colorpicker.instance().isRawInputError('')).toBeFalsy();
    });

    describe('check the state open of component ColorPicker', function () {
        const colorpicker = mount(<ColorPicker
            name = "rgbStr"
            placeholder = "请选择"
            value = "" />
        );
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
            colorpickerSubmit.simulate('click');
            expect(colorpicker.state('open')).toBeFalsy();
        });

        it('click the box, and get the color value of the box', function () {
            colorpicker.setState({open: true});
            let colorpickerBox = colorpicker.find('.ui-color-picker-box').at(0);
            colorpickerBox.simulate('click');
            expect(colorpicker.state('color')).toBe('FF425E');

        });

        // it('submit the unlegal color value', function () {
        //     colorpicker.setState({open: true});
        // });
        it('click the Hue area, you can get the basic color', function () {
            colorpicker.setState({open: true});
            let colorpickerHue = colorpicker.find('.ui-color-picker-hue').at(0);
            colorpickerHue.simulate('click');
            expect(colorpicker.state('color')).toMatch(/[0-9a-fA-F]/gi);
        });

        // it('click the Hue area, you can get the detail basic color', function () {
        //     colorpicker.setState({open: true});
        //     let event = new MouseEvent('click', {
        //         'view': window,
        //         'clientX': 120,
        //         'clientY': 233
        //     });
        //     let colorpickerHue = colorpicker.find('.ui-color-picker-hue').at(0);
        //     colorpickerHue.simulate('click', event);
        //     expect(colorpicker.state('color')).toBe('E6FF00');
        // });
    });

});
