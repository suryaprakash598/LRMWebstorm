/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */

define(['N/error', 'N/task', 'N/render', 'N/file', 'N/encode', 'N/record', 'N/search', 'N/ui', 'N/ui/serverWidget', 'N/log', 'N/format', 'N/runtime', 'N/redirect', 'N/url', 'N/https', 'N/xml'],
    function (error, task, render, file, encode, record, search, ui, serverWidget, log, format, runtime, redirect, url, https, xml) {
    function onRequest(context) {
        if (context.request.method == "GET") {
            var RecordId       = context.request.parameters.recId;
            var isBase64       = context.request.parameters.baseSixtyFour;
           
            var RecordType     = "customrecord_advs_lease_header"; 
            var UserObj        = runtime.getCurrentUser();
            var UserId         = UserObj.id;
            var UserName       = UserObj.name;
            var UserRole       = UserObj.role;
            var UserEmail      = UserObj.email;
            var UserSubsidiary = UserObj.subsidiary;
            var UserLocation   = UserObj.location;
            var leaseDataObj   = searchForLeaseData(RecordId);
            
            var addressobj     = getAddressData(leaseDataObj.lesseId);
            var _vinNametext   = leaseDataObj.vinName;
            _vinName           = _vinNametext.split('');
			 log.debug("rec" + RecordId, 'isBase64' + isBase64);
			 log.error('leaseDataObj', leaseDataObj);
            

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

            var html = " ";

            //7.Driver Release Authorization
 
            html += "<table width = '100%' font-size='12px'  style=' width: 100%; font-family: Arial Narrow, Arial, sans-serif; text-align: center;' margin-top= '10mm'  >";
            html += "<tr><td  font-size='14px'   style='align: center;'><b>Driver Release Authorization</b></td></tr>";
            html += "</table>";

            // First Table
            html += "<table style='width: 100%; margin-top: 20px; font-family: Arial Narrow, Arial, sans-serif; font-size: 12pt;'>"; // Set the font size for the whole table
            html += "<tr style='padding-top: 20px;'>";
            html += "<td style='padding: 6px 0 2px; color: #333333;'>I, " + leaseDataObj.lesseName + ", lessee of the listed vehicle below, authorize LRM Leasing <br />Company Inc. to release my leased vehicle into the possession of:</td></tr>";
            html += "<tr style='padding-top: 15px;'>";
            html += "<td style='padding: 6px 0 2px; color: #333333;'>Other (if applicable):</td></tr>";
            html += "<tr style='padding-top: 15px;'>";
            html += "<td style='padding: 6px 0 2px; color: #333333;'>Name " + leaseDataObj.lesseName + "</td></tr>";
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
            html += "<td style='padding: 6px 0 2px; color: #333333;'>Signature:{{Int_es_:signer1:signature}}</td>";
            html += "</tr>";
            html += "<tr style='padding-top:15px;'>";
            html += "<td style='padding: 6px 0 2px; color: #333333;'>Date: " + leaseDataObj.startdate + "</td>";
            html += "</tr>";
            html += "</table>";
 
             

            var xmlStr = "<?xml version=\"1.0\"?>\n<!DOCTYPE html PUBLIC \"-//big.faceless.org//report\" \"report-1.1.dtd\">\n";
            xmlStr += "<pdf>";
            xmlStr += "<head>";
            xmlStr += "<style type='text/css'>";
            xmlStr += "</style>";
            xmlStr += "<meta name='title' value='DRIVER RELEASE AUTHORIZATION'/>";
            xmlStr += "<meta charset='utf-8' />";
            xmlStr += "<macrolist>" +
            "<macro id='myheader'>";
            xmlStr += "";
            xmlStr += htmlHeader;
            xmlStr += "</macro>"; 
            xmlStr += "</macrolist>"
            xmlStr += "</head>";
            xmlStr += "<body size='letter' class='text' header='myheader' header-height='2cm' footer='myfooter' footer-height='1cm'  style='margin-top:-10mm; margin-right:3px; margin-left:3px; margin-bottom:-10mm;'>";

            xmlStr += html;
            xmlStr += "</body>";

            xmlStr += "</pdf>";

            var Renderer = render.create();
            Renderer.templateContent = xmlStr; 
            var newfile = Renderer.renderAsPdf();
            var printTitle = 'Driver Release Authorization'; 
            var tranId = ''; 
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
            

            try {
                var onclickScript = " <html><body> <script type='text/javascript'>" +
                    "try{debugger;";
                onclickScript += "debugger;var dd_i =" + dd_i + ";";
                
                onclickScript += "window.open('https://8760954.app.netsuite.com/app/common/custom/custrecordentry.nl?id=" + dd_i + "&rectype=953&whence=','_self');";

                onclickScript += "window.close();;";
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
                filters:
                [
                    ["internalid", "anyof", leaseid],
                    "AND",
                    ["isinactive", "is", "F"]
                ],
                columns:
                [
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