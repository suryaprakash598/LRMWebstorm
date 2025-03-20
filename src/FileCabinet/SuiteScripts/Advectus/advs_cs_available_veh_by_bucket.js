/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
define(['N/record', 'N/runtime', 'N/search','N/url','/SuiteBundles/Bundle 555729/advs_lib/src/advs_lib_default_funtions_v2.js'],
    /**
     * @param{record} record
     * @param{runtime} runtime
     * @param{search} search
     */
    function(record, runtime, search,url,advsObj) {
        
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
          advsObj.showProcessingMessage();
                doCollapse();
                inventoryAccordian();
                var CurrentRecord = scriptContext.currentRecord;
                var fieldId       = scriptContext.fieldId;
                var LineNum = scriptContext.line;
                disableEnableFields1(CurrentRecord);
				 togglefiltersbwntabs(CurrentRecord);
                colorSoftHold(CurrentRecord,"custpage_sublist","custpabe_m_softhold_status");
                colorReposession(CurrentRecord,"custpage_sublist_repo","custpage_repo_status"); 
                colorInventory(CurrentRecord,"custpage_sublist","custpabe_m_status")
                //colorPayemnt(CurrentRecord,"custpage_sublist","cust_select_checkbox_highlight");
                colorTitleRes(CurrentRecord,"custpage_sublist","custpabe_m_titlerestriction2");
                colorInTowYard(CurrentRecord,"custpage_sublist_custpage_subtab_insur_claim","cust_fi_in_tow_yard");
                colorInsStatus(CurrentRecord,"custpage_sublist_custpage_subtab_insur_claim","cust_fi_status_claim");
                colorAucStatus(CurrentRecord,"custpage_sublist_auction","custpage_auction_status");
                
                stayLastUsedTab(CurrentRecord);
				//setbreaktypes(CurrentRecord);
				//rearrangeColumns(CurrentRecord);
				//applyselect2();
				wrapsublistheaders();
          $(document).ready(function() {
    $('.js-example-basic-single').select2();
});
				advsObj.hideProcessingMessage();
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
          /*  if (scriptContext.fieldId == 'custpage_pageid') {
                var pageId = scriptContext.currentRecord.getValue({ fieldId : 'custpage_pageid' });
    
                pageId = parseInt(pageId.split('_')[1]);
    
                setWindowChanged(window,false);
                document.location = url.resolveScript({
                        scriptId : getParameterFromURL('script'),
                            deploymentId : getParameterFromURL('deploy'),
                    params : {
                            'page' : pageId
                }
            });
            }*/
            
            var CurrentRecord = scriptContext.currentRecord;
            var fieldId = scriptContext.fieldId;
    
              if(fieldId == "cust_select_veh_card" && scriptContext.sublistId == "custpage_sublist"){
                var LineNum = scriptContext.line;
                var LineCounttt	=	CurrentRecord.getLineCount({sublistId:"custpage_sublist"});
                var CheckMark = CurrentRecord.getSublistValue({sublistId: "custpage_sublist",fieldId: 'cust_select_veh_card',line:LineNum});
                if(CheckMark == 'T' || CheckMark == true || CheckMark == 'true'){
                      for(var linee=0;linee<LineCounttt; linee++){
                            if(LineNum != linee){
                                 CurrentRecord.selectLine({sublistId:'custpage_sublist',line:linee});
                                 CurrentRecord.setCurrentSublistValue({sublistId:"custpage_sublist",fieldId : "cust_select_veh_card",value:false,ignoreFieldChanged:true});
                                 CurrentRecord.commitLine({sublistId:'custpage_sublist'});
                            }
                       }
                }
              } 
    
            var name = scriptContext.fieldId;
            if(name == "custpage_brand" || name=="custpage_model"|| name == "custpage_location"|| name == "custpage_physicallocation"
                || name == "custpage_bucket" || name == "custpage_freq" || name == "custpage_pageid" || name == "custpage_vin"|| name == "custpage_vin_ff"||name=="custpage_softhold_status"
				||name=="custpage_inv_sh_customer"
				||name=="custpage_inv_beds"
				||name=="custpage_inv_apu"
				||name=="custpage_inv_sssize"
				||name=="custpage_inv_terms"
				||name=="custpage_inv_single_bunk"
				||name=="custpage_inv_truck_washed"
				||name=="custpage_inv_truck_ready"
				||name=="custpage_inv_body_style"
				||name=="custpage_inv_transmission"
				||name=="custpage_inv_engine"
				||name=="custpage_inv_year"
				||name=="custpage_inv_color"
               ||name=="custpage_inv_stock"
                || name == "custpage_inv_ttle_restr"|| name == "custpage_status"|| name == "custpage_color"|| name == "custpage_transmission"|| name == "custpage_salesrep"|| name == "custpage_mileage"|| name == "custpage_bucket_child"|| name == "custpage_deposit_filter"|| name == "custpage_salesrep_filter"
                || name == "custpage_repo_destination" || name == "custpage_repo_collections" || name == "custpage_repo_year"|| name == "custpage_repo_stock"|| name == "custpage_repo_lessee"|| name == "custpage_repo_dateassigned"|| name == "custpage_repo_company"
				|| name == "custpage_repo_mileage"|| name == "custpage_repo_model"|| name == "custpage_repo_location"
                || name == "custpage_repo_status_fld" || name == "custpage_repo_vin"
				|| name == "custpage_auc_ttl_restriction"|| name == "custpage_auc_ttl_sent"|| name == "custpage_auc_status"  || name == "custpage_auc_condition"  || name == "custpage_auc_date" || name == "custpage_auc_cleaned" || name == "custpage_auc_vin" || name == "custpage_auc_location"
                || name == "custpage_db_location"|| name == "custpage_db_contract" || name == "custpage_db_vin" || name == "custpage_db_customer"  || name == "custpage_db_salesrep"  || name == "custpage_db_truckready" || name == "custpage_db_washed" || name == "custpage_db_mcoo"|| name == "custpage_db_claim" || name == "custpage_db_stock" || name == "custpage_db_unit_condition"
				|| name == "custpage_tpt_truckstatusf"
				|| name == "custpage_tpt_statusf"
				|| name == "custpage_tpt_flocf"
				|| name == "custpage_tpt_tlocf"
				|| name == "custpage_tpt_stockf"
				
				) {
    
                var curRec = scriptContext.currentRecord;
    
                
                    var paramfilters = curRec.getValue({fieldId: 'custpage_filter_params'});
                    var pageId = curRec.getValue({fieldId: 'custpage_pageid'});
                    var brandid = curRec.getValue({fieldId: 'custpage_brand'});
                    var modelid = curRec.getValue({fieldId: 'custpage_model'});
                    var locid = curRec.getValue({fieldId: 'custpage_location'});
                    var plocid = curRec.getValue({fieldId: 'custpage_physicallocation'});
                    var buckid = curRec.getValue({fieldId: 'custpage_bucket'});
                    var buckCid = curRec.getValue({fieldId: 'custpage_bucket_child'});
                    var freqid = curRec.getValue({fieldId: 'custpage_freq'});
                    var vinid  = curRec.getValue({fieldId: 'custpage_vin'});
                    var vintext  = curRec.getValue({fieldId: 'custpage_vin_ff'});
                    var LeaseId = curRec.getValue({fieldId: 'custpage_old_lease_id'});
                    var OldVinId = curRec.getValue({fieldId: 'custpage_old_vin_id'});
                    var iframeObj = curRec.getValue({fieldId: 'custpage_i_frame_obj'});
                    var flagpara = curRec.getValue({fieldId: 'custpage_flag_para_obj'});
                    var status  = curRec.getValue({fieldId: 'custpage_status'});
                    var color  = curRec.getValue({fieldId: 'custpage_color'});
                    var transmission  = curRec.getValue({fieldId: 'custpage_transmission'});
                    var salesrep  = curRec.getValue({fieldId: 'custpage_salesrep'});
                    var mileage  = curRec.getValue({fieldId: 'custpage_mileage'});
                    var depofilter  = curRec.getValue({fieldId: 'custpage_deposit_filter'});
                    var salesrepfilter  = curRec.getValue({fieldId: 'custpage_salesrep_filter'});
                    var statushold  = curRec.getValue({fieldId: 'custpage_softhold_status'});
                    var ttlrest = curRec.getValue({fieldId: 'custpage_inv_ttle_restr'});
              var invstock = curRec.getValue({fieldId: 'custpage_inv_stock'});
					  
                    var shcustomer      = curRec.getValue({fieldId: 'custpage_inv_sh_customer'});
                    var invbeds         = curRec.getValue({fieldId: 'custpage_inv_beds'});
                    var invcolor        = curRec.getValue({fieldId: 'custpage_inv_color'});
                    var invyear         = curRec.getValue({fieldId: 'custpage_inv_year'});
                    var invengine       = curRec.getValue({fieldId: 'custpage_inv_engine'});
                    var invtransmission = curRec.getValue({fieldId: 'custpage_inv_transmission'});
                    var invbodystyle    = curRec.getValue({fieldId: 'custpage_inv_body_style'});
                    var invtruckready   = curRec.getValue({fieldId: 'custpage_inv_truck_ready'});
                    var invwashed       = curRec.getValue({fieldId: 'custpage_inv_truck_washed'});
                    var invsinglebunk   = curRec.getValue({fieldId: 'custpage_inv_single_bunk'});
                    var invterms        = curRec.getValue({fieldId: 'custpage_inv_terms'});
                    var invsssize       = curRec.getValue({fieldId: 'custpage_inv_sssize'});
                    var invapu          = curRec.getValue({fieldId: 'custpage_inv_apu'});


              
                    var Repostatus  =  curRec.getValue({fieldId: 'custpage_repo_status_fld'});
                    var RepoVin     =  curRec.getValue({fieldId: 'custpage_repo_vin'});
                    var RepoLoc     =  curRec.getValue({fieldId: 'custpage_repo_location'});
                    var RepoModel   =  curRec.getValue({fieldId: 'custpage_repo_model'});
                    var RepoMileage =  curRec.getValue({fieldId: 'custpage_repo_mileage'});
                    var RepoCompany =  curRec.getValue({fieldId: 'custpage_repo_company'});
                    var RepoDate    =  curRec.getValue({fieldId: 'custpage_repo_dateassigned'});
					
                    var Repocust    =  curRec.getValue({fieldId: 'custpage_repo_lessee'});
                    var Repostock    =  curRec.getValue({fieldId: 'custpage_repo_stock'});
                    var Repoyear    =  curRec.getValue({fieldId: 'custpage_repo_year'});
                    var Repocollec    =  curRec.getValue({fieldId: 'custpage_repo_collections'});
                    var Repodest    =  curRec.getValue({fieldId: 'custpage_repo_destination'}); 

                    var DBVin = curRec.getValue({fieldId: 'custpage_db_vin'});
                    var DBCustomer = curRec.getValue({fieldId: 'custpage_db_customer'});
                    var DBSalesRep = curRec.getValue({fieldId: 'custpage_db_salesrep'});
                    var DBTruckReady = curRec.getValue({fieldId: 'custpage_db_truckready'});
                    var DBWashed = curRec.getValue({fieldId: 'custpage_db_washed'});
                    var DBmc00 = curRec.getValue({fieldId: 'custpage_db_mcoo'});
                    var DBClaim = curRec.getValue({fieldId: 'custpage_db_claim'});
                    var DBStock = curRec.getValue({fieldId: 'custpage_db_stock'});
                    var DBUnitCondition = curRec.getValue({fieldId: 'custpage_db_unit_condition'});
                    var DBLocation = curRec.getValue({fieldId: 'custpage_db_location'});
                    var DBContract = curRec.getValue({fieldId: 'custpage_db_contract'});

                    

                    var InsStatus =  curRec.getValue({fieldId: 'custpage_ins_status'});
                    var AucCondition = curRec.getValue({fieldId:'custpage_auc_condition'});
                    var AucDate =  curRec.getText({fieldId:'custpage_auc_date'});
                    var AucCleaned =  curRec.getValue({fieldId:'custpage_auc_cleaned'});
                    var AucVin = curRec.getValue({fieldId:'custpage_auc_vin'});
                    var AucLoc = curRec.getValue({fieldId:'custpage_auc_location'});
                    var Aucstatus =  curRec.getValue({fieldId: 'custpage_auc_status'});
                    var Aucttlsent =  curRec.getValue({fieldId: 'custpage_auc_ttl_sent'});
                    var Aucttlrest =  curRec.getValue({fieldId: 'custpage_auc_ttl_restriction'});
					
                    var tpttstatus =  curRec.getValue({fieldId: 'custpage_tpt_truckstatusf'});
                    var tptstatus =  curRec.getValue({fieldId: 'custpage_tpt_statusf'});
                    var tptfloc =  curRec.getValue({fieldId: 'custpage_tpt_flocf'});
                    var tpttloc =  curRec.getValue({fieldId: 'custpage_tpt_tlocf'});
                    var tptstock =  curRec.getValue({fieldId: 'custpage_tpt_stockf'});
                    
					 

                    var Inv_tab  = curRec.getValue({fieldId: 'custpage_inv_tb'});
                    var Rep_tab  = curRec.getValue({fieldId: 'custpage_rep_tb'});
                    var Auc_tab  = curRec.getValue({fieldId: 'custpage_auc_tb'});
                    var Del_tab  = curRec.getValue({fieldId: 'custpage_del_tb'});
                    var Ins_tab  = curRec.getValue({fieldId: 'custpage_ins_tb'});
              
    
                    pageId = parseInt(pageId.split('_')[1]);
    
                    setWindowChanged(window, false);
                    document.location = url.resolveScript({
                        scriptId: getParameterFromURL('script'),
                        deploymentId: getParameterFromURL('deploy'),
                        params: {
                            'page': pageId,
							'filters':paramfilters,
                            'brand': brandid,
                            'model': modelid,
                            'locat': locid,
                            'plocat': plocid,
                            'bucket': buckid,
                            'bucketchild': buckCid,
                            'freq': freqid,
                            'unitvin': vinid,
                            'unitvintext': vintext,
                            'custpara_lease_id': LeaseId,
                            'custpara_old_vin': OldVinId,
                            'ifrmcntnr': iframeObj,
                            'custpara_flag_2': flagpara,
                            'status':status,
                            'color':color,
                            'transmission':transmission,
                            'salesrep':salesrep,
                            'mileage':mileage,
                            'depositfilter':depofilter,
                            'salesrepfilter':salesrepfilter,
                            'statushold':statushold,
                           'ttlrest':ttlrest, 
						  'sfcustomer' :shcustomer      ,
						  'invbed' :invbeds         ,
						  'invcolor' :invcolor        ,
						  'invyear' :invyear         ,
						  'invengine' :invengine       ,
						  'invtransm' :invtransmission ,
						  'bodystyle' :invbodystyle    ,
						  'invtruckready' :invtruckready   ,
						  'washed' :invwashed       ,
						  'singlebunk' :invsinglebunk   ,
						  'invterms' :invterms        ,
						  'invsssize' :invsssize       ,
						  'invapu' :invapu          ,
						   'invstock':invstock,
						    
						   
                            'inv_tab':Inv_tab,
                            'rep_tab':Rep_tab,
                            'auc_tab':Auc_tab,
                            'del_tab':Del_tab,
                            'ins_tab':Ins_tab,
                            'repo_sts':Repostatus, 
							'repo_vin':RepoVin   , 
							'repo_loc':RepoLoc        ,
							'repo_model':RepoModel         ,
							'repo_mil':RepoMileage       ,
							'repo_com':RepoCompany       ,
							'repo_date':RepoDate          ,
							'repo_cust':Repocust          ,
							'repo_stock':Repostock          ,
							'repo_year':Repoyear          ,
							'repo_collec':Repocollec          ,
							'repo_dest':Repodest          , 
                            'auc_sts':Aucstatus,
                            'ins_sts':InsStatus,
                            'auc_condition':AucCondition,
                            'auc_date':AucDate,
                            'auc_cleaned':AucCleaned,
                            'auc_vin':AucVin,
                            'auc_loc':AucLoc,
                            'auc_ttlsent':Aucttlsent,
                            'auc_ttlrest':Aucttlrest,
                            'DBVin':DBVin,
                            'DBCustomer':DBCustomer,
                            'DBSalesRep':DBSalesRep,
                            'DBTruckReady':DBTruckReady,
                            'DBWashed':DBWashed,
                            'DBmc00':DBmc00,
                            'DBClaim':DBClaim,
                            'DBStock':DBStock,
                            'DBUnitCondition':DBUnitCondition,
							'DBLocation':DBLocation,
							'DBContract':DBContract,
							'tpttstatus': tpttstatus,
							'tptstatus': tptstatus,
							'tptfloc': tptfloc, 
							'tpttloc': tpttloc,  
							'tptstock': tptstock 
							
                        }
                    });
    
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
             var CurrentRecord = scriptContext.currentRecord;
             var LineCount	=	CurrentRecord.getLineCount({sublistId:"custpage_sublist"});
            
            var RecId	=	0;
            for(var line=0;line<LineCount; line++){
                var CheMark	=  CurrentRecord.getSublistValue({sublistId:"custpage_sublist",fieldId:"cust_select_veh_card",line:line})
                if(CheMark == "T" || CheMark == true || CheMark == 'true'){
                    RecId	=	1;
                    break;
                }
            }
            var selectedLines = 0;
            for(var JJ=0;JJ<LineCount; JJ++){
                var CheMark	=  CurrentRecord.getSublistValue({sublistId:"custpage_sublist",fieldId:"cust_select_veh_card",line:JJ})
                if(CheMark == "T" || CheMark == true || CheMark == 'true'){
                    selectedLines++;
                }
            }
            
            if(RecId == 1 ){
                if(selectedLines>1){
                    alert("Please select only one Machine to Submit.");
                    return false;
                }
                else{
                    return true;
                }
            }else{
                alert("Please select at least one Machine to Submit.");
                return false;
            }
        }
    
        function redirectToPage(newStartIndex) {
    
            var url = window.location.href;
            var separator = (url.indexOf('?') > -1) ? '&' : '?';
            window.location.href = url + separator + 'start=' + newStartIndex;
        }
        function getSuiteletPage(suiteletScriptId, suiteletDeploymentId, pageId) {
           var currenturl = window.location.href;
          console.log('url',url);
          
            document.location = replaceUrlParam(currenturl,'page',pageId)
           /*  document.location = url.resolveScript({
                    scriptId : suiteletScriptId,
                        deploymentId : suiteletDeploymentId,
                params : {
                        'page' : pageId
            }
        }); */
        }
        function replaceUrlParam(url, paramName, paramValue){
        if(paramValue == null)
            paramValue = '';
        url = url.replace(/\?$/,'');
        var pattern = new RegExp('\\b('+paramName+'=).*?(&|$)')
        if(url.search(pattern)>=0){
            return url.replace(pattern,'$1' + paramValue + '$2');
        }
        return url + (url.indexOf('?')>0 ? '&' : '?') + paramName + '=' + paramValue 
    }
    
    
        function getParameterFromURL(param) {
            var query = window.location.search.substring(1);
            var vars = query.split("&");
            for (var i = 0; i < vars.length; i++) {
                var pair = vars[i].split("=");
                if (pair[0] == param) {
                    return decodeURIComponent(pair[1]);
                }
            }
            return (false);
        }
        function ShowHide(j) {
            try{
    
                if(document.getElementById('tr_fg_custpage_fil_gp').style.display=='none'){
                    document.getElementById('tr_fg_custpage_fil_gp').style.display='';
                }else{
                    document.getElementById('tr_fg_custpage_fil_gp').style.display='none';
                }
            }catch (e) {
    //		alert(e.message);
            }
        }
       function doCollapse(){
           try{
    
               if(1)
               {
                   var Element = document.getElementById("detail_table_lay").rows.length;//Find Length of Rows
                    for(var i=1;i<10000;i++){
                       (function(i){
                           Element = document.getElementById('fg_custpage_fil_gp');
                           if(Element!=null && Element!=undefined && Element!='null' && Element!='undefined'){
    //						if(i!=340){
                               document.getElementById('tr_fg_custpage_fil_gp').style.display='normal';
    //						}
                               Element.addEventListener('click',function(){
    
                                   ShowHide(i)
                               },false);
                           }
                       })(i,this)
                   }
               }
    
           }catch(e){
               alert(e+"   "+e.message);
           }
        }
      function inventoryAccordian(){
            try{
                //var arr =[0,4,8,12,16,20,24,28,32,36];
                var multiplesArray = generateMultiplesOfTwo(1000); // generates [2, 4, 6, 8, 10]
                    var arr =multiplesArray;
                 
                for(var i=1;i<=jQuery("[id^='custpage_sublistrow']").length;i++){
                    var id = 'custpage_sublistrow'+i;
                    if(!arr.includes(i)){ 
                    jQuery('#'+id).hide(); 
                    }else{continue;}
                }
            }catch(e)
            {
                alert('error'+e.message);
            }
      }
      function generateMultiplesOfTwo(length) {
          const multiples = [];
          for (var i = 1; i <= length; i++) {
              multiples.push(i * 2);
          }
          return multiples;
      }
	  function disableEnableFields1(CurrentRecord){
            const InventoryTab = document.getElementById('custpage_veh_tablnk');
            const ReposessionTab = document.getElementById('custpage_repo_tablnk');
            const AuctionTab = document.getElementById('custpage_auction_tablnk');
            const deliveryTab = document.getElementById('custpage_delivery_tablnk');
            const InventorySummary = document.getElementById('custpage_summary_tablnk');
            const InsurClaimtab = document.getElementById('custpage_claim_tablnk');
            if (InventoryTab) {
                InventoryTab.addEventListener('click', function (event) {
                    event.preventDefault(); 
                    var FieldsToUnCheck = ['custpage_del_tb','custpage_rep_tb','custpage_auc_tb','custpage_ins_tb'];
                    CurrentRecord.setValue({fieldId:"custpage_inv_tb",value:true});
                    unCheckFields(CurrentRecord,FieldsToUnCheck,false);
                });
            }
            if (ReposessionTab) {
                ReposessionTab.addEventListener('click', function (event) {
                    event.preventDefault(); 
                    var FieldsToUnCheck = ['custpage_inv_tb','custpage_del_tb','custpage_auc_tb','custpage_ins_tb'];
                    CurrentRecord.setValue({fieldId:"custpage_rep_tb",value:true});
                    unCheckFields(CurrentRecord,FieldsToUnCheck,false);
                });
            }
            if (AuctionTab) {
                AuctionTab.addEventListener('click', function (event) {
                    event.preventDefault(); 
                    var FieldsToUnCheck = ['custpage_inv_tb','custpage_rep_tb','custpage_del_tb','custpage_ins_tb'];
                    CurrentRecord.setValue({fieldId:"custpage_auc_tb",value:true});
                    unCheckFields(CurrentRecord,FieldsToUnCheck,false);
                });
            }
            if (deliveryTab) {
                deliveryTab.addEventListener('click', function (event) {
                    event.preventDefault(); 
                    var FieldsToUnCheck = ['custpage_inv_tb','custpage_rep_tb','custpage_auc_tb','custpage_ins_tb'];
                    CurrentRecord.setValue({fieldId:"custpage_del_tb",value:true});
                    unCheckFields(CurrentRecord,FieldsToUnCheck,false);
                });
            }
            if (InventorySummary) {
                InventorySummary.addEventListener('click', function (event) {
                    event.preventDefault(); 
                    var FieldsToUnCheck = ['custpage_inv_tb','custpage_rep_tb','custpage_auc_tb','custpage_del_tb','custpage_ins_tb'];
                    unCheckFields(CurrentRecord,FieldsToUnCheck,false);
                });
            }
            if (InsurClaimtab) {
                InsurClaimtab.addEventListener('click', function (event) {
                    event.preventDefault(); 
                        var FieldsToUnCheck = ['custpage_inv_tb','custpage_rep_tb','custpage_auc_tb','custpage_del_tb'];
                        CurrentRecord.setValue({fieldId:"custpage_ins_tb",value:true});
                        unCheckFields(CurrentRecord,FieldsToUnCheck,false);
                });
            }
      }
      function disableEnableFields(CurrentRecord){
            const InventoryTab = document.getElementById('custpage_veh_tablnk');
            const ReposessionTab = document.getElementById('custpage_repo_tablnk');
            const AuctionTab = document.getElementById('custpage_auction_tablnk');
            const deliveryTab = document.getElementById('custpage_delivery_tablnk');
            const InventorySummary = document.getElementById('custpage_summary_tablnk');
            const InsurClaimtab = document.getElementById('custpage_claim_tablnk');
            if (InventoryTab) {
                InventoryTab.addEventListener('click', function (event) {
                    event.preventDefault();
                    var fieldsToShow1 = ['custpage_status','custpage_mileage','custpage_softhold_status','custpage_bucket','custpage_freq','custpage_location','custpage_vin','custpage_vin_ff','custpage_model','custpage_salesrep_filter','custpage_deposit_filter'];
                    var fieldsToHide1 = ['custpage_repo_status_fld','custpage_auc_status','custpage_ins_status'];
                    document.querySelector("[id='custpage_colorcoding_repo_fs']").style.display = "none";
                    document.querySelector("[id='custpage_colorcoding_inv_fs']").style.display = "";
                    document.querySelector("[id='custpage_colorcoding_auc_fs']").style.display = "none";
                    document.querySelector("[id='custpage_colorcoding_ins_fs']").style.display = "none";
                    DisableFields(CurrentRecord,fieldsToShow1,false);
                    DisableFields(CurrentRecord,fieldsToHide1,true);
                    var FieldsToUnCheck = ['custpage_del_tb','custpage_rep_tb','custpage_auc_tb','custpage_ins_tb'];
                    CurrentRecord.setValue({fieldId:"custpage_inv_tb",value:true});
                    unCheckFields(CurrentRecord,FieldsToUnCheck,false);
                });
            }
            if (ReposessionTab) {
                ReposessionTab.addEventListener('click', function (event) {
                    event.preventDefault();
                    var fieldsToHide2 = ['custpage_model','custpage_status','custpage_mileage','custpage_softhold_status','custpage_bucket','custpage_freq','custpage_deposit_filter','custpage_salesrep_filter','custpage_auc_status','custpage_ins_status'];
                    var fieldsToShow2 = ['custpage_location','custpage_vin','custpage_vin_ff','custpage_repo_status_fld'];
                    document.querySelector("[id='custpage_colorcoding_repo_fs']").style.display = "";
                    document.querySelector("[id='custpage_colorcoding_inv_fs']").style.display = "none";
                    document.querySelector("[id='custpage_colorcoding_auc_fs']").style.display = "none";
                    document.querySelector("[id='custpage_colorcoding_ins_fs']").style.display = "none";
                    DisableFields(CurrentRecord,fieldsToHide2,true);
                    DisableFields(CurrentRecord,fieldsToShow2,false);
                    var FieldsToUnCheck = ['custpage_inv_tb','custpage_del_tb','custpage_auc_tb','custpage_ins_tb'];
                    CurrentRecord.setValue({fieldId:"custpage_rep_tb",value:true});
                    unCheckFields(CurrentRecord,FieldsToUnCheck,false);
                });
            }
            if (AuctionTab) {
                AuctionTab.addEventListener('click', function (event) {
                    event.preventDefault();
                    var fieldsToHide3 = ['custpage_model','custpage_status', 'custpage_salesrep_filter','custpage_softhold_status','custpage_bucket','custpage_freq','custpage_deposit_filter','custpage_mileage','custpage_repo_status_fld','custpage_ins_status']; 
                    var fieldsToShow3 = ['custpage_location','custpage_vin','custpage_vin_ff','custpage_auc_status'];
                    document.querySelector("[id='custpage_colorcoding_repo_fs']").style.display = "none";
                    document.querySelector("[id='custpage_colorcoding_inv_fs']").style.display = "none";
                    document.querySelector("[id='custpage_colorcoding_auc_fs']").style.display = "";
                    document.querySelector("[id='custpage_colorcoding_ins_fs']").style.display = "none";
                    DisableFields(CurrentRecord,fieldsToHide3,true);
                    DisableFields(CurrentRecord,fieldsToShow3,false);
                    var FieldsToUnCheck = ['custpage_inv_tb','custpage_rep_tb','custpage_del_tb','custpage_ins_tb'];
                    CurrentRecord.setValue({fieldId:"custpage_auc_tb",value:true});
                    unCheckFields(CurrentRecord,FieldsToUnCheck,false);
                });
            }
            if (deliveryTab) {
                deliveryTab.addEventListener('click', function (event) {
                    event.preventDefault();
                    var fieldsToHide4 = ['custpage_status','custpage_mileage','custpage_softhold_status','custpage_bucket','custpage_freq','custpage_deposit_filter','custpage_model','custpage_salesrep_filter','custpage_repo_status_fld','custpage_ins_status','custpage_auc_status']; 
                    var fieldsToShow4 = ['custpage_location','custpage_vin','custpage_vin_ff'];
                    document.querySelector("[id='custpage_colorcoding_repo_fs']").style.display = "none";
                    document.querySelector("[id='custpage_colorcoding_inv_fs']").style.display = "none";
                    document.querySelector("[id='custpage_colorcoding_auc_fs']").style.display = "none";
                    document.querySelector("[id='custpage_colorcoding_ins_fs']").style.display = "none";
                    DisableFields(CurrentRecord,fieldsToHide4,true);
                    DisableFields(CurrentRecord,fieldsToShow4,false);
                    var FieldsToUnCheck = ['custpage_inv_tb','custpage_rep_tb','custpage_auc_tb','custpage_ins_tb'];
                    CurrentRecord.setValue({fieldId:"custpage_del_tb",value:true});
                    unCheckFields(CurrentRecord,FieldsToUnCheck,false);
                });
            }
            if (InventorySummary) {
                InventorySummary.addEventListener('click', function (event) {
                    event.preventDefault();
                    var fieldsToHide5 = ['custpage_status','custpage_mileage','custpage_softhold_status','custpage_bucket','custpage_freq','custpage_deposit_filter','custpage_model','custpage_location','custpage_vin','custpage_vin_ff','custpage_salesrep_filter','custpage_repo_status_fld','custpage_ins_status','custpage_auc_status'];
                    document.querySelector("[id='custpage_colorcoding_repo_fs']").style.display = "none";
                    document.querySelector("[id='custpage_colorcoding_inv_fs']").style.display = "none";
                    document.querySelector("[id='custpage_colorcoding_auc_fs']").style.display = "none";
                    document.querySelector("[id='custpage_colorcoding_ins_fs']").style.display = "none";
                    DisableFields(CurrentRecord,fieldsToHide5,true);
                    var FieldsToUnCheck = ['custpage_inv_tb','custpage_rep_tb','custpage_auc_tb','custpage_del_tb','custpage_ins_tb'];
                    unCheckFields(CurrentRecord,FieldsToUnCheck,false);
                });
            }
            if (InsurClaimtab) {
                InsurClaimtab.addEventListener('click', function (event) {
                    event.preventDefault();
                    var fieldsToHide6 = ['custpage_status','custpage_mileage','custpage_softhold_status','custpage_bucket','custpage_freq','custpage_deposit_filter','custpage_model','custpage_location','custpage_salesrep_filter','custpage_repo_status_fld','custpage_auc_status'];
                    var fieldsToShow6 = ['custpage_ins_status','custpage_vin','custpage_vin_ff']
                        document.querySelector("[id='custpage_colorcoding_repo_fs']").style.display = "none";
                        document.querySelector("[id='custpage_colorcoding_inv_fs']").style.display = "none";
                        document.querySelector("[id='custpage_colorcoding_auc_fs']").style.display = "none";
                        document.querySelector("[id='custpage_colorcoding_ins_fs']").style.display = "";
                        DisableFields(CurrentRecord,fieldsToHide6,true);
                        DisableFields(CurrentRecord,fieldsToShow6,false);
                        var FieldsToUnCheck = ['custpage_inv_tb','custpage_rep_tb','custpage_auc_tb','custpage_del_tb'];
                        CurrentRecord.setValue({fieldId:"custpage_ins_tb",value:true});
                        unCheckFields(CurrentRecord,FieldsToUnCheck,false);
                });
            }
      }
      function DisableFields(CurrentRecord ,fields,value){
        for (var i = 0; i < fields.length ; i++ ){
            var fldobj = CurrentRecord.getField({fieldId: fields[i]});
                fldobj.isDisabled = value;
        }
      }
      function unCheckFields(CurrentRecord,FieldsToUnCheck,values){
        for (var i = 0; i < FieldsToUnCheck.length ; i++ ){
          CurrentRecord.setValue({fieldId: FieldsToUnCheck[i] , value:values});
        }
      }
      function stayLastUsedTab(CurrentRecord){
            var Inv_tab = CurrentRecord.getValue({fieldId:"custpage_inv_tb"});
            var Rep_tab = CurrentRecord.getValue({fieldId:"custpage_rep_tb"});
            var Auc_tab = CurrentRecord.getValue({fieldId:"custpage_auc_tb"});
            var Del_tab = CurrentRecord.getValue({fieldId:"custpage_del_tb"});
            var Ins_tab = CurrentRecord.getValue({fieldId:"custpage_ins_tb"});
            
           //alert("Inv_tab = > "+Inv_tab+" Rep_tab = > "+Rep_tab+ "\n Auc_tab = >"+Auc_tab+" Del_tab = >"+Del_tab);
           if((Inv_tab != true || Inv_tab != "T") && (Rep_tab != true || Rep_tab != "T") && (Auc_tab != true || Auc_tab != "T") && (Del_tab != true || Del_tab != "T") && (Ins_tab != true || Ins_tab != "true")){
             document.querySelector("[id='custpage_veh_tabtxt']").click();
           }
            if (Inv_tab == true || Inv_tab == "true" || Inv_tab == "T") {
                document.querySelector("[id='custpage_veh_tabtxt']").click();
            }
            if (Rep_tab == true || Rep_tab == "true" || Rep_tab == "T") {
                document.querySelector("[id='custpage_repo_tabtxt']").click();
            }
            if (Auc_tab == true || Auc_tab == "true" || Auc_tab == "T") {
                document.querySelector("[id='custpage_auction_tabtxt']").click();
            }
            if (Del_tab == true || Del_tab == "true" || Del_tab == "T") {
                document.querySelector("[id='custpage_delivery_tabtxt']").click();
            }
            if(Ins_tab == true || Ins_tab == "true" || Ins_tab == "T"){
                document.querySelector("[id='custpage_claim_tabtxt']").click();
            }
      }
        function popupCenter(stock)
        {
            var title='';
            var url = 'https://8760954.app.netsuite.com/app/site/hosting/scriptlet.nl?script=1644&deploy=1&repo='+stock;
                        var left = (screen.width/2)-(500/2);
                        var top = (screen.height/2)-(500/2);
                        var targetWin = window.open (url, title);
                       
        }
        function openterminationpop()
        {
            var title='';
            var url = 'https://8760954.app.netsuite.com/app/site/hosting/scriptlet.nl?script=1644&deploy=1&repo='+stock;
            var left = (screen.width/2)-(500/2);
            var top = (screen.height/2)-(500/2);
            var targetWin = window.open (url, title, 'width=900, height=500, top='+top+', left='+left);
                       
        }
        function openholdpop()
        {
            var title='';
            var url = 'https://8760954.app.netsuite.com/app/site/hosting/scriptlet.nl?script=1644&deploy=1&repo='+stock;
            var left = (screen.width/2)-(500/2);
            var top = (screen.height/2)-(500/2);
            var targetWin = window.open (url, title, 'width=900, height=500, top='+top+', left='+left);
                       
        }
       function openfiltersetup(userid)
        {
			
            var title='';
            var url = 'https://8760954.app.netsuite.com/app/site/hosting/scriptlet.nl?script=2604&deploy=1&user='+userid;
            var left = (screen.width/2)-(500/2);
            var top = (screen.height/2)-(500/2);
            var targetWin = window.open (url, title, 'width=900, height=500, top='+top+', left='+left);
                       
        }
        function opennewclaim()
        {
            debugger;
           var suiteletURL = url.resolveScript({
                scriptId:'customscript_advs_claim_entry_sheet',
                deploymentId: 'customdeploy_advs_claim_entry_sheet',
                 
            });
            window.open(suiteletURL, "_blank",  "width=1000, height=500" );
        }
		function edittransportsheet()
        {
            debugger;
           var suiteletURL = url.resolveScript({
                scriptId:'customscript_advs_update_transport',
                deploymentId: 'customdeploy_advs_update_transport',
                 
            });
            window.open(suiteletURL, "_blank",  "width=1000, height=500" );
        }
        function colorReposession(CurrentRecord,sublist,field)
        {
            try{
                var lineCount = CurrentRecord.getLineCount({sublistId: sublist });
                var obj = colorsForRepo();
                var colsToColor = 1;
                for (var L = 0; L < lineCount; L++) {
             
                  var status = CurrentRecord.getSublistValue({sublistId: sublist,fieldId: field,line: L}); //custpage_repo_status
                     if(status==16){ 
                        applycolor(obj.BackGroundColSecured,obj.TextColNeedassmnt,L,sublist,colsToColor);
                     }
                     else if(status==14){ 
                        applycolor(obj.BackGroundColNeedassmnt,obj.TextColNeedassmnt,L,sublist,colsToColor);
                     } else if(status==27){
                        applycolor(obj.BackGroundColPendingRedeem,obj.TextColredem,L,sublist,colsToColor);
                     } else if(status==22 ||status==23 ||status==24 ){ 
                        applycolor(obj.BackGroundColTransitLRM,obj.TextColredem,L,sublist,colsToColor);
                     }else if(status==25){ 
                        applycolor(obj.BackGroundColTransitAuction,obj.TextColNeedassmnt,L,sublist,colsToColor);
                     }else if(status==28){ 
                        applycolor(obj.BkLegel,obj.TextColNeedassmnt,L,sublist,colsToColor);
                     } else if(status==15){ 
                        applycolor(obj.BackGroundColOFR,obj.TextColredem,L,sublist,colsToColor);
                     } else if(status==30){ 
                        applycolor(obj.BackGroundColWaitingpu,obj.TextColredem,L,sublist,colsToColor);
                     } 
                  else if(status==29){ 
                        applycolor(obj.pendingLegel,obj.TextColredem,L,sublist,colsToColor);
                     } 
                }
            }catch(e)
            {
                log.debug('error',e.toString())
            }
        }
        function colorInventory(CurrentRecord,sublist,field){
            try{
                var lineCount = CurrentRecord.getLineCount({sublistId: sublist });
                var obj = colorsForInventory();
                var colsToColor = 7;
                for (var L = 0; L < lineCount; L++) {
                  var status = CurrentRecord.getSublistValue({sublistId: sublist,fieldId: field,line: L});//custpabe_m_status
                     if(status==22){ 
                        applycolor(obj.BackGroundColEnroute,obj.TextColNeedassmnt,L,sublist,colsToColor);
                     }
                     else if(status==20){ 
                        applycolor(obj.BackGroundColInShop,obj.TextColNeedassmnt,L,sublist,colsToColor);
                     } else if(status==23){ 
                        applycolor(obj.BackGroundColHold,obj.TextColredem,L,sublist,colsToColor);
                     } else if(status==21 ){ 
                        // applycolor(obj.BackGroundColOnSite,obj.TextColredem,L,sublist);
                        applycolor(obj.BackGroundColEnroute,obj.TextColredem,L,sublist,colsToColor);
                     }else if(status==19){ 
                        applycolor(obj.BackGroundColReady,obj.TextColNeedassmnt,L,sublist,colsToColor);
                     }else if(status==24){ 
                        applycolor(obj.BackGroundColSRD,obj.TextColNeedassmnt,L,sublist,colsToColor);
                     }  
                }
            }catch(e)
            {
                log.debug('error',e.toString())
            }
        }
        function colorPayemnt(CurrentRecord,sublist,field){
            try{
                var lineCount = CurrentRecord.getLineCount({sublistId: sublist });
                var colsToColor = 7;
                var obj = colorsForInventory();
                for (var L = 0; L < lineCount; L++) {
                  var highlight = CurrentRecord.getSublistValue({sublistId: sublist,fieldId: field,line: L});  //cust_select_checkbox_highlight
                     if(highlight == true){ 
                        applycolor(obj.Paymentcolor,obj.TextColNeedassmnt,L,sublist,colsToColor);
                     }
                }
            }catch(e)
            {
                log.debug('error',e.toString())
            }
        }
        function applycolor(BackGroundCol,TextCol,L,elementid,colsToColor){
            var trDom = document.getElementById(elementid+'row' + L);
            var trDomChild = trDom.children;
                for (var t = 0; t < (trDomChild.length); t++) {
                        var tdDom = trDomChild[t];
                        var CheckField = tdDom.style.display;
                        if (CheckField != 'none') {
                            var StringToSet = "";
                            if (BackGroundCol != "" && BackGroundCol != " ") {
                                StringToSet += "background-color:" + BackGroundCol + "!important;font-weight:bold !important;";
                            }
                            if (TextCol != "" && TextCol != " ") {
                                //StringToSet += "color:" + TextCol + "!important; font-weight:bold !important;";
                            }
                            if (StringToSet != "" && StringToSet != " ") {
                                if(t==colsToColor){
                                    tdDom.setAttribute('style', '' + StringToSet + '');
                                }
                            }
                        }
                }
        }
        function colorsForRepo(){
            var obj={};
                obj.BackGroundColNeedassmnt = "#ef4444"//"#FF0000";
                obj.BackGroundColOFR = "#E3BC9A";
                obj.BackGroundColSecured = "#bd7ee4"//"#A020F0";
                obj.BackGroundColPendingRedeem = "#f1f167"//"#FFFF00";
                obj.BackGroundColWaitingpu = "#FFA500";
                obj.BackGroundColTransitLRM = "#87CEEB";
                obj.BackGroundColTransitJT = "#87CEEB";
                obj.BackGroundColTransitTTD = "#87CEEB";
                obj.BackGroundColTransitAuction = "#9de79d"//"#008000";
                obj.BkLegel = "#ef4444"//"#FF0000";
                obj.pendingLegel = "#FF0000";
                obj.TextCol   = "#000000";
                obj.TextColNeedassmnt = "#ef4444"//"#FFFFFF"
                obj.TextColredem = "#000000"
                return obj;
        }
        function colorsForInventory(){
            var obj={};
            obj.BackGroundColEnroute = "#d5eaf8"//"#0000FF";
            obj.BackGroundColInShop = "#fbf3cf"//"#FFA500";
            obj.BackGroundColHold = "#ffc6ce"//"#FF0000";
            obj.BackGroundColOnSite = "#d0cece";
            obj.BackGroundColReady = "#d4f5e2"//"#008000";
            obj.BackGroundColSRD = "#8B8000"; 
            
            obj.TextCol   = "#000000";
            obj.TextColNeedassmnt = "#FFFFFF"
            obj.TextColredem = "#000000"
            obj.Paymentcolor = '#FFFF00';
            return obj;
        }
        function colorSoftHold(CurrentRecord,SublistId,FieldId){ // ABDUL
              var lineCount = CurrentRecord.getLineCount({sublistId: SublistId });
                    var SofHoldColor = "#F6F625";
                    var ReleaseColor = "#28A745";
                    var withoutValColor = "#FFFFFF";
                    var textColor  = "#000000";
                    var colsToColor = "All";
                    for (var L = 0; L < lineCount; L++) {
                      var Soft_Hold_status = CurrentRecord.getSublistValue({sublistId: SublistId,fieldId: FieldId,line: L});//custpabe_m_softhold_status
                         if(Soft_Hold_status == 1){
                            applycolorSoftHold(SofHoldColor,textColor,L,SublistId,colsToColor);
                         }
                         else if(Soft_Hold_status == 2){
                            applycolorSoftHold(ReleaseColor,textColor,L,SublistId,colsToColor);
                         }
                         else if (Soft_Hold_status == "" || Soft_Hold_status == null || Soft_Hold_status == undefined){
                            applycolorSoftHold(withoutValColor,textColor,L,SublistId,colsToColor);
                         }
                    }
        }
        function colorTitleRes(CurrentRecord,SublistId,FieldId){ // ABDUL
            var lineCount = CurrentRecord.getLineCount({sublistId: SublistId });
            var colsToColor = 17;
                for (var L = 0; L < lineCount; L++) {
                    var TitleRestriction = CurrentRecord.getSublistValue({sublistId: SublistId,fieldId: FieldId,line: L});
                    if(TitleRestriction == "Yes"){
                        applyColorTitleRes("#FFCCCB","#000000",L,SublistId,colsToColor);
                    }
                }
         }
      function colorInTowYard(CurrentRecord,SublistId,FieldId){ // ABDUL
            var lineCount = CurrentRecord.getLineCount({sublistId: SublistId });
            var colsToColor = 15;
                for (var L = 0; L < lineCount; L++) {
                    var InTowYard = CurrentRecord.getSublistValue({sublistId: SublistId,fieldId: FieldId,line: L});
                    if(InTowYard == 1 || InTowYard == "1" || InTowYard == "Yes"){
                        applyColorTitleRes("#FFCCCB","#000000",L,SublistId,colsToColor);
                    }
                }
      }
      function colorInsStatus(CurrentRecord,SublistId,FieldId){ // ABDUL
        var lineCount = CurrentRecord.getLineCount({sublistId: SublistId });
        var colsToColor = 2;
            for (var L = 0; L < lineCount; L++) {
                var InsStatus = CurrentRecord.getSublistValue({sublistId: SublistId,fieldId: FieldId,line: L});
                
                if(InsStatus == "Pending Claim"){
                    applyColorTitleRes("#ea3a3a","#000000",L,SublistId,colsToColor);
                }
                else if(InsStatus == "Open Claim"){
                    applyColorTitleRes("#e0c9c9","#000000",L,SublistId,colsToColor);
                }
                else if(InsStatus == "Closed Claim"){
                    applyColorTitleRes("#FFFFFF",null,L,SublistId,colsToColor);
                }
                else if(InsStatus == "Waiting for Repair"){
                    applyColorTitleRes("#ffff12","#000000",L,SublistId,colsToColor);
                }
                else if(InsStatus == "Pending Payment"){
                    applyColorTitleRes("#17c2cf","#000000",L,SublistId,colsToColor);
                }
            }
      }
       function colorAucStatus(CurrentRecord,SublistId,FieldId){ // ABDUL
        var lineCount = CurrentRecord.getLineCount({sublistId: SublistId });
        var colsToColor = 1;
            for (var L = 0; L < lineCount; L++) {
                var AucStatus = CurrentRecord.getSublistValue({sublistId: SublistId,fieldId: FieldId,line: L});
                
                if(AucStatus == "Logistics to Auction"){
                    applyColorTitleRes("#FFCCCB","#000000",L,SublistId,colsToColor);
                }
                else if(AucStatus == "On Site - Waiting Sales"){
                    applyColorTitleRes("#D8EBF8","#000000",L,SublistId,colsToColor);
                }
                else if(AucStatus == "Sold - Pending Payment"){
                    applyColorTitleRes("#DFF8D8",null,L,SublistId,colsToColor);
                }
                else if(AucStatus == "En Route to Auction"){
                    applyColorTitleRes("#07eb0f","#000000",L,SublistId,colsToColor);
                }
                else if(AucStatus == "Re - Run- Bad Sale"){
                    applyColorTitleRes("#f6ff00","#000000",L,SublistId,colsToColor);
                }
                else if(AucStatus == "Pending Payment"){
                    applyColorTitleRes("#DFF8D8","#000000",L,SublistId,colsToColor);
                }
            }
      }
      function applycolorSoftHold(BackGroundCol,TextCol,L,elementid,colsToColor){  // ABDUL
            var trDom = document.getElementById(elementid+'row' + L);
            var trDomChild = trDom.children;
            for (var t = 0; t < (trDomChild.length); t++) {
                var tdDom      = trDomChild[t];
                var CheckField = tdDom.style.display;
                if (CheckField != 'none') {
                    var StringToSet = "";
                    if (BackGroundCol != "" && BackGroundCol != " ") {
                        StringToSet += "background-color:" + BackGroundCol + "!important;";
                    }
                    if (TextCol != "" && TextCol != " ") {
                        //StringToSet += "color:" + TextCol + "!important; font-weight:bold !important;";
                    }
                    if (StringToSet != "" && StringToSet != " ") {
                        // if(t==7){
                            tdDom.setAttribute('style', '' + StringToSet + '');
                        // }
                    }
                }
            }
        }
       function applyColorTitleRes(BackGroundCol,TextCol,L,elementid,colsToColor){   // ABDUL
            var trDom = document.getElementById(elementid+'row' + L);
            var trDomChild = trDom.children;
                for (var t = 0; t < (trDomChild.length); t++) {
                    var tdDom = trDomChild[t];
                    var CheckField = tdDom.style.display;
                    if (CheckField != 'none') {
                        var StringToSet = "";
                        if (BackGroundCol != "" && BackGroundCol != " ") {
                            StringToSet += "background-color:" + BackGroundCol + "!important;";
                        }
                        if (TextCol != "" && TextCol != " ") {
                            //StringToSet += "color:" + TextCol + "!important; font-weight:bold !important;";
                        }
                        if (StringToSet != "" && StringToSet != " ") {
                            if(t==colsToColor){
                                tdDom.setAttribute('style', '' + StringToSet + '');
                            }
                        }
                    }
                }
        }
		function togglefiltersbwntabs(CurrentRecord) {

      var filtersdata = CurrentRecord.getValue({
        fieldId: 'custpage_filter_params'
      });
      var filtersdataids = getfilters();
	  var paramfilters = getUrlParameter("filters")||'[]';
	  var _filters = JSON.parse(paramfilters)
      var fdata = JSON.parse(filtersdata);
      const InventoryTab = document.getElementById('custpage_veh_tablnk');
      const ReposessionTab = document.getElementById('custpage_repo_tablnk');
      const AuctionTab = document.getElementById('custpage_auction_tablnk');
      const deliveryTab = document.getElementById('custpage_delivery_tablnk');
      const InventorySummary = document.getElementById('custpage_summary_tablnk');
      const InsurClaimtab = document.getElementById('custpage_claim_tablnk');
      const Transporttab = document.getElementById('custpage_tpt_tablnk');
	  
		 //HIDE ALL FILTERS 
			 jQuery('#fg_custpage_fil_gp').closest('table').closest('tr').show()
			 jQuery('#fg_custpage_fil_gp_repo').closest('table').closest('tr').hide()
			 jQuery('#fg_custpage_fil_gp_auc').closest('table').closest('tr').hide()
			 jQuery('#fg_custpage_fil_gp_db').closest('table').closest('tr').hide()
			 jQuery('#fg_custpage_fil_gp_ins').closest('table').closest('tr').hide()
			 jQuery('#tr_fg_custpage_fil_gp tr.uir-field-wrapper-cell ').hide()
			 
			 //SHOW ONLY AUCTION FILTERS
			 if(_filters.includes(1 ))$("div").find("[data-field-name='custpage_vin']").closest('tr').hide()
			 if(_filters.includes(2 ))$("div").find("[data-field-name='custpage_vin_ff']").closest('tr').hide()
			 if(_filters.includes(3 ))$("div").find("[data-field-name='custpage_model']").closest('tr').hide()
			 if(_filters.includes(4 ))$("div").find("[data-field-name='custpage_location']").closest('tr').hide()
			 if(_filters.includes(5 ))$("div").find("[data-field-name='custpage_status']").closest('tr').hide()
			 if(_filters.includes(6 ))$("div").find("[data-field-name='custpage_salesrep_filter']").closest('tr').hide()
			 if(_filters.includes(7 ))$("div").find("[data-field-name='custpage_softhold_status']").closest('tr').hide()
			 if(_filters.includes(8 ))$("div").find("[data-field-name='custpage_mileage']").closest('tr').hide()
			 if(_filters.includes(9 ))$("div").find("[data-field-name='custpage_bucket']").closest('tr').hide()
			 if(_filters.includes(10))$("div").find("[data-field-name='custpage_bucket_child']").closest('tr').hide()
			 if(_filters.includes(11))$("div").find("[data-field-name='custpage_freq']").closest('tr').hide()
				 
			 if(_filters.includes(12))$("div").find("[data-field-name='custpage_inv_stock']").closest('tr').hide()
			 if(_filters.includes(13))$("div").find("[data-field-name='custpage_inv_color']").closest('tr').hide()
			 if(_filters.includes(14))$("div").find("[data-field-name='custpage_inv_year']").closest('tr').hide()
			 if(_filters.includes(15))$("div").find("[data-field-name='custpage_inv_engine']").closest('tr').hide()
			 if(_filters.includes(16))$("div").find("[data-field-name='custpage_inv_transmission']").closest('tr').hide()
			 if(_filters.includes(17))$("div").find("[data-field-name='custpage_inv_ttle_restr']").closest('tr').hide()
			 if(_filters.includes(18))$("div").find("[data-field-name='custpage_inv_body_style']").closest('tr').hide()
			 if(_filters.includes(19))$("div").find("[data-field-name='custpage_inv_truck_ready']").closest('tr').hide()
			 if(_filters.includes(20))$("div").find("[data-field-name='custpage_inv_truck_washed']").closest('tr').hide()
			 if(_filters.includes(21))$("div").find("[data-field-name='custpage_inv_single_bunk']").closest('tr').hide()
			 if(_filters.includes(22))$("div").find("[data-field-name='custpage_inv_terms']").closest('tr').hide()
			 if(_filters.includes(23))$("div").find("[data-field-name='custpage_inv_sssize']").closest('tr').hide()
			 if(_filters.includes(24))$("div").find("[data-field-name='custpage_inv_apu']").closest('tr').hide()
			 if(_filters.includes(25))$("div").find("[data-field-name='custpage_inv_beds']").closest('tr').hide()
			 if(_filters.includes(26))$("div").find("[data-field-name='custpage_inv_sh_customer']").closest('tr').hide()
		     if(_filters.includes(60))$("div").find("[data-field-name='custpage_physicallocation']").closest('tr').hide()
      if (InventoryTab) {

          InventoryTab.addEventListener('click', function (event) {
			   //HIDE ALL FILTERS 
			 jQuery('#fg_custpage_fil_gp').closest('table').closest('tr').show();
			  jQuery('#fg_custpage_fil_gp_repo').closest('table').closest('tr').hide()
			 jQuery('#fg_custpage_fil_gp_auc').closest('table').closest('tr').hide()
			 jQuery('#fg_custpage_fil_gp_db').closest('table').closest('tr').hide()
			 jQuery('#fg_custpage_fil_gp_ins').closest('table').closest('tr').hide()
			 jQuery('#fg_custpage_fil_gp_tpt').closest('table').closest('tr').hide()
			 jQuery('#tr_fg_custpage_fil_gp tr.uir-field-wrapper-cell ').hide()
			 //SHOW ONLY AUCTION FILTERS
			 if(_filters.includes(1 ))$("div").find("[data-field-name='custpage_vin']").closest('tr').show()
			 if(_filters.includes(2 ))$("div").find("[data-field-name='custpage_vin_ff']").closest('tr').show()
			 if(_filters.includes(3 ))$("div").find("[data-field-name='custpage_model']").closest('tr').show()
			 if(_filters.includes(4 ))$("div").find("[data-field-name='custpage_location']").closest('tr').show()
			 if(_filters.includes(5 ))$("div").find("[data-field-name='custpage_status']").closest('tr').show()
			 if(_filters.includes(6 ))$("div").find("[data-field-name='custpage_salesrep_filter']").closest('tr').show()
			 if(_filters.includes(7 ))$("div").find("[data-field-name='custpage_softhold_status']").closest('tr').show()
			 if(_filters.includes(8 ))$("div").find("[data-field-name='custpage_mileage']").closest('tr').show()
			 if(_filters.includes(9 ))$("div").find("[data-field-name='custpage_bucket']").closest('tr').show()
			 if(_filters.includes(10))$("div").find("[data-field-name='custpage_bucket_child']").closest('tr').show()
			 if(_filters.includes(11))$("div").find("[data-field-name='custpage_freq']").closest('tr').show()
			
				 
			 if(_filters.includes(12))$("div").find("[data-field-name='custpage_inv_stock']").closest('tr').show()
			 if(_filters.includes(13))$("div").find("[data-field-name='custpage_inv_color']").closest('tr').show()
			 if(_filters.includes(14))$("div").find("[data-field-name='custpage_inv_year']").closest('tr').show()
			 if(_filters.includes(15))$("div").find("[data-field-name='custpage_inv_engine']").closest('tr').show()
			 if(_filters.includes(16))$("div").find("[data-field-name='custpage_inv_transmission']").closest('tr').show()
			 if(_filters.includes(17))$("div").find("[data-field-name='custpage_inv_ttle_restr']").closest('tr').show()
			 if(_filters.includes(18))$("div").find("[data-field-name='custpage_inv_body_style']").closest('tr').show()
			 if(_filters.includes(19))$("div").find("[data-field-name='custpage_inv_truck_ready']").closest('tr').show()
			 if(_filters.includes(20))$("div").find("[data-field-name='custpage_inv_truck_washed']").closest('tr').show()
			 if(_filters.includes(21))$("div").find("[data-field-name='custpage_inv_single_bunk']").closest('tr').show()
			 if(_filters.includes(22))$("div").find("[data-field-name='custpage_inv_terms']").closest('tr').show()
			 if(_filters.includes(23))$("div").find("[data-field-name='custpage_inv_sssize']").closest('tr').show()
			 if(_filters.includes(24))$("div").find("[data-field-name='custpage_inv_apu']").closest('tr').show()
			 if(_filters.includes(25))$("div").find("[data-field-name='custpage_inv_beds']").closest('tr').show()
			 if(_filters.includes(26))$("div").find("[data-field-name='custpage_inv_sh_customer']").closest('tr').show()
			 if(_filters.includes(60))$("div").find("[data-field-name='custpage_physicallocation']").closest('tr').show()
        })  
      }
      if (ReposessionTab) {

         ReposessionTab.addEventListener('click', function (event) {
			  //HIDE ALL FILTERS 
			 jQuery('#fg_custpage_fil_gp_repo').closest('table').closest('tr').show();
			  jQuery('#fg_custpage_fil_gp').closest('table').closest('tr').hide();
			  jQuery('#fg_custpage_fil_gp_auc').closest('table').closest('tr').hide();
			  jQuery('#fg_custpage_fil_gp_db').closest('table').closest('tr').hide()
			  jQuery('#fg_custpage_fil_gp_ins').closest('table').closest('tr').hide()
			   jQuery('#fg_custpage_fil_gp_tpt').closest('table').closest('tr').hide()
			 jQuery('#tr_fg_custpage_fil_gp_repo tr.uir-field-wrapper-cell ').hide()
			 
			 
			 //SHOW ONLY AUCTION FILTERS
			 if(_filters.includes(27))$("div").find("[data-field-name='custpage_repo_vin']").closest('tr').show()
			 if(_filters.includes(28))$("div").find("[data-field-name='custpage_repo_status_fld']").closest('tr').show()
			 if(_filters.includes(29))$("div").find("[data-field-name='custpage_repo_location']").closest('tr').show()
			 if(_filters.includes(30))$("div").find("[data-field-name='custpage_repo_model']").closest('tr').show()
			 if(_filters.includes(31))$("div").find("[data-field-name='custpage_repo_mileage']").closest('tr').show()
			 if(_filters.includes(32))$("div").find("[data-field-name='custpage_repo_company']").closest('tr').show()
			 if(_filters.includes(33))$("div").find("[data-field-name='custpage_repo_dateassigned']").closest('tr').show()
			 if(_filters.includes(34))$("div").find("[data-field-name='custpage_repo_lessee']").closest('tr').show()
			 if(_filters.includes(35))$("div").find("[data-field-name='custpage_repo_stock']").closest('tr').show()
			 if(_filters.includes(36))$("div").find("[data-field-name='custpage_repo_year']").closest('tr').show()
			 if(_filters.includes(37))$("div").find("[data-field-name='custpage_repo_collections']").closest('tr').show()
			 if(_filters.includes(38))$("div").find("[data-field-name='custpage_repo_destination']").closest('tr').show() 
			  
        }) 
      }
	  if (AuctionTab) {

         AuctionTab.addEventListener('click', function (event) {
			 
			 //HIDE ALL FILTERS 
			 jQuery('#fg_custpage_fil_gp_repo').closest('table').closest('tr').hide()
			 jQuery('#fg_custpage_fil_gp_auc').closest('table').closest('tr').show()
			 jQuery('#fg_custpage_fil_gp').closest('table').closest('tr').hide();
			 jQuery('#fg_custpage_fil_gp_db').closest('table').closest('tr').hide()
			 jQuery('#fg_custpage_fil_gp_ins').closest('table').closest('tr').hide()
			 jQuery('#tr_fg_custpage_fil_gp_auc tr.uir-field-wrapper-cell ').hide()
			  jQuery('#fg_custpage_fil_gp_tpt').closest('table').closest('tr').hide()
			 
			 //SHOW ONLY AUCTION FILTERS
			 if(_filters.includes(39))$("div").find("[data-field-name='custpage_auc_vin']").closest('tr').show()
			 if(_filters.includes(40))$("div").find("[data-field-name='custpage_auc_status']").closest('tr').show()
			 if(_filters.includes(41))$("div").find("[data-field-name='custpage_auc_location']").closest('tr').show()
			 if(_filters.includes(42))$("div").find("[data-field-name='custpage_auc_date']").closest('tr').show()
			 if(_filters.includes(43))$("div").find("[data-field-name='custpage_auc_condition']").closest('tr').show()
			 if(_filters.includes(44))$("div").find("[data-field-name='custpage_auc_cleaned']").closest('tr').show()
			 if(_filters.includes(45))$("div").find("[data-field-name='custpage_auc_location']").closest('tr').show()
			 if(_filters.includes(46))$("div").find("[data-field-name='custpage_auc_ttl_sent']").closest('tr').show()
			 if(_filters.includes(47))$("div").find("[data-field-name='custpage_auc_ttl_restriction']").closest('tr').show() 
			  
        }) 
      }
	  if (deliveryTab) {

         deliveryTab.addEventListener('click', function (event) {
			 //HIDE ALL FILTERS 
			 jQuery('#fg_custpage_fil_gp_db').closest('table').closest('tr').show()
			 jQuery('#fg_custpage_fil_gp_repo').closest('table').closest('tr').hide()
			 jQuery('#fg_custpage_fil_gp_auc').closest('table').closest('tr').hide()
			 jQuery('#fg_custpage_fil_gp').closest('table').closest('tr').hide();
			 jQuery('#fg_custpage_fil_gp_ins').closest('table').closest('tr').hide()
			 jQuery('#tr_fg_custpage_fil_gp_db tr.uir-field-wrapper-cell ').hide()
			  jQuery('#fg_custpage_fil_gp_tpt').closest('table').closest('tr').hide()
			 
			 //SHOW ONLY AUCTION FILTERS
			 if(_filters.includes(48))$("div").find("[data-field-name='custpage_db_vin']").closest('tr').show()
			 if(_filters.includes(49))$("div").find("[data-field-name='custpage_db_customer']").closest('tr').show()
			 if(_filters.includes(50))$("div").find("[data-field-name='custpage_db_salesrep']").closest('tr').show()
			 if(_filters.includes(51))$("div").find("[data-field-name='custpage_db_truckready']").closest('tr').show()
			 if(_filters.includes(52))$("div").find("[data-field-name='custpage_db_washed']").closest('tr').show()
			 if(_filters.includes(53))$("div").find("[data-field-name='custpage_db_mcoo']").closest('tr').show()
			 if(_filters.includes(54))$("div").find("[data-field-name='custpage_db_claim']").closest('tr').show()
			 if(_filters.includes(55))$("div").find("[data-field-name='custpage_db_stock']").closest('tr').show()
			 if(_filters.includes(56))$("div").find("[data-field-name='custpage_db_unit_condition']").closest('tr').show() 
			 if(_filters.includes(57))$("div").find("[data-field-name='custpage_db_sales_quote']").closest('tr').show()
			 if(_filters.includes(58))$("div").find("[data-field-name='custpage_db_contract']").closest('tr').show()
			 if(_filters.includes(59))$("div").find("[data-field-name='custpage_db_location']").closest('tr').show()
			  
        }) 
      }
	  if (InsurClaimtab) {

         InsurClaimtab.addEventListener('click', function (event) {
			 //HIDE ALL FILTERS  
			 jQuery('#fg_custpage_fil_gp_db').closest('table').closest('tr').hide()
			 jQuery('#fg_custpage_fil_gp_repo').closest('table').closest('tr').hide()
			 jQuery('#fg_custpage_fil_gp_auc').closest('table').closest('tr').hide()
			 jQuery('#fg_custpage_fil_gp').closest('table').closest('tr').hide();
			 jQuery('#fg_custpage_fil_gp_ins').closest('table').closest('tr').hide()
			  jQuery('#fg_custpage_fil_gp_tpt').closest('table').closest('tr').hide()
			 jQuery('#tr_fg_custpage_fil_gp_ins tr.uir-field-wrapper-cell ').hide()
			 
        }) 
      }
	  if (InventorySummary) {

         InventorySummary.addEventListener('click', function (event) {
			 //HIDE ALL FILTERS  
			 jQuery('#fg_custpage_fil_gp_db').closest('table').closest('tr').hide()
			 jQuery('#fg_custpage_fil_gp_repo').closest('table').closest('tr').hide()
			 jQuery('#fg_custpage_fil_gp_auc').closest('table').closest('tr').hide()
			 jQuery('#fg_custpage_fil_gp').closest('table').closest('tr').hide();
			 jQuery('#fg_custpage_fil_gp_ins').closest('table').closest('tr').hide()
			 jQuery('#tr_fg_custpage_fil_gp_ins tr.uir-field-wrapper-cell ').hide()
			  jQuery('#fg_custpage_fil_gp_tpt').closest('table').closest('tr').hide()
			 
        }) 
      }
	   if (Transporttab) {

         Transporttab.addEventListener('click', function (event) {
			 //HIDE ALL FILTERS  
			 jQuery('#fg_custpage_fil_gp_db').closest('table').closest('tr').hide()
			 jQuery('#fg_custpage_fil_gp_repo').closest('table').closest('tr').hide()
			 jQuery('#fg_custpage_fil_gp_auc').closest('table').closest('tr').hide()
			 jQuery('#fg_custpage_fil_gp').closest('table').closest('tr').hide();
			 jQuery('#fg_custpage_fil_gp_ins').closest('table').closest('tr').hide()
			  jQuery('#fg_custpage_fil_gp_tpt').closest('table').closest('tr').show()
			 jQuery('#tr_fg_custpage_fil_gp_ins tr.uir-field-wrapper-cell ').hide()
			 
        }) 
      }

    }
function rearrangeColumns()
{
	try{
		var fields = document.querySelectorAll('.uir-field');
        var parent = document.getElementById('custpage_fil_gp');

        // Create a flexible 3-column grid
        if (parent) {
            parent.style.display = 'grid';
            parent.style.gridTemplateColumns = 'repeat(3, 1fr)';
            parent.style.gap = '10px';

            // Move fields inside grid dynamically
            fields.forEach(function(field){parent.appendChild(field)} );
        }
	}catch(e)
	{
		log.debug('error',e.toString());
	}
}
function setbreaktypes(CurrentRecord)
{
	var fldobj = CurrentRecord.getField({
              fieldId: 'custpage_vin'
            });
			fldobj.updateBreakType({
            breakType: serverWidget.FieldBreakType.STARTCOL
          });
	jQuery('#tr_fg_custpage_fil_gp tr.uir-field-wrapper-cell:not([style*="display: none"])').each(function(){var a = jQuery(this).find('div').attr('data-field-name');console.log(a)})
}

	function getfilters() {
      var fieldsdata = []; 
      /*0*/ fieldsdata.push('custpage_brand');
      /*1*/ fieldsdata.push('custpage_vin');  
      /*2*/ fieldsdata.push('custpage_vin_ff');  
      /*3*/ fieldsdata.push('custpage_model');  
      /*4*/ fieldsdata.push('custpage_location');  
      /*5*/ fieldsdata.push('custpage_status');  
      /*6*/ fieldsdata.push('custpage_salesrep_filter'); //6
      /*7*/ fieldsdata.push('custpage_softhold_status'); //7 
      /*8*/ fieldsdata.push('custpage_mileage'); //8
      /*9*/ fieldsdata.push('custpage_bucket'); //9
      /*10*/fieldsdata.push('custpage_bucket_child'); //10
      /*11*/fieldsdata.push('custpage_freq'); //11
      /*12*/fieldsdata.push('custpage_repo_vin_fil'); //12
      /*13*/fieldsdata.push('custpage_repo_status_fld'); 
      /*14*/fieldsdata.push('custpage_repo_location'); 
      /*15*/fieldsdata.push('custpage_repo_model'); 
      /*16*/fieldsdata.push('custpage_repo_mileage'); 
      /*17*/fieldsdata.push('custpage_repo_company'); 
      /*18*/fieldsdata.push('custpage_repo_dateassigned'); 
      /*19*/fieldsdata.push('custpage_auc_vin'); 
      /*20*/fieldsdata.push('custpage_auc_status'); 
      /*21*/fieldsdata.push('custpage_auc_location'); 
      /*22*/fieldsdata.push('custpage_auc_date'); 
      /*23*/fieldsdata.push('custpage_auc_condition'); 
      /*24*/fieldsdata.push('custpage_auc_cleaned'); 
      /*25*/fieldsdata.push('custpage_db_vin'); 
      /*26*/fieldsdata.push('custpage_db_customer'); 
      /*27*/fieldsdata.push('custpage_db_salesrep'); 
      /*28*/fieldsdata.push('custpage_db_truckready'); 
      /*29*/fieldsdata.push('custpage_db_washed'); 
      /*30*/fieldsdata.push('custpage_db_mcoo'); 
      /*31*/fieldsdata.push('custpage_ins_status');  
      /*32*/fieldsdata.push('custpage_deposit_filter'); 
      /*33*/fieldsdata.push('custpage_brand');  
	  
	  
	  
	  
      return fieldsdata;
    }
	function getUrlParameter(name) {
  name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
  var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
  var results = regex.exec(location.search);
  return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
};
function resetFilters(userid)
{
	var data = search.lookupFields({type:'employee',id:userid,columns:['custentity_inventory_filters_chosen']}); 
					var indes = JSON.parse(data.custentity_inventory_filters_chosen);
	window.location.href='https://8760954.app.netsuite.com/app/site/hosting/scriptlet.nl?script=1198&deploy=1&whence=&filters=['+indes+']';
}
function applyselect2()
{
	try{
		$(document).ready(function() {
						$('#custpage_vin_display').select2();
					});
	}catch(e)
	{
		log.debug('error',e.toString());
	}
}
function wrapsublistheaders()
{
	try{
		$(document).ready(function() {
    $("#custpage_sublist_splits").each(function() {
        var table = $(this);
        table.find(".listheadertd").each(function(index) {
            var maxWidth = 0;
            
            // Loop through each corresponding <td> in the column
            table.find(".uir-list-row-tr").each(function() {
                var cell = $(this).find("td").eq(index);
                var cellWidth = cell.outerWidth();
                if (cellWidth > maxWidth) {
                    maxWidth = cellWidth;
                }
            });

            // Apply the max width to the corresponding <th>
            $(this).css({
                "max-width": maxWidth + "px",
                "word-wrap": "break-word",
                "white-space": "normal" // Allow wrapping
            });
        });
    });
	$("#custpage_sublist_repo_splits").each(function() {
        var table = $(this);
        table.find(".listheadertd").each(function(index) {
            var maxWidth = 0;
            
            // Loop through each corresponding <td> in the column
            table.find(".uir-list-row-tr").each(function() {
                var cell = $(this).find("td").eq(index);
                var cellWidth = cell.outerWidth();
                if (cellWidth > maxWidth) {
                    maxWidth = cellWidth;
                }
            });

            // Apply the max width to the corresponding <th>
            $(this).css({
                "max-width": maxWidth + "px",
                "word-wrap": "break-word",
                "white-space": "normal" // Allow wrapping
            });
        });
    });
	$("#custpage_sublist_auction_splits").each(function() {
        var table = $(this);
        table.find(".listheadertd").each(function(index) {
            var maxWidth = 0;
            
            // Loop through each corresponding <td> in the column
            table.find(".uir-list-row-tr").each(function() {
                var cell = $(this).find("td").eq(index);
                var cellWidth = cell.outerWidth();
                if (cellWidth > maxWidth) {
                    maxWidth = cellWidth;
                }
            });

            // Apply the max width to the corresponding <th>
            $(this).css({
                "max-width": maxWidth + "px",
                "word-wrap": "break-word",
                "white-space": "normal" // Allow wrapping
            });
        });
    });
	$("#custpage_sublist_auction_splits").each(function() {
        var table = $(this);
        table.find(".listheadertd").each(function(index) {
            var maxWidth = 0;
            
            // Loop through each corresponding <td> in the column
            table.find(".uir-list-row-tr").each(function() {
                var cell = $(this).find("td").eq(index);
                var cellWidth = cell.outerWidth();
                if (cellWidth > maxWidth) {
                    maxWidth = cellWidth;
                }
            });

            // Apply the max width to the corresponding <th>
            $(this).css({
                "max-width": maxWidth + "px",
                "word-wrap": "break-word",
                "white-space": "normal" // Allow wrapping
            });
        });
    });
	$("#custpage_sublist_deposit_delivery_splits").each(function() {
        var table = $(this);
        table.find(".listheadertd").each(function(index) {
            var maxWidth = 0;
            
            // Loop through each corresponding <td> in the column
            table.find(".uir-list-row-tr").each(function() {
                var cell = $(this).find("td").eq(index);
                var cellWidth = cell.outerWidth();
                if (cellWidth > maxWidth) {
                    maxWidth = cellWidth;
                }
            });

            // Apply the max width to the corresponding <th>
            $(this).css({
                "max-width": maxWidth + "px",
                "word-wrap": "break-word",
                "white-space": "normal" // Allow wrapping
            });
        });
    });
	$("#custpage_sublist_custpage_subtab_insur_claim_splits").each(function() {
        var table = $(this);
        table.find(".listheadertd").each(function(index) {
            var maxWidth = 0;
            
            // Loop through each corresponding <td> in the column
            table.find(".uir-list-row-tr").each(function() {
                var cell = $(this).find("td").eq(index);
                var cellWidth = cell.outerWidth();
                if (cellWidth > maxWidth) {
                    maxWidth = cellWidth;
                }
            });

            // Apply the max width to the corresponding <th>
            $(this).css({
                "max-width": maxWidth + "px",
                "word-wrap": "break-word",
                "white-space": "normal" // Allow wrapping
            });
        });
    });
});
	}catch(e)
	{
		log.debug('error',e.toString());
	}
}
        return {
            pageInit: pageInit,
            fieldChanged: fieldChanged,
            // postSourcing: postSourcing,
            //  sublistChanged: sublistChanged,
            // lineInit: lineInit,
            // validateField: validateField,
            //  validateLine: validateLine,
            // validateInsert: validateInsert,
            // validateDelete: validateDelete,
            saveRecord: saveRecord,
            redirectToPage:redirectToPage,
            getSuiteletPage:getSuiteletPage,
            popupCenter:popupCenter,
            openholdpop:openholdpop,
            openterminationpop:openterminationpop,
            opennewclaim:opennewclaim,
			openfiltersetup:openfiltersetup,
			resetFilters:resetFilters,
			edittransportsheet:edittransportsheet
        };
        
    });
    