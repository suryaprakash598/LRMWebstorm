/**
 * @NApiVersion 2.x
 * @NScriptType Suitelet
 * @NModuleScope SameAccount
 */
define(['N/record', 'N/runtime', 'N/search', 'N/ui/serverWidget'],
/**
 * @param {record} record
 * @param {runtime} runtime
 * @param {search} search
 * @param {serverWidget} serverWidget
 */
function(record, runtime, search, serverWidget) {
   
    /**
     * Definition of the Suitelet script trigger point.
     *
     * @param {Object} context
     * @param {ServerRequest} context.request - Encapsulation of the incoming request
     * @param {ServerResponse} context.response - Encapsulation of the Suitelet response
     * @Since 2015.2
     */
    function onRequest(context) {
    	
    	var ServerRequest = context.request;
		var ServerResponse = context.response;
		var Method = ServerRequest.method;
		if (Method == "GET") {
			var EmpIdParam = ServerRequest.parameters.custpara_emp_id;
			var VinIdParam = ServerRequest.parameters.custpara_vin_id;

			var form = serverWidget.createForm({
				title:" ",
				hideNavBar:true
			});
//			form.clientScriptModulePath = './advs_cs_copy_specification_truck_po.js';
			
			var EmpFldObj = form.addField({
				id: "custpage_employee_fld",
				type: 'select',
				label: 'Sales Person',
				source: 'employee'
			});
			if(EmpIdParam){
				EmpFldObj.defaultValue = EmpIdParam;	
			}
			
			var filterObj = {}
			filterObj.EmpIdParam = EmpIdParam;
			
			
			var SublistObj = populateSublistFields(form);
			getLeaseInfo(filterObj);
			
			var EmployeeSearch = search.create({
				type: 'employee',
				filters:[
					['isinactive','is','F'],
					'AND',
					['salesrep','is','T']
				],
				columns:[
					search.createColumn({name:'internalid'})
				]
			});
			var Line = 0;
			EmployeeSearch.run().each(function(result){
				var EmpId = result.getValue('internalid');
				SublistObj.setSublistValue({id:"custpage_employee_fld",line:Line,value:EmpId});
				var OrgCount = 0,DelCount = 0;
    			if(DataOrgArr[EmpId] != null && DataOrgArr[EmpId] != undefined){
    				OrgCount = DataOrgArr[EmpId]['count'];
    			}
    			if(DataDelByArr[EmpId] != null && DataDelByArr[EmpId] != undefined){
    				DelCount = DataDelByArr[EmpId]['count'];
    			}
    			log.debug('OrgCount',parseInt(OrgCount)+'@DelCount@'+parseInt(DelCount));
    			SublistObj.setSublistValue({id:"custpage_orginated_by",line:Line,value:parseInt(OrgCount)});
    			SublistObj.setSublistValue({id:"custpage_delivered_by",line:Line,value:parseInt(DelCount)});
				Line++;
				return true;
			});
			
			ServerResponse.writePage(form);			
		}
    }
    
    var DataOrgArr = [],DataDelByArr = [],Count = 0;
    function getLeaseInfo(filterObj){
    	var SearchObj = search.create({
    		   type: "customrecord_advs_lease_header",
    		   filters:
    		   [
    		      ["isinactive","is","F"]
    		   ],
    		   columns:
    		   [
    		      search.createColumn({
    		         name: "custrecord_advs_l_h_sale_rep",
    		         summary: "GROUP",
    		         label: "Originated by "
    		      }),
    		      search.createColumn({
    		         name: "custrecord_advs_l_h_deliver_by",
    		         summary: "GROUP",
    		         label: "Delivered By"
    		      }),
    		      search.createColumn({
    		         name: "name",
    		         summary: "COUNT",
    		         sort: search.Sort.ASC,
    		         label: "ID"
    		      })
    		   ]
    		});
    		SearchObj.run().each(function(result){
    			var OrigBy = result.getValue({name:'custrecord_advs_l_h_sale_rep',summary:'GROUP'});
    			var DelBy = result.getValue({name:'custrecord_advs_l_h_sale_rep',summary:'GROUP'});
    			var Count = result.getValue({name:'name',summary:'COUNT'});
    			if(DataOrgArr[OrigBy] != null && DataOrgArr[OrigBy] != undefined){
    				var Temp = DataOrgArr[OrigBy]['count'];
    				DataOrgArr[OrigBy]['count'] = (Temp*1)+(Count*1)
    			}else{
    				DataOrgArr[OrigBy] = new Array();
    				DataOrgArr[OrigBy]['count'] = Count;
    			}
    			if(DataDelByArr[DelBy] != null && DataDelByArr[DelBy] != undefined){
    				var Temp = DataDelByArr[DelBy]['count'];
    				DataDelByArr[DelBy]['count'] = (Temp*1)+(Count*1)
    			}else{
    				DataDelByArr[DelBy] = new Array();
    				DataDelByArr[DelBy]['count'] = Count;
    			}
    		   return true;
    		});
    }
    
	function populateSublistFields(form){
		var sublistObj = form.addSublist({id:"custpage_sublist",type:"list",label:"Sales Person List"});	
				
		var EmployeefldObj = sublistObj.addField({id:"custpage_employee_fld",type:serverWidget.FieldType.SELECT,label:"Sales Rep",source:"employee"});
		EmployeefldObj.updateDisplayType({displayType:"inline"});
		
		var OrgByfldObj = sublistObj.addField({id:"custpage_orginated_by",type:serverWidget.FieldType.TEXT,label:"Originated By"});
		OrgByfldObj.updateDisplayType({displayType:"inline"});
		
		var DelByfldObj = sublistObj.addField({id:"custpage_delivered_by",type:serverWidget.FieldType.TEXT,label:"Delivered By"});
		DelByfldObj.updateDisplayType({displayType:"inline"});
				
		return sublistObj;
	}
	
	
    return {
        onRequest: onRequest
    };
    
});
