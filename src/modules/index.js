const fs = require("fs");
const path = './src/modules/';

let objModules = {};

const lst = fs.readdirSync( path )
	.filter( file => (file.indexOf(".") !== 0) && (file !== "index.js") )
	.filter( file => fs.statSync(path+file).isDirectory() );

for ( let x = 0; x < lst.length; x++ ){
	const file = lst[x];

	let obj = require( './'+file+'/logic.js' );

	obj.html = fs.readFileSync( path+file+'/template.html', 'utf8' );

	objModules[file] = obj;
}

module.exports = objModules;
