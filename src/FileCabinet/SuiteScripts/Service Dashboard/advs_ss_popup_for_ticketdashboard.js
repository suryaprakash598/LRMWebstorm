/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 * @NModuleScope SameAccount
 */
define(['N/record', 'N/runtime', 'N/search', 'N/ui/serverWidget','N/redirect','N/url'],
    /**
 * @param{record} record
 * @param{runtime} runtime
 * @param{search} search
 * @param{serverWidget} serverWidget
 */
    (record, runtime, search, serverWidget,redirect,url) => {
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

            if(scriptContext.request.method == "POST"){
                var custparam_so = scriptContext.request.parameters.custparam_so;
                var custparam_comment = scriptContext.request.parameters.custparam_comment;
                log.debug("custparam_so",custparam_so)
                log.debug("custparam_comment",custparam_comment)
                if(custparam_so){
                    record.submitFields({
                        type: 'salesorder',
                        id: custparam_so,
                        values: {'custbody_advs_service_quote_memo': custparam_comment},
                        options: {
                            enableSourcing: false,
                            ignoreMandatoryFields: true
                        }
                    });
                }
                response.write(JSON.stringify({ success: true, message: 'Comment added successfully' }));
            }
        }
        return {onRequest}

    });



                  //   var SalesRecObj = record.load({
                //       type: 'salesorder',
                //       id: custparam_so,
                //       isDynamic: true
                //   });
                //   SalesRecObj.setValue('custbody_advs_service_quote_memo',custparam_comment);
                //   var RecordId = SalesRecObj.save({enableSourcing: true,ignoreMandatoryFields: true});
                 // log.debug("RecordId",RecordId)


                // var ordetcomments = request.parameters.custpage_comments;
                // var ordetid = request.parameters.custpage_so;
                // var JOBid = request.parameters.custpage_job;
                 // var ordid  =   request.parameters.custparam_id;
                // var jobid  =   request.parameters.custparam_jobid;

                // log.debug("ordetcomments",ordetcomments)
                // log.debug("JOBid",JOBid)

                // record.submitFields({
                //     type: 'customrecord_advs_task_record',
                //     id: JOBid,
                //     values: {'custrecord_advs_at_r_t_supervisor_commen': ordetcomments},
                //     options: {
                //         enableSourcing: false,
                //         ignoreMandatoryFields: true
                //     }
                // });

         
                // var onclickScript=" <html><body> <script type='text/javascript'>" +
                // "try{" ;
                
                // onclickScript+="window.parent.location.reload();";
                // onclickScript+="window.close();;";
                // onclickScript+="}catch(e){alert(e+'   '+e.message);}</script></body></html>";
                // response.write(onclickScript);
                    //     var form = serverWidget.createForm({
                    //         title: 'comments',
                    //         hideNavBar:true
                    //     });
                    //     form.addField({
                    //         id: 'custpage_comments',
                    //         type: serverWidget.FieldType.TEXTAREA,
                    //         label: 'comments'
                    //     });
                    //    var orderFld= form.addField({
                    //         id: 'custpage_so',
                    //         type: serverWidget.FieldType.SELECT,
                    //         label: 'WORK ORDER',
                    //         source:'transaction'
                    //     }).updateDisplayType({
                    //         displayType: serverWidget.FieldDisplayType.HIDDEN
                    //     });
                    //     if(ordid){
                    //         orderFld.defaultValue = ordid;
                    //     }

                    //     var jobFld= form.addField({
                    //         id: 'custpage_job',
                    //         type: serverWidget.FieldType.SELECT,
                    //         label: 'job',
                    //         source:'customrecord_advs_task_record'
                    //     }).updateDisplayType({
                    //         displayType: serverWidget.FieldDisplayType.HIDDEN
                    //     });
                    //     if(jobid){
                    //         jobFld.defaultValue = jobid;
                    //     }


                    //     form.addSubmitButton({
                    //         label: 'Submit'
                    //     });
           
           // else {
                
           // }
      