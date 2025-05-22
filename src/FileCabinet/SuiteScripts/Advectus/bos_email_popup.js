/**
 * @NApiVersion 2.x
 * @NScriptType Suitelet
 */
define(['N/ui/serverWidget', 'N/search', 'N/email', 'N/runtime','N/file','N/render','N/record','N/redirect'],
    function(serverWidget, search, email, runtime,file,render,record,redirect) {

        function onRequest(context) {
            if (context.request.method === 'GET') {
               var _v_pifid = context.request.parameters.pifid;
               var _emailtemplatedata =  getRequiredData(_v_pifid);
               log.error('_v_pifid',_v_pifid);

                // Run the search to get the email template
                var emailBody = '';
                var templateSearch = search.create({
                    type: "customrecord_bos_email_template",
                    filters: [["isinactive", "is", "F"]],
                    columns: ["custrecord_email_template_body"]
                });

                var result = templateSearch.run().getRange({ start: 0, end: 1 })[0];
                if (result) {
                    emailBody = result.getValue("custrecord_email_template_body").toString();
                }
                emailBody = emailBody.replace('@LESSEENAME@',_emailtemplatedata[0].lesseeName);
                emailBody = emailBody.replace('@LESSEENAME@',_emailtemplatedata[0].lesseeName);
                emailBody = emailBody.replace('@VIN@',_emailtemplatedata[0].vinText);
                // Build the form
                var form = serverWidget.createForm({ title: 'Send Email Using Template' });
                form.addField({
                    id: 'custpage_email_pif_id',
                    type: serverWidget.FieldType.TEXT,
                    label: 'PIF Id'
                }).updateDisplayType({ displayType: serverWidget.FieldDisplayType.HIDDEN }).defaultValue = _v_pifid
                form.addField({
                    id: 'custpage_email_body',
                    type: serverWidget.FieldType.LONGTEXT,
                    label: 'Email Body'
                }).updateDisplayType({ displayType: serverWidget.FieldDisplayType.INLINE }).defaultValue = emailBody;
               /* var Customer_Initials 	= '{{Int_es_:signer1:signature}}';
                var sign_ ='';
                sign_ ='<u>'+Customer_Initials+'</u>';*/
                form.addSubmitButton({ label: 'Send Email' });

                context.response.writePage(form);

            } else {

                // POST: Send the email
                var submittedEmailBody = context.request.parameters.custpage_email_body;
                var _v_pifid = context.request.parameters.custpage_email_pif_id;
                var _emailtemplatedata =  getRequiredData(_v_pifid);
                var emailBody = '';
                var templateSearch = search.create({
                    type: "customrecord_bos_email_template",
                    filters: [["isinactive", "is", "F"]],
                    columns: ["custrecord_email_template_body"]
                });

                var result = templateSearch.run().getRange({ start: 0, end: 1 })[0];
                if (result) {
                    emailBody = result.getValue("custrecord_email_template_body").toString();
                }
                var Html = "";
                var htmlHeader = " ";
                var htmlFooter = " ";
                var Customer_Initials 	= '{{Int_es_:signer1:signature}}';
                var sign_ ='';
                sign_ ='<u>'+Customer_Initials+'</u>';

              var customer_signinitials =  '{{Int_es_:signer1:initials}}';
              var initial_ ='';
                initial_ ='<u>'+customer_signinitials+'</u>';
                Html +="<table style='width: 100%'>"+
                    "<tr>"+
                        "<td align='center'><b>Bill of Sale</b></td>"+
                    "</tr>"+

                    "<tr>"+
                    "<td >LRM Leasing Company Inc.<br /> 2160 Blount Road <br /> Pompano Beach FL 33069</td>"+
                    "</tr>"+

                    "<tr>"+
                    "<td style='margin-top: 20px;' >Sold to: <b>"+_emailtemplatedata[0].lesseeName +"</b></td>"+

                    "</tr>"+

                    "<tr>"+
                    "<td >Date of Sale: <b>"+_emailtemplatedata[0].bosDate +"</b></td>"+

                    "</tr>"+

                    "<tr>"+
                    "<td style='margin-top: 20px;'>Address: <br /> * PLEASE NOTE THE ADDRESS BELOW IS WHERE TITLE WILL BE SENT X____<u>"+initial_+"</u> (lessee puts initials)</td>"+
                    "</tr>"+

                    "<tr>"+
                    "<td style='margin-top: 20px;'>Address: [CUSTOMER TO EDIT DIRECTLY IN ADOBE]</td>"+
                    "</tr>"+
                    "</table>"+

                    "<table style='width: 100%'>"+
                    "<tr>"+
                    "<td width='10%' align='right' >City: </td>"+
                    "<td width='20%' style='border-bottom: 1px solid black;'> "+_emailtemplatedata[0].lesseeCity+"</td>"+
                    "<td width='10%' align='right' >State: </td>"+
                    "<td width='20%' style='border-bottom: 1px solid black;'>"+_emailtemplatedata[0].lesseeState+" </td>"+
                    "<td width='10%' align='right' >Zip</td>"+
                    "<td width='20%' style='border-bottom: 1px solid black;'>"+_emailtemplatedata[0].lesseeZip+" </td>"+
                    "</tr>"+
                    "</table>"+

                    "<table style='width: 100%'>"+
                    "<tr>"+
                    "<td style='margin-top: 20px;'>I understand that I am purchasing this equipment, as-is, where is, and there are no <br /> warranties or guarantee of any kind. X_ <u>"+initial_+"</u> (lessee puts initials)</td>"+
                    "</tr>"+
                    "</table>"+

                    "<table style='width: 100%'>"+
                    "<tr style='margin-top: 20px;'>"+
                    "<td >Year: </td>"+  
                    "<td >"+_emailtemplatedata[0].vinYear+"</td>"+
                    "<td >Make: </td>"+
                    "<td >"+_emailtemplatedata[0].vinMake+"</td>"+
                    "<td >Vin:</td>"+
                    "<td >"+_emailtemplatedata[0].vinText+"</td>"+
                    "</tr>"+
                    "</table>"+
                    
                    "<table style='width: 100%'>"+
                    "<tr>"+
                    "<td style='margin-top: 20px;'>Sales Price: "+_emailtemplatedata[0].purchaseAmt+"</td>"+
                    "</tr>"+

                    
                    "<tr>"+
                    "<td >Sales Tax: "+_emailtemplatedata[0].salestax+"</td>"+
                    "</tr>"+

                    
                    "<tr>"+
                    "<td >Total Price:"+((_emailtemplatedata[0].purchaseAmt*1)+(_emailtemplatedata[0].salestax *1))+"</td>"+
                    "</tr>"+


                    "</table>"+

                    "<table style='width: 100%'>"+  
                    "<tr style='margin-top: 20px;'>"+
                    "<td  width='10%' >Seller: </td>"+  
                    "<td  width='35%'> LRM Leasing Company Inc.</td>"+
                    "<td  width='10%'></td>"+  
                    "<td  width='10%'> Buyer: </td>"+
                    "<td width='35%'>"+_emailtemplatedata[0].lesseeName +"</td>"+
                    "</tr>"+

                    "<tr >"+
                    "<td >Sign: </td>"+  
                    "<td style='border-bottom: 1px solid black;'></td>"+
                    "<td ></td>"+
                    "<td >Sign: <u>"+sign_+"</u></td>"+
                    "<td style='border-bottom: 1px solid black;'></td>"+
                    "</tr>"+

                    "<tr >"+
                    "<td >Date: </td>"+  
                    "<td style='border-bottom: 1px solid black;'></td>"+
                    "<td ></td>"+
                    "<td >Date: </td>"+
                    "<td style='border-bottom: 1px solid black;'></td>"+
                    "</tr>"+
                    "</table>";

                submittedEmailBody = emailBody;

                var xmlStr = "<?xml version=\"1.0\"?>\n<!DOCTYPE html PUBLIC \"-//big.faceless.org//report\" \"report-1.1.dtd\">\n";
                xmlStr += "<pdf>";
                xmlStr += "<head>";
                xmlStr +="<style type='text/css'>";
                xmlStr +="#page30, #page29, #page28, #page27, #page26 {"; //
                xmlStr +="header: empty-header !important;";
                xmlStr +=" header-height: 0px !important;";
                xmlStr +="}";
                xmlStr +="</style>";
                xmlStr += "<meta name='title' value='Bill of Sale'/>";
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

                //xmlStr += emailBody;
                xmlStr += Html;
                xmlStr += "</body>";


                xmlStr += "</pdf>";

                // log.error("xmlStr -> " + xmlStr);

                var Renderer = render.create();
                Renderer.templateContent = xmlStr;
                var newfile = Renderer.renderAsPdf();
                var printTitle = 'Bill of Sale';
                var tranId = 'Agreement';
                newfile.name = printTitle + ' #' + tranId  +".pdf";
                context.response.addHeader({
                    name:'Content-Type',
                    value: 'application/pdf'
                });
                context.response.addHeader({
                    name: 'Content-Disposition',
                    value: 'inline; filename='+ newfile.name
                });
                newfile.folder = -20;
                var fileId = newfile.save();
                log.error("fileId",fileId)
                var _ld_fil	=	file.load({id:fileId});

                var totalBytes	=	_ld_fil.size*1;

                if(totalBytes < 1000000){
                    var _size = Math.floor(totalBytes/1000) + ' KB';

                }else{
                    var _size = Math.floor(totalBytes/1000000) + ' MB';

                }
                var emailtosend ='';
                var emailName ='';
                //context.response.write(newfile.getContents());
                var rec_n = record.create({type:'customrecord_echosign_agreement',isDynamic:!0});
                var leaseemail = search.lookupFields({type:'customrecord_advs_paid_in_full',id:_v_pifid,columns:['custrecord_advs_lessee_name_pif']});
                if(leaseemail.custrecord_advs_lessee_name_pif[0].value){
                 var customerdetails =   search.lookupFields({type:'customer',id:leaseemail.custrecord_advs_lessee_name_pif[0].value,columns:['entityid','email']})
                emailtosend = customerdetails.email;
                emailName = customerdetails.entityid;

                }
                var name	=	"Agreement for "+emailName+"";
                rec_n.setValue({fieldId:'name',value:name,ignoreFieldChange:true});
                rec_n.setValue({fieldId:'custrecord_echosign_parent_type',value:'customrecord_advs_paid_in_full',ignoreFieldChange:true});
                rec_n.setValue({fieldId:'custrecord_echosign_parent_record',value:_v_pifid,ignoreFieldChange:true});

                rec_n.selectNewLine({sublistId:'recmachcustrecord_echosign_agreement'});
                rec_n.setCurrentSublistValue({sublistId:'recmachcustrecord_echosign_agreement',fieldId:'custrecord_echosign_file',value:fileId,ignoreFieldChange:true});
                rec_n.setCurrentSublistValue({sublistId:'recmachcustrecord_echosign_agreement',fieldId:'custrecord_echosign_file_size',value:_size,ignoreFieldChange:true});
                rec_n.commitLine({sublistId:'recmachcustrecord_echosign_agreement'});
                var dd_i	=rec_n.save();

                log.debug('dd_i',dd_i);



                var s_rec	= record.create({type:'customrecord_echosign_signer',isDynamic:!0});
                s_rec.setValue({fieldId:'custrecord_echosign_signer',value:236,ignoreFieldChange:true});
                s_rec.setValue({fieldId:'custrecord_echosign_agree',value:dd_i,ignoreFieldChange:true});
                s_rec.setValue({fieldId:'custrecord_echosign_email',value:emailtosend,ignoreFieldChange:true});
                s_rec.setValue({fieldId:'custrecord_echosign_role',value:1,ignoreFieldChange:true});
                s_rec.setValue({fieldId:'custrecord_echosign_entityid',value:emailName,ignoreFieldChange:true});
                var dd_i1	=s_rec.save();
                log.debug('dd_i1',dd_i1);

                redirect.toRecord({type:'customrecord_echosign_agreement',id:dd_i});

                try{
                    var onclickScript=" <html><body> <script type='text/javascript'>" +
                        "try{debugger;" ;
                    onclickScript+="debugger;var dd_i ="+dd_i+";alert(dd_i)";

                    onclickScript+="window.open('https://8760954.app.netsuite.com/app/common/custom/custrecordentry.nl?rectype=953&id="+dd_i+"&whence=','_blank');";

                    onclickScript+="window.close();;";
                    onclickScript+="}catch(e){alert(e+'   '+e.message);}</script></body></html>";
                    context.response.write(onclickScript);


                }catch(e)
                {
                    log.debug('error in file creation',e.toString());
                }
                // Send the email
                /*email.send({
                    author: runtime.getCurrentUser().id,
                    recipients: 'suryaprakash.m@advectus.net', //'suryaprakash.m@advectus.net', // Replace with actual recipient
                    subject: 'Automated Email from Suitelet',
                    body: 'Please find the attached bill of sale',
                    attachments:[_ld_fil]
                });

                // Confirmation form
                var form = serverWidget.createForm({ title: 'Email Sent Successfully' });

                form.addField({
                    id: 'custpage_info',
                    type: serverWidget.FieldType.INLINEHTML,
                    label: ' '
                }).defaultValue = '<div style="color: green;">The email has been sent successfully!</div>';

                context.response.writePage(form);*/
            }
        }
        function getRequiredData(pifid)
        {
            try
            {
                var customrecord_advs_paid_in_fullSearchObj = search.create({
                    type: "customrecord_advs_paid_in_full",
                    filters:
                        [
                            ["internalid","anyof",pifid],
                            "AND",
                            ["isinactive","is","F"]
                        ],
                    columns:
                        [
                            "custrecord_advs_lessee_name_pif",
                            search.createColumn({
                                name: "custrecord_advs_vm_model_year",
                                join: "CUSTRECORD_ADVS_PIF_VIN"
                            }),
                            search.createColumn({
                                name: "custrecord_advs_vm_vehicle_brand",
                                join: "CUSTRECORD_ADVS_PIF_VIN"
                            }),
                            search.createColumn({
                                name: "custentity_advs_city_indi",
                                join: "CUSTRECORD_ADVS_LESSEE_NAME_PIF"
                            }),
                            search.createColumn({
                                name: "custentityadvs_state_indiv",
                                join: "CUSTRECORD_ADVS_LESSEE_NAME_PIF"
                            }),
                            search.createColumn({
                                name: "custentity_advs_zip_indi",
                                join: "CUSTRECORD_ADVS_LESSEE_NAME_PIF"
                            }),
                            "custrecord_advs_pif_vin",
                            "custrecord_advs_purchase_pif",
                            "custrecord_advs_sales_tax_pif",
                            "custrecord_advs_pif_bos"
                        ]
                });
                var searchResultCount = customrecord_advs_paid_in_fullSearchObj.runPaged().count;
                log.debug("customrecord_advs_paid_in_fullSearchObj result count",searchResultCount);
                var emailreplacedata = [];
                customrecord_advs_paid_in_fullSearchObj.run().each(function(result){
                    // .run().each has a limit of 4,000 results
                    var obj={};
                    obj.vinText = result.getText('custrecord_advs_pif_vin')
                    obj.vinMake = result.getText({
                        name: "custrecord_advs_vm_vehicle_brand",
                        join: "CUSTRECORD_ADVS_PIF_VIN"
                    });
                    obj.vinYear = result.getText({
                        name: "custrecord_advs_vm_model_year",
                        join: "CUSTRECORD_ADVS_PIF_VIN"
                    });
                    obj.lesseeName = result.getText('custrecord_advs_lessee_name_pif');
                    obj.lesseeCity = result.getValue({
                        name: "custentity_advs_city_indi",
                        join: "CUSTRECORD_ADVS_LESSEE_NAME_PIF"
                    });
                    obj.lesseeState = result.getText({
                        name: "custentityadvs_state_indiv",
                        join: "CUSTRECORD_ADVS_LESSEE_NAME_PIF"
                    });
                    obj.lesseeZip = result.getValue({
                        name: "custentity_advs_zip_indi",
                        join: "CUSTRECORD_ADVS_LESSEE_NAME_PIF"
                    });
                    obj.salestax = result.getValue('custrecord_advs_sales_tax_pif');
                    obj.purchaseAmt = result.getValue('custrecord_advs_purchase_pif');
                    obj.bosDate = result.getValue('custrecord_advs_pif_bos');
                    emailreplacedata.push(obj);
                    return true;
                });
                return emailreplacedata;
            }catch (e){
                log.debug('error',e.toString());
            }
        }
        return {
            onRequest: onRequest
        };
    });