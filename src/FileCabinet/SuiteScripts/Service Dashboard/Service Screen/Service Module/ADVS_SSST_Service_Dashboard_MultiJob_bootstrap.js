/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
define(['N/ui/serverWidget','N/search','N/cache'],
    /**
 * @param{serverWidget} serverWidget
 */
    (serverWidget,search,cache) => {
        /**
         * Defines the Suitelet script trigger point.
         * @param {Object} scriptContext
         * @param {ServerRequest} scriptContext.request - Incoming request
         * @param {ServerResponse} scriptContext.response - Suitelet response
         * @since 2015.2
         */
        const onRequest = (scriptContext) => {

            var vinIdFromParam  =   scriptContext.request.parameters.custpage_vin_id;

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

            htmlFld     =   "<!DOCTYPE html>" +
                "<html lang='en'>" +
                "<head>" +
                "    <meta charset='UTF-8'>" +
                "    <meta name='viewport' content='width=device-width, initial-scale=1.0'>" +
                "    <title>Bootstrap View with Select2</title>" +
                "    <!-- Bootstrap CSS -->" +
                "    <link href='https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css' rel='stylesheet'>" +
                "    <!-- Select2 CSS -->" +
                "    <link href='https://cdn.jsdelivr.net/npm/select2@4.1.0-beta.1/dist/css/select2.min.css' rel='stylesheet'>" +
                "    <link href='https://8760954.app.netsuite.com/core/media/media.nl?id=14767&c=8760954&h=-RrqEMbz-xGP9HaYFNOB10qLElRMUzl3opLrq9--sFZV4ewY&_xt=.css' rel='stylesheet'>" +

                "</head>" +
                "<body>" +

                "<div id='loader-overlay'>" +
                "  <div class='loader'>" +
                "<img src='https://8760954.app.netsuite.com/core/media/media.nl?id=13430&c=8760954&h=PP86_U6h0blgiu6mQzLuwA0lEoyWXbpADwI-3NcqU4g4RGc-'/>" +
                "</div>" +
                "</div>" +

                "<div class='container-fluid' style='position: fixed;" +
                "    top: 0;" +
                "    right: 0;" +
                "    left: 0;" +
                "    z-index: 1030;" +
                "   background: white;'>" +
                "    <!-- Top Bar -->" +
                "    <div class='top-bar d-flex justify-content-between align-items-center'>" +
                "                <div class='nav-profile-text' style='display:flex;'> " +
                "                  <div class='sidepanelfontClass' style='color:#66a1ff; font-weight:bold; margin: 1px 10px 10px 10px; font-family:'ubuntu-medium', sans-serif;' id='custpage_estimate' name='custpage_estimate'>Estimate</div>       " +
                "        <div class='checkbox-wrapper-25'> " +
                "     <input type='checkbox' id='custpage_select_est_ord' name='custpage_select_est_ord' onchange='markSelectOrder()'> " +
                "     </div> " +
                "      <div class='sidepanelfontClass' style='color:#918888; font-weight:100; margin: 1px 10px 10px 10px; font-family:'ubuntu-medium', sans-serif;' id='custpage_order' name='custpage_order'>Order</div> " +
                "                </div>                            " +

                "        <!-- Autocomplete Boxes -->" +
                "        <div class='d-flex gap-2' style='width: 650px;'>" +
                "            <input type='text' class='form-control'  id='search_text' placeholder='Search VIN / Body / Serial / Unit / Attachment' style='padding: 8px 10px; width: 280px;'>" +
                "           <div id='custpage_no_of_result' class='input-group-prepend bg-transparent iconFontSize' style='padding: 6px 4px 0px 4px; font-weight: bolder;color: #1b8dbf; font-size: 13px;'> </div>     " +
                "            <input type='text' class='form-control' id='search_customer_text' placeholder='Search Customer' style='padding: 8px 10px; width: 280px;'>" +
                "        </div>" +
                "<input type='hidden' id='selected_vehicle_id' name='selected_vehicle_id' value='"+vinIdFromParam+"'/>" +
                "<input type='hidden' id='custpage_customer_id' name='custpage_customer_id'/>" +
                "        <!-- Badges -->" +
                "        <div class='badge-section'>" +
                "<div class='badge badge_top badge-outline-info badge-pill tooltip-trigger'  data-tooltip-id='custpage_other_vehicle_tooltip' id='custpage_other_vehile_count_main' style='display: none;' font-weight: bold;'>" +
                "            <div class='badge badge_top bg-dark' >" +
                "               <span  id='custpage_other_vehicle_count' style='margin: 0px 0px 0px 0px;' class='sidepanelfontClass'></span>" +
                "            </div>" +
                "</div>" +
                "<input type='hidden' id='custpage_last_order' name='custpage_last_order'/>" +

                "<div class='badge badge_top badge-outline-info badge-pill tooltip-trigger'  data-tooltip-id='custpage_open_order_tooltip' id='custpage_open_order_count_main' style='display: none;' font-weight: bold;'>" +
                "            <div class='badge badge_top bg-dark' >" +
                "               <span  id='custpage_open_order_count' style='margin: 0px 0px 0px 0px;' class='sidepanelfontClass'></span>" +
                "            </div>" +
                "</div>" +


                "<div class='badge badge_top badge-outline-info badge-pill tooltip-trigger' data-tooltip-id='custpage_open_quote_tooltip'  id='custpage_open_quote_count_main' style='display: none;' font-weight: bold; '>" +
                "            <div class='badge badge_top bg-dark' >" +
                "               <span  id='custpage_open_quote_count' style='margin: 0px 0px 0px 0px;' class='sidepanelfontClass'></span>" +
                "            </div>" +
                "</div>" +
                "</div>                 " +//Open Order Estimate pill End

                "        <!-- Button Icons -->" +
                "        <div>" +
                "            <button class='btn btn-primary me-2' style='background-color: #111212;' id = 'settings-trigger'>" +
                "<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-info-circle' viewBox='0 0 16 16'>" +
                "  <path d='M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16'/>" +
                "  <path d='m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0'/>" +
                "</svg>" +
                "</button>" +
                "            <button class='btn btn-primary me-2' style='background-color: #111212;' >" +
                "<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-printer' viewBox='0 0 16 16'>" +
                "  <path d='M2.5 8a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1'/>" +
                "  <path d='M5 1a2 2 0 0 0-2 2v2H2a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h1v1a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-1h1a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-1V3a2 2 0 0 0-2-2zM4 3a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2H4zm1 5a2 2 0 0 0-2 2v1H2a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v-1a2 2 0 0 0-2-2zm7 2v3a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1'/>" +
                "</svg>" +
                "</button>" +
                "            <button class='btn btn-primary me-2' style='background-color: #111212;' id='custpage_save'>" +
                "<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-floppy2-fill' viewBox='0 0 16 16'>" +
                "  <path d='M12 2h-2v3h2z'/>" +
                "  <path d='M1.5 0A1.5 1.5 0 0 0 0 1.5v13A1.5 1.5 0 0 0 1.5 16h13a1.5 1.5 0 0 0 1.5-1.5V2.914a1.5 1.5 0 0 0-.44-1.06L14.147.439A1.5 1.5 0 0 0 13.086 0zM4 6a1 1 0 0 1-1-1V1h10v4a1 1 0 0 1-1 1zM3 9h10a1 1 0 0 1 1 1v5H2v-5a1 1 0 0 1 1-1'/>" +
                "</svg>" +
                "" +
                "</button>" +
                "            <button class='btn btn-primary me-2' style='background-color: #111212;'>" +
                "<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-plus-square-dotted' viewBox='0 0 16 16'>" +
                "  <path d='M2.5 0q-.25 0-.487.048l.194.98A1.5 1.5 0 0 1 2.5 1h.458V0zm2.292 0h-.917v1h.917zm1.833 0h-.917v1h.917zm1.833 0h-.916v1h.916zm1.834 0h-.917v1h.917zm1.833 0h-.917v1h.917zM13.5 0h-.458v1h.458q.151 0 .293.029l.194-.981A2.5 2.5 0 0 0 13.5 0m2.079 1.11a2.5 2.5 0 0 0-.69-.689l-.556.831q.248.167.415.415l.83-.556zM1.11.421a2.5 2.5 0 0 0-.689.69l.831.556c.11-.164.251-.305.415-.415zM16 2.5q0-.25-.048-.487l-.98.194q.027.141.028.293v.458h1zM.048 2.013A2.5 2.5 0 0 0 0 2.5v.458h1V2.5q0-.151.029-.293zM0 3.875v.917h1v-.917zm16 .917v-.917h-1v.917zM0 5.708v.917h1v-.917zm16 .917v-.917h-1v.917zM0 7.542v.916h1v-.916zm15 .916h1v-.916h-1zM0 9.375v.917h1v-.917zm16 .917v-.917h-1v.917zm-16 .916v.917h1v-.917zm16 .917v-.917h-1v.917zm-16 .917v.458q0 .25.048.487l.98-.194A1.5 1.5 0 0 1 1 13.5v-.458zm16 .458v-.458h-1v.458q0 .151-.029.293l.981.194Q16 13.75 16 13.5M.421 14.89c.183.272.417.506.69.689l.556-.831a1.5 1.5 0 0 1-.415-.415zm14.469.689c.272-.183.506-.417.689-.69l-.831-.556c-.11.164-.251.305-.415.415l.556.83zm-12.877.373Q2.25 16 2.5 16h.458v-1H2.5q-.151 0-.293-.029zM13.5 16q.25 0 .487-.048l-.194-.98A1.5 1.5 0 0 1 13.5 15h-.458v1zm-9.625 0h.917v-1h-.917zm1.833 0h.917v-1h-.917zm1.834-1v1h.916v-1zm1.833 1h.917v-1h-.917zm1.833 0h.917v-1h-.917zM8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3z'/>" +
                "</svg>" +
                "</button>" +
                "        </div>" +

                "        </div>" +
                "    </div>" +
                
                "    <!-- Main Content -->" +
                "    <div class='row mt-4'>" +
                
                "<!-- Notification Bar -->" +
                
                
                "        <!-- Vertical Partition 1 -->" +
                "        <div class='col-md-9'>" +

                "" +
                "<div style='display: flex;margin-top: -20px;'>"+
                "<div class='badge bg-dark  tooltip-trigger'  data-tooltip-id='custpage_other_vehicle_tooltip' id='custpage_main_notification' style='display: none; margin-left: 30px;' font-weight: bold;'>" +
                "            <div class='badge bg-dark' >" +
                "               <span  id='custpage_customer_alert' style='margin: 0px 0px 0px 0px;' class='sidepanelfontClass'></span>" +
                "            </div>" +
                "</div>" +

                "<div class='badge bg-dark tooltip-trigger'   id='custpage_main_comment_notification' style='display: none;margin-left: 30px;' font-weight: bold;'>" +
                "            <div class='badge bg-dark' >" +
                "               <span  id='custpage_customer_comment' style='margin: 0px 0px 0px 0px;' class='sidepanelfontClass'></span>" +
                "            </div>" +
                "</div>" +
                "</div>" +

                "            <div class='tiles'>" +
                "                <div class='tile' id='custpage_customer_tile'>" +
                "<div class='tile-icon'>" +
                "                        <i class='bi bi-person-badge'></i>" +
                "                    </div>" +
                "                    <div class='tile-title sidepanelfontClass' id='custpage_customer_name'>Customer</div>" +
                "</div>" +

                "<div class='tile'>" +
                "<div class='tile-icon'>" +
                "                       <i class='bi bi-truck'></i>" +
                "                    </div>" +
                "                    <div class='tile-title sidepanelfontClass' id='custpage_vin_number'>VIN #</div>" +
                "</div>" +
                
                "<div class='tile' id='custpage_vehicle_history'>" +
                "<div class='tile-icon'>" +
                "                        <i class='bi bi-clock-history'></i>" +
                "                    </div>" +
                "                    <div class='tile-title' id='custpage_service_history_head' class='sidepanelfontClass' style='display: flex;width: 100%;justify-content: space-between;'>Service History</div>" +
                "</div>" +
                
                "<div class='tile'>" +
                "<div class='tile-icon'>" +
                "                        <i class='bi bi-calendar4-range'></i>" +
                "                    </div>" +
                "                    <div class='tile-title'>Clocking Details</div>" +
                "</div>" +
                "                " +
                "            </div>" +

                "<div id='custpage_all_dynamic_data' style='margin-top: 20px; max-height: 600px; overflow-y: auto;'>" +
                "" +
                "</div>" +

                "<div class='tooltip' id='custpage_customer_tooltip' style='display: none;'> </div>" +
                "<div class='tooltip' id='custpage_open_order_tooltip' style='display: none;'></div>" +
                "<div class='tooltip' id='custpage_open_quote_tooltip' style='display: none;'> </div>" +
                "<div class='tooltip' id='custpage_other_vehicle_tooltip' style='display: none;'></div>" +
                "<div class='tooltip' id='custpage_vehicle_tooltip' style='display: none;'></div>" +
                "<input type='hidden' class='tooltip' id='custpage_history_tooltip' style='overflow-y: auto;display: none;'></input>" +
                "               <div id='custpage_cust_veh_details' style='display: none;'>" +
                "</div>" +
                "   <div class='row' style='margin-top:30px;'> " +
                "                    " +
                "                   <div class='col-md-12 grid-margin stretch-card' style='height:max-content; '> " +
                "                                <div class='card'> " +
                "                                  <div class='card-body' style='padding: 2px 2px; '> " +
                "          <div class='card-header ' style='display: flex;justify-content: space-between !important;'>" +
                "            <button class='btn btn-primary' style='background-color:transparent;border-color:transparent; color:black; font-weight:600;' type='button' data-bs-toggle='collapse' data-bs-target='' aria-expanded='false' aria-controls=''>" +
                "Jobs" +
                "  </button>" +
                "                     <span>   <button type='button' class='btn btn-primary btn-sm sidepanelfontClass' id = 'add-section'> Add Operation  " +
                "                                          </button> " +
                "                           <button type='button' class='btn btn-secondary btn-sm sidepanelfontClass'  id = 'add-package'> Package  " +
                "                                          </button> " +
                "</span>" +
                "          </div>" +

                "<div class='card mb-4'>" +

                "  <div class='collapse show' id='collapseother'>" +
                "          </div>" +
                "          </div>" +

                
                "                <div id='sections-container'></div> " +
                
                
                "                     <div style='display:flex;'> " +
                
                "                " +



                "                         " +
                "               " +

                
                "                     </div> " +
                "                                     " +
                "                                  </div> " +
                "  </div>" +
                "  </div>" +
                "  </div>" +
                
                "        </div>" +
                "        <!-- Vertical Partition 2 -->" +
                "        <div class='col-md-3'>" +
                
                
                
                "<div class='card mb-4'>" +
                "          " +
                "  <div class='card-header ' id='headingOne'>  " +
                "            <h5 class='mb-0' style='margin-top: 0px;'>" +
                " " +
                "  <button class='btn btn-primary' style='background-color:transparent;border-color:transparent; color:black; font-weight:600;' type='button' data-bs-toggle='collapse' data-bs-target='#collapsesummary' aria-expanded='false' aria-controls='collapsesummary'>" +
                "Summary" +
                "  </button>" +
                "                </h5>" +
                "          </div>" +
                "  " +

                "<div id='popup' class='popup div_3d' style='display: none;'></div>" +
                "" +
                "<div id='popup_package' class='popup div_3d' style='width: 1000px;height: 900px; display: none;'>" +
                "</div>" +

                "  <div class='collapse' id='collapsesummary'>" +
                "          <div class='card mb-12' style='padding: 1px 18px 1px 1px;'>" +

                "            <div >" +
                "              <ol class='list-group list-group-flush'>" +

                "                <li class='list-group-item d-flex justify-content-between align-items-center border-0 px-0 pb-0 sidepanelfontClass' style='color: black;'>" +
                "                  Total Parts" +
                "                  <span id='custpage_total_patrs_sum'>$ 0.00</span>" +
                "                </li>" +

                "                <li class='list-group-item d-flex justify-content-between align-items-center border-0 px-0 pb-0 sidepanelfontClass' style='color: black;'>" +
                "                  Total Labor" +
                "                  <span id='custpage_total_lab_sum'>$ 0.00</span>" +
                "                </li>" +

                "                <li class='list-group-item d-flex justify-content-between align-items-center px-0 sidepanelfontClass' style='border-width: 0px 0px 2px; color: black;'>" +
                "                  Total Sublet" +
                "                  <span id='custpage_total_sub_sum'>$ 0.00</span>" +
                "                </li>" +

                "                <li class='list-group-item d-flex justify-content-between align-items-center border-0 px-0 sidepanelfontClass' style='color: blue;'>" +
                "                  <div>" +
                "                    <strong style='font-weight: 800;'>Subtotal</strong>" +
                "                  </div>" +
                "                  <span><strong style='font-weight: 800;' id='custpage_total_sub_total'>$ 0.00</strong></span>" +
                "                </li>" +

                "                <li class='list-group-item d-flex justify-content-between align-items-center border-0 px-0 pb-0 sidepanelfontClass' style='color: black;'>" +
                "                  Discount" +
                "                  <span id='custpage_total_sub_discount'>$ 0.00</span>" +
                "                </li>" +

                "                <li class='list-group-item d-flex justify-content-between align-items-center border-0 px-0 pb-0 sidepanelfontClass' style='color: black;'>" +
                "                  Shop Supplies" +
                "                  <span id='custpage_total_shop_supply'>$ 0.00</span>" +
                "                </li>" +

                // "                <li class='list-group-item d-flex justify-content-between align-items-center border-0 px-0 pb-0' style='color: black; font-weight: bold;font-size: 14px;'>" +
                // "                  EPA" +
                // "                  <span id='custpage_total_sub_epa'>$0.00</span>" +
                // "                </li>" +

                "                <li class='list-group-item d-flex justify-content-between align-items-center border-0 px-0 pb-0 sidepanelfontClass' style='color: black;'>" +
                "                Fees" +
                "                  <span id='custpage_total_sub_fees'>$ 0.00</span>" +
                "                </li>" +

                "                <li class='list-group-item d-flex justify-content-between align-items-center px-0 sidepanelfontClass' style='border-width: 0px 0px 2px; border-color: black;color: black;'>" +
                "                  Tax" +
                "                  <span id='custpage_total_sub_tax'>$ 0.00</span>" +
                "                </li>" +

                "                <li class='list-group-item d-flex justify-content-between align-items-center border-0 px-0 sidepanelfontClass' style='color: blue;'>" +
                "                  <div>" +
                "                    <strong style='font-weight: 800;'>Grand Total</strong>" +
                "                  </div>" +
                "                  <span><strong style='font-weight: 800;' id='custpage_total_grand'>$ 0.00</strong></span>" +
                "                </li>" +

                "              </ol>" +
                "            </div>" +
                "          </div>" +

                "  " +
                "        </div>" +
                "</div>" +

                "<div style='display: flex; padding: 10px 10px 10px 10px;' class='sidepanelfontClass'> " +
                "                                 " +
                "                                <div > Discount</div> " +
                "                                 " +
                "                                <div style='margin-left: 20px;'> " +
                "                                 " +
                "                                <div class='input-container' data-suffix='$'> " +
                "                                    <div class='view-mode' id='custpage_job_disc_head_symbol'>0 $</div> " +
                "                                    <input type='number' id='custpage_job_disc_head' class='input-field' style='display: none; width: 40px; padding: 2px;' > " +
                "                                    <div class='dropdown-container'> " +
                "                                        <div class='dropdown-content'> " +
                "                                            <a href='#' class='dropdown-option' data-suffix='$'>$</a> " +
                "                                            <a href='#' class='dropdown-option' data-suffix='%'>%</a> " +
                "                                             " +
                "                                        </div> " +
                "                                    </div> " +
                "                                </div> " +
                "                                                                                           " +
                "                                </div> " +
                "                                 " +
                "                                 " +
                "                                 " +
                "                                <div style='margin-left: 20px;'> Shop Supplies</div> " +
                "                                 " +
                "                                <div style='margin-left: 20px;'> " +
                "                                <div class='input-container' data-suffix='%'> " +
                "                                <div class='view-mode'>0%</div> " +
                "                                <input type='number' id='custpage_job_shop_head' class='input-field' style='display: none; margin-left: 20px; width: 40px;'> " +
                "                                </div>                                 " +
                "                                </div> " +
                "                                 " +
                "                                 " +
                "                                <div style='margin-left: 20px;'> Tax</div> " +
                "                                <div style='margin-left: 20px;'> " +
                "                                <div class='input-container' data-suffix='%'> " +
                "                                <div class='view-mode'>0%</div> " +
                "                                <input type='number' id='custpage_job_tax_head' class='input-field' style='display: none; margin-left: 20px; width: 40px;' > " +
                "                                 " +
                "                                " +
                "                                 " +
                "                                </div>                                 " +
                "                                </div> " +
                "                                 " +
                "                                 " +
                "                                </div>" +
                
                
                
                
                "<div class='card mb-4'>" +
                "          <div class='card-header '>" +
                "            <button class='btn btn-primary' style='background-color:transparent;border-color:transparent; color:black; font-weight:600;' type='button' data-bs-toggle='collapse' data-bs-target='#collapseother' aria-expanded='false' aria-controls='collapseother'>" +
                "Other Details" +
                "  </button>" +
                "          </div>" +
                "  <div class='collapse show' id='collapseother'>" +
                "  <table class='table'>" +
                "                <tbody>" +
                "                    <!-- Two Textboxes -->" +
                "                    <tr>" +
                "                        <th class='sidepanelfontClass'> In Mileage</th>" +
                "                        <td>" +
                "                            <input type='number' class='form-control mandatory-input' id='custpage_current_mileage' placeholder='Mileage In'>" +
                "                        </td>" +
                "                    </tr>" +
                "                    <tr>" +
                "                        <th class='sidepanelfontClass'> PO #</th>" +
                "                        <td>" +
                "                            <input type='text' class='form-control' placeholder='PO #'>" +
                "                        </td>" +
                "                    </tr>" +
                
                "                    <!-- Three Date Fields -->" +
                "                    <tr>" +
                "                        <th class='sidepanelfontClass'> Start Date</th>" +
                "                        <td>" +
                "                            <input type='date' class='form-control mandatory-input'>" +
                "                        </td>" +
                "                    </tr>" +
                "                    <tr>" +
                "                        <th class='sidepanelfontClass'> End Date</th>" +
                "                        <td>" +
                "                            <input type='date' class='form-control'>" +
                "                        </td>" +
                "                    </tr>" +
                "                    <tr>" +
                "                        <th class='sidepanelfontClass'> Submission Date</th>" +
                "                        <td>" +
                "                            <input type='date' class='form-control'>" +
                "                        </td>" +
                "                    </tr>" +
                
                "                    <!-- Four Select Boxes with Icons -->" +
                "                    <tr>" +
                "                        <th class='sidepanelfontClass'> Appointment</th>" +
                "                        <td>" +
                "                            <select class='form-select select2 mandatory' id='custpage_order_status_sel'>" +

                "                            </select>" +
                "                        </td>" +
                "                    </tr>" +
                "                    <tr>" +
                "                        <th class='sidepanelfontClass'> Location</th>" +
                "                        <td>" +
                "                            <select class='form-select select2 mySelect2 mandatory' id='custpage_order_location'>" +

                "                            </select>" +
                "                        </td>" +
                "                    </tr>" +
                "                    <tr>" +
                "                        <th class='sidepanelfontClass'> Department</th>" +
                "                        <td>" +
                "                            <select class='form-select select2 mySelect2 mandatory' id='custpage_order_department'>" +

                "                            </select>" +
                "                        </td>" +
                "                    </tr>" +
                "                    <tr>" +
                "                        <th class='sidepanelfontClass'> Confirm</th>" +
                "                        <td>" +
                "                            <select class='form-select select2 mandatory' id='custpage_order_completed'>" +

                "                            </select>" +
                "                        </td>" +
                "                    </tr>" +
                "                </tbody>" +
                "            </table>" +
                
                "           </div>" +
                "</div>" +
                "        </div>" +
                "    </div>" +
                "</div>" +
                
                "<!-- Modals -->" +
                "<div class='modal fade' id='singleClickModal' tabindex='-1' aria-labelledby='singleClickModalLabel' aria-hidden='true'>" +
                "    <div class='modal-dialog'>" +
                "        <div class='modal-content' >" +
                "            <div class='modal-header'>" +
                "                <h5 class='modal-title' id='singleClickModalLabel' style='font-weight: bold;'>Single Click Modal</h5>" +
                "            </div>" +
                "            <div class='modal-body' id='singleClickModalContent' style='overflow-y: auto;'>" +
                "            </div>" +
                "            <div class='modal-footer'>" +
                "                <button type='button' class='btn btn-secondary' data-bs-dismiss='modal'>Close</button>" +
                "            </div>" +
                "        </div>" +
                "    </div>" +
                "</div>" +
                
                "<div class='modal fade' id='doubleClickModal' tabindex='-1' aria-labelledby='doubleClickModalLabel' aria-hidden='true'>" +
                "    <div class='modal-dialog'>" +
                "        <div class='modal-content'>" +
                "            <div class='modal-header'>" +
                "                <h5 class='modal-title' id='doubleClickModalLabel'>Double Click Modal</h5>" +
                "                <button type='button' class='btn-close' data-bs-dismiss='modal' aria-label='Close'></button>" +
                "            </div>" +
                "            <div class='modal-body'>" +
                "                <p id='doubleClickModalContent'>Content for double click.</p>" +
                "            </div>" +
                "            <div class='modal-footer'>" +
                "                <button type='button' class='btn btn-secondary' data-bs-dismiss='modal'>Close</button>" +
                "            </div>" +
                "        </div>" +
                "    </div>" +
                "</div>" +

                "<div class='modal fade' id='confirmModal' tabindex='-1' aria-labelledby='confirmModalLabel' aria-hidden='true' style='z-index: 99999;background: radial-gradient(black, transparent);'>" +
                "  <div class='modal-dialog modal-dialog-centered'>" +
                "    <div class='modal-content'>" +
                "      <div class='modal-header'>" +
                "<div style='width:100%;'>" +

                "        <h5 class='modal-title' id='confirmModalLabel' style='text-align:center;'></h5>" +
                "<div id='confirmIcon' class='me-2' style='font-size:45px; text-align:center;'></div> <!-- Icon for warning/error -->" +
                "           " +
                "      </div>" +
                "  </div>" +
                "      <div class='modal-body' id='confirmModalBody'>" +
                "      </div>" +
                "      <div class='modal-footer'>" +
                "        <button type='button' class='btn btn-secondary' id='cancelAction' data-bs-dismiss='modal'>Cancel</button>" +
                "        <button type='button' class='btn btn-primary' id='confirmAction'>Confirm</button>" +
                "      </div>" +
                "    </div>" +
                "  </div>" +
                "</div>"+

                "<!-- Second Modal -->" +
                "<div class='modal fade' id='secondModal' tabindex='-1' aria-labelledby='secondModalLabel' aria-hidden='true'>" +
                "  <div class='modal-dialog'>" +
                "    <div class='modal-content'>" +
                "      <div class='modal-header'>" +
                "        <h5 class='modal-title' id='secondModalLabel'>Second Modal</h5>" +
                "        <button type='button' class='btn-close' data-bs-dismiss='modal' aria-label='Close'></button>" +
                "      </div>" +
                "      <div class='modal-body'>" +
                "        This is the second modal, opened within the first one." +
                "      </div>" +
                "    </div>" +
                "  </div>" +
                "</div>"+

                "<!-- Second Modal -->" +
                "<div class='modal fade' id='jobmodal' tabindex='-1' aria-labelledby='' aria-hidden='true'>" +
                "  <div class='modal-dialog'>" +
                "    <div class='modal-content'>" +
                "      <div class='modal-body'>" +
                "       "+
                "      </div>" +
                "    </div>" +
                "  </div>" +
                "</div>"+
                
                
                "<div class='modal fade' id='customJobModal' tabindex='-1' aria-hidden='true'>" +
                "  <div class='modal-dialog'>" +
                "    <div class='modal-content'>" +
                "      <div class='modal-body'>" +
                "        " +
                "          <!-- Text box -->" +
                "          <div class='mb-2'>" +
                "  <div class='job_text_area'> " +
                "            <label for='uif_job_name' class='form-label mandatoryline'>Job Name</label>" +
                "</div>" +
                "            <input type='text' class='form-control mandatory' id='uif_job_name' placeholder=''>" +
                "          </div>" +
                "" +
                "          <!-- Text areas with character count -->" +
                "          <div class='mb-2' >" +
                "            <div class='job_text_area'><label for='uif_job_complain' class='form-label'>Complain</label>" +
                "<div class='form-text'><span id='charsLeft1'>4000</span> /4000</div>" +
                "</div>" +
                "            <textarea class='form-control text-area' id='uif_job_complain' rows='3' maxlength='4000' placeholder=''></textarea>            " +
                "          </div>" +
                "" +
                "          <div class='mb-2'>" +
                "           <div class='job_text_area'> " +
                "   <label  for='uif_job_internal_notes' class='form-label'>Internal notes</label>" +
                "   <div class='form-text'><span id='charsLeft2'>4000</span> /4000</div>" +
                "   </div>" +
                "            <textarea class='form-control text-area' id='uif_job_internal_notes' rows='3' maxlength='4000' placeholder=''></textarea>            " +
                "          </div>" +
                "" +
                "          <div class='mb-2' style='display: none;'>" +
                "  <div class='job_text_area'> " +
                "  <label  class='job_text_area' for='uif_job_correction' class='form-label'>Correction</label>" +
                "  <div class='form-text'><span id='charsLeft3'>4000</span> /4000</div>" +
                "  </div>           " +
                "            <textarea class='form-control text-area' id='uif_job_correction' rows='3' maxlength='4000' placeholder='Correction'></textarea>           " +
                "          </div>" +
                "" +

                "          <div class='mb-2'>" +
                "  <div class='job_text_area'> " +
                "            <label for='uif_job_estimated_hour' class='form-label'>Estimated Hour</label>" +
                "</div>" +
                "            <input type='number' class='form-control' id='uif_job_estimated_hour' placeholder='' value='0'>" +
                "          </div>" +

                "          <div class='mb-2'>" +
                "  <div class='job_text_area'> " +
                "            <label for='uif_job_estimated_budget' class='form-label'>Estimated Budget Amount</label>" +
                "</div>" +
                "            <input type='number' class='form-control' id='uif_job_estimated_budget' placeholder='' value='0'>" +
                "          </div>" +

                "          <div class='mb-2'>" +
                "  <div class='job_text_area'> " +
                "            <label for='uif_billing_customer' class='form-label'>Billing Customer</label>" +
                "</div>" +
                "            <input type='text' class='form-control' id='uif_billing_customer' placeholder=''>" +
                "          </div>" +

                "" +
                // "</div>" +
                // "          </div>" +
                "  " +
                "  <div class='mb-2' >" +
                "  <div class='job_text_area'>" +
                "            <label for='uif_job_tech' class='form-label'>Technician</label>" +
                "</div>" +
                "            <select class='form-select select2-dropdown' id='uif_job_tech'>" +
                "            </select>" +
                "" +
                "</div>" +
                "          </div>" +
                "  " +
                "       " +
                // "      </div>" +
                "      <div class='modal-footer'>" +
                "        <button type='button' class='btn btn-secondary btn-sm ' style='width:100px;' data-bs-dismiss='modal'>Cancel</button>" +
                "        <button type='button' class='btn btn-primary btn-sm ' style='width:100px;' id='addjobButton'>Add</button>" +
                "      </div>" +
                "    </div>" +
                "  </div>" +
                "</div>"+
                
                "<div id='toastContainer' class='toast-container'></div>"+
                
                "<div id='trainingModal' class='modaltrain'>" +
                "                    <div class='modal-header sidepanelfontClass' style='background-color: #3a0967; color: white; justify-content: space-around !important;'></div>" +
                "                    <div class='modal-body sidepanelfontClass'></div>" +
                "                    <div class='modal-footer' style='padding: 0px;'>" +
                "                      <button id='prevButton' class='bg-dark'>" +
                "<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-arrow-left-square' viewBox='0 0 16 16'>" +
                "  <path fill-rule='evenodd' d='M15 2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1zM0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm11.5 5.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5z'/>" +
                "</svg>" +
                "</button>" +
                "                      <button id='nextButton' class='bg-dark' style='margin-left: 30px; margin-right: 30px;' >" +
                "<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-arrow-right-square' viewBox='0 0 16 16'>" +
                "  <path fill-rule='evenodd' d='M15 2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1zM0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm4.5 5.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5z'/>" +
                "</svg>" +
                "</button>" +
                "                      <button id='stopButton' class='bg-danger' style='margin-right: 40px;' >" +
                "<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-stop-btn' viewBox='0 0 16 16'>" +
                "  <path d='M6.5 5A1.5 1.5 0 0 0 5 6.5v3A1.5 1.5 0 0 0 6.5 11h3A1.5 1.5 0 0 0 11 9.5v-3A1.5 1.5 0 0 0 9.5 5z'/>" +
                "  <path d='M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm15 0a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1z'/>" +
                "</svg>" +
                "</button>" +
                "                    </div>" +
                "                  </div>" +


                "<div id='right-sidebar' class='settings-panel' > " +
                "          <div style='height: 30px;" +
                "    width: 30px;" +
                "    margin-left: 350px; cursor: pointer; font-size: 16px;' class='settings-close'>  " +
                "           <svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-x-square' viewBox='0 0 16 16'>\n" +
                "  <path d='M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z'/>\n" +
                "  <path d='M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708'/>\n" +
                "</svg>" +
                "           </div> " +
                "          " +
                "          <div  id='setting-content_1' style='font-size: 15px; padding: 5px 5px;'> " +
                "          </div> " +
                "        </div>" +


                "<!-- Bootstrap JS -->" +
                "<script src='https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js'></script>" +
                "<!-- jQuery -->" +
                "<script src='https://code.jquery.com/jquery-3.6.0.min.js'></script>" +
                "<!-- Select2 JS -->" +
                "<script src='https://cdn.jsdelivr.net/npm/select2@4.1.0-beta.1/dist/js/select2.min.js'></script>" +

                "  <script src='https://code.jquery.com/ui/1.13.2/jquery-ui.js'></script>" +
                "<!-- Icons CDN (Bootstrap Icons) -->" +
                
                "<link rel='stylesheet' href='https://cdnjs.cloudflare.com/ajax/libs/bootstrap-icons/1.8.3/font/bootstrap-icons.min.css'>" +

                "<script>" +
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

            "</script>" +
            
            "</body>" +
            "</html>";

            var form    =   serverWidget.createForm({title : "Service Dashboard",hideNavBar:true});

            var htmlFldObj  =   form.addField({label:" html",id:"custpage_html_fld",type:"inlinehtml"});

            htmlFldObj.defaultValue =   htmlFld;

             form.clientScriptModulePath = './ADVS_CSST_Service_Dashboard_bootstrap.js';

            scriptContext.response.writePage({pageObject:form})


        }

        return {onRequest}

    });
