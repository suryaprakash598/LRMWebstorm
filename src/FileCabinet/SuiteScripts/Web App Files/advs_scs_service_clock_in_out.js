/**
 * @NApiVersion 2.1
 * @NScriptType Restlet
 */
define(['N/log', 'N/query', 'N/record', 'N/runtime', 'N/search'
        ,'/SuiteScripts/Web App Files/advs_lib_scs_service_clock_in_out.js'],
    /**
     * @param{log} log
     * @param{query} query
     * @param{record} record
     * @param{runtime} runtime
     * @param{search} search
     */
    (log, query, record, runtime, search,libWeb) => {
        /**
         * Defines the function that is executed when a GET request is sent to a RESTlet.
         * @param {Object} requestParams - Parameters from HTTP request URL; parameters passed as an Object (for all supported
         *     content types)
         * @returns {string | Object} HTTP response body; returns a string when request Content-Type is 'text/plain'; returns an
         *     Object when request Content-Type is 'application/json' or 'application/xml'
         * @since 2015.2
         */
        const get = (requestParams) => {

        }

        /**
         * Defines the function that is executed when a PUT request is sent to a RESTlet.
         * @param {string | Object} requestBody - The HTTP request body; request body are passed as a string when request
         *     Content-Type is 'text/plain' or parsed into an Object when request Content-Type is 'application/json' (in which case
         *     the body must be a valid JSON)
         * @returns {string | Object} HTTP response body; returns a string when request Content-Type is 'text/plain'; returns an
         *     Object when request Content-Type is 'application/json' or 'application/xml'
         * @since 2015.2
         */
        const put = (requestBody) => {

        }

        /**
         * Defines the function that is executed when a POST request is sent to a RESTlet.
         * @param {string | Object} requestBody - The HTTP request body; request body is passed as a string when request
         *     Content-Type is 'text/plain' or parsed into an Object when request Content-Type is 'application/json' (in which case
         *     the body must be a valid JSON)
         * @returns {string | Object} HTTP response body; returns a string when request Content-Type is 'text/plain'; returns an
         *     Object when request Content-Type is 'application/json' or 'application/xml'
         * @since 2015.2
         */
        const post = (requestBody) => {
            var flag    =   requestBody.flag;
            log.debug('Flag', flag)
            if(flag == 1 || flag == "1"){
                let clockInDetails   =     libWeb.getClockInDetails(requestBody);
                return clockInDetails;
            }else if(flag == 2 || flag == "2"){
                let clockOutDetails   =     libWeb.setClockOutDetails(requestBody);
                return clockOutDetails;
            }else if(flag == 3 || flag == "3"){
                let clockOutDetails   =     libWeb.setclockIN(requestBody);
                return clockOutDetails;
            }else if(flag == 4 || flag == "4"){
                let attachmentDetail   =     libWeb.setAttachment(requestBody);
                return attachmentDetail;
            }else if(flag == 5 || flag == "5"){
                let MechAttachmentDetail   =     libWeb.setMechanicRecommendation(requestBody);
                return MechAttachmentDetail;
            }else if(flag == 6 || flag == "6"){
                let UpdatedJob   =     libWeb.setCCCUpdate(requestBody);
                return UpdatedJob;
            }else if(flag == 7 || flag == "7"){
                let JobImages   =     libWeb.getJobImages(requestBody);
                return JobImages;
            }else if(flag == 8 || flag == "8"){
                let SetJobBreak   =     libWeb.setJobBreak(requestBody);
                return SetJobBreak;
            }else if(flag == 9 || flag == "9"){
                log.debug('Login')
                let getLogin   =     libWeb.getLogin(requestBody);
                return getLogin;
            }else if(flag == 10 || flag == "10"){
                let updatedClockIn   =     libWeb.setClockInDetails(requestBody);
                return updatedClockIn;
            }else if(flag == 11 || flag == "11"){
                let getInventory   =     libWeb.getInventoryDetails(requestBody);
                return getInventory;
            }else if(flag == 12 || flag == '12'){
                let getTechnicianRecomm   =     libWeb.getTechnicianRecommendation(requestBody);
                return getTechnicianRecomm;
            }
        }
        /**
         * Defines the function that is executed when a DELETE request is sent to a RESTlet.
         * @param {Object} requestParams - Parameters from HTTP request URL; parameters are passed as an Object (for all supported
         *     content types)
         * @returns {string | Object} HTTP response body; returns a string when request Content-Type is 'text/plain'; returns an
         *     Object when request Content-Type is 'application/json' or 'application/xml'
         * @since 2015.2
         */
        const doDelete = (requestParams) => {

        }

        return {get, put, post, delete: doDelete}

    });