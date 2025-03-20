/**
 * @NApiVersion 2.x
 * @NScriptType ScheduledScript
 */
define(['N/log', 'N/record', 'N/search', 'N/runtime', 'N/email', 'N/format'], function (log, record, search, runtime, email, format) {

    /**
     * Defines the Scheduled script trigger point.
     * @param {Object} scriptContext
     * @param {string} scriptContext.type - The context in which the script is executed
     * @since 2015.2
     */
    function execute(scriptContext) {

        var User = runtime.getCurrentUser();
        var UserId = User.id;
        UserId = "5";

        var DateObj = record.create({
            type: "customrecord_advs_st_current_date_time",
        });

        var TodaysDate = DateObj.getValue({
            fieldId: "custrecord_st_current_date"
        });

        var NewFullDate = new Date(TodaysDate);

        var NewDate = NewFullDate.getDate();
        var NewMonth = NewFullDate.getMonth();
        var NewFullYear = NewFullDate.getFullYear();

        log.error("NewFullDate-> ", NewFullDate);

        var TemplateSubject = "", TemplateBody = "";

        /***************************************************************************************************/
        var InsuranceTempArray = ["3", "4", "5", "6"];
        var InsurTemplateSubject1 = "",
            InsurTemplateBody1 = "",
            InsurTemplateSubject2 = "",
            InsurTemplateBody2 = "",
            InsurTemplateSubject3 = "",
            InsurTemplateBody3 = "",
            InsurTemplateSubject4 = "",
            InsurTemplateBody4 = "";

        var customrecord_advs_reg_dash_email_templSearchObj = search.create({
            type: "customrecord_advs_reg_dash_email_templ",
            filters:
                [
                    ["isinactive", "is", "F"],
                    "AND",
                    ["internalid", "anyof", InsuranceTempArray]
                ],
            columns:
                [
                    search.createColumn({ name: "name", label: "Name" }),
                    search.createColumn({ name: "internalid", label: "Internalid" }),
                    search.createColumn({ name: "custrecord_advs_sub_reg_field", label: "Subject" }),
                    search.createColumn({ name: "custrecord_advs_template_reg_body", label: "Template Body" })
                ]
        });




        customrecord_advs_reg_dash_email_templSearchObj.run().each(function (result) {

            var InternalId = result.getValue({
                name: "internalid"
            });
            TemplateSubject = result.getValue({
                name: "custrecord_advs_sub_reg_field"
            });
            TemplateBody = result.getValue({
                name: "custrecord_advs_template_reg_body"
            });
            if (InternalId == 3 || InternalId == "3") {
                InsurTemplateSubject1 = TemplateSubject;
                InsurTemplateBody1 = TemplateBody;

            } else if (InternalId == 4 || InternalId == "4") {
                InsurTemplateSubject2 = TemplateSubject;
                InsurTemplateBody2 = TemplateBody;

            } else if (InternalId == 5 || InternalId == "5") {
                InsurTemplateSubject3 = TemplateSubject;
                InsurTemplateBody3 = TemplateBody;

            } else if (InternalId == 6 || InternalId == "6") {
                InsurTemplateSubject4 = TemplateSubject;
                InsurTemplateBody4 = TemplateBody;
            }

            return true;
        });

        /***************************************************************************************************/

        try {

            var customrecord_advs_lease_header0SearchObj = search.create({
                type: "customrecord_advs_lease_header",
                filters:
                    [
                        ["isinactive", "is", "F"],
                        "AND",
                        [
                            ["formuladate: {custrecord_advs_l_h_ins_phy_dam_exp}", "on", "today"],
                            "OR",
                            ["formuladate: {custrecord_advs_l_h_ins_cancel_date}", "on", "today"],

                        ]
                    ],
                columns:
                    [
                        search.createColumn({ name: "internalid", label: "Internal ID" }),
                        search.createColumn({ name: "custrecord_advs_l_h_insurance", label: "Liability Carrier" }),
                        search.createColumn({ name: "custrecord_advs_l_h_phy_dam_ins", label: "Physical Damage Carrier" }),
                        search.createColumn({ name: "custrecord_advs_l_h_ins_phy_dam_exp", label: "Physical Expiration" }),
                        search.createColumn({ name: "custrecord_advs_l_h_ins_cancel_date", label: "Physical Cancellation" }),
                        search.createColumn({ name: "custrecord_advs_l_h_ins_lia_exp_dt", label: "Liability Expiration Date" }),
                        search.createColumn({ name: "custrecord32166", label: "Liability Cancellation" }),
                        search.createColumn({ name: "custrecord_advs_l_a_curr_cps", label: "Current CPC" }),
                        search.createColumn({ name: "custrecord_advs_l_h_customer_name", label: "Lessee Name " }),
                        search.createColumn({ name: "custrecord_advs_la_vin_bodyfld", label: "VIN" }),
                        search.createColumn({ name: "custrecord_advs_liability_type_f", label: "Liability Type" }),
                        search.createColumn({ name: "custrecord_advs_l_a_cpc", label: "Cpc Check" }),
                        search.createColumn({ name: "custrecord_advs_lease_comp_name_fa", label: "Company Name" }),
                        search.createColumn({ name: "custrecord_advs_phy_dmg_cover", label: "phyDmgCover" }),
                        search.createColumn({
                            name: "custrecord_advs_vm_vehicle_brand",
                            join: "CUSTRECORD_ADVS_LA_VIN_BODYFLD",
                            label: "Vehicle Brand"
                        }),
                        search.createColumn({
                            name: "custrecord_advs_vm_model_year",
                            join: "CUSTRECORD_ADVS_LA_VIN_BODYFLD",
                            label: "Model Year"
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
                            label: "Serial Number"
                        }),
                        search.createColumn({
                            name: "email",
                            join: "custrecord_advs_l_h_customer_name",
                            label: "email"
                        }),
                        search.createColumn({
                            name: "custrecord_advs_cpc_date",
                            join: "CUSTRECORD_ADVS_L_A_CURR_CPS",
                            label: "Start Date"
                        })
                    ]
            });

            var LeaseHeaderObj = customrecord_advs_lease_header0SearchObj.runPaged({ "pageSize": 1000 });
            LeaseHeaderObj.pageRanges.forEach(function (pageRange) {

                var LeaseHeaderPage = LeaseHeaderObj.fetch({ index: pageRange.index });
                LeaseHeaderPage.data.forEach(function (result) {

                    // customrecord_advs_lease_headerSearchObj.run().each(function (result) {

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
                    var PhysicalCancelDate = result.getValue({
                        name: "custrecord_advs_l_h_ins_cancel_date"
                    });
                    var LiabilityExpDate = result.getValue({
                        name: "custrecord_advs_l_h_ins_lia_exp_dt"
                    });
                    var LiabilityCancelDate = result.getValue({
                        name: "custrecord32166"
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
                    var VinTxt = result.getText({
                        name: "custrecord_advs_la_vin_bodyfld",
                    });
                    var CPCCheck = result.getValue({
                        name: "custrecord_advs_l_a_cpc",
                    });
                    var VINLastSix = result.getValue({
                        name: "custrecord_advs_em_serial_number",
                        join: "CUSTRECORD_ADVS_LA_VIN_BODYFLD"
                    });
                    var PhyDmgCover = result.getText({
                        name: "custrecord_advs_phy_dmg_cover"
                    });
                    var CompanyName = result.getValue({
                        name: "custrecord_advs_lease_comp_name_fa"
                    });
                    if (!CompanyName || (CompanyName == null || CompanyName == "" || CompanyName == " ")) {
                        CompanyName = "N/A";
                    }
                    var MobilePhone = result.getValue({
                        name: "mobilephone",
                        join: "custrecord_advs_l_h_customer_name"
                    });
                    var CPCSatrtDate = result.getValue({
                        name: "custrecord_advs_cpc_date",
                        join: "CUSTRECORD_ADVS_L_A_CURR_CPS"
                    });
                    var CustEmail = result.getValue({
                        name: "email",
                        join: "custrecord_advs_l_h_customer_name"
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

                    if (PhysicalCancelDate || PhysicalExpDate || LiabilityCancelDate || LiabilityExpDate) {

                        var NewPhysicalExpDate = new Date(PhysicalExpDate);
                        var NewPhysicalCancelDate = new Date(PhysicalCancelDate);

                        var PhyExpDiffInMs = (NewPhysicalExpDate - NewFullDate);
                        var PhyCancelDiffInMs = (NewPhysicalCancelDate - NewFullDate);

                        var PhyExpDiffInDays = PhyExpDiffInMs / (1000 * 60 * 60 * 24);
                        var PhyCancelDiffInDays = PhyCancelDiffInMs / (1000 * 60 * 60 * 24);

                        if ((PhyExpDiffInDays > 0 && PhyExpDiffInDays <= 5) || (PhyCancelDiffInDays > 0 && PhyCancelDiffInDays <= 5)) {


                            var PhyDiffCacelExp = (PhyCancelDiffInDays * 1) - (PhyExpDiffInDays * 1);

                            var PhysDay = "", PhysDate = "", PhysMonth = "", PhysYear = "";

                            var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                            var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];


                            if (PhyDiffCacelExp) {
                                if (PhyDiffCacelExp < 0) {
                                    PhysDay = NewPhysicalCancelDate.getDay();
                                    PhysDate = NewPhysicalCancelDate.getDate();
                                    PhysMonth = NewPhysicalCancelDate.getMonth();
                                    PhysYear = NewPhysicalCancelDate.getFullYear();
                                } else {
                                    PhysDay = NewPhysicalExpDate.getDay();
                                    PhysDate = NewPhysicalExpDate.getDate();
                                    PhysMonth = NewPhysicalExpDate.getMonth();
                                    PhysYear = NewPhysicalExpDate.getFullYear();
                                }
                                var PhysDayName = days[PhysDay];
                                var PhysMonthName = months[PhysMonth];

                                var NewTemplateBody = InsurTemplateBody1.replace(/@DAY@/g, PhysDayName).replace(/@DATE@/g, PhysMonthName + " " + PhysDate + "," + PhysYear).replace(/@CustomerName@/g, CustomerName).replace(/@SerialNumber@/g, VINLastSix).replace(/@VIN@/g, VinTxt).replace(/@CompanyName@/g, CompanyName).replace(/@Model@/g, vmModel).replace(/@Year@/g, vmModelYear).replace(/@Make@/g, vmModelMake).replace(/@PhysicalDamageCover@/g, PhyDmgCover);
                                var NewTemplateSubject = InsurTemplateSubject1.replace(/@DAY@/g, PhysDayName).replace(/@DATE@/g, PhysMonthName + " " + PhysDate + "," + PhysYear).replace(/@CustomerName@/g, CustomerName).replace(/@SerialNumber@/g, VINLastSix).replace(/@VIN@/g, VinTxt).replace(/@CompanyName@/g, CompanyName);

                                if (CustomerId && CustEmail) {

                                    email.send({
                                        author: UserId,
                                        body: NewTemplateBody,
                                        // recipients: "nikunj.k@advectus.net",
                                        recipients: CustomerId,
                                        subject: NewTemplateSubject
                                    });

                                    log.error("SENT->, 0 Day", "EMAIL SENT SUCCESSFULLY! -> Cust: " + CustomerId + ", LeaseID-> " + LeaseID);
                                }

                            }


                        }

                    }


                    return true;
                });
            });

        } catch (err) {
            log.error('Before 0 Day E-Mail->', err);
        }


        try {

            var customrecord_advs_lease_headerphys0_resSearchObj = search.create({
                type: "customrecord_advs_lease_header",
                filters:
                    [
                        ["isinactive", "is", "F"],
                        "AND",
                        [
                            ["formuladate: {custrecord_advs_l_h_ins_phy_dam_exp}", "onorafter", "today"],
                            "OR",
                            ["formuladate: {custrecord_advs_l_h_ins_cancel_date}", "onorafter", "today"],

                        ]
                    ],
                columns:
                    [
                        search.createColumn({ name: "internalid", label: "Internal ID" }),
                        search.createColumn({ name: "custrecord_advs_l_h_insurance", label: "Liability Carrier" }),
                        search.createColumn({ name: "custrecord_advs_l_h_phy_dam_ins", label: "Physical Damage Carrier" }),
                        search.createColumn({ name: "custrecord_advs_l_h_ins_phy_dam_exp", label: "Physical Expiration" }),
                        search.createColumn({ name: "custrecord_advs_l_h_ins_cancel_date", label: "Physical Cancellation" }),
                        search.createColumn({ name: "custrecord_advs_l_h_ins_lia_exp_dt", label: "Liability Expiration Date" }),
                        search.createColumn({ name: "custrecord32166", label: "Liability Cancellation" }),
                        search.createColumn({ name: "custrecord_advs_l_a_curr_cps", label: "Current CPC" }),
                        search.createColumn({ name: "custrecord_advs_l_h_customer_name", label: "Lessee Name " }),
                        search.createColumn({ name: "custrecord_advs_la_vin_bodyfld", label: "VIN" }),
                        search.createColumn({ name: "custrecord_advs_liability_type_f", label: "Liability Type" }),
                        search.createColumn({ name: "custrecord_advs_l_a_cpc", label: "Cpc Check" }),
                        search.createColumn({ name: "custrecord_advs_lease_comp_name_fa", label: "Company Name" }),
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
                            name: "email",
                            join: "custrecord_advs_l_h_customer_name",
                            label: "email"
                        }),
                        search.createColumn({
                            name: "custrecord_advs_cpc_date",
                            join: "CUSTRECORD_ADVS_L_A_CURR_CPS",
                            label: "Start Date"
                        })
                    ]
            });

            var LeaseHeaderObj = customrecord_advs_lease_headerphys0_resSearchObj.runPaged({ "pageSize": 1000 });
            LeaseHeaderObj.pageRanges.forEach(function (pageRange) {

                var LeaseHeaderPage = LeaseHeaderObj.fetch({ index: pageRange.index });
                LeaseHeaderPage.data.forEach(function (result) {

                    // customrecord_advs_lease_headerSearchObj.run().each(function (result) {

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
                    var PhysicalCancelDate = result.getValue({
                        name: "custrecord_advs_l_h_ins_cancel_date"
                    });
                    var LiabilityExpDate = result.getValue({
                        name: "custrecord_advs_l_h_ins_lia_exp_dt"
                    });
                    var LiabilityCancelDate = result.getValue({
                        name: "custrecord32166"
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
                    var VinTxt = result.getText({
                        name: "custrecord_advs_la_vin_bodyfld",
                    });
                    var CPCCheck = result.getValue({
                        name: "custrecord_advs_l_a_cpc",
                    });
                    var VINLastSix = result.getValue({
                        name: "custrecord_advs_em_serial_number",
                        join: "CUSTRECORD_ADVS_LA_VIN_BODYFLD"
                    });
                    var CompanyName = result.getValue({
                        name: "custrecord_advs_lease_comp_name_fa"
                    });
                    if (!CompanyName || (CompanyName == null || CompanyName == "" || CompanyName == " ")) {
                        CompanyName = "N/A";
                    }
                    var MobilePhone = result.getValue({
                        name: "mobilephone",
                        join: "custrecord_advs_l_h_customer_name"
                    });
                    var CPCSatrtDate = result.getValue({
                        name: "custrecord_advs_cpc_date",
                        join: "CUSTRECORD_ADVS_L_A_CURR_CPS"
                    });
                    var CustEmail = result.getValue({
                        name: "email",
                        join: "custrecord_advs_l_h_customer_name"
                    });

                    if (PhysicalCancelDate || PhysicalExpDate) {

                        var NewPhysicalExpDate = new Date(PhysicalExpDate);
                        var NewPhysicalCancelDate = new Date(PhysicalCancelDate);

                        var PhyExpDiffInMs = (NewFullDate - NewPhysicalExpDate);
                        var PhyCancelDiffInMs = (NewFullDate - NewPhysicalCancelDate);

                        var PhyExpDiffInDays = PhyExpDiffInMs / (1000 * 60 * 60 * 24);
                        var PhyCancelDiffInDays = PhyCancelDiffInMs / (1000 * 60 * 60 * 24);

                        if (PhyExpDiffInDays >= 0 || PhyCancelDiffInDays >= 0) {

                            var PhysDay = "", PhysDate = "", PhysMonth = "", PhysYear = "";

                            var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                            var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

                            PhysDay = NewPhysicalCancelDate.getDay();
                            PhysDate = NewPhysicalCancelDate.getDate();
                            PhysMonth = NewPhysicalCancelDate.getMonth();
                            PhysYear = NewPhysicalCancelDate.getFullYear();

                            var PhysDayName = days[PhysDay];
                            var PhysMonthName = months[PhysMonth];

                            var NewTemplateBody = InsurTemplateBody3.replace(/@DAY@/g, PhysDayName).replace(/@DATE@/g, PhysMonthName + " " + PhysDate + "," + PhysYear).replace(/@CustomerName@/g, CustomerName).replace(/@SerialNumber@/g, VINLastSix).replace(/@VIN@/g, VinTxt).replace(/@CompanyName@/g, CompanyName);
                            var NewTemplateSubject = InsurTemplateSubject3.replace(/@DAY@/g, PhysDayName).replace(/@DATE@/g, PhysMonthName + " " + PhysDate + "," + PhysYear).replace(/@CustomerName@/g, CustomerName).replace(/@SerialNumber@/g, VINLastSix).replace(/@VIN@/g, VinTxt).replace(/@CompanyName@/g, CompanyName);

                            if (CustomerId && CustEmail) {

                                email.send({
                                    author: UserId,
                                    body: NewTemplateBody,
                                    // recipients: "nikunj.k@advectus.net",
                                    recipients: CustomerId,
                                    subject: NewTemplateSubject
                                });

                                log.error("SENT->, phys0_res", "EMAIL SENT SUCCESSFULLY! ->Cust: " + CustomerId + ", LeaseID-> " + LeaseID);
                            }

                        }

                    }

                    return true;
                });
            });

        } catch (err) {
            log.error('Before phys0_res Day E-Mail->', err);
        }


        try {

            var customrecord_advs_lease_headerliab0_resSearchObj = search.create({
                type: "customrecord_advs_lease_header",
                filters:
                    [
                        ["isinactive", "is", "F"],
                        "AND",
                        ["custrecord_advs_liability_type_f", "any", "1"],
                        "AND",
                        [
                            ["formuladate: {custrecord_advs_l_h_ins_lia_exp_dt}", "onorafter", "today"],
                            "OR",
                            ["formuladate: {custrecord32166}", "onorafter", "today"],

                        ]
                    ],
                columns:
                    [
                        search.createColumn({ name: "internalid", label: "Internal ID" }),
                        search.createColumn({ name: "custrecord_advs_l_h_insurance", label: "Liability Carrier" }),
                        search.createColumn({ name: "custrecord_advs_l_h_phy_dam_ins", label: "Physical Damage Carrier" }),
                        search.createColumn({ name: "custrecord_advs_l_h_ins_phy_dam_exp", label: "Physical Expiration" }),
                        search.createColumn({ name: "custrecord_advs_l_h_ins_cancel_date", label: "Physical Cancellation" }),
                        search.createColumn({ name: "custrecord_advs_l_h_ins_lia_exp_dt", label: "Liability Expiration Date" }),
                        search.createColumn({ name: "custrecord32166", label: "Liability Cancellation" }),
                        search.createColumn({ name: "custrecord_advs_l_a_curr_cps", label: "Current CPC" }),
                        search.createColumn({ name: "custrecord_advs_l_h_customer_name", label: "Lessee Name " }),
                        search.createColumn({ name: "custrecord_advs_la_vin_bodyfld", label: "VIN" }),
                        search.createColumn({ name: "custrecord_advs_liability_type_f", label: "Liability Type" }),
                        search.createColumn({ name: "custrecord_advs_l_a_cpc", label: "Cpc Check" }),
                        search.createColumn({ name: "custrecord_advs_lease_comp_name_fa", label: "CompanyName" }),
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
                            name: "email",
                            join: "custrecord_advs_l_h_customer_name",
                            label: "email"
                        }),
                        search.createColumn({
                            name: "custrecord_advs_cpc_date",
                            join: "CUSTRECORD_ADVS_L_A_CURR_CPS",
                            label: "Start Date"
                        })
                    ]
            });

            var LeaseHeaderObj = customrecord_advs_lease_headerliab0_resSearchObj.runPaged({ "pageSize": 1000 });
            LeaseHeaderObj.pageRanges.forEach(function (pageRange) {

                var LeaseHeaderPage = LeaseHeaderObj.fetch({ index: pageRange.index });
                LeaseHeaderPage.data.forEach(function (result) {

                    // customrecord_advs_lease_headerSearchObj.run().each(function (result) {

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
                    var PhysicalCancelDate = result.getValue({
                        name: "custrecord_advs_l_h_ins_cancel_date"
                    });
                    var LiabilityExpDate = result.getValue({
                        name: "custrecord_advs_l_h_ins_lia_exp_dt"
                    });
                    var LiabilityCancelDate = result.getValue({
                        name: "custrecord32166"
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
                    var VinTxt = result.getText({
                        name: "custrecord_advs_la_vin_bodyfld",
                    });
                    var CPCCheck = result.getValue({
                        name: "custrecord_advs_l_a_cpc",
                    });
                    var VINLastSix = result.getValue({
                        name: "custrecord_advs_em_serial_number",
                        join: "CUSTRECORD_ADVS_LA_VIN_BODYFLD"
                    });
                    var CompanyName = result.getValue({
                        name: "custrecord_advs_lease_comp_name_fa"
                    });
                    if (!CompanyName || (CompanyName == null || CompanyName == "" || CompanyName == " ")) {
                        CompanyName = "N/A";
                    }
                    var MobilePhone = result.getValue({
                        name: "mobilephone",
                        join: "custrecord_advs_l_h_customer_name"
                    });
                    var CPCSatrtDate = result.getValue({
                        name: "custrecord_advs_cpc_date",
                        join: "CUSTRECORD_ADVS_L_A_CURR_CPS"
                    });
                    var CustEmail = result.getValue({
                        name: "email",
                        join: "custrecord_advs_l_h_customer_name"
                    });

                    if (LiabilityCancelDate || LiabilityExpDate) {

                        var NewLiabilityExpDate = new Date(LiabilityExpDate);
                        var NewLiabilityCancelDate = new Date(LiabilityCancelDate);

                        var LiabExpDiffInMs = (NewFullDate - NewLiabilityExpDate);
                        var LiabCancelDiffInMs = (NewFullDate - NewLiabilityCancelDate);

                        var LiabExpDiffInDays = LiabExpDiffInMs / (1000 * 60 * 60 * 24);
                        var LiabCancelDiffInDays = LiabCancelDiffInMs / (1000 * 60 * 60 * 24);

                        if (LiabExpDiffInDays >= 0 || LiabCancelDiffInDays >= 0) {

                            var LiabDay = "", LiabDate = "", LiabMonth = "", LiabYear = "";

                            var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                            var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

                            LiabDay = NewLiabilityExpDate.getDay();
                            LiabDate = NewLiabilityExpDate.getDate();
                            LiabMonth = NewLiabilityExpDate.getMonth();
                            LiabYear = NewLiabilityExpDate.getFullYear();

                            var LiabDayName = days[LiabDay];
                            var LiabMonthName = months[LiabMonth];

                            var NewTemplateBody = InsurTemplateBody4.replace(/@DAY@/g, LiabDayName).replace(/@DATE@/g, LiabMonthName + " " + LiabDate + "," + LiabYear).replace(/@CustomerName@/g, CustomerName).replace(/@SerialNumber@/g, VINLastSix).replace(/@VIN@/g, VinTxt).replace(/@CompanyName@/g, CompanyName);
                            var NewTemplateSubject = InsurTemplateSubject4.replace(/@DAY@/g, LiabDayName).replace(/@DATE@/g, LiabMonthName + " " + LiabDate + "," + LiabYear).replace(/@CustomerName@/g, CustomerName).replace(/@SerialNumber@/g, VINLastSix).replace(/@VIN@/g, VinTxt).replace(/@CompanyName@/g, CompanyName);

                            if (CustomerId && CustEmail) {

                                email.send({
                                    author: UserId,
                                    body: NewTemplateBody,
                                    // recipients: "nikunj.k@advectus.net",
                                    recipients: CustomerId,
                                    subject: NewTemplateSubject
                                });

                                log.error("SENT->, liab0_res", "EMAIL SENT SUCCESSFULLY! ->Cust: " + CustomerId + ", LeaseID-> " + LeaseID);
                            }



                        }
                    }

                    return true;
                });
            });

        } catch (err) {
            log.error('Before liab0_res Day E-Mail->', err);
        }


        try {

            var customrecord_advs_lease_header0_5SearchObj = search.create({
                type: "customrecord_advs_lease_header",
                filters:
                    [
                        ["isinactive", "is", "F"],
                        "AND",
                        [
                            ["formuladate: {custrecord_advs_l_h_ins_phy_dam_exp}", "after", "today"],
                            "OR",
                            ["formuladate: {custrecord_advs_l_h_ins_cancel_date}", "after", "today"],
                            "OR",
                            ["formuladate: {custrecord_advs_l_h_ins_lia_exp_dt}", "after", "today"],
                            "OR",
                            ["formuladate: {custrecord32166}", "after", "today"]
                        ]
                    ],
                columns:
                    [
                        search.createColumn({ name: "internalid", label: "Internal ID" }),
                        search.createColumn({ name: "custrecord_advs_l_h_insurance", label: "Liability Carrier" }),
                        search.createColumn({ name: "custrecord_advs_l_h_phy_dam_ins", label: "Physical Damage Carrier" }),
                        search.createColumn({ name: "custrecord_advs_l_h_ins_phy_dam_exp", label: "Physical Expiration" }),
                        search.createColumn({ name: "custrecord_advs_l_h_ins_cancel_date", label: "Physical Cancellation" }),
                        search.createColumn({ name: "custrecord_advs_l_h_ins_lia_exp_dt", label: "Liability Expiration Date" }),
                        search.createColumn({ name: "custrecord32166", label: "Liability Cancellation" }),
                        search.createColumn({ name: "custrecord_advs_l_a_curr_cps", label: "Current CPC" }),
                        search.createColumn({ name: "custrecord_advs_l_h_customer_name", label: "Lessee Name " }),
                        search.createColumn({ name: "custrecord_advs_la_vin_bodyfld", label: "VIN" }),
                        search.createColumn({ name: "custrecord_advs_liability_type_f", label: "Liability Type" }),
                        search.createColumn({ name: "custrecord_advs_l_a_cpc", label: "Cpc Check" }),
                        search.createColumn({ name: "custrecord_advs_lease_comp_name_fa", label: "CompanyName" }),
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
                            name: "email",
                            join: "custrecord_advs_l_h_customer_name",
                            label: "email"
                        }),
                        search.createColumn({
                            name: "custrecord_advs_cpc_date",
                            join: "CUSTRECORD_ADVS_L_A_CURR_CPS",
                            label: "Start Date"
                        })
                    ]
            });

            var LeaseHeaderObj = customrecord_advs_lease_header0_5SearchObj.runPaged({ "pageSize": 1000 });
            LeaseHeaderObj.pageRanges.forEach(function (pageRange) {

                var LeaseHeaderPage = LeaseHeaderObj.fetch({ index: pageRange.index });
                LeaseHeaderPage.data.forEach(function (result) {

                    // customrecord_advs_lease_headerSearchObj.run().each(function (result) {

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
                    var PhysicalCancelDate = result.getValue({
                        name: "custrecord_advs_l_h_ins_cancel_date"
                    });
                    var LiabilityExpDate = result.getValue({
                        name: "custrecord_advs_l_h_ins_lia_exp_dt"
                    });
                    var LiabilityCancelDate = result.getValue({
                        name: "custrecord32166"
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
                    var VinTxt = result.getText({
                        name: "custrecord_advs_la_vin_bodyfld",
                    });
                    var CPCCheck = result.getValue({
                        name: "custrecord_advs_l_a_cpc",
                    });
                    var VINLastSix = result.getValue({
                        name: "custrecord_advs_em_serial_number",
                        join: "CUSTRECORD_ADVS_LA_VIN_BODYFLD"
                    });
                    var CompanyName = result.getValue({
                        name: "custrecord_advs_lease_comp_name_fa"
                    });

                    if (!CompanyName || (CompanyName == null || CompanyName == "" || CompanyName == " ")) {
                        CompanyName = "N/A";
                    }
                    var MobilePhone = result.getValue({
                        name: "mobilephone",
                        join: "custrecord_advs_l_h_customer_name"
                    });
                    var CPCSatrtDate = result.getValue({
                        name: "custrecord_advs_cpc_date",
                        join: "CUSTRECORD_ADVS_L_A_CURR_CPS"
                    });
                    var CustEmail = result.getValue({
                        name: "email",
                        join: "custrecord_advs_l_h_customer_name"
                    });

                    if (PhysicalCancelDate || PhysicalExpDate || LiabilityCancelDate || LiabilityExpDate) {

                        var NewPhysicalExpDate = new Date(PhysicalExpDate);
                        var NewPhysicalCancelDate = new Date(PhysicalCancelDate);
                        var NewLiabilityExpDate = new Date(LiabilityExpDate);
                        var NewLiabilityCancelDate = new Date(LiabilityCancelDate);

                        var PhyExpDiffInMs = (NewPhysicalExpDate - NewFullDate);
                        var PhyCancelDiffInMs = (NewPhysicalCancelDate - NewFullDate);
                        var LiabExpDiffInMs = (NewLiabilityExpDate - NewFullDate);
                        var LiabCancelDiffInMs = (NewLiabilityCancelDate - NewFullDate);

                        var PhyExpDiffInDays = PhyExpDiffInMs / (1000 * 60 * 60 * 24);
                        var PhyCancelDiffInDays = PhyCancelDiffInMs / (1000 * 60 * 60 * 24);
                        var LiabExpDiffInDays = LiabExpDiffInMs / (1000 * 60 * 60 * 24);
                        var LiabCancelDiffInDays = LiabCancelDiffInMs / (1000 * 60 * 60 * 24);


                        if ((PhyExpDiffInDays > 0 && PhyExpDiffInDays <= 5) || (PhyCancelDiffInDays > 0 && PhyCancelDiffInDays <= 5) || (LiabExpDiffInDays > 0 && LiabExpDiffInDays <= 5) || (LiabCancelDiffInDays > 0 && LiabCancelDiffInDays <= 5)) {


                            var PhyDiffCacelExp = (PhyCancelDiffInDays * 1) - (PhyExpDiffInDays * 1);
                            var LiabDiffCacelExp = (LiabCancelDiffInDays * 1) - (LiabExpDiffInDays * 1);
                            

                            var PhysDay = "", PhysDate = "", PhysMonth = "", PhysYear = "";
                            var LiabDay = "", LiabDate = "", LiabMonth = "", LiabYear = "";

                            var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                            var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];


                            if (PhyDiffCacelExp <= 0) {
                                PhysDay = NewPhysicalCancelDate.getDay();
                                PhysDate = NewPhysicalCancelDate.getDate();
                                PhysMonth = NewPhysicalCancelDate.getMonth();
                                PhysYear = NewPhysicalCancelDate.getFullYear();
                            } else {
                                PhysDay = NewPhysicalExpDate.getDay();
                                PhysDate = NewPhysicalExpDate.getDate();
                                PhysMonth = NewPhysicalExpDate.getMonth();
                                PhysYear = NewPhysicalExpDate.getFullYear();
                            }
                            var PhysDayName = days[PhysDay];
                            var PhysMonthName = months[PhysMonth];

                            var NewTemplateBody = InsurTemplateBody2.replace(/@DAY@/g, PhysDayName).replace(/@DATE@/g, PhysMonthName + " " + PhysDate + "," + PhysYear).replace(/@CustomerName@/g, CustomerName).replace(/@SerialNumber@/g, VINLastSix).replace(/@VIN@/g, VinTxt).replace(/@CompanyName@/g, CompanyName);
                            var NewTemplateSubject = InsurTemplateSubject2.replace(/@DAY@/g, PhysDayName).replace(/@DATE@/g, PhysMonthName + " " + PhysDate + "," + PhysYear).replace(/@CustomerName@/g, CustomerName).replace(/@SerialNumber@/g, VINLastSix).replace(/@VIN@/g, VinTxt).replace(/@CompanyName@/g, CompanyName);

                            if (CustomerId && CustEmail) {

                                email.send({
                                    author: UserId,
                                    body: NewTemplateBody,
                                    // recipients: "nikunj.k@advectus.net",
                                    recipients: CustomerId,
                                    subject: NewTemplateSubject
                                });

                                log.error("SENT->, Phys_5-0_Days", "EMAIL SENT SUCCESSFULLY! -> Cust" + CustomerId + ", LeaseID-> " + LeaseID);

                            }


                            if (LiabDiffCacelExp < 0) {
                                LiabDay = NewLiabilityCancelDate.getDay();
                                LiabDate = NewLiabilityCancelDate.getDate();
                                LiabMonth = NewLiabilityCancelDate.getMonth();
                                LiabYear = NewLiabilityCancelDate.getFullYear();
                            } else {
                                LiabDay = NewLiabilityExpDate.getDay();
                                LiabDate = NewLiabilityExpDate.getDate();
                                LiabMonth = NewLiabilityExpDate.getMonth();
                                LiabYear = NewLiabilityExpDate.getFullYear();
                            }
                            var LiabDayName = days[LiabDay];
                            var LiabMonthName = months[LiabMonth];

                            var NewTemplateBody = InsurTemplateBody2.replace(/@DAY@/g, LiabDayName).replace(/@DATE@/g, LiabMonthName + " " + LiabDate + "," + LiabYear).replace(/@CustomerName@/g, CustomerName).replace(/@SerialNumber@/g, VINLastSix).replace(/@VIN@/g, VinTxt).replace(/@CompanyName@/g, CompanyName);
                            var NewTemplateSubject = InsurTemplateSubject2.replace(/@DAY@/g, LiabDayName).replace(/@DATE@/g, LiabMonthName + " " + LiabDate + "," + LiabYear).replace(/@CustomerName@/g, CustomerName).replace(/@SerialNumber@/g, VINLastSix).replace(/@VIN@/g, VinTxt).replace(/@CompanyName@/g, CompanyName);

                            if (CustomerId && CustEmail) {

                                email.send({
                                    author: UserId,
                                    body: NewTemplateBody,
                                    // recipients: "nikunj.k@advectus.net",
                                    recipients: CustomerId,
                                    subject: NewTemplateSubject
                                });

                                log.error("SENT->, Liab_5-0_Days", "EMAIL SENT SUCCESSFULLY! -> Cust" + CustomerId + ", LeaseID-> " + LeaseID);
                            }



                        }

                    }


                    return true;
                });
            });

        } catch (err) {
            log.error('Before 5-0 Day E-Mail->', err);
        }


        try {

            var customrecord_advs_lease_header_cpc_endSearchObj = search.create({
                type: "customrecord_advs_lease_header",
                filters:
                    [
                        ["isinactive", "is", "F"],
                        "AND",
                        [
                            ["formuladate: {custrecord_advs_l_h_ins_phy_dam_exp}", "onorbefore", "today"],
                            "OR",
                            ["formuladate: {custrecord_advs_l_h_ins_cancel_date}", "onorbefore", "today"],
                        ],
                    ],
                columns:
                    [
                        search.createColumn({ name: "internalid", label: "Internal ID" }),
                        search.createColumn({ name: "custrecord_advs_l_h_insurance", label: "Liability Carrier" }),
                        search.createColumn({ name: "custrecord_advs_l_h_phy_dam_ins", label: "Physical Damage Carrier" }),
                        search.createColumn({ name: "custrecord_advs_l_h_ins_phy_dam_exp", label: "Physical Expiration" }),
                        search.createColumn({ name: "custrecord_advs_l_h_ins_cancel_date", label: "Physical Cancellation" }),
                        search.createColumn({ name: "custrecord_advs_l_h_ins_lia_exp_dt", label: "Liability Expiration Date" }),
                        search.createColumn({ name: "custrecord32166", label: "Liability Cancellation" }),
                        search.createColumn({ name: "custrecord_advs_l_a_curr_cps", label: "Current CPC" }),
                        search.createColumn({ name: "custrecord_advs_l_h_customer_name", label: "Lessee Name " }),
                        search.createColumn({ name: "custrecord_advs_la_vin_bodyfld", label: "VIN" }),
                        search.createColumn({ name: "custrecord_advs_liability_type_f", label: "Liability Type" }),
                        search.createColumn({ name: "custrecord_advs_l_a_cpc", label: "Cpc Check" }),
                        search.createColumn({ name: "custrecord_advs_l_a_curr_cps", label: "Cpc ID" }),
                        search.createColumn({ name: "custrecord_advs_lease_comp_name_fa", label: "CompanyName" }),
                        search.createColumn({ name: "custrecord_advs_phy_dmg_cover", label: "phyDmgCover" }),
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
                            name: "email",
                            join: "custrecord_advs_l_h_customer_name",
                            label: "email"
                        }),
                        search.createColumn({
                            name: "custrecord_advs_cpc_date",
                            join: "CUSTRECORD_ADVS_L_A_CURR_CPS",
                            label: "Start Date"
                        }),
                        search.createColumn({
                            name: "custrecord_advs_cpc_exp_date",
                            join: "CUSTRECORD_ADVS_L_A_CURR_CPS",
                            label: "End Date"
                        }),
                        search.createColumn({
                            name: "custrecord_advs_vm_subsidary",
                            join: "custrecord_advs_la_vin_bodyfld",
                            label: "Subsidiary"
                        }),
                        search.createColumn({
                            name: "custrecord_advs_vm_location_code",
                            join: "custrecord_advs_la_vin_bodyfld",
                            label: "Location"
                        }),
                        search.createColumn({
                            name: "custrecord_advs_vm_model",
                            join: "custrecord_advs_la_vin_bodyfld",
                            label: "Model"
                        }),
                        search.createColumn({
                            name: "custrecord_advs_vm_model_year",
                            join: "custrecord_advs_la_vin_bodyfld",
                            label: "ModelYear"
                        }),
                        search.createColumn({
                            name: "custrecord_advs_vm_vehicle_brand",
                            join: "custrecord_advs_la_vin_bodyfld",
                            label: "Make"
                        })
                    ]
            });

            var LeaseHeaderObj = customrecord_advs_lease_header_cpc_endSearchObj.runPaged({ "pageSize": 1000 });
            LeaseHeaderObj.pageRanges.forEach(function (pageRange) {

                var LeaseHeaderPage = LeaseHeaderObj.fetch({ index: pageRange.index });
                LeaseHeaderPage.data.forEach(function (result) {

                    // customrecord_advs_lease_headerSearchObj.run().each(function (result) {

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
                    var PhysicalCancelDate = result.getValue({
                        name: "custrecord_advs_l_h_ins_cancel_date"
                    });
                    var LiabilityExpDate = result.getValue({
                        name: "custrecord_advs_l_h_ins_lia_exp_dt"
                    });
                    var LiabilityCancelDate = result.getValue({
                        name: "custrecord32166"
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
                    var VinTxt = result.getText({
                        name: "custrecord_advs_la_vin_bodyfld",
                    });
                    var CPCCheck = result.getValue({
                        name: "custrecord_advs_l_a_cpc",
                    });
                    var CPCId = result.getValue({
                        name: "custrecord_advs_l_a_curr_cps",
                    });
                    var VINLastSix = result.getValue({
                        name: "custrecord_advs_em_serial_number",
                        join: "CUSTRECORD_ADVS_LA_VIN_BODYFLD"
                    });
                    var CompanyName = result.getValue({
                        name: "custrecord_advs_lease_comp_name_fa"
                    });

                    if (!CompanyName || (CompanyName == null || CompanyName == "" || CompanyName == " ")) {
                        CompanyName = "N/A";
                    }
                    var MobilePhone = result.getValue({
                        name: "mobilephone",
                        join: "custrecord_advs_l_h_customer_name"
                    });
                    var CPCSatrtDate = result.getValue({
                        name: "custrecord_advs_cpc_date",
                        join: "CUSTRECORD_ADVS_L_A_CURR_CPS"
                    });
                    var CPCEndDate = result.getValue({
                        name: "custrecord_advs_cpc_exp_date",
                        join: "CUSTRECORD_ADVS_L_A_CURR_CPS"
                    });
                    var VmLocation = result.getValue({
                        name: "custrecord_advs_vm_location_code",
                        join: "custrecord_advs_la_vin_bodyfld"
                    });
                    var VmSubsidiary = result.getValue({
                        name: "custrecord_advs_vm_subsidary",
                        join: "custrecord_advs_la_vin_bodyfld"
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
                    var PhyDmgCover = result.getText({
                        name: "custrecord_advs_phy_dmg_cover"
                    });
                    var CustEmail = result.getValue({
                        name: "email",
                        join: "custrecord_advs_l_h_customer_name"
                    });

                    var NewCpcEndDate = new Date(CPCEndDate);


                    if (PhysicalCancelDate || PhysicalExpDate) {

                        var NewPhysicalExpDate = new Date(PhysicalExpDate);
                        var NewPhysicalCancelDate = new Date(PhysicalCancelDate);


                        var PhyExpDiffInMs = (NewPhysicalExpDate - NewFullDate);
                        var PhyCancelDiffInMs = (NewPhysicalCancelDate - NewFullDate);


                        var PhyExpDiffInDays = PhyExpDiffInMs / (1000 * 60 * 60 * 24);
                        var PhyCancelDiffInDays = PhyCancelDiffInMs / (1000 * 60 * 60 * 24);


                        if (PhyExpDiffInDays >= 0) {
                            // log.error("PhyExpDiffInDays-> " + PhyExpDiffInDays, "PhyCancelDiffInDays-> " + PhyCancelDiffInDays);

                            if ((PhyExpDiffInDays == 0) || (PhyCancelDiffInDays == 0)) {


                                var PhyDiffCacelExp = (PhyCancelDiffInDays * 1) - (PhyExpDiffInDays * 1);

                                var PhysDay = "", PhysDate = "", PhysMonth = "", PhysYear = "";

                                var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                                var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];



                                if (PhyDiffCacelExp <= 0) {
                                    PhysDay = NewPhysicalCancelDate.getDay();
                                    PhysDate = NewPhysicalCancelDate.getDate();
                                    PhysMonth = NewPhysicalCancelDate.getMonth();
                                    PhysYear = NewPhysicalCancelDate.getFullYear();
                                } else {
                                    PhysDay = NewPhysicalExpDate.getDay();
                                    PhysDate = NewPhysicalExpDate.getDate();
                                    PhysMonth = NewPhysicalExpDate.getMonth();
                                    PhysYear = NewPhysicalExpDate.getFullYear();
                                }
                                var PhysDayName = days[PhysDay];
                                var PhysMonthName = months[PhysMonth];

                                var NewTemplateBody = InsurTemplateBody1.replace(/@DAY@/g, PhysDayName).replace(/@DATE@/g, PhysMonthName + " " + PhysDate + "," + PhysYear).replace(/@CustomerName@/g, CustomerName).replace(/@SerialNumber@/g, VINLastSix).replace(/@VIN@/g, VinTxt).replace(/@CompanyName@/g, CompanyName).replace(/@Model@/g, vmModel).replace(/@Year@/g, vmModelYear).replace(/@Make@/g, vmModelMake).replace(/@PhysicalDamageCover@/g, PhyDmgCover);
                                var NewTemplateSubject = InsurTemplateSubject1.replace(/@DAY@/g, PhysDayName).replace(/@DATE@/g, PhysMonthName + " " + PhysDate + "," + PhysYear).replace(/@CustomerName@/g, CustomerName).replace(/@SerialNumber@/g, VINLastSix).replace(/@VIN@/g, VinTxt).replace(/@CompanyName@/g, CompanyName).replace(/@Model@/g, vmModel).replace(/@Year@/g, vmModelYear).replace(/@Make@/g, vmModelMake);

                                log.error("CPCId-> " + CPCId, "CPCCheck-> " + CPCCheck);
                                var FPhysicalExpDate = format.parse({
                                    value: PhysicalExpDate,
                                    type: format.Type.DATE
                                });
                                //
                                if (!CPCId && (CPCCheck != true || CPCCheck != "true" || CPCCheck != "T")) {

                                    var CpcRecordObj = record.create({
                                        type: "customrecord_advs_lease_cpc",
                                        isDynamic: true
                                    });

                                    CpcRecordObj.setValue({
                                        fieldId: "custrecord_advs_cpc_lease",
                                        value: LeaseID
                                    });
                                    CpcRecordObj.setValue({
                                        fieldId: "custrecord_cpc_email_template_fld",
                                        value: "1"
                                    });
                                    CpcRecordObj.setValue({
                                        fieldId: "custrecord_advs_cpc_insu_comp_name",
                                        value: "4"
                                    });

                                    CpcRecordObj.setValue({
                                        fieldId: "custrecord_advs_cpc_date",
                                        value: FPhysicalExpDate
                                    });


                                    var CPCRecId = CpcRecordObj.save({
                                        enableSourcing: true,
                                        ignoreMandatoryFields: true
                                    });

                                    log.error("CPCRecId-> " + CPCRecId, "LeaseID-> " + LeaseID);

                                } else if (CPCId && (CPCCheck == true || CPCCheck == "true" || CPCCheck == "T")) {
                                    record.submitFields({
                                        type: "customrecord_advs_lease_cpc",
                                        id: CPCId,
                                        values: {
                                            "custrecord_advs_cpc_date": FPhysicalExpDate
                                        }
                                    });
                                }
                                //


                                email.send({
                                    author: UserId,
                                    body: NewTemplateBody,
                                    recipients: ["service@truenorthcompanies.com", "mmcdonald@truenorthcompanies.com","louis@lrmleasing.com"],
                                    subject: NewTemplateSubject
                                });

                                log.error("SENT->, truenorthcompanies0_Days", "EMAIL SENT SUCCESSFULLY! -> Cust " + CustomerId + ", LeaseID-> " + LeaseID);

                            }

                            log.error("NewCpcEndDate-> " + NewCpcEndDate, "NewFullDate-> " + NewFullDate);

                            if (NewCpcEndDate != NewFullDate) {

                                if (LeaseID && VmLocation && VmSubsidiary) {

                                    var InvoiceObj = record.create({
                                        type: record.Type.INVOICE,
                                        isDynamic: true
                                    });

                                    InvoiceObj.setValue({
                                        fieldId: "entity",
                                        value: CustomerId
                                    });
                                    InvoiceObj.setValue({
                                        fieldId: "subsidiary",
                                        value: VmSubsidiary
                                    });
                                    InvoiceObj.setValue({
                                        fieldId: "location",
                                        value: VmLocation
                                    });
                                    InvoiceObj.setValue({
                                        fieldId: "custbody_advs_lease_head",
                                        value: LeaseID
                                    });

                                    //newLine
                                    InvoiceObj.selectNewLine({
                                        sublistId: "item"
                                    });

                                    InvoiceObj.setCurrentSublistValue({
                                        sublistId: "item",
                                        fieldId: "item",
                                        value: "6105"
                                    });

                                    InvoiceObj.setCurrentSublistValue({
                                        sublistId: "item",
                                        fieldId: "rate",
                                        value: "50"
                                    });

                                    InvoiceObj.commitLine({
                                        sublistId: "item"
                                    });
                                    //newline
                                    var InvoiceId = InvoiceObj.save({
                                        ignoreMandatoryFields: true
                                    });

                                    if (InvoiceId) {

                                        var RecordObj = record.create({
                                            type: "customrecord_advs_insur_cpc_fee",
                                            isDynamic: true
                                        });

                                        RecordObj.setValue({
                                            fieldId: "custrecord_advs_insur_fee_leaselink",
                                            value: LeaseID
                                        });
                                        RecordObj.setValue({
                                            fieldId: "custrecord_advs_insur_fee_item",
                                            value: "CPC charge"
                                        });
                                        RecordObj.setValue({
                                            fieldId: "custrecord_advs_insur_fee_item_rate",
                                            value: "50"
                                        });
                                        RecordObj.setValue({
                                            fieldId: "custrecord_advs_insur_fee_invoicelink",
                                            value: InvoiceId
                                        });

                                        var FeeRecordId = RecordObj.save();


                                    }

                                }

                                log.error("LeaseID-> " + LeaseID, "InvoiceId-> " + InvoiceId + " FeeRecordId-> " + FeeRecordId);
                            }
                        }


                    }


                    return true;
                });
            });

        } catch (err) {
            log.error('Before 50 Cpc add->', err);
        }





    }

    return {
        execute: execute
    };

});
