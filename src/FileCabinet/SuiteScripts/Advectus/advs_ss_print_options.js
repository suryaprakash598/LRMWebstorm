/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
define(['N/format', 'N/render', 'N/runtime', 'N/search', 'N/ui/serverWidget', 'N/url', 'N/xml'],
    /**
 * @param{format} format
 * @param{render} render
 * @param{runtime} runtime
 * @param{search} search
 * @param{serverWidget} serverWidget
 * @param{url} url
 * @param{xml} xml
 */
    (format, render, runtime, search, serverWidget, url, xml) => {
        /**
         * Defines the Suitelet script trigger point.
         * @param {Object} scriptContext
         * @param {ServerRequest} scriptContext.request - Incoming request
         * @param {ServerResponse} scriptContext.response - Suitelet response
         * @since 2015.2
         */
        const onRequest = (context) => {
            var request	=	context.request;
			var response	=	context.response;
			if(request.method == "GET"){
                // var Job_value = request.parameters.JobOption;
                // var Price_value = request.parameters.PriceOption;
                // var Qty_value = request.parameters.qtyOption;
                // var MSG_value = request.parameters.MsgOption;
                // var Auth_value = request.parameters.AuthHisOption;
                // var Appoint_value = request.parameters.AppointOption;




                var jobChecked      = request.parameters.jobChecked;
                var qtyChecked      = request.parameters.qtyChecked;
                var priceChecked    = request.parameters.priceChecked;
                var authChecked     = request.parameters.authChecked;
                var msgChecked      = request.parameters.msgChecked;
                var appointChecked  = request.parameters.appointChecked;

                log.debug("Job_value=>Price_value=>Qty_value",jobChecked +"=>"+ qtyChecked +"=>"+  priceChecked)
                log.debug("appointChecked=>msgChecked=>authChecked",msgChecked +"=>"+ authChecked +"=>"+  appointChecked)
				var form = serverWidget.createForm({
					title: ' ',
					hideNavBar: true
				});
                var htmlfld	=	form.addField({
					id:"custpage_html",
					type:"inlinehtml",
					label:" "
				})


                var webjobFld	=	form.addField({id:"custpage_webjob",label:"Webjob",type:serverWidget.FieldType.TEXT});
				webjobFld.updateDisplayType({displayType:"hidden"});
                if(jobChecked != undefined && jobChecked != null)
                {
                    webjobFld.defaultValue	=	jobChecked;
                }
				var webpriceFld	 =	form.addField({id:"custpage_webprice",label:"webprice",type:serverWidget.FieldType.TEXT});
				webpriceFld.updateDisplayType({displayType:"hidden"});
                if(priceChecked != undefined && priceChecked != null){
                    webpriceFld.defaultValue =	priceChecked;
                }
				var webqtyFld	=	form.addField({id:"custpage_webqty",label:"webqty",type:serverWidget.FieldType.TEXT});
				webqtyFld.updateDisplayType({displayType:"hidden"});
                if(qtyChecked != undefined && qtyChecked != null){
                    webqtyFld.defaultValue	 =	qtyChecked;
                }
                var webMsgFld	=	form.addField({id:"custpage_webmsg",label:"webmsg",type:serverWidget.FieldType.TEXT});
				webMsgFld.updateDisplayType({displayType:"hidden"});
                if(msgChecked != undefined && msgChecked != null){
                    webMsgFld.defaultValue	 =	msgChecked;
                }
                var webAuthFld	=	form.addField({id:"custpage_webauth",label:"webauth",type:serverWidget.FieldType.TEXT});
				webAuthFld.updateDisplayType({displayType:"hidden"});
                if(authChecked != undefined && authChecked != null){
                    webAuthFld.defaultValue	 =	authChecked;
                }
                var webAppointFld	=	form.addField({id:"custpage_webappoint",label:"webappoint",type:serverWidget.FieldType.TEXT});
				webAppointFld.updateDisplayType({displayType:"hidden"});
                if(appointChecked != undefined && appointChecked != null){
                    webAppointFld.defaultValue	 =	appointChecked;
                }






                // var jobFld	=	form.addField({id:"custpage_job",label:"job",type:serverWidget.FieldType.TEXT});
				// jobFld.updateDisplayType({displayType:"hidden"});
                // if(Job_value != undefined && Job_value != null)
                // {
                //     jobFld.defaultValue	=	Job_value;
                // }
				// var priceFld	 =	form.addField({id:"custpage_price",label:"price",type:serverWidget.FieldType.TEXT});
				// priceFld.updateDisplayType({displayType:"hidden"});
                // if(Price_value != undefined && Price_value != null){
                //     priceFld.defaultValue =	Price_value;
                // }
				// var qtyFld	=	form.addField({id:"custpage_qty",label:"qty",type:serverWidget.FieldType.TEXT});
				// qtyFld.updateDisplayType({displayType:"hidden"});
                // if(Qty_value != undefined && Qty_value != null){
                //  qtyFld.defaultValue	 =	Qty_value;
                // }
                // var MsgFld	=	form.addField({id:"custpage_msg",label:"msg",type:serverWidget.FieldType.TEXT});
				// MsgFld.updateDisplayType({displayType:"hidden"});
                // if(MSG_value != undefined && MSG_value != null){
                //     MsgFld.defaultValue	 =	MSG_value;
                // }
                // var AuthFld	=	form.addField({id:"custpage_auth",label:"auth",type:serverWidget.FieldType.TEXT});
				// AuthFld.updateDisplayType({displayType:"hidden"});
                // if(Auth_value != undefined && Auth_value != null){
                //     AuthFld.defaultValue	 =	Auth_value;
                // }
                // var AppointFld	=	form.addField({id:"custpage_appoint",label:"appoint",type:serverWidget.FieldType.TEXT});
				// AppointFld.updateDisplayType({displayType:"hidden"});
                // if(Appoint_value != undefined && Appoint_value != null){
                // AppointFld.defaultValue	 =	Appoint_value;
                //}




                 
                var html = "";
            //     html += "<html>";
            //     html += "<head>";
            //     html += "  <link rel='stylesheet' href='https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200' />";
            //     html += "  <style>";
            //     html += "    /* Style for the toggle switches */";
            //     html += "    .switch {";
            //     html += "      position: relative;";
            //     html += "      display: inline-block;";
            //     html += "      width: 75px;";
            //     html += "      height: 34px;";
            //     html += "    }";
            //     html += "    .switch input {";
            //     html += "      opacity: 0;";
            //     html += "      width: 0;";
            //     html += "      height: 0;";
            //     html += "    }";
            //     html += "    .slider {";
            //     html += "      position: absolute;";
            //     html += "      cursor: pointer;";
            //     html += "      top: 0;";
            //     html += "      left: 0;";
            //     html += "      right: 0;";
            //     html += "      bottom: 0;";
            //     html += "      background-color: #ccc;";
            //     html += "      transition: .4s;";
            //     html += "      border-radius: 34px;";
            //     html += "    }";
            //     html += "    .slider:before {";
            //     html += "      position: absolute;";
            //     html += "      content: '';"; 
            //     html += "      height: 26px;";
            //     html += "      width: 26px;";
            //     html += "      left: 4px;";
            //     html += "      bottom: 4px;";
            //     html += "      background-color: white;";
            //     html += "      transition: .4s;";
            //     html += "      border-radius: 50%;";
            //     html += "    }";
            //     html += "    input:checked + .slider {";
            //     html += "      background-color:#2196f3;";
            //     html += "    }";
            //     html += "    input:checked + .slider:before {";
            //     html += "      transform: translateX(41px);";
            //     html += "    }";
            //     html += "    /* Label Styles */";
            //     html += "    .toggle-label {";
            //     html += "      font-size: 16px;";
            //     html += "      color: #0909d296;";
            //     html += "      font-family: Arial, Helvetica, sans-serif;";
            //     html += "      padding:2px 20px;";
                
            //     html += "    }";
            //     html += "    .toggle-container {";
            //     html += "      display: flex;";
            //     html += "      justify-content: space-between;"; 
            //     html += "      align-items:right;";
            //     html += "      margin-bottom: 10px;";
            //     html += "    }";
            //     html += "  </style>";
            //     html += "</head>";
            //     html += "<body>";
                
            //     // Main Container
            //     html += "<div class='main-cont-all'>";
            //     html += "  <div class='main-cont-top'>";
            //     html += "    <div class='formsubmitbutn'>";
                
            //     // Toggle Section
            //     html += "      <div class='toggle-section'>";
            //     html += "        <h2 style='color:#0909d296;text-align: center;'>ESTIMATE OPTIONS</h2>";
                
            //     // Toggle WithJob/WithoutJob
            //     if(Job_value !== undefined && Job_value !== null && Job_value !== false && Job_value !== 'false'){
            //         html += "        <div class='toggle-container'>";
            //         // html += "          <span class='toggle-label'>With Job</span>";
            //         html += "          <span class='toggle-label'>Include Job</span>";
            //         html += "          <label class='switch'>";
            //         html += "            <input type='checkbox' id='custpage_jobOption' name='jobOption' checked   onChange=\"onToggleModuleChange('/SuiteScripts/advectus/advs_cs_print_options.js', 'onChange', this.checked)\">";
            //         html += "            <span class='slider'></span>";
            //         html += "          </label>";
            //         html += "        </div>";
            //     }
            //     else{
            //         html += "        <div class='toggle-container'>";
            //       //  html += "          <span class='toggle-label'>With Job</span>";
            //         html += "          <span class='toggle-label'>Include Job</span>";
            //         html += "          <label class='switch'>";
            //         html += "            <input type='checkbox' id='custpage_jobOption' name='jobOption'   onChange=\"onToggleModuleChange('/SuiteScripts/advectus/advs_cs_print_options.js', 'onChange', this.checked)\">";
            //         html += "            <span class='slider'></span>";
            //         html += "          </label>"; 
            //         html += "        </div>";

            //     }
               

            //     if(Price_value !== undefined && Price_value !== null && Price_value !== false && Price_value !== 'false'){
            //          // Toggle priceOption
            //     html += "        <div class='toggle-container'>";
            //    // html += "          <span class='toggle-label'>With Price</span>";
            //     html += "          <span class='toggle-label'>Include Price</span>";
            //     html += "          <label class='switch'>";
            //     html += "            <input type='checkbox' id='custpage_priceOption' name='priceOption' checked onChange=\"onToggleModuleChange('/SuiteScripts/advectus/advs_cs_print_options.js', 'onChange', this.checked)\">";
            //     html += "            <span class='slider'></span>";
            //     html += "          </label>";
            //     html += "        </div>";

            //     }
            //     else{
            //          // Toggle priceOption
            //     html += "        <div class='toggle-container'>";
            //   //  html += "          <span class='toggle-label'>With Price</span>";
            //     html += "          <span class='toggle-label'>Include Price</span>";
            //     html += "          <label class='switch'>";
            //     html += "            <input type='checkbox' id='custpage_priceOption' name='priceOption' onChange=\"onToggleModuleChange('/SuiteScripts/advectus/advs_cs_print_options.js', 'onChange', this.checked)\">";
            //     html += "            <span class='slider'></span>";
            //     html += "          </label>";
            //     html += "        </div>";

            //     }
               
            //       // Toggle qtyOption
            //     if(Qty_value !== undefined && Qty_value !== null && Qty_value !== false && Qty_value !== 'false'){
            //         html += "        <div class='toggle-container'>";
            //       //  html += "          <span class='toggle-label'>With Quantity</span>";
            //         html += "          <span class='toggle-label'>Include Quantity</span>";
            //         html += "          <label class='switch'>";
            //         html += "            <input type='checkbox' id='custpage_qtyOption' name='qtyOption' checked onChange=\"onToggleModuleChange('/SuiteScripts/advectus/advs_cs_print_options.js', 'onChange', this.checked)\">";
            //         html += "            <span class='slider'></span>";
            //         html += "          </label>";
            //         html += "        </div>";
            //     }
            //     else{
            //         html += "        <div class='toggle-container'>";
            //        // html += "          <span class='toggle-label'>With Quantity</span>";
            //         html += "          <span class='toggle-label'>Include Quantity</span>";
            //         html += "          <label class='switch'>";
            //         html += "            <input type='checkbox' id='custpage_qtyOption' name='qtyOption' onChange=\"onToggleModuleChange('/SuiteScripts/advectus/advs_cs_print_options.js', 'onChange', this.checked)\">";
            //         html += "            <span class='slider'></span>";
            //         html += "          </label>";
            //         html += "        </div>";
            //     }

            //      // Toggle messagesOption
            //     if(MSG_value !== undefined && MSG_value !== null && MSG_value !== false && MSG_value !== 'false'){
            //     html += "        <div class='toggle-container'>";
            //     html += "          <span class='toggle-label'>Include Messages</span>";
            //     html += "          <label class='switch'>";
            //     html += "            <input type='checkbox' id='custpage_messagesOption' name='messagesOption' checked onChange=\"onToggleModuleChange('/SuiteScripts/advectus/advs_cs_print_options.js', 'onChange', this.checked)\">";
            //     html += "            <span class='slider'></span>";
            //     html += "          </label>";
               
            //     html += "        </div>";
            //      }
            //     else{
            //         html += "        <div class='toggle-container'>";
            //         html += "          <span class='toggle-label'>Include Messages</span>";
            //         html += "          <label class='switch'>";
            //         html += "            <input type='checkbox' id='custpage_messagesOption' name='messagesOption' onChange=\"onToggleModuleChange('/SuiteScripts/advectus/advs_cs_print_options.js', 'onChange', this.checked)\">";
            //         html += "            <span class='slider'></span>";
            //         html += "          </label>"; 
            //         html += "        </div>";

            //      }
                
            //     // Toggle authHistoryOption
            //     if(Auth_value !== undefined && Auth_value !== null && Auth_value !== false && Auth_value !== 'false'){
            //     html += "        <div class='toggle-container'>";
            //     html += "          <span class='toggle-label'>Include Authorization History</span>";
            //     html += "          <label class='switch'>";
            //     html += "            <input type='checkbox' id='custpage_authHistoryOption' name='authHistoryOption' checked  onChange=\"onToggleModuleChange('/SuiteScripts/advectus/advs_cs_print_options.js', 'onChange', this.checked)\">";
            //     html += "            <span class='slider'></span>";
            //     html += "          </label>";
            //     html += "        </div>";
            //     }
            //     else{
            //         html += "        <div class='toggle-container'>";
            //         html += "          <span class='toggle-label'>Include Authorization History</span>";
            //         html += "          <label class='switch'>";
            //         html += "            <input type='checkbox' id='custpage_authHistoryOption' name='authHistoryOption' onChange=\"onToggleModuleChange('/SuiteScripts/advectus/advs_cs_print_options.js', 'onChange', this.checked)\">";
            //         html += "            <span class='slider'></span>";
            //         html += "          </label>";
            //         html += "        </div>";

            //     }


            //     // Toggle appointmentsOption
            //     if(Appoint_value !== undefined && Appoint_value !== null && Appoint_value !== false && Appoint_value !== 'false'){
            //     html += "        <div class='toggle-container'>";
            //     html += "          <span class='toggle-label'>Include Appointments</span>";
            //     html += "          <label class='switch'>";
            //     html += "            <input type='checkbox' id='custpage_appointmentsOption' name='appointmentsOption' checked onChange=\"onToggleModuleChange('/SuiteScripts/advectus/advs_cs_print_options.js', 'onChange', this.checked)\">";
            //     html += "            <span class='slider'></span>";
            //     html += "          </label>"; 
            //     html += "        </div>";
            //     }
            //     else{
            //         html += "        <div class='toggle-container'>";
            //         html += "          <span class='toggle-label'>Include Appointments</span>";
            //         html += "          <label class='switch'>";
            //         html += "            <input type='checkbox' id='custpage_appointmentsOption' name='appointmentsOption'  onChange=\"onToggleModuleChange('/SuiteScripts/advectus/advs_cs_print_options.js', 'onChange', this.checked)\">";
            //         html += "            <span class='slider'></span>";
            //         html += "          </label>";  
            //         html += "        </div>";

            //     }
                

            //     //work order
            //     // html += "        <div class='toggle-container'>";
            //     // html += "          <label class='switch'>";
            //     // html += "            <input type='checkbox' id='custpage_laborHoursOption' name='laborHoursOption' onChange=\"onToggleModuleChange('/SuiteScripts/advectus/advs_cs_print_options.js', 'onChange', this.checked)\">";
            //     // html += "            <span class='slider'></span>";
            //     // html += "          </label>";
            //     // html += "          <span class='toggle-label'>Include Labor Hours</span>";
            //     // html += "        </div>";

            //     // html += "        <div class='toggle-container'>";
            //     // html += "          <label class='switch'>";
            //     // html += "            <input type='checkbox' id='custpage_pricingOption' name='pricingOption' onChange=\"onToggleModuleChange('/SuiteScripts/advectus/advs_cs_print_options.js', 'onChange', this.checked)\">";
            //     // html += "            <span class='slider'></span>";
            //     // html += "          </label>";
            //     // html += "          <span class='toggle-label'>Include Pricing</span>";
            //     // html += "        </div>";

            //     // html += "        <div class='toggle-container'>";
            //     // html += "          <label class='switch'>";
            //     // html += "            <input type='checkbox' id='custpage_apptsOption' name='apptsOption' onChange=\"onToggleModuleChange('/SuiteScripts/advectus/advs_cs_print_options.js', 'onChange', this.checked)\">";
            //     // html += "            <span class='slider'></span>";
            //     // html += "          </label>";
            //     // html += "          <span class='toggle-label'>Include Appointments</span>";
            //     // html += "        </div>";

              
            //     html += "      </div>";
            //     html += "    </div>";
            //     html += "  </div>";
            //     html += "</div>";
                
            //     // JavaScript to handle the RequireJS onChange logic for each toggle
            //     html += "<script>";
            //     html += "  function onToggleModuleChange(scriptPath, functionName, isChecked) {";
            //     html += "    var rConfig = JSON.parse('{}');";
            //     html += "    rConfig['context'] = scriptPath;";
            //     html += "    var entryPointRequire = require.config(rConfig);";
            //     html += "    entryPointRequire([scriptPath], function (mod) {";
            //     html += "      if (!!window && typeof mod[functionName] === 'function') {";
            //     html += "        mod[functionName](isChecked);";
            //     html += "      }";
            //     html += "    });";
            //     html += "    return false;";
            //     html += "  }";
            //     html += "</script>";
                
            //     html += "</body>";
            //     html += "</html>";
                
                form.addSubmitButton({
                    label: "Print"
                });
				htmlfld.defaultValue=html;
			   // form.clientScriptModulePath = '/SuiteScripts/advectus/advs_cs_print_options.js';
				response.writePage(form);
			}
            else{
                // var JobF_value   = request.parameters.custpage_job;
                // var priceF_value = request.parameters.custpage_price;
                // var qty_Fvalue   = request.parameters.custpage_qty;
                // var MsgF_value     = request.parameters.custpage_msg;
                // var AuthF_value    = request.parameters.custpage_auth;
                // var AppointF_value = request.parameters.custpage_appoint;


                var webJobF_value     = request.parameters.custpage_webjob;
                var webpriceF_value   = request.parameters.custpage_webprice;
                var webqty_Fvalue     = request.parameters.custpage_webqty;
                var webMsgF_value     = request.parameters.custpage_webmsg;
                var webAuthF_value    = request.parameters.custpage_webauth;
                var webAppointF_value = request.parameters.custpage_webappoint;

                // log.debug("webJobF_value",webJobF_value )
                // log.debug("webpriceF_value",webpriceF_value )
                // log.debug("webqty_Fvalue",webqty_Fvalue )
                // log.debug("webAuthF_value",webAuthF_value )
                // log.debug("webAppointF_value",webAppointF_value )
                // log.debug("webMsgF_value",webMsgF_value )
              
                var PArabObj = {
                    // "JobF_value"      : JobF_value,
                    // "priceF_value"    : priceF_value,
                    // "qty_Fvalue"      : qty_Fvalue,
                    // "MsgF_value"      : MsgF_value,
                    // "AuthF_value"     : AuthF_value,
                    // "AppointF_value"  : AppointF_value,

                    "webJobF_value"   : webJobF_value,
                    "webpriceF_value" : webpriceF_value,
                    "webqty_Fvalue"   : webqty_Fvalue,
                    "webAuthF_value"  : webAuthF_value,
                    "webMsgF_value"   : webMsgF_value,
                    "webAppointF_value" :webAppointF_value


                };
        
                var urlop = url.resolveScript({
                    scriptId: "customscript_advs_ss_estimate_oil_charge",
                    deploymentId: "customdeploy_advs_ss_estimate_oil_charge",
                    params: PArabObj
                });

                var onclickScript = "<html><body> <script type='text/javascript'>" +
                "try{" + 
                "var salesRecUrl='" + urlop + "';" +
                "window.open(salesRecUrl, '_blank');" +  // Open in a new tab
                "window.close();" +
                "}catch(e){alert(e + '   ' + e.message);}</script></body></html>";
			response.write(onclickScript);
            }
           
        }

        return {onRequest}

    });