/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
define(['N/search','N/record','N/runtime'],
    /**
 * @param{search} search
 */
    (search,record,runtime) => {
        /**
         * Defines the Suitelet script trigger point.
         * @param {Object} scriptContext
         * @param {ServerRequest} scriptContext.request - Incoming request
         * @param {ServerResponse} scriptContext.response - Suitelet response
         * @since 2015.2
         */
        const onRequest = (scriptContext) => {
            var request	=	scriptContext.request;
            var response	=	scriptContext.response;
            log.debug("request.method",request.method);
            if(request.method === "GET"){
                var type        = request.parameters.custparam_type;
                var modelType   = request.parameters.modelType;
                if(type == 1 || type == "1"){
                    var purType   = request.parameters.custparam_purtype;

                  // log.debug("StringFyData",StringFyData);
                  response.write({output:1});
                }else if(type == 2 || type == "2"){
                    var ModelId     = request.parameters.modelID;
                    var PurType     = request.parameters.custparam_pur_type;

                    // log.debug("PurType",PurType);
                    if(PurType ==1 || PurType == "1"){
                       
                    }else{
                    


                        var StringFyData = JSON.stringify(FinalData);
                        // log.debug("StringFyData",StringFyData)
                        response.write({output:StringFyData});
                    }

                }else if(type == 3 || type == "3"){
                    var warrantyID     = request.parameters.warrantyID;
                    var getCsaCost  =   fetchWarrantyCsaPrice(warrantyID);

                    var warrObj =   {};
                    warrObj.Cost    =   getCsaCost;
                    var StringFyData = JSON.stringify(warrObj);
                    response.write({output:StringFyData});
                }else if(type == 4 || type == "4"){
                    var brandID     = request.parameters.brandID;

                    var  ModelsTypData   =   fetchModelType(brandID);
                    var StringFyData = JSON.stringify(ModelsTypData);
                    // log.debug("StringFyData",StringFyData);
                    response.write({output:StringFyData});
                }else if(type == 5 || type == "5"){
                    log.debug("request",request);

                    var body    =   request.getBody();

                    log.debug("body",body);
                    response.write({output:"OK"});
                }


            }

            if(request.method === "POST") {
                var type        = request.parameters.custparam_type;
                if (type == 5 || type == "5") {

                    var postData = request.body;
                    if(postData){
                        var jsonD = JSON.parse(postData);

                       var returnData   =    createTempData(jsonD);
                        var StringFyData = JSON.stringify(returnData);
                        scriptContext.response.write({output:StringFyData});

                    }

                }
            }
        }

        function createTempData(jsonD){
            log.debug("jsonD",jsonD);
            var modelID         =   jsonD[0].modelID;
            var modelType       =   jsonD[0].modelType;
            var Fittedwidth     =   jsonD[0].Fittedwidth;

            var Prefix          =   jsonD[0].Prefix;

            var safetyData      =   jsonD[0].safetyLineData;
            var bucketData      =   jsonD[0].bucketLineData;
            var otherData      =   jsonD[0].otherLineData;
            var delDate      =   jsonD[0].delDate;

            var DelDatePar  =   "";
            if(delDate){
                var convDate = new Date(delDate);
                DelDatePar  =    convDate;

            }

            var scriptObj       =   runtime.getCurrentScript()
            var p_creditItm		=	scriptObj.getParameter("custscript_advs_p_credit");
            var MainPref		=	scriptObj.getParameter("custscript_advs_dnp_m_prefix");

            var Today   =   new Date();
            var YearLast  =   sort_year(Today);
            var tempRec =   record.create({
                type:"customrecord_advs_dnp_calc_num_series",
                isDynamic:true
            });
            var TIDr    =   tempRec.save({enableSourcing:true,ignoreMandatoryFields:true});
            var NumberSerRec   =   search.lookupFields({type:"customrecord_advs_dnp_calc_num_series",id:TIDr,columns:["name"]});
            var NumbSeri    =   NumberSerRec.name;
            var genDocNum = MainPref+""+ Prefix+""+YearLast+ "" + NumbSeri;

            var recordCr = record.create({
                type: "customrecord_advs_dnp_data_header",
                isDynamic: true
            });
            recordCr.setValue({fieldId: "autoname", value: false});
            recordCr.setValue({fieldId: "name", value: genDocNum});

            recordCr.setValue({fieldId: "custrecord_advs_dnp_dh_model", value: modelID});
  
           

            var recmachSafety = "recmachcustrecord_advs_parent_ref";
            var recmachbucket = "recmachcustrecord_advs_eb_parent";
            var recmachother = "recmachcustrecord_advs_oc_parent";

            for(var i=0;i<safetyData.length;i++){
                var safetyObj =   safetyData[i];
                if(safetyObj != null && safetyObj != undefined){
                    var id      =   safetyObj.id;
                    var rate    =   safetyObj.rate;

                    recordCr.selectNewLine({sublistId: recmachSafety});
                    recordCr.setCurrentSublistValue({
                        sublistId: recmachSafety,
                        fieldId: "custrecord_advs_spk_attachment",
                        value: id
                    });
                    recordCr.setCurrentSublistValue({
                        sublistId: recmachSafety,
                        fieldId: "custrecord_advs_spk_rate",
                        value: rate
                    });
                    recordCr.commitLine({sublistId: recmachSafety});
                }
            }


            var RecId = recordCr.save({enableSourcing: true, ignoreMandatoryFields: true});
            var postObj = RecId;
            return postObj;
        }
       
       
        function sort_year(dt)
        {
            return ('' + dt.getFullYear()).substr(2);
        }
        return {onRequest,createTempData}

    });