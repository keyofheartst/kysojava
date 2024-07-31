
$(document).on(
        'change',
        '.btn-file :file',
        function (event) {
            var input = $(this), numFiles = input.get(0).files ? input
                    .get(0).files.length : 1, label = input.val().replace(
                    /\\/g, '/').replace(/.*\//, '');
            input.trigger('fileselect', [numFiles, label]);
            var file = event.target.files[0];


            //Step 2: Read the file using file reader
            var fileReader = new FileReader();

            fileReader.onload = function () {

                //Step 4:turn array buffer into typed array
                var typedarray = new Uint8Array(this.result);

                //Step 5:PDFJS should be able to read this
                PDFJS.getDocument(typedarray).then(function (pdf) {
                    pdf.getPage(1).then(function (page) {

                        //We need to pass it a scale for "getViewport" to work
                        var scale = 1;

                        //Grab the viewport with original scale
                        var viewport = page.getViewport(1);

                        //Here's the width and height
                        console.log("Width: " + viewport.width + ", Height: " + viewport.height);

                        var canvas = document.getElementById('the-canvas');
                        var context = canvas.getContext('2d');
                        canvas.height = viewport.height;
                        canvas.width = viewport.width;

                        // Render PDF page into canvas context.
                        var renderContext = {
                            canvasContext: context,
                            viewport: viewport
                        };
                        page.render(renderContext);
                    });
                });


            };
            //Step 3:Read the file as ArrayBuffer
            fileReader.readAsArrayBuffer(file);
        });