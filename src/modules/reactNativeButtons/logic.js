const _button = ( cod ) => shellCmd( 'input keyevent '+cod );

module.exports = {
	name: 'ReactNative Buttons',
	button: _button
};
