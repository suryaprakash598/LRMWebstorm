/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
 
define(['N/record'],
 
    function (record) {
     
            function onRequest(context) {
     
                if (context.request.method == "GET") {

                    var html = "";
                    var htmlHeader =  "";

                    htmlHeader +=   "<table  font-size='20px' style='font-family: Arial Narrow, Arial, sans-serif; align:center;'>";
                    
                    htmlHeader += "<tr><td style='align:center'><img src='https://8760954-sb1.app.netsuite.com/core/media/media.nl?id=4640&amp;c=8760954_SB1&amp;h=hOVnkhUkJlxiF1pyN-M-xif_-VbwypZKB5WC6IWXWlItXID6&amp;fcts=20240508232747&amp;whence=' alt='Image description' width='150px' height='100px' /></td></tr>";

                    htmlHeader +=   " </table>";
                
        
                    // First Table
                    html += "<table style='width: 100%; margin-top: 20px; font-family: Arial Narrow, Arial, sans-serif; font-size: 12pt;'>"; // Set the font size for the whole table
                    html += "<tr style='padding-top: 20px;'>";
                    html += "<td style='padding: 6px 0 2px; color: #333333;'>I, ______________________________, lessee of the listed vehicle below, authorize LRM Leasing <br />Company Inc. to release my leased vehicle into the possession of:</td></tr>";
                    html += "<tr style='padding-top: 15px;'>";
                    html += "<td style='padding: 6px 0 2px; color: #333333;'>Other (if applicable):</td></tr>";
                    html += "<tr style='padding-top: 15px;'>";
                    html += "<td style='padding: 6px 0 2px; color: #333333;'>Name ______________________________</td></tr>";
                    html += "<tr style='padding-top: 15px;'>";
                    html += "<td style='padding: 6px 0 2px; color: #333333;'>Drivers Licence # ______________________________</td></tr>";
                    html += "<tr style='padding-top: 15px;'>";
                    html += "<td style='padding: 6px 0 2px; color: #333333;'>State DL issued ______________________________</td></tr>";
                    html += "</table>";

                    // Second Table
                    html += "<table style='width: 100%; margin-top: 10px; font-family: Arial Narrow, Arial, sans-serif; font-size: 12pt;'>"; // Set the font size for the whole table
                    html += "<tr style='padding-top:20px;'>";
                    html += "<td style='padding: 6px 0 2px; color: #333333;'>Year :</td></tr>"; // Removed individual font-size styling
                    html += "<tr style='padding-top:15px;'>";
                    html += "<td style='padding: 6px 0 2px; color: #333333;'>Make :</td></tr>";
                    html += "<tr style='padding-top:15px;'>";
                    html += "<td style='padding: 6px 0 2px; color: #333333;'>Vin :</td></tr>";
                    html += "</table>";

                    // Third Table
                    html += "<table style='width: 100%; margin-top: 10px; font-family: Arial Narrow, Arial, sans-serif; font-size: 12pt;'>"; // Set the font size for the whole table
                    html += "<tr style='padding-top:15px;'>";
                    html += "<td style='padding: 6px 0 2px; color: #333333;'>Lessee:</td></tr>";
                    html += "<tr style='padding-top:15px;'>";
                    html += "<td style='padding: 6px 0 2px; color: #333333;'>Name: ______________________________</td>";
                    html += "</tr>";
                    html += "<tr style='padding-top:15px;'>";
                    html += "<td style='padding: 6px 0 2px; color: #333333;'>Signature: ______________________________</td>";
                    html += "</tr>";
                    html += "<tr style='padding-top:15px;'>";
                    html += "<td style='padding: 6px 0 2px; color: #333333;'>Date: ______________________________</td>";
                    html += "</tr>";
                    html += "</table>";

 
     
                var xmlStr = "<?xml version=\"1.0\"?>\n<!DOCTYPE html PUBLIC \"-//big.faceless.org//report\" \"report-1.1.dtd\">\n";
                    xmlStr += "<pdf>";
                    xmlStr += "<head>";
                    xmlStr +="<style type='text/css'>";
                    xmlStr +="</style>";
                    xmlStr += "<meta name='title' value='Driver Release Authorization'/>";
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
                    xmlStr += "<body size='letter' class='text' header='myheader' header-height='3cm' footer='myfooter' footer-height='1cm'  style='margin-top:-10mm; margin-right:-10mm; margin-left:-10mm; margin-bottom:-10mm;'>";
     
                    xmlStr += html;
     
                    xmlStr += "</body>";
     
     
                    xmlStr += "</pdf>";
     
               
                    context.response.renderPdf(xmlStr);
     
     
                    }
                }
     
                return { onRequest }        
     
        });