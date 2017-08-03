/**
 * @file DragPanel
 * @author leon <ludafa@outlook.com>
 */

/* eslint-disable fecs-min-vars-per-destructure */

import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';

export default class DragPanel extends PureComponent {

    constructor(...args) {
        super(...args);
        this.onMouseDown = this.onMouseDown.bind(this);
        this.onMouseMove = this.onMouseMove.bind(this);
        this.onMouseUp = this.onMouseUp.bind(this);
        this.onClick = this.onClick.bind(this);
    }

    static propTypes = {
        onPositionChange: PropTypes.func.isRequired
    };

    onMouseDown(e) {
        document.body.style.userSelect = 'none';
        this.position = this.main.getBoundingClientRect();
        window.addEventListener('mouseup', this.onMouseUp);
        window.addEventListener('mousemove', this.onMouseMove);
    }

    onMouseMove(e) {
        this.onPositionChange(e);
    }

    onMouseUp(e) {
        document.body.style.userSelect = '';
        this.onPositionChange(e);
        window.removeEventListener('mouseup', this.onMouseUp);
        window.removeEventListener('mousemove', this.onMouseMove);
    }

    onPositionChange(e) {
        let {pageX, pageY} = e;
        let {left, top, width, height} = this.position;

        let x = pageX - left;
        let y = pageY - top;

        if (x < 0) {
            x = 0;
        }
        else if (x > width) {
            x = width;
        }

        if (y < 0) {
            y = 0;
        }
        else if (y > height) {
            y = height;
        }

        this.props.onPositionChange({
            x: x / width,
            y: y / height
        });
    }

    onClick(e) {
        this.position = this.main.getBoundingClientRect();
        this.onPositionChange(e);
    }

    render() {

        /* eslint-disable no-unused-vars */
        let {children, onPositionChange, ...rest} = this.props;
        /* eslint-enalbe no-unused-vars */

        return (
            <div
                {...rest}
                ref={main => (this.main = main)}
                onMouseDown={this.onMouseDown}
                onClick={this.onClick}>
                {children}
            </div>
        );
    }

}
