/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
define(['N/cache','N/log','N/runtime'],
    
    (cache, log, runtime) => {
        /**
         * Defines the Suitelet script trigger point.
         * @param {Object} scriptContext
         * @param {ServerRequest} scriptContext.request - Incoming request
         * @param {ServerResponse} scriptContext.response - Suitelet response
         * @since 2015.2
         */
        const onRequest = (scriptContext) => {

            if(scriptContext.request.method == "POST"){

                var checkfornewChat =   scriptContext.request.parameters.checkfornewChat;

                if(checkfornewChat == 1){

                    var runtimeObj  =   runtime.getCurrentUser().id;

                    var myCache = cache.getCache({
                        name: 'ADVSUserChatManagement',
                        scope: cache.Scope.PUBLIC
                    });

                    var userKey     =   "ADVSUserChat_"+runtimeObj;

                    var checkExistingCache =myCache.get({key:userKey,loader:function(){
                            return null;
                        }});


                    // log.emergency("checkExistingCache",checkExistingCache);


                    var chatEntries = [
                        { keyName: "ADVSUserChat_5_10", recordId: "", lastSeen : new Date().getTime()  , lastMsg : (new Date().getTime()) - 4000000 },
                        { keyName: "ADVSUserChat_5_11", recordId: "", lastSeen : new Date().getTime()  , lastMsg : (new Date().getTime()) - 5000000 },
                        { keyName: "ADVSUserChat_5_12", recordId: 10, lastSeen : new Date().getTime()  , lastMsg : (new Date().getTime()) - 6000000 },
                        { keyName: "ADVSUserChat_5_12", recordId: 10, lastSeen : new Date().getTime()  , lastMsg : (new Date().getTime()) - 7000000 },
                        { keyName: "ADVSUserChat_5_12", recordId: 10, lastSeen : new Date().getTime()  , lastMsg : (new Date().getTime()) - 8000000 },
                        { keyName: "ADVSUserChat_5_12", recordId: 10, lastSeen : new Date().getTime()  , lastMsg : (new Date().getTime()) - 9000000 }
                    ];

                    var resultObject = createJsonObject("true", chatEntries);

                    myCache.put({
                        key:userKey,
                        value:resultObject||"null",
                        ltl : 5000
                    });


                    scriptContext.response.write({output:JSON.stringify(resultObject)});
                }

            }

            // Function to create JSON object
            function createJsonObject(windowOpen, chatEntries) {
                var jsonObject = {
                    windowOpen: windowOpen,
                    allChats: []
                };

                chatEntries.forEach(function(entry) {
                    jsonObject.allChats.push({
                        keyName: entry.keyName,
                        recordId: entry.recordId,
                        lastSeen : entry.lastSeen,
                        lastMsg : entry.lastMsg
                    });
                });

                return jsonObject;
            }

        }

        return {onRequest}

    });
