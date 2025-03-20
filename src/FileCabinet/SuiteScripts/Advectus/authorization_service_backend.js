/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 *@NAmdConfig ./configuration.json
 */
define(['N/record', 'N/search','N/email','underscore'],
    /**
 * @param{record} record
 * @param{search} search
 */
    (record, search,email,underscore) => {
        /**
         * Defines the Suitelet script trigger point.
         * @param {Object} scriptContext
         * @param {ServerRequest} scriptContext.request - Incoming request
         * @param {ServerResponse} scriptContext.response - Suitelet response
         * @since 2015.2
         */
        const onRequest = (scriptContext) => {
            try{
                //GET PARAMETERS TO STORE AUTHORIZATION DETAILS
                var request = scriptContext.request;
                var response = scriptContext.response;
                var flag = request.parameters.flag;
                var soid = request.parameters.soid;
              log.debug('flag',flag);
                if(flag==1 && soid!=''){
                var salesorderSearchObj = search.create({
					   type: "salesorder",
					  
					   filters:
					   [
						  ["type","anyof","SalesOrd"], 
						  "AND", 
						  ["mainline","is","F"], 
						  "AND", 
						  ["taxline","is","F"], 
						  "AND", 
						  ["shipping","is","F"], 
						  "AND", 
						  ["internalid","anyof",soid]
					   ],
					   columns:
					   [
						  "entity",
						  "custbody_advs_st_service_equipment",
						  "item",
						  "quantity",
						  "amount",
						  "custcol_advs_line_job_name"
					   ]
					});
					var searchResultCount = salesorderSearchObj.runPaged().count; 
					var arr=[];
					var index=0;
					salesorderSearchObj.run().each(function(result){
					   // .run().each has a limit of 4,000 results
					   var obj={};
					   if(index==0){
						   var custobj = {};
						custobj.customer = result.getText({name:'entity'});
						custobj.customerid = result.getValue({name:'entity'});
						custobj.vin = result.getText({name:'custbody_advs_st_service_equipment'});
						custobj.vinid = result.getValue({name:'custbody_advs_st_service_equipment'});
						arr.push(custobj);
					   }
					   
					   
					   obj.item = result.getText({name:'item'});
					   obj.amount = result.getValue({name:'amount'});
					   obj.quantity = result.getValue({name:'quantity'});
					   obj.jobname = result.getValue({name:'custcol_advs_line_job_name'});
					   
					   arr.push(obj);
					   index++;
					   return true;
					});
					 
                scriptContext.response.write(JSON.stringify(arr)) ;

                }
				else if(flag==3)
				{
					try{
						var vin = request.parameters.vin;
						var soid = request.parameters.soid;
						var customrecord_operation_authorization_hisSearchObj = search.create({
						   type: "customrecord_operation_authorization_his",
						   filters:
						   [
							  ["custrecord_operation_authorization_vin","is",vin], 
							  "AND",
							  ["custrecord_salesorder","anyof",soid], 
							  "AND",  
							  ["isinactive","is","F"]
						   ],
						   columns:
						   [
							  "custrecord_authorization_type",
							  "custrecord_authorize_operation_notes",
							  "custrecord_authorize_operation_status",
							  "custrecord_authorization_jobname",
							  "custrecord_authorize_operation_method",
							  "custrecord_authorization_customer",
							  "custrecord_authorization_date_time",
							  "custrecord_operation_authorization_vin",
							  "custrecord_salesorder",
							  search.createColumn({
								 name: "custrecord_authhis_operation_name",
								 join: "CUSTRECORD_AUTHHIS_OPERATION_PARENT"
							  }),
							  search.createColumn({
								 name: "custrecord_authhis_operation_price",
								 join: "CUSTRECORD_AUTHHIS_OPERATION_PARENT"
							  })
						   ]
						});
						var searchResultCount = customrecord_operation_authorization_hisSearchObj.runPaged().count;
						log.debug("customrecord_operation_authorization_hisSearchObj result count",searchResultCount);
						var arr=[];
						customrecord_operation_authorization_hisSearchObj.run().each(function(result){
						   // .run().each has a limit of 4,000 results
						   var obj={};
						   obj.notes = result.getValue({name:'custrecord_authorize_operation_notes'});
						   obj.jobname = result.getValue({name:'custrecord_authorization_jobname'});
						   obj.datetime = result.getValue({name:'custrecord_authorization_date_time'});
						   obj.authtype = result.getValue({name:'custrecord_authorization_type'});
						   obj.operationstatus = result.getValue({name:'custrecord_authorize_operation_status'});
						   obj.operationstatustext = result.getText({name:'custrecord_authorize_operation_status'});
						   obj.operationmethod = result.getValue({name:'custrecord_authorize_operation_method'});
						   obj.operationmethodtext = result.getText({name:'custrecord_authorize_operation_method'});
						   obj.customer = result.getValue({name:'custrecord_authorization_customer'});
						   obj.customertext = result.getText({name:'custrecord_authorization_customer'});
						   obj.vin = result.getValue({name:'custrecord_operation_authorization_vin'});
						   obj.salesorder = result.getValue({name:'custrecord_salesorder'});
						   obj.salesordertext = result.getText({name:'custrecord_salesorder'});
						   obj.jobitem = result.getValue({
								 name: "custrecord_authhis_operation_name",
								 join: "CUSTRECORD_AUTHHIS_OPERATION_PARENT"
							  }); 
							obj.jobprice = result.getValue({
								 name: "custrecord_authhis_operation_price",
								 join: "CUSTRECORD_AUTHHIS_OPERATION_PARENT"
							  });
							  arr.push(obj);
						   return true;
						});
						scriptContext.response.write(JSON.stringify(arr)) ;
					}catch(e)
					{
						log.debug('Error',e.toString())
					}
				}
				else if(flag=='emailtemplate')
				{
					var customrecord_operation_authorization_temSearchObj = search.create({
						   type: "customrecord_operation_authorization_tem",
						   filters:
						   [
							  ["isinactive","is","F"]
						   ],
						   columns:
						   [
							  "name",
							  "internalid",
							  "custrecord_authjob_email_subject",
							  "custrecord_authjob_email_body"
						   ]
						});
						var searchResultCount = customrecord_operation_authorization_temSearchObj.runPaged().count;
						log.debug("customrecord_operation_authorization_temSearchObj result count",searchResultCount);
						var arr=[];
						customrecord_operation_authorization_temSearchObj.run().each(function(result){
						   // .run().each has a limit of 4,000 results
						   var obj={};
						  obj.id =  result.getValue({name:'internalid'});
						  obj.name =  result.getValue({name:'name'}); 
						  arr.push(obj);
						   return true;
						});
						scriptContext.response.write(JSON.stringify(arr)) ;
				}
				else if(flag=='emailtemplateid')
				{
					var templateid = request.parameters.templateid;
					var customrecord_operation_authorization_temSearchObj = search.create({
						   type: "customrecord_operation_authorization_tem",
						   filters:
						   [
							  ["isinactive","is","F"],
							  "AND",
							  ["internalid","is",templateid]
						   ],
						   columns:
						   [
							  "name",
							  "internalid",
							  "custrecord_authjob_email_subject",
							  "custrecord_authjob_email_body"
						   ]
						});
						var searchResultCount = customrecord_operation_authorization_temSearchObj.runPaged().count;
						log.debug("customrecord_operation_authorization_temSearchObj result count",searchResultCount);
						var arr=[];
						customrecord_operation_authorization_temSearchObj.run().each(function(result){
						   // .run().each has a limit of 4,000 results
						   var obj={};
						  obj.id =  result.getValue({name:'internalid'});
						  obj.name =  result.getValue({name:'name'}); 
						  obj.subject =  result.getValue({name:'custrecord_authjob_email_subject'}); 
						  obj.body =  result.getValue({name:'custrecord_authjob_email_body'}); 
						  arr.push(obj);
						   return true;
						});
						scriptContext.response.write(JSON.stringify(arr)) ;
				}
				else if(flag=='sendemail')
				{
					var templateid = request.parameters.templateid;
					var vin = request.parameters.vin;
					var customer = request.parameters.customer;
					var soid = request.parameters.soid;
					 if(customer)
					 {
						 try{
							 var templateobj = record.load({type:'customrecord_operation_authorization_tem',id:templateid,isDynamic:!0});
							var body =  templateobj.getValue({fieldId:'custrecord_authjob_email_body'}) ;
							
							body+='<a href="https://8760954.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=1663&deploy=1&compid=8760954&ns-at=AAEJ7tMQbL5LaWEXJw9abU_hqWVy7bwuKsK5WrhIKmkNi1PBELE&estimateid=13718&soid='+soid+'">Authorize</a>'
							
							 email.send({
									author: 6,
									recipients: customer,
									subject: templateobj.getValue({fieldId:'custrecord_authjob_email_subject'}),
									body: body
								});
								scriptContext.response.write("success") ;
						 }catch(e)
						 {
							 log.debug('error',e.toString());
							 scriptContext.response.write("error") ;
						 }
					 }
				 
						
				}
				else{
                    var obj = request.parameters.obj;
                    var obj1 = request.parameters.servicedata;
                     log.debug('obj',JSON.parse(obj));
                     log.debug('obj1acc',obj1);
                     log.debug('obj1acc',JSON.parse(obj1));
					 var lines  =JSON.parse(obj1);
					 var body  =JSON.parse(obj);
                  var jobs =   underscore.groupBy(lines,'jobname');
					var jobscount = Object.keys(jobs);
					log.debug('jobscount',jobscount);
					for(var j=0;j<jobscount.length;j++)
					{
						
						var recobj = record.create({type:'customrecord_operation_authorization_his',isDynamic:!0});
						//objRecord.setValue({fieldId:'item',value:true,ignoreFieldChange:true});
						recobj.setValue({fieldId:'custrecord_authorization_type',value:1});  
						recobj.setValue({fieldId:'custrecord_authorize_operation_notes',value:body.notes});
						recobj.setValue({fieldId:'custrecord_authorize_operation_method',value:1});
						recobj.setValue({fieldId:'custrecord_authorization_customer',value:body.customerdata});
						recobj.setValue({fieldId:'custrecord_authorization_date_time',value:body.dt});
						recobj.setValue({fieldId:'custrecord_operation_authorization_vin',value:body.vin});
						recobj.setValue({fieldId:'custrecord_salesorder',value:body.soid});
						recobj.setValue({fieldId:'custrecord_authorize_operation_status',value:1});
						recobj.setValue({fieldId:'custrecord_authorization_jobname',value:jobscount[j]});
					var _lines = jobs[jobscount[j]];
						 for(var i=0;i<_lines.length;i++){ 
							var sublist ='recmachcustrecord_authhis_operation_parent';
							if(_lines[i].item==''){continue;}
							recobj.selectNewLine({sublistId:sublist});
							recobj.setCurrentSublistValue({sublistId:sublist,fieldId:'custrecord_authhis_operation_name',value:_lines[i].item,ignoreFieldChange:true});
							recobj.setCurrentSublistValue({sublistId:sublist,fieldId:'custrecord_authhis_operation_price',value:_lines[i].amount,ignoreFieldChange:true});
							// recobj.setCurrentSublistValue({sublistId:sublist,fieldId:'custrecord_authorize_operation_status',value:1,ignoreFieldChange:true});
							// if(_lines[i].ismarked){
								recobj.setCurrentSublistValue({sublistId:sublist,fieldId:'custrecord_authhis_operation_apprstatus',value:true,ignoreFieldChange:true});
							// }
							
							recobj.commitLine({sublistId:sublist});
						}
						 var id= recobj.save();  
					}
                  
				   var _response='fail';
				   if(id){_response='success';}
				    scriptContext.response.write(_response) ;
                }


            }catch (e)
            {
                log.debug('error',e.toString())
            }
        }

        return {onRequest}

    });