var serialport = require("serialport");

exports.initiateCommunication = function(callback){
  var portName;
  var found = false;

  serialport.list(function(err, ports){
    for(var i = 0; i < ports.length; i++) {
      port = ports[i];

      if(port.manufacturer == 'Arduino (www.arduino.cc)') {
        found++;
        portName = port.comName;
      }
    }

    if(found) {
      openPort(portName, callback);
    } else {
      exitWithMessage('Cannot find Arduino port.  Is it connected?');
    }
  })
};

function openPort(portName, callback) {
  var arduinoPort = new serialport.SerialPort(portName, {
    baudrate: 9600,
    parser: serialport.parsers.readline('\n')
  }, false);

  arduinoPort.open(function(error) {
    if ( error ) {
      log(error);
    } else {
      log('Serial open');

      arduinoPort.on('data', function(data) {
        log(data);
        callback(data);
      });
    }
  });
}

function exitWithMessage(str) {
  log(str);
  process.exit(0);
}

function log(str) {
  console.log("Arduino Serial: ", str);
}
