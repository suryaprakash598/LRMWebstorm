/**
 * @NApiVersion 2.1
 * @NScriptType MapReduceScript
 * @NModuleScope SameAccount
 */
define(['N/search', 'N/record', 'N/runtime', 'N/log','./advs_lib_util'],
    function (search, record, runtime, log, libUtil) {
        function getInputData() {
            return search.create({
                type: 'task', // Replace with your Task record type
                filters: [
                    ['custevent_advs_ptp_amount', 'isnotempty', ''],
                    'AND',
                    ['custevent_advs_lease_link', 'isnotempty', ''],
                    'AND',
                    ['company', 'isnotempty', ''],
                    'AND',
                    ['custevent_advs_ptp_status', 'anyof', libUtil.ptpstatus.notstarted],
                    'AND',
                    ['custevent_advs_mm_task_type', 'anyof', libUtil.tasktype.ptp],
                    'AND',
                    ['startdate', 'onorbefore', 'today']

                ],
                columns: [
                    search.createColumn({name:"internalid"}),
                    search.createColumn({name:"custevent_advs_ptp_amount"}),
                    search.createColumn({name:"custevent_advs_lease_link"}),
                    search.createColumn({name:"company"}),
                    search.createColumn({name:"custevent_advs_ptp_type"}),
                    search.createColumn({name:"custevent_advs_credit_card"}),
                    search.createColumn({name:"custevent_advs_pay_tried"}),
                    search.createColumn({name:"custevent_advs_pay_card"}),
                    search.createColumn({name:"custevent_advs_pay_method"}),
                    search.createColumn({name:"custevent_advs_abp_card_link"}),
                    search.createColumn({name:"custrecord_sc_type",join:"custevent_advs_abp_card_link"}),
                ]
            });
        }

        function map(context) {
            var searchResult = JSON.parse(context.value);
            log.debug("searchResult", searchResult);

            var taskId = searchResult.id;
            var amount = parseFloat(searchResult.values.custevent_advs_ptp_amount);
            var leaseId = searchResult.values.custevent_advs_lease_link.value;
            var customerId = searchResult.values.company.value;

            var creditcard = parseFloat(searchResult.values.custevent_advs_credit_card);
            var paytype = searchResult.values.custevent_advs_lease_link.value;
            var paymethod = searchResult.values.custevent_advs_pay_method.value;

            var paycardid = parseFloat(searchResult.values.custevent_advs_pay_card);

            var abbcardid = searchResult.values.custevent_advs_abp_card_link.value;
            var abbpaymentMethod = searchResult.values["custrecord_sc_type.custevent_advs_abp_card_link"]
                ? searchResult.values["custrecord_sc_type.custevent_advs_abp_card_link"].value
                : "";






            var invoiceMap = new Set();
            var amountByInvoice = {};
            var invoicesSearch = search.create({
                type: 'invoice',
                filters: [
                    ['custbody_advs_lease_head', 'anyof', leaseId],
                    'AND',
                    ['status', 'anyof', 'CustInvc:A'],
                    'AND',
                    ['amountremaining', 'greaterthan', '0']
                ],
                columns: [
                    search.createColumn({ name: 'internalid', sort: search.Sort.ASC }),
                    search.createColumn({ name: 'amountremaining' })
                ]
            });

            var invoices = invoicesSearch.run().getRange({ start: 0, end: 1000 });

            // Populate the map with invoice IDs and amounts
            invoices.forEach(function (invoice) {
                var invoiceId = invoice.id;
                var amountRemaining = parseFloat(invoice.getValue('amountremaining')) || 0;
                if (!isNaN(amountRemaining)) {
                    log.debug("Invoice ID: " + invoiceId, "Amount Remaining: " + amountRemaining);
                    invoiceMap.add(invoiceId);
                    amountByInvoice[invoiceId] = amountRemaining;
                } else {
                    log.error("Invalid Amount Remaining", "Invoice ID: " + invoiceId + ", Amount Remaining is NaN");
                }
            });

            log.debug("invoiceMap", Array.from(invoiceMap));

            var remainingAmount = amount;
            var paymentId;
            var appliedInvoices = [];
            try {
                if (invoices.length > 0) {



                    var paymentRecord = record.create({
                        type: record.Type.CUSTOMER_PAYMENT,
                        isDynamic: true
                    });
                    paymentRecord.setValue({
                        fieldId: 'customer',
                        value: customerId
                    });
                    paymentRecord.setValue({
                        fieldId: 'custbody_advs_lease_head',
                        value: leaseId
                    });
                    paymentRecord.setValue({
                        fieldId: 'custbody_advs_task_info',
                        value: taskId
                    });

                    if(abbcardid){
                        paymentRecord.setValue({
                            fieldId: 'paymentmethod',
                            value:""
                        });
                        paymentRecord.setValue({
                            fieldId: 'custbody_abp_payment_method',
                            value:abbpaymentMethod
                        });
                        paymentRecord.setValue({
                            fieldId: 'custbody_fd_abp_sc_select_pay',
                            value: abbcardid
                        });
                    }else{
                        paymentRecord.setValue({
                            fieldId: 'paymentmethod',
                            value: 1
                        });
                    }

                    /*if(paytype == 10 || paytype == 10){
                        paymentRecord.setValue({
                            fieldId: 'paymentmethod',
                            value: paymethod
                        });
                        paymentRecord.setValue({
                            fieldId: 'creditcard',
                            value: paycardid
                        });

                    }else{
                        paymentRecord.setValue({
                            fieldId: 'paymentmethod',
                            value: 1
                        });

                    }*/


                    var lineCount = paymentRecord.getLineCount({ sublistId: 'apply' });
                    var totalAmountApplied = 0;

                    log.debug("lineCount",lineCount);
                    for (var i = 0; i < lineCount; i++) {
                        var invoiceId = paymentRecord.getSublistValue({ sublistId: 'apply', fieldId: 'internalid', line: i });
                        var amountRemaining = amountByInvoice[invoiceId] || 0;

                        if (invoiceMap.has(invoiceId)) {
                            var applyAmount = Math.min(remainingAmount, amountRemaining);
                            remainingAmount -= applyAmount;
                            totalAmountApplied += applyAmount;
                            log.debug("applyAmount", "Invoice ID: " + invoiceId + ", Apply Amount: " + applyAmount);

                            paymentRecord.selectLine({ sublistId: 'apply', line: i });
                            paymentRecord.setCurrentSublistValue({
                                sublistId: 'apply',
                                fieldId: 'apply',
                                value: true
                            });
                            paymentRecord.setCurrentSublistValue({
                                sublistId: 'apply',
                                fieldId: 'amount',
                                value: applyAmount
                            });
                            paymentRecord.commitLine({ sublistId: 'apply' });
                /*            paymentRecord.setSublistValue({ sublistId: 'apply', fieldId: 'apply', line: i, value: true });
                            paymentRecord.setSublistValue({ sublistId: 'apply', fieldId: 'amount', line: i, value: applyAmount });*/

                            appliedInvoices.push(invoiceId);
                            log.debug("remainingAmount",remainingAmount);
                            if (remainingAmount <= 0) break; // Stop if no amount left to apply
                        }
                    }

                    if (totalAmountApplied > 0) {
                        paymentId = paymentRecord.save({ ignoreMandatoryFields: true, enableSourcing: true });
                    } else {
                        log.error({
                            title: 'No Amount Applied',
                            details: 'No amount applied to invoices for Task ID: ' + taskId
                        });
                    }
                }

                log.debug("paymentId", paymentId);
            } catch (e) {
                log.error({
                    title: 'Payment Creation Error',
                    details: 'Error creating payment for Task ID: ' + taskId + ', Error: ' + e.message
                });

                context.write({
                    key: taskId,
                    value: {
                        error: true,
                        errorMessage: e.message,
                        appliedInvoices: appliedInvoices,
                        leaseId: leaseId
                    }
                });
            }

            context.write({
                key: taskId,
                value: {
                    paymentId: paymentId,
                    appliedInvoices: appliedInvoices,
                    leaseId: leaseId
                }
            });
        }






        function reduce(context) {
            var taskId = context.key;
            var value = JSON.parse(context.values[0]);
            var paymentId = value.paymentId;
            var appliedInvoices = value.appliedInvoices.join(',');
            var leaseId = value.leaseId;
            var error = value.error;
            var errorMessage = value.errorMessage;

            if (error) {
                log.error({
                    title: 'Payment Creation Error',
                    details: 'Task ID: ' + taskId + ', Error: ' + errorMessage
                });

                record.submitFields({
                    type: 'task', // Replace with your Task record type
                    id: taskId,
                    values: {
                        // custevent_advs_ptp_status: libUtil.ptpstatus.rejected,
                        custevent_advs_crm_remark: 'Payment Creation Failed: ' + errorMessage,
                    }
                });
            } else if (paymentId) {

                var lookRec =   search.lookupFields({type:"task",id:taskId,columns:["custevent_advs_ptp_type","custevent_advs_pay_tried"]});
                var vinSubsi    =   lookRec["custevent_advs_ptp_type"][0].value;
                var payTried    =   lookRec["custevent_advs_pay_tried"]*1;
                payTried++;

                /*record.submitFields({
                    type: 'task', // Replace with your Task record type
                    id: taskId,
                    values: {
                        transaction: paymentId,
                        custevent_advs_ptp_status: libUtil.ptpstatus.processed,
                        status: "COMPLETE",
                        custevent_advs_pay_tried: payTried,
                        custevent_advs_ptp_payment_date:new Date()
                    }
                });*/
            } else {
                log.error({
                    title: 'Payment Creation Failed',
                    details: 'Task ID: ' + taskId
                });

                record.submitFields({
                    type: 'task', // Replace with your Task record type
                    id: taskId,
                    values: {
                        custevent_advs_crm_remark: 'Payment Creation Failed',
                    }
                });
            }
        }

        function summarize(summary) {
            summary.output.iterator().each(function (key, value) {
                log.audit({
                    title: 'Task Processed',
                    details: 'Task ID: ' + key + ' | Payment Details: ' + JSON.stringify(value)
                });
                return true;
            });

            if (summary.inputSummary.error) {
                log.error({
                    title: 'Input Error',
                    details: summary.inputSummary.error
                });
            }

            summary.mapSummary.errors.iterator().each(function (key, error) {
                log.error({
                    title: 'Map Error: Task ID ' + key,
                    details: error
                });
                return true;
            });

            summary.reduceSummary.errors.iterator().each(function (key, error) {
                log.error({
                    title: 'Reduce Error: Task ID ' + key,
                    details: error
                });
                return true;
            });
        }

        return {
            getInputData: getInputData,
            map: map,
            reduce: reduce,
            summarize: summarize
        };
    });
