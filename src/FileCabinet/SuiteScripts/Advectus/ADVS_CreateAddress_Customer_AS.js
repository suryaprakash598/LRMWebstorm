/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 */
define(['N/log'], function (log) {
    function beforeSubmit(context) {
        if (context.type !== context.UserEventType.CREATE && context.type !== context.UserEventType.EDIT) {
            return;
        }

        try {
            let customerRecord = context.newRecord;
            var _label =  customerRecord.getValue({fieldId:'custentity_advs_address_indi'});
            var city =  customerRecord.getValue({fieldId:'custentity_advs_city_indi'});
            var state =  customerRecord.getValue({fieldId:'custentityadvs_state_indiv'});
            var zip =  customerRecord.getValue({fieldId:'custentity_advs_zip_indi'});
            var phone=  customerRecord.getValue({fieldId:'phone'});
            var phone2 =   customerRecord.getValue({fieldId:'altphone'});


            let addressExists = false;
            let addressCount = customerRecord.getLineCount({ sublistId: 'addressbook' });

            // Check if an address with a specific label already exists
            for (let i = 0; i < addressCount; i++) {
                let label = customerRecord.getSublistValue({
                    sublistId: 'addressbook',
                    fieldId: 'label',
                    line: i
                });
                if (label === 'Main Address') {
                    addressExists = true;
                    break;
                }
            }

            if (!addressExists) {
                // Add new address
                customerRecord.selectNewLine({ sublistId: 'addressbook' });

                customerRecord.setCurrentSublistValue({
                    sublistId: 'addressbook',
                    fieldId: 'defaultbilling',
                    value: true
                });

                customerRecord.setCurrentSublistValue({
                    sublistId: 'addressbook',
                    fieldId: 'defaultshipping',
                    value: true
                });

                let addressSubrecord = customerRecord.getCurrentSublistSubrecord({
                    sublistId: 'addressbook',
                    fieldId: 'addressbookaddress'
                });

                addressSubrecord.setValue({ fieldId: 'country', value: 'US' });
                addressSubrecord.setValue({ fieldId: 'addr1', value: _label });
                addressSubrecord.setValue({ fieldId: 'zip', value: zip });
                addressSubrecord.setValue({ fieldId: 'state', value: state });
                addressSubrecord.setValue({ fieldId: 'city', value: city });
                addressSubrecord.setValue({ fieldId: 'addrphone', value: phone });

                customerRecord.commitLine({ sublistId: 'addressbook' });

                log.debug('Success', 'Address added to customer before submit');
            } else {
                log.debug('Info', 'Address already exists, skipping.');
            }
        } catch (error) {
            log.error('Error in beforeSubmit', error);
        }
    }

    return {
        beforeSubmit: beforeSubmit
    };
});
