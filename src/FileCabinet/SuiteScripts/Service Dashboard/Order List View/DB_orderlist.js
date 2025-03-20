/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
define(['N/record', 'N/search'],
    /**
     * @param{record} record
     * @param{search} search
     */
    (record, search) => {
    /**
     * Defines the Suitelet script trigger point.
     * @param {Object} scriptContext
     * @param {ServerRequest} scriptContext.request - Incoming request
     * @param {ServerResponse} scriptContext.response - Suitelet response
     * @since 2015.2
     */
    const onRequest = (scriptContext) => {
        try {
            //GET PARAMETERS TO STORE AUTHORIZATION DETAILS
            var request = scriptContext.request;
            var response = scriptContext.response;
            var flag = request.parameters.flag;
            log.debug('flag', flag);
            if (flag == 1) {
                var serviceOrderList = [];
                var salesorderSearchObj = search.create({
                    type: "salesorder",
                    filters:
                    [
                        ["type", "anyof", "SalesOrd"],
                        "AND",
                        ["custbody_advs_module_name", "anyof", "3"],
                        "AND",
                        ["mainline", "is", "T"],
                        "AND",
                        ["taxline", "is", "F"],
                        "AND",
                        ["shipping", "is", "F"]
                    ],
                    columns:
                    [
                        "tranid",
                        "custbody_advs_st_service_equipment",
                        "amount", 
                        "entity", 
						 search.createColumn({name: "internalid", label: "Internal ID", sort: search.Sort.DESC}),
						 search.createColumn({ name: "phone",join: "customer"})
                    ]
                });
                var searchResultCount = salesorderSearchObj.runPaged().count;
                salesorderSearchObj.run().each(function (result) {
                    var obj = {};
                    obj.docnumber = result.getValue({
                        name: 'tranid'
                    });
                    obj.entity = result.getText({
                        name: 'entity'
                    });
                    obj.entityid = result.getValue({
                        name: 'entity'
                    });
                    obj.vin = result.getValue({
                        name: 'custbody_advs_st_service_equipment'
                    });
                    obj.vinText = result.getText({
                        name: 'custbody_advs_st_service_equipment'
                    });
                    obj.amount = result.getValue({
                        name: 'amount'
                    });
                    obj.internalid = result.getValue({
                        name: 'internalid'
                    });
					obj.phone = result.getValue({ name: "phone",join: "customer"});
                    serviceOrderList.push(obj);
                    return true;
                });

                scriptContext.response.write(JSON.stringify(serviceOrderList));

            }else if(flag == 2){ //individual order info
				try{
					  var soid = request.parameters.soid;
					  if(soid){
						  var salesorderSearchObj = search.create({
							   type: "salesorder", 
							   filters:
							   [
								  ["type","anyof","SalesOrd"], 
								  "AND", 
								  ["internalid","anyof",soid], 
								  "AND", 
								  ["mainline","is","F"], 
								  "AND", 
								  ["taxline","is","F"], 
								  "AND", 
								  ["shipping","is","F"]
							   ],
							   columns:
							   [
								  "custbody_advs_st_service_equipment",
								  "entity",
								  "tranid",
								  "custbody_advs_st_model",
								  "custbody_advs_st_model_year",
								  "custbody_advs_sales_order_in_mileage",
								  "custbody_advs_st_vehicle_brand",
								  "custbody_advs_st_work_order_status",
								  "location",
								  "department",
								  "item",
								  "custcol_advs_selected_inventory_type",
								  "quantity",
								  "rate",
								  "amount",
								  "custbody_advs_doc_no",
								  "custcol_job_unique_code_id",
								  "custcol_advs_line_job_name",
                                 "internalid",
                                 search.createColumn({
									 name: "custrecord_advs_vm_plate_no",
									 join: "CUSTBODY_ADVS_ST_SERVICE_EQUIPMENT"
								  }),
								  search.createColumn({
									 name: "custrecord_advs_vm_mileage_record_on",
									 join: "CUSTBODY_ADVS_ST_SERVICE_EQUIPMENT"
								  }),
								  search.createColumn({
									 name: "custrecord_advs_vm_model",
									 join: "CUSTBODY_ADVS_ST_SERVICE_EQUIPMENT"
								  }),
								  search.createColumn({
									 name: "custrecord_advs_vm_mileage",
									 join: "CUSTBODY_ADVS_ST_SERVICE_EQUIPMENT"
								  }),
								  search.createColumn({
									 name: "quantitybackordered",
									 join: "item"
								  }),
								  search.createColumn({ name: "phone",join: "customer"})
							   ]
							});
							var searchResultCount = salesorderSearchObj.runPaged().count; 
							var orderData = []; 
							var linedata=[];
							var bodyObj = {};
							var index1=0;
							var rdocnumber = '';
							salesorderSearchObj.run().each(function(result){
							   // .run().each has a limit of 4,000 results
							   var obj={};
							   if(index1==0){
									  bodyObj.vintext =  result.getText({name:'custbody_advs_st_service_equipment'});
									  bodyObj.vinid =  result.getValue({name:'custbody_advs_st_service_equipment'});
									  bodyObj.entity =  result.getValue({name:'entity'});
									  bodyObj.entitytext =  result.getText({name:'entity'});
									  bodyObj.tranid =  result.getValue({name:'tranid'});
									  bodyObj.sointernalid =  result.getValue({name:'internalid'});
									  bodyObj.model =  result.getValue({name:'custbody_advs_st_model'});
									  bodyObj.modeltext =  result.getText({name:'custbody_advs_st_model'});  
									  bodyObj.modelyear =  result.getValue({name:'custbody_advs_st_model_year'});
									  bodyObj.modelyeartext =  result.getText({name:'custbody_advs_st_model_year'});
									  bodyObj.brand =  result.getValue({name:'custbody_advs_st_vehicle_brand'});
									  bodyObj.brandtext =  result.getText({name:'custbody_advs_st_vehicle_brand'}); 
									  bodyObj.workorderstatus =  result.getValue({name:'custbody_advs_st_work_order_status'});
									  bodyObj.workorderstatustext =  result.getText({name:'custbody_advs_st_work_order_status'});
									  bodyObj.location =  result.getValue({name:'location'});
									  bodyObj.locationtext =  result.getText({name:'location'});
									  bodyObj.department =  result.getValue({name:'department'});
									  bodyObj.departmenttext =  result.getText({name:'department'});
									  rdocnumber =  result.getValue({name:'custbody_advs_doc_no'});
									  bodyObj.mileage =  result.getValue({
									 name: "custrecord_advs_vm_mileage",
									 join: "CUSTBODY_ADVS_ST_SERVICE_EQUIPMENT"
								  });
								    bodyObj.phone =  result.getValue({
									 name: "phone",
									 join: "customer"
								  });
								  var _podetails = getAssociatedPOs(bodyObj.sointernalid); 
								  bodyObj.pointernalid =0;
								  bodyObj.potranid ='';
								  if(_podetails.length>0){
									bodyObj.pointernalid =   _podetails[0].poid;
									bodyObj.potranid =   _podetails[0].poText;
								  }
								  
							   }
							 
							  obj.invtype =  result.getValue({name:'custcol_advs_selected_inventory_type'});
							  obj.jobuniqueid =  result.getValue({name:'custcol_job_unique_code_id'});
							  obj.joblinename =  result.getValue({name:'custcol_advs_line_job_name'});
							  obj.item =  result.getValue({name:'item'});
                              obj.itemName =  result.getText({name:'item'});
							  obj.quantity =  result.getValue({name:'quantity'});
							  obj.rate =  result.getValue({name:'rate'});
							  obj.amount =  result.getValue({name:'amount'});
							   obj.backordered = result.getValue({
									 name: "quantitybackordered",
									 join: "item"
								  });
							  linedata.push(obj);
							  index1++;
							   return true;
							});
							var jobs = getJobs(rdocnumber);
							orderData.push(bodyObj);
							orderData.push(linedata);
							orderData.push(jobs);
                        var techsList = getTechniciansForViewmode();
						
                        orderData.push(techsList);
						var authorizationstatus = getAuthorizationsStatus(soid)
						 orderData.push(authorizationstatus);
                        
							 scriptContext.response.write(JSON.stringify(orderData));
							 
					  }
				}catch(e)
				{
					log.debug('error',e.toString());
				}
			}

        } catch (e) {
            log.debug('error', e.toString())
        }
    }
      function getTechniciansForViewmode()
        {
          var customrecord_advs_mechanicSearchObj = search.create({
                    type: "customrecord_advs_mechanic",
                    filters:
                    [
                        ["isinactive", "is", "F"]
                    ],
                    columns:
                    [
                        "internalid",
                        "name"
                    ]
                });
                var searchResultCount = customrecord_advs_mechanicSearchObj.runPaged().count;
                log.debug("customrecord_advs_mechanicSearchObj result count", searchResultCount);
                var arr = [];
                customrecord_advs_mechanicSearchObj.run().each(function (result) {
                    // .run().each has a limit of 4,000 results
                    var obj = {};
                    obj.id = result.getValue({
                        name: 'internalid'
                    });
                    obj.name = result.getValue({
                        name: 'name'
                    });
                    arr.push(obj);
                    return true;
                });
          return arr;
        }
	function getJobs(repaircode)
 {
	 try{
		  
	
		 var customrecord_advs_task_recordSearchObj = search.create({
		   type: "customrecord_advs_task_record",
		   filters:
		   [
			  ["custrecord_advs_repair_no","startswith",repaircode], 
			  "AND", 
			  ["isinactive","is","F"]
		   ],
		   columns:
		   [
			  "name",
			  "custrecord_advs_st_r_t_compalin",
			  "custrecord_advs_st_r_t_cause",
			  "custrecord_advs_st_r_t_correction",
			  "custrecord_advs_repair_task_job_code",
			  "custrecord_st_r_t_h_job_unique_id" ,
			  "internalid",
			  "custrecord_st_r_t_status",
			  "custrecord_advs_at_r_t_labor_time_1"
		   ]
		});
		var searchResultCount = customrecord_advs_task_recordSearchObj.runPaged().count;
		log.debug("customrecord_advs_task_recordSearchObj result count",searchResultCount);
		var jobs = [];
		customrecord_advs_task_recordSearchObj.run().each(function(result){
		   // .run().each has a limit of 4,000 results
		   var obj={};
		   obj.name = result.getValue({name:'name'});
		   obj.complaint = result.getValue({name:'custrecord_advs_st_r_t_compalin'});
		   obj.cause = result.getValue({name:'custrecord_advs_st_r_t_cause'});
		   obj.correction = result.getValue({name:'custrecord_advs_st_r_t_correction'});
		   obj.jobcode = result.getValue({name:'custrecord_advs_repair_task_job_code'});
		   obj.jobuniqueid = result.getValue({name:'custrecord_st_r_t_h_job_unique_id'});
		   obj.internalid = result.getValue({name:'internalid'});
		   obj.statusID = result.getValue({name:'custrecord_st_r_t_status'});
		   obj.statusName = result.getText({name:'custrecord_st_r_t_status'});
		   obj.goalhours = result.getValue({name:'custrecord_advs_at_r_t_labor_time_1'});
		  var technicians = getJobTechnicians(obj.jobuniqueid);
		   obj.technician = technicians;
		   jobs.push(obj);
		   return true;
		});
		log.debug('jobs',jobs);
		return jobs;
	 }catch(e)
	 {
		 log.debug('eror',e.toString())
	 }
 }
 function getJobTechnicians(repaircode)
 {
	 try{
		 var customrecord_advs_task_recordSearchObj = search.create({
		   type: "customrecord_advs_task_record",
		   filters:
		   [
			  ["custrecord_st_r_t_h_job_unique_id","startswith",repaircode], 
			  "AND", 
			  ["isinactive","is","F"]
		   ],
		   columns:
		   [
			   
			  search.createColumn({
				 name: "custrecord_advs_m_c_mechanic",
				 join: "CUSTRECORD_ADVS_M_C_REPAIR_TASK"
			  })
		   ]
		}); 
		var jobTechnicians = [];
		customrecord_advs_task_recordSearchObj.run().each(function(result){
		   // .run().each has a limit of 4,000 results
		   var obj={};
		   
		   obj.technician = result.getValue({
				 name: "custrecord_advs_m_c_mechanic",
				 join: "CUSTRECORD_ADVS_M_C_REPAIR_TASK"
			  });
		  obj.technicianName = result.getText({
				 name: "custrecord_advs_m_c_mechanic",
				 join: "CUSTRECORD_ADVS_M_C_REPAIR_TASK"
			  }); 
			  obj.jobcode =  repaircode;
		   jobTechnicians.push(obj);
		   return true;
		});
		return jobTechnicians;
	 }catch(e)
	 {
		 log.debug('error',e.toString());
	 }
 }
function getAuthorizationsStatus(soid){
	try{
		var customrecord_operation_authorization_hisSearchObj = search.create({
		   type: "customrecord_operation_authorization_his",
		   filters:
		   [
			   
			  ["custrecord_salesorder","anyof",soid], 
			  "AND", 
			  ["isinactive","is","F"]
		   ],
		   columns:
		   [
			  "custrecord_authorization_type", 
			  "custrecord_authorize_operation_status", 
			  "custrecord_operation_authorization_vin",
			  "custrecord_authorization_jobname", 
		   ]
		});
		var searchResultCount = customrecord_operation_authorization_hisSearchObj.runPaged().count; 
		var arr=[];
		customrecord_operation_authorization_hisSearchObj.run().each(function(result){
		   // .run().each has a limit of 4,000 results
		   var obj={};
		   obj.jobname = result.getValue({name:'custrecord_authorization_jobname'});
		   obj.authstatus = result.getValue({name:'custrecord_authorize_operation_status'});
		   arr.push(obj);
		   return true;
		});
		return arr;
	}catch(e)
	{
		log.debug('error',e.toString());
	}
}
function getAssociatedPOs(soid)
{
	try{
		var customrecord_advs_part_requisitionSearchObj = search.create({
			   type: "customrecord_advs_part_requisition",
			   filters:
			   [
				  ["custrecord_advs_p_r_head_link","anyof",soid], 
				  "AND", 
				  ["isinactive","is","F"]
			   ],
			   columns:
			   [
				  "custrecord_advs_p_r_po_link"
			   ]
			});
			var searchResultCount = customrecord_advs_part_requisitionSearchObj.runPaged().count; 
			var podetails = [];
			
			customrecord_advs_part_requisitionSearchObj.run().each(function(result){
			   // .run().each has a limit of 4,000 results
			   var obj ={};
			  obj.poid =  result.getValue({name:'custrecord_advs_p_r_po_link'});
			  obj.poText =  result.getText({name:'custrecord_advs_p_r_po_link'});
			   podetails.push(obj)
			   return true;
			});
			return podetails;
	}catch(e)
	{
		log.debug('error',e.toString());
	}
}
    return {
        onRequest
    }

});