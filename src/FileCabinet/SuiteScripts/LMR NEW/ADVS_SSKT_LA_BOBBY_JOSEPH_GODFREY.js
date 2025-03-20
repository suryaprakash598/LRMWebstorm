/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
define(['N/error', 'N/task', 'N/render', 'N/file', 'N/encode', 'N/record', 'N/search', 'N/ui', 'N/ui/serverWidget', 'N/log', 'N/format', 'N/runtime', 'N/redirect', 'N/url', 'N/https', 'N/xml'],
    function (error, task, render, file, encode, record, search, ui, serverWidget, log, format, runtime, redirect, url, https, xml) {
    
    function onRequest(context) {
    
      if (context.request.method == "GET") {
    
                    var RecordId = context.request.parameters.custrecId;
                    // log.debug("rec",RecordId)
                    var RecordType = "customrecord_advs_lease_header";
    
                    var UserObj = runtime.getCurrentUser();
                    var UserId = UserObj.id;
                    var UserName = UserObj.name;
                    var UserRole = UserObj.role;
                    var UserEmail = UserObj.email;
                    var UserSubsidiary = UserObj.subsidiary;
                    var UserLocation = UserObj.location;
    
                    var form = serverWidget.createForm({ title: "LEASE AGREEMENT PDF" });
    
                    var Html = "";
                    var htmlHeader = " ";
                    var htmlFooter = " ";
                    var HTMLObj = form.addField({
                        id: "custpage_html_field",
                        label: "HTML",
                        type: serverWidget.FieldType.INLINEHTML,
                        source: null,
                        container: null
                    }); 
                    var RecObj = record.load({ type: RecordType, id: RecordId, isDynamic: true });
                    var VinNo = RecObj.getText({ fieldId: "custrecord_advs_la_vin_bodyfld" });
                    var VIN = VinNo.split("");
                    var Customer = RecObj.getText({ fieldId: "custrecord_advs_l_h_customer_name" });
                    var CustomerID = RecObj.getValue({ fieldId: "custrecord_advs_l_h_customer_name" });
                    var CustomerCompany = RecObj.getValue({ fieldId: "custrecord_advs_lease_comp_name_fa" });
                    var CustomerCompanyText = RecObj.getText({ fieldId: "custrecord_advs_lease_comp_name_fa" });
                    var SchedNoOfPayment = RecObj.getValue({ fieldId: "custrecord_advs_l_h_terms" });
                    var securityDeposit =RecObj.getValue({ fieldId:"custrecord_advs_l_h_security_dep" });
                    var date = RecObj.getValue({ fieldId: "custrecord_advs_l_h_start_date" }); 
                    var subsidiary = RecObj.getValue({ fieldId: "custrecord_advs_l_h_subsidiary" });
                    var PickUpPayment = RecObj.getValue({ fieldId: "custrecord_advs_pick_pay_fee" })*1;
                    var PickUpDate = RecObj.getValue({ fieldId: "custrecord_advs_pickup_date" });
					var FormatPickDate ='';
					if(PickUpDate!=''){
						 FormatPickDate = format.format({ value: PickUpDate, type: format.Type.DATE });
					}
                    var FormatPayDate ='';
                    var PaymentDate = RecObj.getValue({ fieldId: "custrecord_advs_paymnt_adte" });
					if(PaymentDate!=''){
						FormatPayDate = format.format({ value: PaymentDate, type: format.Type.DATE });
					}
                     

                    var SMainLogo = '';
                    if(subsidiary){
                        var SubRec	= record.load({type:"subsidiary",id:subsidiary,isDynamic:true});
                         SMainLogo 	=	SubRec.getValue({ fieldId: "logo" });
                    }
                    var startdate = format.format({ value: date, type: format.Type.DATE });
    
                    // log.error("security",securityDeposit);
                    if(SchedNoOfPayment){
                        SchedNoOfPayment = SchedNoOfPayment*1;
                    }
    
                    var RecDate = record.create({ type: "customrecord_advs_st_current_date_time", isDynamic: true });
                    var currentdate = RecDate.getValue({ fieldId: "custrecord_st_current_date" });
                    var currentdate = format.format({ value: currentdate, type: format.Type.DATE });
                  
                    var downPayment = RecObj.getValue({fieldId: "custrecord_advs_l_h_depo_ince"});
                    var PurchaseOpt = RecObj.getValue({fieldId: "custrecord_advs_l_h_pur_opti"});
                    // log.debug("PurchaseOpt", PurchaseOpt);
                    var firstPaymentDate = RecObj.getValue({fieldId : "custrecord_advs_l_a_pay_st_date"})
                    var firstPaymentValue = RecObj.getValue({fieldId : "custrecord_advs_l_h_pay_incep"})
                    var frequency=RecObj.getText({fieldId :"custrecord_advs_l_h_frequency"})
    
                    var count = 0
                    var customrecord_advs_flexi_lease_scheduleSearchObj = search.create({
                        type: "customrecord_advs_flexi_lease_schedule",
                        filters:
                        [
                            ["isinactive","is","F"],
                            "AND",
                            ["custrecord_advs_f_l_s_cnt_head","anyof",RecordId]
                        ],
                        columns:
                            [
                                search.createColumn({
                                    name: "id",
                                    sort: search.Sort.ASC,
                                    label: "ID"
                                }),
                                search.createColumn({name: "scriptid", label: "Script ID"}),
                                search.createColumn({name: "custrecord_advs_f_l_s_schedules", label: "Schedules"}),
                                search.createColumn({name: "custrecord_advs_f_l_s_amount", label: "Amount"})
                            ]
                    });
                    var searchResultCount = customrecord_advs_flexi_lease_scheduleSearchObj.runPaged().count;
                    // log.debug("customrecord_advs_flexi_lease_scheduleSearchObj result count",searchResultCount);
                    customrecord_advs_flexi_lease_scheduleSearchObj.run().each(function(result){
                        if(count > 0){
                            return false
                        }
                        firstPaymentValue = result.getValue({ name: "custrecord_advs_f_l_s_amount" });
                        count++
                        return true;
                    });
    
                    var SearchOnCustomer = search.create({
                        type: "customer",
                        filters:
                            [
                                ["internalid", "anyof", CustomerID]
                            ],
                        columns:
                            [
                                search.createColumn({name: "email", label: "Email" }),
                                search.createColumn({ name: "phone", label: "Phone" }),
                                search.createColumn({ name: "country",join: "Address",label: "Country"}),
                                search.createColumn({ name: "city", join: "Address", label: "City"}),
                                search.createColumn({  name: "countrycode", join: "Address", label: "Country Code" }),
                                search.createColumn({ name: "zipcode", join: "Address",label: "Zip Code" }),
                                search.createColumn({ name: "state", join: "Address", label: "State/Province" }),
                                search.createColumn({ name: "addressee", join: "Address", label: "Addressee"})
                            ]
                    });
                    var Email, Phone, Addressee, State, zipcode, CountryCode, City, Country;
                    SearchOnCustomer.run().each(function (result) {
    
                        Email = result.getValue({ name: "email" });
                        Phone = result.getValue({ name: "phone" });
                        Country = result.getValue({ name: "country", join: "Address"});
                        City = result.getValue({ name: "city",join: "Address"});
                        CountryCode = result.getValue({name: "countrycode",join: "Address"});
                        zipcode = result.getValue({ name: "zipcode", join: "Address"});
                        State = result.getValue({ name: "state",join: "Address" });
                        Addressee = result.getValue({name: "addressee",join: "Address" });
    
                        return true;
                    });
                    //---------------------------
                    var SearchOnCoLesseCustomer = search.create({
                        type: "customer",
                        filters:
                            [
                                ["internalid", "anyof", CustomerID]  //  CustomerCompany , we have to replace the customer here , fixed for no error
                            ],
                        columns:
                            [
                                search.createColumn({name: "email", label: "Email"}),
                                search.createColumn({ name: "phone", label: "Phone"}),
                                search.createColumn({ name: "country", join: "Address",  label: "Country" }),
                                search.createColumn({ name: "city", join: "Address", label: "City"}),
                                search.createColumn({ name: "countrycode", join: "Address", label: "Country Code" }),
                                search.createColumn({ name: "zipcode", join: "Address", label: "Zip Code" }),
                                search.createColumn({ name: "state", join: "Address",label: "State/Province" }),
                                search.createColumn({ name: "addressee", join: "Address", label: "Addressee" }),
                            ]
                    });
                    var coLesseEmail, coLessePhone, coLesseAddressee, coLesseState, coLessezipcode, coLesseCountryCode, coLesseCity, coLesseCountry;
                    SearchOnCoLesseCustomer.run().each(function (result) {
                        coLesseEmail = result.getValue({ name: "email" });
                        coLessePhone = result.getValue({ name: "phone" });
                        coLesseCountry = result.getValue({ name: "country", join: "Address"});
                        coLesseCity = result.getValue({ name: "city", join: "Address"});
                        coLesseCountryCode = result.getValue({ name: "countrycode",join: "Address" });
                        coLessezipcode = result.getValue({ name: "zipcode", join: "Address" });
                        coLesseState = result.getValue({  name: "state", join: "Address" });
                        coLesseAddressee = result.getValue({ name: "addressee", join: "Address"});
                        return true;
                    });
                    //--------------------------
    
                    var Brand = "", Model = "", Year = "", Type = "", ModelID = "";
                    var SearchOnVin = search.create({
                        type: "customrecord_advs_vm",
                        filters:
                            [
                                ["isinactive", "is", "F"],
                                "AND",
                                ["name", "is", VinNo]
                            ],
                        columns:
                            [
                                search.createColumn({ name: "custrecord_advs_vm_vehicle_brand", label: "Brand"}),
                                search.createColumn({name: "custrecord_advs_vm_model",label: "Model" }),
                                search.createColumn({ name: "custrecord_advs_vm_transmission_type", label: "Type" }),
                                search.createColumn({name: "custrecord_advs_vm_model_year",label: "ModelYear" })
                            ]
                    });
                    SearchOnVin.run().each(function (result) {
                        Brand = result.getText({ name: "custrecord_advs_vm_vehicle_brand" });
                        Model = result.getText({ name: "custrecord_advs_vm_model" });
                        ModelID = result.getValue({name: "custrecord_advs_vm_model"});
                        Type = result.getText({ name: "custrecord_advs_vm_transmission_type" });
                        Year = result.getText({ name: "custrecord_advs_vm_model_year" });
                        return true;
                    });
    
                    var ModelClr = "";
                    if(ModelID){
                        var LKflds = ['custitem_advs_model_color'];
                        var ModelLookup = search.lookupFields({type: 'serializedinventoryitem', id: ModelID, columns: LKflds});
                            ModelClr = ModelLookup.custitem_advs_model_color; 
                    }
    
                    var ImgURL = "https://7059197-sb4.app.netsuite.com/core/media/media.nl?id=25512940&c=7059197_SB4&h=a45SP1mYWpKF9gxp4YOe_GIOiiFjCrqMH5xmMJvXqJC4V9Nh";
                    var Image = xml.escape({xmlText: ImgURL});
                    var ImgFile1980  = SMainLogo || 2303;
                    var fileObj = file.load({id: ImgFile1980});
                    var Imagewith1980 = fileObj.url;
                    Imagewith1980 = xml.escape({xmlText: Imagewith1980});
    
                    htmlHeader += "<table><tr><td style='font-size:9px'>DocuSign Envelope ID:</td><td style='font-size:9px' >EED63A50-2529-4452-9BD7-290BE5BE9F4F</td></tr></table>";
    
                    htmlHeader += "<table   width='100%'>" +
                        "<tr>" +
                        "<td>" +
                        "<table  style='margin-left:20px'  align='left' height='5'>" +
                        "<tr >" +
                        " <td ><img src ='" + Imagewith1980 + "' align='center' width='240px' height='50px' margin-top='8px' alt='Logo cannot loaded'></img></td>" +
                        "</tr>" +
                        "</table>" +
                        "</td>" +
                        "<td></td>" +
                        "<td></td>" +
                        "<td>" +
                        "<table  style='font-size:8px' align='right'>" +
                        "<tr >" +
                        "<td style='padding-right:25px  padding-top: -80px; ' align='right'><b>LRM LEASING COMPANY, INC.</b></td>" +
                        "</tr>" +
                        "<tr  >" +
                        "<td style='padding-right:25px   ' align='right'>2160 Blount Road</td>" +
                        "</tr>" +
                        "<tr  >" +
                        "<td style='padding-right:25px  ' align='right'>Pompano Beach, FL 33069</td>" +
                        "</tr>" +
                        "<tr  >" +
                        "<td style='padding-right:25px  ' align='right'>954-791-1400</td>" +
                        "</tr>" +
                        "</table>" +
                        "</td>" +
                        "</tr>" +
                        "</table>";
    
                        Html += "<table style='font-size:12px' align='center' width='95%' >" +
                        "<tr>" +
                        "<td  align='center'></td>" +
                        "</tr>" +
                        "</table>";
    
                    Html += "<table align='center' width='95%' margin-top='3' >" +
                        "<tr style='font-size:11px'>" +
                        "<td  border-collapse = 'collapse' border-right ='.25' border-left ='.25' border-top ='.25'   >" +
                        "<table width='100%'>" +
                        "<tr style='font-size:9px; font-style:italic; '><td><b>LESSEE</b></td></tr>" +
                        "<tr style='font-size:9px; font-style:italic;'><td>" + Customer + "</td></tr>" +
                        "</table>" +
                        "</td>" +
                        "<td border-collapse = 'collapse'   border-right ='.25' border-top ='.25'>" +
                        "<table width='100%'  >" +
                        "<tr style='font-size:9px; font-style:italic; ' ><td><b>CO LESSEE</b></td></tr>" +
                        "<tr style='font-size:9px; font-style:italic;'><td>" + CustomerCompanyText + "</td></tr>" +
                        "</table>" +
                        "</td>" +
                        "</tr>" +
                        "<tr style='font-size:12px'>" +
                        "<td  border-collapse = 'collapse' border-right ='.25' border-left ='.25' border-top ='.25'   >" +
                        "<table width='100%'>" +
                        "<tr style='font-size:9px; font-style:italic;' ><td><b>ADDRESS</b></td></tr>" +
                        "<tr style='font-size:9px; font-style:italic;'><td>"+Addressee+"</td></tr>" +
                        "</table>" +
                        "</td>" +
                        "<td border-collapse = 'collapse'   border-right ='.25' border-top ='.25'>" +
                        "<table width='100%'  >" +
                        "<tr style='font-size:9px; font-style:italic;' ><td><b>ADDRESS</b></td></tr>" +
                        "<tr style='font-size:9px; font-style:italic;'><td>"+coLesseAddressee+"</td></tr>" +
                        "</table>" +
                        "</td>" +
                        "</tr>" +
                        "<tr style='font-size:12px'>" +
                        "<td  border-collapse = 'collapse' border-right ='.25' border-left ='.25' border-top ='.25'   >" +
                        "<table width='100%'>" +
                        "<tr style='font-size:9px; font-style:italic;' ><td><b>CITY</b></td><td><b>STATE</b></td><td><b>ZIP</b></td></tr>" +
                        "<tr style='font-size:9px; font-style:italic;'><td>"+City+"</td><td>"+State+"</td><td>"+zipcode+"</td></tr>" +
                        "</table>" +
                        "</td>" +
                        "<td border-collapse = 'collapse'   border-right ='.25' border-top ='.25'>" +
                        "<table width='100%'  >" +
                        "<tr style='font-size:9px; font-style:italic;' ><td><b>CITY</b></td><td><b>STATE</b></td><td><b>ZIP</b></td></tr>" +
                        "<tr style='font-size:9px; font-style:italic;'><td>"+coLesseCity+"</td><td>"+coLesseState+"</td><td>"+coLessezipcode+"</td></tr>" +
                        "</table>" +
                        "</td>" +
                        "</tr>" +
                        "<tr style='font-size:12px'>" +
                        "<td  border-collapse = 'collapse' border-right ='.25' border-left ='.25' border-top ='.25' border-bottom ='.25'  >" +
                        "<table width='100%'>" +
                        "<tr style='font-size:9px; font-style:italic;' ><td><b>CONTACT</b></td><td><b>PHONE CONTACT</b></td></tr>" +
                        "<tr style='font-size:9px; font-style:italic;'><td>" + Email + "</td><td>" + Phone + "</td></tr>" +
                        "</table>" +
                        "</td>" +
                        "<td border-collapse = 'collapse'   border-right ='.25' border-top ='.25' border-bottom ='.25'>" +
                        "<table width='100%'  >" +
                        "<tr style='font-size:9px; font-style:italic;' ><td><b>CONTACT</b></td><td><b>PHONE CONTACT</b></td></tr>" +
                        "<tr style='font-size:9px; font-style:italic;'><td>" + coLesseEmail + "</td><td>" + coLessePhone + "</td></tr>" +
                        "</table>" +
                        "</td>" +
                        "</tr>" +
    
                        "</table>";

                    Html += "<table style='font-size:12px' align='center' width='95%' >" +
                    "<tr>" +
                    "<td  align='center'><b>MOTOR VEHICLE LEASE AGREEMENT</b></td>" +
                    "</tr>" +
                    "</table>";
                    
                    Html += "<table style='font-size:11px; padding-top:8px;' align='center' width='95%' >" +
                    "<tr>" +
                    "<td  align='center'>Leased Vehicle or Equipment—VIN #, Serial #, or Other Iden-fica-on</td>" +
                    "</tr>" +
                    "</table>";
                    Html += "<table align='center' width='100%' style='padding-top:8px; margin-left:15px; border-collapse: collapse;'>" +
                    "<tr style='font-size:12px; width:100%; text-align:left;'>" +
                        "<td>Year:</td>" +
                        "<td style='border-bottom: 1px solid black; width: 50px;'>" + (Year || "&nbsp;") + "</td>" +
                        "<td>Make:</td>" +
                        "<td style='border-bottom: 1px solid black; width: 100px;'>" + (Brand || "&nbsp;") + "</td>" +
                        "<td>Model:</td>" +
                        "<td style='border-bottom: 1px solid black; width: 100px;'>" + (Model || "&nbsp;") + "</td>" +
                        "<td>Transmission:</td>" +
                        "<td style='border-bottom: 1px solid black; width: 120px;'>" + (Type || "&nbsp;") + "</td>" +
                        "<td>Color:</td>" +
                        "<td style='border-bottom: 1px solid black; width: 100px;'>" + (ModelClr || "&nbsp;") + "</td>" +
                    "</tr>" +
                    "</table>";

                    Html += "<table style='font-size:12px; padding-top:8px; margin-left:15px;'>" +
                        "<tr>" +
                        "<td >VEHICLE IDENTIFICATION NUMBER: </td>"+
                        "<td style='border-bottom: 1px solid black; width: 100px;'>"+VinNo+"</td>"+
                        "</tr>" +
                        "</table>";

                    Html += "<hr style='width: 100%; border: 1px solid black;' />";

                    Html += "<table align='left' width='60%' style='padding-top:5px; margin-left:15px; border-collapse: collapse;'>" +
                   "<tr style='font-size:11px;'>" +
                    "<td><b>Lease Inceptions:</b></td>" +
                    "<td></td>" +
                    "</tr>" +
                    "<tr style='font-size:9px;'>" +
                    "<td style='border-bottom: 1px solid black; width: 5px;'>$" + (downPayment || "&nbsp;") + "</td>" +
                    "<td>Non-refundable deposit <b>PLUS APPLICABLE TAXES</b></td>" +
                    "</tr>" +
                    "<tr style='font-size:10px;'>" +
                    "<td style='border-bottom: 1px solid black; width: 5px;'>$" + (firstPaymentValue || "&nbsp;") + "</td>" +
                    "<td>First Lease Payment <b>PLUS APPLICABLE TAXES</b></td>" +
                    "</tr>" +
                    "<tr style='font-size:11px;'>" +
                    "<td></td>" +
                    "<td></td>" +
                    "</tr>" +
                    "<tr style='font-size:11px;'>" +
                    "<td><b>Terms:</b></td>" +
                    "<td></td>" +
                    "</tr>" +
                    "<tr style='font-size:11px;'>" +
                    "<td style='border-bottom: 1px solid black; width: 5px;'>$</td>" +
                    "<td>Lease Payments <b>PLUS APPLICABLE TAXES</b></td>" +
                    "</tr>" +
                    "<tr style='font-size:11px;'>" +
                    "<td style='border-bottom: 1px solid black; width: 5px;'></td>" +
                    "<td>Payment Term in Months</td>" +
                    "</tr>" +
                "<tr style='font-size:11px;'>" +
                   "<td style='border-bottom: 1px solid black; width: 5px;'></td>" +
                   "<td>Next Payment Date (after Lease Inceptions) and Frequency (monthly)</td>" +
                 "</tr>" +
                "<tr style='font-size:11px;'>" +
              "<td style='border-bottom: 1px solid black; width: 5px;'>$</td>" +
                   "<td>Purchase Option <b>PLUS APPLICABLE TAXES</b></td>" +
                 "</tr>" +
                  "<tr style='font-size:11px;'>" +
          "<td style='border-bottom: 1px solid black; width: 5px;'>$</td>" +
            "<td>Return Fee <b>PLUS APPLICABLE TAXES</b></td>" +
              "</tr>" +
               "</table>";

               Html += "<table style='font-size:12px; width:100%; padding-top:8px;padding-bottom:0px; margin-left:15px;'>" +
               "<tr>" +
               "<td ><span><b>Non-refundable deposit is:</b> 1) payable at lease signing and non-refundable for any reason, 2) held for performance under the terms of this lease agreement, and does not bear any interest, 3) may be applied by lessor to any of their obliga-ons hereunder or any default, and 4) applied to lease payments for up to the number of months of the extension period, as provided herein. First Lease Payment is payable at lease signing and non-refundable for any reason.</span></td>"+
               "</tr>" +
               "</table>";

               Html += "<hr style='width: 100%; border: 1px solid black; ' />";
               
              
               Html += "<table  align='center'  width='95%' margin-top='5px' >" +
               "<tr height = '1'><td  style='font-size:10px'  align='center' ><b>LEASE</b></td></tr>" +
               "<tr>" +
               "<td style='font-size:10px' >This Motor Vehicle Lease Agreement (this “Lease”) is written in plain English as a convenience to you. References to “you” or “your” are to the Lessee. References to “us,” “we,” or “our” are to the Lessor, LRM Leasing Company Inc.<u><b> DO NOT SIGN THIS LEASE IF YOU HAVE NOT READ IT ENTIRELY AND OR DO NOT UNDERSTAND THIS LEASE.</b></u> By signing, you agree to all the terms and conditions shown on the first page hereof and the Additional Terms and Conditions set forth on the attached pages, which such Additional Terms and Conditions are hereby incorporated by reference as if fully set forth herein. You acknowledge receipt of a copy of this Lease (including the Additional Terms and Conditions).</td>"+
               "</tr>" +
               "<tr>" +
                "<td style='font-size:10px' >Lessor is leasing the Equipment to Lessee “AS-IS.” LESSEE ACKNOWLEDGES THAT LESSOR DOES NOT MANUFACTURE THE EQUIPMENT, LESSOR DOES NOT REPRESENT THE MANUFACTURER OR THE SUPPLIER (THE “VENDOR”), AND LESSEE HAS SELECTED THE EQUIPMENT AND SUPPLIER BASED UPON LESSEE’S OWN JUDGMENT. LESSOR MAKES NO WARRANTIES, EXPRESSED OR IMPLIED, NOR ANY WARRANTIES OF MERCHANTABILITY OR FITNESS FOR A PARTICULAR PURPOSE. LESSEE AGREES THAT REGARDLESS OF CAUSE, LESSOR IS NOT RESPONSIBLE FOR AND LESSEE WILL NOT MAKE ANY CLAIM AGAINST LESSOR FOR ANY DAMAGES, WHETHER CONSEQUENTIAL, DIRECT, PUNITIVE, SPECIAL, OR INDIRECT. SO LONG AS LESSEE HAS NOT SUFFERED AN EVENT OF DEFAULT, LESSOR TRANSFERS TO LESSEE FOR THE TERM OF THIS LEASE ANY WARRANTIES MADE BY THE MANUFACTURER OR SUPPLIER UNDER A SUPPLY CONTRACT. LESSEE AGREES THAT LESSOR IS NOT THE SUPPLIER OR MANUFACTURER OF THE EQUIPMENT.<b> FURTHER, LESSEE AGREES THAT THIS IS A FINANCE LEASE AS SUCH TERM IS DEFINED IN ARTICLE 2A OF THE UNIFORM COMMERCIAL CODE AND NOTWITHSTANDING ANY DETERMINATION TO THE CONTRARY, LESSOR SHALL HAVE ALL THE RIGHTS AND BENEFITS OF A LESSOR UNDER A FINANCE LEASE.</b></td>" +
               "</tr>" +
               "</table>";


               Html += "<hr style='width: 100%; border: 1px solid black;' />";
    
                   
                    //Lease Data
                    var leaseScheduleArrayData = new Array()
                    var arraydate=[]
                
                    var regalurpaymentleasedatas=search.create({
                          type:"customrecord_advs_lm_lease_card_child",
                          filters:
                          [
                            ["isinactive","is","F"],
                                "AND",
                            ["custrecord_advs_lm_lc_c_link","anyof",RecordId]
                          ],
                          columns:
                          [
                            search.createColumn({name: "custrecord_advs_lm_lc_c_narration", sort: search.Sort.ASC, label: "NARRATION"  }),
                            search.createColumn({name:"custrecord_advs_lm_lc_c_date", label: "DATE"}),
                            search.createColumn({name:"custrecord_advs_r_p_sche_pay", label: "Schedules"}),
                            search.createColumn({name:"custrecord_advs_lm_lc_c_down_paying", label: "Amount"}),
                            search.createColumn({name:"custrecord_advs_r_p_invoice", label: "INVOICE#"})
    
                          ]
                    });
                    var searchResultCount =regalurpaymentleasedatas.runPaged().count;
                    log.error("regalurpaymentleasedatas",regalurpaymentleasedatas);
    
                    regalurpaymentleasedatas.run().each(function(result){
                            var narrationNumber= result.getValue({  name: "custrecord_advs_lm_lc_c_narration", sort: search.Sort.ASC });
                            var scheduleNumber = result.getValue({  name: "custrecord_advs_r_p_sche_pay"});
                            var amount = result.getValue({  name: "custrecord_advs_lm_lc_c_down_paying"});
                            var date =result.getValue({name:"custrecord_advs_lm_lc_c_date"});
                            var invoice=result.getValue({name:"custrecord_advs_r_p_invoice"});
                            log.error("data",date)
    
                            var objdate={}
                            objdate.date=date
                            objdate.invoice=invoice
                            arraydate.push(objdate)
                            // arraydate.push(invoice)
    
                            var obj = {}
                                obj.narrationNumber = narrationNumber
                                obj.scheduleNumber = scheduleNumber
                                obj.amount = amount
                                leaseScheduleArrayData.push(obj)
                                    return true;    
                    })
                   
                   /* log.error("lease datas",leaseScheduleArrayData)
                   log.error("date",arraydate) */
    
            //     var nextpayment=arraydate
            //     function findFirstDateWithoutInvoice(data) {
            //     for (var i = 0; i < data.length; i++) {
            //    if (data[i].invoice === "") {
            //     return data[i].date;
            //     }
            //   }
            //   return null; // If no date without invoice is found
            //   }
    
            // var firstDateWithoutInvoice = findFirstDateWithoutInvoice(nextpayment);
    
            //     if (firstDateWithoutInvoice) {
            //        log.error("First date without an invoice:", firstDateWithoutInvoice);
            //             } else {
            //        log.error("No date without an invoice found.");
            //        }
    
                   
    
                    // Html += "<table style='font-size:10px' align='center' border='.25' width='95%' margin-top='5px' >" +
                    //     "<tr><td style='white-space:nowrap'>Payment Schedule(after inspection) <b>PLUS APPLICABLE SALES TAXES:</b></td></tr>" +
                    //     "<tr>" +
                    //     "<td  width='35%'> " +
                    //     "<table>";
    
                        // let startValue = 2
                        // let endValue = leaseScheduleArrayData.length
                        // let expectedEndValue = 62
    
                        // for (startValue; startValue < endValue; startValue += 12) {
                        //     // [1, 2, ... 13][0].amount
                        //     // [14, 15. .. 25][0].amount
                        //     // [26, 27, .. 37][0].amount
                        //     let totalamount = leaseScheduleArrayData.slice(startValue, startValue+11)[0].amount
                        //     Html += "<tr>"+
                        // "<td style='font-size:10px' align='left'><u>$"+totalamount+"</u></td>" +
                        // "</tr>";
                        // }
                            
                        // console.log("hi", startValue, endValue);
                        // let end = endValue;
                    //     for (startValue; startValue < expectedEndValue; startValue += 12){
                    //         Html += "<tr>"+
                    //         "<td style='font-size:10px' align='left'><u>$"+"N/A"+"</u></td>" +
                    //         "</tr>";
                    //     }
                        
                    // Html +=
                    //     "</table>" +
                    //     "</td>" +
                    //     "<td width='112%'>" +
                    //     "<table >";
    
                    // for (let i = 0; i < outputTable.length; i++) {
                    //     var currentData = outputTable[i];
                    //     var startNumber = currentData.startNumber
                    //     var endNumber = currentData.endNumber
    
                    //     Html +=
                    //         "<tr>" +
                    //         "<td style='font-size:10px' align='left'>Lease payment during months "+startNumber+ " - " + endNumber +"</td>" +
    
                    //         "</tr>";
                    //  }
                    //  Html +=
                    //  "<tr>" +   
                    //  "<td style='font-size:10px' align='left'>Lease payment during months 2- 13</td>" +
                    //  "</tr>"+
                    //  "<tr>" + 
                    //  "<td style='font-size:10px' align='left'>Lease payment during months 14- 25</td>" +
                    //  "</tr>"+
                    //  "<tr>" + 
                    //  "<td style='font-size:10px' align='left'>Lease payment during months 26- 37</td>" +
                    //  "</tr>"+
                    //  "<tr>" + 
                    //  "<td style='font-size:10px' align='left'>Lease payment during months 38- 49</td>" +
                    //  "</tr>"+
                    //  "<tr>" + 
                    //  "<td style='font-size:10px' align='left'>Lease payment during months 50- 61</td>" +
                    //  "</tr>";
    
    
                    // Html +=
                    //     "</table>" +
                    //     "</td>" +
                    //     "</tr>" +
                    //     "</table>";
    
    
                    // Html += "<table style='font-size:10px' align='center' border='.25' width='95%' margin-top='5px' >" +
                    //     "<tr><td style='white-space:nowrap'>Next Payment Date</td></tr>" +
                    //     "<tr>" +
                    //     "<td  width='25%'> " +
                    //     "<table>" +
                    //     "<tr>" +
                    //     "<td style='font-size:10px' align='left'><u>"+firstDateWithoutInvoice+"</u></td>" +
                      
                    //     "</tr>" +
                    //     "<tr>" +
                    //     "<td style='font-size:10px' align='left'><u>"+frequency+"</u></td>" +
                    //     "</tr>" +
    
                    //     "</table>" +
                    //     "</td>" +
                    //     "<td width='95%' >" +
                    //     "<table>" +
                    //     "<tr>" +
                    //     "<td style='font-size:10px' align='left'>Next Payment Date(after inspections)</td>" +
                    //     "</tr>" +
                    //     "<tr>" +
                    //     "<td style='font-size:10px' align='left'>Payment Frequency (monthly or semi-monthly)</td>" +
                    //     "</tr>" +
    
                    //     "</table>" +
                    //     "</td>" +
                    //     "</tr>" +
                    //     "</table>";
    
                    // Html += "<table style='font-size:10px' align='center' border='.25' width='95%' margin-top='5px' >" +
                    //     "<tr><td align='left'>Purchase option price:  $ <u> <b>"+PurchaseOpt+" </b> </u></td><td style='font-size:10px' align='left'></td></tr>" +
                        
                    //     "</table>";
    
                    
    
                    Html += "<table align='center' width='95%' margin-top='10' >" +
                        "<tr style='font-size:12px'>" +
                        "<td  border-collapse = 'collapse' border-right ='.25' border-left ='.25' border-top ='.25'   >" +
                        "<table width='100%'>" +
                        "<tr style='font-size:9px;font-style:italic;' ><td><b>LESSEE (Authorized Agent or as Individual) &amp; Co-Signer</b></td></tr>" +
                        "<tr style='font-size:9px;font-style:italic;'><td>" + Customer + "</td></tr>" +
                        "</table>" +
                        "</td>" +
                        "<td border-collapse = 'collapse'   border-right ='.25' border-top ='.25'>" +
                        "<table width='100%'  >" +
                        "<tr style='font-size:9px;font-style:italic;' ><td><b>LESSOR</b></td></tr>" +
                        "<tr><td></td></tr>" +
                        "</table>" +
                        "</td>" +
                        "</tr>" +
    
                        "<tr style='font-size:12px'>" +
                        "<td  border-collapse = 'collapse' border-right ='.25' border-left ='.25' border-top ='.25'   border-bottom ='.25' >" +
                        "<table width='100%'>" +
                        "<tr style='font-size:8px;font-style:italic;' ><td><b>SIGNATURE (Lessee &amp; Co-Signer)</b></td><td><b>Title</b></td><td><b>Date</b></td></tr>" +
                        "<tr><td style='font-size:4.7px;font-style:italic;' padding-top='-5px'>DocuSignedBy:</td><td style='font-size:10px'></td><td style='font-size:10px;font-style:italic; '>" + currentdate + "</td></tr>" +
                        // "<tr><td style='font-size:10px'>Godfrey</td><td></td><td></td></tr>" +
                        "</table>" +
                        "</td>" +
                        "<td  border-collapse = 'collapse' border-right ='.25' border-left ='.25' border-top ='.25' border-bottom ='.25'   >" +
                        "<table width='100%'>" +
                        "<tr style='font-size:8px;font-style:italic;' ><td><b>SIGNATURE</b></td><td><b>Title</b></td><td><b>Date</b></td></tr>" +
                        "<tr><td style='font-size:4.7px;font-style:italic;' padding-top='-5px'>DocuSignedBy:</td><td style='font-size:10px'></td><td style='font-size:10px; font-style:italic;'>" + currentdate + "</td></tr>" +
                        // "<tr><td style='font-size:10px'>Matt</td><td></td><td></td></tr>" +
                        "</table>" +
                        "</td>" +
                        "</tr>" +
    
                        "<tr style='font-size:5px; font-style:italic;'>" +
                        "<td><table><tr><td>O0dDCGTI578Mk..</td></tr></table></td>" +
                        "<td><table><tr><td>N47DCGTI578Mk</td></tr></table></td>" +
                        "</tr>" +
    
                        "</table>";
    
                    // style = 'font-family: sans-serif'
                    // style = 'font-family: Arial'
                    // ------------------------------------------------------------------------//
    
                    Html += "<table style='font-size:13px' align='center' width='95%' >" +
                        "<tr>" +
                        "<td  align='center'><b>LIMITED POWER OF ATTORNEY</b></td>" +
                        "</tr>" +
                        "</table>";
    
                    Html += "<table style='font-size:13px' align='center' width='95%' padding-top='20'>" +
                        "<tr>" +
                        "<td><u>" + Customer + "</u> (the “Principal”), does hereby appoint <b>LRM LEASING COMPANY, INC.,</b> as its true and lawful Attorney-In-Fact (“Attorney-In-Fact”) relating solely to that certain Equipment Lease between the Principal and Attorney-In-Fact (the “Lease”).</td>" +
                        "</tr>" +
                        "<tr>" +
                        "<td><b>Lessee hereby irrevocably appoints Lessor as Lessee's attorney-in-fact to make claim for, receive payment of and execute and endorse all documents, checks or drafts received in payment for loss or damage under any such insurance policy.</b></td>" +
                        "</tr>" +
                        "</table>";
    
                  
                   Html += "<table style='font-size:11px' align='center' width='95%' padding-top='20' >" +
                   "<tr>" +
                   "<td  align='center'>Leased Vehicle or Equipment—VIN #, Serial #, or Other Iden-fica-on</td>" +
                   "</tr>" +
                   "</table>";
                   Html += "<table align='center' width='100%' style='padding-top:8px; margin-left:15px; border-collapse: collapse;'>" +
                   "<tr style='font-size:12px; width:100%; text-align:left;'>" +
                       "<td>Year:</td>" +
                       "<td style='border-bottom: 1px solid black; width: 50px;'>" + (Year || "&nbsp;") + "</td>" +
                       "<td>Make:</td>" +
                       "<td style='border-bottom: 1px solid black; width: 100px;'>" + (Brand || "&nbsp;") + "</td>" +
                       "<td>Model:</td>" +
                       "<td style='border-bottom: 1px solid black; width: 100px;'>" + (Model || "&nbsp;") + "</td>" +
                       "<td>Transmission:</td>" +
                       "<td style='border-bottom: 1px solid black; width: 120px;'>" + (Type || "&nbsp;") + "</td>" +
                       "<td>Color:</td>" +
                       "<td style='border-bottom: 1px solid black; width: 100px;'>" + (ModelClr || "&nbsp;") + "</td>" +
                   "</tr>" +
                   "</table>";
    
                   //**************** */
                   Html += "<table style='font-size:12px; padding-top:8px; margin-left:15px;'>" +
                        "<tr>" +
                        "<td >VEHICLE IDENTIFICATION NUMBER: </td>"+
                        "<td style='border-bottom: 1px solid black; width: 100px;'>"+VinNo+"</td>"+
                        "</tr>" +
                        "</table>";

                    Html += "<hr style='width: 100%; border: 1px solid black;' />";
    
                  
                    
                    Html += "<table style='font-size:12px' align='center' width='95%' padding-top='20px'>" +
                        "<tr>" +
                        "<td>Further, the Principal does ratify and confirm all actions authorized hereunder that its Attorney-In-Fact shall do or cause to be done by virtue of this Power of Attorney. Except as for the power herein stated, the Principal does not authorize its Attorney-In-Fact to act for any other purpose.</td>" +
                        "</tr>" +
                        "</table>";
    
                    Html += "<table style='font-size:12px' align='center' width='95%' padding-top='10px'>" +
                        "<tr>" +
                        "<td>Third parties may rely upon the representations of the Attorney-In-Fact as to all matters relating to the power granted hereunder, and no person who may act in reliance upon the representations of the Attorney-In-Fact shall incur any liability to the Principal as a result of permitting the Attorney-In-Fact to exercise the stated power</td>" +
                        "</tr>" +
                        "</table>";
    
                    Html += "<table style='font-size:12px' align='center' width='95%' padding-top='10px'>" +
                        "<tr>" +
                        "<td>IN WITNESS WHEREOF, the Principal has hereunto executed and delivered this Power of Attorney this date of <u>" + currentdate + "</u></td>" +
                        "</tr>" +
                        "</table>";
    
                    Html += "<table style='font-size:12px' align='center' width='95%' padding-top='10px'>" +
                        "<tr align='left'><td>Name : <u> " + Customer + "</u></td></tr>" +
                        "</table>";
    
                    Html += "<table style='font-size:12px' align='center' width='95%' padding-top='10px'>" +
                        "<tr align='left'><td>State Of : <u>"+City+"</u></td></tr>" +
                        "</table>";
    
                    Html += "<table style='font-size:12px' align='center' width='95%' padding-top='10px'>" +
                        "<tr align='left'><td>Country Of : <u>"+Country+"</u></td></tr>" +
                        "</table>";
    
                    Html += "<table style='font-size:12px' align='center' width='95%' padding-top='10px'>" +
                        "<tr><td>On Date:<u>" + currentdate + "</u>, before me, the undersigned, personally appeared <u>" + Customer + "</u> , personally known to me or proved to me on the basis of satisfactory evidence to be the individual(s) whose name(s) is (are) subscribed to the within instrument and acknowledged to me that he/she/they executed the same in his/her/their capacity(ies), that by his/her/their signature(s) on the instrument, the individual(s), or the person upon behalf of which the individual(s) acted, executed the instrument, and that such individual made such appearance before the undersigned in the City of_____________,State of Florida.</td></tr>" +
                        "</table>";
    
                    Html += "<table style='font-size:12px' align='center' width='95%' padding-top='10px'><tr><td>________________</td></tr></table>" +
                        "<table style='font-size:12px' align='center' width='95%' ><tr><td> Notary Public Signature</td></tr></table>";
    
                    Html += "<table style='font-size:12px' align='center' width='95%' padding-top='10px'><tr><td>________________</td></tr></table>" +
                        "<table style='font-size:12px' align='center' width='95%' ><tr><td> Printed Name</td></tr></table>";
    
    
                    //page break//
                    Html += "<p style='page-break-after: always;'>&nbsp;</p>"
    
    
                    Html += "<table style='font-size:13px' align='center' width='95%' >" +
                        "<tr>" +
                        "<td  align='center'><b>PERMISSION TO REGISTRATION</b></td>" +
                        "</tr>" +
                        "</table>";
    
                    Html += "<table style='font-size:12px' align='left' width='95%' padding-top='10px' margin-left='20px'><tr><td>Date: ________________</td></tr></table>";
    
                    Html += "<table style='font-size:13px' align='center' width='50%'>" +
                    "<tr>" +
                    "<td align='center' style='color:red; background-color:yellow;'><mark><b>*Do not register in LRM Leasing Company Inc.'s name*</b></mark></td>" +
                    "</tr>" +
                    "</table>";
            
                    Html += "<table style='font-size:13px' align='center' width='95%' padding-top='20px'>" +
                        "<tr>" +
                        "<td> This letter authorizes the lessee,<u>" + Customer + "AND OR" + CustomerCompany + "</u>to register the following vehicle.</td>" +
                        "</tr>" +
                        "</table>";
    
                   //********************************* */
                   
                   Html += "<table style='font-size:11px' align='center' width='95%' >" +
                   "<tr>" +
                   "<td  align='center'>Leased Vehicle or Equipment—VIN #, Serial #, or Other Iden-fica-on</td>" +
                   "</tr>" +
                   "</table>";
                   Html += "<table align='center' width='100%' style='padding-top:8px; margin-left:15px; border-collapse: collapse;'>" +
                   "<tr style='font-size:12px; width:100%; text-align:left;'>" +
                       "<td>Year:</td>" +
                       "<td style='border-bottom: 1px solid black; width: 50px;'>" + (Year || "&nbsp;") + "</td>" +
                       "<td>Make:</td>" +
                       "<td style='border-bottom: 1px solid black; width: 100px;'>" + (Brand || "&nbsp;") + "</td>" +
                       "<td>Model:</td>" +
                       "<td style='border-bottom: 1px solid black; width: 100px;'>" + (Model || "&nbsp;") + "</td>" +
                       "<td>Transmission:</td>" +
                       "<td style='border-bottom: 1px solid black; width: 120px;'>" + (Type || "&nbsp;") + "</td>" +
                       "<td>Color:</td>" +
                       "<td style='border-bottom: 1px solid black; width: 100px;'>" + (ModelClr || "&nbsp;") + "</td>" +
                   "</tr>" +
                   "</table>";
    
                   //**************** */
                   Html += "<table style='font-size:12px; padding-top:8px; margin-left:15px;'>" +
                        "<tr>" +
                        "<td >VEHICLE IDENTIFICATION NUMBER: </td>"+
                        "<td style='border-bottom: 1px solid black; width: 100px;'>"+VinNo+"</td>"+
                        "</tr>" +
                        "</table>";

                    Html += "<hr style='width: 100%; border: 1px solid black;' />";
                   
    
                    Html += "<table style='font-size:13px' align='center' width='95%' padding-top='90px'>" +
                        "<tr>" +
                        "<td> <b><u> LRM Leasing Company Inc. must always remain as the sole registered owner of the title.</u></b></td>" +
                        "</tr>" +
                        "</table>";
    
                    Html += "<table style='font-size:13px' align='center' width='95%' padding-top='20px'>" +
                        "<tr>" +
                        "<td>If you have any questions, please do not hesitate to call LRM Leasing at the above phone number.</td>" +
                        "</tr>" +
                        "</table>";
                    Html += "<table style='font-size:13px' align='center' width='95%' padding-top='20px'>" +
                        "<tr>" +
                        "<td>Regards,</td>" +
                        "</tr>" +
                        "</table>";
    
                    Html += "<table  align='center' width='95%' padding-top='20px'>" +
                        "<tr>" +
                        "<td style='font-size:5px'>DocuSignedBy</td>" +
                        "</tr>" +
                        "<tr>" +
                        "<td>______________</td>" +
                        "</tr>" +
                        "<tr>" +
                        "<td style='font-size:5px'>8fBABF55SHDBH675Kj</td>" +
                        "</tr>" +
                        "</table>";
    
    
                    Html += "<table style='font-size:13px' align='center' width='95%' padding-top='35px'>" +
                        "<tr>" +
                        "<td>LRM Leasing Company</td>" +
                        "</tr>" +
                        "</table>";
    
                    //page break///
                    Html += "<p style='page-break-after: always;'>&nbsp;</p>"
    
    
                    Html += "<table style='font-size:13px' align='center' width='95%' >" +
                        "<tr>" +
                        "<td  align='center'><b>GUARANTY</b></td>" +
                        "</tr>" +
                        "</table>";
    
                    Html += "<table style='font-size:13px' align='center' width='95%' padding-top='20px'>" +
                        "<tr>" +
                        "<td> THE UNDERSIGNED GUARANTORS (WHETHER ONE OR MORE, THE “GUARANTORS”) GIVE THIS GUARANTY IN " +
                        "ORDER TO INDUCE LRM LEASING COMPANY, INC. (TOGETHER WITH ITS SUCCESSORS AND ASSIGNS REFERRED " +
                        "TO AS “LESSOR”) TO ENTER INTO THIS LEASE WITH LESSEE. GUARANTORS, JOINTLY AND SEVERALLY, " +
                        "PERSONALLY GUARANTY AND UNCONDITIONALLY GUARANTEE THE FULL AND PROMPT PERFORMANCE AND " +
                        "DISCHARGE OF ALL PRESENT AND FUTURE OBLIGATIONS, WHETHER FOR PAYMENT OR PERFORMANCE, " +
                        "OWED OR TO BE PERFORMED BY THE LESSEE UNDER THIS LEASE. GUARANTORS AGREE THAT LESSOR MAY " +
                        "EXTEND, TRANSFER AND AMEND THE LEASE AND GUARANTORS AGREE TO BE BOUND BY ALL SUCH CHANGES " +
                        "WHICH SHALL BE ALL BE SUBJECT TO THE TERMS OF THIS GUARANTY. GUARANTORS WILL PAY UPON " +
                        "DEMAND AND REIMBURSE LESSOR FOR ALL THE EXPENSES INCURRED IN ENFORCING ANY OF ITS RIGHTS " +
                        "AGAINST THE LESSEE, EQUIPMENT OR THE GUARANTORS, INCLUDING ATTORNEY'S FEES AND COURT COSTS. " +
                        "EACH GUARANTOR WAIVE ALL SURETYSHIP DEFENSES, NOTICES, INCLUDING NOTICES OF TRANSFER, " +
                        "DEMAND AND DEFAULT. GUARANTORS AGREE THAT LESSOR MAY PROCEED AGAINST ONE GUARANTOR OR " +
                        "ALL GUARANTORS DIRECTLY AND SEPARATELY FROM THE LESSEE AND THE EQUIPMENT, OR ANY OTHER " +
                        "GUARANTOR. ALL OBLIGATIONS HEREUNDER SHALL BE JOINT AND SEVERAL. GUARANTORS AUTHORIZE YOU " +
                        "OR YOUR DESIGNEE TO USE MY CONSUMER CREDIT REPORTS FROM TIME TO TIME IN ITS CREDIT " +
                        "EVALUATION AND COLLECTION PROCESSES. GUARANTORS CONSENT TO SUIT IN THE COURTS OF THE STATE " +
                        "OF BROWARD COUNTY, FLORIDA AND TO THE EXTENT PERMITTED BY APPLICABLE LAW, GUARANTORS " +
                        "WAIVE TRIAL BY JURY. THIS GUARANTY SHALL BE GOVERNED BY THE LAWS OF FLORIDA.</td>" +
                        "</tr>" +
                        "</table>";
    
    
                    Html += "<table align='center' width='95%' margin-top='10' >" +
                        "<tr style='font-size:12px'>" +
                        "<td  border-collapse = 'collapse' border-right ='.25' border-left ='.25' border-top ='.25'   >" +
                        "<table width='100%'>" +
                        "<tr style='font-size:9px;font-style:italic;' ><td>Guarantor Signature</td></tr>" +
                        "<tr><td>________________</td></tr>" +
                        "</table>" +
                        "</td>" +
                        "<td border-collapse = 'collapse'   border-right ='.25' border-top ='.25'>" +
                        "<table width='100%'  >" +
                        "<tr style='font-size:9px;font-style:italic;' ><td>Guarantor Signature</td></tr>" +
                        "<tr><td>________________</td></tr>" +
                        "</table>" +
                        "</td>" +
                        "</tr>" +
    
                        "<tr style='font-size:12px'>" +
                        "<td  border-collapse = 'collapse' border-right ='.25' border-left ='.25' border-top ='.25'   border-bottom ='.25' >" +
                        "<table width='100%'>" +
                        "<tr style='font-size:8px;font-style:italic;' ><td>Guarantor Print Name</td><td>Date</td></tr>" +
                        "<tr><td>" + Customer + "</td></tr>" +
                        "<tr><td style='font-size:4.7px' padding-top='-5px'></td><td style='font-size:10px'>" + currentdate + "</td></tr>" +
                        "<tr><td style='font-size:4.7px' padding-top='-75px'>DocuSignedBy:</td><td style='font-size:10px'></td></tr>" +
                        "<tr><td style='font-size:4.7px' padding-top='-45px'>OCD46Gdgv9876gHf</td><td style='font-size:10px'></td></tr>" +
                        "</table>" +
                        "</td>" +
                        "<td  border-collapse = 'collapse' border-right ='.25' border-left ='.25' border-top ='.25' border-bottom ='.25'   >" +
                        "<table width='100%'>" +
                        "<tr style='font-size:8px;font-style:italic;' ><td>Guarantor Print Name</td><td>Date</td></tr>" +
                        "<tr><td></td></tr>" +
                        "<tr><td style='font-size:4.7px' padding-top='-5px'></td><td style='font-size:10px'>" + currentdate + "</td></tr>" +
    
                        "</table>" +
                        "</td>" +
                        "</tr>" +
                        "</table>";
    
                    //page break///
                    Html += "<p style='page-break-after: always;'>&nbsp;</p>"
    
    
                    Html += "<table style='font-size:14px' align='center' width='95%' padding-bottom='20px' >" +
                        "<tr>" +
                        "<td  align='center'><b>ADDITIONAL TERMS AND CONDITIONS</b></td>" +
                        "</tr>" +
                        "</table>";
    
                    var LRMLASearchObj = search.create({
                        type: "customrecord_advs_lrm_leasing_tnc",
                        filters:
                            [
                                ["isinactive", "is", "F"]
                            ],
                        columns:
                            [
                                search.createColumn({ name: "custrecord_advs_heading", label: "HEADING"}),
                                search.createColumn({ name: "custrecord_advs_data", label: "DATA" }),
                                search.createColumn({ name: "internalid", label: "INTERNALID", sort: search.Sort.ASC }),
                            ]
                    });
                    var count = 1;
                    LRMLASearchObj.run().each(function (result) {
                        var Heading = result.getValue({ name: "custrecord_advs_heading" });
                        var Data = result.getValue({ name: "custrecord_advs_data" });
                        //data flow additional terms and condition>>
                        Html += "<table style='font-size:12px' align='center' width='90%'  >" +
                            "<tr>" +
                            "<td >" + count + ". <b>" + Heading + "</b>" + " " + Data + "</td>" +
                            "</tr>" +
                            "</table>";
                        count++;
                        return true;
                    });
    
    
                    //page break///
                    Html += "<p style='page-break-after: always;'>&nbsp;</p>"
    
    
                    Html += "<table style='font-size:13px' align='center' width='95%' >" +
                        "<tr>" +
                        "<td  align='center'><b>APPENDIX A</b></td>" +
                        "</tr>" +
                        "</table>";
    
                    Html += "<table style='font-size:13px' align='center' width='95%' padding-top='10px' >" +
                        "<tr>" +
                        "<td  align='center'><b>Approved Domiciled and Registration States</b></td>" +
                        "</tr>" +
                        "</table>";
    
                    Html += "<table style='font-size:12px' align='center' width='95%' >" +
                        "<tr>" +
                        "<td >" +
                        "These are the current approved States that you may possess a valid driver's license in or that you may register the Equipment.This list can only be " +
                        "edited and approved from time to time by LRM Leasing Company, Inc.in writing." +
                        "</td>" +
                        "</tr>" +
                        "</table>";
    
                    Html += "<table style='font-size:12px' align='center' width='95%' padding-top='2' >" +
                        "<tr>" +
                        "<td  padding-left='30'><ul>" +
                        "<li>Alabama</li>" +
                        "<li>Arkansas</li>" +
                        "<li>Delaware</li>" +
                        "<li>Florida</li>" +
                        "<li>Georgia</li>" +
                        "<li>Illinois</li>" +
                        "<li>Indiana</li>" +
                        "<li>Iowa **</li>" +
                        "<li>Kansas</li>" +
                        "<li>Kentucky</li>" +
                        "<li>Maryland</li>" +
                        "<li>Minnesota</li>" +
                        "<li>Mississippi</li>" +
                        "<li>Missouri</li>" +
                        "<li>Michigan</li>" +
                        "<li>Nebraska</li>" +
                        "<li>New Jersey</li>" +
                        "<li>New York</li>" +
                        "<li>North Carolina</li>" +
                        "<li>Ohio</li>" +
                        "<li>Oklahoma</li>" +
                        "<li>Pennsylvania</li>" +
                        "<li>South Carolina</li>" +
                        "<li>Tennessee</li>" +
                        "<li>Texas **</li>" +
                        "<li>Virginia</li>" +
                        "<li>West Virginia</li>" +
                        "<li>Wisconsin</li>" +
                        "</ul></td>" +
                        "</tr>" +
                        "</table>";
    
                    Html += "<table style='font-size:12px' align='center' width='95%' padding-top='5' >" +
                        "<tr>" +
                        "<td >" +
                        "In the event Lessee changes its Address during the term of the Agreement, Lessee must provide Lessor with written notice of " +
                        "Lessee's new driver's license Address(state / city / zip code) within thirty(30) days of the effective date of the change.If your new " +
                        "address or registration provided is not in one of the approved states above, your lease will be in default and subject to the terms " +
                        "referenced in Section 14 of the Additional Terms &amp; Conditions, arising from Lessor's ownership and / or Lessee's use, possession or " +
                        "control of the Equipment. " +
                        "</td>"+
                        "</tr>"+
                        "<tr style='font-size:12px' align='center' width='95%' padding-top='5'>"+
                        "<td>"+
                        "** If your driver's license address is domiciled in either Iowa or Texas, you must provide the Lessor verifiable proof of the States you " +
                        "have driven in on each one - year anniversary from the commencement of your lease.A $250 administrative fee will be imposed on " +
                        "your account for each month the information is not provided to the lessor." +
                        "</td>" +
                        "</tr>" +
                        "</table>";
    
    
                        Html += "<table style='font-size:13px;font-style:italic;' align='center' width='95%' padding-top='30px'>" +
                        "<tr>" +
                            "<td style='font-size:7px' border-left='.25' border-right='.25' border-top='.25'><b>LESSEE (Authorized Agent or as Individual) &amp; Co-Signer PRINT NAME</b></td>" +
                        "</tr>" +
                        "<tr>" +
                            "<td style='font-size:11px' border-left='.25' border-right='.25'>" + Customer + "</td>" +
                        "</tr>" +
                        "<tr>" +
                            "<td style='font-size:7px' border-left='.25' border-right='.25' border-top='.25'><b>LESSEE (Authorized Agent or as Individual) &amp; Co-Signer SIGNATURE</b></td>" +
                        "</tr>" +
                        "<tr height='14'>" +
                            "<td style='font-size:11px' border-left='.25' border-right='.25'></td>" +
                        "</tr>" +
                        "<tr>" +
                            "<td style='font-size:8px' border-left='.25' border-right='.25' border-top='.25'>" +
                                "<table width='100%' style='border-collapse:collapse;'>" +
                                    "<tr>" +
                                        "<td style='font-size:7px; text-align:left; width:50%;'><b>TITLE</b></td>" +
                                        "<td style='font-size:7px; text-align:right; width:50%;'><b>DATE</b></td>" +
                                    "</tr>" +
                                "</table>" +
                            "</td>" +
                        "</tr>" +
                        "<tr>" +
                            "<td style='font-size:11px' border-left='.25' border-right='.25' border-bottom='.25'>" +
                                "<table width='100%' style='border-collapse:collapse;'>" +
                                    "<tr>" +
                                        "<td style='font-size:11px; text-align:left; width:50%;'></td>" +
                                        "<td style='font-size:11px; text-align:right; width:50%; padding-right:10px;'>" + currentdate + "</td>" +
                                    "</tr>" +
                                "</table>" +
                            "</td>" +
                        "</tr>" +
                    "</table>";
                    
    
                    //page break///
                    Html += "<p style='page-break-after: always;'>&nbsp;</p>"
    
    
                    Html += "<table style='font-size:13px' align='center' width='95%' >" +
                        "<tr>" +
                        "<td  align='center'><b>APPENDIX B</b></td>" +
                        "</tr>" +
                        "</table>";

                        Html += "<table style='font-size:14px' align='center' width='95%' padding-top='10px' >" +
                        "<tr>" +
                        "<td  align='center'><b>MINIMUM MAINTENANCE REQUIREMENTS</b></td>" +
                        "</tr>" +
                        "</table>";
    
                        Html += "<table style='font-size:12px; text-align:justify; width:95%; padding-top:5px;' align='center'>" +
                        "<tr style='padding-top:10px'>" +
                        "<td>Regularly and properly maintaining your leased vehicle is the best way to protect the Lessee's investment and is essential to your safety and is required under the terms of this lease agreement.</td>" +
                        "</tr>" +
                        "<tr style='padding-top:10px'>" +
                        "<td>_____ Lessee will always maintain the truck in good working order and condition and will make all the necessary repairs to maintain the truck in safe working condition.</td>" +
                        "</tr>" +
                        "<tr style='padding-top:10px'>" +
                        "<td>_____ At Lessee’s expense, you will have the truck serviced in accordance with LRM Leasing’s minimum requirement listed below or as modified by LRM Leasing.</td>" +
                        "</tr>" +
                        "<tr style='padding-top:10px'>" +
                        "<td>_____ You will be responsible to provide proof that such services have been performed by emailing all receipts and records to Maintenance@LRMLeasing.com.</td>" +
                        "</tr>" +
                        "<tr style='padding-top:px'>" +
                        "<td>_____ LRM Leasing may request detailed records from time to time at their own discretion. If records are not provided within 72 hours of request or if the Lessee doesn’t comply with these terms, provide the necessary documentation, and/or meet the minimum maintenance guidelines set below; this will result in a default under the Lease Agreement and the Company will enforce a physical inspection of the Equipment at one of the Company’s designated facilities.</td>" +
                        "</tr>" +
                        "</table>";
                    
    
                   
    
                        Html += "<table style='font-size:13px; width:95%; margin-top:20px;' align='center'>" +
                        "<tr>" +
                        "<td style='text-align:left;'><b>Oil change:</b></td>" +
                        "</tr>" +
                        "</table>";
                    
                    Html += "<table style='font-size:13px; text-align:left; width:95%; margin-bottom:20px;' align='center'>" +
                        "<tr>" +
                        "<td>" +
                        "<ul style='margin: 0; padding-left: 20px;'>" +
                        "<li>Oil change must be done every 13,000 miles or less, and must be performed at a verifiable truck stop or truck repair facility.</li>" +
                        "</ul>" +
                        "</td>" +
                        "</tr>" +
                        "</table>";
                    
                    Html += "<table style='font-size:13px; width:95%; margin-bottom:10px;' align='center'>" +
                        "<tr>" +
                        "<td><b>6 months - these services are to be performed every 6 months or less:</b></td>" +
                        "</tr>" +
                        "</table>";
                    
                    Html += "<table style='font-size:13px; text-align:left; width:95%; margin-bottom:10px;' align='center'>" +
                        "<tr>" +
                        "<td>" +
                        "<ul style='margin: 0; padding-left: 20px;'>" +
                        "<li>Replace engine air filter</li>" +
                        "<li>Replace cabin air filter</li>" +
                        "</ul>" +
                        "</td>" +
                        "</tr>" +
                        "</table>";
                    
                    Html += "<table style='font-size:13px; width:95%; margin-bottom:10px;' align='center'>" +
                        "<tr>" +
                        "<td><b>12 months - these services are to be performed every 12 months or less:</b></td>" +
                        "</tr>" +
                        "</table>";
                    
                    Html += "<table style='font-size:13px; text-align:left; width:95%; margin-bottom:10px;' align='center'>" +
                        "<tr>" +
                        "<td>" +
                        "<ul style='margin: 0; padding-left: 20px;'>" +
                        "<li>Replace air filter cartridge on the air system compressor</li>" +
                        "<li>Replace DEF pump filter</li>" +
                        "<li>Replace crankcase filter</li>" +
                        "<li>Clean diesel particulate (DPF) filters</li>" +
                        "</ul>" +
                        "</td>" +
                        "</tr>" +
                        "</table>";
                    
    
                    Html += "<table style='font-size:13px' align='left' width='65%' padding-top='5px' padding-left='20px'>" +
                        "<tr>" +
                        "<td style='background-color:yellow; width:65%;' align='left' ><b>Water is always FORBIDDEN to be used in place of coolant and or antifreeze</b></td>" +
                        "</tr>" +
                        "</table>";
    
                    Html += "<table style='font-size:13px' align='center' width='95%' padding-top='20px'>" +
                        "<tr>" +
                        "<td>By signing below, I acknowledge that I have reviewed the Minimum Maintenance Requirements. I understand that by not adhering to these requirements that I will be in default of the Lease Agreement as referenced in Section 14 of the Additional Terms &amp; Conditions. Any Violation of the above can result in the negation of the signed Purchase Option.</td>" +
                        "</tr>" +
                        "</table>";
    
                        Html += "<table style='font-size:13px;font-style:italic;' align='center' width='95%' padding-top='30px'>" +
                        "<tr>" +
                            "<td style='font-size:7px' border-left='.25' border-right='.25' border-top='.25'><b>LESSEE (Authorized Agent or as Individual) &amp; Co-Signer PRINT NAME</b></td>" +
                        "</tr>" +
                        "<tr>" +
                            "<td style='font-size:11px' border-left='.25' border-right='.25'>" + Customer + "</td>" +
                        "</tr>" +
                        "<tr>" +
                            "<td style='font-size:7px' border-left='.25' border-right='.25' border-top='.25'><b>LESSEE (Authorized Agent or as Individual) &amp; Co-Signer SIGNATURE</b></td>" +
                        "</tr>" +
                        "<tr height='14'>" +
                            "<td style='font-size:11px' border-left='.25' border-right='.25'></td>" +
                        "</tr>" +
                        "<tr>" +
                            "<td style='font-size:8px' border-left='.25' border-right='.25' border-top='.25'>" +
                                "<table width='100%' style='border-collapse:collapse;'>" +
                                    "<tr>" +
                                        "<td style='font-size:7px; text-align:left; width:50%;'><b>TITLE</b></td>" +
                                        "<td style='font-size:7px; text-align:right; width:50%;'><b>DATE</b></td>" +
                                    "</tr>" +
                                "</table>" +
                            "</td>" +
                        "</tr>" +
                        "<tr>" +
                            "<td style='font-size:11px' border-left='.25' border-right='.25' border-bottom='.25'>" +
                                "<table width='100%' style='border-collapse:collapse;'>" +
                                    "<tr>" +
                                        "<td style='font-size:11px; text-align:left; width:50%;'></td>" +
                                        "<td style='font-size:11px; text-align:right; width:50%; padding-right:10px;'>" + currentdate + "</td>" +
                                    "</tr>" +
                                "</table>" +
                            "</td>" +
                        "</tr>" +
                    "</table>";
                    
    
                    //page break///
                    Html += "<p style='page-break-after: always;'>&nbsp;</p>"
    
                    Html += "<table style='font-size:13px' align='center' width='95%' >" +
                        "<tr>" +
                        "<td  align='center'><b>APPENDIX C</b></td>" +
                        "</tr>" +
                        "</table>";
    
                    Html += "<table style='font-size:14px' align='center' width='95%' padding-top='10px' >" +
                        "<tr>" +
                        "<td  align='center'><b>72 HOUR EXCHANGE POLICY</b></td>" +
                        "</tr>" +
                        "</table>";
    
                    Html += "<table style='font-size:13px' align='center' width='95%' padding-top='20px'>" +
                        "<tr>" +
                        "<td>If you are not happy with the truck you can exchange the truck for a truck of same or lesser value. In order to take advantage of our 72 Hour Exchange policy, the vehicle must:</td>" +
                        "</tr>" +
                        "</table>";
    
                    Html += "<table style='font-size:13px' align='center' width='95%' padding-top='10px' padding-left='20px'>" +
                        "<tr>" +
                        "<td><ul>" +
                        "<li>Be returned to LRM Leasing within three calendar days of delivery (day you take delivery is considered day one)</li>" +
                        "</ul></td>" +
                        "</tr>" +
                        
                        "<tr>" +
                        "<td><ul>" +
                        "<li>Have less than 1,000 miles on the odometer from the time of lease</li>" +
                        "</ul></td>" +
                        "</tr>" +
                        
                        "</table>";
    
    
                    Html += "<table style='font-size:13px' align='center' width='95%' padding-top='20px'>" +
                        "<tr>" +
                        "<td>" +
                       "Exchanges must be made by 4:00 PM eastern standard time on or before the third calendar day. If the third"+
                       "calendar day is a Saturday, Sunday, holiday, or a day that LRM is not open, you must return the vehicle by"+
                       "10:00 AM eastern standard time the following business day."+
                        "</td>" +
                        "</tr>"+
                        "<tr>" +
                        "<td>" +
                      "Vehicles with any damage or modification from the original delivery date will be ineligible for exchange. The"+
                       "vehicle must be returned to the location the customer originally took the delivery from. Any type of fraud or"+
                       "illegal activity on behalf of the consumer renders the LRM Leasing Exchange Policy null and void. Accessories"+
                       "of any kind shall remain with and a part of the motor vehicle. If a vehicle of greater value is desired for the"+
                        "exchange, the customer is responsible for paying additional costs. Please note this is not a refund policy, but a"+
"                        vehicle exchange policy."+
                        "</td>" +
                        "</tr>"+

                        "</table>";
                        Html += "<table style='font-size:13px;font-style:italic;' align='center' width='95%' padding-top='30px'>" +
                        "<tr>" +
                            "<td style='font-size:7px' border-left='.25' border-right='.25' border-top='.25'><b>LESSEE (Authorized Agent or as Individual) &amp; Co-Signer PRINT NAME</b></td>" +
                        "</tr>" +
                        "<tr>" +
                            "<td style='font-size:11px' border-left='.25' border-right='.25'>" + Customer + "</td>" +
                        "</tr>" +
                        "<tr>" +
                            "<td style='font-size:7px' border-left='.25' border-right='.25' border-top='.25'><b>LESSEE (Authorized Agent or as Individual) &amp; Co-Signer SIGNATURE</b></td>" +
                        "</tr>" +
                        "<tr height='14'>" +
                            "<td style='font-size:11px' border-left='.25' border-right='.25'></td>" +
                        "</tr>" +
                        "<tr>" +
                            "<td style='font-size:8px' border-left='.25' border-right='.25' border-top='.25'>" +
                                "<table width='100%' style='border-collapse:collapse;'>" +
                                    "<tr>" +
                                        "<td style='font-size:7px; text-align:left; width:50%;'><b>TITLE</b></td>" +
                                        "<td style='font-size:7px; text-align:right; width:50%;'><b>DATE</b></td>" +
                                    "</tr>" +
                                "</table>" +
                            "</td>" +
                        "</tr>" +
                        "<tr>" +
                            "<td style='font-size:11px' border-left='.25' border-right='.25' border-bottom='.25'>" +
                                "<table width='100%' style='border-collapse:collapse;'>" +
                                    "<tr>" +
                                        "<td style='font-size:11px; text-align:left; width:50%;'></td>" +
                                        "<td style='font-size:11px; text-align:right; width:50%; padding-right:10px;'>" + currentdate + "</td>" +
                                    "</tr>" +
                                "</table>" +
                            "</td>" +
                        "</tr>" +
                    "</table>";
                    
    
                    //page break///
                    Html += "<p style='page-break-after: always;'>&nbsp;</p>"
    
    
                    Html += "<table style='font-size:13px' align='center' width='95%' >" +
                        "<tr>" +
                        "<td  align='center'><b>APPENDIX D</b></td>" +
                        "</tr>" +
                        "</table>";
    
    
                    Html += "<table style='font-size:14px' align='center' width='95%' padding-top='10px' >" +
                        "<tr>" +
                        "<td  align='center'><b>SALES, USE, PROPERTY, AND OTHER TAXES</b></td>" +
                        "</tr>" +
                        "</table>";
    
                    Html += "<table style='font-size:13px' align='center' width='95%' padding-top='20px'>" +
                        "<tr>" +
                        "<td>" +
                        "Lessee understands and acknowledges Lessor may be obligated by a governmental body (e.g. by law, " +
                        "regulation or ordinance) to charge, collect, remit and/or periodically report applicable state and/or local taxes " +
                        "and fees (Taxes), as referenced in Section 7 of the Additional Terms &amp; Conditions, arising from Lessor's " +
                        "ownership and/or Lessee's use, possession or control of the Equipment. Lessor may determine tax and fee " +
                        "obligations by reference to Lessee's state/city/zip code (Address), as set forth and disclosed by Lessee in the " +
                        "Motor Vehicle Lease Agreement. Lessee understands Lessor may charge Lessee Taxes on Lease Payments and " +
                        "all other payments by reference to the Address, as the location where the Equipment is regularly garaged. " +
                        "Lessee further acknowledges that the Lessor will rely on their current driver's license address (city, state, and " +
                        "zip code) for the garaged location of the Equipment. Lessee understands and acknowledges Lessee's sole " +
                        "responsibility for timely and properly notifying Lessor of any applicable exemption from Taxes due on the " +
                        "Equipment Lease Payments and other payments. If Lessee fails to timely notify Lessor of a claim to an " +
                        "exemption from Taxes, or if Lessor, in its sole discretion, rejects Lessee's claim to an exemption from " +
                        "applicable Taxes, Lessor will charge Taxes to Lessee on Lease Payments and all other Payments and Lessee " +
                        "must make payment to Lessee of those Taxes. In the event Lessee changes its Address during the term of the " +
                        "Agreement, Lessee must provide Lessor with written notice of Lessee's new Address (state/city/zip code) " +
                        "within thirty (30) days of the effective date of the change." +
                        "</td>" +
                        "</tr>" +
                        "</table>";
    
    
                        Html += "<table style='font-size:13px;font-style:italic;' align='center' width='95%' padding-top='30px'>" +
                        "<tr>" +
                            "<td style='font-size:7px' border-left='.25' border-right='.25' border-top='.25'><b>LESSEE (Authorized Agent or as Individual) &amp; Co-Signer PRINT NAME</b></td>" +
                        "</tr>" +
                        "<tr>" +
                            "<td style='font-size:11px' border-left='.25' border-right='.25'>" + Customer + "</td>" +
                        "</tr>" +
                        "<tr>" +
                            "<td style='font-size:7px' border-left='.25' border-right='.25' border-top='.25'><b>LESSEE (Authorized Agent or as Individual) &amp; Co-Signer SIGNATURE</b></td>" +
                        "</tr>" +
                        "<tr height='14'>" +
                            "<td style='font-size:11px' border-left='.25' border-right='.25'></td>" +
                        "</tr>" +
                        "<tr>" +
                            "<td style='font-size:8px' border-left='.25' border-right='.25' border-top='.25'>" +
                                "<table width='100%' style='border-collapse:collapse;'>" +
                                    "<tr>" +
                                        "<td style='font-size:7px; text-align:left; width:50%;'><b>TITLE</b></td>" +
                                        "<td style='font-size:7px; text-align:right; width:50%;'><b>DATE</b></td>" +
                                    "</tr>" +
                                "</table>" +
                            "</td>" +
                        "</tr>" +
                        "<tr>" +
                            "<td style='font-size:11px' border-left='.25' border-right='.25' border-bottom='.25'>" +
                                "<table width='100%' style='border-collapse:collapse;'>" +
                                    "<tr>" +
                                        "<td style='font-size:11px; text-align:left; width:50%;'></td>" +
                                        "<td style='font-size:11px; text-align:right; width:50%; padding-right:10px;'>" + currentdate + "</td>" +
                                    "</tr>" +
                                "</table>" +
                            "</td>" +
                        "</tr>" +
                    "</table>";
                    
    
                    //page break///
                    Html += "<p style='page-break-after: always;'>&nbsp;</p>"
    
                    Html += "<table style='font-size:13px' align='center' width='95%' >" +
                        "<tr>" +
                        "<td  align='center'><b>APPENDIX E</b></td>" +
                        "</tr>" +
                        "</table>";
    
                    Html += "<table style='font-size:14px' align='center' width='95%' padding-top='10px' >" +
                        "<tr>" +
                        "<td  align='center'><b>LIMITED POWER OF ATTORNEY</b></td>" +
                        "</tr>" +
                        "</table>";
    
                    Html += "<table style='font-size:13px' align='center' width='95%' padding-top='20px'>" +
                        "<tr>" +
                        "<td>" +
                        "<u>" + Customer + "</u>(the “Principal”), does hereby appoint LRM LEASING COMPANY, INC., as its true and lawful Attorney-In-Fact " +
                        "(“Attorney-In-Fact”) relating solely to that certain Equipment Lease between the Principal and Attorney-In-Fact (the “Lease”) for " +
                        "which Attorney-In-Fact is authorized to transfer, assign, or sign on my behalf any liability, including tolls and fines, that are addressed " +
                        "to the LRM LEASING COMPANY INC. The Appointment as Attorney-In-Fact extends solely to the execution of all required documents " +
                        "with the state and provincial government agencies necessary for the above action, as required by law. Any term not defined herein " +
                        "shall have the same definition as in the Lease. " +
                        "Further, the Principal does ratify and confirm all actions authorized hereunder that its Attorney-In-Fact shall do or cause to be done " +
                        "by virtue of this Power of Attorney. Except as for the power herein stated, the Principal does not authorize its Attorney-In-Fact to act " +
                        "for any other purpose. " +
                        "Third parties may rely upon the representations of the Attorney-In-Fact as to all matters relating to the power granted hereunder, " +
                        "and no person who may act in reliance upon the representations of the Attorney-In-Fact shall incur any liability to the Principal as a " +
                        "result of permitting the Attorney-In-Fact to exercise the stated power. " +
                        "This Power of Attorney will expire upon the earlier of (i) the removal of the Principal from the Equipment's registration or (ii) the " +
                        "purchase of the Equipment by the Principal from Attorney-In-Fact." +
                        "</td>" +
                        "</tr>" +
                        "</table>";
    
    
                    Html += "<table style='font-size:13px' align='center' width='95%' padding-top='20px'>" +
                        "<tr>" +
                        "<td> IN WITNESS WHEREOF, the Principal has hereunto executed and delivered this Power of Attorney this Date:<u>" + currentdate + "</u></td>" +
                        "</tr>" +
                        "</table>";
    
                    Html += "<table style='font-size:12px' align='center' width='95%' padding-top='10px'>" +
                        "<tr align='left'><td>Name : __________________</td></tr>" +
                        "</table>";
    
                    Html += "<table style='font-size:12px' align='center' width='95%' padding-top='10px'>" +
                        "<tr align='left'><td>State Of : <u>"+City+"</u></td></tr>" +
                        "</table>";
    
                    Html += "<table style='font-size:12px' align='center' width='95%' padding-top='10px'>" +
                        "<tr align='left'><td>Country Of : <u>"+Country+"</u></td></tr>" +
                        "</table>";
    
    
                    Html += "<table style='font-size:12px' align='center' width='95%' padding-top='10px'>" +
                        "<tr><td>" +
                        "On Date: <u>" + currentdate + "</u>in the year 202_, before me, the undersigned, personally appeared <u>" + Customer + "</u> " +
                        ", personally known to me or proved to me on the basis of satisfactory evidence to be the individual(s) whose name(s) is (are) " +
                        "subscribed to the within instrument and acknowledged to me that he/she/they executed the same in his/her/their capacity(ies), that " +
                        "by his/her/their signature(s) on the instrument, the individual(s), or the person upon behalf of which the individual(s) acted, " +
                        "executed the instrument, and that such individual made such appearance before the undersigned in the City of ____________ " +
                        ", State of Florida." +
                        "</td></tr>" +
                        "</table>";
    
                    Html += "<table style='font-size:12px' align='center' width='95%' padding-top='10px'><tr><td>________________</td></tr></table>" +
                        "<table style='font-size:12px' align='center' width='95%' ><tr><td> Notary Public Signature</td></tr></table>";
    
                    Html += "<table style='font-size:12px' align='center' width='95%' padding-top='10px'><tr><td>________________</td></tr></table>" +
                        "<table style='font-size:12px' align='center' width='95%' ><tr><td> Printed Name</td></tr></table>";
    
                    //page break///
                    Html += "<p style='page-break-after: always;'>&nbsp;</p>"
    
                    Html += "<table style='font-size:13px' align='center' width='95%' >" +
                        "<tr>" +
                        "<td  align='center'><b>APPENDIX F</b></td>" +
                        "</tr>" +
                        "</table>";
    
                    Html += "<table style='font-size:14px' align='center' width='95%' padding-top='10px' >" +
                        "<tr>" +
                        "<td  align='center'><b>MEMORANDUM OF UNDERSTANDING</b></td>" +
                        "</tr>" +
                        "</table>";
    
                    Html += "<table style='font-size:13px' align='center' width='95%' padding-top='10px'>" +
                        "<tr><td>" +
                        "I,<u>" + Customer + "</u>, fully understand and accept my obligations as spelled out in the lease " +
                        "agreement that I signed. I understand that violating any of the following four conditions will result in " +
                        "losing the leased vehicle and my Nonrefundable Deposit. " +
                        "</td></tr>" +
                        "</table>";
    
                    Html += "<table style='font-size:13px' align='center' width='95%' padding-top='30px' padding-left='30'>" +
                        "<tr><td>" +
                        "1) Have sufficient funds in my bank account for the monthly automatic withdrawal of my " +
                        "lease payment and any other fees due and payable as contained in my Vehicle Motor Lease " +
                        "Agreement.<br/><br/> " +
                        "2) Pay my insurance without any lapsed period of time while always providing 1 million dollar liability " +
                        "coverage with LRM Leasing Company Inc.as the additional insured and physical damage insured " +
                        "at actual cash value with a deductible not to exceed $1,000 with LRM Leasing Company Inc.as " +
                        "the loss payee.<br/><br/> " +
                        "3) Maintain the leased vehicle in good running condition at my expense.I understand that breakdowns " +
                        "are not an acceptable excuse for untimely due Lease Payments.<br/><br/> " +
                        "4) Any fees and or taxes, referenced in section 7 of the terms and conditions, accrued on my account " +
                        "will be satisfied first with any payment you make before being applied to your lease payment<br/><br/> " +
                        "5) Failure to communicate.I must always maintain communication.I must return LRM's phone " +
                        "calls in a timely manner.<br/><br/>" +
                        "</td></tr>" +
                        "</table>";
    
                    Html += "<table style='font-size:13px' align='center' width='95%' padding-top='30px'>" +
                        "<tr><td>" +
                        "Any Violation of the above can result in the negation of the signed Purchase Option and your lease will be in default and subject to the terms referenced in Section 14 of the Additional Terms &amp; Conditions. " +
                        "</td></tr>" +
                        "</table>";
    
                        Html += "<table style='font-size:13px;font-style:italic;' align='center' width='95%' padding-top='30px'>" +
                        "<tr>" +
                            "<td style='font-size:7px' border-left='.25' border-right='.25' border-top='.25'><b>LESSEE (Authorized Agent or as Individual) &amp; Co-Signer PRINT NAME</b></td>" +
                        "</tr>" +
                        "<tr>" +
                            "<td style='font-size:11px' border-left='.25' border-right='.25'>" + Customer + "</td>" +
                        "</tr>" +
                        "<tr>" +
                            "<td style='font-size:7px' border-left='.25' border-right='.25' border-top='.25'><b>LESSEE (Authorized Agent or as Individual) &amp; Co-Signer SIGNATURE</b></td>" +
                        "</tr>" +
                        "<tr height='14'>" +
                            "<td style='font-size:11px' border-left='.25' border-right='.25'></td>" +
                        "</tr>" +
                        "<tr>" +
                            "<td style='font-size:8px' border-left='.25' border-right='.25' border-top='.25'>" +
                                "<table width='100%' style='border-collapse:collapse;'>" +
                                    "<tr>" +
                                        "<td style='font-size:7px; text-align:left; width:50%;'><b>TITLE</b></td>" +
                                        "<td style='font-size:7px; text-align:right; width:50%;'><b>DATE</b></td>" +
                                    "</tr>" +
                                "</table>" +
                            "</td>" +
                        "</tr>" +
                        "<tr>" +
                            "<td style='font-size:11px' border-left='.25' border-right='.25' border-bottom='.25'>" +
                                "<table width='100%' style='border-collapse:collapse;'>" +
                                    "<tr>" +
                                        "<td style='font-size:11px; text-align:left; width:50%;'></td>" +
                                        "<td style='font-size:11px; text-align:right; width:50%; padding-right:10px;'>" + currentdate + "</td>" +
                                    "</tr>" +
                                "</table>" +
                            "</td>" +
                        "</tr>" +
                    "</table>";
                    //page break///
                    Html += "<p style='page-break-after: always;'>&nbsp;</p>";
    
    
                    Html += "<table style='font-size:13px' align='center' width='95%' >" +
                        "<tr>" +
                        "<td  align='center'><b>APPENDIX G</b></td>" +
                        "</tr>" +
                        "</table>";
    
    
                    Html += "<table style='font-size:14px' align='center' width='95%' padding-top='10px' >" +
                        "<tr>" +
                        "<td  align='center'><b>EQUIPMENT REGISTRATION</b></td>" +
                        "</tr>" +
                        "</table>";
    
                    Html += "<table style='font-size:14px' align='center' width='95%' padding-top='8px' >" +
                        "<tr>" +
                        "<td  align='center'><b>Do not register this vehicle in LRM Leasing's name.</b></td>" +
                        "</tr>" +
                        "</table>";
    
                    Html += "<table style='font-size:14px' align='center' width='95%' padding-top='10px' >" +
                        "<tr>" +
                        "<td  align='center'><b>Vehicle can only be registered in your name!</b></td>" +
                        "</tr>" +
                        "</table>";
    
                    Html += "<table style='font-size:14px' align='center' width='95%' padding-top='10px' >" +
                        "<tr>" +
                        "<td ><b><u>REGISTRATION REQUIREMENTS</u></b></td>" +
                        "</tr>" +
                        "</table>";
    
                    Html += "<table style='font-size:14px' align='center' width='95%' padding-top='10px' padding-left='20px' >" +
                        "<tr>" +
                        "<td ><ol>" +
                        "<li>Upon delivery of your truck and or trailer you are required to provide us with a copy of your registration " +
                        "within 30 days and within 30 days of a registration renewal.</li> " +
                        "<li>Equipment MUST be registered in LESSEE'S NAME at all time. At no time can the registration be in LRM " +
                        "Leasing's name. THERE ARE NO EXCEPTIONS</li>" +
                        "</ol></td>" +
                        "</tr>" +
                        "</table>";
    
    
                    Html += "<table style='font-size:14px' align='center' width='95%' padding-top='20px' >" +
                        "<tr>" +
                        "<td ><b><u>REGISTRATION PENALTIES</u></b></td>" +
                        "</tr>" +
                        "</table>";
    
                    Html += "<table style='font-size:14px' align='center' width='95%' padding-top='10px' padding-left='20px' >" +
                        "<tr>" +
                        "<td  >" +
                        "A $250 ADMINISTRATIVE FEE WILL BE IMPOSED ON YOUR ACCOUNT AND YOU WILL BE CONSIDERED IN" +
                        " IMMEDIATE DEFAULT SHOULD YOU: <br/>" +
                        "<ol>" +
                        "<li>REGISTER THE VEHICLE IN LRM LEASING'S NAME; or </li>" +
                        "<li>NOT PROVIDE ACTIVE REGISTRATION WITHIN 30 DAYS OF ITS EXPIRATION DATE.</li>" +
                        "</ol>" +
                        "THE $250 ADMINISTRATIVE FEE WILL CONTINUE TO BE IMPOSED EVERY 30 DAYS UNTIL YOU RESOLVE EITHER OF THE ABOVE DEFAULTS.<br/><br/>" +
                        "You may contact us via email, physical mailing address or telephone.Please email:<br/>" +
                        "<u>Registration @lrmleasing.com</u>" +
                        "</td>" +
                        "</tr>" +
                        "</table>";
    
                    Html += "<table padding-left='30px'>" +
                        "<tr>" +
                        "<td>" +
                        "Address:" +
                        "</td>" +
                        "<td>" +
                        "LRM Leasing Company, Inc.<br/>" +
                        "2160 Blount Road<br/>" +
                        "Pompano Beach, FL 33069<br/>" +
                        "</td>" +
                        "</tr>" +
                        "</table>";
    
                    Html += "<table style='font-size:14px' align='center' width='95%' padding-top='10px' >" +
                        "<tr>" +
                        "<td  >" +
                        "LRM Leasing will provide lessee with required documentation at the time of delivery or shortly after." +
                        "</td>" +
                        "</tr>" +
                        "</table>";
    
                    Html += "<table style='font-size:14px' align='center' width='95%' padding-top='10px' >" +
                        "<tr>" +
                        "<td  ><b>LRM Leasing is NOT responsible or obligated to assist lessee with their registration process and lessee acknowledges that it is their sole responsibility.X________</b></td>" +
                        "</tr>" +
                        "<tr>" +
                        "<td style='font-size:4px' padding-top='-18' padding-left='250' align='left'>DS</td>" +
                        "</tr>" +
                        "</table>";
    
                        Html += "<table style='font-size:13px;font-style:italic;' align='center' width='95%' padding-top='30px'>" +
                        "<tr>" +
                            "<td style='font-size:7px' border-left='.25' border-right='.25' border-top='.25'><b>LESSEE (Authorized Agent or as Individual) &amp; Co-Signer PRINT NAME</b></td>" +
                        "</tr>" +
                        "<tr>" +
                            "<td style='font-size:11px' border-left='.25' border-right='.25'>" + Customer + "</td>" +
                        "</tr>" +
                        "<tr>" +
                            "<td style='font-size:7px' border-left='.25' border-right='.25' border-top='.25'><b>LESSEE (Authorized Agent or as Individual) &amp; Co-Signer SIGNATURE</b></td>" +
                        "</tr>" +
                        "<tr height='14'>" +
                            "<td style='font-size:11px' border-left='.25' border-right='.25'></td>" +
                        "</tr>" +
                        "<tr>" +
                            "<td style='font-size:8px' border-left='.25' border-right='.25' border-top='.25'>" +
                                "<table width='100%' style='border-collapse:collapse;'>" +
                                    "<tr>" +
                                        "<td style='font-size:7px; text-align:left; width:50%;'><b>TITLE</b></td>" +
                                        "<td style='font-size:7px; text-align:right; width:50%;'><b>DATE</b></td>" +
                                    "</tr>" +
                                "</table>" +
                            "</td>" +
                        "</tr>" +
                        "<tr>" +
                            "<td style='font-size:11px' border-left='.25' border-right='.25' border-bottom='.25'>" +
                                "<table width='100%' style='border-collapse:collapse;'>" +
                                    "<tr>" +
                                        "<td style='font-size:11px; text-align:left; width:50%;'></td>" +
                                        "<td style='font-size:11px; text-align:right; width:50%; padding-right:10px;'>" + currentdate + "</td>" +
                                    "</tr>" +
                                "</table>" +
                            "</td>" +
                        "</tr>" +
                    "</table>";
    
                    //page break///
                    Html += "<p style='page-break-after: always;'>&nbsp;</p>";
    
    
                    Html += "<table style='font-size:13px' align='center' width='95%' >" +
                        "<tr>" +
                        "<td  align='center'><b>APPENDIX H</b></td>" +
                        "</tr>" +
                        "</table>";
    
                    Html += "<table style='font-size:14px' align='center' width='95%' padding-top='10px' >" +
                        "<tr>" +
                        "<td  align='center'><b>INSURANCE REQUIREMENTS</b></td>" +
                        "</tr>" +
                        "</table>";
    
                    Html += "<table style='font-size:14px' align='center' width='95%' padding-top='10px' >" +
                        "<tr>" +
                        "<td  align='left'><b><u>If you have your OWN AUTHORITY:</u></b></td>" +
                        "</tr>" +
                        "</table>";
    
                    Html += "<table style='font-size:14px' align='center' width='95%' padding-top='10px' padding-left='20px' >" +
                        "<tr>" +
                        "<td ><ul>" +
                        "<li>Combined Single Limit of $1,000,000 Auto Liability Policy with LRM Leasing being listed as additional insured.</li>" +
                        "<li> Physical Damage coverage with TrueNorth Companies of Cedar Rapids, IA for not less than the actual cash value or full replacement cost of the Equipment without consideration for depreciation with LRM Leasing being listed as loss payee.</li>" +
                        "<li>Deductible is not to exceed $1,000</li>" +
                        "<li>We need 30 - day cancellation notice for non - payment or changes made to policy.</li>" +
                        "</ul></td>" +
                        "</tr>" +
                        "</table>";
    
                    Html += "<table style='font-size:14px' align='center' width='95%' padding-top='10px' >" +
                        "<tr>" +
                        "<td  align='left'><b><u>If you are working for a company:</u></b></td>" +
                        "</tr>" +
                        "</table>";
    
                    Html += "<table style='font-size:14px' align='center' width='95%' padding-top='10px' padding-left='20px' >" +
                        "<tr>" +
                        "<td ><ul>" +
                        "<li>Non-Trucking Liability Policy TrueNorth Companies of Cedar Rapids, IA of Combined Single Limit of $1,000,000 with LRM Leasing being listed as additional insured.</li>" +
                        "<li>Physical Damage coverage TrueNorth Companies of Cedar Rapids, IA for not less than the actual cash value or full replacement cost of the Equipment without consideration for depreciation with LRM Leasing being listed as loss payee, with such policy being issued by or through True North Companies.</li>" +
                        "<li>Deductible is not to exceed $1,000</li>" +
                        "<li>We need 30-day cancellation notice for non-payment or changes made to policy.</li>" +
                        "</ul></td>" +
                        "</tr>" +
                        "</table>";
    
                    Html += "<table style='font-size:14px' align='center' width='95%' padding-top='10px' >" +
                        "<tr>" +
                        "<td  align='left'><b><u>Additional Insured and Loss Payee Information:</u></b></td>" +
                        "</tr>" +
                        "</table>";
    
                    Html += "<table padding-top='20px' padding-left='40px'>" +
                        "<tr>" +
                        "<td>" +
                        "LRM Leasing <br/>" +
                        "2160 Blount Road<br/>" +
                        "Pompano Beach, FL 33069<br/>" +
                        "</td>" +
                        "</tr>" +
                        "</table>";
    
                    Html += "<table style='font-size:14px' align='center' width='95%' padding-top='10px' >" +
                        "<tr>" +
                        "<td  align='left'><b><u>IMPORTANT</u></b></td>" +
                        "</tr>" +
                        "</table>";
                    Html += "<table style='font-size:14px' align='center' width='95%' padding-top='10px' >" +
                        "<tr>" +
                        "<td  align='left'>IF YOU DO NOT HAVE YOUR OWN AUTHORITY YOU ARE REQUIRED TO HAVE THIRD PARTY INSURANCE AT ALL TIMES!<b><u> WE WILL NOT ACCEPT INSURANCE FOR THE COMPANY YOU ARE WORKING FOR!</u></b> <br/><br/>Any Violation of the above can result in the negation of the signed Purchase Option.</td>" +
                        "</tr>" +
                        "</table>";
    
                        Html += "<table style='font-size:13px;font-style:italic;' align='center' width='95%' padding-top='30px'>" +
                        "<tr>" +
                            "<td style='font-size:7px' border-left='.25' border-right='.25' border-top='.25'><b>LESSEE (Authorized Agent or as Individual) &amp; Co-Signer PRINT NAME</b></td>" +
                        "</tr>" +
                        "<tr>" +
                            "<td style='font-size:11px' border-left='.25' border-right='.25'>" + Customer + "</td>" +
                        "</tr>" +
                        "<tr>" +
                            "<td style='font-size:7px' border-left='.25' border-right='.25' border-top='.25'><b>LESSEE (Authorized Agent or as Individual) &amp; Co-Signer SIGNATURE</b></td>" +
                        "</tr>" +
                        "<tr height='14'>" +
                            "<td style='font-size:11px' border-left='.25' border-right='.25'></td>" +
                        "</tr>" +
                        "<tr>" +
                            "<td style='font-size:8px' border-left='.25' border-right='.25' border-top='.25'>" +
                                "<table width='100%' style='border-collapse:collapse;'>" +
                                    "<tr>" +
                                        "<td style='font-size:7px; text-align:left; width:50%;'><b>TITLE</b></td>" +
                                        "<td style='font-size:7px; text-align:right; width:50%;'><b>DATE</b></td>" +
                                    "</tr>" +
                                "</table>" +
                            "</td>" +
                        "</tr>" +
                        "<tr>" +
                            "<td style='font-size:11px' border-left='.25' border-right='.25' border-bottom='.25'>" +
                                "<table width='100%' style='border-collapse:collapse;'>" +
                                    "<tr>" +
                                        "<td style='font-size:11px; text-align:left; width:50%;'></td>" +
                                        "<td style='font-size:11px; text-align:right; width:50%; padding-right:10px;'>" + currentdate + "</td>" +
                                    "</tr>" +
                                "</table>" +
                            "</td>" +
                        "</tr>" +
                    "</table>";
    
                    //page break///
                    Html += "<p style='page-break-after: always;'>&nbsp;</p>";
    
    
                    Html += "<table style='font-size:13px' align='center' width='95%' >" +
                        "<tr>" +
                        "<td  align='center'><b>APPENDIX I</b></td>" +
                        "</tr>" +
                        "</table>";
    
    
                    Html += "<table style='font-size:14px' align='center' width='95%' padding-top='5px' >" +
                        "<tr>" +
                        "<td  align='center'><b>EMISSIONS</b></td>" +
                        "</tr>" +
                        "</table>";
    
                    Html += "<table style='font-size:14px;font-style:italic;' align='center' width='95%' padding-top='20px' >" +
                        "<tr>" +
                        "<td  >" +
                        "LRM Leasing certifies that the following air pollution emission control devices and system of this vehicle, if installed " +
                        "by the vehicle manufacturer or importer, have not been tampered with by us or by our agents, employees, or other " +
                        "representatives. We also hereby certify that we or persons under our supervision have inspected this motor vehicle " +
                        "and, based on said inspection, have determined that the air pollution control devices and systems, if installed by the " +
                        "vehicle manufacturer or importer, are in place and appear properly connected and undamaged as determined by " +
                        "visual observation.<br/><br/>" +
                        "This certification shall not be deemed or construed as a warranty that any air pollution control device or system of the " +
                        "vehicle is in functional condition, nor does the execution or delivery of this certification create by itself grounds for a " +
                        "cause of action between the parties to this transaction." +
                        "</td>" +
                        "</tr>" +
                        "</table>";
    
                    Html += "<table style='font-size:14px' align='center' width='95%' padding-top='20px' >" +
                        "<tr>" +
                        "<td align='center'  ><b>Penalties for Modification to Vehicle Emissions System</b></td>" +
                        "</tr>" +
                        "</table>";
    
                    Html += "<table style='font-size:14px;' align='center' width='95%' padding-top='8px' >" +
                        "<tr>" +
                        "<td  >" +
                        "As per the Vehicle and Engine Certification Requirements under the Federal Clean Air Act, I understand that it is illegal " +
                        "to alter, tamper, or change in anyway the vehicle's emissions system. I understand and acknowledge that if I or " +
                        "anyone else bypass, tamper, or make any changes to the emissions system that I will be subject to the maximum " +
                        "penalty allowable under federal law.<br/><br/>" +
                        "In addition to the federal penalty, for bypassing, tampering, or making changes to the emissions system, I understand " +
                        "that I will be penalized a $10,000 fine imposed by LRM Leasing Company Inc. for making these changes to their vehicle " +
                        "plus all monies required to bring the vehicle back to legal condition including but not limited to parts, labor," +
                        "transportation, and legal fees. x___________<br/><br/>" +
                        "In order to avoid potential prosecution and imposed fines by LRM Leasing Company Inc., I WILL NOT alter, tamper," +
                        "bypass, or make changes in any way to the vehicle's emissions system" +
                        "</td>" +
                        "</tr>" +
                        "</table>";
    
    
                        Html += "<table style='font-size:13px;font-style:italic;' align='center' width='95%' padding-top='30px'>" +
                        "<tr>" +
                            "<td style='font-size:7px' border-left='.25' border-right='.25' border-top='.25'><b>LESSEE (Authorized Agent or as Individual) &amp; Co-Signer PRINT NAME</b></td>" +
                        "</tr>" +
                        "<tr>" +
                            "<td style='font-size:11px' border-left='.25' border-right='.25'>" + Customer + "</td>" +
                        "</tr>" +
                        "<tr>" +
                            "<td style='font-size:7px' border-left='.25' border-right='.25' border-top='.25'><b>LESSEE (Authorized Agent or as Individual) &amp; Co-Signer SIGNATURE</b></td>" +
                        "</tr>" +
                        "<tr height='14'>" +
                            "<td style='font-size:11px' border-left='.25' border-right='.25'></td>" +
                        "</tr>" +
                        "<tr>" +
                            "<td style='font-size:8px' border-left='.25' border-right='.25' border-top='.25'>" +
                                "<table width='100%' style='border-collapse:collapse;'>" +
                                    "<tr>" +
                                        "<td style='font-size:7px; text-align:left; width:50%;'><b>TITLE</b></td>" +
                                        "<td style='font-size:7px; text-align:right; width:50%;'><b>DATE</b></td>" +
                                    "</tr>" +
                                "</table>" +
                            "</td>" +
                        "</tr>" +
                        "<tr>" +
                            "<td style='font-size:11px' border-left='.25' border-right='.25' border-bottom='.25'>" +
                                "<table width='100%' style='border-collapse:collapse;'>" +
                                    "<tr>" +
                                        "<td style='font-size:11px; text-align:left; width:50%;'></td>" +
                                        "<td style='font-size:11px; text-align:right; width:50%; padding-right:10px;'>" + currentdate + "</td>" +
                                    "</tr>" +
                                "</table>" +
                            "</td>" +
                        "</tr>" +
                    "</table>";
                    //page break///
                    Html += "<p style='page-break-after: always;'>&nbsp;</p>";
    
    
    
                    Html += "<table style='font-size:13px' align='center' width='95%' >" +
                        "<tr>" +
                        "<td  align='center'><b>APPENDIX J</b></td>" +
                        "</tr>" +
                        "</table>";
    
    
                    Html += "<table style='font-size:14px' align='center' width='95%' padding-top='10px' >" +
                        "<tr>" +
                        "<td  align='center'><b>HOLD HARMLESS AGREEMENT</b></td>" +
                        "</tr>" +
                        "</table>";
    
    
                    Html += "<table style='font-size:14px' align='center' width='95%' padding-top='10px' >" +
                        "<tr>" +
                        "<td  >" +
                        "This HOLD HARMLESS AGREEMENT(this “Agreement”) is made effective on <u>" + currentdate + "</u>, by and " +
                        "between LRM LEASING COMPANY, INC. (hereinafter “LRM”) and <u>" + Customer + "</u>, LRM lessee " +
                        "(hereinafter “Lessee”), individually(collectively, the “Parties”). " +
                        "</td>" +
                        "</tr>" +
                        "</table>";
    
    
                    Html += "<table style='font-size:14px' align='center' width='95%' padding-top='10px' >" +
                        "<tr>" +
                        "<td  >" +
                        "WHEREAS, Lessee understands and acknowledgesthat LRM limits the states you may possess a valid driver's " +
                        "license in and the state you may obtain registration in for all its leases to the approved state listing on " +
                        "Appendix A.<br/><br/>" +
                        "TERMS<br/><br/>" +
                        "Lessee agrees to fully defend, indemnify, and hold harmless, LRM from all claims lawsuits, demands, causes of " +
                        "actions, liability, loss, damage and/or injury, of any kind whatsoever (including without limitation all claims for " +
                        "monetary loss, property damage, equitable relief, personal injury and/or wrongful death), whether brought by an " +
                        "individual or other entity, or imposed by a court of law or by administrative action of any federal, state, or local " +
                        "government body or agency, arising out of, in any way whatsoever, any acts, omissions, negligence, or willful " +
                        "misconduct on the part of LRM, its officers, owners, personnel, employees, agents, contractors, invitees, or " +
                        "volunteers. This indemnification applies to and includes, without limitation, the payment of all penalties, fines, " +
                        "judgements, awards, decrees, attorneys' fees, and related costs or expenses, and any reimbursementsto LRM for all " +
                        "legal fees, expenses and costs incurred by it.<br/><br/>" +
                        "Each Party warrants that the individual who have signed this Agreement have the actual legal power, right, and " +
                        "authority to make this Agreement bind each respective Party.<br/><br/>" +
                        "No supplement, modification, or amendment to this Agreement shall be binding unless executed in writing and " +
                        "signed by both Parties.<br/><br/>" +
                        "No waiver of any default shall constitute a waiver of any other default or breach, whether of the same or other " +
                        "covenant or condition.<br/><br/>" +
                        "If any legal action or other proceeding is brought in connection with this Agreement, the successful or prevailing " +
                        "Party, if any, shall be entitled to recover reasonable attorneys' fees and other related costs, in addition to any other " +
                        "relief to which that Party is entitled to including the right of offset against any funds held on deposit. " +
                        "This Agreement shall be governed exclusively by the laws of Florida, without regard to conflict of law provision." +
                        "</td>" +
                        "</tr>" +
                        "</table>";
    
                    Html += "<table style='font-size:14px' align='center' width='95%' padding-top='10px' >" +
                        "<tr>" +
                        "<td  >" +
                        "This Agreement shall be signed on behalf of LRM by ________________, and on behalf of the Lessee by " +
                        "<u>" + Customer + "</u>, and effective as of the date first written above." +
                        "</td>" +
                        "</tr>" +
                        "</table>";
    
    
                    Html += "<table align='center' width='95%' margin-top='10' font-style = 'italic'>" +
                        "<tr style='font-size:12px'>" +
                        "<td  border-collapse = 'collapse' border-right ='.25' border-left ='.25' border-top ='.25'   >" +
                        "<table width='100%'>" +
                        "<tr style='font-size:9px' ><td><b>LESSEE (Authorized Agent or as Individual) &amp; Co-Signer</b></td></tr>" +
                        "<tr><td>" + Customer + "</td></tr>" +
                        "</table>" +
                        "</td>" +
                        "<td border-collapse = 'collapse'   border-right ='.25' border-top ='.25'>" +
                        "<table width='100%'  >" +
                        "<tr style='font-size:9px' ><td><b>LESSOR</b></td></tr>" +
                        "<tr><td></td></tr>" +
                        "</table>" +
                        "</td>" +
                        "</tr>" +
    
                        "<tr style='font-size:12px'>" +
                        "<td  border-collapse = 'collapse' border-right ='.25' border-left ='.25' border-top ='.25'   border-bottom ='.25' >" +
                        "<table width='100%'>" +
                        "<tr style='font-size:8px' ><td><b>SIGNATURE (Lessee &amp; Co-Signer)</b></td><td><b>Title</b></td><td><b>Date</b></td></tr>" +
                        "<tr><td style='font-size:4.7px' padding-top='-5px'>DocuSignedBy:</td><td style='font-size:10px'></td><td style='font-size:10px'>" + currentdate + "</td></tr>" +
                        // "<tr><td style='font-size:10px'>Godfrey</td><td></td><td></td></tr>" +
                        "</table>" +
                        "</td>" +
                        "<td  border-collapse = 'collapse' border-right ='.25' border-left ='.25' border-top ='.25' border-bottom ='.25'   >" +
                        "<table width='100%'>" +
                        "<tr style='font-size:8px' ><td><b>SIGNATURE</b></td><td><b>Title</b></td><td><b>Date</b></td></tr>" +
                        "<tr><td style='font-size:4.7px' padding-top='-5px'>DocuSignedBy:</td><td style='font-size:10px'></td><td style='font-size:10px'>" + currentdate + "</td></tr>" +
                        // "<tr><td style='font-size:10px'>Matt</td><td></td><td></td></tr>" +
                        "</table>" +
                        "</td>" +
                        "</tr>" +
    
                        "<tr style='font-size:5px'>" +
                        "<td><table><tr><td>O0dDCGTI578Mk</td></tr></table></td>" +
                        "<td><table><tr><td>N47DCGTI578Mk</td></tr></table></td>" +
                        "</tr>" +
    
                        "</table>";
    
                    //page break///
                    Html += "<p style='page-break-after: always;'>&nbsp;</p>";
    
                    Html += "<table style='font-size:13px' align='center' width='95%' >" +
                        "<tr>" +
                        "<td  align='center'  ><b>APPENDIX K</b></td>" +
                        "</tr>" +
                        "</table>";
    
    
                    Html += "<table style='font-size:14px' align='center' width='95%' padding-top='10px' >" +
                        "<tr>" +
                        "<td  align='center'><b>LEASE DISCLOSURE STATEMENT AND AGREEMENT FOR INSTALLATION</b></td>" +
                        "</tr>" +
                        "</table>";
                    Html += "<table style='font-size:14px' align='center' width='95%' padding-top='5px' >" +
                        "<tr>" +
                        "<td  align='center'><b>OF VEHICLE PROTECTION SYSTEM (“AGREEMENT”)</b></td>" +
                        "</tr>" +
                        "</table>";
    
                        Html += "<table style='font-size:11px' align='center' width='95%'  padding-top='10px'>" +
                        "<tr>" +
                        "<td  align='center'>Leased Vehicle or Equipment—VIN #, Serial #, or Other Iden-fica-on</td>" +
                        "</tr>" +
                        "</table>";
                        Html += "<table align='center' width='100%' style='padding-top:8px; margin-left:15px; border-collapse: collapse;'>" +
                        "<tr style='font-size:12px; width:100%; text-align:left;'>" +
                            "<td>Year:</td>" +
                            "<td style='border-bottom: 1px solid black; width: 50px;'>" + (Year || "&nbsp;") + "</td>" +
                            "<td>Make:</td>" +
                            "<td style='border-bottom: 1px solid black; width: 100px;'>" + (Brand || "&nbsp;") + "</td>" +
                            "<td>Model:</td>" +
                            "<td style='border-bottom: 1px solid black; width: 100px;'>" + (Model || "&nbsp;") + "</td>" +
                            "<td>Transmission:</td>" +
                            "<td style='border-bottom: 1px solid black; width: 120px;'>" + (Type || "&nbsp;") + "</td>" +
                            "<td>Color:</td>" +
                            "<td style='border-bottom: 1px solid black; width: 100px;'>" + (ModelClr || "&nbsp;") + "</td>" +
                        "</tr>" +
                        "</table>";
    
                        Html += "<table style='font-size:12px; padding-top:8px; margin-left:15px;'>" +
                            "<tr>" +
                            "<td >VEHICLE IDENTIFICATION NUMBER: </td>"+
                            "<td style='border-bottom: 1px solid black; width: 100px;'>"+VinNo+"</td>"+
                            "</tr>" +
                            "</table>";
    
                        Html += "<hr style='width: 100%; border: 1px solid black;' />";
    
    
                    Html += "<table style='font-size:11px' align='left' width='95%' padding-top='10px'  padding-left='20px' >" +
                        "<tr>" +
                        "<td  >" +
                        "I have agreed to lease the above-described vehicle." +
                        "<b>You are leasing the vehicle. You do not own it. Your right to possession and use of the Vehicle is conditioned on you making timely lease payments to Lessor and complying with the terms of the Lease (“Lease”)..</b>"+
                        "</td>" +
                        "</tr>" +
                        "</table>";
                   
    
                    Html += "<table style='font-size:11px' align='left' width='95%' padding-top='10px'  padding-left='20px' >" +
                        "<tr>" +
                        "<td  >" +
                        "In this Disclosure Statement and Agreement for Installation (“Agreement”), “we,” “us” and “our” mean the Lessor that holds the Lease secured by the Vehicle, and any of our " +
                        "designated employees, agents, or representatives. “You” and “your” mean the Lessee(s) named above.<br/><br/>" +
                        "You signed a Lease in connection with your lease of the vehicle described above (“Vehicle”), dated the same date as this Agreement. We require that the Vehicle be equipped with " +
                        "the Vehicle Protection System (the “Device”) for us to enter into the Lease with you. <b>The Device is designed to ensure that you comply with the terms of the Lease.</b>" +
                        "</td>" +
                        "</tr>" +
                        "</table>";
    
                    Html += "<table style='font-size:11px' align='left' width='95%' padding-top='10px' padding-left='20px' >" +
                        "<tr>" +
                        "<td  >" +
                        "Please see a summary of terms of this Agreement below." +
                        "</td>" +
                        "</tr>" +
                        "</table>";
    
                    Html += "<table style='font-size:11px' align='left' width='95%' padding-left='20px' >" +
                        "<tr>" +
                        "<td ><ul>" +
                        "<li>A Device with GPS tracking can determine the location of your vehicle.</li>" +
                        "<li>The GPS will be used to ensure the GPS is still functioning, to monitor your compliance with the Lease, and to locate the Vehicle for recovery.</li>" +
                        "<li>We may use the GPS to monitor the location and mileage of the Vehicle during the Lease.</li>" +
                        "<li>The Lessor or its designated assignee or representative will not provide you or any other person any access or record of the tracking unless required to do so by law, or " +
                        "to enforce any rights Lessor or its designated assignee or representative may have to secure payments due under any contract between us and / or to secure recovery " +
                        "of the Vehicle as allowed.</li>" +
                        "<li>You agree to waive any right to privacy you may have as to the location of the Vehicle.</li>" +
                        "<li>A Device with Starter Interrupt may prevent the Vehicle from starting if you fail to comply with the material terms of the Lease.</li>" +
                        "<li>The GPS and / or Starter Interrupt may be used to assist law enforcement agencies.</li>" +
                        "</ul></td>" +
                        "</tr>" +
                        "</table>";
    
                    Html += "<p style='font-size:9px' align='left' width='95%' padding-top='10px' padding-left='20px'>" +
                      
                        "<b><u>PLEASE READ AND SIGN BELOW TO INDICATE YOUR UNDERSTANDING AND ACCEPTANCE OF THE FOLLOWING TERMS REGARDING THE INSTALLATION OF THE DEVICE, YOUR " +
                        "OBLIGATIONS UNDER THE LEASE AND THE CONSEQUENCES OF FAILING TO MEET YOUR OBLIGATIONS UNDER THE LEASE:</u></b>" +
                        "</p>"+
                        "<ol style='font-size:11px' align='left' width='95%' padding-top='10px' padding-left='30px'>" +
                        "<li>You understand that installing and maintaining the Device in the Vehicle is a material condition for us to lease you the Vehicle and that you may be able to lease " +
                        "a vehicle from another lessor that may not require installation of the Device.You choose to lease this Vehicle and you consent to having the Device installed.You " +
                        "acknowledge you are signing this Agreement at the same time you are signing the Lease.This Agreement is incorporated into and part of that Lease as a single " +
                        "document.</li>" +
                        "<li>You have been provided with the CUSTOMER OPERATING INSTRUCTIONS(if any), which explain how the Device operates, your obligations with respect to the use " +
                        "of the Device, as well as a 24 - hour 1 - 800 - 865 - 3260. You have been provided with a 24 - hour hotline number to have someone assist you.If you are in an emergency " +
                        "and your vehicle is disabled, dial 911.</li>" +
                        "<li>IF THE DEVICE HAS GPS, you understand it will be used by us to track the location of the Vehicle to ensure the GPS is still functioning, to monitor your compliance " +
                        "with the Lease, and to locate the vehicle for repossession.We may also use the GPS to monitor the location of the vehicle prior to default. We can use previously " +
                        "acquired location data for purposes of Vehicle recovery.You agree that you have no right to privacy regarding the use of GPS to track the location of the Vehicle, " +
                        "but in the event that a court, arbitrator, dispute resolution organization, or state or federal authority should determine that you have a right to privacy, you hereby " +
                        "waive that right to the fullest extent allowed by applicable law.You agree to inform any individual operating the Vehicle that we are using GPS to track the " +
                        "location and mileage of the Vehicle and that they should have no expectation of privacy regarding their location or mileage while operating the Vehicle.</li>" +
                        "<li>IF THE DEVICE HAS STARTER INTERRUPT, you understand that if we do not receive a scheduled payment on or before the due date, or, to the extent permitted " +
                        "by applicable law, you otherwise default under the terms of the Lease(see the default provision in your Lease), the Vehicle can be disabled and will not start.If " +
                        "you have a right to cure your default under applicable law, the Vehicle will not start if you do not cure your default prior to the expiration of the cure period.We " +
                        "will provide you notice of your right to cure if required by law.</li>" +
                        "<li>You understand if law enforcement personnel make a request that we locate and / or disable a vehicle including as part of any investigation, you agree we may do " +
                        "this and waive any right to privacy you may otherwise have.</li>" +
                        "<li>You understand that the Device is our property.You further understand that if you tamper with, alter, disconnect, or remove the Device, you will be considered " +
                        "in default under this Agreement, and to the extent permitted by applicable law, your Lease.</li>" +
                        "<li>You understand that if you tamper with, alter, disconnect, or remove the Device from the Vehicle, you may be liable for the cost to replace or repair the Device, " +
                        "unless prohibited by law.You understand that tampering, altering, or otherwise modifying the device or its installation may present a risk to you, others, and the " +
                        "vehicle due to fire or other cause, including potential risks of property damage and personal injury, including death.</li>" +
                        "<li>You understand that the Device may receive commands wirelessly from us.You understand that in areas with poor wireless coverage, a command sent to your " +
                        "Device may not be received, even if you have paid your bill when due.If this happens, you must call us or use the mobile application to get the command resent " +
                        "wirelessly or to instruct you to enter the command manually with the remote keypad, if one was provided to you.You may call the 1 - 800 - number and a " +
                        "representative will resend the command wirelessly or otherwise try to assist you." +
                        "<br/>You understand that if your vehicle is disabled, it will not start until the Device receives a command to enable.You understand that we have the right to assign " +
                        "our rights, title and interest in the Lease and this Agreement at any time.Our assignment of the Lease will not in any way affect the terms and conditions of this " +
                        "Agreement.</li>" +
                        "<li>You understand that only we are permitted to perform maintenance on the Device or any of its components.Should maintenance or repair be required, you " +
                        "agree to make the Vehicle available to us, during our normal business hours.You understand that we take full responsibility for the cost of all repairs to the " +
                        "Device, except for repairs caused by your tampering with, altering, disconnecting, or removing the Device.</li> " +
                        "<li> " +
                        "You understand that you may choose to buy the Device if you exercise your purchase option under the Lease at a price to be determined and agreed upon by you " +
                        "and us.If you choose to buy the Device, you will contact us.If you do not choose to buy the Device at that time, and if you are not using the device for Optional " +
                        "Services, we will remove the Device from the Vehicle or render the Device inoperable(at our sole option and at no charge to you) so that it will have no effect on " +
                        "the operation of the Vehicle. " +
                        "</li> " +
                        "<li>Any violation of any terms or conditions of this Agreement is a material default under the Lease, if permitted by applicable law.Upon any default under this " +
                        "Agreement or violation of the terms and conditions herein, we will be entitled to take all actions, including but not limited to recovery and disposition of the " +
                        "Vehicle, as allowed by applicable law and your Lease.</li> " +
                        "<li>You understand that we may not charge you for installation or our use of the Device for payment assurance purposes.</li>" +
                        "<li>You understand the Device allows us to track the mileage of the Vehicle(“Mileage Tracker”) to allow us to manage our inventory.You agree to allow this function " +
                        "to track the Vehicle mileage for all lawful purposes.You agree that you have no right to privacy regarding the use of the Mileage Tracker to track the mileage of " +
                        "the Vehicle, but in the event that a court, arbitrator, other dispute resolution organization, or state or federal authority determines that such a right exists, you " +
                        "hereby waive such right to the fullest extent possible.If you have signed a Warranty or Service Contract for the Vehicle, you also agree that the Mileage Tracker " +
                        "may be used to allow us to comply with the terms of this Agreement, or any Warranty or Service Contract.</li> " +
                        "</ol>" 
    
                  
    
                    Html += "<table style='font-size:9px' align='left' width='95%' padding-top='20px' >" +
                        "<tr>" +
                        "<td>" +
                        "<b>NOTICE: Do not sign this Agreement before reading it. By signing below, you acknowledge that you have been given the opportunity to read this Agreement, and " +
                        "the CUSTOMER OPERATING INSTRUCTIONS, if provided to you. You acknowledge that you have had any questions regarding the Device answered to your " +
                        "satisfaction. You acknowledge that you have read and fully understand and agree to be bound by all of the terms and conditions in this " +
                        "Agreement. This Agreement is hereby incorporated by reference into the Lease.</b>" +
                        "</td>" +
                        "</tr>" +
                        "</table>";
    
    
                    
                        Html += "<table align='center' width='95%' margin-top='10' >" +
                        "<tr style='font-size:12px'>" +
                        "<td  border-collapse = 'collapse' border-right ='.25' border-left ='.25' border-top ='.25'   >" +
                        "<table width='100%'>" +
                        "<tr style='font-size:9px;font-style:italic;' ><td><b>LESSEE (Authorized Agent or as Individual) &amp; Co-Signer</b></td></tr>" +
                        "<tr style='font-size:9px;font-style:italic;'><td>" + Customer + "</td></tr>" +
                        "</table>" +
                        "</td>" +
                        "<td border-collapse = 'collapse'   border-right ='.25' border-top ='.25'>" +
                        "<table width='100%'  >" +
                        "<tr style='font-size:9px;font-style:italic;' ><td><b>LRM LEASING COMPANY, INC.</b></td></tr>" +
                        "<tr><td></td></tr>" +
                        "</table>" +
                        "</td>" +
                        "</tr>" +
    
                        "<tr style='font-size:12px'>" +
                        "<td  border-collapse = 'collapse' border-right ='.25' border-left ='.25' border-top ='.25'   border-bottom ='.25' >" +
                        "<table width='100%'>" +
                        "<tr style='font-size:8px;font-style:italic;' ><td><b>SIGNATURE (Lessee &amp; Co-Signer)</b></td><td><b>Title</b></td><td><b>Date</b></td></tr>" +
                        "<tr><td style='font-size:4.7px;font-style:italic;' padding-top='-5px'>DocuSignedBy:</td><td style='font-size:10px'></td><td style='font-size:10px;font-style:italic; '>" + currentdate + "</td></tr>" +
                        // "<tr><td style='font-size:10px'>Godfrey</td><td></td><td></td></tr>" +
                        "</table>" +
                        "</td>" +
                        "<td  border-collapse = 'collapse' border-right ='.25' border-left ='.25' border-top ='.25' border-bottom ='.25'   >" +
                        "<table width='100%'>" +
                        "<tr style='font-size:8px;font-style:italic;' ><td><b>SIGNATURE</b></td><td><b>Title</b></td><td><b>Date</b></td></tr>" +
                        "<tr><td style='font-size:4.7px;font-style:italic;' padding-top='-5px'>DocuSignedBy:</td><td style='font-size:10px'></td><td style='font-size:10px; font-style:italic;'>" + currentdate + "</td></tr>" +
                        // "<tr><td style='font-size:10px'>Matt</td><td></td><td></td></tr>" +
                        "</table>" +
                        "</td>" +
                        "</tr>" +
    
                        "<tr style='font-size:5px; font-style:italic;'>" +
                        "<td><table><tr><td>O0dDCGTI578Mk..</td></tr></table></td>" +
                        "<td><table><tr><td>N47DCGTI578Mk</td></tr></table></td>" +
                        "</tr>" +
    
                        "</table>";
    
                    //page break///
                    Html += "<p style='page-break-after: always;'>&nbsp;</p>";
    
                    Html += "<table style='font-size:13px' align='center' width='95%' >" +
                        "<tr>" +
                        "<td  align='center'  ><b>APPENDIX L</b></td>" +
                        "</tr>" +
                        "</table>";
    
    
                    Html += "<table style='font-size:14px' align='center' width='95%' padding-top='10px' >" +
                        "<tr>" +
                        "<td  align='center'><b>UNPAID TOLLS</b></td>" +
                        "</tr>" +
                        "</table>";
    
                    Html += "<table style='font-size:13px' align='center' width='95%' padding-top='10px' >" +
                        "<tr>" +
                        "<td>" +
                        "Sometimes, unpaid tolls occur, though, usually because your vehicle’s payment transponder fails at a toll lane, or you do"+
                        "not have your transponder properly set up.<br/><br/>" +
                        "To prevent you from incurring unexpected costs, such as penalties, fines, or administrative fees, LRM Leasing Company " +
                        "Inc. has contracted with FleetIT^1.<br/><br/>" +
                        "If you fail to pay a toll, for any reason whatsoever, FleetIT^1 will pay the unpaid toll electronically, with funds withdrawn " +
                        "from LRM Leasing's account.Using FleetIT^1 should minimize most, if not all, of the possible tolling penalties and fines " +
                        "from the authorities." +
                        "</td>" +
                        "</tr>" +
                        "</table>";
    
                    Html += "<table style='font-size:13px' align='center' width='95%' padding-top='10px' >" +
                        "<tr>" +
                        "<td>" +
                        "<b>How it works</b>" +
                        "</td>" +
                        "</tr>" +
                        "</table>";
    
    
                    Html += "<table style='font-size:13px' align='left' width='95%' padding-left='20px' >" +
                        "<tr>" +
                        "<td ><ol>" +
                        "<li>FleetIT1 submits a record of your vehicle's license plate number(s) to tolling authorities nationwide. FleetIT1 " +
                        "covers most major U.S. tollways; fees could still occur if not paid timely.</li>" +
                        "<li>When your license plate(s) incurs an unpaid toll, FleetIT1 will pay the toll electronically.</li>" +
                        "<li>FleetIT1 invoices and collects from LRM Leasing for the unpaid tolls and fees.</li>" +
                        "<li>LRM Leasing will then add to your lease balance at the time of the transaction the actual cost incurred plus a small administrative fee.</li>" +
                        "<li>As per the terms and conditions of your lease agreement, these fees will be due immediately upon your next scheduled payment.</li>" +
                        "</ol></td>" +
                        "</tr>" +
                        "</table>";
                  
    
                    Html += "<table style='font-size:13px' align='center' width='95%' padding-top='10px' >" +
                        "<tr>" +
                        "<td>" +
                        "<b>Transponder:</b> It is imperative that you have a transponder properly set up. Your transponder must: 1) be compatible " +
                        "with the toll ways that you are traveling on, 2) have your license plate registered on your account, and 3) have a form of " +
                        "payment with sufficient funds to cover your tolls.<br/><br/>" +
                        "<b>Inactive plates: </b>Any time you either renew your registration, get a new plate, switch carriers, or cause any other event " +
                        "to have an inactive registration; you need to ensure that registered plate is no longer in LRM Leasing's or your name. " +
                        "Any tolls or violations that continue to come in from a plate still showing LRM Leasing as the owner will be automatically " +
                        "paid and charged to your lease account. The tolling authorities follow who the titled owner on record with each state's " +
                        "department of motor vehicles. " +
                        "</td>" +
                        "</tr>" +
                        "</table>";
    
                    Html += "<table style='font-size:13px' align='center' width='95%' padding-top='10px' >" +
                        "<tr>" +
                        "<td>" +
                        "<b>Questions or disputes?</b>" +
                        "</td>" +
                        "</tr>" +
                        "</table>";
                    Html += "<table style='font-size:13px' align='center' width='95%' padding-top='10px' >" +
                        "<tr>" +
                        "<td>" +
                        "If you feel that you have been improperly charged for a toll, please request a copy of the transaction details (unpaid " +
                        "toll's date, time, toll ID transaction number, toll authority, and location) from tolls@lrmleasing.com. After review, you " +
                        "will need to reach out to the issuing authority identified in the details of the transaction if you wish to dispute the " +
                        "charges. LRM Leasing does not have the authority to change or alter any tolls or associated violations and fees." +
                        "</td>" +
                        "</tr>" +
                        "</table>";

                    
                        Html += "<table align='center' width='95%' heigh='15%' style='margin-top:10px;'>" +
                        "<tr style='font-size:12px'>" +
                            "<td style='border-collapse: collapse; border-right: .25px solid black; border-bottom: .25px solid black; border-left: .25px solid black; border-top: .25px solid black;'>" +
                                "<table width='100%'>" +
                                    "<tr style='font-size:9px; font-style:italic;'>" +
                                        "<td><b>LESSEE (Authorized Agent or as Individual) &amp; Co-Signer</b></td>" +
                                    "</tr>" +
                                    "<tr style='font-size:9px; font-style:italic;'>" +
                                        "<td>" + Customer + "</td>" +
                                    "</tr>" +
                                "</table>" +
                            "</td>" +
                            "<td style='border-collapse: collapse; border-right: .25px solid black; border-top: .25px solid black;  border-bottom: .25px solid black;'>" +
                                "<table width='100%'>" +
                                    "<tr style='font-size:9px; font-style:italic;'>" +
                                        "<td><b>LRM LEASING COMPANY, INC.</b></td>" +
                                    "</tr>" +
                                    "<tr><td></td></tr>" +
                                "</table>" +
                            "</td>" +
                        "</tr>" +
                    "</table>";
            
    
                    Html += "<table style='font-size:13px' align='center' width='95%' padding-top='50px' >" +
                        "<tr>" +
                        "<td>" +
                        "<b>_______________________________</b>" +
                        "</td>" +
                        "</tr>" +
                        "</table>";
    
                    Html += "<table style='font-size:12px' align='center' width='95%' padding-top='20px' >" +
                        "<tr>" +
                        "<td>" +
                        "LRM reserves the right, in its sole discretion, to change and replace FleetIT with any other similar service provider. Furthermore, " +
                        "LRM reserves the right, in its sole discretion, to choose to no longer use the services of FleetIT or any other similar service provider. " +
                        "</td>" +
                        "</tr>" +
                        "</table>";
    
    
                   
                  
    
                    //page break///
                    Html += "<p style='page-break-after: always;'>&nbsp;</p>";
    
                    Html += "<table style='font-size:13px' align='center' width='95%' padding-top='10px' >" +
                        "<tr>" +
                        "<td  align='center'><b><u>ACCEPTANCE CERTIFICATE</u></b></td>" +
                        "</tr>" +
                        "</table>";
    
                    Html += "<table style='font-size:13px' align='center' width='95%' padding-top='10px' >" +
                        "<tr>" +
                        "<td  align='center'>LEASE DATED <u>" + currentdate + "</u>(“LEASE”)</td>" +
                        "</tr>" +
                        "</table>";
    
                    Html += "<table style='font-size:13px' align='center' width='90%' padding-top='10px' >" +
                        "<tr>" +
                        "<td>BETWEEN LRM LEASING COMPANY, INC. (“LESSOR”) AND THE UNDERSIGNED LESSEE (“LESSEE”)</td>" +
                        "</tr>" +
                        "</table>";
    
                    Html += "<table style='font-size:13px' align='center' width='90%' padding-top='10px' >" +
                        "<tr>" +
                        "<td>" +
                        "I, acting on behalf of the Lessee, acknowledge that I have personally inspected or caused to be personally inspected to my " +
                        "satisfaction all items of Equipment described in the above Lease and that I am duly authorized on behalf of the Lessee to sign " +
                        "and bind the Lessee to the Lease.<br/><br/>" +
                        "The Equipment has been received, inspected and is complete, operational, in good condition and working order, and " +
                        "satisfactory in all respects and conforms to all specifications required by Lessee<br/><br/>" +
                        "Lessee hereby accepts the Equipment and acknowledges that the Lease commenced. Lessee further acknowledges that this " +
                        "Lease is NON-CANCELLABLE, ABSOLUTE, AND IRREVOCABLE. Lessee certifies that no Event of Default or event that with " +
                        "notice of lapse of time would become a Default currently exists." +
                        "</td>" +
                        "</tr>" +
                        "</table>";
    
    
                        Html += "<table style='font-size:11px' align='center' width='95%' >" +
                        "<tr>" +
                        "<td  align='center'>Leased Vehicle or Equipment—VIN #, Serial #, or Other Iden-fica-on</td>" +
                        "</tr>" +
                        "</table>";
                        Html += "<table align='center' width='100%' style='padding-top:8px; margin-left:15px; border-collapse: collapse;'>" +
                        "<tr style='font-size:12px; width:100%; text-align:left;'>" +
                            "<td>Year:</td>" +
                            "<td style='border-bottom: 1px solid black; width: 50px;'>" + (Year || "&nbsp;") + "</td>" +
                            "<td>Make:</td>" +
                            "<td style='border-bottom: 1px solid black; width: 100px;'>" + (Brand || "&nbsp;") + "</td>" +
                            "<td>Model:</td>" +
                            "<td style='border-bottom: 1px solid black; width: 100px;'>" + (Model || "&nbsp;") + "</td>" +
                            "<td>Transmission:</td>" +
                            "<td style='border-bottom: 1px solid black; width: 120px;'>" + (Type || "&nbsp;") + "</td>" +
                            "<td>Color:</td>" +
                            "<td style='border-bottom: 1px solid black; width: 100px;'>" + (ModelClr || "&nbsp;") + "</td>" +
                        "</tr>" +
                        "</table>";
         
                        //**************** */
                        Html += "<table style='font-size:12px; padding-top:30px; margin-left:15px;'>" +
                             "<tr>" +
                             "<td >VEHICLE IDENTIFICATION NUMBER: </td>"+
                             "<td style='border-bottom: 1px solid black; width: 100px;'>"+VinNo+"</td>"+
                             "</tr>" +
                             "</table>";
     
                         Html += "<hr style='width: 100%; border: 1px solid black;' />";

                         Html += "<table align='center' width='95%' margin-top='40' font-style = 'italic'>" +
                        "<tr style='font-size:12px'>" +
                        "<td  border-collapse = 'collapse' border-right ='.25' border-left ='.25' border-top ='.25'   >" +
                        "<table width='100%'>" +
                        "<tr style='font-size:9px' ><td><b>LESSEE (Authorized Agent or as Individual) &amp; Co-Signer</b></td></tr>" +
                        "<tr><td>" + Customer + "</td></tr>" +
                        "</table>" +
                        "</td>" +
                        "<td border-collapse = 'collapse'   border-right ='.25' border-top ='.25'>" +
                        "<table width='100%'  >" +
                        "<tr style='font-size:9px' ><td><b>LESSOR</b></td></tr>" +
                        "<tr><td></td></tr>" +
                        "</table>" +
                        "</td>" +
                        "</tr>" +
    
                        "<tr style='font-size:12px'>" +
                        "<td  border-collapse = 'collapse' border-right ='.25' border-left ='.25' border-top ='.25'   border-bottom ='.25' >" +
                        "<table width='100%'>" +
                        "<tr style='font-size:8px' ><td><b>SIGNATURE (Lessee &amp; Co-Signer)</b></td><td><b>Title</b></td><td><b>Date</b></td></tr>" +
                        "<tr><td style='font-size:4.7px' padding-top='-5px'>DocuSignedBy:</td><td style='font-size:10px'></td><td style='font-size:10px'>" + currentdate + "</td></tr>" +
                        // "<tr><td style='font-size:10px'>Godfrey</td><td></td><td></td></tr>" +
                        "</table>" +
                        "</td>" +
                        "<td  border-collapse = 'collapse' border-right ='.25' border-left ='.25' border-top ='.25' border-bottom ='.25'   >" +
                        "<table width='100%'>" +
                        "<tr style='font-size:8px' ><td><b>SIGNATURE</b></td><td><b>Title</b></td><td><b>Date</b></td></tr>" +
                        "<tr><td style='font-size:4.7px' padding-top='-5px'>DocuSignedBy:</td><td style='font-size:10px'></td><td style='font-size:10px'>" + currentdate + "</td></tr>" +
                        // "<tr><td style='font-size:10px'>Matt</td><td></td><td></td></tr>" +
                        "</table>" +
                        "</td>" +
                        "</tr>" +
    
                        "<tr style='font-size:5px'>" +
                        "<td><table><tr><td>O0dDCGTI578Mk</td></tr></table></td>" +
                        "<td><table><tr><td>N47DCGTI578Mk</td></tr></table></td>" +
                        "</tr>" +
    
                        "</table>";
    
         
                        Html += "<p style='page-break-after: always;'>&nbsp;</p>";
    
                        Html += "<table style='font-size:11px' align='center' width='95%' padding-top='1px' >" +
                            "<tr>" +
                            "<td  align='center'><b>TRAC ADDENDUM</b></td>" +
                            "</tr>" +
                            "</table>";
        
                        Html += "<table style='font-size:11px' align='center' width='95%' padding-top='5px' >" +
                            "<tr>" +
                            "<td  align='center'><b>MOTOR VEHICLE LEASE AGREEMENT</b></td>" +
                            "</tr>" +
                            "</table>";
        
                            Html += "<table style='font-size:11px' align='center' width='95%' >" +
                        "<tr>" +
                        "<td  align='center'>Leased Vehicle or Equipment—VIN #, Serial #, or Other Iden-fica-on</td>" +
                        "</tr>" +
                        "</table>";
                        Html += "<table align='center' width='100%' style='padding-top:8px; margin-left:15px; border-collapse: collapse;'>" +
                        "<tr style='font-size:12px; width:100%; text-align:left;'>" +
                            "<td>Year:</td>" +
                            "<td style='border-bottom: 1px solid black; width: 50px;'>" + (Year || "&nbsp;") + "</td>" +
                            "<td>Make:</td>" +
                            "<td style='border-bottom: 1px solid black; width: 100px;'>" + (Brand || "&nbsp;") + "</td>" +
                            "<td>Model:</td>" +
                            "<td style='border-bottom: 1px solid black; width: 100px;'>" + (Model || "&nbsp;") + "</td>" +
                            "<td>Transmission:</td>" +
                            "<td style='border-bottom: 1px solid black; width: 120px;'>" + (Type || "&nbsp;") + "</td>" +
                            "<td>Color:</td>" +
                            "<td style='border-bottom: 1px solid black; width: 100px;'>" + (ModelClr || "&nbsp;") + "</td>" +
                        "</tr>" +
                        "</table>";
         
                        //**************** */
                        Html += "<table style='font-size:12px; padding-top:30px; margin-left:15px;'>" +
                             "<tr>" +
                             "<td >VEHICLE IDENTIFICATION NUMBER: </td>"+
                             "<td style='border-bottom: 1px solid black; width: 100px;'>"+VinNo+"</td>"+
                             "</tr>" +
                             "</table>";
     
                         Html += "<hr style='width: 100%; border: 1px solid black;' />";
        
                        Html += "<table  style='font-size:11px' align='center'  padding-top='10px' width='95%' >" +
                            "<tr>" +
                            "<td align='left' ><b>TRAC Amount:$ ___________</b></td>" +
                            
                            "</tr>" +
                            "</table>";
        
                        Html += "<table style='font-size:10px' align='center' width='95%' padding-top='10px' >" +
                            "<tr>" +
                            "<td>" +
                            "<b>THIS TRAC ADDENDUM </b>(the “Addendum”) to the above Motor Vehicle Lease Agreement (the “Lease”), between <b>LRM LEASING COMPANY, " +
                            "INC. ,</b> (“Lessor”) and the undersigned lessee (“Lessee”) is hereby incorporated into and made a part of the Lease. Capitalized terms used herein and not " +
                            "otherwise defined shall have the meanings assigned thereto in the Lease. This Addendum shall amend the Lease only to the extent as stated herein, and " +
                            "all other terms and conditions stated in the Lease shall be and remain in full force and effect. To the extent that any terms of this Addendum conflict " +
                            "with any provisions of the Lease, the terms of this Addendum shall control. The term “Equipment” when used herein refers to the Equipment leased " +
                            "under the Lease. The Lease is hereby supplemented and amended by addition of the following language: 1.<b> Purchase Option Price.</b> The parties " +
                            "acknowledge that the TRAC Amount is the Purchase Option Price and that it represents a reasonable estimate of the fair market value of the Equipment " +
                            "if maintained and returned in accordance with the Lease. If Lessee purchases the Equipment, Lessee promises to pay the TRAC Amount to Lessor on " +
                            "the last day of the Initial Lease Term. 2.<b> Rent Adjustment.</b> If Lessee does not elect to purchase the Equipment as set forth in the Lease, Lessee shall pay " +
                            "the Return Fee of $3,000 and return all Equipment to Lessor at the end of the Term in accordance with the terms of the Lease and Lessor shall sell the " +
                            "Equipment. Lessee acknowledges that the Return Fee is a reasonable estimate of the cost of remarketing the Equipment, including any refurbishment " +
                            "Lessor determines in its sole discretion will improve the Realized Value (as hereinafter defined). If the Realized Value exceeds the TRAC Amount, Lessor " +
                            "will pay over to Lessee any such excess. If the Realized Value is less than the TRAC Amount, Lessee shall pay any such deficiency to Lessor as a Rental " +
                            "adjustment. As used herein, the “Realized Value” shall mean an amount equal to: (a) the after-tax amount received by Lessor in immediately available " +
                            "funds from the purchaser; minus (b) any amounts remaining due under the Lease, minus (c) all costs of sale or disposition, including without limitation " +
                            "all sales and other taxes and all marketing, brokerage, repair, refurbishment, advertising costs and all other commissions or expenses, including the " +
                            "Return Fee. Lessee agrees to cooperate in any such sale of the Equipment and hereby grants to Lessor, its agents or employees, the right to enter Lessee's " +
                            "premises for the purpose of selling or otherwise disposing of the Equipment. In the event Lessor is unable to sell the Equipment within thirty (30) days of " +
                            "the end of the Lease, on request of Lessor, Lessee shall remit to Lessor the TRAC Amount plus all other amounts set forth in section 1 hereof that would " +
                            "be payable on execution of a purchase option. On receipt of such payment, Lessor shall convey the Equipment to Lessee as provided herein. Lessor shall " +
                            "have no obligations under this paragraph if Lessee is in default under the Lease and any amount due from Lessee on default shall be determined in " +
                            "accordance with the Lease and Lessor's recovery shall include the TRAC Amount as its estimated residual interest in the Equipment. 3. <b>Final Sale; Lessee " +
                            "Default.</b> In any sale or conveyance hereunder to Lessee or any other party, Lessor shall convey title to the Equipment 'AS-IS, WHERE IS', WITH ALL " +
                            "FAULTS, WITHOUT RECOURSE TO LESSOR AND WITHOUT REPRESENTATION OR WARRANTY OF ANY KIND WHATSOEVER BY LESSOR, EXPRESS OR IMPLIED, " +
                            "INCLUDING WITHOUT LIMITATION THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR USE OR PURPOSE. It shall be an " +
                            "Event of Default under the Lease if: (a) Lessee fails to pay Lessor the TRAC Amount after electing to purchase the Equipment in accordance with Section " +
                            "1 of this Addendum; (b) Lessee fails to return the Equipment if required pursuant to Section 2 of this Addendum; or (c) Lessor does not receive any " +
                            "amounts owed by Lessee pursuant to Section 2 of this Addendum within three (3) days of the date requested by Lessor. 4. <b>Lessee Representations</b>. " +
                            "Lessee represents and warrants to Lessor that: (a) each item of Equipment leased pursuant to the Lease is a 'motor vehicle' as such term is used in " +
                            "Internal Revenue Code Section 7701(h); (b) this Addendum is a 'terminal rental adjustment clause' as such term is used in Code Section 7701(h); and (c) " +
                            "the Lease and this Addendum constitute a 'qualified motor vehicle operating agreement' as such term is used in said Section 7701(h).<br/><br/>" +
                            "<b>IN WITNESS WHEREOF</b>, the parties have caused this Addendum to be executed as of the date of the Lease." +
                            "</td>" +
                            "</tr>" +
                            "</table>";
        
                            Html += "<table align='center' width='95%' margin-top='5' font-style = 'italic'>" +
                            "<tr style='font-size:12px'>" +
                            "<td  border-collapse = 'collapse' border-right ='.25' border-left ='.25' border-top ='.25'   >" +
                            "<table width='100%'>" +
                            "<tr style='font-size:8px' ><td><b>LESSEE (Authorized Agent or as Individual) &amp; Co-Signer</b></td></tr>" +
                            "<tr><td>" + Customer + "</td></tr>" +
                            "</table>" +
                            "</td>" +
                            "<td border-collapse = 'collapse'   border-right ='.25' border-top ='.25'>" +
                            "<table width='100%'  >" +
                            "<tr style='font-size:8px' ><td><b>LESSOR</b></td></tr>" +
                            "<tr><td></td></tr>" +
                            "</table>" +
                            "</td>" +
                            "</tr>" +
        
                            "<tr style='font-size:8px'>" +
                            "<td  border-collapse = 'collapse' border-right ='.25' border-left ='.25' border-top ='.25'   border-bottom ='.25' >" +
                            "<table width='100%'>" +
                            "<tr style='font-size:8px' ><td><b>SIGNATURE (Lessee &amp; Co-Signer)</b></td><td><b>Title</b></td><td><b>Date</b></td></tr>" +
                            "<tr><td style='font-size:4.7px' padding-top='-5px'>DocuSignedBy:</td><td style='font-size:10px'></td><td style='font-size:10px'>" + currentdate + "</td></tr>" +
                            // "<tr><td style='font-size:10px'>Godfrey</td><td></td><td></td></tr>" +
                            "</table>" +
                            "</td>" +
                            "<td  border-collapse = 'collapse' border-right ='.25' border-left ='.25' border-top ='.25' border-bottom ='.25'   >" +
                            "<table width='100%'>" +
                            "<tr style='font-size:8px' ><td><b>SIGNATURE</b></td><td><b>Title</b></td><td><b>Date</b></td></tr>" +
                            "<tr><td style='font-size:4.7px' padding-top='-5px'>DocuSignedBy:</td><td style='font-size:10px'></td><td style='font-size:10px'>" + currentdate + "</td></tr>" +
                            // "<tr><td style='font-size:10px'>Matt</td><td></td><td></td></tr>" +
                            "</table>" +
                            "</td>" +
                            "</tr>" +
        
                            "</table>";
        
                        Html += "<table style='font-size:11px' align='center' width='95%' padding-top='8px' >" +
                            "<tr>" +
                            "<td align='center'>" +
                            "<b>TRAC CERTIFICATE</b>" +
                            "</td>" +
                            "</tr>" +
                            "</table>";
        
                        Html += "<table style='font-size:11px' align='center' width='95%' padding-top='10px' >" +
                            "<tr>" +
                            "<td>" +
                            "Pursuant to the requirements of Section 7701(h) of the Internal Revenue Code Lessee hereby certifies under penalty of perjury under the laws of " +
                            "the United States of America that the following is true and correct: (1) Lessee intends that more than 50% of the use of the Equipment is to be in a " +
                            "trade or business of the Lessee; and (2) Lessee acknowledges that Lessee has been advised by Lessor that Lessee will not be treated as the owner of " +
                            "the Equipment for federal income tax purposes." +
                            "</td>" +
                            "</tr>" +
                            "</table>";
        
                            Html += "<table align='right'>" +
                            "<tr>" +
                                "<td style='font-size:13px;'>LESSEE:</td>" +
                                "<td></td>" +
                            "</tr>" +
                            "<tr>" +
                                "<td style='font-size:11px;'></td>" +
                                "<td></td>" +
                            "</tr>" +
                            "<tr>" +
                                "<td style='font-size:11px;' align='center'>By:</td>" +
                                "<td style='font-size:11px; border-bottom: .25px solid black;'></td>" +
                            "</tr>" +
                            "<tr>" +
                                "<td style='font-size:11px;' align='center'>Name:</td>" +
                                "<td style='font-size:11px; border-bottom: .25px solid black;'>" + Customer + "</td>" +
                            "</tr>" +
                            "<tr>" +
                                "<td style='font-size:11px;' align='center'>Title:</td>" +
                                "<td style='font-size:11px; border-bottom: .25px solid black;'>Director</td>" +
                            "</tr>" +
                        "</table>";
                
                            
                           
    
                    //page break///
                    Html += "<p style='page-break-after: always;'>&nbsp;</p>";
    
                    Html += "<table style='font-size:13px' align='center' width='95%' padding-top='20px' >" +
                        "<tr>" +
                        "<td  align='center'><b>Authorization for Recurring Automatic Debit</b></td>" +
                        "</tr>" +
                        "</table>";
    
                    Html += "<table style='font-size:13px' align='center' width='85%' padding-top='20px' >" +
                        "<tr>" +
                        "<td  align='center'>" +
                        "Signing up for automatic debits to pay your LRM Leasing, Inc. (“LRM”) payments is a free service and " +
                        "easy. Review the Terms &amp; Conditions, complete all sections of the form, sign and date." +
                        "</td>" +
                        "</tr>" +
                        "</table>";
    
    
    
                    Html += "<table style='font-size:13px' align='center' width='85%' padding-top='20px' >" +
                        "<tr>" +
                        "<td  align='left'><b>Section 1: Customer Information</b></td>" +
                        "</tr>" +
                        "</table>";
    
                    Html += "<table style='font-size:13px' align='center' width='85%' padding-top='20px' >" +
                        "<tr>" +
                        "<td  border-left='.25' border-right='.25'  border-top='.25' align='left'>Customer Name</td>" +
                        "</tr>" +
                        "<tr>" +
                        "<td   border-left='.25' border-right='.25' align='left' >" + Customer + "</td>" +
                        "</tr>" +
                        "<tr>" +
                        "<td  border-left='.25' border-right='.25'  border-top='.25' align='left'>Financial Institution Name</td>" +
                        "</tr>" +
                        "<tr>" +
                        "<td  border-left='.25' border-right='.25' align='left'></td>" +
                        "</tr>" +
                        "<tr>" +
                        "<td  border-left='.25' border-right='.25'  border-top='.25' align='left'>Financial Institution Routing Number</td>" +
                        "</tr>" +
                        "<tr>" +
                        "<td  border-left='.25' border-right='.25' align='left'></td>" +
                        "</tr>" +
                        "<tr>" +
                        "<td  border-left='.25' border-right='.25'  border-top='.25' align='left'>Name(s) As Shown On Account</td>" +
                        "</tr>" +
                        "<tr>" +
                        "<td border-left='.25' border-right='.25' align='left'>" + CustomerCompany + "</td>" +
                        "</tr>" +
                        "<tr>" +
                        "<td  border-left='.25' border-right='.25'  border-top='.25' align='left'>Account Number</td>" +
                        "</tr>" +
                        "<tr>" +
                        "<td border-left='.25' border-right='.25' align='left' border-bottom='.25' ></td>" +
                        "</tr>" +
                        "</table>";
    
                    Html += "<table style='font-size:13px' align='center' width='85%' padding-top='20px' >" +
                        "<tr>" +
                        "<td  align='left'><b>***ATTACH A VOIDED CHECK***</b></td>" +
                        "</tr>" +
                        "</table>";
    
                    Html += "<table style='font-size:13px' align='center' width='85%' padding-top='20px' >" +
                        "<tr>" +
                        "<td  align='left'><b>Authorization for Automatic Debit Draft</b></td>" +
                        "</tr>" +
                        "</table>";
    
                    Html += "<table style='font-size:13px' align='center' width='85%' padding-top='10px' >" +
                        "<tr>" +
                        "<td  align='left'>" +
                        "I <u>" + Customer + "</u> authorize LRM to charge my bank account as specified above for the"+
                        "amounts, frequency, and dates outlined in the “Terms” of your Motor Vehicle Lease Agreement (the"+
                         "“Agreement”). Additionally, I authorize LRM to adjust the draft amount or frequency to cover any"+

                        "other amounts due under the Agreement, including but not limited to: failed ACH drafts, non-"+
                        "sufficient funds fees, collateral protective coverage fees, personal property taxes, state and local taxes,"+

                         "late fees, and any other charges assessed and owed to LRM. This authorization shall remain in effect"+
                        "until the termination of the Agreement or until I provide written notice of cancellation, subject to the"+
                        "terms of the Agreement. " +
                        "</td>" +
                        "</tr>" +
                        "</table>";
    
                    Html += "<table style='font-size:13px' align='center' width='85%' padding-top='20px' >" +
                        "<tr>" +
                        "<td  align='left'><b>Signature</b></td>" +
                        "</tr>" +
                        "</table>";
    
                        Html += "<table style='font-size:13px; width:85%; margin-top:10px;' align='center'>" +
                        "<tr>" +
                            "<td align='left'>" +
                              "By signing below, I acknowledge that I have reviewed the Automatic Debit Authorization Terms  and "+
"Conditions. I authorize LRM to initiate debit entries to the financial institution specified above for the"+
"amounts owed to LRM in accordance with the Agreement including but not limited to, any past due"+
"payments, tolls, fees, or other charges to your account. I understand that this authorization will remain"+
"in effect until (1) all payments required by the Agreement are satisfied or (2) LRM receives and"+
"approves my written request to revoke this authorization. I understand that LRM may attempt to"+
"process a failed charge within (5) five business days and that I am responsible for any additional fees"+
"due to failed ACH transactions. I certify that I am an authorized user of this bank account and will not"+
"dispute these transactions with my financial institution, provided they comply with US law." + 
                            "</td>" +
                        "</tr>" +
                    "</table>";
            
    
                    Html += "<table style='font-size:13px' align='center' width='85%' padding-top='10px' >" +
                        "<tr>" +
                        "<td>________________________</td>" +
                        "</tr>" +
                        
                        "<tr>" +
                        "<td>Customer Signature</td>" +
                        "</tr>" +
                        "</table>";
    
                    Html += "<table style='font-size:13px' align='center' width='85%' padding-top='-44px' padding-left='270px' >" +
                        "<tr>" +
                        "<td><u>" + currentdate + "</u></td>" +
                        "</tr>" +
                        "<tr>" +
                        "<td>Date</td>" +
                        "</tr>" +
                        "</table>";
    
                    //page break///
                    Html += "<p style='page-break-after: always;'>&nbsp;</p>";
               
                    Html += "<table style='font-size:13px' align='center' width='95%' padding-top='10px' >" +
                        "<tr>" +
                        "<td align='center' ><b>Automatic Debit Authorization Terms &amp; Conditions</b></td>" +
                        "</tr>" +
                        "</table>";
    
                    Html += "<table style='font-size:13px' align='center' width='95%' padding-top='10px' >" +
                        "<tr>" +
                        "<td  ><b>Payment Information</b></td>" +
                        "</tr>" +
                        "</table>";
                    Html += "<table style='font-size:13px' align='center' width='95%' padding-top='10px' >" +
                        "<tr>" +
                        "<td  >" +
                        "Automatic payments will begin with the next unbilled statement cycle after LRM receives the completed"+
                        "form. If automatic payments cannot be established due to issues such as an incorrect routing number,"+
                        "LRM will contact you. Until automatic payments are set up, you are responsible for making all"+
                         "payments owed manually. " +
                        "<br/><br/>" +
                        "If a payment due date falls on a weekend or holiday, payments will be executed on the next business day." +
                        "<br/><br/>" +
                        "</td>" +
                        "</tr>" +
                        "</table>";
    
                    Html += "<table style='font-size:13px' align='center' width='95%' padding-top='5px' >" +
                        "<tr>" +
                        "<td  ><b>Fee Assessments</b></td>" +
                        "</tr>" +
                        "</table>";
    
                    Html += "<table style='font-size:13px' align='center' width='95%'  >" +
                        "<tr>" +
                        "<td  >" +
                        "If LRM is unable to deduct a payment, you are still responsible for the payment that is owed. You will"+
                        "receive notification that the automatic debit failed and are responsible for making any past due"+
                        "payments, including any and all fees, taxes, or other charges. Returned payments will incur a $50 fee"+
                        "(subject to change) and 10% late if payments owed are not received by the end of the grace period as"+
                        "outlined in your Agreement. " +
                       
                        "</td>" +
                        "</tr>" +
                        "</table>";
    
                    Html += "<table style='font-size:13px' align='center' width='95%' padding-top='20px' >" +
                        "<tr>" +
                        "<td  ><b>Cancellation of Automatic Debits</b></td>" +
                        "</tr>" +
                        "</table>";
    
    
                    Html += "<table style='font-size:13px' align='center' width='95%'  >" +
                        "<tr>" +
                        "<td  >" +
                        "LRM must be notified at least three(3) business days prior to the due date or specified draft date by " +
                        "emailing or calling using the contact information below.<br/><br/>" +
                       
                        "</td>" +
                        "</tr>" +
                        "</table>";

                        Html += "<table style='font-size:13px' align='center' width='95%' padding-top='20px' >" +
                        "<tr>" +
                        "<td  ><b>Termination of Service</b></td>" +
                        "</tr>" +
                        "</table>";

                        
                    Html += "<table style='font-size:13px' align='center' width='95%'  >" +
                    "<tr>" +
                    "<td  >" +
                    "LRM may terminate automatic debits at any time for reasons including but not limited to: account"+
                    "closure, frozen account status, and returned payments due to non-sufficient funds."+
                    "</td>" +
                    "</tr>" +
                    "</table>";
    
    
                    Html += "<table style='font-size:13px' align='center' width='95%' padding-top='10px' >" +
                        "<tr>" +
                        "<td align='center' ><b>Contact Information</b></td>" +
                        "</tr>" +
                        "</table>";
    
                    Html += "<table style='font-size:13px' align='center' width='95%' padding-top='20px' >" +
                        "<tr>" +
                        "<td  >Should you have any questions, LRM's payment department can be reached by any of the following methods:</td>" +
                        "</tr>" +
                        "</table>";
    
    
                    Html += "<table style='font-size:13px' align='left' width='95%' padding-top='20px' >" +
                        "<tr>" +
                        "<td  ><b>Email: payments@lrmleasing.com</b></td>" +
                        "</tr>" +
                        "</table>";
                    Html += "<table style='font-size:13px' align='left' width='95%' padding-top='10px' >" +
                        "<tr>" +
                        "<td  ><b>Telephone:</b> (954) 791-100</td>" +
                        "</tr>" +
                        "</table>";
    
                    //page break///
                    Html += "<p style='page-break-after: always;'>&nbsp;</p>";
    
                    Html += "<table style='font-size:13px' align='center' width='85%' padding-top='10px' >" +
                        "<tr>" +
                        "<td  align='center'>" +
                        "<b>Title Transfer</b>" +
                        "</td>" +
                        "</tr>" +
                        "</table>";
    
                    Html += "<table style='font-size:13px' align='center' width='85%' padding-top='50px' >" +
                        "<tr>" +
                        "<td  align='left'>" +
                        "It is hereby acknowledged and agreed that upon the maturity of the lease agreement and once the purchase option has " +
                        "been satisfied for the below listed vehicle, the title will be transferred and signed over to:" + CustomerCompany  +
                        "</td>" +
                        "</tr>" +
                        "</table>";
    
                    Html += "<table style='font-size:11px' align='center' width='85%' padding-top='30px' >" +
                        "<tr>" +
                        "<td  align='left'>" +
                        "Name of Individual or Company on the Lease Agreement:" +
                        "</td>" +
                        "</tr>" +
                        "<tr>" +
                        "<td  align='left'>" +
                        "___________________________________________" +
                        "</td>" +
                        "</tr>" +
                        "</table>";
    
                    Html += "<table style='font-size:13px' align='center' width='85%' padding-top='40px' >" +
                        "<tr>" +
                        "<td  align='left'>" +
                        "I understand that this decision cannot be changed for any reason whatsoever x_______" +
                        "</td>" +
                        "</tr>" +
       
                        "</table>";

                        Html += "<hr style='width: 100%; border: 1px solid black;' />";

                        Html += "<table style='font-size:11px' align='center' width='95%' >" +
                        "<tr>" +
                        "<td  align='center'>Leased Vehicle or Equipment—VIN #, Serial #, or Other Iden-fica-on</td>" +
                        "</tr>" +
                        "</table>";
                        Html += "<table align='center' width='100%' style='padding-top:8px; margin-left:15px; border-collapse: collapse;'>" +
                        "<tr style='font-size:12px; width:100%; text-align:left;'>" +
                            "<td>Year:</td>" +
                            "<td style='border-bottom: 1px solid black; width: 50px;'>" + (Year || "&nbsp;") + "</td>" +
                            "<td>Make:</td>" +
                            "<td style='border-bottom: 1px solid black; width: 100px;'>" + (Brand || "&nbsp;") + "</td>" +
                            "<td>Model:</td>" +
                            "<td style='border-bottom: 1px solid black; width: 100px;'>" + (Model || "&nbsp;") + "</td>" +
                            "<td>Transmission:</td>" +
                            "<td style='border-bottom: 1px solid black; width: 120px;'>" + (Type || "&nbsp;") + "</td>" +
                            "<td>Color:</td>" +
                            "<td style='border-bottom: 1px solid black; width: 100px;'>" + (ModelClr || "&nbsp;") + "</td>" +
                        "</tr>" +
                        "</table>";
         
                        //**************** */
                        Html += "<table style='font-size:12px; padding-top:30px; margin-left:15px;'>" +
                             "<tr>" +
                             "<td >VEHICLE IDENTIFICATION NUMBER: </td>"+
                             "<td style='border-bottom: 1px solid black; width: 100px;'>"+VinNo+"</td>"+
                             "</tr>" +
                             "</table>";
     
                         Html += "<hr style='width: 100%; border: 1px solid black;' />";
    
                   
    
                    Html += "<table style='font-size:13px' align='center' width='85%' padding-top='30px' >" +
                        "<tr>" +
                        "<td>Print: <u>" + Customer + "</u></td><td>Sign:_________________________________</td>" +
                        "</tr>" +
                        "</table>";
                    Html += "<table style='font-size:13px' align='center' width='85%' >" +
                        "<tr>" +
                        "<td>Individually</td>" +
                        "</tr>" +
                        "</table>";
    
                    Html += "<table style='font-size:13px' align='center' width='85%' padding-top='15px' >" +
                        "<tr>" +
                        "<td>Date: <u>" + currentdate + "</u></td>" +
                        "</tr>" +
                        "</table>";
    
    
                    Html += "<table style='font-size:13px' align='center' width='85%' padding-top='100px' >" +
                        "<tr>" +
                        "<td>Print: <u>" + Customer + "</u></td><td>Sign:_________________________________</td>" +
                        "</tr>" +
                        "</table>";
                    Html += "<table style='font-size:13px' align='center' width='85%'  >" +
                        "<tr>" +
                        "<td>Authorized agent of the company</td>" +
                        "</tr>" +
                        "</table>";
    
                    Html += "<table style='font-size:13px' align='center' width='85%' padding-top='15px' >" +
                        "<tr>" +
                        "<td>Date: <u>" + currentdate + "</u></td>" +
                        "</tr>" +
                        "</table>";
    
                    // footer>>
    
                    htmlFooter += "<table align='right'> " +
                        "<tr>" +
                        "<td style='font-size:4px' align='right' margin-right='22' >DS</td>" +
                        "</tr>" +
                        "<tr>" +
                        "<td style='font-size:12px' >LESSEE INITIALS ________</td>" +
                        "</tr>" +
                        "</table>";
    
                    HTMLObj.defaultValue = Html;
    
                    var xmlStr = "<?xml version=\"1.0\"?>\n<!DOCTYPE html PUBLIC \"-//big.faceless.org//report\" \"report-1.1.dtd\">\n";
                    xmlStr += "<pdf>";
                    xmlStr += "<head>";
                    
                    xmlStr += "<meta name='title' value='LEASE AGREEMENT'/>";
                    xmlStr += "<meta charset='utf-8' />";
                    xmlStr += "<macrolist>" +
                        "<macro id='myheader'>";
                    // xml += '<table align="center" width="100%" style="display:none;" > <tr> <td align="center">' + htmlHeader + '</td> </tr></table>';
                    xmlStr += "";
                    xmlStr += htmlHeader;
                    xmlStr += "</macro>";
                    xmlStr += '<macro id="myfooter">';
    
                    // xmlStr+='<table align="center" width="100%"  > <tr> <td align="center">'+htmlFooter+'</td> </tr></table>';
                    xmlStr += htmlFooter;
                    xmlStr += "</macro>";
                    xmlStr += "</macrolist>"
                    xmlStr += "</head>";
                    xmlStr += "<body size='A4' class='text' header='myheader' header-height='3.0cm' footer='myfooter' footer-height='1cm'  style='margin-top:-10mm; margin-right:-5mm; margin-left:-10mm; margin-bottom:-10mm;'>";
                    xmlStr += Html;
                    xmlStr += "</body>";
                    xmlStr += "</pdf>";
        
                    var Renderer = render.create();
                    Renderer.templateContent = xmlStr;
    
                    var Newfile = Renderer.renderAsPdf();
                    Newfile.name = "PDF_TITLE.PDF";
                    context.response.writeFile(Newfile, true);
                } else {
    
                }
    
            }
    
            return { onRequest }
        });