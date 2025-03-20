/**
 * @NApiVersion 2.x
 * @NScriptType Suitelet
 */
define(['N/ui/serverWidget', 'N/record', 'N/search', 'N/runtime'],
function(serverWidget, record, search, runtime) {
    function onRequest(context) {
        var request = context.request;
        var response = context.response;
        
        if (request.method === 'GET') {
            var form = serverWidget.createForm({ title: 'Update PO Location' });
            
            var poId = request.parameters.poId;
            if (!poId) {
                response.write('Missing PO ID');
               // return;//
            }
             var poField = form.addField({
                id: 'custpage_createdfrom',
                type: serverWidget.FieldType.TEXT,
                label: 'PO' 
            });
			poField.defaultValue = poId;
			poField.updateDisplayType({
				displayType : serverWidget.FieldDisplayType.HIDDEN
			});
            var locationField = form.addField({
                id: 'custpage_location',
                type: serverWidget.FieldType.SELECT,
                label: 'Location',
                source: 'location' // Auto-populates available locations
            });
            
            form.addSubmitButton({ label: 'Update Location' });
            response.writePage(form);
        } 
        else if (request.method === 'POST') {
            var poId = request.parameters.custpage_createdfrom;
            var newLocation = request.parameters.custpage_location;
            log.debug('poId',poId);
            log.debug('newLocation',newLocation);
            if (!poId || !newLocation) {
                response.write('Invalid request. Missing parameters.');
                return;
            }
            var capbill=0;
            try {
                var poRecord = record.load({ type: record.Type.PURCHASE_ORDER, id: poId ,isDynamic: true});
              poRecord.setValue({fieldId:'custbody_advs_original_loc_to_update',value:newLocation,ignoreFieldChange:true});
				capbill = poRecord.getValue({fieldId:'custbody_advs_thirdparty_venbill'}); 
				var idpo=  poRecord.save({
					enableSourcing: true, 
					ignoreMandatoryFields: false
				});
				if(idpo)
				{
					var customrecord_advs_vmSearchObj = search.create({
					   type: "customrecord_advs_vm",
					   filters:
					   [
						  ["isinactive","is","F"], 
						  "AND", 
						  ["custrecord_advs_vm_purchase_order","anyof",idpo]
					   ],
					   columns:
					   [
						  "internalid"
					   ]
					}); 
					customrecord_advs_vmSearchObj.run().each(function(result){ 
					   var vinid = result.getValue({name:'internalid'});
					   record.submitFields({type:'customrecord_advs_vm',id:vinid,values:{custrecord_advs_vm_location_code:newLocation},options:{enableSourcing:!1,ignoreMandatoryFields:!0}});
					   return true;
					});
				}
				if(capbill){
					var vbRecord = record.load({ type: 'vendorbill', id: capbill ,isDynamic: true});
					vbRecord.setValue({fieldId:'custbody_advs_original_loc_to_update',value:newLocation,ignoreFieldChange:true});
					var idvb=  vbRecord.save({
						enableSourcing: true, 
						ignoreMandatoryFields: false
					});
					
					//SEARCH FOR TEMP CAPITALIZATION RECORD AND UPDATE THE LOCATIONS
					var customrecord_advs_st_post_capitalizationSearchObj = search.create({
							   type: "customrecord_advs_st_post_capitalization",
							   filters:
							   [
								  ["custrecord_st_p_c_invoice_id","anyof",capbill], 
								  "AND", 
								  ["isinactive","is","F"], 
								  "AND", 
								  ["custrecord_st_p_c_posted","is","F"]
							   ],
							   columns:
							   [
								  "internalid"
							   ]
							});
							var searchResultCount = customrecord_advs_st_post_capitalizationSearchObj.runPaged().count;
							log.debug("customrecord_advs_st_post_capitalizationSearchObj result count",searchResultCount);
							customrecord_advs_st_post_capitalizationSearchObj.run().each(function(result){
							   // .run().each has a limit of 4,000 results
							   var idcap = result.getValue({name:'internalid'});
							   record.submitFields({type:'customrecord_advs_st_post_capitalization',id:idcap,values:{custrecord_st_p_c_location:newLocation},options:{enableSourcing:!1,ignoreMandatoryFields:!0}});
							   return true;
							});
				}
				if(idpo)
				{
					var billSearch = search.create({
							type: search.Type.TRANSACTION,
							filters: [
								['type', 'anyof', 'VendBill'], 
								'AND', 
								['createdfrom', 'anyof', idpo]
							],
							columns: ['internalid', 'tranid', 'createdfrom', 'entity', 'amount', 'status']
						});
							var vendorBills=[];
						billSearch.run().each(function(result) {
							var billobj = record.load({type:'vendorbill',id:result.getValue('internalid'),isDynamic:!0});
							billobj.setValue({fieldId:'custbody_advs_original_loc_to_update',value:newLocation,ignoreFieldChange:true});
							 var idbill=  billobj.save({
									enableSourcing: true, 
									ignoreMandatoryFields: false
								}); 
						}); 
				}
                response.write(
                    "<script>window.opener.location.reload(); window.close();</script>"
                );
                //response.write('Location updated successfully.');
            } catch (error) {
				log.debug('error',error.toString())
                response.write('Error updating PO: ' + error.message);
            }
        }
    }
    
    return { onRequest: onRequest };
});
