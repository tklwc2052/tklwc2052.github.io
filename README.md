hi kl here :P
uh idfk what im doing here BUT
if this site isnt blocked, https://tuff.speedslicer.dev/ 
then go to a new blank google site and paste this code into a new fully embeded page;

"<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Minimal Launcher</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        /* Custom styling for the launcher page */
        body {
            font-family: 'Inter', sans-serif;
            background-color: #000; /* Black background */
        }
    </style>
</head>
<body class="min-h-screen flex items-center justify-center p-4">

    <!-- The button is now directly in the center of the black background -->
    <button 
        id="launchButton"
        onclick="openBlankAndInject()"
        class="w-48 bg-white hover:bg-gray-200 text-black font-semibold py-3 rounded-lg transition duration-200 shadow-lg shadow-white/30 focus:outline-none focus:ring-4 focus:ring-white focus:ring-opacity-50"
    >
        Launch
    </button>

    <script>
        // Store original button text and classes
        const originalButtonText = "Launch";
        const originalButtonClass = "bg-white text-black";

        // SVG Data URI for the 9-dot Apps Grid Icon (Chrome New Tab look)
        const chromeIconSvg = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%236e6e6e' d='M6 6h3v3H6zm5 0h3v3h-3zm5 0h3v3h-3zm-5 5h3v3h-3zm-5 0h3v3H6zm10 0h3v3h-3zm-5 5h3v3h-3zm-5 0h3v3H6zm10 0h3v3h-3z'/%3E%3C/svg%3E`;


        function openBlankAndInject() {
            const button = document.getElementById('launchButton');
            // Reset button to original state on every click attempt
            button.innerText = originalButtonText;
            button.classList.remove('bg-red-600', 'text-white');
            button.classList.add('bg-white', 'text-black');


            const urlToEmbed = "https://tuff.speedslicer.dev/files/1_1UT8/WASM/";
            
            // 1. Open a new tab explicitly set to 'about:blank'.
            const newWindow = window.open('about:blank', '_blank');

            if (!newWindow) {
                // Handle popup blockers gracefully
                button.innerText = "Blocked!";
                // Change button style to highlight the error
                button.classList.remove('bg-white', 'text-black');
                button.classList.add('bg-red-600', 'text-white');
                return;
            }

            // 2. Write the complete HTML document containing the iframe directly into the new tab.
            const htmlContent = `
                <!DOCTYPE html>
                <html>
                <head>
                    <!-- Title changed to "New Tab" -->
                    <title>New Tab</title> 
                    <!-- Added icon link using the SVG Data URI for the Chrome New Tab look -->
                    <link rel="icon" type="image/svg+xml" href="${chromeIconSvg}">
                    <style>
                        /* Use full viewport width/height for the content */
                        body { margin: 0; padding: 0; overflow: hidden; background-color: #000; }
                        iframe { 
                            border: none; 
                            width: 100vw; 
                            height: 100vh; 
                            display: block; 
                        }
                    </style>
                </head>
                <body>
                    <iframe src="${urlToEmbed}" title="Embedded Tuff Content"></iframe>
                </body>
                </html>
            `;

            newWindow.document.write(htmlContent);
            newWindow.document.close(); // Important to signal the document is complete
        }
    </script>
</body>
</html>"

________________________________________________________________________________________________________
this will make a button that when u click it it launches a eagler (a very good one) into a about:blank tab, (keeps it fom getting blocked longer prob)(and nobody else will see the link) and if u wanna join my server lmk and ill give u instructions :D
ty for reading lmao
