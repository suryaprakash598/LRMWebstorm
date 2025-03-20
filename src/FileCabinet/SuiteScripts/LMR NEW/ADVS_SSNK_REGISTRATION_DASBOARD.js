/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
define(['N/runtime', 'N/search', 'N/ui/serverWidget', 'N/url', 'N/format'],
    /**
     * @param{runtime} runtime
     * @param{search} search
     * @param{serverWidget} serverWidget
     */
    (runtime, search, serverWidget, url, format) => {
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
                    title: "Registration Dashboard"
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

                var TabLab_StateIssue = "State Issue",
                    TabLab_RegIssue = "Registrant Issue",
                    TabLab_OwnerIssue = "Owner Issue",
                    TabLab_TempNoPlate = "Temp – No Plate",
                    TabLab_Expired = "Expired",
                    TabLab_0_7_Expiry = "0 - 7 days until expiry",
                    TabLab_8_30_Expiry = "8 - 30 days until expiry",
                    TabLab_31_60_Expiry = "31 - 60 days until expiry";

                var count_StateIssue = 0,
                    count_RegIssue = 0,
                    count_OwnerIssue = 0,
                    count_TempNoPlate = 0,
                    count_Expired = 0,
                    count_0_7_Expiry = 0,
                    count_8_30_Expiry = 0,
                    count_31_60_Expiry = 0;

                var Today = new Date;

                // log.error("Today-> ", Today);

                AddSublist(form, "custpage_subtab_stateissue", TabLab_StateIssue, null, null);
                AddSublist(form, "custpage_subtab_regissue", TabLab_RegIssue, null, null);
                AddSublist(form, "custpage_subtab_ownerissue", TabLab_OwnerIssue, null, null);
                AddSublist(form, "custpage_subtab_tempnoplate", TabLab_TempNoPlate, null, null);
                AddSublist(form, "custpage_subtab_expired", TabLab_Expired, null, null);
                AddSublist(form, "custpage_subtab_0_7_expiry", TabLab_0_7_Expiry, null, null);
                AddSublist(form, "custpage_subtab_8_30_expiry", TabLab_8_30_Expiry, null, null);
                AddSublist(form, "custpage_subtab_31_60_expiry", TabLab_31_60_Expiry, null, null);

                /** */

                var customrecord_advs_vmSearchObj = search.create({
                    type: "customrecord_advs_vm",
                    filters:
                        [
                            ["isinactive", "is", "F"]
                        ],
                    columns:
                        [
                            search.createColumn({ name: "name", label: "Name" }),
                            search.createColumn({ name: "internalid", label: "InternalId" }),
                            search.createColumn({ name: "custrecord_advs_vm_vin", label: "VIN" }),
                            search.createColumn({ name: "custrecord_advs_em_serial_number", label: "Serial Number" }),
                            search.createColumn({ name: "custrecord_advs_reg_type", label: "Registration Type" }),
                            search.createColumn({ name: "custrecord_advs_vm_plate_expiration", label: "REGISTRATION EXPIRY DATE" }),
                            search.createColumn({ name: "custrecord_advs_customer", label: "Customer" }),
                            search.createColumn({ name: "custrecord_advs_comp_name", label: "Company Name" }),
                            search.createColumn({ name: "custrecord_advs_notes_ms_tm", label: "Notes" }),
                            search.createColumn({ name: "custrecord_advs_vm_lea_hea", label: "Lease" }),
                            search.createColumn({ name: "custrecord_advs_vm_plate_no", label: "Plate No" }),
                            search.createColumn({
                                name: "custentity_advs_state_issue",
                                join: "CUSTRECORD_ADVS_CUSTOMER",
                                label: "State Issue"
                            }),
                            search.createColumn({
                                name: "custentity_advs_registrant_iss",
                                join: "CUSTRECORD_ADVS_CUSTOMER",
                                label: "Registrant Issue "
                            }),
                            search.createColumn({
                                name: "custentity_advs_less_own_issue",
                                join: "CUSTRECORD_ADVS_CUSTOMER",
                                label: "Lessee/Owner Issue"
                            }),
                            search.createColumn({
                                name: "custentity_advs_temp_orary",
                                join: "CUSTRECORD_ADVS_CUSTOMER",
                                label: "Temporary"
                            }),
                            search.createColumn({
                                name: "custentity_advs_temp_no_plate",
                                join: "CUSTRECORD_ADVS_CUSTOMER",
                                label: "Temporary – No Plate"
                            }),
                            search.createColumn({
                                name: "custentity_advs_reg_state",
                                join: "CUSTRECORD_ADVS_CUSTOMER",
                                label: "Registration State"
                            }),
                            search.createColumn({
                                name: "custentity_advs_reg_country",
                                join: "CUSTRECORD_ADVS_CUSTOMER",
                                label: "Registration Country"
                            })
                        ]
                });

                var TruckMasterArray = new Array();
                var TruckMasterDataArray = new Array();

                customrecord_advs_vmSearchObj.run().each(function (result) {

                    var StateIssue = "",
                        RegistrationIssue = "",
                        LeasseOwnIssue = "",
                        Temp = "",
                        TempNoPlate = "",
                        RegistrationState = "",
                        RegistrationCounty = "";

                    var VIN = result.getValue({
                        name: "name"
                    });

                    var TruckMasterId = result.getValue({
                        name: "internalid"
                    });
                    var LeaseLink = result.getValue({
                        name: "custrecord_advs_vm_lea_hea"
                    });
                    var VIN_lastsix = result.getValue({
                        name: "custrecord_advs_em_serial_number"
                    });
                    var RegiType = result.getText({
                        name: "custrecord_advs_reg_type"
                    });
                    var RegiExpiryDate = result.getValue({
                        name: "custrecord_advs_vm_plate_expiration"
                    });
                    var CompanyName = result.getValue({
                        name: "custrecord_advs_comp_name"
                    });
                    var CustomerId = result.getValue({
                        name: "custrecord_advs_customer"
                    });
                    var Customer = result.getText({
                        name: "custrecord_advs_customer"
                    });
                    var PlateNo = result.getValue({
                        name: "custrecord_advs_vm_plate_no"
                    });

                    if (Customer) {

                        StateIssue = result.getValue({
                            name: "custentity_advs_state_issue",
                            join: "CUSTRECORD_ADVS_CUSTOMER"
                        });
                        RegistrationIssue = result.getValue({
                            name: "custentity_advs_registrant_iss",
                            join: "CUSTRECORD_ADVS_CUSTOMER"
                        });
                        LeasseOwnIssue = result.getValue({
                            name: "custentity_advs_less_own_issue",
                            join: "CUSTRECORD_ADVS_CUSTOMER"
                        });
                        Temp = result.getValue({
                            name: "custentity_advs_temp_orary",
                            join: "CUSTRECORD_ADVS_CUSTOMER"
                        });
                        TempNoPlate = result.getValue({
                            name: "custentity_advs_temp_no_plate",
                            join: "CUSTRECORD_ADVS_CUSTOMER"
                        });
                        RegistrationState = result.getText({
                            name: "custentity_advs_reg_state",
                            join: "CUSTRECORD_ADVS_CUSTOMER"
                        });
                        RegistrationCounty = result.getText({
                            name: "custentity_advs_reg_country",
                            join: "CUSTRECORD_ADVS_CUSTOMER"
                        });

                    }



                    if (TruckMasterArray.indexOf(VIN) == -1) {
                        TruckMasterArray.push(VIN);
                        TruckMasterDataArray[VIN] = new Array;
                        TruckMasterDataArray[VIN]["TruckMasterId"] = TruckMasterId;
                        TruckMasterDataArray[VIN]["VIN_lastsix"] = VIN_lastsix;
                        TruckMasterDataArray[VIN]["RegiType"] = RegiType;
                        TruckMasterDataArray[VIN]["RegiExpiryDate"] = RegiExpiryDate;
                        TruckMasterDataArray[VIN]["CompanyName"] = CompanyName;
                        TruckMasterDataArray[VIN]["Customer"] = Customer;
                        TruckMasterDataArray[VIN]["RegistrationState"] = RegistrationState;
                        TruckMasterDataArray[VIN]["RegistrationCounty"] = RegistrationCounty;
                        TruckMasterDataArray[VIN]["PlateNo"] = PlateNo;
                        TruckMasterDataArray[VIN]["CustomerId"] = CustomerId;
                        TruckMasterDataArray[VIN]["LeaseLink"] = LeaseLink;

                        if (StateIssue == true || StateIssue == "true" || StateIssue == "T") {
                            TruckMasterDataArray[VIN]["StateIssue"] = "Yes";
                        } else {
                            TruckMasterDataArray[VIN]["StateIssue"] = "No";
                        }

                        if (RegistrationIssue == true || RegistrationIssue == "true" || RegistrationIssue == "T") {
                            TruckMasterDataArray[VIN]["RegistrationIssue"] = "Yes";
                        } else {
                            TruckMasterDataArray[VIN]["RegistrationIssue"] = "No";
                        }

                        if (LeasseOwnIssue == true || LeasseOwnIssue == "true" || LeasseOwnIssue == "T") {
                            TruckMasterDataArray[VIN]["LeasseOwnIssue"] = "Yes";
                        } else {
                            TruckMasterDataArray[VIN]["LeasseOwnIssue"] = "No";
                        }

                        if (Temp == true || Temp == "true" || Temp == "T") {
                            TruckMasterDataArray[VIN]["Temp"] = "Yes";
                        } else {
                            TruckMasterDataArray[VIN]["Temp"] = "No";
                        }

                        if (TempNoPlate == true || TempNoPlate == "true" || TempNoPlate == "T") {
                            TruckMasterDataArray[VIN]["TempNoPlate"] = "Yes";
                        } else {
                            TruckMasterDataArray[VIN]["TempNoPlate"] = "No";
                        }


                    }

                    return true;
                });

                log.error("TruckMasterArray-> ", TruckMasterArray);

                for (var i = 0; i < TruckMasterArray.length; i++) {
                    var VIN = TruckMasterArray[i];

                    if ((TruckMasterDataArray[VIN]) || TruckMasterDataArray[VIN] != null || TruckMasterDataArray[VIN] != undefined || TruckMasterDataArray[VIN] != " " || TruckMasterDataArray[VIN] != "") {

                        var StateIssue = TruckMasterDataArray[VIN]["StateIssue"];
                        var RegistrationIssue = TruckMasterDataArray[VIN]["RegistrationIssue"];
                        var LeasseOwnIssue = TruckMasterDataArray[VIN]["LeasseOwnIssue"];
                        var TempNoPlate = TruckMasterDataArray[VIN]["TempNoPlate"];
                        var Temp = TruckMasterDataArray[VIN]["Temp"];

                        var TruckMasterId = TruckMasterDataArray[VIN]["TruckMasterId"];
                        var VIN_lastsix = TruckMasterDataArray[VIN]["VIN_lastsix"];
                        var RegistrationType = TruckMasterDataArray[VIN]["RegiType"];
                        var RegiExpiryDate = TruckMasterDataArray[VIN]["RegiExpiryDate"];
                        var CompanyName = TruckMasterDataArray[VIN]["CompanyName"];
                        var Customer = TruckMasterDataArray[VIN]["Customer"];
                        var RegistrationState = TruckMasterDataArray[VIN]["RegistrationState"];
                        var RegistrationCounty = TruckMasterDataArray[VIN]["RegistrationCounty"];
                        var PlateNo = TruckMasterDataArray[VIN]["PlateNo"];
                        var CustomerId = TruckMasterDataArray[VIN]["CustomerId"];
                        var LeaseLink = TruckMasterDataArray[VIN]["LeaseLink"];

                        var NotesDeployement = "https://8760954.app.netsuite.com/app/site/hosting/scriptlet.nl?script=2565&deploy=1";
                        NotesDeployement += "&custparam_cust=" + CustomerId + "&custparam_truckmaster=" + TruckMasterId + "&custparam_leaselink=" + LeaseLink;
                        var NotesLink = "<a href=" + NotesDeployement + " target=\"_blank\">Create Notes</a>";

                        var CustDashLink = "<a href=\"https://8760954.app.netsuite.com/app/center/card.nl?sc=-69&entityid=" + CustomerId + "\" target=\"_blank\">DASH</a>";
                        var PlatehistoryLink = "https://8760954.app.netsuite.com/app/site/hosting/scriptlet.nl?script=2595&deploy=1&custparam_leaseid=" + LeaseLink;

                        if (StateIssue == "Yes") {

                            var Sublist_StateIssue = form.getSublist({
                                id: "custpage_sublist_custpage_subtab_stateissue"
                            });

                            // log.error("TruckMasterId-> ", TruckMasterId);

                            SetSublistValueFun(Sublist_StateIssue, count_StateIssue, CustDashLink, NotesLink, VIN_lastsix, Customer, CompanyName, RegiExpiryDate, StateIssue, RegistrationState, RegistrationCounty, RegistrationType, RegistrationIssue, LeasseOwnIssue, Temp, TempNoPlate, TruckMasterId, LeaseLink, PlatehistoryLink);

                            count_StateIssue++;
                        }
                        if (RegistrationIssue == "Yes") {

                            var Sublist_RegiIssue = form.getSublist({
                                id: "custpage_sublist_custpage_subtab_regissue"
                            });


                            SetSublistValueFun(Sublist_RegiIssue, count_RegIssue, CustDashLink, NotesLink, VIN_lastsix, Customer, CompanyName, RegiExpiryDate, StateIssue, RegistrationState, RegistrationCounty, RegistrationType, RegistrationIssue, LeasseOwnIssue, Temp, TempNoPlate, TruckMasterId, LeaseLink, PlatehistoryLink);

                            count_RegIssue++;

                        }
                        if (LeasseOwnIssue == "Yes") {

                            var Sublist_OwnerIssue = form.getSublist({
                                id: "custpage_sublist_custpage_subtab_ownerissue"
                            });


                            SetSublistValueFun(Sublist_OwnerIssue, count_OwnerIssue, CustDashLink, NotesLink, VIN_lastsix, Customer, CompanyName, RegiExpiryDate, StateIssue, RegistrationState, RegistrationCounty, RegistrationType, RegistrationIssue, LeasseOwnIssue, Temp, TempNoPlate, TruckMasterId, LeaseLink, PlatehistoryLink);

                            count_OwnerIssue++;

                        }
                        if (TempNoPlate == "Yes") {

                            var Sublist_TempNoPlate = form.getSublist({
                                id: "custpage_sublist_custpage_subtab_tempnoplate"
                            });


                            SetSublistValueFun(Sublist_TempNoPlate, count_TempNoPlate, CustDashLink, NotesLink, VIN_lastsix, Customer, CompanyName, RegiExpiryDate, StateIssue, RegistrationState, RegistrationCounty, RegistrationType, RegistrationIssue, LeasseOwnIssue, Temp, TempNoPlate, TruckMasterId, LeaseLink, PlatehistoryLink);

                            count_TempNoPlate++;
                        }

                        if (RegiExpiryDate) {

                            var expiryDateObject = new Date(RegiExpiryDate);

                            if (Today > expiryDateObject) {

                                var Sublist_Expired = form.getSublist({
                                    id: "custpage_sublist_custpage_subtab_expired"
                                })
                                SetSublistValueFun(Sublist_Expired, count_Expired, CustDashLink, NotesLink, VIN_lastsix, Customer, CompanyName, RegiExpiryDate, StateIssue, RegistrationState, RegistrationCounty, RegistrationType, RegistrationIssue, LeasseOwnIssue, Temp, TempNoPlate, TruckMasterId, LeaseLink, PlatehistoryLink);

                                count_Expired++;

                            } else {

                                var diffInMs = (expiryDateObject - Today);
                                var diffInDays = diffInMs / (1000 * 60 * 60 * 24);
                                diffInDays = Math.floor(diffInDays);

                                // log.error(diffInDays, diffInMs);


                                if (diffInDays >= 0 && diffInDays <= 7) {

                                    var Sublist_0_7_Expiry = form.getSublist({
                                        id: "custpage_sublist_custpage_subtab_0_7_expiry"
                                    })
                                    SetSublistValueFun(Sublist_0_7_Expiry, count_0_7_Expiry, CustDashLink, NotesLink, VIN_lastsix, Customer, CompanyName, RegiExpiryDate, StateIssue, RegistrationState, RegistrationCounty, RegistrationType, RegistrationIssue, LeasseOwnIssue, Temp, TempNoPlate, TruckMasterId, LeaseLink, PlatehistoryLink);

                                    count_0_7_Expiry++;

                                } else if (diffInDays >= 8 && diffInDays <= 30) {

                                    var Sublist_8_30_Expiry = form.getSublist({
                                        id: "custpage_sublist_custpage_subtab_8_30_expiry"
                                    })
                                    SetSublistValueFun(Sublist_8_30_Expiry, count_8_30_Expiry, CustDashLink, NotesLink, VIN_lastsix, Customer, CompanyName, RegiExpiryDate, StateIssue, RegistrationState, RegistrationCounty, RegistrationType, RegistrationIssue, LeasseOwnIssue, Temp, TempNoPlate, TruckMasterId, LeaseLink, PlatehistoryLink);

                                    count_8_30_Expiry++;

                                } else if (diffInDays >= 31 && diffInDays <= 60) {

                                    var Sublist_31_60_Expiry = form.getSublist({
                                        id: "custpage_sublist_custpage_subtab_31_60_expiry"
                                    })
                                    SetSublistValueFun(Sublist_31_60_Expiry, count_31_60_Expiry, CustDashLink, NotesLink, VIN_lastsix, Customer, CompanyName, RegiExpiryDate, StateIssue, RegistrationState, RegistrationCounty, RegistrationType, RegistrationIssue, LeasseOwnIssue, Temp, TempNoPlate, TruckMasterId, LeaseLink, PlatehistoryLink);

                                    count_31_60_Expiry++;

                                }



                            }

                        }

                    }

                }

                /** */


                var rows = [
                    {
                        name: TabLab_StateIssue,
                        count: count_StateIssue,
                    },
                    {
                        name: TabLab_RegIssue,
                        count: count_RegIssue,
                    },
                    {
                        name: TabLab_OwnerIssue,
                        count: count_OwnerIssue,
                    },
                    {
                        name: TabLab_TempNoPlate,
                        count: count_TempNoPlate,
                    },
                    {
                        name: TabLab_Expired,
                        count: count_Expired,
                    },
                    {
                        name: TabLab_0_7_Expiry,
                        count: count_0_7_Expiry,
                    },
                    {
                        name: TabLab_8_30_Expiry,
                        count: count_8_30_Expiry,
                    },
                    {
                        name: TabLab_31_60_Expiry,
                        count: count_31_60_Expiry,
                    }
                ];

                
                var table = "";

                table += "<style>" +
                    ".inner-table {" +
                    "margin: 20px auto;" +
                    "border-radius: 8px;" +
                    "overflow: hidden;" +
                    "box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);" +
                    "background-color:rgb(255, 255, 255);" +
                    "}" +
                    "th{"+
                    "color: black;"+
                    "}"+
                    ".hover-tr{" +
                    "background-color: rgba(96, 119, 153, 0.3);" +
                    "}" +
                    ".hover-tr:hover{" +
                    "background-color: rgba(96, 119, 153, 0.1);" +
                    "}" +

                    "</style>";

                table += "<table class='inner-table' align='left' width='20%' style=' border:1px solid white; border-collapse: collapse; '>";//max-width: 100%;

                // Construct table rows
                rows.forEach(function (row) {
                    table += "<tr class='hover-tr' style='border-bottom:1px solid white; border-bottom:1px solid white;'>" +
                        "<th width='50%' style='border-right:1px solid white; font-size:11px; padding-left: 3px; ' >" + row.name + "</th>" +
                        "<th width='50%' style='text-align:center; font-size:13px; ' >" + row.count + "</th>"
                    "</tr>";
                });



                table += "</table>";

                InlineHTMLField.defaultValue = table;


                form.clientScriptModulePath = 'SuiteScripts/LMR NEW/ADVS_CSNK_REGISTRATION_DASH.js';

                Response.writePage(form);
            }
        }

        function AddSublist(form, TabId, TabLable, RequiredTaskInfo, Type) {

            form.addTab({
                id: TabId,
                label: TabLable
            });

            // log.error(TabId + "-->", "custpage_sublist_" + TabId);



            var SublistID = "custpage_sublist_" + TabId;

            var SublistObj = form.addSublist({
                id: SublistID,
                type: serverWidget.SublistType.LIST,
                label: " ",
                tab: TabId
            });



            addSublistFields(SublistObj, RequiredTaskInfo, Type);

            // var FunctionName = 'EmailFor_' + TabId.replace('custpage_subtab_', '');
            var FunctionName = 'RegiEmailPopup';

            // log.error("SublistID-> ", SublistID);

            SublistObj.addButton({
                id: 'custpage_sub_btn_email',
                label: 'Email',
                functionName: FunctionName + "('" + TabLable + "')"
            });

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
                id: 'custpage_subfield_regexpdate',
                type: serverWidget.FieldType.TEXT,
                label: 'Registration Expiration Date'
            });
            SublistObj.addField({
                id: 'custpage_subfield_stateissue',
                type: serverWidget.FieldType.TEXT,
                label: 'State Issue'
            });
            SublistObj.addField({
                id: 'custpage_subfield_regstate',
                type: serverWidget.FieldType.TEXT,
                label: 'Registration State'
            });
            SublistObj.addField({
                id: 'custpage_subfield_regcounty',
                type: serverWidget.FieldType.TEXT,
                label: 'Registration County'
            });
            SublistObj.addField({
                id: 'custpage_subfield_regtype',
                type: serverWidget.FieldType.TEXT,
                label: 'Registration Type'
            });
            SublistObj.addField({
                id: 'custpage_subfield_regissue',
                type: serverWidget.FieldType.TEXT,
                label: 'Registrant Issue'
            });
            SublistObj.addField({
                id: 'custpage_subfield_lesseeissue',
                type: serverWidget.FieldType.TEXT,
                label: 'Lessee/Owner Issue'
            });
            SublistObj.addField({
                id: 'custpage_subfield_temp',
                type: serverWidget.FieldType.TEXT,
                label: 'Temporary'
            });
            SublistObj.addField({
                id: 'custpage_subfield_tempnoplate',
                type: serverWidget.FieldType.TEXT,
                label: 'Temporary - No Plate'
            });
            SublistObj.addField({
                id: 'custpage_subfield_truckrec_id',
                type: serverWidget.FieldType.SELECT,
                label: 'TruckID',
                source: "customrecord_advs_vm"
            }).updateDisplayType({
                displayType: serverWidget.FieldDisplayType.HIDDEN
            });

            SublistObj.addField({
                id: 'custpage_subfield_plateno',
                type: serverWidget.FieldType.TEXT,
                label: 'PlateHistory'
            });

        }

        function CountAll(Count, Value) {

            if (Value || Value != null || Value != undefined || Value != "" || Value != " ") {
                if (Value == true || Value == "true" || Value == "T") {
                    Count++;
                }
            }

            return Count;
        }

        function SetSublistValueFun(SublistObj, Count, CustDash, Note, VIN_lastsix, Customer, CompanyName, RegiExpiryDate, StateIssue, RegistrationState, RegistrationCounty, RegistrationType, RegistrationIssue, LeasseOwnIssue, Temp, TempNoPlate, TruckMasterId, LeaseLink, PlateNo) {

            SublistObj.setSublistValue({
                id: "custpage_subfield_custdash",
                line: Count,
                value: CustDash || " "
            });
            SublistObj.setSublistValue({
                id: "custpage_subfield_note",
                line: Count,
                value: Note || " "
            });
            SublistObj.setSublistValue({
                id: "custpage_subfield_plateno",
                line: Count,
                value: "<a href=" + PlateNo + " target=\"_blank\"><i class='fa fa-history' style='font-size:18px'></i></a>" || " "
            });
            // value: PlateNo || " "
            //"<a href=" + PlateNo + " target=\"_blank\"><i class='fa fa-history' style='font-size:18px'></i></a>"
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
                id: "custpage_subfield_regexpdate",
                line: Count,
                value: RegiExpiryDate || " "
            });
            SublistObj.setSublistValue({
                id: "custpage_subfield_stateissue",
                line: Count,
                value: '<span style="color:red;">' + StateIssue + '</span>' || " "
            });

            SublistObj.setSublistValue({
                id: "custpage_subfield_regstate",
                line: Count,
                value: RegistrationState || " "
            });
            SublistObj.setSublistValue({
                id: "custpage_subfield_regcounty",
                line: Count,
                value: RegistrationCounty || " "
            });
            SublistObj.setSublistValue({
                id: "custpage_subfield_regtype",
                line: Count,
                value: RegistrationType || " "
            });
            SublistObj.setSublistValue({
                id: "custpage_subfield_regissue",
                line: Count,
                value: '<span style="color:red;">' + RegistrationIssue + '</span>' || " "
            });
            SublistObj.setSublistValue({
                id: "custpage_subfield_lesseeissue",
                line: Count,
                value: '<span style="color:red;">' + LeasseOwnIssue + '</span>' || " "
            });
            SublistObj.setSublistValue({
                id: "custpage_subfield_temp",
                line: Count,
                value: '<span style="color:red;">' + Temp + '</span>' || " "
            });
            SublistObj.setSublistValue({
                id: "custpage_subfield_tempnoplate",
                line: Count,
                value: '<span style="color:red;">' + TempNoPlate + '</span>' || " "
            });
            SublistObj.setSublistValue({
                id: "custpage_subfield_truckrec_id",
                line: Count,
                value: TruckMasterId || " "
            });

        }

        return {
            onRequest
        }

    });