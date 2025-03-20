/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */

define(['N/error', 'N/task', 'N/render', 'N/file', 'N/encode', 'N/record', 'N/search', 'N/ui', 'N/ui/serverWidget', 'N/log', 'N/format', 'N/runtime', 'N/redirect', 'N/url', 'N/https', 'N/xml'],

    function (error, task, render, file, encode, record, search, ui, serverWidget, log, format, runtime, redirect, url, https, xml) {

    function onRequest(context) {

        if (context.request.method == "GET") {

            var RecordId = context.request.parameters.ofrid;
            log.debug("rec", RecordId)
            RecordType = "customrecord_lms_ofr_";

            var UserObj = runtime.getCurrentUser();
            var UserId = UserObj.id;
            var UserName = UserObj.name;
            var UserRole = UserObj.role;
            var UserEmail = UserObj.email;
            var UserSubsidiary = UserObj.subsidiary;
            var UserLocation = UserObj.location;

            var form = serverWidget.createForm({
                title: "REPO HOLD HARMLESS PDF"
            });

            var Html = "";
            var htmlHeader = " ";
            var htmlFooter = " ";
            var HTMLObj = form.addField({
                id: "custpage_html_field",
                label: "HTML",
                type: serverWidget.FieldType.INLINEHTML,
                source: null,
                container: null
            });
            RecObj = record.load({
                type: RecordType,
                id: RecordId,
                isDynamic: true,

            })
                var VinNo = RecObj.getText({
                    fieldId: "custrecord_ofr_vin"
                });

            //var VIN = VinNo.split("");
            var RepoCompany = RecObj.getText({
                fieldId: "custrecord_advs_repo_company"
            });
            var RepoCompanyID = RecObj.getValue({
                fieldId: "custrecord_advs_repo_company"
            });
            var make = RecObj.getText({
                fieldId: "custrecord_ofr_make"
            });
            var year = RecObj.getText({
                fieldId: "custrecord_ofr_year"
            });
            var color = RecObj.getText({
                fieldId: "custrecord_advs_ofr_color"
            })
                var subsidiary = 1;
            var SMainLogo = '';
            if (subsidiary) {
                var SubRec = record.load({
                    type: "subsidiary",
                    id: subsidiary,
                    isDynamic: !0
                });

                var SMainLogo = SubRec.getValue({
                    fieldId: "logo"
                });
                /* var File	=	nlapiLoadFile(logoId);
                SMainLogo	=	File.getURL(); */
            }

            var RecDate = record.create({
                type: "customrecord_advs_st_current_date_time",
                isDynamic: true
            });
            var currentdate = RecDate.getValue({
                fieldId: "custrecord_st_current_date"
            });
            var currentdate = format.format({
                value: currentdate,
                type: format.Type.DATE
            })

                var ImgFile1980 = SMainLogo || 2303;

            var fileObj = file.load({
                id: ImgFile1980
            });

            var Imagewith1980 = fileObj.url;

            Imagewith1980 = xml.escape({
                xmlText: Imagewith1980
            });

            htmlHeader += "<table   width='100%'>" +
            "<tr>" + 
            " <td><img src ='" + Imagewith1980 + "' align='center' width='250px' height='45px' alt='Logo cannot loaded'></img></td>" +
            "</tr><tr><td align='center'><b>Repossession Order</b></td></tr>" +
            "</table>";
            Html += "<table style='margin-top:50px;' width='60%'>";
            Html += "<tr>";
            Html += "<td><b>Date:</b></td><td>"+currentdate+"</td>";
			Html += "</tr>";
			Html += "<tr>";
            Html += "<td><b>Att:</b></td><td>"+RepoCompany+"</td>";
			Html += "</tr>";
			Html += "<tr><td>&nbsp;</td>";
			Html += "</tr>";
			Html += "<tr>";
            Html += "<td><b>Year:</b></td><td>"+year+"</td>";
			Html += "</tr>";
			Html += "<tr>";
            Html += "<td><b>Make:</b></td><td>"+make+"</td>";
			Html += "</tr>";
			Html += "<tr>";
            Html += "<td><b>Color:</b></td><td>"+color+"</td>";
			Html += "</tr>";
			Html += "<tr>";
            Html += "<td><b>Vin:</b></td><td>"+VinNo+"</td>";
            Html += "</tr>";

            Html += "</table>";
            Html += "<table style='font-size: 12px;font-family: Arial, Helvetica, sans-serif;margin-top:20px;'>";
            Html += "<tr>";
            Html += "<td align='center' style='padding-top:5px;padding-bottom:5px;'><b>Hold Harmless Agreement</b></td>";
            Html += "</tr>";
            Html += "<tr>";
            Html += "<td>This document serves as authorization for <b> " + RepoCompany + "</b>, hereinafter referred to as 'Agent,' to act as an agent of LRM Leasing Company Inc., hereinafter referred to as 'LRM Leasing,' to collect, recover, and/or transport the above-listed equipment and lessee. LRM Leasing Company Inc. asserts its ownership of the vehicle.</td>";
            Html += "</tr>";
            Html += "<tr>";
            Html += "<td style='padding-top:7px;padding-bottom:7px;'><b>Indemnification and Hold Harmless</b></td>";
            Html += "</tr>";
            Html += "<tr>";
            Html += "<td>LRM Leasing Company Inc. agrees to indemnify and hold harmless Agent from and against any and all claims, damages, losses, and actions, including reasonable attorney fees, resulting from or arising out of efforts to collect and or recover claims, except for those caused by or arising out of negligence or unauthorized acts on the part of Agent, its affiliates, employees, or agents.</td>";
            Html += "</tr>";
            Html += "<tr>";
            Html += "<td style='padding-top:7px;padding-bottom:7px;'><b>Scope of Indemnification</b></td>";
            Html += "</tr>";
            Html += "<tr>";
            Html += "<td>This indemnification covers but is not limited to claims arising from property damage, bodily injury, or other losses incurred only during the repossession process.</td>";
            Html += "</tr>";
            Html += "<tr>";
            Html += "<td style='padding-top:7px;padding-bottom:7px;'><b>Limitations</b></td>";
            Html += "</tr>";
            Html += "<tr>";
            Html += "<td>Nothing in this agreement shall be construed to authorize Agent to violate any city, county, state, or federal laws or regulations. Furthermore, nothing in this agreement shall absolve the Agent from carrying the required active insurance coverages with respect to operating and transporting our equipment.</td>";
            Html += "</tr>";
            Html += "<tr >";
            Html += "<td style='padding-top:7px;padding-bottom:7px;'><b>Compliance with Laws</b></td>";
            Html += "</tr>";
            Html += "<tr>";
            Html += "<td>Agent agrees to conduct all activities related to the repossession, recovery, and transportation of the equipment and lessee in compliance with all applicable laws, regulations, and industry standards.</td>";
            Html += "</tr>";
			Html += "</table>";
			var fileObj = file.load({
                id: 4680
            });

            var sign = fileObj.url;

            var sign1 =   xml.escape({
                xmlText:sign// 'https://8760954.app.netsuite.com/core/media/media.nl?id=4680&c=8760954&h=byQhiWNORF3ByPQt2_XRwUAqrUhkAExCjtE8gHbhDHIVQYkg'
            });

			log.debug('sign1',sign1);
			  Html += "<table style='margin-top:20px;font-size: 12px;font-family: Arial, Helvetica, sans-serif;margin-top:20px;'>";
            Html += "<tr>";
            Html += "<td>Matthew Brauser</td>";
            Html += "</tr>";
            
             Html += "<tr><td><img src ='" + sign1 + "' align='center' width='130px' height='45px' alt='Logo cannot loaded'></img></td>";
			Html += "</tr>"; 
            Html += "<tr>"; 
			
            Html += "<td>President</td>";
            Html += "</tr>";
            Html += "<tr>";
            Html += "<td>LRM leasing Company Inc.</td>";
            Html += "</tr>";

            Html += "</table>";

            HTMLObj.defaultValue = Html;

            var xmlStr = "<?xml version=\"1.0\"?>\n<!DOCTYPE html PUBLIC \"-//big.faceless.org//report\" \"report-1.1.dtd\">\n";
            xmlStr += "<pdf>";
            xmlStr += "<head>";
             
            xmlStr += "<meta name='title' value='REPO HOLD'/>";
            xmlStr += "<meta charset='utf-8' />"; 
            xmlStr += "</head>";
            xmlStr += "<body size='A4' class='text' header='myheader' header-height='10px' footer='myfooter' style='margin-left:25px;margin-right:15px;'  >";
            xmlStr += htmlHeader; 
            xmlStr += Html;
            xmlStr += "</body>";
            xmlStr += "</pdf>";
			try{
				 var Renderer = render.create();
            Renderer.templateContent = xmlStr;

            var Newfile = Renderer.renderAsPdf();
            Newfile.name = VinNo+".PDF";
             Newfile.folder = -20;
             var fileId = Newfile.save();
          log.debug('fileId',fileId);
		  var obj={};
		  obj.file = fileId;
            context.response.write(JSON.stringify(obj));
			}catch(e)
			{
				log.debug('error',e.toString());
			}
           

        } else {}

    }

    return {
        onRequest
    }
});