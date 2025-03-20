/**
 * @NApiVersion 2.x
 * @NScriptType Suitelet
 * @NModuleScope SameAccount
 */
define(['N/crypto', 'N/encode', 'N/runtime','N/http','N/search','N/xml','N/ui/serverWidget','N/url','N/file'],
    /**
     * @param {crypto} crypto
     * @param {encode} encode
     * @param {runtime} runtime
     */
    function(crypto, encode, runtime,http,search,xml,serverWidget,url,file) {

        /**
         * Definition of the Suitelet script trigger point.
         *
         * @param {Object} context
         * @param {ServerRequest} context.request - Encapsulation of the incoming request
         * @param {ServerResponse} context.response - Encapsulation of the Suitelet response
         * @Since 2015.2
         */
        function onRequest(context) {
            var publicKey = 'QzS0xxWrvv';
            var privateKey = 'CyzG3tJLU39hFbexG9jWeEI1R';
            var verb = 'GET';
            var baseUri = 'http://api.motor.com';
            var currentDate = new Date();
            var epoch = Math.floor(currentDate.getTime()/ 1000.0);



            var form = serverWidget.createForm({
                title : 'Motor',
                hideNavBar : true
            });

            var field = form.addField({
                id : 'custpage_abc_text',
                type : serverWidget.FieldType.INLINEHTML,
                label : 'HTML'
            });

            var html = '';

            var vin_para = context.request.parameters.custparam_vin;
            var custparam_location =  context.request.parameters.inventory_location;
//		vin_para = '4T1BB46KX9U091203';

            var attribute_id_para = context.request.parameters.custparam_attributeid
            var EngineID = context.request.parameters.custparam_engineid
            var sub_model_id = context.request.parameters.custparam_sub_model_id

            var function_code = context.request.parameters.custparam_function_code;
            var html = '';

            if(attribute_id_para != null && attribute_id_para !='' && attribute_id_para != undefined){

            }else{

                var encode_Url_Vehicle = '/v1/Information/Vehicles/Search/ByVIN';


                var authUri_vehicle = GenerateUriWithValidAuth(encode_Url_Vehicle, verb, publicKey, privateKey,crypto,encode,epoch,search);

                var fullUrl_vehicle = baseUri + authUri_vehicle; //
                fullUrl_vehicle = fullUrl_vehicle+'&VIN='+vin_para;

                var header = '';
                var token_res = http.get({
                    url: fullUrl_vehicle,
                    headers: header
                });

                var code_vehicle = token_res.code;
                var get_body_vehicle = token_res.body;
                log.debug("code_vehicle",code_vehicle);
                log.debug("get_body_vehicle",get_body_vehicle);
                if(code_vehicle == '200'){
                    var xmlDocument_vehicle = xml.Parser.fromString({
                        text : get_body_vehicle
                    });

                    var StatusCode_vehicle = xml.XPath.select({ //
                        node : xmlDocument_vehicle,
                        xpath : '//MWSVehicleSearchRs//Header//StatusCode'
                    });
                    var Status_vehicle = xml.XPath.select({//
                        node : xmlDocument_vehicle,
                        xpath : '//MWSVehicleSearchRs//Header//Status'
                    });
                    log.debug("StatusCode_vehicle",StatusCode_vehicle);
                    log.debug("Status_vehicle",Status_vehicle);
                    if(StatusCode_vehicle.length > 0 && Status_vehicle.length > 0){
                        var StatusCode_vehicle_local = StatusCode_vehicle[0].textContent;
                        var Status_vehicle_local = Status_vehicle[0].textContent;
                        if(Status_vehicle_local =='OK' && StatusCode_vehicle_local =='200'){

                            var BaseVehicleID = xml.XPath.select({ //
                                node : xmlDocument_vehicle,
                                xpath : '//MWSVehicleSearchRs//Body//Vehicles//VehicleSearchItem//BaseVehicleID'
                            });
                            if(BaseVehicleID.length > 0){
                                attribute_id_para = BaseVehicleID[0].textContent;
                                var base_EngineID = xml.XPath.select({ //
                                    node : xmlDocument_vehicle,
                                    xpath : '//MWSVehicleSearchRs//Body//Vehicles//VehicleSearchItem//EngineID'
                                });
                                EngineID = base_EngineID[0].textContent;

                                var SubModelID = xml.XPath.select({ //
                                    node : xmlDocument_vehicle,
                                    xpath : '//MWSVehicleSearchRs//Body//Vehicles//VehicleSearchItem//SubModelID'
                                });
                                sub_model_id = SubModelID[0].textContent;
                            }
                        }else{
                            html ='<h1> Error Code :'+Status_vehicle_local+' </h1>';
                        }
                    }
                }
            }
            log.debug("EngineID==",EngineID+'==attribute_id_para=='+attribute_id_para);

            if(attribute_id_para != null && attribute_id_para !='' && attribute_id_para != undefined){
                var AttributeType = 'BaseVehicleID';
                html +="<style>";
                html +="#customers {";
                html +='font-family: "Trebuchet MS", Arial, Helvetica, sans-serif;';
                html +="border-collapse: collapse;";
                html +="width: 100%;";
                html +="}";

                html +="#customers td, #customers th {";
                html +=" border: 1px solid #ddd;";
                html +=" padding: 12px;font-size: inherit;";
                html +="}";


                html +="#customers tr:nth-child(even){background-color: #f2f2f2;}";

                html +="#customers tr:hover {background-color: #ddd;}";

                html +="#customers th {";
                html +=" padding-top: 12px;";
                html +=" padding-bottom: 12px;";
                html +=" text-align: left;";
                html +="background-color: #fafafa;";
                html +="color: white;";
                html +="font-size: medium;";
                html +="}";


                html +="</style>";






                var detail_html = '';
                detail_html = fluids_summary(attribute_id_para,verb, publicKey, privateKey,crypto,encode,epoch,search,context,baseUri,http,xml,url,vin_para,function_code,EngineID,file,custparam_location,sub_model_id);
                html +=detail_html;
            }else{
                html ='<h1> Error Code :Vehicle Not Found</h1>';
            }

            field.defaultValue = html;
            context.response.writePage(form);

        }

        return {
            onRequest: onRequest
        };

    });
