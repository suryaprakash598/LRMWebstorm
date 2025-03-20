/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
define(['N/file', 'N/format', 'N/log', 'N/record', 'N/redirect', 'N/runtime', 'N/search', 'N/task', 'N/ui/serverWidget', 'N/url'],
    /**
 * @param{file} file
 * @param{format} format
 * @param{log} log
 * @param{record} record
 * @param{redirect} redirect
 * @param{runtime} runtime
 * @param{search} search
 * @param{task} task
 * @param{serverWidget} serverWidget
 * @param{url} url
 */
    (file, format, log, record, redirect, runtime, search, task,ui, url) => {
        /**
         * Defines the Suitelet script trigger point.
         * @param {Object} scriptContext
         * @param {ServerRequest} scriptContext.request - Incoming request
         * @param {ServerResponse} scriptContext.response - Suitelet response
         * @since 2015.2
         */
        const onRequest = (scriptContext) => {
            if (scriptContext.request.method === 'GET') {
                var form = ui.createForm({
                    title: 'Lease Agreement Statement'
                });
                
                var curREc = scriptContext.request.parameters.cur_REc;
                var from_date = scriptContext.request.parameters.start_date;
                var to_date = scriptContext.request.parameters.end_date;
    
                // You can log the parameters to debug if needed
                log.debug('curREc', curREc);
                log.debug('from_date', from_date);
                log.debug('to_date', to_date);
                var htmlContent = getHtmlContent(from_date,to_date,curREc);
                form.addField({
                    id: 'custpage_htmlcontent',
                    type: ui.FieldType.INLINEHTML,
                    label: 'HTML Content'
                }).defaultValue = htmlContent;

                scriptContext.response.writePage(form);
            }
            function getSubsidiaryLogoUrl(subsidiaryId) {
                    var subsidiaryInfo = record.load({
                        type: record.Type.SUBSIDIARY,
                        id: subsidiaryId,
                        isDynamic: true
                    });
            
                    var logoId = subsidiaryInfo.getValue({
                        fieldId: 'logo'
                    });
            
                    if (logoId) {
                        var fileObj = file.load({
                            id: logoId
                        });
            
                        return fileObj.url;
                    } else {
                        return 'DEFAULT_LOGO_URL'; // Provide a default logo URL if no logo found
                    }
                }
          function getHtmlContent(start,end,curREc) {
            var totalAmount = 0;
            var final_value;
            var subsidiaryId = runtime.getCurrentUser().subsidiary;
            var logoUrl = getSubsidiaryLogoUrl(subsidiaryId);
            // var invoiceSearchObj =search.load({
            //     id: 'customsearch474',
            // });
            var cusName,coName,vin,stDate,endDate,leaseREv,purOption,deposit,amountRemaining,total;

            var customrecord_advs_lease_headerSearchObj = search.create({
                type: "customrecord_advs_lease_header",
                filters:
                [
                   ["internalid","anyof",curREc]
                ],
    
                columns:
                [
                   search.createColumn({name: "name", label: "ID"}),
                   search.createColumn({name: "custrecord_advs_la_vin_bodyfld", label: "VIN"}),
                   search.createColumn({name: "custrecord_advs_l_h_customer_name", label: "Lessee Name "}),
                   search.createColumn({name: "custrecord_advs_lease_comp_name_fa", label: "Company Name"}),
                ]
             });
             var searchResultCount = customrecord_advs_lease_headerSearchObj.runPaged().count;
             log.debug("customrecord_advs_lease_headerSearchObj result count",searchResultCount);
             customrecord_advs_lease_headerSearchObj.run().each(function(result){
                 cusName = result.getText({ name: "custrecord_advs_l_h_customer_name" });
                 coName  = result.getValue({ name: "custrecord_advs_lease_comp_name_fa" });
                 vin     = result.getText({ name: "custrecord_advs_la_vin_bodyfld" });
                 

                return true;
             });
            log.debug("logoUrl",logoUrl);
            var totalAmount = 0;
var invoiceSearchObj = search.create({
    type: "invoice",
    filters: [
        ["type", "anyof", "CustInvc"],
        "AND",
        ["mainline", "is", "F"],
        "AND",
        ["taxline", "is", "F"],
        "AND",
        ["custbody_advs_lease_head", "noneof", "@NONE@"],
        "AND",
        ["trandate", "within", start, end]
    ],
    columns: [
        search.createColumn({ name: "trandate", label: "Date" }),
        search.createColumn({ name: "item", label: "Item" }),
        search.createColumn({ name: "amount", label: "Amount" }),
        search.createColumn({ name: "custbody_advs_lease_head", label: "Lease Head #" })
    ]
});

var searchResultCount = invoiceSearchObj.runPaged().count;
log.debug("invoiceSearchObj result count", searchResultCount);

invoiceSearchObj.run().each(function(result) {
    var amount = parseFloat(result.getValue({ name: "amount" }));
    totalAmount += amount;
    return true;
});
var chargers=0;
            var subcharger=totalAmount-chargers
            var htmlContent ="<!DOCTYPE html>\n" +
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
                "        }\n" +
                "        .section table {\n" +
                "            width: 100%;\n" +
                "            border-collapse: collapse;\n" +
                "            margin-top: 5px;\n" +
                "        }\n" +
                "        .section th, .section td {\n" +
                "            padding: 8px;\n" +
                "            border-bottom: 1px solid #ddd;\n" +
                "            font-size: 12px;\n" +
                "            white-space: nowrap;\n" +
                "            text-align: left;\n" +
                "        }\n" +
                "        .section th {\n" +
                "            background-color: #f2f2f2;\n" +
                "        }\n" +
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
                "    </style>\n" +
                "</head>\n" +
                "<body>\n" +
                "<div class=\"container\">\n" +
                "    <div class=\"header\">\n" +
                "        <img class=\"logo\" src='"+logoUrl+"' alt=\"LRM Logo\">\n" +
                "    </div>\n" +
                "    <div class=\"section\">\n" +
                "        <h4>Lessees and Vehicle</h4>\n" +
                "        <table>\n" +
                "            <tr>\n" +
                "                <th>Lessee name:</th>\n" +
                "                <td>"+cusName+"</td>\n" +
                "            </tr>\n" +
                "            <tr>\n" +
                "                <th>Co-lessee name:</th>\n" +
                "                <td>"+coName+"</td>\n" +
                "            </tr>\n" +
                "            <tr>\n" +
                "                <th>VIN:</th>\n" +
                "                <td>"+vin+"</td>\n" +
                "            </tr>\n" +
                "        </table>\n" +
                "    </div>\n" +
                "    <div class=\"section\">\n" +
                "        <h4>Lease Statement History</h4>\n" +
                "        <table>\n" +
                "            <tr>\n" +
                "                <th>Description</th>\n" +
            //  "                <th>Date</th>\n" +
                "                <th style=\"text-align: right;\">Amount</th>\n" +
                "            </tr>\n"+
                "            <tr>\n" +
                "                <td>Balance owed currently1</th>\n" +
                "                <td style=\"text-align: right;\">"+ totalAmount.toFixed(2)+"</td>\n" +
                "            </tr>\n" +
                "            <tr>\n" +
                "                <td>Lease payments, including applicable sales tax:</th>\n" +
                "                <td style=\"text-align: right;\">"+chargers.toFixed(2)+"</td>\n" +
                "            </tr>\n" +
                "            <tr>\n" +
                "                <th>Charges</th>\n" +
                "                <th style=\"text-align: right;\">"+subcharger.toFixed(2)+"</th>\n" +
                "            </tr>\n" +
                "        </table>\n" +
                "    </div>\n" +
                "    <div class=\"section\">\n" +
                "        <h4>Statement Date Range</h4>\n" +
                "        <table class=\"itemization\">\n" +
                "            <tr>\n" +
                "                <th>Description</th>\n" +
                // "                <th>Date</th>\n" +
                "                <th style=\"text-align: right;\">Date</th>\n" +
                "            </tr>\n"+
                "            <tr>\n" +
                "                <td>Statement start date:</th>\n" +
                "                <td>"+start+"</td>\n" +
                "            </tr>\n" +
                "            <tr>\n" +
                "                <td>Statement end date:</th>\n" +
                "                <td>"+end+"</td>\n" +
                "            </tr>\n" +
                "        </table>\n" +
                "    </div>\n" +
                " <div class=\"section\">\n" +
                "        <h4>Itemized Lease Transactions</h4>\n" +
                "        <table class=\"balance\">\n" +
                "            <tr>\n" +
                "                <th>Description</th>\n" +
                "                <th>Date</th>\n" +
                "                <th style=\"text-align: right;\">Amount</th>\n" +
                "            </tr>\n" ;
                // var invoiceSearchObj = search.create({
                //     type: "invoice",
                //     filters:
                //     [
                //        ["type","anyof","CustInvc"], 
                //        "AND", 
                //        ["mainline","is","F"], 
                //        "AND", 
                //        ["taxline","is","F"], 
                //        "AND", 
                //        ["custbody_advs_lease_head","noneof","@NONE@"],
                //        "AND",
                //        ["trandate", "within",start,end]
                //     ],
                //     columns:
                //     [
                //        search.createColumn({name: "trandate", label: "Date"}),
                //        search.createColumn({name: "item", label: "Item"}),
                //        search.createColumn({name: "amount", label: "Amount"}),
                //        search.createColumn({name: "custbody_advs_lease_head", label: "Lease Head #"})
                //     ]
                //  });
                //  var searchResultCount = invoiceSearchObj.runPaged().count;
                //  log.debug("invoiceSearchObj result count",searchResultCount);
                
                 invoiceSearchObj.run().each(function(result){
                    var trandate = result.getValue({ name: "trandate" });
                    var item = result.getText({ name: "item" });
                    var amount =parseFloat(result.getValue({ name: "amount" }));
                    var leaseHead = result.getValue({ name: "custbody_advs_lease_head" });

                    // totalAmount+=amount;
                    


                    htmlContent += "<tr>\n";
                    htmlContent += "<td>" + item + "</td>\n";
                    htmlContent += "<td>" + trandate + "</td>\n";
                    htmlContent += "<td style=\"text-align: right;\"><span style=\"white-space: nowrap;\"> $</span> " +amount.toFixed(2)+ "</td>\n";
                    htmlContent += "</tr>\n";
                    return true;
                 }); 
               
                // "            <tr>\n" +
                // "                <td>Nonrefundable deposit paid*</td>\n" +
                // "                <td>(5,000)</td>\n" +
                // "            </tr>\n" +
                // "            <tr>\n" +
                // "                <td>Advance lease installments paid</td>\n" +
                // "                <td>(2,300)</td>\n" +
                // "            </tr>\n" +
                // "            <tr>\n" +
                // "                <th style=\"text-align: left;\">Lease receivable balance due</th>\n" +
                // "                <th>52,615</th>\n" +
                // "            </tr>\n" +
                // "            <tr>\n" +
                // "                <td>Sales tax on lease receivable balance due</td>\n" +
                // "                <td>3,683</td>\n" +
                // "            </tr>\n" +
                // "            <tr>\n" +
                // "                <td>Unpaid lease charges</td>\n" +
                // "                <td>428</td>\n" +
                // "            </tr>\n" +
                htmlContent+= "<tr>\n" +
                "                <th style=\"text-align: left;\">Balance due, end date1</th>\n" +
                "                <th>"+end+"</th>\n" +
                "                <th  style=\"text-align:right;\"><span style=\"white-space: nowrap;\">$</span>"+totalAmount.toFixed(2)+"</th>\n" +
                "            </tr>\n" +
                "          </table>\n" +
                "        <div class=\"note\">\n" +
                "            1 - Balance presented is as of the Statement End Date included herein. </br> 2 - Any payments made are always first applied against any open charges or fees on the account before any lease installments owed.\n" +
                "        </div>\n" +
                "    </div>\n" +
                "    <div class=\"button-container\">\n" +
                "        <button type=\"submit\" onclick=\"submitForm()\">Submit</button>\n" +
                "        <button onclick=\"printPage()\">Print</button>\n" +
                "    </div>\n" +
                "\n" +
                "    <!-- Hidden field to store amount and total values -->\n" +
                "    <input type=\"hidden\" id=\"amounts\" name=\"amounts\">\n" +
                "</div>\n" +
                "\n" +
                "<script>\n" +
                "    function printPage() {\n" +
                "        window.print();\n" +
                "    }\n" +
                "\n" +
                "    function submitForm() {\n" +
                "        // Your form submission logic goes here\n" +
                "        alert('Form submitted!');\n" +
                "        \n" +
                "    }\n" +
                "</script>\n" +
                "</body>\n" +
                "</html>\n";
    
            return htmlContent;
        }


        }

        return {onRequest}

    });
