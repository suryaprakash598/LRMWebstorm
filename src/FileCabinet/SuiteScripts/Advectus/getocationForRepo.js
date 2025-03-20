/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
define(['N/record', 'N/runtime', 'N/search', 'N/ui/serverWidget', 'N/url','N/https'],
    /**
     * @param{record} record
     * @param{runtime} runtime
     * @param{search} search
     * @param{serverWidget} serverWidget
     */
    (record, runtime, search, serverWidget, url,https) => {
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
			var goldstar = [];
             var vin = scriptContext.request.parameters.custpage_vin; 
			 var endpoint = "https://services.spireon.com/v0/rest/assets?vin="+vin; 
			 log.debug('endpoint',endpoint);
			 //var username = "SpireonIntegration@LRMLeasing.com";
			 //var Password = "GCENHD0wCN1VkKBGi7aWeXCRqR2MZR51";
			var basickey ="Basic U3BpcmVvbkludGVncmF0aW9uQExSTUxlYXNpbmcuY29tOkdDRU5IRDB3Q04xVmtLQkdpN2FXZVhDUnFSMk1aUjUx";
			var headerObj= {
				"X-Nspire-AppToken": "2df6057a-8ce8-48bc-8689-0b4b4d06cdba" ,
				"Authorization":basickey,
				"Accept": "*/*"
			  };
			  
				https.get.promise({
					url: endpoint,//'https://services.spireon.com/v0/rest/assets?vin=1HTMMMML4JH096416',
					headers: headerObj
				})
					.then(function(response1){
						 var obj ={};
						 
						
						log.debug({
							title: 'Response',
							details: response1
						});
						log.debug('response1',response1.body);
						var goldstardata = JSON.parse(response1.body);
						var count = goldstardata.count;
						log.debug('count',count); 
						log.debug('count',goldstardata.content[count-1]);
						var lastlocation = goldstardata.content[count-1].lastLocation;
						log.debug('lastlocation',lastlocation);
						obj.lat = lastlocation.lat;
						obj.lng = lastlocation.lng;
						obj.odometer = goldstardata.content[count-1].odometer;
						goldstar.push(obj);
						response.write(JSON.stringify(goldstar));
					})
					.catch(function onRejected(reason) {
						log.debug({
							title: 'Invalid Get Request: ',
							details: reason
						});
						response.write(reason);
					})
				
        } 
    }

   
    return {
        onRequest
    }

});