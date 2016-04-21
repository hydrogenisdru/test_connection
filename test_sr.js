var ms = require('./test_emitter');
var stream = new ms();
var cnt = 0;
setInterval(stream.write(cnt++),2000);

stream.on();

