/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
define(['N/record', 'N/runtime', 'N/search', 'N/ui/serverWidget', 'N/url','N/https','N/email'],
    /**
     * @param{record} record
     * @param{runtime} runtime
     * @param{search} search
     * @param{serverWidget} serverWidget
     */
    (record, runtime, search, serverWidget, url,https,email) => {
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
			 try{
				 var goldstar_coordinates = scriptContext.request.parameters.custpage_coordinates;
				 var repocompany = scriptContext.request.parameters.custpage_repocompany;
				 //goldstar_coordinates = goldstar_coordinates.split(',');
				 var gmap ="http://maps.google.com/maps?q="+goldstar_coordinates;
				 var url = '<a href="'+gmap+'">Vehicle Location</a>';
				var emailadd= search.lookupFields({type:'customrecord_repo_company',id:repocompany,columns:['custrecord_repo_company_email']});
				 email.send({
						author:6, //surya
						recipients:emailadd.custrecord_repo_company_email,
						subject:'Testsub',
						body:'Hi, Please find the attached vehicle location coordinates link: '+url,
						//attachments:[fileObj],
						relatedRecords:{
							//entityId:recipientId,
							customRecord:{id:repocompany,recordType:'customrecord_repo_company'}
							}
						});
				 
			 }catch(e)
			 {
				 log.debug('error',e.toString());
			 }
        } 
    }

   
    return {
        onRequest
    }

});