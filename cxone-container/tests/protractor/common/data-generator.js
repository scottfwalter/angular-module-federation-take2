'use strict';

var fs = require('fs');

// filename: the name of the JSON file which contains the interactions metdata.
// tenantId: the name of the organization/tenantId
// userIds: an array of ids to set as the InitiatorUserUUID - it will be set in round robin in the initial object read by the JSON filename.
// 					set as undefined if no need
// callback: will be called once the function ends. path to fileName is relative to process.cwd().
var readRecords = function(filename, tenantId, userIds, callback){

	
	fs.readFile(filename, function(err, data) {


        if (err){
			console.log(err);
			throw err;
		}

        var interactions = JSON.parse(data);
				var currentUserIndex = 0;
				var idsCount = 0;

				if(userIds != undefined){
						idsCount = userIds.length;
				}

				interactions.interactions.forEach(function(item, index) {

					// change tenant ID
					if(tenantId != undefined){
						item.TenantName = tenantId;
					}
					// change user IDs
					if(userIds != undefined){

						item.InitiatorUserUUID = userIds[currentUserIndex%idsCount];
						console.log("Changing user UUID to: " + userIds[currentUserIndex%idsCount]);
						currentUserIndex++;

					}

				});

        callback(interactions);
				console.log(interactions.interactions);

	});

 }

module.exports.readRecords = readRecords;
