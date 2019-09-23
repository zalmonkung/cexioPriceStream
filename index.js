var crypto = require('crypto');


var Key = "YOUR-API-KEY";
var Secret ="YOUR-API-SECRET";

function createSignature( timestamp,apiKey, apiSecret){
  var hmac = crypto.createHmac('sha256', apiSecret );
  hmac.update( timestamp + apiKey );
  return hmac.digest('hex');
}

function createAuthRequest(apiKey, apiSecret ){
  var timestamp = Math.floor(Date.now() / 1000);  // Note: java and javascript timestamp presented in miliseconds
  var args = { e: 'auth', auth: { key: apiKey,
      signature: createSignature( timestamp,apiKey, apiSecret), timestamp: timestamp } };
  var authMessage = JSON.stringify( args );

  return authMessage;
}

//console.log(createAuthRequest( Key, Secret));

const WebSocket = require('ws');
 
const ws = new WebSocket('wss://ws.cex.io/ws');
 
ws.on('open', function open() {
  ws.send(createAuthRequest( Key, Secret));
  
});
 
ws.on('message', function incoming(data) {

 switch(JSON.parse(data).e) {
	  case 'auth':
	  		auth(JSON.parse(data));
	    	break;
	  case 'ping':
	     	pingpong();
	    	break;
	  case 'md':
	  	//console.log(JSON.parse(data).data.buy[0][0]*30.6);
	    	break;
	  case 'tick':
	  		ticker();
	  	//console.log(JSON.parse(data).data);
	    	break;
	  case 'history-update':
	   //console.log(JSON.parse(data).data)
	   		break;
	  case 'balance':
	   console.log('');
	   		break;
	  default:
    
}


ws.on('error', function error() {
  console.log(ws);
  
});


function auth(data){
	if(data.ok=="ok"){
		console.log(data);
		ws.send('{"e": "subscribe","rooms": ["pair-BTC-USD"]}');
		ws.send('{"e": "subscribe","rooms": ["tickers"]}');
	}else{
		console.log(data)
	}

}

function pingpong(){
	ws.send('{"e": "pong"}');
	//console.log('pingpong')
}

function ticker(){
	//console.log(JSON.parse(data).data);
	if(JSON.parse(data).data.symbol1=='BTC'&JSON.parse(data).data.symbol2=='USD'){
		console.log(JSON.parse(data).data.price);
		line(JSON.parse(data).data.price);
	}

}


});




const request = require('request');
const token = 'YOUR-TOKEN';
//var msg = "Your Free memory Left ";



function line(msg){
	  request({
     method: 'POST',
     uri: 'https://notify-api.line.me/api/notify',
     headers: {
       'Content-Type': 'application/x-www-form-urlencoded',
  },
     'auth': {
       'bearer': token
  },form: {
       message: msg,
    }
  }, (err,httpResponse,body) => {
     //console.log(JSON.stringify(err));
     //console.log(JSON.stringify(httpResponse));
     //console.log(JSON.stringify(body));
  })

}

