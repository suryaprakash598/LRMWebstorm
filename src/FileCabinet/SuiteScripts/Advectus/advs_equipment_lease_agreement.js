/**
 * @NApiVersion 2.x
 * @NScriptType Suitelet
 * @NModuleScope SameAccount
 */
 define(['N/render', 'N/file', 'N/https','N/record'],

 function(render, file, https, record) {
    
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
  
     //    if (request.method === https.Method.GET) {

             var recordID = request.parameters.recId;
             var isBase64 = request.parameters.baseSixtyFour;
             var recordType = 'customrecord_advs_lease_header';
             var recordTemplate = 'SuiteScripts/advs ftl/advs_equipment_lease_agreement.ftl';
               //advs_equipment_lease_agreement.ftl';
				log.debug('Id is', recordID);

                var recordData = record.load({
                    type: recordType,
                    id: recordID
                });
             var renderer = render.create();
             
             var data = file.load(recordTemplate).getContents();
             renderer.templateContent = data;
     
             renderer.addRecord({
                templateName: 'record',
                record: recordData
            });


			log.debug('isBase64'+isBase64, (!isBase64));
             if(!isBase64){
            	 
             
             var newfile = renderer.renderAsPdf();
             var printTitle = 'Lease';
             var tranId = 'Agreement';
 
             newfile.name = printTitle + ' #' + tranId + ".pdf";
             response.addHeader({
                 name:'Content-Type:',
                 value: 'application/pdf'
             });
             response.addHeader({
                 name: 'Content-Disposition',
                 value: 'inline; filename='+ newfile
             });
 
             renderer.renderPdfToResponse(response);
             }else{
            	 
            	 var newfile = file.load(4639)//renderer.renderAsPdf();
                 var printTitle = 'Lease';
                 var tranId = 'Agreement';
     
                 //newfile.name = printTitle + ' #' + tranId + ".pdf";
//                 response.addHeader({
//                     name:'Content-Type:',
//                     value: 'application/octet-stream;base64'
//                    	 
//                 });
                 
//            	 var fileReader = new FileReader();
//                 var b = new Buffer(newfile);
//               If we don't use toString(), JavaScript assumes we want to convert the object to utf8.
//               We can make it convert to other formats by passing the encoding type to toString().
//              var s = b.toString('base64');
            	response.write(newfile.getContents());
                // renderer.renderPdfToResponse(response);
             }
 
//         } 
     }
 
     return {
         onRequest: onRequest
     };
     
 });