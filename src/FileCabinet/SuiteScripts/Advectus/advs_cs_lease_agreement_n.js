/**
 * @NApiVersion 2.1
 * @NScriptType ClientScript
 * @NModuleScope sameaccount
 */
define(['N/currentRecord','N/url','N/https','N/record','N/search','/SuiteBundles/Bundle 555729/advs_lib/src/advs_lib_default_funtions_v2.js'],//,'/SuiteBundles/Bundle 555729/advs_lib/src/advs_lib_default_funtions_v2.js'
/**
 * @param{currentRecord} currentRecord
 * @param{runtime} runtime
 * @param{search} search
 */
function(currentRecord,url,https,record,search,advsObj) {//advsObj
    
    /**
     * Function to be executed after page is initialized.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @param {string} scriptContext.mode - The mode in which the record is being accessed (create, copy, or edit)
     *
     * @since 2015.2
     */
    function pageInit(scriptContext) {
       var curRec = scriptContext.currentRecord;
	   debugger;
	   
	   var VinNo =curRec.getValue({fieldId:'custrecord_advs_la_vin_bodyfld'});
						if(VinNo && scriptContext.mode=='create'){
							var fields = ['custrecord_advs_vm_model_year'];
									var SearchObj = search.lookupFields({
										type: 'customrecord_advs_vm',
										id: VinNo,
										columns: fields
									});
									 log.debug('SearchObj',SearchObj); 
                          var modelyear_vin=SearchObj.custrecord_advs_vm_model_year[0].text;
						  if(modelyear_vin){
							  var _coverage =  gettruckCoverage(modelyear_vin);
							  curRec.setValue({ fieldId:"custrecord_advs_phy_dmg_cover", value:_coverage}); 
							  curRec.setText({ fieldId:"custrecord_advs_truck_year_lease", text:modelyear_vin});
						  }
						}
						  
	   
    }

    /**
     * Function to be executed when field is changed.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @param {string} scriptContext.sublistId - Sublist name
     * @param {string} scriptContext.fieldId - Field name
     * @param {number} scriptContext.lineNum - Line number. Will be undefined if not a sublist or matrix field
     * @param {number} scriptContext.columnNum - Line number. Will be undefined if not a matrix field
     *
     * @since 2015.2
     */
    function fieldChanged(scriptContext) {
		 var curRec = scriptContext.currentRecord;
		 if(scriptContext.fieldId =='custrecord_advs_la_vin_bodyfld'){
			 var VinNo =curRec.getValue({fieldId:'custrecord_advs_la_vin_bodyfld'});
						if(VinNo){
							var fields = ['custrecord_advs_vm_model_year'];
									var SearchObj = search.lookupFields({
										type: 'customrecord_advs_vm',
										id: VinNo,
										columns: fields
									});
									 log.debug('SearchObj',SearchObj); 
                          var modelyear_vin=SearchObj.custrecord_advs_vm_model_year[0].text;
						  if(modelyear_vin){
							 var _coverage =  gettruckCoverage(modelyear_vin);
							  curRec.setValue({ fieldId:"custrecord_advs_phy_dmg_cover", value:_coverage}); 
							  curRec.setText({ fieldId:"custrecord_advs_truck_year_lease", text:modelyear_vin}); 
						  }
		 }
		 }
		 
    }

    /**
     * Function to be executed when field is slaved.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @param {string} scriptContext.sublistId - Sublist name
     * @param {string} scriptContext.fieldId - Field name
     *
     * @since 2015.2
     */
    function postSourcing(scriptContext) {
				try{
					if(scriptContext.fieldId == 'custrecord_advs_l_h_buc_link')
					{
						
						var curRec = scriptContext.currentRecord;
						var VinNo =curRec.getValue({fieldId:'custrecord_advs_la_vin_bodyfld'});
						if(VinNo){
							var fields = ['custrecord_advs_deposit_inception', 'custrecord_advs_deposit_discount', 'custrecord_advs_payment_inception','custrecord_advs_payment_discount','custrecord_advs_total_inception','custrecord_advs_vm_model_year'];
									var SearchObj = search.lookupFields({
										type: 'customrecord_advs_vm',
										id: VinNo,
										columns: fields
									});
									 log.debug('SearchObj',SearchObj);
									var depositInception = SearchObj.custrecord_advs_deposit_inception 
									var depositDisc    = SearchObj.custrecord_advs_deposit_discount 
									var payIncep    = SearchObj.custrecord_advs_payment_inception
									var payDisc = SearchObj.custrecord_advs_payment_discount 
									var totalIncep = SearchObj.custrecord_advs_total_inception ;
                          var modelyear_vin=SearchObj.custrecord_advs_vm_model_year;
									log.debug('totalIncep',totalIncep);
									if(payIncep && payDisc){
										payIncep=(payIncep*1)-(payDisc*1)
										curRec.setValue({ fieldId:"custrecord_advs_l_h_pay_incep", value:payIncep});
										curRec.setValue({ fieldId:"custrecord_advs_l_h_pay2_13",   value:payIncep});
										curRec.setValue({ fieldId:"custrecord_advs_l_h_pay_14_25", value:payIncep});
										curRec.setValue({ fieldId:"custrecord_advs_l_h_pay_26_37", value:payIncep});   
									}
									if(depositDisc){
										curRec.setValue({ fieldId:"custrecord_advs_ss_deposit_disc_lease",value:depositDisc});  
									}
									if(totalIncep){
										curRec.setValue({ fieldId:"custrecord_advs_l_h_tot_ince",  value:10});
										curRec.setValue({ fieldId:"custrecord_advs_l_h_pur_opti",  value:totalIncep*1});
									}
                          
						}
						
					}
					
					
					}catch(e)
					{
					  log.debug('error',e.toString());
					}
    }

    /**
     * Function to be executed after sublist is inserted, removed, or edited.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @param {string} scriptContext.sublistId - Sublist name
     *
     * @since 2015.2
     */
    function sublistChanged(scriptContext) {

    }

    /**
     * Function to be executed after line is selected.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @param {string} scriptContext.sublistId - Sublist name
     *
     * @since 2015.2
     */
    function lineInit(scriptContext) {

    }

    /**
     * Validation function to be executed when field is changed.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @param {string} scriptContext.sublistId - Sublist name
     * @param {string} scriptContext.fieldId - Field name
     * @param {number} scriptContext.lineNum - Line number. Will be undefined if not a sublist or matrix field
     * @param {number} scriptContext.columnNum - Line number. Will be undefined if not a matrix field
     *
     * @returns {boolean} Return true if field is valid
     *
     * @since 2015.2
     */
    function validateField(scriptContext) {

    }

    /**
     * Validation function to be executed when sublist line is committed.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @param {string} scriptContext.sublistId - Sublist name
     *
     * @returns {boolean} Return true if sublist line is valid
     *
     * @since 2015.2
     */
    function validateLine(scriptContext) {
        var type = scriptContext.sublistId;
        var flexiMac    =   "recmachcustrecord_advs_f_l_s_cnt_head";

        if(type == flexiMac){
         /*   var curRec      =   scriptContext.currentRecord;
              var schedules         =    curRec.getLineCount({sublistId:flexiMac});
              var getCurSchedule    =    curRec.getCurrentSublistValue({sublistId:flexiMac,fieldId:"custrecord_advs_f_l_s_schedules"})*1;
            var getCurrentAmount    =    curRec.getCurrentSublistValue({sublistId:flexiMac,fieldId:"custrecord_advs_f_l_s_amount"})*1;
            var curLine             =   curRec.getCurrentSublistIndex({sublistId:flexiMac});

            var CurrentLineamount = (getCurSchedule*getCurrentAmount);
            // alert(schedules+"=>"+getCurSchedule+"=>"+getCurrentAmount+"=>"+curLine+"=>"+CurrentLineamount);
            var allSchedules = 0;
                for(var m=0;m<schedules;m++){
                    var lineSchedule    = curRec.getSublistValue({sublistId:flexiMac,fieldId:"custrecord_advs_f_l_s_schedules",line:m})*1;
                    var lineamount      = curRec.getSublistValue({sublistId:flexiMac,fieldId:"custrecord_advs_f_l_s_amount",line:m})*1;
                    if(curLine != m){
                        var tempTotal =   lineSchedule*lineamount;
                        allSchedules+=tempTotal;
                    }
                    // alert("Loop=>"+m+"curLine=>"+curLine+"lineSchedule=>"+lineSchedule+"lineamount=>"+lineamount+"allSchedules=>"+allSchedules);
                }

                var finalAmount =   (allSchedules+CurrentLineamount);
                curRec.setValue({fieldId:"custrecord_advs_l_a_loan_amount",value:finalAmount});*/

            setTimeout(function(){
                calcFlexitotal();
            },1000);

        }

        return true;
    }

    /**
     * Validation function to be executed when sublist line is inserted.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @param {string} scriptContext.sublistId - Sublist name
     *
     * @returns {boolean} Return true if sublist line is valid
     *
     * @since 2015.2
     */
    function validateInsert(scriptContext) {

    }

    /**
     * Validation function to be executed when record is deleted.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @param {string} scriptContext.sublistId - Sublist name
     *
     * @returns {boolean} Return true if sublist line is valid
     *
     * @since 2015.2
     */
    function validateDelete(scriptContext) {
        var type = scriptContext.sublistId;
        var flexiMac    =   "recmachcustrecord_advs_f_l_s_cnt_head";
        if(type == flexiMac){
            setTimeout(function(){
                calcFlexitotal();
            },1000);
        }


    }

    /**
     * Validation function to be executed when record is saved.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @returns {boolean} Return true if record is valid
     *
     * @since 2015.2
     */
    function saveRecord(scriptContext) {

    }
	function gettruckCoverage(year)
	{
		try{
			var customrecord_advs_truck_year_coverSearchObj = search.create({
				   type: "customrecord_advs_truck_year_cover",
				   filters:
				   [
					  // ["custrecord_advs_truck_year","anyof",year], 
					  ["name","haskeywords",year],
					  "AND", 
					  ["isinactive","is","F"]
				   ],
				   columns:
				   [
					  "name",
					  "internalid",
					  "custrecord_advs_truck_cover"
				   ]
				});
				var searchResultCount = customrecord_advs_truck_year_coverSearchObj.runPaged().count;
				log.debug("customrecord_advs_truck_year_coverSearchObj result count",searchResultCount);
				var coverage = 0;
				customrecord_advs_truck_year_coverSearchObj.run().each(function(result){
				   // .run().each has a limit of 4,000 results
				   coverage = result.getValue({name:'custrecord_advs_truck_cover'});
				   return true;
				});
				return coverage;
		}catch(e)
		{
			log.debug('error',e.toString())
		}
	}

    function openModalDialog(urlop,Title,w,h){
		advsObj.injectModal();
		//showProcessingMessage();
		advsObj.openpopUpModal(urlop,Title,h,w);
		return true;
        Ext.onReady(function() {
            Ext.create('Ext.window.Window', {
                title: Title,
                /* height: Ext.getBody().getViewSize().height*(-100),
                 width: Ext.getBody().getViewSize().width*0.8,*/
                height: h,
                width: w,
//            minWidth:'730',
//            minHeight:'450',
                layout: 'fit',
                itemId : 'popUpWin',
                modal:true,
                shadow:true,
                resizable:true,
                constrainHeader:true,
                items: [{
                    xtype: 'box',
                    autoEl: {
                        tag: 'iframe',
                        src: urlop,
                        frameBorder:'0'
                    }
                }]
            }).show();
        });

    }

    function searchVinview(recid){
        var PArabObj = {
            "ifrmcntnr":"T",
            "recid":recid
        };

        var urlop = url.resolveScript({
            scriptId: "customscript_advs_staa_add_vehicles_leas",
            deploymentId: "customdeploy_advs_staa_add_vehicles_leas",
            params: PArabObj
        });

        var Title = "Add Vehicle";
        var w = screen.width - 100, h = 600;

        openModalDialog(urlop, Title, w, h);
    }
    function confirmAction(recid){
        var PArabObj = {
            "ifrmcntnr":"T",
            "requestID":recid
        };

        var urlop = url.resolveScript({
            scriptId: "customscript_advs_ss_lease_confirm_v2",
            deploymentId: "customdeploy_advs_ss_lease_confirm_v2",
            params: PArabObj
        });

        var Title = "Processing...Please Wait.";
        var w = screen.width - 880, h = 150;

        openModalDialog(urlop, Title, w, h);
    }
    function DeliveryChecklistAction(recid){
        var PArabObj = {
            "ifrmcntnr":"T",
            "requestID":recid,
          "from":1
        };
    //    var SalesQuoteRec = currentRecord.get();
    //        var ParametersObject = {
    //          recId: SalesQuoteRec.id,
    //          custpara_recordtype: SalesQuoteRec.type
    //        };
         //var ParametersL = {
          // custpara_orderid: recordId
         //};
        
         var Url = url.resolveScript({
           scriptId: 'customscript_advs_del_checklist',
           deploymentId: 'customdeploy_advs_del_checklist',
           params: PArabObj
        //    params: ParametersObject,
        //    returnExternalUrl: false
         });
         window.open(Url, '_blank');
        }
    //     var PArabObj = {
    //         "ifrmcntnr":"T",
    //         "requestID":recid
    //     };

    //     // var urlop = url.resolveScript({
    //     //     scriptId: "customscript_advs_ss_lease_confirm_v2",
    //     //     deploymentId: "customdeploy_advs_ss_lease_confirm_v2",
    //     //     params: PArabObj
    //     // });

    //     // var Title = "Lease Confirm";
    //     // var w = screen.width - 700, h = 300;

    //     // openModalDialog(urlop, Title, w, h);
    // }

    function calcFlexitotal(){
        var curRec  =   currentRecord.get();
        var flexiMac             =   "recmachcustrecord_advs_f_l_s_cnt_head";
        var curRec                      =   currentRecord.get();
        var schedules                   =    curRec.getLineCount({sublistId:flexiMac});

            var allSchedules = 0;var schedulesAmount=0;
            for(var m=0;m<schedules;m++){
                var lineSchedule    = curRec.getSublistValue({sublistId:flexiMac,fieldId:"custrecord_advs_f_l_s_schedules",line:m})*1;
                var lineamount      = curRec.getSublistValue({sublistId:flexiMac,fieldId:"custrecord_advs_f_l_s_amount",line:m})*1;
                    var tempTotal   =   lineSchedule*lineamount;
                    allSchedules+=lineSchedule;
                schedulesAmount+=tempTotal;
           }
            curRec.setValue({fieldId:"custrecord_advs_l_a_loan_amount",value:schedulesAmount});
            curRec.setValue({fieldId:"custrecord_advs_l_a_sch_num_f_pay",value:allSchedules});

    }
	function updateTotalLoss(recid,vinid){
       
         record.submitFields({type:'customrecord_advs_lease_header',id:recid,values:{custrecord_advs_l_h_status:8},options:{enableSourcing:!1,ignoreMandatoryFields:!0}});
       record.submitFields({type:'customrecord_advs_vm',id:vinid,values:{custrecord_advs_vm_reservation_status:26},options:{enableSourcing:!1,ignoreMandatoryFields:!0}});
		 window.location.reload();

    }

    function addCPC(id){
         var curRec  =   currentRecord.get();
        var PArabObj = {
            "ifrmcntnr":"T",
            "recordid":id,
            "screentype":"add",

        };

        var urlop = url.resolveScript({
            scriptId: "customscript_advs_ss_add_cpc",
            deploymentId: "customdeploy_advs_ss_add_cpc",
            params: PArabObj
        });

        var Title = "Start CPC";
        var w = screen.width - 100, h = 400;

        openModalDialog(urlop, Title, w, h);
    }
    function removeCPC(id,cpcid){
        var curRec      =   currentRecord.get();
        var PArabObj = {
            "ifrmcntnr":"T",
            "recordid":id,
            "screentype":"remove",
            "currentCpc":cpcid

        };

        var urlop = url.resolveScript({
            scriptId: "customscript_advs_ss_add_cpc",
            deploymentId: "customdeploy_advs_ss_add_cpc",
            params: PArabObj
        });

        var Title = "Close CPC";
        var w = screen.width - 300, h = 550;

        openModalDialog(urlop, Title, w, h);
    }
    function modifyschedule(recid){
        var curRec      =   currentRecord.get();
        var PArabObj = {
            "ifrmcntnr":"T",
            "recordid":recid,

        };

        var urlop = url.resolveScript({
            scriptId: "customscript_advs_ss_modify_schedules_fr",
            deploymentId: "customdeploy_advs_ss_modify_schedules_fr",
            params: PArabObj
        });

        var Title = "Modify Schedule";
        var w = screen.width - 300, h = 550;

        openModalDialog(urlop, Title, w, h);
    }

    function returnCall(id){
        var PArabObj = {
            "ifrmcntnr":"T",
            "recordid":id,
           "custpara_flag":"1",
          // "custpara_vinId":Vin,
        };

       /*  var urlop = url.resolveScript({ // Ashbaq bro form
            scriptId: "customscript_advs_ss_lease_return_view_r",
            deploymentId: "customdeploy_advs_ss_lease_return_view_r",
            params: PArabObj
        }); */
        // var urlop = url.resolveScript({
        //     scriptId: "customscript_advs_ss_lease_return_v2",
        //     deploymentId: "customdeploy_advs_ss_lease_return_v2",
        //     params: PArabObj
        // });

       /* var urlop = url.resolveScript({ //ABD
            scriptId: "customscript_advs_ss_lease_return_new_s",
            deploymentId: "customdeploy_advs_ss_lease_return_new_s",
            params: PArabObj
        }); */

        var urlop = url.resolveScript({ //ABD
            scriptId: "customscript_advs_ss_lease_return_new_s2",
            deploymentId: "customdeployadvs_ss_lease_return_new_s2",
            params: PArabObj
        });

        var Title = "Return and Buy Out";
        var w = screen.width - 550, h = 690;
//window.open(urlop,'popupWindow', 'width=600,height=400,resizable=no,scrollbars=no')
        openModalDialog(urlop, Title, w, h);
    }

    function createRepo(id,vinid){
        var PArabObj = {
            "ifrmcntnr":"T",
            "custpara_recid":id,
            "custpara_vinid":vinid,

        };

        var urlop = url.resolveScript({
            scriptId: "customscript_advs_ss_create_repo_pop_up",
            deploymentId: "customdeploy_advs_ss_create_repo_pop_up",
            params: PArabObj
        });

        var Title = "Repo";
        var w = screen.width - 200, h = 500;

        openModalDialog(urlop, Title, w, h);
    }
	function reposession(id,vin,repo){
        var PArabObj = {
           // "ifrmcntnr":"T",
            "custpara_stock":id,
            "custpara_vinid":vin,
            "custpara_repo":repo 

        };

        var urlop = url.resolveScript({
            scriptId: "customscript_advs_repossession_dashboard",
            deploymentId: "customdeploy_advs_repossession_dashboard",
            params: PArabObj
        });

        var Title = "Repossession";
        var w = screen.width - 200, h = 500;
window.open(urlop,'_blank');
       // openModalDialog(urlop, Title, w, h);
    }

    function swapBtn(id,vinId,model,brand,location){
          var PArabObj = {
            "ifrmcntnr":"T",
            "custpara_flag_2":2,
            "custpara_lease_id":id,
            "custpara_old_vin":vinId,
            "brand":brand,
             "model":model,
             "locat":location,
        };

        var urlop = url.resolveScript({
            scriptId: "customscript_advs_ss_availacle_veh_by_bu",
            deploymentId: "customdeploy_advs_ss_availacle_veh_by_bu",
            params: PArabObj
        });

        var Title = "Swap Vehicle";
        var w = screen.width - 200, h = 550;

        openModalDialog(urlop, Title, w, h);
    }
    function createFam(recid){
        var PArabObj = {
                   "ifrmcntnr":"T",
                   "custparam_id":recid
               };

               var urlop = url.resolveScript({
                   scriptId: "customscript_advs_ss_create_fam_for_leas",
                   deploymentId: "customdeploy_advs_ss_create_fam_for_leas",
                   params: PArabObj
               });

               var Title = "Create FAM";
               var w = screen.width - 200, h = 550;

               openModalDialog(urlop, Title, w, h);
    }
	 
    return {
        pageInit: pageInit,
         fieldChanged: fieldChanged,
         postSourcing: postSourcing,
        // sublistChanged: sublistChanged,
        // lineInit: lineInit,
        // validateField: validateField,
        validateLine: validateLine,
        // validateInsert: validateInsert,
        validateDelete: validateDelete,
        // saveRecord: saveRecord
        openModalDialog:openModalDialog,
        searchVinview:searchVinview,
        confirmAction:confirmAction,
        DeliveryChecklistAction:DeliveryChecklistAction,
        calcFlexitotal:calcFlexitotal,
       // addCPC:addCPC,
       // removeCPC:removeCPC,
        modifyschedule:modifyschedule,
        returnCall:returnCall,
        swapBtn:swapBtn,
        createRepo:createRepo,
		reposession:reposession,
		updateTotalLoss:updateTotalLoss,
        createFam:createFam
    };
    
});