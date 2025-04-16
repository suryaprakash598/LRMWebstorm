/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
define(['N/render', 'N/file', 'N/format'],
    (render, file, format) => {

        function onRequest(context) {
            if (context.request.method === 'GET') {
                const today = format.format({ value: new Date(), type: format.Type.DATE });

                const template = `
                <pdf>
                    <head>
                        <macrolist>
                            <macro id="pageheader"/>
                            <macro id="pagefooter"/>
                        </macrolist>
                    </head>
                    <body font-size="12">
                        <p align="center"><b>Bill of Sale</b></p>
                        <p>LRM Leasing Company Inc.<br/>
                        2160 Blount Road<br/>
                        Pompano Beach FL 33069</p>

                        <br/>

                        <p>Sold to: [INSERT LESSEE INDIVIDUAL NAME]<br/>
                        Date of Sale: ${today}</p>

                        <br/>
                        <p>Address: ___________________________________<br/>
                        * PLEASE NOTE THE ADDRESS BELOW IS WHERE TITLE WILL BE SENT X____ (lessee puts initials)</p>

                        <p>Address: [CUSTOMER TO EDIT DIRECTLY IN ADOBE]<br/>
                        City: _____________ &#160;&#160;&#160; State: _____________ &#160;&#160;&#160; Zip: _____________</p>

                        <br/>
                        <p>I understand that I am purchasing this equipment, as-is, where is, and there are no warranties or guarantee of any kind. X____ (lessee puts initials)</p>

                        <br/>
                        <p>Year: [INSERT HERE] &#160;&#160;&#160; Make: [INSERT HERE] &#160;&#160;&#160; Vin: [INSERT HERE]</p>

                        <br/>
                        <p>Sales Price: $[INSERT HERE]<br/>
                        Sales Tax: $[INSERT HERE]<br/>
                        Total Price: $[INSERT HERE]</p>

                        <br/><br/><br/>

                        <table width="100%">
                            <tr>
                                <td>Seller: LRM Leasing Company Inc.</td>
                                <td>Buyer: [INSERTLESSEEINDIVIDUALNAME]</td>
                            </tr>
                            <tr>
                                <td>Sign: ___________________________</td>
                                <td>Sign: ___________________________</td>
                            </tr>
                            <tr>
                                <td>Date: __________</td>
                                <td>Date: __________</td>
                            </tr>
                        </table>
                    </body>
                </pdf>
            `;

                const pdfFile = render.xmlToPdf({ xmlString: template });
                pdfFile.name = 'PIF_BOS_Automation.pdf';

                context.response.writeFile({
                    file: pdfFile,
                    isInline: false
                });
            }
        }

        return { onRequest };
    });
