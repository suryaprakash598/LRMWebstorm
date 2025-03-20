/**
 *@NApiVersion 2.x
 *@NScriptType ClientScript
 */
define(['N/error'],
    function(error) {
        function pageInit(context) { 
            var currentRecord = context.currentRecord;
            
        }
        function saveRecord(context) {
            
            return true;
        }
		function updateCustomerPO(recid)
		{
			try{
              var url='https://8760954.app.netsuite.com/app/site/hosting/scriptlet.nl?script=1673&deploy=1&recid='+recid
              var left = (screen.width/2)-(500/2);
		var top = (screen.height/2)-(500/2);
		var targetWin = window.open (url, 'Customerpo', 'width=900, height=500, top='+top+', left='+left);
				//window.open('')
			}catch(e)
			{
				log.debug('error',e.toString());
			}
		}
       
        return {
            pageInit: pageInit, 
            saveRecord: saveRecord,
			updateCustomerPO:updateCustomerPO
        };
    }); 