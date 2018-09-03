const console = require('electron').remote.getGlobal('console');
const adb = require('adbkit');
const client = adb.createClient();
const config = require('./js/config.js');

const modules = require('./modules/');

modules.sendKeycode = require('./modules/sendKeycode.js');

const _buscarDispositivos = () => {
	client.listDevices()
		.then( devices => {
			const div = document.getElementById( "dspLista" ).childNodes.item(1);
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
	const div = document.getElementById( "dspLista" ).childNodes.item(1);
	let macs = [];

	for ( let x = 0; x < div.childNodes.length; x++ )
		if (div.childNodes.item(x).nodeName == 'LABEL' && div.childNodes.item(x).childNodes.item(0).nodeName == 'INPUT' && div.childNodes.item(x).childNodes.item(0).checked )
			macs.push( div.childNodes.item(x).childNodes.item(0).getAttribute( "value" ) );

	if ( macs.length < 1 )
		alert( 'Escolha pelo menos um dispositivo!' );

	return macs;
};

const shellCmd = ( opt, cb ) => {
	const dev = typeof opt == 'object' && opt.device ? opt.device : false;
	const cmd = typeof opt == 'object' && opt.command ? opt.command : ( typeof opt == 'string' ? opt : false );

	const _shell = ( dev, cmd ) => {
		client.shell( dev, cmd ).then(adb.util.readAll).then( ret => {
			const response = ret.toString().trim();

			if ( cb )
				cb( response );
		});
	};

	if ( !cmd ){
		alert( 'Falta informar o comando.' );

		return;
	}

	if ( dev )
		_shell( dev, cmd );

	else
		dispositivosSelecionados().map( dev => _shell( dev, cmd ));
};

const _createItem = ( component, hideConfig ) => {
	const obj = eval( 'modules.'+component );

	if ( !obj )
		return false;

	const _compenent = document.createElement( 'div' );
	_compenent.setAttribute( "class", "areaBt" );

	if ( obj.name ){
		const _item = document.createElement( 'div' );
		const _title = document.createElement( 'h1' );
		const _btnUp = document.createElement( 'span' );
		const _btnRem = document.createElement( 'span' );
		const _btnDown = document.createElement( 'span' );
		const _btnConfig = document.createElement( 'div' );

		_btnUp.setAttribute( "class", "glyphicon glyphicon-circle-arrow-up" );
		_btnUp.setAttribute( "onclick", "config.item.up(this)" );
		_btnRem.setAttribute( "class", "glyphicon glyphicon-remove-sign" );
		_btnRem.setAttribute( "onclick", "config.item.remove(this)" );
		_btnDown.setAttribute( "class", "glyphicon glyphicon-circle-arrow-down" );
		_btnDown.setAttribute( "onclick", "config.item.down(this)" );

		_btnConfig.appendChild( _btnUp );
		_btnConfig.appendChild( _btnRem );
		_btnConfig.appendChild( _btnDown );

		_btnConfig.setAttribute( "class", `headItem${hideConfig ? ' hide' : ''}` );
		_btnConfig.setAttribute( "name", "configItem" );
		_btnConfig.setAttribute( "component", component );

		_item.appendChild( _btnConfig );
		_item.appendChild( _title );

		_title.innerHTML = obj.name;

		_compenent.appendChild( _item );
	}

	_compenent.innerHTML += obj.html;

	return {
		html: _compenent,
		onLoad: obj.onLoad
	};
}

const _mountLayout = ( layout, hideConfig ) => {
	const div = document.getElementById( "itemsLista" );
	const colunas = layout.length;
	const tamanhoDiv = 12/colunas;

	div.innerHTML = '';

	layout.forEach( c => {
		const onLoads = [];
		const _group = document.createElement( 'div' );

		_group.setAttribute( "class", `col-xs-${tamanhoDiv} col-sm-${tamanhoDiv} col-md-${tamanhoDiv} col-lg-${tamanhoDiv} coluna` );

		c.map( item => {
			const comp = _createItem( item, hideConfig );

			_group.appendChild( comp.html );

			if ( comp.onLoad )
				onLoads.push( comp.onLoad );
		});

		div.appendChild( _group );

		onLoads.forEach( fn => fn() );
	});
}

function fnShowHideConfig(){
	const div = document.getElementById( "areaConfig" );
	const _class = div.getAttribute( "class" );

	if ( _class.indexOf( "hide" ) > -1 )
		div.setAttribute( "class", _class.replace( " hide", "" ) );

	else
		div.setAttribute( "class", _class+" hide" );

	const divs = document.getElementsByName( 'configItem' );

	console.log( 'Lista', divs.length );

	divs.forEach( _div => {
		const _class = _div.getAttribute( "class" );

		if ( _class.indexOf( "hide" ) > -1 )
			_div.setAttribute( "class", _class.replace( " hide", "" ) );

		else
			_div.setAttribute( "class", `${_class} hide` );
	});
}

function fnResetConfig(){
	let _listModules = [];
	let _config = {layout: [[]]}

	for ( _module in modules )
		if ( _module )
			_config.layout[0].push( _module );

	config.set( _config );

	_mountLayout( _config.layout.filter( item => item.length > 0 ) );
}

function fnOnload(){
	_buscarDispositivos();
	_definirTrack();

	let _listModules = [];

	for ( _module in modules )
		if ( _module )
			_listModules.push( _module );

	config.get( _listModules )
		.then( cfg => _mountLayout( cfg.layout, true ) )
		.catch( err => {
			console.log( 'test config - fail' );
			console.log( err );
		});
}
