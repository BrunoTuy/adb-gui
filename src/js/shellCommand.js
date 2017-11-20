let _html = '';
	_html += '<div class="row">';
	_html += '	<input type="text">';
	_html += '</div>';
	_html += '<div class="row" style="margin-top: 5px; margin-bottom: 5px; ">';
	_html += '	<button type="button" class="btn btn-sm btn-basic" onclick="shellCommand.button(this)"><span class="glyphicon glyphicon-expand"></span> Execute</button>';
	_html += '</div>';


const _button = obj => {
	if ( obj.nodeName != 'BUTTON' || obj.parentNode.nodeName != 'DIV' )
		return;

	const divComponent = obj.parentNode.parentNode;

	for ( let x = 0; x < divComponent.childNodes.length; x++ )
		if ( divComponent.childNodes.item(x).nodeName == 'DIV' )
			for ( let w = 0; w < divComponent.childNodes.item(x).childNodes.length; w++ )
				if ( divComponent.childNodes.item(x).childNodes.item(w).nodeName == 'INPUT' )
					shellCmd( divComponent.childNodes.item(x).childNodes.item(w).value, alert );
};

module.exports = {
	name: 'Shell Command',
	html: _html,
	button: _button
};
