let _html = '';
	_html += '<div class="row">';
	_html += '	<input type="text">';
	_html += '	<button type="button" class="btn btn-sm btn-basic" onclick="openURL.button(this)"><span class="glyphicon glyphicon-link"></span> Send</button>';
	_html += '</div>';


const _button = obj => {
	if ( obj.nodeName != 'BUTTON' || obj.parentNode.nodeName != 'DIV' )
		return;

	for ( let x = 0; x < obj.parentNode.childNodes.length; x++ )
		if ( obj.parentNode.childNodes.item(x).nodeName == 'INPUT' )
			shellCmd( 'am start -W -a android.intent.action.VIEW -d "'+obj.parentNode.childNodes.item(x).value+'"' );
};

module.exports = {
	name: 'Open URL',
	html: _html,
	button: _button
};
