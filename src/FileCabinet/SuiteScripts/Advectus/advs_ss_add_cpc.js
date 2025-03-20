/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
define(['N/record', 'N/runtime', 'N/search','N/ui/serverWidget','N/url','N/redirect'],
    /**
 * @param{record} record
 * @param{runtime} runtime
 * @param{search} search
 */
    (record, runtime, search,serverWidget,url,redirect) => {
        /**
         * Defines the Suitelet script trigger point.
         * @param {Object} scriptContext
         * @param {ServerRequest} scriptContext.request - Incoming request
         * @param {ServerResponse} scriptContext.response - Suitelet response
         * @since 2015.2
         */
        const onRequest = (scriptContext) => {
            var request =   scriptContext.request;
            var response =   scriptContext.response;

            if(request.method == "GET"){
                var recid        =   request.parameters.recordid;
                var screentype   =   request.parameters.screentype;
                var cpcid       =   request.parameters.currentCpc;


                if(screentype == "add"){
                    var formName    =   "quickcpcadd";
                   var getForminfo  =    getFormMapping(formName);
                   var recordType   =   getForminfo[0].recordtype;
                    var fromid   =   getForminfo[0].fromid;


                    var PArabObj = {
                        "cf":fromid,
                        "ifrmcntnr":"T",
                        "leaseid":recid,

                        "isfromdash":true,

                    };
                    redirect.toRecord({
                        type: recordType, // Replace CUSTOMER with the appropriate record type
                        parameters:PArabObj
                    });

                }else{
                    var formName    =   "cpcclose";
                    var getForminfo  =    getFormMapping(formName);
                    var recordType   =   getForminfo[0].recordtype;
                    var fromid   =   getForminfo[0].fromid;


                    var PArabObj = {
                        "cf":fromid,
                        "ifrmcntnr":"T",
                        "leaseid":recid,

                        "isfromdash":true,

                    };
                    redirect.toRecord({
                        type: recordType, // Replace CUSTOMER with the appropriate record type
                        parameters:PArabObj,
                        id:cpcid,
                        isEditMode:true
                    });
                }
            }else{

            }
        }

        function getFormMapping(formName){

            var formMappingSearch = search.create({
                type: 'customrecord_advs_form_mapping',
                filters: [
                    ['isinactive', 'is', 'F'],
                    'AND',
                    ['custrecord_advs_fm_record_ref', 'is', formName]
                ],
                columns: [
                    'name',
                    'custrecord_advs_fm_std_record_ref',
                    'custrecord_advs_fm_entry_form_id',
                ]
            });

            var postJob = [];
            formMappingSearch.run().each(function(result) {
                var recordType = result.getValue('custrecord_advs_fm_std_record_ref');
                var formID = result.getValue('custrecord_advs_fm_entry_form_id');

                var obj = {};
                obj.recordtype = recordType;
                obj.fromid = formID;
                postJob.push(obj);

                return true;
            });

            return postJob;
        }



        return {onRequest}

    });
