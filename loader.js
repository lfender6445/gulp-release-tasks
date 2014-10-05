var fs = require('fs');
path = __dirname + '/tasks/gulpfile.js';
file =  fs.readFileSync(path);
eval(file.toString())

