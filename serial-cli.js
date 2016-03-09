var serialport = require('serialport');
var SerialPort = serialport.SerialPort;
var readline = require('readline');
var rl = readline.createInterface(process.stdin, process.stdout);

function openSerialPort(portName){
  var serialPort = new SerialPort(portName, {
    baudrate: 9600,
    parser: serialport.parsers.readline('\n')
  }, false);

  serialPort.open(function(error) {
    if ( error ) {
      exitWithMessage('Serial failed to open: ' + error);
    } else {
      log('Serial open');
      rl.setPrompt('');
      rl.prompt();

      serialPort.on('data', function(data) {
        console.log('serial:- ' + data);

        io.emit('serial data', data);
      });

      rl.on('line', function(line) {
        log('Writing \'' + line + '\' to serial port...');
        serialPort.write(line + '\r', function(err, results) {
          rl.prompt();
        });
      }).on('close', function() {
        exitWithMessage('Have a great day!');
      });
    }
  });
}

function processWithoutArgs() {
  var found = 0;
  var name, port;
  serialport.list(function (err, ports) {
    for(var i = 0; i < ports.length; i++) {
      port = ports[i];
      if(port.manufacturer == 'Arduino (www.arduino.cc)') {
        found++;
        name = port.comName;
      }      
    }

    if(found == 1) {
      log('Opening ' + name);
      openSerialPort(name);
    } else {
      exitWithMessage('Usage: node cli SERIAL_PORT_NAME\nTry \'node list\' to get serial port name list');
    }
  });
}

function exitWithMessage(str) {
  log(str);
  process.exit(0);
}

function log(str) {
  console.log('cli:- ' + str);
}


exports.processArgs = function(){
  if(process.argv.length <= 2) {
    processWithoutArgs();
  } else {
    process.argv.forEach(function(val, index) {
      if(index == 2) {
        openSerialPort(val);
      }
    }); 
  }
}
