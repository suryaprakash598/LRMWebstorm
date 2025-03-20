/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
define(['N/log', 'N/query', 'N/ui/serverWidget','N/https'],
    /**
     * @param{log} log
     * @param{query} query
     * @param{serverWidget} serverWidget
     */
    (log, query, serverWidget,https) => {
        /**
         * Defines the Suitelet script trigger point.
         * @param {Object} scriptContext
         * @param {ServerRequest} scriptContext.request - Incoming request
         * @param {ServerResponse} scriptContext.response - Suitelet response
         * @since 2015.2
         */
        const onRequest = (scriptContext) => {
			
						
            if (scriptContext.request.method == "GET") {

                var form = serverWidget.createForm({title: "Service Dashboard", hideNavBar: false});
				
                var htmlFldObj = form.addField({
                    type: serverWidget.FieldType.INLINEHTML,
                    id: "custpage_html_fld",
                    label: "HTML"
                });

                var htmlData = "";

                htmlData += "" +
                    "<html lang='en'>" +
                    "  <head>" +
                    "    <!-- Required meta tags -->" +
                    "    <meta charset='utf-8'>" +
                    "    <meta name='viewport' content='width=device-width, initial-scale=1, shrink-to-fit=no'>" +
                    "    <title>Dashboard</title>" +
                    "" +
                    "    <script src='https://8760954.app.netsuite.com/core/media/media.nl?id=4941&c=8760954&h=6tIzjKX9Hp2Wgp26AM7W5KXfaT57Ag5SZewzV3SB7_AvFgKM&_xt=.js'></script>" +
                    "    <script src='https://8760954.app.netsuite.com/core/media/media.nl?id=5470&c=8760954&h=m43VE89bUCOQPrSQEELZXt8h1VI48b9MnzU4ovT1zbpco9f9&_xt=.js'></script>" +
                    "    <script src='https://code.jquery.com/ui/1.12.1/jquery-ui.min.js' integrity='sha256-VazP97ZCwtekAsvgPBSUwPFKdrwD3unUfSGVYrahUqU=' crossorigin='anonymous'></script>" +
                    "    <script src='https://8760954.app.netsuite.com/core/media/media.nl?id=5472&c=8760954&h=vimGl8Nmu4Cw4JpF8xenSIswdCmun_CHGuX-3Y-1D4BqGMSD&_xt=.js'></script>" +
                    "    <script src='https://8760954.app.netsuite.com/core/media/media.nl?id=25390&c=8760954&h=gEq-uPoKiAidJyipKP6SdGP4VnZBL0B6t9n7czG5I_9ojwxo&_xt=.js'></script>" +
					"	<link href='https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/css/select2.min.css' rel='stylesheet' />"+
					"	<script src='https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/js/select2.min.js'></script>"+

                    "    <!-- Layout styles -->" +
                    "    <link rel='stylesheet' href='https://8760954.app.netsuite.com/core/media/media.nl?id=4942&c=8760954&h=76NHre7p7XZQNWLdxGHaq--7oPMNP93ZQclqiDZLPL6SdDBS&_xt=.css'>" +
                    "    <!-- End Layout styles -->" +

                     "    <link rel='stylesheet' href='https://8760954.app.netsuite.com/core/media/media.nl?id=4967&c=8760954&h=SUZxcn5tw90GglAA6A6DER-N_YVFqIpf7OTWpVSBKr67pvZM&_xt=.css'>" +
                     "    <link rel='stylesheet' href='https://8760954.app.netsuite.com/core/media/media.nl?id=5471&c=8760954&h=2Kw5ivxAxl5o7PGVi4O93DFqMvNKLsauCKFPKdCSpsfFKBCL&_xt=.css'>" +
                      // "<link rel=\"stylesheet\" href='https://8760954.app.netsuite.com/core/media/media.nl?id=14351&c=8760954&h=ORBq8V0emHOIhLRdI2a2xttYsYGW8kJkO8HxNVvKnnwq-48Q&_xt=.css'>" +
                  "    " +
                    "  </head>" +
                    "  <body >" +
                    "  <style>" +
                    "  .main-panel{" +
                    "  width:100% !important;" +
                    "  }" +
                    "" +

                    "#loader-overlay {" +
                    "  position: fixed;" +
                    "  top: 0;" +
                    "  left: 0;" +
                    "  width: 100%;" +
                    "  height: 100%;" +
                    "  background-color: rgba(255, 255, 255, 0.7);" +
                    "  z-index: 9999;" +
                    "  display: none;" +
                    "}" +
                    "" +
                    ".loader {" +
                    "  border: 16px solid #f3f3f3;" +
                    "  border-radius: 50%;" +
                    "  border-top: 16px solid #3498db;" +
                    "  width: 120px;" +
                    "  height: 120px;" +
                    "  -webkit-animation: spin 2s linear infinite;" +
                    "  animation: spin 2s linear infinite;" +
                    "  position: absolute;" +
                    "  top: 50%;" +
                    "  left: 50%;" +
                    "  margin-top: -60px;" +
                    "  margin-left: -60px;" +
                    "}" +

                    "" +
                    "  " +
                    "  </style>" +

                    "<div id=\"loader-overlay\">" +
                    "  <div class=\"loader\"></div>" +
                    "</div>" +
					"<div id='popup_package' class='popuptckt div_3d' style='width: 400px;height:400px; display: none;'>" +
                "" +
                "" +
                "" +
                "</div>" + 
					
				"<table id=\"filtersdiv\" border='0'>" + 
				"<tr>" + 
				"<td><div class='customerfilterdiv'></div></td>" + 
                "<td><div class='technicianfilterdiv'></div></td>" + 
				"<td></div> <div class='orderfilterdiv'></div> </td>" +  
				"<td><div class='vinfilterdiv'></div></td>" + 
                  "<td><div class='statusfilterdiv'></div></td>" + 
				"<td><div class='textboxfilterdiv'></div></td>" + 
				"</tr>" + 
				"</table>" + 

                    "    <div class='container-scroller' style='transform: scale(.7); transform-origin: 0 0;'>" +//
                    "      " +

                    "              <div class='col-md-12'>" +
                    "                ";

                htmlData += "                <div class='board-wrapper pt-5' id='main_job_contan_advs'>";

                // var responseData    =   https.post({url:"https://8760954.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=1670&deploy=1&compid=8760954&ns-at=AAEJ7tMQ2z58ss2ieqjEExdUkPIhTAVcQL3MRP8BMHmo3ko1uo4"});

                // log.emergency("responseData->"+responseData.code,responseData.body);

                // htmlData    +=  ""+responseData.body;
                
                htmlData += "                 " +
                    "          " +
                    "        </div>" +
                    "      </div>" +
                    "    </div>" +
                    "" ;

					

                 htmlData +=    "  </body>" +
                    "</html>";


                htmlFldObj.defaultValue = htmlData;

                scriptContext.response.writePage({pageObject: form});


            } else {


            }


        }
		
        return {onRequest}

    });
	