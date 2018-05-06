/*
 * ext-svgsocket.js
 */

client_id = amplify.store('username');
var ds = deepstream(amplify.store('DEEPSTREAM_URL'));
ds.login();

ds.event.subscribe('elementChanged', function(data){
    if(data.client_id === client_id){
      return;
    }
    var svg = svgCanvas.svgCanvasToString();
    if(svg != data.svg){
      window.remotesvg = data.svg;
      console.log(data.svg);
      svgCanvas.setSvgString(data.svg);
    }
})

methodDraw.addExtension("svgsocket", function() {
    return {
      name: "svgsocket",
      elementChanged: function(opts) {
        if(["text", "textedit"].indexOf(svgCanvas.getMode()) >= 0){
          return;
        }
        var svg = svgCanvas.svgCanvasToString();
        data = {client_id:client_id, svg:svg};
        if (svg != window.svgbuf && svg != window.remotesvg) {
          window.svgbuf = svg;
          ds.event.emit('elementChanged', data);
        }
        // debugger;
      },
      elementTransition: function(opts) {
      }
    };
});

