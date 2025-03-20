/**
 * @NApiVersion 2.x
 * @NScriptType MapReduceScript
 * @NModuleScope SameAccount
 
 */
define(['N/file', 'N/format', 'N/record', 'N/runtime', 'N/search'],
  /**
   * @param {file} file
   * @param {format} format
   * @param {record} record
   * @param {sftp} sftp
   * @param {runtime} runtime
   *
   */
  function (file, format, record, runtime, search) {


    function getInputData() {
      var objData = {
        "Mielage": 0,
        "Longtitude": 1,
        "Latitude": 2,
        "Odometer": 3,
        "Item": 4,
        "VIN": 5 

      }

      
      try {
        //custscript_bill_file_id
        var scriptobj = runtime.getCurrentScript();
        var fileid = scriptobj.getParameter({
          name: 'custscript_file_id'
        });

        var csvFile = file.load({
          id: fileid
        });
        var dataArr = csvToArr(csvFile.getContents());
        //READ CSV ARRAY DATA
        var arr = [];
        
        for (var i = 1; i < dataArr.length; i++) { 
          var obj = {}; 
		  
          obj.Mielage = dataArr[i][objData["Mielage"]];
          obj.Longtitude = dataArr[i][objData["Longtitude"]];
          obj.Latitude = dataArr[i][objData["Latitude"]];
          obj.Odometer = dataArr[i][objData["Odometer"]];
          obj.Item = dataArr[i][objData["Item"]];
          obj.VIN = dataArr[i][objData["VIN"]];  
          arr.push(obj); 
        }
 
        return arr;
      } catch (e) {
        log.debug('DATA INPUT: ERROR', e.toString()); 
      }

    }

    function map(context) {
      try {
        var transaction = JSON.parse(context.value);
       log.debug('transaction',transaction);
	  
        var objRecord = record.create({
          type: 'customrecord_goldstar_data',
          isDynamic: !0 
        });
        objRecord.setValue({
          fieldId: 'custrecord_gs_mileage',
          value: transaction.Mielage 
        });
        objRecord.setValue({
          fieldId: 'custrecord_gs_odometer',
          value: transaction.Odometer 
        });
		objRecord.setValue({
          fieldId: 'custrecord_gs_latitude',
          value: transaction.Latitude 
        });
		objRecord.setValue({
          fieldId: 'custrecord_gs_longitude',
          value: transaction.Longtitude 
        });
		objRecord.setText({
          fieldId: 'Item',
          text: transaction.Item 
        });
		objRecord.setText({
          fieldId: 'custrecord_gs_vin',
          text: transaction.VIN 
        });
		var googleurl = 'https://www.google.com/maps?q='+transaction.Latitude+','+transaction.Longtitude;
		objRecord.setValue({
          fieldId: 'custrecord_gs_location_map',
          value: googleurl
        });

		objRecord.save();
        context.write({
          key: transaction.VIN,
          value: JSON.stringify(transaction)
        })

      } catch (e) {
        log.debug('error in map', e.toString());
      }
    }
 



    //CSV to ARRAY
    function csvToArr(csv) {
      //csv to array
      var strData = csv,
        strDelimiter = ',';
      strDelimiter = strDelimiter || ',';

      var objPattern = new RegExp(
        // Delimiters.
        '(\\' +
        strDelimiter +
        '|\\r?\\n|\\r|^)' +
        // Quoted fields.
        '(?:"([^"]*(?:""[^"]*)*)"|' +
        // Standard fields.
        '([^"\\' +
        strDelimiter +
        '\\r\\n]*))',
        'gi'
      );

      var arrData = [
        []
      ];

      var arrMatches = null;

      while ((arrMatches = objPattern.exec(strData))) {
        var strMatchedDelimiter = arrMatches[1];

        if (strMatchedDelimiter.length && strMatchedDelimiter !== strDelimiter) {
          arrData.push([]);
        }

        var strMatchedValue;

        if (arrMatches[2]) {
          strMatchedValue = arrMatches[2].replace(new RegExp('""', 'g'), '"');
        } else {
          strMatchedValue = arrMatches[3];
        }

        arrData[arrData.length - 1].push(strMatchedValue);
      }
      //remove extra line with no data - in 1st column
      for (var i = 0; i < arrData.length; i++) {
        if (arrData[i][0].toString().trim() == '') {
          arrData.splice(i, 1);
          i--;
        }
      }
      return arrData;
    }

    return {
      getInputData: getInputData,
      map: map 
    };

  });