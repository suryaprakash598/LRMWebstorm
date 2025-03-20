/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */

var UniqueRepairjobArr = new Array();
var RepairjobArrID = new Array();
var RepairjobArrName = new Array();

define(['N/error', 'N/task', 'N/render', 'N/file', 'N/encode', 'N/record', 'N/search', 'N/ui', 'N/ui/serverWidget', 'N/log', 'N/format', 'N/runtime', 'N/redirect', 'N/url', 'N/https', 'N/xml'],

    function (error, task, render, file, encode, record, search, ui, serverWidget, log, format, runtime, redirect, url, https, xml) {

        function onRequest(context) {

            if (context.request.method == "GET") {

                var ID = context.request.parameters.soID;
                var TYPE = context.request.parameters.custparam_rectype;


                var UserObj = runtime.getCurrentUser();
                // log.error("UserObj-> ",UserObj);
                var UserName = UserObj.name;
                var UserEmail = UserObj.email;
                var UserSubsidiary = UserObj.subsidiary;
                var UserLocation = UserObj.location;



                var form = serverWidget.createForm({ title: "LMR TRUCK REPAIR" });

                var Html = "";

                var HTMLObj = form.addField({
                    id: "custpage_html_field",
                    label: "HTML",
                    type: serverWidget.FieldType.INLINEHTML,
                    source: null,
                    container: null
                });


                var imgUrl = "http://7059197-sb4.shop.netsuite.com/core/media/media.nl?id=25512942&c=7059197_SB4&h=CQ37SfCxA_TKxWHcUHvO_J6-STnQSnbGsd7wykrS28lJjlOf";

                

                /*---------------+++++++++++++++---------RECORD LOAD----------++++++++++++++++++--------------------*/

                var DateCreated = "", DocNum = "", SalesRep = "", PayTerm = "", Customer = "", VIN = "", LPlate = "", OMileage = "", IMileage = "";
                var CustName = "", CustEmail = "", CustPhone = "",subsidiary='';
                if (ID) {
                    var EstiRecObj = record.load({
                        type: "estimate",
                        id: ID,
                        isDynamic: true
                    });

                    DocNum = EstiRecObj.getValue({
                        fieldId: "tranid"
                    });
					subsidiary = EstiRecObj.getValue({
                        fieldId: "subsidiary"
                    });
					 var SMainLogo='';
					if(subsidiary){
					var SubRec	=record.load({type:"subsidiary",id:subsidiary,isDynamic:!0});
						 
					var logoId 	=	SubRec.getValue({
						fieldId: "logo"
					});
						 var File	=	file.load({id:logoId});
						SMainLogo	=	File.url; 
					}
					var Image = xml.escape({
						xmlText: SMainLogo
					});
                    DateCreated = EstiRecObj.getValue({
                        fieldId: "trandate"
                    });

                    if (DateCreated) {
                        DateCreated = format.format({ value: DateCreated, type: format.Type.DATE });
                    }

                    SalesRep = EstiRecObj.getText({
                        fieldId: "salesrep"
                    });

                    PayTerm = EstiRecObj.getText({
                        fieldId: "terms"
                    });

                    Customer = EstiRecObj.getValue({
                        fieldId: "entity"
                    });

                    VIN = EstiRecObj.getText({
                        fieldId: "custbody_advs_st_service_equipment"
                    });

                    LPlate = EstiRecObj.getValue({
                        fieldId: "custbody_advs_st_plate_number"
                    });

                    OMileage = EstiRecObj.getValue({
                        fieldId: "custbody_advs_st_odometer_out"
                    });

                    IMileage = EstiRecObj.getValue({
                        fieldId: "custbody_advs_st_odometer_in"
                    });

                    DocNum = checkNull(DocNum);
                    DateCreated = checkNull(DateCreated);
                    SalesRep = checkNull(SalesRep);
                    PayTerm = checkNull(PayTerm);
                    Customer = checkNull(Customer);
                    VIN = checkNull(VIN);
                    LPlate = checkNull(LPlate);
                    OMileage = checkNull(OMileage);
                    IMileage = checkNull(IMileage);

                    if (Customer) {

                        var customerSearchObj = search.create({
                            type: "customer",
                            filters:
                                [
                                    ["internalid", "anyof", Customer],
                                    "AND",
                                    ["isinactive", "is", "F"]
                                ],
                            columns:
                                [
                                    search.createColumn({ name: "altname", label: "Name" }),
                                    search.createColumn({ name: "email", label: "Email" }),
                                    search.createColumn({ name: "phone", label: "Phone" })
                                ]
                        });
                        // var searchResultCount = customerSearchObj.runPaged().count;
                        // log.debug("customerSearchObj result count", searchResultCount);
                        customerSearchObj.run().each(function (result) {

                            CustName = result.getValue({
                                name: "altname"
                            });

                            CustEmail = result.getValue({
                                name: "email"
                            });

                            CustPhone = result.getValue({
                                name: "phone"
                            });

                            return true;
                        });


                    }

                    CustName = checkNull(CustName);
                    CustEmail = checkNull(CustEmail);
                    CustPhone = checkNull(CustPhone);

                    /*Search for Location in Header*/
                    var add1 = "", add2 = "", state = "";
                    var estimateSearchObj = search.create({
                        type: "estimate",
                        filters:
                            [
                                // ["type", "anyof", "estimate"],
                                // "AND",
                                ["internalid", "anyof", "35"],
                                "AND",
                                ["mainline", "is", "T"],
                                "AND",
                                ["custbody_advs_module_name", "anyof", "3"]
                            ],
                        columns:
                            [
                                search.createColumn({
                                    name: "address1",
                                    join: "location",
                                    label: "Address 1"
                                }),
                                search.createColumn({
                                    name: "address2",
                                    join: "location",
                                    label: "Address 2"
                                }),
                                search.createColumn({
                                    name: "state",
                                    join: "location",
                                    label: "State/Province"
                                }),
                                search.createColumn({
                                    name: "zip",
                                    join: "location",
                                    label: "Zip"
                                }),
                                search.createColumn({
                                    name: "custrecord_advs_dealer_code",
                                    join: "location",
                                    label: "Dealer Code"
                                }),
                                search.createColumn({
                                    name: "custrecord_advs_st_location_code",
                                    join: "location",
                                    label: "Location Code"
                                })
                            ]
                    });

                    estimateSearchObj.run().each(function (result) {
                        add1 = result.getValue({
                            name: "address1",
                            join: "location"
                        });

                        log.error("add1-> ", add1);
                        add2 = result.getValue({
                            name: "address2",
                            join: "location"
                        });
                        log.error("add2-> ", add2);
                        state = result.getValue({
                            name: "state",
                            join: "location"
                        });

                        return true;
                    });
                    /*---------------------*/

                    add1 = checkNull(add1);
                    add2 = checkNull(add2);
                    state = checkNull(state);


                    /*------HEADER CONTENT-------*/

                    var htmlHeader = "<table width='100%'  style='font-family:sans-serif; '>" +//margin-left='20px'
                        "<tr>" +

                        "<td  align='left' style='font-size:10px; '>" +
                        "<table><tr>" +
                        "<td><img src= '" + Image + "' width='250px' height='45px' ></img></td>" +
                        "</tr></table></td>" +

                        "<td  align='left' style='font-size:10px; '><table>" +
                        "<tr style='font-size:13px;'><td><b>LRM Truck Repair</b></td></tr>" +
                        "<tr><td>" + add1 + "</td></tr>" +
                        "<tr><td>" + add2 + " , " + state + "</td></tr>" +
                        "<tr><td>(954) 791-1400</td></tr>" +
                        "<tr><td>repairs@lrmleasing.com</td></tr>" +
                        "</table></td>" +


                        "<td  align='center' style='font-size:13px; '></td>" +

                        "<td  align='right' style='font-size:10px; '><table>" +
                        "<tr style='font-size:20px;'><td><b>Estimate: " + DocNum + "</b></td></tr>" +
                        "<tr><td>Created: " + DateCreated + "</td></tr>" +
                        "<tr><td>Payment Term: " + PayTerm + "</td></tr>" +
                        "<tr><td>Service Writer: " + SalesRep + "</td></tr>" +
                        "</table></td>" +

                        "</tr>" +
                        "</table>";



                    /*---------BODY CONTENT-----------*/

                    Html += "<table width='100%' style='font-size:10px; font-family:sans-serif;'><tr  >" +

                        "<td width='50%' align='left'><table>" +
                        "<tr><td><b>" + CustName + "</b></td></tr>" +
                        "<tr><td>Mobile: " + CustPhone + "</td></tr>" +
                        "<tr><td>" + CustEmail + "</td></tr>" +
                        "</table></td>" +

                        "<td width='50%' align='right'><table>" +
                        "<tr width='100%'><td colspan='2'><b>2014 Freightliner Cascadia (White, #GB0706)</b></td></tr>" +
                        "<tr><td>VIN:</td><td align='left'> " + VIN + "</td></tr>" +
                        "<tr><td>License Plate:</td><td> " + LPlate + "</td></tr>" +
                        "<tr><td>Last Recorded Mileage:</td><td> " + IMileage + "</td></tr>" +
                        "<tr><td>Mileage:</td><td> " + OMileage + "</td></tr>" +
                        "</table></td>" +

                        "</tr></table>";





                    var itemDesc = "", itemQty = "", itemHRS = "", itemInvTyp = "", itemRate = "";

                    var partTotal = 0, labourTotal = 0, temp = "";

                    var LineCount = EstiRecObj.getLineCount({
                        sublistId: "item"
                    });
                    log.error("LineCount-> " + LineCount);

                    /*+++++++++++++------------FOR TABLE HEADDER--------------+++++++++++++*/

                    for (let i = 0; i < LineCount; i++) {

                        var RepairJob = EstiRecObj.getSublistValue({
                            sublistId: "item",
                            fieldId: "custcol_advs_repair_task_link",
                            line: i
                        });


                        var RepairJobt = EstiRecObj.getSublistText({
                            sublistId: "item",
                            fieldId: "custcol_advs_repair_task_link",
                            line: i
                        });

                        var RepinvType = EstiRecObj.getSublistValue({
                            sublistId: "item",
                            fieldId: "custcol_advs_selected_inventory_type",
                            line: i
                        });

                        // log.error("RepairJob-> " + RepairJob, "RepinvType-> " + RepinvType);




                        if (RepairJob && RepairjobArrID.indexOf(RepairJob) == -1) {
                            RepairjobArrID.push(RepairJob);
                            RepairjobArrName.push(RepairJobt);
                        }

                    }
                    /*>>>>>>>>>>>>>>><<<<<<<<<<<<<<<<<< */

                    /*>>>>>> Boolean <<<<<<*/
                    for (let b = 0; b < RepairjobArrID.length; b++) {
                        var tableHead = RepairjobArrID[b];
                        var isLabour = "F", isPart = "F";

                        for (let i = 0; i < LineCount; i++) {
                            itemInvTyp = EstiRecObj.getSublistValue({
                                sublistId: "item",
                                fieldId: "custcol_advs_selected_inventory_type",
                                line: i
                            });
                            if (itemInvTyp == 3 || itemInvTyp == "3") {
                                isLabour = "T";

                            }
                            if (itemInvTyp == 2 || itemInvTyp == "2") {
                                isPart = "T";

                            }
                        }
                        UniqueRepairjobArr[tableHead] = new Array();
                        UniqueRepairjobArr[tableHead]["isPart"] = isPart;
                        UniqueRepairjobArr[tableHead]["isLabour"] = isLabour;

                    }
                    /*>>>>>> Boolean <<<<<<*/


                    for (let t = 0; t < RepairjobArrID.length; t++) {

                        var tableHead = RepairjobArrID[t];
                        var tableHeadName = RepairjobArrName[t];

                        // log.error("tableHead--> ", tableHead);



                        Html += "<table width='100%' border='.75' border-color='#BFBFBF' margin-top='20px' style='font-size:10px; font-family:sans-serif;'>";
                        Html += "<tr style=' border:.5px; border-color: #BFBFBF;' height='15' >" +
                            "<td width='100%' colspan='6' background-color='#E0E0E0' padding-left='10px'><b>" + tableHeadName + " </b></td></tr>" +

                            "<tr width='100%' style=' border:.5px; border-color:#E0E0E0;' height='15' >" +
                            "<td   ></td>" +
                            "<td width='60%' ><b>Description</b></td>" +
                            "<td width='10%' ><b>Price</b></td>" +
                            "<td width='10%' ><b>QTY</b></td>" +
                            "<td width='10%' ><b>HRS</b></td>" +
                            "<td width='10%' ><b>Subtotal</b></td></tr>";

                        // if (isLabour == "T") {
                        if (UniqueRepairjobArr[tableHead]["isLabour"] == "T") {
                            var total = 0;
                            var count = 1;
                            Html += "<tr style=' border:.5px; border-color:#E0E0E0; background-color:#E0E0E0;' height='15'><td >Labour</td></tr>";
                            for (let i = 0; i < LineCount; i++) {

                                itemInvTyp = EstiRecObj.getSublistValue({
                                    sublistId: "item",
                                    fieldId: "custcol_advs_selected_inventory_type",
                                    line: i
                                });
                                itemInvTyp = checkNull(itemInvTyp);

                                if (itemInvTyp == 3 || itemInvTyp == "3") {

                                    itemRepJob = EstiRecObj.getSublistValue({
                                        sublistId: "item",
                                        fieldId: "custcol_advs_repair_task_link",
                                        line: i
                                    });
                                    itemRepJob = checkNull(itemRepJob);

                                    // log.error("itemRepJob-> " + itemRepJob);
                                    if (itemRepJob == tableHead) {


                                        itemDesc = EstiRecObj.getSublistValue({
                                            sublistId: "item",
                                            fieldId: "description",
                                            line: i
                                        });
                                        // log.error("itemDesc-> " + itemDesc);

                                        itemDesc = checkNull(itemDesc);
                                        // log.error("checkNull-> " + itemDesc);
                                        itemDesc = check_amp(itemDesc);
                                        // log.error("check_amp-> " + itemDesc);

                                        itemRate = EstiRecObj.getSublistValue({
                                            sublistId: "item",
                                            fieldId: "rate",
                                            line: i
                                        });
                                        itemRate = checkNull(itemRate);

                                        itemQty = EstiRecObj.getSublistValue({
                                            sublistId: "item",
                                            fieldId: "quantity",
                                            line: i
                                        });
                                        itemQty = checkNull(itemQty);

                                        itemHRS = EstiRecObj.getSublistValue({
                                            sublistId: "item",
                                            fieldId: "units",
                                            line: i
                                        });
                                        itemHRS = checkNull(itemHRS);

                                        var subtotal = (itemRate * itemQty) * 1
                                        total += subtotal;
                                        subtotal = subtotal.toFixed(2);
                                        Html += "<tr style=' border:.5px; border-color:#E0E0E0;' height='15' >" +
                                            "<td padding-left='10px' >" + count + "</td>" +
                                            "<td width='60%' >" + itemDesc + "</td>" +
                                            "<td width='10%' >" + itemRate + "</td>" +
                                            "<td width='10%' >" + itemQty + "</td>" +
                                            "<td width='10%' >" + itemHRS + "</td>" +
                                            "<td width='10%' >" + subtotal + "</td></tr>";
                                        count++;
                                    }

                                }

                            }
                            total = total.toFixed(2);
                            Html += "<tr style=' border:.5px; border-color: #BFBFBF; background-color:#E0E0E0;' height='15'>" +
                                "<td  ></td>" +
                                "<td  ></td>" +
                                "<td  ></td>" +
                                "<td  ></td>" +
                                "<td  ><b>Total</b></td>" +
                                "<td  >" + total + "</td></tr>";


                            Html += "<tr style=' border:.5px; border-color:#E0E0E0;' height='15'><td ></td></tr>";

                            labourTotal += (total * 1);
                        }
                        // if (isPart == "T") {
                        if (UniqueRepairjobArr[tableHead]["isPart"] == "T") {
                            var total = 0;
                            var count = 1;
                            Html += "<tr style=' border:.5px; border-color:#E0E0E0; background-color:#E0E0E0;' height='15'><td >Parts</td></tr>";
                            for (let i = 0; i < LineCount; i++) {

                                itemInvTyp = EstiRecObj.getSublistValue({
                                    sublistId: "item",
                                    fieldId: "custcol_advs_selected_inventory_type",
                                    line: i
                                });
                                itemInvTyp = checkNull(itemInvTyp);

                                if (itemInvTyp == 2 || itemInvTyp == "2") {

                                    itemRepJob = EstiRecObj.getSublistValue({
                                        sublistId: "item",
                                        fieldId: "custcol_advs_repair_task_link",
                                        line: i
                                    });
                                    itemRepJob = checkNull(itemRepJob);

                                    if (itemRepJob == tableHead) {

                                        itemDesc = EstiRecObj.getSublistValue({
                                            sublistId: "item",
                                            fieldId: "description",
                                            line: i
                                        });
                                        itemDesc = checkNull(itemDesc);
                                        itemDesc = check_amp(itemDesc);

                                        itemRate = EstiRecObj.getSublistValue({
                                            sublistId: "item",
                                            fieldId: "rate",
                                            line: i
                                        });
                                        itemRate = checkNull(itemRate);

                                        itemQty = EstiRecObj.getSublistValue({
                                            sublistId: "item",
                                            fieldId: "quantity",
                                            line: i
                                        });
                                        itemQty = checkNull(itemQty);

                                        itemHRS = EstiRecObj.getSublistValue({
                                            sublistId: "item",
                                            fieldId: "custcol_advs_goal_hours",
                                            line: i
                                        });
                                        itemHRS = checkNull(itemHRS);

                                        var subtotal = (itemRate * itemQty) * 1
                                        total += subtotal;
                                        Html += "<tr style=' border:.5px; border-color:#E0E0E0;' height='15' >" +
                                            "<td padding-left='10px' >" + count + "</td>" +
                                            "<td width='60%' >" + itemDesc + "</td>" +
                                            "<td width='10%' >" + itemRate + "</td>" +
                                            "<td width='10%' >" + itemQty + "</td>" +
                                            "<td width='10%' ></td>" +
                                            "<td width='10%' >" + subtotal + "</td></tr>";
                                        count++;
                                    }

                                }

                            }
                            Html += "<tr style=' border:.5px; border-color: #BFBFBF; background-color:#E0E0E0;' height='15'>" +
                                "<td  ></td>" +
                                "<td  ></td>" +
                                "<td  ></td>" +
                                "<td  ></td>" +
                                "<td  ><b>Total</b></td>" +
                                "<td  >" + total + "</td></tr>";

                            Html += "<tr style=' border:.5px; border-color:#E0E0E0;' height='15'><td ></td></tr>";

                            partTotal += (total * 1);
                        }




                        Html += "</table>";

                    }





                    Html += "<table width='100%'  margin-top='20px' style='font-size:10px; font-family:sans-serif;'>" +
                        "<tr>" +

                        "<td >" +
                        "Quotes are an approximation of charges to you for the services requested." +
                        "They are based on the anticipated details of the work to be done. It is possible for unexpected complications to cause some deviation from the quote." +
                        "I hereby authorize the repair work hereinafter set forth to be done along with the necessary material and agree that" +
                        "you are not responsible for loss or damage to vehicle or articles left in vehicle in case" +
                        "of fre, theft or any other cause beyond your control or for any delays caused by" +
                        "unavailability of parts or delays in parts by the supplier or transporter." +
                        "I understand that I have the right to know before authorizing my repairs what the repairs to my" +
                        "vehicle will be and what their costs will be. You and your employees may operate the" +
                        "above vehicle for the" +
                        "purpose of testing, inspection, or delivery at my risk. I understand that you are not" +
                        "responsible for loss or damage to vehicle to articles left in the vehicle in case of fre," +
                        "theft, accident or any other cause beyond control." +
                        "</td>" +

                        "<td width ='40%' style='font-size:12px;'><table width='100%'>" +
                        "<tr><td width='100%' padding='10px'>Totals only include authorized services</td></tr>" +
                        "<tr><td >" +
                        "<table border='1'  border-color='#E0E0E0' border-style='solid' width='100%'>" +
                        "<tr padding='5px'><td style='padding-left:10px;'>Parts ......................</td><td style='padding-left:10px; padding-right:10px;'>$" + partTotal + "</td></tr>" +
                        "<tr ><td style='padding-left:10px;'>Labor ......................</td><td style='padding-left:10px; padding-right:10px;'>$" + labourTotal + "</td></tr>" +
                        "<tr ><td style='padding-left:10px;'>&nbsp;&nbsp;Subtotal ...................</td><td style='padding-left:10px; padding-right:10px;'>$" + (partTotal + labourTotal) + "</td></tr>" +
                        "<tr ><td style='padding-left:10px;'>&nbsp;&nbsp;Discount ...................</td><td style='padding-left:10px; padding-right:10px;'>$0</td></tr>" +
                        "<tr ><td style='padding-left:10px;'>&nbsp;&nbsp;Shop Supplies ..............</td><td style='padding-left:10px; padding-right:10px;'>$0</td></tr>" +
                        "<tr ><td style='padding-left:10px;'>&nbsp;&nbsp;Fees ..................</td><td style='padding-left:10px; padding-right:10px;'>$0</td></tr>" +
                        "<tr ><td style='padding-left:10px;'>&nbsp;&nbsp;Tax ...................</td><td style='padding-left:10px; padding-right:10px;'>$0</td></tr>" +
                        "<tr ><td style='padding-left:10px;'>Grand Total ...................</td><td style='padding-left:10px; padding-right:10px;'>$"+(partTotal + labourTotal)+"</td></tr>" +
                        "<tr ><td style='padding-left:10px;'>Paid To Date ..................</td><td style='padding-left:10px; padding-right:10px;'>$0</td></tr>" +
                        "<tr height='20' background-color='#E0E0E0' style='font-size:13px;'><td style='padding:10px;'>REMAINING BALANCE</td><td style='padding:10px;'>$"+(partTotal + labourTotal)+"</td></tr>" +
                        "</table>" +
                        "</td></tr>" +
                        "</table></td>" +

                        "</tr>" +
                        "</table>";


                    Html += "<table style='font-size:10px; font-family:sans-serif;'>" +
                        "<tr>" +
                        "<td>I understand and acknowledge that there are no returns or exchanges for any parts purchased including electrical components. Unless otherwise" +
                        "documented, all work is fnal no warranties or guarantees of any kind." +
                        "Once estimate has been provided you have 2 business days to approve the estimate. If estimate is not approved within 2 business days, LRM Truck Repair" +
                        "reserves the right to charge storage at a rate of $50 a day (if truck and trailer, $100/day)." +
                        "Upon approval of this estimate, 50% of the estimate is due before work can be started. Upon completion of the work order, the balance of the invoice will be" +
                        "due within 2 business days and you will be required to pick up the vehicle within those 2 business days. If balance or vehicle is not picked up within 2" +
                        "business days, LRM Truck Repair reserves the right to charge storage at a rate of $50 a day (if truck and trailer, $100/day)." +
                        "I understand that LRM Truck Repair, its employees, management, and or owners are not responsible for damage or theft to my vehicle or contents.</td>" +
                        "</tr>" +
                        "<tr>" +
                        "<td><b>Signature</b>__________________________</td>" +
                        "</tr>" +
                        "</table>";



                    // Html += "<table width='100%' border='.75' border-color='#BFBFBF' margin-top='20px' style='font-size:10px; font-family:sans-serif;'>";
                    // Html += "<tr style=' border-bottom:.5px; border-left:.5px; border-color: #BFBFBF;' height='15' >" +
                    //     "<td width='100%' colspan='6' background-color='#E0E0E0'><b>CHECK AND ADVISE DEF PUMP</b></td></tr>" +

                    //     "<tr width='100%' style=' border-bottom:.75px; border-color:#E0E0E0;' height='15' >" +
                    //     "<td   ></td>" +
                    //     "<td width='60%' ><b>Description</b></td>" +
                    //     "<td width='10%' ><b>Price</b></td>" +
                    //     "<td width='10%' ><b>QTY</b></td>" +
                    //     "<td width='10%' ><b>HRS</b></td>" +
                    //     "<td width='10%' ><b>Subtotal</b></td></tr>" +

                    //     "<tr style=' border-bottom:.75px; border-color:#E0E0E0;' height='15' >" +
                    //     "<td   ></td>" +
                    //     "<td width='60%' >Description</td>" +
                    //     "<td width='10%' >Price</td>" +
                    //     "<td width='10%' >QTY</td>" +
                    //     "<td width='10%' >HRS</td>" +
                    //     "<td width='10%' >Subtotal</td></tr>" +


                    //     "<tr style='  background-color:#E0E0E0;'>" +
                    //     "<td  ></td>" +
                    //     "<td  ></td>" +
                    //     "<td style='whitespace:nowrap;' >Shop Supplies (5%): $71.82</td>" +
                    //     "<td style='whitespace:nowrap;'>Tax (7%): $105.57 </td>" +
                    //     "<td style='whitespace:nowrap;'><b>Total</b></td></tr>";
                    // Html += "</table>";





                    /*-------FOOTER CONTENT-------*/


                    var htmlFooter = "<hr width='100%'></hr>";
                    htmlFooter += "<table align='left'  width = '100%' ><tr>" +

                        "<td align='left'>" + DateCreated + "</td>" +

                        "<td align='center'>LRM Truck Repair- MVR #98446<br></br>Powered by Shopmonkey.io</td>" +

                        "<td align='right'><pagenumber/> of <totalpages/></td>" +

                        "</tr></table>";



                    HTMLObj.defaultValue = Html;


                    var xmlStr = "<?xml version=\"1.0\"?>\n<!DOCTYPE html PUBLIC \"-//big.faceless.org//report\" \"report-1.1.dtd\">\n";
                    xmlStr += "<pdf>";
                    xmlStr += "<head>";
                    xmlStr += "<meta name='title' value='LRM ESTIMATE PRINT'/>";
                    xmlStr += "<meta charset='utf-8' />";
                    xmlStr += "<macrolist>";
                    xmlStr += "<macro id='headerMy'>";
                    xmlStr += "<table width='100%'><tr><td align='center' class='td' style='font-size: 17.33px; font-family:sans-serif;'></td></tr><tr><td>" + htmlHeader + "</td></tr></table>";
                    xmlStr += "</macro>";

                    xmlStr += "<macro id='footerMy'>";
                    xmlStr += "<table align='center' width='100%' margin-left='20px' style='font-size:10px; font-family:sans-serif;'> <tr> <td align='center'>" + htmlFooter + "</td> </tr></table>";
                    xmlStr += "</macro>";

                    xmlStr += "</macrolist>";
                    xmlStr += "</head>";
                    xmlStr += "<body size='A4' header='headerMy' header-height='3.5cm' footer='footerMy' footer-height='2cm'>";

                    xmlStr += Html;


                    xmlStr += "</body>";


                    xmlStr += "</pdf>";

                    // log.error("xmlStr -> " + xmlStr);

                    var Renderer = render.create();
                    Renderer.templateContent = xmlStr;

                    var Newfile = Renderer.renderAsPdf();
                    Newfile.name = "PDF_TITLE.PDF";

                    context.response.writeFile(Newfile, true);
                }
            } else {



            }

        }

        return { onRequest }
    });

function checkNull(text) {
    if (text == null || text == undefined || text == '') {
        return '';
    }
    else if (text == 'NaN') {
        return 0;
    }
    else {
        return text;
    }
}
function check_amp(text) {
    if (text) {
        return text.replace(/&/g, "&amp;");
    }

}
