
const https = require("https");
const Request = require("request");


// secretKey: 'aiTjeKsnFeI63R9lJbIvKrZC4IEwXPLPrvOar5PqXrA=',
// salt: 'abcde',
// thirdPartyAccessId: 'CA1TAtqqsdGagfAM'

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


// getToken("i3AiQM4zeEVqjF+M14razZV7FboGl/7DnGd7kcV1wNo=", "abcde", "CA1TAtqqsdGagfAM", (error, results) => {
//    if (error) console.log(error.message);
//    console.log(results);
// });

// accessToken: 'Bearer 46804544-c112-4614-8222-1658ab78e11f',
// thirdPartyAccessId: 'CA1TAtqqsdGagfAM',
// requestId: 'requestId123',
// deviceId: 'deviceId123',
// apiRegistrationId: 'CA1ARsACPZwNSGxr'

// addContactByEmail('J Nazarenko', 'jnazaren@outlook.com', 'Bearer 46804544-c112-4614-8222-1658ab78e11f', 
// 'CA1TAtqqsdGagfAM', 'requestId125', 'deviceId125', 'CA1ARsACPZwNSGxr', (error, results)=>{
//   if (error) console.log(error.message);
//     let { contractId, contactHash } = results;
//     console.log(results);
// });

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


function addContactByPhone(name, phone, token, thirdParty, requestid, deviceid, apiReg, callback) {

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
            "handle": phone,
            "handleType": "sms",
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

function deleteContact(contactid, token, thirdParty, requestid, deviceid, apiReg, callback) {
    
    return Request.delete({
        "headers" : {
            "content-type" : "application/json",
            "contactId" : contactid,
            "accessToken" : token,
            "thirdPartyAccessId" : thirdParty,
            "requestId" : requestid,
            "deviceId" : deviceid,
            "apiRegistrationId" : apiReg
        },
        "url": "https://gateway-web.beta.interac.ca/publicapi/api/v2/contacts/" + contactid
    }, (error, response, body) => {
        if(error) {
            console.dir(error);
            callback(error);
        }			
        callback(null, JSON.parse(body));
    });
}

// all dates MUST be in the following format: "2018-01-30T16:12:12.721Z"
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
              "requesterMessage": "This request was made by " + name + " through Google Assistant",
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

function generateRandomId(length = 15){
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    
    
    for (var i = 0; i < length; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));
  
    return text;
}

// createRequestByEmail(
//     "Bearer 46804544-c112-4614-8222-1658ab78e11f", 
//     "CA1TAtqqsdGagfAM", 
//     "request1234", 
//     "request1234", 
//     "CA1ARsACPZwNSGxr", 
//     "CA7YfcMyZY3W", 
//     "d4e87e47f6c1334ebf5f1f6de1da9988", 
//     "J Nazarenko", 
//     "jnazaren@outlook.com", 
//     20.0,
//     generateRandomId(),
//     "2018-04-20T16:12:12.721Z",
//     (error, results) => {
//         console.log(results);
// });


function createRequestByPhone(token, thirdParty, requestid, deviceid, apiReg, contactid, contacthash, 
    name, phone, amount, randomid, expirydate, callback) {

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
                    "handle": phone,
                    "handleType": "phone",
                    "active": true
                    }
                ]
                },
                "amount": amount,
                "currency": "CAD",
                "editableFulfillAmount": false,
                "requesterMessage": "This request was made by " + name + " through Google Assistant",
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

// getAllRequests("CA1MRSwVpG5T", "Bearer 80f5e54f-5fc9-4d16-b8ad-0a78c2a36fd9", 'CA1TA7BkrAB5DYmY', 'request123', 'device123', "CA1ARdxwfqqJXKzU", (error, results) => {
// 					  console.log(results);
// 				  });


//getAllRequests("Bearer 80f5e54f-5fc9-4d16-b8ad-0a78c2a36fd9", "CA1TA7BkrAB5DYmY", "request123", "device123", "CA1ARdxwfqqJXKzU", (error, results) => {
//	console.log(results);
//});

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

// ------------------------ FUNCTION CALLS ---------------------------------

// addContactByEmail('123456', 'jnazaren@gmail.com', 'Bearer cf1e3abf-510d-4bcc-8aaf-8b8d129d7ebb', 
// 'CA1TAtqqsdGagfAM', 'requestId124', 'deviceId124', 'CA1ARsACPZwNSGxr', (error, results)=>{
//    if (error) console.log(error.message);
//     let { contractId, contactHash } = results;
//     console.log(results);
// });
