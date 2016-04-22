var Promise = require("bluebird");
var serialport = Promise.promisifyAll(require("serialport"));

var SerialPort = serialport.SerialPort;

exports.openPort = function(receiveCallback){
  var portName = findArduinoPortName();
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
};

function findArduinoPortName(){
  var name, port;
  var found = 0;

  serialport.listAsync(function (err, ports) {
    for(var i = 0; i < ports.length; i++) {
      port = ports[i];

      if(port.manufacturer == 'Arduino (www.arduino.cc)') {
        found++;
        name = port.comName;
      }
    }

    if(found == 1) {
      return name;
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
