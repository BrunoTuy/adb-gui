const console = require('electron').remote.getGlobal('console');
const adb = require('adbkit');
const client = adb.createClient();

const mainButtons = require('./js/mainButtons.js');
const reactNativeButtons = require('./js/reactNativeButtons.js');
const multimidiaButtons = require('./js/multimidiaButtons.js');
const openURL = require('./js/openURL.js');
const controlPackages = require('./js/controlPackages.js');
const sendKeycode = require('./js/sendKeycode.js');
const shellCommand = require('./js/shellCommand.js');

const _buscarDispositivos = () => {
	client.listDevices()
		.then( devices => {
			const div = document.getElementById( "dspLista" );
			const selects = document.getElementsByClassName( "selectListDevices" );

			for ( let x = div.childNodes.length-1; x >= 0; x-- ){
				let conectado = false;

				if (div.childNodes.item(x).nodeName == 'LABEL' && div.childNodes.item(x).childNodes.item(0).nodeName == 'INPUT' )
					for ( let y = 0; y < devices.length; y++ )
						if ( div.childNodes.item(x).childNodes.item(0).getAttribute( "value" ) == devices[y].id )
							conectado = true;

				if ( !conectado )
					div.removeChild( div.childNodes.item(x) );
			}

			devices.filter( device => {
				for ( var x = 0; x < div.childNodes.length; x++ )
					if (div.childNodes.item(x).nodeName == 'LABEL' &&
						div.childNodes.item(x).childNodes.item(0).nodeName == 'INPUT' &&
						div.childNodes.item(x).childNodes.item(0).getAttribute( "value" ) == device.id )
						return false;

				return true;
			}).map( device => {
				let input = document.createElement( "input" );

				input.setAttribute( "class", "dspChk" );
				input.setAttribute( "type", "checkbox" );
				input.setAttribute( "value", device.id );

				let label = document.createElement( "label" );

				label.setAttribute( "class", "checkbox-inline" );
				label.appendChild( input );
				label.innerHTML += device.id;

				div.appendChild( label );
			});

			if ( div.childNodes.length == 0 )
				div.innerHTML = "<span>Nenhum dispositivo conectado!</span>";

			for ( let x = 0; x < selects.length; x++ ){
				const select = selects.item(x);

				for ( let y = 0; y < select.childNodes.length; y++ ){
					let connected = true;

					const selectChild = select.childNodes.item(y);

					if ( selectChild.nodeName == 'OPTION' && selectChild.getAttribute( "value" ) != 'none' )
						connected = devices.filter( device => device.id == selectChild.getAttribute( "value" ) ) > 0 ? true : false;

					if ( !connected )
						select.removeChild( selectChild );
				}

				devices.filter( device => {
					let exist = false;


					for ( let y = 0; y < select.childNodes.length; y++ ){
						const selectChild = select.childNodes.item(y);

						if ( device.id == selectChild.getAttribute( "value" ) )
							exist = true;
					}

					if ( !exist ){
						let option = document.createElement( "option" );

						option.setAttribute( "value", device.id );
						option.innerHTML = device.id;

						select.appendChild( option );
					}
				})
			}
		}).catch(( err ) => {
			console.error('Something went wrong:', err.stack)

		});
};

const _definirTrack = () => {
	client.trackDevices()
		.then((tracker) => {
			tracker.on('add', (device) => {
				console.log('Device %s was plugged in', device.id);

				_buscarDispositivos();
			});

			tracker.on('remove', (device) => {
				console.log('Device %s was unplugged', device.id);

				_buscarDispositivos();
			});

			tracker.on('end', () => {
				console.log('Tracking stopped');

				_buscarDispositivos();
			});

		}).catch((err) => {
			console.error('Something went wrong:', err.stack);

		});
};

const dispositivosSelecionados = () => {
	const div = document.getElementById( "dspLista" );
	let macs = [];

	for ( let x = 0; x < div.childNodes.length; x++ )
		if (div.childNodes.item(x).nodeName == 'LABEL' && div.childNodes.item(x).childNodes.item(0).nodeName == 'INPUT' && div.childNodes.item(x).childNodes.item(0).checked )
			macs.push( div.childNodes.item(x).childNodes.item(0).getAttribute( "value" ) );

	if ( macs.length < 1 )
		alert( 'Escolha pelo menos um dispositivo!' );

	return macs;
};

const shellCmd = ( cmd, cb ) => {
	console.log( 'shellCmd.cmd' );
	console.log( cmd );

	const _shell = ( dev, cmd ) => {
		client.shell( dev, cmd ).then(adb.util.readAll).then( ret => {
			const response = ret.toString().trim();

			if ( cb )
				cb( response );
		});
	};

	if ( typeof cmd == 'string' )
		dispositivosSelecionados().map( dev => _shell( dev, cmd ));

	else if ( typeof cmd == 'object' && cmd.device && cmd.command )
		_shell( cmd.device, cmd.command );
};

const _addIten = ( columnIdx, component ) => {
	const column = document.getElementsByClassName( "coluna" );
	const obj = eval( component );

	if ( !obj )
		return;

	if ( column.length < columnIdx+1 )
		return;

	let _compenent = document.createElement( 'div' );
	_compenent.setAttribute( "class", "areaBt" );

	if ( obj.name ){
		let _title = document.createElement( 'h1' );
		_title.innerHTML = obj.name;

		_compenent.appendChild( _title );
	}

	_compenent.innerHTML += obj.html;

	column.item( columnIdx ).appendChild( _compenent );

	if ( obj.onLoad )
		obj.onLoad();
}

_buscarDispositivos();
_definirTrack();

setTimeout(() => {
	_addIten( 0, 'mainButtons' );
	_addIten( 0, 'reactNativeButtons' );
	_addIten( 0, 'controlPackages' );

	_addIten( 1, 'shellCommand' );
	_addIten( 1, 'openURL' );
	_addIten( 1, 'multimidiaButtons' );
	_addIten( 1, 'sendKeycode' );
}, 250);
