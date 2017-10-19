const console = require('electron').remote.getGlobal('console');
const adb = require('adbkit');
const client = adb.createClient();

const buscarDispositivos = () => {
	client.listDevices()
		.then(( devices ) => {
			const div = document.getElementById( "dspLista" );

			for ( let x = div.childNodes.length-1; x >= 0; x-- ){
				let conectado = false;

				if (div.childNodes.item(x).nodeName == 'LABEL' && div.childNodes.item(x).childNodes.item(0).nodeName == 'INPUT' )
					for ( let y = 0; y < devices.length; y++ )
						if ( div.childNodes.item(x).childNodes.item(0).getAttribute( "value" ) == devices[y].id )
							conectado = true;

				if ( !conectado )
					div.removeChild( div.childNodes.item(x) );
			}

			devices.filter(( device ) => {
				for ( var x = 0; x < div.childNodes.length; x++ )
					if (div.childNodes.item(x).nodeName == 'LABEL' &&
						div.childNodes.item(x).childNodes.item(0).nodeName == 'INPUT' &&
						div.childNodes.item(x).childNodes.item(0).getAttribute( "value" ) == device.id )
						return false;

				return true;
			}).map(( device ) => {
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
		}).catch(( err ) => {
			console.error('Something went wrong:', err.stack)

		});
};

const _definirTrack = () => {
	client.trackDevices()
		.then((tracker) => {
			tracker.on('add', (device) => {
				console.log('Device %s was plugged in', device.id);

				buscarDispositivos();
			});

			tracker.on('remove', (device) => {
				console.log('Device %s was unplugged', device.id);

				buscarDispositivos();
			});

			tracker.on('end', () => {
				console.log('Tracking stopped');

				buscarDispositivos();
			});

		}).catch((err) => {
			console.error('Something went wrong:', err.stack);

		});
};

const _dispositivosSelecionados = () => {
	const div = document.getElementById( "dspLista" );
	let macs = [];

	for ( let x = 0; x < div.childNodes.length; x++ )
		if (div.childNodes.item(x).nodeName == 'LABEL' && div.childNodes.item(x).childNodes.item(0).nodeName == 'INPUT' && div.childNodes.item(x).childNodes.item(0).checked )
			macs.push( div.childNodes.item(x).childNodes.item(0).getAttribute( "value" ) );

	return macs;
};

const btMenu = () => {
	console.info( 'menu menu' );

	_dispositivosSelecionados().map( dev => {
		client.shell( dev, 'input keyevent 82' );
	});
};

buscarDispositivos();
_definirTrack();