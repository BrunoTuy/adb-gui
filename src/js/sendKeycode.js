const keys = [
	{ id: 1, name: "MENU" },
	{ id: 2, name: "SOFT_RIGHT" },
	{ id: 3, name: "HOME" },
	{ id: 4, name: "BACK" },
	{ id: 5, name: "CALL" },
	{ id: 6, name: "ENDCALL" },
	{ id: 7, name: "0" },
	{ id: 8, name: "1" },
	{ id: 9, name: "2" },
	{ id: 10, name: "3" },
	{ id: 11, name: "4" },
	{ id: 12, name: "5" },
	{ id: 13, name: "6" },
	{ id: 14, name: "7" },
	{ id: 15, name: "8" },
	{ id: 16, name: "9" },
	{ id: 17, name: "STAR" },
	{ id: 18, name: "POUND" },
	{ id: 19, name: "DPAD_UP" },
	{ id: 20, name: "DPAD_DOWN" },
	{ id: 21, name: "DPAD_LEFT" },
	{ id: 22, name: "DPAD_RIGHT" },
	{ id: 23, name: "DPAD_CENTER" },
	{ id: 24, name: "VOLUME_UP" },
	{ id: 25, name: "VOLUME_DOWN" },
	{ id: 26, name: "POWER" },
	{ id: 27, name: "CAMERA" },
	{ id: 28, name: "CLEAR" },
	{ id: 29, name: "A" },
	{ id: 30, name: "B" },
	{ id: 31, name: "C" },
	{ id: 32, name: "D" },
	{ id: 33, name: "E" },
	{ id: 34, name: "F" },
	{ id: 35, name: "G" },
	{ id: 36, name: "H" },
	{ id: 37, name: "I" },
	{ id: 38, name: "J" },
	{ id: 39, name: "K" },
	{ id: 40, name: "L" },
	{ id: 41, name: "M" },
	{ id: 42, name: "N" },
	{ id: 43, name: "O" },
	{ id: 44, name: "P" },
	{ id: 45, name: "Q" },
	{ id: 46, name: "R" },
	{ id: 47, name: "S" },
	{ id: 48, name: "T" },
	{ id: 49, name: "U" },
	{ id: 50, name: "V" },
	{ id: 51, name: "W" },
	{ id: 52, name: "X" },
	{ id: 53, name: "Y" },
	{ id: 54, name: "Z" },
	{ id: 55, name: "COMMA" },
	{ id: 56, name: "PERIOD" },
	{ id: 57, name: "ALT_LEFT" },
	{ id: 58, name: "ALT_RIGHT" },
	{ id: 59, name: "SHIFT_LEFT" },
	{ id: 60, name: "SHIFT_RIGHT" },
	{ id: 61, name: "TAB" },
	{ id: 62, name: "SPACE" },
	{ id: 63, name: "SYM" },
	{ id: 64, name: "EXPLORER" },
	{ id: 65, name: "ENVELOPE" },
	{ id: 66, name: "ENTER" },
	{ id: 67, name: "DEL" },
	{ id: 68, name: "GRAVE" },
	{ id: 69, name: "MINUS" },
	{ id: 70, name: "EQUALS" },
	{ id: 71, name: "LEFT_BRACKET" },
	{ id: 72, name: "RIGHT_BRACKET" },
	{ id: 73, name: "BACKSLASH" },
	{ id: 74, name: "SEMICOLON" },
	{ id: 75, name: "APOSTROPHE" },
	{ id: 76, name: "SLASH" },
	{ id: 77, name: "AT" },
	{ id: 78, name: "NUM" },
	{ id: 79, name: "HEADSETHOOK" },
	{ id: 80, name: "FOCUS" },
	{ id: 81, name: "PLUS" },
	{ id: 82, name: "MENU" },
	{ id: 83, name: "NOTIFICATION" },
	{ id: 84, name: "SEARCH" },
	{ id: 85, name: "TAG_LAST_KEY" }];

let _html = '';
	_html += '<div class="row">';
	_html += '	<select>';

	for ( let x = 0; x < keys.length; x++ )
		_html += '<option value="'+keys[x].id+'">'+keys[x].name+'</option>';

	_html += '	</select>';
	_html += '	<button type="button" class="btn btn-primary" onclick="sendKeycode.button(this)"><span class="glyphicon glyphicon-th"></span> Send</button>';
	_html += '</div>';

const _button = obj => {
	if ( obj.nodeName != 'BUTTON' || obj.parentNode.nodeName != 'DIV' )
		return;

	for ( let x = 0; x < obj.parentNode.childNodes.length; x++ )
		if ( obj.parentNode.childNodes.item(x).nodeName == 'SELECT' )
			shellCmd( 'input keyevent '+obj.parentNode.childNodes.item(x).value );
};

module.exports = {
	name: 'Send Keycode',
	html: _html,
	button: _button
};
