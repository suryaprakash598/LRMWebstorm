/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
define(['N/runtime', 'N/search', 'N/ui/serverWidget', 'N/redirect'],
    /**
     * @param{runtime} runtime
     * @param{search} search
     * @param{serverWidget} serverWidget
     */
    (runtime, search, serverWidget, redirect) => {
    /**
     * Defines the Suitelet script trigger point.
     * @param {Object} scriptContext
     * @param {ServerRequest} scriptContext.request - Incoming request
     * @param {ServerResponse} scriptContext.response - Suitelet response
     * @since 2015.2
     */
    const onRequest = (scriptContext) => {
        var request = scriptContext.request;
        var response = scriptContext.response;
        if (request.method == "GET") {
			var customerid = request.parameters.customer;
			var leaseid = request.parameters.leaseid;
              var invoiceSearchObj = search.create({
			   type: "invoice", 
			   filters:
			   [
				  ["name","anyof",customerid], 
				  "AND", 
				  ["mainline","is","T"], 
				  "AND", 
				  ["taxline","is","F"], 
				  "AND", 
				  ["shipping","is","F"], 
				  "AND", 
				  ["type","anyof","CustInvc"],  
				    "AND", 
				  ["custbody_advs_lease_head","anyof",leaseid],
				  "AND",
				  ["formulanumeric: CASE WHEN (ROUND({today} - {trandate})) >= 0 AND (ROUND({today} - {trandate})) <= 30 THEN 1 ELSE 0 END","equalto","1"]
			   ],
			   columns:
			   [
			    
				   "tranid",
				  "amount",
				  "trandate",
				  search.createColumn({
					 name: "formulanumeric",
					 formula: "CASE WHEN (ROUND({today} - {trandate})) >= 0 AND (ROUND({today} - {trandate})) <= 30 THEN ROUND({today} - {trandate}) ELSE 0 END"
				  }) 
			   ]
			});
			var searchResultCount = invoiceSearchObj.runPaged().count;
			log.debug("invoiceSearchObj result count",searchResultCount); 
			 

            redirect.toSearchResult({
			   search:invoiceSearchObj
		   });
        }
		 
	}
    return {
        onRequest
    }

});