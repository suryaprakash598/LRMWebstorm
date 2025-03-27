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
            //doCollapse();
            inventoryAccordian();
            var CurrentRecord = scriptContext.currentRecord;
            var fieldId       = scriptContext.fieldId;
            colorInventory(CurrentRecord,"custpage_sublist","custpabe_m_status")
            colorTitleRes(CurrentRecord,"custpage_sublist","custpabe_m_titlerestriction2");
            colorInTowYard(CurrentRecord,"custpage_sublist_custpage_subtab_insur_claim","cust_fi_in_tow_yard");
            colorSoftHold(CurrentRecord,"custpage_sublist","custpabe_m_softhold_status");
           // wrapsublistheaders();
            /* togglefiltersbwntabs(CurrentRecord);              */
            var LineNum = scriptContext.line;

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
            if(name == "custpage_inv_brand" || name=="custpage_inv_model"|| name == "custpage_inv_location"|| name == "custpage_inv_physicallocation"
                || name == "custpage_inv_bucket" || name == "custpage_inv_freq" || name == "custpage_inv_pageid" ||
                name == "custpage_inv_vin"|| name == "custpage_inv_vin_text"||name=="custpage_inv_softhold_status"
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
                || name == "custpage_inv_ttle_restr"|| name == "custpage_inv_status"|| name == "custpage_inv_color"|| name == "custpage_inv_transmission"|| name == "custpage_inv_salesrep"|| name == "custpage_inv_mileage"|| name == "custpage_inv_bucket_child"|| name == "custpage_inv_deposit_filter"|| name == "custpage_inv_salesrep_filter"


            ) {

                var curRec = scriptContext.currentRecord;


                var paramfilters = curRec.getValue({fieldId: 'custpage_filter_params'});
                var pageId = curRec.getValue({fieldId: 'custpage_inv_pageid'});
                var brandid = curRec.getValue({fieldId: 'custpage_inv_brand'});
                var modelid = curRec.getValue({fieldId: 'custpage_inv_model'});
                var locid = curRec.getValue({fieldId: 'custpage_inv_location'});
                var plocid = curRec.getValue({fieldId: 'custpage_inv_physicallocation'});
                var buckid = curRec.getValue({fieldId: 'custpage_inv_bucket'});
                var buckCid = curRec.getValue({fieldId: 'custpage_inv_bucket_child'});
                var freqid = curRec.getValue({fieldId: 'custpage_inv_freq'});
                var vinid  = curRec.getValue({fieldId: 'custpage_inv_vin'});
                var vintext  = curRec.getValue({fieldId: 'custpage_inv_vin_text'});
                var LeaseId = curRec.getValue({fieldId: 'custpage_old_lease_id'});
                var OldVinId = curRec.getValue({fieldId: 'custpage_old_vin_id'});
                var iframeObj = curRec.getValue({fieldId: 'custpage_i_frame_obj'});
                var flagpara = curRec.getValue({fieldId: 'custpage_flag_para_obj'});
                var status  = curRec.getValue({fieldId: 'custpage_inv_status'});
                var color  = curRec.getValue({fieldId: 'custpage_inv_color'});
                var transmission  = curRec.getValue({fieldId: 'custpage_inv_transmission'});
                var salesrep  = curRec.getValue({fieldId: 'custpage_inv_salesrep'});
                var mileage  = curRec.getValue({fieldId: 'custpage_inv_mileage'});
                var depofilter  = curRec.getValue({fieldId: 'custpage_inv_deposit_filter'});
                var salesrepfilter  = curRec.getValue({fieldId: 'custpage_inv_salesrep_filter'});
                var statushold  = curRec.getValue({fieldId: 'custpage_inv_softhold_status'});
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




                //pageId = parseInt(pageId.split('_')[1]);

                setWindowChanged(window, false);
                document.location = url.resolveScript({
                    scriptId: getParameterFromURL('script'),
                    deploymentId: getParameterFromURL('deploy'),
                    params: {
                        'page': 1,
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



                    }
                });

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
        function popupCenter(stock){
            var title='';
            var url = 'https://8760954.app.netsuite.com/app/site/hosting/scriptlet.nl?script=1644&deploy=1&repo='+stock;
            var left = (screen.width/2)-(500/2);
            var top = (screen.height/2)-(500/2);
            var targetWin = window.open (url, title);

        }
        function openholdpop(){
            var title='';
            var url = 'https://8760954.app.netsuite.com/app/site/hosting/scriptlet.nl?script=1644&deploy=1&repo='+stock;
            var left = (screen.width/2)-(500/2);
            var top = (screen.height/2)-(500/2);
            var targetWin = window.open (url, title, 'width=900, height=500, top='+top+', left='+left);

        }
        function openfiltersetup(userid){
            var title='';
            var url = 'https://8760954.app.netsuite.com/app/site/hosting/scriptlet.nl?script=2604&deploy=1&user='+userid+'&scriptId=customdeploy_advs_available_inventory';
            var left = (screen.width/2)-(500/2);
            var top = (screen.height/2)-(500/2);
            var targetWin = window.open (url, title, 'width=900, height=500, top='+top+', left='+left);

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
            var colsToColor = "7";
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
                         if(t==10){
                        tdDom.setAttribute('style', '' + StringToSet + '');
                         }
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
        function colorTitleRes(CurrentRecord,SublistId,FieldId){ // ABDUL
            var lineCount = CurrentRecord.getLineCount({sublistId: SublistId });
            var colsToColor = 24;
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
        function togglefiltersbwntabs(CurrentRecord) {

            var filtersdata = CurrentRecord.getValue({
                fieldId: 'custpage_filter_params'
            });
            var filtersdataids = getfilters();
            var paramfilters = getUrlParameter("filters")||'[]';
            var _filters = JSON.parse(paramfilters)
            var fdata = JSON.parse(filtersdata);
            const InventoryTab = document.getElementById('custpage_veh_tablnk');

            //HIDE ALL FILTERS
            jQuery('#fg_custpage_fil_gp').closest('table').closest('tr').show()

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


        }
        function rearrangeColumns(){
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
        function setbreaktypes(CurrentRecord){
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
        function resetFilters(userid){
            var data = search.lookupFields({type:'employee',id:userid,columns:['custentity_inventory_filters_chosen']});
            var indes = JSON.parse(data.custentity_inventory_filters_chosen);
            window.location.href='https://8760954.app.netsuite.com/app/site/hosting/scriptlet.nl?script=2638&deploy=1&whence=&filters=['+indes+']';
        }
        function wrapsublistheaders(){
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
                   /* $("#custpage_sublist_repo_splits").each(function() {
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
                    });*/
                });
            }catch(e)
            {
                log.debug('error',e.toString());
            }
        }
        return {
            pageInit: pageInit,
            fieldChanged: fieldChanged,
            saveRecord: saveRecord,
            redirectToPage:redirectToPage,
            getSuiteletPage:getSuiteletPage,
            popupCenter:popupCenter,
            openholdpop:openholdpop,
            openfiltersetup:openfiltersetup,
            resetFilters:resetFilters
        };

    });
