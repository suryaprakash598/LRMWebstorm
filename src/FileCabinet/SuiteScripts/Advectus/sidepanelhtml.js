<div id="sidePanel">
        <span class="closeBtn">&times;</span>
        <h2>Side Panel Content</h2>
        <p>This is a simple side panel.</p>
    </div>

    <script>
        $(document).ready(function() {
            // Open the side panel
            $("#custpage_open_filtersetup").click(function() {
                $("#sidePanel").css("width", "250px");
            });

            // Close the side panel
            $(".closeBtn").click(function() {
                $("#sidePanel").css("width", "0");
            });
        });
    </script>
	<style>
        /* Style for the side panel */
        #sidePanel {
            width: 0;
            height: 100%;
            position: fixed;
            top: 0;
            right: 0;
            background-color: #333;
            overflow-x: hidden;
            transition: 0.3s;
            padding-top: 60px;
            color: white;
            text-align: center;
        }

        /* Close button */
        .closeBtn {
            position: absolute;
            top: 10px;
            right: 25px;
            font-size: 30px;
            cursor: pointer;
        }

        /* Button to open panel */
        #openBtn {
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 10px 20px;
            background-color: #007bff;
            color: white;
            border: none;
            cursor: pointer;
            font-size: 16px;
            border-radius: 5px;
        }
    </style>