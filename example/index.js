/**
 * @file example
 * @author leon <ludafa@outlook.com>
 */

import React, {Component} from 'react';
import ColorPicker from '../src/index.js';
import ReactDOM from 'react-dom';

import './index.styl';

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            color: ''
        };
    }

    render() {

        const color = this.state.color;

        return (
            <main>
                <h3>ColorPicker</h3>
                <div style={{display: 'flex', alignItems: 'center', marginTop: '1rem'}}>
                    <label style={{marginRight: '1rem'}}>default: </label>
                    <ColorPicker
                        name = "rgbStr"
                        placeholder = "请选择"
                        value={color}
                        onChange={e => {
                            this.setState({color: e.value});
                        }} />
                </div>
                <div style={{display: 'flex', alignItems: 'center', marginTop: '1rem'}}>
                    <label style={{marginRight: '1rem'}}>fluid: </label>
                    <ColorPicker
                        name = "rgbStr"
                        placeholder = "请选择"
                        value={color}
                        variants={['fluid']}
                        size="xxs"
                        onChange={e => {
                            this.setState({color: e.value});
                        }} />
                </div>
            </main>
        );

    }

}

ReactDOM.render(
    <App />,
    document.getElementById('app')
);
