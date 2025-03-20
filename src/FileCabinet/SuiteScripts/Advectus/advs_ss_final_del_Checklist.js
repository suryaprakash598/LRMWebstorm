/**
 * @NApiVersion 2.x
 * @NScriptType Suitelet
 * @NModuleScope SameAccount
 */
define(['N/render', 'N/log', 'N/file', 'N/https', 'N/xml', 'N/record','N/email','N/ui/serverWidget', 'N/runtime','N/search'],

function(render, log, file, https, xml, record, email, serverWidget, runtime,search) {       
   
	/**
	 * Definition of the Suitelet script trigger point.
	 *
	 * @param {Object} context
	 * @param {ServerRequest} context.request - Encapsulation of the incoming request
	 * @param {ServerResponse} context.response - Encapsulation of the Suitelet response
	 * @Since 2015.2
	 */
	function onRequest(context) {
		var request = context.request;
		var response = context.response; 
 
		if (request.method === https.Method.GET) {
			var recordID = request.parameters.requestID;
			var from = request.parameters.from;
			log.debug('Record Id is' + recordID);
			var recordType = 'customrecord_advs_lease_header';
			
			var recordTemplate = '/SuiteScripts/advs ftl/advs_customer_final_del_checklist.ftl';

			//var renderer = render.create();
			var data = file.load(recordTemplate).getContents();
			//renderer.templateContent = data;
			
			var Renderer = render.create();
				Renderer.templateContent = data;

            var RecordObj = record.load({
                type: recordType,
                id: recordID
            });

            var leaseName = RecordObj.getText('custrecord_advs_l_h_customer_name');
            log.debug("leaseName" +  leaseName);
            var yearVal   = RecordObj.getValue('custrecord_advs_lease_su_vin_year');
            log.debug("YearVal" +  yearVal);


			var invoiceRecord = record.load({
				type: recordType,
				id:recordID
			});

			var tranId = invoiceRecord.getValue({
				fieldId: 'tranid'
			});
            log.debug("tranId",tranId); 
			
			var tranIdname = invoiceRecord.getValue({
				fieldId: 'name'
			});
            log.debug("tranId",tranId); 

            var subsidiaryVal = invoiceRecord.getValue({
				fieldId: 'custrecord_advs_l_h_subsidiary'
			});     
            var subsirec  = record.load({
				type: 'subsidiary',
				id:subsidiaryVal
			});
            
            var Logoid = subsirec.getValue({
				fieldId: 'custrecord_advs_sub_logo_with_year'
			});
            log.debug("Logoid",Logoid); 

            var fileObj = file.load({
                id: Logoid
            });
           var Imagewith1980 = fileObj.url;

             Imagewith1980 = xml.escape({
                xmlText: Imagewith1980
            });
            log.debug("Imagewith1980",Imagewith1980); 
            var LogoData = {
                "logourl" : Imagewith1980
            }
            Renderer.addCustomDataSource({
                format : render.DataSource.OBJECT,
                alias : "LOGO",
                data : LogoData
            });
			
			Renderer.addRecord({
				templateName: 'record',
				record: invoiceRecord
			});

			if(from==1){
				var newfile = Renderer.renderAsPdf();
				var printTitle = 'Perform_Invoice';
				var tranId = tranId;

				newfile.name = printTitle + ' #' + tranId + ".pdf";
				response.addHeader({
					name:'Content-Type:',
					value: 'application/pdf'
				});
				response.addHeader({
					name: 'Content-Disposition',
					value: 'inline; filename='+ newfile
				});
					 
                    context.response.writeFile(newfile, true);
					
			}else{
					var newfile = Renderer.renderAsPdf();
                 var printTitle = 'Perform_Invoice';
                 //var tranId = tranId;
					newfile.name = printTitle + ' #' + tranIdname +' ' + recordID +".pdf";
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
                    log.error("fileId",fileId)
					var _ld_fil	=	file.load({id:fileId});
				var totalBytes	=	_ld_fil.size*1;

				if(totalBytes < 1000000){
					var _size = Math.floor(totalBytes/1000) + ' KB';

				}else{
					var _size = Math.floor(totalBytes/1000000) + ' MB';  

				}
            	//context.response.write(newfile.getContents()); 
				var rec_n = record.create({type:'customrecord_echosign_agreement',isDynamic:!0});
			 var leaseemail = search.lookupFields({type:'customrecord_advs_lease_header',id:recordID,columns:['custrecord_advs_l_h_email','name']});
				var name	=	"Agreement for "+leaseemail.name+"";
				rec_n.setValue({fieldId:'name',value:name,ignoreFieldChange:true}); 
				rec_n.setValue({fieldId:'custrecord_echosign_parent_type',value:'customrecord_advs_lease_header',ignoreFieldChange:true}); 
				rec_n.setValue({fieldId:'custrecord_echosign_parent_record',value:recordID,ignoreFieldChange:true}); 
				 
				rec_n.selectNewLine({sublistId:'recmachcustrecord_echosign_agreement'});
				rec_n.setCurrentSublistValue({sublistId:'recmachcustrecord_echosign_agreement',fieldId:'custrecord_echosign_file',value:fileId,ignoreFieldChange:true});
				rec_n.setCurrentSublistValue({sublistId:'recmachcustrecord_echosign_agreement',fieldId:'custrecord_echosign_file_size',value:_size,ignoreFieldChange:true});
				rec_n.commitLine({sublistId:'recmachcustrecord_echosign_agreement'}); 
				var dd_i	=rec_n.save();
				 
				 log.debug('dd_i',dd_i);
				  
				 
				  var s_rec	= record.create({type:'customrecord_echosign_signer',isDynamic:!0});
				 s_rec.setValue({fieldId:'custrecord_echosign_signer',value:236,ignoreFieldChange:true}); 
				 s_rec.setValue({fieldId:'custrecord_echosign_agree',value:dd_i,ignoreFieldChange:true}); 
				 s_rec.setValue({fieldId:'custrecord_echosign_email',value:leaseemail.custrecord_advs_l_h_email,ignoreFieldChange:true}); 
				 s_rec.setValue({fieldId:'custrecord_echosign_role',value:1,ignoreFieldChange:true}); 
				 s_rec.setValue({fieldId:'custrecord_echosign_entityid',value:leaseemail.name,ignoreFieldChange:true}); 
				 var dd_i1	=s_rec.save();
				 log.debug('dd_i1',dd_i1);
				 
				try{
					var onclickScript=" <html><body> <script type='text/javascript'>" +
				"try{debugger;" ; 
				onclickScript+="debugger;var dd_i ="+dd_i+";"; 
				onclickScript+="window.open('https://8760954.app.netsuite.com/app/common/custom/custrecordentry.nl?id="+dd_i+"&rectype=953&whence=','_self');";
				//onclickScript+="window.close();;";
				onclickScript+="}catch(e){alert(e+'   '+e.message);}</script></body></html>";
				context.response.write(onclickScript);
				
				}catch(e)
					{
						log.debug('error in file creation',e.toString());
					} 
			 
			 
                        //context.response.renderPdf(xmlStr);
					
					 
				}
				

		} 
	}

	return {
		onRequest: onRequest
	};
	
});