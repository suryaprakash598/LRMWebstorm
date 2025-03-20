/*******************************************************************************
{{ScriptHeader}} *
 * Company:                  {{Company}}
 * Author:                   {{Name}} - {{Email}}
 * File:                     {{ScriptFileName}}
 * Script:                   {{ScriptTitle}}
 * Script ID:                {{ScriptID}}
 * Version:                  1.0
 *
 * @NApiVersion 2.0
 * @NScriptType ClientScript
 *
 ******************************************************************************/

define(['N/runtime', 'N/ui/dialog', 'N/record', 'N/search', 'N/log'], function(
  /** @type import('N/runtime')}   **/ runtime,
  /** @type import('N/ui/dialog')} **/ dialog,
  /** @type import('N/record')}    **/ record,
  /** @type import('N/search')}    **/ search,
  /** @type import('N/log')}       **/ log
) {

  /**
   * context.currentRecord
   * context.sublistId
   * context.fieldId
   * context.line
   * context.column
   *
   * @type {import('N/types').EntryPoints.Client.fieldChanged}
   */
  function fieldChanged(context) {
    // no return value
  }

   
  /**
   * context.currentRecord
   * context.mode // [copy, paste, create]
   *
   * @type {import('N/types').EntryPoints.Client.pageInit}
   */
  function pageInit(context) {
    // no return value
  }

   
	function opennewclaim()
	{
		debugger;
		window.open('https://8760954.app.netsuite.com/app/site/hosting/scriptlet.nl?script=1648&deploy=1', width=500, height=500 );
	}
   

  return {
    'fieldChanged':   fieldChanged, 
    'pageInit':       pageInit, 
	'opennewclaim':opennewclaim
  };

});
