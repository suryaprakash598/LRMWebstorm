/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
 
define(['N/record'],
    function (record) {
            function onRequest(context) {
                if (context.request.method == "GET") {
                    //vertical-align: top;
                            var htmlHeader = " ";
                            htmlHeader += "<table style='width: 100%;'>";
                            htmlHeader+=  "<tr><td>";
                            htmlHeader += "<table style='font-family: Arial Narrow, Arial, sans-serif; align:left;'>";
                            htmlHeader += "<tr><td style='align:center'><img src='https://8760954-sb1.app.netsuite.com/core/media/media.nl?id=4640&amp;c=8760954_SB1&amp;h=hOVnkhUkJlxiF1pyN-M-xif_-VbwypZKB5WC6IWXWlItXID6&amp;fcts=20240508232747&amp;whence=' alt='Image description' width='170px' height='70px' /></td>";
                            htmlHeader += "<td> Address:</td></tr>";
                            htmlHeader += "<tr><td></td></tr>";
                            htmlHeader += "</table>";

                            htmlHeader+= "</td>";
                            htmlHeader += "<td style=' align:right;'>";
                            htmlHeader += "<table style=' align: right;'>";
                            htmlHeader += "<tr><td style='align:right; font-size: 11px;'><b>estimate</b></td></tr>";
                            htmlHeader += "<tr><td style='align:right; font-size: 11px;'><b>Created:</b></td></tr>";
                            htmlHeader += "<tr><td style='align:right; font-size: 11px;' ><b>Payment Term:</b></td></tr>";
                            htmlHeader += "<tr><td style='align:right; font-size: 11px;'><b>Service Writer:</b></td></tr>";
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
                            html += '<tr><td></td></tr>';
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
                            html += '<tr><td colspan="2" style="font-size: 11px;"><strong>2019 FREIGHTLINER Cascadia (White, #KM0854)</strong></td></tr>';
                            html += '<tr><td style="font-size: 11px;"><strong>VIN:</strong></td><td style="font-size: 11px;">3AKJGLDR2KSKM0854</td></tr>';
                            html += '<tr><td style="font-size: 11px;"><strong>Mileage:</strong></td><td style="font-size: 11px;">594,861</td></tr>';
                            html += '</table>';
                            html += '</td></tr>';
                            
                            html += '<tr><td></td></tr>';
                            html += '</table>';
                            


                            html += '<table style="width: 100%; border-collapse: collapse; font-family: Arial, sans-serif;border: 1px solid #ddd;">';
                            html += '<tr style="background-color: #e0e0e0; font-weight: bold;">';
                            html += '<td colspan="4" style="padding: 5px; font-size: 14px;">NEW TRUCK INSPECTION  REGEN</td>';
                            html += '<td style="padding: 5px; align: right; font-weight: bold;"></td>';
                            html += '</tr>';

                            html += '<tr style="font-weight: bold;">';
                            html += '<td  style="padding: 5px;"></td>';
                            html += '<td colspan="3" style="padding: 5px;font-size: 12px;">Description</td>';
                            html += '<td style="padding: 5px;align: right;font-weight: bold;font-size: 12px;">Subtotal</td>';
                            html += '</tr>';

                            html += '<tr  style=" border: 1px solid #ddd;">';
                            html += '<td style="padding: 5px;font-size: 12px;">1</td>';
                            html += '<td style="padding: 5px;font-size: 12px;">Inspection, initial (including regen)</td>';
                            html += '<td style="padding: 5px;font-size: 12px; align: right;"></td>';
                            html += '<td style="padding: 5px;font-size: 12px; align: right;"></td>';
                            html += '<td style="padding: 5px;font-size: 12px; align: right;">$290.00</td>';
                            html += '</tr>';

                            html += '<tr style="background-color: #e0e0e0;">';
                            html += '<td style="padding: 5px;"></td>';
                            html += '<td colspan="2" style="padding: 5px;align: right;font-size: 14px;">Shop Supplies (5%):</td>';
                            html += '<td style="padding: 5px; align: right;font-size: 12px;">Total:</td>';
                            html += '<td style="padding: 5px; align: right;font-size: 12px;">$14.50</td>';
                            html += '</tr>';
            
                            html += '</table>';

                            html +='<br/>'
                            html += '<table style="width: 100%; border-collapse: collapse; font-family: Arial, sans-serif;border: 1px solid #ddd;">';
                            html += '<tr style="background-color: #e0e0e0; font-weight: bold;">';
                            html += '<td colspan="4" style="padding: 5px; font-size: 14px;">NEW TRUCK INSPECTION  REGEN</td>';
                            html += '<td style="padding: 5px; align: right; font-weight: bold;"></td>';
                            html += '</tr>';

                            html += '<tr style="font-weight: bold;">';
                            html += '<td  style="padding: 5px;"></td>';
                            html += '<td  style="padding: 5px;font-size: 12px;">Description</td>';
                            html += '<td  style="padding: 5px;font-size: 12px;align: right;">Price</td>';
                            html += '<td  style="padding: 5px;font-size: 12px;align: right;">Qty</td>';
                            html += '<td  style="padding: 5px;font-size: 12px;align: right;">Subtotal</td>';
                            html += '</tr>';

                            html += '<tr  style=" border: 1px solid #ddd;">';
                            html += '<td style="padding: 5px;font-size: 12px;">1</td>';
                            html += '<td style="padding: 5px;font-size: 12px;">Inspection, initial (including regen)</td>';
                            html += '<td style="padding: 5px;font-size: 12px; align: right;">$230</td>';
                            html += '<td style="padding: 5px;font-size: 12px; align: right;">2</td>';
                            html += '<td style="padding: 5px;font-size: 12px; align: right;">$290.00</td>';
                            html += '</tr>';

                            html += '<tr style="background-color: #e0e0e0;">';
                            html += '<td style="padding: 5px;"></td>';
                            html += '<td colspan="2" style="padding: 5px;align: right;font-size: 14px;">Shop Supplies (5%):</td>';
                            html += '<td style="padding: 5px; align: right;font-size: 12px;">Total:</td>';
                            html += '<td style="padding: 5px; align: right;font-size: 12px;">$14.50</td>';
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
                            html += '                    <td style="align:left;">$747.56</td>';
                            html += '                </tr>';
                            html += '                <tr>';
                            html += '                    <td ><b>Labor</b>.....................</td>';
                            html += '                    <td style="align:left;">$1,595.00</td>';
                            html += '                </tr>';
                            html += '                <tr>';
                            html += '                    <td><b>Subtotal</b>.....................</td>';
                            html += '                    <td style="align:left; ">$2,342.56</td>';
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





                            // html += '<table style="width: 100%; border-collapse: collapse;font-size: 10px;">';
                            // html += '    <tr>';
                            // html += '        <td >';
                            // html += '            <b>Estimate Approval and Payments:</b>';      
                            // html += '                <p>- I have the right to know the repairs and their costs before authorizing them.</p>';
                            // html += '                <p>- There are no returns or exchanges for any parts purchased, including electrical components.</p>';
                            // html += '                <p>- All work is fnal, with no warranties or guarantees unless otherwise documented.</p>';
                            // html += '            <b>Customer Rights and Responsibilities:</b>';      
                            // html += '                <p>- Estimates must be approved within 2 business days. Failure to do so may result in a storage charge of $100 per day (or $200/day for truck and trailer).</p>';
                            // html += '                <p>- A 50% deposit is required upon approval of the estimate before work can begin.</p>';
                            // html += '                <p>- The remaining balance is due within 2 business days of work completion, and the vehicle must be picked up within this period. Failure to pick up the vehicle or pay the balance will result in a storage charge of $100 per day (or $200/day for truck and trailer).</p>';
                            // html += '            <b>Liability:</b>';      
                            // html += '                <p>- LRM Truck Repair, its employees, management, and owners are not responsible for damage or theft of the vehicle or its contents.</p>';
                            // html += '                <p>Payment and Delivery Agreement</p>';
                            // html += '                <p>By making payment and taking delivery of your vehicle, you acknowledge and agree to the following:</p>';
                            // html += '                <p>- I have reviewed and confrmed the payment amount and method as correct and satisfactory.</p>';
                            // html += '                <p>- I confrm the authenticity and authorization of the charge.</p>';
                            // html += '                <p>- I have received and reviewed the goods or services as described in this invoice, and confrm they are in satisfactory condition and that the services have been provided to my satisfaction.</p>';
                            // html += '                <p>- I agree that no returns or cancellations of any kind will be accepted after delivery.</p>';
                            // html += '                <p>- I acknowledge that I have no reason to initiate a chargeback on my credit card and will not do so for any reason.</p>';
                            // html += '        </td>';
                            // html += '    </tr>';
                            // html += '    <tr>';
                            // html += '        <td>';
                            // html += '        </td>';
                            // html += '    </tr>';
                            // html += '    <tr>';
                            // html += '        <td>';
                            // html += '        </td>';
                            // html += '    </tr>';
                            // html += '</table>';

                            html +='<br/>'
                            html += "<div>";
                            html += "<p style='align:left;font-size: 13px;'><b> Signature_____________________________</b></p>"
                            html += "</div>";




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
                return { onRequest }        
        });