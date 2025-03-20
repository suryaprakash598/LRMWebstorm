/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
 
define(['N/record'],
    function (record) {
            function onRequest(context) {
                if (context.request.method == "GET") {
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
                        html +="<br/>";
                        html +="<br/>";

                        html += "<div >";
                        html += "<table style='width: 100%;font-size: 20px; font-weight: bold;'>";
                        html += "<tr><td  colspan='2' style='align: center;'><u>ACCEPTANCE CERTIFICATE</u></td></tr>";
                        html += "</table>";
                        html += "</div >";

                        html += "<p style='align: center;font-size: 13px;'>LEASE DATED ______________ (“LEASE”)</p>"
                        html += "<p style='align: center;font-size: 13px;'>BETWEEN LRM LEASING COMPANY, INC. (“LESSOR”) AND THE UNDERSIGNED LESSEE (“LESSEE”)</p>"
                

                        

                        html += "<div>";
                        html += "<div>";
                        html += "<p style='font-size: 14px;'>";
                        html += "I, acting on behalf of the Lessee, acknowledge that I have personally inspected or caused to be personally inspected to my satisfaction all items of Equipment described in the above Lease and that I am duly authorized on behalf of the Lessee to sign and bind the Lessee to the Lease. ";
                        html += "</p>";
                        html += "<p style='font-size: 14px;'>";
                        html += "The Equipment has been received, inspected and is complete, operational, in good condition and working order, and satisfactory in all respects and conforms to all specifications required by Lessee ";
                        html += "</p>";
                        html += "<p style='font-size: 14px;'>";
                        html += "Lessee hereby accepts the Equipment and acknowledges that the Lease commenced.  Lessee further acknowledges that this Lease is NON-CANCELLABLE, ABSOLUTE, AND IRREVOCABLE. Lessee certifies that no Event of Default or event that with notice of lapse of time would become a Default currently exists. ";
                        html += "</p>";
                        html += "</div>";

                        html += "<div>";
                        html += "<p style='font-size: 14px;align: center;'>Leased Vehicle or Equipment—VIN #, Serial #, or Other Identification</p>";
                        html +="<p style='font-size: 14px;' >Year: _______ Make: _________________ Model: _________________ Transmission: _________ Color: ____________</p>";
                        html +="<p style='font-size: 14px;'>VEHICLE IDENTIFICATION NUMBER:<b> _____________________________________________</b></p>";
                        html += "</div>";

                        html += '<hr style="width: 100%;"/>';

                        html +="<br/>";

                        html += '<table style="width: 100%; border-collapse: collapse;font-size: 8px;">';
                        html += '    <tr style=" height: 45px;">';
                        html += '        <td    style="border: 1px solid black; width: 50%; height: 100px; text-align: center; vertical-align: top;">';
                        html += '            <strong>LESSEE</strong> (Authorized Agent or as Individual) and Co-Signer';
                        html += '        </td>';
                        html += '        <td  style="border: 1px solid black; width: 50%; height: 100px; text-align: center; vertical-align: top;">';
                        html += '            <strong>LESSOR</strong>';
                        html += '        </td>';
                        html += '    </tr>';
                        html += '    <tr  style=" height: 45px;">';
                        html += '  <td style="border: 1px solid black; vertical-align: top;">';
                        html += '    <table style="width: 100%; ">';
                        html += '      <tr>';
                        html += '        <td style=" height: 100px; text-align: center; vertical-align: top;">';
                        html += '          <strong>SIGNATURE (Lessee and Co-Signer)</strong>';
                        html += '        </td>';
                        html += '        <td style=" height: 100px; text-align: center; vertical-align: top;">';
                        html += '          <strong>Title</strong>';
                        html += '        </td>';
                        html += '        <td style=" height: 100px; text-align: center; vertical-align: top;">';
                        html += '          <strong>Date</strong>';
                        html += '        </td>';
                        html += '      </tr>';
                        html += '    </table>';
                        html += '  </td>';
                        
                        html += '  <td style="border: 1px solid black; vertical-align: top;">';
                        html += '    <table style="width: 100%; border-collapse: collapse;">';
                        html += '      <tr>';
                        html += '        <td style="height: 100px; text-align: center; vertical-align: top;">';
                        html += '          <strong>SIGNATURE</strong>';
                        html += '        </td>';
                        html += '        <td style=" height: 100px; text-align: center; vertical-align: top;">';
                        html += '          <strong>Title</strong>';
                        html += '        </td>';
                        html += '        <td style=" height: 100px; text-align: center; vertical-align: top;">';
                        html += '          <strong>Date</strong>';
                        html += '        </td>';
                        html += '      </tr>';
                        html += '    </table>';
                        html += '  </td>';

                        html += '    </tr>';
                        html += '</table>';

                        
                        html += "</div>";


                        


                





                        var xmlStr = "<?xml version=\"1.0\"?>\n<!DOCTYPE html PUBLIC \"-//big.faceless.org//report\" \"report-1.1.dtd\">\n";
                        xmlStr += "<pdf>";
                        xmlStr += "<head>";
                        xmlStr +="<style type='text/css'>";
                        xmlStr +="</style>";
                        xmlStr += "<meta name='title' value='ACCEPTANCE CERTIFICATE'/>";
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