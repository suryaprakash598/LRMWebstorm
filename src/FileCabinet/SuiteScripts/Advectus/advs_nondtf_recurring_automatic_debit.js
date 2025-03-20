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
                        htmlHeader +=  "<tr><td style='align:right; font-size: 11px;'>954-791-1400</td></tr>";
                        htmlHeader +=   " </table>";
                        htmlHeader +=    "</td></tr>";
                        htmlHeader +=   " </table>";
                        

                    var html = "";
                        html +="<br/>";
                        html +="<br/>";
                        html += "<div >";
                        html += "<table style='width: 100%;font-size: 17px; font-weight: bold;'>";
                        html += "<tr><td  colspan='2' style='align: center;'>Authorization for Recurring Automatic Debit</td></tr>";
                        html += "</table>";
                        html += "</div >";
                        html += "<p style='align: left;font-size: 13px;'>Signing up for automatic debits to pay your LRM Leasing, Inc. (“LRM”) payments is a free service and easy.Review the Terms and Conditions, complete all sections of the form, sign and date</p>"
                
                        
                        html += "<p style='align:left;font-size: 13px;'><b>Section 1: Customer Information</b></p>"
                        html += '<table style=" font-size: 13px; width: 70%; border-collapse: collapse; border: 1px solid black;">';
                        html += '    <tr>';
                        html += '        <td style="border: 1px solid black; padding: 10px;">';
                        html += '            Customer Name';
                        html += '        </td>';
                        html += '    </tr>';
                        html += '    <tr>';
                        html += '        <td style="border: 1px solid black; padding: 10px;">';
                        html += '            Financial Institution Name';
                        html += '        </td>';
                        html += '    </tr>';
                        html += '    <tr>';
                        html += '        <td style="border: 1px solid black; padding: 10px;">';
                        html += '            Financial Institution Routing Number';
                        html += '        </td>';
                        html += '    </tr>';
                        html += '    <tr>';
                        html += '        <td style="border: 1px solid black; padding: 10px;">';
                        html += '            Name(s) As Shown On Account';
                        html += '        </td>';
                        html += '    </tr>';
                        html += '    <tr>';
                        html += '        <td style="border: 1px solid black; padding: 10px;">';
                        html += '            Account Number';
                        html += '        </td>';
                        html += '    </tr>';
                        html += '</table>';

                        html += "<p style='align:left;font-size: 14px;'><b>***ATTACH A VOIDED CHECK***</b></p>"
                        html += "<p style='align:left;font-size: 13px;'><b>Section 2:   Payment Information</b></p>"


                      
                        html += "<div>";
                        html += "<p style='font-size: 14px;'>";
                        html += "I ___________________ authorize LRM to charge my bank account indicated above for the amount, frequency, and date under the “Term and Payment Schedule” of your Motor Vehicle Lease Agreement.  In the event that additional amounts are due under the Motor Vehicle Lease Agreement such as, but not limited to, prior failed ACH drafts, non-sufficient funds fees, collateral protection fees, personal property taxes, late fees, and any other charges that may be assessed and owed to LRM; I authorize LRM to make changes to the amount or frequency being drafted";
                        html += "</p>";
                        html += "</div>";

                        html += "<div>";
                        html += "<p style='align:left;font-size: 13px;'><b>Section 3: Signature</b></p>"
                        html += "<p style='font-size: 14px;'>";
                        html += "By signing below, I acknowledge that I have reviewed the Automatic Debit Authorization Terms and Conditions. I further authorize LRM to initiate debit entries to the financial institution defined in Section 1 of this form for the amount specified in Section 2, including but not limited to, any past due payments, fees, or other charges to your account. I understand that this authorization will remain in effect until (1) all payments required by the Lease Agreement have been satisfied or (2) LRM receives notification from me and LRM approves to revoke this authorization. I also understand that LRM may at its discretion attempt to process the charge again within 5 days and agrees to the additional fees because of prior rejected failed ACH transactions. I acknowledge that the origination of ACH transactions to my account must comply with the provisions of U.S. law. I certify that I am an authorized user of this bank account and will not dispute these scheduled transactions with my bank.";
                        html += "</p>";
                        html += "</div>";

                        html += "<div>";
                        html += "<table style='width: 100%;'>";
                        html += "<tr>";
                        html += "<td style='font-size: 11px;'><b>SIGNATURE:_____________________________________</b></td>";
                        html += "<td style='font-size: 11px;'><b>DATE:_____________________________________</b></td>";
                        html += "</tr>";
                        html += "</table>";
                        html += "</div>";
                       

                        html += "<pbr/>";
                        html +="<br/>";
                        html +="<br/>";
                        html += "<div >";
                        html += "<table style='width: 100%;font-size: 15px; font-weight: bold;'>";
                        html += "<tr><td colspan='2' style='align: center;'>Automatic Debit Authorization Terms and<br/>";
                        html += "<span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Conditions</span></td></tr>";
                        html += "</table>";
                        html += "</div >";



                        html += "<div>";
                        html += "<p style='align:left;font-size: 13px;'><b>Payment Information</b></p>"
                        html += "<p style='font-size: 14px;'>";
                        html += "Automatic payments will begin with the next unbilled statement cycle after the completed form has been received. If automatic payments cannot be established for any reason, such as an incorrect routing number, LRM will contact you to discuss the issue. This may cause a delay in your automatic payments. You will still be responsible to make any billed payments until the automatic payments have been established.";
                        html += "</p>";
                        html += "<p style='font-size: 14px;'>";
                        html += "If the lease payment due date falls on a weekend or holiday, payments will be executed on the following business day.";
                        html += "</p>";
                        html += "</div>";

                        html += "<div>";
                        html += "<p style='align:left;font-size: 13px;'><b>Fee Assessments</b></p>"
                        html += "<p style='font-size: 14px;'>";
                        html += "If, for any reason, LRM is unable to deduct payments from your account, you are still required to remit your monthly payment amount. You will receive notification that the automatic debit failed and are responsible for making any past due payments, including any and all fees and taxes. Returned payments will result in a $50 charge (subject to change at LRM’s discretion at any point during the Lease Agreement) and 10% late fee charge assessment on your lease account if payment is not received by the end of the grace period as outlined in your Motor Vehicle Lease Agreement. Late charges and other fee assessments will be drafted in the next available payment due date immediately after the assessment date. ";
                        html += "</p>";
                        html += "</div>";

                        html += "<div>";
                        html += "<p style='align:left;font-size: 13px;'><b>Cancellation of Automatic Debits</b></p>"
                        html += "<p style='font-size: 14px;'>";
                        html += "LRM must be notified at least three (3) business days prior to the due date or specified draft date by emailing or calling using the contact information below. ";
                        html += "</p>";
                        html += "<p style='font-size: 14px;'>";
                        html += "LRM reserves the right to terminate automatic debits with notice to you. Reasons for termination include, but are not limited to: deposit account closure, frozen deposit account, multiple months of returned payments due to Non-Sufficient Funds.";
                        html += "</p>";
                        html += "</div>";

                        html += "<div >";
                        html += "<table style='width: 100%;font-size: 15px; font-weight: bold;'>";
                        html += "<tr><td  colspan='2' style='align: center;'>&nbsp;&nbsp;&nbsp;&nbsp;Contact <br/> Information</td></tr>";
                        html += "</table>";
                        html += "<p>Should you have any questions, LRM’s payment department can be reached by any of the following methods:</p>";
                        html += "</div >";

                        html += "<div style='align: center;'>";
                        html += "<p style='font-size: 13px;'><b>Email:</b> <a href='mailto:payments@lrmleasing.com' style='color: blue;'>payments@lrmleasing.com</a></p>";
                        html += "<p style='font-size: 13px;'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<b>Telephone:</b> (954) 791-1000</p>";
                        html += "</div>";

                        
                
                        


                        


                





                        var xmlStr = "<?xml version=\"1.0\"?>\n<!DOCTYPE html PUBLIC \"-//big.faceless.org//report\" \"report-1.1.dtd\">\n";
                        xmlStr += "<pdf>";
                        xmlStr += "<head>";
                        xmlStr +="<style type='text/css'>";
                        xmlStr +="</style>";
                        xmlStr += "<meta name='title' value='Authorization for Recurring Automatic Debit'/>";
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
                        xmlStr += "<body size='letter' class='text' header='myheader' header-height='2cm' footer='myfooter' footer-height='0cm'  style='margin-top:-10mm; margin-right:8mm; margin-left:8mm; margin-bottom:-10mm;'>";
                        xmlStr += html;
                        xmlStr += "</body>";
                        xmlStr += "</pdf>";
                        context.response.renderPdf(xmlStr);
    
                    }
                }
 
               
                return { onRequest }        
        });