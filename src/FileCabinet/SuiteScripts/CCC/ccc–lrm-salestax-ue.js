/**
 * @NApiVersion 2.1
 * @NModuleScope SameAccount
 * @NScriptType UserEventScript
 * @author Elliott Weeks
 */
define(['N/record','N/search','N/query'],

    /**
     * @param {record} record
     * @param {search} search
     * @param {query} query
     */
    (record,search,query) => {

        /**
         * @param {AfterSubmitContext} context
         * @return {void}
         */
        const afterSubmit = context => {
            try {
                const {type, newRecord} = context;

                if(type === context.UserEventType.CREATE) {
                    const taxName = newRecord.getValue({fieldId: 'name'});
                    const rate = newRecord.getValue({fieldId: 'custrecord_rate'});
                    const state = newRecord.getValue({fieldId: 'custrecord_scs_state'});
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
                    /** @type {number} */
                    const taxAgency = query.runSuiteQL({
                        query: `SELECT
                                  n.taxagency
                                FROM Nexus n
                                JOIN state s ON s.shortname = n.state
                                WHERE s.shortname = '${stateShortName}' `
                    }).asMappedResults()[0].taxagency;
                    const taxType = newRecord.getValue({fieldId: 'custrecord_lrm_tax_type'});
                    const taxCodeRecord = record.create({
                        type: record.Type.SALES_TAX_ITEM,
                        isDynamic: true,
                    });

                    taxCodeRecord.setValue({
                        fieldId: 'itemid',
                        value: taxName
                    });
                    taxCodeRecord.setValue({
                        fieldId: 'rate',
                        value: rate
                    });
                    taxCodeRecord.setValue({
                        fieldId: 'taxtype',
                        value: taxType
                    });
                    taxCodeRecord.setValue({
                        fieldId: 'taxagency',
                        value: taxAgency
                    });
                    taxCodeRecord.setValue({
                        fieldId: 'state',
                        value: stateShortName
                    });

                    const taxCodeSavedId = taxCodeRecord.save()

                    record.submitFields({
                        type: newRecord.type,
                        id: newRecord.id,
                        values: {
                            custrecord_ccc_linked_netsuite_tax_code: taxCodeSavedId
                        }
                    });
                }
                else if(type === context.UserEventType.EDIT) {
                    /** @type {string} */
                    const taxCodeRecord = newRecord.getValue({fieldId: 'custrecord_ccc_linked_netsuite_tax_code'});
                    /** @type {number} */
                    const rate = newRecord.getValue({fieldId: 'custrecord_rate'});
                    record.submitFields({
                        type: record.Type.SALES_TAX_ITEM,
                        id: taxCodeRecord,
                        values: {
                            rate: rate
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