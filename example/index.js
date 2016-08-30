/**
 * @file example
 * @author leon <ludafa@outlook.com>
 */

import React from 'react';
import ColorPicker from '../src/index.js';
import ReactDOM from 'react-dom';

import './index.styl';

ReactDOM.render(
    <ColorPicker
        open={open}
        top={0}
        left={0}
        name = "rgbStr"
        placeholder = "请选择" />,
    document.getElementById('app')
);
