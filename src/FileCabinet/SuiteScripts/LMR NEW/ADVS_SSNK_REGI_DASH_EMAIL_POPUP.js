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

                var TabLable = Request.parameters.custparam_tablab;


                var form = serverWidget.createForm({
                    title: TabLable
                });
                // var InlineHTMLField = form.addField({
                //     id: "custpage_inlinehtml",
                //     type: serverWidget.FieldType.INLINEHTML,
                //     label: " "
                // });

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
                            ["internalid", "anyof", ["1","2"]]
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


                if (TabLable == TabLab_StateIssue) {

                    AddSublist(form, "custpage_subtab_stateissue", TabLab_StateIssue, null, null);

                } else if (TabLable == TabLab_RegIssue) {

                    AddSublist(form, "custpage_subtab_regissue", TabLab_RegIssue, null, null);

                } else if (TabLable == TabLab_OwnerIssue) {

                    AddSublist(form, "custpage_subtab_ownerissue", TabLab_OwnerIssue, null, null);

                } else if (TabLable == TabLab_TempNoPlate) {

                    AddSublist(form, "custpage_subtab_tempnoplate", TabLab_TempNoPlate, null, null);

                } else if (TabLable == TabLab_Expired) {

                    AddSublist(form, "custpage_subtab_expired", TabLab_Expired, null, null);

                } else if (TabLable == TabLab_0_7_Expiry) {

                    AddSublist(form, "custpage_subtab_0_7_expiry", TabLab_0_7_Expiry, null, null);

                } else if (TabLable == TabLab_8_30_Expiry) {

                    AddSublist(form, "custpage_subtab_8_30_expiry", TabLab_8_30_Expiry, null, null);

                } else if (TabLable == TabLab_31_60_Expiry) {

                    AddSublist(form, "custpage_subtab_31_60_expiry", TabLab_31_60_Expiry, null, null);

                }

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
                            search.createColumn({ name: "custrecord_advs_vm_lea_hea", label: "Lease Link" }),
                            search.createColumn({
                                name: "custrecord_advs_l_h_start_date",
                                join: "custrecord_advs_vm_lea_hea",
                                label: "State Issue"
                            }),
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
                            }),
                            search.createColumn({
                                name: "firstname",
                                join: "CUSTRECORD_ADVS_CUSTOMER",
                                label: "FirstName"
                            }),
                            search.createColumn({
                                name: "lastname",
                                join: "CUSTRECORD_ADVS_CUSTOMER",
                                label: "LastName"
                            }),
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
                        RegistrationCounty = "",
                        CustFirstName = "",
                        CustLastName = "";

                    var VIN = result.getValue({
                        name: "name"
                    });
                    var TruckMasterId = result.getValue({
                        name: "internalid"
                    });
                    var LeaseLink = result.getValue({
                        name: "custrecord_advs_vm_lea_hea"
                    });
                    var LeaseAgreeDate = result.getValue({
                        name: "custrecord_advs_l_h_start_date",
                        join: "custrecord_advs_vm_lea_hea"
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
                    var Notes = result.getValue({
                        name: "custrecord_advs_notes_ms_tm"
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
                        CustFirstName = result.getValue({
                            name: "firstname",
                            join: "CUSTRECORD_ADVS_CUSTOMER"
                        });
                        CustLastName = result.getValue({
                            name: "lastname",
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
                        TruckMasterDataArray[VIN]["Notes"] = Notes;
                        TruckMasterDataArray[VIN]["CustomerId"] = CustomerId;
                        TruckMasterDataArray[VIN]["LeaseLink"] = LeaseLink;
                        TruckMasterDataArray[VIN]["CustFirstName"] = CustFirstName;
                        TruckMasterDataArray[VIN]["CustLastName"] = CustLastName;
                        TruckMasterDataArray[VIN]["LeaseAgreeDate"] = LeaseAgreeDate;

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

                for (var i = 0; i < TruckMasterArray.length; i++) {
                    var VIN = TruckMasterArray[i];

                    if ((TruckMasterDataArray[VIN]) || TruckMasterDataArray[VIN] != null || TruckMasterDataArray[VIN] != undefined || TruckMasterDataArray[VIN] != " " || TruckMasterDataArray[VIN] != "") {

                        var StateIssue = TruckMasterDataArray[VIN]["StateIssue"];
                        var RegistrationIssue = TruckMasterDataArray[VIN]["RegistrationIssue"];
                        var LeasseOwnIssue = TruckMasterDataArray[VIN]["LeasseOwnIssue"];
                        var TempNoPlate = TruckMasterDataArray[VIN]["TempNoPlate"];
                        var Temp = TruckMasterDataArray[VIN]["Temp"];

                        var TruckMasterId = TruckMasterDataArray[VIN]["TruckMasterId"];
                        var LeaseLink = TruckMasterDataArray[VIN]["LeaseLink"];
                        var VIN_lastsix = TruckMasterDataArray[VIN]["VIN_lastsix"];
                        var RegistrationType = TruckMasterDataArray[VIN]["RegiType"];
                        var RegiExpiryDate = TruckMasterDataArray[VIN]["RegiExpiryDate"];
                        var CompanyName = TruckMasterDataArray[VIN]["CompanyName"];
                        var Customer = TruckMasterDataArray[VIN]["Customer"];
                        var RegistrationState = TruckMasterDataArray[VIN]["RegistrationState"];
                        var RegistrationCounty = TruckMasterDataArray[VIN]["RegistrationCounty"];
                        var CustomerId = TruckMasterDataArray[VIN]["CustomerId"];
                        var CustFirstName = TruckMasterDataArray[VIN]["CustFirstName"];
                        var CustLastName = TruckMasterDataArray[VIN]["CustLastName"];
                        var LeaseAgreeDate = TruckMasterDataArray[VIN]["LeaseAgreeDate"];

                        // Customer = CustFirstName + " " + CustLastName;

                        var NotesDeployement = "https://8760954.app.netsuite.com/app/site/hosting/scriptlet.nl?script=2565&deploy=1";
                        NotesDeployement += "&custparam_cust=" + CustomerId + "&custparam_truckmaster=" + TruckMasterId + "&custparam_leaselink=" + LeaseLink;
                        var NotesLink = "<a href=" + NotesDeployement + " target=\"_blank\">Create Notes</a>";

                        var CustDashLink = "<a href=\"https://8760954.app.netsuite.com/app/center/card.nl?sc=-69&entityid=" + CustomerId + "\" target=\"_blank\">DASH</a>";

                        if (StateIssue == "Yes") {

                            var Sublist_StateIssue = form.getSublist({
                                id: "custpage_sublist_custpage_subtab_stateissue"
                            });

                            // log.error("TruckMasterId-> ", TruckMasterId);
                            if (Sublist_StateIssue) {
                                SetSublistValueFun(Sublist_StateIssue, count_StateIssue, CustDashLink, NotesLink, VIN_lastsix, Customer, CompanyName, RegiExpiryDate, StateIssue, RegistrationState, RegistrationCounty, RegistrationType, RegistrationIssue, LeasseOwnIssue, Temp, TempNoPlate, TruckMasterId, CustomerId, LeaseLink, LeaseAgreeDate);
                            }
                            count_StateIssue++;
                        }
                        if (RegistrationIssue == "Yes") {

                            var Sublist_RegiIssue = form.getSublist({
                                id: "custpage_sublist_custpage_subtab_regissue"
                            });

                            if (Sublist_RegiIssue) {
                                SetSublistValueFun(Sublist_RegiIssue, count_RegIssue, CustDashLink, NotesLink, VIN_lastsix, Customer, CompanyName, RegiExpiryDate, StateIssue, RegistrationState, RegistrationCounty, RegistrationType, RegistrationIssue, LeasseOwnIssue, Temp, TempNoPlate, TruckMasterId, CustomerId, LeaseLink, LeaseAgreeDate);
                            }
                            count_RegIssue++;

                        }
                        if (LeasseOwnIssue == "Yes") {

                            var Sublist_OwnerIssue = form.getSublist({
                                id: "custpage_sublist_custpage_subtab_ownerissue"
                            });
                            if (Sublist_OwnerIssue) {

                                SetSublistValueFun(Sublist_OwnerIssue, count_OwnerIssue, CustDashLink, NotesLink, VIN_lastsix, Customer, CompanyName, RegiExpiryDate, StateIssue, RegistrationState, RegistrationCounty, RegistrationType, RegistrationIssue, LeasseOwnIssue, Temp, TempNoPlate, TruckMasterId, CustomerId, LeaseLink, LeaseAgreeDate);
                            }
                            count_OwnerIssue++;

                        }
                        if (TempNoPlate == "Yes") {

                            var Sublist_TempNoPlate = form.getSublist({
                                id: "custpage_sublist_custpage_subtab_tempnoplate"
                            });

                            if (Sublist_TempNoPlate) {
                                SetSublistValueFun(Sublist_TempNoPlate, count_TempNoPlate, CustDashLink, NotesLink, VIN_lastsix, Customer, CompanyName, RegiExpiryDate, StateIssue, RegistrationState, RegistrationCounty, RegistrationType, RegistrationIssue, LeasseOwnIssue, Temp, TempNoPlate, TruckMasterId, CustomerId, LeaseLink, LeaseAgreeDate);
                            }
                            count_TempNoPlate++;
                        }

                        if (RegiExpiryDate && RegiExpiryDate != "" || RegiExpiryDate != " ") {

                            var expiryDateObject = new Date(RegiExpiryDate);

                            if (Today > expiryDateObject) {

                                var Sublist_Expired = form.getSublist({
                                    id: "custpage_sublist_custpage_subtab_expired"
                                });

                                if (Sublist_Expired) {

                                    SetSublistValueFun(Sublist_Expired, count_Expired, CustDashLink, NotesLink, VIN_lastsix, Customer, CompanyName, RegiExpiryDate, StateIssue, RegistrationState, RegistrationCounty, RegistrationType, RegistrationIssue, LeasseOwnIssue, Temp, TempNoPlate, TruckMasterId, CustomerId, LeaseLink, LeaseAgreeDate);
                                }
                                count_Expired++;

                            } else {

                                var diffInMs = (expiryDateObject - Today);
                                var diffInDays = diffInMs / (1000 * 60 * 60 * 24);
                                diffInDays = Math.floor(diffInDays);

                                // log.error(diffInDays, diffInMs);


                                if (diffInDays >= 0 && diffInDays <= 7) {

                                    var Sublist_0_7_Expiry = form.getSublist({
                                        id: "custpage_sublist_custpage_subtab_0_7_expiry"
                                    });

                                    if (Sublist_0_7_Expiry) {
                                        SetSublistValueFun(Sublist_0_7_Expiry, count_0_7_Expiry, CustDashLink, NotesLink, VIN_lastsix, Customer, CompanyName, RegiExpiryDate, StateIssue, RegistrationState, RegistrationCounty, RegistrationType, RegistrationIssue, LeasseOwnIssue, Temp, TempNoPlate, TruckMasterId, CustomerId, LeaseLink, LeaseAgreeDate);
                                    }
                                    count_0_7_Expiry++;

                                } else if (diffInDays >= 8 && diffInDays <= 30) {

                                    var Sublist_8_30_Expiry = form.getSublist({
                                        id: "custpage_sublist_custpage_subtab_8_30_expiry"
                                    });
                                    if (Sublist_8_30_Expiry) {
                                        SetSublistValueFun(Sublist_8_30_Expiry, count_8_30_Expiry, CustDashLink, NotesLink, VIN_lastsix, Customer, CompanyName, RegiExpiryDate, StateIssue, RegistrationState, RegistrationCounty, RegistrationType, RegistrationIssue, LeasseOwnIssue, Temp, TempNoPlate, TruckMasterId, CustomerId, LeaseLink, LeaseAgreeDate);
                                    }
                                    count_8_30_Expiry++;

                                } else if (diffInDays >= 31 && diffInDays <= 60) {

                                    var Sublist_31_60_Expiry = form.getSublist({
                                        id: "custpage_sublist_custpage_subtab_31_60_expiry"
                                    });
                                    if (Sublist_31_60_Expiry) {
                                        SetSublistValueFun(Sublist_31_60_Expiry, count_31_60_Expiry, CustDashLink, NotesLink, VIN_lastsix, Customer, CompanyName, RegiExpiryDate, StateIssue, RegistrationState, RegistrationCounty, RegistrationType, RegistrationIssue, LeasseOwnIssue, Temp, TempNoPlate, TruckMasterId, CustomerId, LeaseLink, LeaseAgreeDate);
                                    }
                                    count_31_60_Expiry++;

                                }




                            }

                        }

                    }

                }

                /** */




                Response.writePage(form);
            } else {

                var SublistID = Request.parameters.custpage_sublistid;
                var EmailTemplate = Request.parameters.custpage_emailtemp;
                var EmailTempRecType = "customrecord_advs_reg_dash_email_templ";

                var User = runtime.getCurrentUser();
                var UserId = User.id;

                if (EmailTemplate == "1" || EmailTemplate == 1) {
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

                                var CustomerId = Request.getSublistValue({
                                    name: "custpage_subfield_customer_id",
                                    group: SublistID,
                                    line: i
                                });
                                var VINLastSix = Request.getSublistValue({
                                    name: "custpage_subfield_vin",
                                    group: SublistID,
                                    line: i
                                });
                                var Leaselink = Request.getSublistValue({
                                    name: "custpage_subfield_leaselink",
                                    group: SublistID,
                                    line: i
                                });

                                var CustomerName = Request.getSublistValue({
                                    name: "custpage_subfield_custname",
                                    group: SublistID,
                                    line: i
                                });
                                var LeaseAgreeDate = Request.getSublistValue({
                                    name: "custpage_subfield_leasedate",
                                    group: SublistID,
                                    line: i
                                });
                                log.error("LeaseAgreeDate-> " + LeaseAgreeDate, "CustomerName-> " + CustomerName);

                                if (LeaseAgreeDate) {

                                    LeaseAgreeDate = new Date(LeaseAgreeDate);

                                    // Add 30 days and preserve the Date object
                                    LeaseAgreeDate.setDate(LeaseAgreeDate.getDate() + 30);

                                    var LeaseDay = LeaseAgreeDate.getDay();
                                    var LeaseDate = LeaseAgreeDate.getDate();
                                    var LeaseMonth = LeaseAgreeDate.getMonth();
                                    var LeaseYear = LeaseAgreeDate.getFullYear();

                                    var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                                    var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

                                    var LeaseDayName = days[LeaseDay];

                                    var LeaseMonthName = months[LeaseMonth];

                                    var NewTemplateBody = TemplateBody.replace(/@DAY@/g, LeaseDayName).replace(/@DATE@/g, LeaseMonthName + " " + LeaseDate + "," + LeaseYear).replace(/@CUSTOMERNAME@/g, CustomerName).replace(/@VIN@/g, VINLastSix);
                                    var NewTemplateSubject = TemplateSubject.replace(/@DAY@/g, LeaseDayName).replace(/@DATE@/g, LeaseMonthName + " " + LeaseDate + "," + LeaseYear).replace(/@CUSTOMERNAME@/g, CustomerName).replace(/@VIN@/g, VINLastSix);

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

                        }
                    }

                } else if (EmailTemplate == 2 || EmailTemplate == "2") {

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

                                var CustomerId = Request.getSublistValue({
                                    name: "custpage_subfield_customer_id",
                                    group: SublistID,
                                    line: i
                                });

                                var VINLastSix = Request.getSublistValue({
                                    name: "custpage_subfield_vin",
                                    group: SublistID,
                                    line: i
                                });

                                var LeaseLink = Request.getSublistValue({
                                    name: "custpage_subfield_leaselink",
                                    group: SublistID,
                                    line: i
                                });

                                var CustomerName = Request.getSublistValue({
                                    name: "custpage_subfield_custname",
                                    group: SublistID,
                                    line: i
                                });
                                var RegiExpiryDate = Request.getSublistValue({
                                    name: "custpage_subfield_regexpdate",
                                    group: SublistID,
                                    line: i
                                });

                                if (RegiExpiryDate && RegiExpiryDate != "" && RegiExpiryDate != " ") {
                                    try {

                                        log.error("RegiExpiryDate-> " + RegiExpiryDate, "CustomerName-> " + CustomerName);

                                        RegiExpiryDate = new Date(RegiExpiryDate);

                                        // if (typeof RegiExpiryDate === 'string') {
                                        //     RegiExpiryDate = RegiExpiryDate.replace(/-/g, '/'); // Replace dashes with slashes
                                        // }

                                        // Add 30 days and preserve the Date object
                                        RegiExpiryDate.setDate(RegiExpiryDate.getDate() + 30);

                                        // Extract the required details
                                        var RegiDay = RegiExpiryDate.getDay(); // Day of the week (0-6)
                                        var RegiDate = RegiExpiryDate.getDate(); // Day of the month
                                        var RegiMonth = RegiExpiryDate.getMonth(); // Month (1-12)
                                        var RegiYear = RegiExpiryDate.getFullYear(); // Year

                                        var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                                        var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

                                        var RegiDayName = days[RegiDay];
                                        var RegiMonthName = months[RegiMonth];

                                        // log.error("RegiDayName, RegiMonthName  RegiDate, RegiYear-> ", RegiDayName + "," + RegiMonthName + " " + RegiDate + "," + RegiYear);

                                        var NewTemplateBody = TemplateBody.replace(/@DAY@/g, RegiDayName).replace(/@DATE@/g, RegiMonthName + " " + RegiDate + "," + RegiYear).replace(/@CUSTOMERNAME@/g, CustomerName).replace(/@VIN@/g, VINLastSix);
                                        var NewTemplateSubject = TemplateSubject.replace(/@DAY/g, RegiDayName).replace(/@DATE@/g, RegiMonthName + " " + RegiDate + "," + RegiYear).replace(/@CUSTOMERNAME@/g, CustomerName).replace(/@VIN@/g, VINLastSix);

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


                                    } catch (e) {
                                        log.error("ERROR-> ", e.message);
                                    }

                                }
                                // TemplateBody = TemplateBody.replace();

                            }

                        }
                    }

                }

                // var onclickScript = " <html><body> <script type='text/javascript'>" +
                //     "try{" +
                //     "";
                // onclickScript += "" +
                //     "";
                // onclickScript += "" +
                //     "window.parent.location.reload();" +
                //     "";
                // onclickScript+="window.parent.closePopup();";
 
                // onclickScript += "}catch(e){alert(e+'   '+e.message);}</script></body></html>";

                // scriptContext.response.write(onclickScript);

              var onclickScript=" <html><body> <script type='text/javascript'>" ;

				onclickScript+="try{" ; 
				onclickScript+="window.close()"; 
				onclickScript+="}catch(e){}</script></body></html>";
				scriptContext.response.write(onclickScript);

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
                label: TabLable,
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


            addSublistFields(SublistObj, RequiredTaskInfo, Type);

            // var FunctionName = 'EmailFor_' + TabId.replace('custpage_subtab_', '');

            // log.error("SublistID-> ", SublistID);

            // SublistObj.addButton({
            //     id: 'custpage_sub_btn_email',
            //     label: 'Email',
            //     functionName: FunctionName + "('" + SublistID + "')"
            // });

            form.addSubmitButton({
                label: "Email"
            });

        }

        function addSublistFields(SublistObj, RequiredTaskInfo, Type) {

            SublistObj.addField({
                id: 'custpage_subfield_mark',
                type: serverWidget.FieldType.CHECKBOX,
                label: 'Mark'
            });

            SublistObj.addField({
                id: 'custpage_subfield_custdash',
                type: serverWidget.FieldType.TEXT,
                label: 'Cust Dash'
            }).updateDisplayType({
                displayType: serverWidget.FieldDisplayType.HIDDEN
            });
            SublistObj.addField({
                id: 'custpage_subfield_note',
                type: serverWidget.FieldType.TEXT,
                label: 'Notes'
            }).updateDisplayType({
                displayType: serverWidget.FieldDisplayType.HIDDEN
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
                id: 'custpage_subfield_customer_id',
                type: serverWidget.FieldType.SELECT,
                label: 'Customer',
                source: "customer"
            }).updateDisplayType({
                displayType: serverWidget.FieldDisplayType.HIDDEN
            });

            SublistObj.addField({
                id: 'custpage_subfield_leaselink',
                type: serverWidget.FieldType.SELECT,
                label: 'LeaseLink',
                source: "customrecord_advs_lease_header"
            }).updateDisplayType({
                displayType: serverWidget.FieldDisplayType.INLINE
            });

            SublistObj.addField({
                id: 'custpage_subfield_leasedate',
                type: serverWidget.FieldType.DATE,
                label: 'LeaseDate',
            }).updateDisplayType({
                displayType: serverWidget.FieldDisplayType.INLINE
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

        function SetSublistValueFun(SublistObj, Count, CustDash, Note, VIN_lastsix, Customer, CompanyName, RegiExpiryDate, StateIssue, RegistrationState, RegistrationCounty, RegistrationType, RegistrationIssue, LeasseOwnIssue, Temp, TempNoPlate, TruckMasterId, CustomerId, LeaseLink, LeaseAgreeDate) {

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
            if (TruckMasterId) {
                SublistObj.setSublistValue({
                    id: "custpage_subfield_truckrec_id",
                    line: Count,
                    value: TruckMasterId
                });
            }
            if (CustomerId) {
                SublistObj.setSublistValue({
                    id: "custpage_subfield_customer_id",
                    line: Count,
                    value: CustomerId
                });
            }

            if (LeaseLink) {
                SublistObj.setSublistValue({
                    id: "custpage_subfield_leaselink",
                    line: Count,
                    value: LeaseLink || " "
                });
            }

            try {


                if (LeaseAgreeDate) {

                    LeaseAgreeDate = new Date(LeaseAgreeDate);

                    LeaseAgreeDate = format.format({

                        value: LeaseAgreeDate,

                        type: format.Type.DATE

                    });

                    SublistObj.setSublistValue({

                        id: "custpage_subfield_leasedate",

                        line: Count,

                        value: LeaseAgreeDate

                    });

                }
            } catch (err) {
                log.error("ERROR_>>>", err.message)
            }


        }

        return {
            onRequest
        }

    });