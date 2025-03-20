/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
define(['N/email', 'N/https', 'N/record', 'N/runtime', 'N/search', 'N/ui/serverWidget', 'N/url','N/file'],
    /**
     * @param{email} email
     * @param{https} https
     * @param{record} record
     * @param{runtime} runtime
     * @param{search} search
     * @param{serverWidget} serverWidget
     * @param{url} url,
     * @param{file} file
     */
    (email, https, record, runtime, search, serverWidget, url,file) => {
        /**
         * Defines the Suitelet script trigger point.
         * @param {Object} scriptContext
         * @param {ServerRequest} scriptContext.request - Incoming request
         * @param {ServerResponse} scriptContext.response - Suitelet response
         * @since 2015.2
         */
        const onRequest = (scriptContext) => {
            var form = serverWidget.createForm({
                title: "Authorization History",
              hideNavBar: true
            });
          var vin = scriptContext.request.parameters.vin;
           var operationvin =  form.addField({id:'operation_service_vin',label:'VIN',type:'text'});
          operationvin.defaultValue = vin;
          operationvin.updateDisplayType({displayType: serverWidget.FieldDisplayType.HIDDEN});
            var operationhtml =  form.addField({id:'operation_service_history',label:' ',type:'inlinehtml'});
            var fileobj = file.load({id:15882});
            var htmlcode = fileobj.getContents();
            operationhtml.defaultValue = htmlcode;
            scriptContext.response.writePage(form);
        }

        return {onRequest}

    });
