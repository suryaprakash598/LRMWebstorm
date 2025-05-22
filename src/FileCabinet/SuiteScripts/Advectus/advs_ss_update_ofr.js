/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
define(['N/record', 'N/runtime', 'N/search', 'N/ui/serverWidget', 'N/url','N/https','N/format','N/email'],
    /**
     * @param{record} record
     * @param{runtime} runtime
     * @param{search} search
     * @param{serverWidget} serverWidget
     */
    (record, runtime, search, serverWidget, url,https,format,email) => {
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
            var form = serverWidget.createForm({ title: "Repossession Dashboard", hideNavBar: true  });
            var currScriptObj = runtime.getCurrentScript();
            //https://8760954.app.netsuite.com/app/site/hosting/scriptlet.nl?script=1643&deploy=1&stock=66&unitvin=5203&ofrstatus=1&ofrdate=5/8/2024
            var stock = request.parameters.repo || '';
            var dataobj;
            if (stock) {
                dataobj = ofrData(stock);
            }
            var scriptId = currScriptObj.id;
            var deploymentId = currScriptObj.deploymentId;
            // log.debug("scriptId", scriptId + "=>" + deploymentId);

            var repoFldObj = form.addField({ id: "custpage_repo", type: serverWidget.FieldType.TEXT, label: "repo"  })//
			    repoFldObj.defaultValue=dataobj[0].repoid;
			    repoFldObj.updateDisplayType({ displayType : serverWidget.FieldDisplayType.HIDDEN });
			var vinFldObj = form.addField({ id: "custpage_destination", type: serverWidget.FieldType.SELECT, label: "Destination", source: "customlist_advs_destination" }).defaultValue=dataobj[0].destinationval;
            var stockFldObj = form.addField({ id: "custpage_tranlocation", type: serverWidget.FieldType.SELECT, label: "Staged Location From", source: "customlistadvs_list_physicallocation" }).defaultValue=dataobj[0].locationTransportval;
            var ofrFldObj = form.addField({ id: "custpage_ofr_truckstatus", type: serverWidget.FieldType.SELECT, label: "Truck Master Status", source: "customlist_advs_truck_master_status"  }).defaultValue=dataobj[0].truckStatusval;
            var ofrFldObj = form.addField({ id: "custpage_ofr_status", type: serverWidget.FieldType.SELECT, label: "OFR Status", source: "customrecord_advs_ofr_status"  }).defaultValue=dataobj[0].Statusval;
			
			var notesFldObj = form.addField({ id: "custpage_ofr_notes", type: serverWidget.FieldType.TEXTAREA, label: "Notes"  }).defaultValue=dataobj[0].notes;
            var trDateFldObj = form.addField({ id: "custpage_terminatination", type: serverWidget.FieldType.DATE, label: "Termination Date" }).defaultValue=dataobj[0].tdate;
			var putoutDateFldObj = form.addField({ id: "custpage_putout", type: serverWidget.FieldType.DATE, label: "Date Assigned" })
			    putoutDateFldObj.defaultValue=dataobj[0].putoutdate;
			    //putoutDateFldObj.updateDisplayType({ displayType: "inline" });
            
			var trDateFldObj = form.addField({ id: "custpage_lastlocation", type: serverWidget.FieldType.SELECT, label: "Last Known Location",source:'customlistadvs_list_physicallocation' }).defaultValue=dataobj[0].lastlocationval;
			var trDateFldObj = form.addField({ id: "custpage_repocompany", type: serverWidget.FieldType.SELECT, label: "Repo Company",source:'customrecord_repo_company' }).defaultValue=dataobj[0].repocompanyval;
			
			var trTcompanyFldObj = form.addField({ id: "custpage_transport_company", type: serverWidget.FieldType.SELECT, label: "Transport Company",source:'customlist_advs_transport_comp_list' });
            trTcompanyFldObj.defaultValue=dataobj[0].transportCompanyVal;
			trTcompanyFldObj.updateDisplayType({ displayType: "hidden" });
			var gslastlocationFldObj = form.addField({ id: "custpage_location_goldstar", type: serverWidget.FieldType.TEXTAREA, label: "GS LAST LOCATION"  }).defaultValue=dataobj[0].goldstarCoordinates;
			var odometerFldObj = form.addField({ id: "custpage_odometer", type: serverWidget.FieldType.TEXT, label: "Last Recorded Mileage"  }).defaultValue=dataobj[0].goldstarOdometer;
			var followupFldObj = form.addField({ id: "custpage_followup", type: serverWidget.FieldType.CHECKBOX,  label: "FollowUp Letter"  }).defaultValue=dataobj[0].Followup;
			var newInvestment   = form.addField({ id: "custpage_new_investment", type: serverWidget.FieldType.TEXT, label: "New Investment"   }).defaultValue= dataobj[0].newinvestment;
			var collectionsFldObj = form.addField({ id: "custpage_collections", type: serverWidget.FieldType.SELECT, label: "Collections" ,source:'customrecord_advs_repo_collections'  });
            if(dataobj[0].Collections == true || dataobj[0].Collections == "T" || dataobj[0].Collections == 'true'){
                collectionsFldObj.defaultValue = 1;
            }
            var ReasonForCollections = form.addField({ id: "custpage_reason_fr_collec", type: serverWidget.FieldType.TEXTAREA, label: "Reason"  });
                ReasonForCollections.updateDisplayType({ displayType: "disabled" });
            if(dataobj[0].reasonfrCollections){
                ReasonForCollections.defaultValue = dataobj[0].reasonfrCollections;
            }
			var SublistObj = populateNotesSublist(form);
			var SublistObj1 = populateTerminationNotesSublist(form);

             if (dataobj[0].repoid) {
                populateNotesData(SublistObj,dataobj[0].repoid);
                populateTerminationNotesData(SublistObj1,dataobj[0].repoid);
            }
			
			form.clientScriptModulePath = "./cs_update_ofr.js";
            form.addSubmitButton('Update');
			form.addButton({id:"custpage_getlastlocation",label:"Get Last Location",functionName:"getlastlocation('"+dataobj[0].vin+"')"})
			form.addButton({id:"custpage_send_location_repocompany",label:"Send to Repo Company",functionName:"sendlastlocation('"+dataobj[0].vin+"')"})
            response.writePage(form);
        }else{
			var repo = scriptContext.request.parameters.custpage_repo;
			var Destination = scriptContext.request.parameters.custpage_destination;
			var trlocation = scriptContext.request.parameters.custpage_tranlocation;
			var terminationdate = scriptContext.request.parameters.custpage_terminatination||'';
			var cputout = scriptContext.request.parameters.custpage_putout;
			var lastlocation = scriptContext.request.parameters.custpage_lastlocation;
			var repocompany = scriptContext.request.parameters.custpage_repocompany;
			var transportcompany = scriptContext.request.parameters.custpage_transport_company;
			var ofr_status = scriptContext.request.parameters.custpage_ofr_status;
			var ofr_truckstatus = scriptContext.request.parameters.custpage_ofr_truckstatus;
			var _Followup = scriptContext.request.parameters.custpage_followup;
			var _collections = scriptContext.request.parameters.custpage_collections;
			var notes = scriptContext.request.parameters.custpage_ofr_notes;
			var Odometer = scriptContext.request.parameters.custpage_odometer;
			var locationCoordinates = scriptContext.request.parameters.custpage_location_goldstar;
            var reasonfrCollec = scriptContext.request.parameters.custpage_reason_fr_collec;
            var newinvestment = scriptContext.request.parameters.custpage_new_investment;
			log.debug('repo',repo);
            var terminationdate_DateValue = "" , cputout_DateValue = "";
            if(terminationdate){
                 terminationdate_DateValue = format.parse({ value: terminationdate, type: format.Type.DATE });
            }
            if(cputout){
                 cputout_DateValue = format.parse({ value: cputout, type: format.Type.DATE });
            }
            if(_Followup == "T" || _Followup == true || _Followup == "true"){
                _Followup = true;
            }
            else{
                _Followup = false;
            }
            var ofr_recObj = record.load({type:'customrecord_lms_ofr_',id:repo,isDynamic:true});
                ofr_recObj.setValue({fieldId:"custrecord_destination",value: Destination});
                ofr_recObj.setValue({fieldId:"custrecord_location_for_transport",value: trlocation});
                ofr_recObj.setValue({fieldId:"custrecord_termination_date",value: terminationdate_DateValue});
                ofr_recObj.setValue({fieldId:"custrecord_advs_ofr_ofrstatus",value: ofr_status});
                ofr_recObj.setValue({fieldId:"custrecord_date_putout",value: cputout_DateValue});
                ofr_recObj.setValue({fieldId:"custrecord_last_location",value: lastlocation});
                ofr_recObj.setValue({fieldId:"custrecord_advs_repo_company",value: repocompany});
                ofr_recObj.setValue({fieldId:"custrecord_followup_letter",value: _Followup});
                ofr_recObj.setValue({fieldId:"custrecord_additional_info_remarks",value: notes});
                if(_collections){
                    ofr_recObj.setValue({fieldId:"custrecord_collections",value: _collections});
                }
                ofr_recObj.setValue({fieldId:"custrecord_transport_company",value: transportcompany});
                ofr_recObj.setValue({fieldId:"custrecord_goldstar_odometer",value: Odometer});
                ofr_recObj.setValue({fieldId:"custrecord_goldstar_vehicle_coordinates",value: locationCoordinates});
                ofr_recObj.setValue({fieldId:"custrecord_repo_new_investment",value: newinvestment});
                if(reasonfrCollec){
                    ofr_recObj.setValue({fieldId:"custrecord_advs_ofr_reason_for_collectio",value: reasonfrCollec});
                }

                var sobj = search.lookupFields({type:'customrecord_lms_ofr_',id:repo,columns:['custrecord_ofr_stock_no','custrecord_ofr_vin']});

                if(terminationdate!=''){
                    try{
                      if(sobj.custrecord_ofr_stock_no.length){
                        var vinid = sobj.custrecord_ofr_stock_no[0].value;
                        if(vinid){
                            record.submitFields({type:'customrecord_advs_lease_header',id:vinid,values:{custrecord_advs_l_h_status:7},options:{enableSourcing:!1,ignoreMandatoryFields:!0}});
                        }
                      }
                    }catch(e) {
                        log.debug('error',e.toString())
                    }
                }
                // log.debug('ofr_status',ofr_status);
                if(ofr_status==22||ofr_status==35||ofr_status==36||ofr_status==37) {
                    try{
                     if(sobj.custrecord_ofr_vin.length){
                        var vinid = sobj.custrecord_ofr_vin[0].value;
                        // log.debug('vinid ofr_status',vinid);
                        if(vinid){
                            record.submitFields({type:'customrecord_advs_vm',id:vinid,values:
							{custrecord_advs_vm_reservation_status:21,
							custrecord_advs_repo_status:ofr_status,
							custrecord_reservation_hold:'',
							custrecord_advs_vm_soft_hld_sale_rep:'',
							custrecord_advs_customer:''
							}
							,options:{enableSourcing:!1,ignoreMandatoryFields:!0}})
                        }
                     }
                    }catch(e){
                        log.debug('error',e.toString())
                    }
                }
                if(ofr_status == 25||ofr_status == 21) {
                  try{
                    var objRecord = record.create({type:'customrecord_advs_vehicle_auction',isDynamic:!0});
                    objRecord.setValue({fieldId:'custrecord_auction_lease',value:sobj.custrecord_ofr_stock_no[0].value,ignoreFieldChange:true});
                    objRecord.setValue({fieldId:'custrecord_auction_vin',value:sobj.custrecord_ofr_vin[0].value,ignoreFieldChange:true});
                    objRecord.save();
                        if(sobj.custrecord_ofr_vin.length){
                        var vinid = sobj.custrecord_ofr_vin[0].value;
                        // log.debug('vinid ofr_status',vinid);
                        if(vinid){
                            record.submitFields({type:'customrecord_advs_vm',id:vinid,values:{custrecord_advs_repo_status:ofr_status},options:{enableSourcing:!1,ignoreMandatoryFields:!0}})
                        }
                     }
                  }catch(e) {
                     log.debug('error in auction creation',e.toString());
                  }
                }
				if(ofr_status == 40) {//complete
                  try{
					  var receip = '';
					  if(repocompany)
					  {
						 var emaildata = search.lookupFields({type:'customrecord_repo_company',id:repocompany,columns:['custrecord_repo_company_email']}); 
						 receip = emaildata.custrecord_repo_company_email ;
					  }
					  if(receip){
						  email.send({
						 author:6,
					 recipients:receip,
					 subject:'TestModule',
					 body:'emailbody' 
					 });
					  }
                     
                        
                  }catch(e) {
                     log.debug('error in auction creation',e.toString());
                  }
                }
                else if(ofr_status == 16){ //SECURED
                    //find the lease in cpc
                    var leaseid = sobj.custrecord_ofr_stock_no[0].value;
                    log.debug('leaseid',leaseid);
                    var cpcdata = getLeaseinCPC(leaseid);
                    log.debug('cpcdata',cpcdata);
                    if(cpcdata.length>0){
                        if(cpcdata[0].insemail){
                            email.send({
                                author:6,
                                recipients:cpcdata[0].insemail,
                                subject:'TestModule',
                                body:'emailbody for secured ofr status'
                            });
                        }
                    }
                }else{
					 if(sobj.custrecord_ofr_vin.length){
                        var vinid = sobj.custrecord_ofr_vin[0].value;
                        // log.debug('vinid ofr_status',vinid);
                        if(vinid){
                            record.submitFields({type:'customrecord_advs_vm',id:vinid,values:{custrecord_advs_repo_status:ofr_status},options:{enableSourcing:!1,ignoreMandatoryFields:!0}})
                        }
                     }
				}
			//IF THEY CHANGE TRUCK MASTER STATUS IN REPO 
			if(ofr_truckstatus)
			{
				if(sobj.custrecord_ofr_vin.length){
                        var vinid = sobj.custrecord_ofr_vin[0].value;
                        // log.debug('vinid ofr_status',vinid);
                        if(vinid){
                            record.submitFields({type:'customrecord_advs_vm',id:vinid,values:{custrecord_advs_truck_master_status:ofr_truckstatus},options:{enableSourcing:!1,ignoreMandatoryFields:!0}})
                        }
                     }
			}
            var SublistId_suite = 'custpage_notes_sublist';
            var LineCount = scriptContext.request.getLineCount({ group: SublistId_suite });
            log.debug('LineCount => ',LineCount);
            var childRec = 'recmachcustrecord_advs_repo_note_parent_link';

            var childLineCount = ofr_recObj.getLineCount('recmachcustrecord_advs_repo_note_parent_link')*1;
            log.debug(' childLineCount =>',childLineCount);
			 if(childLineCount > 0){
				 /*for(var j=childLineCount-1;j>=0;j--){
                    ofr_recObj.removeLine({ sublistId: childRec, line: j, });
				 }*/
			 }
             if(LineCount > 0){
                for(var k = LineCount-1;k<LineCount;k++){
                    var DateTime = scriptContext.request.getSublistValue({ group: SublistId_suite, name: 'custsublist_date', line: k, });
                    var Notes = scriptContext.request.getSublistValue({ group: SublistId_suite, name: 'custsublist_notes', line: k, });
                  log.debug(" DateTime => "+DateTime+""," Notes =>"+Notes);
                    if(DateTime && Notes){
                        ofr_recObj.selectNewLine({ sublistId: childRec });
                        ofr_recObj.setCurrentSublistValue({ sublistId: childRec, fieldId: 'custrecord_advs_repo_note_date_time', value: DateTime });
                        ofr_recObj.setCurrentSublistValue({ sublistId: childRec, fieldId: 'custrecord_advs_repo_note_notes', value: Notes });
                        ofr_recObj.commitLine({ sublistId: childRec });
                    }
                }
            }
             var SublistId_suite = 'custpage_termination_notes_sublist';
            var LineCount = scriptContext.request.getLineCount({ group: SublistId_suite });
            log.debug('LineCount => ',LineCount);
            var childRec = 'recmachcustrecord_advs_repo_ternote_parent_link';

            var childLineCount = ofr_recObj.getLineCount('recmachcustrecord_advs_repo_ternote_parent_link')*1;
            log.debug(' childLineCount =>',childLineCount);
			 if(childLineCount > 0){
				 /*for(var j=childLineCount-1;j>=0;j--){
                    ofr_recObj.removeLine({ sublistId: childRec, line: j, });
				 }*/
			 }
             if(LineCount > 0){
                for(var k = LineCount-1;k<LineCount;k++){
                    var DateTime = scriptContext.request.getSublistValue({ group: SublistId_suite, name: 'custsublist_termination_date', line: k, });
                    var Notes = scriptContext.request.getSublistValue({ group: SublistId_suite, name: 'custsublist_termination_notes', line: k, });
                  log.debug(" DateTime => "+DateTime+""," Notes =>"+Notes);
                    if(DateTime && Notes){
                        ofr_recObj.selectNewLine({ sublistId: childRec });
                        ofr_recObj.setCurrentSublistValue({ sublistId: childRec, fieldId: 'custrecord_advs_repo_ternote_date_time', value: DateTime });
                        ofr_recObj.setCurrentSublistValue({ sublistId: childRec, fieldId: 'custrecord_advs_repo_ternote_notes', value: Notes });
                        ofr_recObj.commitLine({ sublistId: childRec });
                    }
                }
            }
            var repoSavedid = ofr_recObj.save();
          
			var onclickScript=" <html><body> <script type='text/javascript'>" +
			"try{debugger;" ; 
			//onclickScript+="window.parent.getActive();";			
			onclickScript+="window.opener.location.reload();";	
			//onclickScript+="window.parent.closePopup();";			
			onclickScript+="window.close();;";
			onclickScript+="}catch(e){alert(e+'   '+e.message);}</script></body></html>";
			scriptContext.response.write(onclickScript);
			
			
		}
    }

    function ofrData(stock) {
        var customrecord_lms_ofr_SearchObj = search.create({
            type: "customrecord_lms_ofr_",
            filters:
            [
                ["custrecord_ofr_stock_no", "anyof", stock]
            ],
            columns:
            [
                "custrecord_chek_from_repo",
                "custrecord_collections",
                "custrecord_advs_ofr_color",
                "custrecord_destination",
                "custrecord_followup_letter",
                "custrecord_ofr_make",
                "custrecord_ofr_model",
                "custrecord_ofr_customer",
                "custrecord_ofr_date",
                "custrecord_advs_ofr_ofrstatus",
                "custrecord_advs_repo_company",
                "custrecord_ofr_stock_no",
                "custrecord_termination_date",
                "custrecord_ofr_vin",
                "custrecord_ofr_year",
                "custrecord_location_for_transport",
                "custrecord_last_location",
				"internalid",
				"custrecord_date_putout",
				"custrecord_additional_info_remarks",
				"custrecord_transport_company",
				"custrecord_goldstar_odometer",
				"custrecord_goldstar_vehicle_coordinates",
                "custrecord_advs_ofr_reason_for_collectio",
                "custrecord_repo_new_investment",
				search.createColumn({
                  name: "custrecord_advs_truck_master_status",
                  join: "custrecord_ofr_vin"
                })
            ]
        });
        var searchResultCount = customrecord_lms_ofr_SearchObj.runPaged().count;
        var arr = [];
        customrecord_lms_ofr_SearchObj.run().each(function (result) {
            // .run().each has a limit of 4,000 results
            var obj = {};
            obj.name = result.getValue({ name: 'custrecord_ofr_customer' });
			obj.repoid = result.getValue({ name: 'internalid' });
            obj.destination = result.getText({ name: 'custrecord_destination' });
			obj.destinationval = result.getValue({ name: 'custrecord_destination' });
            obj.make = result.getText({ name: 'custrecord_ofr_make' });
            obj.model = result.getText({ name: 'custrecord_ofr_model' });
            obj.ofrdate = result.getValue({ name: 'custrecord_ofr_date' });
			obj.putoutdate = result.getValue({ name: 'custrecord_date_putout' });
            obj.stock = result.getText({ name: 'custrecord_ofr_stock_no' });
            obj.tdate = result.getValue({ name: 'custrecord_termination_date' });
            obj.vin = result.getText({ name: 'custrecord_ofr_vin' }); 
			obj.vinval = result.getValue({ name: 'custrecord_ofr_vin' });
            obj.year = result.getValue({ name: 'custrecord_ofr_year' });
            obj.repocompanyval = result.getValue({ name: 'custrecord_advs_repo_company' });
			obj.repocompany = result.getText({ name: 'custrecord_advs_repo_company' });
            obj.Followup = result.getValue({ name: 'custrecord_followup_letter' });
			if( obj.Followup ==false){ obj.Followup ='F'}else if(obj.Followup ==true){obj.Followup ='T'}
            obj.Collections = result.getValue({ name: 'custrecord_collections' });
			if( obj.Collections == false){ 
                obj.Collections ='F'
            }else if(obj.Collections == true){
                obj.Collections ='T'
            }
            obj.Status = result.getText({ name: 'custrecord_advs_ofr_ofrstatus' });
			obj.Statusval = result.getValue({ name: 'custrecord_advs_ofr_ofrstatus' });
			obj.truckStatusval = result.getValue({
                  name: "custrecord_advs_truck_master_status",
                  join: "custrecord_ofr_vin"
                });
            obj.locationTransportval = result.getValue({ name: 'custrecord_location_for_transport' });
			obj.locationTransport = result.getText({ name: 'custrecord_location_for_transport' });
            obj.lastlocationval = result.getValue({ name: 'custrecord_last_location' }); 
			obj.notes = result.getValue({ name: 'custrecord_additional_info_remarks' }); 
			obj.lastlocation = result.getText({ name: 'custrecord_last_location' });
			obj.transportCompany = result.getText({ name: 'custrecord_transport_company' });
			obj.transportCompanyVal = result.getValue({ name: 'custrecord_transport_company' });
			obj.goldstarCoordinates = result.getValue({ name: 'custrecord_goldstar_vehicle_coordinates' });
			obj.goldstarOdometer = result.getValue({ name: 'custrecord_goldstar_odometer'});
            obj.reasonfrCollections = result.getValue({ name: 'custrecord_advs_ofr_reason_for_collectio'});
            obj.newinvestment = result.getValue({ name: 'custrecord_repo_new_investment'});
            arr.push(obj);
            return true;
        });

        return arr;
    }
    function populateNotesSublist(form){
		var SublistObj = form.addSublist({ id: 'custpage_notes_sublist',type: serverWidget.SublistType.LIST, label: 'User Notes' });
		SublistObj.addField({id: 'custsublist_date',type: serverWidget.FieldType.TEXT,label: 'Date & Time'});
		SublistObj.addField({id: 'custsublist_notes',type: serverWidget.FieldType.TEXTAREA,label: 'Notes'}).updateDisplayType({
            displayType: "entry"
        });
		SublistObj.addField({id: 'custsublist_record_id',type: serverWidget.FieldType.SELECT,source: 'customrecord_advs_repo_notes',label: 'RECORD Id'}).updateDisplayType({ displayType: "hidden" });
		return SublistObj;
	}
    function populateNotesData(SublistObj,repoId) {
		var Line = 0;
		var CurDate = new Date();
		var hours = CurDate.getHours(); // 0-23
		var minutes = CurDate.getMinutes(); // 0-59
		var seconds = CurDate.getSeconds(); // 0-59
		var timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
		var DateValue = format.format({ value: CurDate,type: format.Type.DATE })
		var dateTimeValue = DateValue+' '+timeString;
		if (repoId){
			var SearchObj = search.create({
				type: 'customrecord_advs_repo_notes',
				filters: [
					['isinactive', 'is', 'F'],
					'AND',
					['custrecord_advs_repo_note_parent_link', 'anyof', repoId]
				],
				columns: [
					'custrecord_advs_repo_note_date_time',
					'custrecord_advs_repo_note_notes'
				]
			});
			SearchObj.run().each(function (result) {
				SublistObj.setSublistValue({id: "custsublist_date",line: Line,value: result.getValue('custrecord_advs_repo_note_date_time') || ' ' });
				SublistObj.setSublistValue({id: "custsublist_notes",line: Line,value: result.getValue('custrecord_advs_repo_note_notes') || ' ' });
				SublistObj.setSublistValue({ id: "custsublist_record_id", line: Line, value: result.id });
				Line++;
				return true;
			});
	    }
		SublistObj.setSublistValue({ id: "custsublist_date", line: Line, value: dateTimeValue });
	}
    function populateTerminationNotesSublist(form){
            var SublistObj = form.addSublist({ id: 'custpage_termination_notes_sublist',type: serverWidget.SublistType.LIST, label: 'Transport to Termination' });
            SublistObj.addField({id: 'custsublist_termination_date',type: serverWidget.FieldType.TEXT,label: 'Date & Time'});
            SublistObj.addField({id: 'custsublist_termination_notes',type: serverWidget.FieldType.TEXTAREA,label: 'Notes'}).updateDisplayType({
                displayType: "entry"
            });
            SublistObj.addField({id: 'custsublist_termination_record_id',type: serverWidget.FieldType.SELECT,source: 'customrecord_advs_repo_notes',label: 'RECORD Id'}).updateDisplayType({ displayType: "hidden" });
            return SublistObj;
        }
    function populateTerminationNotesData(SublistObj,repoId) {
            var Line = 0;
            var CurDate = new Date();
            var hours = CurDate.getHours(); // 0-23
            var minutes = CurDate.getMinutes(); // 0-59
            var seconds = CurDate.getSeconds(); // 0-59
            var timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            var DateValue = format.format({ value: CurDate,type: format.Type.DATE })
            var dateTimeValue = DateValue+' '+timeString;
            if (repoId){
                var SearchObj = search.create({
                    type: 'customrecord_advs_repo_termination_notes',
                    filters: [
                        ['isinactive', 'is', 'F'],
                        'AND',
                        ['custrecord_advs_repo_ternote_parent_link', 'anyof', repoId]
                    ],
                    columns: [
                        'custrecord_advs_repo_ternote_date_time',
                        'custrecord_advs_repo_ternote_notes'
                    ]
                });
                SearchObj.run().each(function (result) {
                    SublistObj.setSublistValue({id: "custsublist_termination_date",line: Line,value: result.getValue('custrecord_advs_repo_ternote_date_time') || ' ' });
                    SublistObj.setSublistValue({id: "custsublist_termination_notes",line: Line,value: result.getValue('custrecord_advs_repo_ternote_notes') || ' ' });
                    SublistObj.setSublistValue({ id: "custsublist_termination_record_id", line: Line, value: result.id });
                    Line++;
                    return true;
                });
            }
            SublistObj.setSublistValue({ id: "custsublist_termination_date", line: Line, value: dateTimeValue });
        }
    function getLeaseinCPC(lease)
    {
        try{
            var customrecord_advs_lease_cpcSearchObj = search.create({
                type: "customrecord_advs_lease_cpc",
                filters:
                    [
                        ["custrecord_advs_cpc_lease","anyof",lease]
                    ],
                columns:
                    [
                        search.createColumn({
                            name: "custrecord_advs_su_email",
                            join: "CUSTRECORD_ADVS_CPC_INSU_COMP_NAME"
                        }),
                        "custrecord_cpc_email_template_fld"
                    ]
            });
            var searchResultCount = customrecord_advs_lease_cpcSearchObj.runPaged().count;
            log.debug("customrecord_advs_lease_cpcSearchObj result count",searchResultCount);
            var cpcinfo=[];
            customrecord_advs_lease_cpcSearchObj.run().each(function(result){
                // .run().each has a limit of 4,000 results
                var obj={};
                obj.cpcid = result.id;
                obj.insemail = result.getValue({
                    name: "custrecord_advs_su_email",
                    join: "CUSTRECORD_ADVS_CPC_INSU_COMP_NAME"
                });
                obj.emailtemplate = result.getValue('custrecord_cpc_email_template_fld');
                cpcinfo.push(obj);
                return true;
            });
            return cpcinfo;
        }catch (e){
            log.debug('eror,',e.toString());
        }
    }
    return {
        onRequest
    }

});