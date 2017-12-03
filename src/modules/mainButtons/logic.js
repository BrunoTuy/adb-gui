const _button = cod => shellCmd( 'input keyevent '+cod );

module.exports = {
	name: 'Main Buttons',
	button: _button
};
