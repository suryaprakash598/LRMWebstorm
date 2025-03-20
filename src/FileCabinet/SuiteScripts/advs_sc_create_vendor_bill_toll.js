/**
 * Module Description
 *
 * Version    Date            Author           Remarks
 * 1.00       23 Sep 2024     ADVECTUS
 *
 */

/**
 * @param {String} type Context Types: scheduled, ondemand, userinterface, aborted, skipped
 * @returns {Void}
 */
function scheduled(type)
{
    nlapiLogExecution('DEBUG', 'SCHEDULED CALLED');

    var Subsidiry_Array =	new Array();
    var DataArray	=	new Array();

    var DateArray	=	new Array();

    var create_Vendorbill_Search = nlapiCreateSearch("customrecord_advs_toll_import",
        [
            ['isinactive','is','F']
            // ,"AND",
            // ["custrecord_advs_ti_veh_vendor_bill_link","anyof","@NONE@"]
            // ,"AND",
            // ["custrecord_advs_ti_customer_subsidiary","noneof","@NONE@"]
            // ,"AND",
            // ["custrecord_advs_ti_posting_date","onorbefore","today"],

        ],
        [
            new nlobjSearchColumn("custrecord_advs_ti_posting_date",null,null),
            new nlobjSearchColumn("custrecord_advs_ti_customer_subsidiary",null,null),
            new nlobjSearchColumn("custrecord_advs_ti_our_cost",null,null),
            new nlobjSearchColumn("internalid",null,null)
        ]
    );

    var run				=	create_Vendorbill_Search.runSearch();
    var col				=	run.getColumns();
    var L=0;
    var start	=	0;
    var end	=	1000;var Index	=1000;
    while(Index==1000){
        var rs	=	run.getResults(start, end);

        nlapiLogExecution('DEBUG', 'rs length', rs.length);

        for(var k=0;k<rs.length;k++){
            var rec	=	rs[k];
            var PostDate				=   rec.getValue(col[0]);
            var Subsidiary				=   rec.getValue(col[1]);
            var Amount  				=   rec.getValue(col[2])*1;
            var Intid					=	rec.getValue(col[3]);

            if(Subsidiry_Array.indexOf(Subsidiary)==-1){
                Subsidiry_Array.push(Subsidiary);
            }
            if(DateArray.indexOf(PostDate)==-1){
                DateArray.push(PostDate);
            }

            if(DataArray[PostDate] != null && DataArray[PostDate] != undefined){
                if(DataArray[PostDate][Subsidiary] != null && DataArray[PostDate][Subsidiary] != undefined){
                    L = DataArray[PostDate][Subsidiary].length;
                }else{
                    L=0;
                    DataArray[PostDate][Subsidiary] = new Array();
                }

            }else{
                L=0;
                DataArray[PostDate] = new Array();
                DataArray[PostDate][Subsidiary] = new Array();
            }

            DataArray[PostDate][Subsidiary][L]		    	=	new Array();
            DataArray[PostDate][Subsidiary][L]['Amount']	 	=   Amount;
            DataArray[PostDate][Subsidiary][L]['interid'] 	=   Intid;
        }
        start = end;end = start + 1000;Index = rs.length;
    }


    var context	=	nlapiGetContext();

    for(var i =0;i<DateArray.length;i++) {
        if(context.getRemainingUsage()<=4000){
            var status	=	nlapiScheduleScript(context.getScriptId(), context.getDeploymentId());
            if(status=="QUEUED"){
                break;
            }
        }
        for(var j =0;j<Subsidiry_Array.length;j++) {
            var PostDate		=	DateArray[i];
            var Subsidiary		=	Subsidiry_Array[j];
            var PerBill	=	0;
            var SucessId	=	new Array();

            if(DataArray[PostDate] !=null && DataArray[PostDate] !=undefined){
                if(DataArray[PostDate][Subsidiary] !=null && DataArray[PostDate][Subsidiary] !=undefined){
                    var Length	=	DataArray[PostDate][Subsidiary].length;

                    nlapiLogExecution('DEBUG', 'Length', Length);

                    for(var k=0;k<Length;k++){
                        var IntID	=	DataArray[PostDate][Subsidiary][k]['interid'];
                        var Amount	=	DataArray[PostDate][Subsidiary][k]['Amount']*1;
                        PerBill+=Amount;
                        SucessId.push(IntID);

                    }
                    PerBill=	PerBill*1;

                    if(PerBill>0){
                        var VendorBill	=	CreateVendorBill(PostDate,PerBill,Subsidiary);
                        if(VendorBill !=null && VendorBill !=undefined && VendorBill !=''){
                            for(var p=0;p<SucessId.length;p++)
                            {
                                nlapiSubmitField('customrecord_advs_toll_import',SucessId[p],'custrecord_advs_ti_veh_vendor_bill_link', VendorBill);
                            }
                        }
                    }
                }
            }
        }
    }
}
function CreateVendorBill(PostDate,Amount,Subsidiary) {
    Amount	=	Amount*1;
    Amount	=	Amount.toFixed(2);

    var field		=	new Array();
    field.push('custrecord_advs_api_vendor');

    var Look_Up   = nlapiLookupField('customrecord_advs_intergation_credential', 1, field);
    var vendor    = Look_Up.custrecord_advs_api_vendor;
    var vendor_bill	=	nlapiCreateRecord('vendorbill');
    vendor_bill.setFieldValue('trandate',PostDate);
    vendor_bill.setFieldValue('entity',vendor);
    vendor_bill.setFieldValue('account', 111);
    vendor_bill.setFieldValue('usertotal',Amount);
    vendor_bill.setFieldValue('subsidiary',Subsidiary);
    vendor_bill.selectNewLineItem('expense');
    vendor_bill.setCurrentLineItemValue('expense','amount',Amount);
    vendor_bill.setCurrentLineItemValue('expense','account',111);

    vendor_bill.commitLineItem('expense');
    var Sub_Rec = nlapiSubmitRecord(vendor_bill,true,true);
    nlapiLogExecution('DEBUG', 'Sub_Rec', Sub_Rec);
    return Sub_Rec;
}