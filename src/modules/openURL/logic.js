const _button = obj => {
	if ( obj.nodeName != 'BUTTON' || obj.parentNode.nodeName != 'DIV' )
		return;

	for ( let x = 0; x < obj.parentNode.childNodes.length; x++ )
		if ( obj.parentNode.childNodes.item(x).nodeName == 'INPUT' )
			shellCmd( 'am start -W -a android.intent.action.VIEW -d "'+obj.parentNode.childNodes.item(x).value+'"' );
};

module.exports = {
	name: 'Open URL',
	button: _button
};
