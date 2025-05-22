/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
define(['N/runtime', 'N/search', 'N/ui/serverWidget', 'N/url', 'N/format', 'N/record'],
    /**
     * @param{runtime} runtime
     * @param{search} search
     * @param{serverWidget} serverWidget
     */
    (runtime, search, serverWidget, url, format, record) => {
        /**
         * Defines the Suitelet script trigger point.
         * @param {Object} scriptContext
         * @param {ServerRequest} scriptContext.request - Incoming request
         * @param {ServerResponse} scriptContext.response - Suitelet response
         * @since 2015.2
         */
        const onRequest = (scriptContext) => {

            var Request = scriptContext.request;
            var Response = scriptContext.response;

            if (Request.method == "GET") {

                var form = serverWidget.createForm({
                    title: "Insurance Dashboard"
                });
                var InlineHTMLField = form.addField({
                    id: "custpage_inlinehtml",
                    type: serverWidget.FieldType.INLINEHTML,
                    label: " "
                });

                var inlineHTML = form.addField({
                    id: "custpage_inlinehtml2",
                    type: serverWidget.FieldType.INLINEHTML,
                    label: " "
                });
                inlineHTML.defaultValue = '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">';

                //Date
                var DateObj = record.create({
                    type: "customrecord_advs_st_current_date_time",
                });

                var TodaysDate = DateObj.getValue({
                    fieldId: "custrecord_st_current_date"
                });

                var NewFullDate = new Date(TodaysDate);
                //Date


                var TabLab_InsuranceExpNLT = "Exprired - NLT",
                    TabLab_InsuranceExpPrim = "Exprired - Primary",
                    TabLab_InsuranceExpCPC = "Expired - CPC",
                    TabLab_InsuranceOneDay = "1 day until cancel",
                    TabLab_InsuranceTwoDay = "2-5 day until cancel",
                    TabLab_InsuranceSixDay = "6-30 day until cancel",
                    TabLab_InsuranceClaim = "Claim";


                var count_InsuranceExpNLT = 0,
                    count_InsuranceExpPrim = 0,
                    count_InsuranceExpCPC = 0,
                    count_InsuranceOneDay = 0,
                    count_InsuranceTwoDay = 0,
                    count_InsuranceSixDay = 0;

                var Today = new Date;

                // log.error("Today-> ", Today);

                AddSublist(form, "custpage_subtab_insur_exp_ntl", TabLab_InsuranceExpNLT, null, null);
                AddSublist(form, "custpage_subtab_insur_exp_prim", TabLab_InsuranceExpPrim, null, null);
                AddSublist(form, "custpage_subtab_insur_exp_cpc", TabLab_InsuranceExpCPC, null, null);
                AddSublist(form, "custpage_subtab_insur_oneday_cancel", TabLab_InsuranceOneDay, null, null);
                AddSublist(form, "custpage_subtab_insur_twoday_cancel", TabLab_InsuranceTwoDay, null, null);
                AddSublist(form, "custpage_subtab_insur_sixday_cancel", TabLab_InsuranceSixDay, null, null);

                AddInsuranceClaimSub(form, "custpage_subtab_insur_claim", TabLab_InsuranceClaim, null, null);

                var insurClaimSublist = form.getSublist({
                    id: 'custpage_sublist_custpage_subtab_insur_claim'
                });
                searchForclaimData(insurClaimSublist);

                /** */

                var customrecord_advs_lease_headerSearchObj = search.create({
                    type: "customrecord_advs_lease_header",
                    filters:
                        [
                            ["isinactive", "is", "F"]
                        ],
                    columns:
                        [
                            search.createColumn({ name: "internalid", label: "Internal ID" }),
                            search.createColumn({ name: "custrecord_advs_l_h_insurance", label: "Liability Carrier" }),
                            search.createColumn({ name: "custrecord_advs_l_h_phy_dam_ins", label: "Physical Damage Carrier" }),
                            search.createColumn({ name: "custrecord_advs_l_h_ins_phy_dam_exp", label: "Physical Damage Expiration" }),
                            search.createColumn({ name: "custrecord_advs_phy_dmg_cover", label: "Physical Damage Coverage" }),
                            search.createColumn({ name: "custrecord_advs_l_h_ins_lia_exp_dt", label: "Liability Expiration Date" }),
                            search.createColumn({ name: "custrecord_advs_l_a_curr_cps", label: "Current CPC" }),
                            search.createColumn({ name: "custrecord_advs_l_h_customer_name", label: "Lessee Name " }),
                            search.createColumn({ name: "custrecord_advs_la_vin_bodyfld", label: "VIN" }),
                            search.createColumn({ name: "custrecord_advs_liability_type_f", label: "Liability Type" }),
                            search.createColumn({ name: "custrecord_advs_l_a_cpc", label: "Cpc Check" }),
                            search.createColumn({
                                name: "custrecord_advs_em_serial_number",
                                join: "CUSTRECORD_ADVS_LA_VIN_BODYFLD",
                                label: "Serial Number"
                            }),
                            search.createColumn({
                                name: "companyname",
                                join: "custrecord_advs_l_h_customer_name",
                                label: "Serial Number"
                            }),
                            search.createColumn({
                                name: "phone",
                                join: "custrecord_advs_l_h_customer_name",
                                label: "Phone"
                            }),
                            search.createColumn({
                                name: "custrecord_advs_l_a_curr_cps",
                                label: "Start Date"
                            }),
                            search.createColumn({
                                name: "custrecord_advs_cpc_date",
                                join: "CUSTRECORD_ADVS_L_A_CURR_CPS",
                                label: "Start Date"
                            })
                        ]
                });

                var LeaseArray = new Array();
                var LeaseDataArray = new Array();

                customrecord_advs_lease_headerSearchObj.run().each(function (result) {

                    var LeaseID = result.getValue({
                        name: "internalid"
                    });

                    var LiabilityCarrier = result.getText({
                        name: "custrecord_advs_l_h_insurance"
                    });
                    var PhysicalCarrier = result.getText({
                        name: "custrecord_advs_l_h_phy_dam_ins"
                    });
                    var PhysicalExpDate = result.getValue({
                        name: "custrecord_advs_l_h_ins_phy_dam_exp"
                    });
                    var PhysicalExpCoverage = result.getText({
                        name: "custrecord_advs_phy_dmg_cover"
                    });
                    var LiabilityExpDate = result.getValue({
                        name: "custrecord_advs_l_h_ins_lia_exp_dt"
                    });
                    var CustomerName = result.getText({
                        name: "custrecord_advs_l_h_customer_name"
                    });
                    var CustomerId = result.getValue({
                        name: "custrecord_advs_l_h_customer_name"
                    });
                    var LiabilityType = result.getText({
                        name: "custrecord_advs_liability_type_f"
                    });
                    var VinId = result.getValue({
                        name: "custrecord_advs_la_vin_bodyfld",
                    });
                    var CPCCheck = result.getValue({
                        name: "custrecord_advs_l_a_cpc",
                    });
                    var VinLastSix = result.getValue({
                        name: "custrecord_advs_em_serial_number",
                        join: "CUSTRECORD_ADVS_LA_VIN_BODYFLD"
                    });
                    var CompanyName = result.getValue({
                        name: "companyname",
                        join: "custrecord_advs_l_h_customer_name"
                    });
                    var MobilePhone = result.getValue({
                        name: "phone",
                        join: "custrecord_advs_l_h_customer_name"
                    });

                    var currentcpc = result.getValue({
                        name: "custrecord_advs_l_a_curr_cps"
                    });
                    var CPCSatrtDate = result.getValue({
                        name: "custrecord_advs_cpc_date",
                        join: "CUSTRECORD_ADVS_L_A_CURR_CPS"
                    }) ||'';


                    if (LeaseArray.indexOf(LeaseID) == -1) {
                        LeaseArray.push(LeaseID);
                        LeaseDataArray[LeaseID] = new Array();
                        LeaseDataArray[LeaseID]['LiabilityCarrier'] = LiabilityCarrier;
                        LeaseDataArray[LeaseID]['PhysicalCarrier'] = PhysicalCarrier;
                        LeaseDataArray[LeaseID]['PhysicalExpDate'] = PhysicalExpDate;
                        LeaseDataArray[LeaseID]['PhysicalExpCoverage'] = PhysicalExpCoverage;
                        LeaseDataArray[LeaseID]['LiabilityExpDate'] = LiabilityExpDate;
                        LeaseDataArray[LeaseID]['CustomerName'] = CustomerName;
                        LeaseDataArray[LeaseID]['VinLastSix'] = VinLastSix;
                        LeaseDataArray[LeaseID]['CompanyName'] = CompanyName;
                        LeaseDataArray[LeaseID]['MobilePhone'] = MobilePhone;
                        LeaseDataArray[LeaseID]['LiabilityType'] = LiabilityType;
                        LeaseDataArray[LeaseID]['CustomerId'] = CustomerId;
                        LeaseDataArray[LeaseID]['VinId'] = VinId;
                        LeaseDataArray[LeaseID]['CPCCheck'] = CPCCheck;
                        LeaseDataArray[LeaseID]['CPCSatrtDate'] = CPCSatrtDate;
                    }

                    return true;
                });



                var Count = 0;

                for (var i = 0; i < LeaseArray.length; i++) {
                    var LeaseId = LeaseArray[i];

                    if (LeaseDataArray[LeaseId] || LeaseDataArray[LeaseId] != null || LeaseDataArray[LeaseId] != undefined || LeaseDataArray[LeaseId] != " " || LeaseDataArray[LeaseId] != "") {

                        var LiabilityCarrier = LeaseDataArray[LeaseId]['LiabilityCarrier'];
                        var PhysicalCarrier = LeaseDataArray[LeaseId]['PhysicalCarrier'];
                        var PhysicalExpDate = LeaseDataArray[LeaseId]['PhysicalExpDate'];
                        var PhysicalExpCoverage = LeaseDataArray[LeaseId]['PhysicalExpCoverage'];
                        var LiabilityExpDate = LeaseDataArray[LeaseId]['LiabilityExpDate'];
                        var CustomerName = LeaseDataArray[LeaseId]['CustomerName'];
                        var VinLastSix = LeaseDataArray[LeaseId]['VinLastSix'];
                        var CompanyName = LeaseDataArray[LeaseId]['CompanyName'];
                        var MobilePhone = LeaseDataArray[LeaseId]['MobilePhone'];
                        var LiabilityType = LeaseDataArray[LeaseId]['LiabilityType'];
                        var CustomerId = LeaseDataArray[LeaseId]['CustomerId'];
                        var VinId = LeaseDataArray[LeaseId]['VinId'];
                        var CPCCheck = LeaseDataArray[LeaseId]['CPCCheck'];
                        var CPCSatrtDate = LeaseDataArray[LeaseId]['CPCSatrtDate'];

                        var CustDash = "<a href=\"https://8760954.app.netsuite.com/app/center/card.nl?sc=-69&entityid=" + CustomerId + "\" target=\"_blank\">DASH</a>";

                        var NotesDeployement = "https://8760954.app.netsuite.com/app/site/hosting/scriptlet.nl?script=2565&deploy=1";
                        NotesDeployement += "&custparam_cust=" + CustomerId + "&custparam_truckmaster=" + VinId + "&custparam_leaselink=" + LeaseId;
                        var NotesLink = "<a href=" + NotesDeployement + " target=\"_blank\">Create Notes</a>";

                        var create_history_link = url.resolveScript({ scriptId: 'customscript_collection_dash_history', deploymentId: 'customdeploy_collection_dash_history' });
                        var History = create_history_link + '&custparam_recid=' + LeaseId;//colle_id

                        var NewPhysicalExpDate = new Date(PhysicalExpDate);
                        var NewLiabilityExpDate = new Date(LiabilityExpDate);
                        // var CPCSatrtDate = new Date(CpcStartDate);

                        var PhyDiffInMs = (NewFullDate - NewPhysicalExpDate);
                        var PhyDiffInDays = PhyDiffInMs / (1000 * 60 * 60 * 24);
                        PhyDiffInDays = PhyDiffInDays * (-1);

                        var LiabDiffInMs = (NewFullDate - NewLiabilityExpDate);
                        var LiabDiffInDays = LiabDiffInMs / (1000 * 60 * 60 * 24);
                        LiabDiffInDays = LiabDiffInDays * (-1);

                        if ((PhyDiffInDays > 0) && (PhyDiffInDays <= 1)) {

                            var oneSublistObj = form.getSublist({
                                id: 'custpage_sublist_custpage_subtab_insur_oneday_cancel'
                            });
                            PhysicalExpDate = '<span style="color:#dabb0a; font-weight: bold;">'+PhysicalExpDate+'</span>'
                            SetSublistValueFun(oneSublistObj, count_InsuranceOneDay, CustDash, NotesLink, VinLastSix, CustomerName, CompanyName, MobilePhone, LiabilityType, LiabilityExpDate, LiabilityCarrier, PhysicalExpDate, PhysicalCarrier, CPCSatrtDate, History, LeaseId,PhysicalExpCoverage);

                            count_InsuranceOneDay++;
                        } else if ((LiabDiffInDays > 0) && (LiabDiffInDays <= 1)) {

                            var oneSublistObj = form.getSublist({
                                id: 'custpage_sublist_custpage_subtab_insur_oneday_cancel'
                            });

                            SetSublistValueFun(oneSublistObj, count_InsuranceOneDay, CustDash, NotesLink, VinLastSix, CustomerName, CompanyName, MobilePhone, LiabilityType, LiabilityExpDate, LiabilityCarrier, PhysicalExpDate, PhysicalCarrier, CPCSatrtDate, History, LeaseId,PhysicalExpCoverage);

                            count_InsuranceOneDay++;
                        }

                        if ((PhyDiffInDays >= 2) && (PhyDiffInDays <= 5)) {

                            var twoSublistObj = form.getSublist({
                                id: 'custpage_sublist_custpage_subtab_insur_twoday_cancel'
                            });
                            PhysicalExpDate = '<span style="color:#dabb0a;font-weight: bold;">'+PhysicalExpDate+'</span>'
                            SetSublistValueFun(twoSublistObj, count_InsuranceTwoDay, CustDash, NotesLink, VinLastSix, CustomerName, CompanyName, MobilePhone, LiabilityType, LiabilityExpDate, LiabilityCarrier, PhysicalExpDate, PhysicalCarrier, CPCSatrtDate, History, LeaseId,PhysicalExpCoverage);

                            count_InsuranceTwoDay++;
                        } else if ((LiabDiffInDays >= 2) && (LiabDiffInDays <= 5)) {

                            var twoSublistObj = form.getSublist({
                                id: 'custpage_sublist_custpage_subtab_insur_twoday_cancel'
                            });

                            SetSublistValueFun(twoSublistObj, count_InsuranceTwoDay, CustDash, NotesLink, VinLastSix, CustomerName, CompanyName, MobilePhone, LiabilityType, LiabilityExpDate, LiabilityCarrier, PhysicalExpDate, PhysicalCarrier, CPCSatrtDate, History, LeaseId,PhysicalExpCoverage);

                            count_InsuranceTwoDay++;
                        }

                        if ((PhyDiffInDays >= 6) && (PhyDiffInDays <= 30)) {

                            var sixSublistObj = form.getSublist({
                                id: 'custpage_sublist_custpage_subtab_insur_sixday_cancel'
                            });
                            PhysicalExpDate = '<span style="color:#dabb0a;font-weight: bold;">'+PhysicalExpDate+'</span>'
                            SetSublistValueFun(sixSublistObj, count_InsuranceSixDay, CustDash, NotesLink, VinLastSix, CustomerName, CompanyName, MobilePhone, LiabilityType, LiabilityExpDate, LiabilityCarrier, PhysicalExpDate, PhysicalCarrier, CPCSatrtDate, History, LeaseId,PhysicalExpCoverage);

                            count_InsuranceSixDay++;
                        } else if ((LiabDiffInDays >= 6) && (LiabDiffInDays <= 30)) {

                            var sixSublistObj = form.getSublist({
                                id: 'custpage_sublist_custpage_subtab_insur_sixday_cancel'
                            });

                            SetSublistValueFun(sixSublistObj, count_InsuranceSixDay, CustDash, NotesLink, VinLastSix, CustomerName, CompanyName, MobilePhone, LiabilityType, LiabilityExpDate, LiabilityCarrier, PhysicalExpDate, PhysicalCarrier, CPCSatrtDate, History, LeaseId,PhysicalExpCoverage);

                            count_InsuranceSixDay++;
                        }

                        if ((LiabilityType == "Primary") && (LiabDiffInDays < 0)) {

                            var primSublistObj = form.getSublist({
                                id: 'custpage_sublist_custpage_subtab_insur_exp_prim'
                            });
                            LiabilityExpDate = "<span style='color: red; '>" + LiabilityExpDate + "</span>";

                            SetSublistValueFun(primSublistObj, count_InsuranceExpPrim, CustDash, NotesLink, VinLastSix, CustomerName, CompanyName, MobilePhone, LiabilityType, LiabilityExpDate, LiabilityCarrier, PhysicalExpDate, PhysicalCarrier, CPCSatrtDate, History, LeaseId,PhysicalExpCoverage);

                            count_InsuranceExpPrim++;
                        } else if ((LiabilityType == "Non Trucking") && (LiabDiffInDays < 0)) {

                            var ntlSublistObj = form.getSublist({
                                id: 'custpage_sublist_custpage_subtab_insur_exp_ntl'
                            });
                            LiabilityExpDate = "<span style='color: red; '>" + LiabilityExpDate + "</span>";

                            SetSublistValueFun(ntlSublistObj, count_InsuranceExpNLT, CustDash, NotesLink, VinLastSix, CustomerName, CompanyName, MobilePhone, LiabilityType, LiabilityExpDate, LiabilityCarrier, PhysicalExpDate, PhysicalCarrier, CPCSatrtDate, History, LeaseId,PhysicalExpCoverage);

                            count_InsuranceExpNLT++;
                        } else if ((CPCCheck == "true" || CPCCheck == true || CPCCheck == "T") && (PhyDiffInDays < 0)) {

                            PhysicalExpDate = "<span style='color: red; '>" + PhysicalExpDate + "</span>";

                            var cpcSublistObj = form.getSublist({
                                id: 'custpage_sublist_custpage_subtab_insur_exp_cpc'
                            });

                            SetSublistValueFun(cpcSublistObj, count_InsuranceExpCPC, CustDash, NotesLink, VinLastSix, CustomerName, CompanyName, MobilePhone, LiabilityType, LiabilityExpDate, LiabilityCarrier, PhysicalExpDate, PhysicalCarrier, CPCSatrtDate, History, LeaseId,PhysicalExpCoverage);

                            count_InsuranceExpCPC++;
                        }

                        Count++;
                    }

                }



                /** */

                var Liabilityrows = [
                    {
                        name: TabLab_InsuranceExpNLT,
                        count: count_InsuranceExpNLT,
                    },
                    {
                        name: TabLab_InsuranceExpPrim,
                        count: count_InsuranceExpPrim,
                    },
                    {
                        name: TabLab_InsuranceOneDay,
                        count: count_InsuranceOneDay,
                    },
                    {
                        name: TabLab_InsuranceTwoDay,
                        count: count_InsuranceTwoDay,
                    },
                    {
                        name: TabLab_InsuranceSixDay,
                        count: count_InsuranceSixDay,
                    }
                ];
                var Physicalrows = [

                    {
                        name: TabLab_InsuranceExpCPC,
                        count: count_InsuranceExpCPC,
                    },
                    {
                        name: TabLab_InsuranceOneDay,
                        count: count_InsuranceOneDay,
                    },
                    {
                        name: TabLab_InsuranceTwoDay,
                        count: count_InsuranceTwoDay,
                    },
                    {
                        name: TabLab_InsuranceSixDay,
                        count: count_InsuranceSixDay,
                    }
                ];



                var table = "";

                table = "<link rel='stylesheet' href='https://system.netsuite.com/c.TSTDRV1064792/suitebundle178234/Agenda%20New/Customer_message_css.css'>" +
                    "<script>" +
                    "function popupCenter(pageURL, title,w,h) {" +
                    "var left = (screen.width/2)-(w/2);" +
                    "var top = (screen.height/2)-(h/2);" +
                    "var targetWin = window.open (pageURL, title, 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width='+w+', height='+h+', top='+top+', left='+left);" +
                    "}" +
                    "function editclaimsheet(id) {debugger;" +
                    "var left = (screen.width/2)-(500/2);" +
                    "var top = (screen.height/2)-(500/2);" +
                    "var url='https://8760954.app.netsuite.com/app/site/hosting/scriptlet.nl?script=1648&deploy=1&claim='+id;" +
                    "var targetWin = window.open (url, width=500, height=500);" +
                    "}" +
                    "function shownotesinsurancesheet(id) {debugger;" +
                    "var left = (screen.width/2)-(500/2);" +
                    "var top = (screen.height/2)-(500/2);" +
                    "var url='/app/site/hosting/scriptlet.nl?script=2643&deploy=1&ifrmcntnr=T&insclaim='+id;" +
                    "var targetWin = window.open (url,'notes' ,'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=700, height=300,top=300,left=200');" +
                    "}" +
                    "function showhistoryinsurancesheet(id) {debugger;" +
                    "var left = (screen.width/2)-(500/2);" +
                    "var top = (screen.height/2)-(500/2);" +
                    "var url='/app/site/hosting/scriptlet.nl?script=2642&deploy=1&ifrmcntnr=T&insclaim='+id;" +
                    "var targetWin = window.open (url,'notes' ,'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=1000, height=700,top=200,left=200');" +
                    "}" +
                    "</script>";

                table += "<style>" +
                    ".inner-table {" +
                    "width: 50%;" +
                    "margin: 20px auto;" +
                    "border: 1px solid rgb(0, 0, 0);" +
                    "border-radius: 8px;" +
                    "overflow: hidden;" +
                    "box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);" +
                    "background-color:rgb(255, 255, 255);" +
                    "}" +
                    "th{"+
                    "color: white;"+
                    "}"+
                    ".hovertr{" +
                    "background-color: rgba(96, 119, 153, 0.2);" +
                    "}" +
                    
                    ".hovertr:hover{" +
                    "background-color: rgba(96, 119, 153, 0.1);" +
                    "}" +

                    "</style>";

                table += "<table width='80%' ><tr><td>";
                table += "<table class='inner-table' width='50%' style=' border:1px solid white; border-collapse: collapse; min-height: 120px;'>";//max-width: 100%;
                table += "<tr class='hovertr' style='border-bottom:1px solid white; border-bottom:1px solid white; font-size:12px;' >" +
                    "<th width='50%'  style='border-right:1px solid white; font-size:11px; padding-left: 3px; background-color:rgba(96, 119, 153, 0.7); text-align:center;' ><b>Liability Insurance</b></th>" +
                    "<th width='50%'  style='text-align:center; font-size:13px; background-color:rgba(96, 119, 153, 0.7); ' ><b>Count</b></th>"
                "</tr>";
                // Construct table rows
                Liabilityrows.forEach(function (row) {
                    table += "<tr class='hovertr' style='border-bottom:1px solid white; border-bottom:1px solid white; font-size:12px;'>" +
                        "<td  width='50%' style='border-right:1px solid white; font-size:11px; padding-left: 3px;  ' >" + row.name + "</th>" +//background-color: rgb(223, 229, 233);
                        "<td  width='50%' style='text-align:center; font-size:13px;  ' >" + row.count + "</th>"//background-color: rgb(223, 229, 233);
                    "</tr>";
                });

                table += "</table>";
                table += "</td>";

                table += "<td>";
                table += "<table class='inner-table' width='50%' style=' border:1px solid white; border-collapse: collapse; min-height: 120px;'>";//max-width: 100%;
                table += "<tr class='hovertr' style='border-bottom:1px solid white; border-bottom:1px solid white;' class='hovertr'>" +
                    "<th width='50%' style='border-right:1px solid white; font-size:11px; padding-left: 3px; background-color:rgba(96, 119, 153, 0.7); text-align: center;' ><b>Physical Insurance</b></th>" +
                    "<th width='50%' style='text-align:center; font-size:13px; background-color:rgba(96, 119, 153, 0.7); ' ><b>Count</b></th>"
                "</tr>";
                // Construct table rows
                Physicalrows.forEach(function (row) {
                    table += "<tr class='hovertr' style='border-bottom:1px solid white; border-bottom:1px solid white;'>" +
                        "<td  width='50%' style='border-right:1px solid white; font-size:11px; padding-left: 3px;  ' >" + row.name + "</th>" +//background-color:rgb(223, 229, 233);
                        "<td  width='50%' style='text-align:center; font-size:13px;  ' >" + row.count + "</th>"//background-color: rgb(223, 229, 233);
                    "</tr>";
                });

                table += "</table>";
                table += "</td>";

                table += "</tr></table>";

                InlineHTMLField.defaultValue = table;

                form.addButton({
                    id: 'custpage_btn_email',
                    label: 'Send Email',
                    functionName: "IncuranceEmailPopup()"
                });

                form.clientScriptModulePath = 'SuiteScripts/LMR NEW/ADVS_CSNK_INSURANCE_DASH.js';

                Response.writePage(form);
            }
        }

        var NoteData = []; //USED IN GETINSURANCENOTESDATA FUNCTION

        function AddSublist(form, TabId, TabLable, RequiredTaskInfo, Type) {

            form.addTab({
                id: TabId,
                label: TabLable
            });

            var SublistID = "custpage_sublist_" + TabId;


            var SublistObj = form.addSublist({
                id: SublistID,
                type: serverWidget.SublistType.LIST,
                label: " ",
                tab: TabId
            });



            addSublistFields(SublistObj, RequiredTaskInfo, Type);

            // var FunctionName = 'EmailFor_' + TabId.replace('custpage_subtab_', '');
            // var FunctionName = 'IncuranceEmailPopup';

            // log.error("SublistID-> ", SublistID);

            // SublistObj.addButton({
            //     id: 'custpage_sub_btn_email',
            //     label: 'Email',
            //     functionName: FunctionName + "('" + TabLable + "')"
            // });

        }
        function addSublistFields(SublistObj, RequiredTaskInfo, Type) {


            SublistObj.addField({
                id: 'custpage_subfield_custdash',
                type: serverWidget.FieldType.TEXT,
                label: 'Cust Dash'
            });
            SublistObj.addField({
                id: 'custpage_subfield_note',
                type: serverWidget.FieldType.TEXT,
                label: 'Notes'
            });
            SublistObj.addField({
                id: 'custpage_subfield_vin',
                type: serverWidget.FieldType.TEXT,
                label: 'VIN(last 6)'
            });
            SublistObj.addField({
                id: 'custpage_subfield_custname',
                type: serverWidget.FieldType.TEXT,
                label: 'Customer Name'
            });
            SublistObj.addField({
                id: 'custpage_subfield_compname',
                type: serverWidget.FieldType.TEXT,
                label: 'Company Name'
            });

            SublistObj.addField({
                id: 'custpage_subfield_cust_phone',
                type: serverWidget.FieldType.TEXT,
                label: 'Customer Phone Num'
            });
            SublistObj.addField({
                id: 'custpage_subfield_ntl_primary',
                type: serverWidget.FieldType.TEXT,
                label: 'NTL/Primary'
            });
            SublistObj.addField({
                id: 'custpage_subfield_liab_exp_date',
                type: serverWidget.FieldType.TEXT,
                label: 'Liability Expiration Date'
            });
            SublistObj.addField({
                id: 'custpage_subfield_liab_carrier',
                type: serverWidget.FieldType.TEXT,
                label: 'Liability Carrier'
            });
            SublistObj.addField({
                id: 'custpage_subfield_phys_exp_date',
                type: serverWidget.FieldType.TEXT,
                label: 'Physical Expiration Date'
            });
            SublistObj.addField({
                id: 'custpage_subfield_phys_damage_cover',
                type: serverWidget.FieldType.TEXT,
                label: 'Insured Value'
            });
            SublistObj.addField({
                id: 'custpage_subfield_phys_carrier',
                type: serverWidget.FieldType.TEXT,
                label: 'Physical Carrier'
            });
            SublistObj.addField({
                id: 'custpage_subfield_cpc_start_date',
                type: serverWidget.FieldType.TEXT,
                label: 'CPC Start Date'
            });
            SublistObj.addField({
                id: 'custpage_subfield_history',
                type: serverWidget.FieldType.TEXT,
                label: 'History'
            });

            SublistObj.addField({
                id: 'custpage_subfield_lease_id',
                type: serverWidget.FieldType.SELECT,
                label: 'LeaseID',
                source: "customrecord_advs_lease_header"
            }).updateDisplayType({
                displayType: serverWidget.FieldDisplayType.HIDDEN
            });


        }
        function AddInsuranceClaimSub(form, TabId, TabLable) {

            form.addTab({
                id: TabId,
                label: TabLable
            });

            var SublistID = "custpage_sublist_" + TabId;
            /*var sublist = form.addSublist({
                id: SublistID,
                type: serverWidget.SublistType.LIST,
                label: " ",
                tab: TabId
            });*/
            createInsClaimSublist(form,TabId);


        }
        function SetSublistValueFun(SublistObj, Count, CustDash, NotesLink, VIN_lastsix, Customer, CompanyName, CustPhoneNum, Ntl_Primary, LiabiExpiryDate, LiabiCarrier, PhysiExpiryDate, PhysiCarrier, CPCSatrtDate, History, LeaseId,PhysicalExpCoverage) {

            SublistObj.setSublistValue({
                id: "custpage_subfield_custdash",
                line: Count,
                value: CustDash || " "
            });
            SublistObj.setSublistValue({
                id: "custpage_subfield_note",
                line: Count,
                value: NotesLink || " "
            });
            SublistObj.setSublistValue({
                id: "custpage_subfield_vin",
                line: Count,
                value: VIN_lastsix || " "
            });
            SublistObj.setSublistValue({
                id: "custpage_subfield_custname",
                line: Count,
                value: Customer || " "
            });
            SublistObj.setSublistValue({
                id: "custpage_subfield_compname",
                line: Count,
                value: CompanyName || " "
            });

            SublistObj.setSublistValue({
                id: "custpage_subfield_cust_phone",
                line: Count,
                value: CustPhoneNum || " "
            });
            SublistObj.setSublistValue({
                id: "custpage_subfield_ntl_primary",
                line: Count,
                value: Ntl_Primary || " "
            });
            SublistObj.setSublistValue({
                id: "custpage_subfield_liab_exp_date",
                line: Count,
                value: LiabiExpiryDate || " "
            });

            SublistObj.setSublistValue({
                id: "custpage_subfield_liab_carrier",
                line: Count,
                value: LiabiCarrier || " "
            });
            SublistObj.setSublistValue({
                id: "custpage_subfield_phys_exp_date",
                line: Count,
                value: PhysiExpiryDate || " "
            });
            SublistObj.setSublistValue({
                id: "custpage_subfield_phys_damage_cover",
                line: Count,
                value: PhysicalExpCoverage || " "
            });
            SublistObj.setSublistValue({
                id: "custpage_subfield_phys_carrier",
                line: Count,
                value: PhysiCarrier || " "
            });
            SublistObj.setSublistValue({
                id: "custpage_subfield_cpc_start_date",
                line: Count,
                value: CPCSatrtDate || " "
            });

            SublistObj.setSublistValue({
                id: "custpage_subfield_history",
                line: Count,
                value: "<a href=" + History + " target=\"_blank\"><i class='fa fa-history' style='font-size:18px'></i></a>" || " "
            });

            SublistObj.setSublistValue({
                id: "custpage_subfield_lease_id",
                line: Count,
                value: LeaseId || " "
            });



        }
        function createInsClaimSublist(form,TabId) {
            try {
                var sublistclaim = form.addSublist({
                    id: "custpage_sublist_custpage_subtab_insur_claim",
                    type: serverWidget.SublistType.LIST,
                    label: "List",
                    tab: TabId
                });
                sublistclaim.addButton({
                    id: 'claimform',
                    label: 'Claim',
                    functionName: 'opennewclaim()'
                });
                sublistclaim.addField({
                    id: 'cust_fi_editclaim',
                    type: serverWidget.FieldType.TEXT,
                    label: 'EDIT'
                });

                sublistclaim.addField({
                    id: 'cust_fi_truckstatus_claim',
                    type: serverWidget.FieldType.TEXT,
                    label: 'Truck Status'
                });
                sublistclaim.addField({
                    id: 'cust_fi_status_claim',
                    type: serverWidget.FieldType.TEXT,
                    label: 'Claim Status'
                });
                sublistclaim.addField({
                    id: 'cust_fi_f_l_name',
                    type: serverWidget.FieldType.TEXT,
                    label: 'Lesse Name'
                });
                sublistclaim.addField({
                    id: 'cust_fi_list_release_customer',
                    type: serverWidget.FieldType.TEXT,
                    label: 'Release to Customer'
                });
                sublistclaim.addField({
                    id: 'cust_fi_list_stock_number',
                    type: serverWidget.FieldType.TEXT,
                    label: 'Stock #'
                });
                sublistclaim.addField({
                    id: 'cust_fi_notes',
                    type: serverWidget.FieldType.TEXTAREA,
                    label: 'Notes'
                });
                sublistclaim.addField({
                    id: 'cust_fi_list_lease_no',
                    type: serverWidget.FieldType.TEXT,
                    label: 'Lease #'
                }).updateDisplayType({
                    displayType: "hidden"
                });
                sublistclaim.addField({
                    id: 'cust_fi_dateofloss',
                    type: serverWidget.FieldType.TEXT,
                    label: 'Date of Loss'
                });
                sublistclaim.addField({
                    id: 'cust_fi_desc_accident',
                    type: serverWidget.FieldType.TEXT,
                    label: 'Description of Claim'
                });
                sublistclaim.addField({
                    id: 'cust_fi_insurance_company',
                    type: serverWidget.FieldType.TEXT,
                    label: 'Insurance Company'
                });
                sublistclaim.addField({
                    id: 'cust_fi_claim_filed',
                    type: serverWidget.FieldType.TEXT,
                    label: 'Claim Filed'
                });

                sublistclaim.addField({
                    id: 'cust_fi_ins_doc',
                    type: serverWidget.FieldType.TEXT,
                    label: 'Claim #'
                });
                sublistclaim.addField({
                    id: 'cust_fi_adjuster_name',
                    type: serverWidget.FieldType.TEXT,
                    label: 'Adjuster'
                });

                sublistclaim.addField({
                    id: 'cust_fi_repairable',
                    type: serverWidget.FieldType.TEXT,
                    label: 'Unit Condition'
                });
                sublistclaim.addField({
                    id: 'cust_fi_veh_loc',
                    type: serverWidget.FieldType.TEXT,
                    label: 'Unit Location'
                });
                sublistclaim.addField({
                    id: 'cust_fi_in_tow_yard',
                    type: serverWidget.FieldType.TEXT,
                    label: 'Tow Yard'
                });
                sublistclaim.addField({
                    id: 'cust_fi_shop_contact',
                    type: serverWidget.FieldType.TEXT,
                    label: 'Shop Contact'
                });
                sublistclaim.addField({
                    id: 'cust_fi_total_loss_settlement',
                    type: serverWidget.FieldType.TEXT,
                    label: 'Total Loss Settlement'
                });
                sublistclaim.addField({
                    id: 'cust_fi_folowup',
                    type: serverWidget.FieldType.TEXT,
                    label: 'Next Followup'
                });
                sublistclaim.addField({
                    id: 'cust_fi_history',
                    type: serverWidget.FieldType.TEXT,
                    label: 'History'
                });
                // sublistclaim.addField({ id: 'cust_fi_ins_from',  type: serverWidget.FieldType.TEXT, label: 'Insurance From' });

                return sublistclaim;
            } catch (e) {
                log.debug('error in createInsClaimSublist', e.toString());
            }
        }
        function searchForclaimData(insueclaim_sublist, vinID, _vinText, ins_sts) {
            try {
                getInsuaranceNotesData();
                var ClaimSheetSearchObj = search.create({
                    type: "customrecord_advs_insurance_claim_sheet",
                    filters: [
                        ["isinactive", "is", "F"],
                        /* "AND",
                         ["custrecord_claim_settled","is","F"]*/
                    ],
                    columns: [
                        "custrecord_advs_ic_name",
                        "custrecord_advs_claim_status",
                        search.createColumn({
                            name: 'custrecord_advs_em_serial_number',
                            join: 'custrecord_advs_ic_vin_number'
                        }),
                        search.createColumn({
                            name: 'custrecord_advs_truck_master_status',
                            join: 'custrecord_advs_ic_vin_number'
                        }),
                        "custrecord_ic_date_of_loss",
                        "custrecord_ic_description_accident",
                        "custrecord_ic_claim_field",
                        "custrecord_advs_ic_insurance_company",
                        "custrecord_ic_adj_name_number",
                        "custrecord_advs_ic_adjuster_phone",
                        "custrecord_advs_ic_adjuster_email",
                        "custrecord_ic_repairable_type",
                        "custrecord_ic_location_vehicle",
                        "custrecord_advs_ic_in_tow_yard",
                        "custrecord_advs_ic_shop_contact_info",
                        "custrecord_tickler_followup",
                        "custrecord_ic_lease",
                        "custrecord_ins_release_customer",
                        "custrecord_ins_total_settlement",
                        "name"
                    ]
                });
                if (vinID != "" && vinID != undefined && vinID != null) {
                    ClaimSheetSearchObj.filters.push(search.createFilter({
                        name: "custrecord_advs_ic_vin_number",
                        operator: search.Operator.ANYOF,
                        values: vinID
                    }))
                }
                if (_vinText != "" && _vinText != undefined && _vinText != null) {
                    ClaimSheetSearchObj.filters.push(search.createFilter({
                        name: "name",
                        join: "custrecord_advs_ic_vin_number",
                        operator: search.Operator.CONTAINS,
                        values: _vinText
                    }))
                }
                if (ins_sts != "" && ins_sts != undefined && ins_sts != null) {
                    ClaimSheetSearchObj.filters.push(search.createFilter({
                        name: "custrecord_advs_claim_status",
                        operator: search.Operator.ANYOF,
                        values: ins_sts
                    }))
                }
                var count = 0;
                ClaimSheetSearchObj.run().each(function (result) {

                    var Stock_link = url.resolveRecord({
                        recordType: 'customrecord_advs_lease_header',
                        isEditMode: false
                    });
                    var claim_link = url.resolveRecord({
                        recordType: 'customrecord_advs_insurance_claim_sheet',
                        isEditMode: false
                    });
                    var adjuster_link = url.resolveRecord({
                        recordType: 'customrecord_advs_ins_adjuster',
                        isEditMode: false
                    });

                    var stock_carr = Stock_link + '&id=' + result.getValue({
                        name: 'custrecord_ic_lease'
                    });
                    var claim_carr = claim_link + '&id=' + result.id;
                    var adjuster_carr = adjuster_link + '&id=' + result.getValue({
                        name: 'custrecord_ic_adj_name_number'
                    });
                    var stockREcLink = '<a href="' + encodeURI(stock_carr) + '" target="_blank">' + encodeURI(result.getText({
                        name: 'custrecord_ic_lease'
                    })) + '</a>';
                    var claimREcLink = '<a href="' + encodeURI(claim_carr) + '" target="_blank">' + encodeURI(result.getValue({
                        name: 'name'
                    })) + '</a>';
                    var claimAdjusterLink = '<a href="' + encodeURI(adjuster_carr) + '" target="_blank">' + encodeURI(result.getText({
                        name: 'custrecord_ic_adj_name_number'
                    }) ||'') + '</a>';
                    var NotesArr = [];
                    var ClaimId = result.id;
                    if (NoteData[ClaimId] != null && NoteData[ClaimId] != undefined) {
                        var Length = NoteData[ClaimId].length;
                        for (var Len = 0; Len < Length; Len++) {
                            if (NoteData[ClaimId][Len] != null && NoteData[ClaimId][Len] != undefined) {
                                var DateTime = NoteData[ClaimId][Len]['DateTime'];
                                var Notes = NoteData[ClaimId][Len]['Notes'];
                                var DataStore = DateTime + '-' + Notes;
                                NotesArr.push(DataStore);
                            }
                        }
                    }

                    insueclaim_sublist.setSublistValue({
                        id: "cust_fi_f_l_name",
                        line: count,
                        value: result.getText('custrecord_advs_ic_name') || ' '
                    });
                    insueclaim_sublist.setSublistValue({
                        id: "cust_fi_status_claim",
                        line: count,
                        value: result.getText({
                            name: 'custrecord_advs_claim_status'
                        }) || ' '
                    });
                    insueclaim_sublist.setSublistValue({
                        id: "cust_fi_list_stock_number",
                        line: count,
                        value: result.getValue({
                            name: 'custrecord_advs_em_serial_number',
                            join: 'custrecord_advs_ic_vin_number'
                        }) || ' '
                    });

                        insueclaim_sublist.setSublistValue({
                            id: "cust_fi_list_release_customer",
                            line: count,
                            value:result.getText({
                                name: 'custrecord_ins_release_customer'
                            })||'No'
                        });
                        if(result.getValue({
                            name: 'custrecord_ins_total_settlement'
                        })!=''){
                            insueclaim_sublist.setSublistValue({
                                id: "cust_fi_total_loss_settlement",
                                line: count,
                                value:result.getValue({
                                    name: 'custrecord_ins_total_settlement'
                                })
                            });
                        }



                    insueclaim_sublist.setSublistValue({
                        id: "cust_fi_truckstatus_claim",
                        line: count,
                        value: result.getText({
                            name: 'custrecord_advs_truck_master_status',
                            join: 'custrecord_advs_ic_vin_number'
                        }) || ' '
                    });
                    insueclaim_sublist.setSublistValue({
                        id: "cust_fi_list_lease_no",
                        line: count,
                        value: stockREcLink
                    });
                    insueclaim_sublist.setSublistValue({
                        id: "cust_fi_dateofloss",
                        line: count,
                        value: result.getValue('custrecord_ic_date_of_loss') || ' '
                    });
                    insueclaim_sublist.setSublistValue({
                        id: "cust_fi_desc_accident",
                        line: count,
                        value: result.getValue({
                            name: 'custrecord_ic_description_accident'
                        }) || ' '
                    });
                    insueclaim_sublist.setSublistValue({
                        id: "cust_fi_claim_filed",
                        line: count,
                        value: result.getText({
                            name: 'custrecord_ic_claim_field'
                        }) || ' '
                    });
                    insueclaim_sublist.setSublistValue({
                        id: "cust_fi_insurance_company",
                        line: count,
                        value: result.getValue({
                            name: 'custrecord_advs_ic_insurance_company'
                        }) || ' '
                    });
                    insueclaim_sublist.setSublistValue({
                        id: "cust_fi_ins_doc",
                        line: count,
                        value: claimREcLink
                    });
                    insueclaim_sublist.setSublistValue({
                        id: "cust_fi_adjuster_name",
                        line: count,
                        value: claimAdjusterLink
                    });
                    insueclaim_sublist.setSublistValue({
                        id: "cust_fi_adjuster_phone",
                        line: count,
                        value: result.getValue({
                            name: 'custrecord_advs_ic_adjuster_phone'
                        }) || ' '
                    });
                    insueclaim_sublist.setSublistValue({
                        id: "cust_fi_adjuster_email",
                        line: count,
                        value: result.getValue({
                            name: 'custrecord_advs_ic_adjuster_email'
                        }) || ' '
                    });
                    insueclaim_sublist.setSublistValue({
                        id: "cust_fi_repairable",
                        line: count,
                        value: result.getText({
                            name: 'custrecord_ic_repairable_type'
                        }) || ' '
                    });
                    insueclaim_sublist.setSublistValue({
                        id: "cust_fi_veh_loc",
                        line: count,
                        value: result.getValue({
                            name: 'custrecord_ic_location_vehicle'
                        }) || ' '
                    });
                    insueclaim_sublist.setSublistValue({
                        id: "cust_fi_in_tow_yard",
                        line: count,
                        value: result.getText({
                            name: 'custrecord_advs_ic_in_tow_yard'
                        }) || ' '
                    });
                    insueclaim_sublist.setSublistValue({
                        id: "cust_fi_shop_contact",
                        line: count,
                        value: result.getValue({
                            name: 'custrecord_advs_ic_shop_contact_info'
                        }) || ' '
                    });
                    insueclaim_sublist.setSublistValue({
                        id: "cust_fi_folowup",
                        line: count,
                        value: result.getValue({
                            name: 'custrecord_tickler_followup'
                        }) || ' '
                    });
                    insueclaim_sublist.setSublistValue({
                        id: "cust_fi_notes",
                        line: count,
                        value: '<a href="#" onclick="shownotesinsurancesheet(' + result.id + ')"> <i class="fa fa-comment" style="color:blue;"</i></a>'//NotesArr
                    });
                    insueclaim_sublist.setSublistValue({
                        id: "cust_fi_editclaim",
                        line: count,
                        value: '<a href="#" onclick="editclaimsheet(' + result.id + ')"> <i class="fa fa-edit" style="color:blue;"</i></a>'
                    });
                    insueclaim_sublist.setSublistValue({
                        id: "cust_fi_history",
                        line: count,
                        value: '<a href="#" onclick="showhistoryinsurancesheet(' + result.id + ')"> <i class="fa fa-history" style="color:blue;"</i></a>'
                    });

                    count++;
                    return true;
                });

            } catch (e) {
                log.debug('error in searchForclaimData', e.toString())
            }
        }
        function getInsuaranceNotesData() {
            var InsuranceNotesSearchObj = search.create({
                type: "customrecord_advs_insurance_notes",
                filters: [
                    ["isinactive", "is", "F"],
                    "AND",
                    ["custrecord_advs_inf_parent_link", "noneof", "@NONE@"],
                    "AND",
                    ["custrecord_advs_inf_parent_link.custrecord_claim_settled", "is", "F"]
                ],
                columns: [
                    search.createColumn({
                        name: "custrecord_advs_inf_date_time"
                    }),
                    search.createColumn({
                        name: "custrecord_advs_inf_notes"
                    }),
                    search.createColumn({
                        name: "custrecord_advs_inf_parent_link"
                    })
                ]
            });
            var Len = 0;
            InsuranceNotesSearchObj.run().each(function (result) {
                var ClaimId = result.getValue('custrecord_advs_inf_parent_link');
                var DateTime = result.getValue('custrecord_advs_inf_date_time');
                var Notes = result.getValue('custrecord_advs_inf_notes');
                if (NoteData[ClaimId] != null && NoteData[ClaimId] != undefined) {
                    Len = NoteData[ClaimId].length;
                } else {
                    NoteData[ClaimId] = new Array();
                    Len = 0;
                }
                NoteData[ClaimId][Len] = new Array();
                NoteData[ClaimId][Len]['DateTime'] = DateTime;
                NoteData[ClaimId][Len]['Notes'] = Notes;
                return true;
            });
        }


        return {
            onRequest
        }

    });