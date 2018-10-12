'use strict';
const https = require("https");
const Request = require("request");

function getToken(secret, s, thirdParty, callback) {

    return Request.get({
        "headers": { 
            "content-type": "application/json", 
            "thirdPartyAccessId": thirdParty, 
            "secretKey": secret, 
            "salt": s 
        },
        "url": "https://gateway-web.beta.interac.ca/publicapi/api/v1/access-tokens"
        }, (error, response, body) => {
            if(error) {
                console.dir(error);
                callback(error);
            }			
            callback(null, JSON.parse(body));
        });

}

function addContactByEmail(name, email, token, thirdParty, requestid, deviceid, apiReg, callback) {

    return Request.post({
        "headers": { 
            "content-type" : "application/json",
            "accessToken" : token,
            "thirdPartyAccessId": thirdParty,
            "requestId": requestid,
            "deviceId": deviceid,
            "apiRegistrationId": apiReg
            },
        "url": "https://gateway-web.beta.interac.ca/publicapi/api/v2/contacts",
        "body": JSON.stringify({
            "contactName": name,
            "language": "en",
            "notificationPreferences": [{
                "handle": email,
                "handleType": "email",
                "active": true
            }]
        })
        }, (error, response, body) => {
             if(error) {
                 console.dir(error);
                 callback(error);
             }			
             callback(null, JSON.parse(body));
         });

}

function getContact(contactid, token, thirdParty, requestid, deviceid, apiReg, callback) {

    return Request.get({
        "headers" : {
            "content-type" : "application/json",
            "contactId" : contactid,
            "accessToken" : token,
            "thirdPartAccessId" : thirdParty,
            "requestId" : requestid,
            "deviceId" : deviceid,
            "apiRegistrationId" : apiReg
        },
        "url" : "https://gateway-web.beta.interac.ca/publicapi/api/v2/contacts/" + contactid
    }, (error, response, body) => {
        if(error) {
            console.dir(error);
            callback(error);
        }			
        callback(null, JSON.parse(body));
    });

}

function createRequestByEmail(token, thirdParty, requestid, deviceid, apiReg, contactid, contacthash, 
    name, email, amount, randomid, expirydate, callback) {

    return Request.post({
        "headers" : {
            "content-type" : "application/json",
            "accessToken" : token,
            "thirdPartyAccessId" : thirdParty,
            "requestId" : requestid,
            "deviceId" : deviceid,
            "apiRegistrationId" : apiReg
        },
        "body" : JSON.stringify({
            "sourceMoneyRequestId": randomid,
            "requestedFrom": {
                "contactId": contactid,
                "contactHash": contacthash,
                "contactName": name,
                "language": "en",
                "notificationPreferences": [
                  {
                    "handle": email,
                    "handleType": "email",
                    "active": true
                  }
                ]
              },
              "amount": amount,
              "currency": "CAD",
              "editableFulfillAmount": false,
              "requesterMessage": "This request was made by using Google Assistant",
              "expiryDate": expirydate,
              "supressResponderNotifications": false
        }),
        "url" : "https://gateway-web.beta.interac.ca/publicapi/api/v2/money-requests/send"
    }, (error, response, body) => {
        if(error) {
            console.dir(error);
            callback(error);
        }			
        callback(null, JSON.parse(body));
    });

}

function cancelRequest(referenceNum, token, thirdParty, requestid, deviceid, apiReg, callback) {

    return Request.patch({
        "headers" : {
            "content-type" : "application/json",
            "referenceNumber" : referenceNum,
            "accessToken" : token,
            "thirdPartAccessId" : thirdParty,
            "requestId" : requestid,
            "deviceId" : deviceid,
            "apiRegistrationId" : apiReg
        },
        "body" : JSON.stringify({
            "cancellationReason": "Request Cancelled"
        }),
        "url" : "https://gateway-web.beta.interac.ca/publicapi/api/v2/money-requests/send/" + referenceNum + "/cancel"
    }, (error, response, body) => {
        if(error) {
            console.dir(error);
            callback(error);
        }			
        callback(null, JSON.parse(body));
    });
    
}

function getAllRequests(reference, token, thirdParty, requestid, deviceid, apiReg, callback) {

    return Request.get({
        "headers" : {
            "content-type" : "application/json",
            "accessToken" : token,
            "thirdPartyAccessId" : thirdParty,
            "requestId" : requestid,
            "deviceId" : deviceid,
            "apiRegistrationId" : apiReg,
        },
        "url" : "https://gateway-web.beta.interac.ca/publicapi/api/v2/money-requests/send?maxResponseItems=1&offset=0&sortBy=creationDate&orderBy=desc&referenceNumber=" + reference
    }, (error, response, body) => {
        if(error) {
            console.dir(error);
            callback(error);
        }			
        callback(null, JSON.parse(body));
    });
}

