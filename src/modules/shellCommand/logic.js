const _button = obj => {
	if ( obj.nodeName != 'BUTTON' || obj.parentNode.nodeName != 'DIV' )
		return;

	const divComponent = obj.parentNode.parentNode;

	for ( let x = 0; x < divComponent.childNodes.length; x++ )
		if ( divComponent.childNodes.item(x).nodeName == 'DIV' )
			for ( let w = 0; w < divComponent.childNodes.item(x).childNodes.length; w++ )
				if ( divComponent.childNodes.item(x).childNodes.item(w).nodeName == 'INPUT' )
					shellCmd( divComponent.childNodes.item(x).childNodes.item(w).value, alert );
};

module.exports = {
	name: 'Shell Command',
	button: _button
};
