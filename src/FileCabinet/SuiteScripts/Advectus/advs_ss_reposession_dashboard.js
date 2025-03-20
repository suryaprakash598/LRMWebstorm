/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
define(['N/record', 'N/runtime', 'N/search', 'N/ui/serverWidget','N/url'],
    /**
 * @param{record} record
 * @param{runtime} runtime
 * @param{search} search
 * @param{serverWidget} serverWidget
 */
    (record, runtime, search, serverWidget,url) => {
        /**
         * Defines the Suitelet script trigger point.
         * @param {Object} scriptContext
         * @param {ServerRequest} scriptContext.request - Incoming request
         * @param {ServerResponse} scriptContext.response - Suitelet response
         * @since 2015.2
         */
        const onRequest = (scriptContext) => {

            var request    = scriptContext.request;
            var response   = scriptContext.response;

            if(request.method == "GET"){
                var form    =   serverWidget.createForm({title:"Repossession Dashboard",hideNavBar:false});

                var currScriptObj   =   runtime.getCurrentScript(); 
				//https://8760954.app.netsuite.com/app/site/hosting/scriptlet.nl?script=1643&deploy=1&stock=66&unitvin=5203&ofrstatus=1&ofrdate=5/8/2024
				
                var stock  =   request.parameters.custpara_stock||'';  
				  var scriptId     = currScriptObj.id;
                var deploymentId = currScriptObj.deploymentId;

                log.debug("scriptId",scriptId+"=>"+deploymentId); 
				var dataobj;
				var inlineHTML = form.addField({id:"custpage_inlinehtml",type:serverWidget.FieldType.INLINEHTML,label:" "});
				
				var html="";
				if(stock)
				{
					dataobj = lookForInfo(stock);
					html+='<div>';
					html+='<table id="repodsh1">';
					html+='<tr><td class="headings">VIN:</td><td>'+dataobj.custrecord_advs_la_vin_bodyfld[0].text+'</td></tr>'; 
					html+='<tr><td class="headings">LESSE:</td><td>'+dataobj.custrecord_advs_l_h_customer_name[0].text+'</td></tr>'; 
					html+='<tr><td class="headings">STOCK:</td><td>'+dataobj.name+'</td></tr>';
					html+='</table>';
					html+='</div>'
					
					html+='<div>';
				}
              
				
				
				
				html+='<table  id="repodsh" style="width:100%;border:1px solid;">';
				var hcolumns = tableColummns();
				log.debug('hcolumns',hcolumns.length);
				html+='<tr>';
				for(var hc=0;hc<hcolumns.length;hc++)
				{
					
					html+='<th>';
					html+=hcolumns[hc];
					html+='</th>'; 
				}
				html+='<th>';
					html+='Edit';
					html+='</th>'; 
				var lineData = ofrData(stock);
				
				html+='</tr>';
				
				for(var l=0;l<lineData.length;l++)
				{
					html+='<tr>';
					html+='<td>'+lineData[l].Status+'</td>'; 
					html+='<td>'+lineData[l].name+'</td>'; 
					html+='<td>'+lineData[l].notes+'</td>'; 
					html+='<td>'+lineData[l].lastlocation+'</td>'; 
					html+='<td>'+lineData[l].repocompany+'</td>'; 
					html+='<td>'+lineData[l].tdpdate+'</td>'; 
					html+='<td>'+lineData[l].tdate+'</td>'; 
					html+='<td>'+lineData[l].destination+'</td>'; 
					html+='<td>'+lineData[l].locationTransport+'</td>'; 
					if(lineData[l].Followup){
						html+='<td><i class="fa fa-check-circle" style="font-size:36px"></i></td>'; 
					}else{
						// html+='<td>'+lineData[l].Followup+'</td>'; 
						html+='<td><i class="fa fa-times-circle" style="font-size:36px"></i></td>'; 
					}
					if(lineData[l].Collections){
						html+='<td><i class="fa fa-check-circle" style="font-size:36px"></i></td>'; 
					}else{
						html+='<td><i class="fa fa-times-circle" style="font-size:36px"></i></td>'; 
					}
					 
					html+='<td>'+lineData[l].year+'</td>'; 
					html+='<td>'+lineData[l].make+'</td>'; 
					html+='<td>'+lineData[l].model+'</td>'; 
					html+='<td>'+lineData[l].Statushtml+'</td>'; 
					html+='<td><a href="#" onclick=openmodalpopup('+lineData[l].stockid+')> <i class="fa fa-edit" style="font-size:36px"></i></a></td>'; 
				html+='</tr>';
				}
				
				html+='</table>';
				html+='</div>'
				html+='<style>';
				html +='#repodsh {';
				html +='  font-family: Arial, Helvetica, sans-serif;';
				html +='  border-collapse: collapse;';
				html +='  width: 100%;';
				html +='}';

				html +='#repodsh td, #repodsh th {';
				html +='  border: 1px solid #ddd;';
				html +='  padding: 8px;';
				html +='}';

				html +='#repodsh tr:nth-child(even){background-color: #f2f2f2;}';

				html +='#repodsh tr:hover {background-color: #ddd;}';

				html +='#repodsh th {';
				html +='  padding-top: 12px;';
				html +='  padding-bottom: 12px;';
				html +='  text-align: left;';
				html +='  background-color: #04AA6D;';
				html +='  color: white;';
				html +='}';
				html +='#repodsh1 {';
				html +='  font-family: Arial, Helvetica, sans-serif;';
				html +='  border-collapse: collapse;';
				html +='  width: 40%;';
				html +='}';

				html +='#repodsh1 td, #repodsh1 th {';
				html +='  border: 1px solid #ddd;';
				html +='  padding: 8px;';
				html +='}';

				html +='#repodsh1 tr:nth-child(even){background-color: #f2f2f2;}';

				html +='#repodsh1 tr:hover {background-color: #ddd;}';

				html +='#repodsh1 th {';
				html +='  padding-top: 12px;';
				html +='  padding-bottom: 12px;';
				html +='  text-align: left;';
				html +='  background-color: #04AA6D;';
				html +='  color: white;';
				html +='}';
				html+='#repodsh1{margin-bottom:20px;}'
				html+='</style>';
				// html+='<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/fontawesome.min.css" integrity="sha512-UuQ/zJlbMVAw/UU8vVBhnI4op+/tFOpQZVT+FormmIEhRSCnJWyHiBbEVgM4Uztsht41f3FzVWgLuwzUqOObKw==" crossorigin="anonymous" referrerpolicy="no-referrer" />'
				 html+='<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">';

					html+='<script>';
					html +="function openmodalpopup(repo)";
					html +="{";
					html +="	try{";
					html +="		debugger; var _repo = repo; window.open('https://8760954.app.netsuite.com/app/site/hosting/scriptlet.nl?script=1644&deploy=1&repo='+_repo,'popUpWindow','height=300,width=800,left=100,top=100,resizable=yes,scrollbars=yes,toolbar=yes,menubar=no,location=no,directories=no, status=yes')";
					html +="	}catch(e)";
					html +="	{";
					html +="		console.log('Error',e.toString())";
					html +="	}";
					html +="}";

					html+='</script>';
				inlineHTML.defaultValue = html;
				
				
				/* 
                var vinFldObj  =   form.addField({id:"custpage_vin",type:serverWidget.FieldType.SELECT,label:"VIN",source:"customrecord_advs_vm"}).defaultValue=vinID;
                var stockFldObj  =   form.addField({id:"custpage_stock",type:serverWidget.FieldType.SELECT,label:"Stock",source:"customrecord_advs_lease_header"}).defaultValue=stock;
                var ofrFldObj  =   form.addField({id:"custpage_ofr_status",type:serverWidget.FieldType.SELECT,label:"OFR Status",source:"customlist_advs_ofr_status"});//.defaultValue=ofrstatus;
                var ofrDateFldObj  =   form.addField({id:"custpage_ofr_date",type:serverWidget.FieldType.DATE,label:"OFR Date"});//.defaultValue=ofrdate;
				  */
				 response.writePage(form);
			}
		}
		function lookForInfo(stock)
		{
			var array = [
							'custrecord_advs_l_h_customer_name',
							'custrecord_advs_l_h_location',
							'custrecord_advs_la_vin_bodyfld',
							'custrecord_advs_l_a_ofr_link',
							'name'  
							];
			
			return search.lookupFields({type:'customrecord_advs_lease_header',id:stock,columns:array});
		}
		function tableColummns()
		{
			var  arr=[];
				arr.push('Status');
				arr.push('Lesse');
				arr.push('Notes');
				arr.push('Last Location');
				arr.push('Repo Company');
				arr.push('Date putout');
				arr.push('Termination Date');
				arr.push('Destination');
				arr.push('Location For Transportation');
				arr.push('Followup Letter');
				arr.push('Collections');
				arr.push('Year');
				arr.push('Make');
				arr.push('Model');
				arr.push('Current Odometer');
					
			 return arr;
			
		}
		function ofrData(stock)
		{
			var _filters = [];
				if(stock!='')
				{
					_filters.push([
							["custrecord_ofr_stock_no","anyof",stock]				
					])
				}
				
			var customrecord_lms_ofr_SearchObj = search.create({
				   type: "customrecord_lms_ofr_",
				   filters:_filters,
				   columns:
				   [
					  "custrecord_chek_from_repo",
					  "custrecord_collections",
					  "custrecord_advs_ofr_color",
					  "custrecord_destination",
					  "custrecord_followup_letter",
					  "custrecord_ofr_make",
					  "custrecord_ofr_model",
					  "custrecord_ofr_customer",
					  "custrecord_ofr_date",
					  "custrecord_advs_ofr_ofrstatus",
					  "custrecord_advs_repo_company",
					  "custrecord_ofr_stock_no",
					  "custrecord_termination_date",
					  "custrecord_ofr_vin",
					  "custrecord_ofr_year",
					  "custrecord_location_for_transport",
					  "custrecord_last_location",
					  "custrecord_date_putout",
					  "custrecord_additional_info_remarks"
					  
				   ]
				});
				var searchResultCount = customrecord_lms_ofr_SearchObj.runPaged().count; 
				var arr=[];
				customrecord_lms_ofr_SearchObj.run().each(function(result){
				   // .run().each has a limit of 4,000 results
				   var obj={};
				   obj.name 			= result.getText({name:'custrecord_ofr_customer'});
				   obj.destination		= result.getText({name:'custrecord_destination'});
				   obj.make				= result.getText({name:'custrecord_ofr_make'});
				   obj.model 			= result.getText({name:'custrecord_ofr_model'});
				   obj.ofrdate 			= result.getValue({name:'custrecord_ofr_date'});
				   obj.stock 			= result.getText({name:'custrecord_ofr_stock_no'});
				   obj.stockid 			= result.getValue({name:'custrecord_ofr_stock_no'});
				   obj.tdate 			= result.getValue({name:'custrecord_termination_date'});
				   obj.tdpdate 			= result.getValue({name:'custrecord_date_putout'});
				   obj.vin 				= result.getText({name:'custrecord_ofr_vin'});
				   obj.year 			= result.getValue({name:'custrecord_ofr_year'});
				   obj.repocompany		= result.getText({name:'custrecord_advs_repo_company'});
				   obj.Followup			= result.getValue({name:'custrecord_followup_letter'});
				   obj.Collections		= result.getValue({name:'custrecord_collections'});
				   obj.notes			= result.getValue({name:'custrecord_additional_info_remarks'});
				   obj.Status			= result.getText({name:'custrecord_advs_ofr_ofrstatus'});
				   obj.locationTransport	= result.getText({name:'custrecord_location_for_transport'});
				   obj.lastlocation			= result.getText({name:'custrecord_last_location'});
				   arr.push(obj);
				   return true;
				});

				 return arr;
		}

        return {onRequest}

    });