//0d3e87fd64e74ceb9d2bb2b357cf9c0c
function GenerateUriWithValidAuth(uri, verb, publicKey, privateKey,CryptoJS,encode,epoch,search)
{

    var toSign = publicKey + '\n' + verb + '\n' + epoch + '\n' + uri;
    var lookup_fileds = search.lookupFields({
        type:'customrecord_advs_motor_guid',
        id:1,
        columns:['custrecord_advs_mo_g_uid']
    });
    var key = lookup_fileds.custrecord_advs_mo_g_uid;
    var sig = toHmacSHA256Base64(toSign, key,CryptoJS,encode);
    for(var i=0;i<10;i++){
        sig = sig.replace("+","%2B");
        sig = sig.replace("/","%2F");
        sig = sig.replace("=","%3D");
    }
    var requestUrl = uri + "?Scheme=Shared&XDate=" + epoch + "&ApiKey=" + publicKey + "&Sig=" + sig;
    return requestUrl;
}
function GenerateUriWithValidAuth_with_para(uri, verb, publicKey, privateKey,CryptoJS,encode,epoch,search,engine_id,sub_model_id)
{

    var toSign = publicKey + '\n' + verb + '\n' + epoch + '\n' + uri;
    var lookup_fileds = search.lookupFields({
        type:'customrecord_advs_motor_guid',
        id:1,
        columns:['custrecord_advs_mo_g_uid']
    });
    var key = lookup_fileds.custrecord_advs_mo_g_uid;
    var sig = toHmacSHA256Base64(toSign, key,CryptoJS,encode);
    for(var i=0;i<10;i++){
        sig = sig.replace("+","%2B");
        sig = sig.replace("/","%2F");
        sig = sig.replace("=","%3D");
    }
    var requestUrl = uri + "?Scheme=Shared&XDate=" + epoch + "&ApiKey=" + publicKey + "&Sig=" + sig+'&EN='+engine_id+'&SM='+sub_model_id;
    log.debug("requestUrl",requestUrl);
    return requestUrl;
}


function toHmacSHA256Base64(toCrypt, key,crypto,encode) {
    var inputString = toCrypt;
    var base64EncodedString = encode.convert({
        string: inputString,
        inputEncoding: encode.Encoding.UTF_8,
        outputEncoding: encode.Encoding.BASE_64
    });
    var myGuid = key;
    var sKey = crypto.createSecretKey({
        guid: myGuid,
        encoding: encode.Encoding.UTF_8
    });
    var hmacSHA256 = crypto.createHmac({
        algorithm: 'SHA256',
        key: sKey
    });
    hmacSHA256.update({
        input: base64EncodedString,
        inputEncoding: encode.Encoding.BASE_64
    });
    var digestSHA256 = hmacSHA256.digest({
        outputEncoding: encode.Encoding.BASE_64
    });
    return digestSHA256;
};


