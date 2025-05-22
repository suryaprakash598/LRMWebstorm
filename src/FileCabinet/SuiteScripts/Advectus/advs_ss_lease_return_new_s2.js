/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
define(['N/record', 'N/runtime', 'N/search','N/ui/serverWidget','./advs_lib_rental_leasing',
    './advs_lib_util','./advs_lib_return_buyout','N/format','N/task','N/redirect'],
/**
 * @param{record} record
 * @param{runtime} runtime
 * @param{search} search
 */
(record, runtime, search,serverWidget,lib_rental,libUtil,lib_return_buyout,format,task ,redirect) => {
    /**
     * Defines the Suitelet script trigger point.
     * @param {Object} scriptContext
     * @param {ServerRequest} scriptContext.request - Incoming request
     * @param {ServerResponse} scriptContext.response - Suitelet response
     * @since 2015.2
     */
    const onRequest = (scriptContext) => {
        var Request   =   scriptContext.request;
        var Response  =   scriptContext.response;
        if(Request.method == "GET"){
            var LeaseId     = Request.parameters.recordid;
            var flag        = Request.parameters.custpara_flag;
            log.debug("flag",flag);
            var Form        = serverWidget.createForm({title: 'Lease Return'});

            var HtmlField   = Form.addField({ id: 'custpage_htmlcontent', type: serverWidget.FieldType.INLINEHTML, label: 'HTML Content'});
            var htmlContent = getHtmlContent(LeaseId);

            HtmlField.defaultValue = htmlContent;

            var LeaseField   = Form.addField({ id: 'custpage_lease_id', type: serverWidget.FieldType.INTEGER, label: 'Lease Header'});
            LeaseField.updateDisplayType({displayType: "hidden"});

            var CustomerField   = Form.addField({ id: 'custpage_customer', type: serverWidget.FieldType.SELECT, source:"customer",label: 'Lessee'});
            CustomerField.updateDisplayType({displayType: "hidden"});

            var LeaseVinField   = Form.addField({ id: 'custpage_lease_vin', type: serverWidget.FieldType.SELECT, source:"customer",label: 'Vin'});
            LeaseVinField.updateDisplayType({displayType: "hidden"});

            var FlagField   = Form.addField({ id: 'custpage_flag', type: serverWidget.FieldType.INTEGER, label: 'Flag'});
            FlagField.updateDisplayType({displayType: "hidden"});
            FlagField.defaultValue = flag;

            if(LeaseId){
                LeaseField.defaultValue = LeaseId;
                var FieldsLook = ["custrecord_advs_l_h_customer_name", "custrecord_advs_la_vin_bodyfld",];
                var LeaseObj = search.lookupFields({ type: "customrecord_advs_lease_header", id: LeaseId, columns: FieldsLook });
                CustomerField.defaultValue = LeaseObj.custrecord_advs_l_h_customer_name[0].value;
                // LeaseVinField.defaultValue = LeaseObj.custrecord_advs_la_vin_bodyfld[0].value;
                if(LeaseObj.custrecord_advs_la_vin_bodyfld[0] != undefined && LeaseObj.custrecord_advs_la_vin_bodyfld[0] != "" && LeaseObj.custrecord_advs_la_vin_bodyfld[0]!= null){
                    LeaseVinField.defaultValue = LeaseObj.custrecord_advs_la_vin_bodyfld[0].value;
                }
            }

            Form.clientScriptModulePath = "./advs_cs_lease_return_new_s.js"
            Response.writePage(Form);
        }
        else if (Request.method == 'POST') {

            var type = scriptContext.request.parameters.custparam_type;
            if(type == 1 || type == "1"){
                 try {
                    var body = JSON.parse(scriptContext.request.body);
                    var formData = body.formData;
                   log.debug("formData", formData);

                    if(formData != null ) {
                        var leaseid = formData.leaseid;
                        var customerid = formData.customerid;
                        var flag = formData.flag;
                        var SelectedType = formData.returntype;
                        var InvoiceLineData = formData.LinesData;
                        var vehicleCost = formData.vehicleCost*1;
                        log.debug("leaseid",leaseid+"---InvoiceLineData@@stringify==>"+JSON.stringify(InvoiceLineData)); 
                        log.debug("customerid",customerid+"---SelectedType==>"+SelectedType);
                        var Description , vehicleResStatus ,LeaseStatus = "" ,returntype = "";

                        if(SelectedType == 1 || SelectedType == '1'){
                            Description = "Return charges";
                            vehicleResStatus = libUtil.vmstatus.available;
                            LeaseStatus = libUtil.leaseStatus.terminated;
                            returntype = 8;
                        }
                        else if(SelectedType == 2 || SelectedType == '2'){
                            Description  = "Pay off / Buy out charges";
                            vehicleResStatus = libUtil.vmstatus.customerowned; 
                            LeaseStatus = libUtil.leaseStatus.terminated;
                          returntype = 13;
                        }
                        else if(SelectedType == 3 || SelectedType == '3'){
                            Description  = "Auction Charges";
                            vehicleResStatus = libUtil.vmstatus.customerowned; 
                            LeaseStatus = libUtil.leaseStatus.customerpurchase;
                            returntype = 9;
                        }
                        else if(SelectedType == 4 || SelectedType == '4'){
                            Description  = "Total Loss";
                            vehicleResStatus = libUtil.vmstatus.customerowned; 
                            LeaseStatus = libUtil.leaseStatus.customerpurchase;
                            returntype = 12;
                        }
						var returnInvoice = '';
                      var payoffInvoice = '';
                        var FieldsLook = ["custrecord_advs_l_h_location", "custrecord_advs_l_h_subsidiary","custrecord_advs_la_vin_bodyfld",
                            "custrecord_advs_l_h_fixed_ass_link","custrecord_advs_l_h_customer_name","custrecord_advs_l_h_depo_ince",'custrecord_advs_net_dep_'];

                        var LeaseObj = search.lookupFields({ type: "customrecord_advs_lease_header", id: leaseid, columns: FieldsLook });
                        var location    =  LeaseObj["custrecord_advs_l_h_location"][0].value;
                        var subsId      =  LeaseObj["custrecord_advs_l_h_subsidiary"][0].value;
                        var CustomerId = LeaseObj["custrecord_advs_l_h_customer_name"][0].value;
                        var vin        = LeaseObj["custrecord_advs_la_vin_bodyfld"][0].value;
                        var depositamt1        = LeaseObj["custrecord_advs_l_h_depo_ince"];
                        var depositamt        = LeaseObj["custrecord_advs_net_dep_"];
                        var FAMLink      = "";
                        if(LeaseObj["custrecord_advs_l_h_fixed_ass_link"][0] != null && LeaseObj["custrecord_advs_l_h_fixed_ass_link"][0] != undefined){
                            FAMLink      =  LeaseObj["custrecord_advs_l_h_fixed_ass_link"][0].value || "";
                        }
                       log.debug('SelectedType',SelectedType);
                        if(SelectedType == 1 || SelectedType == '1'){
							var setupData      = lib_rental.invoiceTypeSearch();
							var getInvoiceObj =createInvoiceObject(formData,CustomerId,location,subsId,InvoiceLineData,vin,leaseid,depositamt);
							returnInvoice= lib_rental.createInvoice(getInvoiceObj, setupData, libUtil);
							log.debug('returnInvoice',returnInvoice);
							 
                            var disposalObj =    lib_rental.disposefam(FAMLink,location);
							 
							
							
                        }else if(SelectedType == 2 || SelectedType == '2'){
                            var disposalObj =    lib_rental.disposeSaleFam(FAMLink,location,CustomerId);
                        }else if(SelectedType == 3 || SelectedType == '3'){
                            var disposalObj =    lib_rental.disposeSaleFam(FAMLink,location,CustomerId);
                        }else if(SelectedType == 13 || SelectedType == '13'){
                           LeaseStatus = libUtil.leaseStatus.terminated;
                            var disposalObj =    lib_rental.disposeSaleFam(FAMLink,location,CustomerId);
                          	var setupData      = lib_rental.invoiceTypeSearch();
                          	var getInvoiceObj =createInvoiceObject(formData,CustomerId,location,subsId,InvoiceLineData,vin,leaseid,depositamt);
                          payoffInvoice= lib_rental.createInvoice(getInvoiceObj, setupData, libUtil);
							log.debug('payoffInvoice',payoffInvoice);
                          if(payoffInvoice){
                            record.submitFields({type:"customrecord_advs_lease_header", id: leaseid, values: {'custrecord_payoff_invoice_link':payoffInvoice,'custrecord_advs_l_h_status':LeaseStatus} });
                          }
                        }else if(SelectedType == 4 || SelectedType == '4'){
                            
                        }

                      var postArr = [];
                      var obj = {};
                      var FeeInvoiceId = "";
                      var setupData      = lib_rental.invoiceTypeSearch();
                      
                    if(SelectedType == 1 || SelectedType == "1" ){
                        var invoiceType    = setupData[libUtil.rentalinvoiceType.lease_return]["id"];
                    }else if(SelectedType == 2 || SelectedType == '2'){
                        var invoiceType    = setupData[libUtil.rentalinvoiceType.lease_buyout]["id"];
                    }else if(SelectedType == 3 || SelectedType == '3'){
                        var invoiceType    = setupData[libUtil.rentalinvoiceType.lease_return]["id"];
                    }else{
                        
                    }
                    var tranDate       = format.parse({value: new Date(), type: format.Type.DATE });
                    var linesArr       =   [];
    
                    var othercharges = 0;
                    for(var i = 0; i < InvoiceLineData.length; i++){
                        var linesobj       =   {};
                        linesobj.item = setupData[libUtil.rentalinvoiceType.lease_return]["regularitem"];
                        linesobj.quantity= 1;
                        linesobj.rate = InvoiceLineData[i].ItemRate*1;
                        linesobj.description= InvoiceLineData[i].ItemDesc;;
                        linesobj.amount= InvoiceLineData[i].ItemRate*1;
                        linesobj.custcol_advs_st_applied_to_vin= vin;
                        linesArr.push(linesobj);
                        othercharges+= InvoiceLineData[i].ItemRate*1;
                    }
                        if(vehicleCost > 0){
                        var linesobj       =   {};
                        linesobj.item = setupData[libUtil.rentalinvoiceType.lease_buyout]["regularitem"];
                        linesobj.quantity= 1;
                        linesobj.rate = InvoiceLineData[i].vehicleCost*1;
                        linesobj.description= InvoiceLineData[i].ItemDesc;
                        linesobj.amount= InvoiceLineData[i].vehicleCost*1;
                        linesobj.custcol_advs_st_applied_to_vin= vin;
                        linesArr.push(linesobj);
                        othercharges+= InvoiceLineData[i].vehicleCost*1;
                    }
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
					try{
						 FeeInvoiceId = lib_rental.createInvoice(invoiceObj, setupData, libUtil);
					}catch(e)
					{
						log.debug('error in creating invoice',e.toString())
					}
                   

                    var famprocess  =   disposalObj.processid;
                    var famtaskid   =   disposalObj.taskid;

                    var storeObj        =   {};
                    storeObj.leaseid        =   leaseid;
                    storeObj.customerid     =   customerid;
                    storeObj.returntype     =   returntype;
                    storeObj.othercharges   =   othercharges;
                    storeObj.desc   =   Description;
                    storeObj.vehstatus   =   vehicleResStatus;
                    storeObj.leasestatus   =   LeaseStatus;
                    storeObj.fam   =   FAMLink;
                    storeObj.famprocessid   =   famprocess;
                    storeObj.famtaskid   =   famtaskid;
                    var advsTempid =      lib_rental.postforProcessFAM(storeObj);

                    obj.id = advsTempid;
                    obj.status = "success";
                    obj.message = "success";
                    postArr.push(obj);

                    var jsonData    =   JSON.stringify(postArr);
                
                var LoadRecofLease = record.load({ type:"customrecord_advs_lease_header", id:leaseid, isDynamic: true });
                LoadRecofLease.setValue({fieldId : "custrecord_advs_l_h_status",value:LeaseStatus});
                LoadRecofLease.setValue({fieldId : "custrecord_advs_l_a_ret_fee",value:othercharges});
                LoadRecofLease.setValue({fieldId : "custrecord_advs_l_h_repo_fee_invoice",value:FeeInvoiceId});
                LoadRecofLease.setValue({fieldId : "custrecord_advs_l_a_return_type",value:returntype});
                LoadRecofLease.setValue({fieldId : "custrecord_return_invoice_link",value:returnInvoice});
                var SaveLeaseId = LoadRecofLease.save({ignoreMandatoryFields: true});

                //record.submitFields({type:"customrecord_advs_vm", id: vin, values: {'custrecord_advs_vm_reservation_status':vehicleResStatus,} });

                var fieldsToUpdate = new Array();
                fieldsToUpdate["custrecord_advs_vm_reservation_status"] = vehicleResStatus
                if(SelectedType == 2 || SelectedType == '2'){
                    fieldsToUpdate["custrecord_advs_vm_customer_number"] = customerid
                }
                record.submitFields({type:"customrecord_advs_vm", id: vin, values:fieldsToUpdate });
                      
                scriptContext.response.write({output:jsonData});
                }

                }catch(e){
                    log.error('Error processing request', e.message);

                    var postArr = [];
                    var obj = {};
                    obj.id = 404;
                    obj.status = "failed";
                    obj.message = e.message;
                    postArr.push(obj);
                    var jsonData    =   JSON.stringify(postArr);

                    scriptContext.response.write({ output: jsonData });

                    var onclickScript = " <html><body> <script type='text/javascript'>" +
                    "try{" +
                    "";
                    onclickScript += "window.parent.location.reload();";
                    onclickScript+="window.parent.closePopup();";
                    onclickScript += "}catch(e){alert(e+'   '+e.message);}</script></body></html>";
        
                    Response.write(onclickScript);
                }
            }else if(type == 2 || type == "2"){
                
            }
        }
    }
	function createInvoiceObject(formData,CustomerId,location,subsId,InvoiceLineData,vin,leaseid,depositamt)
	{
		try{
			//CREATE INVOICE
 var tranDate       = format.parse({value: new Date(), type: format.Type.DATE });
                    var linesArr       =   [];
					 var othercharges = 0;
                    for(var i = 0; i < InvoiceLineData.length; i++){
                        var linesobj       =   {};
                        linesobj.item = 6117//setupData[libUtil.rentalinvoiceType.lease_return]["regularitem"];
                        linesobj.quantity= 1;
                        linesobj.rate = depositamt//InvoiceLineData[i].ItemRate*1;
                        linesobj.description= ''//InvoiceLineData[i].ItemDesc;;
                        linesobj.amount= depositamt//InvoiceLineData[i].ItemRate*1;
                        linesobj.custcol_advs_st_applied_to_vin= vin;
                        linesArr.push(linesobj);
                        othercharges+= InvoiceLineData[i].ItemRate*1;
                    }
                        // if(formData.vehicleCost > 0){
                        var linesobj       =   {};
                        linesobj.item = 6117//setupData[libUtil.rentalinvoiceType.lease_buyout]["regularitem"];
                        linesobj.quantity= 1;
                        linesobj.rate = depositamt;//InvoiceLineData[i].vehicleCost*1;
                        linesobj.description= '';//InvoiceLineData[i].ItemDesc;
                        linesobj.amount= depositamt;//InvoiceLineData[i].vehicleCost*1;
                        linesobj.custcol_advs_st_applied_to_vin= vin;
                        linesArr.push(linesobj);
                        //othercharges+= InvoiceLineData[i].vehicleCost*1;
                    // }
                    var invoiceObj = {
                        invoicebody: {
                            customer: CustomerId,
                            date: tranDate,
                            subsidiary: subsId,
                            location: location,
                            leaseid: leaseid,
                            // paylineid: paylogid,
                            invoicetype: 3,
                        },
                        linesData: linesArr
                    };
					return invoiceObj;
                    //FeeInvoiceId = lib_rental.createInvoice(invoiceObj, setupData, libUtil);
				
		}catch(e)
		{
			log.debug('errpr',e.toString());
		}
	}

    function getHtmlContent(cuRec) {

        var subsidiaryId = runtime.getCurrentUser().subsidiary;
        var logoUrl = lib_return_buyout.getSubsidiaryLogoUrl(subsidiaryId);
        var cusName,custid,coName,vin,stDate,endDate,leaseREv,purOption,deposit,deposit1,amountRemaining,total,downpayment,downpayment1;
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
                    search.createColumn({name: "custrecord_advs_net_dep_", label:"DEPOSIT INCEPTION"}),
                    search.createColumn({name: "amountremaining", label:"INVOICE",join: "custrecord_advs_l_a_down_invoie"}),
                    search.createColumn({name: "custrecord_advs_l_h_pay_incep", label: "PURCHASE OPTION"}),
                    search.createColumn({name: "custrecord_advs_l_h_terms", label: "PURCHASE OPTION"}),
                ]
        });

        customrecord_advs_lease_headerSearchObj.run().each(function(result){
            cusName          = result.getText({name: "custrecord_advs_l_h_customer_name" });
            custid           = result.getValue({name: "custrecord_advs_l_h_customer_name" });
            coName           = result.getText({name: "custrecord_advs_lease_comp_name_fa" })||'';
            vin              = result.getText({name: "custrecord_advs_la_vin_bodyfld" });
            stDate           = result.getValue({name: "custrecord_advs_l_h_start_date" });
            endDate          = result.getValue({name: "custrecord_advs_l_h_end_date" });
            downpayment1      = parseFloat(result.getValue({name: "custrecord_advs_l_h_depo_ince" }));
            downpayment      = parseFloat(result.getValue({name: "custrecord_advs_net_dep_" }));
            purOption        = parseFloat(result.getValue({name: "custrecord_advs_l_h_pur_opti" }))
            total            = parseFloat(result.getValue({name: 'total',join: 'custrecord_advs_l_a_down_invoie'}))
            deposit1          = parseFloat(result.getValue({name: "custrecord_advs_l_h_depo_ince" }))
            deposit          = parseFloat(result.getValue({name: "custrecord_advs_net_dep_" }))
            amountRemaining  = parseFloat(result.getValue({name: 'amountremaining',join: 'custrecord_advs_l_a_down_invoie'}));
            PayInception     = parseFloat(result.getValue({ name: "custrecord_advs_l_h_pay_incep" }));
            var terms        = parseFloat(result.getValue({ name: "custrecord_advs_l_h_terms" }));
			
            leaseREv     = (PayInception*terms);
            leaseREv = leaseREv*1;leaseREv=leaseREv.toFixed(2);leaseREv=leaseREv*1;

            return true;
        });
        var paidInstallment    = lib_return_buyout.getPaidInstallmentAmount(cuRec);
        var unpaidInstallment  = lib_return_buyout.getUnpaidInstAmt(cuRec);

        var amttotal                 = leaseREv + purOption + downpayment;

        var receivable_balance_due   = ((amttotal - paidInstallment - deposit) - PayInception);
        receivable_balance_due   =  receivable_balance_due*1;
		var taxratepercustomer = 0;
		if(custid){
			var taxcodecust = search.lookupFields({type:'customer',id:custid,columns:['taxitem']});
			if(taxcodecust.taxitem.length){
				var taxcode = taxcodecust.taxitem[0].value;
				log.debug('taxcode',taxcode);
				if(taxcode){
					var taxrate = search.lookupFields({type:'taxgroup',id:taxcode,columns:['rate']});
					log.debug('taxrate',taxrate);
					if(taxrate.rate){
						taxratepercustomer = taxrate.rate/100;
					}
				}
			}
			
		}
        // var salestax                 = receivable_balance_due * 0.07;
        var salestax                 = receivable_balance_due * taxratepercustomer;
        var balance_due              = (receivable_balance_due + unpaidInstallment + salestax)*1;

        var ReturnTypeList           = lib_return_buyout.returnTypeListNew();

        var htmlContent ="<!DOCTYPE html>\n" +
            CssStyle()+
            "<body>\n" +
            "<div class=\"container\">\n" +

            "    <div class=\"section\">" +
            " <h4 style='font-size:13px;'>Lessees and Vehicle</h4>\n" +
            "  <div class=\"section-content\">" + //L & V
            "        <table>\n" +
            "            <tr> <th>Lessee name:</th> <td>" + cusName + "</td></tr>\n" +
            "            <tr><th>Co-lessee name:</th><td>" + coName + "</td> </tr>\n" +
            "            <tr> <th>VIN:</th><td> " + vin + "</td></tr>\n" +
            "        </table>\n" +
            " </div>" +
            "    </div>\n" +

            "<div class=\"section\"><h4 style='font-size:13px;' >Select type and Other Charges</h4>\n" + //Type and OC
            " <div class=\"section-content\"> " +
            " <table class='secondaryinfo'>\n" +
            " <tr style='font-size: 12px; '><td align='right' >Select Type:</td> <td align='left'><select id='custpage_ret_type' name ='custpage_ret_type' required>" + ReturnTypeList +  "</select></td>\n" +
            "</tr>"+
           /*  " <tr id='hiddenRow' style='font-size: 12px; display: none;'>\n" +
            " <td align='right'>Enter Vehicle Charges:</td>\n" +
            " <td align='left'><input type='number' id='vehiclecost' name='vehiclecost' placeholder='Enter Vehicle Cost'></td>\n" +
            " </tr>\n" + */
            "  </table>\n"+

            " <div style='width: 100%; padding: 10px; background-color: #f5f5f5; border: 1px solid #ddd; border-radius: 5px;'>\n" +
            "     <h4 align='center' style='margin: 4px 2; padding: 3px; font-size: 12px; '>To Add Fees</h4>\n" +
            "     <div style='display: flex; align-items: center; gap: 15px;'>\n" +
            "         <label for='custpage_item_desc'>Description:</label>\n" +
            "         <input type='text' name='custpage_item_desc' id='custpage_item_desc' style='width: 270px; padding: 5px; border: 1px solid #ccc; border-radius: 3px;' />\n" +
            "         <label for='custpage_item_rate' >Rate:</label>\n" +
            "         <input type='number' name='custpage_item_rate' id='custpage_item_rate' style='width: 180px; padding: 5px; border: 1px solid #ccc; border-radius: 3px;' />\n" +
            "         <button type='button' style='padding: 2.5px 4px; color: white; border: none; border-radius: 1px; cursor: pointer;' onClick=\"var rConfig = JSON.parse('{}');rConfig['context'] = '/SuiteScripts/Advectus/advs_cs_lease_return_new_s.js';var entryPointRequire = require.config(rConfig);entryPointRequire(['/SuiteScripts/Advectus/advs_cs_lease_return_new_s.js'], function (mod) {if (!!window) {}mod.addLines();}); return false;\"><img src='https://8760954.app.netsuite.com/core/media/media.nl?id=25392&c=8760954&h=ZgSH5mzZa7uPjh1UaPHGrpUf9CgAjaqkoO9lGE93i1eh0KtG&fcts=20241202033344&whence=' alt='Add' style='width: 16px; height: 16px;' /></button>\n" +
            "     </div>\n" +
            "     <h4  style='margin: 4px 2; padding: 3px; font-size: 11px;'>Added Lines:</h4>\n" +
					"    <fieldset style='width: 100%; background-color: #f5f5f5; border: 1px solid #ddd; border-radius: 5px;'>\n" +
					"      <div style='font-size: 12.5px; '>\n" +
					"        <ul id='selecteddata_other' name='selecteddata_other' class='ul_class'>\n" +
					"        </ul>\n" +
					"        <input type='hidden' id='custpage_total_ul_' name='custpage_total_ul_' value=0 >\n" +
					"      </div>\n" +
					"    </fieldset>\n" +
            " </div>\n" +

            "  <div>\n" +
					
					"  </div>\n" +
            // "";


            " </div>" +
            "</div>\n" +

            " <div class=\"section\"> <h4 style='font-size:13px;' >Itemization</h4>\n" + //Itemization
            " <div class=\"section-content expanded\"> " +
            " <table class=\"itemization\">\n" +
            " <tr><td>Lease receivable</td> <td>" + leaseREv.toFixed(2)  + "</td></tr>\n" +
            " <tr><td>Non refundable deposit</td> <td>" + downpayment.toFixed(2)  + "</td></tr>\n" +
            " <tr><td>Purchase option*</td> <td>" + purOption.toFixed(2)  + "</td></tr>\n" +
            " <tr><td>Total</td><td>" + amttotal.toFixed(2)  + "</td></tr>\n" +
            "</table>\n" +
            "</div>\n" +
            "</div>\n" +

            "<div class=\"section\"><h4 style='font-size:13px;' >Balance</h4>\n" + //Balance
            " <div class=\"section-content expanded\"> " +
            "<table class=\"balance\">\n" +
            " <tr><td>Lease installments paid</td><td>" + paidInstallment.toFixed(2)  + "</td></tr>\n" +
            " <tr><td>Non refundable deposit paid*</td><td>" + deposit.toFixed(2)  + "</td></tr>\n" +
            " <tr><td>Advance lease installments paid</td><td>" + PayInception.toFixed(2)  + "</td></tr>\n" +
            " <tr><td>Lease receivable balance due</td><td>" + receivable_balance_due.toFixed(2)  + "</td></tr>\n" +
            " <tr><td>Sales tax on lease receivable balance due</td><td>" + salestax.toFixed(2)  + "</td></tr>\n" +
            " <tr><td>Unpaid lease charges</td><td>" + paidInstallment.toFixed(2)  + "</td></tr>\n" +
            " <tr><td>Total balance due</td><td>" + balance_due.toFixed(2)  + "</td></tr>\n" +
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
            "<script src=\"<script src=\"https://cdnjs.cloudflare.com/ajax/libs/extjs/6.2.0/ext-all.js\"></script>\n" +

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
          
            "</script>\n"+
            "</body>\n" +
            "</html>\n";

        return htmlContent;
    }
    function CssStyle(){
        var HtmlCss = "";

        HtmlCss+= "<!DOCTYPE html>\n" +
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
            "            padding: 8px;\n" +
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
            "        }"+

            ".secondaryinfo{" +
            "width:100%;" +
            "}"+
            ".form-row2-summary .form-wrapper {\n" +
            "    width: 50%;\n" +
            "}\n" +
            ".form-row2-summary {\n" +
            "display:flex;\n" +
            "width:100% !important;" +
            "      }\n" +
            "\n" +
            ".form-wrapper-sum {\n" +
            "    position: relative;\n" +
            "    margin-right: 25px;\n" +
            /*	"    font-size: 10pt;\n" +*/
            "\twidth:50%;\n" +
            "}\n" +
            ".form-wrapper-sum label {\n" +
            "    display: block;\n" +
            "    font-family: Calibri;\n" +
            /*"    font-size: 12pt;\n" +*/
            "    color: #4c4c4c;\n" +
            "    margin-bottom: 8px;\n" +
            "}\n" +
            ".ul_class{\n" +
            "\twidth: 100%;\n" +
            "\tfont-size:8pt;\n" +
            "\tfont-weight:bold;\n" +
            "\t}\n" +

          ".material-symbols-outlined {" +
					"" +
					"  font-variation-settings:\n" +
					"  'FILL' 0,\n" +
					"  'wght' 400,\n" +
					"  'GRAD' 0,\n" +
					"  'opsz' 20\n" +
					"}\n.summaryrem{line-height:1.4;}" +
					".secondcs{font-size:40px;}" +
					"\n" +
                    ".removelink{\n" +
					// "margin-top:3%;\n" +
					"}\n" +
					"\n" +
					".removelink-sum{\n" +
					"width:70%;" +
					"margin-top:1.5%;\n" +
					"}\n" +
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

    return {onRequest}

});