const con = require('electron').remote.getGlobal('console');
const adb = require('adbkit');
const fs = require('fs');
const client = adb.createClient();

let dispositivos = [];

const buscarDispositivos = () => {
	client.listDevices()
		.then(function(devices) {
			con.log( devices );

			dispositivos = devices;

			devices.map((device) => {
				client.pull(device.id, '/system/build.prop')
					.then(function(transfer) {
						const fn = '/tmp/' + device.id + '.build.prop';

						transfer.on('progress', function(stats) {
							con.log('[%s] Pulled %d bytes so far', device.id, stats.bytesTransferred);
						});

						transfer.on('end', function() {
							con.log('[%s] Pull complete', device.id);

							resolve(device.id);
						});

						transfer.pipe(fs.createWriteStream(fn));
					}).catch(function(err) {
						con.error('Erro:', err.stack);

					});
			});
		}).catch(function(err) {
			con.error('Something went wrong:', err.stack)

		});
};

const _definirTrack = () => {
	client.trackDevices()
		.then(function(tracker) {
			tracker.on('add', function(device) {
				con.log('Device %s was plugged in', device.id);

				buscarDispositivos();
			});

			tracker.on('remove', function(device) {
				con.log('Device %s was unplugged', device.id);

				buscarDispositivos();
			});

			tracker.on('end', function() {
				con.log('Tracking stopped');

				buscarDispositivos();
			});

		}).catch(function(err) {
			con.error('Something went wrong:', err.stack);

		});
};

function btMenu(){
	con.info( 'menu menu' );
	con.info( dispositivos );
/*
	let cmd = 'input keyevent 82';

	client.shell( '0017986892', cmd );*/
}

buscarDispositivos();
_definirTrack();