/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
define(['N/runtime', 'N/ui/serverWidget','N/search','N/url','N/https'],
    /**
 * @param{runtime} runtime
 * @param{serverWidget} serverWidget
 */
    (runtime, serverWidget,search,url,https) => {
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
                var type    =   request.parameters.custparam_type;
                if(type == 1){
                    var onclickScript=" <html><body> <script type='text/javascript'>" +
                        "try{" +
                        "";

                    onclickScript+="window.parent.location.reload();";
                    onclickScript+="}catch(e){alert(e+'   '+e.message);}</script></body></html>";

                    response.write(onclickScript);
                }else if(type == 2){
                 

                }
            }
        }

        return {onRequest}

    });
