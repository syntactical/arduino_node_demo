var serialport = require('serialport');
var SerialPort = serialport.SerialPort;

function openPort(portName, receiveCallback){
  var arduinoPort = new SerialPort(portName, {
    baudrate: 9600,
    parser: serialport.parsers.readline('\n')
  }, false);

  arduinoPort.open(function(error) {
    if ( error ) {
      log(error);
    } else {
      log('Serial open');

      arduinoPort.on('data', function(data) {
        receiveCallback(data);
      });
    }
  });
}

exports.findArduinoPortName = function(receiveCallback){
  var name, port;
  var found = 0;

  serialport.list(function (err, ports) {
    for(var i = 0; i < ports.length; i++) {
      port = ports[i];

      if(port.manufacturer == 'Arduino (www.arduino.cc)') {
        found++;
        name = port.comName;
      }
    }

    if(found == 1) {
      openPort(name, receiveCallback);
    } else {
      exitWithMessage('Cannot find Arduino port.  Is it connected?');
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
