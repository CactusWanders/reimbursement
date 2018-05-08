var fs = require('fs');
var config = require('./config.js');

var {delAllInFoler} = require('./helper.js');
var Reimbursement = require('./Reimbursement.js');

delAllInFoler(config.path);

Reimbursement.init();