function fluids_summary(attribute_id_para,verb, publicKey, privateKey,crypto,encode,epoch,search,context,baseUri,http,xml,url,vin_para,function_code,engine_id,file,location,sub_model_id){

//	https://api.motor.com/v1/Information/Vehicles/Attributes/BaseVehicleID/67101/Content/Summaries/Of/Fluids?EN=11634&SM
    var AttributeType = 'BaseVehicleID',html='';
    var encodedUri_sched = '/v1/Information/Vehicles/Attributes/'+AttributeType+'/'+attribute_id_para+'/Content/Summaries/Of/Fluids';

    log.debug("encodedUri_sched",encodedUri_sched);

    var authUri_Schd = GenerateUriWithValidAuth_with_para(encodedUri_sched, verb, publicKey, privateKey,crypto,encode,epoch,search,engine_id,sub_model_id);


    var fullUrl_Sched = baseUri + authUri_Schd; //
    log.debug("fullUrl_Sched",fullUrl_Sched);
    var header = '';
    var token_res = http.get({
        url: fullUrl_Sched,
        headers: header
    });

    var code_ = token_res.code;
    var get_body = token_res.body;
    if(code_ == '200'){
        var xmlDocument = xml.Parser.fromString({
            text : get_body
        });

        log.debug("get_body",get_body);

        var StatusCode = xml.XPath.select({ //
            node : xmlDocument,
            xpath : '//MWSFluidSummaryRs//Header//StatusCode'
        });
        var Status = xml.XPath.select({//
            node : xmlDocument,
            xpath : '//MWSFluidSummaryRs//Header//Status'
        });

        var StatusCode_local = StatusCode[0].textContent;
        var Status_local = Status[0].textContent;
        if(Status_local =='OK' && StatusCode_local =='200'){

            html +="<style>";
            html +="#customers_child {";
            html +='font-family: "Trebuchet MS", Arial, Helvetica, sans-serif;';
            html +="border-collapse: collapse;";
            html +="width: 100%;";
            html +="}";

            html +="#customers_child td, #customers_child th {";
            html +=" border: 1px solid #ddd;";
            html +=" padding: 12px;font-size: inherit;";
            html +="}";


            html +="#customers_child tr:nth-child(even){background-color: #f2f2f2;}";

            html +="#customers_child tr:hover {background-color: #ddd;}";

            html +="#customers_child th {";
            html +=" padding-top: 12px;";
            html +=" padding-bottom: 12px;";
            html +=" text-align: left;";
            html +="background-color: #4CAF50;";
            html +="color: white;";
            html +="}";


            html +="</style>";




            html +='<table id="customers_child">';

            var FluidApplicationSummary = xml.XPath.select({
                node : xmlDocument,
                xpath : '//MWSFluidSummaryRs//Body//Applications//FluidApplicationSummary'
            });
            var send_Url = url.resolveScript({
                scriptId: 'customscript_advs_ssf_motor_fluid_detail',
                deploymentId: 'customdeploy_advs_ssf_motor_fluid_detail',
                returnExternalUrl: false
            });
            for(var f = 0;f<FluidApplicationSummary.length;f++){
                var app_ca_id = xml.XPath.select({
                    node : xmlDocument,
                    xpath : '//MWSFluidSummaryRs//Body//Applications//FluidApplicationSummary['+f+']//ApplicationID'
                });
                if(app_ca_id.length > 0){
                    log.debug("app_ca_id",app_ca_id.length+'==Text Content=='+app_ca_id[0].textContent);
                    var Href_links = xml.XPath.select({
                        node : xmlDocument,
                        xpath : '//MWSFluidSummaryRs//Body//Applications//FluidApplicationSummary['+f+']//Links//Link//Href'
                    });
                    var DisplayName = xml.XPath.select({
                        node : xmlDocument,
                        xpath : '//MWSFluidSummaryRs//Body//Applications//FluidApplicationSummary['+f+']//DisplayName'
                    });
                    var link_href = Href_links[0].textContent;
                    var local_url = send_Url+'&link_href='+link_href+'&function_code=3&from_line=T&inventory_location='+location;
                    html +="<tr><td><a href="+local_url+" target='_self'>"+DisplayName[0].textContent+"</a></td></tr>";
                }
            }

            html +='</table>';

        }else{
            html ='<h1> Error Code :'+Status_local+' </h1>';
        }
    }else{
        html =get_body;
    }
    return html;

}

