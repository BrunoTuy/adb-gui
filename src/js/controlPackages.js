let _html = '';
	_html += '<select class="selectListDevices"><option value="none">Escolha um dispositivo</option></select>';
	_html += '<div class="row">';
	_html += '	<button type="button" style="width: 80%" class="btn btn-primary" onclick="controlPackages.update(this)"><span class="glyphicon glyphicon-refresh"></span> Update list</button>';
	_html += '</div>';
	_html += '<select class="listPackages"><option>Necessário atualizar.</option></select>';
	_html += '<button type="button" class="btn btn-primary" onclick="controlPackages.start(this)"><span class="glyphicon glyphicon-expand"></span> Start</button>';
	_html += '<button type="button" class="btn btn-primary" onclick="controlPackages.close(this)"><span class="glyphicon glyphicon-remove"></span> Close</button>';

const _getDevice = obj => {
	let device = null;

	for ( let x = 0; x < obj.childNodes.length; x++ ){
		const child = obj.childNodes.item(x);

		if ( child.nodeName == 'SELECT' && child.getAttribute( "class" ) == "selectListDevices" )
			device = child.value == 'none' ? null : child.value;
	}

	if ( !device )
		alert( 'Escolha um dispositivo.' );

	return device;
};

const _update = obj => {
	if ( obj.nodeName != 'BUTTON' || obj.parentNode.nodeName != 'DIV' || obj.parentNode.parentNode.nodeName != 'DIV' )
		return;

	const device = _getDevice( obj.parentNode.parentNode );

	if ( !device )
		return;

	shellCmd({
		device: device,
		command: 'pm list packages'
	}, resp => {
		const list = resp.split( '\n' ).sort();
		const divChilds = obj.parentNode.parentNode.childNodes;

		for ( let x = 0; x < divChilds.length; x++ )
			if ( divChilds.item(x).nodeName == 'SELECT' && divChilds.item(x).getAttribute( "class" ) == "listPackages" ){
				divChilds.item(x).innerHTML = '';

				list.map( pkg => {
					let option = document.createElement( 'option' );

					option.innerHTML = pkg.substr( 8, pkg.length );

					divChilds.item(x).appendChild( option );
				});
			}
	});
};

const _start = obj => {
	if ( obj.nodeName != 'BUTTON' || obj.parentNode.nodeName != 'DIV' )
		return;

	const device = _getDevice( obj.parentNode );

	if ( !device )
		return;

	for ( let x = 0; x < obj.parentNode.childNodes.length; x++ )
		if ( obj.parentNode.childNodes.item(x).nodeName == 'SELECT' )
			shellCmd({
				device: device,
				command: 'monkey -p '+obj.parentNode.childNodes.item(x).value+' -c android.intent.category.LAUNCHER 1'
			});
};

const _close = obj => {
	if ( obj.nodeName != 'BUTTON' || obj.parentNode.nodeName != 'DIV' )
		return;

	const device = _getDevice( obj.parentNode );

	if ( !device )
		return;
	
	for ( let x = 0; x < obj.parentNode.childNodes.length; x++ )
		if ( obj.parentNode.childNodes.item(x).nodeName == 'SELECT' )
			shellCmd({
				device: device,
				command: 'am force-stop '+obj.parentNode.childNodes.item(x).value
			});
};

const _onLoad = () => {
	_buscarDispositivos();
}

module.exports = {
	name: 'Control packages',
	html: _html,
	start: _start,
	close: _close,
	update: _update,
	onLoad: _onLoad
};
