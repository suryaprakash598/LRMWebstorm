/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 * @NModuleScope public
 */
define(['N/record', 'N/runtime', 'N/search', 'N/ui/serverWidget', 'N/url', 'N/format'],
    /**
     * @param{record} record
     * @param{runtime} runtime
     * @param{search} search
     * @param{serverWidget} serverWidget
     */
    (record, runtime, search, serverWidget, url, format) => {
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

                var currScriptObj = runtime.getCurrentScript();
                var UserObj = runtime.getCurrentUser();
                var UserSubsidiary = UserObj.subsidiary;
                var UserLocation = UserObj.location;
                var Userid = UserObj.id;
                // Parameters
                var pageSize = 1000; // Set your preferred page size
                var pageId = parseInt(request.parameters.page) || 0;

                var filtersparam = request.parameters.filters || '[]';
                var brandId = request.parameters.brand;
                var modelId = request.parameters.model;
                var locatId = request.parameters.locat;
                var plocatId = request.parameters.plocat;
                var salesrepId = request.parameters.salesrepfilter;
                var depofilterId = request.parameters.depositfilter;
                var bucketId = request.parameters.bucket;
                var bucketChild = request.parameters.bucketchild;
                var freqId = request.parameters.freq || 3; // monthly
                var vinID = request.parameters.unitvin || '';
                var _vinText = request.parameters.unitvintext || '';
                var _statushold = request.parameters.statushold || '';
                var _invstatusFil = '';
                var invstock = request.parameters.invstock || '';
                var status = request.parameters.status || '';
                //log.debug('status from param',status);
                _invstatusFil = status;
                var color = request.parameters.color || '';
                var transmission = request.parameters.transmission || '';
                var salesrep = request.parameters.salesrep || '';
                var mileage = request.parameters.mileage || '';
                var ttlrest = request.parameters.ttlrest || '';
                var washed = request.parameters.washed || '';
                var singlebunk = request.parameters.singlebunk || '';
                var invterms = request.parameters.invterms || '';
                var invapu = request.parameters.invapu || '';
                var invbed = request.parameters.invbed || '';
                var sfcustomer = request.parameters.sfcustomer || '';
                var bodystyle = request.parameters.bodystyle || '';
                var invtransm = request.parameters.invtransm || '';
                var invyear = request.parameters.invyear || '';
                var invcolor = request.parameters.invcolor || '';
                var invtruckready = request.parameters.invtruckready || '';
                var invengine = request.parameters.invengine || '';
                var invsssize = request.parameters.invsssize || '';



                var Old_Vin_From_lease = request.parameters.custpara_old_vin; //custpara_old_vin
                var flagpara2 = request.parameters.custpara_flag_2;
                var LeaseHeaderId = request.parameters.custpara_lease_id;
                var iFrameCenter = request.parameters.ifrmcntnr;
                var scriptId = currScriptObj.id;
                var deploymentId = currScriptObj.deploymentId;

                var startIndex = parseInt(request.parameters.start) || 0;
                if (flagpara2) { //
                    var form = serverWidget.createForm({
                        title: "Swap",
                        hideNavBar: true
                    });
                } else {
                    var form = serverWidget.createForm({
                        title: " "
                    });
                }

                var filterGp = form.addFieldGroup({
                    id: "custpage_fil_gp",
                    label: "Filters"
                });

                var _inventoyCount = 0;
                /* var subTab = form.addSubtab({ id: "custpage_veh_tab", label: "Inventory" });  */

                var filterFldObj = form.addField({
                    id: "custpage_filter_params",
                    type: serverWidget.FieldType.TEXT,
                    label: "filtersparam",
                    container: "custpage_fil_gp"
                }).updateDisplayType({
                    displayType: "hidden"
                });
                filterFldObj.defaultValue = filtersparam;
                // Add an inline HTML field with JavaScript to hide the group
                var inlineHtmlField = form.addField({
                    id: 'custpage_inlinehtml_hidefilters',
                    type: serverWidget.FieldType.INLINEHTML,
                    label: 'Inline Script'
                });

                // JavaScript to hide the field group before loading
                inlineHtmlField.defaultValue = "<script>document.addEventListener('DOMContentLoaded', function() { jQuery('#tr_fg_custpage_fil_gp_repo').closest('table').closest('tr').hide(); jQuery('#tr_fg_custpage_fil_gp_auc').closest('table').closest('tr').hide();jQuery('#tr_fg_custpage_fil_gp_db').closest('table').closest('tr').hide(); });</script>";



                var brandFldObj = form.addField({
                    id: "custpage_brand",
                    type: serverWidget.FieldType.SELECT,
                    label: "Brand",
                    source: "customrecord_advs_brands",
                    container: "custpage_fil_gp"
                }).updateDisplayType({
                    displayType: "hidden"
                });

                var modelFldObj = form.addField({
                    id: "custpage_model",
                    type: serverWidget.FieldType.SELECT,
                    label: "Model",
                    container: "custpage_fil_gp"
                });
                modelFldObj.addSelectOption({
                    value: '',
                    text: ''
                });
                var locFldObj = form.addField({
                    id: "custpage_location",
                    type: serverWidget.FieldType.SELECT,
                    label: "Location",
                    source: null,
                    container: "custpage_fil_gp"
                })
                /* .updateDisplayType({ displayType: "hidden" }); */
                sourceLocation(locFldObj, UserSubsidiary);

                var plocFldObj = form.addField({
                    id: "custpage_physicallocation",
                    type: serverWidget.FieldType.SELECT,
                    label: "Physical Location",
                    source: 'customlistadvs_list_physicallocation',
                    container: "custpage_fil_gp"
                })

                var bucketFldObj = form.addField({
                    id: "custpage_bucket",
                    type: serverWidget.FieldType.SELECT,
                    label: "Bucket",
                    source: "customrecord_ez_bucket_calculation",
                    container: "custpage_fil_gp"
                });
                var bucketChildFldObj = form.addField({
                    id: "custpage_bucket_child",
                    type: serverWidget.FieldType.SELECT,
                    label: "Bucket Child",
                    source: "customrecord_bucket_calculation_location",
                    container: "custpage_fil_gp"
                }).updateDisplayType({
                    displayType: "hidden"
                });
                /* bucketChildFldObj.updateBreakType({
            breakType: serverWidget.FieldBreakType.STARTCOL
          }); */
                var freqFldObj = form.addField({
                    id: "custpage_freq",
                    type: serverWidget.FieldType.SELECT,
                    label: "Frequency",
                    source: "customrecord_advs_st_frequency",
                    container: "custpage_fil_gp"
                });
                var mileageFldObj = form.addField({
                    id: "custpage_mileage",
                    type: serverWidget.FieldType.TEXT,
                    label: "Mileage",
                    container: "custpage_fil_gp"
                });
                mileageFldObj.updateDisplaySize({
                    height: 60,
                    width: 37
                });
                var salesrepFldObj = form.addField({
                    id: "custpage_salesrep",
                    type: serverWidget.FieldType.SELECT,
                    label: "Salesrep",
                    source: "employee",
                    container: "custpage_fil_gp"
                }).updateDisplayType({
                    displayType: "hidden"
                });

                //freqFldObj.defaultValue = 3 // for monthly
                /* .updateDisplayType({ displayType: "hidden" }); */
                var vinFldObj = form.addField({
                    id: "custpage_vin",
                    type: serverWidget.FieldType.SELECT,
                    label: "Vin Dropdown list",
                    source: "customrecord_advs_vm",
                    container: "custpage_fil_gp"
                });

                // Add Inline HTML field to load Select2
                var inlineHtmlvindd = form.addField({
                    id: 'custpage_inlinehtml_vindd',
                    type: serverWidget.FieldType.INLINEHTML,
                    label: ' '
                });
                var selectvinfield = '';
                selectvinfield += `<select class="js-example-basic-single" name="state">
  <option value="AL">Alabama</option>
  <option value="WY">Wyoming</option>
</select>
 
               <link href="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/css/select2.min.css" rel="stylesheet" />
<script src="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/js/select2.min.js"></script>
				
   
  
  
  `;


                inlineHtmlvindd.defaultValue = '' //selectvinfield;
                var vinfreeformFldObj = form.addField({
                    id: "custpage_vin_ff",
                    type: serverWidget.FieldType.TEXT,
                    label: "Vin #",
                    container: "custpage_fil_gp"
                });
                vinfreeformFldObj.updateDisplaySize({
                    height: 60,
                    width: 37
                });
                var statusFldObj = form.addField({
                    id: "custpage_status",
                    type: serverWidget.FieldType.SELECT,
                    label: "Status",
                    source: "customlist_advs_reservation_status",
                    container: "custpage_fil_gp"
                });

                var colorFldObj = form.addField({
                    id: "custpage_color",
                    type: serverWidget.FieldType.SELECT,
                    label: "Color",
                    source: "customlist_advs_color_list",
                    container: "custpage_fil_gp"
                }).updateDisplayType({
                    displayType: "hidden"
                });
                var transmissionFldObj = form.addField({
                    id: "custpage_transmission",
                    type: serverWidget.FieldType.SELECT,
                    label: "Transmission",
                    source: "customlist712",
                    container: "custpage_fil_gp"
                }).updateDisplayType({
                    displayType: "hidden"
                });

                var OldVinFieldObj = form.addField({
                    id: 'custpage_old_vin_id',
                    type: serverWidget.FieldType.SELECT,
                    label: "Old Vin #",
                    source: "customrecord_advs_vm",
                    container: "custpage_fil_gp"
                }).updateDisplayType({
                    displayType: "hidden"
                });
                var LeaseFieldObj = form.addField({
                    id: 'custpage_old_lease_id',
                    type: serverWidget.FieldType.SELECT,
                    label: "Lease #",
                    source: "customrecord_advs_lease_header",
                    container: "custpage_fil_gp"
                }).updateDisplayType({
                    displayType: "hidden"
                });

                var IframeCenterFieldObj = form.addField({
                    id: 'custpage_i_frame_obj',
                    type: serverWidget.FieldType.TEXT,
                    label: "IFrame Obj",
                    container: "custpage_fil_gp"
                }).updateDisplayType({
                    displayType: "hidden"
                });
                var Flagpara2FieldObj = form.addField({
                    id: 'custpage_flag_para_obj',
                    type: serverWidget.FieldType.INTEGER,
                    label: "Flag para #",
                    container: "custpage_fil_gp"
                }).updateDisplayType({
                    displayType: "hidden"
                });

                var salesrepfld = form.addField({
                    id: "custpage_salesrep_filter",
                    type: serverWidget.FieldType.SELECT,
                    label: "Salesrep",
                    container: "custpage_fil_gp"
                });

                var statusHoldFldObj = form.addField({
                    id: "custpage_softhold_status",
                    type: serverWidget.FieldType.SELECT,
                    label: "Soft Hold",
                    source: "customlist_advs_reservation_hold",
                    container: "custpage_fil_gp"
                });
                //INVENTORY FILTERS EXTRA

                var invStockFldObj = form.addField({
                    id: "custpage_inv_stock",
                    type: serverWidget.FieldType.TEXT,
                    label: "STOCK #",
                    source: null,
                    container: "custpage_fil_gp"
                });
                var invColorFldObj = form.addField({
                    id: "custpage_inv_color",
                    type: serverWidget.FieldType.SELECT,
                    label: "COLOR",
                    source: "customlist_advs_color_list",
                    container: "custpage_fil_gp"
                });

                var invYearFldObj = form.addField({
                    id: "custpage_inv_year",
                    type: serverWidget.FieldType.SELECT,
                    label: "Year",
                    source: "customlist_advs_truck_year",
                    container: "custpage_fil_gp"
                });

                var invEngineFldObj = form.addField({
                    id: "custpage_inv_engine",
                    type: serverWidget.FieldType.SELECT,
                    label: "Engine",
                    source: "customrecord_advs_engine_model",
                    container: "custpage_fil_gp"
                });

                var invTransmissionFldObj = form.addField({
                    id: "custpage_inv_transmission",
                    type: serverWidget.FieldType.SELECT,
                    label: "Transmission",
                    source: "customlist712",
                    container: "custpage_fil_gp"
                });

                var invTitleRestFldObj = form.addField({
                    id: "custpage_inv_ttle_restr",
                    type: serverWidget.FieldType.SELECT,
                    label: "Title Restriction",
                    source: "customlist_advs_title_restriction_list",
                    container: "custpage_fil_gp"
                });

                var invBodyStyleFldObj = form.addField({
                    id: "custpage_inv_body_style",
                    type: serverWidget.FieldType.SELECT,
                    label: "Body Style",
                    source: "customlist_advs_body_style",
                    container: "custpage_fil_gp"
                });

                var invTruckReadyFldObj = form.addField({
                    id: "custpage_inv_truck_ready",
                    type: serverWidget.FieldType.SELECT,
                    label: "Truck Ready",
                    source: null,
                    container: "custpage_fil_gp"
                });
                invTruckReadyFldObj.addSelectOption({
                    value: '',
                    text: ''
                });
                invTruckReadyFldObj.addSelectOption({
                    value: 0,
                    text: 'No'
                });
                invTruckReadyFldObj.addSelectOption({
                    value: 1,
                    text: 'Yes'
                });

                var invWashedFldObj = form.addField({
                    id: "custpage_inv_truck_washed",
                    type: serverWidget.FieldType.SELECT,
                    label: "Washed",
                    source: null,
                    container: "custpage_fil_gp"
                });
                invWashedFldObj.addSelectOption({
                    value: '',
                    text: ''
                });
                invWashedFldObj.addSelectOption({
                    value: 0,
                    text: 'No'
                });
                invWashedFldObj.addSelectOption({
                    value: 1,
                    text: 'Yes'
                });

                var invSingleBunkFldObj = form.addField({
                    id: "custpage_inv_single_bunk",
                    type: serverWidget.FieldType.SELECT,
                    label: "Single Bunk",
                    source: "customlist_advs_single_bunk",
                    container: "custpage_fil_gp"
                });

                var invTermsFldObj = form.addField({
                    id: "custpage_inv_terms",
                    type: serverWidget.FieldType.TEXT,
                    label: "Terms",
                    source: null,
                    container: "custpage_fil_gp"
                });
                var invsssizeFldObj = form.addField({
                    id: "custpage_inv_sssize",
                    type: serverWidget.FieldType.SELECT,
                    label: "Sleeper Size",
                    source: "customlist_advs_ms_list_sleeper_size",
                    container: "custpage_fil_gp"
                });
                var invApuFldObj = form.addField({
                    id: "custpage_inv_apu",
                    type: serverWidget.FieldType.SELECT,
                    label: "Apu",
                    source: "customlist_advs_ms_apu_list",
                    container: "custpage_fil_gp"
                });
                var invBedsFldObj = form.addField({
                    id: "custpage_inv_beds",
                    type: serverWidget.FieldType.SELECT,
                    label: "Beds",
                    source: "customlist_advs_beds_list",
                    container: "custpage_fil_gp"
                });

                var invshCustomerFldObj = form.addField({
                    id: "custpage_inv_sh_customer",
                    type: serverWidget.FieldType.SELECT,
                    label: "Softhold Customer",
                    source: "customer",
                    container: "custpage_fil_gp"
                });
                //INVENTORY FILTERS EXTRA



                var fieldsdata = [];


                fieldsdata.push('custpage_brand');
                fieldsdata.push('custpage_vin'); //1
                fieldsdata.push('custpage_vin_ff'); //2
                fieldsdata.push('custpage_model'); //3
                fieldsdata.push('custpage_location'); //4
                fieldsdata.push('custpage_status'); //5
                fieldsdata.push('custpage_salesrep_filter'); //6
                fieldsdata.push('custpage_softhold_status'); //7
                fieldsdata.push('custpage_mileage'); //8
                fieldsdata.push('custpage_bucket'); //9
                fieldsdata.push('custpage_bucket_child'); //10
                fieldsdata.push('custpage_freq'); //11
                fieldsdata.push('custpage_repo_status'); //12
                fieldsdata.push('custpage_auc_status'); //13
                fieldsdata.push('custpage_ins_status'); //14
                fieldsdata.push('custpage_deposit_filter'); //15
                fieldsdata.push('custpage_brand'); //16
                var displayarr = [];
                // toggleInventoryFilters(form, fieldsdata, JSON.parse(filtersparam))
                var _fieldsdata = dynamicFields();
                toggleInventoryFilters(form, _fieldsdata, JSON.parse(filtersparam))




                var cuobj = record.create({
                    type: 'customer',
                    isDynamic: !0
                });
                var salesrefp = cuobj.getField('salesrep');
                var entityData = salesrefp.getSelectOptions();
                salesrepfld.addSelectOption({
                    value: '',
                    text: ''
                })

                for (var i = 0; i < entityData.length; i++) {
                    var entityValues = entityData[i];
                    salesrepfld.addSelectOption({
                        value: entityValues.value,
                        text: entityValues.text
                    });
                }

                var colorcodingFieldObj = form.addField({
                    id: 'custpage_colorcoding_repo',
                    type: serverWidget.FieldType.INLINEHTML,
                    label: "Color",
                    container: "custpage_fil_gp"
                }).updateDisplayType({
                    displayType: "hidden"
                });

                var colorcodeInvFieldObj = form.addField({
                    id: 'custpage_colorcoding_inv',
                    type: serverWidget.FieldType.INLINEHTML,
                    label: "Color Inv",
                    container: "custpage_fil_gp"
                }).updateDisplayType({
                    displayType: "hidden"
                });
                var colorcodeAucFieldObj = form.addField({
                    id: 'custpage_colorcoding_auc',
                    type: serverWidget.FieldType.INLINEHTML,
                    label: "Color Auc",
                    container: "custpage_fil_gp"
                }).updateDisplayType({
                    displayType: "hidden"
                });
                var colorcodeDelFieldObj = form.addField({
                    id: 'custpage_colorcoding_del',
                    type: serverWidget.FieldType.INLINEHTML,
                    label: "Color Del",
                    container: "custpage_fil_gp"
                }).updateDisplayType({
                    displayType: "hidden"
                });
                var colorcodeInsFieldObj = form.addField({
                    id: 'custpage_colorcoding_ins',
                    type: serverWidget.FieldType.INLINEHTML,
                    label: "Color Ins",
                    container: "custpage_fil_gp"
                }).updateDisplayType({
                    displayType: "hidden"
                });
                var depositFld = form.addField({
                    id: "custpage_deposit_filter",
                    type: serverWidget.FieldType.SELECT,
                    label: "Deposit",
                    source: 'customlist_deposit_filter',
                    container: "custpage_fil_gp_ins"
                }).updateDisplayType({
                    displayType: "hidden"
                });

                var vmSearchObj = InventorySearch(brandId, modelId, locatId, salesrepId, depofilterId, bucketId, freqId, bucketChild, vinID,
                    _vinText, _statushold, LeaseHeaderId, iFrameCenter, flagpara2, Old_Vin_From_lease, ttlrest, washed, singlebunk, invterms, invapu, invbed, sfcustomer, bodystyle, invtransm, invyear, invcolor, invtruckready, invengine, invsssize, invstock,
                    brandFldObj, modelFldObj, locFldObj, salesrepfld, depositFld, bucketFldObj, freqFldObj, vinFldObj, vinfreeformFldObj, LeaseFieldObj,
                    IframeCenterFieldObj, Flagpara2FieldObj, OldVinFieldObj, _invstatusFil, color, transmission, salesrep,
                    mileage, statusFldObj, colorFldObj, transmissionFldObj, salesrepFldObj, mileageFldObj, bucketChildFldObj,
                    statusHoldFldObj, UserSubsidiary, invStockFldObj, invColorFldObj, invYearFldObj, invEngineFldObj, invTransmissionFldObj, invTitleRestFldObj,
                    invBodyStyleFldObj, invTruckReadyFldObj, invWashedFldObj, invSingleBunkFldObj, invTermsFldObj,
                    invsssizeFldObj, invApuFldObj, invBedsFldObj, invshCustomerFldObj, invStockFldObj,plocFldObj,plocatId)
                var searchObj = vmSearchObj.runPaged({
                    pageSize: pageSize,
                });
                // var searchObj = vmSearchObj.runPaged({  pageSize: pageSize, });
                //	_inventoyCount = searchObj.count;
                /* var subTab = form.addSubtab({ id: "custpage_veh_tab", label: "Inventory" }); */ //+searchObj.count
                // log.debug("searchObj", pageSize + "==>" + searchObj.count);

                var pageCount = Math.ceil(searchObj.count / pageSize);
                // log.debug("searchObjCount", searchObj.count + "==>" + pageCount);

                // Set pageId to correct value if out of index
                if (!pageId || pageId == '' || pageId < 0)
                    pageId = 0;
                else if (pageId >= pageCount)
                    pageId = pageCount - 1;


                var addResults = [{}];
                if (searchObj.count > 0) {
                    addResults = fetchSearchResult(searchObj, pageId, freqId);
                } else {
                    var addResults = [];
                }
                var _inventoyCount = addResults.length || 0;

                var subTab = form.addSubtab({
                    id: "custpage_veh_tab",
                    label: "Inventory(" + _inventoyCount + ")"
                });

                // Add drop-down and options to navigate to specific page
                var selectOptions = form.addField({
                    id: 'custpage_pageid',
                    label: 'Page Index',
                    type: serverWidget.FieldType.SELECT,
                    container: "custpage_veh_tab"
                });
                selectOptions.updateDisplayType({
                    displayType: "hidden"
                })

                var html_fld = form.addField({
                    id: 'custpage_custscript',
                    type: 'inlinehtml',
                    label: ' '
                });

                var inlineHTML = form.addField({
                    id: "custpage_inlinehtml",
                    type: serverWidget.FieldType.INLINEHTML,
                    label: " "
                });

                inlineHTML.defaultValue = '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">';
                //var table = "<link rel='stylesheet' href='https://system.netsuite.com/c.TSTDRV1064792/suitebundle178234/Agenda%20New/Customer_message_css.css'>" +
                var sht = '';
                sht = '<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>';
                sht += "<script>" +
                    "function popupCenter(pageURL, title,w,h) {debugger;" +
                    "var url = 'https://8760954.app.netsuite.com/app/site/hosting/scriptlet.nl?script=1644&deploy=1&repo='+pageURL;" +
                    "var left = (screen.width/2)-(900/2);" +
                    "var top = (screen.height/2)-(500/2);" +
                    "var targetWin = window.open (url, title, 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=1000, height=500');" +
                    "}" +

                    "function openholdpop(pageURL, title,w,h) {debugger;" +
                    "var url = 'https://8760954.app.netsuite.com/app/site/hosting/scriptlet.nl?script=1655&deploy=1&repo='+pageURL;" +
                    "var left = (screen.width/2)-(500/2);" +
                    "var top = (screen.height/2)-(300/2);" +
                    "var targetWin = window.open (url, title, 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=1000, height=500');" +
                    "}" +

                    "function changeStatus(vinid,Status) {debugger;" +
                    "var left = (screen.width/2)-(300/2);" +
                    "var top = (screen.height/2);" +
                    "var url='https://8760954.app.netsuite.com/app/site/hosting/scriptlet.nl?script=1712&deploy=1&vinid='+vinid+'&status'+Status;" +
                    "var targetWin = window.open(url, title, 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no,top=300,left=400,width=480,height=210');" +
                    "}" +

                    "function updateMileage(vinid) {debugger;" +
                    "var left = (screen.width/2)-(300/2);" +
                    "var top = (screen.height/2);" +
                    "var url='https://8760954.app.netsuite.com/app/site/hosting/scriptlet.nl?script=2594&deploy=1&vinid='+vinid;" +
                    "var targetWin = window.open(url, title, 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no,top=300,left=400,width=480,height=210');" +
                    "}" +

                    "function openterminationpop(pageURL, title,w,h) {debugger;" +
                    "var url = '/app/site/hosting/scriptlet.nl?script=1656&deploy=1&repo='+pageURL;" +
                    "var left = (screen.width/2)-(900/2);" +
                    "var top = (screen.height/2)-(500/2);" +
                    "var targetWin = window.open (url, title, 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=1000, height=500');" +
                    "}" +
                    "function openauction(pageURL, title,w,h) {debugger;" +
                    "var url = '/app/site/hosting/scriptlet.nl?script=1658&deploy=1&repo='+pageURL;" +
                    "var left = (screen.width/2)-(900/2);" +
                    "var top = (screen.height/2)-(500/2);" +
                    "var targetWin = window.open (url, title, 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=1000, height=500');" +
                    "}" +
                    "function depositcreation_notusing(pageURL, depinception,Paymentincept,title,w,h,) {debugger;" +
                    "var url = '/app/site/hosting/scriptlet.nl?script=1649&deploy=1&vinid='+pageURL+'&depinception='+depinception+'&Paymentincept='+Paymentincept;" +
                    "var left = (screen.width/2)-(900/2);" +
                    "var top = (screen.height/2)-(500/2);" +
                    "var targetWin = window.open (url, title, 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=1000, height=500');" +
                    "}" +

                    "function depositcreation(customer,vin, depinception,Paymentincept,title,w,h,) {debugger;" +
                    "var url = 'https://8760954.app.netsuite.com/app/accounting/transactions/custdep.nl?whence=&entity='+customer+'&custbody_advs_vin_create_deposit='+vin;" +
                    "var left = (screen.width/2)-(900/2);" +
                    "var top = (screen.height/2)-(500/2);" +
                    "var targetWin = window.open (url, title, 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=1000, height=500');" +
                    "}" +

                    "function softholdupdate(pageURL,depinception,Paymentincept,TTLINSP,TERMS,sec_2_13,sec_14_26,sec_26_37,sec_38_49,purOptn,contTot,bktId ) {debugger;" +
                    "var url = '/app/site/hosting/scriptlet.nl?script=customscript_softhold_inventory&deploy=1&vinid='+pageURL+'&depinception='+depinception+'&Paymentincept='+Paymentincept+'&TTLINSP='+TTLINSP+'&TERMS='+TERMS+'&sec_2_13='+sec_2_13+'&sec_14_26='+sec_14_26+'&sec_26_37='+sec_26_37+'&sec_38_49='+sec_38_49+'&purOptn='+purOptn+'&contTot='+contTot+'&bktId='+bktId;" +
                    "var left = (screen.width/2)-(900/2);" +
                    "var top = (screen.height/2)-(500/2);" +
                    "var targetWin = window.open (url, title, 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=1000, height=500');" +
                    "}" +
                    "function editclaimsheet(id) {debugger;" +
                    "var left = (screen.width/2)-(500/2);" +
                    "var top = (screen.height/2)-(500/2);" +
                    "var url='/app/site/hosting/scriptlet.nl?script=1648&deploy=1&claim='+id;" +
                    "var targetWin = window.open (url, width=500, height=500);" +
                    "}" +
                    "function edittransportsheet(id) {debugger;" +
                    "var left = (screen.width/2)-(500/2);" +
                    "var top = (screen.height/2)-(500/2);" +
                    "var url='/app/site/hosting/scriptlet.nl?script=2615&deploy=1&transport='+id;" +
                    "var targetWin = window.open (url, width=500, height=500);" +
                    "}" +
                    "function opendeliveryboard(depid, title,w,h) {debugger;" +
                    "var url = '/app/site/hosting/scriptlet.nl?script=1713&deploy=1&custparam_id='+depid;" +
                    "var left = (screen.width/2)-(900/2);" +
                    "var top = (screen.height/2)-(500/2);" +
                    "var targetWin = window.open (url, title, 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=1000, height=500');" +
                    "}" +
                    "$(document).ready(function(){" +
                    "  $('.openaccordian').click(function(){debugger;" +
                    " var myString =  jQuery(this).parent('td').parent('tr').attr('id');" +

                    "var lastChar = myString.replace('custpage_sublistrow','');" +
                    "for(var i=0;i<1;i++){" +
                    "lastChar =  ((lastChar*1)+1);" +
                    "	var id='#custpage_sublistrow'+(lastChar);" +
                    "	jQuery(id).toggle();" +
                    "var id1 = id+' .openaccordian';" +
                    "	jQuery(id1).hide()" +
                    "}" +
                    "  });" +
                    "});" +

                    "</script>";
                // sht+='<style>.uir-machine-headerrow, .uir-list-headerrow{white-space: nowrap !important;}</style>';
                //sht+='<script src="https://8760954.app.netsuite.com/core/media/media.nl?id=29052&c=8760954&h=ayzSPaogTGWy-dXa5xFTbLJGgV-IBR97B9xH3BIuO5iJ4Wde&_xt=.js"></script>';
                html_fld.defaultValue = sht;

                var sublist = form.addSublist({
                    id: "custpage_sublist",
                    type: serverWidget.SublistType.LIST,
                    label: "List",
                    tab: "custpage_veh_tab"
                });

                sublist.addField({
                    id: "cust_list_open_accordian",
                    type: serverWidget.FieldType.TEXT,
                    label: "Open"
                }).updateDisplayType({
                    displayType: "inline"
                });
                if (flagpara2) {
                    sublist.addField({
                        id: "cust_select_veh_card",
                        type: serverWidget.FieldType.CHECKBOX,
                        label: "Select Vehicle"
                    });
                } else {
                    sublist.addField({
                        id: "cust_list_veh_card",
                        type: serverWidget.FieldType.TEXT,
                        label: "Quick Deal"
                    }).updateDisplayType({
                        displayType: "inline"
                    });
                }
                sublist.addField({
                    id: "cust_list_veh_delivey",
                    type: serverWidget.FieldType.TEXT,
                    label: "Customer Deposit"
                }).updateDisplayType({
                    displayType: "inline"
                });
                sublist.addField({
                    id: "cust_list_soft_hold",
                    type: serverWidget.FieldType.TEXT,
                    label: "Soft Hold"
                }).updateDisplayType({
                    displayType: "inline"
                });
                sublist.addField({
                    id: "custpabe_m_changestatus",
                    type: serverWidget.FieldType.TEXT,
                    label: "Change Status"
                }).updateDisplayType({
                    displayType: "inline"
                });
                // sublist.addField({ id: "custpabe_m_mileage_edit", type: serverWidget.FieldType.TEXT, label: "Mileage" }).updateDisplayType({ displayType: "inline" });
                sublist.addField({
                    id: "cust_select_checkbox_highlight",
                    type: serverWidget.FieldType.CHECKBOX,
                    label: "Mark"
                }).updateDisplayType({
                    displayType: "hidden"
                });
                sublist.addField({
                    id: "custpabe_m_stock",
                    type: serverWidget.FieldType.TEXT,
                    label: "Stock #"
                }).updateDisplayType({
                    displayType: "inline"
                });
                sublist.addField({
                    id: "custpabe_m_status",
                    type: serverWidget.FieldType.SELECT,
                    label: "Status",
                    source: "customlist_advs_reservation_status"
                }).updateDisplayType({
                    displayType: "inline"
                });
                sublist.addField({
                    id: "custpabe_m_softhold_status",
                    type: serverWidget.FieldType.SELECT,
                    label: "Soft Hold Status",
                    source: "customlist_advs_reservation_hold"
                }).updateDisplayType({
                    displayType: "inline"
                });
                sublist.addField({
                    id: "custpabe_m_color",
                    type: serverWidget.FieldType.TEXT,
                    label: "Color",
                }).updateDisplayType({
                    displayType: "inline"
                });
                sublist.addField({
                    id: "custpabe_m_yr",
                    type: serverWidget.FieldType.SELECT,
                    label: "Year",
                    source: "customrecord_advs_model_year"
                }).updateDisplayType({
                    displayType: "inline"
                });
                sublist.addField({
                    id: "custpabe_model",
                    type: serverWidget.FieldType.SELECT,
                    label: "Model",
                    source: "item"
                }).updateDisplayType({
                    displayType: "inline"
                });
                sublist.addField({
                    id: "custpabe_m_engine",
                    type: serverWidget.FieldType.TEXT,
                    label: "Engine"
                }).updateDisplayType({
                    displayType: "inline"
                });
                sublist.addField({
                    id: "custpabe_m_transmission",
                    type: serverWidget.FieldType.SELECT,
                    label: "Transmission",
                    source: "customlist712"
                }).updateDisplayType({
                    displayType: "inline"
                });
                sublist.addField({
                    id: "custpabe_m_mileage",
                    type: serverWidget.FieldType.TEXT,
                    label: "Mileage"
                }).updateDisplayType({
                    displayType: "inline"
                });

                sublist.addField({
                    id: "custpabe_loc",
                    type: serverWidget.FieldType.SELECT,
                    label: "Location",
                    source: "location"
                }).updateDisplayType({
                    displayType: "hidden"
                });

                sublist.addField({
                    id: "custpabe_phyloc",
                    type: serverWidget.FieldType.SELECT,
                    label: "Physical Location",
                    source: "customlistadvs_list_physicallocation"
                }).updateDisplayType({
                    displayType: "inline"
                });
                sublist.addField({
                    id: "custpabe_m_titlerestriction",
                    type: serverWidget.FieldType.TEXT,
                    label: "Title Restiction"
                }).updateDisplayType({
                    displayType: "inline"
                });
                sublist.addField({
                    id: "custpabe_m_titlerestriction2",
                    type: serverWidget.FieldType.TEXT,
                    label: "Title Restiction 2"
                }).updateDisplayType({
                    displayType: "hidden"
                });
                sublist.addField({
                    id: "custpabe_m_body_style",
                    type: serverWidget.FieldType.SELECT,
                    label: "Body style",
                    source: "customlist_advs_body_style"
                }).updateDisplayType({
                    displayType: "inline"
                }); //new
                sublist.addField({
                    id: "custpabe_m_is_truck_ready",
                    type: serverWidget.FieldType.TEXT,
                    label: "Truck Ready"
                }).updateDisplayType({
                    displayType: "inline"
                });
                sublist.addField({
                    id: "custpabe_m_is_washed",
                    type: serverWidget.FieldType.TEXT,
                    label: "Washed"
                }).updateDisplayType({
                    displayType: "inline"
                });
                sublist.addField({
                    id: "custpabe_m_single_bunk",
                    type: serverWidget.FieldType.SELECT,
                    label: "Single Bunk",
                    source: "customlist_advs_single_bunk"
                }).updateDisplayType({
                    displayType: "inline"
                }); //new
                sublist.addField({
                    id: "custpabe_m_bkt_ttl_incep",
                    type: serverWidget.FieldType.TEXT,
                    label: "Total Inception"
                });
                sublist.addField({
                    id: "custpabe_m_bkt_dep_incep",
                    type: serverWidget.FieldType.TEXT,
                    label: "Deposit Inception"
                });
                sublist.addField({
                    id: "custpabe_m_bkt_pay_incep",
                    type: serverWidget.FieldType.TEXT,
                    label: "Payment Inception"
                });
                sublist.addField({
                    id: "custpabe_m_bkt_terms",
                    type: serverWidget.FieldType.INTEGER,
                    label: "Terms"
                });
                sublist.addField({
                    id: "custpabe_m_notes",
                    type: serverWidget.FieldType.TEXTAREA,
                    label: "Notes"
                }); //new
                sublist.addField({
                    id: "custpabe_vinid_link",
                    type: serverWidget.FieldType.TEXT,
                    label: "Vin #"
                })
                sublist.addField({
                    id: "custpabe_vinid",
                    type: serverWidget.FieldType.SELECT,
                    label: "Vin #",
                    source: "customrecord_advs_vm"
                }).updateDisplayType({
                    displayType: "hidden"
                });
                sublist.addField({
                    id: "custpabe_transport",
                    type: serverWidget.FieldType.TEXT,
                    label: "Transport"
                }).updateDisplayType({
                    displayType: "inline"
                });
                sublist.addField({
                    id: "custpabe_m_donsite",
                    type: serverWidget.FieldType.DATE,
                    label: "Date On Site"
                }).updateDisplayType({
                    displayType: "inline"
                });
                sublist.addField({
                    id: "custpabe_inspected",
                    type: serverWidget.FieldType.TEXT,
                    label: "Inspected"
                }).updateDisplayType({
                    displayType: "inline"
                }); //new
                sublist.addField({
                    id: "custpabe_appr_rep_date",
                    type: serverWidget.FieldType.DATE,
                    label: "Approved Repairs Date"
                }).updateDisplayType({
                    displayType: "inline"
                }); //new
                sublist.addField({
                    id: "custpabe_eta_ready",
                    type: serverWidget.FieldType.DATE,
                    label: "ETA Ready"
                }).updateDisplayType({
                    displayType: "inline"
                }); //new
                sublist.addField({
                    id: "custpabe_pictures",
                    type: serverWidget.FieldType.IMAGE,
                    label: "Pictures"
                }); //new
                sublist.addField({
                    id: "custpabe_m_customer",
                    type: serverWidget.FieldType.SELECT,
                    label: "Customer",
                    source: "customer"
                }).updateDisplayType({
                    displayType: "inline"
                });
                sublist.addField({
                    id: "custpabe_m_softhold_customer",
                    type: serverWidget.FieldType.SELECT,
                    label: "Soft Hold Customer",
                    source: "customer"
                }).updateDisplayType({
                    displayType: "inline"
                });
                sublist.addField({
                    id: "custpabe_m_softhold_days",
                    type: serverWidget.FieldType.FLOAT,
                    label: "Soft Hold - Age In Days",
                }).updateDisplayType({
                    displayType: "inline"
                });
                sublist.addField({
                    id: "custpabe_m_emp",
                    type: serverWidget.FieldType.SELECT,
                    label: "SalesRep",
                    source: 'employee'
                }).updateDisplayType({
                    displayType: "inline"
                });
                sublist.addField({
                    id: "custpabe_m_admin_notes",
                    type: serverWidget.FieldType.TEXTAREA,
                    label: "Admin Notes"
                }); //new
                sublist.addField({
                    id: "custpabe_m_dtruck_ready",
                    type: serverWidget.FieldType.DATE,
                    label: "Date Truck Ready"
                }).updateDisplayType({
                    displayType: "inline"
                });
                sublist.addField({
                    id: "custpabe_m_dtruck_lockup",
                    type: serverWidget.FieldType.DATE,
                    label: "Date Truck Locked Up"
                }).updateDisplayType({
                    displayType: "inline"
                });
                sublist.addField({
                    id: "custpabe_m_aging",
                    type: serverWidget.FieldType.INTEGER,
                    label: "Aging Date Truck Ready"
                }).updateDisplayType({
                    displayType: "inline"
                });
                sublist.addField({
                    id: "custpabe_m_donsite_aging",
                    type: serverWidget.FieldType.INTEGER,
                    label: "Aging Date On Site"
                }).updateDisplayType({
                    displayType: "inline"
                });
                sublist.addField({
                    id: "custpabe_aging_contract",
                    type: serverWidget.FieldType.DATE,
                    label: "Aging Contract"
                }).updateDisplayType({
                    displayType: "inline"
                }); //new
                sublist.addField({
                    id: "custpabe_m_bkt_ttl_incep_2",
                    type: serverWidget.FieldType.TEXT,
                    label: "Total Inception"
                }); // new
                sublist.addField({
                    id: "custpabe_m_bkt_dep",
                    type: serverWidget.FieldType.TEXT,
                    label: "Deposit"
                }); //new
                sublist.addField({
                    id: "custpabe_m_bkt_pay",
                    type: serverWidget.FieldType.TEXT,
                    label: "Payment"
                }); //new
                sublist.addField({
                    id: "custpabe_m_bkt_terms_2",
                    type: serverWidget.FieldType.INTEGER,
                    label: "Terms"
                }); //new
                sublist.addField({
                    id: "custpabe_m_bkt_pay_13",
                    type: serverWidget.FieldType.TEXT,
                    label: "Payments 2-13"
                });
                sublist.addField({
                    id: "custpabe_m_bkt_pay_25",
                    type: serverWidget.FieldType.TEXT,
                    label: "Payments 14-25"
                });
                sublist.addField({
                    id: "custpabe_m_bkt_pay_37",
                    type: serverWidget.FieldType.TEXT,
                    label: "Payments 26-37"
                });
                sublist.addField({
                    id: "custpabe_m_bkt_pay_49",
                    type: serverWidget.FieldType.TEXT,
                    label: "Payments 26-37"
                });
                sublist.addField({
                    id: "custpabe_m_bkt_pur_opt",
                    type: serverWidget.FieldType.TEXT,
                    label: "Purchase Option"
                });
                sublist.addField({
                    id: "custpabe_m_bkt_cont_tot",
                    type: serverWidget.FieldType.TEXT,
                    label: "Contract Total"
                });
                sublist.addField({
                    id: "custpabe_m_sleepersize",
                    type: serverWidget.FieldType.TEXT,
                    label: "Sleeper Size",
                }).updateDisplayType({
                    displayType: "inline"
                });
                sublist.addField({
                    id: "custpabe_m_apu",
                    type: serverWidget.FieldType.TEXT,
                    label: "APU",
                }).updateDisplayType({
                    displayType: "inline"
                });
                sublist.addField({
                    id: "custpabe_m_beds",
                    type: serverWidget.FieldType.TEXT,
                    label: "Beds",
                }).updateDisplayType({
                    displayType: "inline"
                });
                sublist.addField({
                    id: "custpabe_m_bkt_id",
                    type: serverWidget.FieldType.SELECT,
                    label: "Bucket",
                    source: "customrecord_ez_bucket_calculation"
                }).updateDisplayType({
                    displayType: "inline"
                });
                // sublist.addField({ id: "custpabe_make", type: serverWidget.FieldType.SELECT, label: "Make", source: "customrecord_advs_brands"  }).updateDisplayType({ displayType: "inline" });
                sublist.addField({
                    id: "custpabe_m_bkt_freq",
                    type: serverWidget.FieldType.SELECT,
                    label: "Frequency",
                    source: "customrecord_advs_st_frequency"
                }).updateDisplayType({
                    displayType: "hidden"
                });
                sublist.addField({
                    id: "custpabe_m_bkt_ch_id",
                    type: serverWidget.FieldType.SELECT,
                    label: "Bucket Child",
                    source: "customrecord_bucket_calculation_location"
                }).updateDisplayType({
                    displayType: "hidden"
                });
                sublist.addField({
                    id: "custpabe_m_bkt_salesch",
                    type: serverWidget.FieldType.SELECT,
                    label: "Sales Channel"
                }).updateDisplayType({
                    displayType: "hidden"
                });



                // Run the search with paging
                // log.debug('vmSearchObj.filters', vmSearchObj.filters);
                // Add buttons to simulate Next & Previous
                if (pageId != 0) {
                    sublist.addButton({
                        id: 'custpage_previous',
                        label: 'Previous',
                        functionName: 'getSuiteletPage("' + scriptId + '", "' + deploymentId + '", ' + (pageId - 1) + ')'
                    });
                }
                if (pageId != pageCount - 1) {
                    sublist.addButton({
                        id: 'custpage_next',
                        label: 'Next',
                        functionName: 'getSuiteletPage("' + scriptId + '", "' + deploymentId + '", ' + (pageId + 1) + ')'
                    });
                }

                for (i = 0; i < pageCount; i++) {
                    if (i == pageId) {
                        selectOptions.addSelectOption({
                            value: 'pageid_' + i,
                            text: ((i * pageSize) + 1) + ' - ' + ((i + 1) * pageSize),
                            isSelected: true
                        });
                    } else {
                        selectOptions.addSelectOption({
                            value: 'pageid_' + i,
                            text: ((i * pageSize) + 1) + ' - ' + ((i + 1) * pageSize)
                        });
                    }
                }

                var vmData = [];

                var urlRes = url.resolveRecord({
                    recordType: 'customrecord_advs_lease_header'
                });

                var urlResStatus = url.resolveScript({
                    scriptId: 'customscript_advs_ss_manager_dashboard_c',
                    deploymentId: 'customdeploy_advs_ss_manager_dashboard_c',
                    returnExternalUrl: false
                });

                var lineNum = 0;

                for (var m = 0; m < addResults.length; m++) {
                    if (addResults[m] != null && addResults[m] != undefined) {

                        var vinid = addResults[m].id;
                        var vinName = addResults[m].vinName;
                        //log.debug('vinName',vinName);
                        var model = addResults[m].modelid;
                        var brand = addResults[m].brand;
                        var locid = addResults[m].locid;
                        var phylocId = addResults[m].phylocId;
                        var modelyr = addResults[m].modelyr;
                        var bucketId = addResults[m].bucketId;
                        var stockdt = addResults[m].stockdt;
                        var Statusdt = addResults[m].Statusdt;
                        var Mileagedt = addResults[m].Mileagedt || 0;
                        var Transdt = addResults[m].Transdt;
                        var Enginedt = addResults[m].Enginedt;
                        var Customerdt = addResults[m].Customerdt;
                        var softHoldCustomerdt = addResults[m].softHoldCustomerdt;
                        var softHoldCus_sales_rep = addResults[m].softHoldCus_sales_rep
                        var salesrepdt = addResults[m].salesrepdt;
                        var softHoldstatusdt = addResults[m].softHoldstatusdt;
                        var softholdageindays = addResults[m].softholdageindays;
                        var extclrdt = addResults[m].extclrdt;
                        var DateTruckRdydt = addResults[m].DateTruckRdydt;
                        var DateTruckLockupdt = addResults[m].DateTruckLockupdt;
                        var DateTruckAgingdt = addResults[m].DateTruckAgingdt;
                        var DateOnsitedt = addResults[m].DateOnsitedt;
                        var invdepositLink = addResults[m].invdepositLink;
                        var InvSales = addResults[m].InvSales;
                        var deliveryBoardBalance = addResults[m].deliveryBoardBalance;
                        var deliveryboard = addResults[m].deliveryboard;
                        var sleepersize = addResults[m].sleepersize;
                        var apu = addResults[m].apu;
                        var beds = addResults[m].beds;
                        var titlerestriction = addResults[m].titlerestriction;
                        var iswashed = addResults[m].iswashed;
                        var istruckready = addResults[m].istruckready;

                        var singlebunk = addResults[m].singlebunk;
                        var Transport = addResults[m].Transport;
                        var Inspected = addResults[m].Inspected;
                        var Picture1 = addResults[m].Picture1;
                        var ApprRepDate = addResults[m].ApprRepDate;
                        var admin_notes = addResults[m].admin_notes;
                        var body_style = addResults[m].body_style;
                        var eta_ready = addResults[m].eta_ready;
                        var notesms = addResults[m].notesms;
                        var aging_contr = addResults[m].aging_contr;
                        var bucketchildsIds = addResults[m].bucketchildsIds;
                        var bucketchilds = addResults[m].bucketchilds;
                        var incepdiscount = addResults[m].incepdiscount;
                        var isOldVehicle = addResults[m].isOldVehicle;
                        var isDiscounttoApply = addResults[m].isDiscounttoApply;
                        //SOFTHOLD VALUES
                        var sh_depo_inception = addResults[m].sh_depo_inception;
                        var sh_payment_inc = addResults[m].sh_payment_inc;
                        var sh_total_inc = addResults[m].sh_total_inc;
                        var sh_terms = addResults[m].sh_terms;
                        var sh_payterm1 = addResults[m].sh_payterm1;
                        var sh_payterm2 = addResults[m].sh_payterm2;
                        var sh_payterm3 = addResults[m].sh_payterm3;
                        var sh_payterm4 = addResults[m].sh_payterm4;
                        var sh_purchase_option = addResults[m].sh_purchase_option;
                        var sh_contract_total = addResults[m].sh_contract_total;
                        var sh_reg_fee = addResults[m].sh_reg_fee;
                        var sh_grandtotal = addResults[m].sh_grandtotal;

                        var sh_depo_inception1 = addResults[m].sh_depo_inception1;
                        var sh_payment_inc1 = addResults[m].sh_payment_inc1;
                        var sh_total_inc1 = addResults[m].sh_total_inc1;
                        var sh_terms1 = addResults[m].sh_terms1;
                        var sh_payterm1_1 = addResults[m].sh_payterm1_1;
                        var sh_payterm2_1 = addResults[m].sh_payterm2_1;
                        var sh_payterm3_1 = addResults[m].sh_payterm3_1;
                        var sh_payterm4_1 = addResults[m].sh_payterm4_1;
                        var sh_purchase_option1 = addResults[m].sh_purchase_option1;
                        var sh_contract_total1 = addResults[m].sh_contract_total1;
                        var sh_reg_fee1 = addResults[m].sh_reg_fee1;
                        var sh_grandtotal_1 = addResults[m].sh_grandtotal_1;
                        var sh_bucket1 = addResults[m].sh_bucket1;
                        var sh_bucket2 = addResults[m].sh_bucket2;



                        if (bucketchilds && bucketchilds.length > 1) {
                            var _bucketchilds = bucketchilds.split(',');
                        } else {
                            var _bucketchilds = []
                        }

                        var lengthBuck = 0;
                        for (var jk = 0; jk < _bucketchilds.length; jk++) {
                            if (bucketData[_bucketchilds[jk]] != null && bucketData[_bucketchilds[jk]] != undefined) {
                                var lengthBuck = bucketData[_bucketchilds[jk]].length;
                            }
                        }

                        //log.debug('incepdiscount',incepdiscount);
                        /* log.debug('bucketchilds',bucketchilds);
            log.debug('_bucketchilds.len',_bucketchilds.length); */

                        if (_bucketchilds.length > 0) {
                            var mileagepopup = '<a href="#" onclick=updateMileage(' + vinid + ')><i class="fa fa-edit" style="color:blue;"</i> </a>';
                            var mileagepopupfordata = '<a href="#" onclick=updateMileage(' + vinid + ')>' + Mileagedt + ' </a>';
                            for (var k = 0; k < _bucketchilds.length; k++) {
                                //log.debug('bucketData[_bucketchilds[k]][0]',bucketData[_bucketchilds[k]][0]);
                                var bucketchildsdata = bucketData[_bucketchilds[k]][0];
                                // log.debug('bucketchildsdata["DEPINSP"]',bucketchildsdata["DEPINSP"])
                                var bktId = bucketchildsdata["id"];
                                var DEPINSP = bucketchildsdata["DEPINSP"] * 1;

                                var PAYINSP = bucketchildsdata["PAYINSP"] * 1;
                                var TTLINSP = bucketchildsdata["TTLINSP"] * 1;
                                var TERMS = bucketchildsdata["TRMS"] * 1;
                                var sec_2_13 = bucketchildsdata["2_13"] * 1;
                                var sec_14_26 = bucketchildsdata["14_26"] * 1;
                                var sec_26_37 = bucketchildsdata["26_37"] * 1;
                                var sec_38_49 = bucketchildsdata["38_49"] * 1;
                                var purOptn = bucketchildsdata["purOptn"] * 1;
                                var contTot = bucketchildsdata["conttot"] * 1;
                                var freq = bucketchildsdata["freq"];
                                var saleCh = bucketchildsdata["saleCh"];




                                if (true) {
                                    DEPINSP = DEPINSP - incepdiscount;
                                    TTLINSP = TTLINSP - incepdiscount;
                                    purOptn = purOptn - incepdiscount;
                                    contTot = contTot - incepdiscount;
                                }

                                if (softHoldstatusdt != '' && (bktId == sh_bucket1)) {

                                    DEPINSP = sh_depo_inception;
                                    PAYINSP = sh_payment_inc;
                                    TTLINSP = sh_total_inc;
                                    TERMS = sh_terms;
                                    sec_2_13 = sh_payterm1;
                                    sec_14_26 = sh_payterm2;
                                    sec_26_37 = sh_payterm3;
                                    sec_38_49 = sh_payterm4;
                                    purOptn = sh_purchase_option;
                                    contTot = sh_contract_total;


                                }
                                if (softHoldstatusdt != '' && (bktId == sh_bucket2)) {

                                    DEPINSP = sh_depo_inception1;
                                    PAYINSP = sh_payment_inc1;
                                    TTLINSP = sh_total_inc1;
                                    TERMS = sh_terms1;
                                    sec_2_13 = sh_payterm1_1;
                                    sec_14_26 = sh_payterm2_1;
                                    sec_26_37 = sh_payterm3_1;
                                    sec_38_49 = sh_payterm4_1;
                                    purOptn = sh_purchase_option1;
                                    contTot = sh_contract_total1;


                                }
                                sublist.setSublistValue({
                                    id: "custpabe_vinid",
                                    line: lineNum,
                                    value: vinid
                                });

                                var urllink = 'https://8760954.app.netsuite.com/app/common/custom/custrecordentry.nl?rectype=129&id=' + vinid;

                                sublist.setSublistValue({
                                    id: "custpabe_vinid_link",
                                    line: lineNum,
                                    value: '<a href="' + urllink + '">' + vinName + '</a>'
                                });
                                sublist.setSublistValue({
                                    id: "custpabe_model",
                                    line: lineNum,
                                    value: model
                                });

                                sublist.setSublistValue({
                                    id: "custpabe_loc",
                                    line: lineNum,
                                    value: locid
                                });
                                if (phylocId) {
                                    sublist.setSublistValue({
                                        id: "custpabe_phyloc",
                                        line: lineNum,
                                        value: phylocId
                                    });
                                }

                                if (modelyr) {
                                    sublist.setSublistValue({
                                        id: "custpabe_m_yr",
                                        line: lineNum,
                                        value: modelyr
                                    });
                                }
                                sublist.setSublistValue({
                                    id: "custpabe_m_stock",
                                    line: lineNum,
                                    value: stockdt
                                });
                                sublist.setSublistValue({
                                    id: "custpabe_m_status",
                                    line: lineNum,
                                    value: Statusdt
                                });
                                if (Mileagedt == 0) {
                                    sublist.setSublistValue({
                                        id: "custpabe_m_mileage",
                                        line: lineNum,
                                        value: mileagepopup
                                    });
                                } else {
                                    sublist.setSublistValue({
                                        id: "custpabe_m_mileage",
                                        line: lineNum,
                                        value: mileagepopupfordata
                                    });
                                }
                                sublist.setSublistValue({
                                    id: "custpabe_m_customer",
                                    line: lineNum,
                                    value: Customerdt
                                });
                                if (Transdt) {
                                    sublist.setSublistValue({
                                        id: "custpabe_m_transmission",
                                        line: lineNum,
                                        value: Transdt
                                    });
                                }
                                if (Enginedt) {
                                    sublist.setSublistValue({
                                        id: "custpabe_m_engine",
                                        line: lineNum,
                                        value: Enginedt
                                    });
                                }
                                if (softHoldCustomerdt) {
                                    sublist.setSublistValue({
                                        id: "custpabe_m_softhold_customer",
                                        line: lineNum,
                                        value: softHoldCustomerdt
                                    });
                                }
                                if (singlebunk) {
                                    sublist.setSublistValue({
                                        id: "custpabe_m_single_bunk",
                                        line: lineNum,
                                        value: singlebunk
                                    });
                                }
                                if (Transport) {
                                    sublist.setSublistValue({
                                        id: "custpabe_transport",
                                        line: lineNum,
                                        value: Transport
                                    });
                                }
                                if (Inspected) {
                                    sublist.setSublistValue({
                                        id: "custpabe_inspected",
                                        line: lineNum,
                                        value: Inspected
                                    });
                                }
                                if (Picture1) {
                                    sublist.setSublistValue({
                                        id: "custpabe_pictures",
                                        line: lineNum,
                                        value: Picture1
                                    });
                                }
                                if (ApprRepDate) {
                                    sublist.setSublistValue({
                                        id: "custpabe_appr_rep_date",
                                        line: lineNum,
                                        value: ApprRepDate
                                    });
                                }
                                if (admin_notes) {
                                    sublist.setSublistValue({
                                        id: "custpabe_m_admin_notes",
                                        line: lineNum,
                                        value: admin_notes
                                    });
                                }
                                if (body_style) {
                                    sublist.setSublistValue({
                                        id: "custpabe_m_body_style",
                                        line: lineNum,
                                        value: body_style
                                    });
                                }
                                if (eta_ready) {
                                    sublist.setSublistValue({
                                        id: "custpabe_eta_ready",
                                        line: lineNum,
                                        value: eta_ready
                                    });
                                }
                                if (notesms) {
                                    sublist.setSublistValue({
                                        id: "custpabe_m_notes",
                                        line: lineNum,
                                        value: notesms
                                    });
                                }
                                if (aging_contr) {
                                    sublist.setSublistValue({
                                        id: "custpabe_aging_contract",
                                        line: lineNum,
                                        value: aging_contr
                                    });
                                }
                                if (TTLINSP) {
                                    sublist.setSublistValue({
                                        id: "custpabe_m_bkt_ttl_incep_2",
                                        line: lineNum,
                                        value: "$" + addCommasnew(parseFloat(TTLINSP).toFixed(2))
                                    });
                                }
                                if (DEPINSP) {
                                    sublist.setSublistValue({
                                        id: "custpabe_m_bkt_dep",
                                        line: lineNum,
                                        value: "$" + addCommasnew(parseFloat(DEPINSP).toFixed(2))
                                    });
                                }
                                if (PAYINSP) {
                                    sublist.setSublistValue({
                                        id: "custpabe_m_bkt_pay",
                                        line: lineNum,
                                        value: "$" + addCommasnew(parseFloat(PAYINSP).toFixed(2))
                                    });
                                }
                                if (TERMS) {
                                    sublist.setSublistValue({
                                        id: "custpabe_m_bkt_terms_2",
                                        line: lineNum,
                                        value: TERMS
                                    });
                                }
                                if (softholdageindays) {
                                    sublist.setSublistValue({
                                        id: "custpabe_m_softhold_days",
                                        line: lineNum,
                                        value: softholdageindays
                                    });
                                }
                                if (softHoldstatusdt) {
                                    sublist.setSublistValue({
                                        id: "custpabe_m_softhold_status",
                                        line: lineNum,
                                        value: softHoldstatusdt
                                    });
                                }
                                if (salesrepdt) {
                                    sublist.setSublistValue({
                                        id: "custpabe_m_emp",
                                        line: lineNum,
                                        value: salesrepdt
                                    });
                                }
                                if (extclrdt) {
                                    sublist.setSublistValue({
                                        id: "custpabe_m_color",
                                        line: lineNum,
                                        value: extclrdt
                                    });
                                }
                                if (sleepersize) {
                                    sublist.setSublistValue({
                                        id: "custpabe_m_sleepersize",
                                        line: lineNum,
                                        value: sleepersize
                                    });
                                }
                                if (apu) {
                                    sublist.setSublistValue({
                                        id: "custpabe_m_apu",
                                        line: lineNum,
                                        value: apu
                                    });
                                }
                                if (beds) {
                                    sublist.setSublistValue({
                                        id: "custpabe_m_beds",
                                        line: lineNum,
                                        value: beds
                                    });
                                }
                                if (titlerestriction) {
                                    sublist.setSublistValue({
                                        id: "custpabe_m_titlerestriction2",
                                        line: lineNum,
                                        value: titlerestriction
                                    });
                                }
                                var titlerestrictionVal = "";
                                if (titlerestriction == "Yes") {
                                    titlerestrictionVal = '<a href="#" title="You can only lease to lessees with a valid drivers license in these states:  Arkansas, Florida, Georgia, Illinois, Indiana, Iowa, Kansas, Minnesota, Mississippi, Missouri, Michigan, Nebraska, New York, North Carolina, Ohio, Tennessee, Texas, Wisconsin.">YES</a>';
                                } else if (titlerestriction == "No") {
                                    titlerestrictionVal = 'No';
                                }
                                if (titlerestrictionVal != '') {
                                    sublist.setSublistValue({
                                        id: "custpabe_m_titlerestriction",
                                        line: lineNum,
                                        value: titlerestrictionVal
                                    });
                                }

                                if (DateTruckRdydt) {
                                    sublist.setSublistValue({
                                        id: "custpabe_m_dtruck_ready",
                                        line: lineNum,
                                        value: DateTruckRdydt
                                    });
                                }
                                if (DateTruckLockupdt) {
                                    sublist.setSublistValue({
                                        id: "custpabe_m_dtruck_lockup",
                                        line: lineNum,
                                        value: DateTruckLockupdt
                                    });
                                }
                                if (istruckready) {
                                    istruckready = istruckready ? "Yes" : "No";
                                    sublist.setSublistValue({
                                        id: "custpabe_m_is_truck_ready",
                                        line: lineNum,
                                        value: istruckready
                                    });
                                }
                                if (iswashed) {
                                    iswashed = iswashed ? "Yes" : "No";
                                    sublist.setSublistValue({
                                        id: "custpabe_m_is_washed",
                                        line: lineNum,
                                        value: iswashed
                                    });
                                }
                                // if (DateTruckAgingdt) {  // removed by abdul
                                if (DateTruckRdydt) {
                                    sublist.setSublistValue({
                                        id: "custpabe_m_aging",
                                        line: lineNum,
                                        value: calculateDays(DateTruckRdydt, new Date())
                                    });
                                }
                                if (DateOnsitedt) {
                                    sublist.setSublistValue({
                                        id: "custpabe_m_donsite",
                                        line: lineNum,
                                        value: DateOnsitedt
                                    });
                                }
                                if (DateOnsitedt) {
                                    sublist.setSublistValue({
                                        id: "custpabe_m_donsite_aging",
                                        line: lineNum,
                                        value: calculateDays(DateOnsitedt, new Date())
                                    });
                                }

                                sublist.setSublistValue({
                                    id: "custpabe_m_bkt_id",
                                    line: lineNum,
                                    value: bucketId
                                });
                                sublist.setSublistValue({
                                    id: "custpabe_m_bkt_ch_id",
                                    line: lineNum,
                                    value: bktId
                                });
                                sublist.setSublistValue({
                                    id: "custpabe_m_bkt_dep_incep",
                                    line: lineNum,
                                    value: "$" + addCommasnew(parseFloat(DEPINSP).toFixed(2))
                                });
                                sublist.setSublistValue({
                                    id: "custpabe_m_bkt_pay_incep",
                                    line: lineNum,
                                    value: "$" + addCommasnew(parseFloat(PAYINSP).toFixed(2))
                                });
                                sublist.setSublistValue({
                                    id: "custpabe_m_bkt_ttl_incep",
                                    line: lineNum,
                                    value: "$" + addCommasnew(parseFloat(TTLINSP).toFixed(2))
                                });
                                if (TERMS) {
                                    sublist.setSublistValue({
                                        id: "custpabe_m_bkt_terms",
                                        line: lineNum,
                                        value: TERMS
                                    });
                                }
                                if (sec_2_13) {
                                    sublist.setSublistValue({
                                        id: "custpabe_m_bkt_pay_13",
                                        line: lineNum,
                                        value: "$" + addCommasnew(parseFloat(sec_2_13).toFixed(2))
                                    });
                                }
                                if (sec_14_26) {
                                    sublist.setSublistValue({
                                        id: "custpabe_m_bkt_pay_25",
                                        line: lineNum,
                                        value: "$" + addCommasnew(parseFloat(sec_14_26).toFixed(2))
                                    });
                                }
                                if (sec_26_37) {
                                    sublist.setSublistValue({
                                        id: "custpabe_m_bkt_pay_37",
                                        line: lineNum,
                                        value: "$" + addCommasnew(parseFloat(sec_26_37).toFixed(2))
                                    });
                                }
                                if (sec_38_49) {
                                    sublist.setSublistValue({
                                        id: "custpabe_m_bkt_pay_49",
                                        line: lineNum,
                                        value: "$" + addCommasnew(parseFloat(sec_38_49).toFixed(2))
                                    });
                                }
                                if (purOptn) {
                                    sublist.setSublistValue({
                                        id: "custpabe_m_bkt_pur_opt",
                                        line: lineNum,
                                        value: "$" + addCommasnew(parseFloat(purOptn).toFixed(2))
                                    });
                                }
                                if (contTot) {
                                    sublist.setSublistValue({
                                        id: "custpabe_m_bkt_cont_tot",
                                        line: lineNum,
                                        value: "$" + addCommasnew(parseFloat(contTot).toFixed(2))
                                    });
                                }



                                sublist.setSublistValue({
                                    id: "custpabe_m_bkt_freq",
                                    line: lineNum,
                                    value: freq
                                });
                                if (saleCh) {
                                    sublist.setSublistValue({
                                        id: "custpabe_m_bkt_salesch",
                                        line: lineNum,
                                        value: saleCh
                                    });
                                }
                                sublist.setSublistValue({
                                    id: 'cust_list_open_accordian',
                                    line: lineNum,
                                    value: '<a href= "#" class="openaccordian" ><i class="fa fa-angle-down" style="font-size:36px;color:red"></i></a>'
                                });
                                if (!flagpara2) {
                                    //if(Statusdt!=15){ //if softhold will not display icon
                                    /* sublist.setSublistValue({ id: 'cust_list_veh_card', line: lineNum, value: '<a href="' + urlRes + "&param_vin=" + vinid + "&param_buckt=" + bktId + "" + '" target="_blank"><img class=\"i_dashboard_gray\"  src=\"/uirefresh/img/dashboard.png"   width=\"25px\" height=\"20px\"/></a>' }); */
                                    var Soft_hold_customer = "";
                                    if (softHoldCustomerdt) {
                                        Soft_hold_customer = softHoldCustomerdt
                                    }
                                    // var VehicleCardValURL = '<a href="' + urlRes + "&param_vin=" + vinid + "&param_buckt=" + bktId + "" + '" target="_blank"><img class=\"i_dashboard_gray\"  src=\"/uirefresh/img/dashboard.png"   width=\"25px\" height=\"20px\"/></a>'
                                    var VehicleCardValURL = '<a href="' + urlRes + "&param_vin=" + vinid + "&param_buckt=" + bktId + "&custparam_soft_hold_cus=" + Soft_hold_customer + "&custpara_sof_hold_salesrep=" + softHoldCus_sales_rep + '" target="_blank"><img class=\"i_dashboard_gray\"  src=\"/uirefresh/img/dashboard.png"   width=\"25px\" height=\"20px\"/></a>';
                                    sublist.setSublistValue({
                                        id: 'cust_list_veh_card',
                                        line: lineNum,
                                        value: VehicleCardValURL
                                    });
                                    // var ChangeStatusValURL =  '<a href="' + urlResStatus + "&param_vin=" + vinid + "&param_buckt=" + bktId + "" + '" target="_parent"><img class=\"i_dashboard_gray\"  src=\"/uirefresh/img/dashboard.png"   width=\"25px\" height=\"20px\"/></a>'
                                    var ChangeStatusValURL = '<a href="#" onclick=changeStatus(' + vinid + ')><i class="fa fa-edit" style="color:blue;"</i> </a>';
                                    sublist.setSublistValue({
                                        id: 'custpabe_m_changestatus',
                                        line: lineNum,
                                        value: ChangeStatusValURL
                                    });

                                }
                                //if(Soft_hold_customer){search.lookupFields({type:'customer',id:Soft_hold_customer,columns:['salesrep','location','department']});}
                                if (!invdepositLink) { //
                                    if (Statusdt != 15) { //if softhold will not display icon
                                        var DepositCreationV = '<a href= "#" onclick=depositcreation(' + Soft_hold_customer + ',' + vinid + ',' + DEPINSP + ',' + PAYINSP + ')><i class="fa fa-bank" style="color:blue;"></i></a>';
                                        sublist.setSublistValue({
                                            id: 'cust_list_veh_delivey',
                                            line: lineNum,
                                            value: DepositCreationV
                                        });
                                    }
                                } else if ((invdepositLink && deliveryBoardBalance > 0) || (Statusdt != "13")) {
                                    var DepositCreation = '<a href= "#" onclick=depositcreation(' + Soft_hold_customer + ',' + vinid + ',' + DEPINSP + ',' + PAYINSP + ')><i class="fa fa-bank" style="color:blue;"></i></a>';
                                    sublist.setSublistValue({
                                        id: 'cust_list_veh_delivey',
                                        line: lineNum,
                                        value: DepositCreation
                                    });
                                }
                                if (true) { //!invdepositLink SURYA IS REMOVING
                                    sublist.setSublistValue({
                                        id: 'cust_list_soft_hold',
                                        line: lineNum,
                                        value: '<a href= "#" onclick=softholdupdate(' + vinid + ',' + DEPINSP + ',' + PAYINSP + ',' + TTLINSP + ',' + TERMS + ',' + (sec_2_13 || 0) + ',' + (sec_14_26 || 0) + ',' + (sec_26_37 || 0) + ',' + (sec_38_49 || 0) + ',' + purOptn + ',' + contTot + ',' + bktId + ')><i class="fa fa-edit" style="color:blue;"></i></a>'
                                    });

                                }
                                if (deliveryboard == true) {
                                    sublist.setSublistValue({
                                        id: 'cust_select_checkbox_highlight',
                                        line: lineNum,
                                        value: 'T'
                                    });
                                }

                                lineNum++;
                            }
                        } else {
                            var mileagepopup = '<a href="#" onclick=updateMileage(' + vinid + ')><i class="fa fa-edit" style="color:blue;"</i> </a>';
                            var mileagepopupfordata = '<a href="#" onclick=updateMileage(' + vinid + ')>' + Mileagedt + ' </a>';
                            for (var jk = 0; jk < 2; jk++) {

                                //SETTING DATA FOR BUCKETS NOT ASSIGNED
                                if (vinid) {
                                    sublist.setSublistValue({
                                        id: "custpabe_vinid",
                                        line: lineNum,
                                        value: vinid
                                    });
                                }


                                var urllink = 'https://8760954.app.netsuite.com/app/common/custom/custrecordentry.nl?rectype=129&id=' + vinid;

                                sublist.setSublistValue({
                                    id: "custpabe_vinid_link",
                                    line: lineNum,
                                    value: '<a href="' + urllink + '">' + vinName + '</a>'
                                });
                                var ChangeStatusValURL = '<a href="#" onclick=changeStatus(' + vinid + ')><i class="fa fa-edit" style="color:blue;"</i> </a>';
                                sublist.setSublistValue({
                                    id: 'custpabe_m_changestatus',
                                    line: lineNum,
                                    value: ChangeStatusValURL
                                });
                                if (model) {
                                    sublist.setSublistValue({
                                        id: "custpabe_model",
                                        line: lineNum,
                                        value: model
                                    });
                                }

                                if (locid) {
                                    sublist.setSublistValue({
                                        id: "custpabe_loc",
                                        line: lineNum,
                                        value: locid
                                    });
                                }
                                if (phylocId) {
                                    sublist.setSublistValue({
                                        id: "custpabe_phyloc",
                                        line: lineNum,
                                        value: phylocId
                                    });
                                }

                                if (modelyr) {
                                    sublist.setSublistValue({
                                        id: "custpabe_m_yr",
                                        line: lineNum,
                                        value: modelyr
                                    });
                                }
                                if (stockdt) {
                                    sublist.setSublistValue({
                                        id: "custpabe_m_stock",
                                        line: lineNum,
                                        value: stockdt
                                    });
                                }
                                if (Statusdt) {
                                    sublist.setSublistValue({
                                        id: "custpabe_m_status",
                                        line: lineNum,
                                        value: Statusdt
                                    });
                                }

                                if (Mileagedt == 0) {
                                    sublist.setSublistValue({
                                        id: "custpabe_m_mileage",
                                        line: lineNum,
                                        value: mileagepopup
                                    });
                                } else {
                                    sublist.setSublistValue({
                                        id: "custpabe_m_mileage",
                                        line: lineNum,
                                        value: mileagepopupfordata
                                    });
                                }
                                if (Customerdt) {
                                    sublist.setSublistValue({
                                        id: "custpabe_m_customer",
                                        line: lineNum,
                                        value: Customerdt
                                    });
                                }

                                if (Transdt) {
                                    sublist.setSublistValue({
                                        id: "custpabe_m_transmission",
                                        line: lineNum,
                                        value: Transdt
                                    });
                                }
                                if (Enginedt) {
                                    sublist.setSublistValue({
                                        id: "custpabe_m_engine",
                                        line: lineNum,
                                        value: Enginedt
                                    });
                                }
                                if (softHoldCustomerdt) {
                                    sublist.setSublistValue({
                                        id: "custpabe_m_softhold_customer",
                                        line: lineNum,
                                        value: softHoldCustomerdt
                                    });
                                }
                                if (singlebunk) {
                                    sublist.setSublistValue({
                                        id: "custpabe_m_single_bunk",
                                        line: lineNum,
                                        value: singlebunk
                                    });
                                }
                                if (Transport) {
                                    sublist.setSublistValue({
                                        id: "custpabe_transport",
                                        line: lineNum,
                                        value: Transport
                                    });
                                }
                                if (Inspected) {
                                    sublist.setSublistValue({
                                        id: "custpabe_inspected",
                                        line: lineNum,
                                        value: Inspected
                                    });
                                }
                                if (Picture1) {
                                    sublist.setSublistValue({
                                        id: "custpabe_pictures",
                                        line: lineNum,
                                        value: Picture1
                                    });
                                }
                                if (ApprRepDate) {
                                    sublist.setSublistValue({
                                        id: "custpabe_appr_rep_date",
                                        line: lineNum,
                                        value: ApprRepDate
                                    });
                                }
                                if (admin_notes) {
                                    sublist.setSublistValue({
                                        id: "custpabe_m_admin_notes",
                                        line: lineNum,
                                        value: admin_notes
                                    });
                                }
                                if (body_style) {
                                    sublist.setSublistValue({
                                        id: "custpabe_m_body_style",
                                        line: lineNum,
                                        value: body_style
                                    });
                                }
                                if (eta_ready) {
                                    sublist.setSublistValue({
                                        id: "custpabe_eta_ready",
                                        line: lineNum,
                                        value: eta_ready
                                    });
                                }
                                if (notesms) {
                                    sublist.setSublistValue({
                                        id: "custpabe_m_notes",
                                        line: lineNum,
                                        value: notesms
                                    });
                                }
                                if (aging_contr) {
                                    sublist.setSublistValue({
                                        id: "custpabe_aging_contract",
                                        line: lineNum,
                                        value: aging_contr
                                    });
                                }
                                /*  if(TTLINSP){
                     sublist.setSublistValue({ id: "custpabe_m_bkt_ttl_incep_2", line: lineNum, value: "$" + addCommasnew(TTLINSP.toFixed(2)) });
                 }
                 if(DEPINSP){
                     sublist.setSublistValue({ id: "custpabe_m_bkt_dep", line: lineNum, value: "$" + addCommasnew(DEPINSP.toFixed(2)) });
                 }
                 if(PAYINSP){
                     sublist.setSublistValue({ id: "custpabe_m_bkt_pay", line: lineNum, value: "$" + addCommasnew(PAYINSP.toFixed(2)) });
                 }
                 if(TERMS){
                     sublist.setSublistValue({ id: "custpabe_m_bkt_terms_2", line: lineNum, value: TERMS });
                 } */
                                if (softholdageindays) {
                                    sublist.setSublistValue({
                                        id: "custpabe_m_softhold_days",
                                        line: lineNum,
                                        value: softholdageindays
                                    });
                                }
                                if (softHoldstatusdt) {
                                    sublist.setSublistValue({
                                        id: "custpabe_m_softhold_status",
                                        line: lineNum,
                                        value: softHoldstatusdt
                                    });
                                }
                                if (salesrepdt) {
                                    sublist.setSublistValue({
                                        id: "custpabe_m_emp",
                                        line: lineNum,
                                        value: salesrepdt
                                    });
                                }
                                if (extclrdt) {
                                    sublist.setSublistValue({
                                        id: "custpabe_m_color",
                                        line: lineNum,
                                        value: extclrdt
                                    });
                                }
                                if (sleepersize) {
                                    sublist.setSublistValue({
                                        id: "custpabe_m_sleepersize",
                                        line: lineNum,
                                        value: sleepersize
                                    });
                                }
                                if (apu) {
                                    sublist.setSublistValue({
                                        id: "custpabe_m_apu",
                                        line: lineNum,
                                        value: apu
                                    });
                                }
                                if (beds) {
                                    sublist.setSublistValue({
                                        id: "custpabe_m_beds",
                                        line: lineNum,
                                        value: beds
                                    });
                                }
                                if (titlerestriction) {
                                    sublist.setSublistValue({
                                        id: "custpabe_m_titlerestriction2",
                                        line: lineNum,
                                        value: titlerestriction
                                    });
                                }
                                var titlerestrictionVal = "";
                                if (titlerestriction == "Yes") {
                                    titlerestrictionVal = '<a href="#" title="You can only lease to lessees with a valid drivers license in these states:  Arkansas, Florida, Georgia, Illinois, Indiana, Iowa, Kansas, Minnesota, Mississippi, Missouri, Michigan, Nebraska, New York, North Carolina, Ohio, Tennessee, Texas, Wisconsin.">YES</a>';
                                } else if (titlerestriction == "No") {
                                    titlerestrictionVal = 'No';
                                }
                                if (titlerestrictionVal != '') {
                                    sublist.setSublistValue({
                                        id: "custpabe_m_titlerestriction",
                                        line: lineNum,
                                        value: titlerestrictionVal
                                    });
                                }

                                if (DateTruckRdydt) {
                                    sublist.setSublistValue({
                                        id: "custpabe_m_dtruck_ready",
                                        line: lineNum,
                                        value: DateTruckRdydt
                                    });
                                }
                                if (DateTruckLockupdt) {
                                    sublist.setSublistValue({
                                        id: "custpabe_m_dtruck_lockup",
                                        line: lineNum,
                                        value: DateTruckLockupdt
                                    });
                                }
                                if (istruckready) {
                                    istruckready = istruckready ? "Yes" : "No";
                                    sublist.setSublistValue({
                                        id: "custpabe_m_is_truck_ready",
                                        line: lineNum,
                                        value: istruckready
                                    });
                                }
                                if (iswashed) {
                                    iswashed = iswashed ? "Yes" : "No";
                                    sublist.setSublistValue({
                                        id: "custpabe_m_is_washed",
                                        line: lineNum,
                                        value: iswashed
                                    });
                                }
                                // if (DateTruckAgingdt) {  // removed by abdul
                                if (DateTruckRdydt) {
                                    sublist.setSublistValue({
                                        id: "custpabe_m_aging",
                                        line: lineNum,
                                        value: calculateDays(DateTruckRdydt, new Date())
                                    });
                                }
                                if (DateOnsitedt) {
                                    sublist.setSublistValue({
                                        id: "custpabe_m_donsite",
                                        line: lineNum,
                                        value: DateOnsitedt
                                    });
                                }
                                if (DateOnsitedt) {
                                    sublist.setSublistValue({
                                        id: "custpabe_m_donsite_aging",
                                        line: lineNum,
                                        value: calculateDays(DateOnsitedt, new Date())
                                    });
                                }
                                lineNum++;
                            }
                        }

                        //}
                    }
                }

                var surl = 'https://8760954.app.netsuite.com/app/site/hosting/scriptlet.nl?script=2604&deploy=1'
                form.addButton({
                    id: 'custpage_open_filtersetup',
                    label: 'Filters',
                    functionName: 'openfiltersetup(' + Userid + ')'
                });
                form.addButton({
                    id: 'custpage_clear_filters',
                    label: 'Clear Filters',
                    functionName: 'resetFilters(' + Userid + ')'
                });


                if (flagpara2) {
                    form.addSubmitButton("Select Vehicle");
                }
                form.clientScriptModulePath = "./advs_cs_inventory_available_sheet.js";
                response.writePage(form);
            } else {
                var LeaseHeader = request.parameters.custpage_old_lease_id;
                var OldVinId = request.parameters.custpage_old_vin_id;

                var NewVinAssigned = "",
                    CheckMark = "";
                var LineCount = request.getLineCount({
                    group: "custpage_sublist"
                });
                for (var L = 0; L < LineCount; L++) {
                    CheckMark = request.getSublistValue({
                        group: "custpage_sublist",
                        name: "cust_select_veh_card",
                        line: L
                    })
                    if (CheckMark == true || CheckMark == 'true' || CheckMark == 'T') {
                        NewVinAssigned = request.getSublistValue({
                            group: "custpage_sublist",
                            name: "custpabe_vinid",
                            line: L
                        });
                        break;
                    }
                }
                record.submitFields({
                    type: "customrecord_advs_lease_header",
                    id: LeaseHeader,
                    values: {
                        'custrecord_advs_la_vin_bodyfld': NewVinAssigned,
                    }
                });

                record.submitFields({
                    type: "customrecord_advs_vm",
                    id: NewVinAssigned,
                    values: {
                        'custrecord_advs_vm_reservation_status': 13,
                    }
                });
                record.submitFields({
                    type: "customrecord_advs_vm",
                    id: OldVinId,
                    values: {
                        'custrecord_advs_vm_reservation_status': 1,
                    }
                });

                var onclickScript = " <html><body> <script type='text/javascript'>" +
                    "try{" +
                    "";
                onclickScript += "window.parent.location.reload();";
                onclickScript += "window.parent.closePopup();";
                onclickScript += "}catch(e){alert(e+'   '+e.message);}</script></body></html>";

                scriptContext.response.write(onclickScript);

            }
        }
        var uniqueBucket = [];
        var bucketData = [];
        var bucketchildsIds = [];
        var mileagetofilter = 0;

        function fetchSearchResult(pagedData, pageIndex, freqId) {
            var vindiscountData = discountsetup();
            log.debug('vindiscountData', vindiscountData);
            var searchPage = pagedData.fetch({
                index: pageIndex
            });

            var vmDataResults = new Array();
            searchPage.data.forEach(function (result) {

                var vinId = result.getValue({
                    name: "internalid"
                });
                var vinText = result.getValue({
                    name: "name"
                });
                var modelId = result.getValue({
                    name: "custrecord_advs_vm_model"
                });
                var vehicleBrand = result.getValue({
                    name: "custrecord_advs_vm_vehicle_brand"
                });
                var locId = result.getValue({
                    name: "custrecord_advs_vm_location_code"
                });
                var phylocId = result.getValue({
                    name: "custrecord_advs_physical_loc_ma"
                });
                var modelYr = result.getValue({
                    name: "custrecord_advs_vm_model_year"
                });
                var bucketId = result.getValue({
                    name: "custrecord_vehicle_master_bucket"
                });
                // bucketchildsIds .push( result.getValue({ name: "custrecord_v_master_buclet_hidden" }));
                var bucketchilds = result.getValue({
                    name: "custrecord_v_master_buclet_hidden"
                });
                var stockdt = result.getValue({
                    name: "custrecord_advs_em_serial_number"
                });
                var Statusdt = result.getValue({
                    name: "custrecord_advs_vm_reservation_status"
                });
                var Mileagedt = result.getValue({
                    name: "custrecord_advs_vm_mileage"
                });
                mileagetofilter = Mileagedt;
                var Transdt = result.getValue({
                    name: "custrecord_advs_vm_transmission_type"
                });
                var Enginedt = result.getValue({
                    name: "custrecord_advs_vm_engine_serial_number"
                });
                var Customerdt = result.getValue({
                    name: "custrecord_advs_vm_customer_number"
                });
                var softHoldCustomerdt = result.getValue({
                    name: "custrecord_advs_customer"
                });
                var softHoldCus_sales_rep = result.getValue({
                    name: "salesrep",
                    join: "custrecord_advs_customer"
                });
                var softHoldstatusdt = result.getValue({
                    name: "custrecord_reservation_hold"
                });
                var salesrepdt = result.getValue({
                    name: "custrecord_advs_vm_soft_hld_sale_rep"
                });
                var extclrdt = result.getText({
                    name: "custrecord_advs_vm_exterior_color"
                });
                var DateTruckRdydt = result.getValue({
                    name: "custrecord_advs_vm_date_truck_ready"
                });
                var DateTruckLockupdt = result.getValue({
                    name: "custrecord_advs_vm_date_truck_lockedup"
                });
                var DateTruckAgingdt = result.getValue({
                    name: "custrecord_advs_vm_aging"
                });
                var DateOnsitedt = result.getValue({
                    name: "custrecord_advs_vm_date_on_site"
                });
                var invdepositLink = result.getValue({
                    name: "custrecord_deposit_count"
                });
                var deliveryBoardBalance = parseFloat(result.getValue({
                    name: "custrecord_deposit_balance"
                }));

                var InvSales = result.getValue({
                    name: "custrecord_advs_vm_soft_hld_sale_rep"
                });
                var sleepersizeval = result.getValue({
                    name: "custrecord_advs_sleeper_size_ms"
                });
                var sleepersize = result.getText({
                    name: "custrecord_advs_sleeper_size_ms"
                });
                var apuval = result.getValue({
                    name: "custrecord_advs_apu_ms_tm"
                });
                var apu = result.getText({
                    name: "custrecord_advs_apu_ms_tm"
                });
                var bedsval = result.getValue({
                    name: "custrecord_advs_beds_ms_tm"
                });
                var beds = result.getText({
                    name: "custrecord_advs_beds_ms_tm"
                });
                var titlerestrictionval = result.getValue({
                    name: "custrecord_advs_title_rest_ms_tm"
                });
                var titlerestriction = result.getText({
                    name: "custrecord_advs_title_rest_ms_tm"
                });
                var istruckready = result.getValue({
                    name: "custrecord_advs_tm_truck_ready"
                });
                var iswashed = result.getValue({
                    name: "custrecord_advs_tm_washed"
                });
                var softHoldDateStr = result.getValue({
                    name: "custrecord_advs_vm_soft_hold_date"
                });
                var vehicletype = result.getValue({
                    name: "custrecord_advs_vm_vehicle_type"
                });

                var softHoldageInDays = 0;
                if (softHoldDateStr) {
                    var softHoldDate = new Date(softHoldDateStr);
                    var currentDate = new Date();
                    var timeDiff = currentDate.getTime() - softHoldDate.getTime();
                    softHoldageInDays = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
                    softHoldageInDays = softHoldageInDays * 1;
                    softHoldageInDays = softHoldageInDays + 1;
                }

                var deliveryboard = result.getValue({
                    name: "custrecord_advs_lease_inventory_delboard"
                });

                var singlebunk = result.getValue({
                    name: "custrecord_advs_single_bunk"
                });
                var Transport = result.getValue({
                    name: "custrecord_advs_transport_"
                });
                var Inspected = result.getValue({
                    name: "custrecord_advs_inspected"
                });
                var ApprRepDate = result.getValue({
                    name: "custrecord_advs_approved_repair"
                });
                var Picture1 = result.getValue({
                    name: "custrecord_advs_picture_1"
                });

                var admin_notes = result.getValue({
                    name: "custrecord_advs_admin_notes"
                });
                var body_style = result.getValue({
                    name: "custrecord_advs_vm_body_style"
                });
                var eta_ready = result.getValue({
                    name: "custrecord_advs_vm_eta"
                });
                var notesms = result.getValue({
                    name: "custrecord_advs_notes_ms_tm"
                });
                var aging_contr = result.getValue({
                    name: "custrecord_advs_aging_contract"
                });
                var isOldVehicle = result.getValue({
                    name: "custrecord_is_old_vehicle"
                });
                var isDiscounttoApply = result.getValue({
                    name: "custrecord_is_discount_applied"
                });
                //SOFTHOLD FIELDS
                var sh_depo_inception = result.getValue({
                    name: "custrecord_advs_deposit_inception"
                });
                var sh_net_depo_inception = result.getValue({
                    name: "custrecord_advs_net_dep_tm"
                });
                var sh_net_payment_inc = result.getValue({
                    name: "custrecord_advs_net_paym_tm"
                });
                var sh_payment_inc = result.getValue({
                    name: "custrecord_advs_payment_inception"
                });
                /* log.debug("total incep", result.getValue({
          name: "custrecord_advs_total_inception"
        })) */
                var sh_total_inc = result.getValue({
                    name: "custrecord_advs_total_inception"
                }) || 0;
                var sh_terms = result.getValue({
                    name: "custrecord_advs_buck_terms1"
                });
                var sh_payterm1 = result.getValue({
                    name: "custrecord_advs_payment_2_131"
                });
                var sh_payterm2 = result.getValue({
                    name: "custrecord_advs_payment_14_25"
                });
                var sh_payterm3 = result.getValue({
                    name: "custrecord_advs_payment_26_37"
                });
                var sh_payterm4 = result.getValue({
                    name: "custrecord_advs_payment_38_49"
                });
                var sh_purchase_option = result.getValue({
                    name: "custrecord_advs_pur_option"
                });
                var sh_contract_total = result.getValue({
                    name: "custrecord_advs_contract_total"
                });
                var sh_reg_fee = result.getValue({
                    name: "custrecord_advs_registration_fees_bucket"
                });
                var sh_grandtotal = result.getValue({
                    name: "custrecord_advs_grand_total_inception"
                });

                var sh_depo_inception1 = result.getValue({
                    name: "custrecord_advs_deposit_inception1"
                });
                var sh_payment_inc1 = result.getValue({
                    name: "custrecord_advs_payment_inception_1"
                });
                /* log.debug("total incep", result.getValue({
          name: "custrecord_advs_payment_inception_1"
        })) */
                var sh_total_inc1 = result.getValue({
                    name: "custrecord_advs_total_inception1"
                }) || 0;
                var sh_terms1 = result.getValue({
                    name: "custrecord_advs_buck_terms1_1"
                });
                var sh_payterm1_1 = result.getValue({
                    name: "custrecord_advs_payment_2_131_1"
                });
                var sh_payterm2_1 = result.getValue({
                    name: "custrecord_advs_payment_14_25_1"
                });
                var sh_payterm3_1 = result.getValue({
                    name: "custrecord_advs_payment_26_37_1"
                });
                var sh_payterm4_1 = result.getValue({
                    name: "custrecord_advs_payment_38_49_1"
                });
                var sh_purchase_option1 = result.getValue({
                    name: "custrecord_advs_pur_option_1"
                });
                var sh_contract_total1 = result.getValue({
                    name: "custrecord_advs_contract_total_1"
                });
                var sh_reg_fee1 = result.getValue({
                    name: "custrecord_advs_registration_fe_bucket_1"
                });
                var sh_grandtotal_1 = result.getValue({
                    name: "custrecord_advs_grand_total_inception_1"
                });
                var sh_bucket1 = result.getValue({
                    name: "custrecord_advs_bucket_1"
                });
                var sh_bucket2 = result.getValue({
                    name: "custrecord_advs_bucket_2"
                });
                var cabconfig = result.getValue({
                    name: "custrecord_advs_cab_config1"
                });
                var dayssinceready = result.getValue({
                    name: "custrecord_advs_aging_days_ready"
                });




                // log.debug("Mileagedt", Mileagedt)
                var obj = {};
                obj.id = vinId;
                obj.vinName = vinText;
                obj.modelid = modelId;
                obj.brand = vehicleBrand;
                obj.locid = locId;
                obj.phylocId = phylocId;
                obj.modelyr = modelYr;
                obj.bucketId = bucketId;
                obj.stockdt = stockdt;
                obj.Statusdt = Statusdt;
                obj.Mileagedt = Mileagedt;
                obj.Transdt = Transdt;
                obj.Enginedt = Enginedt;
                obj.Customerdt = Customerdt;
                obj.softHoldCustomerdt = softHoldCustomerdt;
                obj.softHoldCus_sales_rep = softHoldCus_sales_rep;
                obj.salesrepdt = salesrepdt;
                obj.softHoldstatusdt = softHoldstatusdt;
                obj.softholdageindays = softHoldageInDays;
                obj.extclrdt = extclrdt;
                obj.DateTruckRdydt = DateTruckRdydt;
                obj.DateTruckLockupdt = DateTruckLockupdt;
                obj.DateTruckAgingdt = DateTruckAgingdt;
                obj.DateOnsitedt = DateOnsitedt;
                obj.invdepositLink = invdepositLink;
                obj.InvSales = InvSales;
                obj.deliveryBoardBalance = deliveryBoardBalance;
                obj.deliveryboard = deliveryboard;

                obj.sleepersize = sleepersize;
                obj.apu = apu;
                obj.beds = beds;
                obj.titlerestriction = titlerestriction;
                obj.istruckready = istruckready;
                obj.iswashed = iswashed;

                obj.singlebunk = singlebunk;
                obj.Transport = Transport;
                obj.Inspected = Inspected;
                obj.ApprRepDate = ApprRepDate;
                obj.Picture1 = Picture1;
                obj.admin_notes = admin_notes;
                obj.body_style = body_style;
                obj.eta_ready = eta_ready;
                obj.notesms = notesms;
                obj.aging_contr = aging_contr;
                obj.isOldVehicle = isOldVehicle;
                obj.isDiscounttoApply = isDiscounttoApply;
                obj.bucketchildsIds = bucketchildsIds;
                obj.bucketchilds = bucketchilds;


                //SOFTHOLD FIELD OBJ
                obj.sh_depo_inception = sh_net_depo_inception || sh_depo_inception;
                obj.sh_payment_inc = sh_net_payment_inc || sh_payment_inc;
                obj.sh_total_inc = sh_total_inc;
                obj.sh_terms = sh_terms;
                obj.sh_payterm1 = sh_payterm1;
                obj.sh_payterm2 = sh_payterm2;
                obj.sh_payterm3 = sh_payterm3;
                obj.sh_payterm4 = sh_payterm4;
                obj.sh_purchase_option = sh_purchase_option;
                obj.sh_contract_total = sh_contract_total;
                obj.sh_reg_fee = sh_reg_fee;
                obj.sh_grandtotal = sh_grandtotal;

                obj.sh_depo_inception1 = sh_depo_inception1;
                obj.sh_payment_inc1 = sh_payment_inc1;
                obj.sh_total_inc1 = sh_total_inc1;
                obj.sh_terms1 = sh_terms1;
                obj.sh_payterm1_1 = sh_payterm1_1;
                obj.sh_payterm2_1 = sh_payterm2_1;
                obj.sh_payterm3_1 = sh_payterm3_1;
                obj.sh_payterm4_1 = sh_payterm4_1;
                obj.sh_purchase_option1 = sh_purchase_option1;
                obj.sh_contract_total1 = sh_contract_total1;
                obj.sh_reg_fee1 = sh_reg_fee1;
                obj.sh_grandtotal_1 = sh_grandtotal_1;
                obj.sh_bucket1 = sh_bucket1;
                obj.sh_bucket2 = sh_bucket2;
                obj.cabconfig = cabconfig;
                obj.dayssinceready = dayssinceready;




                if (bucketId) {
                    if (uniqueBucket.indexOf(bucketId) == -1) {
                        uniqueBucket.push(bucketId);
                    }
                }
                if (bucketchilds) {
                    var bucketchilds1 = bucketchilds.split(',');
                    for (var io = 0; io < bucketchilds1.length; io++) {
                        if (bucketchildsIds.indexOf(bucketchilds1[io]) == -1) {
                            bucketchildsIds.push(bucketchilds1[io]);
                        }
                    }

                }
                //vindiscountData
                /*1)	Model year = 2019 & Cab Config is 125.   Discount $300
			 2)	Model year = 2019 to 2020 & days since ready >75 days.  Discount is $500
			3)	Model = M2 & Location is Florida. Discount is $200.
			4)	Model = M2 & Location is Texas.  Discount is $100.
			5)	Mileage > 850,000 and Cab Config is 125 and year is 2018.  Discount is $400 */
                obj.incepdiscount = 0;
                for (var vd = 0; vd < vindiscountData.length; vd++) {

                    if (modelYr == vindiscountData[vd].year && cabconfig == vindiscountData[vd].cabconfig && vindiscountData[vd].model == '' && vindiscountData[vd].mileage == '' && vindiscountData[vd].dayssinceready == '' && vindiscountData[vd].location == '') {
                        // log.debug('case1')
                        obj.incepdiscount = vindiscountData[vd].amount;
                        break;
                    } else if (modelYr == vindiscountData[vd].year && dayssinceready > vindiscountData[vd].dayssinceready && vindiscountData[vd].model == '' && vindiscountData[vd].mileage == '' && vindiscountData[vd].cabconfig == '' && vindiscountData[vd].location == '') {
                        // log.debug('case2')
                        obj.incepdiscount = vindiscountData[vd].amount;
                        break;
                    } else if (modelId == vindiscountData[vd].model && locId == vindiscountData[vd].location && vindiscountData[vd].dayssinceready == '' && vindiscountData[vd].mileage == '' && vindiscountData[vd].cabconfig == '' && vindiscountData[vd].year == '') {
                        //log.debug('case3')
                        obj.incepdiscount = vindiscountData[vd].amount;
                        break;
                    } else if (Mileagedt == vindiscountData[vd].mileage && modelYr == vindiscountData[vd].year && cabconfig == vindiscountData[vd].cabconfig && vindiscountData[vd].dayssinceready == '' && vindiscountData[vd].model == '' && vindiscountData[vd].cabconfig == '' && vindiscountData[vd].location == '') {
                        //log.debug('case4')
                        obj.incepdiscount = vindiscountData[vd].amount;
                        break;
                    }
                }
                //log.debug('obj.incepdiscount',obj.incepdiscount);
                if (true) { //bucketId

                    // var discount = getGlobalDiscounts(
                    //   vehicleBrand, modelYr, vehicletype, titlerestrictionval,
                    //   sleepersizeval, bedsval, apuval, '', Transdt, singlebunk) //color
                    // obj.incepdiscount = discount;
                    // log.debug('discount', discount);
                    // var _discount = search.lookupFields({type:'customrecord_ez_bucket_calculation',id:bucketId,columns:['custrecord_discount']});
                    /*  var _discountreclink = search.lookupFields({type:'customrecord_bucket_calculation_location',id:bucketchildsIds[0],columns:['custrecord_bucket_discount']});
                      if(_discountreclink.custrecord_bucket_discount && _discountreclink.custrecord_bucket_discount.length)
                      {
                        var _discount = search.lookupFields({type:'customrecord_advs_disc_crit_list',id:_discountreclink.custrecord_bucket_discount[0].value,columns:['custrecord_advs_make','custrecord_truck_type','custrecord_discount_amount']});
                       log.debug('_discount',_discount);
                       log.debug('brand'+vehicleBrand,'vehicletype'+vehicletype);
                       if(_discount.custrecord_advs_make.length && _discount.custrecord_advs_make[0].value == vehicleBrand){
                             _discount.custrecord_discount_amount||0;
                            obj.incepdiscount =_discount.custrecord_discount_amount||0;
                       }else if(_discount.custrecord_truck_type.length && _discount.custrecord_truck_type[0].value == vehicletype)
                       {
                            _discount.custrecord_discount_amount||0;
                            obj.incepdiscount =_discount.custrecord_discount_amount||0;
                       }
                    } */
                }
                vmDataResults.push(obj);
            });
            //log.debug('bucketchildsIds',bucketchildsIds);
            if (uniqueBucket.length > 0) {

                var bucketCalcSearchFilters = [
                    ["isinactive", "is", "F"],
                    "AND",
                    ["custrecord_bucket_calc_parent_link", "anyof", uniqueBucket]
                ];
                if (freqId) {
                    bucketCalcSearchFilters.push("AND");
                    bucketCalcSearchFilters.push(["custrecord_advs_b_c_chld_freq", "anyof", freqId]);
                }
                if (bucketchildsIds.length) {
                    bucketCalcSearchFilters.push("AND");
                    bucketCalcSearchFilters.push(["internalid", "anyof", bucketchildsIds]);
                }
                //log.debug('bucketCalcSearchFilters',bucketCalcSearchFilters);
                /* if (mileagetofilter) {
            bucketCalcSearchFilters.push("AND");
            bucketCalcSearchFilters.push([
                "formulanumeric",
                "CASE WHEN {custrecord_bucket_calc_parent_link.custrecord_advs_min_range_buck} < " + mileagetofilter +
                " AND " + mileagetofilter + " < {custrecord_bucket_calc_parent_link.custrecord_advs_max_range_buck} THEN 1 ELSE 0 END",
                "equalto",
                "1"
            ]);
         }*/

                var bucketCalcSearch = search.create({
                    type: "customrecord_bucket_calculation_location",
                    filters: bucketCalcSearchFilters,
                    columns: [
                        search.createColumn({
                            name: "name",
                            sort: search.Sort.ASC,
                            label: "Name"
                        }),
                        search.createColumn({
                            name: "internalid",
                            label: "ID"
                        }),
                        search.createColumn({
                            name: "custrecord_advs_b_c_c_model",
                            label: "Model"
                        }),
                        search.createColumn({
                            name: "custrecord_bucket_calc_parent_link",
                            label: "Parent Link"
                        }),
                        search.createColumn({
                            name: "custrecord_advs_b_c_c_dep_inception",
                            label: "Deposit Inception"
                        }),
                        search.createColumn({
                            name: "custrecord_advs_b_c_c_pay_incep",
                            label: "Payment Inception"
                        }),
                        search.createColumn({
                            name: "custrecord_advs_b_c_c_ttl_incep",
                            label: "Total Inception"
                        }),
                        search.createColumn({
                            name: "custrecord_advs_b_c_c_terms",
                            label: "Terms"
                        }),
                        search.createColumn({
                            name: "custrecord_advs_b_c_c_pay_2_13",
                            label: "Payments 2-13"
                        }),
                        search.createColumn({
                            name: "custrecord_advs_b_c_c_pay_14",
                            label: "Payments 14-25"
                        }),
                        search.createColumn({
                            name: "custrecord_advs_b_c_c_26_37",
                            label: "Payments 26_37"
                        }),
                        search.createColumn({
                            name: "custrecord_advs_b_c_c_pay_38_49",
                            label: "Payments 38_49"
                        }),
                        search.createColumn({
                            name: "custrecord_advs_b_c_c_pur_option",
                            label: "Purchase Option"
                        }),
                        search.createColumn({
                            name: "custrecord_advs_b_c_chld_freq",
                            label: "Frequency"
                        }),
                        search.createColumn({
                            name: "custrecord_advs_buc_chld_sales_channel",
                            label: "Sales channel"
                        }),
                        search.createColumn({
                            name: "custrecord_advs_b_c_c_cont_tot",
                            label: "Sales channel"
                        }),
                        search.createColumn({
                            name: "custrecord_bucket_discount",
                            label: "Bucket Discount"
                        })

                    ]
                });

                bucketCalcSearch.run().each(function (result) {
                    var bucketId = result.getValue({
                        name: "custrecord_bucket_calc_parent_link"
                    });
                    var buckidCh = result.getValue({
                        name: "internalid"
                    });
                    var depositIncep = result.getValue({
                        name: "custrecord_advs_b_c_c_dep_inception"
                    });
                    //MODIFY HERE DEPOSIT INCEPTION WITH DISCOUNT
                    var payIncep = result.getValue({
                        name: "custrecord_advs_b_c_c_pay_incep"
                    });
                    var ttlIncep = result.getValue({
                        name: "custrecord_advs_b_c_c_ttl_incep"
                    });
                    var terms = result.getValue({
                        name: "custrecord_advs_b_c_c_terms"
                    })
                    var Sch_2_13 = result.getValue({
                        name: "custrecord_advs_b_c_c_pay_2_13"
                    }) * 1;
                    var Sch_14_26 = result.getValue({
                        name: "custrecord_advs_b_c_c_pay_14"
                    }) * 1;
                    var Sch_26_37 = result.getValue({
                        name: "custrecord_advs_b_c_c_26_37"
                    }) * 1;
                    var Sch_38_49 = result.getValue({
                        name: "custrecord_advs_b_c_c_pay_38_49"
                    }) * 1;
                    var purOption = result.getValue({
                        name: "custrecord_advs_b_c_c_pur_option"
                    }) * 1;
                    var contTot = result.getValue({
                        name: "custrecord_advs_b_c_c_cont_tot"
                    }) * 1;
                    var FREQ = result.getValue({
                        name: "custrecord_advs_b_c_chld_freq"
                    });
                    var saleCh = result.getValue({
                        name: "custrecord_advs_buc_chld_sales_channel"
                    });
                    var bucketDiscountLink = result.getValue({
                        name: "custrecord_bucket_discount"
                    });
                    var discountval = 0;
                    if (bucketId) {
                        /* 	var _discount = search.lookupFields({type:'customrecord_ez_bucket_calculation',id:bucketId,columns:['custrecord_discount']});
                _discount.custrecord_discount||0;
                discountval =_discount.custrecord_discount||0; */
                    }
                    var index = 0;
                    /*   if (bucketData[bucketId] != null && bucketData[bucketId] != undefined) {
                index = bucketData[bucketId].length;
            } else {
                bucketData[bucketId] = new Array();
            } */
                    /* bucketData[bucketId][index] = new Array();
          bucketData[bucketId][index]["id"] = buckidCh;
          bucketData[bucketId][index]["DEPINSP"] = depositIncep;
          bucketData[bucketId][index]["PAYINSP"] = payIncep;
          bucketData[bucketId][index]["TTLINSP"] = ttlIncep;
          bucketData[bucketId][index]["TRMS"] = terms;
          bucketData[bucketId][index]["2_13"] = Sch_2_13;
          bucketData[bucketId][index]["14_26"] = Sch_14_26;
          bucketData[bucketId][index]["26_37"] = Sch_26_37;
          bucketData[bucketId][index]["26_37"] = Sch_26_37;
          bucketData[bucketId][index]["38_49"] = Sch_38_49;
          bucketData[bucketId][index]["purOptn"] = purOption;
          bucketData[bucketId][index]["conttot"] = contTot;
          bucketData[bucketId][index]["freq"] = FREQ;
          bucketData[bucketId][index]["saleCh"] = saleCh; */
                    //					log.debug('bucketData',bucketData);
                    if (bucketData[buckidCh] != null && bucketData[buckidCh] != undefined) {
                        index = bucketData[buckidCh].length;
                    } else {
                        bucketData[buckidCh] = new Array();
                    }
                    bucketData[buckidCh][index] = new Array();
                    bucketData[buckidCh][index]["id"] = buckidCh;
                    bucketData[buckidCh][index]["DEPINSP"] = depositIncep; //(depositIncep -discountval);
                    bucketData[buckidCh][index]["PAYINSP"] = payIncep;
                    bucketData[buckidCh][index]["TTLINSP"] = ttlIncep; //(ttlIncep-discountval);
                    bucketData[buckidCh][index]["TRMS"] = terms;
                    bucketData[buckidCh][index]["2_13"] = Sch_2_13;
                    bucketData[buckidCh][index]["14_26"] = Sch_14_26;
                    bucketData[buckidCh][index]["26_37"] = Sch_26_37;
                    bucketData[buckidCh][index]["26_37"] = Sch_26_37;
                    bucketData[buckidCh][index]["38_49"] = Sch_38_49;
                    bucketData[buckidCh][index]["purOptn"] = purOption;
                    bucketData[buckidCh][index]["conttot"] = contTot;
                    bucketData[buckidCh][index]["freq"] = FREQ;
                    bucketData[buckidCh][index]["saleCh"] = saleCh;
                    //					log.debug('bucketData',bucketData);
                    return true;
                });
            }

            return vmDataResults;
        }

        function getGlobalDiscounts(make, year, type, title, size, beds, apu, color, transmtype, singlebunk) {
            try {


                var _filters = [];

                if (make != '' && year != '' && type != '') {
                    _filters.push(

                        [
                            ["custrecord_advs_make", "anyof", make],
                            "AND",
                            ["custrecord_advs_model_year", "anyof", year],
                            "AND",
                            ["custrecord_truck_type", "anyof", type]
                        ]


                    )

                }

                if (make != '' && year != '') {
                    _filters.push("OR");
                    _filters.push(
                        [
                            /* ["custrecord_truck_type", "anyof", '@NONE@'],
              "AND", */
                            ["custrecord_advs_make", "anyof", make],
                            "AND",
                            ["custrecord_advs_model_year", "anyof", year]
                        ]
                    )
                }

                if (make != '' && type != '') {
                    _filters.push("OR");
                    _filters.push(
                        [
                            ["custrecord_advs_make", "anyof", make],
                            "AND",
                            ["custrecord_truck_type", "anyof", type],
                            /* "AND",
              ["custrecord_advs_model_year", "anyof", '@NONE@'] */
                        ]
                    )

                }
                if (year != '' && type != '') {

                    _filters.push("OR");
                    _filters.push(
                        [
                            /* ["custrecord_advs_make", "anyof", '@NONE@'],
                  "AND", */
                            ["custrecord_advs_model_year", "anyof", year],
                            "AND",
                            ["custrecord_truck_type", "anyof", type]
                        ]
                    )
                }

                if (make) {
                    _filters.push("OR");
                    _filters.push(
                        [
                            ["custrecord_advs_make", "anyof", make],
                            "AND",
                            ["custrecord_truck_type", "anyof", '@NONE@'],
                            "AND",
                            ["custrecord_advs_model_year", "anyof", '@NONE@']
                        ]
                    )
                }
                if (year) {
                    _filters.push("OR");
                    _filters.push(
                        [
                            ["custrecord_advs_make", "anyof", '@NONE@'],
                            "AND",
                            ["custrecord_truck_type", "anyof", '@NONE@'],
                            "AND",
                            ["custrecord_advs_model_year", "anyof", year]
                        ]
                    )
                }
                if (type) {
                    _filters.push("OR");
                    _filters.push(
                        [
                            ["custrecord_advs_make", "anyof", '@NONE@'],
                            "AND",
                            ["custrecord_truck_type", "anyof", type],
                            "AND",
                            ["custrecord_advs_model_year", "anyof", '@NONE@']
                        ]
                    )
                }
                /*  if(title)
                {
                    _filters.push("OR");
                    _filters.push(["custrecord_advs_tit_res", "anyof", title])
                }
                 if(size)
                {
                    _filters.push("OR");
                    _filters.push(["custrecord_advs_sleeper_size", "anyof", size])
                }
                 if(beds)
                {
                    _filters.push("OR");
                    _filters.push(["custrecord_advs_beds", "anyof", beds])
                }
                 if(apu)
                {
                    _filters.push("OR");
                    _filters.push(["custrecord_advs_apu", "anyof", apu])
                }
                 if(color)
                {
                    _filters.push("OR");
                    _filters.push(["custrecord_advs_vm_exterior_color1", "anyof", color])

                }  */
                /* if(color)
                {
                    _filters.push("OR");
                    _filters.push(["custrecord_advs_vm_exterior_color1", "is", color])

                } if(color)
                {
                    _filters.push("OR");
                    _filters.push(["custrecord_advs_vm_exterior_color1", "is", color])

                } */
                //log.debug('_filters', _filters);
                var customrecord_advs_disc_crit_listSearchObj = search.create({
                    type: "customrecord_advs_disc_crit_list",
                    filters: _filters,
                    columns: [
                        "custrecord_advs_make",
                        "custrecord_advs_model_year",
                        "custrecord_truck_type",
                        "custrecord_advs_tit_res",
                        "custrecord_advs_sleeper_size",
                        "custrecord_advs_beds",
                        "custrecord_advs_apu",
                        "custrecord_discount_amount"
                    ]
                });
                var searchResultCount = customrecord_advs_disc_crit_listSearchObj.runPaged().count;
                //log.debug("customrecord_advs_disc_crit_listSearchObj result count", searchResultCount);
                var discountamount = 0;
                customrecord_advs_disc_crit_listSearchObj.run().each(function (result) {
                    // .run().each has a limit of 4,000 results
                    discountamount = result.getValue({
                        name: 'custrecord_discount_amount'
                    });
                    //log.debug('discountamount', discountamount);
                    return true;
                });

                return discountamount;
            } catch (e) {
                log.debug('error', e.toString());
            }
        }


        function InventorySearch(brandId, modelId, locatId, salesrepId, depofilterId, bucketId,
                                 freqId, bucketChild, vinID, _vinText, _statushold, LeaseHeaderId, iFrameCenter, flagpara2,
                                 Old_Vin_From_lease, ttlrest, washed, singlebunk, invterms, invapu, invbed, sfcustomer, bodystyle, invtransm, invyear, invcolor, invtruckready, invengine, invsssize, invstock,
                                 brandFldObj, modelFldObj, locFldObj, salesrepfld, depositFld,
                                 bucketFldObj, freqFldObj, vinFldObj, vinfreeformFldObj, LeaseFieldObj,
                                 IframeCenterFieldObj, Flagpara2FieldObj, OldVinFieldObj, status, color, transmission,
                                 salesrep, mileage, statusFldObj, colorFldObj, transmissionFldObj, salesrepFldObj, mileageFldObj,
                                 bucketChildFldObj, statusHoldFldObj, UserSubsidiary, invStockFldObj, invColorFldObj, invYearFldObj, invEngineFldObj, invTransmissionFldObj, invTitleRestFldObj,
                                 invBodyStyleFldObj, invTruckReadyFldObj, invWashedFldObj, invSingleBunkFldObj, invTermsFldObj,
                                 invsssizeFldObj, invApuFldObj, invBedsFldObj, invshCustomerFldObj, invStockFldObj,plocFldObj,plocatId) {
            // log.debug('status',status);
            var vmSearchObj = search.create({
                type: "customrecord_advs_vm",
                filters: [
                    ["isinactive", "is", "F"],
                    "AND",
                    ["custrecord_advs_vm_reservation_status", "anyof", "15", "19", "20", "21", "22", "23", "24", "48"],
                    /*  "AND",
          ["custrecord_vehicle_master_bucket", "noneof", "@NONE@"], */ //TO SHOW ALL VINS EVEN IF BUCKET NOT ASSOCIATED
                    "AND",
                    ["custrecord_advs_vm_subsidary", "anyof", UserSubsidiary]
                ],
                columns: [
                    search.createColumn({
                        name: "internalid"
                    }),
                    search.createColumn({
                        name: "name",
                        sort: search.Sort.ASC,
                        label: "Name"
                    }),
                    search.createColumn({
                        name: "custrecord_advs_vm_model",
                        label: "Model"
                    }),
                    search.createColumn({
                        name: "custrecord_advs_vm_vehicle_brand",
                        label: "Make"
                    }),
                    search.createColumn({
                        name: "custrecord_advs_vm_location_code",
                        label: "Location"
                    }),
                    search.createColumn({
                        name: "custrecord_advs_vm_transmission_type",
                        label: "Transmission Type"
                    }),
                    search.createColumn({
                        name: "custrecord_advs_vm_model_year",
                        label: "Year of Manufacturing"
                    }),
                    search.createColumn({
                        name: "custrecord_vehicle_master_bucket",
                        label: "Year of Manufacturing"
                    }),
                    search.createColumn({
                        name: "custrecord_advs_em_serial_number",
                        label: "Truck Unit"
                    }),
                    search.createColumn({
                        name: "custrecord_advs_vm_reservation_status",
                        label: "RESERVATION STATUS"
                    }),
                    search.createColumn({
                        name: "custrecord_advs_vm_mileage",
                        label: "HMR"
                    }),
                    search.createColumn({
                        name: "custrecord_advs_vm_engine_serial_number",
                        label: "Engine Serial Number"
                    }),
                    search.createColumn({
                        name: "custrecord_advs_vm_customer_number",
                        label: "Customer"
                    }),
                    search.createColumn({
                        name: "custrecord_advs_customer",
                        label: "CUSTOMER SOFTHOLD"
                    }),
                    search.createColumn({
                        name: "salesrep",
                        join: "custrecord_advs_customer",
                        label: "SALES REP",
                    }),
                    search.createColumn({
                        name: "custrecord_reservation_hold",
                        label: "SOFTHOLD STATUS"
                    }),
                    search.createColumn({
                        name: "custrecord_advs_vm_soft_hld_sale_rep",
                        label: "SOFT HOLD SALESREP"
                    }),
                    search.createColumn({
                        name: "custrecord_advs_vm_exterior_color",
                        label: "Exterior Color"
                    }),
                    search.createColumn({
                        name: "custrecord_advs_vm_date_truck_ready",
                        label: "Date Truck Ready"
                    }),
                    search.createColumn({
                        name: "custrecord_advs_vm_date_truck_lockedup",
                        label: "Date Truck Locked up"
                    }),
                    search.createColumn({
                        name: "custrecord_advs_vm_aging",
                        label: "Aging"
                    }),
                    search.createColumn({
                        name: "custrecord_advs_vm_date_on_site",
                        label: "Date On Site"
                    }),
                    search.createColumn({
                        name: "custrecord_advs_vm_soft_hold_date",
                        label: "Soft Hold"
                    }),
                    /*search.createColumn({  name: "custrecord_advs_in_dep_trans_link", join: "CUSTRECORD_ADVS_IN_DEP_VIN",  label: "Deposit Link" }),
           search.createColumn({  name: "custrecord_advs_in_dep_balance", join: "CUSTRECORD_ADVS_IN_DEP_VIN", label: "Deposit Balance" }),
           search.createColumn({ name: "custrecord_advs_in_dep_sales_rep", join: "CUSTRECORD_ADVS_IN_DEP_VIN", label: "Sales Rep"  }),*/
                    search.createColumn({
                        name: "custrecord_advs_sleeper_size_ms"
                    }),
                    search.createColumn({
                        name: "custrecord_advs_apu_ms_tm"
                    }),
                    search.createColumn({
                        name: "custrecord_advs_beds_ms_tm"
                    }),
                    search.createColumn({
                        name: "custrecord_advs_title_rest_ms_tm"
                    }),
                    search.createColumn({
                        name: "custrecord_advs_lease_inventory_delboard"
                    }),
                    search.createColumn({
                        name: "custrecord_deposit_count"
                    }),
                    search.createColumn({
                        name: "custrecord_deposit_balance"
                    }),
                    search.createColumn({
                        name: "custrecord_advs_tm_truck_ready"
                    }),
                    search.createColumn({
                        name: "custrecord_advs_tm_washed"
                    }),
                    search.createColumn({
                        name: "custrecord_advs_single_bunk"
                    }),
                    search.createColumn({
                        name: "custrecord_advs_transport_"
                    }),
                    search.createColumn({
                        name: "custrecord_advs_inspected"
                    }),
                    search.createColumn({
                        name: "custrecord_advs_approved_repair"
                    }),
                    search.createColumn({
                        name: "custrecord_advs_picture_1"
                    }),
                    search.createColumn({
                        name: "custrecord_advs_admin_notes"
                    }),
                    search.createColumn({
                        name: "custrecord_advs_vm_body_style"
                    }),
                    search.createColumn({
                        name: "custrecord_advs_vm_eta"
                    }),
                    search.createColumn({
                        name: "custrecord_advs_notes_ms_tm"
                    }),
                    search.createColumn({
                        name: "custrecord_advs_aging_contract"
                    }),
                    search.createColumn({
                        name: "custrecord_is_old_vehicle"
                    }),
                    search.createColumn({
                        name: "custrecord_is_discount_applied"
                    }),
                    search.createColumn({
                        name: "custrecord_v_master_buclet_hidden"
                    }),
                    search.createColumn({
                        name: "custrecord_advs_vm_vehicle_type"
                    }),
                    //FROM HERE SOFTHOLD FIELDS
                    search.createColumn({
                        name: "custrecord_advs_deposit_inception"
                    }),
                    search.createColumn({
                        name: "custrecord_advs_deposit_discount"
                    }),
                    search.createColumn({
                        name: "custrecord_advs_net_dep_tm"
                    }),
                    search.createColumn({
                        name: "custrecord_advs_payment_inception"
                    }),
                    search.createColumn({
                        name: "custrecord_advs_net_paym_tm"
                    }),
                    search.createColumn({
                        name: "custrecord_advs_total_inception"
                    }),
                    search.createColumn({
                        name: "custrecord_advs_buck_terms1"
                    }),
                    search.createColumn({
                        name: "custrecord_advs_payment_2_131"
                    }),
                    search.createColumn({
                        name: "custrecord_advs_payment_14_25"
                    }),
                    search.createColumn({
                        name: "custrecord_advs_payment_26_37"
                    }),
                    search.createColumn({
                        name: "custrecord_advs_payment_38_49"
                    }),
                    search.createColumn({
                        name: "custrecord_advs_pur_option"
                    }),
                    search.createColumn({
                        name: "custrecord_advs_contract_total"
                    }),
                    search.createColumn({
                        name: "custrecord_advs_registration_fees_bucket"
                    }),
                    search.createColumn({
                        name: "custrecord_advs_grand_total_inception"
                    }),

                    search.createColumn({
                        name: "custrecord_advs_deposit_inception1"
                    }),
                    search.createColumn({
                        name: "custrecord_advs_deposit_discount1"
                    }),
                    search.createColumn({
                        name: "custrecord_advs_payment_inception_1"
                    }),
                    search.createColumn({
                        name: "custrecord_advs_total_inception1"
                    }),
                    search.createColumn({
                        name: "custrecord_advs_buck_terms1_1"
                    }),
                    search.createColumn({
                        name: "custrecord_advs_payment_2_131_1"
                    }),
                    search.createColumn({
                        name: "custrecord_advs_payment_14_25_1"
                    }),
                    search.createColumn({
                        name: "custrecord_advs_payment_26_37_1"
                    }),
                    search.createColumn({
                        name: "custrecord_advs_payment_38_49_1"
                    }),
                    search.createColumn({
                        name: "custrecord_advs_pur_option_1"
                    }),
                    search.createColumn({
                        name: "custrecord_advs_contract_total_1"
                    }),
                    search.createColumn({
                        name: "custrecord_advs_registration_fe_bucket_1"
                    }),
                    search.createColumn({
                        name: "custrecord_advs_grand_total_inception_1"
                    }),
                    search.createColumn({
                        name: "custrecord_advs_bucket_1"
                    }),
                    search.createColumn({
                        name: "custrecord_advs_bucket_2"
                    }),
                    search.createColumn({
                        name: "custrecord_advs_cab_config1"
                    }),
                    search.createColumn({
                        name: "custrecord_advs_aging_days_ready"
                    }),
                    search.createColumn({
                        name: "custrecord_advs_physical_loc_ma"
                    })

                ]
            });

            if (brandId) {
                vmSearchObj.filters.push(search.createFilter({
                    name: "custrecord_advs_vm_vehicle_brand",
                    operator: search.Operator.ANYOF,
                    values: brandId
                }))
                brandFldObj.defaultValue = brandId;
            }
            if (modelId) {
                vmSearchObj.filters.push(search.createFilter({
                    name: "custrecord_advs_vm_model",
                    operator: search.Operator.ANYOF,
                    values: modelId
                }))
                modelFldObj.defaultValue = modelId;
            }
            if (locatId) {
                vmSearchObj.filters.push(search.createFilter({
                    name: "custrecord_advs_vm_location_code",
                    operator: search.Operator.ANYOF,
                    values: locatId
                }))
                locFldObj.defaultValue = locatId;
            }
            if (plocatId) {
                vmSearchObj.filters.push(search.createFilter({
                    name: "custrecord_advs_physical_loc_ma",
                    operator: search.Operator.ANYOF,
                    values: plocatId
                }))
                plocFldObj.defaultValue = plocatId;
            }
            if (salesrepId) {
                vmSearchObj.filters.push(search.createFilter({
                    name: "custrecord_advs_vm_soft_hld_sale_rep",
                    operator: search.Operator.IS,
                    values: salesrepId
                }))
                salesrepfld.defaultValue = salesrepId;
            }
            if (depofilterId) {
                var deliverybaords = false;
                if (depofilterId == 1) {
                    deliverybaords = true
                } else if (depofilterId == 2) {
                    deliverybaords = false
                }
                vmSearchObj.filters.push(search.createFilter({
                    name: "custrecord_advs_lease_inventory_delboard",
                    operator: search.Operator.IS,
                    values: deliverybaords
                }))
                depositFld.defaultValue = depofilterId;
            }
            if (bucketId) {
                vmSearchObj.filters.push(search.createFilter({
                    name: "custrecord_vehicle_master_bucket",
                    operator: search.Operator.ANYOF,
                    values: bucketId
                }))
                bucketFldObj.defaultValue = bucketId;
            }
            if (bucketChild) {
                vmSearchObj.filters.push(search.createFilter({
                    name: "custrecord_v_master_buclet_hidden",
                    operator: search.Operator.ANYOF,
                    values: bucketChild
                }))
                bucketChildFldObj.defaultValue = bucketChild;
            }
            if (freqId) {
                //vmSearchObj.filters.push(search.createFilter({name:"customrecord_bucket_calculation_location.custrecord_advs_b_c_chld_freq",operator:search.Operator.ANYOF,values:freqId}))
                freqFldObj.defaultValue = freqId;
            }
            //status ,color ,transmission,salesrep,mileage
            if (vinID != '') {
                // log.debug('vinID filters', vinID);
                vmSearchObj.filters.push(search.createFilter({
                    name: "internalid",
                    operator: search.Operator.IS,
                    values: vinID
                }))
                vinFldObj.defaultValue = vinID;
            }
            if (_vinText != '') {
                // log.debug('vinID filters', vinID);
                vmSearchObj.filters.push(search.createFilter({
                    name: "name",
                    operator: search.Operator.CONTAINS,
                    values: _vinText
                }))
                vinfreeformFldObj.defaultValue = _vinText;
            }
            if (status != '') {
                // log.debug('vinID filters', vinID);
                vmSearchObj.filters.push(search.createFilter({
                    name: "custrecord_advs_vm_reservation_status",
                    operator: search.Operator.ANYOF,
                    values: status
                }))
                statusFldObj.defaultValue = status;
            }
            if (color != '') {
                // log.debug('vinID filters', vinID);
                vmSearchObj.filters.push(search.createFilter({
                    name: "custrecord_advs_vm_exterior_color",
                    operator: search.Operator.IS,
                    values: color
                }))
                colorFldObj.defaultValue = color;
            }
            if (transmission != '') {
                // log.debug('vinID filters', vinID);
                vmSearchObj.filters.push(search.createFilter({
                    name: "custrecord_advs_vm_transmission_type",
                    operator: search.Operator.IS,
                    values: transmission
                }))
                transmissionFldObj.defaultValue = transmission;
            }
            if (mileage != '') {
                // log.debug('vinID filters', vinID);
                vmSearchObj.filters.push(search.createFilter({
                    name: "custrecord_advs_vm_mileage",
                    operator: search.Operator.EQUALTO,
                    values: mileage
                }))
                mileageFldObj.defaultValue = mileage;
            }
            if (salesrep != '') {
                // log.debug('vinID filters', vinID);
                /*vmSearchObj.filters.push(search.createFilter({  name: "custrecord_advs_vm_soft_hld_sale_rep", operator: search.Operator.IS, values: salesrep }))
        salesrepFldObj.defaultValue = salesrep;*/
            }
            if (_statushold != '') {
                // log.debug('vinID filters', vinID);
                vmSearchObj.filters.push(search.createFilter({
                    name: "custrecord_reservation_hold",
                    operator: search.Operator.ANYOF,
                    values: _statushold
                }))
                statusHoldFldObj.defaultValue = _statushold;
            }
            if (LeaseHeaderId) {
                LeaseFieldObj.defaultValue = LeaseHeaderId;
            }
            if (iFrameCenter) {
                IframeCenterFieldObj.defaultValue = iFrameCenter;
            }
            if (flagpara2) {
                Flagpara2FieldObj.defaultValue = flagpara2;
            }
            if (Old_Vin_From_lease) {
                OldVinFieldObj.defaultValue = Old_Vin_From_lease;
            }
            //EXTRA FILTERS

            if (ttlrest != '') {
                //if(washed==0){washed == 'F';}else if(washed==1){washed == 'T';}
                // log.debug('vinID filters', vinID);
                vmSearchObj.filters.push(search.createFilter({
                    name: "custrecord_advs_title_rest_ms_tm",
                    operator: search.Operator.ANYOF,
                    values: ttlrest
                }))
                invTitleRestFldObj.defaultValue = ttlrest;
            }
            if (washed != '') {
                var _washed = '';
                if (washed == 0) {
                    _washed = 'F';
                } else if (washed == 1) {
                    _washed = 'T';
                }
                // log.debug('vinID filters', vinID);
                vmSearchObj.filters.push(search.createFilter({
                    name: "custrecord_advs_tm_washed",
                    operator: search.Operator.IS,
                    values: [_washed]
                }))
                invWashedFldObj.defaultValue = washed;
            }
            if (singlebunk != '') {
                // log.debug('vinID filters', vinID);
                vmSearchObj.filters.push(search.createFilter({
                    name: "custrecord_advs_single_bunk",
                    operator: search.Operator.ANYOF,
                    values: singlebunk
                }))
                invSingleBunkFldObj.defaultValue = singlebunk;
            }
            if (invcolor != '') {
                // log.debug('vinID filters', vinID);
                vmSearchObj.filters.push(search.createFilter({
                    name: "custrecord_advs_vm_exterior_color",
                    operator: search.Operator.ANYOF,
                    values: invcolor
                }))
                invColorFldObj.defaultValue = invcolor;
            }
            if (invyear != '') {
                // log.debug('vinID filters', vinID);
                vmSearchObj.filters.push(search.createFilter({
                    name: "custrecord_advs_vm_model_year",
                    operator: search.Operator.ANYOF,
                    values: invyear
                }))
                invYearFldObj.defaultValue = invyear;
            }
            if (invbed != '') {
                // log.debug('vinID filters', vinID);
                vmSearchObj.filters.push(search.createFilter({
                    name: "custrecord_advs_beds_ms_tm",
                    operator: search.Operator.ANYOF,
                    values: invbed
                }))
                invBedsFldObj.defaultValue = invbed;
            }
            if (invtruckready != '') {
                var _invtruckready = '';
                log.debug('invtruckready in filter1 ', invtruckready);
                log.debug('invtruckready in filter2 ', (invtruckready == 0));


                if (invtruckready == 0 || invtruckready == '0') {
                    _invtruckready = 'F';
                } else if (invtruckready == 1) {
                    _invtruckready = 'T';
                }
                log.debug('_invtruckready in filter ', _invtruckready);
                vmSearchObj.filters.push(search.createFilter({
                    name: "custrecord_advs_tm_truck_ready",
                    operator: search.Operator.IS,
                    values: [_invtruckready]
                }))
                invTruckReadyFldObj.defaultValue = invtruckready;
            }
            if (invapu != '') {
                // log.debug('vinID filters', vinID);
                vmSearchObj.filters.push(search.createFilter({
                    name: "custrecord_advs_apu_ms_tm",
                    operator: search.Operator.ANYOF,
                    values: invapu
                }))
                invApuFldObj.defaultValue = invapu;
            }
            if (bodystyle != '') {
                // log.debug('vinID filters', vinID);
                vmSearchObj.filters.push(search.createFilter({
                    name: "custrecord_advs_vm_body_style",
                    operator: search.Operator.ANYOF,
                    values: bodystyle
                }))
                invBodyStyleFldObj.defaultValue = bodystyle;
            }
            if (sfcustomer != '') {
                // log.debug('vinID filters', vinID);
                vmSearchObj.filters.push(search.createFilter({
                    name: "custrecord_advs_customer",
                    operator: search.Operator.ANYOF,
                    values: sfcustomer
                }))
                invshCustomerFldObj.defaultValue = sfcustomer;
            }
            if (invtransm != '') {
                // log.debug('vinID filters', vinID);
                vmSearchObj.filters.push(search.createFilter({
                    name: "custrecord_advs_vm_transmission_type",
                    operator: search.Operator.ANYOF,
                    values: invtransm
                }))
                invTransmissionFldObj.defaultValue = invtransm;
            }
            if (invsssize != '') {
                // log.debug('vinID filters', vinID);
                vmSearchObj.filters.push(search.createFilter({
                    name: "custrecord_advs_sleeper_size_ms",
                    operator: search.Operator.ANYOF,
                    values: invsssize
                }))
                invsssizeFldObj.defaultValue = invsssize;
            }
            if (invstock != '') {
                // log.debug('vinID filters', vinID);
                vmSearchObj.filters.push(search.createFilter({
                    name: "custrecord_advs_em_serial_number",
                    operator: search.Operator.IS,
                    values: invstock
                }))
                invStockFldObj.defaultValue = invstock;
            }
            /* if (invengine != '') {
          // log.debug('vinID filters', vinID);
          vmSearchObj.filters.push(search.createFilter({
            name: "custrecord_advs_sleeper_size_ms",
            operator: search.Operator.ANYOF,
            values: invengine
          }))
          invEngineFldObj.defaultValue = invengine;
        } */


            /* invStockFldObj,,,,,,
         ,,,,invTermsFldObj,
         ,,, */


            // ,,,invterms,,,,,,,, ,,




            var inventoryitemSearch = search.create({
                type: "inventoryitem",
                filters: [
                    ["type", "anyof", "InvtPart"],
                    "AND",
                    ["custitem_advs_inventory_type", "anyof", "1"]
                ],
                columns: [
                    search.createColumn({
                        name: "internalid",
                        label: "Internal ID"
                    }),
                    search.createColumn({
                        name: "custitem_advs_inventory_type",
                        label: "Inventory Type"
                    }),
                    search.createColumn({
                        name: "itemid",
                        sort: search.Sort.ASC,
                        label: "Name"
                    })
                ]
            });

            inventoryitemSearch.run().each(function (result) {
                modelFldObj.addSelectOption({
                    value: result.getValue('internalId'),
                    text: result.getValue('itemid')
                });
                return true;
            });

            return vmSearchObj;
        }

        function sourceLocation(LocationFieldObj, UserSubsidiary) { // Abdul
            LocationFieldObj.addSelectOption({
                value: "",
                text: ""
            });
            var locationSearchObj = search.create({
                type: "location",
                filters: [
                    ["subsidiary", "anyof", UserSubsidiary]
                ],
                columns: [
                    search.createColumn({
                        name: "name",
                        label: "Name"
                    }),
                    search.createColumn({
                        name: "internalid",
                        label: "Internal ID"
                    })
                ]
            });

            locationSearchObj.run().each(function (result) {
                LocationFieldObj.addSelectOption({
                    value: result.getValue('internalId'),
                    text: result.getValue('name')
                });
                return true;
            });
        }

        function addCommasnew(x) {
            x = x.toString();
            var pattern = /(-?\d+)(\d{3})/;
            while (pattern.test(x))
                x = x.replace(pattern, "$1,$2");
            return x;
        }
        // Function to calculate the difference in days
        function calculateDays(startDate, Newdate) {
            const start = new Date(startDate);
            var end = new Date(Newdate);
            const differenceInMs = end - start;
            const differenceInDays = Math.floor(differenceInMs / (1000 * 60 * 60 * 24));
            return differenceInDays;
        }


        function toggleInventoryFilters(form, fields, displayarr) {
            try {
                //log.debug('fields', fields);
                for (var i = 0; i < fields.length; i++) {
                    //log.debug('fields[i]',fields[i]);
                    let field = form.getField({
                        id: fields[i]
                    }); // Retrieve the field by ID
                    if (field) {
                        field.updateDisplayType({
                            displayType: serverWidget.FieldDisplayType.HIDDEN
                        });
                    }


                    for (var j = 0; j < displayarr.length; j++) {
                        if (displayarr[j] == i) {
                            //log.debug('fields[i]',fields[i]);
                            let field = form.getField({
                                id: fields[i]
                            }); // Retrieve the field by ID
                            if (field) {
                                field.updateDisplayType({
                                    displayType: serverWidget.FieldDisplayType.NORMAL
                                });
                            }

                        }
                    }

                }


            } catch (e) {
                log.debug('error in toggleInventoryFilters', e.toString());
            }
        }

        function dynamicFields() {
            try {
                var arr = [];
                var obj = {};
                var newarr = [];
                var customrecord_filters_setupSearchObj = search.create({
                    type: "customrecord_filters_setup",
                    filters: [
                        ["isinactive", "is", "F"],
                        "AND",
                        ["custrecord_field_display", "is", "T"]
                    ],
                    columns: [
                        "custrecord_field_id",
                        "custrecord_field_label",
                        "custrecord_advs_filters_class"
                    ]
                });
                var searchResultCount = customrecord_filters_setupSearchObj.runPaged().count;
                customrecord_filters_setupSearchObj.run().each(function (result) {
                    // .run().each has a limit of 4,000 results
                    var fieldid = result.getValue({
                        name: 'custrecord_field_id'
                    });
                    var fieldLabel = result.getValue({
                        name: 'custrecord_field_label'
                    });
                    var fieldGroup = result.getText({
                        name: 'custrecord_advs_filters_class'
                    });
                    if (fieldGroup == 'Inventory') {
                        obj['custpage' + fieldid.toLowerCase()] = fieldLabel;
                        newarr.push('custpage' + fieldid.toLowerCase())
                    } else if (fieldGroup == 'Reposession') {
                        obj['custpage' + fieldid.toLowerCase()] = fieldLabel;
                        newarr.push('custpage' + fieldid.toLowerCase())
                    } else if (fieldGroup == 'Auction') {
                        obj['custpage' + fieldid.toLowerCase()] = fieldLabel;
                        newarr.push('custpage' + fieldid.toLowerCase())
                    } else if (fieldGroup == 'Delivery Board') {
                        obj['custpage' + fieldid.toLowerCase()] = fieldLabel;
                        newarr.push('custpage' + fieldid.toLowerCase())
                    }


                    return true;
                });
                arr.push(obj);

                //log.debug('newarr',newarr);
                return newarr;
            } catch (e) {
                log.debug('error dynamicFields', e.toString());
            }
        }

        function discountsetup() {
            try {
                var customrecord_advs_disc_crit_listSearchObj = search.create({
                    type: "customrecord_advs_disc_crit_list",
                    filters: [
                        ["isinactive", "is", "F"]
                    ],
                    columns: [
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
            onRequest
        }
    });