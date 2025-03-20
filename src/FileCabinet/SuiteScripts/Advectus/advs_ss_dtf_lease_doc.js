/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
define(['N/error', 'N/task', 'N/render', 'N/file', 'N/encode', 'N/record', 'N/search', 'N/ui', 'N/ui/serverWidget', 'N/log', 'N/format', 'N/runtime', 'N/redirect', 'N/url', 'N/https', 'N/xml'],
  function (error, task, render, file, encode, record, search, ui, serverWidget, log, format, runtime, redirect, url, https, xml) {
    function onRequest(context) {
      if (context.request.method == "GET") {
        var RecordId = context.request.parameters.recId;
        var isBase64 = context.request.parameters.baseSixtyFour;
        log.debug("rec" + RecordId, 'isBase64' + isBase64);
        var RecordType = "customrecord_advs_lease_header";
        //var recordType = 'customrecord_advs_lease_header';
        var UserObj = runtime.getCurrentUser();
        var UserId = UserObj.id;
        var UserName = UserObj.name;
        var UserRole = UserObj.role;
        var UserEmail = UserObj.email;
        var UserSubsidiary = UserObj.subsidiary;
        var UserLocation = UserObj.location;
        var leaseDataObj = searchForLeaseData(RecordId);
        log.error('leaseDataObj', leaseDataObj);
        var addressobj = getAddressData(leaseDataObj.lesseId);
        var _vinNametext = leaseDataObj.vinName;
        _vinName = _vinNametext.split('');
        var customrecord_advs_lease_headerSearchObj = search.create({
          type: "customrecord_advs_lease_header",
          filters: [
            ["isinactive", "is", "F"],
            "AND",
            ["internalid", "anyof", RecordId]
          ],
          columns: [
            search.createColumn({
              name: "name",
              label: "ID"
            }),
            search.createColumn({
              name: "scriptid",
              label: "Script ID"
            }),
            search.createColumn({
              name: "custrecord_advs_l_h_customer_name",
              label: "Lessee Name "
            }),
            search.createColumn({
              name: "custrecord_advs_lease_comp_name_fa",
              label: "Company Name"
            }),
            search.createColumn({
              name: "custrecord_advs_l_h_act_add",
              label: "Actual Address"
            }),
            search.createColumn({
              name: "custrecord_advs_l_h_addr_drive_lice",
              label: "Address of the driver’s license "
            }),
            search.createColumn({
              name: "custrecord_advs_la_vin_bodyfld",
              label: "Vin_No"
            }),
            search.createColumn({
              name: "custrecord_advs_l_h_depo_ince",
              label: "Dep_inc"
            }),
            search.createColumn({
              name: "custrecord_advs_l_h_pay_incep",
              label: "Pay_inc"
            }),
            search.createColumn({
              name: "custrecord_advs_l_h_terms",
              label: "Term"
            }),
            search.createColumn({
              name: "custrecord_advs_l_a_pay_st_date",
              label: "First_pay_date"
            }),
            search.createColumn({
              name: "custrecord_advs_l_h_pur_opti",
              label: "pur_option"
            }),
            search.createColumn({
              name: "custrecord_advs_l_h_start_date",
              label: "lease_Date"
            }),
          ]
        });
        var searchResultCount = customrecord_advs_lease_headerSearchObj.runPaged().count;
        log.debug("customrecord_advs_lease_headerSearchObj result count", searchResultCount);
        var Lessee_value, Lessee_Name, company_Name, address, comp_address, Vin_No, Dep_inc, Pay_inc, Term, First_pay_date, pur_option;
        var lease_Date;
        customrecord_advs_lease_headerSearchObj.run().each(function (result) {
          Lessee_Name = result.getText("custrecord_advs_l_h_customer_name");
          Lessee_value = result.getValue("custrecord_advs_l_h_customer_name");
          company_Name = result.getValue("custrecord_advs_lease_comp_name_fa");
          address = result.getValue("custrecord_advs_l_h_act_add");
          comp_address = result.getValue("custrecord_advs_l_h_addr_drive_lice");
          Vin_No = result.getValue('custrecord_advs_la_vin_bodyfld');
          lease_Date = result.getValue('custrecord_advs_l_h_start_date');


          Dep_inc = result.getValue('custrecord_advs_l_h_depo_ince') * 1
          if (Dep_inc) {
            Dep_inc = Dep_inc.toFixed(2);
          }
          Pay_inc = result.getValue('custrecord_advs_l_h_pay_incep') * 1
          if (Pay_inc) {
            Pay_inc = Pay_inc.toFixed(2);
          }
          Term = result.getValue('custrecord_advs_l_h_terms');
          First_pay_date = result.getValue('custrecord_advs_l_a_pay_st_date');
          pur_option = result.getValue('custrecord_advs_l_h_pur_opti') * 1
          if (pur_option) {
            pur_option = pur_option.toFixed(2);
          }
          return true;
        });

        if (Vin_No) {
          var VinRecord = record.load({
            type: "customrecord_advs_vm",
            id: Vin_No,
            isDynamic: true,
          });
          var VinName = VinRecord.getText({
            fieldId: 'name',
          });

          var Model = VinRecord.getText({
            fieldId: 'custrecord_advs_vm_model',
          });
          var Color = VinRecord.getText({
            fieldId: 'custrecord_advs_vm_exterior_color',
          });
          var Make = VinRecord.getText({
            fieldId: 'custrecord_advs_vm_vehicle_brand',
          });
          var Year = VinRecord.getText({
            fieldId: 'custrecord_advs_vm_model_year',
          });
          var trans = VinRecord.getText({
            fieldId: 'custrecord_advs_vm_transmission_type',
          });
        }

        if (Lessee_value) {
          var custRecord = record.load({
            type: "customer",
            id: Lessee_value,
            isDynamic: true,
          });

          var Email = custRecord.getValue({
            fieldId: 'email',
          });

          var Phone = custRecord.getValue({
            fieldId: 'phone',
          });


          var customerDetailsSearch = search.create({
            type: "customer",
            filters: [
              ["internalid", "anyof", Lessee_value]
            ],
            columns: [
              search.createColumn({
                name: "addressee",
                label: "Addressee"
              }),
              search.createColumn({
                name: "address1",
                label: "Address 1"
              }),
              search.createColumn({
                name: "city",
                label: "City"
              }),
              search.createColumn({
                name: "state",
                label: "State/Province"
              }),
              search.createColumn({
                name: "zipcode",
                label: "Zip Code"
              }),
              search.createColumn({
                name: "country",
                label: "Zip Code"
              })
            ]
          });

          var city, zipcode, state
          customerDetailsSearch.run().each(function (result) {
            state = result.getValue({
              name: "state"
            });
            state = xml.escape({
              xmlText: state
            });
            var addressee = result.getValue({
              name: "addressee"
            });
            addressee = xml.escape({
              xmlText: addressee
            });
            var address1 = result.getValue({
              name: "address1"
            });
            address1 = xml.escape({
              xmlText: address1
            });
            city = result.getValue({
              name: "city"
            });
            city = xml.escape({
              xmlText: city
            });
            zipcode = result.getValue({
              name: "zipcode"
            });
            zipcode = xml.escape({
              xmlText: zipcode
            });

            Country = result.getValue({
              name: "country"
            });

          })


        }




        var htmlHeader = " ";
        htmlHeader += " <table style='width: 100%;'>";
        htmlHeader += "<tr><td>";
        htmlHeader += "<table style='font-family: Arial Narrow, Arial, sans-serif; align:left;'>";
        htmlHeader += "<tr><td style='align:center'><img src='https://8760954-sb1.app.netsuite.com/core/media/media.nl?id=4640&amp;c=8760954_SB1&amp;h=hOVnkhUkJlxiF1pyN-M-xif_-VbwypZKB5WC6IWXWlItXID6&amp;fcts=20240508232747&amp;whence=' alt='Image description' width='150px' height='30px' /></td></tr>";
        htmlHeader += " </table>";
        htmlHeader += "</td>";
        htmlHeader += "<td style='vertical-align: top; align:right;'>";
        htmlHeader += "<table style=' align: right;'>";
        htmlHeader += "<tr><td style='align:right; font-size: 11px;'><b>LRM LEASING COMPANY, INC</b></td></tr>";
        htmlHeader += "<tr><td style='align:right; font-size: 11px;'>2160 Blount Road</td></tr>";
        htmlHeader += "<tr><td style='align:right; font-size: 11px;' >Pompano Beach, FL 33069</td></tr>";
        htmlHeader += "<tr><td style='align:right; font-size: 11px;'>954-791-1400</td></tr>";
        htmlHeader += " </table>";
        htmlHeader += "</td></tr>";
        htmlHeader += " </table>";

        /*  var htmlFooter = "";
        htmlFooter += "<table style='font-family: Arial Narrow, Arial, sans-serif; align:right;font-size: 10px;'>";
        htmlFooter += "<tr><td>LESSEE INITIALS _____</td></tr></table>" */

        var html = " ";

        //1._MV Lease Agreement - 2024 dtf
        // html += "<table style='width: 100%; font-family: Arial Narrow, Arial, sans-serif;  margin-top: 10mm; font-size: 11.3px; border-collapse: collapse;'>"; // Added 'border-collapse' for proper border styling
        // html += "<tr>";
        // html += "<td></td></tr></table>";

        html += "<table style='width: 100%; font-family: Arial Narrow, Arial, sans-serif; border: 1px solid black; margin-top: 10px; font-size: 11.3px; border-collapse: collapse;'>";
        html += "<tr>";
        html += "<td colspan='3' style='border-right: 1px solid black; '><i>LESSEE:</i> </td>";
        html += "<td colspan='3' style='border-right: 0; '><i>CO-LESSEE:</i></td>";
        html += "</tr>";

        html += "<tr>";
        html += "<td colspan='3' style='border-right: 1px solid black; border-bottom: 1px solid black; '>" + Lessee_Name + "</td>";
        html += "<td colspan='3' style='border-right: 0; border-bottom: 1px solid black; '>" + company_Name + "</td>";
        html += "</tr>";

        html += "<tr>";
        html += "<td colspan='3' style='border-right: 1px solid black; '><i>ADDRESS:</i></td>";
        html += "<td colspan='3' style='border-right: 0; '><i>ADDRESS:</i></td>";
        html += "</tr>";

        html += "<tr>";
        html += "<td colspan='3' style='border-right: 1px solid black; border-bottom: 1px solid black; '>" + address + "</td>";
        html += "<td colspan='3' style='border-right: 0; border-bottom: 1px solid black; '>" + comp_address + "</td>";
        html += "</tr>";

        html += "<tr>";
        html += "<td style=''><i>CITY</i></td>";
        html += "<td style=''><i>STATE</i></td>";
        html += "<td style='border-right: 1px solid black; '><i>ZIP</i></td>";
        html += "<td style=''><i>CITY</i></td>";
        html += "<td style=''><i>STATE</i></td>";
        html += "<td style=''><i>ZIP</i></td>";
        html += "</tr>";

        html += "<tr>";
        html += "<td style='border-bottom: 1px solid black; '>" + city + "</td>";
        html += "<td style='border-bottom: 1px solid black; '>" + state + "</td>";
        html += "<td style='border-right: 1px solid black; border-bottom: 1px solid black; '>" + zipcode + "</td>";
        html += "<td style='border-bottom: 1px solid black; '>" + city + "</td>";
        html += "<td style='border-bottom: 1px solid black; '>" + state + "</td>";
        html += "<td style='border-bottom: 1px solid black; '>" + zipcode + "</td>";
        html += "</tr>";

        html += "<tr>";
        html += "<td style=''><i>CONTACT</i></td>";
        html += "<td style=''><i>PHONE CONTACT</i></td>";
        html += "<td style='border-right: 1px solid black; '><i></i></td>";
        html += "<td style=''><i>CONTACT</i></td>";
        html += "<td style=''><i>PHONE CONTACT</i></td>";
        html += "<td style=''><i></i></td>";
        html += "</tr>";

        html += "<tr>";
        html += "<td style=''>" + Email + "</td>";
        html += "<td style=''>" + Phone + "</td>";
        html += "<td style='border-right: 1px solid black; '><i></i></td>";
        html += "<td style=''>" + Email + "</td>";
        html += "<td style=''>" + Phone + "</td>";
        html += "<td style=''><i></i></td>";
        html += "</tr>";

        html += "</table>";



        html += "<table  font-size='11.3px'  style=' width: 100%; font-family: Arial Narrow, Arial, sans-serif; text-align: center;' margin-top= '6mm'  >";
        html += "<tr><td  font-size='14px'   style='align: center;'><b>MOTOR VEHICLE LEASE AGREEMENT</b></td></tr>";
        html += "<tr><td  style='align: center;'> Leased Vehicle or Equipment—VIN #, Serial #, or Other Identification</td></tr>";
        html += "<tr><td>  Year:<u>" + Year + "  </u>Make:<u>" + Make + "   </u>Model:<u>" + Model + "  </u>Transmission:<u>" + trans + "   </u> Color:<u>" + Color + "   </u></td></tr>";
        html += "<tr><td>  VEHICLE IDENTIFICATION NUMBER: <u>" + VinName + "</u></td></tr>";
        html += "</table>";



        html += "<table  font-size='11.3px'  style=' width: 100%; font-family: Arial Narrow, Arial, sans-serif;'  >";
        html += "<tr border-top = '1'><td><b>Lease Inceptions: </b></td></tr>";
        html += "<tr><td> $<u>" + Dep_inc + "</u> Non-refundable deposit <b>PLUS APPLICABLE TAXES </b></td></tr>";
        html += "<tr><td> $<u>" + Pay_inc + "</u>First Lease Payment <b>PLUS APPLICABLE TAXES </b></td></tr>";

        html += "<tr><td></td></tr>";
        html += "<tr ><td><b>  Terms: </b></td></tr>";
        html += "<tr><td> $___________First Lease Payments <b> PLUS APPLICABLE TAXES</b></td></tr>";
        html += "<tr><td> <b> <u>" + Term + "</u></b>Payment Term in Months</td></tr>";
        html += "<tr><td> <u>" + First_pay_date + "</u> Next Payment Date (after Lease Inceptions) and Frequency (monthly)</td></tr>";
        html += "<tr><td>  $<u>" + pur_option + "</u> Purchase Option  <b> PLUS APPLICABLE TAXES</b></td></tr>";
        html += "<tr style='padding-top: 20px;'><td border-bottom = '1'> <b>Non-refundable deposit </b> is: 1) payable at lease signing and non-refundable for any reason, 2) held for performance under the terms of this lease agreement, and does not bear any interest, 3) may be applied by lessor to any of their obligations hereunder or any default, and 4) applied to lease payments for up to the number of months of the extension period, as provided herein. First Lease Payment is payable at lease signing and non-refundable for any reason.</td></tr>";
        html += "</table>";


        html += "<table  font-size='11.3px'  style=' width: 100%; font-family: Arial Narrow, Arial, sans-serif; align:center;' >";
        html += "<tr><td  font-size='14px'   style='align: center;'><b>LEASE</b></td></tr>";
        html += "<tr><td>This Motor Vehicle Lease Agreement (this “Lease”) is written in plain English as a convenience to you. References to “you” or “your” are to the Lessee. References to “us,” “we,” or “our” are to the Lessor, LRM Leasing Company Inc. <b><u> DO NOT SIGN THIS LEASE IF YOU HAVE NOT READ IT ENTIRELY AND OR DO NOT UNDESTAND THIS LEASE.</u></b> By signing, you agree to all the terms and conditions shown on the first page hereof and the Additional Terms and Conditions set forth on the attached pages, which such Additional Terms and Conditions are hereby incorporated by references as if fully set forth herein. You acknowledge receipt of a copy of this Lease (including the Additional Terms and Conditions).</td></tr>";
        html += "<tr><td>Lessor is leasing the Equipment to Lessee “AS-IS.” LESSEE ACKNOWLEDGES THAT LESSOR DOES NOT MANUFACTURE THE EQUIPMENT, LESSOR DOES NOT REPRESENT THE MANUFACTURRER OR THE SUPPLIER (THE “VENDOR”), AND LESSEE HAS SELECTED THE EQUIPMENT AND SUPPLIER BASED UPON LESSEE’S OWN JUDGEMENT. LESSOR MAKES NO WARRANTIES, EXPRESSED OR IMPLIED, NOR ANY WARRANTIES OF MERCHANTABILITY OR FITNESS FOR A PARTICULAR PURPOSE. LESSEE AGRESS THAT REGARDLESS OF CAUUSE, LESSOR IS NOT RESPONSIBLE FOR AND LESSEE WILL NOT MAKE ANY CLAIM AGAINST LESSOR FOR ANY DAMAGES, WHETHER CONSEQUENTIAL, DIRECT, PUNITIVE, SPECIAL, OR INDIDRECT. SO LONG AS LESSEE HAS NOT SUFFERED AN EVENT OF DEFAULT, LESSOR TRANSFERS TO LESSEE FOR THE TERM OF THIS LEASE ANY WARRANTIES MADE BY THE MANUFACTURER OR SUPPLIED UNDER A SUPPLY CONTRACT. LESSEE AGREES THAT LESSOR IS NOT THE SUPPLIER OR MANUFACTURER OF THE EQUIPMENT. <b>FURTHER, LESSEE AGREES THAT THIS IS A FINANCE LEASE AS SUCH TERM IS DEFINED IN ARTICLE 2A OF THE UNIFORM COMMERICAL CODE AND NOTWITHSTANDING ANY DETERMINATION TO THE COTNRARY, LESSOR SHALL HAVE ALL THE RIGHTS AND BENEFITS OF A LESSOR UNDER A FINANCE LEASE.</b></td></tr>";
        html += "</table>";




        html += "<table style='width: 100%; font-family: Arial Narrow, Arial, sans-serif; border: 1px solid black; margin-top: 5mm; font-size: 11.3px; border-collapse: collapse;'>"; // Added 'border-collapse' for proper border styling
        html += "<tr>";
        html += "<td colspan='3' style='border-right: 1px solid black;'><i>LESSEE (Authorized Agent or as Individual) &amp; Co-Signer</i></td>"; // Moved border styling to 'style' attribute
        html += "<td colspan='3' style='border-right: 0;'><i>LESSOR</i></td>";
        html += "</tr>";

        html += "<tr>";
        html += "<td colspan='3' style='border-right: 1px solid black; border-bottom: 1px solid black;'><i>" + Lessee_Name + "</i></td>"; // Moved border styling to 'style' attribute
        html += "<td colspan='3' style='border-right: 0; border-bottom: 1px solid black;'><i>LESSOR</i></td>";
        html += "</tr>";

        html += "<tr>";
        html += "<td style=''><i>SIGNATURE (Lessee &amp;  Co-Signer)</i></td>";
        html += "<td style=''><i>Title </i></td>";
        html += "<td style='border-right: 1px solid black;'><i>Date</i></td>";
        html += "<td style=''><i>SIGNATURE</i></td>";
        html += "<td style=''><i>Title</i></td>";
        html += "<td style=''><i>Date</i></td>";
        html += "</tr>";


        html += "<tr>";
        html += "<td style='border-bottom: 1px solid black;'><i></i></td>";
        html += "<td style='border-bottom: 1px solid black;'><i> </i></td>";
        html += "<td style='border-right: 1px solid black; border-bottom: 1px solid black;'>" + lease_Date + "</td>";
        html += "<td style='border-bottom: 1px solid black;'><i></i></td>";
        html += "<td style='border-bottom: 1px solid black;'><i></i></td>";
        html += "<td style='border-bottom: 1px solid black;'>" + lease_Date + "</td>";
        html += "</tr>";

        html += "</table>";
        html += "<pbr/>"; //Page one Ends


        html += "<table style='width: 100%; font-family: Arial Narrow, Arial, sans-serif;  margin-top: 20mm; font-size: 11.3px; border-collapse: collapse;'>"; // Added 'border-collapse' for proper border styling
        html += "<tr>";
        html += "<td></td></tr></table>";

        html += "<table style='width: 100%; font-family: Arial Narrow, Arial, sans-serif; font-size: 11.3px; margin-top: 10mm; border-collapse: collapse;'>";
        html += "<tr style='padding-top: 20px;'><td style='align: center; font-size: 14px; '><b>LIMITED POWER OF ATTORNEY</b></td></tr>";
        html += "<tr style='padding-top: 20px;'><td><u>" + Lessee_Name + "</u> (the “Principal”), does hereby appoint <b>LRM LEASING COMPANY, INC.,</b> as its true and lawful Attorney-In-Fact (“Attorney-In-Fact”) relating solely to that certain Equipment Lease between the Principal and Attorney-In-Fact (the “Lease”).</td></tr>";
        html += "<tr style='padding-top: 20px;'><td><b>Lessee hereby irrevocably appoints Lessor as Lessee’s attorney-in-fact to make claim for, receive payment of and execute and endorse all documents, checks or drafts received in payment for loss or damage under any such insurance policy.</b></td></tr>";
        html += "<tr style='padding-top: 20px;'><td style='text-align: center;'>Leased Vehicle or Equipment—VIN #, Serial #, or Other Identification</td></tr>";
        html += "<tr style='padding-top: 10px;'><td>Year:<u>" + Year + "</u>Make:<u>" + Make + "</u>Model:<u>" + Model + "</u>Transmission:<u>" + trans + "</u> Color:<u>" + Color + "</u></td></tr>";
        html += "<tr><td style='border-bottom: 1px solid black;'>VEHICLE IDENTIFICATION NUMBER:<u>" + VinName + "</u></td></tr>";
        html += "<tr style='padding-top: 20px;'><td>Further, the Principal does ratify and confirm all actions authorized hereunder that its Attorney-In-Fact shall do or cause to be done by virtue of this Power of Attorney. Except as for the power herein stated, the Principal does not authorize its Attorney-In-Fact to act for any other purpose.</td></tr>";
        html += "<tr style='padding-top: 20px;'><td>Third parties may rely upon the representations of the Attorney-In-Fact as to all matters relating to the power granted hereunder, and no person who may act in reliance upon the representations of the Attorney-In-Fact shall incur any liability to the Principal as a result of permitting the Attorney-In-Fact to exercise the stated power.</td></tr>";
        html += "<tr style='padding-top: 20px;'><td>IN WITNESS WHEREOF, the Principal has hereunto executed and delivered this Power of Attorney this date of _____________________________</td></tr>";
        html += "<tr style='padding-top: 20px;'><td>Name:<u>" + Lessee_Name + "</u> </td></tr>";
        html += "<tr style='padding-top: 10px;'><td>STATE of Florida</td></tr>";
        html += "<tr style='padding-top: 10px;'><td>COUNTY of US</td></tr>";
        html += "<tr style='padding-top: 10px;'><td>On Date:" + leaseDataObj.startdate + ", before me, the undersigned, personally appeared " + leaseDataObj.lesseName + " , personally known to me or proved to me on the basis of satisfactory evidence to be the individual(s) whose name(s) is (are) subscribed to the within instrument and acknowledged to me that he/she/they executed the same in his/her/their capacity(ies), that by his/her/their signature(s) on the instrument, the individual(s), or the person upon behalf of which the individual(s) acted, executed the instrument, and that such individual made such appearance before the undersigned in the City of " + addressobj.city + ", State of Florida.</td></tr>";
        html += "<tr style='padding-top: 30px;'><td>____________________________</td></tr>";
        html += "<tr><td>Notary Public Signature</td></tr>";
        html += "<tr style='padding-top: 20px;'><td>____________________________</td></tr>";
        html += "<tr><td>Printed Name</td></tr>";
        html += "</table>";
        html += "<pbr/>"; //Page Two Ends



        html += "<table style='width: 100%; font-family: Arial Narrow, Arial, sans-serif;  margin-top: 20mm; font-size: 11.3px; border-collapse: collapse;'>"; // Added 'border-collapse' for proper border styling
        html += "<tr>";
        html += "<td></td></tr></table>";

        html += "<table style='width: 100%; font-family: Arial Narrow, Arial, sans-serif; font-size: 11.3px; margin-top: 10mm; border-collapse: collapse;'>";
        html += "<tr style='padding-top: 20px;'><td style='align: center; font-size: 14px;'><b>PERMISSION TO REGISTRATION</b></td></tr>";
        html += "<tr style='padding-top: 20px;'><td>Date:" + leaseDataObj.startdate + "</td></tr>";
        html += "<tr style='padding-top: 30px; align: center'><td style='color: red;  background-color: yellow;  align: center;'><b>*Do not register in LRM Leasing Company Inc.’s name*</b></td></tr>";
        html += "<tr style='padding-top: 20px;'><td>This letter authorizes the lessee, " + leaseDataObj.lesseName + " to register the following vehicle.</td></tr>";
        html += "<tr style='padding-top: 20px;'><td style='text-align: center;'>Leased Vehicle or Equipment—VIN #, Serial #, or Other Identification</td></tr>";
        html += "<tr style='padding-top: 10px;'><td>Year:<u>" + Year + "</u>Make:<u>" + Make + "</u>Model:<u>" + Model + "</u>Transmission:<u>" + trans + "</u> Color:<u>" + Color + "</u></td></tr>";
        html += "<tr><td style='border-bottom: 1px solid black;'>VEHICLE IDENTIFICATION NUMBER: <u>" + VinName + "</u></td></tr>";
        html += "<tr style='padding-top: 40px;'><td><b><u>LRM Leasing Company Inc. must always remain as the sole registered owner of the title.</u></b></td></tr>";
        html += "<tr style='padding-top: 20px;'><td>If you have any questions, please do not hesitate to call LRM Leasing at the above phone number.</td></tr>";
        html += "<tr style='padding-top: 20px;'><td>Regards,</td></tr>";
        html += "<tr style='padding-top: 50px;'><td>_________________________</td></tr>";
        html += "<tr style='padding-top: 10px;'><td>LRM Leasing Company</td></tr>";
        html += "</table>";
        html += "<pbr/>";
        // html += "<pbr/>";//Page Three Ends

        //2.GUARANTY

        html += "<table style='width: 100%; font-family: Arial Narrow, Arial, sans-serif;  margin-top: 20mm; font-size: 11.3px; border-collapse: collapse;'>"; // Added 'border-collapse' for proper border styling
        html += "<tr>";
        html += "<td></td></tr></table>";



        html += "<table  font-size='11.3px'  style=' width: 100%; font-family: Arial Narrow, Arial, sans-serif; text-align: center;' margin-top= '10mm'  >";
        html += "<tr><td  font-size='14px'   style='align: center;'><b>GUARANTY</b></td></tr>";
        html += "<tr><td>The undersigned guarantors (whether one or more, the “Guarantors”) give this guaranty in order to induce LRM Leasing Company, INC. (together with its successors and assigns referred to as “Lessor”) to enter into this Lease with Lessee.  Guarantors, jointly and severally, PERSONALLY guaranty  AND UNCONDITIONALLY GUARANTEE the full and prompt performance and discharge of all present and future obligations, WHETHER FOR payment OR PERFORMANCE, OWED OR TO BE PERFORMED BY THE LESSEE UNDER THIS LEASE. GUARANTORS AGREE THAT LESSOR MAY EXTEND, TRANSFER AND AMEND THE LEASE AND GUARANTORS AGREE TO BE BOUND BY ALL SUCH CHANGES WHICH SHALL BE ALL BE SUBJECT TO THE TERMS OF THIS GUARANTY. Guarantors will pay upon demand and reimburse Lessor for all the expenses incurred in enforcing any of its rights against the Lessee, Equipment or the Guarantors, including attorney’s fees and court costs.  Each GUARANTOR WAIVE ALL SURETYSHIP DEFENSEs, NOTICES, INCLUDING NOTICES OF TRANSFER, DEMAND AND DEFAULT. GUARANTORS AGREE THAT LESSOR MAY PROCEED AGAINST ONE GUARANTOR or all guarantors DIRECTLY AND SEPARATELY FROM THE LESSEE AND THE EQUIPMENT, or any other guarantor. ALL Obligations hereunder shall be joint and several. GUARANTORS AUTHORIZE YOU OR YOUR DESIGNEE TO USE MY CONSUMER CREDIT REPORTS FROM TIME TO TIME IN ITS CREDIT EVALUATION AND COLLECTION PROCESSES. GUARANTORS CONSENT TO SUIT IN THE COURTS OF THE STATE OF BROWARD COUNTY, FLORIDA AND TO THE EXTENT PERMITTED BY APPLICABLE LAW, GUARANTORS WAIVE TRIAL BY JURY. This GUARANTY SHALL BE GOVERNED BY THE LAWS OF FLORIDA.</td></tr>";
        html += "</table>";

        html += "<table style='width: 100%; font-family: Arial Narrow, Arial, sans-serif; border: 1px solid black; margin-top: 10mm; font-size: 11.3px; border-collapse: collapse;'>"; // Added 'border-collapse' for proper border styling
        html += "<tr>";
        html += "<td colspan='2' style='border-right: 1px solid black; border-bottom: 1px solid black;'><i>Guarantor Signature</i></td>"; // Moved border styling to 'style' attribute
        html += "<td colspan='2' style='border-right: 0; border-bottom: 1px solid black;'><i>Guarantor Signature</i></td>";
        html += "</tr>";
        html += "<tr>";
        html += "<td style='border-bottom: 1px solid black;'><i>Guarantor Print Name</i>" + leaseDataObj.lesseName + "</td>";
        html += "<td style='border-right: 1px solid black; border-bottom: 1px solid black;'><i>Date</i>" + leaseDataObj.startdate + "</td>";
        html += "<td style='border-bottom: 1px solid black;'><i>Guarantor Print Name </i></td>";
        html += "<td style='border-bottom: 1px solid black;'><i>Date</i></td>";
        html += "</tr>";
        html += "</table>";
        html += "<pbr/>";



        html += "<table style='font-size: 12px; width: 100%; font-family: Arial Narrow, Arial, sans-serif; margin-top: 30mm;'>";

        // html += "<tr style='padding-top: 10px;'><td style='text-align: center;'><b>ADDITIONAL TERMS AND CONDITIONS</b></td></tr>";
        html += "<tr><td  font-size='14px'   style='align: center;'><b>ADDITIONAL TERMS AND CONDITIONS</b></td></tr>";

        html += "<tr style='padding-top:10px;'><td>1. <b>LEASE; TERM; RENTAL.</b> Lessor hereby leases to Lessee and Lessee hereby rents from the Lessor the equipment described above and on any attached schedule (hereinafter, with all replacement parts, repairs, additions and accessories incorporated therein and /or affixed thereto, referred to as the “Equipment”), on terms and conditions set forth above and below and continued on the reverse side hereof; commencing on the date that the Equipment is delivered by Lessor, Vendor or by any other supplier of any item of Equipment to Lessee, to an agent of Lessee, or to a carrier consigned for shipment either to Lessee or to Lessee’s agent (the “Commencement Date”) through one month after the final payment of the Terms, as indicated above, is made (the “Initial Term”) and continuing thereafter until terminated for the as provided for herein.  Unless otherwise provided herein, the first monthly payment of rent plus Taxes shall be payable with your Inceptions indicated above and subsequent Lease Payments shall be payable on the corresponding day of each period thereafter as indicated above (Next Payment Date), in amounts stated above plus any and all applicable Taxes, until the total rent and all other obligations of Lessee shall have been paid in full.  All Lease Payments and other payments shall be made to the Lessor at its address or at such other place as Lessor may designate in writing. Lessee hereby authorizes Lessor to insert in this lease the serial numbers and other identification data of the Equipment. When determined by Lessor, and dates or other omitted factual matters.  Nonrefundable Deposits are not refundable and shall be deemed fully earned as compensation for the loss of lessor’s bargain and not as rent if for any reason the lease term does not commence.  Any amount not paid within three (3) calendar days from when due will incur a late fee of ten (10) percent of the monthly Lease Payment. Such late fee shall be payable by Lessee and become due and payable immediately.  Lease Payment and any other amounts which remain unpaid more than thirty (30) calendar days after the applicable due date shall accrue interest at the lesser of 1.5% per month or the maximum amount permitted by law until paid in full. </td></tr>";
        html += "<tr style='padding-top:10px;'><td>2. <b>PURCHASE AND ACCEPTANCE:</b>  NO WARRANTIES BY LESSOR:  Lessee requests Lessor to purchase the Equipment from the Vendor and arrange for delivery to Lessee at Lessee’s expense, which shall be deemed complete upon the Commencement Date.  Lessor shall have no responsibility for delay or failure of Vendor to fill the order for the Equipment.  THE LESSEE REPRESENTS THAT LESSEE HAS SELECTED THE EQUIPMENT LEASED HEREUNDER PRIOR TO HAVING REQUESTED THE LESSOR TO PURCHASE THE SAME FOR LEASING TO THE LESSEE, AND LESSEE AGREES THAT THE LESSOR HAS MADE AND MAKES NO REPRESENTATIONS OR WARRANTIES OF ANY KIND OR NATURE DIRECTLY OR INDIRECTLY BY ANY EQUIPMENT LEASED HEREUNDER OR THE USE OF MAINTENANCE THEREOF OR THE FAILURE OF OPERATION THEREOF, OR THE REPAIRS, SERVICE OR ADJUSTMENT THERETO, OR BY ANY DELAY OR FAILURE TO PROVIDE ANY THEREOF, OR BY ANY INTERRUPTION OF SERVICE OR LOSS OF USE THEREOF OR ANY LOSS OF BUSINESS OR DAMAGE WHATSOEVER AND HOWSOEVER CAUSED.  NO REPRESENTATION OR WARRANTY AS TO THE EQUIPMENT OR ANY OTHER MATTER BY THE VENDOR SHALL BE BINDING ON THE LESSOR NOR SHALL THE BREACH OF SUCH RELIEVE LESSEE OF, OR IN ANY WAY AFFECT ANY OF LESSEE’S OBLIGATIONS TO THE LESSOR AS SET FORTH HEREIN. LESSOR DISCLAIMS AND SHALL NOT BE RESPONSIBLE FOR ANY LOSS, DAMAGE OR INJURY TO PERSON OR PROPERTY CAUSED BY THE EQUIPMENT, WHETHER ARISING THROUGH THE NEGLIGENCE OF THE LESSOR OR IMPOSED BY LAW.  If the Equipment is not properly installed does not operated as represented or warranted by the Vendor or is unsatisfactory for any reason, Lessee shall make any claim on account thereof solely against the Vendor and shall nevertheless pay Lessor all rent payable under this lease.  Lessor agrees to assign to Lessee, solely for the purpose of making and prosecuting any such claim, any rights it may have against the Vendor for breach of warranty or representations respecting the Equipment.  Notwithstanding any fees that may be paid to Vendor or any agent of Vendor, Lessee understands and agrees that neither the Vendor nor any agent of the Vendor is an agent of Lessor and that neither the Vendor nor his agent is authorized to waive or alter any term or condition of this lease.</td></tr>";
        html += "<tr style='padding-top:10px;'><td>3. <b>END OF TERM OPTIONS; EARLY TERMINATION:</b>  If Lessee is not in default under this Lease, Lessee has the option to elect one of the following at the expiration of the Initial term, upon not less than ninety (90) nor more than one hundred eighty (180) days written notice: (a) Lessee may return the Equipment to Lessor as provided in Section 17, below; (b) Lessee may extend the term (the “Extension Period”) of the Lease by the number of months available to be paid from the Nonrefundable Deposit or such portion of it as remains after application to Lessee’s outstanding obligations or defaults to Lease Payments during the Initial Term or during the Extension Period on the same terms as the Initial Term, and Lessee shall return the Equipment to Lessor at the end of such Extension Period as provided in Section 16, or (c) Lessee may purchase all, but not less than all, of the Equipment for the Purchase Option Price specified on the first page of this Lease together with all applicable sales, use or similar taxes, insurance and any and all other remaining amounts due under the Lease, in which case Lessor will apply the Nonrefundable Deposit to the Purchase Option Price as provided in item (b), of this Section. The parties agree that the Purchase Option Price is a reasonable estimate of the Fair Market Value of the Equipment at the end of the Initial Term. As used herein, Fair Market Value means a price solely determined by Lessor that a willing buyer would pay for the Equipment assuming the Equipment is in the condition required under this Lease.  Upon payment of the purchase price, we will transfer the Equipment to you on an “AS-IS” basis and without warranty or representation of any kind and will be completed by our execution of a bill of sale in form and substance satisfactory to us and delivery of title to the Equipment. If you fail to make such election or to return the Equipment at the end of any Extension Period, the term of this Lease will AUTOMATICALLY RENEW FOR SUCCESSIVE ONE MONTH PERIOD(S), and you will pay to us an amount equal to the monthly rent plus Taxes payment that was in effect during the last month of the prior term under the same terms and conditions as “Holdover Rent” until you satisfy one of the foregoing conditions. Nothing will relieve you from your obligations and the terms and conditions under this Lease during any Holdover Rent period and no payment of Holdover Rent shall relieve you of your obligation to return the Equipment upon the expiration or earlier cancellation or termination of the Lease. Such failure shall constitute an immediate Default, and we may cancel any automatic renewal term and pursue remedies available to us at any time. As an additional accommodation to Lessee, Lessee may, if it is not in default hereunder, upon not less than ninety (90) nor more than one hundred eighty (180) days written notice to Lessor, terminate this Lease at any time after the first three months of the Initial Term and return the Equipment to Lessor as provided in the Early Return provision of Section 17 by paying to Lessor the amount of the Nonrefundable Deposit and the Early Return Fee specified above, and Lessor will apply to such payment any portion of the Nonrefundable Deposit remaining after application to Lessee’s obligations or defaults.</td></tr>";
        html += "<tr style='padding-top:10px;'><td>4. <b>LESSOR TERMINATION BEFORE EQUIPMENT ACCEPTANCE.</b>  If within 60 days from the date Lessor orders the Equipment, same has not been delivered, installed and accepted by Lessee (in form satisfactory to Lessor) Lessor may, on 10 days written notice to Lessee, terminate this lease and its obligation to Lessee.</td></tr>";
        html += "<tr style='padding-top:10px;'><td>5. <b>TITLE.</b>  Lessor shall at all times retain title to the Equipment.  All documents of title and evidence of delivery shall be delivered to Lessor.  Lessee shall not change or remove any insignia or lettering which is on the Equipment at the time of delivery thereof, or which is thereafter placed thereon, indicating Lessor’s ownership thereof, and at any time during the lease term, upon request of Lessor, Lessee shall affix to the Equipment, in a prominent place, labels, plates or other markings supplied by Lessor stating that the Equipment is owned by Lessor.  Lessor is hereby authorized by Lessee, at Lessee’s expense to cause this lease, or any statement or other instrument in respect of this lease showing the interest of Lessor in the Equipment, including Uniform Commercial Code Financing Statements to be filed or recorded and refilled and re-recorded.  Lessee agrees to execute and deliver any statement or instrument requested by Lessor for such purpose and agrees to pay or reimburse Lessor for any filing, recording or stamp fees or taxes arising from the filing or recording any such instrument or statement.  Lessee shall at its expense protect and defend Lessor’s title against all persons claiming against or through Lessee at all times keeping the Equipment free from any legal process or encumbrance whatsoever, including but not limited to liens, attachments, levies, and executions and shall give Lessor immediate written notice thereof and shall indemnify Lessor from any loss caused thereby.  Lessee shall execute and deliver to Lessor, upon Lessor’s request, such further instruments and assurances as Lessor deems necessary or advisable for the confirmation or perfection of Lessor’s rights hereunder.  Unless otherwise agreed in writing Lessee shall have not right to purchase or otherwise acquire title to or ownership of any of the Equipment. </td></tr>";
        html += "<tr style='padding-top:10px;'><td>6. <b>CARE AND USE OF EQUIPMENT.</b> Lessee agrees to use the Equipment in the operation of Lessee’s business in the United States and/or Canada in a careful and proper manner, and in compliance with all applicable federal, state, local, Native American tribal, or foreign law, regulation, or ordinance (“Applicable Law”) (including all Federal Motor Carrier Safety Regulations (“FMCSRs”), and other highway safety, vehicle inspection, vehicle maintenance, traffic, road, truck size-and-weight, hazardous materials transportation, environmental, health, cargo security, or other laws and regulations) and applicable insurance policy conditions. Lessee agrees to ensure that all drivers or operators of the Equipment possess valid commercial driver’s licenses and meet all applicable federal and state driver qualifications and motor vehicle safety requirements (including the FMCSRs). As between Lessor and Lessee, Lessee shall have exclusive possession, control, and use of the Equipment for the duration of this Lease, and shall assume complete responsibility for the operation of the Equipment. Lessee shall maintain the Equipment in good operating condition repair and appearance and protect the same from deterioration, other than normal wear and tear, and Lessee shall ensure that the Equipment remains in conformance with all applicable federal, state, or municipal requirements (including any changes in such requirements); shall use the Equipment in the regular course of business only, within its normal capacity, without abuse and in a manner contemplated by the vendor; shall comply with all laws, ordinances, regulations, requirements and rules with respect to the use, maintenance and operation of the Equipment; shall be responsible for and pay any and all tolls associated with the use and operation of the Equipment, and for the payment of any and all fines, fees, costs or expenses related to toll evasion or any other traffic violations (collectively, “Tolls and Fines”); shall not make any modification, alteration or addition to the Equipment (other than normal operating accessories or controls which shall, when added to the Equipment become the property of the Lessor) without the prior written consent of Lessor, which shall not be unreasonably withheld; shall not so affix the Equipment to realty as to change its nature to real property or fixture and agrees that the Equipment shall remain personal property at all times regardless of how attached or installed;  shall keep the Equipment at the location shown on the schedule and shall not remove the Equipment without the consent of Lessor, which shall not be unreasonably withheld.  Lessor shall have the right during normal hours, upon reasonable prior notice to the Lessee and subject to applicable laws and regulations, to enter upon the premises where the Equipment is located in order to inspect, observe or remove the Equipment, or otherwise protect Lessor’s interest. The Equipment will not be used to store, transport, contain or deliver any hazardous materials in violation of any environmental laws or transport any persons for hire. Lessee agrees Lessor may install a monitoring device or global positioning system on any of the Equipment, which may provide data on use, location, maintenance and performance, and Lessee will not remove or tamper with such device, nor will Lessee tamper with any odometer.  Lessee also agrees that the Equipment will be used solely in the conduct of your business and will remain within the continental United States.</td></tr>";
        html += "<tr style='padding-top:10px;'><td>7. <b>NET LEASE:  TAXES.</b>  Lessee intends the Lease Payments and all other payments hereunder to be net to Lessor, and Lessee shall pay all sales, use, excise, personal property, stamp documentary,  and ad valorem taxes, license and registration fees, assessments, Tolls and Fines, penalties and other charges imposed on the ownership, possession or use of the Equipment during the term of this lease and any other imposts now or hereafter be imposed or levied by any governmental body or agency upon or in connection with the purchase, ownership, lease, possession, use, location of the Equipment or this Lease (“Taxes”). Lessee shall pay all Taxes (except Federal or State net income taxes imposed on Lessor) with respect to the Lease Payments and shall reimburse Lessor upon demand for any taxes paid by or advanced by Lessor. All fee’s, fines, and taxes of any kind, referenced in this section, will be satisfied with lessee’s payment prior to being applied to lessee’s lease payment. Any money left over will be applied to the lessee’s lease payment. Lessee shall file all returns required therefore and furnish copies to Lessor. Lessee acknowledges that Lessor has not made any representation or warranty as to the legal, accounting or tax characterization or effect of any Lease. The Lessee has consulted its own advisors with respect to such matters. All representations and warranties contained herein shall be continuing in nature and in effect at all times prior to Lessee satisfying all of Lessee’s obligations to Lessor under this Lease. You will only allow employees and authorized users to use the Equipment who have a current and valid driver’s license and are at least 21 years of age and are authorized to operate the Equipment under all applicable laws and your insurance policies. We may request for the Lessor to bring the Equipment to any of their approved locations for a physical inspection of the vehicle within 10 days written request.  We or our agents may also inspect the Equipment wherever located or used (and all maintenance records, repair orders, license plates, registration certificates, titles, and all similar documentation).  Lessor may request maintenance records to be provided by Lessee with 48 hours advance notice.  Lessee’s inability to furnish maintenance records will be considered a default under this Lease. You shall at all times maintain the highest possible value and utility of such Equipment, allowing it to be used for its original intended purpose. You will not modify or alter any Equipment without our prior written consent excepting regular maintenance. In addition to Lessee’s responsibility for payment of Tolls and Fines, Lessor may charge, and Lessee agrees to pay to Lessor, an administrative fee equal to $5 per toll or fine that Lessor is assessed or charged by any applicable tolling or governmental authority (each, an “Administrative Fee”). </td></tr>";
        html += "<tr style='padding-top:10px;'><td>8. <b>INDEMNITY.</b>  Lessee agrees to defend, indemnify and hold us (and our officers, employees, agents, and any successors and assigns) harmless from and against: (a) all claims, demands, suits and legal proceedings arising out of or related to this Lease or any Equipment, including: (i) the actual or alleged manufacture, purchase, financing, ownership, delivery, rejection, non-delivery, possession, use, transportation, storage, operation, maintenance, repair, return or disposition of the Equipment; (ii) patent, trademark or copyright infringement; or (iii) any alleged or actual default by Lessee (&quot;Actions&quot;); and (b) any and all penalties, losses, liabilities (including the liability of Lessee or Lessor for negligence, tort and strict liability), damages, Tolls and Fines, Administrative Fees, costs, court costs and any and all other expenses (including attorneys’ fees, judgments and amounts paid in settlement), incurred incident to, arising out of, or in any way connected with any Actions, this Lease or any Equipment. This indemnity shall continue even after this Lease has ended.</td></tr>";
        html += "<tr style='padding-top:10px;'><td>9. <b>INSURANCE.</b>  Lessee shall keep the Equipment insured against all risks of physical loss or damage from every cause whatsoever for not less than the actual cash value or full replacement cost of the Equipment (whichever is greater)_ without consideration for depreciation (“ Phys Dam Coverage”), which insurance policies shall be obtained from and maintained  by  TrueNorth Companies of Cedar Rapids, IA (“True North”) with an A-rated insurance company and name Lessor as an loss payee. Lessee shall also obtain and maintain non-trucking public liability insurance (“NTL Coverage”), both personal injury and property damage, covering the operation of the Equipment, which shall provide coverage to Lessee and provide coverage to Lessor as an additional insured whenever the Equipment is not being operated on behalf, or in the business, of a motor carrier (including, but not limited to, whenever the Equipment is being operated on behalf of Lessee), providing liability coverage in combined single limit of no less than one million dollars, which Phys Dam Coverage and NTL Coverage insurance policies shall also be obtained from and maintained by Lessee from True North with an A-rated insurance company. In addition to the forgoing, at all times during which the Equipment is in use in as for-hire transportation by Lessee or on behalf of or contracted to a motor carrier, Lessee shall cause there to be provided public auto liability insurance coverage, both personal injury and property damage, covering the Equipment, in the amount of no less than one million dollars.  All insurance policies required hereunder shall include terms, and be with insurance carriers, reasonably satisfactory to Lessor.  Without limiting the generality of the foregoing, each policy shall include the following terms: (i) all physical damage insurance shall name Lessee as the named insured and Lessor as loss payee or an additional named insured, (ii) all liability insurance shall name Lessee as the named insured and Lessor as additional insured, (iii) the policies shall not be cancelled or altered without at least thirty days advance notice to Lessor, (iv) coverages shall not be invalidated against Lessor because of any violation of any condition or warranty contained in the policy or application therefor by Lessee or by reason of any action or inaction of Lessee.  Lessee shall pay or cause to be paid the premiums for such insurance and deliver to Lessor satisfactory evidence of the insurance coverage required hereunder.  Lessor is not responsible for contacting the Lessee’s insurance carrier or brokers to verify new or paid coverages and Lessee is responsible for insurers and insurance brokers providing information on a timely basis to Lessor.  The proceeds of such insurance payable as a result of loss or of damage to any item of the Equipment shall be applied to satisfy Lessee’s obligations as set forth in Paragraph 10 below.  Lessee hereby irrevocably appoints Lessor as Lessee’s attorney-in-fact to make claim for, receive payment of and execute and endorse all documents, checks or drafts received in payment for loss or damage under any such insurance policy. Lessee always agrees to carry a deductible on physical damage no greater than $1,000.</td></tr>";
        html += "<tr style='padding-top:10px;'><td>10. <b>Collateral Protection Coverage:</b> Upon any failure of the Lessee to maintain the required insurance, the Lessor will, but is not required to, obtain and maintain such collateral protection coverage at the Lessee's cost and expense of $50 a day, starting on the day of pending insurance cancellation. Any fees charged from Collateral Protection Coverage will be settled before any Lease Payments are applied from monies paid by Lessee.  If the Lessor obtains collateral protection coverage on behalf of the Lessee; such insurance may include a profit to Lessor and be higher than what Lessee could arrange on its own. Such coverage shall continue at all times the Lessee is still in default of the agreement subject to all terms and conditions in this Lease until insurance coverage required by this Lease has been provided by the Lessee to the Lessor and approved by the Lessor on a business day before 4:00 PM eastern standard time.  In any event, the Lessee's ability to remedy this specific default cannot exceed 1 business days. You agree that we are not a seller of insurance or in the insurance business. Any insurance proceeds received by us will be applied, at our sole discretion, to one of the options contemplated herein.  We shall be under no duty to ascertain the existence of or to examine any policy or to advise you in the event any such policy shall not comply with the requirements hereof.</td></tr>";
        html += "<tr style='padding-top:10px;'><td>11. <b>RISK OF LOSS.</b>  Lessee hereby assumes the entire risk of loss, damage, or destruction of the Equipment from any and every cause whatsoever during the term of this lease and thereafter until redelivery to Lessor.  In the event of loss, damage or destruction of any item of Equipment, Lessee at its expense (except to the extent of any proceeds of insurance provided by Lessee which shall have been received by Lessor as a result of such loss, damage or destruction) and at Lessor’s option, shall either (a) repair such item, returning it to its previous condition, unless damaged beyond repair, or (b) pay Lessor all unpaid rental as may be allocated to such item or (c) replace such item with a like item acceptable to Lessor , in good condition and of equivalent value, which shall become property of Lessor, included within the term “Equipment” as used herein, and leased from Lessor herewith for the balance of the full term of this lease.</td></tr>";
        html += "<tr style='padding-top:10px;'><td>12. <b>PERFORMANCE BY LESSOR OF LESSEE'S OBLIGATIONS.</b>  In the event Lessee fails to comply with any provision of the lease, Lessor shall have the right, but shall not be obligated, to effect such compliance on behalf of Lessee upon ten days prior written notice to Lessee.  In such event, all moneys expended by, and all expenses of Lessor in effecting such compliance shall be deemed to be additional rental, and shall be paid by Lessee to Lessor at the time of the next monthly payment of rent.</td></tr>";
        html += "<tr style='padding-top:10px;'><td>13. <b>LEASE IRREVOCABILITY AND OTHER COVENANTS AND WARRANTIES OF LESSEE.</b>  Lessee agrees that this lease is irrevocable for the full term thereof; that Lessee’s obligations under this lease are absolute and shall continue without abatement and regardless of any disability of Lessee to use the Equipment or any part thereof because of any reason including, but not limited to war, act of God, governmental regulations, strike, loss, damage, destruction, failure of or delay in delivery, failure of the Equipment to operate properly, termination by operation of law or any other cause.</td></tr>";
        html += "<tr style='padding-top:10px;'><td>14. <b>DEFAULTS AND REMEDIES.</b>  It shall be an “Event of Default” if: you do not pay us any amounts due within ten days of its due date; fail to perform any other term of this Lease (including any provision of the above insurance provision) which is not cured within ten days (which cure of the above insurance provision must be without any gap in coverage or uninsured period), provided such failure is capable of cure;  you sell, attempt to sell, transfer, assign, sublease, rent or otherwise transfer possession or grant any rights, title or interests in any item of Equipment or this Lease to anyone, unless we consent in a signed writing; you or any guarantor of your obligations dies, becomes insolvent, files for or is the subject of a proceeding in bankruptcy, reorganization or any similar law or breaches or repudiates this Lease or the guaranty; your primary business, ownership or management changes; or you default under any lease or other contracts with us or any other persons; suffer a significant adverse change in your business or financial condition. You agree that if an  Event of Default has occurred,  we may, in our sole discretion, do any or all of the following, each of which shall be construed as cumulative, and no one of them as exclusive of the others: (a) proceed by appropriate court action or actions, including, without limitation, seeking an order of replevin, seizure or injunctive relief or any other provisional remedy;  (b) recover interest on any unpaid payment from the date it was due until fully paid at the rate of the lesser of 18% per annum or the highest rate permitted by law, which will be satisfied before any Lease Payments are from monies sent by Lessee; (c) without further notice to you, cancel this Lease whereupon all of your rights to the use of the Equipment shall absolutely cease and terminate, and you shall deliver possession of the Equipment to us in accordance with the terms hereof (excluding any purchase option) and you shall remain liable as herein provided; (d) whether or not this Lease is terminated, take possession of any or all of the Equipment wherever situated, and for such purpose, enter upon any premises without liability for so doing; (e) sell, dispose of, hold, use or lease (in full or partial satisfaction as the case may be) the Equipment; (f) declare immediately due and payable, as liquidated damages for loss of bargain and not as a penalty (i)all accrued and unpaid Rent and other accrued obligations hereunder, (ii) the sum of all unpaid Rent for the remaining term plus the Purchase Option price , as applicable in accordance with applicable law (said accelerated amount shall bear interest at a rate equal to 18% per annum); (g) directly debit your bank account(s); and (h) exercise any other right, remedy, election or recourse provided for in this Lease or which is available to us in law or equity. You agree that, if and when Lessor seeks an order of replevin, seizure or injunctive relief or any other provisional remedy, Lessor (i) has no adequate legal remedy and has suffered or will be in danger of suffering immediate, irreparable harm if the remedy sought by Lessor is not granted, and (ii) need not post an undertaking or bond where required or authorized by Applicable Law.  You acknowledge that an Event of Default hereunder shall constitute an Event of Default under any other lease, loan or other agreement with us. </td></tr>";
        html += "<tr style='padding-top:10px;'><td>15. <b>ASSIGNMENT.</b>  You may not sell, transfer, assign, sublease, rent or otherwise transfer possession of any Equipment or any rights, title or interests in the Equipment or this Lease to anyone, without our prior written consent. We may sell or transfer our interests to another person (“Assignee”), who will then have all of our rights but none of our obligations. You agree to pay our Assignee all Lease Payments and other amounts due hereunder without any defense, rights of offset or counterclaims, which shall or could be asserted against such Assignee. You waive all defenses against such Assignee and shall not hold or attempt to hold such Assignee liable for any of our obligations.</td></tr>";
        html += "<tr style='padding-top:10px;'><td>16. <b>PETS.</b> Lessee will not allow any pets or animals to enter any part of the Equipment.</td></tr>";
        html += "<tr style='padding-top:10px;'><td>17. <b>RETURN CONDITION AND EARLY RETURN FEE.</b>  If Lessee elects to return the Equipment at the expiration of the Initial Term or upon the earlier termination or cancellation of the Lease, including an early termination under Section 3, above, Lessee agrees to immediately deliver the Equipment to Lessor in the same condition as when delivered and capable of performing all normal functions, ordinary wear and tear expected at such location within the United States as we may instruct. Lessee agrees to pay all transportation and other expenses related to delivery, including disassembly, packing and such actions as is necessary to qualify the Equipment for all supplier’s (or other authorized service representative’s) then available service contract or warranty and all applicable licenses or permits. Upon our request, you agree to provide storage acceptable to us for a period of up to 90 days from the date of the return of all Equipment, at your sole expense, in an attempt to assist in the remarketing of the Equipment, including the display and demonstration of the Equipment to prospective purchasers or lessees, and allowing us to conduct any public or private sale or auction on such premises. In addition, all Equipment shall be returned to us with: (a) no mismatched tires, at least 50% original tread on all tires, and no recapped tires on the front axle; (b) no structural damage that would cost more than $250.00 to repair; (c) no damage to any glass; (d) the engine, transmission, drivetrain and running gear, as applicable, in road-worthy condition; and (e) all electrical, operating or mechanical parts, including doors and refrigeration units, in good working order.  For Equipment that includes refrigeration units, yearly usage of each such unit not in excess of the maximum hours permitted, as stated herein, if any, as determined by means of a standard, factory-installed refrigeration unit meter. In the event of an Early Return of the Equipment, in addition to all other obligations under this Section, Lessee agrees to pay to Lessor the amount of the Early Return Fee specified above.  Lessee acknowledges that the Early Return Fee is a reasonable estimate of the cost of remarketing and refurbishing the Equipment which is not easily quantifiable in advance.  Failure to return the Equipment upon expiration of the rental period and failure to pay all amounts due (including costs for damage to the Equipment) are evidence of abandonment or refusal to redeliver the property, punishable in accordance with section 812.155, Florida Statutes.</td></tr>";
        html += "<tr style='padding-top:10px;'><td>18. <b>HEADINGS.</b> The headings used in this Lease have no substantive effect and are used for convenience</td></tr>";
        html += "<tr style='padding-top:10px;'><td>19. <b>UNENFORCEABLE PROVISIONS.</b> If any provision (including any sentence or part of a sentence) of this Lease is declared invalid for any reason, such provision shall be deemed ineffective without invalidating the other provisions hereof.</td></tr>";
        html += "<tr style='padding-top:10px;'><td>20. <b>SURVIVAL.</b> If, up to and including the date of termination of this Lease, one or more events occur that give rise, before or after that date, to a liability or entitlement of Lessee or Lessor under this Lease, the liability or entitlement will continue until it is satisfied in full, not-withstanding the termination of this Lease. Lessee’s obligations include, but are not limited to, timely paying all payments due under this Lease in the event of termination.</td></tr>";
        html += "<tr style='padding-top:10px;'><td>21. <b>CONDUCT OF BUSINESS USING ELECTRONIC MEANS.</b> Lessor and Lessee consent to conduct business using, to the extent either party elects to do so in a particular instance, any method permitted by Applicable Law. This consent encompasses the use of electronic methods (including email correspondence) to transmit and effect the signature of any document, including, without limitation, any supplement, modification, addendum, amendment, notice, consent and/or waiver, required by this Lease or required by Applicable Law to be generated and maintained (or exchanged by private parties). The parties agree that when either party uses any electronic to accomplish electronic signatures, the chosen method: (1) identifies and authenticates the sender as the source of the electronic communication; (2) indicates the sender’s approval of the information contained in the electronic communication; and (3) produces an electronic document with the same integrity, accuracy, and accessibility as a paper document or handwritten signature. Either party may elect, with respect to any document, to use a manual/hardcopy signature, provided that the election will not preclude the other party from applying an electronic signature to the same document.</td></tr>";
        html += "<tr style='padding-top:10px;'><td>22. <b>SIGNATURES.</b> Original or imaged signatures shall be equally valid. This Lease and attached schedules and addendums may be signed in counterparts, and a copy of a signature to this Lease shall be equivalent for all purposes to an original signature of the same person.</td></tr>";
        html += "<tr style='padding-top:10px;'><td>23. <b>MISCELLANEOUS.</b>  This lease contains the entire agreement between the parties and may not be altered, amended, modified, terminated, or otherwise changed except by a writing signed by an executive officer of the Lessor.  This lease shall be binding when accepted in writing by the Lessor and shall be governed by the laws of the State of Florida.  Lessee agrees that all actions or proceedings instituted by Lessor or Lessee hereunder, shall, at Lessor’s option, be brought in a court of competent jurisdiction in Broward County, Florida. Lessee is required to provide Lessor with a copy of the Equipment’s registration within 30 days of taking delivery of the Equipment and no later than 30 days after every registration renewal date or interim change. The Equipment is to be always registered in Lessee’s name. At no time is the leased vehicle to be registered in Lessor’s name. In the event lessee registers the Equipment in Lessor’s name or does not provide an updated registration within 30 days as defined hereunder or Lessee doesn’t provide active registration within 30 days of its expiration date, a $250 administrative fee will be imposed and added to the lessee’s balance and will be considered in immediate default of this Lease.  Every 30 days that the registration default is not resolved will result in an additional $250 administrative fee. Lessee will have 2 business days to cure these registration defaults and provide Lessor with updated registration. Regardless of curing this default, the administrative fee will still be imposed and may include a profit to lessor. Lessee waives, insofar as permitted by law, trial by jury in any action between the parties.  Lessor and Lessee intend this to be a valid and subsisting legal document, and agree that no provision of this lease, which may be deemed unenforceable, shall in any way invalidate any other provision or provisions of this lease, all of which shall remain in full force and effect.  Any notice intended to be served hereunder shall be deemed sufficiently sent by email, text message or regular mail addressed to the party at the addresses contained hereon or to any addresses provided by lessee.  This Lease shall be binding upon the parties, their successors, legal representatives, and assigns.</td></tr>";
        html += "<tr style='padding-top:10px;'><td>24. <b>LEASE ACKNOWLEDGEMENT.</b>  Lessee acknowledges that Mercedes-Benz Financial Services USA LLC and Daimler Trust, and their respective successors, transferees, and assigns (“Creditor”) possesses an ownership or security interest in the Equipment subject to this lease (the “Lease”), and the right to proceeds rental and other payments hereunder.  Lessee also acknowledges and agrees that: (1) upon notice from Creditor it will make rental payments due under the Lease directly to Creditor; (2) until such notice has been received from Creditor, it will not make more than one rental payment due under the Lease in advance; and (3) it will not hold Creditor liable for the performance of any of Lessor’s obligations under the Lease, nor will it withhold any rental payments from Creditor on account of Lessor’s nonperformance.  Lessee further acknowledges and agrees: (a) If the underlying agreement between Lessor and Creditor is a retail contract, the Lessee’s option or right to purchase the Equipment shall be subject to Creditor obtaining a full payoff of the amounts due for the Equipment; and (b) If the underlying agreement between Lessor and Creditor is a lease agreement, then Lessee’s option or right to purchase the Equipment shall be subject to Creditor’s receipt of all monies due pursuant to the lease, including the purchase price for such Equipment.</td></tr>";
        html += "</table>";
        html += "<pbr/>";

        html += "<table style='font-size: 12px; width: 100%; font-family: Arial Narrow, Arial, sans-serif; margin-top: 30mm;'>";
        html += "<tr><td  font-size='14px'   style='align: center;'><b>APPENDIX A</b></td></tr>";
        html += "<tr><td  font-size='14px'   style='align: center;'><b>Approved Domiciled and Registration States</b></td></tr>";
        html += "<tr><td>These are the current approved States that you may possess a valid driver’s license in or that you may register the Equipment.  This list can only be edited and approved from time to time by LRM Leasing Company, Inc. in writing.</td></tr>";
        html += "<tr><td>• Alabama</td></tr>";
        html += "<tr><td>• Arkansas</td></tr>";
        html += "<tr><td>• Delaware</td></tr>";
        html += "<tr><td>• Florida</td></tr>";
        html += "<tr><td>• Georgia</td></tr>";
        html += "<tr><td>• Illinois</td></tr>";
        html += "<tr><td>•Indiana </td></tr>";
        html += "<tr><td>• Iowa**</td></tr>";
        html += "<tr><td>• Kansas </td></tr>";
        html += "<tr><td>• Kentucky</td></tr>";
        html += "<tr><td>• Maryland</td></tr>";
        html += "<tr><td>• Minnesota</td></tr>";
        html += "<tr><td>• Mississippi**</td></tr>";
        html += "<tr><td>• Missouri</td></tr>";
        html += "<tr><td>• Michigan</td></tr>";
        html += "<tr><td>• Nebraska</td></tr>";
        html += "<tr><td>• New Jersey </td></tr>";
        html += "<tr><td>• New York</td></tr>";
        html += "<tr><td>• North Carolina</td></tr>";
        html += "<tr><td>• Ohio</td></tr>";
        html += "<tr><td>• Oklahoma</td></tr>";
        html += "<tr><td>• Pennsylvania</td></tr>";
        html += "<tr><td>• South Carolina</td></tr>";
        html += "<tr><td>• Tennessee</td></tr>";
        html += "<tr><td>• Texas**</td></tr>";
        html += "<tr><td>• Virginia</td></tr>";
        html += "<tr><td>• West Virginia</td></tr>";
        html += "<tr><td>• Wisconsin</td></tr>";
        html += "<tr><td>In the event Lessee changes its Address during the term of the Agreement, Lessee must provide Lessor with written notice of Lessee’s new driver’s license Address (state/city/zip code) within thirty (30) days of the effective date of the change.  If your new address or registration provided is not in one of the approved states above, your lease will be in default and subject to the terms referenced in Section 14 of the Additional Terms &amp; Conditions, arising from Lessor’s ownership and/or Lessee’s use, possession or control of the Equipment. </td></tr>";
        html += "<tr><td> **If your driver's license address is domiciled in either Iowa, Mississippi, or Texas, you must provide the Lessor verifiable proof of the States you have driven in on each one-year anniversary from the commencement of your lease.  A $250 administrative fee will be imposed on your account for each month the information is not provided to the lessor.</td></tr>";
        html += "</table>";

        html += "<table style='width: 100%; font-family: Arial Narrow, Arial, sans-serif; font-size: 12px;  border: 1px'>";
        html += "<tr><td border-bottom = '1px'><i>LESSEE (Authorized Agent or as Individual) &amp; Co-Signer PRINT NAME</i></td><td border-bottom = '1px'></td></tr>";
        html += "<tr><td border-bottom = '1px'><i>LESSEE (Authorized Agent or as Individual) &amp; Co-Signer SIGNATURE</i></td><td border-bottom = '1px'></td></tr>";
        html += "<tr><td><i>TITLE</i></td><td><i>DATE</i></td></tr>";
        html += "</table>";
        html += "<pbr/>";

        html += "<table style='font-size: 12px; width: 100%; font-family: Arial Narrow, Arial, sans-serif; margin-top: 30mm;'>";
        html += "<tr><td  font-size='14px'   style='align: center;'><b>APPENDIX B</b></td></tr>";
        html += "<tr><td  font-size='14px'   style='align: center;'><b>MINIMUM MAINTENANCE REQUIREMENTS</b></td></tr>";
        html += "<tr><td>Regularly and properly maintaining your leased vehicle is the best way to protect the Lessee’s investment and is essential to your safety and is required under the terms of this lease agreement.</td></tr>";
        html += "<tr><td>_____Lessee will always maintain the truck in good working order and condition and will make all the necessary repairs to maintain the truck in safe working condition.  </td></tr>";
        html += "<tr><td>_____At Lessee’s expense, you will have the truck serviced in accordance with LRM Leasing’s minimum requirements listed below or as modified by LRM Leasing.  </td></tr>";
        html += "<tr><td>_____You will be responsible to provide proof that such services have been performed by emailing all receipts and records to  Maintenance@LRMLeasing.com. </td></tr>";
        html += "<tr><td>_____LRM Leasing may request detailed records from time to time at their own discretion. If records are not provided within 72 hours of request or if the Lessee doesn’t comply with these terms, provide the necessary documentation, and or meet the minimum maintenance guidelines set below; this will result in a default under the Lease Agreement and would need to be cured by Lessee in less than 5 business days.</td></tr>";
        html += "<tr><td><b>Oil Change:</b></td></tr>";
        html += "<tr><td>• Oil change must be done every 13,000 miles or less, and must be performed at a verifiable truck stop or truck repair facility</td></tr>";
        html += "<tr><td><b>6 months- these services are to be performed every 6 months or less</b></td></tr>";
        html += "<tr><td>• Replace engine air filter </td></tr>";
        html += "<tr><td>• Replace cabin air filter </td></tr>";
        html += "<tr><td><b>12 months- these services are to be performed every 12 months or less </b></td></tr>";
        html += "<tr><td>• Replace air filter cartridge on the air system compressor	</td></tr>";
        html += "<tr><td>• Replace DEF pump filter</td></tr>";
        html += "<tr><td>• Replace crankcase filter</td></tr>";
        html += "<tr><td>• Clean diesel particulate (DPF) filters</td></tr>";
        html += "<tr style='padding-top: 30px; align: left'><td style='color: black;  background-color: yellow;  align: center;'><b>Water is always FORBIDDEN to be used in place of coolant and or antifreeze</b></td></tr>";
        html += "<tr><td>By signing below, I acknowledge that I have reviewed the Minimum Maintenance Requirements.  I understand that by not adhering to these requirements that I will be in default of the Lease Agreement as referenced in Section 14 of the Additional Terms &amp; Conditions.  Any Violation of the above can result in the negation of the signed Purchase Option.</td></tr>"
        html += "</table>";
        html += "<table style='width: 100%; font-family: Arial Narrow, Arial, sans-serif; font-size: 12px;  border: 1px'>";
        html += "<tr><td border-bottom = '1px'><i>LESSEE (Authorized Agent or as Individual) &amp; Co-Signer PRINT NAME</i></td><td border-bottom = '1px'>" + leaseDataObj.lesseName + "</td></tr>";
        html += "<tr><td border-bottom = '1px'><i>LESSEE (Authorized Agent or as Individual) &amp; Co-Signer SIGNATURE</i></td><td border-bottom = '1px'></td></tr>";
        html += "<tr><td><i>TITLE</i></td><td><i>DATE</i>" + leaseDataObj.startdate + "</td></tr>";
        html += "</table>";
        html += "<pbr/>";


        html += "<table style='font-size: 12px; width: 100%; font-family: Arial Narrow, Arial, sans-serif; margin-top: 30mm;'>";
        html += "<tr><td  font-size='14px'   style='align: center;'><b>APPENDIX C</b></td></tr>";
        html += "<tr><td  font-size='14px'   style='align: center;'><b>72 HOUR EXCHANGE POLICY</b></td></tr>";
        html += "<tr><td>If you are not happy with the truck, you can exchange the truck for a truck of the same or lesser value.  To take advantage of our 72 Hour Exchange policy, the vehicle must:</td></tr>";
        html += "<tr><td style='padding-top:20px;'>• Be returned to LRM Leasing within three calendar days of delivery (day you take delivery is considered day one)</td></tr>";
        html += "<tr><td style='padding-top:20px;'>• Have less than 1,000 miles on the odometer from the time of purchase</td></tr>";
        html += "<tr><td style='padding-top:20px;'>Exchanges must be made by 4:00 PM eastern standard time on or before the third calendar day.  If the third calendar day is a Saturday, Sunday, holiday, or a day that LRM is not open, you must return the vehicle by 10:00 AM eastern standard time the following business day.  </td></tr>";
        html += "<tr><td style='padding-top:10px;'>Vehicles with any damage or modification from the original delivery date will be ineligible for exchange.  The vehicle must be returned to the location the customer originally took the delivery from.  Any type of fraud or illegal activity on behalf of the consumer renders the LRM Leasing Exchange Policy null and void.  Accessories of any kind shall remain with and a part of the motor vehicle.  If a vehicle of greater value is desired for the exchange, the customer is responsible for paying additional costs. Please note this is not a refund policy, but a vehicle exchange policy.  </td></tr>";
        html += "</table>";
        html += "<table style='width: 100%; font-family: Arial Narrow, Arial, sans-serif; font-size: 12px;  border: 1px; margin-top: 30mm;'>";
        html += "<tr><td border-bottom = '1px'><i>LESSEE (Authorized Agent or as Individual) &amp; Co-Signer PRINT NAME</i></td><td border-bottom = '1px'>" + leaseDataObj.lesseName + "</td></tr>";
        html += "<tr><td border-bottom = '1px'><i>LESSEE (Authorized Agent or as Individual) &amp; Co-Signer SIGNATURE</i></td><td border-bottom = '1px'></td></tr>";
        html += "<tr><td><i>TITLE</i></td><td><i>DATE</i>" + leaseDataObj.startdate + "</td></tr>";
        html += "</table>";
        html += "<pbr/>";

        html += "<table style='font-size: 12px; width: 100%; font-family: Arial Narrow, Arial, sans-serif; margin-top: 30mm;'>";
        html += "<tr><td  font-size='14px'   style='align: center;'><b>APPENDIX D</b></td></tr>";
        html += "<tr><td  font-size='14px'   style='align: center;'><b>SALES, USE, PROPERTY, AND OTHER TAXES</b></td></tr>";
        html += "<tr><td>Lessee understands and acknowledges Lessor may be obligated by a governmental body (e.g. by law, regulation or ordinance) to charge, collect, remit and/or periodically report applicable state and/or local taxes and fees (Taxes), as referenced in Section 7 of the Additional Terms &amp; Conditions, arising from Lessor’s ownership and/or Lessee’s use, possession or control of the Equipment.  Lessor may determine tax and fee obligations by reference to Lessee’s state/city/zip code (Address), as set forth and disclosed by Lessee in the Motor Vehicle Lease Agreement.  Lessee understands Lessor may charge Lessee Taxes on Lease Payments and all other payments by reference to the Address, as the location where the Equipment is regularly garaged.  Lessee further acknowledges that the Lessor will rely on their current driver’s license address (city, state, and zip code) for the garaged location of the Equipment.  Lessee understands and acknowledges Lessee’s sole responsibility for timely and properly notifying Lessor of any applicable exemption from Taxes due on the Equipment Lease Payments and other payments.  If Lessee fails to timely notify Lessor of a claim to an exemption from Taxes, or if Lessor, in its sole discretion, rejects Lessee’s claim to an exemption from applicable Taxes, Lessor will charge Taxes to Lessee on Lease Payments and all other Payments and Lessee must make payment to Lessee of those Taxes.  In the event Lessee changes its Address during the term of the Agreement, Lessee must provide Lessor with written notice of Lessee’s new Address (state/city/zip code) within thirty (30) days of the effective date of the change.</td></tr>";
        html += "</table>";
        html += "<table style='width: 100%; font-family: Arial Narrow, Arial, sans-serif; font-size: 12px;  border: 1px; margin-top: 30mm;'>";
        html += "<tr><td border-bottom = '1px'><i>LESSEE (Authorized Agent or as Individual) &amp; Co-Signer PRINT NAME</i></td><td border-bottom = '1px'>" + leaseDataObj.lesseName + "</td></tr>";
        html += "<tr><td border-bottom = '1px'><i>LESSEE (Authorized Agent or as Individual) &amp; Co-Signer SIGNATURE</i></td><td border-bottom = '1px'></td></tr>";
        html += "<tr><td><i>TITLE</i></td><td><i>DATE</i></td>" + leaseDataObj.startdate + "</tr>";
        html += "</table>";
        html += "<pbr/>";

        html += "<table style='font-size: 12px; width: 100%; font-family: Arial Narrow, Arial, sans-serif; margin-top: 30mm;'>";
        html += "<tr><td  font-size='14px'   style='align: center;'><b>APPENDIX E</b></td></tr>";
        html += "<tr><td  font-size='14px'   style='align: center;'><b>LIMITED POWER OF ATTORNEY</b></td></tr>";
        html += "<tr><td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; (the “Principal”), does hereby appoint LRM LEASING COMPANY, INC., as its true and lawful Attorney-In-Fact (“Attorney-In-Fact”) relating solely to that certain Equipment Lease between the Principal and Attorney-In-Fact (the “Lease”) for which Attorney-In-Fact is authorized to transfer, assign, or sign on my behalf any liability, including tolls and fines, that are addressed to the LRM LEASING COMPANY INC. The Appointment as Attorney-In-Fact extends solely to the execution of all required documents with the state and provincial government agencies necessary for the above action, as required by law. Any term not defined herein shall have the same definition as in the Lease.</td></tr>";
        html += "<tr><td>Further, the Principal does ratify and confirm all actions authorized hereunder that its Attorney-In-Fact shall do or cause to be done by virtue of this Power of Attorney. Except as for the power herein stated, the Principal does not authorize its Attorney-In-Fact to act for any other purpose.</td></tr>";
        html += "<tr><td>Third parties may rely upon the representations of the Attorney-In-Fact as to all matters relating to the power granted hereunder, and no person who may act in reliance upon the representations of the Attorney-In-Fact shall incur any liability to the Principal as a result of permitting the Attorney-In-Fact to exercise the stated power.</td></tr>";
        html += "<tr><td>This Power of Attorney will expire upon the earlier of (i) the removal of the Principal from the Equipment’s registration or (ii) the purchase of the Equipment by the Principal from Attorney-In-Fact.</td></tr>";
        html += "<tr><td>IN WITNESS WHEREOF, the Principal has hereunto executed and delivered this Power of Attorney this Date: <u>" + lease_Date + "</u> </td></tr>";
        html += "<tr><td style='padding-top:10px;'>Name:<u>" + Lessee_Name + "</u> </td></tr>";
        html += "<tr><td>STATE of Florida</td></tr>";
        html += "<tr><td>COUNTY of US</td></tr>";
        html += "<tr><td>On Date: <u>" + lease_Date + "</u>in the year 202_, before me, the undersigned, personally appeared <u>" + Lessee_Name + "</u>, personally known to me or proved to me on the basis of satisfactory evidence to be the individual(s) whose name(s) is (are) subscribed to the within instrument and acknowledged to me that he/she/they executed the same in his/her/their capacity(ies), that by his/her/their signature(s) on the instrument, the individual(s), or the person upon behalf of which the individual(s) acted, executed the instrument, and that such individual made such appearance before the undersigned in the City of <u>" + city + "</u>, State of Florida.</td></tr>";
        html += "<tr><td style='padding-top:30px;'>____________________________</td></tr>";
        html += "<tr><td>Notary Public Signature</td></tr>";
        html += "<tr><td style='padding-top:20px;'>____________________________</td></tr>";
        html += "<tr><td>Printed Name</td></tr>";
        html += "</table>";
        html += "<pbr/>";


        html += "<table style='font-size: 12px; width: 100%; font-family: Arial Narrow, Arial, sans-serif; margin-top: 30mm;'>";
        html += "<tr><td  font-size='14px'   style='align: center;'><b>APPENDIX F</b></td></tr>";
        html += "<tr><td  font-size='14px'   style='align: center;'><b>MEMORANDUM OF UNDERSTANDING</b></td></tr>";
        html += "<tr><td style='padding-top:30px;'>I," + leaseDataObj.lesseName + ", fully understand and accept my obligations as spelled out in the lease agreement that I signed.   I understand that violating any of the following four conditions will result in losing the leased vehicle and my Nonrefundable Deposit.</td></tr>";
        html += "<tr><td style='padding-top:20px; padding-right:50px;'>1)  Have sufficient funds in my bank account for the monthly automatic withdrawal of my lease payment and any other fees due and payable as contained in my Vehicle Motor Lease Agreement.</td></tr>";
        html += "<tr><td style='padding-top:20px; padding-right:50px;'>2)  Pay my insurance without any lapsed period of time while always providing 1 million dollar liability coverage with LRM Leasing Company Inc. as the additional insured and physical damage insured at actual cash value with a deductible not to exceed $1,000 with LRM Leasing Company Inc. as the loss payee.</td></tr>";
        html += "<tr><td style='padding-top:20px; padding-right:50px;'>3)  Maintain the leased vehicle in good running condition at my expense. I understand that breakdowns are not an acceptable excuse for untimely due Lease Payments.</td></tr>";
        html += "<tr><td style='padding-top:20px; padding-right:10px;'>4)  Any fees and or taxes, referenced in section 7 of the terms and conditions, accrued on my account will be satisfied first with any payment you make before being applied to your lease payment</td></tr>";
        html += "<tr><td style='padding-top:20px; padding-right:10px;'>5)  Failure to communicate. I must always maintain communication. I must return LRM’s phone calls in a timely manner.</td></tr>";
        html += "<tr><td style='padding-top:35px;'>Any Violation of the above can result in the negation of the signed Purchase Option and your lease will be in default and subject to the terms referenced in Section 14 of the Additional Terms &amp; Conditions.</td></tr>";
        html += "</table>";
        html += "<table style='width: 100%; font-family: Arial Narrow, Arial, sans-serif; font-size: 12px;  border: 1px; margin-top: 50mm;'>";
        html += "<tr><td border-bottom = '1px'><i>LESSEE (Authorized Agent or as Individual) &amp; Co-Signer PRINT NAME</i>:<u>" + Lessee_Name + "</u>,</td><td border-bottom = '1px'></td></tr>";
        html += "<tr><td border-bottom = '1px'><i>LESSEE (Authorized Agent or as Individual) &amp; Co-Signer SIGNATURE</i></td><td border-bottom = '1px'></td></tr>";
        html += "<tr><td><i>TITLE</i></td><td><i>DATE</i>: <u>" + lease_Date + "</u>,</td></tr>";
        html += "</table>";
        html += "<pbr/>";

        html += "<table style='font-size: 12px; width: 100%; font-family: Arial Narrow, Arial, sans-serif; margin-top: 30mm;'>";
        html += "<tr><td  font-size='14px'   style='align: center;'><b>APPENDIX G</b></td></tr>";
        html += "<tr><td  font-size='14px'   style='align: center;'><b>EQUIPMENT REGISTRATION</b></td></tr>";
        html += "<tr><td  font-size='14px'   style='align: center;'><b>Do not register this vehicle in LRM Leasing’s name</b></td></tr>";
        html += "<tr><td  font-size='14px'   style='align: center;'><b>Vehicle can only be registered in your name!</b></td></tr>";
        html += "<tr><td style='padding-top:30px;'><b><u>REGISTRATION REQUIREMENTS</u></b></td></tr>";
        html += "<tr><td style='padding-top: 20px;'>1) Upon delivery of your truck and or trailer you are required to provide us with a copy of your registration within 30 days and within 30 days of registration renewal.</td></tr>";
        html += "<tr><td style='padding-top:20px; padding-right:50px;'>2)  Equipment MUST be registered in LESSEE’S NAME at all times. At no time can the registration be in LRM Leasing’s name. THERE ARE NO EXCEPTIONS</td></tr>";
        html += "<tr><td style='padding-top:30px;'><b><u>REGISTRATION PENALTIES</u></b></td></tr>";
        html += "<tr><td style='padding-top:20px; '>A $250 ADMINISTRATIVE FEE WILL BE IMPOSED ON YOUR ACCOUNT AND YOU WILL BE CONSIDERED IN IMMEDIATE DEFAULT SHOULD YOU: </td></tr>";

        html += "<tr><td style='padding-top:20px; '>1) REGISTER THE VEHICLE IN LRM LEASING’S NAME; or</td></tr>";
        html += "<tr><td style='padding-top:20px;'>2)  NOT PROVIDE ACTIVE REGISTRATION WITHIN 30 DAYS OF ITS EXPIRATION DATE.</td></tr>";
        html += "<tr><td style='padding-top:20px;'>THE $250 ADMINISTRATIVE FEE WILL CONTINUE TO BE IMPOSED EVERY 30 DAYS UNTIL YOU RESOLVE EITHER OF THE ABOVE DEFAULTS.</td></tr>";
        html += "<tr><td style='padding-top:35px;'>You may contact us via email, physical mailing address or telephone. Please email:    Registration@lrmleasing.com</td></tr>";
        html += "</table>";
        html += "<table style='width: 100%; font-family: Arial Narrow, Arial, sans-serif; font-size: 12px;  border: 0px; margin-top: 5mm;'>";
        // html += "<tr><td width:20%>Address:</td><td>LRM Leasing Company, Inc.</td></tr>";
        html += "<tr><td style='width: 20%;'>Address:</td><td style='width: 90%;'>LRM Leasing Company, Inc.</td></tr>";

        html += "<tr><td ></td><td style='width: 90%;'>2160 Blount Road</td></tr>";
        html += "<tr><td></td><td style='width: 90%;'>Pompano Beach, FL 33069</td></tr>";
        html += "<tr><td colspan = '2'>LRM Leasing will provide lessee with the required documentation at the time of delivery or shortly after.</td></tr>";
        html += "<tr><td colspan = '2'><b>LRM Leasing is NOT responsible or obligated to assist lessee with their registration process and lessee acknowledges that it is their sole responsibility. X_____</b></td></tr>";
        html += "</table>";
        html += "<table style='width: 100%; font-family: Arial Narrow, Arial, sans-serif; font-size: 12px;  border: 1px; margin-top: 30mm;'>";
        html += "<tr><td border-bottom = '1px'><i>LESSEE (Authorized Agent or as Individual) &amp; Co-Signer PRINT NAME</i></td><td border-bottom = '1px'>" + leaseDataObj.lesseName + "</td></tr>";
        html += "<tr><td border-bottom = '1px'><i>LESSEE (Authorized Agent or as Individual) &amp; Co-Signer SIGNATURE</i></td><td border-bottom = '1px'></td></tr>";
        html += "<tr><td><i>TITLE</i></td><td><i>DATE</i>" + leaseDataObj.startdate + "</td></tr>";
        html += "</table>";
        html += "<pbr/>";

        html += "<table style='font-size: 12px; width: 100%; font-family: Arial Narrow, Arial, sans-serif; margin-top: 30mm;'>";
        html += "<tr><td  font-size='14px'   style='align: center;'><b>APPENDIX H</b></td></tr>";
        html += "<tr><td  font-size='14px'   style='align: center;'><b>INSURANCE REQUIREMENTS</b></td></tr>";
        html += "<tr><td style='padding-top:20px;'><b><u>If you have your OWN AUTHORITY:</u></b></td></tr>";
        html += "<tr><td >• Combined Single Limit of $1,000,000 Auto Liability Policy with LRM Leasing being listed as additional insured.</td></tr>";
        html += "<tr><td >• Physical Damage coverage with TrueNorth Companies of Cedar Rapids, IA for not less than the actual cash value or full replacement cost of the Equipment without consideration for depreciation with LRM Leasing being listed as loss payee. </td></tr>";
        html += "<tr><td >• Deductible is not to exceed $1,000</td></tr>";
        html += "<tr><td >• We need 30-day cancellation notice for non-payment or changes made to policy.</td></tr>";
        html += "<tr><td><b><u>If you are working for a company:</u></b></td></tr>";
        html += "<tr><td style='padding-top:10px; '>• Non-Trucking Liability Policy TrueNorth Companies of Cedar Rapids, IA of Combined Single Limit of $1,000,000 with LRM Leasing being listed as additional insured.</td></tr>";
        html += "<tr><td >• Physical Damage coverage TrueNorth Companies of Cedar Rapids, IA for not less than the actual cash value or full replacement cost of the Equipment without consideration for depreciation with LRM Leasing being listed as loss payee, with such policy being issued by or through True North Companies. </td></tr>";
        html += "<tr><td >• Deductible is not to exceed $1,000</td></tr>";
        html += "<tr><td >• We need 30-day cancellation notice for non-payment or changes made to policy.</td></tr>";
        html += "<tr><td ><b><u>Additional Insured and Loss Payee Information:</u></b></td></tr>";
        html += "<tr><td >LRM Leasing</td></tr>";
        html += "<tr><td >2160 Blount Road</td></tr>";
        html += "<tr><td>Pompano Beach, FL 33069</td></tr>";

        html += "<tr><td style='padding-top:10px;'><b><u>IMPORTANT</u></b></td></tr>";
        html += "<tr><td style='padding-top:10px;'>IF YOU DO NOT HAVE YOUR OWN AUTHORITY YOU ARE REQUIRED TO HAVE THIRD PARTY INSURANCE AT ALL TIMES!<u> WE WILL NOT ACCEPT INSURANCE FOR THE COMPANY YOU ARE WORKING FOR!</u></td></tr>";
        html += "<tr><td style='padding-top:10px;'>Any Violation of the above can result in the negation of the signed Purchase Option.</td></tr>";
        html += "</table>";
        html += "<table style='width: 100%; font-family: Arial Narrow, Arial, sans-serif; font-size: 12px;  border: 1px; margin-top: 50mm;'>";
        html += "<tr><td border-bottom = '1px'><i>LESSEE (Authorized Agent or as Individual) &amp; Co-Signer PRINT NAME</i></td><td border-bottom = '1px'>" + leaseDataObj.lesseName + "</td></tr>";
        html += "<tr><td border-bottom = '1px'><i>LESSEE (Authorized Agent or as Individual) &amp; Co-Signer SIGNATURE</i></td><td border-bottom = '1px'></td></tr>";
        html += "<tr><td><i>TITLE</i></td><td><i>DATE</i>" + leaseDataObj.startdate + "</td></tr>";
        html += "</table>";
        html += "<pbr/>";


        html += "<table style='font-size: 12px; width: 100%; font-family: Arial Narrow, Arial, sans-serif; margin-top: 30mm;'>";
        html += "<tr><td  font-size='14px'   style='align: center;'><b>APPENDIX I</b></td></tr>";
        html += "<tr><td  font-size='14px'   style='align: center;'><b>EMISSIONS</b></td></tr>";
        html += "<tr><td style='padding-top:30px;'><i>LRM Leasing certifies that the following air pollution emission control devices and system of this vehicle, if installed by the vehicle manufacturer or importer, have not been tampered with by us or by our agents, employees, or other representatives. We also hereby certify that we or persons under our supervision have inspected this motor vehicle and, based on said inspection, have determined that the air pollution control devices and systems, if installed by the vehicle manufacturer or importer, are in place and appear properly connected and undamaged as determined by visual observation.</i></td></tr>";
        html += "<tr><td style='padding-top: 20px;'><i>This certification shall not be deemed or construed as a warranty that any air pollution control device or system of the vehicle is in functional condition, nor does the execution or delivery of this certification create by itself grounds for a cause of action between the parties to this transaction.</i></td></tr>";
        html += "<tr><td  font-size='14px'   style='align: center;'><b>Penalties for Modification to Vehicle Emissions System</b></td></tr>";
        html += "<tr><td style='padding-top:20px;'>As per the Vehicle and Engine Certification Requirements under the Federal Clean Air Act, I understand that it is illegal to alter, tamper, or change in anyway the vehicle’s emissions system.  I understand and acknowledge that if I or anyone else bypass, tamper, or make any changes to the emissions system, I will be subject to the maximum penalty allowable under federal law.</td></tr>";
        html += "<tr><td style='padding-top:20px;'>In addition to the federal penalty, for bypassing, tampering, or making changes to the emissions system, I understand that I will be penalized a $10,000 fine imposed by LRM Leasing Company Inc. for making these changes to their vehicle plus all monies required to bring the vehicle back to legal condition including but not limited to parts, labor, transportation, and legal fees. x ____</td></tr>";
        html += "<tr><td style='padding-top:20px;'>In order to avoid potential prosecution and imposed fines by LRM Leasing Company Inc., I WILL NOT alter, tamper, bypass, or make changes in any way to the vehicle’s emissions system</td></tr>";
        html += "</table>";
        html += "<table style='width: 100%; font-family: Arial Narrow, Arial, sans-serif; font-size: 12px;  border: 1px; margin-top: 50mm;'>";
        html += "<tr><td border-bottom = '1px'><i>LESSEE (Authorized Agent or as Individual) &amp; Co-Signer PRINT NAME</i>" + leaseDataObj.lesseName + "</td><td border-bottom = '1px'></td></tr>";
        html += "<tr><td border-bottom = '1px'><i>LESSEE (Authorized Agent or as Individual) &amp; Co-Signer SIGNATURE</i></td><td border-bottom = '1px'></td></tr>";
        html += "<tr><td><i>TITLE</i></td><td><i>DATE</i>" + leaseDataObj.startdate + "</td></tr>";
        html += "</table>";
        html += "<pbr/>";

        html += "<table style='font-size: 12px; width: 100%; font-family: Arial Narrow, Arial, sans-serif; margin-top: 30mm;'>";
        html += "<tr><td  font-size='14px'   style='align: center;'><b>APPENDIX J</b></td></tr>";
        html += "<tr><td  font-size='14px'   style='align: center;'><b>HOLD HARMLESS AGREEMENT</b></td></tr>";
        html += "<tr><td style='padding-top:30px;'>This HOLD HARMLESS AGREEMENT (this “Agreement”) is made effective on " + leaseDataObj.startdate + ", by and</td></tr>";

        html += "<tr><td style='padding-top:10px;'>between LRM LEASING COMPANY, INC. (hereinafter “LRM”) and " + leaseDataObj.lesseName + ", LRM lessee (hereinafter “Lessee”), individually (collectively, the “Parties”).</td></tr>";
        html += "<tr><td style='padding-top:10px;'>WHEREAS, Lessee understands and acknowledges that LRM limits the states you may possess a valid driver’s license in and the state you may obtain registration in for all its leases to the approved state listing on Appendix A.</td></tr>";

        html += "<tr><td style='padding-top:10px;'>TERMS</td></tr>";

        html += "<tr><td style='padding-top:10px;'>Lessee agrees to fully defend, indemnify, and hold harmless, LRM from all claims lawsuits, demands, causes of actions, liability, loss, damage and/or injury, of any kind whatsoever (including without limitation all claims for monetary loss, property damage, equitable relief, personal injury and/or wrongful death), whether brought by an individual or other entity, or imposed by a court of law or by administrative action of any federal, state, or local government body or agency, arising out of, in any way whatsoever, any acts, omissions, negligence, or willful misconduct on the part of LRM, its officers, owners, personnel, employees, agents, contractors, invitees, or volunteers.   This indemnification applies to and includes, without limitation, the payment of all penalties, fines, judgements, awards, decrees, attorneys’ fees, and related costs or expenses, and any reimbursements to LRM for all legal fees, expenses and costs incurred by it.</td></tr>";

        html += "<tr><td style='padding-top:10px;'>Each Party warrants that the individual who have signed this Agreement have the actual legal power, right, and authority to make this Agreement bind each respective Party.</td></tr>";

        html += "<tr><td style='padding-top:10px;'>No supplement, modification, or amendment to this Agreement shall be binding unless executed in writing and signed by both Parties.</td></tr>";

        html += "<tr><td style='padding-top:10px;'>No waiver of any default shall constitute a waiver of any other default or breach, whether of the same or other covenant or condition.</td></tr>";

        html += "<tr><td style='padding-top:10px;'>If any legal action or other proceeding is brought in connection with this Agreement, the successful or prevailing Party, if any, shall be entitled to recover reasonable attorneys’ fees and other related costs, in addition to any other relief to which that Party is entitled to including the right of offset against any funds held on deposit.</td></tr>";

        html += "<tr><td style='padding-top:10px;'>This Agreement shall be governed exclusively by the laws of Florida, without regard to conflict of law provision.  </td></tr>";
        html += "<tr><td style='padding-top:10px;'>This Agreement shall be signed on behalf of LRM by ________________, and on behalf of the Lessee by " + leaseDataObj.lesseName + ", and effective as of the date first written above.</td></tr>";

        html += "</table>";
        html += "<table style='width: 100%; font-family: Arial Narrow, Arial, sans-serif; border: 1px solid black; margin-top: 10mm; font-size: 11.3px; border-collapse: collapse;'>"; // Added 'border-collapse' for proper border styling
        html += "<tr>";
        html += "<td colspan='3' style='border-right: 1px solid black; border-bottom: 1px solid black;'><i>LESSEE (Authorized Agent or as Individual) &amp; Co-Signer</i></td>"; // Moved border styling to 'style' attribute
        html += "<td colspan='3' style='border-right: 0; border-bottom: 1px solid black;'><i>LESSOR</i></td>";
        html += "</tr>";
        html += "<tr>";
        html += "<td style='border-bottom: 1px solid black;'><i>SIGNATURE (Lessee &amp;  Co-Signer)</i>" + leaseDataObj.lesseName + "</td>";
        html += "<td style='border-bottom: 1px solid black;'><i>Title </i></td>";
        html += "<td style='border-right: 1px solid black; border-bottom: 1px solid black;'><i>Date</i>" + leaseDataObj.startdate + "</td>";
        html += "<td style='border-bottom: 1px solid black;'><i>SIGNATURE (Lessee &amp; Co-Signer)</i></td>";
        html += "<td style='border-bottom: 1px solid black;'><i>Title</i></td>";
        html += "<td style='border-bottom: 1px solid black;'><i>Date</i></td>";
        html += "</tr>";
        html += "</table>";
        html += "<pbr/>";




        html += "<table style='font-size: 12px; width: 100%; font-family: Arial Narrow, Arial, sans-serif; margin-top: 30mm;'>";
        html += "<tr><td  font-size='14px'   style='align: center;'><b>APPENDIX K</b></td></tr>";
        html += "<tr><td  font-size='14px'   style='align: center;'><b>LEASE DISCLOSURE STATEMENT AND AGREEMENT FOR INSTALLATION </b></td></tr>";
        html += "<tr><td  font-size='14px'   style='align: center;'><b>OF VEHICLE PROTECTION SYSTEM (“AGREEMENT”)</b></td></tr>";
        html += "<tr style='padding-top: 20px;'><td style='text-align: center;'>Leased Vehicle or Equipment—VIN #, Serial #, or Other Identification</td></tr>";
        html += "<tr style='padding-top: 10px;'><td>Year:<u>" + Year + "</u>Make:<u>" + Make + "</u>Model:<u>" + Model + "</u>Transmission:<u>" + trans + "</u>Color:<u>" + Color + "</u></td></tr>";
        html += "<tr><td style='border-bottom: 1px solid black;'>VEHICLE IDENTIFICATION NUMBER: <u>" + VinName + "</u></td></tr>"
        html += "<tr style='padding-top: 10px;'><td>I have agreed to lease the above-described vehicle. You are leasing the vehicle.  You do not own it.  Your right to possession and use of the Vehicle is conditioned on you making timely lease payments to Lessor and complying with the terms of the Lease (“Lease”).  </td></tr>";
        html += "<tr style='padding-top: 10px;'><td>In this Disclosure Statement and Agreement for Installation (“Agreement”), “we,” “us” and “our” mean the Lessor that holds the Lease secured by the Vehicle, and any of our designated employees, agents, or representatives. “You” and “your” mean the Lessee(s) named above.</td></tr>";
        html += "<tr style='padding-top: 10px;'><td>You signed a Lease in connection with your lease of the vehicle described above (“Vehicle”), dated the same date as this Agreement.  We require that the Vehicle be equipped with the Vehicle Protection System (the “Device”) for us to enter into the Lease with you.  The Device is designed to ensure that you comply with the terms of the Lease.   </td></tr>";
        html += "<tr style='padding-top: 10px;'><td>The Device installed in the Vehicle has (check as applicable): X GPS X Starter Interrupt.  Please see a summary of terms of this Agreement below.  </td></tr>";
        html += "<tr style='padding-top: 10px;'><td>• A Device with GPS tracking can determine the location of your vehicle.</td></tr>";
        html += "<tr style='padding-top: 10px;'><td>• The GPS will be used to ensure the GPS is still functioning, to monitor your compliance with the Lease, and to locate the Vehicle for recovery.  </td></tr>";
        html += "<tr style='padding-top: 10px;'><td>• We may use the GPS to monitor the location and mileage of the Vehicle during the Lease. </td></tr>";
        html += "<tr style='padding-top: 10px;'><td>• The Lessor or its designated assignee or representative will not provide you or any other person any access or record of the tracking unless required to do so by law, or to enforce any rights Lessor or its designated assignee or representative may have to secure payments due under any contract between us and/or to secure recovery of the Vehicle as allowed.</td></tr>";
        html += "<tr style='padding-top: 10px;'><td>• You agree to waive any right to privacy you may have as to the location of the Vehicle.</td></tr>";
        html += "<tr style='padding-top: 10px;'><td>• A Device with Starter Interrupt may prevent the Vehicle from starting if you fail to  comply with the material terms of the Lease. </td></tr>";
        html += "<tr style='padding-top: 10px;'><td>• The GPS and/or Starter Interrupt may be used to assist law enforcement agencies.</td></tr>";
        html += "<tr style='padding-top: 10px;'><td><b><u>PLEASE READ AND SIGN BELOW TO INDICATE YOUR UNDERSTANDING AND ACCEPTANCE OF THE FOLLOWING TERMS REGARDING THE INSTALLATION OF THE DEVICE, YOUR OBLIGATIONS UNDER THE LEASE AND THE CONSEQUENCES OF FAILING TO MEET YOUR OBLIGATIONS UNDER THE LEASE:</u></b></td></tr>";
        html += "<tr style='padding-top: 10px;'><td>1) You understand that installing and maintaining the Device in the Vehicle is a material condition for us to lease you the Vehicle and that you may be able to lease a vehicle from another lessor that may not require installation of the Device.  You choose to lease this Vehicle and you consent to having the Device installed.  You acknowledge you are signing this Agreement at the same time you are signing the Lease.  This Agreement is incorporated into and part of that Lease as a single document.</td></tr>";
        html += "<tr style='padding-top: 10px;'><td>2) You have been provided with the CUSTOMER OPERATING INSTRUCTIONS (if any), which explain how the Device operates, your obligations with respect to the use of the Device, as well as a 24-hour 1-800- 865-3260.  You have been provided with a 24-hour hotline number to have someone assist you. If you are in an emergency and your vehicle is disabled, dial 911.  </td></tr>";
        html += "<tr style='padding-top: 10px;'><td>3) <b><u>IF THE DEVICE HAS GPS,</u></b> you understand it will be used by us to track the location of the Vehicle to ensure the GPS is still functioning, to monitor your compliance with the Lease, and to locate the vehicle for repossession.  We may also use the GPS to monitor the location of the vehicle prior to default.  We can use previously acquired location data for purposes of Vehicle recovery.  You agree that you have no right to privacy regarding the use of GPS to track the location of the Vehicle, but in the event that a court, arbitrator, dispute resolution organization, or state or federal authority should determine that you have a right to privacy, you hereby waive that right to the fullest extent allowed by applicable law.  You agree to inform any individual operating the Vehicle that we are using GPS to track the location and mileage of the Vehicle and that they should have no expectation of privacy regarding their location or mileage while operating the Vehicle. </td></tr>";
        html += "<tr style='padding-top: 10px;'><td>4) <b><u>IF THE DEVICE HAS STARTER INTERRUPT,</u></b> you understand that if we do not receive a scheduled payment on or before the due date, or, to the extent permitted by applicable law, you otherwise default under the terms of the Lease (see the default provision in your Lease), the Vehicle can be disabled and will not start.  If you have a right to cure your default under applicable law, the Vehicle will not start if you do not cure your default prior to the expiration of the cure period.  We will provide you notice of your right to cure if required by law.</td></tr>";
        html += "<tr style='padding-top: 10px;'><td>5) You understand if law enforcement personnel make a request that we locate and/or disable a vehicle including as part of any investigation, you agree we may do this and waive any right to privacy you may otherwise have.</td></tr>";
        html += "<tr style='padding-top: 10px;'><td>6) You understand that the Device is our property.  You further understand that if you tamper with, alter, disconnect, or remove the Device, you will be considered in default under this Agreement, and to the extent permitted by applicable law, your Lease.</td></tr>";
        html += "<tr style='padding-top: 10px;'><td>7) You understand that if you tamper with, alter, disconnect, or remove the Device from the Vehicle, you may be liable for the cost to replace or repair the Device, unless prohibited by law.  You understand that tampering, altering, or otherwise modifying the device or its installation may present a risk to you, others, and the vehicle due to fire or other cause, including potential risks of property damage and personal injury, including death.</td></tr>";
        html += "<tr style='padding-top: 10px;'><td>8) You understand that the Device may receive commands wirelessly from us.  You understand that in areas with poor wireless coverage, a command sent to your Device may not be received, even if you have paid your bill when due.  If this happens, you must call us or use the mobile application to get the command resent wirelessly or to instruct you to enter the command manually with the remote keypad, if one was provided to you.  You may call the 1-800-number and a representative will resend the command wirelessly or otherwise try to assist you.</td></tr>";
        html += "<tr style='padding-top: 10px;'><td>You understand that if your vehicle is disabled, it will not start until the Device receives a command to enable.  You understand that we have the right to assign our rights, title and interest in the Lease and this Agreement at any time.  Our assignment of the Lease will not in any way affect the terms and conditions of this Agreement.</td></tr>";
        html += "<tr style='padding-top: 10px;'><td>9) You understand that only we are permitted to perform maintenance on the Device or any of its components.  Should maintenance or repair be required, you agree to make the Vehicle available to us, during our normal business hours.  You understand that we take full responsibility for the cost of all repairs to the Device, except for repairs caused by your tampering with, altering, disconnecting, or removing the Device.</td></tr>";
        html += "<tr style='padding-top: 10px;'><td>10) You understand that you may choose to buy the Device if you exercise your purchase option under the Lease at a price to be determined and agreed upon by you and us.  If you choose to buy the Device, you will contact us.  If you do not choose to buy the Device at that time, and if you are not using the device for Optional Services, we will remove the Device from the Vehicle or render the Device inoperable (at our sole option and at no charge to you) so that it will have no effect on the operation of the Vehicle.</td></tr>";
        html += "<tr style='padding-top: 10px;'><td>11) Any violation of any terms or conditions of this Agreement is a material default under the Lease, if permitted by applicable law.  Upon any default under this Agreement or violation of the terms and conditions herein, we will be entitled to take all actions, including but not limited to recovery and disposition of the Vehicle, as allowed by applicable law and your Lease.</td></tr>";
        html += "<tr style='padding-top: 10px;'><td>12) You understand that we may not charge you for installation or our use of the Device for payment assurance purposes.</td></tr>";
        html += "<tr style='padding-top: 10px;'><td>13) You understand the Device allows us to track the mileage of the Vehicle (“Mileage Tracker”) to allow us to manage our inventory. You agree to allow this function to track the Vehicle mileage for all lawful purposes. You agree that you have no right to privacy regarding the use of the Mileage Tracker to track the mileage of the Vehicle, but in the event that a court, arbitrator, other dispute resolution organization, or state or federal authority determines that such a right exists, you hereby waive such right to the fullest extent possible.  If you have signed a Warranty or Service Contract for the Vehicle, you also agree that the Mileage Tracker may be used to allow us to comply with the terms of this Agreement, or any Warranty or Service Contract.</td></tr>";
        html += "<tr style='padding-top: 10px;'><td><b>NOTICE: Do not sign this Agreement before reading it.  By signing below, you acknowledge that you have been given the opportunity to read this Agreement, and the CUSTOMER OPERATING INSTRUCTIONS, if provided to you. You acknowledge that you have had any questions regarding the Device answered to your satisfaction.  You acknowledge that you have read and fully understand and agree to be bound by all of the terms and conditions in this Agreement.  This Agreement is hereby incorporated by reference into the Lease.</b></td></tr>";
        html += "</table>";
        html += "<table style='width: 100%; font-family: Arial Narrow, Arial, sans-serif; font-size: 12px;  border: 1px; margin-top: 50mm;'>";
        html += "<tr><td border-bottom = '1px'><i>LESSEE (Authorized Agent or as Individual) &amp; Co-Signer PRINT NAME</i></td><td border-bottom = '1px'>" + leaseDataObj.lesseName + "</td></tr>";
        html += "<tr><td border-bottom = '1px'><i>LESSEE (Authorized Agent or as Individual) &amp; Co-Signer SIGNATURE</i></td><td border-bottom = '1px'></td></tr>";
        html += "<tr><td><i>TITLE</i></td><td><i>DATE</i>" + leaseDataObj.startdate + "</td></tr>";
        html += "</table>";
        html += "<pbr/>";


        html += "<table style='font-size: 12px; width: 100%; font-family: Arial Narrow, Arial, sans-serif; margin-top: 30mm;'>";
        html += "<tr><td  font-size='14px'   style='align: center;'><b>APPENDIX K</b></td></tr>";
        html += "<tr><td  font-size='14px'   style='align: center;'><b>LEASE DISCLOSURE STATEMENT AND AGREEMENT FOR INSTALLATION </b></td></tr>";
        html += "<tr><td  font-size='14px'   style='align: center;'><b>OF VEHICLE PROTECTION SYSTEM (“AGREEMENT”)</b></td></tr>";
        html += "<tr style='padding-top: 20px;'><td style='text-align: center;'>Leased Vehicle or Equipment—VIN #, Serial #, or Other Identification</td></tr>";
        html += "<tr style='padding-top: 10px;'><td>Year:<u>" + Year + "</u>Make:<u>" + Make + "</u>Model:<u>" + Model + "</u>Transmission:<u>" + trans + "</u>Color:<u>" + Color + "</u></td></tr>";
        html += "<tr><td style='border-bottom: 1px solid black;'>VEHICLE IDENTIFICATION NUMBER:<u>" + VinName + "</u> </td></tr>"
        html += "<tr style='padding-top: 10px;'><td>I have agreed to lease the above-described vehicle. You are leasing the vehicle.  You do not own it.  Your right to possession and use of the Vehicle is conditioned on you making timely lease payments to Lessor and complying with the terms of the Lease (“Lease”).  </td></tr>";
        html += "<tr style='padding-top: 10px;'><td>In this Disclosure Statement and Agreement for Installation (“Agreement”), “we,” “us” and “our” mean the Lessor that holds the Lease secured by the Vehicle, and any of our designated employees, agents, or representatives. “You” and “your” mean the Lessee(s) named above.</td></tr>";
        html += "<tr style='padding-top: 10px;'><td>You signed a Lease in connection with your lease of the vehicle described above (“Vehicle”), dated the same date as this Agreement.  We require that the Vehicle be equipped with the Vehicle Protection System (the “Device”) for us to enter into the Lease with you.  The Device is designed to ensure that you comply with the terms of the Lease.   </td></tr>";
        html += "<tr style='padding-top: 10px;'><td>The Device installed in the Vehicle has (check as applicable): X GPS X Starter Interrupt.  Please see a summary of terms of this Agreement below.  </td></tr>";
        html += "<tr style='padding-top: 10px;'><td>• A Device with GPS tracking can determine the location of your vehicle.</td></tr>";
        html += "<tr style='padding-top: 10px;'><td>• The GPS will be used to ensure the GPS is still functioning, to monitor your compliance with the Lease, and to locate the Vehicle for recovery.  </td></tr>";
        html += "<tr style='padding-top: 10px;'><td>• We may use the GPS to monitor the location and mileage of the Vehicle during the Lease. </td></tr>";
        html += "<tr style='padding-top: 10px;'><td>• The Lessor or its designated assignee or representative will not provide you or any other person any access or record of the tracking unless required to do so by law, or to enforce any rights Lessor or its designated assignee or representative may have to secure payments due under any contract between us and/or to secure recovery of the Vehicle as allowed.</td></tr>";
        html += "<tr style='padding-top: 10px;'><td>• You agree to waive any right to privacy you may have as to the location of the Vehicle.</td></tr>";
        html += "<tr style='padding-top: 10px;'><td>• A Device with Starter Interrupt may prevent the Vehicle from starting if you fail to  comply with the material terms of the Lease. </td></tr>";
        html += "<tr style='padding-top: 10px;'><td>• The GPS and/or Starter Interrupt may be used to assist law enforcement agencies.</td></tr>";
        html += "<tr style='padding-top: 10px;'><td><b><u>PLEASE READ AND SIGN BELOW TO INDICATE YOUR UNDERSTANDING AND ACCEPTANCE OF THE FOLLOWING TERMS REGARDING THE INSTALLATION OF THE DEVICE, YOUR OBLIGATIONS UNDER THE LEASE AND THE CONSEQUENCES OF FAILING TO MEET YOUR OBLIGATIONS UNDER THE LEASE:</u></b></td></tr>";
        html += "<tr style='padding-top: 10px;'><td>1) You understand that installing and maintaining the Device in the Vehicle is a material condition for us to lease you the Vehicle and that you may be able to lease a vehicle from another lessor that may not require installation of the Device.  You choose to lease this Vehicle and you consent to having the Device installed.  You acknowledge you are signing this Agreement at the same time you are signing the Lease.  This Agreement is incorporated into and part of that Lease as a single document.</td></tr>";
        html += "<tr style='padding-top: 10px;'><td>2) You have been provided with the CUSTOMER OPERATING INSTRUCTIONS (if any), which explain how the Device operates, your obligations with respect to the use of the Device, as well as a 24-hour 1-800- 865-3260.  You have been provided with a 24-hour hotline number to have someone assist you. If you are in an emergency and your vehicle is disabled, dial 911.  </td></tr>";
        html += "<tr style='padding-top: 10px;'><td>3) <b><u>IF THE DEVICE HAS GPS,</u></b> you understand it will be used by us to track the location of the Vehicle to ensure the GPS is still functioning, to monitor your compliance with the Lease, and to locate the vehicle for repossession.  We may also use the GPS to monitor the location of the vehicle prior to default.  We can use previously acquired location data for purposes of Vehicle recovery.  You agree that you have no right to privacy regarding the use of GPS to track the location of the Vehicle, but in the event that a court, arbitrator, dispute resolution organization, or state or federal authority should determine that you have a right to privacy, you hereby waive that right to the fullest extent allowed by applicable law.  You agree to inform any individual operating the Vehicle that we are using GPS to track the location and mileage of the Vehicle and that they should have no expectation of privacy regarding their location or mileage while operating the Vehicle. </td></tr>";
        html += "<tr style='padding-top: 10px;'><td>4) <b><u>IF THE DEVICE HAS STARTER INTERRUPT,</u></b> you understand that if we do not receive a scheduled payment on or before the due date, or, to the extent permitted by applicable law, you otherwise default under the terms of the Lease (see the default provision in your Lease), the Vehicle can be disabled and will not start.  If you have a right to cure your default under applicable law, the Vehicle will not start if you do not cure your default prior to the expiration of the cure period.  We will provide you notice of your right to cure if required by law.</td></tr>";
        html += "<tr style='padding-top: 10px;'><td>5) You understand if law enforcement personnel make a request that we locate and/or disable a vehicle including as part of any investigation, you agree we may do this and waive any right to privacy you may otherwise have.</td></tr>";
        html += "<tr style='padding-top: 10px;'><td>6) You understand that the Device is our property.  You further understand that if you tamper with, alter, disconnect, or remove the Device, you will be considered in default under this Agreement, and to the extent permitted by applicable law, your Lease.</td></tr>";
        html += "<tr style='padding-top: 10px;'><td>7) You understand that if you tamper with, alter, disconnect, or remove the Device from the Vehicle, you may be liable for the cost to replace or repair the Device, unless prohibited by law.  You understand that tampering, altering, or otherwise modifying the device or its installation may present a risk to you, others, and the vehicle due to fire or other cause, including potential risks of property damage and personal injury, including death.</td></tr>";
        html += "<tr style='padding-top: 10px;'><td>8) You understand that the Device may receive commands wirelessly from us.  You understand that in areas with poor wireless coverage, a command sent to your Device may not be received, even if you have paid your bill when due.  If this happens, you must call us or use the mobile application to get the command resent wirelessly or to instruct you to enter the command manually with the remote keypad, if one was provided to you.  You may call the 1-800-number and a representative will resend the command wirelessly or otherwise try to assist you.</td></tr>";
        html += "<tr style='padding-top: 10px;'><td>You understand that if your vehicle is disabled, it will not start until the Device receives a command to enable.  You understand that we have the right to assign our rights, title and interest in the Lease and this Agreement at any time.  Our assignment of the Lease will not in any way affect the terms and conditions of this Agreement.</td></tr>";
        html += "<tr style='padding-top: 10px;'><td>9) You understand that only we are permitted to perform maintenance on the Device or any of its components.  Should maintenance or repair be required, you agree to make the Vehicle available to us, during our normal business hours.  You understand that we take full responsibility for the cost of all repairs to the Device, except for repairs caused by your tampering with, altering, disconnecting, or removing the Device.</td></tr>";
        html += "<tr style='padding-top: 10px;'><td>10) You understand that you may choose to buy the Device if you exercise your purchase option under the Lease at a price to be determined and agreed upon by you and us.  If you choose to buy the Device, you will contact us.  If you do not choose to buy the Device at that time, and if you are not using the device for Optional Services, we will remove the Device from the Vehicle or render the Device inoperable (at our sole option and at no charge to you) so that it will have no effect on the operation of the Vehicle.</td></tr>";
        html += "<tr style='padding-top: 10px;'><td>11) Any violation of any terms or conditions of this Agreement is a material default under the Lease, if permitted by applicable law.  Upon any default under this Agreement or violation of the terms and conditions herein, we will be entitled to take all actions, including but not limited to recovery and disposition of the Vehicle, as allowed by applicable law and your Lease.</td></tr>";
        html += "<tr style='padding-top: 10px;'><td>12) You understand that we may not charge you for installation or our use of the Device for payment assurance purposes.</td></tr>";
        html += "<tr style='padding-top: 10px;'><td>13) You understand the Device allows us to track the mileage of the Vehicle (“Mileage Tracker”) to allow us to manage our inventory. You agree to allow this function to track the Vehicle mileage for all lawful purposes. You agree that you have no right to privacy regarding the use of the Mileage Tracker to track the mileage of the Vehicle, but in the event that a court, arbitrator, other dispute resolution organization, or state or federal authority determines that such a right exists, you hereby waive such right to the fullest extent possible.  If you have signed a Warranty or Service Contract for the Vehicle, you also agree that the Mileage Tracker may be used to allow us to comply with the terms of this Agreement, or any Warranty or Service Contract.</td></tr>";
        html += "<tr style='padding-top: 10px;'><td><b>NOTICE: Do not sign this Agreement before reading it.  By signing below, you acknowledge that you have been given the opportunity to read this Agreement, and the CUSTOMER OPERATING INSTRUCTIONS, if provided to you. You acknowledge that you have had any questions regarding the Device answered to your satisfaction.  You acknowledge that you have read and fully understand and agree to be bound by all of the terms and conditions in this Agreement.  This Agreement is hereby incorporated by reference into the Lease.</b></td></tr>";
        html += "</table>";
        html += "<table style='width: 100%; font-family: Arial Narrow, Arial, sans-serif; border: 1px solid black; margin-top: 10mm; font-size: 11.3px; border-collapse: collapse;'>"; // Added 'border-collapse' for proper border styling
        html += "<tr>";
        html += "<td colspan='3' style='border-right: 1px solid black; border-bottom: 1px solid black;'><i>LESSEE (Authorized Agent or as Individual) &amp; Co-Signer</i></td>"; // Moved border styling to 'style' attribute
        html += "<td colspan='3' style='border-right: 0; border-bottom: 1px solid black;'><i>LESSOR</i></td>";
        html += "</tr>";
        html += "<tr>";
        html += "<td style='border-bottom: 1px solid black;'><i>SIGNATURE (Lessee &amp;  Co-Signer)</i>" + leaseDataObj.lesseName + "</td>";
        html += "<td style='border-bottom: 1px solid black;'><i>Title </i></td>";
        html += "<td style='border-right: 1px solid black; border-bottom: 1px solid black;'><i>Date</i>" + leaseDataObj.startdate + "</td>";
        html += "<td style='border-bottom: 1px solid black;'><i>SIGNATURE (Lessee &amp; Co-Signer)</i></td>";
        html += "<td style='border-bottom: 1px solid black;'><i>Title</i></td>";
        html += "<td style='border-bottom: 1px solid black;'><i>Date</i></td>";
        html += "</tr>";
        html += "</table>";
        html += "<pbr/>";

        html += "<table style='font-size: 12px; width: 100%; font-family: Arial Narrow, Arial, sans-serif; margin-top: 30mm;'>";
        html += "<tr><td  font-size='14px'   style='align: center;'><b>APPENDIX L</b></td></tr>";
        html += "<tr><td  font-size='14px'   style='align: center;'><b>UNPAID TOLLS</b></td></tr>";
        html += "<tr style='padding-top: 10px;'><td>Sometimes, unpaid tolls occur, though, usually because your vehicle’s payment transponder fails at a toll lane, or you do not have your transponder properly set up.</td></tr>";
        html += "<tr style='padding-top: 10px;'><td>To prevent you from incurring unexpected costs, such as penalties, fines, or administrative fees, LRM Leasing Company Inc. has contracted with FleetIT[ LRM reserves the right, in its sole discretion, to change and replace FleetIT with any other similar service provider.  Furthermore, LRM reserves the right, in its sole discretion, to choose to no longer use the services of FleetIT or any other similar service provider.].</td></tr>";
        html += "<tr style='padding-top: 10px;'><td>If you fail to pay a toll, for any reason whatsoever, FleetIT1 will pay the unpaid toll electronically, with funds withdrawn from LRM Leasing’s account.  Using FleetIT1 should minimize most, if not all, of the possible tolling penalties and fines from the authorities.</td></tr>";
        html += "<tr style='padding-top: 10px;'><td><b>How it works</b></td></tr>";
        html += "<tr style='padding-top: 10px;'><td>1. FleetIT1 submits a record of your vehicle’s license plate number(s) to tolling authorities nationwide. FleetIT1 covers most major U.S. tollways; fees could still occur if not paid timely.</td></tr>";
        html += "<tr style='padding-top: 10px;'><td>2. When your license plate(s) incurs an unpaid toll, FleetIT1 will pay the toll electronically.</td></tr>";
        html += "<tr style='padding-top: 10px;'><td>3. FleetIT1 invoices and collects from LRM Leasing for the unpaid tolls and fees.</td></tr>";
        html += "<tr style='padding-top: 10px;'><td>4. LRM Leasing will then add to your lease balance at the time of the transaction the actual cost incurred plus a small administrative fee.</td></tr>";
        html += "<tr style='padding-top: 10px;'><td>5. As per the terms and conditions of your lease agreement, these fees will be due immediately upon your next scheduled payment.</td></tr>";
        html += "<tr style='padding-top: 10px;'><td><b>Transponder:</b> It is imperative that you have a transponder properly set up. Your transponder must: 1) be compatible with the toll ways that you are traveling on, 2) have your license plate registered on your account, and 3) have a form of payment with sufficient funds to cover your tolls.</td></tr>";
        html += "<tr style='padding-top: 10px;'><td><b>Inactive plates:</b>  Any time you either renew your registration, get a new plate, switch carriers, or cause any other event to have an inactive registration; you need to ensure that registered plate is no longer in LRM Leasing’s or your name.  Any tolls or violations that continue to come in from a plate still showing LRM Leasing as the owner will be automatically paid and charged to your lease account.  The tolling authorities follow who the titled owner on record with each state’s department of motor vehicles.</td></tr>";
        html += "<tr style='padding-top: 10px;'><td><b>Questions or disputes?</b></td></tr>";
        html += "<tr style='padding-top: 10px;'><td>If you feel that you have been improperly charged for a toll, please request a copy of the transaction details (unpaid toll’s date, time, toll ID transaction number, toll authority, and location) from tolls@lrmleasing.com. After review, you will need to reach out to the issuing authority identified in the details of the transaction if you wish to dispute the charges. LRM Leasing does not have the authority to change or alter any tolls or associated violations and fees.</td></tr>";


        html += "</table>";
        html += "<table style='width: 100%; font-family: Arial Narrow, Arial, sans-serif; font-size: 12px;  border: 1px; margin-top:30mm;'>";
        html += "<tr><td border-bottom = '1px' border-right = '1px'><i>LESSEE (Authorized Agent or as Individual) &amp; Co-Signer</i></td><td border-bottom = '1px'><i>LRM LEASING COMPANY, INC.</i></td></tr>";
        html += "</table>";
        html += "<pbr/>";

        //3.Title Transfer

        html += "<br/>";
        html += "<br/>";

        html += "<div >";
        html += "<table style='width: 100%;font-size: 20px; font-weight: bold;'>";
        html += "<tr><td  colspan='2' style='align: center;'>Title Transfer</td></tr>";
        html += "</table>";
        html += "</div >";


        html += "<br/>";
        html += "<br/>";


        html += "<div>";
        html += "<div>";
        html += "<p style='font-size: 14px;'>";
        html += "It is hereby acknowledged and agreed that upon the maturity of the lease agreement and once the purchase option has been satisfied for the below listed vehicle, the title will be transferred and signed over to:";
        html += "</p>";
        html += "</div>";

        html += "<br/>";


        html += "<div>";
        html += "<p style='font-size: 14px;' >Name of Individual or Company on the Lease Agreement:</p>";
        html += "<p>" + leaseDataObj.lesseName + "</p>"
        html += "</div>";

        html += "<div>";
        html += "<p style='font-size: 14px;'>I understand that this decision cannot be changed for any reason whatsoever x________</p>";
        html += "</div>";

        html += '<hr style="width: 100%;"/>';

        html += "<div>";
        html += "<p style='font-size: 14px;align: center;'>Leased Vehicle or Equipment — VIN #, Serial #, or Other Identification</p>";
        html += "<p style='font-size: 14px;' >Year:<u>" + Year + "</u>Make:<u>" + Make + "</u>Model:<u>" + Model + "</u>Transmission:<u>" + trans + "</u>Color:<u>" + Color + "</u></p>";
        html += "<p style='font-size: 14px;'>VEHICLE IDENTIFICATION NUMBER:<b> <u>" + VinName + "</u></b></p>";
        html += "</div>";

        html += '<hr style="width: 100%;"/>';

        html += "<br/>";


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

        //4._ACH Authorization- dtf 2024

        html += "<br/>";
        html += "<br/>";
        html += "<br/>";
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
        html += '            Customer Name: ' + leaseDataObj.lesseName;
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
        html += "I " + leaseDataObj.lesseName + "authorize LRM to charge my bank account indicated above for the amount, frequency, and date under the “Term and Payment Schedule” of your Motor Vehicle Lease Agreement.  In the event that additional amounts are due under the Motor Vehicle Lease Agreement such as, but not limited to, prior failed ACH drafts, non-sufficient funds fees, collateral protection fees, personal property taxes, late fees, and any other charges that may be assessed and owed to LRM; I authorize LRM to make changes to the amount or frequency being drafted";
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
        html += "<td style='font-size: 11px;'><b>DATE:" + leaseDataObj.lesseName + "</b></td>";
        html += "</tr>";
        html += "</table>";
        html += "</div>";


        html += "<pbr/>";
        html += "<br/>";
        html += "<br/>";
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
        html += "<pbr/>";

        //5.Delivery and Acceptance Certificate- 2024 dtf
        html += "<br/>";
        html += "<br/>";

        html += "<div >";
        html += "<table style='width: 100%;font-size: 20px; font-weight: bold;'>";
        html += "<tr><td  colspan='2' style='align: center;'><u>ACCEPTANCE CERTIFICATE</u></td></tr>";
        html += "</table>";
        html += "</div >";

        html += "<p style='align: center;font-size: 13px;'>LEASE DATED " + leaseDataObj.startdate + "(“LEASE”)</p>"
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
        html += "<p style='font-size: 14px;' >Year:<u>" + Year + "</u>Make:<u>" + Make + "</u>Model:<u>" + Model + "</u>Transmission:<u>" + trans + "</u>Color:<u>" + Color + "</u></p>";
        html += "<p style='font-size: 14px;'>VEHICLE IDENTIFICATION NUMBER:<b> <u>" + VinName + "</u></b></p>";
        html += "</div>";

        html += '<hr style="width: 100%;"/>';

        html += "<br/>";

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
        html += '          <strong>SIGNATURE (Lessee and Co-Signer) ' + leaseDataObj.lesseName + '</strong>';
        html += '        </td>';
        html += '        <td style=" height: 100px; text-align: center; vertical-align: top;">';
        html += '          <strong>Title</strong>';
        html += '        </td>';
        html += '        <td style=" height: 100px; text-align: center; vertical-align: top;">';
        html += '          <strong>Date: ' + leaseDataObj.startdate + '</strong>';
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
        html += "<pbr/>";

        //6._LRM TRAC Addendum and Certificate- 2024 dtf

        html += "<table width = '100%' font-size='12px'  style=' width: 100%; font-family: Arial Narrow, Arial, sans-serif; text-align: center;' margin-top= '10mm'  >";
        html += "<tr><td  font-size='13px'   style='align: center;'><b>TRAC ADDENDUM</b></td></tr>";
        html += "<tr><td  font-size='13px'   style='align: center;'><b>MOTOR VEHICLE LEASE AGREEMENT</b></td></tr>";
        html += "<tr><td  font-size='12px'> Year:<u>" + Year + "</u>Make:<u>" + Make + "</u>Model:<u>" + Model + "</u>Transmission:<u>" + trans + "</u>Color:<u>" + Color + "</u></td></tr>";
        html += "<tr><td border-bottom = '1px'>  VEHICLE IDENTIFICATION NUMBER:<u>" + VinName + "</u></td></tr>";
        html += "<tr><td colspan='5'><b>TRAC Amount: $______________</b></td></tr>";
        html += "</table>";




        html += "<table font-size='11px' style='width: 100%; margin-top: 10px;'>";
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
        html += "<td style='border-bottom: 1px solid black;'><i>SIGNATURE (Lessee &amp;  Co-Signer)</i>" + leaseDataObj.lesseName + "</td>";
        html += "<td style='border-bottom: 1px solid black;'><i>Title </i></td>";
        html += "<td style='border-right: 1px solid black; border-bottom: 1px solid black;'><i>Date</i>" + leaseDataObj.startdate + "</td>";
        html += "<td style='border-bottom: 1px solid black;'><i>SIGNATURE </i></td>";
        html += "<td style='border-bottom: 1px solid black;'><i>Title</i></td>";
        html += "<td style='border-bottom: 1px solid black;'><i>Date</i></td>";
        html += "</tr>";
        html += "</table>";

        html += "<table font-size='11px'  style=' width: 100%; font-family: Arial Narrow, Arial, sans-serif; text-align: center; ' margin-top= '5mm'  >";
        html += "<tr><td  font-size='13px'   style='align: center;'><b>TRAC CERTIFICATE</b></td></tr>";
        html += "<tr><td  font-size='11px'> Pursuant to the requirements of Section 7701(h) of the Internal Revenue Code Lessee hereby certifies under penalty of perjury under the laws of the United States of America that the following is true and correct: (1) Lessee intends that more than 50% of the use of the Equipment is to be in a trade or business of the Lessee; and (2) Lessee acknowledges that Lessee has been advised by Lessor that Lessee will not be treated as the owner of the Equipment for federal income tax purposes. </td></tr>";
        html += "<tr><td style = 'align: right; text-align: left'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;LESSEE: </td></tr>";
        html += "<tr><td style = 'align: right; text-align: left'>By:___________________</td></tr>";
        html += "<tr><td style = 'align: right; text-align: left'>Name:___________________</td></tr>";
        html += "<tr><td style = 'align: right; text-align: left'>Title:___________________</td></tr>";
        html += "</table>";
        html += "<pbr/>";

        /* //7.Driver Release Authorization

                        html +="<br/>";
                        html += "<table width = '100%' font-size='12px'  style=' width: 100%; font-family: Arial Narrow, Arial, sans-serif; text-align: center;' margin-top= '10mm'  >";
                        html  += "<tr><td  font-size='14px'   style='align: center;'><b>Driver Release Authorization</b></td></tr>";
                        html += "</table>";
	

                        // First Table
                        html += "<table style='width: 100%; margin-top: 20px; font-family: Arial Narrow, Arial, sans-serif; font-size: 12pt;'>"; // Set the font size for the whole table
                        html += "<tr style='padding-top: 20px;'>";
                        html += "<td style='padding: 6px 0 2px; color: #333333;'>I, "+leaseDataObj.lesseName+", lessee of the listed vehicle below, authorize LRM Leasing <br />Company Inc. to release my leased vehicle into the possession of:</td></tr>";
                        html += "<tr style='padding-top: 15px;'>";
                        html += "<td style='padding: 6px 0 2px; color: #333333;'>Other (if applicable):</td></tr>";
                        html += "<tr style='padding-top: 15px;'>";
                        html += "<td style='padding: 6px 0 2px; color: #333333;'>Name "+leaseDataObj.lesseName+"</td></tr>";
                        html += "<tr style='padding-top: 15px;'>";
                        html += "<td style='padding: 6px 0 2px; color: #333333;'>Drivers Licence # ______________________________</td></tr>";
                        html += "<tr style='padding-top: 15px;'>";
                        html += "<td style='padding: 6px 0 2px; color: #333333;'>State DL issued ______________________________</td></tr>";
                        html += "</table>";
                        html +="<br/>";
                        // Second Table
                        html += "<table style='width: 100%; margin-top: 10px; font-family: Arial Narrow, Arial, sans-serif; font-size: 12pt;'>"; // Set the font size for the whole table
                        html += "<tr style='padding-top:20px;'>";
                        html += "<td style='padding: 6px 0 2px; color: #333333;'>Year :"+leaseDataObj.Year+"</td></tr>"; // Removed individual font-size styling
                        html += "<tr style='padding-top:15px;'>";
                        html += "<td style='padding: 6px 0 2px; color: #333333;'>Make :"+leaseDataObj.brand+"</td></tr>";
                        html += "<tr style='padding-top:15px;'>";
                        html += "<td style='padding: 6px 0 2px; color: #333333;'>Vin :"+leaseDataObj.vinName+"</td></tr>";
                        html += "</table>";

                        // Third Table
                        html +="<br/>";
                        html +="<br/>";
                        html += "<table style='width: 100%; margin-top: 10px; font-family: Arial Narrow, Arial, sans-serif; font-size: 12pt;'>"; // Set the font size for the whole table
                        html += "<tr style='padding-top:15px;'>";
                        html += "<td style='padding: 6px 0 2px; color: #333333;'>Lessee:"+leaseDataObj.lesseName+"</td></tr>";
                        html += "<tr style='padding-top:15px;'>";
                        html += "<td style='padding: 6px 0 2px; color: #333333;'>Name: ______________________________</td>";
                        html += "</tr>";
                        html += "<tr style='padding-top:15px;'>";
                        html += "<td style='padding: 6px 0 2px; color: #333333;'>Signature: ______________________________</td>";
                        html += "</tr>";
                        html += "<tr style='padding-top:15px;'>";
                        html += "<td style='padding: 6px 0 2px; color: #333333;'>Date: "+leaseDataObj.startdate+"</td>";
                        html += "</tr>";
                        html += "</table>";
						 html += "<pbr/>"; */
        //DELIVERY CHECKLIST
        html += '<p style="text-align:center;"><span style="font-size:16px;"><strong>&nbsp;<span style="font-family:NotoSans,sans-serif;">FINAL CUSTOMER DELIVERY CHECKLIST</span></strong></span></p>';

        /* html += '    <style type="text/css">table { font-size: 9pt; table-layout: fixed; width: 100%; }';
        html += 'th { font-weight: bold; font-size: 8pt; vertical-align: middle; padding: 5px 6px 3px; background-color: #e3e3e3; color: #333333; padding-bottom: 10px; padding-top: 10px; }';
        html += 'td { padding: 4px 6px; }';
        html += 'b { font-weight: bold; color: #333333; }';
        html += '</style>'; */


        html += '    <br /><br /><span style="font-size:14px;"> <b>Name on lease:</b> ' + leaseDataObj.lesseName + '</span>';

        html += '<table cellpadding="1" cellspacing="1" style="width:698.481px;border:1px solid black"><tr>';
        html += '	<td style="border-left:1px solid black;border-collapse:collapse;width: 41px;"><span style="font-size:14px;"><b>Year:</b></span></td>';
        html += '	<td style="width: 44px; font-size:14px;">' + leaseDataObj.Year + '</td>';
        html += '	<td style="border-left:1px solid black;border-collapse:collapse;width: 38px;"><span style="font-size:14px;"><b>Make:</b></span></td>';
        html += '	<td style="width: 64px;font-size:14px;">' + leaseDataObj.brand + '</td>';
        html += '	<td style="border-left:1px solid black;border-collapse:collapse;width: 48px;"><span style="font-size:14px;"><b>Model:</b></span></td>';
        html += '	<td style="width: 56px;font-size:14px;">' + leaseDataObj.model + '</td>';
        html += '	<td style="border-left:1px solid black;border-collapse:collapse;width: 86px;"><span style="font-size:14px;"><b>Transmission:</b></span></td>';
        html += '	<td style="width: 42px;">' + leaseDataObj.transmission + '</td>';
        html += '	<td style="border-left:1px solid black;border-collapse:collapse;width: 65px;"><span style="font-size:14px;"><b>Mileage:</b></span></td>';
        html += '	<td style="width: 66px;">' + leaseDataObj.mileage + '</td>';
        html += '	</tr></table>';



        html += '<table style="margin-top:15px;text-align:center;border-collapse: collapse; border:1px solid black;height:30px;width:100%; ">';
        html += '	<tr style="border-collapse: collapse;border:1px solid black;"><td style="font-size:14px;"><b>VIN #:</b></td></tr>';
        html += '<tr style="font-size:14px;">';

        for (var m = 0; m < _vinName.length; m++) {
          html += '<td style="border: 1px solid black; height:30px;font-size:16px;">' + _vinName[m] + '</td>';
        }
        html += '	</tr> </table>';
        //html += '&nbsp;';  

        html += '<p>____________ All lights/signals on vehicle including but not limited to the marker, brake, turning, head,<br />&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; tail, and reverse are working properly.</p>';

        html += '<p>____________Truck is equipped with required safety equipment (triangles and fire extinguisher).</p>';

        html += '<p>____________Tire tread depth is above DOT standard 4/32 for steer tires and 2/32 for drive tires.</p>';

        html += '<p>____________Brake depth and shoes are acceptable.</p>';

        html += '<p>____________No air leaks.</p>';

        html += '<p>____________All fluids, including but not limited to coolant, oil, and clutch fluid, are full.</p>';

        html += '<p>____________Air Conditioning in the front and rear cab are working properly.</p>';

        html += '<p>____________Windshield wipers are working properly.</p>';

        html += '<p>____________Doors and locks are working properly.</p>';

        html += '<p>____________No audible surging from the engine was present.</p>';

        html += '<p>____________Horns are working properly.</p>';

        html += '<p>____________VIN on truck matches VIN on lease agreement.</p>';

        html += '<p>____________Instrument panel is working properly with no indicators present.</p>';

        html += '<p>____________The entire truck has been inspected by me from front to back, including but not limited to,<br />&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;the radiator, the engine, tubes, and wheels. There were no visible fluids on the ground coming<br />&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;from my truck, nor was there any visible fluid leaks coming from anywhere in or on the truck<br />&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;that I inspected.</p>';

        html += '<p>____________I test drove this vehicle with no issues noted at all.</p>';

        html += '<p>____________I understand that 3rd party inspections were allowed and encouraged by LRM<br />&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; Leasing. I knowingly decided not to have a 3rd party inspect my truck before accepting delivery.</p>';
        html += '&nbsp;';

        html += '<p>I, acting on behalf of the Lessee, acknowledge that I have personally inspected or caused to be personally inspected to my satisfaction all items of Equipment described in the above Lease and that I am duly authorized on behalf of the Lessee to sign and bind the Lessee to the Lease.</p>';
        html += '<br /><br /><br />&nbsp;';
        html += '<p>Name:</p>';
        html += '<br /><br />&nbsp;';
        html += '<p>Date:</p>';
        html += '<br /><br />&nbsp;';
        html += '<p>Signature:&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp;</p>';


        //DELIVERY CHECKLIST

        html += '<pbr/>';




        //7.Driver Release Authorization

        //html +="<br/>";

        if (leaseDataObj.driverlicense) {
          html += "<table width = '100%' font-size='12px'  style=' width: 100%; font-family: Arial Narrow, Arial, sans-serif; text-align: center;' margin-top= '10mm'  >";
          html += "<tr><td  font-size='14px'   style='align: center;'><b>Driver Release Authorization</b></td></tr>";
          html += "</table>";


          // First Table
          html += "<table style='width: 100%; margin-top: 20px; font-family: Arial Narrow, Arial, sans-serif; font-size: 12pt;'>"; // Set the font size for the whole table
          html += "<tr style='padding-top: 20px;'>";
          html += "<td style='padding: 6px 0 2px; color: #333333;'>I,  <u>" + leaseDataObj.lesseName + "</u>, lessee of the listed vehicle below, authorize LRM Leasing <br />Company Inc. to release my leased vehicle into the possession of:</td></tr>";
          html += "<tr style='padding-top: 15px;'>";
          html += "<td style='padding: 6px 0 2px; color: #333333;'>Other (if applicable):</td></tr>";
          html += "<tr style='padding-top: 15px;'>";
          html += "<td style='padding: 6px 0 2px; color: #333333;'>Name:" + leaseDataObj.deliveryby + "</td></tr>";
          html += "<tr style='padding-top: 15px;'>";
          html += "<td style='padding: 6px 0 2px; color: #333333;'>Drivers Licence # ______________________________</td></tr>";
          html += "<tr style='padding-top: 15px;'>";
          html += "<td style='padding: 6px 0 2px; color: #333333;'>State DL issued ______________________________</td></tr>";
          html += "</table>";
          html += "<br/>";
          // Second Table
          html += "<table style='width: 100%; margin-top: 10px; font-family: Arial Narrow, Arial, sans-serif; font-size: 12pt;'>"; // Set the font size for the whole table
          html += "<tr style='padding-top:20px;'>";
          html += "<td style='padding: 6px 0 2px; color: #333333;'>Year :" + leaseDataObj.Year + "</td></tr>"; // Removed individual font-size styling
          html += "<tr style='padding-top:15px;'>";
          html += "<td style='padding: 6px 0 2px; color: #333333;'>Make :" + leaseDataObj.brand + "</td></tr>";
          html += "<tr style='padding-top:15px;'>";
          html += "<td style='padding: 6px 0 2px; color: #333333;'>Vin :" + leaseDataObj.vinName + "</td></tr>";
          html += "</table>";

          // Third Table
          html += "<br/>";
          html += "<br/>";
          html += "<table style='width: 100%; margin-top: 10px; font-family: Arial Narrow, Arial, sans-serif; font-size: 12pt;'>"; // Set the font size for the whole table
          html += "<tr style='padding-top:15px;'>";
          html += "<td style='padding: 6px 0 2px; color: #333333;'>Lessee:" + leaseDataObj.lesseName + "</td></tr>";
          html += "<tr style='padding-top:15px;'>";
          html += "<td style='padding: 6px 0 2px; color: #333333;'>Name: ______________________________</td>";
          html += "</tr>";
          html += "<tr style='padding-top:15px;'>";
          html += "<td style='padding: 6px 0 2px; color: #333333;'>Signature: ______________________________</td>";
          html += "</tr>";
          html += "<tr style='padding-top:15px;'>";
          html += "<td style='padding: 6px 0 2px; color: #333333;'>Date:" + leaseDataObj.startdate + "</td>";
          html += "</tr>";
          html += "</table>";
        }
        var Customer_Initials = '{{Int_es_:signer1:signature}}';
        var sign_ = '';
        sign_ = '<u>' + Customer_Initials + '</u>';
        var htmlFooter = '';
        htmlFooter += "<table align='right'> " +
          "<tr>" +
          "<td style='font-size:4px' align='right' margin-right='22' >DS</td>" +
          "</tr>" +
          "<tr>" +
          "<td style='font-size:12px' >LESSEE INITIALS<u>" + sign_ + "</u> _______</td>" +
          "</tr>" +
          "</table>";




        var xmlStr = "<?xml version=\"1.0\"?>\n<!DOCTYPE html PUBLIC \"-//big.faceless.org//report\" \"report-1.1.dtd\">\n";
        xmlStr += "<pdf>";
        xmlStr += "<head>";
        xmlStr += "<style type='text/css'>";
        xmlStr += "</style>";
        xmlStr += "<meta name='title' value='ACCEPTANCE CERTIFICATE'/>";
        xmlStr += "<meta charset='utf-8' />";
        xmlStr += "<macrolist>" +
          "<macro id='myheader'>";
        xmlStr += "";
        xmlStr += htmlHeader;
        xmlStr += "</macro>";
        xmlStr += '<macro id="myfooter">';
        xmlStr += htmlFooter;

        xmlStr += "</macro>";
        xmlStr += "</macrolist>"
        xmlStr += "</head>";
        xmlStr += "<body size='letter' class='text' header='myheader' header-height='2cm' footer='myfooter' footer-height='1cm'  style='margin-top:-10mm; margin-right:3px; margin-left:3px; margin-bottom:-10mm;'>";

        xmlStr += html;
        xmlStr += "</body>";

        xmlStr += "</pdf>";

        var Renderer = render.create();
        Renderer.templateContent = xmlStr;
        //context.response.renderPdf(xmlStr);
        var newfile = Renderer.renderAsPdf();
        var printTitle = 'Lease';

        var tranId = 'Agreement';
        // var RecordId = '';
        newfile.name = printTitle + ' #' + tranId + ' ' + RecordId + ".pdf";
        context.response.addHeader({
          name: 'Content-Type:',
          value: 'application/pdf'
        });
        context.response.addHeader({
          name: 'Content-Disposition',
          value: 'inline; filename=' + newfile.name
        });
        newfile.folder = -20;
        var fileId = newfile.save();
        log.error("fileId", fileId)
        var _ld_fil = file.load({
          id: fileId
        });
        var totalBytes = _ld_fil.size * 1;

        if (totalBytes < 1000000) {
          var _size = Math.floor(totalBytes / 1000) + ' KB';

        } else {
          var _size = Math.floor(totalBytes / 1000000) + ' MB';

        }
        //context.response.write(newfile.getContents()); 
        var rec_n = record.create({
          type: 'customrecord_echosign_agreement',
          isDynamic: !0
        });
        var leaseemail = search.lookupFields({
          type: 'customrecord_advs_lease_header',
          id: RecordId,
          columns: ['custrecord_advs_l_h_email', 'name']
        });
        var name = "Agreement for " + leaseemail.name + "";
        rec_n.setValue({
          fieldId: 'name',
          value: name,
          ignoreFieldChange: true
        });
        rec_n.setValue({
          fieldId: 'custrecord_echosign_parent_type',
          value: 'customrecord_advs_lease_header',
          ignoreFieldChange: true
        });
        rec_n.setValue({
          fieldId: 'custrecord_echosign_parent_record',
          value: RecordId,
          ignoreFieldChange: true
        });
        /* rec_n.setValue({fieldId:'custrecord896',value:tranId,ignoreFieldChange:true}); 
        rec_n.setValue({fieldId:'custrecord897',value:true,ignoreFieldChange:true}); 
        rec_n.setValue({fieldId:'custrecord_celigo_host_agreement_signer',value:true,ignoreFieldChange:true}); 
        rec_n.setValue({fieldId:'custrecord912',value:true,ignoreFieldChange:true});  */

        rec_n.selectNewLine({
          sublistId: 'recmachcustrecord_echosign_agreement'
        });
        rec_n.setCurrentSublistValue({
          sublistId: 'recmachcustrecord_echosign_agreement',
          fieldId: 'custrecord_echosign_file',
          value: fileId,
          ignoreFieldChange: true
        });
        rec_n.setCurrentSublistValue({
          sublistId: 'recmachcustrecord_echosign_agreement',
          fieldId: 'custrecord_echosign_file_size',
          value: _size,
          ignoreFieldChange: true
        });
        rec_n.commitLine({
          sublistId: 'recmachcustrecord_echosign_agreement'
        });
        var dd_i = rec_n.save();

        log.debug('dd_i', dd_i);



        var s_rec = record.create({
          type: 'customrecord_echosign_signer',
          isDynamic: !0
        });
        s_rec.setValue({
          fieldId: 'custrecord_echosign_signer',
          value: 236,
          ignoreFieldChange: true
        });
        s_rec.setValue({
          fieldId: 'custrecord_echosign_agree',
          value: dd_i,
          ignoreFieldChange: true
        });
        s_rec.setValue({
          fieldId: 'custrecord_echosign_email',
          value: leaseemail.custrecord_advs_l_h_email,
          ignoreFieldChange: true
        });
        s_rec.setValue({
          fieldId: 'custrecord_echosign_role',
          value: 1,
          ignoreFieldChange: true
        });
        s_rec.setValue({
          fieldId: 'custrecord_echosign_entityid',
          value: leaseemail.name,
          ignoreFieldChange: true
        });
        var dd_i1 = s_rec.save();
        log.debug('dd_i1', dd_i1);
        /* var s_rec	=	nlapiCreateRecord('customrecord_echosign_signer');
        s_rec.setFieldValue('custrecord_echosign_signer', 33873);
        s_rec.setFieldValue('custrecord_echosign_agree', dd_i);
        s_rec.setFieldValue('custrecord_echosign_email', cus_email);
        s_rec.setFieldValue('custrecord_echosign_role', 1);
        s_rec.setFieldValue('custrecord_echosign_entityid', c_name);
        nlapiSubmitRecord(s_rec, true, true); */

			redirect.toRecord({
                type: 'customrecord_echosign_agreement',
                id: dd_i
            });

        try {
          var onclickScript = " <html><body> <script type='text/javascript'>" +
            "try{debugger;";
          onclickScript += "var dd_i =" + dd_i + ";alert(dd_i);";
          onclickScript += "window.open('https://8760954.app.netsuite.com/app/common/custom/custrecordentry.nl?id=" + dd_i + "&rectype=953&whence=','_self');";
          // onclickScript+="window.close();";
          onclickScript += "}catch(e){alert(e+'   '+e.message);}</script></body></html>";
          context.response.write(onclickScript);
        } catch (e) {
          log.debug('error in file creation', e.toString());
        }

      }
    }


    function searchForLeaseData(leaseid) {
      try {
        var customrecord_advs_lease_headerSearchObj = search.create({
          type: "customrecord_advs_lease_header",
          filters: [
            ["internalid", "anyof", leaseid],
            "AND",
            ["isinactive", "is", "F"]
          ],
          columns: [
            "custrecord_advs_l_h_customer_name",
            "custrecord_advs_l_h_location",
            "custrecord_advs_lease_comp_name_fa",
            "custrecord_advs_la_vin_bodyfld",
            "custrecord_advs_l_h_act_add",
            "custrecord_advs_l_h_addr_drive_lice",
            "custrecord_advs_l_h_email",
            "custrecord_advs_l_h_terms",
            "custrecord_advs_l_h_depo_ince",
            "custrecord_advs_l_h_pay_incep",
            "custrecord_advs_l_a_pay_st_date",
            "custrecord_advs_l_h_pur_opti",
            "custrecord_include_driver_license",
            search.createColumn({
              name: "custrecord_advs_vm_vehicle_brand",
              join: "CUSTRECORD_ADVS_LA_VIN_BODYFLD"
            }),
            search.createColumn({
              name: "custrecord_advs_vm_engine_model_year",
              join: "CUSTRECORD_ADVS_LA_VIN_BODYFLD"
            }),
            search.createColumn({
              name: "custrecord_advs_vm_transmission_type",
              join: "CUSTRECORD_ADVS_LA_VIN_BODYFLD"
            }),
            search.createColumn({
              name: "custrecord_advs_vm_model",
              join: "CUSTRECORD_ADVS_LA_VIN_BODYFLD"
            }),
            search.createColumn({
              name: "custrecord_advs_vm_exterior_color",
              join: "CUSTRECORD_ADVS_LA_VIN_BODYFLD"
            }),
            search.createColumn({
              name: "custrecord_vehicle_master_bucket",
              join: "CUSTRECORD_ADVS_LA_VIN_BODYFLD"
            }),
            /*  search.createColumn({
							 name: "formulatext",
							 formula: "{custrecord_advs_la_vin_bodyfld.custrecord_v_master_buclet_hidden.custrecord_advs_b_c_c_terms}"
						  }), */
            "custrecord_advs_l_h_start_date",
            "custrecord_advs_l_h_end_date"
          ]
        });
        var searchResultCount = customrecord_advs_lease_headerSearchObj.runPaged().count;
        var obj = {};

        customrecord_advs_lease_headerSearchObj.run().each(function (result) {
          // .run().each has a limit of 4,000 results
          obj.vinid = result.getValue({
            name: 'custrecord_advs_la_vin_bodyfld'
          });
          obj.vinName = result.getText({
            name: 'custrecord_advs_la_vin_bodyfld'
          });
          obj.lesseId = result.getValue({
            name: 'custrecord_advs_l_h_customer_name'
          });
          obj.lesseName = result.getText({
            name: 'custrecord_advs_l_h_customer_name'
          });
          obj.companyId = result.getValue({
            name: 'custrecord_advs_lease_comp_name_fa'
          });
          obj.CompanyName = result.getText({
            name: 'custrecord_advs_lease_comp_name_fa'
          });
          obj.actualAddress = result.getValue({
            name: 'custrecord_advs_l_h_act_add'
          });
          obj.companyAddress = result.getValue({
            name: 'custrecord_advs_l_h_addr_drive_lice'
          });
          obj.email = result.getValue({
            name: 'custrecord_advs_l_h_email'
          });
          obj.startdate = result.getValue({
            name: 'custrecord_advs_l_h_start_date'
          });

          obj.enddate = result.getValue({
            name: 'custrecord_advs_l_h_end_date'
          });


          obj.terms = result.getValue({
            name: 'custrecord_advs_l_h_terms'
          });
          obj.depoinspection = result.getValue({
            name: 'custrecord_advs_l_h_depo_ince'
          });
          obj.payinception = result.getValue({
            name: 'custrecord_advs_l_h_pay_incep'
          });
          obj.firstdate = result.getValue({
            name: 'custrecord_advs_l_a_pay_st_date'
          });
          obj.purchopt = result.getValue({
            name: 'custrecord_advs_l_h_pur_opti'
          });
          obj.driverlicense = result.getValue({
            name: 'custrecord_include_driver_license'
          });


          obj.brand = result.getText({
            name: "custrecord_advs_vm_vehicle_brand",
            join: "CUSTRECORD_ADVS_LA_VIN_BODYFLD"
          });
          obj.Year = result.getText({
            name: "custrecord_advs_vm_engine_model_year",
            join: "CUSTRECORD_ADVS_LA_VIN_BODYFLD"
          }) || '';
          obj.transmission = result.getText({
            name: "custrecord_advs_vm_transmission_type",
            join: "CUSTRECORD_ADVS_LA_VIN_BODYFLD"
          });
          obj.model = result.getText({
            name: "custrecord_advs_vm_model",
            join: "CUSTRECORD_ADVS_LA_VIN_BODYFLD"
          });
          obj.excolor = result.getText({
            name: "custrecord_advs_vm_exterior_color",
            join: "CUSTRECORD_ADVS_LA_VIN_BODYFLD"
          });
          obj.bucket = result.getText({
            name: "custrecord_vehicle_master_bucket",
            join: "CUSTRECORD_ADVS_LA_VIN_BODYFLD"
          });
          return true;
        });
        return obj;

      } catch (e) {
        log.error('error', e.toString());
      }
    }

    function getAddressData(Lessee) {
      var customerDetailsSearch = search.create({
        type: "customer",
        filters: [
          ["internalid", "anyof", Lessee]
        ],
        columns: [
          search.createColumn({
            name: "phone",
            label: "Addressee"
          }),
          search.createColumn({
            name: "email",
            label: "Addressee"
          }),
          search.createColumn({
            name: "addressee",
            label: "Addressee"
          }),
          search.createColumn({
            name: "address1",
            label: "Address 1"
          }),
          search.createColumn({
            name: "city",
            label: "City"
          }),
          search.createColumn({
            name: "state",
            label: "State/Province"
          }),
          search.createColumn({
            name: "zipcode",
            label: "Zip Code"
          }),
          search.createColumn({
            name: "country",
            label: "Zip Code"
          })
        ]
      });

      var obj = {};
      customerDetailsSearch.run().each(function (result) {
        var state = result.getValue({
          name: "state"
        });
        obj.state = xml.escape({
          xmlText: state
        });
        var addressee = result.getValue({
          name: "addressee"
        });
        obj.addressee = xml.escape({
          xmlText: addressee
        });
        var address1 = result.getValue({
          name: "address1"
        });
        obj.address1 = xml.escape({
          xmlText: address1
        });
        var city = result.getValue({
          name: "city"
        });
        obj.city = xml.escape({
          xmlText: city
        });
        var zipcode = result.getValue({
          name: "zipcode"
        });
        obj.zipcode = xml.escape({
          xmlText: zipcode
        });

        obj.country = result.getValue({
          name: "country"
        });
        obj.phone = result.getValue({
          name: "phone"
        });

      });
      return obj;
    }
    return {
      onRequest
    }
  });