const fs = require('fs');
const Web3 = require('web3');
const solc = require('solc');
const _ = require('lodash');



const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb://localhost/test', {
	useMongoClient: true,
});
var db = mongoose.connection;

// Check connection
db.once('open', function(){
	console.log('Connected to MongoDB');
});

// Check for DB errors
db.on('error', function(err){
	console.log(err);
});


// User Schema
var UserSchema = mongoose.Schema({
	addr: {
		type: String,
		required: true
	}
});

var User = module.exports = mongoose.model('User', UserSchema);








// config
const ethereumUri = 'http://localhost:8545';
const oracleAddr = '0xD460Fd1C682B28fC8130c67046f88121dD099CcF';


// connect to node
let web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider(ethereumUri));

if (!web3.isConnected()) {
	throw new Error('unable to connect to ethereum node at ' + ethereumUri);
} else {
	console.log('connected to ehterum node at ' + ethereumUri);
}


// compile contract
let client = _compileContract('Oracle', oracleAddr);


// watch QueryEvent
let event = client.instance.Query();
console.log('watching for Query...\n');

event.watch(function (error, result) {
	if (!error) {
		console.log('got a QueryEvent');
		// get query code
		var returnAddr = _.at(result, 'args.addr')[0];
		console.log(returnAddr);

		var newUser = new User({
			addr: returnAddr
		});
		newUser.save();

	} else {
		console.log(error);
	}
});







function _compileContract(name, address) {

	let source = fs.readFileSync("./contracts/"+name+'.sol', 'utf8');
	console.log(`compile ${name}.sol`);

	let compiledContract = solc.compile(source);

	var bytecode = _.at(compiledContract, 'contracts.:' + name + '.bytecode');
	var abi = JSON.parse(_.at(compiledContract, 'contracts.:' + name + '.interface'));

	var contract = web3.eth.contract(abi);
	var instance = contract.at(address);

	return {
		'abi': abi,
		'instance': instance
	};
}


