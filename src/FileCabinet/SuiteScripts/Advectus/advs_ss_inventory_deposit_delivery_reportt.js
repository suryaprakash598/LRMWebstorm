/**
 * @NApiVersion 2.x
 * @NScriptType Suitelet
 * @NModuleScope SameAccount
 */
define(['N/record', 'N/search', 'N/ui/serverWidget', 'N/runtime', 'N/file', 'N/encode','N/url'],
		/**
		 * @param {record} record
		 * @param {search} search
		 * @param {serverWidget} serverWidget
		 */
		function(record, search, serverWidget, runtime, file, encode,url) {

	/**
	 * Definition of the Suitelet script trigger point.
	 *
	 * @param {Object} context
	 * @param {ServerRequest} context.request - Encapsulation of the incoming request
	 * @param {ServerResponse} context.response - Encapsulation of the Suitelet response
	 * @Since 2015.2
	 */
	function onRequest(scriptContext) {
		var request = scriptContext.request;
		var response = scriptContext.response;
		if(request.method == "GET") {
			var form        = serverWidget.createForm({title:"Inventory Deposits Delivery ",hideNavBar:false});
            var fieldgroup  = form.addFieldGroup({id : 'fieldgroupid', label : 'Inventory Deposits Delivery'});
            
			var htmlFld  =  form.addField({id:"custpage_html", label:"Summary Info", type:serverWidget.FieldType.INLINEHTML});

			
		
            var html = "<table width = '100%' class =  'tablemain' ><tr>"+
            "<th><b>LOCATION</b></th>"+
            "<th><b>NAME</b></th>"+
            "<th><b>SALESMAN</b></th>"+
            "<th><b>ETA</b></th>"+
            "<th><b>DAYS TO CLOSE DEAL</b></th>"+
            "<th><b>INSURANCE APPLICATION</b></th>"+
            "<th><b>CLEARED FOR DELIVERY</b></th>"+
            "<th><b>VIN</b></th>"+
            "<th><b>TRUCK READY</b></th>"+
            "<th><b>WASHED</b></th>"+
            "<th><b>TOTAL LEASE INCEPTION</b></th>"+
            "<th><b>DEPOSIT</b></th>"+
            "<th><b>P/U PAYMENT</b></th>"+
            "<th><b>BALANCE</b></th>"+
            "<th><b>MC/OO</b></th>"+
            "<th><b>SALES QUOTE</b></th>"+
            "<th><b>CONTRACT</b></th>"+
            "<th><b>NOTES</b></th>"+
            "<th><b>EXCEPTIONS</b></th>"+
            "</tr>";

           

           

            for(var u =0; u< 20;u++){
            html+="<tr>";
		
            html+="<td class='divTableCell'>"; 
            html+="<p></p>";
            html+=" </td>";

            html+="<td class='divTableCell'>"; 
            html+="<p></p>";
            html+=" </td>";

			html+="<td class='divTableCell'>"; 
            html+="<p></p>";
            html+=" </td>";

            html+="<td class='divTableCell'>"; 
            html+="<p></p>";
            html+=" </td>";

            html+="<td class='divTableCell'>"; 
            html+="<p></p>";
            html+=" </td>";

            html+="<td class='divTableCell'>"; 
            html+="<p></p>";
            html+=" </td>";

            html+="<td class='divTableCell'>"; 
            html+="<p></p>";
            html+=" </td>";
            
            html+="<td class='divTableCell'>"; 
            html+="<p></p>";
            html+=" </td>";

            html+="<td class='divTableCell'>"; 
            html+="<p></p>";
            html+=" </td>";
            
            html+="<td class='divTableCell'>"; 
            html+="<p></p>";
            html+=" </td>";

            html+="<td class='divTableCell'>"; 
            html+="<p></p>";
            html+=" </td>";

            html+="<td class='divTableCell'>"; 
            html+="<p></p>";
            html+=" </td>";

            html+="<td class='divTableCell'>"; 
            html+="<p></p>";
            html+=" </td>";

            html+="<td class='divTableCell'>"; 
            html+="<p></p>";
            html+=" </td>";

            html+="<td class='divTableCell'>"; 
            html+="<p></p>";
            html+=" </td>";

            html+="<td class='divTableCell'>"; 
            html+="<p></p>";
            html+=" </td>";

            html+="<td class='divTableCell'>"; 
            html+="<p></p>";
            html+=" </td>";

            html+="<td class='divTableCell'>"; 
            html+="<p></p>";
            html+=" </td>";

            html+="<td class='divTableCell'>"; 
            html+="<p></p>";
            html+=" </td>";


		
            html+="</tr>";

            }
            html+= "</table>";

			

           

	


  
    html+=cssStyle();
    htmlFld.defaultValue = html;
  
    var sessionObj = runtime.getCurrentSession(); 
    sessionObj.set({name: 'HTML_val', value: html});

    form.addSubmitButton({id: 'custpage_download_report', label: 'Export to Excel'});

    response.writePage(form);
    }else{
        var sessionObj  = runtime.getCurrentSession();
        var sessionHTML = sessionObj.get({name: 'HTML_val'});
        var sessionhtml = JSON.stringify(sessionHTML);

        try{
            var FileName      = 'Inventory Deposits Delivery Report.xls';
            var strxmlEncoded =  encode.convert({string : sessionhtml, inputEncoding: encode.Encoding.UTF_8,
                outputEncoding: encode.Encoding.BASE_64});

            var Excelfile    = file.create({name: FileName, fileType: file.Type.EXCEL, contents: strxmlEncoded});

            response.writeFile({file: Excelfile}); 
        }catch (e){
            log.error('Message', e.message);
        }
    }
}


    function cssStyle(){
        var style ="" +
                "<style>" +
                ".tablemain{width:100%;}" +
                ".tablemain tr:nth-child(even){background-color: #f2f2f2;}"+

                ".tablemain tr:hover {background-color: #ddd;}"+

                ".tablemain th {"+
                "padding-top: 8px;"+
                "padding-bottom: 8px;"+
                "text-align: left;"+
                "background-color: #607799;"+
                " color: white;" +
                "font-weight:bold;"+
                "font-size:10pt;" +
                "white-space: nowrap;" +
                "padding: 10px;"+
                "}" +
                ".tablemain td{" +
                "font-size: 10pt;" +
                "padding: 5px;"+
                "}" +
                "</style>";

            return style;
    }
	return {
		onRequest: onRequest
	};
});