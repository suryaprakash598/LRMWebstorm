/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
 
define(['N/record'],
 
    function (record) {
     
            function onRequest(context) {
     
                if (context.request.method == "GET") {
                    
                    var html = "";

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

                        var htmlFooter = "";
                        htmlFooter += "<table style='font-family: Arial Narrow, Arial, sans-serif; align:right;'>";
                        htmlFooter += "<tr><td>LESSEE INITIALS _____</td></tr></table>";


                        
                        html += "<table style='width: 100%; font-family: Arial Narrow, Arial, sans-serif;  margin-top: 20mm; font-size: 11.3px; border-collapse: collapse;'>"; // Added 'border-collapse' for proper border styling
                        html += "<tr>";
                        html += "<td></td></tr></table>";
                        html += "<table style='width: 100%; font-family: Arial Narrow, Arial, sans-serif; border: 1px solid black; margin-top: 20mm; font-size: 11.3px; border-collapse: collapse;'>"; // Added 'border-collapse' for proper border styling
                        html += "<tr>";
                        html += "<td colspan='3' style='border-right: 1px solid black; border-bottom: 1px solid black;'><i>LESSEE</i></td>"; // Moved border styling to 'style' attribute
                        html += "<td colspan='3' style='border-right: 0; border-bottom: 1px solid black;'><i>CO-LESSEE</i></td>";
                        html += "</tr>";

                        html += "<tr>";
                        html += "<td colspan='3' style='border-right: 1px solid black; border-bottom: 1px solid black;'><i>ADDRESS</i></td>";
                        html += "<td colspan='3' style='border-right: 0; border-bottom: 1px solid black;'><i>ADDRESS</i></td>";
                        html += "</tr>";

                        html += "<tr>";
                        html += "<td style='border-bottom: 1px solid black;'><i>CITY</i></td>";
                        html += "<td style='border-bottom: 1px solid black;'><i>STATE</i></td>";
                        html += "<td style='border-right: 1px solid black; border-bottom: 1px solid black;'><i>ZIP</i></td>";
                        html += "<td style='border-bottom: 1px solid black;'><i>CITY</i></td>";
                        html += "<td style='border-bottom: 1px solid black;'><i>STATE</i></td>";
                        html += "<td style='border-bottom: 1px solid black;'><i>ZIP</i></td>";
                        html += "</tr>";

                        html += "<tr>";
                        html += "<td><i>CONTACT</i></td>";
                        html += "<td><i>PHONE CONTACT</i></td>";
                        html += "<td style='border-right: 1px solid black;'><i></i></td>";
                        html += "<td><i>CONTACT</i></td>";
                        html += "<td><i>PHONE CONTACT</i></td>";
                        html += "<td><i></i></td>";
                        html += "</tr>";
                        html += "</table>";

                        
                             html += "<table  font-size='11.3px'  style=' width: 100%; font-family: Arial Narrow, Arial, sans-serif; text-align: center;' margin-top= '10mm'  >";
                             html  += "<tr><td  font-size='14px'   style='align: center;'><b>MOTOR VEHICLE LEASE AGREEMENT</b></td></tr>";
                             html  += "<tr><td  style='align: center;'> Leased Vehicle or Equipment—VIN #, Serial #, or Other Identification</td></tr>";
                             html  += "<tr><td>  Year:________	Make: ________________Model: ________________Transmission:__________ Color:____________</td></tr>";
                             html  += "<tr><td>  VEHICLE IDENTIFICATION NUMBER: __________________________________________________</td></tr>";
                             html += "</table>";


 
                             html += "<table  font-size='11.3px'  style=' width: 100%; font-family: Arial Narrow, Arial, sans-serif;'  >";
                             html  += "<tr border-top = '1'><td><b>Lease Inceptions: </b></td></tr>";
                             html  += "<tr><td> $___________ Non-refundable deposit <b>PLUS APPLICABLE TAXES </b></td></tr>";
                             html  += "<tr><td>$___________ First Lease Payment <b>PLUS APPLICABLE TAXES </b></td></tr>";
                           
                             html  += "<tr><td></td></tr>";
                             html  += "<tr ><td><b>  Terms: </b></td></tr>";
                             html  += "<tr><td> $__________ Lease Payments <b> PLUS APPLICABLE TAXES</b></td></tr>";
                             html  += "<tr><td>  __________ Payment Term in Months</td></tr>";
                             html  += "<tr><td>  __________ Next Payment Date (after Lease Inceptions) and Frequency (monthly)</td></tr>";
                             html  += "<tr><td>  $__________ Purchase Option  <b> PLUS APPLICABLE TAXES</b></td></tr>";
                             html  += "<tr style='padding-top: 20px;'><td border-bottom = '1'> <b>Non-refundable deposit </b> is: 1) payable at lease signing and non-refundable for any reason, 2) held for performance under the terms of this lease agreement, and does not bear any interest, 3) may be applied by lessor to any of their obligations hereunder or any default, and 4) applied to lease payments for up to the number of months of the extension period, as provided herein. First Lease Payment is payable at lease signing and non-refundable for any reason.</td></tr>";
                             html += "</table>";


                             html += "<table  font-size='11.3px'  style=' width: 100%; font-family: Arial Narrow, Arial, sans-serif; align:center;' >";
                             html  += "<tr><td  font-size='14px'   style='align: center;'><b>LEASE</b></td></tr>";
                             html += "<tr><td>This Motor Vehicle Lease Agreement (this “Lease”) is written in plain English as a convenience to you. References to “you” or “your” are to the Lessee. References to “us,” “we,” or “our” are to the Lessor, LRM Leasing Company Inc. <b><u> DO NOT SIGN THIS LEASE IF YOU HAVE NOT READ IT ENTIRELY AND OR DO NOT UNDESTAND THIS LEASE.</u></b> By signing, you agree to all the terms and conditions shown on the first page hereof and the Additional Terms and Conditions set forth on the attached pages, which such Additional Terms and Conditions are hereby incorporated by references as if fully set forth herein. You acknowledge receipt of a copy of this Lease (including the Additional Terms and Conditions).</td></tr>"; 
                             html += "<tr><td>Lessor is leasing the Equipment to Lessee “AS-IS.” LESSEE ACKNOWLEDGES THAT LESSOR DOES NOT MANUFACTURE THE EQUIPMENT, LESSOR DOES NOT REPRESENT THE MANUFACTURRER OR THE SUPPLIER (THE “VENDOR”), AND LESSEE HAS SELECTED THE EQUIPMENT AND SUPPLIER BASED UPON LESSEE’S OWN JUDGEMENT. LESSOR MAKES NO WARRANTIES, EXPRESSED OR IMPLIED, NOR ANY WARRANTIES OF MERCHANTABILITY OR FITNESS FOR A PARTICULAR PURPOSE. LESSEE AGRESS THAT REGARDLESS OF CAUUSE, LESSOR IS NOT RESPONSIBLE FOR AND LESSEE WILL NOT MAKE ANY CLAIM AGAINST LESSOR FOR ANY DAMAGES, WHETHER CONSEQUENTIAL, DIRECT, PUNITIVE, SPECIAL, OR INDIDRECT. SO LONG AS LESSEE HAS NOT SUFFERED AN EVENT OF DEFAULT, LESSOR TRANSFERS TO LESSEE FOR THE TERM OF THIS LEASE ANY WARRANTIES MADE BY THE MANUFACTURER OR SUPPLIED UNDER A SUPPLY CONTRACT. LESSEE AGREES THAT LESSOR IS NOT THE SUPPLIER OR MANUFACTURER OF THE EQUIPMENT. <b>FURTHER, LESSEE AGREES THAT THIS IS A FINANCE LEASE AS SUCH TERM IS DEFINED IN ARTICLE 2A OF THE UNIFORM COMMERICAL CODE AND NOTWITHSTANDING ANY DETERMINATION TO THE COTNRARY, LESSOR SHALL HAVE ALL THE RIGHTS AND BENEFITS OF A LESSOR UNDER A FINANCE LEASE.</b></td></tr>";
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
                        html += "<td style='border-bottom: 1px solid black;'><i>SIGNATURE</i></td>";
                        html += "<td style='border-bottom: 1px solid black;'><i>Title</i></td>";
                        html += "<td style='border-bottom: 1px solid black;'><i>Date</i></td>";
                        html += "</tr>";
                        html +="</table>";
                        html += "<pbr/>"; //Page one Ends


                        html += "<table style='width: 100%; font-family: Arial Narrow, Arial, sans-serif;  margin-top: 20mm; font-size: 11.3px; border-collapse: collapse;'>"; // Added 'border-collapse' for proper border styling
                        html += "<tr>";
                        html += "<td></td></tr></table>";

                        html += "<table style='width: 100%; font-family: Arial Narrow, Arial, sans-serif; font-size: 11.3px; margin-top: 10mm; border-collapse: collapse;'>";
                        html += "<tr style='padding-top: 20px;'><td style='align: center; font-size: 14px; '><b>LIMITED POWER OF ATTORNEY</b></td></tr>";
                        html += "<tr style='padding-top: 20px;'><td>_______________________ (the “Principal”), does hereby appoint <b>LRM LEASING COMPANY, INC.,</b> as its true and lawful Attorney-In-Fact (“Attorney-In-Fact”) relating solely to that certain Equipment Lease between the Principal and Attorney-In-Fact (the “Lease”).</td></tr>";
                        html += "<tr style='padding-top: 20px;'><td><b>Lessee hereby irrevocably appoints Lessor as Lessee’s attorney-in-fact to make claim for, receive payment of and execute and endorse all documents, checks or drafts received in payment for loss or damage under any such insurance policy.</b></td></tr>";
                        html += "<tr style='padding-top: 20px;'><td style='text-align: center;'>Leased Vehicle or Equipment—VIN #, Serial #, or Other Identification</td></tr>";
                        html += "<tr style='padding-top: 10px;'><td>Year:________ Make: ________________Model: ________________Transmission:__________ Color:____________</td></tr>";
                        html += "<tr><td style='border-bottom: 1px solid black;'>VEHICLE IDENTIFICATION NUMBER: __________________________________________________</td></tr>";
                        html += "<tr style='padding-top: 20px;'><td>Further, the Principal does ratify and confirm all actions authorized hereunder that its Attorney-In-Fact shall do or cause to be done by virtue of this Power of Attorney. Except as for the power herein stated, the Principal does not authorize its Attorney-In-Fact to act for any other purpose.</td></tr>";
                        html += "<tr style='padding-top: 20px;'><td>Third parties may rely upon the representations of the Attorney-In-Fact as to all matters relating to the power granted hereunder, and no person who may act in reliance upon the representations of the Attorney-In-Fact shall incur any liability to the Principal as a result of permitting the Attorney-In-Fact to exercise the stated power.</td></tr>";
                        html += "<tr style='padding-top: 20px;'><td>IN WITNESS WHEREOF, the Principal has hereunto executed and delivered this Power of Attorney this date of _____________________________</td></tr>";
                        html += "<tr style='padding-top: 20px;'><td>Name: _________________________</td></tr>";
                        html += "<tr style='padding-top: 10px;'><td>STATE of Florida</td></tr>";
                        html += "<tr style='padding-top: 10px;'><td>COUNTY of _______________</td></tr>";
                        html += "<tr style='padding-top: 10px;'><td>On Date:______________________, before me, the undersigned, personally appeared _________________, personally known to me or proved to me on the basis of satisfactory evidence to be the individual(s) whose name(s) is (are) subscribed to the within instrument and acknowledged to me that he/she/they executed the same in his/her/their capacity(ies), that by his/her/their signature(s) on the instrument, the individual(s), or the person upon behalf of which the individual(s) acted, executed the instrument, and that such individual made such appearance before the undersigned in the City of __________________________________, State of Florida.</td></tr>";
                        html += "<tr style='padding-top: 30px;'><td>____________________________</td></tr>";
                        html += "<tr><td>Notary Public Signature</td></tr>";
                        html += "<tr style='padding-top: 20px;'><td>____________________________</td></tr>";
                        html += "<tr><td>Printed Name</td></tr>";
                        html += "</table>";
                        html += "<pbr/>";//Page Two Ends


                        
                        html += "<table style='width: 100%; font-family: Arial Narrow, Arial, sans-serif;  margin-top: 20mm; font-size: 11.3px; border-collapse: collapse;'>"; // Added 'border-collapse' for proper border styling
                        html += "<tr>";
                        html += "<td></td></tr></table>";

                        html += "<table style='width: 100%; font-family: Arial Narrow, Arial, sans-serif; font-size: 11.3px; margin-top: 10mm; border-collapse: collapse;'>";
                        html += "<tr style='padding-top: 20px;'><td style='align: center; font-size: 14px;'><b>PERMISSION TO REGISTRATION</b></td></tr>";
                        html += "<tr style='padding-top: 20px;'><td>Date:</td></tr>";
                        html += "<tr style='padding-top: 30px; align: center'><td style='color: red;  background-color: yellow;  align: center;'><b>*Do not register in LRM Leasing Company Inc.’s name*</b></td></tr>";
                        html += "<tr style='padding-top: 20px;'><td>This letter authorizes the lessee, _________________________________________to register the following vehicle.</td></tr>";
                        html += "<tr style='padding-top: 20px;'><td style='text-align: center;'>Leased Vehicle or Equipment—VIN #, Serial #, or Other Identification</td></tr>";
                        html += "<tr style='padding-top: 10px;'><td>Year:________ Make: ________________Model: ________________Transmission:__________ Color:____________</td></tr>";
                        html += "<tr><td style='border-bottom: 1px solid black;'>VEHICLE IDENTIFICATION NUMBER: __________________________________________________</td></tr>";
                        html += "<tr style='padding-top: 40px;'><td><b><u>LRM Leasing Company Inc. must always remain as the sole registered owner of the title.</u></b></td></tr>";
                        html += "<tr style='padding-top: 20px;'><td>If you have any questions, please do not hesitate to call LRM Leasing at the above phone number.</td></tr>";
                        html += "<tr style='padding-top: 20px;'><td>Regards,</td></tr>";
                        html += "<tr style='padding-top: 50px;'><td>_________________________</td></tr>";
                        html += "<tr style='padding-top: 10px;'><td>LRM Leasing Company</td></tr>";
                        html += "</table>";
                        // html += "<pbr/>";//Page Three Ends

                        


                        

     
                var xmlStr = "<?xml version=\"1.0\"?>\n<!DOCTYPE html PUBLIC \"-//big.faceless.org//report\" \"report-1.1.dtd\">\n";
                    xmlStr += "<pdf>";
                    xmlStr += "<head>";
                    xmlStr +="<style type='text/css'>";
                    xmlStr +="</style>";
                    xmlStr += "<meta name='title' value='Lease Agreement 2024'/>";
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
                    xmlStr += "<body size='letter' class='text' header='myheader' header-height='2cm' footer='myfooter' footer-height='1cm'  style='margin-top:-10mm; margin-right:-10mm; margin-left:-10mm; margin-bottom:-10mm;'>";
     
                    xmlStr += html;
                    xmlStr += "</body>";
     
                    xmlStr += "</pdf>";
               
                    context.response.renderPdf(xmlStr);
     
     
                    }
                }

          
     
                return { onRequest }        
     
        });