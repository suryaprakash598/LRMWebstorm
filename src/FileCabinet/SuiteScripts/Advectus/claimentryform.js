/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
define(['N/record', 'N/runtime', 'N/search', 'N/ui/serverWidget', 'N/url','N/format'],
    /**
     * @param{record} record
     * @param{runtime} runtime
     * @param{search} search
     * @param{serverWidget} serverWidget
     */
    (record, runtime, search, serverWidget, url,format) => {
    /**
     * Defines the Suitelet script trigger point.
     * @param {Object} scriptContext
     * @param {ServerRequest} scriptContext.request - Incoming request
     * @param {ServerResponse} scriptContext.response - Suitelet response
     * @since 2015.2
     */
    const onRequest = (scriptContext) => {

        var request = scriptContext.request;
        var response = scriptContext.response;

        if (request.method == "GET") {
            var form = serverWidget.createForm({
                title: "Insurance Claim Sheet",
                hideNavBar: true
            });
			form.clientScriptModulePath = "./advs_cs_insurance_claim_sheet.js";
            var currScriptObj = runtime.getCurrentScript();
            //https://8760954.app.netsuite.com/app/site/hosting/scriptlet.nl?script=1643&deploy=1&stock=66&unitvin=5203&ofrstatus=1&ofrdate=5/8/2024

            var claim = request.parameters.claim || '';

            var claimidFldObj = form.addField({
                id: "custpage_claim_id",
                type: serverWidget.FieldType.TEXT,
                label: "ClaimID" 
            });
			
			 claimidFldObj.updateDisplayType({
				displayType : serverWidget.FieldDisplayType.HIDDEN
			});
			
			var stockFld = form.addField({
				id: 'cust_fi_list_stock_no',
				type: serverWidget.FieldType.SELECT,
				label: 'Lease #',
				source:'customrecord_advs_lease_header'
			})
			var nameFld = form.addField({
				id: 'cust_fi_f_l_name',
				type: serverWidget.FieldType.TEXT,
				label: 'First and Last Name'
			});
			nameFld.updateDisplayType({
				displayType : serverWidget.FieldDisplayType.HIDDEN
			});
			var dolFld = form.addField({
				id: 'cust_fi_dateofloss',
				type: serverWidget.FieldType.DATE,
				label: 'Date of Loss'
			});
			var descaccFld = form.addField({
				id: 'cust_fi_desc_accident',
				type: serverWidget.FieldType.TEXT,
				label: 'Description of Accident'
			});
			var claimFiled = form.addField({
				id: 'cust_fi_claim_filed',
				type: serverWidget.FieldType.SELECT,
				label: 'Claim Filed',
				source:'customlist_claim_field'
			});

			var insuranceCompany = form.addField({
				id: 'cust_fi_ins_company',
				type: serverWidget.FieldType.TEXT,
				label: 'Insurance Company'
			});
			 
			var insFrom = form.addField({
				id: 'cust_fi_ins_from',
				type: serverWidget.FieldType.SELECT,
				label: 'Insurance From',
				source:'customlist_field_insurance_type'
			});

			var insdoc = form.addField({
				id: 'cust_fi_ins_doc',
				type: serverWidget.FieldType.TEXT,
				label: 'Claim #'
			});
			if(claim){
				insdoc.updateDisplayType({
					displayType : serverWidget.FieldDisplayType.DISABLED
				});
				stockFld.updateDisplayType({
					displayType : serverWidget.FieldDisplayType.DISABLED
				});

			}else{
				insdoc.updateDisplayType({
					displayType : serverWidget.FieldDisplayType.HIDDEN
				});
			}
			var AdjusterName = form.addField({
				id: 'cust_fi_adjuster_name',
				type: serverWidget.FieldType.TEXT,
				label: 'Adjuster Name'
			});
			var AdjusterPhone = form.addField({
				id: 'cust_fi_adjuster_phone',
				type: serverWidget.FieldType.TEXT,
				label: 'Adjuster Phone'
			});
			var AdjusterEmail = form.addField({
				id: 'cust_fi_adjuster_email',
				type: serverWidget.FieldType.TEXT,
				label: 'Adjuster Email'
			});
			var repairable = form.addField({
				id: 'cust_fi_repairable',
				type: serverWidget.FieldType.SELECT,
				label: 'Unit Condition',
				source:'customlist_repairable_type'
			});
			var claimstatus = form.addField({
				id: 'cust_fi_claimstatus',
				type: serverWidget.FieldType.SELECT,
				label: 'Claim Status',
				source:'customrecord_advs_claim_status'
			});
			var claimtruckstatus = form.addField({
				id: 'cust_fi_claimtruckstatus',
				type: serverWidget.FieldType.SELECT,
				label: 'Truck Status',
				source:'customlist_advs_reservation_status'
			});
			var vehicleloc = form.addField({
				id: 'cust_fi_veh_loc',
				type: serverWidget.FieldType.TEXT,
				label: 'Unit Location'
			});
			var inTowYard = form.addField({
				id: 'cust_fi_in_tow_yard',
				type: serverWidget.FieldType.SELECT,
				label: 'In Tow Yard',
				source:'customlist_claim_field'
			});
			var shopConInfo = form.addField({
				id: 'cust_fi_shop_con_info',
				type: serverWidget.FieldType.TEXT,
				label: 'Shop Contact Info'
			});
			var notes = form.addField({
				id: 'cust_fi_notes',
				type: serverWidget.FieldType.TEXTAREA,
				label: 'Notes'
			});
			notes.updateDisplayType({
				displayType : serverWidget.FieldDisplayType.HIDDEN
			});
			var followup = form.addField({
				id: 'cust_fi_folowup',
				type: serverWidget.FieldType.DATE,
				label: 'Next Followup'
			}).defaultValue=new Date();
			
			var claimsettled = form.addField({
				id: 'cust_fi_claim_settled',
				type: serverWidget.FieldType.CHECKBOX,
				label: 'Claim Settled'
			});
			var resolutionFld = form.addField({
				id: 'cust_fi_resolution_fld',
				type: serverWidget.FieldType.TEXT,
				label: 'Resolution'
			});
			var claimvinFld = form.addField({
				id: 'cust_fi_claim_vin_fld',
				type: serverWidget.FieldType.TEXT,
				label: 'VIN'
			}).updateDisplayType({
				displayType : serverWidget.FieldDisplayType.HIDDEN
			});
			if(claim!=''){
					var dataobj = claimData(claim);
					stockFld.defaultValue=dataobj[0].lease;
					dolFld.defaultValue=dataobj[0].dol;
					descaccFld.defaultValue=dataobj[0].accdes;
					claimFiled.defaultValue=dataobj[0].claimf;
					insFrom.defaultValue=dataobj[0].instype;
					insuranceCompany.defaultValue=dataobj[0].insCompany;
					insdoc.defaultValue=dataobj[0].name;
					AdjusterName.defaultValue=dataobj[0].adjusterName;
					AdjusterPhone.defaultValue=dataobj[0].adjusterPhone;
					AdjusterEmail.defaultValue=dataobj[0].adjusterEmail;
					inTowYard.defaultValue=dataobj[0].inTowYard;
					shopConInfo.defaultValue=dataobj[0].shopConInfo;
					repairable.defaultValue=dataobj[0].reptype;
					vehicleloc.defaultValue=dataobj[0].vehloc;
					claimstatus.defaultValue=dataobj[0].claimstatus;
					claimtruckstatus.defaultValue=dataobj[0].claimtmstatus;
					claimvinFld.defaultValue=dataobj[0].claimvin;
					claimidFldObj.defaultValue=claim; 
				}
			 var SublistObj = populateNotesSublist(form);
			populateNotesData(SublistObj,claim);
			if(claim!=''){
            form.addSubmitButton('Update Claim');
			}else{
				form.addSubmitButton('Claim');
			}
			 
            response.writePage(form);
        }else{
			var claimid = scriptContext.request.parameters.custpage_claim_id||'';
			var stocklesse = scriptContext.request.parameters.cust_fi_list_stock_no;
			var dateofloss = scriptContext.request.parameters.cust_fi_dateofloss;
			var accidentdesc = scriptContext.request.parameters.cust_fi_desc_accident;
			var claimfiled = scriptContext.request.parameters.cust_fi_claim_filed;
			var instype = scriptContext.request.parameters.cust_fi_ins_from;
			var docnumber = scriptContext.request.parameters.cust_fi_ins_doc;
			var repairabletype = scriptContext.request.parameters.cust_fi_repairable;
			var claimstatus = scriptContext.request.parameters.cust_fi_claimstatus;
			var _claimtruckstatus = scriptContext.request.parameters.cust_fi_claimtruckstatus;
			var vehicleLoc = scriptContext.request.parameters.cust_fi_veh_loc;
			var notes = scriptContext.request.parameters.cust_fi_notes;
			var followupDate = scriptContext.request.parameters.cust_fi_folowup;
			var claimsettled = scriptContext.request.parameters.cust_fi_claim_settled;
			var InsCompany = scriptContext.request.parameters.cust_fi_ins_company;
			var AdjusterName = scriptContext.request.parameters.cust_fi_adjuster_name;
			var AdjusterPhone = scriptContext.request.parameters.cust_fi_adjuster_phone;
			var AdjusterEmail = scriptContext.request.parameters.cust_fi_adjuster_email;
			var InTowYard = scriptContext.request.parameters.cust_fi_in_tow_yard;
			var ShopContact = scriptContext.request.parameters.cust_fi_shop_con_info;
			var Resolution = scriptContext.request.parameters.cust_fi_resolution_fld;
			var vinid = scriptContext.request.parameters.cust_fi_claim_vin_fld;
			var LineCount = scriptContext.request.getLineCount({
				group: "custpage_notes_sublist"
			});
			var SublistId = 'custpage_notes_sublist';
			var childRec = 'recmachcustrecord_advs_inf_parent_link';
			if(claimid!=''){
				var objRecord =  record.load({type:'customrecord_advs_insurance_claim_sheet',id:claimid,isDynamic:!0});
			}else{
				var objRecord =  record.create({type:'customrecord_advs_insurance_claim_sheet',isDynamic:!0});
			}
			if(claimsettled=='T'){claimsettled=true}else if(claimsettled=='F'){claimsettled=false}
			 objRecord.setValue({fieldId:'custrecord_ic_lease',value:stocklesse,ignoreFieldChange:false});
			 if(dateofloss)
				 objRecord.setValue({fieldId:'custrecord_ic_date_of_loss',value:new Date(dateofloss),ignoreFieldChange:true});
			 objRecord.setValue({fieldId:'custrecord_ic_description_accident',value:accidentdesc,ignoreFieldChange:true});
			 objRecord.setValue({fieldId:'custrecord_ic_claim_field',value:claimfiled,ignoreFieldChange:true});
			 objRecord.setValue({fieldId:'custrecord_advs_ic_insurance_company',value:InsCompany,ignoreFieldChange:true});
			 objRecord.setValue({fieldId:'custrecord_ic_filed_insurance_type',value:instype,ignoreFieldChange:true});
			 objRecord.setValue({fieldId:'custrecord_ic_adj_name_number',value:AdjusterName,ignoreFieldChange:true});
			 objRecord.setValue({fieldId:'custrecord_advs_ic_adjuster_phone',value:AdjusterPhone,ignoreFieldChange:true});
			 objRecord.setValue({fieldId:'custrecord_advs_ic_adjuster_email',value:AdjusterEmail,ignoreFieldChange:true});
			 objRecord.setValue({fieldId:'custrecord_advs_ic_in_tow_yard',value:InTowYard,ignoreFieldChange:true});
			 objRecord.setValue({fieldId:'custrecord_advs_ic_shop_contact_info',value:ShopContact,ignoreFieldChange:true});
			 objRecord.setValue({fieldId:'custrecord_ic_repairable_type',value:repairabletype,ignoreFieldChange:true});
			 objRecord.setValue({fieldId:'custrecord_ic_location_vehicle',value:vehicleLoc,ignoreFieldChange:true});
			 objRecord.setValue({fieldId:'custrecord_claim_settled',value:claimsettled,ignoreFieldChange:true});
			 objRecord.setValue({fieldId:'custrecord_advs_claim_status',value:claimstatus,ignoreFieldChange:true});
			 objRecord.setValue({fieldId:'custrecord_advs_ic_resolution',value:Resolution,ignoreFieldChange:true});
			 if(followupDate)
				 objRecord.setValue({fieldId:'custrecord_tickler_followup',value:new Date(followupDate),ignoreFieldChange:true});

			 var childLineCount = objRecord.getLineCount(childRec);
			 if(childLineCount > 0){
				 for(var j=childLineCount-1;j>=0;j--){
					 objRecord.removeLine({
						 sublistId: childRec,
						 line: j,
					 });
				 }
			 }
			 if(LineCount > 0){
				 for(var k=0;k<LineCount;k++){
					 var DateTime = scriptContext.request.getSublistValue({
						 group: SublistId,
						 name: 'custsublist_date',
						 line: k,
					 });
					 var Notes = scriptContext.request.getSublistValue({
						 group: SublistId,
						 name: 'custsublist_notes',
						 line: k,
					 });
					 if(DateTime && Notes){
						 objRecord.selectNewLine({
							 sublistId: childRec
						 });
						 objRecord.setCurrentSublistValue({
							 sublistId: childRec,
							 fieldId: 'custrecord_advs_inf_date_time',
							 value: DateTime
						 })	;
						 objRecord.setCurrentSublistValue({
							 sublistId: childRec,
							 fieldId: 'custrecord_advs_inf_notes',
							 value: Notes
						 })	;
						 objRecord.commitLine({ sublistId: childRec });
					 }
				 }
			 }


			 var claim_id = objRecord.save();
			 
			if(stocklesse){
				var isTotalLoss =false;
				if(repairabletype==2){
					isTotalLoss=true;
				}
				record.submitFields({type:'customrecord_advs_lease_header',id:stocklesse,values:{custrecord_insurance_claim:claim_id,custrecord_is_lease_total_loss:isTotalLoss},options:{enableSourcing:!1,ignoreMandatoryFields:!0}});
			}
			if(vinid){
				record.submitFields({type:'customrecord_advs_vm',id:vinid,values:{custrecord_advs_vm_reservation_status:_claimtruckstatus},options:{enableSourcing:!1,ignoreMandatoryFields:!0}});
			}
			var onclickScript=" <html><body> <script type='text/javascript'>" +
			"try{debugger;" ;
			onclickScript+="window.opener.location.reload();";
			onclickScript+="window.close();;";
			onclickScript+="}catch(e){alert(e+'   '+e.message);}</script></body></html>";
			scriptContext.response.write(onclickScript);
		}
    }

    function claimData(claim) {
        var customrecord_advs_insurance_claim_sheetSearchObj = search.create({
			   type: "customrecord_advs_insurance_claim_sheet",
			   filters:
			   [
				  ["isinactive","is","F"], 
				  "AND", 
				  ["internalid","anyof",claim]
			   ],
			   columns:
			   [
				  "custrecord_ic_lease",
				  "custrecord_first_last_name",
				  "custrecord_ic_date_of_loss",
				  "custrecord_ic_description_accident",
				  "custrecord_ic_claim_field",
				   "custrecord_advs_ic_insurance_company",
				  "custrecord_ic_filed_insurance_type",
				  "custrecord_ic_claim_number",
				  "custrecord_ic_adj_name_number",
				   "custrecord_advs_ic_adjuster_phone",
				   "custrecord_advs_ic_adjuster_email",
				   "custrecord_advs_ic_in_tow_yard",
				   "custrecord_advs_ic_shop_contact_info",
				  "custrecord_ic_repairable_type",
				  "custrecord_ic_location_vehicle",
				  "custrecord_tickler_followup",
				  "name",
				  "custrecord_claim_settled",
				  "custrecord_advs_claim_status",
				  "custrecord_advs_ic_vin_number",
				  search.createColumn({
					  name: 'custrecord_advs_vm_reservation_status',
					  join: 'custrecord_advs_ic_vin_number'
					})
			   ]
			});
			var arr = [];
			customrecord_advs_insurance_claim_sheetSearchObj.run().each(function(result){
			    var obj = {};
				obj.name = result.getValue({
					name: 'name'
				});
				obj.lease = result.getValue({
					name: 'custrecord_ic_lease'
				});
				obj.dol = result.getValue({
					name: 'custrecord_ic_date_of_loss'
				});
				obj.insCompany = result.getValue({
					name: 'custrecord_advs_ic_insurance_company'
				});
				obj.instype = result.getValue({
					name: 'custrecord_ic_filed_insurance_type'
				});
				obj.accdes = result.getValue({
					name: 'custrecord_ic_description_accident'
				});
				obj.claimf = result.getValue({
					name: 'custrecord_ic_claim_field'
				});
				obj.adjusterName = result.getValue({
					name: 'custrecord_ic_adj_name_number'
				});
				obj.adjusterPhone = result.getValue({
					name: 'custrecord_advs_ic_adjuster_phone'
				});
				obj.adjusterEmail = result.getValue({
					name: 'custrecord_advs_ic_adjuster_email'
				});
				obj.inTowYard = result.getValue({
					name: 'custrecord_advs_ic_in_tow_yard'
				});
				obj.shopConInfo = result.getValue({
					name: 'custrecord_advs_ic_shop_contact_info'
				});
				obj.claimnum = result.getValue({
					name: 'custrecord_ic_claim_number'
				});
				obj.reptype = result.getValue({
					name: 'custrecord_ic_repairable_type'
				});
				obj.vehloc = result.getValue({
					name: 'custrecord_ic_location_vehicle'
				});
				obj.followup = result.getValue({
					name: 'custrecord_tickler_followup'
				});
				obj.claimsettled = result.getValue({
					name: 'custrecord_claim_settled'
				});
				obj.claimstatus = result.getValue({
					name: 'custrecord_advs_claim_status'
				});
				obj.claimvin = result.getValue({
					name: 'custrecord_advs_ic_vin_number'
				});
				obj.claimtmstatus = result.getValue({
					  name: 'custrecord_advs_vm_reservation_status',
					  join: 'custrecord_advs_ic_vin_number'
					});
				arr.push(obj);
			   return true;
			});
        return arr;
    }
	function populateNotesSublist(form){
		var SublistObj = form.addSublist({
			id: 'custpage_notes_sublist',
			type: serverWidget.SublistType.INLINEEDITOR,
			label: 'User Notes'
		});
		SublistObj.addField({
			id: 'custsublist_date',
			type: serverWidget.FieldType.TEXT,
			label: 'Date & Time'
		});
		SublistObj.addField({
			id: 'custsublist_notes',
			type: serverWidget.FieldType.TEXTAREA,
			label: 'Notes'
		});
		SublistObj.addField({
			id: 'custsublist_record_id',
			type: serverWidget.FieldType.SELECT,
			source: 'customrecord_advs_insurance_notes',
			label: 'RECORD Id'
		}).updateDisplayType({ displayType: "hidden" });
		return SublistObj;
	}
	function populateNotesData(SublistObj,claim) {
		var Line = 0;
		var CurDate = new Date();
		var hours = CurDate.getHours(); // 0-23
		var minutes = CurDate.getMinutes(); // 0-59
		var seconds = CurDate.getSeconds(); // 0-59
		var timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
		var DateValue = format.format({
			value: CurDate,
			type: format.Type.DATE
		})
		var dateTimeValue = DateValue+' '+timeString;
		if (claim){
			var SearchObj = search.create({
				type: 'customrecord_advs_insurance_notes',
				filters: [
					['isinactive', 'is', 'F'],
					'AND',
					['custrecord_advs_inf_parent_link', 'anyof', claim]
				],
				columns: [
					'custrecord_advs_inf_date_time',
					'custrecord_advs_inf_notes'
				]
			});
			SearchObj.run().each(function (result) {
				SublistObj.setSublistValue({
					id: "custsublist_date",
					line: Line,
					value: result.getValue('custrecord_advs_inf_date_time') || ' '
				});
				SublistObj.setSublistValue({
					id: "custsublist_notes",
					line: Line,
					value: result.getValue('custrecord_advs_inf_notes') || ' '
				});
				SublistObj.setSublistValue({
					id: "custsublist_record_id",
					line: Line,
					value: result.id
				});
				Line++;
				return true;
			});
	}
		SublistObj.setSublistValue({
			id: "custsublist_date",
			line: Line,
			value: dateTimeValue
		});
	}
    return {
        onRequest
    }

});