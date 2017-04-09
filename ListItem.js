'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let ListItem = _react2.default.createClass({
	displayName: 'ListItem',

	getDefaultProps() {
		return {
			disabled: false,
			selected: false,
			focused: false
		};
	},
	render() {
		let classes = (0, _classnames2.default)('react-list-select--item', {
			'is-disabled': this.props.disabled,
			'is-selected': this.props.selected,
			'is-focused': this.props.focused
		});

		return _react2.default.createElement(
			'li',
			{ className: classes,
				onMouseOver: () => this.props.onMouseOver(this.props.index),
				onClick: event => this.props.onChange({ event, index: this.props.index }) },
			this.props.children
		);
	}
});

const _default = ListItem;
exports.default = _default;
;

var _temp = function () {
	if (typeof __REACT_HOT_LOADER__ === 'undefined') {
		return;
	}

	__REACT_HOT_LOADER__.register(ListItem, 'ListItem', './ListItem.es6');

	__REACT_HOT_LOADER__.register(_default, 'default', './ListItem.es6');
}();

;
module.exports = exports['default'];