/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */

define(['N/error', 'N/task', 'N/render', 'N/file', 'N/encode', 'N/record', 'N/search', 'N/ui', 'N/ui/serverWidget', 'N/log', 'N/format', 'N/runtime', 'N/redirect', 'N/url', 'N/https', 'N/xml'],

  function (error, task, render, file, encode, record, search, ui, serverWidget, log, format, runtime, redirect, url, https, xml) {

    function onRequest(context) {

      if (context.request.method == "GET") {


        var UserObj = runtime.getCurrentUser();
        var UserEmail = UserObj.email;
        var UserSubsidiary = UserObj.subsidiary;
        var UserLocation = UserObj.location;
        var RecordId = context.request.parameters.a_recid;
       
        var CurrentDate= new Date();
        var CurrDate= CurrentDate.getDate()+1;    
        var CurrentMonth= CurrentDate.getMonth()+1;
        var CurrentYear= CurrentDate.getFullYear();
        
   
        
        

        var form = serverWidget.createForm({ title: "DOT INSPECTION" });

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
if(RecordId){
   var customrecord_advs_vmSearchObj = search.create({
          type: "customrecord_advs_vm",
          filters:
            [
              ["isinactive", "is", "F"],
              "AND",
              ["internalid", "anyof", RecordId]
            ],
          columns:
            [
              search.createColumn({ name: "custrecord_advs_vm_customer_number", label: "Owner" }),
              search.createColumn({ name: "custrecord_advs_vm_vehicle_brand", label: "Brand" }),
              search.createColumn({
                name: "name",
                sort: search.Sort.ASC,
                label: "Name"
              }),
              search.createColumn({ name: "custrecord_advs_vm_master_type", label: "Type (Truck/Trailer)" }),
              search.createColumn({
                name: "formulatext",
                formula: "TO_CHAR({today},'Mm')",
                label: "Formula (Text)"
              }),
              search.createColumn({ name: "custrecord_advs_st_sales_ord_date", label: "Sales Order Date" }),
              search.createColumn({
                name: "formulatext",
                formula: "	TO_CHAR({today},'YYYY')",
                label: "Formula (Text)"
              }),
              search.createColumn({
                name: "altname",
                join: "CUSTRECORD_ADVS_VM_CUSTOMER_NUMBER",
                label: "Name"
              }),
              search.createColumn({
                name: "address1",
                join: "CUSTRECORD_ADVS_VM_CUSTOMER_NUMBER",
                label: "Address 1"
              }),
              search.createColumn({
                name: "address2",
                join: "CUSTRECORD_ADVS_VM_CUSTOMER_NUMBER",
                label: "Address 2"
              }),
              search.createColumn({
                name: "address3",
                join: "CUSTRECORD_ADVS_VM_CUSTOMER_NUMBER",
                label: "Address 3"
              }),
              search.createColumn({
                name: "city",
                join: "CUSTRECORD_ADVS_VM_CUSTOMER_NUMBER",
                label: "City"
              }),
              search.createColumn({
                name: "country",
                join: "CUSTRECORD_ADVS_VM_CUSTOMER_NUMBER",
                label: "Country"
              }),
              search.createColumn({
                name: "zipcode",
                join: "CUSTRECORD_ADVS_VM_CUSTOMER_NUMBER",
                label: "Zip Code"
              }),
              search.createColumn({
                name: "state",
                join: "CUSTRECORD_ADVS_VM_CUSTOMER_NUMBER",
                label: "State/Province"
              })
            ]
        });
        var CompanyName = "", VehicleMake = "", VehicleIdentification = "", VehicleType = "", Month = "", Year = "", AltName="", Address="",  City="", Country="" , ZipCode="", State="";
        customrecord_advs_vmSearchObj.run().each(function (result) {
          CompanyName = result.getText({ name: "custrecord_advs_vm_customer_number" });
          VehicleMake = result.getText({ name: "custrecord_advs_vm_vehicle_brand" });
          VehicleIdentification = result.getValue({ name: "name" });
          VehicleType = result.getValue({ name: "custrecord_advs_vm_master_type" });
          Month = result.getValue({
            name: "formulatext",
            formula: "TO_CHAR({today}, 'MM')"
          });
          Year = result.getValue({
            name: "formulatext",
            formula: "TO_CHAR({today}, 'YYYY')"
          });
          AltName = result.getValue({
            name: "altname",
            join: "CUSTRECORD_ADVS_VM_CUSTOMER_NUMBER"
          });
          Address = result.getValue({
            name: "address1",
            join: "CUSTRECORD_ADVS_VM_CUSTOMER_NUMBER"
          });
         City= result.getValue({
            name: "city",
            join: "CUSTRECORD_ADVS_VM_CUSTOMER_NUMBER"
          });
          Country = result.getValue({
            name: "country",
            join: "CUSTRECORD_ADVS_VM_CUSTOMER_NUMBER"
          });
          ZipCode = result.getValue({
            name: "zipcode",
            join: "CUSTRECORD_ADVS_VM_CUSTOMER_NUMBER"
          });
          State = result.getValue({
            name: "state",
            join: "CUSTRECORD_ADVS_VM_CUSTOMER_NUMBER"
          });

          return true;
        });  
           if(VehicleIdentification.length>7){
          var VINNumber = VehicleIdentification.slice(-7);           
             
           }else{
              var VINNumber = VehicleIdentification;
            
           }
          }
       

        htmlHeader += "<table align='right'  font-size='14px' >" +
          "<tr>" +
          "<td  align='center' border='1'   border-top='0' width='50mm' padding-bottom='5px'><table><tr><td>Date:</td></tr><tr><td> "+CurrDate+" / "+CurrentMonth+" / "+CurrentYear+"</td></tr></table></td>" +
          "</tr>" +
          " <tr><td >D9591295</td></tr>" +
          "</table>" +
          "<table align='center' padding-top='-50px' font-size='14px'>" +
          "<tr>" +
          " <td ><b>RECORD OF ANNUAL INSPECTION</b></td>" +
          "</tr>" +
          " <tr><td align='center' >(49 CFR 396. 17-23 )</td></tr>" +
          " <tr><td font-size='11px'><i>Prepare Separate Report For Each Vehicle Inspected</i></td></tr>" +

          "</table>";



        var check = "";
        if (VehicleType == 2 || VehicleType == "2" || VehicleType == "Trailer") {
          check = "checked";
        }


        Html += "<div style = 'margin-left:30px;'>" +
          "<table align='center' width='100%' border='1px' >" +
          "<tr style='font-size:9px;'  >" +
          "<td ><table><tr><td   width='45%' style= 'padding: 2px;'><b>COMPANY NAME</b></td></tr><tr><td   width='45%' style= 'padding: 2px;'><b>"+AltName+"</b></td></tr></table></td><td border='.5px' width='55%'  style= 'padding: 2px;'><table><tr><td><b>Vehicle Type</b></td></tr><tr><td><input type='checkbox' id='Truck' name = 'Truck' value='Truck' />TRUCK</td><td padding-left='30px'><input type='checkbox' id='Tractor' name = 'Tractor' value='Tractor'/>TRACTOR</td><td padding-left='30px'><input type='checkbox' id='Trailer' name = 'Trailer' checked='" + check + "'/>TRAILER</td><td padding-left='30px'><input type='checkbox' id='CONVERTER' name = 'CONVERTER' value='CONVERTER'/>CONVERTER DOLLY</td></tr></table></td>" +
          "</tr>";




        Html += "<tr style='font-size:9px;' >" +
          "<td border='.5px' width='45%'  style= 'padding: 5px;'><table><tr><td><b>STREET ADDRESS</b></td></tr><tr><td>"+Address+"</td></tr></table></td><td border='.5px' width='55%'  style= 'padding: 5px;'><table><tr><td><b>VEHICLE MAKE</b>&nbsp;&nbsp;</td></tr><tr><td><b>"+VehicleMake+"</b>&nbsp;&nbsp;</td></tr></table></td>" +
          "</tr> " +
          "<tr style='font-size:9px;' >" +
          "<td  width='45%'  style= 'padding: 5px; '><b>CITY</b>  &nbsp;&nbsp; &nbsp;&nbsp; &nbsp; <b>STATE</b>  &nbsp;&nbsp; &nbsp;&nbsp; &nbsp; <b>ZIP</b></td><td border='.25px'  width='55%'  style= 'padding: 5px;  border-bottom: 0;'><b>VEHICLE IDENTIFICATION(Company No., Street Tag No. or VIN)</b></td>" +
          "</tr>" +
          "<tr style='font-size:9px;' >" +
          "<td width='45%'  style= 'padding: 5px; '> "+City+" &nbsp;&nbsp; &nbsp;&nbsp; &nbsp; "+State+"  &nbsp;&nbsp; &nbsp;&nbsp; &nbsp; "+ZipCode+"</td><td border='.25px' width='55%'  style= 'padding: 5px; border-top:0;'>" + VehicleIdentification + "</td>" +
          "</tr>" +

          "</table>" +
          "</div>";


        Html += "<div style = 'margin-left:30px;'>" +
          "<table align='center' width='100%' border='.25px' style='border-top-right-radius: 1em 3em;'>" +
          "<tr style='font-size:9px; '>" +
          "<td border='.25px' width='70%'  style= 'padding: 5px;'><b>INSPECTOR'S NAME</b><i>(Please Print)</i></td><td border='.25px' width='30%'  style= 'padding: 5px;'><b>EMPLOYEE NO.</b></td>" +
          "</tr>" +
          "</table>" +
          "</div>";


        Html += "" +
          // "<div style = 'margin-left:30px ;  white-space: nowrap'>" +
          "<table align='left' width='100%'  style = 'margin-left:30px ;  white-space: nowrap' >" +
          "<tr style='font-size: 11px'>" +
          "<td ><b>REPORT OF CONDITION &nbsp;&nbsp; &nbsp;&nbsp;<i> (For Detailed Information on Inspection Procedures see FMCSR Part 396, Appendix A)</i></b></td>" +
          "</tr>" +
          "</table>";
        //   "</div>";



        Html += "<div style = 'margin-left:30px;'>" +
          "<table style='font-size:9px' align='center' width='100%' border='.5' margin-top='5px' margin-bottom='5px'>" +
          "<tr>" +
          "<th style=' font-size:9px'   border='.25'></th>" +
          "<th style='font-size:9px'    border='.25'><b>OK</b></th>" +
          "<th style=' font-size:9px'  border='.25'><b>REPAIR</b></th>" +
          "<th style=' font-size:9px'   border='.25'></th>" +
          "<th style='font-size:9px'    border='.25'><b>OK</b></th>" +
          "<th style=' font-size:9px'   border='.25'><b>REPAIR</b></th>" +
          "<th style=' font-size:9px'  border='.25'></th>" +
          "<th style='font-size:9px'      border='.25'><b>OK</b></th>" +
          "<th style=' font-size:9px'   border='.25'><b>REPAIR</b></th>" +
          "<th style=' font-size:9px'   border='.25'></th>" +
          "<th style='font-size:9px'      border='.25'><b>OK</b></th>" +
          "<th style=' font-size:9px'  border='.25'><b>REPAIR</b></th>" +
          "</tr >" +
          "<tr style='background-color:#D6DCD4;' >" +

          "<th style=' font-size:9px'   border='.25' ><b>BRAKES</b></th>" +
          "<th style=' font-size:9px'   border='.25'></th>" +
          "<th style=' font-size:9px'   border='.25'></th>" +
          "<th style=' font-size:9px'  border='.25'><b>EXHAUST</b></th>" +
          "<th style=' font-size:9px'    border='.25'></th>" +
          "<th style=' font-size:9px'   border='.25'></th>" +
          "<th style=' font-size:9px'  border='.25'><b>STEERING</b></th>" +
          "<th style=' font-size:9px'   border='.25'></th>" +
          "<th style=' font-size:9px'  border='.25'></th>" +
          "<th style=' font-size:9px'  border='.25'><b>FRAME</b></th>" +
          "<th style=' font-size:9px'   border='.25'></th>" +
          "<th style=' font-size:9px'  border='.25'></th>" +
          "</tr>" +
          "<tr >" +
          "<td   border='.25'   white-space='nowrap'> Adjustment </td><td border='.25'  width='5%' ></td><td border='.25'></td><td border='.25'>Leaks</td><td border='.25'  width='5%'></td><td border='.25'></td><td border='.25'>Adjustments</td><td border='.25'  width='5%' ></td><td border='.25'></td><td border='.25'>Members</td><td border='.25'  width='5%'></td><td border='.25'></td>" +
          "</tr>" +
          "<tr >" +
          "<td   border='.25'  white-space='nowrap'>Mechan. Compon.</td><td border='.25'></td><td border='.25'></td><td border='.25'>Placement</td><td border='.25'></td><td border='.25'></td><td border='.25'>Column/Gear</td><td border='.25'  width='5%'></td><td border='.25'></td><td border='.25'>Clearance</td><td border='.25'  width='5%'></td><td border='.25'></td>" +
          "</tr>" +
          "<tr >" +
          "<td   border='.25'  white-space='nowrap'>Drum/ Rotor </td><td border='.25'></td><td border='.25'></td><td border='.25' style='background-color:#D6DCD4;'><b>LIGHTING</b></td><td border='.25'  width='5%'></td><td border='.25'></td><td border='.25'></td><td border='.25'></td><td border='.25'></td><td border='.25' white-space='nowrap'>Rear Impact Guard</td><td border='.25' white-space='nowrap'></td><td border='.25'></td>" +
          "</tr>" +
          "<tr >" +
          "<td   border='.25'   white-space='nowrap'>Hose/Tubing</td><td border='.25'></td><td border='.25'></td><td border='.25'>Headlight</td><td border='.25'></td><td border='.25'></td><td border='.25' white-space='nowrap'>Linkage</td><td border='.25'></td><td border='.25' white-space='nowrap'></td><td border='.25' style='background-color:#D6DCD4;'><b>TIRES</b></td><td border='.25'></td><td border='.25'></td>" +
          "</tr>" +
          "<tr >" +
          "<td   border='.25'  white-space='nowrap'>Lining</td><td></td><td border='.25'></td><td border='.25'>Tail/Stop</td><td border='.25'></td><td border='.25'></td><td border='.25' white-space='nowrap'>Power Steering</td><td border='.25'></td><td border='.25' white-space='nowrap'></td><td border='.25'>Tread</td><td border='.25'></td><td border='.25'></td>" +
          "</tr>" +
          "<tr >" +
          "<td   border='.25'   white-space='nowrap'>Antilock System</td><td border='.25'></td><td border='.25'></td><td border='.25'>Clearance/ Marker</td><td border='.25'></td><td border='.25'></td><td border='.25' white-space='nowrap'>Other</td><td border='.25'></td><td border='.25'></td><td border='.25' white-space='nowrap'>Inflation</td><td border='.25'></td><td border='.25'></td>" +
          "</tr>" +
          "<tr >" +
          "<td   border='.25'  white-space='nowrap'>Automatic Adjusters</td><td border='.25'></td><td border='.25'></td><td border='.25'>Identification</td><td border='.25'></td><td border='.25'></td><td border='.25' white-space='nowrap' style='background-color:#D6DCD4;'><b>FUEL SYSTEM</b></td><td border='.25'></td><td border='.25' white-space='nowrap'></td><td border='.25'>Damage</td><td border='.25'></td><td border='.25'></td>" +
          "</tr>" +
          "<tr >" +
          "<td   border='.25'  white-space='nowrap'>Low Air Warning</td><td border='.25'></td><td border='.25'></td><td border='.25'>Reflectors</td><td border='.25'></td><td border='.25'></td><td border='.25' white-space='nowrap'>Tank(s)/Cap(s)</td><td border='.25' white-space='nowrap'></td><td border='.25'></td><td border='.25'>Speed Restrictions</td><td border='.25'></td><td border='.25'></td>" +
          "</tr>" +
          "<tr >" +
          "<td   border='.25'  white-space='nowrap'>Trailer Air Supply</td><td border='.25'></td><td border='.25'></td><td border='.25'>Other</td><td border='.25'></td><td border='.25'></td><td border='.25'  white-space='nowrap'> Lines</td><td border='.25' white-space='nowrap'></td><td border='.25'></td><td border='.25'>Other</td><td border='.25'></td><td border='.25'></td>" +
          "</tr>" +
          "<tr >" +
          "<td   border='.25'  white-space='nowrap'>Compressor</td><td border='.25'></td><td border='.25'></td><td border='.25'></td><td border='.25'></td><td border='.25'></td><td border='.25'  white-space='nowrap'></td><td border='.25' white-space='nowrap'></td><td border='.25'></td><td border='.25'></td><td border='.25'></td><td border='.25'></td>" +
          "</tr>" +
          "<tr >" +
          "<td   border='.25' white-space='nowrap'>Parking Brakes</td><td border='.25'></td><td border='.25'></td><td border='.25'  style='background-color:#D6DCD4;'><b>CAB/BODY</b></td><td border='.25'></td><td border='.25'></td><td border='.25' style='background-color:#D6DCD4;'><b>SUSPENSION</b></td><td border='.25'></td><td border='.25'></td><td border='.25' style='background-color:#D6DCD4;'><b>WHEELS/RIM</b></td><td border='.25'></td><td border='.25'></td>" +
          "</tr>" +
          "<tr >" +
          "<td  border='.25'  white-space='nowrap'>Other</td><td border='.25'></td><td border='.25'></td><td border='.25'>Access</td><td border='.25'></td><td border='.25'></td><td border='.25'>Springs</td><td border='.25'></td><td border='.25'></td><td border='.25'>Fastners</td><td border='.25'></td><td border='.25'></td>" +
          "</tr>" +
          "<tr >" +
          "<td  border='.25'  white-space='nowrap'></td><td border='.25'></td><td border='.25'></td><td border='.25' white-space='nowrap'>Eqpt./Load Secure</td><td border='.25'></td><td border='.25'></td><td border='.25'>Attachments</td><td border='.25'></td><td border='.25'></td><td border='.25'>Disc/Spoke</td><td border='.25'></td><td border='.25'></td>" +
          "</tr>" +
          "<tr >" +
          "<td style=' background-color:#D6DCD4;'  border='.25'  white-space='nowrap'  ><b>COUPLERS</b></td><td border='.25'></td><td border='.25'></td><td border='.25' white-space='nowrap'  >Tie-Downs</td><td border='.25'></td><td border='.25'></td><td border='.25'>Sliders</td><td border='.25'></td><td border='.25'></td><td border='.25'></td><td border='.25'></td><td border='.25'></td>" +
          "</tr>" +
          "<tr >" +
          "<td   border='.25'  white-space='nowrap'>Fifth- Wheel &amp; Mount</td><td border='.25'></td><td border='.25'></td><td border='.25' white-space='nowrap'>HeaderBoard</td><td border='.25'></td><td border='.25'></td><td border='.25'></td><td border='.25' white-space='nowrap'></td><td border='.25'></td><td border='.25' style='background-color:#D6DCD4;' ><b>WINDSHIELD</b></td><td border='.25'></td><td border='.25'></td>" +
          "</tr>" +


          "<tr>" +
          "<td   border='.25'  white-space='nowrap'>Pin/Upper Plate</td><td border='.25'></td><td border='.25'></td><td border='.25' white-space='nowrap'>Motorcoach Seats</td><td border='.25'></td><td border='.25'></td><td border='.25' style='background-color:#D6DCD4;'><b>MIRRORS</b></td><td border='.25' white-space='nowrap'></td><td border='.25'></td><td border='.25'>Glass</td><td border='.25'></td><td border='.25'></td>" +
          "</tr>" +

          "<tr>" +
          "<td   border='.25'  white-space='nowrap'>Pintle-Hook/Eye</td><td border='.25'></td><td border='.25'></td><td border='.25' white-space='nowrap'>Other</td><td border='.25'></td><td border='.25'></td><td border='.25'></td><td border='.25' white-space='nowrap'></td><td border='.25'></td><td border='.25'>Wipers</td><td border='.25'></td><td border='.25'></td>" +
          "</tr>" +

          "<tr>" +
          "<td   border='.25'  white-space='nowrap'>Safety-chain(s)</td><td border='.25'></td><td border='.25'></td><td border='.25' white-space='nowrap'></td><td border='.25'></td><td border='.25'></td><td border='.25'></td><td border='.25' white-space='nowrap'></td><td border='.25'></td><td border='.25'></td><td border='.25'></td><td border='.25'></td>" +
          "</tr>" +

          "</table>" +
          "</div>";


        Html += "" +
          // "<div style = 'margin-left:30px;'>" +
          "<table style='font-size:11px; margin-left:30px; ' >" +
          "<tr >" +
          "<td>Remarks______________________________________________________________________________________________________________________________________________________________________________________________________________</td>" +
          "</tr>" +
          "<tr >" +
          "<td white-space='nowrap' align='center' >Certification: This Vehicle has passed all the inspection items for the annual vehicle inspection in accordance with 49 CFR Part 396.</td>" +
          "</tr>" +
          "<tr >" +
          "<td align='center'>Qualified Inspector's Signature_________________________________ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Date_______________</td>" +
          "</tr>" +
          "</table>";
        // "</div >"   ;

        Html += "" +
          // "<div >" +
          "<table width='100%' style = 'margin-left:30px; font-size:11px'>" +
          "<tr>" +
          "<td  >" +
          "<table   align='left'  >" +
          "<tr>" +
          "<td ><b>APPLY LABEL TO A CLEAN, DRY SURFACE. USE WITH AN OVERLAMINATE(2402) TO IMPROVE DURABILITY UNDER NORMAL WEATHER CONDITION.</b></td>" +

          "</tr >" +
          "<tr >" +
          "<td>AN INDELIBLE INK MARKER IS RECOMMENDED FOR USE WHEN FILLING OUT THE LABEL. INDELIBLE INK IS PERMANENT AND WILL NOT WASH OFF, BUT MAY FADE DUE TO EXPOSURE TO ULTRAVIOLENT LIGHT OVER TIME." +

          "CAREFUL DISCRETION IS ADVISED REGARDING APPLICATION OF LABEL TO AN AREA NOT EXPOSED TO EXCESSIVE ULTRAVIOLENT LIGHT AND/OR ELEMENTS AND IT IS RECOMMENDED THAT THE READABILITY OF THE LABEL BE CHECKED PERIODICALLY.</td>" +
          "</tr>" +
          "<tr >" +
          "<td><table width='45%' align='center' font-size='6px'><tr><td >COPYRIGHT 2021. J.J. KELLER &amp; ASSOCIATES, INC. NEENAH, WI &#9830; JJKELLER.COM &#9830; (800) 327-6868 PRINTED IN THE USA</td></tr></table></td>" +
          "</tr>" +
          "<tr >" +
          "<td font-size= '9px'><b>3136</b></td>" +
          "</tr>" +
          "<tr>" +
          "<td font-size= '9px'><b>Rev. (11/21)</b></td>" +
          "</tr>" +

          "</table>" +
          "</td><td   width= '80%' font-size='12px' >" +
          "<table style='border:2px solid;  margin-left:30px; align:right; font-size:13px;'>" +
          "<tr background-color='black'  color='white'  white-space='nowrap'  ><td align='center' font-size='20px'><b>FEDERAL ANNUAL INSPECTION</b></td></tr>" +
          "<tr><td > This Vehicle has passed an annual inspection conducted in accordance with 49 CFR, PART 396, FMCSR</td>" +
          "</tr >" +
          // "<tr>" +
          // "<td  ><table  align='left'><tr ><td border='.25'>Month</td><td border='.25'>Year</td><td margin-left='20px'>D9591295</td></tr></table></td>" +
          // "</tr>" +

          "<tr  >" +
          "<td><table  align='left'><tr ><td border='.25'>Month &nbsp;"+CurrentMonth+"</td><td border='.25' >Year &nbsp;"+CurrentYear+"</td><td></td><td>D9591295</td></tr></table></td>" +
          "</tr>" +
          "<tr  >" +
          "<td><table border='1'  ><tr ><td border='.25'>Vehicle ID(Company No.) &nbsp; ________</td><td border='.25' ><table><tr><td>STATE/ TAG NO. or VIN &nbsp;</td></tr><tr><td>"+VINNumber+"</td></tr></table></td></tr></table></td>" +
          "</tr>" +
          "<tr>" +
          "<td>LOCATION OF RECORDS:  &nbsp; ________</td>" +
          "</tr>" +
          "<tr>" +
          "<td>COMPANY:</td>" +
          "</tr>" +
          "<tr >" +
          "<td >STREET ADDRESS:  &nbsp; "+Address+"</td>" +
          "</tr>" +
          "<tr  >" +
          "<td >CITY, STATE, ZIP:  &nbsp; "+City+" "+State+" "+ZipCode+"</td>" +
          "</tr>" +
          "</table></td>" +
          "</tr></table>";
        // "</div>";










        HTMLObj.defaultValue = Html;


        var xmlStr = "<?xml version=\"1.0\"?>\n<!DOCTYPE html PUBLIC \"-//big.faceless.org//report\" \"report-1.1.dtd\">\n";
        xmlStr += "<pdf>";
        xmlStr += "<head>";
        xmlStr += "<meta name='title' value='DescriptivePDF'/>";
        xmlStr += "<meta charset='utf-8' />";
        xmlStr += "<macrolist>" +
          "<macro id='myheader'>";
        // xml += '<table align="center" width="100%" style="display:none;" > <tr> <td align="center">' + htmlHeader + '</td> </tr></table>';
        xmlStr += htmlHeader;
        xmlStr += "</macro>";
        xmlStr += '<macro id="myfooter">';

        // xmlStr+='<table align="center" width="100%"  > <tr> <td align="center">'+htmlFooter+'</td> </tr></table>';
        xmlStr += htmlFooter;
        xmlStr += "</macro>";
        xmlStr += "</macrolist>"
        xmlStr += "</head>";
        xmlStr += "<body size='A4' class='text' header='myheader' header-height='2.5cm' footer='myfooter' footer-height='1cm'  style='margin-top:-10mm; margin-right:-5mm; margin-left:-10mm; margin-bottom:-10mm;'>";

        xmlStr += Html;


        xmlStr += "</body>";


        xmlStr += "</pdf>";

       

        var Renderer = render.create();
        Renderer.templateContent = xmlStr;

        var Newfile = Renderer.renderAsPdf();
        Newfile.name = "PDF_TITLE.PDF";

        context.response.writeFile(Newfile, true);

      } else {



      }

    }

    return { onRequest }
  });




