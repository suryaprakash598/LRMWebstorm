/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
define(['N/ui/serverWidget','N/search','N/cache','N/runtime','N/file'],
    /**
     * @param{serverWidget} serverWidget
     */
    (serverWidget,search,cache,runtime,file) => {
        /**
         * Defines the Suitelet script trigger point.
         * @param {Object} scriptContext
         * @param {ServerRequest} scriptContext.request - Incoming request
         * @param {ServerResponse} scriptContext.response - Suitelet response
         * @since 2015.2
         */
        const onRequest = (scriptContext) => {

            var vinIdFromParam  =   scriptContext.request.parameters.custpage_vin_id;
			var userObj = runtime.getCurrentUser(); 
			var currentUser = userObj.name;
            if(vinIdFromParam == null || vinIdFromParam == "null" || vinIdFromParam == undefined || vinIdFromParam == "undefined" || vinIdFromParam == "") {

                vinIdFromParam = 0;
            }else{

            }

            var myCache = cache.getCache({
                name: 'serviCeDash_undefined_undefined',
                scope: cache.Scope.PUBLIC
            });

            log.emergency("myCache",myCache);

            var  ExistingImages = myCache.get({key: 'images',loader: function () {
                    return null;
                }});

            var noOfImage   =   0;

            try {
                if(ExistingImages){
                    ExistingImages  =   JSON.parse(ExistingImages);

                    noOfImage   =   ExistingImages.items.length;
                }
            }catch (e) {

            }



            var htmlFld =   "";

            htmlFld     =   "<!DOCTYPE html> " +
                "<html lang='en'> " +
                "  <head> " +
                "    <!-- Required meta tags --> " +
                "    <meta charset='utf-8'> " +
                "     " +
                "    <title>Service Dashboard</title> " +
                "    <!-- plugins:css --> " +
                "    <link rel='stylesheet' href='https://8760954.app.netsuite.com/core/media/media.nl?id=11170&c=8760954&h=u4_v1RrF0J-glEKddAQQmoAbY_uqGubjNkEZRre_GncDc2Rs&_xt=.css'>     " +
                "    <link href=\"https://cdnjs.cloudflare.com/ajax/libs/select2/4.1.0-beta.1/css/select2.min.css\" rel=\"stylesheet\" />" +
                "    <!-- Layout styles --> " +
                "    <link rel='stylesheet' href='https://tstdrv1064792.app.netsuite.com/core/media/media.nl?id=225165&c=TSTDRV1064792&h=7Q2ZRglg5ix_LMJOi2qPsuEDzryk5mpn4sk4ifyQ2m1vDTev&_xt=.css'> " +
                "    <!-- End layout styles --> " +
                "<link rel='stylesheet' href='https://code.jquery.com/ui/1.13.3/themes/base/jquery-ui.css'>"+
                "    <!-- carousel styles --> " +
                "<link rel=\"stylesheet\" href=\"https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css\">" +
                "    <!-- End carousel styles --> " +
                "<link rel=\"stylesheet\" href='https://8760954.app.netsuite.com/core/media/media.nl?id=14351&c=8760954&h=ORBq8V0emHOIhLRdI2a2xttYsYGW8kJkO8HxNVvKnnwq-48Q&_xt=.css'>" +

                // "<link href=\"https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/css/select2.min.css\" rel=\"stylesheet\" />"+
                "<script src='https://code.jquery.com/jquery-3.6.0.js'></script>" +
                "  <script src='https://code.jquery.com/ui/1.13.2/jquery-ui.js'></script>" +
              "<script src='https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.13.7/underscore-min.js' ></script>"+
                "<script src=\"https://cdnjs.cloudflare.com/ajax/libs/select2/4.1.0-beta.1/js/select2.min.js\"></script>" +
                "<script src=\"https://8760954.app.netsuite.com/core/media/media.nl?id=13413&c=8760954&h=vbqh7HeKRjOOTTEA4srRjOqA5i4A4N841x_o0lGAig2cpLXx&_xt=.js\"></script>" +
				
                "<script src='https://8760954.app.netsuite.com/core/media/media.nl?id=11168&c=8760954&h=4TbRjE536iPz3t5yK74b0otaSQH1pRmfaryHOR0fnHQihXv6&_xt=.js'></script>" +
                "<script src='https://8760954.app.netsuite.com/core/media/media.nl?id=15884&c=8760954&h=1lS29C1uFpV9zzOQxxI5vwcX2bE3SOnEZno-OtaTj_DoMuA6&_xt=.js'></script>" +
                "  </head> " +
                "  <body > " +
				"  <span id='technicians-list' style='display:none;'></span> " +
				"  <input type='hidden' id='customeronview'> " +
				"  <input type='hidden' id='customerlocationid'> " +
				"  <input type='hidden' id='customerdeptid'> " + 
				"  <span  id='customeronviewname'></span> " +
				"  <span  id='customeronviewlocationname'></span> " +
				"  <span  id='customeronviewdepartmentname'></span> " +
                "<div id='trainingModal' class='modal'>" +
                "    <div class='modal-header sidepanelfontClass' style='background-color: #3a0967; color: white; justify-content: space-around !important;'></div>" +
                "    <div class='modal-body sidepanelfontClass'></div>" +
                "    <div class='modal-footer' style='padding: 0px;'>" +
                "      <button id='prevButton' class='btn btn-outline-info btn-icon-text modal-footer-blue'><i class='fa fa-backward '></i></button>" +
                "      <button id='nextButton' style='margin-left: 30px; margin-right: 30px;' class='btn btn-outline-info modal-footer-blue btn-icon-text '><i class='fa fa-forward '></i></button>" +
                "      <button id='stopButton' style='margin-right: 40px;' class='btn btn-outline-danger modal-footer-red btn-icon-text '><i class='fa fa-stop '></i></button>" +
                "    </div>" +
                "  </div>"+

                "<div id='loader-overlay'>" +
                "  <div class='loader'>" +
                "<img src='https://8760954.app.netsuite.com/core/media/media.nl?id=13430&c=8760954&h=PP86_U6h0blgiu6mQzLuwA0lEoyWXbpADwI-3NcqU4g4RGc-'/>" +
                "</div>" +
                "</div>" +
                "<div class='tooltip-overlay'></div>" +
                "" +
                "<div id=\"popup\" class=\"popup div_3d\"></div>" +
                "" +
                "<div id='popup_package' class='popup div_3d' style='width: 1000px;height: 900px; display: none;'>" +
                "" +
                "" +
                "" +
                "</div>" + 


				"<div id='popup_orderlist' class='popup div_3d' style='width: 1000px;height: 600px; '>" ;
               var orderlistfile =  file.load({id:16600});
			   var orderlistfilecontent = orderlistfile.getContents();
				htmlFld  +=orderlistfilecontent;
               htmlFld+= "</div>"+
                "" +
                "<div id='custpage_a_add_multi_page' class='popupMulti div_3d' style='display: none;'>" +
                "   <button type='button' class='btn btn-gradient-success no-wrap ms-4  multiAddpopupButton' id='custpage_a_add_multy_submit'>Add Items</button> " +
                "   <button type='button' class='btn btn-inverse-dark btn-fw multiAddpopupButton' id='custpage_a_add_multy_close'>Close</button> " +
                // "   <button type='button' class='btn btn-inverse-dark btn-fw' id='custpage_a_add_cust_top_10'>Customer Top 10</button> " +
                // "   <button type='button' class='btn btn-inverse-dark btn-fw' id='custpage_a_add_cust_recent_10'>Customer Recent 10</button> " +
                // "   <button type='button' class='btn btn-inverse-dark btn-fw' id='custpage_a_add_top_10'>Top 10</button> " +
                "" +
                "" +
                "<div class='btn-group' role='group' aria-label='Basic example'> " +
                "                            <button type='button' class='btn btn-outline-secondary multiAddpopupButton' id='custpage_a_add_cust_top_10'>Cust : Top 10</button> " +
                "                            <button type='button' class='btn btn-outline-secondary multiAddpopupButton' id='custpage_a_add_cust_recent_10'>Cust : Recent 10</button> " +
                "                            <button type='button' class='btn btn-outline-secondary multiAddpopupButton' id='custpage_a_add_top_10'>Top 10</button> " +
                "                          </div>" +
                "" +
                "" +
                "<input type='hidden' id='custpage_current_add_multy_sec_id' value=''/>" +
                "" +
                "    <div class='row' style='margin-top:10px; padding:0px 8px 0px 18px; ' > " +
                "              <div class='col-md-6 grid-margin stretch-card' style='height:350px;max-height:350px;padding : 0px 0px;border-style: groove; border-color: #ffe9e9; border-width:1.5px;'> " +
                "                <div class='card' style='max-height:350px; overflow:scroll;scrollbar-width: none;-ms-overflow-style: none;'> " +
                "                  <div class='card-body' style='padding: 2px 2px;'> " +
                "                    <div class='clearfix' style='margin-top: -15px;margin-left: 10px;'> " +
                "                      <h4 class=' float-start sidepanelfontClass'>Item search</h4>                       " +
                "                    </div> " +

                "                   <div class='d-fsm-lex border-bottom'> " +
                "                      <div class='d-flex align-items-center'> " +
                "                        <input type='text' class='form-control w-30 tooltip-table' placeholder='Search' style='padding: 10px; width: 250px;' id='custpage_search_item_text'> " +

                // "                   <div>" +
                "               <select id='custpage_type_multi' style='padding: 10px; width: 100px; margin-left: 20px;font-weight: bold;' class='tooltip-table'>" +

                "               <option value='3'>Labor</option> " +
                "                <option value='2'>Parts</option> " +
                "               <option value='4'>Sublet</option> " +
                "              </select>" +

                "                        <button type='button' class='btn btn-gradient-success no-wrap ms-4 multiAddpopupButton' id='custpage_search_item_button'>Search Items</button> " +
                // "</div>"+
                "                      </div> " +
                "                    </div>" +
                "" +
                "" +
                "<div id='loadingIndicator_item_search' class='loadingIndicatorClass' style='top:20% !important;'></div>" +//Loader for other Vehicle
                "<div id='custpage_item_result'>" +

                "</div>" +
                "" +
                ""+
                "                  </div> " +
                "                </div> " +
                "              </div> " +
                "      " +
                "      " +
                "      " +
                "              <div class='col-md-6 grid-margin stretch-card' style='max-height:350px; margin-left:0px; padding : 0px 0px 0px 18px;border-style: groove; border-color: #ffe9e9; border-width:1.5px;'> " +
                "                <div class='card' style='max-height:350px; overflow:scroll;scrollbar-width: none;-ms-overflow-style: none;'> " +
                "                  <div class='card-body' style='padding: 2px 2px; height:150px;'> " +
                "                    <div class='clearfix' style='margin-top: -15px;margin-left: 10px;'> " +
                "                    <h4 class='sidepanelfontClass'>Selected Items</h4> " +
                "     </div> " +
                "<div id='loadingIndicator_item_added' class='loadingIndicatorClass' style='top:20% !important;'></div>" +//Loader for other Vehicle
                "     <div id='custpage_selected_item'> " +


                "                    </div> " +
                "                  " +
                "                  </div> " +
                "                </div> " +
                "              </div> " +
                "      " +
                "            </div> " +
                "</div>" +
                "" +
                "" +
                ""+


                "<div class='tooltip' id='custpage_customer_tooltip'> </div>" +
                 "<div class='tooltip' id='custpage_history_notrequired_tooltip'> </div>" +
                  "<div class='tooltip' id='custpage_history_notrequired_tooltip1'> </div>" +
                "<div class='tooltip' id='custpage_open_order_tooltip'></div>" +
                "<div class='tooltip' id='custpage_open_quote_tooltip'> </div>" +
                "<div class='tooltip' id='custpage_other_vehicle_tooltip'></div>" +
                "<div class='tooltip' id='custpage_vehicle_tooltip'></div>" +
                "<div class='tooltip' id='custpage_history_tooltip' style='overflow-y: auto;'></div>" +


                "<input type='hidden' id='selected_vehicle_id' name='selected_vehicle_id' value='"+vinIdFromParam+"'/>" +
                "    <div class='container-scroller'> " +
                "       " +
                "      <!-- partial:partials/_navbar.html --> " +
                "      <nav class='navbar default-layout-navbar col-lg-12 col-12 p-0 fixed-top d-flex flex-row'> " +
                "         " +
                "        <div class='navbar-menu-wrapper d-flex align-items-stretch'> " +
                "           " +
                "     " +
                "          <ul class='navbar-nav ' style='flex-direction: row !important;align-items: center !important; display: flex !important;list-style: none;'> " +
                "     " +
                "            <li class='nav-item nav-profile dropdown sidepanelfontClass' style='margin-left: -50px;'>               " +
                "                <div class='nav-profile-text' style='display:flex;'> " +
                "                  <div class='sidepanelfontClass' style='color:#66a1ff; font-weight:bold; margin: 1px 10px 10px 10px; font-family:'ubuntu-medium', sans-serif;' id='custpage_estimate' name='custpage_estimate'>Estimate</div>       " +
                "        <div class='checkbox-wrapper-25'> " +
                "     <input type='checkbox' id='custpage_select_est_ord' name='custpage_select_est_ord' onchange='markSelectOrder()'> " +
                "     </div> " +
                "      <div class='sidepanelfontClass' style='color:#918888; font-weight:100; margin: 1px 10px 10px 10px; font-family:'ubuntu-medium', sans-serif;' id='custpage_order' name='custpage_order'>Order</div> " +
                "                </div>                            " +
                "            </li> " +
                "    " +
                "    <li class='nav-item dropdown' style='margin-left:10px;margin-top:5px;'> " +
                "    <button data-repeater-create='' id='orderlistview' type='button' class='btn btn-gradient-info btn-sm icon-btn ms-2 mb-2 headerbuttonStyle' style='background:linear-gradient(to right, #151616, #151616 99%) !important;'> " +
                "                <i class='fa-solid fa-list headerbuttonIconStyle'></i> " +
                "                </button>              " +
                "            </li> " +
				"    <li class='nav-item dropdown' style='margin-left:10px;margin-top:5px;'> " +
                "    <button data-repeater-create='' type='button' id='printorder' class='btn btn-gradient-info btn-sm icon-btn ms-2 mb-2 headerbuttonStyle' style='display:none;background:linear-gradient(to right, #151616, #151616 99%) !important;'> " +
                "                <i class='mdi mdi-printer headerbuttonIconStyle'></i> " +
                "                </button>              " +
                "            </li> " +

                "    <li class='nav-item dropdown' style='margin-left:10px;margin-top:5px;' id='curdoperationblock'> " +
                "    <button data-repeater-create='' type='button'  id='custpage_save' class='btn btn-gradient-info btn-sm icon-btn ms-2 mb-2 headerbuttonStyle' style='background:linear-gradient(to right, #151616, #151616 99%) !important;'> " +
                "                <i class='fa fa-save headerbuttonIconStyle'></i> " +
                "                </button>              " + 
				"    <button data-repeater-create='' type='button'  id='custpage_edit' class='btn btn-gradient-info btn-sm icon-btn ms-2 mb-2 headerbuttonStyle' style='display:none;background:linear-gradient(to right, #151616, #151616 99%) !important;'> " +
                "                <i class='fa fa-edit headerbuttonIconStyle'></i> " +
                "                </button>              " + 
				"    <button data-repeater-create='' type='button'  id='custpage_new' class='btn btn-gradient-info btn-sm icon-btn ms-2 mb-2 headerbuttonStyle' style='display:none;background:linear-gradient(to right, #151616, #151616 99%) !important;'> " +
                "                <i class='fa-solid fa-pen headerbuttonIconStyle'></i> " +
                "                </button>              " +
                "            </li> " +

                "    " +
                "    " +
                "   <li style='margin-left:20px;'>    " +
                "   <div class='search-field d-none d-md-block seachbaarwidth' >             " +
                "              <div class='input-group'> " +
                // "                <div class='input-group-prepend bg-transparent'> " +
                // "                  <i class='input-group-text border-0 mdi mdi-magnify headerbuttonIconStyle' id='custpage_search_button'></i> " +
                // "                </div> " +
                "                <input type='text' class='form-control bg-transparent border-0  mainsearchbox' id='search_text' placeholder='Search VIN / Body / Serial / Unit / Attachment' > " +
                "<div id='custpage_no_of_result' class='input-group-prepend bg-transparent iconFontSize' style='padding: 0px 4px 0px 4px; font-weight: bolder;color: #1b8dbf;'> </div>     " +

                "                <input type='text' class='form-control bg-transparent border-0  mainsearchbox' id='search_customer_text' placeholder='Search Customer' > " +
                "         </div>             " +
                "   </div> " +
                "   </li> " +
                "    " +
                "    " +
                "    " +
                "            <li class='nav-item dropdown' style='margin-left:8px;margin-top:5px;'> " +
                "    <button data-repeater-create='' type='button' class='btn btn-gradient-info btn-sm icon-btn ms-2 mb-2 headerbuttonStyle' style='background:linear-gradient(to right, #151616, #151616 99%) !important;'> " +
                "     <i class='mdi mdi-plus headerbuttonIconStyle'></i> " +
                "                </button>              " +
                "            </li> " +

                "            <li class='nav-item dropdown' style='margin-left:8px;margin-top:5px;'> " +
                "    <button data-repeater-create='' id='custpage_collapse_all' type='button' class='btn btn-gradient-info btn-sm icon-btn ms-2 mb-2 headerbuttonStyle' style='background:linear-gradient(to right, #151616, #151616 99%) !important;'> " +
                "     <i class='fa fa-chevron-up headerbuttonIconStyle'></i> " +
                "                </button>              " +
                "            </li> " +

                "            <li class='nav-item dropdown' style='margin-left:8px;margin-top:5px;'> " +
                "    <button data-repeater-create='' id='custpage_fold_all' type='button' class='btn btn-gradient-info btn-sm icon-btn ms-2 mb-2 headerbuttonStyle' style='background:linear-gradient(to right, #151616, #151616 99%) !important;'> " +
                "     <i class='fa fa-chevron-down headerbuttonIconStyle'></i> " +
                "                </button>              " +
                "            </li> " +

                "  <div style='display: flex;'>               " +//Open Order Estimate pill Start
                "<div id='loadingIndicatorPill' class='loadingIndicatorClass'></div>" +//Loader for Open Order Estimate

                "<div class='badge badge-outline-info badge-pill tooltip-trigger'  data-tooltip-id='custpage_open_order_tooltip' id='custpage_open_order_count_main' style='display: none;margin-left: 20px; font-weight: bold; '>" +
                "<p  id='custpage_open_order_count' style='margin: 0px 0px 0px 0px;' class='sidepanelfontClass'></p>" +
                "</div>" +



                "<div class='badge badge-outline-info badge-pill tooltip-trigger' data-tooltip-id='custpage_open_quote_tooltip'  id='custpage_open_quote_count_main' style='display: none;margin-left: 20px; font-weight: bold; '>" +
                "<p  id='custpage_open_quote_count' style='margin: 0px 0px 0px 0px;' class='sidepanelfontClass'></p>" +
                "</div>" +
                "</div>                 " +//Open Order Estimate pill End

                "<div>" +
                "" +
                "<div id='loadingIndicatorPill_other_vehicle' class='loadingIndicatorClass'></div>" +//Loader for other Vehicle

                "<div class='badge badge-outline-info badge-pill tooltip-trigger'  data-tooltip-id='custpage_other_vehicle_tooltip' id='custpage_other_vehile_count_main' style='display: none;margin-left: 20px; font-weight: bold;'>" +
                "<p  id='custpage_other_vehicle_count' style='margin: 0px 0px 0px 0px;' class='sidepanelfontClass'></p>" +

                "</div>" +
                "" +
                "</div>"+
				 "  <div>               " +//Open Order Estimate pill Start
                "<div id='loadingIndicatorPill_number' class='loadingIndicatorClass'></div>" +//Loader for Open Order Estimate

                "<div class='badge badge-outline-info badge-pill tooltip-trigger'  data-tooltip-id='custpage_open_order_docnumber_tooltip' id='custpage_open_order_docnumer_main' style='display: none;margin-left: 20px; font-weight: bold; '>" +
                "<p  id='custpage_open_order_docnumber' data-recid=0 style='margin: 0px 0px 0px 0px;' class='sidepanelfontClass'></p>" +
                "</div>" +



                "<div class='badge badge-outline-info badge-pill tooltip-trigger' data-tooltip-id='custpage_open_quote_docnumber_tooltip'  id='custpage_open_quote_docnumer_main' style='display: none;margin-left: 20px; font-weight: bold; '>" +
                "<p  id='custpage_open_quote_docnumber' style='margin: 0px 0px 0px 0px;' class='sidepanelfontClass'></p>" +
                "</div>" +
                "</div>                 " +//Open Order Estimate pill End
				
				"<div class='badge badge-outline-info badge-pill tooltip-trigger' data-tooltip-id='custpage_parts_requistion_tooltip'  id='custpage_parts_requistion_main' style='display: none;margin-left: 20px; font-weight: bold; '>" +
                "<p  id='custpage_parts_requistion' style='margin: 0px 0px 0px 0px;' class='sidepanelfontClass'><i class='fa-solid fa-cart-plus'></i>PO</p>" +
                "</div>" +
                // "</div>                 " +//Open Order Estimate pill End
				
				"<div class='badge badge-outline-info badge-pill tooltip-trigger' data-tooltip-id='custpage_sublet_po_tooltip'  id='custpage_sublet_po_main' style='display: none;margin-left: 20px; font-weight: bold; '>" +
                "<p  id='custpage_sublet_po' style='margin: 0px 0px 0px 0px;' class='sidepanelfontClass'><i class='fa-solid fa-cart-plus'></i>Sublet</p>" +
                "</div>" +
                "</div>                 " +//Open Order Estimate pill End


                "     " +
                "          </ul> " +
                "          " +
                "        </div> " +
                "      </nav> " +
                "       " +
                "      <div class='container-fluid page-body-wrapper' style='padding-top:10px;'> " +
                "    " +
                "      " +
                "         " +
                "        <div class='main-panel' style='width:100%;'> " +
                "          <div class='content-wrapper' style='background-color:#f2f2f2; padding: 0px 0px;'> " +
                "             " +
                "    " +
                "   <div class='row' > " +
                "    " +
                "   <div class='col-md-12' style='display: flex;'> " +
                "" +
                "<div class='col-md-9' style='margin-right:10px;'>" +
                "    " +
                "   <div class='col-md-12' > " +
                "    " +
                "   <div class='alert alert-fill-primary alert_padding' role='alert' id='custpage_main_comment_notification' style='display: none;'> " +
                "                      <i class='mdi mdi-alert-circle sidepanelfontClass'></i>  " +
                "<div id='custpage_customer_comment' class='sidepanelfontClass'> </div> " +
                "                    </div> " +
                "    " +
                "   <div class='alert alert-fill-danger alert_padding' role='alert' id='custpage_main_notification' style='display: none;'> " +
                "                      <i class='mdi mdi-alert-circle sidepanelfontClass'></i> " +
                "<div id='custpage_customer_alert' class='sidepanelfontClass'> </div> " +
                " </div> " +
                "   </div> " +
                "    " +
                "    " +
                "   <div class='card card-statistics col-md-12' style='margin-top: 4px;'> " +


                "                  <div class='row mainiconTileHeight' > " +


                "                    <div class='card-col col-xl-3 col-lg-3 col-md-3 col-6 border-right' style='cursor: pointer;' id='custpage_customer_click'> " +
                "                      <div class='card-body' style='padding: 0px 0px;'> " +
                "                        <div class='d-flex align-items-center justify-content-center flex-column flex-sm-row'> " +
                "                          <i class='mdi mdi-account-multiple-outline text-primary me-0 me-sm-4 icon-lg mainiconFontSize'></i> " +
                "                          <div class='wrapper text-center text-sm-left'> " +
                "                            <div class='card-text mb-0 tooltip-trigger'  data-tooltip-id='custpage_customer_tooltip' style='font-size: 0.9375rem; font-weight: bold;'>" +
                "<p id='custpage_customer_name' class='sidepanelfontClass'></p> " +
                "<input type='hidden' id='custpage_customer_id' name='custpage_customer_id'/>" +
                "<input type='hidden' id='custpage_isinternalcustomer' name='custpage_isinternalcustomer'/>" +
                "" +
                "</div>" +
                "" +
                "                            <div class='fluid-container'> " +
                "                              <h3 class='mb-0 font-weight-medium'></h3> " +
                "                            </div> " +
                "                          </div> " +
                "                        </div> " +
                "                      </div> " +
                "                    </div> " +



                "                    <div class='card-col col-xl-2 col-lg-2 col-md-2 col-6 border-right' style='cursor: pointer;' id='custpage_vehicle_click'> " +
                "                      <div class='card-body' style='padding: 0px 0px;'> " +
                "                        <div class='d-flex align-items-center justify-content-center flex-column flex-sm-row'> " +
                "                          <i class='mdi mdi mdi-car text-primary me-0 me-sm-4 icon-lg mainiconFontSize'></i> " +
                "                          <div class='wrapper text-center text-sm-left'> " +
                "                            <div class='card-text mb-0 tooltip-trigger' data-tooltip-id='custpage_vehicle_tooltip' style='font-size: 13px;; font-weight: bold;'>" +
                "<p id='custpage_vin_number' class='sidepanelfontClass'></p> " +
                "" +
                "" +

                "</div>" +
                "" +
                "                            <div class='fluid-container'> " +
                "                              <h3 class='mb-0 font-weight-medium'></h3> " +
                "                            </div> " +
                "                          </div> " +
                "                        </div> " +
                "                      </div> " +
                "                    </div> " +



                // "                    <div class='card-col col-xl-3 col-lg-3 col-md-3 col-6 border-right' id='custpage_vehicle_history_click' style='cursor: pointer;'> " +
                "                    <div class='card-col col-xl-2 col-lg-2 col-md-2 col-6 border-right' id='custpage_ticket_dashboard_click' style='cursor: pointer;'> " +
                "                      <div class='card-body' style='padding: 0px 0px;'> " +
                "                        <div class='d-flex align-items-center justify-content-center flex-column flex-sm-row'> " +
                "                          <i class='mdi mdi-history text-primary me-0 me-sm-4 icon-lg mainiconFontSize'></i> " +
                "                          <div class='wrapper text-center text-sm-left'> " +
                "                            <div class='card-text mb-0  sidepanelfontClass' data-tooltip-id='custpage_history_notrequired_tooltip'  style='margin-top: 9px;'>Ticket Dashboard " +
                "" +
                "" +

                "</div>" +
                "" +
                "                            <div class='fluid-container'> " +
                "                              <h3 class='mb-0 font-weight-medium'></h3> " +
                "                            </div> " +
                "                          </div> " +
                "                        </div> " +
                "                      </div> " +
                "                    </div> " + 
				
				"                    <div class='card-col col-xl-2 col-lg-2 col-md-2 col-6 border-right' id='custpage_pricing_dashboard_click' style='cursor: pointer;'> " +
                "                      <div class='card-body' style='padding: 0px 0px;'> " +
                "                        <div class='d-flex align-items-center justify-content-center flex-column flex-sm-row'> " +
                "                          <i class='mdi mdi-history text-primary me-0 me-sm-4 icon-lg mainiconFontSize'></i> " +
                "                          <div class='wrapper text-center text-sm-left'> " +
                "                            <div class='card-text mb-0  sidepanelfontClass' id='custpage_history_notrequired_tooltip1' data-tooltip-id='custpage_history_notrequired_tooltip1'  style='margin-top: 9px;'>Pricing Matrix " +
                "" +
                "" +

                "</div>" +
                "" +
                "                            <div class='fluid-container'> " +
                "                              <h3 class='mb-0 font-weight-medium'></h3> " +
                "                            </div> " +
                "                          </div> " +
                "                        </div> " +
                "                      </div> " +
                "                    </div> " +




                "                    <div class='card-col col-xl-2 col-lg-2 col-md-2 col-6' id='custpage_last_order_click' style='cursor: pointer;'> " +
                "                      <div class='card-body' style='padding: 0px 0px;'> " +
                "                        <div class='d-flex align-items-center justify-content-center flex-column flex-sm-row'> " +
                "                          <i class='mdi mdi-yeast text-primary me-0 me-sm-4 icon-lg mainiconFontSize'></i> " +
                "                          <div class='wrapper text-center text-sm-left' style=' font-weight: bold;'> " +
                "                            <p class='card-text mb-0 sidepanelfontClass openreports'>Reports</p> " +
                "<input type='hidden' id='custpage_last_order' name='custpage_last_order'/>" +
                "                            <div class='fluid-container'> " +
                "                              <h3 class='mb-0 font-weight-medium'></h3> " +
                "                            </div> " +
                "                          </div> " +
                "                        </div> " +
                "                      </div> " +
                "                    </div> " +
                "                  </div> " +
                "                </div> " +
                "    " +
                "             " +
                "            <div class='row' style='margin-top:10px; padding:0px 8px 0px 18px;'> " +
                // "              <div class='col-md-5 grid-margin stretch-card' style='padding : 0px 0px;'> " +
                // "                <div class='card'> " +
                // "                  <div class='card-body' style='padding: 2px 2px;'> " +
                // "                    <div class='clearfix' style='margin-top: -15px;margin-left: 10px;'> " +
                // "                      <h4 class='card-title float-start'>Remark/Notes</h4>                       " +
                // "                    </div> " +
                // "                     <textarea class='form-control' style='font-size: 14px;' id='custpage_order_remark' rows='7' placeholder='Enter Remark/Notes'></textarea>" +
                // "                  </div> " +
                // "                </div> " +
                // "              </div> " +
                "      " +
                "      " +
                "      " +
                "              <div class='col-md-12 grid-margin stretch-card' style='padding : 0px 8px;'> " +
                "                <div class='card'> " +
                "                  <div class='card-body vehicleCustDetailsTab' style='padding: 2px 2px;'> " +
                "               <div id='custpage_cust_veh_details'>" +
                "                    <div class='clearfix' style='margin-top: -15px;margin-left: 10px;'> " +
                "                      <h4 class='mainiconFontSize float-start'>Customer/Vehicle Details</h4>                       " +
                "                    </div> " +

                "               </div> " +
                "                     " +
                "                     " +
                "                  </div> " +
                "                </div> " +
                "              </div> " +
                "      " +
                "      " +
                "            </div> ";


            /**
             * Job section start
             */
            htmlFld +=  "    " +
                "   <div class='row' style='margin-top:-30px;'> " +
                "    " +
                "   <div class='col-md-12 grid-margin stretch-card' style='height:max-content; '> " +
                "                <div class='card'> " +
                "                  <div class='card-body' style='padding: 2px 2px; '> " +
                "                    <div class='clearfix' style='margin-top: -15px;margin-left: 10px;'> " +
                "                    <h4 class='mainiconFontSize'>Action/Add</h4> " +
                "                  </div>   " +

                "<div id=\"sections-container\"></div> " +
 "<div id=\"sectionstech-container\"></div> " +

                "     <div style='display:flex;' class='mainoperations'> " +

                // "        <button type='button' class='btn btn-outline-info btn-icon-text' style='--bs-btn-padding-x:20px; width:100%;'> Parts  " +
                // "                          </button> " +
                //
                // "        <button type='button' class='btn btn-outline-info btn-icon-text' style='--bs-btn-padding-x:20px; width:100%;'> Labor  " +
                // "                          </button> " +
                "        <button type='button' class='btn btn-outline-info btn-icon-text sidepanelfontClass' style='--bs-btn-padding-x:20px; width:20%;' id = 'add-section'> Add Operation  " +
                "                          </button> " +

                "           <button type='button' class='btn btn-outline-info btn-icon-text sidepanelfontClass' style='--bs-btn-padding-x:20px; ; width:20%;' id = 'add-package'> Package  " +
                "                          </button> " +
                "         " +
                // "        <button type='button' class='btn btn-outline-info btn-icon-text' style='--bs-btn-padding-x:20px; width:100%;'> Sublets  " +
                // "                          </button> " +
                // "         " +
                // "        <button type='button' class='btn btn-outline-info btn-icon-text' style='--bs-btn-padding-x:20px; width:100%;'> Other Charges  " +
                // "                          </button> " +
                "         " +
                "        <button type='button' class='btn btn-outline-info btn-icon-text sidepanelfontClass' style='--bs-btn-padding-x:20px; width:20%;'> Deposit  " +
                "                          </button> " +
                "         " +

                "     </div> " +
                "                     " +
                "                  </div> " +
                "                </div> " +
                "" +
                "" +

                "" +
                "" +
                "              </div> " +
                "    " +
                "   </div> ";


            /**
             * Job section End
             */


            /**
             * Right side panel Start
             */
            htmlFld+= "   </div> " +

                "    <div class='col-md-3' > " +

                "       <div class='col-md-12 grid-margin stretch-card' style='margin-bottom:10px; margin-top: 4px;'> " +
                "                <div class='card'> " +
                "                  <div class='card-body' style='padding: 2px 2px; '> " +
                // "                   <div id='tabs'> " +
                // "                       <ul> " +
                // "                           <li><a href='#tabs-1'> </a></li> " +
                // "                       </ul> " +
                // "                               <div id='tabs-1'> "+



                "<div class=\"col-md-12\">" +
                "          <div class=\"card mb-12\" style='padding: 1px 18px 1px 1px;'>" +

                "            <div >" +
                "              <ol class=\"list-group list-group-flush\">" +

                "                <li class=\"list-group-item d-flex justify-content-between align-items-center border-0 px-0 pb-0 sidepanelfontClass\" style='color: #706b6b;'>" +
                "                  Total Parts" +
                "                  <span id='custpage_total_patrs_sum'>$ 0.00</span>" +
                "                </li>" +

                "                <li class=\"list-group-item d-flex justify-content-between align-items-center border-0 px-0 pb-0 sidepanelfontClass\" style='color: #706b6b;'>" +
                "                  Total Labor" +
                "                  <span id='custpage_total_lab_sum'>$ 0.00</span>" +
                "                </li>" +

                "                <li class=\"list-group-item d-flex justify-content-between align-items-center px-0 sidepanelfontClass\" style='border-width: 0px 0px 2px; color: #706b6b;'>" +
                "                  Total Sublet" +
                "                  <span id='custpage_total_sub_sum'>$ 0.00</span>" +
                "                </li>" +

                "                <li class=\"list-group-item d-flex justify-content-between align-items-center border-0 px-0 sidepanelfontClass\" style='color: blue;'>" +
                "                  <div>" +
                "                    <strong style='font-weight: 800;'>Subtotal</strong>" +
                "                  </div>" +
                "                  <span><strong style='font-weight: 800;' id='custpage_total_sub_total'>$ 0.00</strong></span>" +
                "                </li>" +

                "                <li class=\"list-group-item d-flex justify-content-between align-items-center border-0 px-0 pb-0 sidepanelfontClass\" style='color: #706b6b;'>" +
                "                  Discount" +
                "                  <span id='custpage_total_sub_discount'>$ 0.00</span>" +
                "                </li>" +

                "                <li class=\"list-group-item d-flex justify-content-between align-items-center border-0 px-0 pb-0 sidepanelfontClass\" style='color: #706b6b;'>" +
                "                  Shop Supplies" +
                "                  <span id='custpage_total_shop_supply'>$ 0.00</span>" +
                "                </li>" +
				
                "                <li class=\"list-group-item d-flex justify-content-between align-items-center border-0 px-0 pb-0 sidepanelfontClass\" style='color: #706b6b;'>" +
                "                  Core Charges" +
                "                  <span id='custpage_total_core_charges'>$ 0.00</span>" +
                "                </li>" +

                // "                <li class=\"list-group-item d-flex justify-content-between align-items-center border-0 px-0 pb-0\" style='color: #706b6b; font-weight: bold;font-size: 14px;'>" +
                // "                  EPA" +
                // "                  <span id='custpage_total_sub_epa'>$0.00</span>" +
                // "                </li>" +

                "                <li class=\"list-group-item d-flex justify-content-between align-items-center border-0 px-0 pb-0 sidepanelfontClass\" style='color: #706b6b;'>" +
                "                Fees" +
                "                  <span id='custpage_total_sub_fees'>$ 0.00</span>" +
                "                </li>" +

                "                <li class=\"list-group-item d-flex justify-content-between align-items-center px-0 sidepanelfontClass\" style='border-width: 0px 0px 2px; border-color: black;color: #706b6b;'>" +
                "                  Tax" +
                "                  <span id='custpage_total_sub_tax'>$ 0.00</span>" +
                "                </li>" +

                "                <li class=\"list-group-item d-flex justify-content-between align-items-center border-0 px-0 sidepanelfontClass\" style='color: blue;'>" +
                "                  <div>" +
                "                    <strong style='font-weight: 800;'>Grand Total</strong>" +
                "                  </div>" +
                "                  <span><strong style='font-weight: 800;' id='custpage_total_grand'>$ 0.00</strong></span>" +
                "                </li>" +

                "              </ol>" +
                "            </div>" +
                "          </div>" +
                "" +
                "" +
                "" +
                "" +
                "<div style=\"display: flex; padding: 10px 10px 10px 10px;\" class='sidepanelfontClass'> " +
                "                                 " +
                "                                <div > Discount</div> " +
                "                                 " +
                "                                <div style=\"margin-left: 20px;\"> " +
                "                                 " +
                "                                <div class=\"input-container\" data-suffix=\"$\"> " +
                "                                    <div class=\"view-mode\" id='custpage_job_disc_head_symbol'>0 $</div> " +
                "                                    <input type=\"number\" id=\"custpage_job_disc_head\" class=\"input-field\" style=\"display: none; width: 40px; padding: 2px;\" > " +
                "                                    <div class=\"dropdown-container\"> " +
                "                                        <div class=\"dropdown-content\"> " +
                "                                            <a href=\"#\" class=\"dropdown-option\" data-suffix=\"$\">$</a> " +
                "                                            <a href=\"#\" class=\"dropdown-option\" data-suffix=\"%\">%</a> " +
                "                                             " +
                "                                        </div> " +
                "                                    </div> " +
                "                                </div> " +
                "                                                                                           " +
                "                                </div> " +
                "                                 " +
                "                                 " +
                "                                 " +
                "                                <div style=\"margin-left: 20px;\"> Shop Supplies</div> " +
                "                                 " +
                "                                <div style=\"margin-left: 20px;\"> " +
                "                                <div class=\"input-container\" data-suffix=\"%\"> " +
                "                                <div class=\"view-mode\">0%</div> " +
                "                                <input type=\"number\" id=\"custpage_job_shop_head\" class=\"input-field\" style=\"display: none; margin-left: 20px; width: 40px;\"> " +
                "                                </div>                                 " +
                "                                </div> " +
                "                                 " +
                "                                 " +
                "                                <div style=\"margin-left: 20px;\"> Tax</div> " +
                "                                <div style=\"margin-left: 20px;\"> " +
                "                                <div class=\"input-container\" data-suffix=\"%\"> " +
                "                                <div class=\"view-mode\">0%</div> " +
                "                                <input type=\"number\" id=\"custpage_job_tax_head\" class=\"input-field\" style=\"display: none; margin-left: 20px; width: 40px;\" > " +
                "                                 " +
                "                                " +
                "                                 " +
                "                                </div>                                 " +
                "                                </div> " +
                "                                 " +
                "                                 " +
                "                                </div>" +
                "" +
                "" +
                "        </div>" +


                "                               </div> " +
                // "                   </div>" +
                // "                 </div> " +
                "       </div> " +
                "       </div> " +

                //profitability table
                "       <div class='col-md-12 grid-margin stretch-card' style='margin-bottom:10px;display:none;' id='profitability'> " +
                "                <div class='card'> " +
                "                  <div class='card-body' style='padding: 2px 2px; height:580px;'> " +

                "<div class=\"col-md-12\">" +
                "          <div class=\"card mb-12\" style='padding: 1px 18px 1px 1px;'>" +

                "            <div>" +
                "            <h3 style='padding-left: 100px;font-size:20px;'>Profit Report</h3>" +
				"            <div>" +
				"            <h3 style='padding-left: 60px;font-size:20px;'>Part</h3>" +
                "              <ol class=\"list-group list-group-flush\" style='border-top:1px solid;'>" + 
                "                <li class=\"list-group-item d-flex justify-content-between align-items-center border-0 px-0 pb-0 sidepanelfontClass\" style='color: #706b6b;'>" +
                "                 Retail Price" +
                "                  <span id='custpage_part_retail_price'>$0.00</span>" +
                "                </li>" +
				"                <li class=\"list-group-item d-flex justify-content-between align-items-center border-0 px-0 pb-0 sidepanelfontClass\" style='color: #706b6b;'>" +
                "                 Cost" +
                "                  <span id='custpage_part_retail_cost'>$0.00</span>" +
                "                </li>" +
				"                <li class=\"list-group-item d-flex justify-content-between align-items-center border-0 px-0 pb-0 sidepanelfontClass\" style='color: #706b6b;'>" +
                "                 Profit" +
                "                  <span id='custpage_part_retail_profit'>$0.00</span>" +
                "                </li>" +
                "                </ol>" + 
				"            </div>" +
				"            <div>" +
				"            <h3 style='padding-left: 60px;font-size:20px;'>Labor</h3>" +
				"              <ol class=\"list-group list-group-flush\" style='border-top:1px solid;'>" + 
                "                <li class=\"list-group-item d-flex justify-content-between align-items-center border-0 px-0 pb-0 sidepanelfontClass\" style='color: #706b6b;'>" +
                "                 Retail Price" +
                "                  <span id='custpage_labor_retail_price'>$0.00</span>" +
                "                </li>" +
				"                <li class=\"list-group-item d-flex justify-content-between align-items-center border-0 px-0 pb-0 sidepanelfontClass\" style='color: #706b6b;'>" +
                "                 Cost" +
                "                  <span id='custpage_labor_retail_cost'>$0.00</span>" +
                "                </li>" +
				"                <li class=\"list-group-item d-flex justify-content-between align-items-center border-0 px-0 pb-0 sidepanelfontClass\" style='color: #706b6b;'>" +
                "                 Profit" +
                "                  <span id='custpage_labor_retail_profit'>$0.00</span>" +
                "                </li>" +
                "                </ol>" +
					"            </div>" +
				"            <div>" +
				"            <h3 style='padding-left: 60px;font-size:20px;'>Sublet</h3>" +
				"              <ol class=\"list-group list-group-flush\" style='border-top:1px solid;'>" + 
                "                <li class=\"list-group-item d-flex justify-content-between align-items-center border-0 px-0 pb-0 sidepanelfontClass\" style='color: #706b6b;'>" +
                "                 Retail Price" +
                "                  <span id='custpage_sublet_retail_price'>$0.00</span>" +
                "                </li>" +
				"                <li class=\"list-group-item d-flex justify-content-between align-items-center border-0 px-0 pb-0 sidepanelfontClass\" style='color: #706b6b;'>" +
                "                 Cost" +
                "                  <span id='custpage_sublet_retail_cost'>$0.00</span>" +
                "                </li>" +
				"                <li class=\"list-group-item d-flex justify-content-between align-items-center border-0 px-0 pb-0 sidepanelfontClass\" style='color: #706b6b;'>" +
                "                 Profit" +
                "                  <span id='custpage_sublet_retail_profit'>$0.00</span>" +
                "                </li>" +
                "                </ol>" +
				"            </div>" +
                "       <div></div> " +
                "       </div> " +
                "       </div> " +
                "       </div> " +
                "       </div> " +
                "       </div> " +
                "       </div> " +
                //profitability table
				//profitability button table
                "       <div class='col-md-12 grid-margin stretch-card' style='margin-bottom:10px; '> " +
                "                <div class='card'> " +
                "                  <div class='card-body' style='padding: 2px 2px; height:80px;'> " +

                "<div class=\"col-md-12\">" +
                "          <div class=\"card mb-12\" style='padding: 1px 18px 1px 1px;'>" +

                "            <div >" + 
                "       <div><a href='#' onclick='openprofitability()' style='margin-left: 100px;width:340px;background-color:#151616;color:#ffffff;' class='btn' role='button'>Profitability</a></div> " +
                "       </div> " +
                "       </div> " +
                "       </div> " +
                "       </div> " +
                "       </div> " +
                "       </div> " +
                //profitability button table
				//authorize table
                "       <div class='col-md-12 grid-margin stretch-card' style='margin-bottom:10px; '> " +
                "                <div class='card'> " +
                "                  <div class='card-body' style='padding: 2px 2px; height:180px;'> " +

                "<div class=\"col-md-12\">" +
                "          <div class=\"card mb-12\" style='padding: 1px 18px 1px 1px;'>" +

                "            <div >" +
                "            <h3 style='padding-left: 100px;'>Authorization</h3>" +
                "              <ol class=\"list-group list-group-flush\">" +

                "                <li class=\"list-group-item d-flex justify-content-between align-items-center border-0 px-0 pb-0 sidepanelfontClass\" style='color: #706b6b;visibility:hidden;'>" +
                "                 Authorize" +
                "                  <span id='custpage_current_user_name'>$647.00</span>" +
                "                </li>" +
                "                </ol>" +

                "       <div style='display:inline-flex;'><a href='#' onclick='openauthorizationhistory()' style='margin-left: 104px; background-color: #151616;  color: white;  padding: 14px 25px;  text-align: center;  text-decoration: none;  display: inline-block;'>View Authorizations</a></div> " +
                "       <div style='display:inline-flex;'><a href='#' onclick='openauthorization()' style='margin-left: 75px;background-color: #151616;  color: white;  padding: 14px 25px;  text-align: center;  text-decoration: none;'>Authorize</a></div> " +
                "       </div> " +
                "       </div> " +
                "       </div> " +
                "       </div> " +
                "       </div> " +
                "       </div> " +
                //authorize table


                "       <div class='col-md-12 grid-margin stretch-card' style='margin-bottom:10px; '> " +
                "                <div class='card'> " +
                "                  <div class='card-body' style='padding: 2px 2px; height:500px;'> " +

                "<div class=\"col-md-12\">" +
                "          <div class=\"card mb-12\" style='padding: 1px 18px 1px 1px;'>" +

                "            <div >" +
                "              <ol class=\"list-group list-group-flush\">" +

                "                <li class=\"list-group-item d-flex justify-content-between align-items-center border-0 px-0 pb-0 sidepanelfontClass\" style='color: #706b6b;'>" +
                "                  Service Writer" +
                "                  <span id='custpage_current_user_name'>"+currentUser+"</span>" +
                "                </li>" +

                "                <li class=\"list-group-item d-flex justify-content-between align-items-center border-0 px-0 pb-0 sidepanelfontClass\" style='color: #706b6b;'>" +
                "                  Created Date" +
                "                   <div class=\"datetime-wrapper\"> " +
                "                       <input type=\"datetime-local\" id=\"custpage_current_date_time\" class=\"datetime-input sidepanelfontClass\" style='border:none !important; background:none !important; color: #706b6b; text-align: right;'> " +
                "                   </div>     " +
                "                </li>" +

                "                <li class=\"list-group-item d-flex justify-content-between align-items-center border-0 px-0 pb-0 sidepanelfontClass\" style='color: #706b6b;'>" +
                "                  PO #" +
                "                   <div > " +
                "                       <input type=\"text\" id=\"custpage_current_po_num\"  class='sidepanelfontClass' style='border:none !important; background:none !important; font-weight: bold; color: #706b6b; text-align: right;' placeholder='Enter PO #'> " +
                "                   </div>     " +
                "                </li>" +

                "                <li class=\"list-group-item d-flex justify-content-between align-items-center border-0 px-0 pb-0 sidepanelfontClass\" style='color: #706b6b;display:none !important;'>" +
                "                  Appointment" +
                "                <select id='custpage_order_status_sel' style='width: 300px;' class='sidepanelfontClass'></select>"+
                "                </li>" +

                "                <li class=\"list-group-item d-flex justify-content-between align-items-center border-0 px-0 pb-0 sidepanelfontClass\" style='color: #706b6b; ;'>" +
                "                  Status" +
                "<select id='custpage_order_completed' style='width: 300px;'></select>"+
                "                </li>" +

                "                <li class=\"list-group-item d-flex justify-content-between align-items-center border-0 px-0 pb-0 sidepanelfontClass\" style='color: #706b6b; ;'>" +
                "                  Location" +
                "<select id='custpage_order_location' style='width: 300px;'></select>"+
                "                </li>" +

                "                <li class=\"list-group-item d-flex justify-content-between align-items-center border-0 px-0 pb-0 sidepanelfontClass\" style='color: #706b6b; ;'>" +
                "                  Department" +
                "<select id='custpage_order_department' style='width: 300px;'></select>"+
                "                </li>" +

                "                <li class=\"list-group-item d-flex justify-content-between align-items-center border-0 px-0 pb-0 sidepanelfontClass\" style='color: #706b6b; ;'>" +
                "                  Mileage In" +
                "<input type=\"number\" id=\"custpage_current_mileage\"  style='border:none !important; background:none !important; font-weight: bold; color: #706b6b; text-align: right;' placeholder='Enter Mileage In'>"+
                "                </li>" +

                "              </ol>" +
                "            </div>" +
                "          </div>" +
                "          </div>" +

                ""+
                "                 </div> " +
                "       </div> " +
                "       </div> " +









                "    </div> ";

            /**
             * Right side panel Start
             */

            htmlFld+="    </div> " +


                "    " +
                "   </div> " +


                "                     " +
                "          </div> " +
                "     " +

                "      " +
                "    </div> " +
                "     " +
                "    </div> " +
                "     " +
                "    </div> " +
                "          " +
                "          " +
                "        </div> " +

                "<div class=\"container-fluid page-body-wrapper\"> " +
                "        <!-- partial:partials/_settings-panel.html --> " +
                "        <div class=\"right-sidebar-toggler-wrapper sidepanelfontClass\" > " +
                "          <div class=\"sidebar-toggler\" style='background-color: black;color: white;' id=\"settings-trigger\"><i class=\"fa fa-info-circle\"></i></div> " +
                "          <div class=\"sidebar-toggler\" style='background-color: black;color: white;' id=\"chat-toggler\"><i class=\"mdi mdi-chat-processing\"></i></div> " +
                // "          <div class=\"sidebar-toggler\"><i class=\"mdi mdi-file-document-outline\"></i></div> " +
                // "          <div class=\"sidebar-toggler\"><i class=\"mdi mdi-cart\"></i></div> " +
                "        </div>" +
                "</div>" +
                "" +
                "" +
                "<div id=\"right-sidebar\" class=\"settings-panel\" > " +
                "          <div style='height: 30px;" +
                "    width: 30px;" +
                "    margin-left: 407px; cursor: pointer; font-size: 16px;' class='settings-close'>  " +
                "           X" +
                "           </div> " +
                "          " +
                "          <div  id=\"setting-content_1\" style='font-size: 15px;'> " +
                "          </div> " +
                "        </div>" +

                "        <!-- main-panel ends --> " +
                "      </div> " +
                "   " +

                "      <!-- page-body-wrapper ends --> " +
                "    </div> " +
                "     " +
                "  " +




                " <script> " +
                "  " +
                "" +
                "" +
                "" +
                "" +
                " function markSelectOrder(){ " +
                "  " +
                " var checkData = document.getElementById('custpage_select_est_ord').checked; " +
                "  " +
                " if(checkData){ " +
                "  " +
                " var estObj = document.getElementById('custpage_estimate'); " +
                " estObj.style.color='#918888'; " +
                " estObj.style.fontWeight='100'; " +
                "  " +
                " var ordObj = document.getElementById('custpage_order'); " +
                " ordObj.style.color='#6cf'; " +
                " ordObj.style.fontWeight='bold'; " +
                "  " +
                " }else{ " +
                "  " +
                " var estObj = document.getElementById('custpage_estimate'); " +
                " estObj.style.color='#66a1ff'; " +
                " estObj.style.fontWeight='bold'; " +
                "  " +
                " var ordObj = document.getElementById('custpage_order'); " +
                " ordObj.style.color='#918888'; " +
                " ordObj.style.fontWeight='100'; " +
                "  " +
                " } " +
                "  " +
                " } " +
                "  " +


                "  " +
                "        $(document).ready(function() { " +
                "" +
                "" +
                " $('.nav-settings').click(function() { " +
                "      $('#right-sidebar').toggleClass('open'); " +
                "    }); " +
                "    $('.settings-close').click(function() { " +
                "      $('#right-sidebar,#theme-settings,#layout-settings').removeClass('open'); " +
                "    }); " +
                " " +
                " $('.openSidepannel').on('click', function () { " +
                "      $('#right-sidebar').addClass('open'); " +
                "    });" +
                "" +
                "" +
                "" +
                "if ($('#sortable-table-1').length) { " +
                "      $('#sortable-table-1').tablesort(); " +
                "    }" +

                "if ($('#sortable-table-2').length) { " +
                "      $('#sortable-table-2').tablesort(); " +
                "    }" +
                "" +
                "" +
                "$('#tabs' ).tabs();" +
                "$('#tabs2' ).tabs();" +
                "" +
                "" +
                "            let files = []; " +
                " " +
                "function removeAllImage() {" +
                "" +
                "console.log(files);" +
                "" +
                "for(d=files.length-1; d>=0; d--) {" +
                "                    files.splice(d, 1);" +
                "                }" +
                "" +




                "console.log(files);" +
                "                updatePreview(); " +
                "}" +
                "" +
                "" +
                "            function updatePreview() { " +
                "                $('#preview').empty(); " +
                "                files.forEach((file, index) => { " +
                "                    const reader = new FileReader(); " +
                "                    reader.onload = function(e) { " +
                "                        const img = $('<img>').attr('src', e.target.result); " +
                "                        const removeBtn = $('<button>').text('X').addClass('remove-btn').click(() => removeImage(index)); " +
                "                        const previewImg = $('<div>').addClass('preview-img').append(img).append(removeBtn); " +
                "                        $('#preview').append(previewImg); " +
                "                    }; " +
                "                    reader.readAsDataURL(file); " +
                "                }); " +
                "            } " +
                " " +
                "            function removeImage(index) { " +
                "                files.splice(index, 1); " +
                "                updatePreview(); " +
                "            } " +
                " " +
                "            $('#dropArea').on('dragover', function(e) { " +
                "                e.preventDefault(); " +
                "                e.stopPropagation(); " +
                "                $(this).addClass('dragging'); " +
                "            }); " +
                " " +
                "            $('#dropArea').on('dragleave', function(e) { " +
                "                e.preventDefault(); " +
                "                e.stopPropagation(); " +
                "                $(this).removeClass('dragging'); " +
                "            }); " +
                " " +
                "            $('#dropArea').on('drop', function(e) { " +
                "                e.preventDefault(); " +
                "                e.stopPropagation(); " +
                "                $(this).removeClass('dragging'); " +
                " " +
                "                const droppedFiles = e.originalEvent.dataTransfer.files; " +
                "                for (let i = 0; i < droppedFiles.length; i++) { " +
                "                    if (droppedFiles[i].type.startsWith('image/')) { " +
                "                        files.push(droppedFiles[i]); " +
                "                    } " +
                "                } " +
                "                updatePreview(); " +
                "            }); " +
                " " +
                "            $('#dropArea').on('click', function() { " +
                "                $('#fileInput').click(); " +
                "            }); " +
                " " +
                "            $('#fileInput').on('change', function() { " +
                "                const selectedFiles = this.files; " +
                "                for (let i = 0; i < selectedFiles.length; i++) { " +
                "                    if (selectedFiles[i].type.startsWith('image/')) { " +
                "                        files.push(selectedFiles[i]); " +
                "                    } " +
                "                } " +
                "                updatePreview(); " +
                "            }); " +
                " " +
                "            $('#uploadButton').on('click', function(e) { " +
                "                e.preventDefault(); " +
                "                const base64Files = []; " +
                "                 " +
                " " +
                "                function readFileAsBase64(file) { " +
                "                    return new Promise((resolve, reject) => { " +
                "                        const reader = new FileReader(); " +
                "                        reader.onload = function(e) { " +
                "                            resolve(e.target.result); " +
                "                        }; " +
                "                        reader.onerror = function(err) { " +
                "                            reject(err); " +
                "                        }; " +
                "                        reader.readAsDataURL(file); " +
                "                    }); " +
                "                } " +
                " " +
                "                const promises = files.map(file => readFileAsBase64(file)); " +
                "$('#loadingIndicator').show();" +
                " " +
                "                Promise.all(promises).then(base64Files => { " +
                "                    $.ajax({ " +
                "                        url: '/app/site/hosting/scriptlet.nl?script=customscript_ssst_ser_dashboard_backend&deploy=customdeploy_ssst_ser_dashboard_backend',  " +
                "                        type: 'POST', " +
                "                        contentType: 'application/json', " +
                "                        data:JSON.stringify({ files: base64Files }), " +
                "           " +
                "                        success: function(response) {" +
                "$('#loadingIndicator').hide(); " +
                "                            alert('Files uploaded successfully.'); " +
                "removeAllImage();" +
                "                        }, " +
                "                        error: function(response) { " +
                "$('#loadingIndicator').hide(); " +
                "                            alert('Error uploading files.'); " +
                "                        } " +
                "                    }); " +
                "                }).catch(err => { " +
                "                    console.error('Error reading files as Base64', err); " +
                "                }); " +
                "            }); " +
                "" +
                "" +
                "            $('#removeButton').on('click', function(e) { " +
                "" +
                "removeAllImage();" +
                "" +
                "        }); " +

                "        }); " +
                " " +
                "" +
                "" +
                "" +
                "let currentTooltip = null; " +
                " " +
                "        document.querySelectorAll('.tooltip-trigger').forEach(trigger => { " +
                "            trigger.addEventListener('mouseover', function() { " +
                "    " +
                "   tooltipTimeout = setTimeout(() => { " +
                "            showTooltip(trigger); " +
                "        }, 1000);   " +
                "            }); " +
                "    " +
                "    trigger.addEventListener('mouseout', () => { " +
                "        clearTimeout(tooltipTimeout); " +
                "    }); " +
                "    " +
                "        }); " +
                "   " +
                "   " +
                "  function showTooltip(trigger){ " +
                "   " +
                "   if (currentTooltip) { " +
                "                    currentTooltip.style.display = 'none'; " +
                "                } " +
                "                const tooltipId = trigger.getAttribute('data-tooltip-id'); " +
                "                currentTooltip = document.getElementById(tooltipId);" +
                "                console.log(currentTooltip); " +
                "                currentTooltip.style.display = 'block'; " +
                "                currentTooltip.style.opacity = 1;" +
                "                document.querySelector('.tooltip-overlay').style.display = 'block'; " +
                "  } " +
                " " +
                "        document.querySelectorAll('.close-btn').forEach(button => { " +
                "            button.addEventListener('click', function() { " +
                "                if (currentTooltip) { " +
                "                    currentTooltip.style.display = 'none'; " +
                "                    currentTooltip.style.opacity = 0;" +
                "                    document.querySelector('.tooltip-overlay').style.display = 'none'; " +
                "                    currentTooltip = null; " +
                "                } " +
                "            }); " +
                "        }); " +
                " " +

                "        document.querySelectorAll('#custpage_a_add_multy_close').forEach(button => { " +
                "            button.addEventListener('click', function() {  " +
                "                    document.querySelector('.popupMulti').style.display = 'none'; " +
                "            }); " +
                "        }); " +


                "        document.querySelectorAll('#custpage_a_add_cust_top_10').forEach(button => { " +
                "            button.addEventListener('click', function() {  " +
                "                    document.getElementById('custpage_search_item_text').value = 'cust : top 10'; " +
                "                    $('#custpage_search_item_button').click();" +
                "            }); " +
                "        }); " +
                "" +


                "        document.querySelectorAll('#custpage_a_add_cust_recent_10').forEach(button => { " +
                "            button.addEventListener('click', function() {  " +
                "                    document.getElementById('custpage_search_item_text').value = 'cust : recent 10'; " +
                "                    $('#custpage_search_item_button').click();" +
                "            }); " +
                "        }); " +
                "" +


                "        document.querySelectorAll('#custpage_a_add_top_10').forEach(button => { " +
                "            button.addEventListener('click', function() {  " +
                "                    document.getElementById('custpage_search_item_text').value = 'comp : top 10'; " +
                "                    $('#custpage_search_item_button').click();" +
                "            }); " +
                "        }); " +
                "" +


                "        document.addEventListener('keydown', function(event) { " +
                "            if (event.key === 'Escape') { " +
                "                if (currentTooltip) { " +
                "                    currentTooltip.style.display = 'none'; " +
                "                    currentTooltip.style.opacity = 0;" +
                "                    document.querySelector('.tooltip-overlay').style.display = 'none'; " +
                "                    currentTooltip = null; " +
                "                } " +
                "                    document.querySelector('.popupMulti').style.display = 'none'; " +
                "            } " +
                "        }); " +
                " " +
                "        document.querySelector('.tooltip-overlay').addEventListener('click', function() { " +
                "            if (currentTooltip) { " +
                "                currentTooltip.style.display = 'none'; " +
                "                    currentTooltip.style.opacity = 0;" +
                "                this.style.display = 'none'; " +
                "                currentTooltip = null; " +
                "            } " +
                "        });" +
                "" +
                "" +



                "  " +
                " </script> " +
                "  " +
                "  </body> " +
                "</html>";

            var form    =   serverWidget.createForm({title : "Service Dashboard",hideNavBar:true});

            var htmlFldObj  =   form.addField({label:" html",id:"custpage_html_fld",type:"inlinehtml"});

            htmlFldObj.defaultValue =   htmlFld;

            form.clientScriptModulePath = './ADVS_CSST_Service_Dashboard_new.js';

            scriptContext.response.writePage({pageObject:form})


        }

        return {onRequest}

    });