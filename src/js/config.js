const storage = require('electron-storage');
const filePath = './config.json';
const configTest = {
	layout: [
		['mainButtons', 'reactNativeButtons', 'controlPackages'],
		['shellCommand', 'openURL', 'multimidiaButtons', 'sendKeycode']
	]};

const set = config => {
	return storage.set( filePath, config );
}

const get = modules => {
	let cfgDefault = {layout: [[]]};

	if ( modules )
		cfgDefault.layout.push( modules );

	return new Promise(( resolve, reject ) => {
		storage.get( filePath, ( err, data ) => {
			if ( err ){
				set( cfgDefault );

				resolve( cfgDefault );
			}

			else
				resolve( data );
		});
	});
}

const _cleanNullLayout = layout => {
	let newLayout = [];

	for ( let c = 0; c < layout.length; c++ ){
		let col = [];

		for ( r = 0; r < layout[c].length; r++ )
			if ( layout[c][r] )
				col.push( layout[c][r] );

		newLayout.push( col );
	}

	return newLayout;
}

const _getItemName = obj => {
	if ( obj.parentNode.nodeName != 'DIV' || obj.parentNode.childNodes.length != 4 )
		return;

	return obj.parentNode.childNodes.item( 3 ).innerHTML;
}

const _findItem = ( config, name ) => {
	for ( let c = 0; c < config.length; c++ )
		for ( let r = 0; r < config[c].length; r++ )
			if ( config[c][r] == name )
				return {
					collumn: c,
					row: r};

	return false;
}

const _moveItem = ( obj, type ) => {
	const itemName = _getItemName( obj );

	get()
		.then( cfg => {
			console.log( '_itemUp' );
			console.log( cfg );

			const position = _findItem( cfg.layout, itemName );

			if ( !position )
				return;

			console.log( position );

			if ( type == 'up' ){
				if ( position.row > 0 ){
					const aux = cfg.layout[position.collumn][position.row-1];

					cfg.layout[position.collumn][position.row-1] = cfg.layout[position.collumn][position.row];
					cfg.layout[position.collumn][position.row] = aux;
				}
				else {
					delete cfg.layout[position.collumn][position.row];

					const newCollumn = position.collumn == 0 ? cfg.layout.length-1 : cfg.layout.length-2;

					cfg.layout[newCollumn].push( itemName );
				}
			}
			else if ( type == 'down' ){
				if ( position.row < cfg.layout[position.collumn].length-1 ){
					const aux = cfg.layout[position.collumn][position.row+1];

					cfg.layout[position.collumn][position.row+1] = cfg.layout[position.collumn][position.row];
					cfg.layout[position.collumn][position.row] = aux;
				}
				else {
					const newCollumn = position.row >= cfg.layout[position.collumn].length-1 && position.collumn <= cfg.layout.length-1 ? position.collumn+1 : 0;

					cfg.layout[newCollumn] = [ itemName ].concat( cfg.layout[newCollumn] );

					delete cfg.layout[position.collumn][position.row];
				}
			}
			else if ( type == 'remove' )
				delete cfg.layout[position.collumn][position.row];

			console.log( cfg.layout );

			cfg.layout = _cleanNullLayout( cfg.layout );

			set( cfg );
			mountArea( obj.parentNode.parentNode.parentNode, cfg.layout );
			_mountLayout( cfg.layout );

		}).catch( err => {
			console.log( '_itemUp config - fail' );
			console.log( err );

		});

}

const mountArea = ( div, config ) => {
	if ( !div )
		return;

	div.innerHTML = '';

	for ( let c = 0; c < config.length; c++ ){
		let _compenent = document.createElement( 'div' );
		_compenent.setAttribute( "class", "col-xs-6 col-sm-6 col-md-6 col-lg-6" );

		for ( let idx = 0; idx < config[c].length; idx++ ){
			let _item = document.createElement( 'div' );
			_item.setAttribute( "class", "item" );

			let _btnUp = document.createElement( 'span' );
			_btnUp.setAttribute( "class", "glyphicon glyphicon-circle-arrow-up" );
			_btnUp.setAttribute( "onclick", "config.item.up(this)" );
			_item.appendChild( _btnUp );

			let _btnRem = document.createElement( 'span' );
			_btnRem.setAttribute( "class", "glyphicon glyphicon-remove-sign" );
			_btnRem.setAttribute( "onclick", "config.item.remove(this)" );
			_item.appendChild( _btnRem );

			let _btnDown = document.createElement( 'span' );
			_btnDown.setAttribute( "class", "glyphicon glyphicon-circle-arrow-down" );
			_btnDown.setAttribute( "onclick", "config.item.down(this)" );
			_item.appendChild( _btnDown );

			let _span = document.createElement( 'span' );
			_span.innerHTML = config[c][idx];
			_item.appendChild( _span );

			_compenent.appendChild( _item );
		}

		div.appendChild( _compenent );
	}
}

exports.set = set;
exports.get = get;
exports.mountArea = mountArea;
exports.item = {
	up: obj => { _moveItem( obj, "up" ); },
	remove: obj => { _moveItem( obj, "remove" ); },
	down: obj => { _moveItem( obj, "down" ); }
};
