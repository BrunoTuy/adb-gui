let _html = '';
	_html += '<div class="row">';
	_html += '	<button type="button" style="width: 80%" class="btn btn-primary" onclick="controlPackages.update(this)"><span class="glyphicon glyphicon-refresh"></span> Update list</button>';
	_html += '</div>';
	_html += '<input type="text">';
	_html += '<button type="button" class="btn btn-primary" onclick="controlPackages.close(this)"><span class="glyphicon glyphicon-remove"></span> Close</button>';

const _close = obj => {
	if ( obj.nodeName != 'BUTTON' || obj.parentNode.nodeName != 'DIV' )
		return;

	for ( let x = 0; x < obj.parentNode.childNodes.length; x++ )
		if ( obj.parentNode.childNodes.item(x).nodeName == 'INPUT' )
			shellCmd( 'am force-stop '+obj.parentNode.childNodes.item(x).value );
}

module.exports = {
	name: 'Control packages',
	html: _html,
	close: _close,
	update: () => alert( 'Not ok' )
};
