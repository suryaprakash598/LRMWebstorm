/**
 * Module Description
 *
 * Version    Date            Author           Remarks
 * 1.00       03 Aug 2018     Anirudh Tyagi
 *
 */

/**
 * @param {nlobjRequest} request Request object
 * @param {nlobjResponse} response Response object
 * @returns {Void} Any output is written via response object
 */
function suitelet(request, response){

    if(request.getMethod()=='GET'){

        try{
            var _empid = nlapiGetContext().user;
            var user = nlapiGetUser();
            var form = nlapiCreateForm('Delivery Board', false);
            var fil = [];
            var col = [];

            fil.push(new nlobjSearchFilter('internalid', null, 'is', _empid));
            col.push(new nlobjSearchColumn('custentity_inventory_filters_chosen'));
            var search = nlapiSearchRecord('employee',null, fil, col);

            var parameterfm = '';
            if(search!=null)
            {
                if(search.length ==1){
                    parameterfm= search[0].getValue(col[0]);

                }
                else{
                    var fil =[];
                    var col = [];
                    fil.push(new nlobjSearchFilter('name', null, 'is', 'ERR_00001'));
                    col.push(new  nlobjSearchColumn('custrecord_advs_em_message'));
                    col.push(new  nlobjSearchColumn('custrecord_advs_em_category'));
                    var search = nlapiCreateSearch('customrecord_advs_messages',fil,col);
                    var result = search.runSearch();
                    var cols = result.getColumns();
                    var cat1='';
                    var i = 1;
                    var str='';
//					var cat1='';
                    result.forEachResult(function(rec) {
                        var error = rec.getValue(cols[0]);
                        var cat = rec.getText(cols[1]);
                        str = error;
                        cat1 = cat;
                        ++i;

                        return true;
                    });

                    str = str.replace("{1}"," 'deliveryboard' ");
                    str = str.replace("{2}",i);
                    var advsMsg = new Array();
                    advsMsg['custparam_advs_error']=str;
                    advsMsg['custparam_advs_cat']=cat1;
                    nlapiSetRedirectURL('SUITELET', 'customscript_advs_ss_error_message', 'customdeploy_advs_ss_error_message',null, advsMsg);
                }
            }
            else{

                var fil =[];
                var col = [];
                fil.push(new nlobjSearchFilter('name', null, 'is', 'ERR_00002'));
                col.push(new  nlobjSearchColumn('custrecord_advs_em_message'));
                var search = nlapiCreateSearch('customrecord_advs_messages',fil,col);
                var result = search.runSearch();
                var cols = result.getColumns();

                var i = 1;
                var str='';
                result.forEachResult(function(rec) {
                    var error = rec.getValue(cols[0]);
                    str=error;
                    ++i;
                    return true;
                });


                str = str.replace("{1}"," 'deliveryboard' ");

                var advsMsg = new Array();
                advsMsg['custparam_advs_error']=str;
                advsMsg['custparam_advs_cat']='Error';

            }



            var fld = form.addField('custpage_hiddenfld', 'text', '', false, false);
            fld.setDefaultValue(parameterfm);
            fld.setDisplayType('hidden');

            var Param	=	new Array();
            Param['filters']	=	parameterfm;

            nlapiSetRedirectURL('SUITELET', 'customscript_delivery_board_dashboard', 'customdeploy_delivery_board_dashboard', null, Param);

        }

        catch(e){

            var advsMsg = new Array();
            advsMsg['custparam_advs_error']="An Unexpected error occurred.( " +e+')';
            advsMsg['custparam_advs_msg']="Error";
            nlapiSetRedirectURL('SUITELET', 'customscript_advs_ss_error_message', 'customdeploy_advs_ss_error_message',null, advsMsg);
        }

    }
}