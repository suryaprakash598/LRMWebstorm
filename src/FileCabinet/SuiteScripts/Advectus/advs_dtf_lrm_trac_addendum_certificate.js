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

                    var htmlHeader = " ";
                    htmlHeader += " <table style='width: 100%;'>";
                    htmlHeader+= "<tr><td>";
                    htmlHeader +=   "<table style='font-family: Arial Narrow, Arial, sans-serif; align:left;'>";
                    htmlHeader += "<tr><td style='align:center'><img src='https://8760954-sb1.app.netsuite.com/core/media/media.nl?id=4640&amp;c=8760954_SB1&amp;h=hOVnkhUkJlxiF1pyN-M-xif_-VbwypZKB5WC6IWXWlItXID6&amp;fcts=20240508232747&amp;whence=' alt='Image description' width='150px' height='70px' /></td></tr>";
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

                    html += "<table width = '100%' font-size='12px'  style=' width: 100%; font-family: Arial Narrow, Arial, sans-serif; text-align: center;' margin-top= '10mm'  >";
                    html  += "<tr><td  font-size='14px'   style='align: center;'><b>TRAC ADDENDUM</b></td></tr>";
                    html  += "<tr><td  font-size='14px'   style='align: center;'><b>MOTOR VEHICLE LEASE AGREEMENT</b></td></tr>";
                    html  += "<tr><td  font-size='12px'>  Year:________	Make: ________________Model: ________________Transmission:__________ Color:____________</td></tr>";
                    html  += "<tr><td border-bottom = '1px'>  VEHICLE IDENTIFICATION NUMBER: __________________________________________________</td></tr>";
                    html += "<tr><td colspan='5'><b>TRAC Amount: $______________</b></td></tr>";
                    html += "</table>";


    
                    
                    html += "<table font-size='12px' style='width: 100%; margin-top: 10px;'>";
                    html += "<tr>";
                    html += "<td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<b>THIS TRAC Addendum</b> (the &quot;Addendum&quot;) to the above Motor Vehicle Lease Agreement (the &quot;Lease&quot;), between <b>LRM LEASING COMPANY</b>, INC. , (&quot;Lessor&quot;) and the undersigned lessee (&quot;Lessee&quot;) is hereby incorporated into and made a part of the Lease. Capitalized terms used herein and not otherwise defined shall have the meanings assigned thereto in the Lease.  This Addendum shall amend the Lease only to the extent as stated herein, and all other terms and conditions stated in the Lease shall be and remain in full force and effect.  To the extent that any terms of this Addendum conflict with any provisions of the Lease, the terms of this Addendum shall control. The term &quot;Equipment&quot; when used herein refers to the Equipment leased under the Lease. The Lease is hereby supplemented and amended by addition of the following language: 1.  <b><u>Purchase Option  Price.</u></b>  The parties acknowledge that the TRAC Amount is the Purchase Option Price and that it represents a reasonable estimate of the fair market value of the Equipment if maintained and returned in accordance with the Lease.  If Lessee purchases the Equipment, Lessee promises to pay the TRAC Amount to Lessor on the last day of the Initial Lease Term. 2.  <b>Rent Adjustment.</b>  If Lessee does not elect to purchase the Equipment as set forth in the Lease, Lessee shall return all Equipment to Lessor at the end of the Term in accordance with the terms of the Lease and Lessor shall sell the Equipment.  If the Realized Value exceeds the TRAC Amount, Lessor will pay over to Lessee any such excess.  If the Realized Value is less than the TRAC Amount, Lessee shall pay any such deficiency to Lessor as a Rental adjustment.  As used herein, the “Realized Value” shall mean an amount equal to: (a) the after-tax amount received by Lessor in immediately available funds from the purchaser; minus (b) any amounts remaining due under the Lease, minus (c) all costs of sale or disposition, including without limitation all sales and other taxes and all marketing, brokerage, repair, refurbishment, advertising costs and all other commissions or expenses. Lessee agrees to cooperate in any such sale of the Equipment and hereby grants to Lessor, its agents or employees, the right to enter Lessee’s premises for the purpose of selling or otherwise disposing of the Equipment. In the event Lessor is unable to sell the Equipment within thirty (30) days of the end of the Lease, on request of Lessor, Lessee shall remit to Lessor the TRAC Amount plus all other amounts set forth in section 1 hereof that would be payable on execution of a purchase option. On receipt of such payment, Lessor shall convey the Equipment to Lessee as provided herein. Lessor shall have no obligations under this paragraph if Lessee is in default under the Lease and any amount due from Lessee on default shall be determined in accordance with the Lease and Lessor’s recovery shall include the TRAC Amount as its estimated residual interest in the Equipment. 3.  <b>Final Sale; Lessee Default. </b>  In any sale or conveyance hereunder to Lessee or any other party, Lessor shall convey title to the Equipment &quot;AS-IS, WHERE IS&quot;, WITH ALL FAULTS, WITHOUT RECOURSE TO LESSOR AND WITHOUT REPRESENTATION OR WARRANTY OF ANY KIND WHATSOEVER BY LESSOR, EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR USE OR PURPOSE. It shall be an Event of Default under the Lease if: (a) Lessee fails to pay Lessor the TRAC Amount after electing to purchase the Equipment in accordance with Section 1 of this Addendum; (b) Lessee fails to return the Equipment if required pursuant to Section 2 of this Addendum; or (c) Lessor does not receive any amounts owed by Lessee pursuant to Section 2 of this Addendum within three (3) days of the date requested by Lessor. 4.  <b><u>Lessee Representations. </u></b>  Lessee represents and warrants to Lessor that: (a) each item of Equipment leased pursuant to the Lease is a &quot;motor vehicle&quot; as such term is used in Internal Revenue Code Section 7701(h); (b) this Addendum is a &quot;terminal rental adjustment clause&quot; as such term is used in Code Section 7701(h); and (c) the Lease and this Addendum constitute a &quot;qualified motor vehicle operating agreement&quot; as such term is used in said Section 7701(h).</td>";
                    html += "</tr>";
                    html += "<tr><td><b>IN WITNESS WHEREOF</b>, the parties have caused this Addendum to be executed as of the date of the Lease.</td></tr>"
                    html += "</table>";
                    
                    html += "<table style='width: 100%; font-family: Arial Narrow, Arial, sans-serif; border: 1px solid black; margin-top: 10mm; font-size: 11.3px; border-collapse: collapse;'>"; // Added 'border-collapse' for proper border styling
                    html += "<tr>";
                    html += "<td colspan='3' style='border-right: 1px solid black; border-bottom: 1px solid black;'><i>LESSEE (Authorized Agent or as Individual) &amp; Co-Signer</i></td>"; // Moved border styling to 'style' attribute
                    html += "<td colspan='3' style='border-right: 0; border-bottom: 1px solid black;'><i>LESSOR</i></td>";
                    html += "</tr>";
                    html += "<tr>";
                    html += "<td style='border-bottom: 1px solid black;'><i>SIGNATURE (Lessee &amp;  Co-Signer)</i></td>";
                    html += "<td style='border-bottom: 1px solid black;'><i>Title </i></td>";
                    html += "<td style='border-right: 1px solid black; border-bottom: 1px solid black;'><i>Date</i></td>";
                    html += "<td style='border-bottom: 1px solid black;'><i>SIGNATURE </i></td>";
                    html += "<td style='border-bottom: 1px solid black;'><i>Title</i></td>";
                    html += "<td style='border-bottom: 1px solid black;'><i>Date</i></td>";
                    html += "</tr>";
                    html +="</table>";

                    html += "<table font-size='12px'  style=' width: 100%; font-family: Arial Narrow, Arial, sans-serif; text-align: center; ' margin-top= '5mm'  >";
                    html  += "<tr><td  font-size='14px'   style='align: center;'><b>TRAC CERTIFICATE</b></td></tr>";
                    html  += "<tr><td  font-size='12px'> Pursuant to the requirements of Section 7701(h) of the Internal Revenue Code Lessee hereby certifies under penalty of perjury under the laws of the United States of America that the following is true and correct: (1) Lessee intends that more than 50% of the use of the Equipment is to be in a trade or business of the Lessee; and (2) Lessee acknowledges that Lessee has been advised by Lessor that Lessee will not be treated as the owner of the Equipment for federal income tax purposes. </td></tr>";
                    html += "<tr><td style = 'align: right; text-align: left'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;LESSEE: </td></tr>";
                    html += "<tr><td style = 'align: right; text-align: left'>By:___________________</td></tr>";
                    html += "<tr><td style = 'align: right; text-align: left'>Name:___________________</td></tr>";
                    html += "<tr><td style = 'align: right; text-align: left'>Title:___________________</td></tr>";
                    html += "</table>";

    ;
                    
                    
                    

 
     
                var xmlStr = "<?xml version=\"1.0\"?>\n<!DOCTYPE html PUBLIC \"-//big.faceless.org//report\" \"report-1.1.dtd\">\n";
                    xmlStr += "<pdf>";
                    xmlStr += "<head>";
                    xmlStr +="<style type='text/css'>";
                    xmlStr +="</style>";
                    xmlStr += "<meta name='title' value='LRM TRAC Addendum and Certificate- 2024 dtf'/>";
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