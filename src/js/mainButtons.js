let _html = '';
	_html += '<button type="button" class="btn" onclick="mainButtons.button( 4 )"><span class="glyphicon glyphicon-triangle-left"></span></button>';
	_html += '<button type="button" class="btn" onclick="mainButtons.button( 3 )"><span class="glyphicon glyphicon-home"></span></button>';
	_html += '<button type="button" class="btn" onclick="mainButtons.button( \'KEYCODE_APP_SWITCH\' )"><span class="glyphicon glyphicon-unchecked"></span></button>';
	_html += '<button type="button" class="btn" onclick="mainButtons.button( 82 )"><span class="glyphicon glyphicon-cog"></span></button>';
	_html += '<button type="button" class="btn" onclick="mainButtons.button( 26 )"><span class="glyphicon glyphicon-off"></span></button>';

const _button = cod => shellCmd( 'input keyevent '+cod );

module.exports = {
	name: 'Main Buttons',
	html: _html,
	button: _button
};
