# melon-colorpicker

[![Build Status](https://travis-ci.org/react-melon/melon-colorpicker.svg?branch=master)](https://travis-ci.org/react-melon/melon-colorpicker)
[![Coverage Status](https://coveralls.io/repos/github/react-melon/melon-colorpicker/badge.svg?branch=master)](https://coveralls.io/github/react-melon/melon-colorpicker?branch=master)

## Usage

```js
import React from 'react';
import ColorPicker from 'melon-colorpicker';
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
```

## Setup

### webpack

1. please check out [this](https://github.com/react-melon/melon#如何在-webpack-中使用-melon) first.

2. `npm install -S melon-colorpicker`

### bower

1. `bower install -S melon-colorpicker`
2. config your `requirejs` / `esl`

    ```js
    require.config({
        paths: {
            'melon-colorpicker': 'bower_components/melon-colorpicker/lib/index'
        }
    });
    ```

## API Document

check [this](https://doc.esdoc.org/github.com/react-melon/melon-colorpicker/) out


## Run the example

```
git clone https://github.com/react-melon/melon-colorpicker.git
cd melon-colorpicker
npm install
npm start
open http://localhost:8080/example
```
