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


                htmlHeader +=    "<table align='center'  font-size='13px'>" +
                    "<tr>" +             
                    " <td ><b>ANNUAL VEHICLE INSPECTION REPORT</b></td>" +
                    "</tr>" +                
                    "</table>";
              
               htmlHeader +=    "<table align='left'  font-size='10px' style='margin-left:30px;' >" +
                    "<tr>" +             
                    " <td ><b>LRM LEASING CO. INC.</b></td>" +
                    "</tr>" + 
                    "<tr>" +             
                    " <td ><b>2160 BLOUNT RD.</b></td>" +
                    "</tr>" + 
                   "<tr>" +             
                    " <td ><b>POMPANO BEACH, FL 33069</b></td>" +
                    "</tr>" + 
                    "</table>";
              
               htmlHeader +=    "<table align='right'   font-size='10px' padding-top='-50px' >" +
                    "<tr  width='100%' background-color= 'black' color='white'>" +             
                    " <td><b>VEHICLE HISTORY RECORD</b></td>" +
                    "</tr>" +                    
                  "<tr width='100%'>" +             
                    " <td  border='.25'  ><b>REPORT NUMBER</b></td><td  border='.25'><b>FLEET UNIT NUMBER</b></td>" +
                    "</tr>" + 
                  "<tr width='100%' height='16px' >" +             
                    " <td border='.15'  >   </td> <td border='.15'>    </td>" +
                    "</tr>" +             
                 
                    "</table>"+
               "<table align='right' border='.25'  font-size='10px'  padding-left='258px'>" +            

                "<tr  height='14px' width='100%' border='1' border-top='0'>" +             
                    " <td padding-left='-250px' >DATE</td> " +
                    "</tr>" + 
                   "</table>";

               Html += "<table width='100%' style = 'margin-left:30px; font-size:6px'  border='.25'>" +
                    "<tr >" +
                    "<td   border='.25'   > MOTOR CARRIER OPERATOR</td><td  border='.25'  > INSPECTOR'S NAME(PRINT OR TYPE)</td>" +
                    "</tr>" +
                  "<tr white-space='nowrap' >" +
                    "<td   border='.25'   > ADDRESS</td><td border='.25'><table><tr><td>THIS INSPECTOR MEETS THE QUALIFICATION REQUIREMENTS IN SECTION 396.19.</td></tr><tr><td><input type='checkbox' id='YES' name = 'YES' value='YES'></input>YES</td></tr></table></td>" +
                    "</tr>" +
                   "<tr  white-space='nowrap' >" +
                  "<td border='.25'  >CITY, STATE, ZIP CODE: </td><td border='.25'  white-space='nowrap' ><table><tr white-space='nowrap'><td white-space='nowrap'>VEHICLE IDENTIFICATION (&#10003; AND COMPLETE) </td><td><input type='checkbox' id='LIC' name = 'LIC' value='LIC'></input>LIC PLATE NO. &nbsp; &nbsp;</td><td><input type='checkbox' id='VIN' name = 'VIN' value='VIN'></input>VIN &nbsp; &nbsp; &nbsp;</td><td> <input type='checkbox' id='OTHER' name = 'OTHER' value='OTHER'></input>OTHER &nbsp; &nbsp;</td></tr></table></td>"+
                     "</tr>" +
                  "<tr  white-space='nowrap' >" +
                     "</tr>" +
                 "<tr  border='.25'  >" +
                "<td  border='.25'><table font-size='6px'><tr  ><td  >VEHICLE TYPE</td><td><input type='checkbox' id='Tractor' name = 'Tractor' value='Tractor'></input></td><td>TRACTOR  &nbsp;</td><td> <input type='checkbox' id='Trailer' name = 'Trailer' value='Trailer'></input></td><td>TRAILER   &nbsp;</td><td>  <input type='checkbox' id='Truck' name = 'Truck' value='Truck'></input></td><td>TRUCK  &nbsp; </td><td> <input type='checkbox' id='BUS' name = 'BUS' value='BUS'></input></td><td>BUS  &nbsp; </td> <td><input type='checkbox' id='OTHER' name = 'OTHER' value='OTHER'></input></td><td>OTHER </td></tr></table></td><td border='.25'   white-space='nowrap'>INSPECTION AGENCY/LOCATION(OPTIONAL)</td>"+
                   "</tr>" +
                 "</table>";

              
             //  Html += "<br></br>";
              
               Html +=  "<table style='border:2px solid;  margin-left:30px; margin-top:11px;  font-size:11px; width:100%;'>" +             
                    "<tr background-color='black'  color='white'  white-space='nowrap'  ><td align='center' ><b>VEHICLE COMPONENT INSPECTED</b></td></tr>"+
               
                  "</table>";

                  Html +=  "<table style=' border:1px; margin-left:30px;   font-size:6px; width:100%; '>" +             
             
                     "<tr height='20px'><td  align='center'  border='.25' width='20px' > OK</td><td   align='center'    border='.25'  width='30px' > NEEDS REPAIR</td><td   align='center'   border='.25'   width='30px'>  REPAIRED DATE</td><td align='center'   border='.25'  width='30px' >  ITEM</td><td width='20px' align='center'    border='.25' > OK</td><td   align='center'   width='30px'  border='.25'> NEEDS REPAIR</td><td  align='center'  width='30px'  border='.25'>  REPAIRED DATE</td><td align='center'   border='.25'  width='30px'>  ITEM</td><td width='20px'  border='.25'  align='center'   > OK</td><td  align='center'  border='.25'  width='30px'> NEEDS REPAIR</td><td   align='center'  border='.25'   width='30px'>  REPAIRED DATE</td><td align='center'   border='.25'  width='30px' >  ITEM</td>" +
                     "</tr >" +
                     "<tr font-size='8px' background-color='black'  color='white'  white-space='nowrap'  ><td width='20px'></td><td white-space='nowrap' align='center'   border='.25'></td><td  align='center'   border='.25' ></td><td font-size='8px'><b>1. BRAKE SYSTEM</b></td><td width='20px'></td><td></td><td></td> <td font-size='8px'><b>6. SAFE LOADING</b></td> <td width='20px'  border='.25'></td><td background-color='black' color='white' border='.25' ></td><td border='.25'  background-color='black' color='white' ></td> <td border='.25'  font-size='8px' background-color='black' color='white'><b>12.WINDSHIELD GLAZING</b></td>"+
                     "</tr>"+
                     "<tr font-size='8px'><td width='20px' border='.25'  ></td><td border='.25'  width='30px'> </td><td  width='30px' border='.25'>  </td><td   border-top='.25' border-right='.25' border-left='.25' border-bottom='0'  width='30px' font-size='7px' style=' border-bottom: 0;' > a. Service Brakes</td><td width='20px' border='.25'  ></td><td width='20px' border='.25'  ></td><td width='20px' border='.25'  ></td><td    border='.25'    width='30px' style=' border-bottom: 0;'>  a. Vehicle parts, load, dunnage, spare tire, etc., secured.</td><td width='20px'  border='.25' style=' border-bottom: 0; border-left: 0; border-right: 0;' > </td><td border='.25'  style=' border-bottom: 0; ' ></td><td border='.25'  style=' border-bottom: 0;' ></td><td align='center'     border='.25'  width='30px' >  No cracks, discoloration, obstacle, etc. (see 393.60 for exceptions).</td>" +
                     "</tr >" +
                     "<tr font-size='8px' ><td border='.25' width='20px' ></td><td border='.25' width='30px'> </td><td border='.25' width='30px'>  </td><td   border='.25'  width='30px' style='border-top: 0; border-bottom: 0;' > b. Parking Brake System</td><td width='20px' border='.25' ></td><td  white-space='nowrap' align='center'  border='.25'  width='30px' ></td><td   align='center'  border='.25' width='30px'> </td><td    border='.25'   width='30px' style='border-top: 0; border-bottom: 0;'>  b. Front End Structure </td><td width='20px'  > </td><td align='center'  border='.25'  border-bottom='0' width='30px'  background-color='black' color='white' ></td><td  align='center'  border='.25'  border-bottom='0' width='30px'  background-color='black' color='white' ></td><td border='.25'  width='30px' background-color='black' color='white' font-size='8px'  ><b> 13. WINDSHIELD WIPERS</b></td>" +
                     "</tr >" +
                     "<tr font-size='8px' ><td  border='.25' width='20px' ></td><td border='.25' width='30px'> </td><td  border='.25'  width='30px'>  </td><td    border='.25'  width='30px' style='border-top: 0; border-bottom: 0;' >c. Brakes Drums or Rotors</td><td width='20px' border='.25' ></td><td  white-space='nowrap' align='center'  border='.25'  width='30px'></td><td   align='center' border='.25'  width='30px'> </td><td    border='.25'   width='30px' style='border-top: 0; border-bottom: 0;'>   c. Intermodal Container Securement Devices</td><td width='20px'  > </td><td  align='center'   border='.25'  border-bottom='0' width='30px'></td><td  align='center'    width='30px' style='border-top: 0; border-bottom: 0;'></td><td align='center'      border='.25'  width='30px' >  No missing, damaged, or inoperable wipers.</td>" +
                     "</tr >" +
                     "<tr font-size='8px' ><td  border='.25' width='20px' ></td><td border='.25' width='30px'> </td><td  border='.25' width='30px'>  </td><td   border='.25'  width='30px' style='border-top: 0; border-bottom: 0;' > d. Brake house</td><td width='20px' border='.25' ></td><td   align='center'  border='.25'  width='30px' ></td><td  align='center'  border='.25' width='30px'> </td><td    border='.25'   width='30px'  style='border-top: 0; border-bottom: 0;'></td><td width='20px' border='.25' style='border-top: 0; border-bottom: 0; border-left:0;' > </td><td  border='.25'  align='center'   width='30px' background-color='black' color='white' ></td><td  border='.25'  align='center'   width='30px' background-color='black' color='white' ></td><td   border='.25'  width='30px' background-color='black' color='white' font-size='8px' > <b>14. MOTORCOACH SEATS</b> </td>" +
                     "</tr >" +
                     "<tr font-size='8px' ><td border='.25' width='20px' ></td><td border='.25' width='30px'> </td><td  border='.25' width='30px'>  </td><td  border='.25'  width='30px' style='border-top: 0; border-bottom: 0;' >e. Brake Tubing</td><td width='20px' border='.25' ></td><td  white-space='nowrap' align='center'  border='.25'  width='30px' ></td><td   align='center'  border='.25' width='30px'> </td><td align='center'    border='.25'   width='30px' style='border-top: 0; border-bottom: 0;'>  </td><td width='20px' style='border-top: 0; border-bottom: 0;'  > </td><td   align='center'  border='.25' border-bottom='0'  width='30px' style='border-top: 0; border-bottom: 0;' ></td><td  white-space='nowrap' align='center'   width='30px'></td><td align='center'     border='.25'  width='30px' > Seats securely fastened to the vehicle structure.</td>" +
                     "</tr >" +
                     "<tr font-size='8px' ><td border='.25' width='20px' ></td><td border='.25' width='30px'> </td><td border='.25'  width='30px'>  </td><td    border='.25'  width='30px' style='border-top: 0; border-bottom: 0;' > f. Low Pressure Warning Device</td><td width='20px' border='.25' ></td><td  white-space='nowrap' align='center'  border='.25'  width='30px'></td><td   align='center'  border='.25' width='30px'> </td><td   border='.25'   width='30px' background-color='black' color='white' font-size='8px' white-space='nowrap'> <b>7. STEERING MECHANISM </b>  </td><td width='20px'  >  </td><td  align='center'   width='30px' background-color='black' color='white' font-size='8px' ></td><td  align='center'   width='30px' background-color='black' color='white' font-size='8px' ></td><td   border='.25'  width='30px' background-color='black' color='white' font-size='8px' > <b>15. REAR IMPACT GUARD</b> </td>" +
                     "</tr >" +                  
                     "<tr font-size='8px'  ><td border='.25' width='20px' ></td><td border='.25' width='30px'> </td><td  border='.25'  width='30px'>  </td><td   border='.25'  width='30px' style='border-top: 0; border-bottom: 0;'> g. Tractor Protection Value</td><td width='20px' border='.25' ></td><td  white-space='nowrap' align='center'  border='.25'  width='30px'></td><td  white-space='nowrap' align='center'  border='.25' width='30px'> </td><td align='center'   border='.25'    width='30px' style='border-bottom: 0;' > a. Steering Wheel Free Play </td><td width='20px'  > </td><td  white-space='nowrap' align='center'  border='.25'  width='30px' style='border-top: 0; border-bottom: 0;'> </td><td  white-space='nowrap' align='center'    width='30px' style='border-top: 0; border-bottom: 0;'></td><td align='center'      border='.25'  width='30px' >  In place , securely attached, proper size, proper placement(see 393.86).</td>" +
                     "</tr >" +
                     "<tr font-size='8px'><td border='.25' width='20px' ></td><td border='.25' width='30px'> </td><td border='.25'  width='30px'>  </td><td    border='.25'  width='30px' style='border-top: 0; border-bottom: 0;' > h. Air Compressor </td><td width='20px' border='.25' ></td><td  white-space='nowrap' align='center'  border='.25'  width='30px'></td><td  white-space='nowrap' align='center'  border='.25' width='30px'> </td><td  border='.25' style='border-top: 0; border-bottom: 0;'     width='30px' >  b. Steering Column</td><td width='20px'  > </td><td  border='.25'  align='center'   width='30px' background-color='black' color='white' ></td><td border='.25'  align='center'   width='30px' background-color='black' color='white'></td><td     border='.25'  width='30px' background-color='black' color='white' font-size='8px' > <b>16. OTHER </b> </td>" +
                     "</tr >" +
                     "<tr font-size='8px'><td border='.25' width='20px' ></td><td border='.25' width='30px'> </td><td  border='.25'  width='30px'>  </td><td   border='.25'  width='30px'  style='border-top: 0; border-bottom: 0;'> i. Electric Brakes</td><td width='20px' border='.25' ></td><td  white-space='nowrap' align='center'  border='.25'  width='30px'></td><td  white-space='nowrap' align='center'  border='.25' width='30px'> </td><td  border='.25'   width='30px' style='border-top: 0; border-bottom: 0;'>  c. Front Axle Beam/ All Other Steering Components</td><td width='20px'  > </td><td  white-space='nowrap' align='center'  border='.25'  width='30px' style='border-top: 0; border-bottom: 0;'></td><td  white-space='nowrap' align='center'    width='30px'></td><td align='center'      border='.25'  width='30px' >  List any other condition(s) which may prevent safe operation of this vehicle.</td>" +
                     "</tr >" + 
                    "<tr font-size='8px'><td border='.25' width='20px' ></td><td border='.25' width='30px'> </td><td border='.25'  width='30px'>  </td><td    border='.25'  width='30px' style='border-top: 0; border-bottom: 0;' >j. Hydraulic Brakes </td><td width='20px' border='.25' ></td><td  white-space='nowrap' align='center'  border='.25'  width='30px' ></td><td  white-space='nowrap' align='center'  border='.25' width='30px'> </td><td  border='.25' white-space='nowrap'  width='30px' style='border-top: 0; border-bottom: 0;'>  d. Steering Gear Box</td><td width='20px'  > </td><td  white-space='nowrap' align='center'  border='.25'  width='30px' style='border-top: 0; border-bottom: 0;'></td><td  white-space='nowrap' align='center'   width='30px'></td><td align='center'     border='.25'  width='30px'  ></td>" +
                     "</tr >" +
                     "<tr font-size='8px' ><td border='.25' width='20px' ></td><td border='.25' width='30px'> </td><td  border='.25'  width='30px'>  </td><td   border='.25'  width='30px' style='border-top: 0; border-bottom: 0;' > k. Vaccum System</td><td width='20px' border='.25' ></td><td  white-space='nowrap' align='center'  border='.25'  width='30px' ></td><td  white-space='nowrap' align='center'  border='.25' width='30px'> </td><td   border='.25'    width='30px' style='border-top: 0; border-bottom: 0;'> e. Pitman Arm</td><td width='20px'  > </td><td  white-space='nowrap' align='center'  border='.25'  width='30px' style='border-top: 0; border-bottom: 0;'></td><td  white-space='nowrap' align='center'    width='30px'></td><td align='center'      border='.25'  width='30px' > </td>" +
                     "</tr >" +
                      "<tr font-size='8px' ><td border='.25' width='20px' ></td><td border='.25' width='30px'> </td><td  border='.25'  width='30px'>  </td><td    border='.25'  width='30px' style='border-top: 0; border-bottom: 0;' >l. Antilock Brake System</td><td width='20px' border='.25' ></td><td  white-space='nowrap' align='center'  border='.25'  width='30px' ></td><td  white-space='nowrap' align='center'  border='.25' width='30px'> </td><td   border='.25'      width='30px' style='border-top: 0; border-bottom: 0;'> f. Power steering</td><td width='20px'  > </td><td  white-space='nowrap' align='center'  border='.25'  width='30px' style='border-top: 0; border-bottom: 0;'></td><td  white-space='nowrap' align='center'    width='30px'></td><td align='center'      border='.25'  width='30px' > </td>" +
                     "</tr >" +
                      "<tr font-size='8px'><td border='.25' width='20px' ></td><td border='.25' width='30px'> </td><td  border='.25'  width='30px'>  </td><td    border='.25'  width='30px' style='border-top: 0; border-bottom: 0;' >m. Automatic Brake Adjusters</td><td width='20px' border='.25' ></td><td  white-space='nowrap' align='center'  border='.25'  width='30px' ></td><td  white-space='nowrap' align='center'  border='.25' width='30px'> </td><td    border='.25'   width='30px' style='border-top: 0; border-bottom: 0;'> g. Ball and Socket Joints</td><td width='20px'  > </td><td  white-space='nowrap' align='center'  border='.25'  width='30px' style='border-top: 0; border-bottom: 0;'></td><td  white-space='nowrap' align='center'    width='30px'></td><td align='center'      border='.25'  width='30px' > </td>" +
                     "</tr >" +
                      "<tr font-size='8px'><td border='.25' width='20px' ></td><td border='.25' width='30px'> </td><td  border='.25'  width='30px'>  </td><td   border='.25'  width='30px' background-color='black' color='white'  font-size='8px'><b>2. COUPLING DEVICES</b></td><td width='20px' border='.25' ></td><td  white-space='nowrap' align='center'  border='.25'  width='30px'></td><td  white-space='nowrap' align='center'  border='.25' width='30px' > </td><td   border='.25'   width='30px' style='border-top: 0; border-bottom: 0;'>h. Tie Rocks and Drag Links  </td><td width='20px'  > </td><td  white-space='nowrap' align='center'  border='.25'  width='30px' style='border-top: 0; border-bottom: 0;'></td><td  align='center'    width='30px'></td><td align='center'      border='.25'  width='30px' >  </td>" +
                     "</tr >" +
                      "<tr font-size='8px'><td border='.25' width='20px' ></td><td border='.25' width='30px'> </td><td  border='.25'  width='30px'>  </td><td   border='.25'  width='30px' style=' border-bottom: 0;' >a. Fifth Wheels</td><td width='20px' border='.25' ></td><td  white-space='nowrap' align='center'  border='.25'  width='30px'></td><td  white-space='nowrap' align='center'  border='.25' width='30px'> </td><td   border='.25'   width='30px' style='border-top: 0; border-bottom: 0;'> i. Nuts</td><td width='20px'  > </td><td  white-space='nowrap' align='center'  border='.25'  width='30px' style='border-top: 0; border-bottom: 0;'></td><td  white-space='nowrap' align='center'    width='30px'></td><td align='center'      border='.25'  width='30px' >  </td>" +
                     "</tr >" +
                     "<tr font-size='8px'><td border='.25' width='20px' ></td><td border='.25' width='30px'> </td><td  border='.25'  width='30px'>  </td><td    border='.25'  width='30px' style='border-top: 0; border-bottom: 0;' >b. Pintle Hooks</td><td width='20px' border='.25' ></td><td  white-space='nowrap' align='center'  border='.25'  width='30px' ></td><td  white-space='nowrap' align='center'  border='.25' width='30px'> </td><td border='.25'   width='30px' style='border-top: 0; border-bottom: 0;'>j. Steering System</td><td width='20px'  > </td><td  white-space='nowrap' align='center'  border='.25'  width='30px' style='border-top: 0; border-bottom: 0;'></td><td  white-space='nowrap' align='center'    width='30px'></td><td align='center'      border='.25'  width='30px' > </td>" +
                     "</tr >" +
                       "<tr font-size='8px'><td border='.25' width='20px' ></td><td border='.25' width='30px'> </td><td  border='.25'  width='30px'>  </td><td    border='.25'  width='30px' style='border-top: 0; border-bottom: 0;' >c. Drawbar/Towbar Eye</td><td width='20px' border='.25' ></td><td  white-space='nowrap' align='center'  border='.25'  width='30px' ></td><td  white-space='nowrap' align='center'  border='.25' width='30px'> </td><td     border='.25'   width='30px' background-color= 'black' color='white' font-size='8px'><b>8. SUSPENSION</b></td><td width='20px'  > </td><td  white-space='nowrap' align='center'  border='.25'  width='30px' style='border-top: 0; border-bottom: 0;'></td><td  white-space='nowrap' align='center'    width='30px'></td><td align='center'      border='.25'  width='30px' >  </td>" +
                     "</tr >" +
                    "<tr font-size='8px' ><td border='.25' width='20px' ></td><td border='.25' width='30px'> </td><td  border='.25'  width='30px'>  </td><td    border='.25'  width='30px' style='border-top: 0; border-bottom: 0;' >d. Drawbar/Towbar Tongue</td><td width='20px' border='.25' ></td><td  white-space='nowrap' align='center'  border='.25'  width='30px' ></td><td  white-space='nowrap' align='center'  border='.25' width='30px'> </td><td   border='.25'   width='30px' style=' border-top: 0; border-bottom: 0;'>a. Axle Position Parts</td><td width='20px'  > </td><td  white-space='nowrap' align='center'  border='.25'  width='30px' style='border-top: 0; border-bottom: 0;'></td><td  white-space='nowrap' align='center'    width='30px'></td><td align='center'      border='.25'  width='30px' >  </td>" +
                         "</tr >" +
                    "<tr font-size='8px' ><td border='.25' width='20px' ></td><td border='.25' width='30px'> </td><td  border='.25'  width='30px'>  </td><td    border='.25'  width='30px' style='border-top: 0; border-bottom: 0;' >e. Safety Devices</td><td width='20px' border='.25' ></td><td  white-space='nowrap' align='center'  border='.25'  width='30px' ></td><td  white-space='nowrap' align='center'  border='.25' width='30px'> </td><td   border='.25'   width='30px' style='border-top: 0; border-bottom: 0;'>b. Spring Assembly</td><td width='20px'  > </td><td  white-space='nowrap' align='center'  border='.25'  width='30px' style='border-top: 0; border-bottom: 0;'></td><td  white-space='nowrap' align='center'    width='30px'></td><td align='center'      border='.25'  width='30px' >  </td>" +
                     "</tr >" + 
                    "<tr font-size='8px'><td border='.25' width='20px' ></td><td border='.25' width='30px'> </td><td  border='.25'  width='30px'>  </td><td    border='.25'  width='30px' style='border-top: 0; border-bottom: 0;' >f. Saddle-Mounts</td><td width='20px' border='.25' ></td><td  white-space='nowrap' align='center'  border='.25'  width='30px' style='border-top: 0; border-bottom: 0;'></td><td  white-space='nowrap' align='center'  border='.25' width='30px'> </td><td   border='.25'   width='30px' style='border-top: 0; border-bottom: 0;'>c. Torque, Radius, or Tracking Components</td><td width='20px'  > </td><td  white-space='nowrap' align='center'  border='.25'  width='30px' style='border-top: 0; border-bottom: 0;' ></td><td  white-space='nowrap' align='center'    width='30px' style='border-top: 0; border-bottom: 0;'></td><td align='center'      border='.25'  width='30px' > </td>" +
                     "</tr >" + 
                    "<tr font-size='8px'><td border='.25' width='20px' ></td><td border='.25' width='30px'> </td><td  border='.25'  width='30px'>  </td><td   border='.25'  width='30px' background-color='black' color='white'  font-size='8px' ><b>3. EXHAUST SYSTEM</b></td><td width='20px' border='.25' ></td><td  white-space='nowrap' align='center'  border='.25'  width='30px'></td><td  white-space='nowrap' align='center'  border='.25' width='30px'> </td><td      border='.25'   width='30px' background-color= 'black' color='white' font-size='8px'><b>9. FRAME</b></td><td width='20px'  > </td><td  white-space='nowrap' align='center'  border='.25'  width='30px' style='border-top: 0; border-bottom: 0;'></td><td  white-space='nowrap' align='center'    width='30px' style='border-top: 0; border-bottom: 0;'></td><td align='center'      border='.25'  width='30px' >  </td>" +
                     "</tr >" + 
                    "<tr font-size='8px'><td border='.25' width='20px' ></td><td border='.25' width='30px'> </td><td  border='.25'  width='30px'>  </td><td align='center'    border='.25'  width='30px' style=' border-bottom: 0;' >a. No Leaks forward of/directly below the driver/sleeper compartment.</td><td width='20px' border='.25' ></td><td  white-space='nowrap' align='center'  border='.25'  width='30px' style='border-top: 0; border-bottom: 0;'></td><td  white-space='nowrap' align='center'  border='.25' width='30px'> </td><td   border='.25'   width='30px' style=' border-bottom: 0;'>a. Frame Members</td><td width='20px'  > </td><td  white-space='nowrap' align='center'  border='.25'  width='30px' style='border-top: 0; border-bottom: 0;'></td><td  white-space='nowrap' align='center'    width='30px'></td><td align='center'      border='.25'  width='30px' >  </td>" +
                     "</tr >" + 
                    "<tr font-size='8px'><td border='.25' width='20px' ></td><td border='.25' width='30px'> </td><td  border='.25'  width='30px'>  </td><td align='center'   border='.25'  width='30px' style='border-top: 0; border-bottom: 0;' >b. Bus: No leaking/ discharging in violation of standard.</td><td width='20px' border='.25' ></td><td  white-space='nowrap' align='center'  border='.25'  width='30px'></td><td  white-space='nowrap' align='center'  border='.25' width='30px'> </td><td   border='.25'   width='30px' style='border-top: 0; border-bottom: 0;'>b. Tire and wheel Clearance</td><td width='20px'  > </td><td  white-space='nowrap' align='center'  border='.25'  width='30px' style='border-top: 0; border-bottom: 0;'></td><td  white-space='nowrap' align='center'    width='30px'></td><td align='center'      border='.25'  width='30px' > </td>" +
                     "</tr >" +
                   
                    "<tr font-size='8px'><td border='.25' width='20px' ></td><td border='.25' width='30px'> </td><td  border='.25'  width='30px'>  </td><td align='center'    border='.25'  width='30px' style='border-top: 0; border-bottom: 0;' >c. Unlikely to burn, char, or damage the electrical wiring, fuel supply, or any combustible part of vehicle.</td><td width='20px' border='.25' ></td><td  white-space='nowrap' align='center'  border='.25'  width='30px' ></td><td  white-space='nowrap'   border='.25' width='30px'> </td><td align='center'     border='.25'   width='30px' style='border-top: 0; border-bottom: 0;'>c. Adjustable Axle Assemblies(Sliding Subframes)</td><td width='20px'  > </td><td  white-space='nowrap' align='center'  border='.25'  width='30px' style='border-top: 0; border-bottom: 0;'></td><td   align='center'    width='30px'></td><td align='center'      border='.25'  width='30px' > </td>" +
                     "</tr >" +
                   
                    "<tr font-size='8px'><td border='.25' width='20px' ></td><td border='.25' width='30px'> </td><td  border='.25'  width='30px'>  </td><td   white-space='nowrap'   border='.25'  width='30px' background-color='black' color='white'  font-size='8px' ><b>4. FUEL SYSTEM</b></td><td width='20px' border='.25' ></td><td  white-space='nowrap' align='center'  border='.25'  width='30px'></td><td  white-space='nowrap' align='center'  border='.25' width='30px' style='border-top: 0; border-bottom: 0;'> </td><td     border='.25'   width='30px' background-color= 'black' color='white' font-size='8px'><b>10. TIRES</b></td><td width='20px'  > </td><td  white-space='nowrap' align='center'  border='.25'  width='30px' style='border-top: 0; border-bottom: 0;'></td><td  align='center'    width='30px'></td><td align='center'      border='.25'  width='30px' >  </td>" +
                     "</tr >" +
                       
                    "<tr font-size='8px'><td border='.25' width='20px' ></td><td border='.25' width='30px'> </td><td  border='.25'  width='30px'>  </td><td   white-space='nowrap'   border='.25'  width='30px' style=' border-bottom: 0;' >a. No visible Leak</td><td width='20px' border='.25' ></td><td  white-space='nowrap' align='center'  border='.25'  width='30px'></td><td  white-space='nowrap' align='center'  border='.25' width='30px'> </td><td     border='.25'   width='30px' style=' border-bottom: 0;' >a. Steer-Axle Tires</td><td width='20px'  > </td><td  white-space='nowrap' align='center'  border='.25'  width='30px' style='border-top: 0; border-bottom: 0;'></td><td  white-space='nowrap' align='center'    width='30px'></td><td align='center'      border='.25'  width='30px' >  </td>" +
                     "</tr >" +
                       "<tr font-size='8px'><td border='.25' width='20px' ></td><td border='.25' width='30px'> </td><td  border='.25'  width='30px'>  </td><td   white-space='nowrap'   border='.25'  width='30px' style='border-top: 0; border-bottom: 0;' >b. Fuel Tank Filler Cap</td><td width='20px' border='.25' ></td><td  white-space='nowrap' align='center'  border='.25'  width='30px'></td><td  white-space='nowrap' align='center'  border='.25' width='30px'> </td><td     border='.25'   width='30px'  style='border-top: 0; border-bottom: 0;'>b. All Other Tires</td><td width='20px'  > </td><td  white-space='nowrap' align='center'  border='.25'  width='30px' style='border-top: 0; border-bottom: 0;'></td><td  white-space='nowrap' align='center'    width='30px'></td><td align='center'      border='.25'  width='30px' >  </td>" +
                     "</tr >" +
                         "<tr font-size='8px'><td border='.25' width='20px' ></td><td border='.25' width='30px'> </td><td  border='.25'  width='30px'>  </td><td   white-space='nowrap'   border='.25'  width='30px' style='border-top: 0; border-bottom: 0;' >c. Fuel tank securely attached</td><td width='20px' border='.25' ></td><td  white-space='nowrap' align='center'  border='.25'  width='30px'></td><td  white-space='nowrap' align='center'  border='.25' width='30px'> </td><td    border='.25'   width='30px'  style='border-top: 0; border-bottom: 0;'>c. Speed- Restricted Tires</td><td width='20px'  > </td><td  white-space='nowrap' align='center'  border='.25'  width='30px' style='border-top: 0; border-bottom: 0;'></td><td  white-space='nowrap' align='center'    width='30px'></td><td align='center'      border='.25'  width='30px' > </td>" +
                     "</tr >" +
                      "<tr font-size='8px'><td border='.25' width='20px' ></td><td border='.25' width='30px'> </td><td  border='.25'  width='30px'>  </td><td  white-space='nowrap'   border='.25'  width='30px' background-color='black' color='white'  font-size='8px'  ><b>5. LIGHTING DEVICES</b></td><td width='20px' border='.25' ></td><td  white-space='nowrap' align='center'  border='.25'  width='30px'></td><td  white-space='nowrap' align='center'  border='.25' width='30px'> </td><td     border='.25'   width='30px' background-color= 'black' color='white' font-size='8px' white-space='nowrap'><b>11. WHEELS AND RIMS</b></td><td width='20px'  > </td><td  white-space='nowrap' align='center'  border='.25'  width='30px' style='border-top: 0; border-bottom: 0;'></td><td  align='center'    width='30px'></td><td align='center' border='.25'  width='30px' >  </td>" +
                     "</tr >" +
                      "<tr font-size='8px' ><td border='.25' width='20px' ></td><td border='.25' width='30px'> </td><td  border='.25'  width='30px'>  </td><td   white-space='nowrap'   border='.25'  width='30px' style=' border-bottom: 0;' >All required lights/reflectors operable.</td><td width='20px' border='.25' ></td><td  white-space='nowrap' align='center'  border='.25'  width='30px'></td><td  white-space='nowrap' align='center'  border='.25' width='30px'> </td><td     border='.25'   width='30px'  style=' border-bottom: 0;'>a. Lock or Slide Ring</td><td width='20px'  > </td><td  white-space='nowrap' align='center'  border='.25'  width='30px' style='border-top: 0; border-bottom: 0;'></td><td  white-space='nowrap' align='center'    width='30px'></td><td align='center'      border='.25'  width='30px' > </td>" +
                     "</tr >" +
                      "<tr font-size='8px' ><td border='.25' width='20px' ></td><td border='.25' width='30px'> </td><td  border='.25'  width='30px'>  </td><td   white-space='nowrap'   border='.25'  width='30px' style='border-top: 0; border-bottom: 0;' ></td><td width='20px' border='.25' ></td><td  white-space='nowrap' align='center'  border='.25'  width='30px'></td><td  white-space='nowrap' align='center'  border='.25' width='30px'> </td><td    border='.25'   width='30px'  style='border-top: 0; border-bottom: 0;'>b. Wheels and Rims</td><td width='20px' > </td><td  white-space='nowrap' align='center'  border='.25'  width='30px' style='border-top: 0; border-bottom: 0;'></td><td  white-space='nowrap' align='center'    width='30px'></td><td align='center' border='.25'  width='30px' > </td>" +
                     "</tr >" +

                    "<tr font-size='8px'><td border='.25' width='20px' ></td><td border='.25' width='30px'> </td><td  border='.25'  width='30px'>  </td><td align='center'  white-space='nowrap'   border='.25'  width='30px'  style='border-top: 0; border-bottom: 0;'></td><td width='20px' border='.25' ></td><td  white-space='nowrap' align='center'  border='.25'  width='30px'></td><td  white-space='nowrap' align='center'  border='.25' width='30px'> </td><td   border='.25'   width='30px' style='border-top: 0; border-bottom: 0;' >c. Fasetners</td><td width='20px'  > </td><td  white-space='nowrap' align='center'  border='.25'  width='30px' style='border-top: 0; border-bottom: 0;'></td><td  white-space='nowrap' align='center'    width='30px'></td><td align='center'  border='.25'  width='30px' > </td>" +
                     "</tr >" +
                        "<tr font-size='8px' ><td border='.25' width='20px' ></td><td border='.25' width='30px'> </td><td  border='.25'  width='30px'>  </td><td align='center'  white-space='nowrap'   border='.25'  width='30px' style='border-top: 0; border-bottom: 0;' ></td><td width='20px' border='.25' ></td><td  white-space='nowrap' align='center'  border='.25'  width='30px'></td><td  white-space='nowrap' align='center'  border='.25' width='30px'> </td><td  border='.25'   width='30px'  style='border-top: 0; border-bottom: 0;'>d. Welds</td><td width='20px'  > </td><td  white-space='nowrap' align='center'  border='.25'  width='30px' style='border-top: 0; border-bottom: 0;'></td><td  white-space='nowrap' align='center'    width='30px'></td><td align='center'   border='.25'  width='30px' > </td>" +
                     "</tr >" + 
                   
                    
                      "</table>";
              Html+="<table width='100%' style = 'margin-left:30px; font-size:7px'  border='.25'>" +
                   "<tr width='100%'  >"+
                    "<td >INSTRUCTIONS: MARK COLUMN ENTRIES TO VERIFY INSPECTION: ____ OK, ____NEEDS REPAIR, ____ IF ITEMS DO NOT APPLY, _____ REPAIRED DATE </td>"+
                      "</tr>"+  
                "</table>";                               

                Html += "<table width='100%' style = 'margin-left:30px; font-size:6px' >" +
                  "<tr><td>CERTIFICATION: THIS VEHICLE HAS PASSED ALL THE INSPECTION ITEMS FOR THE ANNUAL VEHICLE INSPECTION IN ACCORDANCE WITH 49 CFR PART 396.</td></tr>"+
                  "<tr><td align='left' font-size='6px' >Copyright 2022 J.J. Keller &amp; Associates, Inc. </td></tr>"+
                  //  "<tr align='right' ><td><table align='right' ><tr><td><b>3127</b></td></tr><tr><td><b>(Rev. 1/22)</b></td></tr></table></td></tr>"+
 
                  "<tr><td align='left' font-size='6px' height='10px'> Neenah, WI . JJKeller.com . (800)327-6868 </td></tr>"+
                  "<tr><td align='left' font-size='6px' >Printed in USA </td><td  align='right' ><table height='20px'><tr><td><b>3127</b></td></tr><tr><td><b>(Rev. 1/22)</b></td></tr></table></td></tr>"+
 
                  " </table>";   
             


              
              
                 Html += "<table width='100%' style = 'margin-left:30px; margin-top:-30px; font-size:6px '  >" +
                  "<tr><td align='center'><b>ORIGINAL</b></td></tr>"+
                 
                  " </table>";


               

                HTMLObj.defaultValue = Html;


                var xmlStr = "<?xml version=\"1.0\"?>\n<!DOCTYPE html PUBLIC \"-//big.faceless.org//report\" \"report-1.1.dtd\">\n";
                xmlStr += "<pdf>";
                xmlStr += "<head>";
                xmlStr += "<meta name='title' value='DOTINSPECTION'/>";
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
                xmlStr += "<body size='A4' class='text' header='myheader' header-height='3.0cm' footer='myfooter' footer-height='1cm'  style='margin-top:-10mm; margin-right:-5mm; margin-left:-10mm; margin-bottom:-10mm;'>";

                xmlStr += Html;


                xmlStr += "</body>";


                xmlStr += "</pdf>";

                log.error("xmlStr -> " + xmlStr);

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


