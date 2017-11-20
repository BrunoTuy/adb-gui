let _html = '';
_html += '<button type="button" class="btn" onclick="btButton( \'KEYCODE_MEDIA_PREVIOUS\' )"><span class="glyphicon glyphicon-backward"></span></button>';
_html += '<button type="button" class="btn" onclick="btButton( \'KEYCODE_MEDIA_STOP\' )"><span class="glyphicon glyphicon-stop"></span></button>';
_html += '<button type="button" class="btn" onclick="btButton( \'KEYCODE_MEDIA_PLAY\' )"><span class="glyphicon glyphicon-play"></span></button>';
_html += '<button type="button" class="btn" onclick="btButton( \'KEYCODE_MEDIA_PAUSE\' )"><span class="glyphicon glyphicon-pause"></span></button>';
_html += '<button type="button" class="btn" onclick="btButton( \'KEYCODE_MEDIA_STEP_FORWARD\' )"><span class="glyphicon glyphicon-forward"></span></button>';

const _button = ( cod ) => shellCmd( 'input keyevent '+cod );

module.exports = {
	name: 'Multimidia Buttons',
	html: _html,
	button: _button
};
