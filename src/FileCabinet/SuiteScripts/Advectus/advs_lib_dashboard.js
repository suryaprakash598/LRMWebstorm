/**
 * @NApiVersion 2.1
 */
define(['N/runtime', 'N/search','N/format','./advs_lib_util.js','N/url','N/https','N/ui/dialog','/SuiteBundles/Bundle 555729/advs_lib/src/advs_lib_default_funtions_v2.js'],
    /**
 * @param{runtime} runtime
 * @param{search} search
 */
    (runtime, search,format,libUtil,url,https,dialog,advsObj) => {

        var clientCs    =   libUtil.collectionDashObj.Client;
        var defaultList =   ["PTP","B.Promise"];
        var defaultLiID =   [libUtil.tasktype.ptp,libUtil.tasktype.brokenpromise];
        const generateFirstHtml = (request,custid,from,to) => {

            var taskType = request.parameters.tasktype;

            var collectionDays  =   getcollectiondays();

            log.debug("start_From",from+"=>"+from+"=>"+to);
            if(!from){
                for(var i=0;i<collectionDays.length;i++) {
                    var fromloop = collectionDays[i].from;
                    var toloop = collectionDays[i].to;
                    from    =   fromloop;
                    to    =   toloop;
                    break;
                }
            }

            log.debug("custid",custid+"=>"+from+"=>"+to);

            if(taskType){
                log.debug("taskType",taskType)
                var customerData  =     getCustomerTaskInitalData(custid,taskType);
            }else{
                var customerData  =     getCustomerInitalData(custid,from,to);
            }


          // log.debug("customerData",customerData)

            var htmldata    =   "<!DOCTYPE html>\n" +
                "<html lang=\"en\">\n" +
                "<head>\n" +
                "    <meta charset=\"UTF-8\">\n" +
                "    <title>Collection Dashboard</title>\n" +
                // "    <link rel=\"stylesheet\" href=\"collection_dashboard_css.css\">\n" +
                "    <link rel=\"stylesheet\" href=\"https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200\" />\n" +
                // "    <script src=\"collection_dashboard_js.js\"></script>\n" +
                "</head>\n" +
                "<body>\n" +
                "" +
                "<div class='divToper'>" +
                "<div class='NavigationShaUpper' style='display : flow-root !important;'>" ;
            for(var i=0;i<collectionDays.length;i++){
                var fromloop		=	collectionDays[i].from;
                var toloop      	=	collectionDays[i].to;
                var stringDays  =   fromloop+" - "+toloop;


                var defaultClass=   "";
                if(fromloop == from && toloop==to && !taskType){
                    defaultClass=   "ActiveShaNav";
                }
                htmldata +="<a class='NavigationShaUpper BottomBorder "+defaultClass+"' style=' position: relative !important;' " +
                    "onClick=\"var rConfig = JSON.parse('{}');rConfig['context'] = '"+clientCs+"';var entryPointRequire = require.config(rConfig);entryPointRequire(['"+clientCs+"'], function (mod) {if (!!window) {}mod.RefreshScreen("+i+","+fromloop+","+toloop+","+custid+");}); return false;\">";
                 htmldata += ""+stringDays+"</a>";
            }

            for(var i=0;i<defaultLiID.length;i++){
                var id		=	defaultLiID[i];
                var label      	=	defaultList[i];
                var stringDays  =  label;


                var defaultClass=   "";
                if(taskType == id){
                    defaultClass=   "ActiveShaNav";
                }
                htmldata +="<a class='NavigationShaUpper BottomBorder "+defaultClass+"' style=' position: relative !important;' " +
                    "onClick=\"var rConfig = JSON.parse('{}');rConfig['context'] = '"+clientCs+"';var entryPointRequire = require.config(rConfig);entryPointRequire(['"+clientCs+"'], function (mod) {if (!!window) {}mod.refreshforTaskD("+id+","+custid+");}); return false;\">";
                htmldata += ""+stringDays+"</a>";
            }




            htmldata+=  "<div class='divTableSHA' id='PackageLine'>\n" +
                "    <div class='divTableBodySHA'>\n" +
                "        <div class='divTableRowSHA' style='background: beige;font-weight: bold;font-size: 12px;'>\n" +
                "            <div class='ShaBold divTableCellSHA' style='min-width:30px;width:3%;'></div>\n" +
                "            <div class='ShaBold divTableCellSHA'>Name</div>\n" +
                "            <div class='ShaBold divTableCellSHA'>E-mail</div>\n" +
                "            <div class='ShaBold divTableCellSHA'>Phone</div>\n" +
                "            <div class='ShaBold divTableCellSHA'>No of Lease</div>\n" +
                "            <div class='ShaBold divTableCellSHA'>Total Outstanding</div>\n" +
                "        </div>\n" +
                "\n" ;

            for(var i=0;i<customerData.length;i++){
                var id          =   customerData[i].id;
                var custName    =   customerData[i].custname;
                var email       =   customerData[i].email;
                var mobile      =   customerData[i].mobile;
                var amount      =   customerData[i].amount;
                amount= amount*1;amount=amount.toFixed(2);

                var LeaseCount  =   0;
                if(customerLeaseData[id] != null && customerLeaseData[id] != undefined){
                    LeaseCount  =     customerLeaseData[id]["count"];
                }



                htmldata+=    "        <input type='hidden' id='SHA_RUN_"+i+"' value='1'/>\n" +
                    "        <div class='collapsibleSHA divTableRowSHA' style='background:azure;color:black;font-weight:bold;'>\n" +
                    "            <div class='divTableCellSHA' style='cursor:pointer; width:30px;'" +
                    // "onClick=\"var rConfig = JSON.parse('{}');rConfig['context'] = '/SuiteScripts/Advectus/advs_cs_collection_dashboard.js';var entryPointRequire = require.config(rConfig);entryPointRequire(['/SuiteScripts/Advectus/advs_cs_collection_dashboard.js'], function (mod) {if (!!window) {}mod.callFirstClientFunction("+i+");}); return false;\">";
                    "onClick=\"var rConfig = JSON.parse('{}');rConfig['context'] = '"+clientCs+"';var entryPointRequire = require.config(rConfig);entryPointRequire(['"+clientCs+"'], function (mod) {if (!!window) {}mod.callFirstClientFunction("+i+","+id+","+from+","+to+");}); return false;\">";

                htmldata+= "\n" +
                    "<span id='span_"+i+"' class=\"material-symbols-outlined\">\n" +
                    "add_circle\n" +
                    "</span>" +
                    // "                <img src='https://tstdrv1064792.app.netsuite.com/core/media/media.nl?id=118205&c=TSTDRV1064792&h=8dwrHW5zEIJaEV0cx4AtV41zGAoxY58-SDDvR_32f3ArbRZH' width='20px' height='20px'/>\n" +
                    "            </div>\n" +
                    "            <div class='divTableCellSHA'>"+custName+"</div>\n" +
                    "            <div class='divTableCellSHA'>"+email+"</div>\n" +
                    "            <div class='divTableCellSHA'>"+mobile+"</div>\n" +
                    "            <div class='divTableCellSHA'>"+LeaseCount+"</div>\n" +
                    "            <div class='divTableCellSHA'>"+addCommasnew(amount)+"</div>\n" +
                    "        </div>\n" +
                    "        <div style='display:none;width:10px;margin-top:10%;' id='DIVARJ_TR_"+i+"'>\n" +
                    "            <div id='DIVARJ_"+i+"' style='border:aliceblue;'>\n" +
                    "\n" +
                    "           </div> </div>\n" ;

            }


            htmldata+= "" +
                "</div>\n" +
                "</div>\n" +


                "</div>\n" +
                "</div>\n" +

                "</body>\n" +
                "</html>";

            htmldata+=cssStyle();
            htmldata+=javascriptFunc();


            return htmldata;
        }

        function cssStyle(){
            var styleC  =   "<style>" +
                "#PackageLine {\n" +
                "    font-family: 'Trebuchet MS', Arial, Helvetica, sans-serif;\n" +
                "    border-collapse: collapse;\n" +
                "    width: 100%;\n" +
                "}\n" +
                "#PackageLine td, #PackageLine th {\n" +
                "    border: 1px solid #ddd;\n" +
                "    padding: 8px;\n" +
                "}\n" +
                "#PackageLine tr:nth-child(even){background-color: #f2f2f2;}\n" +
                "#PackageLine tr:hover {background-color: #ddd;}\n" +
                "#PackageLine th {\n" +
                "    text-align: left;background-color: black;color: white;\n" +
                "}\n" +
                ".divTableSHA {\n" +
                "    display: table;\n" +
                "    width: 100%;\n" +
                "}\n" +
                ".divTableRowSHA {display: table-row;}\n" +
                ".divTableHeadingSHA {background-color: #EEE;display: table-header-group;}\n" +
                ".divTableCellSHA, .divTableHeadSHA {border: 1px solid #999999;display: table-cell;padding: 0px 9px;color:black;font-size:10px;}\n" +
                ".divTableHeadingSHA {background-color: #EEE;display: table-header-group;font-weight: bold;}\n" +
                ".divTableFootSHA {background-color: #EEE;display: table-footer-group;font-weight: bold;}\n" +
                ".divTableBodySHA {display: table-row-group;}\n" +
                " .material-symbols-outlined {\n" +
                "     font-variation-settings:\n" +
                "             'FILL' 0,\n" +
                "             'wght' 400,\n" +
                "             'GRAD' 0,\n" +
                "             'opsz' 24\n" +
                " }\n" +
                " .divrowIconlease{\n" +
                "     display: flex;\n" +
                "     width: 100%;\n" +
                "     gap:10px;\n" +
                "     margin-left:15px;\n" +
                " }\n" +
                "\n" +
                " .customer_child{\n" +
                "     width: 100%;\n" +
                " }" +
                ".btnicon{" +
                "cursor: pointer;" +
                "}" +
                ".NavigationShaUpper {font-size: 18px;" +
                // "font-family: 'bmwTypeWebBoldAll','Arial','Helvetica',sans-serif;" +
                "text-decoration: none;" +
                "display: table-cell;" +
                "vertical-align: middle;" +
                "color: #bbb;" +
                "transition: all 50ms ease-in;" +
                "-webkit-tap-highlight-color: transitemid;" +
                "padding : 0 12px;" +
                "font-weight : bold;" +
                "padding-bottom : 1px;" +
                "height : 2px !important;" +
                "}" +
                "" +
                ".BottomBorder{" +
                "border-bottom : .6px solid #f3eeee;" +
                "cursor:pointer;" +
                "}" +
                ".ActiveShaNav{" +
                "font-size: 20px !important;" +
                " color: black !important;" +
                " border-bottom: 3px solid !important;" +
                " border-bottom-color: #1c69d4 !important;" +
                "}" +
                "" +

                "</style>";


            return styleC;
        }

        function javascriptFunc(){
            var jsScript    = "<script>";
       /*         "setTimeout(function(){" +
                "alert('aa');" +
                "document.getElementById(\"callClientFirstLevel\").addEventListener(\"click\", callClientFunction);" +
                "},1000)" +
                "";
     /!*       jsScript += 'document.getElementById("callClientFirstLevel").addEventListener("click", function() {';
            jsScript += 'callClientFunction();'; // Call the client script function.
            jsScript += '});';*!/*/
            jsScript+= "</script>";

            return jsScript;
        }

        function expandFirstLevel(id,custID){

            var PArabObj = {
                "custparam_type": 1,
                "custparam_custid":custID ,
            };
            var urlop = url.resolveScript({
                scriptId: "customscript_advs_ss_collection_dash_bac",
                deploymentId: "customdeploy_advs_ss_collection_dash_bac",
                params: PArabObj
            });
            // showProgressDialog('InProgress', 'Please wait...');
            https.request.promise({
                method: https.Method.GET,
                url: urlop
            }).then(function (response) {
                if (response.code == 200) {
                    advsObj.hideProcessingMessage();
                    var Values = response.body;
                    if (Values) {
                        var jsonD = JSON.parse(Values);
                        if(jsonD != null && jsonD != undefined && jsonD != ""){
                            generateFirstLines(id,jsonD,custID);
                        }


                    }
                }
            }).catch(function onRejected(reason) {
                alert(reason);
            });

       /*     alert("expandFirstLevel==>"+id);
            */

        }

        function generateFirstLines(id,jsonData,custID){

            var regularCharge   =   jsonData[0].regularCharge;
            var tollcharge     =   jsonData[0].tollcharge;

            var outstanding     =   jsonData[0].outstanding;
            var otheramount     =   jsonData[0].otheramount;
            var paidamount     =   jsonData[0].paidamount;

            var ptpCount     =   jsonData[0].ptpcount;
            var brokCount     =   jsonData[0].brokencount;


            var html_data			=	"";

            html_data			+=""+
                "<div class='divTableSHA'  style='width:1000px;'>" +
                "<div class='divTableBodySHA'>" +
                "<div class='divTableRowSHA' style='background: beige;font-weight: bold;font-size: 12px;'>" +
                "<div class='ShaBold divTableCellSHA'></div>" +
                "<div class='ShaBold divTableCellSHA'>Regular Charges</div>" +
                "<div class='ShaBold divTableCellSHA'>Toll Charges</div>" +
                "<div class='ShaBold divTableCellSHA'>Total Paid</div>" +
                "<div class='ShaBold divTableCellSHA'>No of PTP</div>" +
                "<div class='ShaBold divTableCellSHA'>No of Broken Promise</div>" +
                "<div class='ShaBold divTableCellSHA'>Other Charges</div>" +
                "<div class='ShaBold divTableCellSHA'>Total Unapplied Payments</div>" +
                "</div>";

            html_data+="" +
                "<input type='hidden' id='SHA_RUN_F_"+id+"' value='1'/>"+
                "<input type='hidden' id='SHA_RUN_CLOCKIN_"+id+"' value='1'/>"+
                "<div class='divTableRowSHA' style='color:black;background:azure; font-weight: bold;font-size: 12px;'>" +

                "<div class='divTableCellSHA' style='cursor:pointer; max-width:30px;'" +
                "onClick=\"var rConfig = JSON.parse('{}');rConfig['context'] = '"+clientCs+"';var entryPointRequire = require.config(rConfig);entryPointRequire(['"+clientCs+"'], function (mod) {if (!!window) {}mod.callsecondClientFunction("+id+","+custID+");}); return false;\">";
            html_data+= "\n" +
                "<span id='span_F_"+id+"' class=\"material-symbols-outlined\">\n" +
                "add_circle\n" +
                "</span>" +
                "</div>" +

                "<div class='divTableCellSHA'>"+regularCharge+"</div>" +
                "<div class='divTableCellSHA'>"+tollcharge+"</div>" +
                "<div class='divTableCellSHA'>"+paidamount+"</div>" +
                "<div class='divTableCellSHA'>"+ptpCount+"</div>" +
                "<div class='divTableCellSHA'>"+brokCount+"</div>" +
                "<div class='divTableCellSHA'>"+otheramount+"</div>" +
                "<div class='divTableCellSHA'>100</div>" +

                "</div>";

            html_data+="" +
                "<div style='display:none;width:10px;' id='DIVARJ_TR_F_"+id+"'>" +
                "<div id='DIVARJ_F_"+id+"' style='border:aliceblue;'></dv>" +
                "</div>" ;

            html_data+="" +
                "</div>" +
                "</div>";
            document.getElementById("DIVARJ_"+id).innerHTML	=	html_data;

            var content	=	document.getElementById("DIVARJ_"+id);
            //content.style.maxHeight = content.scrollHeight + "px";
            // setTimeout(function() {
            //
            // }, 5000);
        }

        function expand_secLevel(id,custId){
            var PArabObj = {
                "custparam_type": 2,
                "custparam_custid":custId ,
            };
            var urlop = url.resolveScript({
                scriptId: "customscript_advs_ss_collection_dash_bac",
                deploymentId: "customdeploy_advs_ss_collection_dash_bac",
                params: PArabObj
            });
            // showProgressDialog('InProgress', 'Please wait...');
            https.request.promise({
                method: https.Method.GET,
                url: urlop
            }).then(function (response) {
                if (response.code == 200) {
                     advsObj.hideProcessingMessage();
                    var Values = response.body;
                    if (Values) {
                        var jsonD = JSON.parse(Values);
                        if(jsonD != null && jsonD != undefined && jsonD != ""){
                            generateSecLinesLines(id,jsonD,custId);
                        }
                    }
                }
            }).catch(function onRejected(reason) {
                alert(reason);
            });

        }

        function generateSecLinesLines(id,jsonD,custId){

            var html_data ="";
            for(var i=0;i<jsonD.length;i++){
                var dataV   =   jsonD[i];

                var LeaseId         =   dataV.id;
                var LeaseName       =   dataV.name;
                var outstanding     =   dataV.outstanding;
                var remainschedule  =   dataV.remainschedule;
                var paidAmount            =   dataV.amount;
                var tollamount            =   dataV.tollamount;
                var otheramount           =   dataV.otheramount;
                var subsidiary            =   dataV.subsidiary;

                var invcount              =   dataV.invcount;
                var futcount              =   dataV.futcount;

                var futureOutStanding   =   ""+invcount+"/"+remainschedule+"";


                html_data+="<div class='customer_child'>" +
                    "<div class='divrowIconlease'>" +
                    "<div class='btnicon' title='Activity' " +
                    "onClick=\"var rConfig = JSON.parse('{}');rConfig['context'] = '"+clientCs+"';var entryPointRequire = require.config(rConfig);entryPointRequire(['"+clientCs+"'], function (mod) {if (!!window) {}mod.onClickButton(1,"+LeaseId+","+custId+","+subsidiary+");}); return false;\">";
                html_data+= " <span class=\"material-symbols-outlined\">task</span></div>"+
                    "<div class='btnicon' title='Payment' " +
                    "onClick=\"var rConfig = JSON.parse('{}');rConfig['context'] = '"+clientCs+"';var entryPointRequire = require.config(rConfig);entryPointRequire(['"+clientCs+"'], function (mod) {if (!!window) {}mod.onClickButton(2,"+LeaseId+","+custId+","+subsidiary+");}); return false;\">";
                html_data+=  "<span class=\"material-symbols-outlined\">payments</span></div>"+
                    "<div class='btnicon' title='Payoff'" +
                    "onClick=\"var rConfig = JSON.parse('{}');rConfig['context'] = '"+clientCs+"';var entryPointRequire = require.config(rConfig);entryPointRequire(['"+clientCs+"'], function (mod) {if (!!window) {}mod.onClickButton(3,"+LeaseId+","+custId+","+subsidiary+");}); return false;\">";

                html_data+="<span class=\"material-symbols-outlined\">storefront</span></div>"+
                    "<div class='btnicon' title='PTP'" +
                    "onClick=\"var rConfig = JSON.parse('{}');rConfig['context'] = '"+clientCs+"';var entryPointRequire = require.config(rConfig);entryPointRequire(['"+clientCs+"'], function (mod) {if (!!window) {}mod.onClickButton(4,"+LeaseId+","+custId+","+subsidiary+");}); return false;\">";
                html_data+= " <span class=\"material-symbols-outlined\">" +
                    "dataset_linked" +
                    "</span></div>"+
                    "<div class='btnicon' title='B.Promise'" +
                    "onClick=\"var rConfig = JSON.parse('{}');rConfig['context'] = '"+clientCs+"';var entryPointRequire = require.config(rConfig);entryPointRequire(['"+clientCs+"'], function (mod) {if (!!window) {}mod.onClickButton(5,"+LeaseId+","+custId+","+subsidiary+");}); return false;\">";
                html_data+= "<span class=\"material-symbols-outlined\">" +
                    "dangerous\n" +
                    "</span></div>"+
                    "<div class='btnicon' title='Note'" +
                    "onClick=\"var rConfig = JSON.parse('{}');rConfig['context'] = '"+clientCs+"';var entryPointRequire = require.config(rConfig);entryPointRequire(['"+clientCs+"'], function (mod) {if (!!window) {}mod.onClickButton(6,"+LeaseId+","+custId+","+subsidiary+");}); return false;\">";
                html_data+= "<span class=\"material-symbols-outlined\">note_alt</span></div>"+
                    "<div class='btnicon' title='Follow up'" +
                    "onClick=\"var rConfig = JSON.parse('{}');rConfig['context'] = '"+clientCs+"';var entryPointRequire = require.config(rConfig);entryPointRequire(['"+clientCs+"'], function (mod) {if (!!window) {}mod.onClickButton(7,"+LeaseId+","+custId+","+subsidiary+");}); return false;\">";
                html_data+= "<span class=\"material-symbols-outlined\">\n" +
                    "notifications\n" +
                    "</span></div>"+
                    "<div class='btnicon' title='OFR'" +
                    "onClick=\"var rConfig = JSON.parse('{}');rConfig['context'] = '"+clientCs+"';var entryPointRequire = require.config(rConfig);entryPointRequire(['"+clientCs+"'], function (mod) {if (!!window) {}mod.onClickButton(8,"+LeaseId+","+custId+","+subsidiary+");}); return false;\">";
                html_data+="<span class=\"material-symbols-outlined\">" +
                    "dataset_linked" +
                    "</span></div>"+

                    "</div>" + //divrowIconlease Icon END

                    "<div class='divrowlease'>" +

                    "<input type='hidden' id='SHA_RUN_S_"+i+"_"+custId+"' value='1'/>"+
                    "<input type='hidden' id='SHA_RUN_CLOCKIN_S_"+i+"_"+custId+"' value='1'/>"+


                    "<div class='divTableSHA'  style='width:1000px;'>" +
                    "<div class='divTableBodySHA'>" +

                    "<div class='divTableRowSHA' style='background: beige;font-weight: bold;font-size: 12px;'>" +
                    "<div class='ShaBold divTableCellSHA'></div>" +
                    "<div class='ShaBold divTableCellSHA'>Lease #</div>" +
                    "<div class='ShaBold divTableCellSHA'>Total Outstanding</div>" +
                    "<div class='ShaBold divTableCellSHA'>Total Paid</div>" +
                    "<div class='ShaBold divTableCellSHA'>Future outstanding</div>" +
                    "<div class='ShaBold divTableCellSHA'>Toll Info</div>" +
                    "<div class='ShaBold divTableCellSHA'>Other Charges</div>" +
                    "</div>"+

                    "<div class='divTableRowSHA' style='color:black;background:azure; font-weight: bold;font-size: 12px;'>" +
                    "<div class='divTableCellSHA' style='cursor:pointer; max-width:30px;' " +
                    // "onClick='expand_thrdLevel(1);'>" +
                    "onClick=\"var rConfig = JSON.parse('{}');rConfig['context'] = '"+clientCs+"';var entryPointRequire = require.config(rConfig);entryPointRequire(['"+clientCs+"'], function (mod) {if (!!window) {}mod.callThirdClientFunction("+i+","+custId+","+LeaseId+");}); return false;\">";
                // html_data+= "<img src='https://tstdrv1064792.app.netsuite.com/core/media/media.nl?id=118205&c=TSTDRV1064792&h=8dwrHW5zEIJaEV0cx4AtV41zGAoxY58-SDDvR_32f3ArbRZH' width='20px' height='20px'/>" +
                html_data+= "\n" +
                    "<span id='span_s_"+i+"_"+custId+"' class=\"material-symbols-outlined\">\n" +
                    "add_circle\n" +
                    "</span>" +
                    "</div>" +
                    "<div class='divTableCellSHA'>"+LeaseName+"</div>" +
                    "<div class='divTableCellSHA'>"+outstanding+"</div>" +
                    "<div class='divTableCellSHA'>"+paidAmount+"</div>" +
                    "<div class='divTableCellSHA'>"+futureOutStanding+"</div>" +
                    "<div class='divTableCellSHA'>"+tollamount+"</div>" +
                    "<div class='divTableCellSHA'>"+otheramount+"</div>" +
                    "</div>"+


                    "<div style='display:none;width:10px;' id='DIVARJ_TR_S_"+i+"_"+custId+"'>" +
                    "<div id='DIVARJ_S_"+i+"_"+custId+"' style='border:aliceblue;'></div>" +
                    "</div>"+

                    "</div>" +
                    "</div>" +

                    "</div>" + //divrowlease END
                    "</div>"; /// customer_child END




            }

          //html_data+="</div>";

            document.getElementById("DIVARJ_F_"+id).innerHTML	=	html_data;
            var content	=	document.getElementById("DIVARJ_F_"+id);
            content.style.maxHeight = "1000px";
            /*setTimeout(function() {

            }, 8000);*/
        }

        function expand_thrdLevel(id,custId,leaseId){
            var PArabObj = {
                "custparam_type": 3,
                "custparam_custid":custId ,
                "custparam_leaseid":leaseId ,

            };
            var urlop = url.resolveScript({
                scriptId: "customscript_advs_ss_collection_dash_bac",
                deploymentId: "customdeploy_advs_ss_collection_dash_bac",
                params: PArabObj
            });
            // showProgressDialog('InProgress', 'Please wait...');
            https.request.promise({
                method: https.Method.GET,
                url: urlop
            }).then(function (response) {
                if (response.code == 200) {
                     advsObj.hideProcessingMessage();
                    var Values = response.body;
                    if (Values) {
                        var jsonD = JSON.parse(Values);
                        if(jsonD != null && jsonD != undefined && jsonD != ""){
                            generatethirdLines(id,jsonD,custId);
                        }
                    }
                }
            }).catch(function onRejected(reason) {
                alert(reason);
            });

          /*  var html_data			=	"";

            html_data			+=""+
                "<div class='divTableSHA'  style='width:1000px;'>" +
                "<div class='divTableBodySHA'>" +
                "<div class='divTableRowSHA' style='background: beige;font-weight: bold;font-size: 14px;'>" +
                "<div class='ShaBold divTableCellSHA'>View</div>" +
                "<div class='ShaBold divTableCellSHA'>Tranid</div>" +
                "<div class='ShaBold divTableCellSHA'>Date</div>" +
                "<div class='ShaBold divTableCellSHA'>Document #</div>" +
                "<div class='ShaBold divTableCellSHA'>Amount</div>" +
                // "<div class='ShaBold divTableCellSHA'>No of Broken Promise</div>" +
                // "<div class='ShaBold divTableCellSHA'>No of payment Post Date</div>" +
                // "<div class='ShaBold divTableCellSHA'>Insurance</div>" +
                // "<div class='ShaBold divTableCellSHA'>Total Unapplied Payments</div>" +
                "</div>";

            html_data+="" +
                /!*   "<input type='text' id='SHA_RUN_S_"+id+"' value='1'/>"+
                   "<input type='hidden' id='SHA_RUN_CLOCKIN_"+id+"' value='1'/>"+*!/
                "<div class='divTableRowSHA' style='color:black;background:azure; font-weight: bold;font-size: 12px;'>" +


                "<div class='divTableCellSHA'></div>" +
                "<div class='divTableCellSHA'>120</div>" +
                "<div class='divTableCellSHA'>80</div>" +
                "<div class='divTableCellSHA'>120</div>" +
                "<div class='divTableCellSHA'>120</div>" +
                // "<div class='divTableCellSHA'>10</div>" +
                // "<div class='divTableCellSHA'>120</div>" +
                // "<div class='divTableCellSHA'>30</div>" +
                // "<div class='divTableCellSHA'>100</div>" +

                "</div>";



            html_data+="" +
                "</div>" +
                "</div>";

            document.getElementById("DIVARJ_S_"+id+"").innerHTML	=	html_data;

            setTimeout(1000,function(){
                var content	=	document.getElementById("DIVARJ_S_"+id+"");
                //content.style.maxHeight = content.scrollHeight + "px";
            });

            var RunSearch	=	document.getElementById("SHA_RUN_S_"+id+"").value;

            if(RunSearch == 1){
                document.getElementById("SHA_RUN_S_"+id+"").value	=	0;
                document.getElementById("DIVARJ_TR_S_"+id+"").style.display	=	"block";
            }else{
                document.getElementById("SHA_RUN_S_"+id+"").value	=	1;
                document.getElementById("DIVARJ_TR_S_"+id+"").style.display	=	"none";
            }
*/
        }

        function generatethirdLines(id,jsonD,custId){

            var html_data ="";
            html_data			+=""+
                "<div class='divTableSHA'  style='width:1000px;'>" +
                "<div class='divTableBodySHA'>" +
                "<div class='divTableRowSHA' style='background: beige;font-weight: bold;font-size: 12px;'>" +
                // "<div class='ShaBold divTableCellSHA'>View</div>" +
                "<div class='ShaBold divTableCellSHA'>Tranid</div>" +
                "<div class='ShaBold divTableCellSHA'>Date</div>" +
                "<div class='ShaBold divTableCellSHA'>Invoice Type</div>" +
                "<div class='ShaBold divTableCellSHA'>Amount</div>" +
                "<div class='ShaBold divTableCellSHA'>Amount Remaining</div>" +
                "</div>";
            for(var i=0;i<jsonD.length;i++) {
                var dataV = jsonD[i];

                var invId   = dataV.id;
                var tranid  = dataV.tranid;
                var type    = dataV.type;
                var date    = dataV.date;
                var amount  = dataV.amount;
               var amountdue= dataV.amountdue;


                var invUrl  =   url.resolveRecord({recordType:"invoice",recordId:invId})


                html_data+="" +
                    /*   "<input type='text' id='SHA_RUN_S_"+id+"' value='1'/>"+
                "<input type='hidden' id='SHA_RUN_CLOCKIN_"+id+"' value='1'/>"+*/
                "<div class='divTableRowSHA' style='color:black;background:azure; font-weight: bold;font-size: 12px;'>" +


                // "<div class='divTableCellSHA'><a href='"+invUrl+"'>view</a></div>" +
                "<div class='divTableCellSHA'><a href='"+invUrl+"' target=\"_blank\">"+"Invoice" +" "+"#"+tranid+"</a></div>" +
                "<div class='divTableCellSHA'>"+date+"</div>" +
                "<div class='divTableCellSHA'>"+type+"</div>" +
                "<div class='divTableCellSHA'>"+amount+"</div>" +
                "<div class='divTableCellSHA'>"+amountdue+"</div>" +

                "</div>";


            }
            html_data+="" +
                "</div>" +
                "</div>";

            document.getElementById("DIVARJ_S_"+id+"_"+custId+"").innerHTML	=	html_data;

            var content	=	document.getElementById("DIVARJ_S_"+id+"_"+custId+"");
            console.log(content);
            //content.style.maxHeight = content.scrollHeight + "px";


        }

        function getCustomerInitalData(custid,from,to){
            var CustomerArray   =   [];
            var from=from;
            var to =to;
            var today   =   new Date();

            var fromDate = new Date(today);
            fromDate.setDate(today.getDate() - from);
            var toDate = new Date(today);
            toDate.setDate(today.getDate() - to);

            //startDate  EndDate
            var EndDate      =   format.format({type:format.Type.DATE,value:fromDate});
            var startDate    =   format.format({type:format.Type.DATE,value:toDate});
            log.debug("fromDateStr",startDate+"=>"+EndDate);

            var CustArr  =   [];
            var invoiceSearchObj = search.create({
                type: "invoice",
                filters:
                    [
                        ["type","anyof","CustInvc"],
                        "AND",
                        ["amountremaining","greaterthan","0.00"],
                        "AND",
                        ["trandate","within",startDate,EndDate]
                        ,"AND",
                        ["custbody_advs_lease_head","noneof","@NONE@"]
                    ],
                columns:
                    [
                        search.createColumn({
                            name: "altname",
                            join: "customer",
                            summary: "GROUP",
                            label: "Name"
                        }),
                        search.createColumn({
                            name: "email",
                            join: "customer",
                            summary: "GROUP",
                            label: "Email"
                        }),
                        search.createColumn({
                            name: "mobilephone",
                            join: "customer",
                            summary: "GROUP",
                            label: "Mobile Phone"
                        }),
                        search.createColumn({
                            name: "amountremaining",
                            summary: "SUM",
                            label: "Amount"
                        }),
                        search.createColumn({
                            name: "internalid",
                            join: "customer",
                            summary: "GROUP",
                            label: "Name"
                        })
                    ]
            });
            var searchResultCount = invoiceSearchObj.runPaged().count;

            invoiceSearchObj.run().each(function(result){

                var custID  =   result.getValue({
                    name: "internalid",
                    join: "customer",
                    summary: "GROUP",
                });
                var custName  =   result.getValue({
                    name: "altname",
                    join: "customer",
                    summary: "GROUP",
                });
                var email  =   result.getValue({
                    name: "email",
                    join: "customer",
                    summary: "GROUP",
                });
                var mobile  =   result.getValue({
                    name: "mobilephone",
                    join: "customer",
                    summary: "GROUP",
                });
                var amountrem  =   result.getValue({
                    name: "amountremaining",
                    summary: "SUM",
                })*1;
                if(email == "- None -"){email="";}
                if(mobile == "- None -"){mobile="";}
                var obj =   {};
                obj.id      = custID;
                obj.custname    = custName;
                obj.email       = email;
                obj.mobile      = mobile;
                obj.amount      = amountrem;

                CustomerArray.push(obj);

                CustArr.push(custID);
                return true;
            });

            if(CustArr.length>0){
                getLeascountSearh(CustArr);
            }

            return CustomerArray;
        }

        function getCustomerTaskInitalData(custid,taskType){
            var CustomerArray   =   [];
            var CustArr  =   [];
            var tasksearchObj = search.create({
                type: "task",
                filters:
                    [
                        // ["inactive","is","F"]
                        // ,"AND",
                        ["custevent_advs_mm_task_type","anyof",taskType]
                    ],
                columns:
                    [
                        search.createColumn({
                            name: "altname",
                            join: "companyCustomer",
                            label: "Name"
                        }),
                        search.createColumn({
                            name: "email",
                            join: "companyCustomer",
                            label: "Email"
                        }),
                        search.createColumn({
                            name: "mobilephone",
                            join: "companyCustomer",
                            label: "Mobile Phone"
                        }),
                        search.createColumn({
                            name: "custevent_advs_ptp_amount",
                            label: "Amount"
                        }),
                        search.createColumn({
                            name: "internalid",
                            join: "companyCustomer",
                            label: "Name"
                        })
                    ]
            });
            var searchResultCount = tasksearchObj.runPaged().count;

            tasksearchObj.run().each(function(result){

                var custID  =   result.getValue({
                    name: "internalid",
                    join: "companyCustomer",
                });
                var custName  =   result.getValue({
                    name: "altname",
                    join: "companyCustomer",
                });
                var email  =   result.getValue({
                    name: "email",
                    join: "companyCustomer",
                });
                var mobile  =   result.getValue({
                    name: "mobilephone",
                    join: "companyCustomer",
                });
                var amountrem  =   result.getValue({
                    name: "custevent_advs_ptp_amount",
                })*1;
                if(email == "- None -"){email="";}
                if(mobile == "- None -"){mobile="";}
                var obj =   {};
                obj.id      = custID;
                obj.custname    = custName;
                obj.email       = email;
                obj.mobile      = mobile;
                obj.amount      = amountrem;

                CustomerArray.push(obj);

                CustArr.push(custID);
                return true;
            });

            if(CustArr.length>0){
                getLeascountSearh(CustArr);
            }

            return CustomerArray;
        }

        var customerLeaseData   = [];
        function getLeascountSearh(CustArr){
            var rentCount   =   0;
            var searchHeader = search.create({
                type: "customrecord_advs_lease_header",
                filters:
                    [
                        ["custrecord_advs_l_h_customer_name","anyof",CustArr],
                        "AND",
                        ["custrecord_advs_l_h_status","anyof","5","4"]
                    ],
                columns:
                    [
                        search.createColumn({
                            name: "internalid",
                            summary: "COUNT",
                            label: "Internal ID"
                        }),
                        search.createColumn({
                            name: "custrecord_advs_l_h_customer_name",
                            summary: "GROUP",
                        })
                    ]
            });
            searchHeader.run().each(function(result){
                var count   =   result.getValue({
                    name: "internalid",
                    summary: "COUNT",
                    label: "Internal ID"
                });
                var custId   =   result.getValue({
                    name: "custrecord_advs_l_h_customer_name",
                    summary: "GROUP",
                    label: "Internal ID"
                });

                customerLeaseData[custId] = new Array();
                customerLeaseData[custId]["count"] =    count;
                return true;
            });

            return rentCount;
        }

        function addCommasnew(x) {
            x = x.toString();
            var pattern = /(-?\d+)(\d{3})/;
            while (pattern.test(x))
                x = x.replace(pattern, "$1,$2");
            return x;
        }

        function showProgressDialog(Title, message)
        {
            try
            {
                Ext.MessageBox.show({
                    title: Title,
                    msg: message,
                    width:300,
                    wait:true,
                    waitConfig:{

                        interval:200,
                    }
                });
            }catch(e){

            }
        }
        function getInvoicesDetails(custID){
            var tempInvoiceType = [];
            var invoiceSearchObj = search.create({
                type: "invoice",
                filters:
                    [
                        ["type","anyof","CustInvc"],
                        "AND",
                        ["mainline","is","T"]
                        ,"AND",
                        ["entity","anyof",custID]
                    ],
                columns:
                    [
                        search.createColumn({
                            name: "custbody_advs_invoice_type",
                            summary: "GROUP",
                            label: "Invoice Type"
                        }),
                        search.createColumn({
                            name: "amountremaining",
                            summary: "SUM",
                            label: "Amount Remaining"
                        }),
                        search.createColumn({
                            name: "formulacurrency",
                            summary: "SUM",
                            formula: "CASE WHEN {item.custitem_advs_inventory_type} = 'Other Charges' THEN {amount} ELSE 0 END",
                            label: "Formula (Currency)"
                        })
                    ]
            })
            invoiceSearchObj.run().each(function(result){
                var invType =   result.getValue({ name: "custbody_advs_invoice_type",
                    summary: "GROUP"});
                var remain =   result.getValue({name: "amountremaining",
                    summary: "SUM"})*1;

                tempInvoiceType[invType] = [];
                tempInvoiceType[invType]["remain"] = remain;

                return true;
            });

            return tempInvoiceType;
        }


        function getLeaseInformation(custID){
            var leaseData   =   [];
            var searchHeader = search.create({
                type: "customrecord_advs_lease_header",
                filters:
                    [
                        ["custrecord_advs_l_h_customer_name","anyof",custID],
                        "AND",
                        ["custrecord_advs_l_h_status","anyof","5","4"]
                    ],
                columns:
                    [
                        search.createColumn({
                            name: "name",
                        }),
                        search.createColumn({
                            name: "internalid",
                        }),
                        search.createColumn({
                            name: "custrecord_advs_l_h_subsidiary",
                        })
                    ]
            });
            searchHeader.run().each(function(result){
                var name            =   result.getValue({name:"name"});
                var id              =   result.getValue({name:"internalid"});
                var subsiID         =   result.getValue({name:"custrecord_advs_l_h_subsidiary"});

                var obj =   {};
                obj.id   = id;
                obj.name = name;
                obj.subsidiary = subsiID;
                leaseData.push(obj);
                return true;
            });

            return leaseData;
        }

        function getOutstandingbyLease(leaseID){
            var LeaseChArr  =   [];
            var leaseChild = search.create({
                type: "customrecord_advs_lm_lease_card_child",
                filters:
                    [
                        ["custrecord_advs_lm_lc_c_link","anyof",leaseID]

                    ],
                columns:
                    [
                        search.createColumn({
                            name: "custrecord_advs_lm_lc_c_link",
                            summary: "GROUP",
                            label: "Lease Card Link"
                        }),
                        search.createColumn({
                            name: "custrecord_advs_r_p_sche_pay",
                            summary: "SUM",
                            label: "Scheduled Payment"
                        }),
                        search.createColumn({
                            name: "internalid",
                            summary: "COUNT",
                            label: "Internal ID"
                        }),
                        search.createColumn({
                            name: "formulanumeric1",
                            summary: "SUM",
                            formula: "CASE WHEN {custrecord_advs_r_p_invoice} <> ' ' THEN 1 ELSE 0 END",
                            label: "Formula (Numeric)"
                        }),
                        search.createColumn({
                            name: "formulanumeric2",
                            summary: "SUM",
                            formula: "CASE WHEN {custrecord_advs_r_p_invoice} = ' ' THEN 1 ELSE 0 END",
                            label: "Formula (Numeric)"
                        })
                    ]
            });
            leaseChild.run().each(function(result){
                var amount          =   result.getValue({name:"custrecord_advs_r_p_sche_pay",summary:"SUM"});
                var count           =   result.getValue({name:"internalid",summary:"COUNT"});
                var LeaseLink       =   result.getValue({name:"custrecord_advs_lm_lc_c_link",summary:"GROUP"});

                var invoiceCount    =   result.getValue({name:"formulanumeric1",summary:"SUM"});
                var futureSched     =   result.getValue({name:"formulanumeric2",summary:"SUM"});

                LeaseChArr[LeaseLink] = [];
                LeaseChArr[LeaseLink]["amount"] = amount;
                LeaseChArr[LeaseLink]["count"] = count;

                LeaseChArr[LeaseLink]["invcount"] = invoiceCount;
                LeaseChArr[LeaseLink]["futcount"] = futureSched;

                return true;
            });

            return LeaseChArr;
        }

        function getOutstandingbyCus(custId){
            var LeaseChArr  =   [];
            var leaseChild = search.create({
                type: "customrecord_advs_lm_lease_card_child",
                filters:
                    [
                        ["custrecord_advs_lm_lc_c_link.custrecord_advs_l_h_customer_name","anyof",custId],
                        "AND",
                        ["custrecord_advs_r_p_invoice","anyof","@NONE@"]
                    ],
                columns:
                    [
                        search.createColumn({
                            name: "custrecord_advs_l_h_customer_name",
                            join:"custrecord_advs_lm_lc_c_link",
                            summary: "GROUP",
                            label: "Lease Card Link"
                        }),
                        search.createColumn({
                            name: "custrecord_advs_r_p_sche_pay",
                            summary: "SUM",
                            label: "Scheduled Payment"
                        }),
                        search.createColumn({
                            name: "internalid",
                            summary: "COUNT",
                            label: "Internal ID"
                        })
                    ]
            });
            leaseChild.run().each(function(result){
                var amount      =   result.getValue({name:"custrecord_advs_r_p_sche_pay",summary:"SUM"});
                var count       =   result.getValue({name:"internalid",summary:"COUNT"});
                var LeaseLink   =   result.getValue({name:"custrecord_advs_l_h_customer_name",join:"custrecord_advs_lm_lc_c_link",summary:"GROUP"});

                LeaseChArr[LeaseLink] = [];
                LeaseChArr[LeaseLink]["amount"] = amount;
                LeaseChArr[LeaseLink]["count"] = count;

                return true;
            });

            return LeaseChArr;
        }

        function getpaidamountbyLease(LeaseId){

            filterArr.push(["isinactive","is","F"]);
            filterArr.push("AND");
            filterArr.push(["custrecord_advs_r_p_invoice","noneof","@NONE@"]);
            if(LeaseId){
                filterArr.push("AND");
                filterArr.push(["custrecord_advs_lm_lc_c_link","anyof",LeaseId]);
            }


            var LeasepaidArr  =   [];
            var leaseChild = search.create({
                type: "customrecord_advs_lm_lease_card_child",
                filters:filterArr,
                columns:
                    [
                        search.createColumn({
                            name: "custrecord_advs_lm_lc_c_link",
                            summary: "GROUP",
                            label: "Lease Card Link"
                        }),
                        search.createColumn({
                            name: "custrecord_advs_r_p_sche_pay",
                            summary: "SUM",
                            label: "Scheduled Payment"
                        }),
                        search.createColumn({
                            name: "internalid",
                            summary: "COUNT",
                            label: "Internal ID"
                        })
                    ]
            });
            leaseChild.run().each(function(result){
                var amount =   result.getValue({name:"custrecord_advs_r_p_sche_pay",summary:"SUM"});
                var count  =   result.getValue({name:"internalid",summary:"COUNT"});

                var LeaseLink   =   result.getValue({name:"custrecord_advs_lm_lc_c_link",summary:"GROUP"});


                LeasepaidArr[LeaseLink] = [];
                LeasepaidArr[LeaseLink]["amount"] = amount;
                LeasepaidArr[LeaseLink]["count"] = count;
                return true;
            });

            return LeasepaidArr;
        }
        var filterArr   =   new Array();

        function getTollAmountbyLease(LeaseId){
            var TollLeaseArray  =   [];
            var invoiceSearchObj = search.create({
                type: "invoice",
                filters:
                    [
                        ["type","anyof","CustInvc"],
                        "AND",
                        ["mainline","is","T"],
                        "AND",
                        ["custbody_advs_invoice_type.custrecord_advs_inv_type_sbtype","anyof",libUtil.rentalinvoiceType.lease_toll],
                        "AND",
                        ["custbody_advs_lease_head","anyof",LeaseId]
                    ],
                columns:
                    [
                        search.createColumn({
                            name: "custbody_advs_lease_head",
                            summary: "GROUP",
                            label: "Invoice Type"
                        }),
                        search.createColumn({
                            name: "amountremaining",
                            summary: "SUM",
                            label: "Amount Remaining"
                        }),
                        search.createColumn({
                            name: "formulacurrency",
                            summary: "SUM",
                            formula: "CASE WHEN {item.custitem_advs_inventory_type} = 'Other Charges' THEN {amount} ELSE 0 END",
                            label: "Formula (Currency)"
                        })
                    ]
            });
            var searchResultCount = invoiceSearchObj.runPaged().count;
            invoiceSearchObj.run().each(function(result){

                var amount =   result.getValue({name:"amountremaining",summary:"SUM"});
                var LeaseLink   =   result.getValue({name:"custbody_advs_lease_head",summary:"GROUP"});
                TollLeaseArray[LeaseLink] = new Array();
                TollLeaseArray[LeaseLink]["amount"] = amount;

                return true;
            });
            return TollLeaseArray;
        }
        function getTollAmountbyCus(custId){
            var TollLeaseArray  =   [];
            var invoiceSearchObj = search.create({
                type: "invoice",
                filters:
                    [
                        ["type","anyof","CustInvc"],
                        "AND",
                        ["mainline","is","T"],
                        "AND",
                        ["custbody_advs_invoice_type.custrecord_advs_inv_type_sbtype","anyof",libUtil.rentalinvoiceType.lease_toll],
                        "AND",
                        ["name","anyof",custId]
                    ],
                columns:
                    [
                        search.createColumn({
                            name: "name",
                            summary: "GROUP",
                            label: "Invoice Type"
                        }),
                        search.createColumn({
                            name: "amountremaining",
                            summary: "SUM",
                            label: "Amount Remaining"
                        }),
                        search.createColumn({
                            name: "formulacurrency",
                            summary: "SUM",
                            formula: "CASE WHEN {item.custitem_advs_inventory_type} = 'Other Charges' THEN {amount} ELSE 0 END",
                            label: "Formula (Currency)"
                        })
                    ]
            });
            var searchResultCount = invoiceSearchObj.runPaged().count;
            invoiceSearchObj.run().each(function(result){

                var amount =   result.getValue({name:"amountremaining",summary:"SUM"});
                var LeaseLink   =   result.getValue({name:"name",summary:"GROUP"});
                TollLeaseArray[LeaseLink] = new Array();
                TollLeaseArray[LeaseLink]["amount"] = amount;

                return true;
            });
            return TollLeaseArray;
        }

        function getpaidamountbyCus(custId){

            var filterArr  = [];
            filterArr.push(["isinactive","is","F"]);
            filterArr.push("AND");
            filterArr.push(["custrecord_advs_r_p_invoice","noneof","@NONE@"]);
            if(custId){
                filterArr.push("AND");
                filterArr.push(["custrecord_advs_lm_lc_c_link.custrecord_advs_l_h_customer_name","anyof",custId]);
            }

            var LeasepaidArr  =   [];
            var leaseChild = search.create({
                type: "customrecord_advs_lm_lease_card_child",
                filters:filterArr,
                columns:
                    [
                        search.createColumn({
                            name: "custrecord_advs_l_h_customer_name",
                            join:"custrecord_advs_lm_lc_c_link",
                            summary: "GROUP",
                            label: "Lease Card Link"
                        }),
                        search.createColumn({
                            name: "custrecord_advs_r_p_sche_pay",
                            summary: "SUM",
                            label: "Scheduled Payment"
                        }),
                        search.createColumn({
                            name: "internalid",
                            summary: "COUNT",
                            label: "Internal ID"
                        })
                    ]
            });
            leaseChild.run().each(function(result){
                var amount =   result.getValue({name:"custrecord_advs_r_p_sche_pay",summary:"SUM"});
                var count  =   result.getValue({name:"internalid",summary:"COUNT"});

                var LeaseLink   =   result.getValue({name:"custrecord_advs_l_h_customer_name",join:"custrecord_advs_lm_lc_c_link",summary:"GROUP"});


                LeasepaidArr[LeaseLink] = [];
                LeasepaidArr[LeaseLink]["amount"] = amount;
                LeasepaidArr[LeaseLink]["count"] = count;
                return true;
            });

            return LeasepaidArr;
        }


        function getOtherChargebyLease(LeaseId){
            var otherChargeLease  =   [];
            var invoiceTypeArr  =   [libUtil.rentalinvoiceType.lease_toll,libUtil.rentalinvoiceType.lease_reqular];
            var invoiceSearchObj = search.create({
                type: "invoice",
                filters:
                    [
                        ["type","anyof","CustInvc"],
                        "AND",
                        ["mainline","is","T"],
                        "AND",
                        ["custbody_advs_invoice_type","noneof",invoiceTypeArr],
                        "AND",
                        ["custbody_advs_lease_head","anyof",LeaseId]
                    ],
                columns:
                    [
                        search.createColumn({
                            name: "custbody_advs_lease_head",
                            summary: "GROUP",
                            label: "Invoice Type"
                        }),
                        search.createColumn({
                            name: "amountremaining",
                            summary: "SUM",
                            label: "Amount Remaining"
                        }),
                        search.createColumn({
                            name: "formulacurrency",
                            summary: "SUM",
                            formula: "CASE WHEN {item.custitem_advs_inventory_type} = 'Other Charges' THEN {amount} ELSE 0 END",
                            label: "Formula (Currency)"
                        })
                    ]
            });
            var searchResultCount = invoiceSearchObj.runPaged().count;
            log.debug("invoiceSearchObj result count",searchResultCount);
            invoiceSearchObj.run().each(function(result){

                var amount =   result.getValue({name:"amountremaining",summary:"SUM"});
                var LeaseLink   =   result.getValue({name:"custbody_advs_lease_head",summary:"GROUP"});
                otherChargeLease[LeaseLink] = [];
                otherChargeLease[LeaseLink]["amount"] = amount;

                return true;
            });
            return otherChargeLease;
        }

        function getOtherChargebyCus(custId){
            var otherChargeLease  =   [];
            var invoiceTypeArr  =   [libUtil.rentalinvoiceType.lease_toll,libUtil.rentalinvoiceType.lease_reqular];
            var invoiceSearchObj = search.create({
                type: "invoice",
                filters:
                    [
                        ["type","anyof","CustInvc"],
                        "AND",
                        ["mainline","is","T"],
                        "AND",
                        ["custbody_advs_invoice_type","noneof",invoiceTypeArr],
                        "AND",
                        ["entity","anyof",custId]
                    ],
                columns:
                    [
                        search.createColumn({
                            name: "entity",
                            summary: "GROUP",
                            label: "Invoice Type"
                        }),
                        search.createColumn({
                            name: "amountremaining",
                            summary: "SUM",
                            label: "Amount Remaining"
                        }),
                        search.createColumn({
                            name: "formulacurrency",
                            summary: "SUM",
                            formula: "CASE WHEN {item.custitem_advs_inventory_type} = 'Other Charges' THEN {amount} ELSE 0 END",
                            label: "Formula (Currency)"
                        })
                    ]
            });
            var searchResultCount = invoiceSearchObj.runPaged().count;
            log.debug("invoiceSearchObj result count",searchResultCount);
            invoiceSearchObj.run().each(function(result){

                var amount =   result.getValue({name:"amountremaining",summary:"SUM"});
                var LeaseLink   =   result.getValue({name:"entity",summary:"GROUP"});
                otherChargeLease[LeaseLink] = [];
                otherChargeLease[LeaseLink]["amount"] = amount;

                return true;
            });
            return otherChargeLease;
        }
                function getLeaseInvoiceInfo(LeaseId){
                    var LeaseInvoiceArr = new Array();
                    var invoiceSearchObj = search.create({
                        type: "invoice",
                        filters:
                            [
                                ["type","anyof","CustInvc"],
                                "AND",
                                ["custbody_advs_lease_head","anyof",LeaseId],
                                "AND",
                                ["mainline","is","T"]
                            ],
                        columns:
                            [
                                search.createColumn({name: "internalid", label: "Internal ID"}),
                                search.createColumn({name: "tranid", label: "Document Number"}),
                                search.createColumn({name: "custbody_advs_invoice_type", label: "Invoice Type"}),
                                search.createColumn({name: "trandate", label: "Date"}),
                                search.createColumn({name: "amount", label: "Amount"}),
                                search.createColumn({name: "amountremaining", label: "AmountDue"})
                            ]
                    });
                    var searchResultCount = invoiceSearchObj.runPaged().count;
                    log.debug("invoiceSearchObj result count",searchResultCount);
                    invoiceSearchObj.run().each(function(result){
                        var invId   =   result.getValue({name: "internalid"});
                        var tranid  =   result.getValue({name: "tranid"});
                        var type    =   result.getText({name: "custbody_advs_invoice_type"});
                        var date    =   result.getValue({name: "trandate"});
                        var amount  =   result.getValue({name: "amount"});
                        var amountdue  =result.getValue({name: "amountremaining"});

                        var obj =   {};
                        obj.id          = invId;
                        obj.tranid      = tranid;
                        obj.type        = type;
                        obj.date        = date;
                        obj.amount      = amount;
                        obj.amountdue   = amountdue;
                        LeaseInvoiceArr.push(obj);

                        return true;
                    });
                    return LeaseInvoiceArr;
                }

                function getcollectiondays(){

                    var collectionArr = new Array();
                    var collectionSearchObj = search.create({
                        type: "customrecord_advs_collec_dash_date",
                        filters:
                            [
                                ["isinactive","is","F"]
                            ],
                        columns:
                            [
                                search.createColumn({name: "internalid", label: "Internal ID",sort:search.Sort.ASC}),
                                search.createColumn({name: "custrecord_advs_c_d_d_from"}),
                                search.createColumn({name: "custrecord_advs_c_d_d_to"}),
                            ]
                    });
                    var searchResultCount = collectionSearchObj.runPaged().count;
                    collectionSearchObj.run().each(function(result){
                        var from_s   =   result.getValue({name: "custrecord_advs_c_d_d_from"});
                        var to_s   =   result.getValue({name: "custrecord_advs_c_d_d_to"});


                        var obj =   {};
                        obj.from          = from_s;
                        obj.to            = to_s;
                        collectionArr.push(obj);

                        return true;
                    });
                    return collectionArr;

                }

                function fetchTaskDatabyCust(customer){
            var taskArr =   [];
                    var taskSearchObj = search.create({
                        type: "task",
                        filters:
                            [
                                ["company","anyof",customer]
                            ],
                        columns:
                            [
                                search.createColumn({
                                    name: "custevent_advs_mm_task_type",
                                    summary: "GROUP",
                                    label: "Task Type"
                                }),
                                search.createColumn({
                                    name: "internalid",
                                    summary: "COUNT",
                                    label: "Internal ID"
                                })
                            ]
                    });
                    var searchResultCount = taskSearchObj.runPaged().count;
                    taskSearchObj.run().each(function(result){
                        var type = result.getValue({name: "custevent_advs_mm_task_type",
                            summary: "GROUP"});
                        var taskCount = result.getValue({name: "internalid",
                            summary: "COUNT"});

                        taskArr[type]   =   new Array();
                        taskArr[type]["count"]   =  taskCount;
                        return true;
                    });
                    return taskArr;
                }

        return {generateFirstHtml,expandFirstLevel,
            expand_secLevel,
            expand_thrdLevel,
            getInvoicesDetails,
            getLeaseInformation,
            getpaidamountbyLease,
            getOutstandingbyLease,
            getTollAmountbyLease,
            getOtherChargebyLease,
            generatethirdLines,
            getLeaseInvoiceInfo,
            getOutstandingbyCus,
            getpaidamountbyCus,
            getTollAmountbyCus,
            getOtherChargebyCus,
            getcollectiondays,
            fetchTaskDatabyCust,
            getCustomerTaskInitalData
        }

    });