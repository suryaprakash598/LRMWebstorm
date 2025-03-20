/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
 
define(['N/record'],
    function (record) {
            function onRequest(context) {
                if (context.request.method == "GET") {
                    // var RecordId = context.request.parameters.custparam_record_id;

                    //var SMainLogo="http://8760954-sb1.shop.netsuite.com/core/media/media.nl?id=4640&c=8760954_SB1&h=hOVnkhUkJlxiF1pyN-M-xif_-VbwypZKB5WC6IWXWlItXID6"

                    // html += "<table style='width: 100%;'>";
                        // html += "<tr>";
                       
                        // html += "<td style='width:50%; vertical-align: top; text-align: left;'>";
                        // html += "<img src='https://8760954-sb1.app.netsuite.com/core/media/media.nl?id=4640&amp;c=8760954_SB1&amp;h=hOVnkhUkJlxiF1pyN-M-xif_-VbwypZKB5WC6IWXWlItXID6&amp;fcts=20240508232747&amp;whence=' alt='Image description' width='150px' height='30px' />";
                        // html += "</td>";
                        
                        
                        // html += "<td style='width: 50%;font-size: 10px; vertical-align: top; align: right;'>";
                        // html += "<b style='font-size: 14px'>LRM LEASING COMPANY, INC</b><br/>";
                        // html += "2160 Blount Road<br/>";
                        // html += "Pompano Beach, FL 33069<br/>";
                        // html += "954-791-1400";
                        // html += "</td>";
                        // html += "</tr>";
                        // html += "</table>";

                        // html +="<br/>";
                        // html +="<br/>";

                        var htmlHeader = " ";
                        htmlHeader += " <table style='width: 100%;'>";
                        htmlHeader+= "<tr><td>";
                        htmlHeader +=   "<table style='font-family: Arial Narrow, Arial, sans-serif; align:left;'>";
                        htmlHeader += "<tr><td style='align:center'><img src='https://8760954-sb1.app.netsuite.com/core/media/media.nl?id=4640&amp;c=8760954_SB1&amp;h=hOVnkhUkJlxiF1pyN-M-xif_-VbwypZKB5WC6IWXWlItXID6&amp;fcts=20240508232747&amp;whence=' alt='Image description' width='150px' height='30px' /></td></tr>";
                        htmlHeader +=   " </table>";
                        htmlHeader+= "</td>";
                        htmlHeader += "<td style='vertical-align: top; align:right;'>";
                        htmlHeader +=  "<table style=' align: right;'>";
                        htmlHeader +=  "<tr><td style='align:right; font-size: 11px;'><b>LRM LEASING COMPANY, INC</b></td></tr>";
                        htmlHeader +=  "<tr><td style='align:right; font-size: 11px;'>2160 Blount Road</td></tr>";
                        htmlHeader += "<tr><td style='align:right; font-size: 11px;' >Pompano Beach, FL 33069</td></tr>";
                        htmlHeader +=       "<tr><td style='align:right; font-size: 11px;'>954-791-1400</td></tr>";
                        htmlHeader +=   " </table>";
                        htmlHeader +=    "</td></tr>";
                        htmlHeader +=   " </table>";
                        

                    var html = "";
                       
                        // html += "<div > </div >";
                        // html += "<div > </div >";
                        // html += "<div > </div >";
                        html +="<br/>";
                        html +="<br/>";

                        html += "<div >";
                        html += "<table style='width: 100%;font-size: 20px; font-weight: bold;'>";
                        html += "<tr><td  colspan='2' style='align: center;'>Title Transfer</td></tr>";
                        html += "</table>";
                        html += "</div >";
                

                         html +="<br/>";
                         html +="<br/>";
                       

                        html += "<div>";
                        html += "<div>";
                        html += "<p style='font-size: 14px;'>";
                        html += "It is hereby acknowledged and agreed that upon the maturity of the lease agreement and once the purchase option has been satisfied for the below listed vehicle, the title will be transferred and signed over to:";
                        html += "</p>";
                        html += "</div>";

                        html +="<br/>";
                        

                        html += "<div>";
                        html += "<p style='font-size: 14px;' >Name of Individual or Company on the Lease Agreement:</p>";
                        html +="<p>_____________________________________________</p>"
                        html += "</div>";

                        html += "<div>";
                        html += "<p style='font-size: 14px;'>I understand that this decision cannot be changed for any reason whatsoever x________</p>";
                        html += "</div>";

                        html += '<hr style="width: 100%;"/>';

                        html += "<div>";
                        html += "<p style='font-size: 14px;align: center;'>Leased Vehicle or Equipment — VIN #, Serial #, or Other Identification</p>";
                        html +="<p style='font-size: 14px;' >Year: _______ Make: _________________ Model: _________________ Transmission: _________ Color: ____________</p>";
                        html +="<p style='font-size: 14px;'>VEHICLE IDENTIFICATION NUMBER:<b> _____________________________________________</b></p>";
                        html += "</div>";

                        html += '<hr style="width: 100%;"/>';

                        html +="<br/>";
                        

                        html += '<div >';
                        html += '<p style="font-size: 14px;">Print: ____________________________ Sign: ____________________________</p>';
                        html += '<p style="font-size: 14px;">Individually</p>';
                        html += '<p style="font-size: 14px;">Date: ____________________________</p>';
                        html += '<br/>';
                        html += '<div ></div>';
                        html += '<p style="font-size: 14px;">Print: ____________________________ Sign: ____________________________</p>';
                        html += '<p style="font-size: 14px;">Authorized agent of the company</p>';
                        html += '<p style="font-size: 14px;">Date: ____________________________</p>';
                        html += '</div>';
                        html += "</div >";

                





                        var xmlStr = "<?xml version=\"1.0\"?>\n<!DOCTYPE html PUBLIC \"-//big.faceless.org//report\" \"report-1.1.dtd\">\n";
                        xmlStr += "<pdf>";
                        xmlStr += "<head>";
                        xmlStr +="<style type='text/css'>";
                        xmlStr +="</style>";
                        xmlStr += "<meta name='title' value='TITLE TRANSFER'/>";
                        xmlStr += "<meta charset='utf-8' />";
                        xmlStr += "<macrolist>" +
                        "<macro id='myheader'>";
                        xmlStr += "";
                        xmlStr += htmlHeader;
                        xmlStr += "</macro>";
                        xmlStr += '<macro id="myfooter">';
         
                       
                        xmlStr += "</macro>";
                        xmlStr += "</macrolist>"
                        xmlStr += "</head>";
                        xmlStr += "<body size='letter' class='text' header='myheader' header-height='2cm' footer='myfooter' footer-height='0cm'  style='margin-top:-10mm; margin-right:3px; margin-left:3px; margin-bottom:-10mm;'>";
         
                        xmlStr += html;
                        xmlStr += "</body>";
         
                        xmlStr += "</pdf>";
                   
                        context.response.renderPdf(xmlStr);
    
                    }
                }
 
               
                return { onRequest }        
        });