/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 */
define(['N/ui/message', 'N/currentRecord'], function(message, currentRecord) {

    function pageInit(context) {
		var _currentRecord = context.currentRecord;
		var location = _currentRecord.getValue({fieldId:'location'});
		var CreateFrom = _currentRecord.getValue({fieldId:'custbody_thirdparty_vendor_bill'});
		 var recordType = _currentRecord.type; // Gets the record type
		         log.debug('Record Type:', recordType); 
        if (context.mode === 'copy' && location==8 &&  _currentRecord.type=='itemreceipt' ) {
            var myMsg = message.create({
                title: 'Important Notice',
                message: 'Please change the location before receive item.',
                type: message.Type.ERROR // Other types: SUCCESS, WARNING, ERROR
            });

            myMsg.show(); // Message disappears after 5 seconds
        }
		else if(location==8 &&  _currentRecord.type=='vendorbill'&& CreateFrom)
		{
			  var myMsg = message.create({
                title: 'Important Notice',
                message: 'Capitalization will not proceed until the location is updated and all items are received.',
                type: message.Type.ERROR // Other types: SUCCESS, WARNING, ERROR
            });

            myMsg.show(); // Message disappears after 5 seconds
		}
    }

    return {
        pageInit: pageInit
    };
});
