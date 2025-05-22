/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
define(['N/record', 'N/runtime', 'N/search', 'N/ui/serverWidget', './advs_lib_rental_leasing',
        './advs_lib_util', './advs_lib_return_buyout', 'N/format', 'N/task', 'N/redirect'],
    /**
     * @param{record} record
     * @param{runtime} runtime
     * @param{search} search
     */
    (record, runtime, search, serverWidget, lib_rental, libUtil, lib_return_buyout, format, task, redirect) => {
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
                var LeaseId = Request.parameters.recordid;
                var flag = Request.parameters.custpara_flag;
                log.debug("flag", flag)
                var Form = serverWidget.createForm({
                    title: 'Lease Return'
                });

                var HtmlField = Form.addField({
                    id: 'custpage_htmlcontent',
                    type: serverWidget.FieldType.INLINEHTML,
                    label: 'HTML Content'
                });
                var htmlContent = getHtmlContent(LeaseId);

                HtmlField.defaultValue = htmlContent;

                var LeaseField = Form.addField({
                    id: 'custpage_lease_id',
                    type: serverWidget.FieldType.INTEGER,
                    label: 'Lease Header'
                });
                LeaseField.updateDisplayType({
                    displayType: "hidden"
                });

                var CustomerField = Form.addField({
                    id: 'custpage_customer',
                    type: serverWidget.FieldType.SELECT,
                    source: "customer",
                    label: 'Lessee'
                });
                CustomerField.updateDisplayType({
                    displayType: "hidden"
                });

                var LeaseVinField = Form.addField({
                    id: 'custpage_lease_vin',
                    type: serverWidget.FieldType.SELECT,
                    source: "customer",
                    label: 'Vin'
                });
                LeaseVinField.updateDisplayType({
                    displayType: "hidden"
                });

                var FlagField = Form.addField({
                    id: 'custpage_flag',
                    type: serverWidget.FieldType.INTEGER,
                    label: 'Flag'
                });
                FlagField.updateDisplayType({
                    displayType: "hidden"
                });
                FlagField.defaultValue = flag;

                if (LeaseId) {
                    LeaseField.defaultValue = LeaseId;
                    var FieldsLook = ["custrecord_advs_l_h_customer_name", "custrecord_advs_la_vin_bodyfld", ];
                    var LeaseObj = search.lookupFields({
                        type: "customrecord_advs_lease_header",
                        id: LeaseId,
                        columns: FieldsLook
                    });
                    CustomerField.defaultValue = LeaseObj.custrecord_advs_l_h_customer_name[0].value;
                    LeaseVinField.defaultValue = LeaseObj.custrecord_advs_la_vin_bodyfld[0].value;
                }

                Form.clientScriptModulePath = "./advs_cs_lease_return_new_s.js"
                Response.writePage(Form);
            }
            else  { //if (Request.method == 'POST')

                var type = scriptContext.request.parameters.custparam_type;
                log.debug("type", type);
                if (type == 1 || type == "1") {
                    try {
                        var body = JSON.parse(scriptContext.request.body);
                        var formData = body.formData;
                        log.debug("formData", formData);

                        if (formData != null) {
                            var leaseid = formData.leaseid;
                            var customerid = formData.customerid;
                            var flag = formData.flag;
                            var returntype = formData.returntype;
                            var othercharges = formData.othercharges * 1;
                            var repofee = formData.repofee * 1;
                            var adminfee = formData.adminfee * 1;
                            var earlyfee = formData.earlyfee * 1;
                            var continuelease = formData.continuelease;
                            /* log.debug("Other Charges==>"+othercharges+"//","repofee==>"+repofee+"////adminfee==>"+adminfee+"///earlyfee==>"+earlyfee);
                            log.debug("continuelease",continuelease); */
                            // error;
                            var Description,
                                vehicleResStatus,
                                LeaseStatus = "";

                            if (flag == 1 || flag == '1') {
                                if (continuelease == "T" || continuelease == true || continuelease == "true") {
                                    Description = "Return charges";
                                    vehicleResStatus = libUtil.vmstatus.repo;
                                    LeaseStatus = libUtil.leaseStatus.terminated;
                                } else {
                                    Description = "Return charges";
                                    vehicleResStatus = libUtil.vmstatus.available;
                                    LeaseStatus = libUtil.leaseStatus.terminated;
                                }
                            } else if (flag == 2 || flag == '2') {
                                Description = "Pay off charges";
                                vehicleResStatus = libUtil.vmstatus.customerowned;
                                LeaseStatus = libUtil.leaseStatus.terminated;
                            }

                            var FieldsLook = ["custrecord_advs_l_h_location", "custrecord_advs_l_h_subsidiary", "custrecord_advs_la_vin_bodyfld",
                                "custrecord_advs_l_h_fixed_ass_link", "custrecord_advs_l_h_customer_name", 'custrecord_advs_l_h_depo_ince','custrecord_advs_net_dep_'];

                            var LeaseObj = search.lookupFields({
                                type: "customrecord_advs_lease_header",
                                id: leaseid,
                                columns: FieldsLook
                            });
                            var location = LeaseObj["custrecord_advs_l_h_location"][0].value;
                            var subsId = LeaseObj["custrecord_advs_l_h_subsidiary"][0].value;
                            var CustomerId = LeaseObj["custrecord_advs_l_h_customer_name"][0].value;
                            var vin = LeaseObj["custrecord_advs_la_vin_bodyfld"][0].value;
                            var depositincepvalue1 = LeaseObj["custrecord_advs_l_h_depo_ince"];
                            var depositincepvalue = LeaseObj["custrecord_advs_net_dep_"];
                            var FAMLink = "";
                            if (LeaseObj["custrecord_advs_l_h_fixed_ass_link"][0] != null && LeaseObj["custrecord_advs_l_h_fixed_ass_link"][0] != undefined) {
                                FAMLink = LeaseObj["custrecord_advs_l_h_fixed_ass_link"][0].value || "";
                            }

                            if (flag == 1 || flag == '1') {
                                if (continuelease == "T" || continuelease == true || continuelease == "true") {}
                                else {
                                    var disposalObj = lib_rental.disposefam(FAMLink, location);
                                }
                            } else if (flag == 2 || flag == '2') {
                                var disposalObj = lib_rental.disposeSaleFam(FAMLink, location, CustomerId);
                                //CREATE INVOICES AFTER PAYOFF
                                var setupData = lib_rental.invoiceTypeSearch();
                                var invoiceType = setupData[libUtil.rentalinvoiceType.lease_payoffdepositfee]["id"];
                                var tranDate = format.parse({
                                    value: new Date(),
                                    type: format.Type.DATE
                                });
                                var linesArr = [];
                                var linesobj = {};
                                linesobj.item = 6117;//setupData[libUtil.rentalinvoiceType.lease_payoffdepositfee]["regularitem"];
                                linesobj.quantity = 1;
                                linesobj.rate = depositincepvalue;
                                linesobj.description = "Deposit Invoice Payoff";
                                linesobj.amount = depositincepvalue;
                                linesobj.custcol_advs_st_applied_to_vin = vin;
                                linesArr.push(linesobj);

                                var invoiceObj = {
                                    invoicebody: {
                                        customer: CustomerId,
                                        date: tranDate,
                                        subsidiary: subsId,
                                        location: location,
                                        leaseid: leaseid,
                                        // paylineid: paylogid,
                                        invoicetype: invoiceType,
                                    },
                                    linesData: linesArr
                                };
                                log.debug('invoiceObj in advs_ss_lease_return_new_s in flag2',invoiceObj);
                                var payoffFeeInvoiceId = lib_rental.createInvoice(invoiceObj, setupData, libUtil);
                                log.debug('payoffFeeInvoiceId',payoffFeeInvoiceId);
                                if(payoffFeeInvoiceId){
                                    record.submitFields({ type: "customrecord_advs_lease_header", id: leaseid, values: {custrecord_payoff_invoice_link:payoffFeeInvoiceId} });
                                }
                            }
                            var postArr = [];
                            var obj = {};
                            var FeeInvoiceId = "";
                            if (continuelease == "T" || continuelease == true || continuelease == "true") {

                                var setupData = lib_rental.invoiceTypeSearch();
                                var invoiceType = setupData[libUtil.rentalinvoiceType.lease_return]["id"];

                                var tranDate = format.parse({
                                    value: new Date(),
                                    type: format.Type.DATE
                                });
                                var linesArr = [];

                                var linesobj = {};
                                linesobj.item = setupData[libUtil.rentalinvoiceType.lease_repofee]["regularitem"];
                                linesobj.quantity = 1;
                                linesobj.rate = repofee;
                                linesobj.description = "Repo Fee";
                                linesobj.amount = repofee;
                                linesobj.custcol_advs_st_applied_to_vin = vin;
                                linesArr.push(linesobj);

                                var linesobj = {};
                                linesobj.item = setupData[libUtil.rentalinvoiceType.lease_adminfee]["regularitem"];
                                linesobj.quantity = 1;
                                linesobj.rate = adminfee;
                                linesobj.description = "Admin Fee";
                                linesobj.amount = adminfee;
                                linesobj.custcol_advs_st_applied_to_vin = vin;
                                linesArr.push(linesobj);

                                var linesobj = {};
                                linesobj.item = setupData[libUtil.rentalinvoiceType.lease_earlyfee]["regularitem"];
                                linesobj.quantity = 1;
                                linesobj.rate = earlyfee;
                                linesobj.description = "Early Return Fee";
                                linesobj.amount = earlyfee;
                                linesobj.custcol_advs_st_applied_to_vin = vin;
                                linesArr.push(linesobj);

                                var invoiceObj = {
                                    invoicebody: {
                                        customer: customerid,
                                        date: tranDate,
                                        subsidiary: subsId,
                                        location: location,
                                        leaseid: leaseid,
                                        // paylineid: paylogid,
                                        invoicetype: invoiceType,
                                    },
                                    linesData: linesArr
                                };
                                FeeInvoiceId = lib_rental.createInvoice(invoiceObj, setupData, libUtil);
                                if (FeeInvoiceId != null && FeeInvoiceId != "" && FeeInvoiceId != undefined) {
                                    obj.id = FeeInvoiceId;
                                    obj.status = "Lease Continued and generated Invoice for Added Fees";
                                    obj.message = "Success";
                                    postArr.push(obj);
                                    var jsonData = JSON.stringify(postArr);
                                } else {
                                    obj.id = FeeInvoiceId;
                                    obj.status = "Failed on Creating Invoice";
                                    obj.message = "Failed";
                                    postArr.push(obj);
                                    var jsonData = JSON.stringify(postArr);
                                }
                            } else {
                                var famprocess = disposalObj.processid;
                                var famtaskid = disposalObj.taskid;

                                var storeObj = {};
                                storeObj.leaseid = leaseid;
                                storeObj.customerid = customerid;
                                storeObj.returntype = returntype;
                                storeObj.othercharges = othercharges;
                                storeObj.desc = Description;
                                storeObj.vehstatus = vehicleResStatus;
                                storeObj.leasestatus = LeaseStatus;
                                storeObj.fam = FAMLink;
                                storeObj.famprocessid = famprocess;
                                storeObj.famtaskid = famtaskid;
                                var advsTempid = lib_rental.postforProcessFAM(storeObj);

                                obj.id = advsTempid;
                                obj.status = "success";
                                obj.message = "success";
                                postArr.push(obj);

                                var jsonData = JSON.stringify(postArr);
                            }
                            // Updating the Header Values
                            var UpdateHeaderValues = new Array();
                            UpdateHeaderValues["custrecord_advs_l_h_status"] = LeaseStatus;
                            UpdateHeaderValues["custrecord_advs_l_a_return_type"] = returntype;
                            if (FeeInvoiceId != null && FeeInvoiceId != "" && FeeInvoiceId != undefined) {
                                UpdateHeaderValues["custrecord_advs_l_h_repo_fee_invoice"] = FeeInvoiceId;
                                UpdateHeaderValues["custrecord_advs_l_a_repo_charges"] = repofee;
                                UpdateHeaderValues["custrecord_advs_l_a_ret_fee"] = repofee + adminfee + earlyfee;
                            }
                            /* record.submitFields({ type: "customrecord_advs_lease_header", id: leaseid, values: UpdateHeaderValues });
                            // Updating the Vehicle Master Status
                            record.submitFields({type:"customrecord_advs_vm", id: vin, values: {'custrecord_advs_vm_reservation_status':vehicleResStatus,} });
                            log.debug("TESTING 1"); */

                            scriptContext.response.write({
                                output: jsonData
                            });
                        }

                    } catch (e) {
                        log.error('Error processing request', e.message);

                        var postArr = [];
                        var obj = {};
                        obj.id = 404;
                        obj.status = "failed";
                        obj.message = e.message;
                        postArr.push(obj);
                        var jsonData = JSON.stringify(postArr);

                        scriptContext.response.write({
                            output: jsonData
                        });

                        var onclickScript = " <html><body> <script type='text/javascript'>" +
                            "try{" +
                            "";
                        onclickScript += "window.parent.location.reload();";
                        onclickScript+="window.parent.closePopup();";
                        onclickScript += "}catch(e){alert(e+'   '+e.message);}</script></body></html>";

                        Response.write(onclickScript);
                    }
                } else if (type == 2 || type == "2") {

                }
            }
        }

        function getHtmlContent(cuRec) {

            var subsidiaryId = runtime.getCurrentUser().subsidiary;
            var logoUrl = lib_return_buyout.getSubsidiaryLogoUrl(subsidiaryId);
            var cusName,
                coName,
                vin,
                stDate,
                endDate,
                leaseREv,
                purOption,
                deposit,
                deposit1,
                amountRemaining,
                total,
                downpayment,downpayment1;
            var PayInception = 0;

            var customrecord_advs_lease_headerSearchObj = search.create({
                type: "customrecord_advs_lease_header",
                filters:
                    [
                        ["internalid", "anyof", cuRec]
                    ],

                columns:
                    [
                        search.createColumn({
                            name: "name",
                            label: "ID"
                        }),
                        search.createColumn({
                            name: "custrecord_advs_la_vin_bodyfld",
                            label: "VIN"
                        }),
                        search.createColumn({
                            name: "custrecord_advs_l_h_customer_name",
                            label: "Lessee Name "
                        }),
                        search.createColumn({
                            name: "custrecord_advs_lease_comp_name_fa",
                            label: "Company Name"
                        }),
                        search.createColumn({
                            name: "custrecord_advs_l_h_start_date",
                            label: "START ACCURAL DATE"
                        }),
                        search.createColumn({
                            name: "custrecord_advs_l_h_end_date",
                            label: "END ACCURAL DATETE"
                        }),
                        search.createColumn({
                            name: "custrecord_advs_r_a_down_payment",
                            label: "Down payment"
                        }),
                        search.createColumn({
                            name: "custrecord_advs_l_h_cont_total",
                            label: "CONTRACT TOTAL"
                        }),
                        search.createColumn({
                            name: "custrecord_advs_l_h_pur_opti",
                            label: "PURCHASE OPTION"
                        }),
                        search.createColumn({
                            name: "total",
                            label: "INVOICE",
                            join: "custrecord_advs_l_a_down_invoie"
                        }),
                        search.createColumn({
                            name: "custrecord_advs_l_h_depo_ince",
                            label: "DEPOSIT INCEPTION"
                        }),
                        search.createColumn({
                            name: "custrecord_advs_net_dep_",
                            label: "DEPOSIT INCEPTION"
                        }),
                        search.createColumn({
                            name: "amountremaining",
                            label: "INVOICE",
                            join: "custrecord_advs_l_a_down_invoie"
                        }),
                        search.createColumn({
                            name: "custrecord_advs_l_h_pay_incep",
                            label: "PURCHASE OPTION"
                        }),
                        search.createColumn({
                            name: "custrecord_advs_l_h_terms",
                            label: "PURCHASE OPTION"
                        }),
                    ]
            });

            customrecord_advs_lease_headerSearchObj.run().each(function (result) {
                cusName = result.getText({
                    name: "custrecord_advs_l_h_customer_name"
                });
                coName = result.getText({
                    name: "custrecord_advs_lease_comp_name_fa"
                }) || '';
                vin = result.getText({
                    name: "custrecord_advs_la_vin_bodyfld"
                });
                stDate = result.getValue({
                    name: "custrecord_advs_l_h_start_date"
                });
                endDate = result.getValue({
                    name: "custrecord_advs_l_h_end_date"
                });
                downpayment1 = parseFloat(result.getValue({
                    name: "custrecord_advs_l_h_depo_ince"
                }));
                downpayment = parseFloat(result.getValue({
                    name: "custrecord_advs_net_dep_"
                }));
                purOption = parseFloat(result.getValue({
                    name: "custrecord_advs_l_h_pur_opti"
                }))
                total = parseFloat(result.getValue({
                    name: 'total',
                    join: 'custrecord_advs_l_a_down_invoie'
                }))
                deposit1 = parseFloat(result.getValue({
                    name: "custrecord_advs_l_h_depo_ince"
                }))
                deposit = parseFloat(result.getValue({
                    name: "custrecord_advs_net_dep_"
                }))
                amountRemaining = parseFloat(result.getValue({
                    name: 'amountremaining',
                    join: 'custrecord_advs_l_a_down_invoie'
                }));
                PayInception = parseFloat(result.getValue({
                    name: "custrecord_advs_l_h_pay_incep"
                }));
                var terms = parseFloat(result.getValue({
                    name: "custrecord_advs_l_h_terms"
                }));

                leaseREv = (PayInception * terms);
                leaseREv = leaseREv * 1;
                leaseREv = leaseREv.toFixed(2);
                leaseREv = leaseREv * 1;

                return true;
            });
            var paidInstallment = lib_return_buyout.getPaidInstallmentAmount(cuRec);
            var unpaidInstallment = lib_return_buyout.getUnpaidInstAmt(cuRec);

            var amttotal = leaseREv + purOption + downpayment;

            var receivable_balance_due = ((amttotal - paidInstallment - deposit) - PayInception);
            receivable_balance_due = receivable_balance_due * 1;

            var salestax = receivable_balance_due * 0.07;
            var balance_due = (receivable_balance_due + unpaidInstallment + salestax) * 1;

            var ReturnTypeList = lib_return_buyout.returnTypeList();

            var htmlContent = "<!DOCTYPE html>\n" +
                CssStyle() +
                "<body>\n" +
                "<div class=\"container\">\n" +

                "    <div class=\"section\">" +
                " <h4>Lessees and Vehicle</h4>\n" +
                "  <div class=\"section-content\">" + //L & V
                "        <table>\n" +
                "            <tr> <th>Lessee name:</th> <td>" + cusName + "</td></tr>\n" +
                "            <tr><th>Co-lessee name:</th><td>" + coName + "</td> </tr>\n" +
                "            <tr> <th>VIN:</th><td> " + vin + "</td></tr>\n" +
                "        </table>\n" +
                " </div>" +
                "    </div>\n" +

                "<div class=\"section\"><h4>Select type and Other Charges</h4>\n" + //Type and OC
                " <div class=\"section-content\"> " +
                " <table class='secondaryinfo'>\n" +
                "     <tr><th>Type:</th> <td><select id='custpage_ret_type' name ='custpage_ret_type' required>" + ReturnTypeList + "</select></td>\n" +
                "      <td>Other Charges</td><td><input type='number' id='otherreturncharges' name ='otherreturncharges' required ></td>" +
                "<td id='continueleaseRow' style='display:none;'><input type='checkbox' id='continuelease' name ='continuelease' label = 'Continue Lease' ></td><td id='continueleaseRow1' style='display:none;' >Continue Lease </td></tr>\n" +
                "     <!-- Fees row that will be hidden initially -->" +
                "  </table>\n" +
                " <div id='feesSection' style='display: none;'>\n" +
                " <h4 align='center' style='margin: 4px 2; padding: 3px;'>Fees Section</h4>\n" +
                " <table class='secondaryinfo'>\n" +
                "     <tr id='feesSection'>\n" +
                "         <th>Repo Fee :</th> <td><input type='number' id='repofee' name ='repofee' required ></td>\n" +
                "         <th>Admin Fee :</th> <td><input type='number' id='adminfee' name ='adminfee' required ></td>\n" +
                "         <th>Early Return Fee :</th> <td><input type='number' id='earlyfee' name ='earlyfee' required ></td>\n" +
                "     </tr>\n" +

                "  </table>\n" +
                "  </div>\n" +
                " </div>" +
                "</div>\n" +

                " <div class=\"section\"> <h4>Itemization</h4>\n" + //Itemization
                " <div class=\"section-content expanded\"> " +
                " <table class=\"itemization\">\n" +
                " <tr><td>Lease receivable</td> <td>" + leaseREv.toFixed(2) + "</td></tr>\n" +
                " <tr><td>Non refundable deposit</td> <td>" + downpayment.toFixed(2) + "</td></tr>\n" +
                " <tr><td>Purchase option*</td> <td>" + purOption.toFixed(2) + "</td></tr>\n" +
                " <tr><td>Total</td><td>" + amttotal.toFixed(2) + "</td></tr>\n" +
                "</table>\n" +
                "</div>\n" +
                "</div>\n" +

                "<div class=\"section\"><h4>Balance</h4>\n" + //Balance
                " <div class=\"section-content expanded\"> " +
                "<table class=\"balance\">\n" +
                " <tr><td>Lease installments paid</td><td>" + paidInstallment.toFixed(2) + "</td></tr>\n" +
                " <tr><td>Non refundable deposit paid*</td><td>" + deposit.toFixed(2) + "</td></tr>\n" +
                " <tr><td>Advance lease installments paid</td><td>" + PayInception.toFixed(2) + "</td></tr>\n" +
                " <tr><td>Lease receivable balance due</td><td>" + receivable_balance_due.toFixed(2) + "</td></tr>\n" +
                " <tr><td>Sales tax on lease receivable balance due</td><td>" + salestax.toFixed(2) + "</td></tr>\n" +
                " <tr><td>Unpaid lease charges</td><td>" + paidInstallment.toFixed(2) + "</td></tr>\n" +
                " <tr><td>Total balance due</td><td>" + balance_due.toFixed(2) + "</td></tr>\n" +
                "</table>\n" +
                "</div>\n" +
                "</div>\n" +

                "    <div class=\"button-container\">\n" +
                "        <button id='submitrec'>Submit</button>\n" +
                "    </div>\n" +
                "</div>\n" +

                "   <div id=\"loader-overlay\" class=\"loader-overlay\" style=\"display:none;\">\n" +
                "        <div class=\"loader\"></div>\n" +
                "    </div>\n" +

                "<script>\n" +

                "" +
                "" +
                "</script>\n" +
                "<script src=\"https://code.jquery.com/jquery-3.6.0.min.js\"></script>\n" +

                " <script src='https://code.jquery.com/ui/1.13.2/jquery-ui.js'></script>" +
                "<script>\n" +
                "    document.addEventListener('DOMContentLoaded', function() {\n" +
                "        // Handle click event for section headers\n" +
                "        document.querySelectorAll('.section h4').forEach(function(header) {\n" +
                "            header.addEventListener('click', function() {\n" +
                "                var content = this.nextElementSibling;\n" +
                "                if (content.classList.contains('expanded')) {\n" +
                "                    content.classList.remove('expanded');\n" +
                "                } else {\n" +
                "                    content.classList.add('expanded');\n" +
                "                }\n" +
                "            });\n" +
                "        });\n" +
                "    });\n" +
                "</script>\n" +
                "</body>\n" +
                "</html>\n";

            return htmlContent;
        }
        function CssStyle() {
            var HtmlCss = "";

            HtmlCss += "<!DOCTYPE html>\n" +
                "<html lang=\"en\">\n" +
                "<head>\n" +
                "    <meta charset=\"UTF-8\">\n" +
                "    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n" +
                "    <title>Lease Account Statement</title>\n" +
                "    <style>\n" +
                "        /* Add your CSS styles here */\n" +
                "        @page {\n" +
                "            size: A4;\n" +
                "            margin: 0;\n" +
                "        }\n" +
                "        body {\n" +
                "            font-family: Arial, sans-serif;\n" +
                "            margin: 0;\n" +
                "            padding: 10px;\n" +
                "            background-color: #f8f9fa;\n" +
                "        }\n" +
                "        .container {\n" +
                "            max-width: 800px;\n" +
                "            margin: 0 auto;\n" +
                "            padding: 10px;\n" +
                "            background-color: #ffffff;\n" +
                "            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);\n" +
                "        }\n" +
                "        .header {\n" +
                "            text-align: center;\n" +
                "            margin-bottom: 20px;\n" +
                "        }\n" +
                "        .logo {\n" +
                "            max-width: 150px;\n" +
                "            height: auto;\n" +
                "            margin-bottom: 20px;\n" +
                "        }\n" +
                "        .section {\n" +
                "            margin-bottom: 5px;\n" +
                "            border: 1px solid #ddd;\n" +
                "            border-radius: 4px;\n" +
                "            overflow: hidden;\n" +
                "        }\n" +
                "        .section h4 {\n" +
                "            margin: 0;\n" +
                "            padding: 10px;\n" +
                "            background-color: #f2f2f2;\n" +
                "            cursor: pointer;\n" +
                "            user-select: none;\n" +
                "        }\n" +
                "        .section-content {\n" +
                "            padding: 10px;\n" +
                "            display: none;\n" +
                "        }\n" +
                "        .section-content.expanded {\n" +
                "            display: block;\n" +
                "        }\n" +
                ".itemization{" +
                "width:100%;" +
                "}" +
                "" +
                "   .balance{\n" +
                "width:100%;" +
                "        }" +

                ".secondaryinfo{" +
                "width:100%;" +
                "}" +

                "        .itemization td:nth-child(2),\n" +
                "        .balance td:nth-child(2),\n" +
                "        .itemization th:nth-child(2),\n" +
                "        .balance th:nth-child(2) {\n" +
                "            text-align: right;\n" +
                "        }\n" +
                "        .itemization th:first-child,\n" +
                "        .balance th:first-child {\n" +
                "            text-align: left;\n" +
                "        }\n" +
                "        .itemization td:first-child,\n" +
                "        .balance td:first-child {\n" +
                "            text-align: left;\n" +
                "        }\n" +
                "        .note {\n" +
                "            margin-top: 10px;\n" +
                "            font-style: italic;\n" +
                "            font-size: 10px;\n" +
                "        }\n" +
                "        .button-container {\n" +
                "            text-align: center;\n" +
                "            margin-top: 20px;\n" +
                "        }\n" +
                "        .button-container button {\n" +
                "            margin: 0 10px;\n" +
                "        }\n" +
                "        @media print {\n" +
                "            .button-container {\n" +
                "                display: none;\n" +
                "            }\n" +
                "        }\n" +
                "        /* Chrome, Safari, Edge, Opera */\n" +
                "        input[type=number]::-webkit-outer-spin-button,\n" +
                "        input[type=number]::-webkit-inner-spin-button {\n" +
                "            -webkit-appearance: none;\n" +
                "            margin: 0;\n" +
                "        }\n" +
                "        /* Firefox */\n" +
                "        input[type=number] {\n" +
                "            -moz-appearance: textfield;\n" +
                "            text-align: right;\n" +
                "        }\n" +
                ".loader-overlay {\n" +
                "    position: fixed;\n" +
                "    top: 0;\n" +
                "    left: 0;\n" +
                "    width: 100%;\n" +
                "    height: 100%;\n" +
                "    background: rgba(0, 0, 0, 0.5);\n" +
                "    z-index: 1000;\n" +
                "    display: flex;\n" +
                "    justify-content: center;\n" +
                "    align-items: center;\n" +
                "}\n" +
                "\n" +
                ".loader {\n" +
                "    border: 16px solid #f3f3f3;\n" +
                "    border-top: 16px solid #3498db;\n" +
                "    border-radius: 50%;\n" +
                "    width: 120px;\n" +
                "    height: 120px;\n" +
                "    animation: spin 2s linear infinite;\n" +
                "}\n" +
                "\n" +
                "@keyframes spin {\n" +
                "    0% { transform: rotate(0deg); }\n" +
                "    100% { transform: rotate(360deg); }\n" +
                "}\n" +
                "    </style>\n" +
                "</head>\n";
            return HtmlCss;
        }

        return {
            onRequest
        }

    });