/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 */
define(['N/record', 'N/search'], function (record, search) {
    function afterSubmit(context) {
        if (context.type !== context.UserEventType.CREATE) {
           // return;
        }

        var customerId = context.newRecord.id; // Get the customer ID

        try {

            var customerRecord = record.load({
                type: record.Type.CUSTOMER,
                id: customerId,
                isDynamic: true // Use dynamic mode for easier sublist manipulation
            });

            var _label =  customerRecord.getValue({fieldId:'custentity_advs_address_indi'});
            var city =  customerRecord.getValue({fieldId:'custentity_advs_city_indi'});
            var state =  customerRecord.getText({fieldId:'custentityadvs_state_indiv'});
            var zip =  customerRecord.getValue({fieldId:'custentity_advs_zip_indi'});
            var phone=  customerRecord.getValue({fieldId:'phone'});
            var phone2 =   customerRecord.getValue({fieldId:'altphone'});

            log.debug('_label', {'city':city,'state':state,'zip':zip,'phone':phone,'phone2':phone2});

            // Add a new line in the addressbook sublist
            customerRecord.selectNewLine({ sublistId: 'addressbook' });

            // Set default billing and shipping
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

            // Create subrecord for address details
            var addressSubrecord = customerRecord.getCurrentSublistSubrecord({
                sublistId: 'addressbook',
                fieldId: 'addressbookaddress'
            });
            //var stateshot = search.lookupFields({type:"state",id:state,columns:'shortname'});
            // Set address fields
            addressSubrecord.setValue({ fieldId: 'country', value: 'US' });
            addressSubrecord.setValue({ fieldId: 'addr1', value: _label });
            addressSubrecord.setValue({ fieldId: 'zip', value: zip });
            addressSubrecord.setText({ fieldId: 'state', text: state });
            addressSubrecord.setValue({ fieldId: 'city', value: city });
            addressSubrecord.setValue({ fieldId: 'addrphone', value: phone });

            // Commit the sublist line
            customerRecord.commitLine({ sublistId: 'addressbook' });

            // Save the customer record
            customerRecord.save();

            log.debug('Success', 'Customer address added successfully');
        } catch (error) {
            log.error('Error Adding Address', error);
        }
    }

    return {
        afterSubmit: afterSubmit
    };
});
