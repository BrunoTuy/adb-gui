let _html = '';
	_html += '<select class="selectListDevices"><option value="none">Escolha um dispositivo</option></select>';
	_html += '<div class="row" style="margin-top: 5px; margin-bottom: 5px; ">';
	_html += '	<button type="button" style="width: 80%" class="btn btn-xs btn-default" onclick="controlPackages.update(this)"><span class="glyphicon glyphicon-refresh"></span> Update package list</button>';
	_html += '</div>';
	_html += '<select class="listPackages"><option>Necessário atualizar.</option></select>';
	_html += '<div class="row" style="margin-top: 5px; margin-bottom: 5px; ">';
	_html += ' <button type="button" class="btn btn-sm btn-basic" onclick="controlPackages.start(this)"><span class="glyphicon glyphicon-expand"></span> Start</button>';
	_html += ' <button type="button" class="btn btn-sm btn-basic" onclick="controlPackages.close(this)"><span class="glyphicon glyphicon-remove"></span> Close</button>';
	_html += ' <button type="button" class="btn btn-sm btn-basic" onclick="controlPackages.uninstallPkg(this)"><span class="glyphicon glyphicon-minus"></span> Uninstall</button>';
	_html += '</div>';

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

	const divComponent = obj.parentNode.parentNode;
	const device = _getDevice( divComponent );

	if ( !device )
		return;

	shellCmd({
		device: device,
		command: 'pm list packages'
	}, resp => {
		const list = resp.split( '\n' ).sort();
		const divChilds = divComponent.childNodes;

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

	const divComponent = obj.parentNode.parentNode;
	const device = _getDevice( divComponent );

	if ( !device )
		return;

	for ( let x = 0; x < divComponent.childNodes.length; x++ )
		if ( divComponent.childNodes.item(x).nodeName == 'SELECT' )
			shellCmd({
				device: device,
				command: 'monkey -p '+divComponent.childNodes.item(x).value+' -c android.intent.category.LAUNCHER 1'
			});
};

const _close = obj => {
	if ( obj.nodeName != 'BUTTON' || obj.parentNode.nodeName != 'DIV' )
		return;

	const divComponent = obj.parentNode.parentNode;
	const device = _getDevice( divComponent );

	if ( !device )
		return;
	
	for ( let x = 0; x < divComponent.childNodes.length; x++ )
		if ( divComponent.childNodes.item(x).nodeName == 'SELECT' )
			shellCmd({
				device: device,
				command: 'am force-stop '+divComponent.childNodes.item(x).value
			});
};

const _uninstallPkg = obj => {
	if ( obj.nodeName != 'BUTTON' || obj.parentNode.nodeName != 'DIV' )
		return;

	const divComponent = obj.parentNode.parentNode;
	const device = _getDevice( divComponent );

	if ( !device )
		return;
	
	for ( let x = 0; x < divComponent.childNodes.length; x++ )
		if ( divComponent.childNodes.item(x).nodeName == 'SELECT' )
			client.uninstall( device, divComponent.childNodes.item(x).value );
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
	uninstallPkg: _uninstallPkg,
	onLoad: _onLoad
};
