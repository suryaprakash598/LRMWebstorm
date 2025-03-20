/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 */
define(['N/runtime', 'N/search', 'N/record'],
    /**
     * @param{runtime} runtime
     */
    (runtime, search, record) => {

    /**
     * Defines the function definition that is executed before record is loaded.
     * @param {Object} scriptContext
     * @param {Record} scriptContext.newRecord - New record
     * @param {string} scriptContext.type - Trigger type; use values from the context.UserEventType enum
     * @param {Form} scriptContext.form - Current form
     * @param {ServletRequest} scriptContext.request - HTTP request information sent from the browser for a client action only.
     * @since 2015.2
     */
    const beforeLoad = (scriptContext) => {}

    /**
     * Defines the function definition that is executed before record is submitted.
     * @param {Object} scriptContext
     * @param {Record} scriptContext.newRecord - New record
     * @param {Record} scriptContext.oldRecord - Old record
     * @param {string} scriptContext.type - Trigger type; use values from the context.UserEventType enum
     * @since 2015.2
     */
    const beforeSubmit = (scriptContext) => {}

    /**
     * Defines the function definition that is executed after record is submitted.
     * @param {Object} scriptContext
     * @param {Record} scriptContext.newRecord - New record
     * @param {Record} scriptContext.oldRecord - Old record
     * @param {string} scriptContext.type - Trigger type; use values from the context.UserEventType enum
     * @since 2015.2
     */
    const afterSubmit = (scriptContext) => {

        var CurrentRecord1 = scriptContext.newRecord;
			
        var Recid = CurrentRecord1.id;
        var recType = CurrentRecord1.type;
        log.debug(" * Type * ", recType + " * Id * " + Recid)
        var obj = {};
		var CurrentRecord = record.load({type:recType,id:Recid,isDynamic:!0});
        if (true) { //scriptContext.type == "create" || scriptContext.type == "edit" || scriptContext.type == "xedit"
            var modelYr = CurrentRecord.getValue({
                fieldId: 'custrecord_advs_vm_model_year'
            })
                var Mileagedt = CurrentRecord.getValue({
                    fieldId: 'custrecord_advs_vm_mileage'
                })
                var modelId = CurrentRecord.getValue({
                    fieldId: 'custrecord_advs_vm_model'
                })
                var cabconfig = CurrentRecord.getValue({
                    fieldId: 'custrecord_advs_cab_config1'
                })
                var dayssinceready = CurrentRecord.getValue({
                    fieldId: 'custrecord_advs_aging_days_ready'
                })
                var locId = CurrentRecord.getValue({
                    fieldId: 'custrecord_advs_vm_location_code'
                })
                //vindiscountData
                /*1)	Model year = 2019 & Cab Config is 125.   Discount $300
                2)	Model year = 2019 to 2020 & days since ready >75 days.  Discount is $500
                3)	Model = M2 & Location is Florida. Discount is $200.
                4)	Model = M2 & Location is Texas.  Discount is $100.
                5)	Mileage > 850,000 and Cab Config is 125 and year is 2018.  Discount is $400 */

                var incepdiscount = 0;
            var vindiscountData = discountsetup();
			log.debug('vindiscountData',vindiscountData);
			log.debug('modelYr',modelYr);
			log.debug('Mileagedt',Mileagedt);
			log.debug('modelId',modelId);
			log.debug('cabconfig',cabconfig);
			log.debug('dayssinceready',dayssinceready);
			log.debug('locId',locId);
            for (var vd = 0; vd < vindiscountData.length; vd++) {

                if (modelYr == vindiscountData[vd].year && cabconfig == vindiscountData[vd].cabconfig && vindiscountData[vd].model == '' && vindiscountData[vd].mileage == '' && vindiscountData[vd].dayssinceready == '' && vindiscountData[vd].location == '') {
                    log.debug('case1')
                    incepdiscount = vindiscountData[vd].amount;
                    break;
                } else if (modelYr == vindiscountData[vd].year && dayssinceready > vindiscountData[vd].dayssinceready && vindiscountData[vd].model == '' && vindiscountData[vd].mileage == '' && vindiscountData[vd].cabconfig == '' && vindiscountData[vd].location == '') {
                    log.debug('case2')
                   incepdiscount = vindiscountData[vd].amount;
                    break;
                } else if (modelId == vindiscountData[vd].model && locId == vindiscountData[vd].location && vindiscountData[vd].dayssinceready == '' && vindiscountData[vd].mileage == '' && vindiscountData[vd].cabconfig == '' && vindiscountData[vd].year == '') {
                    log.debug('case3')
                    incepdiscount = vindiscountData[vd].amount;
                    break;
                } else if (Mileagedt == vindiscountData[vd].mileage && modelYr == vindiscountData[vd].year && cabconfig == vindiscountData[vd].cabconfig && vindiscountData[vd].dayssinceready == '' && vindiscountData[vd].model == '' && vindiscountData[vd].cabconfig == '' && vindiscountData[vd].location == '') {
                    log.debug('case4')
                    incepdiscount = vindiscountData[vd].amount;
                    break;
                }
            }
			log.debug('incepdiscount',incepdiscount);
            record.submitFields({
                type: recType,
                id: Recid,
                values: {
                    'custrecord_advs_global_dinception_disc': incepdiscount
                }
            });
        }

    }

    function discountsetup() {
        try {
            var customrecord_advs_disc_crit_listSearchObj = search.create({
                type: "customrecord_advs_disc_crit_list",
                filters:
                [
                    ["isinactive", "is", "F"]
                ],
                columns:
                [
                    "custrecord_advs_make", //model
                    "custrecord_advs_model_year",
                    "custrecord_advs_vm_mileage1",
                    "custrecord_advs_cab_config",
                    "custrecord_advs_days_since_ready",
                    "custrecord_advs_location_disc",
                    "custrecord_discount_amount"
                ]
            });
            var searchResultCount = customrecord_advs_disc_crit_listSearchObj.runPaged().count;
            log.debug("customrecord_advs_disc_crit_listSearchObj result count", searchResultCount);
            var discountData = [];
            customrecord_advs_disc_crit_listSearchObj.run().each(function (result) {
                // .run().each has a limit of 4,000 results
                var obj = {};
                obj.model = result.getValue({
                    name: 'custrecord_advs_make'
                });
                obj.year = result.getValue({
                    name: 'custrecord_advs_model_year'
                });
                obj.mileage = result.getValue({
                    name: 'custrecord_advs_vm_mileage1'
                });
                obj.cabconfig = result.getValue({
                    name: 'custrecord_advs_cab_config'
                });
                obj.dayssinceready = result.getValue({
                    name: 'custrecord_advs_days_since_ready'
                });
                obj.location = result.getValue({
                    name: 'custrecord_advs_location_disc'
                });
                obj.amount = result.getValue({
                    name: 'custrecord_discount_amount'
                });
                discountData.push(obj);
                return true;
            });
            return discountData;
        } catch (e) {
            log.debug('error', e.toString());
        }
    }

    return {
        beforeLoad,
        beforeSubmit,
        afterSubmit
    }

});