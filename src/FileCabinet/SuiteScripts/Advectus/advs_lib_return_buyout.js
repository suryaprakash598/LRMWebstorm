/**
 * @NApiVersion 2.1
 * @NModuleScope SameAccount
 */
define(['N/record', 'N/search', 'N/currentRecord', 'N/ui/dialog', 'N/http', 'N/https', 'N/url', 'N/runtime', 'N/email', 'N/format','N/file','/SuiteBundles/Bundle 555729/advs_lib/src/advs_lib_default_funtions_v2.js'],

    function (record, search, currentRecord, dialog, http, https, url, runtime, email, format,file,advsObj) {



        function MonthsDifference(d1, d2) {

            var months;
            months = (d2.getFullYear() - d1.getFullYear()) * 12;   //calculates months between two years
            months -= d1.getMonth() + 1;
            months += d2.getMonth();  //calculates number of complete months between two months
            var day1 = 30 - d1.getDate();
            var day2 = day1 + d2.getDate();
            months += parseInt(day2 / 30);  //calculates no of complete months lie between two dates
            months++;
            return months <= 0 ? 0 : months;
        }

        function RefreshScreen(RecordType, RecordId) {

            advsObj.hideProcessingMessage();

            //			window.parent.location.reload();

            var URL = url.resolveRecord({
                recordType: RecordType,
                recordId: RecordId,
                isEditMode: false
            });

            setWindowChanged(window, false);
            window.open(URL, "_SELF");
        }

      

        function MakeIdUniqueLine() {

            var text = "";
            var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

            for (var i = 0; i < 60; i++)
                text += possible.charAt(Math.floor(Math.random() * possible.length));

            return text;
        }
  function getSubsidiaryLogoUrl(subsidiaryId) {
            var subsidiaryInfo = record.load({
                type: record.Type.SUBSIDIARY,
                id: subsidiaryId,
                isDynamic: true
            });
            var logoId = subsidiaryInfo.getValue({ fieldId: 'logo' });
    
            if (logoId) {
                var fileObj = file.load({ id: logoId });
                return fileObj.url;
            } else {
                return '';
            }
  }
  function getPaidInstallmentAmount(LeaseId){
            var paidInstallment = 0;
            var customrecord_advs_lm_lease_card_childSearchObj = search.create({
                type: "customrecord_advs_lm_lease_card_child",
                filters:
                    [
                        ["custrecord_advs_lm_lc_c_link","anyof",LeaseId],
                        "AND",
                        ["custrecord_advs_r_p_invoice.mainline","is","T"]
                        ,"AND",
                        ["custrecord_advs_r_p_invoice.amountremaining","equalto",0]
                    ],
                columns:
                    [
                        search.createColumn({
                            name: "amountremaining",
                            join: "CUSTRECORD_ADVS_R_P_INVOICE",
                            summary: "SUM",
                            label: "Amount Remaining",
                            sort:search.Sort.ASC
                        })
                    ]
            });

            customrecord_advs_lm_lease_card_childSearchObj.run().each(function(result){
                paidInstallment += result.getValue({ name: "amountremaining", join: "CUSTRECORD_ADVS_R_P_INVOICE",summary:"SUM",sort:search.Sort.ASC})*1;
                return true;
            });
    return paidInstallment*1
    }
  function getUnpaidInstAmt(LeaseId){
    var unpaidInstallment = 0;
     var customrecord_advs_lm_lease_card_childSearchObj = search.create({
            type: "customrecord_advs_lm_lease_card_child",
            filters:
                [
                    ["custrecord_advs_lm_lc_c_link","anyof",LeaseId],
                    "AND",
                    ["custrecord_advs_r_p_invoice.mainline","is","T"]
                    ,"AND",
                    ["custrecord_advs_r_p_invoice.amountremaining","greaterthan",0]
                ],
            columns:
                [
                    search.createColumn({
                        name: "amountremaining",
                        join: "CUSTRECORD_ADVS_R_P_INVOICE",
                        summary: "SUM",
                        label: "Amount Remaining",
                        sort:search.Sort.ASC
                    })
                ]
        });

        customrecord_advs_lm_lease_card_childSearchObj.run().each(function(result){
            unpaidInstallment += result.getValue({ name: "amountremaining", join: "CUSTRECORD_ADVS_R_P_INVOICE",summary:"SUM",sort:search.Sort.ASC})*1;
            return true;
        });
       return  unpaidInstallment*1;
  }
  function returnTypeList(){
    var HtmlRetTypeList = "";
     HtmlRetTypeList += "<option value='" + "" + "'>" + "" + "</option>";
      var customrecord_advs_return_typeSearchObj = search.create({
                    type: "customrecord_advs_return_type",
                    filters: [
                        ["isinactive", "is", "F"]
                    ],
                    columns: [
                        search.createColumn({ name: "name", label: "Name" }),
                        search.createColumn({ name: "internalid", label: "Internal ID" })
                    ]
                });
                customrecord_advs_return_typeSearchObj.run().each(function(result) {
                    var name = result.getValue({ name: "name" });
                    var internalid = result.getValue({ name: "internalid" });
                    HtmlRetTypeList += "<option value='" + internalid + "'>" + name + "</option>";
                    return true;
                });
    return HtmlRetTypeList;
  }
 function returnTypeListNew(){
    var HtmlRetTypeList = "";
     HtmlRetTypeList += "<option value='" + "" + "'>" + "" + "</option>";
      var ReturnNames = ["Return","Buy-out","Auction","Total Loss"];
      var ReturnIds = ["1","2","3","4"];
      for(var i = 0; i<ReturnNames.length; i++){
         HtmlRetTypeList += "<option value='" + ReturnIds[i] + "'>" + ReturnNames[i] + "</option>";
      }
    return HtmlRetTypeList;
  }
        return {
            MonthsDifference: MonthsDifference,
            RefreshScreen: RefreshScreen,
            MakeIdUniqueLine: MakeIdUniqueLine,
          getSubsidiaryLogoUrl:getSubsidiaryLogoUrl,
          getPaidInstallmentAmount:getPaidInstallmentAmount,
          getUnpaidInstAmt:getUnpaidInstAmt,
          returnTypeList:returnTypeList,
          returnTypeListNew:returnTypeListNew
        };

    });