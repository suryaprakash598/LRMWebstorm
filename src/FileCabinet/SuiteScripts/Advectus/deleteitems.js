/**
 * @NApiVersion 2.x
 * @NScriptType ScheduledScript
 */
define(['N/search', 'N/record'], function(search, record) {
    function execute(context) {
        try {
            
			var itemSearchObj = search.create({
				   type: "item",
				   filters:
				   [
					  ["isinactive","is","F"], 
					  "AND", 
					  ["created","within","7/29/2024 12:00 am","7/31/2024 11:59 pm"]
				   ],
				   columns:
				   [
					  "internalid" 
				   ]
				});
				 var itemId = '';
				itemSearchObj.run().each(function(result){
				   // .run().each has a limit of 4,000 results
				   itemId = result.getValue({name:'internalid'});
				   try{
					   record.delete({
						type: record.Type.INVENTORY_ITEM, // Change type if necessary
						id: itemId
					});

					log.audit({
						title: 'Item Deleted',
						details: 'Item with ID ' + itemId + ' has been deleted successfully.'
					});
				   }catch(e)
				   {
					   log.debug('err',e.toString())
				   }
				   
				   return true;
				});
            // Delete the record
            

        } catch (e) {
            log.error({
                title: 'Error Deleting Item',
                details: e.toString()
            });
        }
    }

    return {
        execute: execute
    };
});
