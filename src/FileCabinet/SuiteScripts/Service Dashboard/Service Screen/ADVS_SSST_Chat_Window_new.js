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


            var htmlFld =   "";

            htmlFld +=  "<html lang='en'> " +
                "  <head> " +
                "    " +
                "     " +
                // "    <link rel='stylesheet' href='https://8760954.app.netsuite.com/core/media/media.nl?id=11170&c=8760954&h=u4_v1RrF0J-glEKddAQQmoAbY_uqGubjNkEZRre_GncDc2Rs&_xt=.css'> " +
                "    <link rel='stylesheet' href='https://8760954.app.netsuite.com/core/media/media.nl?id=11179&c=8760954&h=CnvlAzLPcCC0p01VqQtkiIwpNI_3I9ANGdlVLieAe435y8xG&_xt=.css' /> " +
                "     " +
                "  </head> " +
                "  <body class='sidebar-icon-only sidebar-fixed'> " +
                "    <div class='container-scroller'> " +
                "       " +
                "      <div class='container-fluid page-body-wrapper'> " +
                "         " +
                "        <div class='main-panel' style='width: 100% !important;'> " +
                "          <div class='content-wrapper'> " +
                "            <div class='row'> " +
                "              <div class='col-md-12'> " +
                "                <button type='button' class='btn btn-secondary py-3 mb-4 text-center d-md-none aside-toggler'> " +
                "                  <i class='mdi mdi-menu mr-0 icon-md'></i> " +
                "                </button> " +
                "                <div class='card chat-app-wrapper'> " +
                "                  <div class='row mx-0'> " +
                "                    <div class='col-lg-4 col-md-4 chat-list-wrapper px-0'> " +
                "                      <div class='sidebar-spacer'> " +
                "                        <div class='input-group chat-search-input'> " +
                "                          <input type='text' class='form-control' placeholder='Search Inbox' aria-label='Username' /> " +
                "                          <div class='input-group-append'> " +
                "                            <span class='input-group-text'> " +
                "                              <i class='mdi mdi-magnify'></i> " +
                "                            </span> " +
                "                          </div> " +
                "                        </div> " +
                "                      </div> " +
                "                      <div class='chat-list-item-wrapper' id='allExistingChat' style='max-height: 500px; overflow: scroll;'> " +

                "                      </div> " +
                "                      <div class='sidebar-spacer d-grid gap-2'> " +
                "                        <button class='btn btn-block btn-gradient-success py-3' type='button'> + New Chat </button> " +
                "                      </div> " +
                "                    </div> " +
                "      " +
                "      " +
                "                    <div class='col-lg-8 col-md-8 px-0 d-flex flex-column'> " +
                "                      <div class='chat-container-wrapper' style='min-height:300px !important; max-height:500px !important;'> " +
                "                        <div class='chat-bubble incoming-chat'> " +
                "                          <div class='chat-message'> " +
                "                            <p> Hii. </p> " +
                "                             " +
                "                          </div> " +
                "                          <div class='sender-details'> " +
                // "                            <img class='sender-avatar img-xs rounded-circle' src='../../../../assets/images/faces/face2.jpg' alt='profile image' /> " +
                "                            <p class='seen-text'>Message seen : 20 min ago</p> " +
                "                          </div> " +
                "                        </div> " +
                "                        <div class='chat-bubble outgoing-chat'> " +
                "                          <div class='chat-message'> " +
                "                            <p class='font-weight-bold'>Frank Carter</p> " +
                "                            " +
                "                          </div> " +
                "                          <div class='sender-details'> " +
                // "                            <img class='sender-avatar img-xs rounded-circle' src='../../../../assets/images/faces/face3.jpg' alt='profile image' /> " +
                "                            <p class='seen-text'>Message seen : 10 min ago</p> " +
                "                          </div> " +
                "                        </div> " +
                "                        <div class='chat-bubble incoming-chat'> " +
                "                          <div class='chat-message'>                            " +
                "                            <p> Mi in nulla posuere sollicitudin aliquam ultrices. Mauris a diam maecenas sed enim. Facilisi nullam vehicula ipsum a arcu cursus vitae congue mauris. </p> " +
                "                          </div> " +
                "                          <div class='sender-details'> " +
                // "                            <img class='sender-avatar img-xs rounded-circle' src='../../../../assets/images/faces/face2.jpg' alt='profile image' /> " +
                "                            <p class='seen-text'>Message seen : 8 min ago</p> " +
                "                          </div> " +
                "                        </div> " +
                "                        <div class='chat-bubble outgoing-chat'> " +
                "                          <div class='chat-message'> " +
                "                             " +
                "                            <p> Leo duis ut diam quam nulla porttitor massa id neque. Sed enim ut sem </p> " +
                "                             " +
                "                          </div> " +
                "                          <div class='sender-details'> " +
                // "                            <img class='sender-avatar img-xs rounded-circle' src='../../../../assets/images/faces/face3.jpg' alt='profile image' /> " +
                "                            <p class='seen-text'>Message seen : 10 min ago</p> " +
                "                          </div> " +
                "                        </div> " +
                "                      </div> " +
                "                      <div class='chat-text-field mt-auto'> " +
                "                        <form action='#'> " +
                "                          <div class='input-group'> " +
                "                            <input type='text' class='form-control' placeholder='Type a message here' /> " +
                "                            <div class='input-group-append'> " +
                "                              <button type='submit' class='input-group-text'> " +
                "                                <i class='mdi mdi-send icon-sm'></i> " +
                "                              </button> " +
                "                            </div> " +
                "                          </div> " +
                "                        </form> " +
                "                      </div> " +
                "                    </div> " +
                "     " +
                "                  </div> " +
                "                </div> " +
                "              </div> " +
                "            </div> " +
                "          </div> " +
                "           " +
                "        </div> " +
                "      </div> " +
                "    </div> " +
                "     " +
                "  </body> " +
                "<script src='https://code.jquery.com/jquery-3.6.0.js'></script>" +
                "  <script src='https://code.jquery.com/ui/1.13.2/jquery-ui.js'></script>" +
                "</html>";

            var form    =   serverWidget.createForm({title : " ",hideNavBar:true});

            var htmlFldObj  =   form.addField({label:" html",id:"custpage_html_fld",type:"inlinehtml"});

            htmlFldObj.defaultValue =   htmlFld;

            form.clientScriptModulePath = './ADVS_CSST_Portlet_For_Chat.js';

            scriptContext.response.writePage({pageObject:form})


        }

        return {onRequest}

    });
