/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
define(['N/format', 'N/log', 'N/record', 'N/runtime', 'N/search','N/ui/serverWidget','N/error','N/redirect','./advs_lib_rental_leasing','./advs_lib_util'],
    /**
 * @param{cache} cache
 */
    (format, log, record, runtime, search,serverWidget,error,redirect,liblease,libUtil) => {
        /**
         * Defines the Suitelet script trigger point.
         * @param {Object} scriptContext
         * @param {ServerRequest} scriptContext.request - Incoming request
         * @param {ServerResponse} scriptContext.response - Suitelet response
         * @since 2015.2
         */
        const onRequest = (scriptContext) => {
            var request		=	scriptContext.request;
            var response	=	scriptContext.response;
            if(request.method == "GET") {
                var dealID = request.parameters.recordid;

                var getunpaidTotal         =   liblease.getunPaidAmount(dealID);
                var unpaidTotal             =   getunpaidTotal.amountREmain;

                log.debug("unpaidTotal",unpaidTotal)

                var TollsInfor                =     liblease.getToll_Dam_cpc(dealID);
                var toll_Charge            =   TollsInfor.toll;
                var damage_charge          =   TollsInfor.damage;
                var cpc_charge           =   TollsInfor.cpc;
                toll_Charge =   toll_Charge*1;damage_charge =   damage_charge*1;cpc_charge =cpc_charge*1;



                record.submitFields({type:"customrecord_advs_lease_header",id:dealID,values:{
                    "custrecord_advs_l_a_toll_charge":toll_Charge,
                        "custrecord_advs_l_a_damage_amount":damage_charge,
                        "custrecord_advs_l_a_cpc_amnt":cpc_charge,
                        "custrecord_advs_l_a_unpaid_receiva":unpaidTotal,
                    }});



                var formName    =   "leasereturn";
                var getForminfo  =   liblease.getFormMapping(formName);
                var recordType   =   getForminfo[0].recordtype;
                var fromid   =   getForminfo[0].fromid;


                var PArabObj = {
                    "cf":fromid,
                    "ifrmcntnr":"T",
                    "isfromdash":true,

                };
                redirect.toRecord({
                    type: recordType, // Replace CUSTOMER with the appropriate record type
                    parameters:PArabObj,
                    id:dealID,
                    isEditMode:true
                });
            }
        }

        return {onRequest}

    });
