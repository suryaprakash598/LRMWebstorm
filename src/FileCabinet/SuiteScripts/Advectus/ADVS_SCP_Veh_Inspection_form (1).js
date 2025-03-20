/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       26 Jul 2019     DELL
 *
 */

/**
 * @param {nlobjRequest} request Request object
 * @param {nlobjResponse} response Response object
 * @returns {Void} Any output is written via response object
 */
function suitelet(request, response){

	if(request.getMethod() == "GET"){

		//Vehicle Info

		var form       =   nlapiCreateForm('Vehicle Inspection Form');
		var htmlfld    =   form.addField('custpage_html', 'inlinehtml', ' ');
		var vin_numb   =   request.getParameter('a_reqid');

		var Vin_Record =   nlapiLoadRecord('customrecord_advs_vm', vin_numb);
		var vinNumb    =   Vin_Record.getFieldValue('name');
		var year       =   Vin_Record.getFieldText('custrecord_advs_vm_model_year');
		var location   =   Vin_Record.getFieldText('custrecord_advs_vm_location');
		var mk         =   Vin_Record.getFieldText('custrecord_advs_vm_make');
		var model      =   Vin_Record.getFieldText('custrecord_advs_vm_model');
		var odomtr     =   Vin_Record.getFieldValue('custrecord_advs_vm_current_hmr');
		var date       =   Vin_Record.getFieldValue('custrecord_advs_delivery_date_mso');

		var vin_hidden =   form.addField('custpage_vin', 'select', 'vin', 'customrecord_advs_vm').setDisplayType('hidden');
		if(vin_numb){
			vin_hidden.setDefaultValue(vin_numb);
		}

		if(!(vinNumb))   vinNumb  =  "";
		if(!(date))   date  =  "";
		if(!(year))   year  =  "";
		if(!(location))   location  =  "";
		if(!(odomtr))   odomtr  =  "";
		if(!(mk))   mk  =  "";
		if(!(model))   model  =  "";
		


		var html  =  "<center><table width = '700px' border = '2px solid black'>" +
		"<tr><td>" +

		"<table width = '100%'><tr><td style = 'text-align:center;font-size:17pt;'><b>TRAILER INSPECTION FORM</b>" +		
		"</td></tr></table>";

		html     +=  "<table width = '100%' class = 'td12'>"+

		"<tr><td width = '40%'>VIN NUMBER:&nbsp;<u>"+nlapiEscapeXML(vinNumb)+"</u></td><td width = '25%'>YEAR:&nbsp;<u>"+year+"</u></td>" +
		"<td>MAKE/MODEL:&nbsp;<u>"+mk+'/'+model+"</u></td></tr></table>"+

		"<table width = '100%' class = 'td12'><tr><td width = '40%'>LICENSE:________</td>" +
		"<td width = '25%'></td>" +
		"<td>COLOR:___________</td>" +
		"</tr></table>"+

		"<table width = '100%' class = 'td12'><tr><td width = '40%'>CARRIER:_________</td><td>LOCATION:<u>"+nlapiEscapeXML(location)+"</u></td></tr></table>"+

		"<table width = '100%' class = 'td12'><tr><td width = '40%'>DRIVER:_________</td><td>DATE OF ARRIVAL:<u>"+date+"</u></td></tr></table>"+

		"<table width = '100%' style = 'border-bottom:2px solid black;'>" +
		"</table>" +

		"<table width = '100%' class = 'td102'>" ;

		for(var i=0;i<13;i++){
			html += "<tr><td width = '2%'><input type='checkbox' name = 'chk1' id = 'chk1' value = 'T' style='width:8px; height:8px;' /></td><td></td>" +
			"<td width = '2%'><input type='checkbox' name = 'chk2' id = 'chk2' value = 'T' style='width:8px; height:8px;' /></td><td></td>"+
			"<td width = '2%'><input type='checkbox' name = 'chk3' id = 'chk3' value = 'T' style='width:8px; height:8px;' /></td><td></td>"+
			"</tr>"+
			"<tr height = '0.2cm'></tr>";
		}

		"<tr><td width = '2%'><input type='checkbox' name = 'chk4' id = 'chk4' value = 'T' style='width:8px; height:8px;' /></td><td>RIGHT CAB PANEL</td>" +
		"<td width = '2%'><input type='checkbox' name = 'chk5' id = 'chk5' value = 'T' style='width:8px; height:8px;' /></td><td>AIR CLEANER</td>"+
		"<td width = '2%'><input type='checkbox' name = 'chk6' id = 'chk6' value = 'T' style='width:8px; height:8px;' /></td><td>LEFT QUARTER FENDER</td>"+
		"</tr>"+
		"<tr height = '0.2cm'></tr>"+

		"<tr><td width = '2%'><input type='checkbox' name = 'chk7' id = 'chk7' value = 'T' style='width:8px; height:8px;' /></td><td>RIGHT DOOR</td>" +
		"<td width = '2%'><input type='checkbox' name = 'chk8' id = 'chk8' value = 'T' style='width:8px; height:8px;' /></td><td>EXHAUST/MUFFLER/STACK</td>"+
		"<td width = '2%'><input type='checkbox' name = 'chk9' id = 'chk9' value = 'T' style='width:8px; height:8px;' /></td><td>LEFT REAR CAB EXTENDER PANEL</td>"+
		"</tr>"+
		"<tr height = '0.2cm'></tr>"+

		"<tr><td width = '2%'><input type='checkbox' name = 'chk10' id = 'chk10' value = 'T' style='width:8px; height:8px;' /></td><td>RIGHT FENDER MOUNTED MIRROR</td>" +
		"<td width = '2%'><input type='checkbox' name = 'chk11' id = 'chk11' value = 'T' style='width:8px; height:8px;' /></td><td>MUFFLER SHIELD</td>"+
		"<td width = '2%'><input type='checkbox' name = 'chk12' id = 'chk12' value = 'T' style='width:8px; height:8px;' /></td><td>LEFT REAR TAILIGHT</td>"+
		"</tr>"+
		"<tr height = '0.2cm'></tr>"+

		"<tr><td width = '2%'><input type='checkbox' name = 'chk13' id = 'chk13' value = 'T' style='width:8px; height:8px;' /></td><td>RIGHT FRONT FENDER</td>" +
		"<td width = '2%'><input type='checkbox' name = 'chk14' id = 'chk14' value = 'T' style='width:8px; height:8px;' /></td><td>REAR CAB PANEL</td>"+
		"<td width = '2%'><input type='checkbox' name = 'chk15' id = 'chk15' value = 'T' style='width:8px; height:8px;' /></td><td>LEFT TANDEM TIRE/WHEEL/AXEL</td>"+
		"</tr>"+
		"<tr height = '0.2cm'></tr>"+

		"<tr><td width = '2%'><input type='checkbox' name = 'chk16' id = 'chk16' value = 'chk16' style='width:8px; height:8px;' /></td><td>RIGHT FUEL TANK</td>" +
		"<td width = '2%'><input type='checkbox' name = 'chk17' id = 'chk17' value = 'T' style='width:8px; height:8px;' /></td><td>REAR SLEEPER PANEL</td>"+
		"<td width = '2%'><input type='checkbox' name = 'chk18' id = 'chk18' value = 'T' style='width:8px; height:8px;' /></td><td>TRAILER AIR HOSES</td>"+
		"</tr>"+
		"<tr height = '0.2cm'></tr>"+

		"<tr><td width = '2%'><input type='checkbox' name = 'chk18' id = 'chk18' value = 'T' style='width:8px; height:8px;' /></td><td>RIGHT FUEL TANK FAIRING</td>" +
		"<td width = '2%'><input type='checkbox' name = 'chk19' id = 'chk19' value = 'T' style='width:8px; height:8px;' /></td><td>RIGHT MUD FLAP</td>"+
		"<td width = '2%'><input type='checkbox' name = 'chk21' id = 'chk21' value = 'T' style='width:8px; height:8px;' /></td><td>TRAILER LIGHT CABLE</td>"+
		"</tr>"+
		"<tr height = '0.2cm'></tr>"+

		"<tr><td width = '2%'><input type='checkbox' name = 'chk22' id = 'chk22' value = 'T' style='width:8px; height:8px;' /></td><td>RIGHT HOOD SIDE PANEL</td>" +
		"<td width = '2%'><input type='checkbox' name = 'chk23' id = 'chk23' value = 'T' style='width:8px; height:8px;' /></td><td>RIGHT QUARTER FENDER</td>"+
		"<td width = '2%'><input type='checkbox' name = 'chk24' id = 'chk24' value = 'T' style='width:8px; height:8px;' /></td><td>BUNK CURTAIN</td>"+
		"</tr>"+
		"<tr height = '0.2cm'></tr>"+

		"<tr><td width = '2%'><input type='checkbox' name = 'chk25' id = 'chk25' value = 'T' style='width:8px; height:8px;' /></td><td>RIGHT LUGGAGE COMPARTMENT</td>" +
		"<td width = '2%'><input type='checkbox' name = 'chk26' id = 'chk26' value = 'T' style='width:8px; height:8px;' /></td><td>RIGHT REAR TAILIGHT</td>"+
		"<td width = '2%'><input type='checkbox' name = 'chk27' id = 'chk27' value = 'T' style='width:8px; height:8px;' /></td><td>BUNK MATTRESS/TABLE</td>"+
		"</tr>"+
		"<tr height = '0.2cm'></tr>"+

		"<tr><td width = '2%'><input type='checkbox' name = 'chk28' id = 'chk28' value = 'T' style='width:8px; height:8px;' /></td><td>RIGHT OUTSIDE MIRROR</td>" +
		"<td width = '2%'><input type='checkbox' name = 'chk29' id = 'chk29' value = 'T' style='width:8px; height:8px;' /></td><td>RIGHT TANDEM TIRE/WHEELS/AXEL</td>"+
		"<td width = '2%'><input type='checkbox' name = 'chk30' id = 'chk30' value = 'T' style='width:8px; height:8px;' /></td><td>INSTRUMENT PANEL</td>"+
		"</tr>"+
		"<tr height = '0.2cm'></tr>"+

		"<tr><td width = '2%'><input type='checkbox' name = 'chk31' id = 'chk31' value = 'T' style='width:8px; height:8px;' /></td><td>RIGHT ROOF/SLEEPER PANEL</td>" +
		"<td width = '2%'><input type='checkbox' name = 'chk32' id = 'chk32' value = 'T' style='width:8px; height:8px;' /></td><td>AIR DEFLECTOR/FAIRING TAOP</td>"+
		"<td width = '2%'><input type='checkbox' name = 'chk33' id = 'chk33' value = 'T' style='width:8px; height:8px;' /></td><td>INTERIOR TRIM PANELS</td>"+
		"</tr>"+
		"<tr height = '0.2cm'></tr>"+

		"<tr><td width = '2%'><input type='checkbox' name = 'chk34' id = 'chk34' value = 'T' style='width:8px; height:8px;' /></td><td>RIGHT STEER TIRE/WHEELS/AXLE</td>" +
		"<td width = '2%'><input type='checkbox' name = 'chk35' id = 'chk35' value = 'T' style='width:8px; height:8px;' /></td><td>FRAME</td>"+
		"<td width = '2%'><input type='checkbox' name = 'chk36' id = 'chk36' value = 'T' style='width:8px; height:8px;' /></td><td>LEFT SEAT</td>"+
		"</tr>"+
		"<tr height = '0.2cm'></tr>"+

		"<tr><td width = '2%'><input type='checkbox' name = 'chk37' id = 'chk37' value = 'T' style='width:8px; height:8px;' /></td><td>RIGHT STEP ASSEMBLY</td>" +
		"<td width = '2%'><input type='checkbox' name = 'chk38' id = 'chk38' value = 'T' style='width:8px; height:8px;' /></td><td>SUSPENSION</td>"+
		"<td width = '2%'><input type='checkbox' name = 'chk39' id = 'chk39' value = 'T' style='width:8px; height:8px;' /></td><td>RADIO/CD/TAPE/CAB</td>"+
		"</tr>"+
		"<tr height = '0.2cm'></tr>"+

		"<tr><td width = '2%'><input type='checkbox' name = 'chk40' id = 'chk40' value = 'T' style='width:8px; height:8px;' /></td><td>RIGHT TURN SIGNAL</td>" +
		"<td width = '2%'><input type='checkbox' name = 'chk41' id = 'chk41' value = 'T' style='width:8px; height:8px;' /></td><td>DECK PLATE</td>"+
		"<td width = '2%'><input type='checkbox' name = 'chk42' id = 'chk42' value = 'T' style='width:8px; height:8px;' /></td><td>RIGHT SEAT</td>"+
		"</tr>"+
		"<tr height = '0.2cm'></tr>"+

		"</table>"+

		"<table width = '100%' style = 'border-bottom:2px solid black;'>" +
		"</table>" +

		"<table width = '100%'><tr border-bottom='1.5px'></tr>" +
		"<tr><td style = 'text-align:center;font-size:14pt;'><b>DAMAGE CODES</b></td></tr></table>"+

		"<table width = '100%' class = 'td13'><tr><td>(1)BENT</td><td>(2)CUT</td><td>(3)CHIP</td><td>(4)PUNTURED</td><td>(5)TORN</td><td>(6)HARDWARE DAMAGE/MISSING</td><td>(7)SCUFF</td></tr>" +
		"<tr><td>(8)BROKEN</td><td>(9)DENT</td><td>(10)CRACKED</td><td>(11)MISSING</td><td>(12)FLUID SPILLAGE</td><td>(13)STAINED/SOILED</td><td>(14)SCRATCH</td></tr>";		

		html += "<tr height = '0.2cm'>" +
		"</tr></table>"+

		"<table width = '100%'><tr border-bottom='1.5px'></tr>" ;

		//var Truck_Img_Url =   nlapiEscapeXML(nlapiLoadFile(2535).getURL());
		//html      +=   "<tr><td align='center'><img width='17cm' height = '5.2cm' src='"+Truck_Img_Url+"'/></td></tr>";

//		"<tr height = '6cm'></tr>"+

		html += "<tr><td><b>REMARKS_____________________________________________________________________________________________________________________________________________________________</b></td></tr>"+

		"</table>";	

		html  += "<table width = '100%'>" +
		"<tr><td width = '30%'>" +
		"<table width = '100%'></table></td>" +
		"<td width = '2%'>" +
		"<table width = '100%' class = 'tdnew' border = '1'>" +
		"<tr border-left='1px;'><td>S</td></tr>" +
		"<tr><td>H</td></tr><tr><td>I</td></tr><tr><td>P</td></tr><tr><td>P</td></tr><tr><td>E</td></tr><tr><td>R</td></tr>" +
		"</table>"+
		"</td>"+
		"<td width = '10%'><table width = '100%'><tr><td font-size='8px'><b>COMPANY:</b></td></tr><tr border-bottom='1px solid black'></tr>"+
		"<tr height = '0.2cm'></tr>"+
		"<tr><td font-size='8px'><b>LOCATION:</b></td></tr><tr border-bottom='1px solid black'></tr>"+
		"<tr height = '0.2cm'></tr>"+
		"<tr><td font-size='8px'><b>SIGNATURE:</b></td></tr><tr border-bottom='1px solid black'></tr>"+

		"</table></td>"+

		"<td width = '20%'><table width = '100%'></table></td>"+

		"<td width = '2%'>" +
		"<table width = '100%' class = 'tdnew' border = '1'>" +
		"<tr border-left='1px;'><td>R</td></tr>" +
		"<tr><td>E</td></tr><tr><td>C</td></tr><tr><td>E</td></tr><tr><td>I</td></tr><tr><td>V</td></tr><tr><td>E</td></tr><tr><td>R</td></tr>" +
		"</table>"+
		"</td>"+
		"<td width = '10%'><table width = '100%'><tr><td font-size='8px'><b>COMPANY:</b></td></tr><tr border-bottom='1px solid black'></tr>"+
		"<tr height = '0.2cm'></tr>"+
		"<tr><td font-size='8px'><b>LOCATION:</b></td></tr><tr border-bottom='1px solid black'></tr>"+
		"<tr height = '0.2cm'></tr>"+
		"<tr><td font-size='8px'><b>SIGNATURE:</b></td></tr><tr border-bottom='1px solid black'></tr>"+

		"</table></td>"+



		"</tr></table>";


		html    +=  "</td></tr></table></center>";

//		html += "<div id = 'a'>SHIPPER</div>";

		var styleHtml='';
		styleHtml+=' <style type="text/css">';
		styleHtml+=" .td12 {";
		styleHtml+=" padding-top:13px; ";
//		styleHtml+=" padding-right:2px;";
//		styleHtml+=" padding-bottom:0px;";
		styleHtml+=" padding-left:48px;";
		styleHtml+=" font-size: 10pt;";
		styleHtml+=" font-weight: bold;";
		styleHtml+=" font-family: Arial, sans-serif;";
		styleHtml+=" }";
		styleHtml+=" .td102 {";
		styleHtml+=" padding-top:13px;";
		styleHtml+=" padding-left:30px;";
		styleHtml+=" font-size: 8.5pt;";
		styleHtml+=" font-weight: bold;";
		styleHtml+=" font-family: Arial, sans-serif;";
		styleHtml+=" }";
		styleHtml+=" .td13 {";
		styleHtml+=" font-size: 8.5pt;";
		styleHtml+=" font-weight: bold;";
		styleHtml+=" font-family: Arial, sans-serif;";
		styleHtml+=" }";
		styleHtml+=" .tdnew {"+
		"background-color: brown;";
		styleHtml+=" font-size: 5.1pt;";
		styleHtml+=" font-weight: bold;";
		styleHtml+=" font-family: Arial, sans-serif;";
		styleHtml+=" }";
		styleHtml+=" </style>";

		html += styleHtml;

		htmlfld.setDefaultValue(html);
		form.addSubmitButton('Download');
		response.writePage(form);

	}else{


		var CK1  = request.getParameter('chk1');
		var CK2  = request.getParameter('chk2');
		var CK3  = request.getParameter('chk3');
		var CK4  = request.getParameter('chk4');
		var CK5  = request.getParameter('chk5');
		var CK6  = request.getParameter('chk6');
		var CK7  = request.getParameter('chk7');
		var CK8  = request.getParameter('chk8');
		var CK9  = request.getParameter('chk9');
		var CK10  = request.getParameter('chk10');
		var CK11  = request.getParameter('chk11');
		var CK12  = request.getParameter('chk12');
		var CK13  = request.getParameter('chk13');
		var CK14  = request.getParameter('chk14');
		var CK15  = request.getParameter('chk15');
		var CK16  = request.getParameter('chk16');
		var CK17  = request.getParameter('chk17');
		var CK18  = request.getParameter('chk18');
		var CK19  = request.getParameter('chk19');
		var CK20  = request.getParameter('chk20');
		var CK21  = request.getParameter('chk21');
		var CK22  = request.getParameter('chk22');
		var CK23  = request.getParameter('chk23');		
		var CK24  = request.getParameter('chk24');		
		var CK25  = request.getParameter('chk25');		
		var CK26  = request.getParameter('chk26');		
		var CK27  = request.getParameter('chk27');		
		var CK28  = request.getParameter('chk28');		
		var CK29  = request.getParameter('chk29');		
		var CK30  = request.getParameter('chk30');		
		var CK31  = request.getParameter('chk31');		
		var CK32  = request.getParameter('chk32');		
		var CK33  = request.getParameter('chk33');		
		var CK34  = request.getParameter('chk34');		
		var CK35  = request.getParameter('chk35');		
		var CK36  = request.getParameter('chk36');		
		var CK37  = request.getParameter('chk37');		
		var CK38  = request.getParameter('chk38');		
		var CK39  = request.getParameter('chk39');		
		var CK40  = request.getParameter('chk40');		
		var CK41  = request.getParameter('chk41');		
		var CK42  = request.getParameter('chk42');	
		var vin_post = request.getParameter('custpage_vin');

		if(vin_post){

			var Vin_Record =   nlapiLoadRecord('customrecord_advs_vm', vin_post);
			var vinNumb    =   Vin_Record.getFieldValue('name');
			var year       =   Vin_Record.getFieldText('custrecord_advs_vm_model_year');
			var location   =   Vin_Record.getFieldText('custrecord_advs_vm_location');
			var mk         =   Vin_Record.getFieldText('custrecord_advs_vm_make');
			var model      =   Vin_Record.getFieldText('custrecord_advs_vm_model');
			var odomtr     =   Vin_Record.getFieldValue('custrecord_advs_vm_current_hmr');
			var date       =   Vin_Record.getFieldValue('custrecord_advs_delivery_date_mso');			

		}

		if(!(vinNumb))   vinNumb  =  "";
		if(!(date))   date  =  "";
		if(!(year))   year  =  "";
		if(!(location))   location  =  "";
		if(!(odomtr))   odomtr  =  "";
		if(!(mk))   mk  =  "";
		if(!(model))   model  =  "";

		var html  =  "<table width = '100%' border = '2px solid black'>" +
		"<tr><td>" +

		"<table width = '100%'><tr><td align='center' font-size='20pt'><b>VEHICLE INSPECTION FORM</b>" +		
		"</td></tr></table>";

		html     +=  "<table width = '100%' class = 'td12'>"+

		"<tr><td width = '40%'>VIN NUMBER:&nbsp;<u>"+nlapiEscapeXML(vinNumb)+"</u></td><td width = '25%'>YEAR:&nbsp;<u>"+year+"</u></td><td>MAKE/MODEL:&nbsp;<u>"+mk+'/'+model+"</u></td></tr></table>"+

		"<table width = '100%' class = 'td12'><tr><td width = '40%'>ODOMETER READING:<u>"+odomtr+"</u></td>" +
		"<td width = '25%'>LICENSE:________</td>" +
		"<td>COLOR:___________</td>" +
		"</tr></table>"+

		"<table width = '100%' class = 'td12'><tr><td width = '40%'>CARRIER:_________</td><td>LOCATION:<u>"+nlapiEscapeXML(location)+"</u></td></tr></table>"+

		"<table width = '100%' class = 'td12'><tr><td width = '40%'>DRIVER:_________</td><td>DATE OF ARRIVAL:<u>"+date+"</u></td></tr></table>"+

		"<table width = '100%' style = 'border-bottom:2px solid black;'>" +
		"</table>" ;

		var CHKED_Url   =   nlapiEscapeXML(nlapiLoadFile(2541).getURL());
		var UNCHKED_Url =   nlapiEscapeXML(nlapiLoadFile(2542).getURL());

		html += "<table width = '100%' class = 'td102'>" +
		"<tr>" ;
		if(CK1 == 'T'){
			html += "<td width = '2%'><img width='13px' style='width:12px; height:12px;' src='"+CHKED_Url+"'/></td>" ;
		}else{
			html += "<td width = '2%'><img width='13px' style='width:12px; height:12px;' src='"+UNCHKED_Url+"'/></td>" ;	
		}
		html += "<td>RIGHT CAB EXTENDER PANEL</td>" ;
		if(CK2 == 'T'){
			html += "<td width = '2%'><img width='13px' style='width:12px; height:12px;' src='"+CHKED_Url+"'/></td>" ;
		}else{
			html += "<td width = '2%'><img width='13px' style='width:12px; height:12px;' src='"+UNCHKED_Url+"'/></td>" ;	
		}		
		html += "<td>AIR CLEANER</td>";
		if(CK3 == 'T'){
			html += "<td width = '2%'><img width='13px' style='width:12px; height:12px;' src='"+CHKED_Url+"'/></td>" ;
		}else{
			html += "<td width = '2%'><img width='13px' style='width:12px; height:12px;' src='"+UNCHKED_Url+"'/></td>" ;	
		}		
		html += "<td>LEFT MUD FLAP</td>"+
		"</tr>"+
		"<tr height = '0.2cm'></tr>"+

		"<tr>" ;
		if(CK4 == 'T'){
			html += "<td width = '2%'><img width='13px' style='width:12px; height:12px;' src='"+CHKED_Url+"'/></td>" ;
		}else{
			html += "<td width = '2%'><img width='13px' style='width:12px; height:12px;' src='"+UNCHKED_Url+"'/></td>" ;	
		}		
		html += "<td>RIGHT CAB PANEL</td>" ;
		if(CK5 == 'T'){
			html += "<td width = '2%'><img width='13px' style='width:12px; height:12px;' src='"+CHKED_Url+"'/></td>" ;
		}else{
			html += "<td width = '2%'><img width='13px' style='width:12px; height:12px;' src='"+UNCHKED_Url+"'/></td>" ;	
		}		
		html += "<td>AIR CLEANER</td>";
		if(CK6 == 'T'){
			html += "<td width = '2%'><img width='13px' style='width:12px; height:12px;' src='"+CHKED_Url+"'/></td>" ;
		}else{
			html += "<td width = '2%'><img width='13px' style='width:12px; height:12px;' src='"+UNCHKED_Url+"'/></td>" ;	
		}		
		html += "<td>LEFT QUARTER FENDER</td>"+
		"</tr>"+
		"<tr height = '0.2cm'></tr>"+

		"<tr>" ;
		if(CK7 == 'T'){
			html += "<td width = '2%'><img width='13px' style='width:12px; height:12px;' src='"+CHKED_Url+"'/></td>" ;
		}else{
			html += "<td width = '2%'><img width='13px' style='width:12px; height:12px;' src='"+UNCHKED_Url+"'/></td>" ;	
		}		
		html += "<td>RIGHT DOOR</td>" ;
		if(CK8 == 'T'){
			html += "<td width = '2%'><img width='13px' style='width:12px; height:12px;' src='"+CHKED_Url+"'/></td>" ;
		}else{
			html += "<td width = '2%'><img width='13px' style='width:12px; height:12px;' src='"+UNCHKED_Url+"'/></td>" ;	
		}		
		html += "<td>EXHAUST/MUFFLER/STACK</td>";
		if(CK9 == 'T'){
			html += "<td width = '2%'><img width='13px' style='width:12px; height:12px;' src='"+CHKED_Url+"'/></td>" ;
		}else{
			html += "<td width = '2%'><img width='13px' style='width:12px; height:12px;' src='"+UNCHKED_Url+"'/></td>" ;	
		}		
		html += "<td>LEFT REAR CAB EXTENDER PANEL</td>"+
		"</tr>"+
		"<tr height = '0.2cm'></tr>"+

		"<tr>" ;
		if(CK10 == 'T'){
			html += "<td width = '2%'><img width='13px' style='width:12px; height:12px;' src='"+CHKED_Url+"'/></td>" ;
		}else{
			html += "<td width = '2%'><img width='13px' style='width:12px; height:12px;' src='"+UNCHKED_Url+"'/></td>" ;	
		}		
		html += "<td>RIGHT FENDER MOUNTED MIRROR</td>" ;
		if(CK11 == 'T'){
			html += "<td width = '2%'><img width='13px' style='width:12px; height:12px;' src='"+CHKED_Url+"'/></td>" ;
		}else{
			html += "<td width = '2%'><img width='13px' style='width:12px; height:12px;' src='"+UNCHKED_Url+"'/></td>" ;	
		}		
		html += "<td>MUFFLER SHIELD</td>";
		if(CK12 == 'T'){
			html += "<td width = '2%'><img width='13px' style='width:12px; height:12px;' src='"+CHKED_Url+"'/></td>" ;
		}else{
			html += "<td width = '2%'><img width='13px' style='width:12px; height:12px;' src='"+UNCHKED_Url+"'/></td>" ;	
		}		
		html += "<td>LEFT REAR TAILIGHT</td>"+
		"</tr>"+
		"<tr height = '0.2cm'></tr>"+

		"<tr>" ;
		if(CK13 == 'T'){
			html += "<td width = '2%'><img width='13px' style='width:12px; height:12px;' src='"+CHKED_Url+"'/></td>" ;
		}else{
			html += "<td width = '2%'><img width='13px' style='width:12px; height:12px;' src='"+UNCHKED_Url+"'/></td>" ;	
		}
		html += "<td>RIGHT FRONT FENDER</td>" ;
		if(CK14 == 'T'){
			html += "<td width = '2%'><img width='13px' style='width:12px; height:12px;' src='"+CHKED_Url+"'/></td>" ;
		}else{
			html += "<td width = '2%'><img width='13px' style='width:12px; height:12px;' src='"+UNCHKED_Url+"'/></td>" ;	
		}		
		html += "<td>REAR CAB PANEL</td>";
		if(CK15 == 'T'){
			html += "<td width = '2%'><img width='13px' style='width:12px; height:12px;' src='"+CHKED_Url+"'/></td>" ;
		}else{
			html += "<td width = '2%'><img width='13px' style='width:12px; height:12px;' src='"+UNCHKED_Url+"'/></td>" ;	
		}		
		html += "<td>LEFT TANDEM TIRE/WHEEL/AXEL</td></tr>"+
		"<tr height = '0.2cm'></tr>"+

		"<tr>" ;
		if(CK16 == 'T'){
			html += "<td width = '2%'><img width='13px' style='width:12px; height:12px;' src='"+CHKED_Url+"'/></td>" ;
		}else{
			html += "<td width = '2%'><img width='13px' style='width:12px; height:12px;' src='"+UNCHKED_Url+"'/></td>" ;	
		}		
		html += "<td>RIGHT FUEL TANK</td>" ;
		if(CK17 == 'T'){
			html += "<td width = '2%'><img width='13px' style='width:12px; height:12px;' src='"+CHKED_Url+"'/></td>" ;
		}else{
			html += "<td width = '2%'><img width='13px' style='width:12px; height:12px;' src='"+UNCHKED_Url+"'/></td>" ;	
		}		
		html += "<td>REAR SLEEPER PANEL</td>";
		if(CK18 == 'T'){
			html += "<td width = '2%'><img width='13px' style='width:12px; height:12px;' src='"+CHKED_Url+"'/></td>" ;
		}else{
			html += "<td width = '2%'><img width='13px' style='width:12px; height:12px;' src='"+UNCHKED_Url+"'/></td>" ;	
		}		
		html += "<td>TRAILER AIR HOSES</td>"+
		"</tr>"+
		"<tr height = '0.2cm'></tr>"+

		"<tr>" ;
		if(CK19 == 'T'){
			html += "<td width = '2%'><img width='13px' style='width:12px; height:12px;' src='"+CHKED_Url+"'/></td>" ;
		}else{
			html += "<td width = '2%'><img width='13px' style='width:12px; height:12px;' src='"+UNCHKED_Url+"'/></td>" ;	
		}		
		html += "<td>RIGHT FUEL TANK FAIRING</td>" ;
		if(CK20 == 'T'){
			html += "<td width = '2%'><img width='13px' style='width:12px; height:12px;' src='"+CHKED_Url+"'/></td>" ;
		}else{
			html += "<td width = '2%'><img width='13px' style='width:12px; height:12px;' src='"+UNCHKED_Url+"'/></td>" ;	
		}		
		html += "<td>RIGHT MUD FLAP</td>";
		if(CK21 == 'T'){
			html += "<td width = '2%'><img width='13px' style='width:12px; height:12px;' src='"+CHKED_Url+"'/></td>" ;
		}else{
			html += "<td width = '2%'><img width='13px' style='width:12px; height:12px;' src='"+UNCHKED_Url+"'/></td>" ;	
		}		
		html += "<td>TRAILER LIGHT CABLE</td>"+
		"</tr>"+
		"<tr height = '0.2cm'></tr>"+

		"<tr>" ;
		if(CK22 == 'T'){
			html += "<td width = '2%'><img width='13px' style='width:12px; height:12px;' src='"+CHKED_Url+"'/></td>" ;
		}else{
			html += "<td width = '2%'><img width='13px' style='width:12px; height:12px;' src='"+UNCHKED_Url+"'/></td>" ;	
		}		
		html += "<td>RIGHT HOOD SIDE PANEL</td>" ;
		if(CK23 == 'T'){
			html += "<td width = '2%'><img width='13px' style='width:12px; height:12px;' src='"+CHKED_Url+"'/></td>" ;
		}else{
			html += "<td width = '2%'><img width='13px' style='width:12px; height:12px;' src='"+UNCHKED_Url+"'/></td>" ;	
		}		
		html += "<td>RIGHT QUARTER FENDER</td>";
		if(CK24 == 'T'){
			html += "<td width = '2%'><img width='13px' style='width:12px; height:12px;' src='"+CHKED_Url+"'/></td>" ;
		}else{
			html += "<td width = '2%'><img width='13px' style='width:12px; height:12px;' src='"+UNCHKED_Url+"'/></td>" ;	
		}		
		html += "<td>BUNK CURTAIN</td>"+
		"</tr>"+
		"<tr height = '0.2cm'></tr>"+

		"<tr>" ;
		if(CK25 == 'T'){
			html += "<td width = '2%'><img width='13px' style='width:12px; height:12px;' src='"+CHKED_Url+"'/></td>" ;
		}else{
			html += "<td width = '2%'><img width='13px' style='width:12px; height:12px;' src='"+UNCHKED_Url+"'/></td>" ;	
		}		
		html += "<td>RIGHT LUGGAGE COMPARTMENT</td>" ;
		if(CK26 == 'T'){
			html += "<td width = '2%'><img width='13px' style='width:12px; height:12px;' src='"+CHKED_Url+"'/></td>" ;
		}else{
			html += "<td width = '2%'><img width='13px' style='width:12px; height:12px;' src='"+UNCHKED_Url+"'/></td>" ;	
		}	
		html += "<td>RIGHT REAR TAILIGHT</td>";
		if(CK27 == 'T'){
			html += "<td width = '2%'><img width='13px' style='width:12px; height:12px;' src='"+CHKED_Url+"'/></td>" ;
		}else{
			html += "<td width = '2%'><img width='13px' style='width:12px; height:12px;' src='"+UNCHKED_Url+"'/></td>" ;	
		}		
		html += "<td>BUNK MATTRESS/TABLE</td>"+
		"</tr>"+
		"<tr height = '0.2cm'></tr>"+

		"<tr>" ;
		if(CK28 == 'T'){
			html += "<td width = '2%'><img width='13px' style='width:12px; height:12px;' src='"+CHKED_Url+"'/></td>" ;
		}else{
			html += "<td width = '2%'><img width='13px' style='width:12px; height:12px;' src='"+UNCHKED_Url+"'/></td>" ;	
		}		
		html += "<td>RIGHT OUTSIDE MIRROR</td>" ;
		if(CK29 == 'T'){
			html += "<td width = '2%'><img width='13px' style='width:12px; height:12px;' src='"+CHKED_Url+"'/></td>" ;
		}else{
			html += "<td width = '2%'><img width='13px' style='width:12px; height:12px;' src='"+UNCHKED_Url+"'/></td>" ;	
		}		
		html += "<td>RIGHT TANDEM TIRE/WHEELS/AXEL</td>";
		if(CK30 == 'T'){
			html += "<td width = '2%'><img width='13px' style='width:12px; height:12px;' src='"+CHKED_Url+"'/></td>" ;
		}else{
			html += "<td width = '2%'><img width='13px' style='width:12px; height:12px;' src='"+UNCHKED_Url+"'/></td>" ;	
		}			
		html += "<td>INSTRUMENT PANEL</td>"+
		"</tr>"+
		"<tr height = '0.2cm'></tr>"+

		"<tr>" ;
		if(CK31 == 'T'){
			html += "<td width = '2%'><img width='13px' style='width:12px; height:12px;' src='"+CHKED_Url+"'/></td>" ;
		}else{
			html += "<td width = '2%'><img width='13px' style='width:12px; height:12px;' src='"+UNCHKED_Url+"'/></td>" ;	
		}		
		html += "<td>RIGHT ROOF/SLEEPER PANEL</td>" ;
		if(CK32 == 'T'){
			html += "<td width = '2%'><img width='13px' style='width:12px; height:12px;' src='"+CHKED_Url+"'/></td>" ;
		}else{
			html += "<td width = '2%'><img width='13px' style='width:12px; height:12px;' src='"+UNCHKED_Url+"'/></td>" ;	
		}		
		html += "<td>AIR DEFLECTOR/FAIRING TOP</td>";
		if(CK32 == 'T'){
			html += "<td width = '2%'><img width='13px' style='width:12px; height:12px;' src='"+CHKED_Url+"'/></td>" ;
		}else{
			html += "<td width = '2%'><img width='13px' style='width:12px; height:12px;' src='"+UNCHKED_Url+"'/></td>" ;	
		}		
		html += "<td>INTERIOR TRIM PANELS</td>"+
		"</tr>"+
		"<tr height = '0.2cm'></tr>"+

		"<tr>" ;
		if(CK34 == 'T'){
			html += "<td width = '2%'><img width='13px' style='width:12px; height:12px;' src='"+CHKED_Url+"'/></td>" ;
		}else{
			html += "<td width = '2%'><img width='13px' style='width:12px; height:12px;' src='"+UNCHKED_Url+"'/></td>" ;	
		}		
		html += "<td>RIGHT STEER TIRE/WHEELS/AXLE</td>" ;
		if(CK35 == 'T'){
			html += "<td width = '2%'><img width='13px' style='width:12px; height:12px;' src='"+CHKED_Url+"'/></td>" ;
		}else{
			html += "<td width = '2%'><img width='13px' style='width:12px; height:12px;' src='"+UNCHKED_Url+"'/></td>" ;	
		}	
		html += "<td>FRAME</td>";
		if(CK36 == 'T'){
			html += "<td width = '2%'><img width='13px' style='width:12px; height:12px;' src='"+CHKED_Url+"'/></td>" ;
		}else{
			html += "<td width = '2%'><img width='13px' style='width:12px; height:12px;' src='"+UNCHKED_Url+"'/></td>" ;	
		}	
		html += "<td>LEFT SEAT</td>"+
		"</tr>"+
		"<tr height = '0.2cm'></tr>"+

		"<tr>" ;
		if(CK37 == 'T'){
			html += "<td width = '2%'><img width='13px' style='width:12px; height:12px;' src='"+CHKED_Url+"'/></td>" ;
		}else{
			html += "<td width = '2%'><img width='13px' style='width:12px; height:12px;' src='"+UNCHKED_Url+"'/></td>" ;	
		}		
		html += "<td>RIGHT STEP ASSEMBLY</td>" ;
		if(CK38 == 'T'){
			html += "<td width = '2%'><img width='13px' style='width:12px; height:12px;' src='"+CHKED_Url+"'/></td>" ;
		}else{
			html += "<td width = '2%'><img width='13px' style='width:12px; height:12px;' src='"+UNCHKED_Url+"'/></td>" ;	
		}		
		html += "<td>SUSPENSION</td>";
		if(CK39 == 'T'){
			html += "<td width = '2%'><img width='13px' style='width:12px; height:12px;' src='"+CHKED_Url+"'/></td>" ;
		}else{
			html += "<td width = '2%'><img width='13px' style='width:12px; height:12px;' src='"+UNCHKED_Url+"'/></td>" ;	
		}		
		html += "<td>RADIO/CD/TAPE/CAB</td>"+
		"</tr>"+
		"<tr height = '0.2cm'></tr>"+

		"<tr>" ;
		if(CK40 == 'T'){
			html += "<td width = '2%'><img width='13px' style='width:12px; height:12px;' src='"+CHKED_Url+"'/></td>" ;
		}else{
			html += "<td width = '2%'><img width='13px' style='width:12px; height:12px;' src='"+UNCHKED_Url+"'/></td>" ;	
		}		
		html += "<td>RIGHT TURN SIGNAL</td>" ;
		if(CK41 == 'T'){
			html += "<td width = '2%'><img width='13px' style='width:12px; height:12px;' src='"+CHKED_Url+"'/></td>" ;
		}else{
			html += "<td width = '2%'><img width='13px' style='width:12px; height:12px;' src='"+UNCHKED_Url+"'/></td>" ;	
		}		
		html += "<td>DECK PLATE</td>";
		if(CK42 == 'T'){
			html += "<td width = '2%'><img width='13px' style='width:12px; height:12px;' src='"+CHKED_Url+"'/></td>" ;
		}else{
			html += "<td width = '2%'><img width='13px' style='width:12px; height:12px;' src='"+UNCHKED_Url+"'/></td>" ;	
		}		
		html += "<td>RIGHT SEAT</td>"+
		"</tr>"+
		"<tr height = '0.2cm'></tr>"+

		"</table>"+

		"<table width = '100%' style = 'border-bottom:2.5px solid black;'>" +
		"</table>" +

		"<table width = '100%'><tr border-bottom='1.5px'></tr>" +
		"<tr><td align = 'center' font-size='14pt'><b>DAMAGE CODES</b></td></tr></table>"+

		"<table width = '100%' class = 'td13'><tr><td>(1)BENT</td><td>(2)CUT</td><td>(3)CHIP</td><td>(4)PUNTURED</td><td>(5)TORN</td><td>(6)HARDWARE DAMAGE/MISSING</td><td>(7)SCUFF</td></tr>" +
		"<tr><td>(8)BROKEN</td><td>(9)DENT</td><td>(10)CRACKED</td><td>(11)MISSING</td><td>(12)FLUID SPILLAGE</td><td>(13)STAINED/SOILED</td><td>(14)SCRATCH</td></tr>";		

		html += "<tr height = '0.2cm'>" +
		"</tr></table>"+

		"<table width = '100%'><tr border-bottom='1.5px'></tr>" ;

		var Truck_Img_Url =   nlapiEscapeXML(nlapiLoadFile(2535).getURL());
		html      +=   "<tr><td align='center'><img width='17cm' height = '5.2cm' src='"+Truck_Img_Url+"'/></td></tr>";

//		"<tr height = '6cm'></tr>"+

		html += "<tr><td><b>REMARKS____________________________________________________________________________________</b></td></tr>"+
		"<tr height = '0.5cm'></tr>"+
		"<tr border-bottom='1.5px'></tr>"+
		"<tr height = '0.5cm'></tr>"+
		"<tr border-bottom='1.5px'></tr>"+
		"<tr height = '0.5cm'></tr>"+
		"<tr border-bottom='1.5px'></tr>"+
		"<tr height = '0.5cm'></tr>"+
		"<tr border-bottom='1.5px'></tr>"+
		"<tr height = '0.5cm'></tr>"+
		"<tr border-bottom='1.5px'></tr>"+		             

		"</table>";	

		html  +=  "<table width = '100%'>" +
		"<tr><td width = '30%'>" +
		"<table width = '100%'></table></td>" +
		"<td width = '2%'>" +
		"<table width = '100%' class = 'tdnew' border = '1'>" +
		"<tr border-left='1px;'><td>S</td></tr>" +
		"<tr><td>H</td></tr><tr><td>I</td></tr><tr><td>P</td></tr><tr><td>P</td></tr><tr><td>E</td></tr><tr><td>R</td></tr>" +
		"</table>"+
		"</td>"+
		"<td width = '10%'><table width = '100%'><tr><td font-size='8px'><b>COMPANY:</b></td></tr><tr border-bottom='1px solid black'></tr>"+
		"<tr height = '0.2cm'></tr>"+
		"<tr><td font-size='8px'><b>LOCATION:</b></td></tr><tr border-bottom='1px solid black'></tr>"+
		"<tr height = '0.2cm'></tr>"+
		"<tr><td font-size='8px'><b>SIGNATURE:</b></td></tr><tr border-bottom='1px solid black'></tr>"+

		"</table></td>"+

		"<td width = '20%'><table width = '100%'></table></td>"+

		"<td width = '2%'>" +
		"<table width = '100%' class = 'tdnew' border = '1'>" +
		"<tr border-left='1px;'><td>R</td></tr>" +
		"<tr><td>E</td></tr><tr><td>C</td></tr><tr><td>E</td></tr><tr><td>I</td></tr><tr><td>V</td></tr><tr><td>E</td></tr><tr><td>R</td></tr>" +
		"</table>"+
		"</td>"+
		"<td width = '10%'><table width = '100%'><tr><td font-size='8px'><b>COMPANY:</b></td></tr><tr border-bottom='1px solid black'></tr>"+
		"<tr height = '0.2cm'></tr>"+
		"<tr><td font-size='8px'><b>LOCATION:</b></td></tr><tr border-bottom='1px solid black'></tr>"+
		"<tr height = '0.2cm'></tr>"+
		"<tr><td font-size='8px'><b>SIGNATURE:</b></td></tr><tr border-bottom='1px solid black'></tr>"+

		"</table></td>"+



		"</tr></table>";


		html    +=  "</td></tr></table>";
		var styleHtml='';
		styleHtml+=' <style type="text/css">';
		styleHtml+=" .td12 {";
		styleHtml+=" padding-top:13px; ";
//		styleHtml+=" padding-right:2px;";
//		styleHtml+=" padding-bottom:0px;";
		styleHtml+=" padding-left:48px;";
		styleHtml+=" font-size: 10pt;";
		styleHtml+=" font-weight: bold;";
		styleHtml+=" font-family: Arial, sans-serif;";
		styleHtml+=" }";
		styleHtml+=" .td102 {";
		styleHtml+=" padding-top:13px;";
		styleHtml+=" padding-left:30px;";
		styleHtml+=" font-size: 8.5pt;";
		styleHtml+=" font-weight: bold;";
		styleHtml+=" font-family: Arial, sans-serif;";
		styleHtml+=" }";
		styleHtml+=" .td13 {";
		styleHtml+=" font-size: 8.5pt;";
		styleHtml+=" font-weight: bold;";
		styleHtml+=" font-family: Arial, sans-serif;";
		styleHtml+=" }";
		styleHtml+=" .tdnew {"+
		"background-color: brown;";
		styleHtml+=" font-size: 5.1pt;";
		styleHtml+=" font-weight: bold;";
		styleHtml+=" font-family: Arial, sans-serif;";
		styleHtml+=" }";
		styleHtml+=" </style>";

		var title	=	"Vehicle Inspection Form";
		var xml = "<?xml version=\"1.0\"?>\n<!DOCTYPE html PUBLIC \"-//big.faceless.org//report\" \"report-1.1.dtd\">\n";
		xml += "<pdf>";
		xml += "<head>";
		xml +='<meta name="title" value="'+title+'"/>';
		xml += "<macrolist><macro id='nlheader'>";
		xml += "</macro>";
		xml +='<macro id="myfooter">';
		xml += "</macro>";
		xml += "</macrolist>";
		xml += styleHtml;
		xml += "</head>";
		xml += "<body size='A4' header='myheader'  footer='myfooter' footer-height='0mm' style='margin-left:-10mm; margin-right:-10mm; margin-top:1mm;margin-bottom:-10mm;' >\n\n";
		xml += html;
		xml += "</body></pdf>";

		var file = nlapiXMLToPDF(xml);

		var newFile = nlapiCreateFile('Chinese.pdf', 'PDF', nlapiEncrypt(html,'base64')); 
		newFile.setFolder(50); 
//		newFile.setEncoding('UTF-8'); 
		nlapiSubmitFile(newFile);

		response.setContentType('PDF', 'Truck Delivery Checkout List.pdf', 'inline');
		response.write(file.getValue());

	}

}