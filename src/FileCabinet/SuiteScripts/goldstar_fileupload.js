/**
 * @NApiVersion 2.x
 * @NScriptType Suitelet
 * @NModuleScope SameAccount
 */
define(['N/ui/serverWidget', 'N/runtime', 'N/https', 'N/task', 'N/file'],

    function(serverWidget, runtime, https, task, file) {

        /**
         * Definition of the Suitelet script trigger point.
         *
         * @param {Object} context
         * @param {ServerRequest} context.request - Encapsulation of the incoming request
         * @param {ServerResponse} context.response - Encapsulation of the Suitelet response
         * @Since 2015.2
         */
        function onRequest(context) {

            var ServerRequest = context.request;
            var ServerResponse = context.response;
            if (ServerRequest.method == https.Method.GET) {
                var fileparam = ServerRequest.parameters.custparam_fileparam;

                var form = serverWidget.createForm({
                    title: 'Gold Star',
                });

                var userObj = runtime.getCurrentUser();
                var userName = userObj.name;
                var dateVal = new Date(); 
                var FileFilter = form.addField({
                    id: "custpage_file_id",
                    type: serverWidget.FieldType.FILE,
                    label: 'Goldstar File',
                }).isMandatory = true; 
				 
                form.addSubmitButton({
                    label: 'SUBMIT'
                });

                ServerResponse.writePage(form);
            } else {
                var fileObj 	= ServerRequest.files['custpage_file_id']; //ServerRequest.parameters.custpage_file_id; 
				var FolderId 	= 510;
                var userObj 	= runtime.getCurrentUser();
                var userName 	= userObj.name;
                var userId 		= userObj.id;
                var Department 	= userObj.department;
                var date 		= new Date(); 
                if (fileObj) {
					var prefix = fileObj.name.split('.');
                    fileObj.folder = FolderId; //folder created in file cabinet
                    var Fileid = fileObj.save();
                }
                var mrTask = task.create({
                    taskType: task.TaskType.MAP_REDUCE
                });
                var scriptParams = {};
                scriptParams.custscript_file_id = Fileid; 
                mrTask.scriptId = "customscript_goldstar_datadump";
                mrTask.deploymentId = "customdeploy_goldstar_datadump";


                mrTask.params = scriptParams;

                mrTask.submit();  
                var onclickScript = " <html><body> <script type='text/javascript'>" +
                    "try{" +
                    "window.open('https://8760954.app.netsuite.com/app/site/hosting/scriptlet.nl?script=1675&deploy=1','_self')";
                onclickScript += "}catch(e){alert(e+' '+e.message);}</script></body></html>";
                ServerResponse.write(onclickScript);
            }
        }
        return {
            onRequest: onRequest
        };

    });