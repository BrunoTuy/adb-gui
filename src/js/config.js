const storage = require('electron-storage');
const filePath = './config.json';
const configTest = {
	layout: [
		['mainButtons', 'reactNativeButtons', 'controlPackages'],
		['shellCommand', 'openURL', 'multimidiaButtons', 'sendKeycode']
	]};

const _makeConfigFile = config => {
	return storage.set( filePath, config );
}

const get = () => {
	return new Promise(( resolve, reject ) => {
		storage.get( filePath, ( err, data ) => {
			if ( err ){
				_makeConfigFile( configTest );

				resolve( configTest );
			}

			else
				resolve( data );
		});
	});
}

exports.get = get;