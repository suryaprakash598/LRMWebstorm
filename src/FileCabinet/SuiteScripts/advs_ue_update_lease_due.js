/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 */
define(['N/record', 'N/runtime', 'N/search'],
    /**
 * @param{record} record
 * @param{runtime} runtime
 * @param{search} search
 */
    (record, runtime, search) => {
        /**
         * Defines the function definition that is executed before record is loaded.
         * @param {Object} scriptContext
         * @param {Record} scriptContext.newRecord - New record
         * @param {string} scriptContext.type - Trigger type; use values from the context.UserEventType enum
         * @param {Form} scriptContext.form - Current form
         * @param {ServletRequest} scriptContext.request - HTTP request information sent from the browser for a client action only.
         * @since 2015.2
         */
        const beforeLoad = (scriptContext) => {

        }

        /**
         * Defines the function definition that is executed before record is submitted.
         * @param {Object} scriptContext
         * @param {Record} scriptContext.newRecord - New record
         * @param {Record} scriptContext.oldRecord - Old record
         * @param {string} scriptContext.type - Trigger type; use values from the context.UserEventType enum
         * @since 2015.2
         */
        const beforeSubmit = (scriptContext) => {
            var session = runtime.getCurrentSession();
            var newRec  =   scriptContext.newRecord;
            var leaseID = newRec.getValue({
                fieldId: 'custbody_advs_lease_head'
            });
            session.set({
                name: 'custparam_deal_card',
                value: leaseID
            });
        }

        /**
         * Defines the function definition that is executed after record is submitted.
         * @param {Object} scriptContext
         * @param {Record} scriptContext.newRecord - New record
         * @param {Record} scriptContext.oldRecord - Old record
         * @param {string} scriptContext.type - Trigger type; use values from the context.UserEventType enum
         * @since 2015.2
         */
        const afterSubmit = (scriptContext) => {
            var session = runtime.getCurrentSession();
            var dealId = session.get({
                name: 'custparam_deal_card'
            });
            if (dealId !== null && dealId !== '' && dealId !== undefined) {
                var recType = record.Type;


                try{
                var totalDue	=	getTotalDue(dealId);
               var invoiceDetails =  invoiceDetilsForCollection(dealId);

               log.debug("invoiceDetails",invoiceDetails+"=>"+totalDue);
                    log.debug("invoiceDetails2",invoiceDetails.amountdue+"=>"+invoiceDetails.duedate);

                var fieldsToUpdate = {
                    'custrecord_advs_l_a_ttl_amnt_du_frm_invo': invoiceDetails.amountdue,
                    'custrecord_advs_invoice_due_date': invoiceDetails.duedate,
                    'custrecord_advs_total_due_on_deal': totalDue,
                };
                record.submitFields({
                    type: 'customrecord_advs_lease_header',
                    id: dealId,
                    values: fieldsToUpdate,
                    options: {
                        enableSourcing: false,
                        ignoreMandatoryFields: true
                    }
                });
            } catch (e) {
                log.error({
                    title: 'Error in afterSubmit',
                    details: e
                });
            }
            }
        }

        function getTotalDue(Deal_id) {


            var totalDueSearch = search.create({
                type: "transaction",
                filters: [
                    /*["custbody_advs_type_of_payment", "noneof", "12", "7"],
                    "AND",
                    ["account", "anyof", "574"],
                    "AND",*/
                    [
                        [
                            ["type", "anyof", "CashRfnd", "CustDep", "CustPymt"],
                            "AND",
                            ["mainline", "is", "F"]
                        ],
                        "OR",
                        [
                            ["type", "anyof", "CustCred", "CustInvc"],
                            "AND",
                            ["mainline", "is", "T"]
                        ]
                    ],
                    "AND",
                    ["posting", "is", "T"],
                    "AND",
                    ["custbody_advs_lease_head", "anyof", Deal_id]
                ],
                columns: [
                    search.createColumn({
                        name: "amount",
                        summary: search.Summary.SUM
                    })
                ]
            });

            var totalDueAmount = 0;
            totalDueSearch.run().each(function(result) {
                totalDueAmount += parseFloat(result.getValue({ name: 'amount', summary: search.Summary.SUM }) || 0);
                return true;
            });
            return totalDueAmount;
        }
        function invoiceDetilsForCollection(Deal_id){
            var due_date = "";var Amount_due = 0;
            var invoiceSearchObj = search.create({
                type: "invoice",
                filters:
                    [
                        ["mainline","is","T"],
                        "AND",
                        ["type","anyof","CustInvc"],
                        "AND",
                        ["custbody_advs_lease_head","noneof","@NONE@"],
                        "AND",
                        ["amountremainingisabovezero","is","T"]
                        ,"AND",
                        ["custbody_advs_lease_head","anyof",Deal_id]

                    ],
                columns:
                    [
                        search.createColumn({
                            name: "trandate",
                            summary: "MIN",
                            label: "Date"
                        }),
                        search.createColumn({
                            name: "amountremaining",
                            summary: "SUM",
                            label: "Amount Remaining"
                        }),
                        search.createColumn({
                            name: "trandate",
                            summary: "MIN",
                            label: "Date"
                        })
                    ]
            });
            var searchResultCount = invoiceSearchObj.runPaged().count;
            invoiceSearchObj.run().each(function(result){
                Amount_due += result.getValue({  name: "amountremaining",
                    summary: "SUM"})*1;
                due_date = result.getValue({ name: "trandate",
                    summary: "MIN",});
                return true;
            });
            var postData    =   {};
            postData.amountdue  =   Amount_due;
            postData.duedate  =   due_date;

            return postData;
        }
        return {beforeLoad, beforeSubmit, afterSubmit}

    });
