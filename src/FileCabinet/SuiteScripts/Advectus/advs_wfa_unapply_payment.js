/**
 * @NApiVersion 2.1
 * @NScriptType WorkflowActionScript
 */
define(['N/record', 'N/log'], (record, log) => {

    const onAction = (scriptContext) => {
        try {
            // Ensure the record is valid
            const paymentRecord = scriptContext.newRecord;
            const paymentId = paymentRecord.id;

            if (!paymentId) {
                log.error('Invalid Record Context', 'Record ID is missing');
                return;
            }

            log.debug('Starting Workflow Action', `Processing Payment ID: ${paymentId}`);

            // Load the Customer Payment record
            const loadedRecord = record.load({
                type: record.Type.CUSTOMER_PAYMENT,
                id: paymentId,
                isDynamic: true
            });

            const remainingAmount = loadedRecord.getValue('unapplied');
            const paymentMethod = loadedRecord.getValue('paymentmethod');
            const totalAmount = loadedRecord.getValue('amount');
            const lineCount = loadedRecord.getLineCount({ sublistId: 'apply' });

            log.debug('Payment Details', {
                paymentMethod,
                remainingAmount,
                totalAmount,
                lineCount
            });

            // Validate line count
            if (lineCount === 0) {
                log.error('No Lines to Process', 'The "apply" sublist has no lines.');
                return;
            }

            // Loop through all lines and mark them as not applied
            for (let i = 0; i < lineCount; i++) {
                loadedRecord.selectLine({ sublistId: 'apply', line: i });
                loadedRecord.setCurrentSublistValue({
                    sublistId: 'apply',
                    fieldId: 'apply',
                    value: false
                });
            }

            // Update fields
            loadedRecord.setValue('undepfunds', 'T'); // Use 'T' (string) for true
            loadedRecord.setValue('custbody_advs_is_pay_app_by_schd', true);

            // Save the record
            const updatedPaymentId = loadedRecord.save({
                enableSourcing: true,
                ignoreMandatoryFields: true
            });

            log.debug('Payment Updated Successfully', `Updated Payment ID: ${updatedPaymentId}`);
        } catch (error) {
            log.error('Error in Workflow Action Script', {
                message: error.message,
                stack: error.stack
            });
        }
    };

    return {
        onAction
    };
});
