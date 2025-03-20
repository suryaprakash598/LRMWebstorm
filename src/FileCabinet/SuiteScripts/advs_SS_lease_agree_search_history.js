/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
define(['N/log', 'N/record', 'N/redirect', 'N/search', 'N/url','N/ui/serverWidget','N/runtime','N/file'],
    /**
 * @param{log} log
 * @param{record} record
 * @param{redirect} redirect
 * @param{search} search
 * @param{url} url
 */
    (log, record, redirect, search, url,ui,runtime,file) => {
        /**
         * Defines the Suitelet script trigger point.
         * @param {Object} scriptContext
         * @param {ServerRequest} scriptContext.request - Incoming request
         * @param {ServerResponse} scriptContext.response - Suitelet response
         * @since 2015.2
         */
        const onRequest = (scriptContext) => {
           
         if (scriptContext.request.method === 'GET') {
            var curREc = scriptContext.request.parameters.curREc;
        
               var form = ui.createForm({title: 'Lease Statement History'});
               var FromDate =  form.addField({
                    id: 'custpage_start_date',
                    type: ui.FieldType.DATE,
                    label: 'FROM DATE'
                })
                FromDate.isMandatory = true;
                var Todate =  form.addField({
                    id: 'custpage_end_date',
                    type: ui.FieldType.DATE,
                    label: 'TO DATE'
                })
                Todate.isMandatory = true;
                form.addField({
                    id: 'custpage_cur_rec',
                    type: ui.FieldType.INTEGER,
                    label: 'Current Record',
                }).updateDisplayType({
                    displayType: ui.FieldDisplayType.HIDDEN
                }).defaultValue =curREc;

                form.addSubmitButton({
                    label: 'Generate Statement'
                });
    
                scriptContext.response.writePage(form);
            }
            else if (scriptContext.request.method === 'POST') {
                var startDate = scriptContext.request.parameters.custpage_start_date;
                var endDate = scriptContext.request.parameters.custpage_end_date;
                var currentRec = scriptContext.request.parameters.custpage_cur_rec;

                var redirectUrl = url.resolveScript({
                    scriptId: 'customscript_advs_ss_lease_sta_withdate', // Replace with your target script ID
                    deploymentId: 'customdeploy_advs_ss_lease_sta_withdate', 
                    params: {
                        cur_REc:currentRec,
                        start_date: startDate,
                        end_date: endDate,
                    }
                });

                redirect.redirect({
                    url: redirectUrl
                });
            }
        }

        return {onRequest}
        
    });
