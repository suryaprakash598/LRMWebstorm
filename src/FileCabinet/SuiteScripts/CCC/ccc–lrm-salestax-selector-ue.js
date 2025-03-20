/**
 * @NApiVersion 2.1
 * @NModuleScope SameAccount
 * @NScriptType UserEventScript
 * @author Elliott Weeks
 */
define(['N/record','N/query','N/search'],

    /**
     * @param {record} record
     * @param {query} query
     * @param {search} search
     */
    (record,query,search) => {

        /**
         * @param {AfterSubmitContext} context
         * @return {void}
         */
        const afterSubmit = context => {
            try {
                const {type, newRecord} = context;

                /** @type {string} */
                const customerId = newRecord.getValue({fieldId: 'custrecord_customer'});
                /** @type {{companyname: string, taxitem: {value: string, text: string}[]}} */
                const customerDetails = search.lookupFields({
                    type: record.Type.CUSTOMER,
                    id: customerId,
                    columns: ['companyname','taxitem']
                });
                log.audit('customerDetails', customerDetails);
                const rate = newRecord.getValue({fieldId: 'custrecord_lrm_tax_rate'});
                const state = newRecord.getValue({fieldId: 'custrecord_lrm_tax_state'});
                /** @type {string} */
                const lrmSalesTaxRecord = newRecord.getValue({fieldId: 'custrecord_tax_code'});
                const taxCode = search.lookupFields({
                    type: 'customrecord_lrm_sales_tax',
                    id: lrmSalesTaxRecord,
                    columns: ['custrecord_ccc_linked_netsuite_tax_code']
                }).custrecord_ccc_linked_netsuite_tax_code[0].value;
                log.audit('taxCOde',taxCode);
                if(customerDetails.taxitem[0]){

                    log.audit('customerDetailsHit');
                    const taxGroupRecord = record.load({
                        type: record.Type.TAX_GROUP,
                        id: customerDetails.taxitem[0].value,
                        isDynamic: true,
                    });
                    taxGroupRecord.setCurrentSublistValue({
                        sublistId: 'taxitem',
                        fieldId: 'taxname',
                        value: taxCode,
                    });
                    taxGroupRecord.commitLine({
                        sublistId: 'taxitem',
                    });
                    taxGroupRecord.save();
                }
                else {
                    const stateShortName = query.runSuiteQL({
                        query: `
                            SELECT 
                                shortname
                            FROM 
                                state
                            WHERE
                                id = ${state}
                        `
                    }).asMappedResults()[0].shortname;
                    const newTaxGroup = record.create({
                        type: record.Type.TAX_GROUP,
                        isDynamic: true,
                    });

                    newTaxGroup.setValue({
                        fieldId: 'itemid',
                        value: `${customerDetails.companyname}-${stateShortName}-${rate}`
                    });
                    newTaxGroup.setValue({
                        fieldId: 'state',
                        value: stateShortName
                    });
                    newTaxGroup.setValue({
                        fieldId: 'includechildren',
                        value: true
                    });
                    newTaxGroup.setCurrentSublistValue({
                        sublistId: 'taxitem',
                        fieldId: 'taxname',
                        value: taxCode,
                    });
                    newTaxGroup.commitLine({
                        sublistId: 'taxitem',
                    });

                    const linkedId = newTaxGroup.save();

                    record.submitFields({
                        type: newRecord.type,
                        id: newRecord.id,
                        values: {
                            custrecord_ccc_linked_netsuite_tax_group: linkedId
                        }
                    });
                    record.submitFields({
                        type: record.Type.CUSTOMER,
                        id: customerId,
                        values: {
                            taxitem: linkedId
                        }
                    });
                }



            } catch (e) {
                log.error('afterSubmit', e.toJSON ? e : (e.stack ? e.stack : e.toString()));
            }
        };

        return {
            afterSubmit,
        };
    },
);