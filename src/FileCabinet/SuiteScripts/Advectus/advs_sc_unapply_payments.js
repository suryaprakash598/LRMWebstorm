/**
 * @NApiVersion 2.1
 * @NScriptType ScheduledScript
 */
define(['N/record', 'N/search', 'N/log', 'N/task', 'N/runtime'],
    (record, search, log, task, runtime) => {

    const execute = (context) => {
        const customerPaymentSearch = search.create({
            type: "customerpayment",
            filters: [
                ["type", "anyof", "CustPymt"],
                "AND", ["mainline", "is", "F"],
                "AND", ["posting", "is", "F"],
                "AND", ["appliedtotransaction", "noneof", "@NONE@"],
                "AND", ["paymentmethod", "noneof", "EFT"],
            ],
            columns: [
                "internalid",
                "tranid",
                "custbody_advs_lease_head",
                "statusref"
            ]
        });

        const searchResults = customerPaymentSearch.run();
        let remainingUsage = runtime.getCurrentScript().getRemainingUsage();

        searchResults.each(result => {
            const paymentRecordId = result.getValue("internalid");
            const paymentRecord = record.load({
                type: 'customerpayment',
                id: paymentRecordId,
                isDynamic: true
            });

            const remainingAmount = paymentRecord.getValue('unapplied');
            const totalAmount = paymentRecord.getValue('amount');
            log.debug('Payment Details', `Payment ID: ${paymentRecordId}, Total: ${totalAmount}, Unapplied: ${remainingAmount}`);

            const lineCount = paymentRecord.getLineCount({ sublistId: 'apply' });
            for (let i = 0; i < lineCount; i++) {
                paymentRecord.selectLine({ sublistId: 'apply', line: i });
                paymentRecord.setCurrentSublistValue({
                    sublistId: 'apply',
                    fieldId: 'apply',
                    value: false
                });
                paymentRecord.commitLine({ sublistId: 'apply' });
            }

            paymentRecord.setValue('undepfunds', "T");
            paymentRecord.setValue('custbody_advs_is_pay_app_by_sc', true);
            const updatedRecordId = paymentRecord.save({ enableSourcing: true, ignoreMandatoryFields: true });

            log.debug('Updated Payment Record', `Record ID: ${updatedRecordId}`);

            remainingUsage = runtime.getCurrentScript().getRemainingUsage();
            if (remainingUsage < 2000) {
                const taskStatus = task.create({
                    taskType: task.TaskType.SCHEDULED_SCRIPT,
                    scriptId: runtime.getCurrentScript().id,
                    deploymentId: runtime.getCurrentScript().deploymentId
                }).submit();

                log.debug('Task Scheduled', `Status: ${taskStatus}`);
                return false; // Exit the search iteration
            }
            return true; // Continue iterating
        });
    };

    return { execute };
});
