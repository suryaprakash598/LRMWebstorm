/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */

define(['N/ui/serverWidget','N/runtime','N/record','N/file','N/render', 'N/search','SuiteScripts/Advectus/advs_lib_return_buyout.js'],
function(ui,runtime,record,file,render,search,lib_return_buyout) {
    function onRequest(context) {
        if (context.request.method === 'GET') {
            var form = ui.createForm({
                title: 'Lease Account Statement',
                hideNavBar:true
            });  
            var cuRec = context.request.parameters.Custparam_curecid;
            log.debug("cuRec: " + cuRec); 
           if(cuRec)
		   {
			   
			  var leaseObj= search.lookupFields({type:'customrecord_advs_lease_header',id:cuRec,columns:['custrecord_advs_l_h_customer_name']});
			  var _Lessee = leaseObj.custrecord_advs_l_h_customer_name[0].value;
			 var lesseobjfld =   form.addField({
					id: 'custpage_lesse',
					type: ui.FieldType.SELECT,
					source:'customer',
					label: 'Customer'
				})
				lesseobjfld.defaultValue = _Lessee;
				lesseobjfld.updateDisplayType({
					displayType : ui.FieldDisplayType.HIDDEN
				});
		   }

            var htmlContent = getHtmlContent(cuRec);
		/* var Renderer = render.create();
              Renderer.templateContent = htmlContent; 
   
            	 var newfile = Renderer.renderAsPdf();
                 var printTitle = 'Lease';
                 var tranId = 'Agreement Account Statement';
					newfile.name = printTitle + ' #' + tranId +".pdf";
					 context.response.addHeader({
						 name:'Content-Type:',
						 value: 'application/pdf'
					 });
					 context.response.addHeader({
						 name: 'Content-Disposition',
						 value: 'inline; filename='+ newfile.name
					 });
					 newfile.folder = -20;
					var fileId = newfile.save();
					var pdfidfld =  form.addField({
						id: 'custpage_pdfid',
						type: ui.FieldType.TEXT,
						label: 'fileId'
					})
					pdfidfld.defaultValue = fileId;
					pdfidfld.updateDisplayType({
					displayType : ui.FieldDisplayType.HIDDEN
				}); */
            form.addField({
                id: 'custpage_htmlcontent',
                type: ui.FieldType.INLINEHTML,
                label: 'HTML Content'
            }).defaultValue = htmlContent;
			form.addButton({id:"custpage_send_email",label:"Email",functionName:"sendEmail()"});
			form.addButton({id:"custpage_print_template",label:"Print",functionName:"printTemplate()"});
			form.clientScriptModulePath = "./advs_cs_lease_acc_stmt.js";
            context.response.writePage(form);
        }
    }
    
    function getHtmlContent(cuRec) {
        var subsidiaryId = runtime.getCurrentUser().subsidiary;
         var logoUrl = lib_return_buyout.getSubsidiaryLogoUrl(subsidiaryId);

        var cusName,coName,vin,stDate,endDate,leaseREv,purOption,deposit,netdeposit,amountRemaining,total,downpayment;
        var PayInception =0;

        var customrecord_advs_lease_headerSearchObj = search.create({
            type: "customrecord_advs_lease_header",
            filters:
            [
               ["internalid","anyof",cuRec]
            ],

            columns:
            [
               search.createColumn({name: "name", label: "ID"}),
               search.createColumn({name: "custrecord_advs_la_vin_bodyfld", label: "VIN"}),
               search.createColumn({name: "custrecord_advs_l_h_customer_name", label: "Lessee Name "}),
               search.createColumn({name: "custrecord_advs_lease_comp_name_fa", label: "Company Name"}),
               search.createColumn({name: "custrecord_advs_l_h_start_date", label: "START ACCURAL DATE"}),
               search.createColumn({name: "custrecord_advs_l_h_end_date", label: "END ACCURAL DATETE"}),

               search.createColumn({name: "custrecord_advs_r_a_down_payment", label: "Down payment"}),
               search.createColumn({name: "custrecord_advs_l_h_cont_total", label: "CONTRACT TOTAL"}),
               search.createColumn({name: "custrecord_advs_l_h_pur_opti", label: "PURCHASE OPTION"}),

               search.createColumn({name: "total", label:"INVOICE",join: "custrecord_advs_l_a_down_invoie"}),
               search.createColumn({name: "custrecord_advs_l_h_depo_ince", label:"DEPOSIT INCEPTION"}),
               search.createColumn({name: "custrecord_advs_net_dep_", label:"NET DEPOSIT INCEPTION"}),
               search.createColumn({name: "amountremaining", label:"INVOICE",join: "custrecord_advs_l_a_down_invoie"}),

                search.createColumn({name: "custrecord_advs_l_h_pay_incep", label: "PURCHASE OPTION"}),
                search.createColumn({name: "custrecord_advs_l_h_terms", label: "PURCHASE OPTION"}),
            ]
         });
         var searchResultCount = customrecord_advs_lease_headerSearchObj.runPaged().count;
         log.debug("customrecord_advs_lease_headerSearchObj result count",searchResultCount);
         customrecord_advs_lease_headerSearchObj.run().each(function(result){
             cusName = result.getText({ name: "custrecord_advs_l_h_customer_name" });
             coName  = result.getValue({ name: "custrecord_advs_lease_comp_name_fa" });
             vin     = result.getText({ name: "custrecord_advs_la_vin_bodyfld" });
             stDate     = result.getValue({ name: "custrecord_advs_l_h_start_date" });
             endDate     = result.getValue({ name: "custrecord_advs_l_h_end_date" });
             downpayment     = parseFloat(result.getValue({ name: "custrecord_advs_l_h_depo_ince" }));
             // leaseREv     = parseFloat(result.getValue({ name: "custrecord_advs_l_h_cont_total" }));
             purOption     =parseFloat(result.getValue({ name: "custrecord_advs_l_h_pur_opti" })) 
             total = parseFloat(result.getValue({name: 'total',join: 'custrecord_advs_l_a_down_invoie'}))
             deposit     =parseFloat( result.getValue({ name: "custrecord_advs_l_h_depo_ince" }))
             netdeposit     =parseFloat( result.getValue({ name: "custrecord_advs_net_dep_" }))
             deposit = netdeposit;
             amountRemaining =parseFloat( result.getValue({name: 'amountremaining',join: 'custrecord_advs_l_a_down_invoie'}));


              PayInception = parseFloat(result.getValue({ name: "custrecord_advs_l_h_pay_incep" }));
             var terms = parseFloat(result.getValue({ name: "custrecord_advs_l_h_terms" }));

             leaseREv     = (PayInception*terms);
             leaseREv = leaseREv*1;leaseREv=leaseREv.toFixed(2);leaseREv=leaseREv*1;

            return true;
         });
         var paidInstallment = lib_return_buyout.getPaidInstallmentAmount(cuRec);
        var unpaidInstallment = lib_return_buyout.getUnpaidInstAmt(cuRec);
      
         var   amttotal=leaseREv+purOption;//+downpayment;

        var receivable_balance_due = ((amttotal - paidInstallment - deposit) - PayInception);
        receivable_balance_due  =receivable_balance_due*1;

         salestax=receivable_balance_due*0.07;
   


         var balance_due = (receivable_balance_due+unpaidInstallment+salestax)


        log.debug("logoUrl",logoUrl);
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
            "        <h4>Lease Account Statement</h4>\n" +
            "        <table>\n" +
            "            <tr>\n" +
            "                <th>Statement date:</th>\n" +
            "                <td>"+stDate+"</td>\n" +
            "            </tr>\n" +
            "            <tr>\n" +
            "                <th>Last scheduled lease installment date:</th>\n" +
            "                <td>"+endDate+"</td>\n" +
            "            </tr>\n" +
            "        </table>\n" +
            "    </div>\n" +
            "    <div class=\"section\">\n" +
            "        <h4>Itemization</h4>\n" +
            "        <table class=\"itemization\">\n" +
            "            <tr>\n" +
            "                <th>Description</th>\n" +
            "                <th style=\"text-align: right;\">Amount</th>\n" +
            "            </tr>\n" +
            "            <tr>\n" +
            "                <td>Lease receivable</td>\n" +
            "                <td>"+leaseREv.toFixed(2)+"</td>\n" +
            "            </tr>\n" +
            /* "            <tr>\n" +
            "                <td>Nonrefundable deposit</td>\n" +
            "                <td>"+downpayment.toFixed(2)+"</td>\n" +
            "            </tr>\n" + */
            "            <tr>\n" +
            "                <td>Purchase option*</td>\n" +
            "                <td>"+purOption.toFixed(2)+"</td>\n" +
            "            </tr>\n" +
            "            <tr>\n" +
            "                <th style=\"text-align: left;\">Total</th>\n" +
            "                <th>"+amttotal.toFixed(2)+"</th>\n" +
            "            </tr>\n" +
            "        </table>\n" +
            "    </div>\n" +
            "    <div class=\"section\">\n" +
            "        <h4>Balance</h4>\n" +
            "        <table class=\"balance\">\n" +
            "            <tr>\n" +
            "                <th>Description</th>\n" +
            "                <th style=\"text-align: right;\">Amount</th>\n" +
            "            </tr>\n" +
            "            <tr>\n" +
            "                <td>Lease installments paid</td>\n" +
            "                <td>"+paidInstallment.toFixed(2)+"</td>\n" +
            "            </tr>\n" +
            "            <tr>\n" +
            "                <td>Nonrefundable deposit paid*</td>\n" +
            "                <td>"+netdeposit.toFixed(2)+"</td>\n" +
            // "                <td>"+deposit.toFixed(2)+"</td>\n" +
            "            </tr>\n" +
            "            <tr>\n" +
            "                <td>Advance lease installments paid</td>\n" +
            "                <td>"+PayInception.toFixed(2)+"</td>\n" +
            "            </tr>\n" +
            "            <tr>\n" +
            "                <th style=\"text-align: left;\">Lease receivable balance due</th>\n" +
            "                <th>"+receivable_balance_due.toFixed(2)+"</th>\n" +
            "            </tr>\n" +
            "            <tr>\n" +
            "                <td>Sales tax on lease receivable balance due</td>\n" +
            "                <td>"+salestax.toFixed(2)+"</td>\n" +
            "            </tr>\n" +
            "            <tr>\n" +
            "                <td>Unpaid lease charges</td>\n" +
            "                <td>"+paidInstallment+"</td>\n" +
            "            </tr>\n" +
            "            <tr>\n" +
            "                <th style=\"text-align: left;\">Total balance due</th>\n" +
            "                <th>"+balance_due.toFixed(2)+"</th>\n" +
            "            </tr>\n" +
            "        </table>\n" +
            "        <div class=\"note\">\n" +
            "            * Assumes lessee exercises the Purchase Option as described in the TRAC ADDENDUM of your MOTOR VEHICLE LEASE AGREEMENT. If you would like to exercise a different option as described in the TRAC\n" +
            "        </div>\n" +
            "    </div>\n" +
            "    <div class=\"button-container\">\n" +
           // "        <button onclick=\"sendemail()\">Email</button>\n" +
          //  "        <button type=\"submit\" onclick=\"submitForm()\">Submit</button>\n" +
           // "        <button onclick=\"printPage()\">Print</button>\n" +
            "    </div>\n" +
            "\n" +
            "    <!-- Hidden field to store amount and total values -->\n" +
            "    <input type=\"hidden\" id=\"amounts\" name=\"amounts\">\n" +
            "</div>\n" +
            "\n" +
           /*  "<script>\n" +
            "    function printPage() {\n" +
			"        event.preventDefault();\n" +	
            "        window.print();\n" +
            "    }\n" + 
			
			"    function sendemail() {\n" +
			"        event.preventDefault();\n" +	
            "       \n" +
            "    }\n" +
            "\n" +
            "    function submitForm() {\n" +
            "        // Your form submission logic goes here\n" +
            "        alert('Form submitted!');\n" +
            "        \n" +
            "    }\n" +
            "</script>\n" + */
            "</body>\n" +
            "</html>\n";

        return htmlContent;
    }

    return {
        onRequest: onRequest
    };
});
