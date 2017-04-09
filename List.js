'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.MakeList = undefined;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _map = require('lodash/collection/map');

var _map2 = _interopRequireDefault(_map);

var _includes = require('lodash/collection/includes');

var _includes2 = _interopRequireDefault(_includes);

var _isNumber = require('lodash/lang/isNumber');

var _isNumber2 = _interopRequireDefault(_isNumber);

var _min = require('lodash/collection/min');

var _min2 = _interopRequireDefault(_min);

var _max = require('lodash/collection/max');

var _max2 = _interopRequireDefault(_max);

var _range = require('lodash/utility/range');

var _range2 = _interopRequireDefault(_range);

var _remove = require('lodash/array/remove');

var _remove2 = _interopRequireDefault(_remove);

var _reject = require('lodash/collection/reject');

var _reject2 = _interopRequireDefault(_reject);

var _uniq = require('lodash/array/uniq');

var _uniq2 = _interopRequireDefault(_uniq);

var _keys = require('./keys');

var _ListItem = require('./ListItem');

var _ListItem2 = _interopRequireDefault(_ListItem);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let MakeList = ({ keyboardEvents = true } = {}) => {

	let List = _react2.default.createClass({
		displayName: 'List',

		getDefaultProps() {
			return {
				items: [],
				selected: [],
				disabled: [],
				multiple: false,
				onChange: () => {}
			};
		},

		getInitialState() {
			return {
				items: this.props.items,
				selectedItems: this.props.selected,
				disabledItems: this.props.disabled,
				focusedIndex: null,
				lastSelected: null
			};
		},

		componentWillReceiveProps(nextProps) {
			this.setState({
				items: nextProps.items,
				selectedItems: nextProps.selected,
				disabledItems: nextProps.disabled
			});
		},

		clear() {
			this.setState({
				selected: [],
				disabled: [],
				focusedIndex: null,
				lastSelected: null
			});
		},

		select({ index = null, contiguous = false } = {}) {
			if ((0, _includes2.default)(this.state.disabledItems, index)) return;

			let multiple = this.props.multiple;
			let lastSelected = this.state.lastSelected;

			let selectedItems = multiple ? this.state.selectedItems.concat(index) : [index];

			if (contiguous && multiple && (0, _isNumber2.default)(lastSelected)) {
				let start = (0, _min2.default)([lastSelected, index]);
				let end = (0, _max2.default)([lastSelected, index]);

				selectedItems = (0, _uniq2.default)(selectedItems.concat((0, _range2.default)(start, end + 1)));
			}

			this.setState({ selectedItems, lastSelected: index });

			this.props.onChange(multiple ? selectedItems : index);
		},

		deselect({ index = null, contiguous = false } = {}) {
			let multiple = this.props.multiple;
			var _state = this.state;
			let selectedItems = _state.selectedItems,
			    lastSelected = _state.lastSelected;


			if (contiguous && multiple && (0, _isNumber2.default)(lastSelected)) {
				let start = (0, _min2.default)([lastSelected, index]);
				let end = (0, _max2.default)([lastSelected, index]);

				let toDeselect = (0, _range2.default)(start, end + 1);
				selectedItems = (0, _reject2.default)(selectedItems, idx => (0, _includes2.default)(toDeselect, idx));
			} else {
				selectedItems = (0, _reject2.default)(selectedItems, idx => idx === index);
			}

			this.setState({ selectedItems, lastSelected: index });
			this.props.onChange(this.props.multiple ? selectedItems : null);
		},

		enable(index) {
			let disabledItems = this.state.disabledItems;

			let indexOf = disabledItems.indexOf(index);

			disabledItems.splice(indexOf, 1);

			this.setState({ disabledItems });
		},

		disable(index) {
			this.setState({ disabledItems: this.state.disabledItems.concat(index) });
		},

		focusItem({ next = false, previous = false, index = null } = {}) {
			var _state2 = this.state;
			let focusedIndex = _state2.focusedIndex,
			    disabledItems = _state2.disabledItems;

			let lastItem = this.state.items.length - 1;

			if (next) {
				if (focusedIndex == null) {
					focusedIndex = 0;
				} else {
					// focus first item if reached last item in the list
					focusedIndex = focusedIndex >= lastItem ? 0 : focusedIndex + 1;
				}

				// skip disabled items
				if (disabledItems.length) {
					while ((0, _includes2.default)(disabledItems, focusedIndex)) {
						focusedIndex = focusedIndex >= lastItem ? 0 : focusedIndex + 1;
					}
				}
			} else if (previous) {
				if (focusedIndex == null) {
					focusedIndex = lastItem;
				} else {
					// focus last item if reached the top of the list
					focusedIndex = focusedIndex <= 0 ? lastItem : focusedIndex - 1;
				}

				// skip disabled items
				if (disabledItems.length) {
					while ((0, _includes2.default)(disabledItems, focusedIndex)) {
						focusedIndex = focusedIndex <= 0 ? lastItem : focusedIndex - 1;
					}
				}
			} else if (!(0, _includes2.default)(disabledItems, index) && (0, _isNumber2.default)(index)) {
				focusedIndex = index;
			}

			this.setState({ focusedIndex });
		},

		onKeyDown(event) {
			let key = event.keyCode;

			if (key == _keys.KEY.UP || key == _keys.KEY.K) {
				this.focusItem({ previous: true });
			} else if (key == _keys.KEY.DOWN || key == _keys.KEY.J) {
				this.focusItem({ next: true });
			} else if (key == _keys.KEY.SPACE || key == _keys.KEY.ENTER) {
				this.toggleSelect({ event, index: this.state.focusedIndex });
			}

			// prevent default behavior, in some situations pressing the key
			// up / down would scroll the browser window
			if ((0, _includes2.default)(_keys.KEYS, key)) {
				event.preventDefault();
			}
		},

		toggleSelect({ event, index } = {}) {
			event.preventDefault();
			let shift = event.shiftKey;

			if (!(0, _includes2.default)(this.state.selectedItems, index)) {
				this.select({ index, contiguous: shift });
			} else if (this.props.multiple) {
				this.deselect({ index, contiguous: shift });
			}
		},

		render() {
			let items = (0, _map2.default)(this.props.items, (itemContent, index) => {
				let disabled = (0, _includes2.default)(this.state.disabledItems, index);
				let selected = (0, _includes2.default)(this.state.selectedItems, index);
				let focused = this.state.focusedIndex === index;

				return _react2.default.createElement(
					_ListItem2.default,
					{ key: index,
						index: index,
						disabled: disabled,
						selected: selected,
						focused: focused,
						onMouseOver: index => this.focusItem({ index }),
						onChange: this.toggleSelect },
					itemContent
				);
			});

			return _react2.default.createElement(
				'ul',
				{ className: (0, _classnames2.default)('react-list-select', this.props.className),
					tabIndex: 0,
					onKeyDown: keyboardEvents && this.onKeyDown },
				items
			);
		}
	});
	return List;
}; // Thanks to https://gist.github.com/DelvarWorld/3784055
// for the inspiration for the shift-selection

const _default = MakeList();

exports.default = _default;
exports.MakeList = MakeList;
;

var _temp = function () {
	if (typeof __REACT_HOT_LOADER__ === 'undefined') {
		return;
	}

	__REACT_HOT_LOADER__.register(MakeList, 'MakeList', './List.es6');

	__REACT_HOT_LOADER__.register(_default, 'default', './List.es6');
}();

;