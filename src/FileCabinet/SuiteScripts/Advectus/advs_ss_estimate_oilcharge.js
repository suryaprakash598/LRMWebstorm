/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 *@NAmdConfig  ./configuration.json
 */
  
 define(['N/record', 'N/search','N/xml','underscore'],
    function (record,search,xml,underscore) {
            function onRequest(context) {
                if (context.request.method == "GET") { 

                     var  Webjobparam          =context.request.parameters.webJobF_value;
                    var  Webrateparam         =context.request.parameters.webpriceF_value;
                    var  Webqtyparam          =context.request.parameters.webqty_Fvalue; 
                    var  Webmsgparam          =context.request.parameters.webAuthF_value;
                    var  WebauthParam         =context.request.parameters.webMsgF_value;
                    var  WebappointParam      =context.request.parameters.webAppointF_value;
					 
                    var  soid      			=context.request.parameters.recid;
                    var  optionsData      	=context.request.parameters.data||'[]';
                    var  _optionsData = JSON.parse(optionsData);


                    log.debug("soid"+soid,"optionsData"+optionsData);

 

                    var recordSearchObj = search.create({
                        type: "customrecord_advs_task_record",
                        filters:
                        [
                           ["custrecord_advs_st_r_t_work_ord_link","anyof",soid]
                        ],
                        columns:
                        [
                           search.createColumn({name: "name", label: "Name"}),
                           search.createColumn({name: "internalid", label: "Internal ID"}),
                           search.createColumn({name: "custrecord_advs_st_r_t_cause", label: "Cause"}),
                           search.createColumn({name: "custrecord_advs_st_r_t_compalin", label: "Complaint"}),
                           search.createColumn({name: "custrecord_advs_repair_task_job_code", label: "Job Code"}),
                           search.createColumn({name: "custrecord_advs_st_r_t_correction", label: "Correction (Writer)"}),
                           search.createColumn({name: "custrecord_repair_desc", label: "Description"}),
                           search.createColumn({name: "custrecord_st_r_t_h_job_unique_id", label: "uniqueID"})
                        ]
                     });
                     var searchResultCount = recordSearchObj.runPaged().count;
                     //log.debug("recordSearchObj result count",searchResultCount);

                   
                     var _resultsArray = [];
                     
                     recordSearchObj.run().each(function(result){
                        var resultObj = {
                            Int: result.getValue("internalid"),
                            Name: result.getValue("name"),
                            Cause: result.getValue("custrecord_advs_st_r_t_cause"),
                            Correction: result.getValue("custrecord_advs_st_r_t_correction"),
                            Complain: result.getValue("custrecord_advs_st_r_t_compalin"),
                            Job_code: result.getValue("custrecord_advs_repair_task_job_code"),
                            description: result.getValue("custrecord_repair_desc"),
                            uniqueCode: result.getValue("custrecord_st_r_t_h_job_unique_id")
                        };
                        _resultsArray.push(resultObj);
                    
                      return true;
                     });
                     var partsTotal = 0;
					 var laborTotal = 0;
					   var groupedResultsArrayObj = underscore.groupBy(_resultsArray, 'Name');
                   log.debug('groupedResultsArrayObj',groupedResultsArrayObj);
				   
					var salesData = getSalesOrderInfo(soid);
					//log.debug('salesData',salesData);
                            var htmlHeader = " ";
                            htmlHeader += "<table style='width: 100%;'>";
                            htmlHeader+=  "<tr><td>";
                            htmlHeader += "<table style='font-family: Bank Gothic, Arial, sans-serif; text-align:left;'>";
                            htmlHeader += "<tr><td style='align:center;padding-right:10px;'><img src='https://8760954-sb1.app.netsuite.com/core/media/media.nl?id=4640&amp;c=8760954_SB1&amp;h=hOVnkhUkJlxiF1pyN-M-xif_-VbwypZKB5WC6IWXWlItXID6&amp;fcts=20240508232747&amp;whence=' alt='Image description' width='150px' height='50px' /></td>";
                            htmlHeader += "<td style='font-size:12px;'> LRM Truck Repair- MVR #98446 <br/> 2160 Blount<br/>Pompano Beach , FL 33069<br/> (954) 791-1400 <br/> repairs@lrmleasing.com<br/></td></tr>";
                            htmlHeader += "<tr><td></td></tr>";
                            htmlHeader += "</table>";

                            htmlHeader += "</td>";
                            htmlHeader += "<td style=' align:right;'>";
                            htmlHeader += "<table style=' align: right;'>";
                            htmlHeader += "<tr><td style='align:right; font-size: 15px;'><b>Estimate #5473</b></td></tr>";
                            htmlHeader += "<tr><td style='align:right; font-size: 12px;'><b>Created: </b> 7/11/2024 11:14 AM EDT</td></tr>";
                            htmlHeader += "<tr><td style='align:right; font-size: 12px;' ><b>Payment Term:</b>On Receipt</td></tr>";
                            htmlHeader += "<tr><td style='align:right; font-size: 12px;'><b>Service Writer:</b>KOREY REESE</td></tr>";
                            htmlHeader += " </table>";
                            htmlHeader += "</td></tr>";
                            htmlHeader += "<tr><td></td></tr>";
                            htmlHeader += " </table>";

                            var htmlFooter = "";
                            htmlFooter += "<table style='font-family: Arial Narrow, Arial, sans-serif; font-size: 13px; width: 100%; border-collapse: collapse;border-top: 1px solid black;'>";
                            htmlFooter += "<tr>";
                            htmlFooter += "<td style='align: left;'>Date</td>";
                            htmlFooter += "<td style='align: center;'>LMR Truck Repair</td>";
                            htmlFooter += "<td style='align: right;'><pagenumber/> of <totalpages/></td>";
                            htmlFooter += "</tr>";
                            htmlFooter += "</table>";

                            var html ='';
                            html += '<table style="width: 100%;">';
                            html += '<tr><td colspan="2">';
                            html += '<table style="font-family: Arial Narrow, Arial, sans-serif; text-align: left;">';
                            html += '<tr><td style="text-align: center;"><strong>NEW LRM LEASING</strong></td></tr>';
                            html += '<tr><td style="font-size: 12px;">2160 Blount<br/>Pompano Beach , FL 33069<br/> (954) 791-1400 <br/> repairs@lrmleasing.com<br/></td></tr>';
                            html += '</table>';  
                            html += '</td>';

                            html += '<td colspan="2">';
                            html += '<table style="font-family: Arial Narrow, Arial, sans-serif; text-align: left;">';
                            html += '<tr><td style="text-align: center;"></td></tr>';
                            html += '<tr><td></td></tr>';
                            html += '</table>';  
                            html += '</td>';
                            

                            html += '<td style="align: right;">';
                            html += '<table style="align: right;">';
                            html += '<tr><td colspan="2" style="font-size: 14px;"><strong>2019 FREIGHTLINER Cascadia (White, #KM0854)</strong></td></tr>';
                            html += '<tr><td style="font-size: 12px;"><strong>VIN:</strong></td><td style="font-size: 11px;">3AKJGLDR2KSKM0854</td></tr>';
                            html += '<tr><td style="font-size: 12px;"><strong>Mileage:</strong></td><td style="font-size: 11px;">594,861</td></tr>';
                            html += '</table>';
                            html += '</td></tr>';
                            html += '<tr><td></td></tr>';
                            html += '</table>';


                         

							var reskeys = Object.keys(groupedResultsArrayObj);
							
                                for(var m=0;m<reskeys.length;m++)
								{
									var totaljobamount=0;
									var resultsArray = groupedResultsArrayObj[reskeys[m]];
									log.debug('resultsArray',resultsArray);


									html +='<br/>';
									   html += '<table style="width: 100%; border-collapse: collapse; font-family: Arial, sans-serif;border: 1px solid #ddd;">';
										html += '<tr style="background-color: #e0e0e0; font-weight: bold;">';
										html += '<td  style="padding: 5px; font-size: 14px;border: 1px solid #ddd;">Customer Comments</td>';
										html += '<td style="padding: 5px; font-size: 14px; border: 1px solid #ddd;">Recommendations</td>';
										html += '</tr>';
										html += '<tr style="">';
										html += '<td style="padding: 5px;font-size: 12px; border: 1px solid #ddd;">'+resultsArray[0].Complain+'</td>';
										html += '<td style="padding: 5px;font-size: 12px; border: 1px solid #ddd;">'+resultsArray[0].Correction+'</td>';
										html += '</tr>';
										html += '</table>';
									 html +='<br/>';
										html += '<table style="width: 100%; border-collapse: collapse; font-family: Arial, sans-serif;border: 1px solid #ddd;">';
										html += '<tr style="background-color: #e0e0e0; font-weight: bold;">';
										html += '<td colspan="5" style="padding: 5px; font-size: 13px;">'+resultsArray[0].Name+'</td>';
										html += '<td style="padding: 5px; align: right; font-weight: bold;"></td>';
										html += '</tr>';
										html += '<tr style=" border: 1px solid #ddd;">';
											html += '<td  style="padding: 5px;"></td>';
											html += '<td colspan="5" style="padding: 5px;font-size: 12px;"><b>Description</b></td>';
											html += '<td colspan="2" style="padding: 5px;font-size: 12px;align: right;"><b>Price</b></td>';
											html += '<td colspan="1" style="padding: 5px;font-size: 12px;align: right;"><b>Qty</b></td>';
											html += '<td style="padding: 5px;align: right;font-weight: bold;font-size: 12px;">Subtotal</td>';
											html += '</tr>';

									for(var i=0;i<resultsArray.length;i++){

                                        log.debug('esultsArray[i].Complain',resultsArray[i].Complain);
									 											 
														var uni = resultsArray[i].uniqueCode; 
														var Int = resultsArray[i].Int; 
														//log.debug('uni',uni);
													var solines = findObjectsByValue(salesData, 'uniqueID', uni);
													  
									 
										/* html += '<tr style=" border: 1px solid #ddd;">';
										html += '<td colspan="5" style="padding:5px; align: left;font-weight: bold;font-size: 12px;">MAINTAIN X</td>';
										html += '</tr>'; */
										
										for(var j=0;j<solines.length;j++){
											var itemind =solines[j].itemId; 
                                          	//log.debug('itemind',itemind);
											for(var k=0;k<_optionsData.length;k++){
                                               //  log.debug('_optionsData[k].item',_optionsData[k].item);
												if((_optionsData[k].item == itemind)){
                                               
													
												
														html += '<tr  style=" border: 1px solid #ddd;">';
														html += '<td style="padding: 5px;font-size: 12px;">1</td>';
														var xmlEscapedItemName = xml.escape({xmlText : solines[j].itemName});
														html += '<td colspan="5" style="padding: 5px;font-size: 12px;">'+xmlEscapedItemName+'</td>';
														//log.debug('_optionsData[k].price-->'+_optionsData[k].price ,'_optionsData[k].linetype==3-->'+_optionsData[k].linetype==3)
														//log.debug('_optionsData[k].qty-->'+_optionsData[k].qty ,'_optionsData[k].linetype==3-->'+_optionsData[k].linetype==3)
														if(_optionsData[k].linetype==3 && _optionsData[k].price=="true"){
															laborTotal = (laborTotal*1)+((solines[j].rate)*1);
															
															html += '<td colspan="2" style="padding: 5px;font-size: 12px; align: right;">'+solines[j].rate+'</td>';
														}else if(_optionsData[k].linetype==2 && (_optionsData[k].partprice=="true")){
															partsTotal = (partsTotal*1)+((solines[j].rate)*1); 
															html += '<td colspan="2" style="padding: 5px;font-size: 12px; align: right;">'+solines[j].rate+'</td>';
														}else{
															html += '<td colspan="2" style="padding: 5px;font-size: 12px; align: right;"></td>';
														}
														
														if(_optionsData[k].linetype==3 &&_optionsData[k].qty=="true"){
															html += '<td colspan="1" style="padding: 5px;font-size: 12px; align: right;">'+solines[j].qty+'</td>';
														} else if(_optionsData[k].linetype==2 &&_optionsData[k].partprice=="true"){
															html += '<td colspan="1" style="padding: 5px;font-size: 12px; align: right;">'+solines[j].qty+'</td>';
														}else{
															html += '<td colspan="1" style="padding: 5px;font-size: 12px; align: right;"></td>';
														} 
														totaljobamount = (totaljobamount*1)+(((solines[j].qty)*1)*((salesData[j].rate)*1));
														html += '<td  style="padding: 5px;font-size: 12px; align: right;">$'+(((solines[j].qty)*1)*((salesData[j].rate)*1))+'</td>';
														html += '</tr>';
													}	
											}
													 
												  
										}
										
										

 
								 }
								 html += '<tr style="background-color: #e0e0e0;">';
											html += '<td style="padding: 5px;"></td>';
											html += '<td colspan="2" style="padding: 5px;align: right;font-size: 14px;">Shop Supplies (5%):</td>';
											html += '<td style="padding: 5px; align: right;font-size: 12px;">Total:</td>';
											html += '<td style="padding: 5px; align: right;font-size: 12px;">'+totaljobamount+'</td>';
											html += '</tr>';
										html += '</table>';
								}
                                 
                           
                             

                          //credit
                                html +='<br/>';
                                html += '<table style="display:none; width: 100%; border-collapse: collapse; font-family: Arial, sans-serif;border: 1px solid #ddd;">';
                                html += '<tr style="background-color: #e0e0e0; font-weight: bold;">';
                                html += '<td colspan="5" style="padding: 5px; font-size: 13px;">CREDIT CARD FEE</td>';
                                html += '</tr>';
                                html += '<tr style=" border: 1px solid #ddd;">';
                                html += '<td style="padding: 5px;font-size: 12px;"></td>';
                                html += '<td colspan="3" style="padding: 5px;font-size: 12px;"><b>Description</b></td>';
                                html += '<td style="padding: 5px;align: right;font-weight: bold;font-size: 12px;">Subtotal</td>';
                                html += '</tr>';
                                html += '<tr  style=" border: 1px solid #ddd;">';
                                html += '<td style="padding: 5px;font-size: 12px;">1</td>';
                                html += '<td style="padding: 5px;font-size: 12px;">CREDIT CARD FEE</td>';
                                html += '<td  colspan="3" style="padding: 5px;font-size: 12px; align: right;">$290.00</td>';
                                html += '</tr>';
                                html += '<tr style="background-color: #e0e0e0;">';
                                html += '<td style="padding: 5px;font-size: 12px;"></td>';
                                html += '<td colspan="3" style="padding: 5px; align: right;font-size: 12px;">Total:</td>';
                                html += '<td style="padding: 5px; align: right;font-size: 12px;">$14.50</td>';
                                html += '</tr>';
                                html += '</table>';
                            

                           //payment
                                html +='<br/>';
                                html += '<table style="width: 100%;display:none; border-collapse: collapse; font-family: Arial, sans-serif;border: 1px solid #ddd;">';
                                html += '<tr style="background-color: #e0e0e0; font-weight: bold;">';
                                html += '<td colspan="3" style="padding: 5px; font-size: 13px;">Payments</td>';
                                html += '</tr>';
                                html += '<tr>';
                                html += '<td style="padding: 5px;font-size: 12px;">7/18/2024</td>';
                                html += '<td  colspan="3" style="padding: 5px;font-size: 12px; align: center;">Credit card ending in 3579</td>';
                                html += '<td style="padding: 5px;font-size: 12px; align: right;">$2,457.38</td>';
                                html += '</tr>';
                                html += '</table>';
                            
                         
                            //past auth
                                html +='<br/>';
                                html += '<table style="width: 100%; border-collapse: collapse; font-family: Arial, sans-serif;border: 1px solid #ddd;">';
                                html += '<tr style="background-color: #e0e0e0; font-weight: bold;">';
                                html += '<td colspan="3" style="padding: 5px; font-size: 13px;">Past Authorizations</td>';
                                html += '</tr>';
                                html += '<tr>';
                                html += '<td style="padding: 5px;font-size: 12px;align: left;">signature <br/> E-signed by SSL TRUCKING INC PIERRE <br/> DIEUPHITA 7/17/2024 at 3:24 PM EDT</td>';
                                html += '<td  colspan="3" style="padding: 5px;font-size: 12px; align: center;"> + BRAKES MAKING NOISE WHEN</td>';
                                html += '<td style="padding: 5px;font-size: 12px; align: right;">$2,457.38</td>';
                                html += '</tr>';
                                html += '</table>';
                             

                            html +='<br/>'
                            html += '<table style="width: 100%; border-collapse: collapse;font-size: 10px;">';
                            html += '    <tr>';
                            html += '        <td style="width: 50%;  padding-right: 5px;">';
                            html += '            <b>Terms and Conditions</b>';
                            html += '            <p>Estimates and Authorization:</p>';         
                            html += '                <p>-Quotes are approximations based on the anticipated details of the work. Unexpected complications may cause deviations from the quote.</p>';
                            html += '                <p>-I authorize the repair work described, including necessary materials, and understand that LRM Truck Repair is not responsible for loss or damage to the vehicle or articles left in the vehicle due to fire, theft, or other causes beyond their control.</p>';
                            html += '                <p>-I acknowledge that delays may occur due to the unavailability of parts or delays from suppliers or transporters.</p>';
                            html += '                <p>-LRM Truck Repair employees may operate the vehicle for testing, inspection,or delivery at my risk.</p>';
                            html += '        </td>';

                            html += '        <td style="width: 50%; border: 1px solid #ddd; padding: 5px;">';
                            html += '            <table style="width: 100%;font-size: 12px; border-collapse: collapse;">';
                            html += '                <tr>';
                            html += '                    <td><b>Parts</b>...................</td>';
                            html += '                    <td style="align:left;">$'+partsTotal+'</td>';
                            html += '                </tr>';
                            html += '                <tr>';
                            html += '                    <td ><b>Labor</b>.....................</td>';
                            html += '                    <td style="align:left;">$'+laborTotal+'</td>';
                            html += '                </tr>';
                            html += '                <tr>';
                            html += '                    <td><b>Subtotal</b>.....................</td>';
                            html += '                    <td style="align:left; ">$'+((laborTotal*1)+(partsTotal))+'</td>';
                            html += '                </tr>';
                            html += '                <tr>';
                            html += '                    <td ><b>Shop Supplies</b>.....................</td>';
                            html += '                    <td style="align:left;">$117.12</td>';
                            html += '                </tr>';
                            html += '                <tr>';
                            html += '                    <td ><b>Tax</b>.....................</td>';
                            html += '                    <td style="align:left;">$0.00</td>';
                            html += '                </tr>';
                            html += '                <tr>';
                            html += '                    <td><b>Grand Total</b>.....................</td>';
                            html += '                    <td style="align:left; font-weight: bold;">$2,459.68</td>';
                            html += '                </tr>';
                            html += '                <tr>';
                            html += '                    <td ><b>Paid To Date</b>.....................</td>';
                            html += '                    <td style="align:left;">($0.00)</td>';
                            html += '                </tr>';
                            html += '               <tr style="background-color: #e0e0e0;font-weight: bold; font-size:13px;">';
                            html += '                    <td  style="font-weight: bold;">  REMAINING BALANCE </td>';
                            html += '                    <td style="align:left;"> $2,459.68</td>';
                            html += '            </tr>';
                            html += '            </table>';
                            html += '        </td>';
                            html += '    </tr>';
                            html += '</table>';
                           
                            html += '            <p style="font-size: 10px;">Estimate Approval and Payments:</p>';      
                            html += '                <p style="font-size: 10px;">- I have the right to know the repairs and their costs before authorizing them.</p>';
                            html += '                <p style="font-size: 10px;">- There are no returns or exchanges for any parts purchased, including electrical components.</p>';
                            html += '                <p style="font-size: 10px;">- All work is final, with no warranties or guarantees unless otherwise documented.</p>';  
                            html += '            <p style="font-size: 10px;">Customer Rights and Responsibilities:</p>';      
                            html += '                <p style="font-size: 10px;">- Estimates must be approved within 2 business days. Failure to do so may result in a storage charge of $100 per day (or $200/day for truck and trailer).</p>';
                            html += '                <p style="font-size: 10px;">- A 50% deposit is required upon approval of the estimate before work can begin.</p>';
                            html += '                <p style="font-size: 10px;">- The remaining balance is due within 2 business days of work completion, and the vehicle must be picked up within this period. Failure to pick up the vehicle or pay the balance will result in a storage charge of $100 per day (or $200/day for truck and trailer).</p>';
                            html += '            <p style="font-size: 10px;">Liability:</p>';      
                            html += '                <p style="font-size: 10px;">- LRM Truck Repair, its employees, management, and owners are not responsible for damage or theft of the vehicle or its contents.</p>';
                            html += '                <p style="font-size: 10px;">Payment and Delivery Agreement</p>';
                            html += '                <p style="font-size: 10px;">By making payment and taking delivery of your vehicle, you acknowledge and agree to the following:</p>';
                            html += '                <p style="font-size: 10px;">- I have reviewed and confirmed the payment amount and method as correct and satisfactory.</p>';
                            html += '                <p style="font-size: 10px;">- I confirm the authenticity and authorization of the charge.</p>';
                            html += '                <p style="font-size: 10px;">- I have received and reviewed the goods or services as described in this invoice, and confirm they are in satisfactory condition and that the services have been provided to my satisfaction.</p>';
                            html += '                <p style="font-size: 10px;">- I agree that no returns or cancellations of any kind will be accepted after delivery.</p>';
                            html += '                <p style="font-size: 10px;">- I acknowledge that I have no reason to initiate a chargeback on my credit card and will not do so for any reason.</p>';


                            html +='<br/>'
                            html += "<div>";
                            html += "<p style='align:left;font-size: 13px;'><b> Signature_____________________________</b></p>"
                            html += "</div>";

                            if(WebauthParam=='true'){
                                html += '<table style="width: 100%; border-collapse: collapse; font-family: Arial, sans-serif;border: 1px solid #ddd;">';
                                html += '<tr style="background-color: #e0e0e0; font-weight: bold; border: 1px solid #ddd;">';
                                html += '<td  style="padding: 5px; font-size: 14px;">Authorizations</td>';
                                html += '<td style="padding: 5px; align: right; font-weight: bold;"></td>';
                                html += '<td style="padding: 5px; align: right; font-weight: bold;"></td>';
                                html += '</tr>';
                                html += '<tr  style="font-weight: bold; border: 1px solid #ddd;">';
                                html += '<td  style="padding: 5px;font-size: 12px;">Text by FreshPoint</td>';
                                html += '<td  style="padding: 5px;font-size: 12px;">+ OIL CHANGE AND PM SERVICE</td>';
                                html += '<td  style="padding: 5px;font-size: 12px;">$643.77</td>';
                                html += '</tr>';
                                html += '</table>';
                            }

                             
                            if(Webmsgparam=='true')
                            {
                            html += '<b>NOTES</b>'; 
                            html += '<br/>';
                            html += '<table style="width: 100%; border-collapse: collapse; font-family: Arial, sans-serif;border: 1px solid #ddd;">';
                            html += '<tr style="background-color: #e0e0e0;  border: 1px solid #ddd;">';
                            html += '<td  tyle="padding: 5px; font-size: 14px;font-weight: bold;">Steven Schafer</td>';
                            html += '<td style="padding: 5px; align: right;"></td>';
                            html += '<td style="padding: 5px; align: right; ">7/25/2024 9:33 AM EDT</td>';
                            html += '</tr>';
                            html += '<tr  style=" border: 1px solid #ddd;">';
                            html += '<td  style="padding: 5px;font-size: 12px;">pick up the truck NOW</td>';
                            html += '<td  style="padding: 5px;font-size: 12px;"></td>';
                            html += '<td  style="padding: 5px;font-size: 12px;"></td>';
                            html += '</tr>';
                            html += '</table>';
                            html += '<br/>';
                            }

                            html += '<b> Needs Response</b>'; 

                            html +='<br/>'
                            html += '<table style="display:none;width: 100%; border-collapse: collapse; font-family: Arial, sans-serif;border: 1px solid #ddd;">';
                            html += '<tr style="background-color: #e0e0e0; font-weight: bold; border: 1px solid #ddd;">';
                            html += '<td colspan="4" style="padding: 5px; font-size: 14px;">STEER TIRES HAVE FLAT SPOTS/ STEER SHOCKS LEAKING - FAILED DOT INSPECTION</td>';
                            html += '<td style="padding: 5px; align: right; font-weight: bold;"></td>';
                            html += '</tr>';
                            html += '<tr style="font-weight: bold; border: 1px solid #ddd;">';
                            html += '<td  style="padding: 5px;"></td>';
                            html += '<td  style="padding: 5px;font-size: 12px;">Description</td>';
                            html += '<td style="padding: 5px;font-size: 12px;"></td>';
                            html += '<td  style="padding: 5px;font-size: 12px;align: right;">Price</td>';
                            html += '<td  style="padding: 5px;font-size: 12px;align: right;">Qty</td>';
                            html += '<td  style="padding: 5px;font-size: 12px;align: right;">Subtotal</td>';
                            html += '</tr>';

                            html += '<tr  style=" border: 1px solid #ddd;">';
                            html += '<td style="padding: 5px;font-size: 12px;">1</td>';
                            html += '<td style="padding: 5px;font-size: 12px;">R and R - Oil and flter change</td>';
                            html += '<td style="padding: 5px;font-size: 12px;"></td>';
                            if(Webrateparam =='true'){
                            html += '<td style="padding: 5px;font-size: 12px; align: right;">$230</td>';
                            }
                            else{
                                html += '<td style="padding: 5px;font-size: 12px; align: right;"></td>'; 
                            }
                            if(Webqtyparam=='true'){
                                html += '<td style="padding: 5px;font-size: 12px; align: right;">2</td>';
                            }
                            else{
                                html += '<td style="padding: 5px;font-size: 12px; align: right;"></td>';
                            }
                            
                            html += '<td style="padding: 5px;font-size: 12px; align: right;">$290.00</td>';
                            html += '</tr>';

                            html += '<tr style="background-color: #e0e0e0; border: 1px solid #ddd;">';
                            html += '<td style="padding: 5px;"></td>';
                            html += '<td style="padding: 5px;"></td>';
                            html += '<td  style="padding: 5px;align: right;font-size: 12px;">Shop Supplies (5%):</td>';
                            html += '<td style="padding: 5px;align: right;font-size: 12px;">Tax (7%): $78.28</td>';
                            html += '<td style="padding: 5px; align: right;font-size: 12px;">Total:</td>';
                            html += '<td style="padding: 5px; align: right;font-size: 12px;">$14.50</td>';
                            html += '</tr>';
                            html += '</table>';
                            

                            // html += '<br/>'
                            // html += '<table style="width: 100%; border-collapse: collapse; font-family: Arial, sans-serif;border: 1px solid #ddd;">';
                            // html += '<tr style="background-color: #e0e0e0; border: 1px solid #ddd;">';
                            // html += '<td style="padding: 5px; font-size: 14px;font-weight: bold;">Steven Schafer</td>';
                            // html += '<td style="padding: 5px; align: right; "></td>';
                            // html += '<td style="padding: 5px; align: right;">7/25/2024 9:33 AM EDT</td>';
                            // html += '</tr>';
                            // html += '<tr  style=" border: 1px solid #ddd;">';
                            // html += '<td  style="padding: 5px;font-size: 12px;">pick up the truck NOW</td>';
                            // html += '<td  style="padding: 5px;font-size: 12px;"></td>';
                            // html += '<td  style="padding: 5px;font-size: 12px;"></td>';
                            // html += '</tr>';
                            // html += '</table>';

                            
                        //html += "<pbr/>"; 
                        var xmlStr = "<?xml version=\"1.0\"?>\n<!DOCTYPE html PUBLIC \"-//big.faceless.org//report\" \"report-1.1.dtd\">\n";
                        xmlStr += "<pdf>";
                        xmlStr += "<head>";
                        xmlStr += "<style type='text/css'>";
                        xmlStr += "</style>";
                        xmlStr += "<meta name='title' value='Estimate'/>";
                        xmlStr += "<meta charset='utf-8' />";
                        xmlStr += "<macrolist>" +
                        "<macro id='myheader'>";
                        xmlStr += "";
                        xmlStr += htmlHeader;
                        xmlStr += "</macro>";
                        xmlStr += '<macro id="myfooter">';
                        xmlStr +=  htmlFooter;
                        xmlStr += "</macro>";
                        xmlStr += "</macrolist>"
                        xmlStr += "</head>";
                        xmlStr += "<body size='A4' class='text' header='myheader' header-height='2.5cm' footer='myfooter' footer-height='1cm'  style='margin-top:2px; margin-right:2px; margin-left:2px; margin-bottom:2px'>";
                        xmlStr += html;
                        xmlStr += "</body>";
                        xmlStr += "</pdf>";

                        context.response.renderPdf(xmlStr);

                    }
                }
				function getSalesOrderInfo(soid)
				{
					try{
						var salesorderSearchObj = search.create({
						   type: "salesorder", 
						   filters:
						   [
							  ["type","anyof","SalesOrd"], 
							  "AND", 
							  ["mainline","is","F"], 
							  "AND", 
							  ["taxline","is","F"], 
							  "AND", 
							  ["shipping","is","F"], 
							  "AND", 
							  ["internalid","anyof",soid],
							  "AND", 
							["custcol_advs_selected_inventory_type","noneof","19"]
						   ],
						   columns:
						   [
							  "item",
							  "quantity",
							  "rate",
							  "custcol_job_unique_code_id"
						   ]
						});
						var searchResultCount = salesorderSearchObj.runPaged().count;
						log.debug("salesorderSearchObj result count",searchResultCount);
						var _dataArr = [];
						salesorderSearchObj.run().each(function(result){
						   // .run().each has a limit of 4,000 results
						   var obj={};
						   obj.itemName = result.getText({name:'item'});
						   obj.itemId = result.getValue({name:'item'});
						   obj.qty = result.getValue({name:'quantity'});
						   obj.rate = result.getValue({name:'rate'});
						   obj.uniqueID = result.getValue({name:'custcol_job_unique_code_id'});
						   _dataArr.push(obj);
						   return true;
						});
						return _dataArr;
					}catch(e)
					{
						
					}
					
				}
				function findObjectsByValue(arr, key, value) 
				{
					var mainarr =[] ;
					arr.filter(function(obj){
						/* log.debug('key-->'+key,'obj-->'+obj+'value-->'+value);
						log.debug('obj[key]',obj[key]);
						log.debug('value',value);
						log.debug('obj[key] == value',(obj[key] == value)); */
						if(obj[key] == value){
							mainarr.push(obj);
							return obj;
						}
					})
					return mainarr;
					//return arr.filter(obj => obj[key] === value);
				};
				function groupByOptions(array, key){ 
				 
					  var ar = array.reduce(function(result, currentValue){ 
						if (!result[currentValue[key]]) {
							  result[currentValue[key]] = []
							}
							result[currentValue[key]].push(currentValue)
						return result;
					  }, {}) // empty object is the initial value for result object
					  return ar;
					} 

                return { onRequest }        
        }); 