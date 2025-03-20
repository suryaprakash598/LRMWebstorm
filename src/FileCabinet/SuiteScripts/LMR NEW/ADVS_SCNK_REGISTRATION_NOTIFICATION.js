/**
 * @NApiVersion 2.x
 * @NScriptType ScheduledScript
 */
define(['N/log', 'N/record', 'N/search', 'N/runtime', 'N/email'], function (log, record, search, runtime, email) {

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

        var customrecord_advs_reg_dash_email_templSearchObj = search.create({
            type: "customrecord_advs_reg_dash_email_templ",
            filters:
                [
                    ["isinactive", "is", "F"],
                    "AND",
                    ["internalid", "anyof", "2"]
                ],
            columns:
                [
                    search.createColumn({ name: "name", label: "Name" }),
                    search.createColumn({ name: "custrecord_advs_sub_reg_field", label: "Subject" }),
                    search.createColumn({ name: "custrecord_advs_template_reg_body", label: "Template Body" })
                ]
        });

        customrecord_advs_reg_dash_email_templSearchObj.run().each(function (result) {

            TemplateSubject = result.getValue({
                name: "custrecord_advs_sub_reg_field"
            });
            TemplateBody = result.getValue({
                name: "custrecord_advs_template_reg_body"
            });

            return true;
        });

        /***************************************************************************************************/


        try {

            /*Search for 0 Days for Expiry*/
            var customrecord_advs_vmSearchObj = search.create({
                type: "customrecord_advs_vm",
                filters:
                    [
                        ["isinactive", "is", "F"],
                        "AND",
                        ["custrecord_advs_temp_no_plate", "is", "F"],
                        "AND",
                        [
                            ["custrecord_advs_vm_plate_expiration", "on", "today"],
                            "OR",
                            ["formuladate: {custrecord_advs_vm_plate_expiration}-30", "on", "today"],
                            "OR",
                            ["formuladate: {custrecord_advs_vm_plate_expiration} + 30", "on", "today"]

                        ]
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
                        search.createColumn({
                            name: "custrecord_advs_l_h_start_date",
                            join: "custrecord_advs_vm_lea_hea",
                            label: "Lease Date"
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

            customrecord_advs_vmSearchObj.run().each(function (result) {

                var VIN = result.getValue({
                    name: "name"
                });
                var TruckMasterId = result.getValue({
                    name: "internalid"
                });
                var VINLastSix = result.getValue({
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

                if (Customer) {

                    var FirstName = result.getValue({
                        name: "firstname",
                        join: "CUSTRECORD_ADVS_CUSTOMER"
                    });
                    var LastName = result.getValue({
                        name: "lastname",
                        join: "CUSTRECORD_ADVS_CUSTOMER"
                    });

                    // if (!FirstName || FirstName == "" || FirstName == "") {
                    //     var CustomerName = FirstName + " " + LastName;
                    // } else {
                    var CustomerName = Customer;
                    // }

                    if (RegiExpiryDate) {

                        RegiExpiryDate = new Date(RegiExpiryDate);

                        // Add 30 days and preserve the Date object
                        RegiExpiryDate.setDate(RegiExpiryDate.getDate() + 30);

                        var RegiDay = RegiExpiryDate.getDay();
                        var RegiDate = RegiExpiryDate.getDate();
                        var RegiMonth = RegiExpiryDate.getMonth();
                        var RegiYear = RegiExpiryDate.getFullYear();

                        var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                        var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

                        var RegiDayName = days[RegiDay];
                        var RegiMonthName = months[RegiMonth];

                        var NewTemplateBody = TemplateBody.replace(/@DAY@/g, RegiDayName).replace(/@DATE@/g, RegiMonthName + " " + RegiDate + "," + RegiYear).replace(/@CUSTOMERNAME@/g, CustomerName).replace(/@VIN@/g, VINLastSix);
                        var NewTemplateSubject = TemplateSubject.replace(/@DAY@/g, RegiDayName).replace(/@DATE@/g, RegiMonthName + " " + RegiDate + "," + RegiYear).replace(/@CUSTOMERNAME@/g, CustomerName).replace(/@VIN@/g, VINLastSix);


                        email.send({
                            author: UserId,
                            body: NewTemplateBody,
                            recipients: CustomerId,
                            subject: NewTemplateSubject
                        });

                        log.error("REGI 0,-30,+30 EMAIL->", "EMAIL SENT SUCCESSFULLY! ->" + ", VINLastSix-> " + VINLastSix + ", TruckMasterId-> " + TruckMasterId);

                    }
                }
                return true;
            });

        } catch (e) {
            // Handle errors
            log.error('Regi 0 Days for Expiry', e.toString());
        }



        try {

            /*Search for 15 Days after last email. */
            var customrecord_advs_vmSearchObj = search.create({
                type: "customrecord_advs_vm",
                filters:
                    [
                        ["isinactive", "is", "F"],
                        "AND",
                        ["custrecord_advs_temp_no_plate", "is", "F"],
                        "AND",
                        ["formuladate: {custrecord_advs_vm_plate_expiration}+30", "before", "today"]

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
                        search.createColumn({
                            name: "custrecord_advs_l_h_start_date",
                            join: "custrecord_advs_vm_lea_hea",
                            label: "Lease Date"
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
                        }), search.createColumn({
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

            customrecord_advs_vmSearchObj.run().each(function (result) {

                var VIN = result.getValue({
                    name: "name"
                });
                var TruckMasterId = result.getValue({
                    name: "internalid"
                });
                var VINLastSix = result.getValue({
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
                var LeaseLink = result.getValue({
                    name: "custrecord_advs_vm_lea_hea"
                });

                var FirstName = result.getValue({
                    name: "firstname",
                    join: "CUSTRECORD_ADVS_CUSTOMER"
                });
                var LastName = result.getValue({
                    name: "lastname",
                    join: "CUSTRECORD_ADVS_CUSTOMER"
                });

                if (RegiExpiryDate) {

                    var Today = new Date();
                    RegiExpiryDate = new Date(RegiExpiryDate);

                    // log.error("RegiExpiryDate-> " + RegiExpiryDate, "NewFullDate-> " + NewFullDate+", LeaseLink-> "+LeaseLink);

                    var DiffInMs = (NewFullDate - RegiExpiryDate);
                    var DiffInDays = DiffInMs / (1000 * 60 * 60 * 24);

                    if (DiffInDays > 0) {

                        // DiffInDays = DiffInDays * (-1)
                        DiffInDays = Math.floor(DiffInDays);

                        var minus30Days = DiffInDays - 30;
                        var divideby15 = minus30Days % 15;

                        // log.error("DiffInDays-> " + DiffInDays, "minus30Days-> " + minus30Days);

                        if ((minus30Days > 0) && divideby15 == 0) {

                            // if (!FirstName || FirstName == "" || FirstName == "") {
                            //     var CustomerName = FirstName + " " + LastName;
                            // } else {
                            var CustomerName = Customer;
                            // }


                            // Add 30 days and preserve the Date object
                            RegiExpiryDate.setDate(RegiExpiryDate.getDate() + 30);

                            var RegiDay = RegiExpiryDate.getDay();
                            var RegiDate = RegiExpiryDate.getDate();
                            var RegiMonth = RegiExpiryDate.getMonth();
                            var RegiYear = RegiExpiryDate.getFullYear();

                            var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                            var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];



                            // log.error("RegiMonth-> ", RegiMonth);

                            var RegiDayName = days[RegiDay];
                            var RegiMonthName = months[RegiMonth];

                            // log.error("RegiMonthName-> ", RegiMonthName);

                            var NewTemplateBody = TemplateBody.replace(/@DAY@/g, RegiDayName).replace(/@DATE@/g, RegiMonthName + " " + RegiDate + "," + RegiYear).replace(/@CUSTOMERNAME@/g, CustomerName).replace(/@VIN@/g, VINLastSix);
                            var NewTemplateSubject = TemplateSubject.replace(/@DAY@/g, RegiDayName).replace(/@DATE@/g, RegiMonthName + " " + RegiDate + "," + RegiYear).replace(/@CUSTOMERNAME@/g, CustomerName).replace(/@VIN@/g, VINLastSix);


                            email.send({
                                author: UserId,
                                body: NewTemplateBody,
                                recipients: CustomerId,
                                subject: NewTemplateSubject
                            });

                            log.error("REGI 15_res EMAIL-> ", "EMAIL SENT SUCCESSFULLY!" + ", VINLastSix-> " + VINLastSix + ", TruckMasterId-> " + TruckMasterId);

                        }
                    }
                }

                return true;
            });

        } catch (e) {
            // Handle errors
            log.error('Regi 15 Days after last email', e.toString());
        }


        try {

            /*Search for 31 Days After Expiry ADD*/
            var customrecord_advs_vmSearchObj = search.create({
                type: "customrecord_advs_vm",
                filters:
                    [
                        ["isinactive", "is", "F"],
                        "AND",
                        ["custrecord_advs_temp_no_plate", "is", "F"],
                        "AND",
                        ["formuladate: {custrecord_advs_vm_plate_expiration}+31", "onorbefore", "today"],
                        "AND",
                        ["custrecord_advs_vm_plate_expiration", "isnotempty", ""]

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
                        search.createColumn({ name: "custrecord_advs_vm_last_email_lease", label: "Last Email Lease" }),
                        search.createColumn({ name: "custrecord_advs_vm_last_email_regi", label: "Last Email Regi" }),
                        search.createColumn({
                            name: "custrecord_advs_l_h_start_date",
                            join: "custrecord_advs_vm_lea_hea",
                            label: "Lease Date"
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
                        search.createColumn({
                            name: "custrecord_advs_vm_subsidary",
                            label: "Subsidiary"
                        }),
                        search.createColumn({
                            name: "custrecord_advs_vm_location_code",
                            label: "Location"
                        }),
                        search.createColumn({
                            name: "isperson",
                            join: "CUSTRECORD_ADVS_CUSTOMER",
                            label: "IsPerson"
                        }),
                    ]
            });

            customrecord_advs_vmSearchObj.run().each(function (result) {

                var LeaseLink = result.getValue({
                    name: "custrecord_advs_vm_lea_hea"
                });

                var CustomerId = result.getValue({
                    name: "custrecord_advs_customer"
                });

                var Subsidiary = result.getValue({
                    name: "custrecord_advs_vm_subsidary",
                });
                var Location = result.getValue({
                    name: "custrecord_advs_vm_location_code",
                });

                var RegiExpiryDate = result.getValue({
                    name: "custrecord_advs_vm_plate_expiration"
                });


                RegiExpiryDate = new Date(RegiExpiryDate);

                // log.error("RegiExpiryDate-> " + RegiExpiryDate, "NewFullDate-> " + NewFullDate+", LeaseLink-> "+LeaseLink);

                var DiffInMs = (NewFullDate - RegiExpiryDate);
                var DiffInDays = DiffInMs / (1000 * 60 * 60 * 24);

                try {

                    if (DiffInDays > 0) {

                        // DiffInDays = DiffInDays * (-1)
                        DiffInDays = Math.floor(DiffInDays);

                        var minus31Days = DiffInDays - 31;
                        var divideby30 = minus31Days % 30;


                        // log.error("DiffInDays-> " + DiffInDays, "minus31Days-> " + minus31Days);
                        if ((minus31Days >= 0) && divideby30 == 0) {

                            if (LeaseLink && Subsidiary && Location) {

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
                                    value: Subsidiary
                                });
                                InvoiceObj.setValue({
                                    fieldId: "location",
                                    value: Location
                                });

                                InvoiceObj.setValue({
                                    fieldId: "custbody_advs_lease_head",
                                    value: LeaseLink
                                });

                                //newLine
                                InvoiceObj.selectNewLine({
                                    sublistId: "item"
                                });

                                InvoiceObj.setCurrentSublistValue({
                                    sublistId: "item",
                                    fieldId: "item",
                                    value: "6102"
                                });
                                InvoiceObj.setCurrentSublistValue({
                                    sublistId: "item",
                                    fieldId: "rate",
                                    value: 250
                                });

                                InvoiceObj.commitLine({
                                    sublistId: "item"
                                });
                                //newLine

                                var InvoiceId = InvoiceObj.save({
                                    ignoreMandatoryFields: true
                                });


                                if (InvoiceId) {

                                    var RecordObj = record.create({
                                        type: "customrecord_advs_lease_registration_fee",
                                        isDynamic: true
                                    });

                                    RecordObj.setValue({
                                        fieldId: "custrecord_advs_regi_fee_leaselink",
                                        value: LeaseLink
                                    });
                                    RecordObj.setValue({
                                        fieldId: "custrecord_advs_regi_fee_item",
                                        value: "Registration administrative charge"
                                    });
                                    RecordObj.setValue({
                                        fieldId: "custrecord_advs_regi_fee_item_rate",
                                        value: 250
                                    });
                                    RecordObj.setValue({
                                        fieldId: "custrecord_advs_regi_fee_invoicelink",
                                        value: InvoiceId
                                    });

                                    var FeeRecordId = RecordObj.save();

                                    log.error("Regi 31 FeeRecordId-> " + FeeRecordId, "Leaslink-> " + LeaseLink);
                                }
                            }
                        }
                    }

                } catch (error) {
                    log.error("ERROR IN INVOICE REGI SEARCH-> ", error);
                }


                return true;
            });

        } catch (e) {
            // Handle errors
            log.error('Regi 31 Days After Expiry ADD', e.toString());
        }

        /***************************************************************************************************/

        var customrecord_advs_reg_dash_email_templSearchObj = search.create({
            type: "customrecord_advs_reg_dash_email_templ",
            filters:
                [
                    ["isinactive", "is", "F"],
                    "AND",
                    ["internalid", "anyof", "1"]
                ],
            columns:
                [
                    search.createColumn({ name: "name", label: "Name" }),
                    search.createColumn({ name: "custrecord_advs_sub_reg_field", label: "Subject" }),
                    search.createColumn({ name: "custrecord_advs_template_reg_body", label: "Template Body" })
                ]
        });

        customrecord_advs_reg_dash_email_templSearchObj.run().each(function (result) {

            TemplateSubject = result.getValue({
                name: "custrecord_advs_sub_reg_field"
            });
            TemplateBody = result.getValue({
                name: "custrecord_advs_template_reg_body"
            });

            return true;
        });

        /***************************************************************************************************/

        try {

            var customrecord_advs_lease_headerSearchObj = search.create({
                type: "customrecord_advs_lease_header",
                filters:
                    [
                        ["isinactive", "is", "F"],
                        "AND",
                        [
                            ["formuladate: {custrecord_advs_l_h_start_date} + 1", "on", "today"]
                        ]
                    ],
                columns:
                    [
                        search.createColumn({ name: "internalid", label: "InternalID" }),
                        search.createColumn({ name: "name", label: "ID" }),
                        search.createColumn({ name: "custrecord_advs_l_h_customer_name", label: "Lessee Name " }),
                        search.createColumn({ name: "custrecord_advs_la_vin_bodyfld", label: "VIN" }),
                        search.createColumn({ name: "custrecord_advs_l_h_start_date", label: "Accrual Start Date " }),
                        search.createColumn({
                            name: "firstname",
                            join: "custrecord_advs_l_h_customer_name",
                            lable: "customer"
                        }),
                        search.createColumn({
                            name: "lastname",
                            join: "custrecord_advs_l_h_customer_name",
                            lable: "customer"
                        }),
                        search.createColumn({
                            name: "isperson",
                            join: "custrecord_advs_l_h_customer_name",
                            lable: "isPerson"
                        }),
                        search.createColumn({
                            name: "companyname",
                            join: "custrecord_advs_l_h_customer_name",
                            lable: "CompanyName"
                        }),
                        search.createColumn({
                            name: "custrecord_advs_em_serial_number",
                            join: "custrecord_advs_la_vin_bodyfld",
                            lable: "VinLastSix"
                        }),
                    ]
            });

            customrecord_advs_lease_headerSearchObj.run().each(function (result) {

                var LeaseId = result.getValue({
                    name: "internalid"
                });
                var CustomerId = result.getValue({
                    name: "custrecord_advs_l_h_customer_name"
                });
                var CustomerText = result.getText({
                    name: "custrecord_advs_l_h_customer_name"
                });
                var VINId = result.getValue({
                    name: "custrecord_advs_la_vin_bodyfld"
                });
                var VINNum = result.getText({
                    name: "custrecord_advs_la_vin_bodyfld"
                });
                var LeaseDate = result.getValue({
                    name: "custrecord_advs_l_h_start_date"
                });


                if (CustomerId) {
                    var FirstName = result.getValue({
                        name: "firstname",
                        join: "custrecord_advs_l_h_customer_name"
                    });

                    var LastName = result.getValue({
                        name: "lastname",
                        join: "custrecord_advs_l_h_customer_name"
                    });
                    var VinLastSix = result.getValue({
                        name: "custrecord_advs_em_serial_number",
                        join: "custrecord_advs_la_vin_bodyfld",
                    });

                    // if (!FirstName || FirstName == "" || FirstName == "") {
                    //     var CustomerName = FirstName + " " + LastName;
                    // } else {
                    var CustomerName = CustomerText;
                    // }


                    if (LeaseDate) {

                        var NewLeaseDate = new Date(LeaseDate);

                        // Add 30 days and preserve the Date object
                        NewLeaseDate.setDate(NewLeaseDate.getDate() + 30);

                        var LeaseDay = NewLeaseDate.getDay();
                        var LeaseDate = NewLeaseDate.getDate();
                        var LeaseMonth = NewLeaseDate.getMonth();
                        var LeaseYear = NewLeaseDate.getFullYear();

                        var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                        var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

                        var LeaseDayName = days[LeaseDay];
                        var LeaseMonthName = months[LeaseMonth];

                        var NewTemplateBody = TemplateBody.replace(/@DAY@/g, LeaseDayName).replace(/@DATE@/g, LeaseMonthName + " " + LeaseDate + "," + LeaseYear).replace(/@CUSTOMERNAME@/g, CustomerName).replace(/@VIN@/g, VinLastSix);
                        var NewTemplateSubject = TemplateSubject.replace(/@DAY@/g, LeaseDayName).replace(/@DATE@/g, LeaseMonthName + " " + LeaseDate + "," + LeaseYear).replace(/@CUSTOMERNAME@/g, CustomerName).replace(/@VIN@/g, VinLastSix);


                        email.send({
                            author: UserId,
                            body: NewTemplateBody,
                            recipients: CustomerId,
                            subject: NewTemplateSubject
                        });

                        log.error("0 LEASE EMAIL->", "EMAIL SENT SUCCESSFULLY! ->" + ", VinLastSix-> " + VinLastSix + ", LeaseId-> " + LeaseId);
                    }
                }

                return true;
            });

        } catch (err) {
            log.error('Lease 0 day ERROR->>', err.message);
        }


        try {
            var customrecord_advs_lease_headerSearchObj = search.create({
                type: "customrecord_advs_lease_header",
                filters:
                    [
                        ["isinactive", "is", "F"],
                        "AND",
                        ["custrecord_advs_la_vin_bodyfld.custrecord_advs_vm_plate_expiration", "isempty", ""],
                        "AND",
                        ["custrecord_advs_la_vin_bodyfld.custrecord_advs_temp_no_plate", "is", "F"],
                        "AND",
                        [
                            ["formuladate: {custrecord_advs_l_h_start_date} + 15", "on", "today"],
                            "OR",
                            ["formuladate: {custrecord_advs_l_h_start_date} + 30", "on", "today"]
                        ]
                    ],
                columns:
                    [
                        search.createColumn({ name: "internalid", label: "InternalID" }),
                        search.createColumn({ name: "name", label: "ID" }),
                        search.createColumn({ name: "custrecord_advs_l_h_customer_name", label: "Lessee Name " }),
                        search.createColumn({ name: "custrecord_advs_la_vin_bodyfld", label: "VIN" }),
                        search.createColumn({ name: "custrecord_advs_l_h_start_date", label: "Accrual Start Date " }),
                        search.createColumn({
                            name: "firstname",
                            join: "custrecord_advs_l_h_customer_name",
                            lable: "customer"
                        }),
                        search.createColumn({
                            name: "lastname",
                            join: "custrecord_advs_l_h_customer_name",
                            lable: "customer"
                        }),
                        search.createColumn({
                            name: "isperson",
                            join: "custrecord_advs_l_h_customer_name",
                            lable: "isPerson"
                        }),
                        search.createColumn({
                            name: "companyname",
                            join: "custrecord_advs_l_h_customer_name",
                            lable: "CompanyName"
                        }),
                        search.createColumn({
                            name: "custrecord_advs_em_serial_number",
                            join: "custrecord_advs_la_vin_bodyfld",
                            lable: "VinLastSix"
                        }),
                    ]
            });

            customrecord_advs_lease_headerSearchObj.run().each(function (result) {

                var LeaseId = result.getValue({
                    name: "internalid"
                });
                var CustomerId = result.getValue({
                    name: "custrecord_advs_l_h_customer_name"
                });
                var CustomerText = result.getText({
                    name: "custrecord_advs_l_h_customer_name"
                });
                var VINId = result.getValue({
                    name: "custrecord_advs_la_vin_bodyfld"
                });
                var VINNum = result.getText({
                    name: "custrecord_advs_la_vin_bodyfld"
                });
                var LeaseDate = result.getValue({
                    name: "custrecord_advs_l_h_start_date"
                });


                if (CustomerId) {
                    var FirstName = result.getValue({
                        name: "firstname",
                        join: "custrecord_advs_l_h_customer_name"
                    });

                    var LastName = result.getValue({
                        name: "lastname",
                        join: "custrecord_advs_l_h_customer_name"
                    });
                    var VinLastSix = result.getValue({
                        name: "custrecord_advs_em_serial_number",
                        join: "custrecord_advs_la_vin_bodyfld",
                    });

                    // if (!FirstName || FirstName == "" || FirstName == "") {
                    //     var CustomerName = FirstName + " " + LastName;
                    // } else {
                    var CustomerName = CustomerText;
                    // }


                    if (LeaseDate) {

                        var NewLeaseDate = new Date(LeaseDate);

                        // Add 30 days and preserve the Date object
                        NewLeaseDate.setDate(NewLeaseDate.getDate() + 30);

                        var LeaseDay = NewLeaseDate.getDay();
                        var LeaseDate = NewLeaseDate.getDate();
                        var LeaseMonth = NewLeaseDate.getMonth();
                        var LeaseYear = NewLeaseDate.getFullYear();

                        var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                        var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

                        var LeaseDayName = days[LeaseDay];
                        var LeaseMonthName = months[LeaseMonth];

                        var NewTemplateBody = TemplateBody.replace(/@DAY@/g, LeaseDayName).replace(/@DATE@/g, LeaseMonthName + " " + LeaseDate + "," + LeaseYear).replace(/@CUSTOMERNAME@/g, CustomerName).replace(/@VIN@/g, VinLastSix);
                        var NewTemplateSubject = TemplateSubject.replace(/@DAY@/g, LeaseDayName).replace(/@DATE@/g, LeaseMonthName + " " + LeaseDate + "," + LeaseYear).replace(/@CUSTOMERNAME@/g, CustomerName).replace(/@VIN@/g, VinLastSix);


                        email.send({
                            author: UserId,
                            body: NewTemplateBody,
                            recipients: CustomerId,
                            subject: NewTemplateSubject
                        });

                        log.error("15,30 LEASE EMAIL->", "EMAIL SENT SUCCESSFULLY! ->" + ", VinLastSix-> " + VinLastSix + ", LeaseId-> " + LeaseId);
                    }
                }

                return true;
            });

        } catch (error) {

            log.error("Lease 15,30 day ERROR->> ", error);
        }


        try {
            var customrecord_advs_lease_headerSearchObj = search.create({
                type: "customrecord_advs_lease_header",
                filters:
                    [
                        ["isinactive", "is", "F"],
                        "AND",
                        ["custrecord_advs_la_vin_bodyfld.custrecord_advs_vm_plate_expiration", "isempty", ""],
                        "AND",
                        ["custrecord_advs_la_vin_bodyfld.custrecord_advs_temp_no_plate", "is", "F"],
                        "AND",
                        [
                            ["formuladate: {custrecord_advs_l_h_start_date} + 30", "before", "today"],

                        ]
                    ],
                columns:
                    [
                        search.createColumn({ name: "internalid", label: "InternalID" }),
                        search.createColumn({ name: "name", label: "ID" }),
                        search.createColumn({ name: "custrecord_advs_l_h_customer_name", label: "Lessee Name " }),
                        search.createColumn({ name: "custrecord_advs_la_vin_bodyfld", label: "VIN" }),
                        search.createColumn({ name: "custrecord_advs_l_h_start_date", label: "Accrual Start Date " }),
                        search.createColumn({
                            name: "firstname",
                            join: "custrecord_advs_l_h_customer_name",
                            lable: "customer"
                        }),
                        search.createColumn({
                            name: "lastname",
                            join: "custrecord_advs_l_h_customer_name",
                            lable: "customer"
                        }),
                        search.createColumn({
                            name: "isperson",
                            join: "custrecord_advs_l_h_customer_name",
                            lable: "isPerson"
                        }),
                        search.createColumn({
                            name: "companyname",
                            join: "custrecord_advs_l_h_customer_name",
                            lable: "CompanyName"
                        }),
                        search.createColumn({
                            name: "custrecord_advs_em_serial_number",
                            join: "custrecord_advs_la_vin_bodyfld",
                            lable: "VinLastSix"
                        }),
                    ]
            });

            customrecord_advs_lease_headerSearchObj.run().each(function (result) {

                var LeaseId = result.getValue({
                    name: "internalid"
                });
                var CustomerId = result.getValue({
                    name: "custrecord_advs_l_h_customer_name"
                });
                var CustomerText = result.getText({
                    name: "custrecord_advs_l_h_customer_name"
                });
                var VINId = result.getValue({
                    name: "custrecord_advs_la_vin_bodyfld"
                });
                var VINNum = result.getText({
                    name: "custrecord_advs_la_vin_bodyfld"
                });
                var LeaseDate = result.getValue({
                    name: "custrecord_advs_l_h_start_date"
                });

                if (CustomerId) {
                    var FirstName = result.getValue({
                        name: "firstname",
                        join: "custrecord_advs_l_h_customer_name"
                    });
                    var LastName = result.getValue({
                        name: "lastname",
                        join: "custrecord_advs_l_h_customer_name"
                    });
                    var VinLastSix = result.getValue({
                        name: "custrecord_advs_em_serial_number",
                        join: "custrecord_advs_la_vin_bodyfld",
                    });

                    // if (!FirstName || FirstName == "" || FirstName == "") {
                    //     var CustomerName = FirstName + " " + LastName;
                    // } else {
                    var CustomerName = CustomerText;
                    // }

                    if (LeaseDate) {

                        var NewLeaseDate = new Date(LeaseDate);

                        // Add 30 days and preserve the Date object
                        NewLeaseDate.setDate(NewLeaseDate.getDate() + 30);

                        var LeaseDay = NewLeaseDate.getDay();
                        var LeaseDate = NewLeaseDate.getDate();
                        var LeaseMonth = NewLeaseDate.getMonth();
                        var LeaseYear = NewLeaseDate.getFullYear();

                        var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                        var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

                        var LeaseDayName = days[LeaseDay];
                        var LeaseMonthName = months[LeaseMonth];

                        var NewTemplateBody = TemplateBody.replace(/@DAY@/g, LeaseDayName).replace(/@DATE@/g, LeaseMonthName + " " + LeaseDate + "," + LeaseYear).replace(/@CUSTOMERNAME@/g, CustomerName).replace(/@VIN@/g, VinLastSix);
                        var NewTemplateSubject = TemplateSubject.replace(/@DAY@/g, LeaseDayName).replace(/@DATE@/g, LeaseMonthName + " " + LeaseDate + "," + LeaseYear).replace(/@CUSTOMERNAME@/g, CustomerName).replace(/@VIN@/g, VinLastSix);


                        var DiffInMs = (NewFullDate - NewLeaseDate);
                        var DiffInDays = DiffInMs / (1000 * 60 * 60 * 24);

                        if (DiffInDays > 0) {

                            DiffInDays = Math.floor(DiffInDays);

                            var minus30Days = DiffInDays - 30;
                            var divideby15 = minus30Days % 15;


                            if ((minus30Days > 0) && divideby15 == 0) {
                                log.error("Lease", "DiffInDays-> " + DiffInDays + ", minus30Days-> " + minus30Days);

                                email.send({
                                    author: UserId,
                                    body: NewTemplateBody,
                                    recipients: CustomerId,
                                    subject: NewTemplateSubject
                                });

                                log.error("15 LEASE EMAIL->", "EMAIL SENT SUCCESSFULLY! ->" + ", VinLastSix-> " + VinLastSix + ", LeaseId-> " + LeaseId);

                            }
                        }


                    }
                }

                return true;
            });

        } catch (error) {

            log.error("Lease 15 day ERROR->> ", error);
        }

        try {
            var customrecord_advs_lease_headerSearchObj = search.create({
                type: "customrecord_advs_lease_header",
                filters:
                    [
                        ["isinactive", "is", "F"],
                        "AND",
                        ["custrecord_advs_la_vin_bodyfld.custrecord_advs_vm_plate_expiration", "isempty", ""],
                        "AND",
                        ["custrecord_advs_la_vin_bodyfld.custrecord_advs_temp_no_plate", "is", "F"],
                        "AND",
                        [
                            ["formuladate: {custrecord_advs_l_h_start_date} + 31", "onorbefore", "today"],

                        ]
                    ],
                columns:
                    [
                        search.createColumn({ name: "internalid", label: "InternalID" }),
                        search.createColumn({ name: "name", label: "ID" }),
                        search.createColumn({ name: "custrecord_advs_l_h_customer_name", label: "Lessee Name " }),
                        search.createColumn({ name: "custrecord_advs_la_vin_bodyfld", label: "VIN" }),
                        search.createColumn({ name: "custrecord_advs_l_h_start_date", label: "Accrual Start Date " }),
                        search.createColumn({ name: "custrecord_advs_l_h_location", label: "Lease Location" }),
                        search.createColumn({
                            name: "firstname",
                            join: "custrecord_advs_l_h_customer_name",
                            lable: "customer"
                        }),
                        search.createColumn({
                            name: "custrecord_advs_l_h_subsidiary",
                            lable: "Subsidiary"
                        }),
                        search.createColumn({
                            name: "isperson",
                            join: "custrecord_advs_l_h_customer_name",
                            lable: "isPerson"
                        }),
                        search.createColumn({
                            name: "companyname",
                            join: "custrecord_advs_l_h_customer_name",
                            lable: "CompanyName"
                        }),
                        search.createColumn({
                            name: "custrecord_advs_em_serial_number",
                            join: "custrecord_advs_la_vin_bodyfld",
                            lable: "VinLastSix"
                        }),
                    ]
            });

            customrecord_advs_lease_headerSearchObj.run().each(function (result) {

                var LeaseId = result.getValue({
                    name: "internalid"
                });
                var CustomerId = result.getValue({
                    name: "custrecord_advs_l_h_customer_name"
                });
                var CustomerText = result.getText({
                    name: "custrecord_advs_l_h_customer_name"
                });
                var LeaseSubsidiary = result.getValue({
                    name: "custrecord_advs_l_h_subsidiary",
                });
                var LeaseLocation = result.getValue({
                    name: "custrecord_advs_l_h_location"
                });
                var VINId = result.getValue({
                    name: "custrecord_advs_la_vin_bodyfld"
                });
                var VINNum = result.getText({
                    name: "custrecord_advs_la_vin_bodyfld"
                });
                var LeaseDate = result.getValue({
                    name: "custrecord_advs_l_h_start_date"
                });

                if (CustomerId) {
                    // var FirstName = result.getValue({
                    //     name: "firstname",
                    //     join: "custrecord_advs_l_h_customer_name"
                    // });
                    // var LastName = result.getValue({
                    //     name: "lastname",
                    //     join: "custrecord_advs_l_h_customer_name"
                    // });
                    var VinLastSix = result.getValue({
                        name: "custrecord_advs_em_serial_number",
                        join: "custrecord_advs_la_vin_bodyfld",
                    });

                    // if (!FirstName || FirstName == "" || FirstName == "") {
                    //     var CustomerName = FirstName + " " + LastName;
                    // } else {
                    var CustomerName = CustomerText;
                    // }
                    try {


                        if (LeaseDate) {

                            var NewLeaseDate = new Date(LeaseDate);
                            var DiffInMs = (NewFullDate - NewLeaseDate);
                            var DiffInDays = DiffInMs / (1000 * 60 * 60 * 24);

                            // Add 30 days and preserve the Date object
                            NewLeaseDate.setDate(NewLeaseDate.getDate() + 30);

                            var LeaseDay = NewLeaseDate.getDay();
                            var LeaseDate = NewLeaseDate.getDate();
                            var LeaseMonth = NewLeaseDate.getMonth();
                            var LeaseYear = NewLeaseDate.getFullYear();

                            var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                            var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

                            var LeaseDayName = days[LeaseDay];
                            var LeaseMonthName = months[LeaseMonth];

                            var NewTemplateBody = TemplateBody.replace(/@DAY@/g, LeaseDayName).replace(/@DATE@/g, LeaseMonthName + " " + LeaseDate + "," + LeaseYear).replace(/@CUSTOMERNAME@/g, CustomerName).replace(/@VIN@/g, VinLastSix);
                            var NewTemplateSubject = TemplateSubject.replace(/@DAY@/g, LeaseDayName).replace(/@DATE@/g, LeaseMonthName + " " + LeaseDate + "," + LeaseYear).replace(/@CUSTOMERNAME@/g, CustomerName).replace(/@VIN@/g, VinLastSix);




                            if (DiffInDays > 0) {

                                DiffInDays = Math.floor(DiffInDays);

                                var minus31Days = DiffInDays - 31;
                                var divideby30 = minus31Days % 30;


                                if ((minus31Days >= 0) && divideby30 == 0) {

                                    log.error("LeaseId-> " + LeaseId + ", minus31Days-> " + minus31Days, "LeaseLocation-> " + LeaseLocation + ", LeaseSubsidiary-> " + LeaseSubsidiary);

                                    if (LeaseId && LeaseLocation && LeaseSubsidiary) {

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
                                            value: LeaseSubsidiary
                                        });
                                        InvoiceObj.setValue({
                                            fieldId: "location",
                                            value: LeaseLocation
                                        });
                                        InvoiceObj.setValue({
                                            fieldId: "custbody_advs_lease_head",
                                            value: LeaseId
                                        });

                                        //newLine
                                        InvoiceObj.selectNewLine({
                                            sublistId: "item"
                                        });

                                        InvoiceObj.setCurrentSublistValue({
                                            sublistId: "item",
                                            fieldId: "item",
                                            value: "6102"
                                        });
                                        InvoiceObj.setCurrentSublistValue({
                                            sublistId: "item",
                                            fieldId: "rate",
                                            value: 250
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
                                                type: "customrecord_advs_lease_registration_fee",
                                                isDynamic: true
                                            });

                                            RecordObj.setValue({
                                                fieldId: "custrecord_advs_regi_fee_leaselink",
                                                value: LeaseId
                                            });
                                            RecordObj.setValue({
                                                fieldId: "custrecord_advs_regi_fee_item",
                                                value: "Lease Registration administrative charge"
                                            });
                                            RecordObj.setValue({
                                                fieldId: "custrecord_advs_regi_fee_item_rate",
                                                value: 250
                                            });
                                            RecordObj.setValue({
                                                fieldId: "custrecord_advs_regi_fee_invoicelink",
                                                value: InvoiceId
                                            });

                                            var FeeRecordId = RecordObj.save();

                                            log.error("NewLeaseDate-> " + NewLeaseDate, "FeeRecordId-> " + FeeRecordId + ", InvoiceId-> " + InvoiceId);
                                        }
                                    }
                                }
                            }
                        }


                    } catch (error) {
                        log.error("ERROR IN LEASE INVOICE SEARCH-> " + LeaseId, error)
                    }
                }

                return true;
            });

        } catch (error) {

            log.error("Lease 31 day ERROR->> ", error);
        }






    }

    return {
        execute: execute
    };

});
