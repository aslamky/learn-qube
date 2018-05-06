var ds = deepstream(DEEPSTREAM_URL);
ds.login();

function sendMsg(message){
    if(!message){
        message = $('#chatinput').val().trim();
    }
    if(!message){
      return;
    }
    data = {
        message: message,
        timestamp: new Date().toISOString(),
        client: username
    }
    ds.event.emit('message', data);
    $('#chatinput').val('');
}

$(document).ready(function(){
    $("#chatinput").keyup(function(e) {
       var code = e.keyCode ? e.keyCode : e.which;
       if (code == 13) {  // Enter keycode
           sendMsg();
       }
    });

    sendMsg(`joined eClassRoom`);
    window.sendMsg = sendMsg;

    $('#sendmsg').click(function(){
        sendMsg();
    });

    ds.event.subscribe('message', function(data){
        msgtime = moment(data.timestamp).format('h:mm:ss A');
        format = `<b>${msgtime}</b>: <i>${data.client}</i>: ${data.message}`;
        $span = $('<p>').html(format).css('margin-bottom', '0px');
        $('#conversations').append($span);
    });
});

