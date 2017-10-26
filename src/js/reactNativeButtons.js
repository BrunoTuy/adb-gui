let _html = '';
	_html += '<button type="button" class="btn btn-primary" onclick="reactNativeButtons.button( \'46 46\' )"><span class="glyphicon glyphicon-repeat"></span> Reload</button>';
	_html += '<button type="button" class="btn btn-primary" onclick="reactNativeButtons.button( 82 )"><span class="glyphicon glyphicon-cog"></span> Dev Menu</button>';

const _button = ( cod ) => shellCmd( 'input keyevent '+cod );

module.exports = {
	name: 'ReactNative Buttons',
	html: _html,
	button: _button
};
