const storage = require('electron-storage');
const filePath = './config.json';

const set = config => storage.set( filePath, config );

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

		if ( col.length > 0 )
			newLayout.push( col );
	}

	return newLayout;
}

const _getItemName = obj => obj.parentNode.nodeName == 'DIV'
	? obj.parentNode.getAttribute( 'component' )
	: false;

const _findItem = ( config, name ) => {
	for ( let c = 0; c < config.length; c++ )
		for ( let r = 0; r < config[c].length; r++ )
			if ( config[c][r] == name )
				return {
					collumn: c,
					row: r
				};

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

					const newCollumn = position.collumn == 0 ? cfg.layout.length-1 : position.collumn-1;

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

			cfg.layout = _cleanNullLayout( cfg.layout );

			set( cfg );
			_mountLayout( cfg.layout );

		}).catch( err => {
			console.log( '_itemUp config - fail' );
			console.log( err );

		});
}

exports.set = set;
exports.get = get;
exports.item = {
	up: obj => _moveItem( obj, "up" ),
	down: obj => _moveItem( obj, "down" ),
	remove: obj => _moveItem( obj, "remove" ),
};
