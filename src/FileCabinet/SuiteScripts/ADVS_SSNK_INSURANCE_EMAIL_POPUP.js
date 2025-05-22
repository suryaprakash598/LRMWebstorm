/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
define(['N/runtime', 'N/search', 'N/ui/serverWidget', 'N/url', 'N/format', 'N/record', 'N/email'],
    /**
     * @param{runtime} runtime
     * @param{search} search
     * @param{serverWidget} serverWidget
     */
    (runtime, search, serverWidget, url, format, record, email) => {
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

                var ParamLabTab = Request.parameters.custparam_labtab;
                var Emailtemp = Request.parameters.custparam_emailtemp;

                var form = serverWidget.createForm({
                    title: "Insurance Email Dashboard"
                });
                
                //Date
                var DateObj = record.create({
                    type: "customrecord_advs_st_current_date_time",
                });

                var TodaysDate = DateObj.getValue({
                    fieldId: "custrecord_st_current_date"
                });

                var NewFullDate = new Date(TodaysDate);
                //Date

                var BucketSelect = form.addField({
                    id: "custpage_buucket",
                    label: "Bucket",
                    type: serverWidget.FieldType.SELECT
                });

                var TemplateField = form.addField({
                    id: "custpage_emailtemp",
                    label: "EmailTemplate",
                    type: serverWidget.FieldType.SELECT
                });

                var customrecord_advs_reg_dash_email_templSearchObj = search.create({
                    type: "customrecord_advs_reg_dash_email_templ",
                    filters:
                        [
                            ["isinactive", "is", "F"],
                            "AND",
                            ["internalid", "anyof", ["3", "4", "5", "6"]]
                        ],
                    columns:
                        [
                            search.createColumn({ name: "internalid", label: "InternalID" }),
                            search.createColumn({ name: "name", label: "Name" }),
                            search.createColumn({ name: "custrecord_advs_sub_reg_field", label: "Subject" }),
                            search.createColumn({ name: "custrecord_advs_template_reg_body", label: "Template Body" })
                        ]
                });

                TemplateField.addSelectOption({
                    value: " ",
                    text: " "
                });

                customrecord_advs_reg_dash_email_templSearchObj.run().each(function (result) {

                    var TemplateName = result.getValue({
                        name: "name"
                    });
                    var TemplateID = result.getValue({
                        name: "internalid"
                    });

                    TemplateField.addSelectOption({
                        value: TemplateID,
                        text: TemplateName
                    });

                    return true;
                });

                BucketSelect.addSelectOption({
                    value: " ",
                    text: " "
                });



                var TabLab_InsuranceExpNLT = "Insurance Exprired - NLT",
                    TabLab_InsuranceExpPrim = "Insurance Exprired - Primary",
                    TabLab_InsuranceExpCPC = "Insurance Expired - Cpc",
                    TabLab_InsuranceOneDay = "1 day until cancel",
                    TabLab_InsuranceTwoDay = "2-5 day until cancel",
                    TabLab_InsuranceSixDay = "6-30 day until cancel",
                    TabLab_InsuranceClaim = "Insurance Claim";

                var LableRows = [
                    {
                        name: TabLab_InsuranceExpNLT,
                        value: "1",
                    },
                    {
                        name: TabLab_InsuranceExpPrim,
                        value: "2",
                    },
                    {
                        name: TabLab_InsuranceExpCPC,
                        value: "3",
                    },
                    {
                        name: TabLab_InsuranceOneDay,
                        value: "4",
                    },
                    {
                        name: TabLab_InsuranceTwoDay,
                        value: "5",
                    },
                    {
                        name: TabLab_InsuranceSixDay,
                        value: "6",
                    }
                ];

                LableRows.forEach(function (row) {
                    BucketSelect.addSelectOption({
                        value: row.value,
                        text: row.name
                    });
                });




                var count_InsuranceExpNLT = 0,
                    count_InsuranceExpPrim = 0,
                    count_InsuranceExpCPC = 0,
                    count_InsuranceOneDay = 0,
                    count_InsuranceTwoDay = 0,
                    count_InsuranceSixDay = 0;

                var Today = new Date;

                var inlineHTML = form.addField({
                    id: "custpage_inlinehtml2",
                    type: serverWidget.FieldType.INLINEHTML,
                    label: " "
                });
                inlineHTML.defaultValue = '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">';
                if(Emailtemp){
                    TemplateField.defaultValue = Emailtemp;
                }
                if(ParamLabTab){
                    BucketSelect.defaultValue = ParamLabTab;
                }

                // log.error("Today-> ", Today);
                if (ParamLabTab == "1") {
                    AddSublist(form, "custpage_subtab_insur_exp_ntl", TabLab_InsuranceExpNLT, ParamLabTab, null);
                } else if (ParamLabTab == "2") {
                    AddSublist(form, "custpage_subtab_insur_exp_prim", TabLab_InsuranceExpPrim, ParamLabTab, null);
                } else if (ParamLabTab == "3") {
                    AddSublist(form, "custpage_subtab_insur_exp_cpc", TabLab_InsuranceExpCPC, ParamLabTab, null);
                } else if (ParamLabTab == "4") {
                    AddSublist(form, "custpage_subtab_insur_oneday_cancel", TabLab_InsuranceOneDay, ParamLabTab, null);
                } else if (ParamLabTab == "5") {
                    AddSublist(form, "custpage_subtab_insur_twoday_cancel", TabLab_InsuranceTwoDay, ParamLabTab, null);
                } else if (ParamLabTab == "6") {
                    AddSublist(form, "custpage_subtab_insur_sixday_cancel", TabLab_InsuranceSixDay, ParamLabTab, null);
                }



                // AddInsuranceClaimSub(form, "custpage_subtab_insur_claim", TabLab_InsuranceClaim, null, null);

                // var insurClaimSublist = form.getSublist({
                //     id: 'custpage_sublist_custpage_subtab_insur_claim'
                // });
                // searchForclaimData(insurClaimSublist);

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
                            search.createColumn({ name: "custrecord_advs_l_h_ins_lia_exp_dt", label: "Liability Expiration Date" }),
                            search.createColumn({ name: "custrecord_advs_l_a_curr_cps", label: "Current CPC" }),
                            search.createColumn({ name: "custrecord_advs_l_h_customer_name", label: "Lessee Name " }),
                            search.createColumn({ name: "custrecord_advs_la_vin_bodyfld", label: "VIN" }),
                            search.createColumn({ name: "custrecord_advs_liability_type_f", label: "Liability Type" }),
                            search.createColumn({ name: "custrecord_advs_l_a_cpc", label: "Cpc Check" }),
                            search.createColumn({ name: "custrecord_advs_phy_dmg_cover", label: "PhysicalDmgCover" }),
                            search.createColumn({
                                name: "custrecord_advs_vm_vehicle_brand",
                                join: "CUSTRECORD_ADVS_LA_VIN_BODYFLD",
                                label: "Vehicle Brand"
                            }),
                            search.createColumn({
                                name: "custrecord_advs_vm_model_year",
                                join: "CUSTRECORD_ADVS_LA_VIN_BODYFLD",
                                label: "Model year"
                            }),
                            search.createColumn({
                                name: "custrecord_advs_vm_model",
                                join: "CUSTRECORD_ADVS_LA_VIN_BODYFLD",
                                label: "Model"
                            }),
                            search.createColumn({
                                name: "custrecord_advs_em_serial_number",
                                join: "CUSTRECORD_ADVS_LA_VIN_BODYFLD",
                                label: "Serial Number"
                            }),
                            search.createColumn({
                                name: "companyname",
                                join: "custrecord_advs_l_h_customer_name",
                                label: "Company Name"
                            }),
                            search.createColumn({
                                name: "phone",
                                join: "custrecord_advs_l_h_customer_name",
                                label: "Phone"
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
                    var VinId = result.getText({
                        name: "custrecord_advs_la_vin_bodyfld",
                    });
                    var CPCCheck = result.getValue({
                        name: "custrecord_advs_l_a_cpc",
                    });
                    var PhysicalDmgCover = result.getText({
                        name: "custrecord_advs_phy_dmg_cover",
                    });

                    var vmModel = result.getText({
                        name: "custrecord_advs_vm_model",
                        join: "custrecord_advs_la_vin_bodyfld"
                    });
                    var vmModelYear = result.getText({
                        name: "custrecord_advs_vm_model_year",
                        join: "custrecord_advs_la_vin_bodyfld"
                    });
                    var vmModelMake = result.getText({
                        name: "custrecord_advs_vm_vehicle_brand",
                        join: "custrecord_advs_la_vin_bodyfld"
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
                    var CPCSatrtDate = result.getValue({
                        name: "custrecord_advs_cpc_date",
                        join: "CUSTRECORD_ADVS_L_A_CURR_CPS"
                    });


                    if (LeaseArray.indexOf(LeaseID) == -1) {
                        LeaseArray.push(LeaseID);
                        LeaseDataArray[LeaseID] = new Array();
                        LeaseDataArray[LeaseID]['LiabilityCarrier'] = LiabilityCarrier;
                        LeaseDataArray[LeaseID]['PhysicalCarrier'] = PhysicalCarrier;
                        LeaseDataArray[LeaseID]['PhysicalExpDate'] = PhysicalExpDate;
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
                        LeaseDataArray[LeaseID]['PhysicalDmgCover'] = PhysicalDmgCover;
                        LeaseDataArray[LeaseID]['vmModel'] = vmModel;
                        LeaseDataArray[LeaseID]['vmModelYear'] = vmModelYear;
                        LeaseDataArray[LeaseID]['vmModelMake'] = vmModelMake;
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
                        var PhysicalDmgCover = LeaseDataArray[LeaseId]['PhysicalDmgCover'];
                        var vmModel = LeaseDataArray[LeaseId]['vmModel'];
                        var vmModelYear = LeaseDataArray[LeaseId]['vmModelYear'];
                        var vmModelMake = LeaseDataArray[LeaseId]['vmModelMake'];

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

                        var oneSublistObj = form.getSublist({
                            id: 'custpage_sublist_custpage_subtab_insur_oneday_cancel'
                        });


                        var Insurance1 = PhysicalDmgCover + "@nk@" + vmModel + "@nk@" + vmModelYear + "@nk@" + vmModelMake;

                        if (oneSublistObj) {
                            if ((PhyDiffInDays > 0) && (PhyDiffInDays <= 1)) {

                                SetSublistValueFun(oneSublistObj, count_InsuranceOneDay, CustDash, NotesLink, VinLastSix, CustomerName, CompanyName, MobilePhone, LiabilityType, LiabilityExpDate, LiabilityCarrier, PhysicalExpDate, PhysicalCarrier, CPCSatrtDate, History, LeaseId, VinId, CustomerId, Insurance1);

                                count_InsuranceOneDay++;
                            } else if ((LiabDiffInDays > 0) && (LiabDiffInDays <= 1)) {

                                SetSublistValueFun(oneSublistObj, count_InsuranceOneDay, CustDash, NotesLink, VinLastSix, CustomerName, CompanyName, MobilePhone, LiabilityType, LiabilityExpDate, LiabilityCarrier, PhysicalExpDate, PhysicalCarrier, CPCSatrtDate, History, LeaseId, VinId, CustomerId, Insurance1);

                                count_InsuranceOneDay++;
                            }
                        }

                        var twoSublistObj = form.getSublist({
                            id: 'custpage_sublist_custpage_subtab_insur_twoday_cancel'
                        });
                        if (twoSublistObj) {
                            if ((PhyDiffInDays >= 2) && (PhyDiffInDays <= 5)) {

                                SetSublistValueFun(twoSublistObj, count_InsuranceTwoDay, CustDash, NotesLink, VinLastSix, CustomerName, CompanyName, MobilePhone, LiabilityType, LiabilityExpDate, LiabilityCarrier, PhysicalExpDate, PhysicalCarrier, CPCSatrtDate, History, LeaseId, VinId, CustomerId, Insurance1);

                                count_InsuranceTwoDay++;
                            } else if ((LiabDiffInDays >= 2) && (LiabDiffInDays <= 5)) {

                                SetSublistValueFun(twoSublistObj, count_InsuranceTwoDay, CustDash, NotesLink, VinLastSix, CustomerName, CompanyName, MobilePhone, LiabilityType, LiabilityExpDate, LiabilityCarrier, PhysicalExpDate, PhysicalCarrier, CPCSatrtDate, History, LeaseId, VinId, CustomerId, Insurance1);

                                count_InsuranceTwoDay++;
                            }
                        }

                        var sixSublistObj = form.getSublist({
                            id: 'custpage_sublist_custpage_subtab_insur_sixday_cancel'
                        });

                        if (sixSublistObj) {
                            if ((PhyDiffInDays >= 6) && (PhyDiffInDays <= 30)) {

                                SetSublistValueFun(sixSublistObj, count_InsuranceSixDay, CustDash, NotesLink, VinLastSix, CustomerName, CompanyName, MobilePhone, LiabilityType, LiabilityExpDate, LiabilityCarrier, PhysicalExpDate, PhysicalCarrier, CPCSatrtDate, History, LeaseId, VinId, CustomerId, Insurance1);

                                count_InsuranceSixDay++;
                            } else if ((LiabDiffInDays >= 6) && (LiabDiffInDays <= 30)) {

                                SetSublistValueFun(sixSublistObj, count_InsuranceSixDay, CustDash, NotesLink, VinLastSix, CustomerName, CompanyName, MobilePhone, LiabilityType, LiabilityExpDate, LiabilityCarrier, PhysicalExpDate, PhysicalCarrier, CPCSatrtDate, History, LeaseId, VinId, CustomerId, Insurance1);

                                count_InsuranceSixDay++;
                            }
                        }

                        if ((LiabilityType == "Primary") && (LiabDiffInDays < 0)) {

                            var primSublistObj = form.getSublist({
                                id: 'custpage_sublist_custpage_subtab_insur_exp_prim'
                            });

                            if (primSublistObj) {
                                // var RedLiabilityExpDate = "<span style='color: red; '>" + LiabilityExpDate + "</span>";


                                SetSublistValueFun(primSublistObj, count_InsuranceExpPrim, CustDash, NotesLink, VinLastSix, CustomerName, CompanyName, MobilePhone, LiabilityType, LiabilityExpDate, LiabilityCarrier, PhysicalExpDate, PhysicalCarrier, CPCSatrtDate, History, LeaseId, VinId, CustomerId, Insurance1);

                                count_InsuranceExpPrim++;
                            }
                        } else if ((LiabilityType == "Non Trucking") && (LiabDiffInDays < 0)) {

                            var ntlSublistObj = form.getSublist({
                                id: 'custpage_sublist_custpage_subtab_insur_exp_ntl'
                            });

                            if (ntlSublistObj) {
                                // var RedLiabilityExpDate = "<span style='color: red; '>" + LiabilityExpDate + "</span>";

                                SetSublistValueFun(ntlSublistObj, count_InsuranceExpNLT, CustDash, NotesLink, VinLastSix, CustomerName, CompanyName, MobilePhone, LiabilityType, LiabilityExpDate, LiabilityCarrier, PhysicalExpDate, PhysicalCarrier, CPCSatrtDate, History, LeaseId, VinId, CustomerId, Insurance1);

                                count_InsuranceExpNLT++;
                            }
                        } else if ((CPCCheck == "true" || CPCCheck == true || CPCCheck == "T") && (PhyDiffInDays < 0)) {

                            // var RedPhysicalExpDate = "<span style='color: red; '>" + PhysicalExpDate + "</span>";

                            var cpcSublistObj = form.getSublist({
                                id: 'custpage_sublist_custpage_subtab_insur_exp_cpc'
                            });

                            if (cpcSublistObj) {
                                SetSublistValueFun(cpcSublistObj, count_InsuranceExpCPC, CustDash, NotesLink, VinLastSix, CustomerName, CompanyName, MobilePhone, LiabilityType, LiabilityExpDate, LiabilityCarrier, PhysicalExpDate, PhysicalCarrier, CPCSatrtDate, History, LeaseId, VinId, CustomerId, Insurance1);

                                count_InsuranceExpCPC++;
                            }
                        }

                        Count++;
                    }

                }



                /** */

                // var Liabilityrows = [
                //     {
                //         name: TabLab_InsuranceExpNLT,
                //         count: count_InsuranceExpNLT,
                //     },
                //     {
                //         name: TabLab_InsuranceExpPrim,
                //         count: count_InsuranceExpPrim,
                //     },
                //     {
                //         name: TabLab_InsuranceOneDay,
                //         count: count_InsuranceOneDay,
                //     },
                //     {
                //         name: TabLab_InsuranceTwoDay,
                //         count: count_InsuranceTwoDay,
                //     },
                //     {
                //         name: TabLab_InsuranceSixDay,
                //         count: count_InsuranceSixDay,
                //     }
                // ];
                // var Physicalrows = [

                //     {
                //         name: TabLab_InsuranceExpCPC,
                //         count: count_InsuranceExpCPC,
                //     },
                //     {
                //         name: TabLab_InsuranceOneDay,
                //         count: count_InsuranceOneDay,
                //     },
                //     {
                //         name: TabLab_InsuranceTwoDay,
                //         count: count_InsuranceTwoDay,
                //     },
                //     {
                //         name: TabLab_InsuranceSixDay,
                //         count: count_InsuranceSixDay,
                //     }
                // ];



                // var table = "";

                // table = "<link rel='stylesheet' href='https://system.netsuite.com/c.TSTDRV1064792/suitebundle178234/Agenda%20New/Customer_message_css.css'>" +
                //     "<script>" +
                //     "function popupCenter(pageURL, title,w,h) {" +
                //     "var left = (screen.width/2)-(w/2);" +
                //     "var top = (screen.height/2)-(h/2);" +
                //     "var targetWin = window.open (pageURL, title, 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width='+w+', height='+h+', top='+top+', left='+left);" +
                //     "}" +
                //     "function editclaimsheet(id) {debugger;" +
                //     "var left = (screen.width/2)-(500/2);" +
                //     "var top = (screen.height/2)-(500/2);" +
                //     "var url='https://8760954.app.netsuite.com/app/site/hosting/scriptlet.nl?script=1648&deploy=1&claim='+id;" +
                //     "var targetWin = window.open (url, width=500, height=500);" +
                //     "}" +
                //     "</script>";

                // table += "<table width='100%' ><tr><td>";
                // table += "<table width='50%' style=' border:1px solid black; border-collapse: collapse; '>";//max-width: 100%;
                // table += "<tr style='border-bottom:1px solid black; border-bottom:1px solid black; font-size:12px;'>" +
                //     "<th width='50%' style='border-right:1px solid black; font-size:11px; padding-left: 3px; background-color:rgb(223, 229, 233); ' ><b>Liability Insurance</b></th>" +
                //     "<th width='50%' style='text-align:center; font-size:13px; background-color: rgb(223, 229, 233); ' ><b>Count</b></th>"
                // "</tr>";
                // // Construct table rows
                // Liabilityrows.forEach(function (row) {
                //     table += "<tr style='border-bottom:1px solid black; border-bottom:1px solid black; font-size:12px;'>" +
                //         "<th width='50%' style='border-right:1px solid black; font-size:11px; padding-left: 3px; background-color: rgb(223, 229, 233); ' >" + row.name + "</th>" +
                //         "<th width='50%' style='text-align:center; font-size:13px; background-color: rgb(223, 229, 233); ' >" + row.count + "</th>"
                //     "</tr>";
                // });

                // table += "</table>";
                // table += "</td>";

                // table += "<td>";
                // table += "<table width='50%' style=' border:1px solid black; border-collapse: collapse; '>";//max-width: 100%;
                // table += "<tr style='border-bottom:1px solid black; border-bottom:1px solid black;'>" +
                //     "<th width='50%' style='border-right:1px solid black; font-size:11px; padding-left: 3px; background-color: rgb(223, 229, 233); ' ><b>Physical Insurance</b></th>" +
                //     "<th width='50%' style='text-align:center; font-size:13px; background-color: rgb(223, 229, 233); ' ><b>Count</b></th>"
                // "</tr>";
                // // Construct table rows
                // Physicalrows.forEach(function (row) {
                //     table += "<tr style='border-bottom:1px solid black; border-bottom:1px solid black;'>" +
                //         "<th width='50%' style='border-right:1px solid black; font-size:11px; padding-left: 3px; background-color:rgb(223, 229, 233); ' >" + row.name + "</th>" +
                //         "<th width='50%' style='text-align:center; font-size:13px; background-color: rgb(223, 229, 233); ' >" + row.count + "</th>"
                //     "</tr>";
                // });

                // table += "</table>";
                // table += "</td>";

                // table += "</tr></table>";

                // InlineHTMLField.defaultValue = table;

                form.clientScriptModulePath = 'SuiteScripts/LMR NEW/ADVS_CSNK_INSUR_EMAIL_POPUP.js';

                Response.writePage(form);

            } else {
                var SublistID = Request.parameters.custpage_sublistid;
                var EmailTemplate = Request.parameters.custpage_emailtemp;
                var EmailTempRecType = "customrecord_advs_reg_dash_email_templ";

                var User = runtime.getCurrentUser();
                var UserId = User.id;

                if (EmailTemplate) {

                    var EmailTempRecObj = record.load({
                        type: EmailTempRecType,
                        id: EmailTemplate
                    });

                    var TemplateSubject = EmailTempRecObj.getValue({
                        fieldId: "custrecord_advs_sub_reg_field"
                    });
                    var TemplateBody = EmailTempRecObj.getValue({
                        fieldId: "custrecord_advs_template_reg_body"
                    });


                    if (SublistID) {

                        var LineCount = Request.getLineCount({
                            group: SublistID
                        });

                        for (var i = 0; i < LineCount; i++) {

                            var Mark = Request.getSublistValue({
                                name: "custpage_subfield_mark",
                                group: SublistID,
                                line: i
                            });


                            if (Mark == true || Mark == "true" || Mark == "T") {

                                var CustomerName = Request.getSublistValue({
                                    name: "custpage_subfield_custname",
                                    group: SublistID,
                                    line: i
                                });
                                var VINLastSix = Request.getSublistValue({
                                    name: "custpage_subfield_vin",
                                    group: SublistID,
                                    line: i
                                });
                                var CompanyName = Request.getSublistValue({
                                    name: "custpage_subfield_compname",
                                    group: SublistID,
                                    line: i
                                });
                                var CustomerPhone = Request.getSublistValue({
                                    name: "custpage_subfield_cust_phone",
                                    group: SublistID,
                                    line: i
                                });
                                var LiabilityStatus = Request.getSublistValue({
                                    name: "custpage_subfield_ntl_primary",
                                    group: SublistID,
                                    line: i
                                });
                                var LiabExpDate = Request.getSublistValue({
                                    name: "custpage_subfield_liab_exp_date",
                                    group: SublistID,
                                    line: i
                                });
                                var LiabCarrier = Request.getSublistValue({
                                    name: "custpage_subfield_liab_carrier",
                                    group: SublistID,
                                    line: i
                                });
                                var PhysExpDate = Request.getSublistValue({
                                    name: "custpage_subfield_phys_exp_date",
                                    group: SublistID,
                                    line: i
                                });
                                var PhysCarrier = Request.getSublistValue({
                                    name: "custpage_subfield_phys_carrier",
                                    group: SublistID,
                                    line: i
                                });
                                var insurance1 = Request.getSublistValue({
                                    name: "custpage_subfield_insurance1",
                                    group: SublistID,
                                    line: i
                                });

                                var LeaseId = Request.getSublistValue({
                                    name: "custpage_subfield_lease_id",
                                    group: SublistID,
                                    line: i
                                });
                                var VinTxt = Request.getSublistValue({
                                    name: "custpage_subfield_vin_txt",
                                    group: SublistID,
                                    line: i
                                });
                                var CustomerId = Request.getSublistValue({
                                    name: "custpage_subfield_custid",
                                    group: SublistID,
                                    line: i
                                });

                                var CpcStartDate = Request.getSublistValue({
                                    name: "custpage_subfield_cpc_start_date",
                                    group: SublistID,
                                    line: i
                                });

                                if (EmailTemplate == 3 || EmailTemplate == '3') {

                                    log.error("CpcStartDate-> ", CpcStartDate);
                                    if (CpcStartDate && (CpcStartDate != null && CpcStartDate != "null" && CpcStartDate != "" && CpcStartDate != " ")) {

                                        var NewCpcStartDate = new Date(CpcStartDate);
                                        log.error("NewCpcStartDate-> ", NewCpcStartDate);
                                        if (NewCpcStartDate && (NewCpcStartDate != null && NewCpcStartDate != "null" && NewCpcStartDate != "" && NewCpcStartDate != " ")) {

                                            // Add 30 days and preserve the Date object
                                            // LeaseAgreeDate.setDate(LeaseAgreeDate.getDate() + 30);

                                            var CpcDay = NewCpcStartDate.getDay();
                                            var CpcDate = NewCpcStartDate.getDate();
                                            var CpcMonth = NewCpcStartDate.getMonth();
                                            var CpcYear = NewCpcStartDate.getFullYear();

                                            var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                                            var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

                                            var CpcDayName = days[CpcDay];

                                            var CpcMonthName = months[CpcMonth];

                                            var NewTemplateBody = TemplateBody.replace(/@DAY@/g, CpcDayName).replace(/@DATE@/g, CpcMonthName + " " + CpcDate + "," + CpcYear).replace(/@CustomerName@/g, CustomerName).replace(/@SerialNumber@/g, VINLastSix).replace(/@VIN@/g, VinTxt).replace(/@CompanyName@/g, CompanyName);
                                            var NewTemplateSubject = TemplateSubject.replace(/@DAY@/g, CpcDayName).replace(/@DATE@/g, CpcMonthName + " " + CpcDate + "," + CpcYear).replace(/@CustomerName@/g, CustomerName).replace(/@SerialNumber@/g, VINLastSix).replace(/@VIN@/g, VinTxt).replace(/@CompanyName@/g, CompanyName);

                                            if (insurance1) {
                                                var insurance1Split = insurance1.split("@nk@");
                                                var PhysDmgCover = insurance1Split[0];
                                                var Model = insurance1Split[1];
                                                var ModelYear = insurance1Split[2];
                                                var ModelMake = insurance1Split[3];

                                                if (PhysDmgCover) {
                                                    NewTemplateBody = NewTemplateBody.replace(/@PhysicalDamageCover@/g, PhysDmgCover);
                                                }
                                                if (Model) {
                                                    NewTemplateBody = NewTemplateBody.replace(/@Model@/g, Model);
                                                }
                                                if (ModelYear) {
                                                    NewTemplateBody = NewTemplateBody.replace(/@Year@/g, ModelYear);
                                                }
                                                if (ModelMake) {
                                                    NewTemplateBody = NewTemplateBody.replace(/@Make@/g, ModelMake);
                                                }

                                            }
                                            try {

                                                if (CustomerId) {

                                                    email.send({
                                                        author: UserId,
                                                        body: NewTemplateBody,
                                                        // recipients: "nikunj.k@advectus.net",
                                                        recipients: CustomerId,
                                                        subject: NewTemplateSubject
                                                    });
                                                }

                                                log.error("SENT->", "EMAIL SENT SUCCESSFULLY! ->" + CustomerId)

                                            } catch (err) {
                                                log.error("EMAIL_ERROR", err.message)
                                            }
                                        }
                                    }
                                } else if (EmailTemplate == "4" || EmailTemplate == 4) {

                                    if (PhysExpDate) {

                                        var NewPhysExpDate = new Date(PhysExpDate);
                                        log.error("NewPhysExpDate-> ", NewPhysExpDate);

                                        // Add 30 days and preserve the Date object
                                        // LeaseAgreeDate.setDate(LeaseAgreeDate.getDate() + 30);

                                        var PhyExpDay = NewPhysExpDate.getDay();
                                        var PhyExpDate = NewPhysExpDate.getDate();
                                        var PhyExpMonth = NewPhysExpDate.getMonth();
                                        var PhyExpYear = NewPhysExpDate.getFullYear();

                                        var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                                        var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

                                        var PhyExpDayName = days[PhyExpDay];

                                        var PhyExpMonthName = months[PhyExpMonth];

                                        var NewTemplateBody = TemplateBody.replace(/@DAY@/g, PhyExpDayName).replace(/@DATE@/g, PhyExpMonthName + " " + PhyExpDate + "," + PhyExpYear).replace(/@CustomerName@/g, CustomerName).replace(/@SerialNumber@/g, VINLastSix).replace(/@VIN@/g, VinTxt).replace(/@CompanyName@/g, CompanyName);
                                        var NewTemplateSubject = TemplateSubject.replace(/@DAY@/g, PhyExpDayName).replace(/@DATE@/g, PhyExpMonthName + " " + PhyExpDate + "," + PhyExpYear).replace(/@CustomerName@/g, CustomerName).replace(/@SerialNumber@/g, VINLastSix).replace(/@VIN@/g, VinTxt).replace(/@CompanyName@/g, CompanyName);

                                        try {

                                            if (CustomerId) {

                                                email.send({
                                                    author: UserId,
                                                    body: NewTemplateBody,
                                                    // recipients: "nikunj.k@advectus.net",
                                                    recipients: CustomerId,
                                                    subject: NewTemplateSubject
                                                });
                                            }

                                            log.error("SENT->", "EMAIL SENT SUCCESSFULLY! ->" + CustomerId)

                                        } catch (err) {
                                            log.error("EMAIL_ERROR", err.message)
                                        }

                                    }

                                } else if (EmailTemplate == "5" || EmailTemplate == 5) {

                                    if (PhysExpDate) {

                                        var NewPhysExpDate = new Date(PhysExpDate);
                                        log.error("NewPhysExpDate-> ", NewPhysExpDate);

                                        // Add 30 days and preserve the Date object
                                        // LeaseAgreeDate.setDate(LeaseAgreeDate.getDate() + 30);

                                        var PhyExpDay = NewPhysExpDate.getDay();
                                        var PhyExpDate = NewPhysExpDate.getDate();
                                        var PhyExpMonth = NewPhysExpDate.getMonth();
                                        var PhyExpYear = NewPhysExpDate.getFullYear();

                                        var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                                        var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

                                        var PhyExpDayName = days[PhyExpDay];

                                        var PhyExpMonthName = months[PhyExpMonth];

                                        var NewTemplateBody = TemplateBody.replace(/@DAY@/g, PhyExpDayName).replace(/@DATE@/g, PhyExpMonthName + " " + PhyExpDate + "," + PhyExpYear).replace(/@CustomerName@/g, CustomerName).replace(/@SerialNumber@/g, VINLastSix).replace(/@VIN@/g, VinTxt).replace(/@CompanyName@/g, CompanyName);
                                        var NewTemplateSubject = TemplateSubject.replace(/@DAY@/g, PhyExpDayName).replace(/@DATE@/g, PhyExpMonthName + " " + PhyExpDate + "," + PhyExpYear).replace(/@CustomerName@/g, CustomerName).replace(/@SerialNumber@/g, VINLastSix).replace(/@VIN@/g, VinTxt).replace(/@CompanyName@/g, CompanyName);

                                        try {

                                            if (CustomerId) {

                                                email.send({
                                                    author: UserId,
                                                    body: NewTemplateBody,
                                                    // recipients: "nikunj.k@advectus.net",
                                                    recipients: CustomerId,
                                                    subject: NewTemplateSubject
                                                });
                                            }

                                            log.error("SENT->", "EMAIL SENT SUCCESSFULLY! ->" + CustomerId)

                                        } catch (err) {
                                            log.error("EMAIL_ERROR", err.message)
                                        }

                                    }

                                } else if (EmailTemplate == "6" || EmailTemplate == 6) {

                                    if (LiabExpDate && (LiabilityStatus == "Primary")) {

                                        var NewLiabExpDate = new Date(LiabExpDate);

                                        log.error("NewLiabExpDate, LiabExpDate-> ", NewLiabExpDate + ", " + LiabExpDate);

                                        // Add 30 days and preserve the Date object
                                        // LeaseAgreeDate.setDate(LeaseAgreeDate.getDate() + 30);

                                        var LiabExpDay = NewLiabExpDate.getDay();
                                        var LiabExpDate = NewLiabExpDate.getDate();
                                        var LiabExpMonth = NewLiabExpDate.getMonth();
                                        var LiabExpYear = NewLiabExpDate.getFullYear();

                                        var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                                        var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

                                        var LiabExpDayName = days[LiabExpDay];

                                        var LiabExpMonthName = months[LiabExpMonth];

                                        var NewTemplateBody = TemplateBody.replace(/@DAY@/g, LiabExpDayName).replace(/@DATE@/g, LiabExpMonthName + " " + LiabExpDate + "," + LiabExpYear).replace(/@CustomerName@/g, CustomerName).replace(/@SerialNumber@/g, VINLastSix).replace(/@VIN@/g, VinTxt).replace(/@CompanyName@/g, CompanyName);
                                        var NewTemplateSubject = TemplateSubject.replace(/@DAY@/g, LiabExpDayName).replace(/@DATE@/g, LiabExpMonthName + " " + LiabExpDate + "," + LiabExpYear).replace(/@CustomerName@/g, CustomerName).replace(/@SerialNumber@/g, VINLastSix).replace(/@VIN@/g, VinTxt).replace(/@CompanyName@/g, CompanyName);

                                        try {

                                            if (CustomerId) {

                                                email.send({
                                                    author: UserId,
                                                    body: NewTemplateBody,
                                                    // recipients: "nikunj.k@advectus.net",
                                                    recipients: CustomerId,
                                                    subject: NewTemplateSubject
                                                });
                                            }

                                            log.error("SENT->", "EMAIL SENT SUCCESSFULLY! -> " + CustomerId)

                                        } catch (err) {
                                            log.error("EMAIL_ERROR", err.message)
                                        }

                                    }

                                }

                            }

                        }
                    }

                }




                var onclickScript = " <html><body> <script type='text/javascript'>";

                onclickScript += "try{";
                onclickScript += "window.close()";
                onclickScript += "}catch(e){}</script></body></html>";
                scriptContext.response.write(onclickScript);


            }
        }

        function AddSublist(form, TabId, TabLable, ParamLabTab, Type) {

            form.addTab({
                id: TabId,
                label: TabLable
            });

            var SublistID = "custpage_sublist_" + TabId;

            log.error("SublistID-> ",SublistID);

            var SublistObj = form.addSublist({
                id: SublistID,
                type: serverWidget.SublistType.LIST,
                label: " ",
                tab: TabId
            });
            var SublistIDField = form.addField({
                id: "custpage_sublistid",
                type: serverWidget.FieldType.TEXT,
                label: "SublistID"
            }).updateDisplayType({
                displayType: serverWidget.FieldDisplayType.HIDDEN
            });

            SublistIDField.defaultValue = SublistID;


            addSublistFields(SublistObj, ParamLabTab, Type);

            // var FunctionName = 'EmailFor_' + TabId.replace('custpage_subtab_', '');
            // var FunctionName = 'IncuranceEmailPopup';

            // log.error("SublistID-> ", SublistID);

            // SublistObj.addButton({
            //     id: 'custpage_sub_btn_email',
            //     label: 'Email',
            //     functionName: FunctionName + "('" + TabLable + "')"
            // });

            if (ParamLabTab) {
                form.addSubmitButton({
                    label: "Email"
                });
            }

        }

        function addSublistFields(SublistObj, ParamLabTab, Type) {

            SublistObj.addField({
                id: 'custpage_subfield_mark',
                type: serverWidget.FieldType.CHECKBOX,
                label: 'Mark'
            });
            // SublistObj.addField({
            //     id: 'custpage_subfield_custdash',
            //     type: serverWidget.FieldType.TEXT,
            //     label: 'Cust Dash'
            // });
            // SublistObj.addField({
            //     id: 'custpage_subfield_note',
            //     type: serverWidget.FieldType.TEXT,
            //     label: 'Notes'
            // });
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
                id: 'custpage_subfield_phys_carrier',
                type: serverWidget.FieldType.TEXT,
                label: 'Physical Carrier'
            });
            SublistObj.addField({
                id: 'custpage_subfield_cpc_start_date',
                type: serverWidget.FieldType.TEXT,
                label: 'CPC Start Date'
            });

            // SublistObj.addField({
            //     id: 'custpage_subfield_history',
            //     type: serverWidget.FieldType.TEXT,
            //     label: 'History'
            // });

            SublistObj.addField({
                id: 'custpage_subfield_insurance1',
                type: serverWidget.FieldType.TEXT,
                label: 'Insurance1',
            }).updateDisplayType({
                displayType: serverWidget.FieldDisplayType.HIDDEN
            });

            SublistObj.addField({
                id: 'custpage_subfield_lease_id',
                type: serverWidget.FieldType.SELECT,
                label: 'LeaseID',
                source: "customrecord_advs_lease_header"
            }).updateDisplayType({
                displayType: serverWidget.FieldDisplayType.HIDDEN
            });

            SublistObj.addField({
                id: 'custpage_subfield_vin_txt',
                type: serverWidget.FieldType.TEXT,
                label: 'Vin Full',
            }).updateDisplayType({
                displayType: serverWidget.FieldDisplayType.HIDDEN
            });

            SublistObj.addField({
                id: 'custpage_subfield_custid',
                type: serverWidget.FieldType.SELECT,
                label: 'CustId',
                source: 'customer'
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


            var sublist = form.addSublist({
                id: SublistID,
                type: serverWidget.SublistType.LIST,
                label: " ",
                tab: TabId
            });

            sublist.addField({ id: 'cust_fi_editclaim', type: serverWidget.FieldType.TEXT, label: 'EDIT' });
            sublist.addField({ id: 'cust_fi_f_l_name', type: serverWidget.FieldType.TEXT, label: 'Name' });
            sublist.addField({ id: 'cust_fi_status_claim', type: serverWidget.FieldType.TEXT, label: 'Status' });
            sublist.addField({ id: 'cust_fi_list_stock_number', type: serverWidget.FieldType.TEXT, label: 'Stock #' });
            sublist.addField({ id: 'cust_fi_list_stock_no', type: serverWidget.FieldType.TEXT, label: 'Lease #' });
            sublist.addField({ id: 'cust_fi_dateofloss', type: serverWidget.FieldType.TEXT, label: 'Date of Loss' });
            sublist.addField({ id: 'cust_fi_desc_accident', type: serverWidget.FieldType.TEXT, label: 'Description of Accident' });
            sublist.addField({ id: 'cust_fi_claim_filed', type: serverWidget.FieldType.TEXT, label: 'Claim Filed' });
            sublist.addField({ id: 'cust_fi_insurance_company', type: serverWidget.FieldType.TEXT, label: 'Insurance Company' });
            sublist.addField({ id: 'cust_fi_ins_doc', type: serverWidget.FieldType.TEXT, label: 'Claim #' });
            sublist.addField({ id: 'cust_fi_adjuster_name', type: serverWidget.FieldType.TEXT, label: 'Adjuster Name' });
            sublist.addField({ id: 'cust_fi_adjuster_phone', type: serverWidget.FieldType.TEXT, label: 'Adjuster Phone' });
            sublist.addField({ id: 'cust_fi_adjuster_email', type: serverWidget.FieldType.TEXT, label: 'Adjuster Email' });
            sublist.addField({ id: 'cust_fi_repairable', type: serverWidget.FieldType.TEXT, label: 'Unit Condition' });
            sublist.addField({ id: 'cust_fi_veh_loc', type: serverWidget.FieldType.TEXT, label: 'Unit Location' });
            sublist.addField({ id: 'cust_fi_in_tow_yard', type: serverWidget.FieldType.TEXT, label: 'In Tow Yard' });
            sublist.addField({ id: 'cust_fi_shop_contact', type: serverWidget.FieldType.TEXT, label: 'Shop Contact Info' });
            sublist.addField({ id: 'cust_fi_folowup', type: serverWidget.FieldType.TEXT, label: 'Next Followup' });
            // sublist.addField({ id: 'cust_fi_ins_from',  type: serverWidget.FieldType.TEXT, label: 'Insurance From' });
            sublist.addField({ id: 'cust_fi_notes', type: serverWidget.FieldType.TEXTAREA, label: 'Notes' });
        }

        function SetSublistValueFun(SublistObj, Count, CustDash, NotesLink, VIN_lastsix, Customer, CompanyName, CustPhoneNum, Ntl_Primary, LiabiExpiryDate, LiabiCarrier, PhysiExpiryDate, PhysiCarrier, CPCSatrtDate, History, LeaseId, VinId, CustomerId, Insurance1) {

            // SublistObj.setSublistValue({
            //     id: "custpage_subfield_custdash",
            //     line: Count,
            //     value: CustDash || " "
            // });
            // SublistObj.setSublistValue({
            //     id: "custpage_subfield_note",
            //     line: Count,
            //     value: NotesLink || " "
            // });

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
                id: "custpage_subfield_phys_carrier",
                line: Count,
                value: PhysiCarrier || " "
            });
            SublistObj.setSublistValue({
                id: "custpage_subfield_cpc_start_date",
                line: Count,
                value: CPCSatrtDate || " "
            });


            // SublistObj.setSublistValue({
            //     id: "custpage_subfield_history",
            //     line: Count,
            //     value: "<a href=" + History + " target=\"_blank\"><i class='fa fa-history' style='font-size:18px'></i></a>" || " "
            // });

            SublistObj.setSublistValue({
                id: "custpage_subfield_lease_id",
                line: Count,
                value: LeaseId || " "
            });

            SublistObj.setSublistValue({
                id: "custpage_subfield_vin_txt",
                line: Count,
                value: VinId || " " 
            });
if(CustomerId){
            SublistObj.setSublistValue({
                id: "custpage_subfield_custid",
                line: Count,
                value: CustomerId || " "
            });

          
}else{
  log.error("**CustomerId-> "+CustomerId,"VIN_lastsix-> "+VIN_lastsix);
}
            SublistObj.setSublistValue({
                id: "custpage_subfield_insurance1",
                line: Count,
                value: Insurance1 || " "
            });


        }

        /****/
        function searchForclaimData(insueclaim_sublist) {
            // try{
            //     var customrecord_advs_insurance_claim_sheetSearchObj = search.create({
            //     type: "customrecord_advs_insurance_claim_sheet",
            //     filters:
            //     [
            //         ["isinactive","is","F"],
            //         "AND",
            //         ["custrecord_claim_settled","is","F"]
            //     ],
            //     columns:
            //     [
            //         "custrecord_ic_lease",
            //         "custrecord_first_last_name",
            //         "custrecord_ic_date_of_loss",
            //         "custrecord_ic_description_accident",
            //         "custrecord_ic_claim_field",
            //         "custrecord_ic_filed_insurance_type",
            //         "custrecord_ic_claim_number",
            //         "custrecord_ic_adj_name_number",
            //         "custrecord_ic_repairable_type",
            //         "custrecord_ic_location_vehicle",
            //         "custrecord_ic_notes",
            //         "custrecord_tickler_followup",
            //         "name"
            //     ]
            //     });
            //     var searchResultCount = customrecord_advs_insurance_claim_sheetSearchObj.runPaged().count;
            //     log.debug("customrecord_advs_insurance_claim_sheetSearchObj result count",searchResultCount);
            //     var count=0;
            //     customrecord_advs_insurance_claim_sheetSearchObj.run().each(function(result){

            //         var Stock_link = url.resolveRecord({
            //             recordType: 'customrecord_advs_lease_header',
            //             isEditMode: false
            //         });
            //         var claim_link = url.resolveRecord({
            //             recordType: 'customrecord_advs_insurance_claim_sheet',
            //             isEditMode: false
            //         });
            //     var stock_carr = Stock_link + '&id=' + result.getValue({name:'custrecord_ic_lease'});
            //     var claim_carr = claim_link + '&id=' + result.id;
            //     var stockREcLink = '<a href="' + encodeURI(stock_carr) + '" target="_blank">' + encodeURI(result.getText({name:'custrecord_ic_lease'})) + '</a>';
            //     var claimREcLink = '<a href="' + encodeURI(claim_carr) + '" target="_blank">' + encodeURI(result.getValue({name:'name'})) + '</a>';

            //     // .run().each has a limit of 4,000 results
            //                     insueclaim_sublist.setSublistValue({
            //                         id: "cust_fi_list_stock_no",
            //                         line: count,
            //                         value: stockREcLink//result.getText({name:'custrecord_ic_lease'})
            //                     });
            //                     insueclaim_sublist.setSublistValue({
            //                         id: "cust_fi_ins_doc",
            //                         line: count,
            //                         value: claimREcLink//result.getValue({name:'name'})|| ' '
            //                     });
            //                     insueclaim_sublist.setSublistValue({
            //                         id: "cust_fi_f_l_name",
            //                         line: count,
            //                         value: result.getValue({name:'custrecord_first_last_name'})
            //                     });insueclaim_sublist.setSublistValue({
            //                         id: "cust_fi_dateofloss",
            //                         line: count,
            //                         value: result.getValue({name:'custrecord_ic_date_of_loss'}) || ' '
            //                     });insueclaim_sublist.setSublistValue({
            //                         id: "cust_fi_desc_accident",
            //                         line: count,
            //                         value: result.getValue({name:'custrecord_ic_description_accident'})|| ' '
            //                     });insueclaim_sublist.setSublistValue({
            //                         id: "cust_fi_claim_filed",
            //                         line: count,
            //                         value: result.getText({name:'custrecord_ic_claim_field'})|| ' '
            //                     });insueclaim_sublist.setSublistValue({
            //                         id: "cust_fi_ins_from",
            //                         line: count,
            //                         value: result.getText({name:'custrecord_ic_filed_insurance_type'})|| ' '
            //                     });insueclaim_sublist.setSublistValue({
            //                         id: "cust_fi_name_number",
            //                         line: count,
            //                         value: result.getValue({name:'custrecord_ic_adj_name_number'})|| ' '
            //                     });insueclaim_sublist.setSublistValue({
            //                         id: "cust_fi_repairable",
            //                         line: count,
            //                         value: result.getText({name:'custrecord_ic_repairable_type'})|| ' '
            //                     });insueclaim_sublist.setSublistValue({
            //                         id: "cust_fi_veh_loc",
            //                         line: count,
            //                         value: result.getValue({name:'custrecord_ic_location_vehicle'})|| ' '
            //                     });insueclaim_sublist.setSublistValue({
            //                         id: "cust_fi_notes",
            //                         line: count,
            //                         value: result.getValue({name:'custrecord_ic_notes'})|| ' '
            //                     });insueclaim_sublist.setSublistValue({
            //                         id: "cust_fi_folowup",
            //                         line: count,
            //                         value: result.getValue({name:'custrecord_tickler_followup'})|| ' '
            //                     });insueclaim_sublist.setSublistValue({
            //                         id: "cust_fi_editclaim",
            //                         line: count,
            //                         value: '<a href="#" onclick="editclaimsheet('+result.id+')"> <i class="fa fa-edit" style="color:blue;"</i></a>'
            //                     });
            //                     count++;
            //     return true;
            //     });

            // }catch(e)
            // {
            //     log.debug('error',e.toString())
            // }

            getInsuaranceNotesData();
            var ClaimSheetSearchObj = search.create({
                type: "customrecord_advs_insurance_claim_sheet",
                filters:
                    [
                        ["isinactive", "is", "F"],
                        "AND",
                        ["custrecord_claim_settled", "is", "F"]
                    ],
                columns:
                    [
                        "custrecord_advs_ic_name",
                        "custrecord_advs_claim_status",
                        search.createColumn({ name: 'custrecord_advs_em_serial_number', join: 'custrecord_advs_ic_vin_number' }),
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
                        "name"
                    ]
            });
            var count = 0;
            ClaimSheetSearchObj.run().each(function (result) {
                var Stock_link = url.resolveRecord({ recordType: 'customrecord_advs_lease_header', isEditMode: false });
                var claim_link = url.resolveRecord({ recordType: 'customrecord_advs_insurance_claim_sheet', isEditMode: false });

                var stock_carr = Stock_link + '&id=' + result.getValue({ name: 'custrecord_ic_lease' });
                var claim_carr = claim_link + '&id=' + result.id;
                var stockREcLink = '<a href="' + encodeURI(stock_carr) + '" target="_blank">' + encodeURI(result.getText({ name: 'custrecord_ic_lease' })) + '</a>';
                var claimREcLink = '<a href="' + encodeURI(claim_carr) + '" target="_blank">' + encodeURI(result.getValue({ name: 'name' })) + '</a>';

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


                insueclaim_sublist.setSublistValue({ id: "cust_fi_f_l_name", line: count, value: result.getText('custrecord_advs_ic_name') || ' ' });
                insueclaim_sublist.setSublistValue({ id: "cust_fi_status_claim", line: count, value: result.getText({ name: 'custrecord_advs_claim_status' }) || ' ' });
                insueclaim_sublist.setSublistValue({ id: "cust_fi_list_stock_number", line: count, value: result.getValue({ name: 'custrecord_advs_em_serial_number', join: 'custrecord_advs_ic_vin_number' }) || ' ' });
                insueclaim_sublist.setSublistValue({ id: "cust_fi_list_stock_no", line: count, value: stockREcLink });
                insueclaim_sublist.setSublistValue({ id: "cust_fi_dateofloss", line: count, value: result.getValue('custrecord_ic_date_of_loss') || ' ' });
                insueclaim_sublist.setSublistValue({ id: "cust_fi_desc_accident", line: count, value: result.getValue({ name: 'custrecord_ic_description_accident' }) || ' ' });
                insueclaim_sublist.setSublistValue({ id: "cust_fi_claim_filed", line: count, value: result.getText({ name: 'custrecord_ic_claim_field' }) || ' ' });
                insueclaim_sublist.setSublistValue({ id: "cust_fi_insurance_company", line: count, value: result.getText({ name: 'custrecord_advs_ic_insurance_company' }) || ' ' });
                insueclaim_sublist.setSublistValue({ id: "cust_fi_ins_doc", line: count, value: claimREcLink });
                insueclaim_sublist.setSublistValue({ id: "cust_fi_adjuster_name", line: count, value: result.getValue({ name: 'custrecord_ic_adj_name_number' }) || ' ' });
                insueclaim_sublist.setSublistValue({ id: "cust_fi_adjuster_phone", line: count, value: result.getValue({ name: 'custrecord_advs_ic_adjuster_phone' }) || ' ' });
                insueclaim_sublist.setSublistValue({ id: "cust_fi_adjuster_email", line: count, value: result.getValue({ name: 'custrecord_advs_ic_adjuster_email' }) || ' ' });
                insueclaim_sublist.setSublistValue({ id: "cust_fi_repairable", line: count, value: result.getText({ name: 'custrecord_ic_repairable_type' }) || ' ' });
                insueclaim_sublist.setSublistValue({ id: "cust_fi_veh_loc", line: count, value: result.getValue({ name: 'custrecord_ic_location_vehicle' }) || ' ' });
                insueclaim_sublist.setSublistValue({ id: "cust_fi_in_tow_yard", line: count, value: result.getText({ name: 'custrecord_advs_ic_in_tow_yard' }) || ' ' });
                insueclaim_sublist.setSublistValue({ id: "cust_fi_folowup", line: count, value: result.getValue({ name: 'custrecord_tickler_followup' }) || ' ' });
                insueclaim_sublist.setSublistValue({ id: "cust_fi_notes", line: count, value: NotesArr });
                insueclaim_sublist.setSublistValue({ id: "cust_fi_editclaim", line: count, value: '<a href="#" onclick="editclaimsheet(' + result.id + ')"> <i class="fa fa-edit" style="color:blue;"</i> </a>' });//<i class="fa fa-edit" style="color:blue;"</i>
                count++;
                return true;


            });
        }

        var NoteData = [];
        function getInsuaranceNotesData() {
            var InsuranceNotesSearchObj = search.create({
                type: "customrecord_advs_insurance_notes",
                filters:
                    [
                        ["isinactive", "is", "F"],
                        "AND",
                        ["custrecord_advs_inf_parent_link", "noneof", "@NONE@"],
                        "AND",
                        ["custrecord_advs_inf_parent_link.custrecord_claim_settled", "is", "F"]
                    ],
                columns:
                    [
                        search.createColumn({ name: "custrecord_advs_inf_date_time" }),
                        search.createColumn({ name: "custrecord_advs_inf_notes" }),
                        search.createColumn({ name: "custrecord_advs_inf_parent_link" })
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
        /****/

        return {
            onRequest
        }

    });