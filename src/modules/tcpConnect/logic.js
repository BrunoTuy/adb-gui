module.exports = {
	name: 'TCP Connect',
	ip: () => shellCmd( 'netcfg', ( retorno ) => {
		if ( retorno.toLowerCase().indexOf( 'not found' ) > 0 ) {
			shellCmd( 'ifconfig', alert );
		}
		else {
			alert( retorno );
		}
	}),
	connect: ( obj ) => {
		if ( obj.nodeName != 'BUTTON' || obj.parentNode.nodeName != 'DIV' ) {
			return;
		}

		const divComponent = obj.parentNode;

		for ( let idxItem = 0; idxItem < divComponent.childNodes.length; idxItem++ ) {
			if ( divComponent.childNodes.item( idxItem ).nodeName == 'INPUT' ) {
				tcpConnect( divComponent.childNodes.item( idxItem ).value );
			}
		}
	},
};
