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

            var User = runtime.getCurrentUser();
            var UserId = User.id;

            if (Request.method == "GET") {

                var Flag = Request.parameters.custparam_flag;

                var CustomerId = Request.parameters.custparam_custid;
                var CustomerName = Request.parameters.custparam_custname;
                var RegiCounty = Request.parameters.custparam_regicounty;
                var RegiType = Request.parameters.custparam_regitype;
                var TMasterId = Request.parameters.custparam_tmasterid;
                var VinNumber = Request.parameters.custparam_vinnum;


                var DateObj = record.create({
                    type: "customrecord_advs_st_current_date_time",
                });

                var TodaysDate = DateObj.getValue({
                    fieldId: "custrecord_st_current_date"
                });

                var NewFullDate = new Date(TodaysDate);

                var TodayDay = NewFullDate.getDay();
                var TodayDate = NewFullDate.getDate();
                var TodayMonth = NewFullDate.getMonth();
                var TodayYear = NewFullDate.getFullYear();

                var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

                var TodayDayName = days[TodayDay];
                var TodayMonthName = months[TodayMonth];

                var ThisDate = TodayDayName + ", " + TodayMonthName + " " + TodayDate + ", " + TodayYear;

                var form = serverWidget.createForm({
                    title: " "
                });


                var EmailBody = "<table width='100%'  border='1px solid black' style='border-collapse: collapse; font-family: sans-serif; ' >" +
                    "<tr style='background-color: powderblue;'>" +
                    "<td width='50%' style='border-left:1px solid black; padding:5px;'><b>Date: </b></td>" +
                    "<td width='25%' style='border-left:1px solid black; padding:5px;'><b>Customer: </b></td>" +
                    "<td width='25%' style='border-left:1px solid black; padding:5px;'><b>Vin Number: </b></td>" +
                    "</tr>";

                if (Flag == 1 || Flag == "1") {
                    form.title = "RegestrationType-Change PopUp";


                    EmailBody += "<tr>" +
                        "<td style='border-left:1px solid black; padding:5px;'>" + ThisDate + "</td>" +
                        "<td style='border-left:1px solid black; padding:5px;'>" + CustomerName + "</td>" +
                        "<td style='border-left:1px solid black; padding:5px;'>" + VinNumber + "</td>" +
                        "</tr>";

                } else if (Flag == 2 || Flag == "2") {

                    form.title = "County-Change PopUp";



                    var NameArray = CustomerName.split(" ");
                    var FirstName = NameArray[0];
                    var LastName = NameArray[1];

                    var customrecord_advs_vmSearchObj = search.create({
                        type: "customrecord_advs_vm",
                        filters:
                            [
                                ["isinactive", "is", "F"],
                                "AND",
                                ["custrecord_advs_customer", "anyof", CustomerId]
                            ],
                        columns:
                            [
                                search.createColumn({ name: "name", label: "Name" })
                            ]
                    });

                    customrecord_advs_vmSearchObj.run().each(function (result) {

                        var VINNumb = result.getValue({
                            name: "name"
                        });


                        EmailBody += "<tr>" +
                            "<td style='border-left:1px solid black; padding:5px;'>" + ThisDate + "</td>" +
                            "<td style='border-left:1px solid black; padding:5px;'>" + CustomerName + "</td>" +
                            "<td style='border-left:1px solid black; padding:5px;'>" + VINNumb + "</td>" +
                            "</tr>";

                        return true;
                    });

                }

                EmailBody += "</table>";

                if (EmailBody) {
                    form.addField({
                        id: "custpage_inlinehtml",
                        label: " ",
                        type: serverWidget.FieldType.INLINEHTML
                    }).updateLayoutType({
                        layoutType: serverWidget.FieldLayoutType.OUTSIDE
                    }).updateBreakType({
                        breakType: serverWidget.FieldBreakType.STARTCOL
                    }).defaultValue = EmailBody;
                }

                if (NewFullDate) {
                    form.addField({
                        id: "custpage_today",
                        label: "Today's Date",
                        type: serverWidget.FieldType.TEXT
                    }).updateDisplayType({
                        displayType: serverWidget.FieldDisplayType.DISABLED
                    }).defaultValue = NewFullDate;
                }

                if (CustomerName) {
                    form.addField({
                        id: "custpage_custname",
                        label: "Customer Name",
                        type: serverWidget.FieldType.TEXT
                    }).updateDisplayType({
                        displayType: serverWidget.FieldDisplayType.DISABLED
                    }).defaultValue = CustomerName;
                }

                if (RegiCounty) {
                    form.addField({
                        id: "custpage_regicounty",
                        label: "Registration County",
                        type: serverWidget.FieldType.TEXT
                    }).updateDisplayType({
                        displayType: serverWidget.FieldDisplayType.DISABLED
                    }).defaultValue = RegiCounty;
                }
                if (RegiType) {
                    form.addField({
                        id: "custpage_regitype",
                        label: "Registration Type",
                        type: serverWidget.FieldType.TEXT
                    }).updateDisplayType({
                        displayType: serverWidget.FieldDisplayType.DISABLED
                    }).defaultValue = RegiType;
                }
                if (TMasterId) {
                    form.addField({
                        id: "custpage_tmasterid",
                        label: "Truck master",
                        type: serverWidget.FieldType.TEXT
                    }).updateDisplayType({
                        displayType: serverWidget.FieldDisplayType.DISABLED
                    }).defaultValue = TMasterId;
                }

                if (Flag) {
                    form.addField({
                        id: "custpage_flag",
                        label: "Flag",
                        type: serverWidget.FieldType.TEXT
                    }).updateDisplayType({
                        displayType: serverWidget.FieldDisplayType.DISABLED
                    }).defaultValue = Flag;
                }

                if (VinNumber) {
                    form.addField({
                        id: "custpage_vinnum",
                        label: "Vin Number",
                        type: serverWidget.FieldType.TEXT
                    }).updateDisplayType({
                        displayType: serverWidget.FieldDisplayType.DISABLED
                    }).defaultValue = VinNumber;
                }
                if (CustomerId) {
                    form.addField({
                        id: "custpage_custid",
                        label: "Customer Id",
                        type: serverWidget.FieldType.TEXT
                    }).updateDisplayType({
                        displayType: serverWidget.FieldDisplayType.DISABLED
                    }).defaultValue = CustomerId;
                }




                form.addSubmitButton({
                    label: "Email"
                });

                Response.writePage(form);

            } else {

                var Flag = Request.parameters.custpage_flag;
                var CustomerName = Request.parameters.custpage_custname;
                var CustomerId = Request.parameters.custpage_custid;
                var RegiCounty = Request.parameters.custpage_regicounty;
                var RegiType = Request.parameters.custpage_regitype;
                var TMasterId = Request.parameters.custpage_tmasterid;
                var VinNumber = Request.parameters.custpage_vinnum;



                var EmailSubject = "";
                var DateObj = record.create({
                    type: "customrecord_advs_st_current_date_time",
                });

                var TodaysDate = DateObj.getValue({
                    fieldId: "custrecord_st_current_date"
                });

                var NewFullDate = new Date(TodaysDate);

                var TodayDay = NewFullDate.getDay();
                var TodayDate = NewFullDate.getDate();
                var TodayMonth = NewFullDate.getMonth();
                var TodayYear = NewFullDate.getFullYear();

                var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

                var TodayDayName = days[TodayDay];
                var TodayMonthName = months[TodayMonth];

                var ThisDate = TodayDayName + ", " + TodayMonthName + " " + TodayDate + ", " + TodayYear;



                if (Flag == 1 || Flag == "1") {

                    if (TMasterId) {
                        EmailSubject = "Registration Type Changed.";

                        var EmailBody = "<h3>Registration Type has been changed for VIN: " + VinNumber + "</h3>";

                        EmailBody += "<table width='80%'  border='1px solid black' style='border-collapse: collapse; font-family: sans-serif; ' >" +
                            "<tr style='background-color: powderblue;'>" +
                            "<td width='50%' style='border-left:1px solid black; padding:5px;'><b>Date: </b></td>" +
                            "<td width='25%' style='border-left:1px solid black; padding:5px;'><b>Customer: </b></td>" +
                            "<td width='25%' style='border-left:1px solid black; padding:5px;'><b>Vin Number: </b></td>" +
                            "</tr>";


                        EmailBody += "<tr>" +
                            "<td style='border-left:1px solid black; padding:5px;'>" + ThisDate + "</td>" +
                            "<td style='border-left:1px solid black; padding:5px;'>" + CustomerName + "</td>" +
                            "<td style='border-left:1px solid black; padding:5px;'>" + VinNumber + "</td>" +
                            "</tr>";

                        EmailBody += "</table>";


                        record.submitFields({//submitFields
                            type: "customrecord_advs_vm",
                            id: TMasterId,
                            values: {
                                "custrecord_advs_reg_type": RegiType
                            }

                        });

                        try {

                            var customrecord_advs_acc_team_email_cust_chSearchObj = search.create({
                                type: "customrecord_advs_acc_team_email_cust_ch",
                                filters:
                                    [
                                        ["isinactive", "is", "F"]
                                    ],
                                columns:
                                    [
                                        search.createColumn({ name: "internalid", label: "Internal ID" }),
                                        search.createColumn({ name: "custrecord_advs_acc_team_email_employee", label: "Employee" })
                                    ]
                            });


                            customrecord_advs_acc_team_email_cust_chSearchObj.run().each(function (result) {

                                var Employee = result.getValue({
                                    name: "custrecord_advs_acc_team_email_employee"
                                });

                                email.send({
                                    author: UserId,
                                    body: EmailBody,
                                    recipients: Employee,
                                    subject: EmailSubject
                                });

                                return true;
                            });



                            log.error("SENT->", "EMAIL SENT SUCCESSFULLY!");

                        } catch (err) {
                            log.error("EMAIL_ERROR", err.message)
                        }
                    }

                } else if (Flag == 2 || Flag == "2") {
                    if (CustomerId) {

                        var EmailBody = "<h3>County has been changed for Customer: " + CustomerName + "</h3>";

                        EmailBody += "<table width='80%'  border='1px solid black' style='border-collapse: collapse; font-family: sans-serif; ' >" +
                            "<tr style='background-color: powderblue;'>" +
                            "<td width='50%' style='border-left:1px solid black; padding:5px;'><b>Date: </b></td>" +
                            "<td width='25%' style='border-left:1px solid black; padding:5px;'><b>Customer: </b></td>" +
                            "<td width='25%' style='border-left:1px solid black; padding:5px;'><b>Vin Number: </b></td>" +
                            "</tr>";

                        EmailSubject = "Customer County Changed.";

                        var NameArray = CustomerName.split(" ");
                        var FirstName = NameArray[0];
                        var LastName = NameArray[1];

                        var customrecord_advs_vmSearchObj = search.create({
                            type: "customrecord_advs_vm",
                            filters:
                                [
                                    ["isinactive", "is", "F"],
                                    "AND",
                                    ["custrecord_advs_customer", "anyof", CustomerId]
                                ],
                            columns:
                                [
                                    search.createColumn({ name: "name", label: "Name" })
                                ]
                        });

                        customrecord_advs_vmSearchObj.run().each(function (result) {

                            var VINNumb = result.getValue({
                                name: "name"
                            });

                            EmailBody += "<tr>" +
                                "<td style='border-left:1px solid black; padding:5px;'>" + ThisDate + "</td>" +
                                "<td style='border-left:1px solid black; padding:5px;'>" + CustomerName + "</td>" +
                                "<td style='border-left:1px solid black; padding:5px;'>" + VINNumb + "</td>" +
                                "</tr>";



                            return true;
                        });
                        EmailBody += "</table>";

                        record.submitFields({//submitFields
                            type: record.Type.CUSTOMER,
                            id: CustomerId,
                            values: {
                                "custentity_advs_reg_country": RegiCounty
                            }
                        });


                        try {

                            var customrecord_advs_acc_team_email_cust_chSearchObj = search.create({
                                type: "customrecord_advs_acc_team_email_cust_ch",
                                filters:
                                    [
                                        ["isinactive", "is", "F"]
                                    ],
                                columns:
                                    [
                                        search.createColumn({ name: "internalid", label: "Internal ID" }),
                                        search.createColumn({ name: "custrecord_advs_acc_team_email_employee", label: "Employee" })
                                    ]
                            });


                            customrecord_advs_acc_team_email_cust_chSearchObj.run().each(function (result) {

                                var Employee = result.getValue({
                                    name: "custrecord_advs_acc_team_email_employee"
                                });

                                email.send({
                                    author: UserId,
                                    body: EmailBody,
                                    recipients: Employee,
                                    subject: EmailSubject
                                });

                                return true;
                            });



                            log.error("SENT->", "EMAIL SENT SUCCESSFULLY!");

                        } catch (err) {
                            log.error("EMAIL_ERROR", err.message)
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


            var onclickScript = "<html><body> <script type='text/javascript'>" +
                "try {" +
                "    if (window.parent) {" +
                "        // Redirect parent window to customer record in View Mode" +
                "        window.parent.location = 'https://8760954.app.netsuite.com/app/common/entity/custjob.nl?id='"+CustomerId+"'';" +
                "    }" +
                 'onclickScript+="window.parent.closePopup();"'+
                "} catch (e) {" +
                "    alert('Error: ' + e.message);" +
                "}" +
                "</script></body></html>";

            scriptContext.response.write(onclickScript);

        }


        return {
            onRequest
        }

    });