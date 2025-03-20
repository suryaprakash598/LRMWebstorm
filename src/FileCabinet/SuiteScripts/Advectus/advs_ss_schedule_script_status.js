/**
 * @NApiVersion 2.x
 * @NScriptType Suitelet
 * @NModuleScope SameAccount
 */
define(['N/https', 'N/redirect', 'N/search', 'N/task', 'N/ui/serverWidget','N/runtime'],
/**
 * @param {https} https
 * @param {redirect} redirect
 * @param {search} search
 * @param {task} task
 * @param {serverWidget} serverWidget
 */
function(https, redirect, search, task, serverWidget,runtime) {
   
    /**
     * Definition of the Suitelet script trigger point.
     *
     * @param {Object} context
     * @param {ServerRequest} context.request - Encapsulation of the incoming request
     * @param {ServerResponse} context.response - Encapsulation of the Suitelet response
     * @Since 2015.2
     */
    function onRequest(context) {
        var serverRequest = context.request;
        var serverResponse = context.response;
        if (serverRequest.method === https.Method.GET) {
          var ScriptId = serverRequest.parameters.custpara_script_id;
          var RecordId = serverRequest.parameters.custparam_recordId;
          var form = serverWidget.createForm({
            title: "Script Processing Status"
          });
          var Status = ["PENDING", "PROCESSING", "RETRY"]
          var ScriptStatusSearch = search.create({
            type: "scheduledscriptinstance",
            filters: [
              [
                'status', search.Operator.ANYOF, Status
              ], 'AND',
              ["script.scriptid","is",ScriptId]
            ],
            columns: [
              search.createColumn({
                name: 'status',
              }), search.createColumn({
                name: 'percentcomplete',
              })
            ]
          });
          var searchResultCount = ScriptStatusSearch.runPaged().count;
          var ScriptStatus = '', CompletePercent = '';
          ScriptStatusSearch.run().each(function(result) {
            ScriptStatus = result.getValue({
              name: 'status'
            });
            CompletePercent = result.getValue({
              name: 'percentcomplete'
            });
            return true;
          });
          if (ScriptStatus != '') {
            var html = '';
            html += "<table border='1' style='border-collapse:collapse;' width='50%'>";
            html += "<tr style='background-color:#187bf2; color:white'><th><b>Status</b></th>" + "<th><b>Percent Complete</b></th></tr>";
            html += "<tr><th><b>" + ScriptStatus + "</b></th><th><b>" + CompletePercent + "</b></th></tr>";
            html += "</table>";
          } else {
        	  if(RecordId){
        		  redirect.toRecord({
        			    type: 'customrecord_advs_at_annual_stock_take',
        			    id: RecordId
        			});
        	  }else{
        			redirect.toSuitelet({
        				scriptId: 'customscript_advs_ss_show_softhold_unhol',
        				deploymentId: 'customdeployadvs_ss_show_softhold_unhold'
        			});  
        	  }
          }

          form.addSubmitButton({
            label: 'Refresh'
          });
          var HtmlFld = form.addField({
            id: 'custpage_html_field',
            type: serverWidget.FieldType.INLINEHTML,
            label: 'Html'
          });
          HtmlFld.defaultValue = html;
          serverResponse.writePage(form);
        } else {
          var ScriptId = findGetParameter(serverRequest.parameters['entryformquerystring'], 'custpara_script_id');
          var RecordId = findGetParameter(serverRequest.parameters['entryformquerystring'], 'custparam_recordId');
			var scriptObj = runtime.getCurrentScript();
			redirect.toSuitelet({
				scriptId: scriptObj.id,
				deploymentId: scriptObj.deploymentId,
	            parameters: {
	                'custpara_script_id': ScriptId,
	                'custparam_recordId': RecordId
	              }
			});
        }
    }
    function findGetParameter(parameters, parameterName) {
        var prmarr = parameters.split("&");
        var length = prmarr.length;
        for (var i = 0; i < length; i++) {
          var tmparr = prmarr[i].split("=");
          if (tmparr[0] === parameterName) {
            return tmparr[1];
          }
        }
      }
    return {
        onRequest: onRequest
    };
    
});