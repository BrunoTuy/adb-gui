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

			if ( div.childNodes.length == 0 )
				div.innerHTML = "<span>Nenhum dispositivo conectado!</span>";
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

	if ( macs.length < 1 )
		alert( 'Escolha pelo menos um dispositivo!' );

	return macs;
};

const _preencherListaBotoes = () => {
	const select = document.getElementsByClassName( "lstKeys" );

	const bts = [
		{ id: 1, nome: "MENU" },
		{ id: 2, nome: "SOFT_RIGHT" },
		{ id: 3, nome: "HOME" },
		{ id: 4, nome: "BACK" },
		{ id: 5, nome: "CALL" },
		{ id: 6, nome: "ENDCALL" },
		{ id: 7, nome: "0" },
		{ id: 8, nome: "1" },
		{ id: 9, nome: "2" },
		{ id: 10, nome: "3" },
		{ id: 11, nome: "4" },
		{ id: 12, nome: "5" },
		{ id: 13, nome: "6" },
		{ id: 14, nome: "7" },
		{ id: 15, nome: "8" },
		{ id: 16, nome: "9" },
		{ id: 17, nome: "STAR" },
		{ id: 18, nome: "POUND" },
		{ id: 19, nome: "DPAD_UP" },
		{ id: 20, nome: "DPAD_DOWN" },
		{ id: 21, nome: "DPAD_LEFT" },
		{ id: 22, nome: "DPAD_RIGHT" },
		{ id: 23, nome: "DPAD_CENTER" },
		{ id: 24, nome: "VOLUME_UP" },
		{ id: 25, nome: "VOLUME_DOWN" },
		{ id: 26, nome: "POWER" },
		{ id: 27, nome: "CAMERA" },
		{ id: 28, nome: "CLEAR" },
		{ id: 29, nome: "A" },
		{ id: 30, nome: "B" },
		{ id: 31, nome: "C" },
		{ id: 32, nome: "D" },
		{ id: 33, nome: "E" },
		{ id: 34, nome: "F" },
		{ id: 35, nome: "G" },
		{ id: 36, nome: "H" },
		{ id: 37, nome: "I" },
		{ id: 38, nome: "J" },
		{ id: 39, nome: "K" },
		{ id: 40, nome: "L" },
		{ id: 41, nome: "M" },
		{ id: 42, nome: "N" },
		{ id: 43, nome: "O" },
		{ id: 44, nome: "P" },
		{ id: 45, nome: "Q" },
		{ id: 46, nome: "R" },
		{ id: 47, nome: "S" },
		{ id: 48, nome: "T" },
		{ id: 49, nome: "U" },
		{ id: 50, nome: "V" },
		{ id: 51, nome: "W" },
		{ id: 52, nome: "X" },
		{ id: 53, nome: "Y" },
		{ id: 54, nome: "Z" },
		{ id: 55, nome: "COMMA" },
		{ id: 56, nome: "PERIOD" },
		{ id: 57, nome: "ALT_LEFT" },
		{ id: 58, nome: "ALT_RIGHT" },
		{ id: 59, nome: "SHIFT_LEFT" },
		{ id: 60, nome: "SHIFT_RIGHT" },
		{ id: 61, nome: "TAB" },
		{ id: 62, nome: "SPACE" },
		{ id: 63, nome: "SYM" },
		{ id: 64, nome: "EXPLORER" },
		{ id: 65, nome: "ENVELOPE" },
		{ id: 66, nome: "ENTER" },
		{ id: 67, nome: "DEL" },
		{ id: 68, nome: "GRAVE" },
		{ id: 69, nome: "MINUS" },
		{ id: 70, nome: "EQUALS" },
		{ id: 71, nome: "LEFT_BRACKET" },
		{ id: 72, nome: "RIGHT_BRACKET" },
		{ id: 73, nome: "BACKSLASH" },
		{ id: 74, nome: "SEMICOLON" },
		{ id: 75, nome: "APOSTROPHE" },
		{ id: 76, nome: "SLASH" },
		{ id: 77, nome: "AT" },
		{ id: 78, nome: "NUM" },
		{ id: 79, nome: "HEADSETHOOK" },
		{ id: 80, nome: "FOCUS" },
		{ id: 81, nome: "PLUS" },
		{ id: 82, nome: "MENU" },
		{ id: 83, nome: "NOTIFICATION" },
		{ id: 84, nome: "SEARCH" },
		{ id: 85, nome: "TAG_LAST_KEY" }];

	if ( select.length < 1 )
		return;

	bts.map( key => {
		let option = document.createElement( "option" );

		option.setAttribute( "value", key.id );
		option.innerHTML = key.nome;

		for ( let x = 0; x < select.length; x++ )
			select.item(x).appendChild( option );
	});

};

const btbt = obj => {
	if ( obj.nodeName != 'BUTTON' || obj.parentNode.nodeName != 'DIV' )
		return;

	for ( let x = 0; x < obj.parentNode.childNodes.length; x++ )
		if ( obj.parentNode.childNodes.item(x).nodeName == 'SELECT' )
			btButton( obj.parentNode.childNodes.item(x).value );
};

const btButton = cod => {
	_dispositivosSelecionados().map( dev => {
		client.shell( dev, 'input keyevent '+cod );
	});
};

const btSendURL = () => {
	const url = document.getElementById( "url" ).value;

	if ( url.length < 1 ){
		alert( 'Cade a URL?' );

		return;
	}

	_dispositivosSelecionados().map( dev => {
		client.shell( dev, 'am start -W -a android.intent.action.VIEW -d "'+url+'"' );
	});
};

buscarDispositivos();
_definirTrack();

setTimeout(() => {
	_preencherListaBotoes();
	
}, 250);