function generateRandomId(length = 15){
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  
  
  for (var i = 0; i < length; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}
 

var firebase = require ('@firebase/app').default;
require('@firebase/database');
//linking to firebase database
var config = {
    apiKey: "AIzaSyCl0DNiIEk1vVsgM9QPInIcbj5rHAQFLFQ",
    authDomain: "interac-with-g-assistant.firebaseapp.com",
    databaseURL: "https://interac-with-g-assistant.firebaseio.com/",
  };
 firebase.initializeApp(config);

var token = "Bearer 80f5e54f-5fc9-4d16-b8ad-0a78c2a36fd9";
//firebase.database().ref('Token/').once('value').then(function(dataSnapshot){
//	token = dataSnapshot.val();
//	console.log('Token:   '+token);
//});

var thirdPartyAccess = "CA1TA7BkrAB5DYmY";
//firebase.database().ref('ThirdPartyAccess/').once('value').then(function(dataSnapshot){
//	thirdPartyAccess = dataSnapshot.val();
//	console.log('thirdPartyAccess:   '+thirdPartyAccess);
//});

var apiRegistration = "CA1ARdxwfqqJXKzU";
//firebase.database().ref('apiReg/').once('value').then(function(dataSnapshot){
//	apiRegistration = dataSnapshot.val();
//	console.log('apiRegistration:   '+apiRegistration);
//});

  // Get a reference to the database service
var database = firebase.database();

var contacts;
var contacts_dict;
firebase.database().ref('Contacts/').once('value').then(function(dataSnapshot){
	contacts_dict = dataSnapshot.val();
	contacts = Object.keys(contacts_dict);
	
	contacts.forEach((user, i) => {
		var requestsReceived = contacts_dict[user]['RequestsReceived'];
		Object.keys(requestsReceived).forEach((item, index) => {
			if (item !== "DefaultRequest"){
				getAllRequests(item, token, thirdPartyAccess, 'request123', 'device123', apiRegistration, (error, results) => {
				  console.log(results);
					database.ref('Contacts/'+user).child("RequestsReceived").child(item).update({
						fulfilled : (results[0].status >= 3)
					});
					database.ref('Contacts/'+requestsReceived[item]['requestSender']).child("RequestsMade").child(item).update({
						fulfilled : (results[0].status >= 3)
					});
				});
			}
		});
	});
});


var id_dict = {
	"ABwppHEccNc2AyWiEhCtEvvXJE0dU0pUYHxqUk8GmC_QMin8AkZ7nWQSoloBmcWYFnKYmO57sJOnu2C6cjeTjIx-4h_2gOZp" : "Antonio",
	"ABwppHG7F0vVYoDUknskQwNkUE81-CAAgGNHPtEIzLSQJ5NzGL3M_l5yb9iR7-RB5FzSbGzXBVlukUxLv66gVzOX5iqhWdYy" : "Manik",
	"ABwppHE9Vl1xC8dSvm3U0e8P-soLO2ZZ8F5dV_bg8ihif3oLCvXbiiGnnmat3L7REki5fcad3kyiXNMMXl3QWygKjOUTeBFe" : "Jacob"
};

// var firebaseRef = firebase.database().ref('/Contacts/').once('value').then(function(snapshot) {
//   var contacts = (snapshot.val() && snapshot.val().) || 'Anonymous';  
//});

var requestAmount;
var requestEntity;

var numTriesLeft = 3;

const functions = require('firebase-functions'); // Cloud Functions for Firebase library
const DialogflowApp = require('actions-on-google').DialogflowApp; // Google Assistant helper library
const ActionsSdkApp = require('actions-on-google').ActionsSdkApp; // Google Assistant helper library
exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
	
  console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
  console.log('Dialogflow Request body: ' + JSON.stringify(request.body));
  const app = new DialogflowApp({request, response});
	
  console.log("User ID:   "+app.getUser().userId)
  console.log("User:   "+id_dict[app.getUser().userId])
  const actionMap = new Map(); //maps from the key to the handler
  actionMap.set('interac.request', (app) => {//mapping payment.send is mapped. //function starts from (app) App is passed as a parameter. parameter list should be empty
    let requestType = app.getArgument('interac-request-type');
    if (requestType === null){
		app.setContext('request-payment-payment-followup');
        app.ask(app.buildRichResponse()
               .addSimpleResponse('Would you like to make a payment request?')
               .addSuggestions(['Yes', 'No']));
    }
    requestEntity = app.getArgument('interac-request-entity');
    if (requestEntity === null || requestEntity === "person"){
		app.setContext('request-payment-entity-followup');
        app.ask('I\'m not really sure who you want me to request a payment from. Can you be more specific?');
    }
    else if (requestEntity === id_dict[app.getUser().userId]){
        app.ask('You cannot send yourself a payment request. Please tell me who you want to request a payment from.');
    }
    else if (contacts.indexOf(requestEntity) == -1){
        app.ask('I don\'t know who '+requestEntity+' is. Please specify who you would like to request this payment from.');
    }
    requestAmount = app.getArgument('interac-request-amount');
    if (requestAmount === null){
        app.ask('How much?');
    }
	numTriesLeft = 3;
	app.setContext('request-passphrase');
    app.ask('Before I send the payment request, I need to make sure that you are who you say you are. What are your security words?');
  });
  actionMap.set('request-payment.request-payment-yes', (app) => {
    app.ask('Okay. Who do you want to make a payment to?');
  });
  actionMap.set('request-payment.request-payment-no', (app) => {
	app.setContext('anything-else');
    app.ask('Okay. Is there anything else that I can do for you?');
  });
  actionMap.set('request.passphrase', (app) => {
    let word1 = app.getArgument('word1');
    let word2 = app.getArgument('word2');
    let word3 = app.getArgument('word3');
    let word4 = app.getArgument('word4');
	var security_words = contacts_dict[id_dict[app.getUser().userId]]['SecurityWords'];
	console.log("Input Words:    "+word1+" "+word2+" "+word3+" "+word4);
	console.log("Security Words:    "+security_words[0]+" "+security_words[1]+" "+security_words[2]+" "+security_words[3]);
	if (word1 === security_words[0] &&
		word2 === security_words[1] &&
		word3 === security_words[2] &&
		word4 === security_words[3]){
		
		createRequestByEmail(
			token, thirdPartyAccess, "request1234", "request1234", apiRegistration, 
			contacts_dict[requestEntity]['ContactId'], 
			contacts_dict[requestEntity]['ContactHash'], 
			requestEntity, 
			contacts_dict[requestEntity]['Email'], 
			requestAmount['amount'],
			generateRandomId(),
			"2018-04-20T16:12:12.721Z",
			(error, results) => {
				console.log(results);
				database.ref('Contacts/'+id_dict[app.getUser().userId]).child("RequestsMade").child(results['referenceNumber']).set({
					paymentGatewayUrl : results['paymentGatewayUrl'],
					requestEntity : requestEntity,
					requestAmount : requestAmount['amount'],
					fulfilled : false
				});
				database.ref('Contacts/'+requestEntity).child("RequestsReceived").child(results['referenceNumber']).set({
					paymentGatewayUrl : results['paymentGatewayUrl'],
					requestSender : id_dict[app.getUser().userId],
					requestAmount : requestAmount['amount'],
					fulfilled : false
				});
			});
			
		app.setContext('anything-else');
		if (requestAmount['currency'] === "CAD" || requestAmount['currency'] === "USD"){
			app.ask('That is correct! I\'ll make sure to request $'+requestAmount['amount']+' from '+requestEntity+'. Is there anything else that I can do for you today?');
		}
		else{
			app.ask('That is correct! I\'ll make sure to request '+requestAmount['amount']+' '+requestAmount['currency']+' from '+requestEntity+'. Is there anything else that I can do for you today?');
		}
	}
	else if (numTriesLeft > 0){
		numTriesLeft -= 1;
		app.setContext('request-passphrase');
		if (numTriesLeft === 0){
			app.ask('Wrong again. I\'ll give you one more try.');
		}
		else if (numTriesLeft === 1){
			app.ask('That\'s not it. Make sure you are articulating yourself clearly. Try again.');
		}
		else{
			app.ask('That is incorrect. Please try again.');
		}
	}
	else{
		numTriesLeft = 3;
		app.setContext('anything-else');
		app.ask('That is incorrect. Sorry. You got it wrong too many times. I\'m going to have to cancel the payment request. Is there anything else that I can do for you today?');
	}
  });
  actionMap.set('num.pending.requests', (app) => {
	  var requestsReceived = contacts_dict[id_dict[app.getUser().userId]]['RequestsReceived'];
	  var numRequested = Object.keys(requestsReceived).length-1;
	  console.log("Num Requests:   "+numRequested);
	  if (numRequested > 0){
		  if (app.hasSurfaceCapability(app.SurfaceCapabilities.SCREEN_OUTPUT)){
			  
			  var carousel = app.buildCarousel();
			  Object.keys(requestsReceived).forEach((item, index) => {
				  if (item !== "DefaultRequest" && !requestsReceived[item]['fulfilled']){
					  console.log("Suggestion Link:   "+requestsReceived[item]['requestSender']+' : $'+requestsReceived[item]['requestAmount']);
					  carousel = carousel.addItems(app.buildOptionItem(requestsReceived[item]['paymentGatewayUrl'], [])
													  .setTitle("Request "+item)
													  .setDescription(requestsReceived[item]['requestSender']+" requesting $"+requestsReceived[item]['requestAmount']));
				  }
			  });
			  
			app.askWithCarousel('Yes. You have received a total of '+numRequested+' payment requests. See them below.', carousel);
		  }
		  else{
			app.setContext('anything-else');
			app.ask('Yes. You have received a total of '+numRequested+' payment requests. Is there anything else that I can do for you today?');
		  }
	  }
	  else{
		app.setContext('anything-else');
		app.ask('No. You do not have any pending payment requests. Is there anything else that I can do for you today?');
	  }
  });
  const sdk = new ActionsSdkApp({request, response});
  actionMap.set(sdk.StandardIntents.OPTION, () => {
	  app.ask(app.buildRichResponse()
			  .addSimpleResponse("Tap to view in browser")
			  .addSuggestionLink("Payment Request", app.getSelectedOption()));
  });
  app.handleRequest(actionMap);
});

