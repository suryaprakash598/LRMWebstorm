/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
define(['N/log', 'N/record', 'N/runtime', 'N/search', 'N/url','./advs_lib_dashboard','N/ui/serverWidget'],
    /**
 * @param{log} log
 * @param{record} record
 * @param{runtime} runtime
 * @param{search} search
 * @param{url} url
 */
    (log, record, runtime, search, url,libDash,serverWidget) => {
        /**
         * Defines the Suitelet script trigger point.
         * @param {Object} scriptContext
         * @param {ServerRequest} scriptContext.request - Incoming request
         * @param {ServerResponse} scriptContext.response - Suitelet response
         * @since 2015.2
         */
        const onRequest = (scriptContext) => {
            var request   =   scriptContext.request;
            var response =   scriptContext.response;

            if(request.method == "GET"){
                var custid  = request.parameters.custid;
                var from    = request.parameters.from;
                var to      = request.parameters.to;

                // log.debug("start_Suit",from+"=>"+from+"=>"+to);
                var form    =   serverWidget.createForm({title:" "});

                var htmlFld =   form.addField({id:"custpage_html",label:" ",type:"inlinehtml"});
                var htmlData    =   libDash.generateFirstHtml(request,custid,from,to);

                htmlFld.defaultValue = htmlData;

                form.clientScriptModulePath = "./advs_cs_collection_dashboard.js";
                response.writePage(form);
            }

        }

        return {onRequest}

    });
