/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 * @NModuleScope public
 */
define(['N/record', 'N/runtime', 'N/search', 'N/ui/serverWidget', 'N/url', 'N/format','SuiteScripts/Advectus/inventorymodulelib.js'],
    /**
     * @param{record} record
     * @param{runtime} runtime
     * @param{search} search
     * @param{serverWidget} serverWidget
     */
    (record, runtime, search, serverWidget, url, format,inventorymodulelib) => {
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
                    title: " "
                });
                var _inventorymodulelib = inventorymodulelib.jsscriptlib(form);
                //READ PARAMETERS
               var parametersobj =  getRequestParams(request,runtime);
                var pageSize = 1000;
                //CREATE FIELD GROUP
                var filterGp = form.addFieldGroup({
                    id: "custpage_fil_gp",
                    label: "Filters"
                });
                //BUTTONS ON THE DASHBOARD
                form.addButton({
                    id: 'custpage_open_filtersetup',
                    label: 'Filters',
                    functionName: 'openfiltersetup(' + parametersobj.userId + ')'
                });
                form.addButton({
                    id: 'custpage_clear_filters',
                    label: 'Clear Filters',
                    functionName: 'resetFilters(' + parametersobj.userId + ')'
                });
                createFilterFields(parametersobj,form);
                var sublistfields = createSublistHeaders();
               var sublist =  renderFields(sublistfields,'custpage_fil_gp',form);
                var vmSearchObj =getInventoryData(parametersobj);
                var searchObj = vmSearchObj.runPaged({
                    pageSize: pageSize,
                });
                var pageId = parseInt(request.parameters.page) || 0;
                var pageCount = Math.ceil(searchObj.count / pageSize);
                 // Set pageId to correct value if out of index
                if (!pageId || pageId == '' || pageId < 0)
                    pageId = 0;
                else if (pageId >= pageCount)
                    pageId = pageCount - 1;

                var addResults = [{}];
                if (searchObj.count > 0) {
                    addResults = fetchSearchResult(searchObj, pageId, parametersobj.freqId);
                } else {
                    var addResults = [];
                }
                var _inventoyCount = addResults.length || 0;
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
                                if (true) {//notesms
                                    sublist.setSublistValue({
                                        id: "custpabe_m_notes",
                                        line: lineNum,
                                        value: '<a href="#" onclick="shownotesinventorysheet(' + vinid + ')"> <i class="fa fa-comment" style="color:blue;"</i></a>'//notesms
                                    });
                                }
                                if (true) {//notesms
                                    sublist.setSublistValue({
                                        id: "custpabe_m_changerstatus",
                                        line: lineNum,
                                        value: '<a href="#" onclick="changeRStatus(' + vinid + ')"> <i class="fa fa-edit" style="color:blue;"</i></a>'//notesms
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
                                // if (!flagpara2) {
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

                                // }
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
                                if (true) { //notesms
                                    sublist.setSublistValue({
                                        id: "custpabe_m_notes",
                                        line: lineNum,
                                        value: '<a href="#" onclick="shownotesinventorysheet(' + vinid + ')"> <i class="fa fa-comment" style="color:blue;"</i></a>'//notesms
                                    });
                                }
                                sublist.setSublistValue({
                                    id: "custpabe_m_changerstatus",
                                    line: lineNum,
                                    value: '<a href="#" onclick="changeRStatus(' + vinid + ')"> <i class="fa fa-edit" style="color:blue;"</i></a>'//notesms
                                });
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

                form.clientScriptModulePath ='./advs_cs_inventory_available_sheet.js'
                response .writePage(form);
            }
        }
        var uniqueBucket = [];
        var bucketData = [];
        var bucketchildsIds = [];
        var mileagetofilter = 0;

        function createFilterFields(parametersobj,form)        {
            try{
               var modelFldObj, locFldObj, salesrepFldObj,  bucketFldObj,vinFldObj,vinfreeformFldObj,
                   statusFldObj,statusHoldFldObj,mileageFldObj,bucketChildFldObj,invStockFldObj,
                   invColorFldObj,invEngineFldObj;
               var param  =  JSON.parse(parametersobj. filtersparam);
               log.debug('param',param);
                var filterFldObj = form.addField({
                    id: "custpage_filter_params",
                    type: serverWidget.FieldType.TEXT,
                    label: "filtersparam",
                    container: "custpage_fil_gp"
                }).updateDisplayType({
                    displayType: "hidden"
                });
                filterFldObj.defaultValue = parametersobj.filtersparam;
                log.debug('param.includes(2)',param.includes(2));
               if (param.includes(1)) {
                    vinFldObj = form.addField({
                        id: "custpage_inv_vin",
                        type: serverWidget.FieldType.SELECT,
                        label: "VIN",
                        source: "customrecord_advs_vm",
                        container: "custpage_fil_gp"
                    });
                    vinFldObj.defaultValue =   param.vinID;
                }
                if (param.includes(2)) {
                    vinfreeformFldObj = form.addField({
                        id: "custpage_inv_vin_text",
                        type: serverWidget.FieldType.TEXT,
                        label: "VIN TEXT",
                        container: "custpage_fil_gp"
                    });
                    vinfreeformFldObj.defaultValue =   param._vinText;
                }
                if (param.includes(3)) {
                    modelFldObj = form.addField({
                        id: "custpage_inv_model",
                        type: serverWidget.FieldType.SELECT,
                        label: "Model",
                        container: "custpage_fil_gp"
                    });
                    modelFldObj.addSelectOption({ value: '', text: '' });
                    prepareModelOptions(modelFldObj);
                    modelFldObj.defaultValue =   parametersobj.modelId;
                }
                if (param.includes(4)) {
                    locFldObj = form.addField({
                        id: "custpage_inv_location",
                        type: serverWidget.FieldType.SELECT,
                        label: "Location",
                        container: "custpage_fil_gp"
                    });
                    sourceLocation(locFldObj, parametersobj.userSubsidiary);
                    locFldObj.defaultValue =   parametersobj.locatId;
                }
                if (param.includes(5)) {
                    statusFldObj = form.addField({
                        id: "custpage_inv_status",
                        type: serverWidget.FieldType.SELECT,
                        label: "Status",
                        source: "customlist_advs_reservation_status",
                        container: "custpage_fil_gp"
                    });
                    statusFldObj.defaultValue =   parametersobj._invstatusFil;
                }
                if (param.includes(6)) {
                    salesrepFldObj = form.addField({
                        id: "custpage_inv_salesrep",
                        type: serverWidget.FieldType.SELECT,
                        label: "Sales Rep",
                        source: "employee",
                        container: "custpage_fil_gp"
                    });
                    salesrepFldObj.defaultValue =   parametersobj.salesrep;
                }
                if (param.includes(7)) {
                    statusHoldFldObj = form.addField({
                        id: "custpage_inv_softhold_status",
                        type: serverWidget.FieldType.SELECT,
                        label: "Soft Hold",
                        source: "customlist_advs_reservation_hold",
                        container: "custpage_fil_gp"
                    });
                    statusHoldFldObj.defaultValue = parametersobj._statushold;
                }
                if (param.includes(8)) {
                    mileageFldObj = form.addField({
                        id: "custpage_inv_mileage",
                        type: serverWidget.FieldType.TEXT,
                        label: "Mileage",
                        container: "custpage_fil_gp"
                    });
                    mileageFldObj.defaultValue= parametersobj.mileage;
                }
                if (param.includes(9)) {
                    bucketFldObj = form.addField({
                        id: "custpage_inv_bucket",
                        type: serverWidget.FieldType.SELECT,
                        label: "Bucket",
                        source: "customrecord_ez_bucket_calculation",
                        container: "custpage_fil_gp"
                    });
                    bucketFldObj.defaultValue = parametersobj.bucketId;
                }
                if (param.includes(10)) {
                    bucketChildFldObj = form.addField({
                        id: "custpage_inv_bucket_child",
                        type: serverWidget.FieldType.SELECT,
                        label: "Bucket Child",
                        source: "customrecord_bucket_calculation_location",
                        container: "custpage_fil_gp"
                    });
                    bucketChildFldObj.defaultValue = parametersobj.bucketChild;
                }
                if (param.includes(12)) {
                    invStockFldObj = form.addField({
                        id: "custpage_inv_stock",
                        type: serverWidget.FieldType.TEXT,
                        label: "Stock #",
                        container: "custpage_fil_gp"
                    });
                    invStockFldObj.defaultValue = parametersobj.invstock;
                }
                if (param.includes(13)) {
                    invColorFldObj = form.addField({
                        id: "custpage_inv_color",
                        type: serverWidget.FieldType.SELECT,
                        label: "Color",
                        source: "customlist_advs_color_list",
                        container: "custpage_fil_gp"
                    });
                    invColorFldObj.defaultValue = parametersobj.invcolor;
                }
                if (param.includes(14)) {
                    invYearFldObj = form.addField({
                        id: "custpage_inv_year",
                        type: serverWidget.FieldType.SELECT,
                        label: "Year",
                        source: "customlist_advs_truck_year",
                        container: "custpage_fil_gp"
                    });
                    invYearFldObj.defaultValue = parametersobj.invyear;
                }
                if (param.includes(15)) {
                    invEngineFldObj = form.addField({
                        id: "custpage_inv_engine",
                        type: serverWidget.FieldType.SELECT,
                        label: "Engine",
                        source: "customrecord_advs_engine_model",
                        container: "custpage_fil_gp"
                    });
                    invEngineFldObj.defaultValue   =    parametersobj.invengine;
                }
                if(param.includes(16)){ // Transmission
                    var invTransmissionFldObj = form.addField({
                        id: "custpage_inv_transmission",
                        type: serverWidget.FieldType.SELECT,
                        label: "Transmission",
                        source: "customlist712",
                        container: "custpage_fil_gp"
                    });
                    invTransmissionFldObj.defaultValue   =    parametersobj.invtransm;
                }
                if(param.includes(17)){ // Transmission
                    var invTitleRestFldObj = form.addField({
                        id: "custpage_inv_ttle_restr",
                        type: serverWidget.FieldType.SELECT,
                        label: "Title Restriction",
                        source: "customlist_advs_title_restriction_list",
                        container: "custpage_fil_gp"
                    });
                    invTitleRestFldObj.defaultValue   =    parametersobj.ttlrest;
                }
                if(param.includes(18)){
                    var invBodyStyleFldObj = form.addField({
                        id: "custpage_inv_body_style",
                        type: serverWidget.FieldType.SELECT,
                        label: "Body Style",
                        source: "customlist_advs_body_style",
                        container: "custpage_fil_gp"
                    });
                    invBodyStyleFldObj.defaultValue   =    parametersobj.bodystyle;
                }
                if(param.includes(19)){
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
                    invTruckReadyFldObj.defaultValue   =    parametersobj.invtruckready;
                }
                if(param.includes(20)){
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
                    invWashedFldObj.defaultValue   =    parametersobj.washed;
                }
                if(param.includes(21)){
                    var invSingleBunkFldObj = form.addField({
                        id: "custpage_inv_single_bunk",
                        type: serverWidget.FieldType.SELECT,
                        label: "Single Bunk",
                        source: "customlist_advs_single_bunk",
                        container: "custpage_fil_gp"
                    });
                    invSingleBunkFldObj.defaultValue   =    parametersobj.singlebunk;
                }
                if(param.includes(22)){
                    var invTermsFldObj = form.addField({
                        id: "custpage_inv_terms",
                        type: serverWidget.FieldType.TEXT,
                        label: "Terms",
                        source: null,
                        container: "custpage_fil_gp"
                    });
                    invTermsFldObj.defaultValue   =    parametersobj.invterms;
                }
                if(param.includes(23)){
                    var invsssizeFldObj = form.addField({
                        id: "custpage_inv_sssize",
                        type: serverWidget.FieldType.SELECT,
                        label: "Sleeper Size",
                        source: "customlist_advs_ms_list_sleeper_size",
                        container: "custpage_fil_gp"
                    });
                    invsssizeFldObj.defaultValue   =    parametersobj.invsssize;
                }
                if(param.includes(24)){ //APU
                    var invApuFldObj = form.addField({
                        id: "custpage_inv_apu",
                        type: serverWidget.FieldType.SELECT,
                        label: "Apu",
                        source: "customlist_advs_ms_apu_list",
                        container: "custpage_fil_gp"
                    });
                    invApuFldObj.defaultValue   =    parametersobj.invapu;
                }
                if(param.includes(25)){ //BEDS
                    var invBedsFldObj = form.addField({
                        id: "custpage_inv_beds",
                        type: serverWidget.FieldType.SELECT,
                        label: "Beds",
                        source: "customlist_advs_beds_list",
                        container: "custpage_fil_gp"
                    });
                    invBedsFldObj.defaultValue   =    parametersobj.invbed;
                }
                if(param.includes(26)){
                    var invshCustomerFldObj = form.addField({
                        id: "custpage_inv_sh_customer",
                        type: serverWidget.FieldType.SELECT,
                        label: "Softhold Customer",
                        source: "customer",
                        container: "custpage_fil_gp"
                    });
                    invshCustomerFldObj.defaultValue   =    parametersobj.sfcustomer;
                }
                if(param.includes(60)){
                    var plocFldObj = form.addField({
                        id: "custpage_inv_physicallocation",
                        type: serverWidget.FieldType.SELECT,
                        label: "Physical Location",
                        source: 'customlistadvs_list_physicallocation',
                        container: "custpage_fil_gp"
                    })
                    plocFldObj.defaultValue   =    parametersobj.plocatId;
                }
            }catch (e)
            {
                log.debug("createFilterFields called",e.toString());
            }
        }
        function getRequestParams(request,runtime) {
            var currScriptObj = runtime.getCurrentScript();
            var UserObj = runtime.getCurrentUser();

            return {
                userSubsidiary: UserObj.subsidiary,
                userLocation: UserObj.location,
                userId: UserObj.id,
                pageSize: 1000,
                pageId: parseInt(request.parameters.page) || 0,
                filtersparam: request.parameters.filters || '[]',
                brandId: request.parameters.brand,
                modelId: request.parameters.model,
                locatId: request.parameters.locat,
                plocatId: request.parameters.plocat,
                salesrepId: request.parameters.salesrepfilter,
                depofilterId: request.parameters.depositfilter,
                bucketId: request.parameters.bucket,
                bucketChild: request.parameters.bucketchild,
                freqId: request.parameters.freq || 3, // Default to monthly
                vinID: request.parameters.unitvin || '',
                _vinText: request.parameters.unitvintext || '',
                _statushold: request.parameters.statushold || '',
                _invstatusFil: request.parameters.status || '',
                invstock: request.parameters.invstock || '',
                status: request.parameters.status || '',
                color: request.parameters.color || '',
                transmission: request.parameters.transmission || '',
                salesrep: request.parameters.salesrep || '',
                mileage: request.parameters.mileage || '',
                ttlrest: request.parameters.ttlrest || '',
                washed: request.parameters.washed || '',
                singlebunk: request.parameters.singlebunk || '',
                invterms: request.parameters.invterms || '',
                invapu: request.parameters.invapu || '',
                invbed: request.parameters.invbed || '',
                sfcustomer: request.parameters.sfcustomer || '',
                bodystyle: request.parameters.bodystyle || '',
                invtransm: request.parameters.invtransm || '',
                invyear: request.parameters.invyear || '',
                invcolor: request.parameters.invcolor || '',
                invtruckready: request.parameters.invtruckready || '',
                invengine: request.parameters.invengine || '',
                invsssize: request.parameters.invsssize || '',
                Old_Vin_From_lease: request.parameters.custpara_old_vin,
                flagpara2: request.parameters.custpara_flag_2,
                LeaseHeaderId: request.parameters.custpara_lease_id,
                iFrameCenter: request.parameters.ifrmcntnr,
                scriptId: currScriptObj.id,
                deploymentId: currScriptObj.deploymentId,
                startIndex: parseInt(request.parameters.start) || 0
            };
        }
        function createSublistHeaders(){
            try{
                const fieldDefinitions = [
                    { fieldlabel: 'Open', fieldid: 'cust_list_open_accordian', fieldtype: 'TEXT', fieldsource: '', displaytype: 'INLINE' },
                    { fieldlabel: 'Quick Deal', fieldid: 'cust_list_veh_card', fieldtype: 'TEXT', fieldsource: '', displaytype: 'INLINE' },
                    { fieldlabel: 'Customer Deposit', fieldid: 'cust_list_veh_delivey', fieldtype: 'TEXT', fieldsource: '', displaytype: 'INLINE' },
                    { fieldlabel: 'Stock #', fieldid: 'custpabe_m_stock', fieldtype: 'TEXT', fieldsource: '', displaytype: 'INLINE' },
                    { fieldlabel: 'Soft Hold', fieldid: 'cust_list_soft_hold', fieldtype: 'TEXT', fieldsource: '', displaytype: 'INLINE' },
                    { fieldlabel: 'Mark', fieldid: 'cust_select_checkbox_highlight', fieldtype: 'CHECKBOX', fieldsource: '', displaytype: 'HIDDEN' },
                    { fieldlabel: 'Change Status', fieldid: 'custpabe_m_changestatus', fieldtype: 'TEXT', fieldsource: '', displaytype: 'INLINE' },
                    { fieldlabel: 'Status', fieldid: 'custpabe_m_status', fieldtype: 'SELECT', fieldsource: 'customlist_advs_reservation_status', displaytype: 'INLINE' },
                    {fieldlabel:"Notes",fieldid:"custpabe_m_notes",fieldtype:"TEXT",fieldsource:'',displaytype:"INLINE"},
                    {fieldlabel:"Change Reservation Status",fieldid:"custpabe_m_changerstatus",fieldtype:"TEXT",fieldsource:'',displaytype:"INLINE"},
                    // {fieldlabel:"Reservation Status",fieldid:"custpabe_m_rstatus",fieldtype:"SELECT",fieldsource:'',displaytype:"INLINE"},
                    { fieldlabel: 'Reservation Status', fieldid: 'custpabe_m_softhold_status', fieldtype: 'SELECT', fieldsource: 'customlist_advs_reservation_hold', displaytype: 'INLINE' },
                    {fieldlabel:"Reservation Date",fieldid:"custpabe_m_rdate",fieldtype:"TEXT",fieldsource:'',displaytype:"INLINE"},
                    { fieldlabel: 'Color', fieldid: 'custpabe_m_color', fieldtype: 'TEXT', fieldsource: '', displaytype: 'INLINE' },
                    { fieldlabel: 'Year', fieldid: 'custpabe_m_yr', fieldtype: 'SELECT', fieldsource: 'customrecord_advs_model_year', displaytype: 'INLINE' },
                    { fieldlabel: 'Model', fieldid: 'custpabe_model', fieldtype: 'SELECT', fieldsource: 'item', displaytype: 'INLINE' },
                    { fieldlabel: 'Engine', fieldid: 'custpabe_m_engine', fieldtype: 'TEXT', fieldsource: '', displaytype: 'INLINE' },
                    { fieldlabel: 'Transmission', fieldid: 'custpabe_m_transmission', fieldtype: 'SELECT', fieldsource: 'customlist712', displaytype: 'INLINE' },
                    { fieldlabel: 'Mileage', fieldid: 'custpabe_m_mileage', fieldtype: 'TEXT', fieldsource: '', displaytype: 'INLINE' },
                    { fieldlabel: 'Location', fieldid: 'custpabe_loc', fieldtype: 'SELECT', fieldsource: 'location', displaytype: 'HIDDEN' },
                    { fieldlabel: 'Physical Location', fieldid: 'custpabe_phyloc', fieldtype: 'SELECT', fieldsource: 'customlistadvs_list_physicallocation', displaytype: 'INLINE' },
                    { fieldlabel: 'Title Restriction', fieldid: 'custpabe_m_titlerestriction', fieldtype: 'TEXT', displaytype: 'INLINE' },
                    { fieldlabel: 'Title Restriction 2', fieldid: 'custpabe_m_titlerestriction2', fieldtype: 'TEXT', displaytype: 'HIDDEN' },
                    { fieldlabel: 'Body Style', fieldid: 'custpabe_m_body_style', fieldtype: 'SELECT', fieldsource: 'customlist_advs_body_style', displaytype: 'INLINE' },
                    { fieldlabel: 'Truck Ready', fieldid: 'custpabe_m_is_truck_ready', fieldtype: 'TEXT', displaytype: 'INLINE' },
                    { fieldlabel: 'Washed', fieldid: 'custpabe_m_is_washed', fieldtype: 'TEXT', displaytype: 'INLINE' },
                    { fieldlabel: 'Single Bunk', fieldid: 'custpabe_m_single_bunk', fieldtype: 'SELECT', fieldsource: 'customlist_advs_single_bunk', displaytype: 'INLINE' },
                    {fieldlabel:"Total Inception",fieldid:"custpabe_m_bkt_ttl_incep",fieldtype:"TEXT",fieldsource:'',displaytype:"NORMAL"},
                    {fieldlabel:"Deposit Inception",fieldid:"custpabe_m_bkt_dep_incep",fieldtype:"TEXT",fieldsource:'',displaytype:"NORMAL"},
                    {fieldlabel:"Payment Inception",fieldid:"custpabe_m_bkt_pay_incep",fieldtype:"TEXT",fieldsource:'',displaytype:"NORMAL"},
                    {fieldlabel:"Terms",fieldid:"custpabe_m_bkt_terms",fieldtype:"INTEGER",fieldsource:'',displaytype:"NORMAL"},
                    {fieldlabel:"Vin #",fieldid:"custpabe_vinid_link",fieldtype:"TEXT",fieldsource:'',displaytype:"NORMAL"},
                    {fieldlabel:"Vin #",fieldid:"custpabe_vinid",fieldtype:"SELECT",source:"customrecord_advs_vm",fieldsource:'',displaytype:"HIDDEN"},
                    {fieldlabel:"Transport",fieldid:"custpabe_transport",fieldtype:"TEXT",fieldsource:'',displaytype:"INLINE"},
                    {fieldlabel:"Date On Site",fieldid:"custpabe_m_donsite",fieldtype:"DATE",fieldsource:'',displaytype:"INLINE"},
                    {fieldlabel:"Inspected",fieldid:"custpabe_inspected",fieldtype:"TEXT",fieldsource:'',displaytype:"INLINE"},
                    {fieldlabel:"Approved Repairs Date",fieldid:"custpabe_appr_rep_date",fieldtype:"DATE",fieldsource:'',displaytype:"INLINE"},
                    {fieldlabel:"ETA Ready",fieldid:"custpabe_eta_ready",fieldtype:"DATE",fieldsource:'',displaytype:"INLINE"},
                    {fieldlabel:"Pictures",fieldid:"custpabe_pictures",fieldtype:"IMAGE",fieldsource:'',displaytype:"NORMAL"},
                    {fieldlabel:"Customer",fieldid:"custpabe_m_customer",fieldtype:"SELECT",source:"customer",fieldsource:'',displaytype:"INLINE"},
                    {fieldlabel:"Soft Hold Customer",fieldid:"custpabe_m_softhold_customer",fieldtype:"SELECT",source:"customer",fieldsource:'',displaytype:"INLINE"},
                    {fieldlabel:"Soft Hold - Age In Days",fieldid:"custpabe_m_softhold_days",fieldtype:"FLOAT",fieldsource:'',displaytype:"INLINE"},
                    {fieldlabel:"SalesRep",fieldid:"custpabe_m_emp",fieldtype:"SELECT",source:"employee",fieldsource:'',displaytype:"INLINE"},
                    {fieldlabel:"Admin Notes",fieldid:"custpabe_m_admin_notes",fieldtype:"TEXTAREA",fieldsource:'',displaytype:"NORMAL"},
                    {fieldlabel:"Date Truck Ready",fieldid:"custpabe_m_dtruck_ready",fieldtype:"DATE",fieldsource:'',displaytype:"INLINE"},
                    {fieldlabel:"Date Truck Locked Up",fieldid:"custpabe_m_dtruck_lockup",fieldtype:"DATE",fieldsource:'',displaytype:"INLINE"},
                    {fieldlabel:"Aging Date Truck Ready",fieldid:"custpabe_m_aging",fieldtype:"INTEGER",fieldsource:'',displaytype:"INLINE"},
                    {fieldlabel:"Aging Date On Site",fieldid:"custpabe_m_donsite_aging",fieldtype:"INTEGER",fieldsource:'',displaytype:"INLINE"},
                    {fieldlabel:"Aging Contract",fieldid:"custpabe_aging_contract",fieldtype:"DATE",fieldsource:'',displaytype:"INLINE"},
                    {fieldlabel:"Total Inception (2)",fieldid:"custpabe_m_bkt_ttl_incep_2",fieldtype:"TEXT",fieldsource:'',displaytype:"NORMAL"},
                    {fieldlabel:"Deposit",fieldid:"custpabe_m_bkt_dep",fieldtype:"TEXT",fieldsource:'',displaytype:"NORMAL"},
                    {fieldlabel:"Payment",fieldid:"custpabe_m_bkt_pay",fieldtype:"TEXT",fieldsource:'',displaytype:"NORMAL"},
                    {fieldlabel:"Terms (2)",fieldid:"custpabe_m_bkt_terms_2",fieldtype:"INTEGER",fieldsource:'',displaytype:"NORMAL"},
                    { fieldid: "custpabe_m_bkt_pay_13", fieldtype: "TEXT", fieldlabel: "Payments 2-13", displaytype: "NORMAL" },
                    { fieldid: "custpabe_m_bkt_pay_25", fieldtype: "TEXT", fieldlabel: "Payments 14-25", displaytype: "NORMAL" },
                    { fieldid: "custpabe_m_bkt_pay_37", fieldtype: "TEXT", fieldlabel: "Payments 26-37", displaytype: "NORMAL" },
                    { fieldid: "custpabe_m_bkt_pay_49", fieldtype: "TEXT", fieldlabel: "Payments 26-37", displaytype: "NORMAL" },
                    { fieldid: "custpabe_m_bkt_pur_opt", fieldtype: "TEXT", fieldlabel: "Purchase Option", displaytype: "NORMAL" },
                    { fieldid: "custpabe_m_bkt_cont_tot", fieldtype: "TEXT", fieldlabel: "Contract Total", displaytype: "NORMAL" },
                    { fieldid: "custpabe_m_sleepersize", fieldtype: "TEXT", fieldlabel: "Sleeper Size", displaytype: "INLINE" },
                    { fieldid: "custpabe_m_apu", fieldtype: "TEXT", fieldlabel: "APU", displaytype: "INLINE" },
                    { fieldid: "custpabe_m_beds", fieldtype: "TEXT", fieldlabel: "Beds", displaytype: "INLINE" },
                    { fieldid: "custpabe_m_bkt_id", fieldtype: "SELECT", fieldlabel: "Bucket", fieldsource: "customrecord_ez_bucket_calculation", displaytype: "INLINE" },
                    { fieldid: "custpabe_m_bkt_freq", fieldtype: "SELECT", fieldlabel: "Frequency", fieldsource: "customrecord_advs_st_frequency", displaytype: "HIDDEN" },
                    { fieldid: "custpabe_m_bkt_ch_id", fieldtype: "SELECT", fieldlabel: "Bucket Child", fieldsource: "customrecord_bucket_calculation_location", displaytype: "HIDDEN" },
                    { fieldid: "custpabe_m_bkt_salesch", fieldtype: "SELECT", fieldlabel: "Sales Channel", displaytype: "HIDDEN" }


                ];

                return fieldDefinitions;
            }catch (e)
            {
                log.debug('error in createsublistheaders',e.toString());
            }
        }
        function getInventoryData(parametersobj){
            try{
                var vmSearchObj = search.create({
                    type: "customrecord_advs_vm",
                    filters: [
                        ["isinactive", "is", "F"],
                        "AND",
                        ["custrecord_advs_vm_reservation_status", "anyof", "15", "19", "20", "21", "22", "23", "24", "48","56"],
                        "AND",
                        ["custrecord_advs_vm_subsidary", "anyof", parametersobj.userSubsidiary]
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
                            name: "custrecord_advs_aging_days_ready"
                        }),
                        search.createColumn({
                            name: "custrecord_advs_physical_loc_ma"
                        }),
                        search.createColumn({
                            name: "custrecord_reservation_date"
                        })

                    ]
                });

                if (parametersobj.brandId) {
                    vmSearchObj.filters.push(search.createFilter({
                        name: "custrecord_advs_vm_vehicle_brand",
                        operator: search.Operator.ANYOF,
                        values: parametersobj.brandId
                    }))

                }
                if (parametersobj.modelId) {
                    vmSearchObj.filters.push(search.createFilter({
                        name: "custrecord_advs_vm_model",
                        operator: search.Operator.ANYOF,
                        values: parametersobj.modelId
                    }))

                }
                if (parametersobj.locatId) {
                    vmSearchObj.filters.push(search.createFilter({
                        name: "custrecord_advs_vm_location_code",
                        operator: search.Operator.ANYOF,
                        values: parametersobj.locatId
                    }))

                }
                if (parametersobj.plocatId) {
                    vmSearchObj.filters.push(search.createFilter({
                        name: "custrecord_advs_physical_loc_ma",
                        operator: search.Operator.ANYOF,
                        values: parametersobj.plocatId
                    }))

                }
                if (parametersobj.salesrepId) {
                    vmSearchObj.filters.push(search.createFilter({
                        name: "custrecord_advs_vm_soft_hld_sale_rep",
                        operator: search.Operator.IS,
                        values: parametersobj.salesrepId
                    }))

                }
                if (parametersobj.depofilterId) {
                    var deliverybaords = false;
                    if (parametersobj.depofilterId == 1) {
                        deliverybaords = true
                    } else if (parametersobj.depofilterId == 2) {
                        deliverybaords = false
                    }
                    vmSearchObj.filters.push(search.createFilter({
                        name: "custrecord_advs_lease_inventory_delboard",
                        operator: search.Operator.IS,
                        values: deliverybaords
                    }))

                }
                if (parametersobj.bucketId) {
                    vmSearchObj.filters.push(search.createFilter({
                        name: "custrecord_vehicle_master_bucket",
                        operator: search.Operator.ANYOF,
                        values: parametersobj.bucketId
                    }))

                }
                if (parametersobj.bucketChild) {
                    vmSearchObj.filters.push(search.createFilter({
                        name: "custrecord_v_master_buclet_hidden",
                        operator: search.Operator.ANYOF,
                        values: parametersobj.bucketChild
                    }))

                }
                if (parametersobj.freqId) {
                    //vmSearchObj.filters.push(search.createFilter({name:"customrecord_bucket_calculation_location.custrecord_advs_b_c_chld_freq",operator:search.Operator.ANYOF,values:freqId}))
                    //freqFldObj.defaultValue = parametersobj.freqId;
                }
                //status ,color ,transmission,salesrep,mileage
                if (parametersobj.vinID != '') {
                    // log.debug('vinID filters', vinID);
                    vmSearchObj.filters.push(search.createFilter({
                        name: "internalid",
                        operator: search.Operator.IS,
                        values: parametersobj.vinID
                    }))

                }
                if (parametersobj._vinText != '') {
                    // log.debug('vinID filters', vinID);
                    vmSearchObj.filters.push(search.createFilter({
                        name: "name",
                        operator: search.Operator.CONTAINS,
                        values: parametersobj._vinText
                    }))

                }
                if (parametersobj.status != '') {
                    vmSearchObj.filters.push(search.createFilter({
                        name: "custrecord_advs_vm_reservation_status",
                        operator: search.Operator.ANYOF,
                        values: parametersobj.status
                    }))

                }
                if (parametersobj.color != '') {
                     vmSearchObj.filters.push(search.createFilter({
                        name: "custrecord_advs_vm_exterior_color",
                        operator: search.Operator.IS,
                        values: parametersobj.color
                    }))

                }
                if (parametersobj.transmission != '') {
                     vmSearchObj.filters.push(search.createFilter({
                        name: "custrecord_advs_vm_transmission_type",
                        operator: search.Operator.IS,
                        values: parametersobj.transmission
                    }))

                }
                if (parametersobj.mileage != '') {
                     vmSearchObj.filters.push(search.createFilter({
                        name: "custrecord_advs_vm_mileage",
                        operator: search.Operator.EQUALTO,
                        values: parametersobj.mileage
                    }))

                }
                if (parametersobj._statushold != '') {
                     vmSearchObj.filters.push(search.createFilter({
                        name: "custrecord_reservation_hold",
                        operator: search.Operator.ANYOF,
                        values: parametersobj._statushold
                    }))

                }
              /*  if (LeaseHeaderId) {
                   // LeaseFieldObj.defaultValue = LeaseHeaderId;
                }
                if (iFrameCenter) {
                   // IframeCenterFieldObj.defaultValue = iFrameCenter;
                }
                if (flagpara2) {
                  //  Flagpara2FieldObj.defaultValue = flagpara2;
                }
                if (Old_Vin_From_lease) {
                  //  OldVinFieldObj.defaultValue = Old_Vin_From_lease;
                }*/
                //EXTRA FILTERS

                if (parametersobj.ttlrest != '') {
                    //if(washed==0){washed == 'F';}else if(washed==1){washed == 'T';}
                     vmSearchObj.filters.push(search.createFilter({
                        name: "custrecord_advs_title_rest_ms_tm",
                        operator: search.Operator.ANYOF,
                        values: parametersobj.ttlrest
                    }))

                }
                if (parametersobj.washed != '') {
                    var _washed = '';
                    if (parametersobj.washed == 0) {
                        _washed = 'F';
                    } else if (parametersobj.washed == 1) {
                        _washed = 'T';
                    }
                     vmSearchObj.filters.push(search.createFilter({
                        name: "custrecord_advs_tm_washed",
                        operator: search.Operator.IS,
                        values: [_washed]
                    }))

                }
                if (parametersobj.singlebunk != '') {
                    vmSearchObj.filters.push(search.createFilter({
                        name: "custrecord_advs_single_bunk",
                        operator: search.Operator.ANYOF,
                        values: parametersobj.singlebunk
                    }))

                }
                if (parametersobj.invcolor != '') {
                     vmSearchObj.filters.push(search.createFilter({
                        name: "custrecord_advs_vm_exterior_color",
                        operator: search.Operator.ANYOF,
                        values: parametersobj.invcolor
                    }))

                }
                if (parametersobj.invyear != '') {
                     vmSearchObj.filters.push(search.createFilter({
                        name: "custrecord_advs_vm_model_year",
                        operator: search.Operator.ANYOF,
                        values: parametersobj.invyear
                    }))

                }
                if (parametersobj.invbed != '') {
                     vmSearchObj.filters.push(search.createFilter({
                        name: "custrecord_advs_beds_ms_tm",
                        operator: search.Operator.ANYOF,
                        values: parametersobj.invbed
                    }))

                }
                if (parametersobj.invtruckready != '') {
                    var _invtruckready = '';
                    if (parametersobj.invtruckready == 0 || parametersobj.invtruckready == '0') {
                        _invtruckready = 'F';
                    } else if (parametersobj.invtruckready == 1) {
                        _invtruckready = 'T';
                    }

                    vmSearchObj.filters.push(search.createFilter({
                        name: "custrecord_advs_tm_truck_ready",
                        operator: search.Operator.IS,
                        values: [_invtruckready]
                    }))

                }
                if (parametersobj.invapu != '') {
                     vmSearchObj.filters.push(search.createFilter({
                        name: "custrecord_advs_apu_ms_tm",
                        operator: search.Operator.ANYOF,
                        values: parametersobj.invapu
                    }))

                }
                if (parametersobj.bodystyle != '') {
                    vmSearchObj.filters.push(search.createFilter({
                        name: "custrecord_advs_vm_body_style",
                        operator: search.Operator.ANYOF,
                        values: parametersobj.bodystyle
                    }))
                }
                if (parametersobj.sfcustomer != '') {
                    vmSearchObj.filters.push(search.createFilter({
                        name: "custrecord_advs_customer",
                        operator: search.Operator.ANYOF,
                        values: parametersobj.sfcustomer
                    }))
                }
                if (parametersobj.invtransm != '') {
                    vmSearchObj.filters.push(search.createFilter({
                        name: "custrecord_advs_vm_transmission_type",
                        operator: search.Operator.ANYOF,
                        values: parametersobj.invtransm
                    }))
                }
                if (parametersobj.invsssize != '') {
                   vmSearchObj.filters.push(search.createFilter({
                        name: "custrecord_advs_sleeper_size_ms",
                        operator: search.Operator.ANYOF,
                        values: parametersobj.invsssize
                    }))
                }
                if (parametersobj.invstock != '') {
                   vmSearchObj.filters.push(search.createFilter({
                        name: "custrecord_advs_em_serial_number",
                        operator: search.Operator.IS,
                        values: parametersobj.invstock
                    }))
                }
            return vmSearchObj;

            }catch (e)
            {
                log.debug('error',e.toString())
            }
        }
        function renderFields(fieldsarr, fieldgroup, form) {

            try {
                var sublist = form.addSublist({
                    id: "custpage_sublist",
                    type: serverWidget.SublistType.LIST,
                    label: "List"
                });
                for (var i = 0; i < fieldsarr.length; i++) {
                    try {

                        if (true) {
                            var fieldsobja = sublist.addField({
                                id: fieldsarr[i].fieldid,
                                type: serverWidget.FieldType[fieldsarr[i].fieldtype],
                                label: fieldsarr[i].fieldlabel,
                                source: fieldsarr[i].fieldsource,
                                //container: fieldgroup
                            });


                            //FieldIDARR.push(fieldsobja);

                            /* if (fieldsarr[i].displaytype != '') {
                              fieldsobja.updateDisplayType({
                                displayType: serverWidget.FieldDisplayType[fieldsarr[i].displaytype]
                              }); //displaytype
                            } */
                            if (fieldsarr[i].displaytype == 'HIDDEN') {
                                fieldsobja.updateDisplayType({
                                    displayType: serverWidget.FieldDisplayType.HIDDEN
                                });
                            }
                            if (fieldsarr[i].displaytype == 'DISABLED') {
                                fieldsobja.updateDisplayType({
                                    displayType: serverWidget.FieldDisplayType.DISABLED
                                });
                            }
                            if (fieldsarr[i].fieldtype == 'SELECT') {
                                fieldsobja.updateDisplayType({
                                    displayType: serverWidget.FieldDisplayType.INLINE
                                });
                            }


                        }

                    } catch (e) {
                        log.debug('error in render' + fieldsarr[i].fieldid, e.toString());
                    }
                }

                // return FieldIDARR;
                return sublist;
            } catch (e) {
                log.debug('errr in render fields', e.toString())
            }
        }
        function prepareModelOptions(modelFldObj){
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
        function fetchSearchResult(pagedData, pageIndex, freqId) {
            var vindiscountData = discountsetup();
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
                var cabconfig =  '';
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

                    if (modelYr == vindiscountData[vd].year  && vindiscountData[vd].model == '' && vindiscountData[vd].mileage == '' && vindiscountData[vd].dayssinceready == '' && vindiscountData[vd].location == '') {
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
                    } else if (Mileagedt == vindiscountData[vd].mileage && modelYr == vindiscountData[vd].year  && vindiscountData[vd].dayssinceready == '' && vindiscountData[vd].model == '' && vindiscountData[vd].cabconfig == '' && vindiscountData[vd].location == '') {
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
                    obj.cabconfig = '';
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