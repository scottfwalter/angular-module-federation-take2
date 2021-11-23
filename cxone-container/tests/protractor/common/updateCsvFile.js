function updateCsvFile(dataToUpdate, filePath) {
    var csv = require("fast-csv");
    var Converter = require("csvtojson");
    var fs = require("fs");
    var deferred = protractor.promise.defer();
    var random = protractor.testUtils.getRandomString();
    var csvStream = csv
            .format({headers: true}),
            writableStream = fs.createWriteStream(filePath);
        writableStream.on("finish", function () {
            console.log("DONE! and tenant name is ");
        });
        csvStream.pipe(writableStream);
    for (var i = 0; i < dataToUpdate.length; i++){
        csvStream.write(dataToUpdate[i]);
    }
    csvStream.end();
}
module.exports = {
    updateCsvFile: updateCsvFile
};