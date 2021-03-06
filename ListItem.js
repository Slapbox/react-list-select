import React from 'react';
import cx from 'classnames';

let ListItem = React.createClass({
	displayName: 'ListItem',

	getDefaultProps() {
		return {
			disabled: false,
			selected: false,
			focused: false
		};
	},
	render() {
		let classes = cx('react-list-select--item', {
			'is-disabled': this.props.disabled,
			'is-selected': this.props.selected,
			'is-focused': this.props.focused
		});

		return React.createElement(
			'li',
			{ className: classes,
				onMouseOver: () => this.props.onMouseOver(this.props.index),
				onClick: event => this.props.onChange({ event, index: this.props.index }) },
			this.props.children
		);
	}
});

export default ListItem;