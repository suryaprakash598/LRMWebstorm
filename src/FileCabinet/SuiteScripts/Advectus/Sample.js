/**
 * @NApiVersion 2.x
 * @NScriptType Suitelet
 */

define(['N/ui/serverWidget', 'N/runtime'], function(serverWidget, runtime) {

    function onRequest(context) {
        var form = serverWidget.createForm({
            title: 'User Default Color Example'
        });

        // Get the user's preferred color
        var userColor = runtime.getCurrentUser().getPreference('theming.usercolor');

        // Set up a field to display the user's preferred color
        var colorField = form.addField({
            id: 'custpage_user_color',
            type: serverWidget.FieldType.INLINEHTML,
            label: 'User Preferred Color'
        });

        // Set the HTML content of the color field to display the user's color
        colorField.defaultValue = '<div style="background-color: ' + userColor + '; width: 100px; height: 100px;"></div>';

        context.response.writePage(form);
    }

    return {
        onRequest: onRequest
    };

});
