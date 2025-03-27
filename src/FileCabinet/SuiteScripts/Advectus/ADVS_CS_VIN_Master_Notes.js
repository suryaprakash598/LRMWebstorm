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

define(['N/runtime', 'N/ui/dialog', 'N/record', 'N/search', 'N/log','N/url', 'N/https'], function(
    /** @type import('N/runtime')}   **/ runtime,
    /** @type import('N/ui/dialog')} **/ dialog,
    /** @type import('N/record')}    **/ record,
    /** @type import('N/search')}    **/ search,
    /** @type import('N/log')}       **/ log,
    /** @type import('N/log')}       **/ url,
    /** @type import('N/log')}       **/ https
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
    var _currentRecord = '';

    function pageInit(context)
    {
        _currentRecord = context.currentRecord;
        disableUserNotesSublist(_currentRecord);
    }
    function disableUserNotesSublist(_currentRecord)
    {
        let lineCount = _currentRecord.getLineCount({ sublistId: 'custpage_notes_sublist' });

        for (let i = 0; i < lineCount - 1; i++) { // Exclude last row (new row)
            let col1 = _currentRecord.getSublistValue({ sublistId: 'custpage_notes_sublist', fieldId: 'custsublist_date', line: i });
            let col2 = _currentRecord.getSublistValue({ sublistId: 'custpage_notes_sublist', fieldId: 'custsublist_notes', line: i });

            if (col2!='') {
                // Disable existing lines if they have data
                // currentRecord.getSublistField({ sublistId: 'custpage_notes_sublist', fieldId: 'custsublist_date', line: i }).isDisabled = true;
                _currentRecord.getSublistField({ sublistId: 'custpage_notes_sublist', fieldId: 'custsublist_notes', line: i }).isDisabled = true;
            }
        }
    }

    return {
        'pageInit':pageInit
    };

});
