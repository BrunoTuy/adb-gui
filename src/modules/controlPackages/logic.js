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
	start: _start,
	close: _close,
	update: _update,
	uninstallPkg: _uninstallPkg,
	onLoad: _onLoad
};
