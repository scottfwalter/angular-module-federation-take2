'use strict';

var AWS = require('aws-sdk');
AWS.config.update({accessKeyId: 'AKIAIMFX76YO3X5JFHFQ', secretAccessKey: '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'});

AWS.config.update({region: 'us-west-2'});

var kinesis = new AWS.Kinesis();

var insertRecordsToStream = function(streamName, partition, records, callback){

  var params = {
    Records: [ /* required */
      {
        Data: JSON.stringify(records), /* required */
        PartitionKey: partition /* required */
      }
      /* more items */
    ],
    StreamName: streamName /* required */
  };

  kinesis.putRecords(params, function(err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    else {
      console.log(data);
      callback(data);
    }              // successful response
  });

}

module.exports.insertRecordsToStream = insertRecordsToStream;
