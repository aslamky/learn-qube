var OV; // OpenVidu object to initialize a session
var session; // Session object where the user will connect
var publisher; // Publisher object which the user will publish
var sessionId; // Unique identifier of the session
var audioEnabled = true; // True if the audio track of publisher is active
var videoEnabled = true; // True if the video track of publisher is active

publisherOptions = {
  audio: true, // Whether you want to transmit audio or not
  video: true, // Whether you want to transmit video or not
  audioActive: true, // Whether you want to start the publishing with your audio unmuted or muted
  videoActive: true, // Whether you want to start the publishing with your video enabled or disabled
  quality: "MEDIUM", // The quality of your video ('LOW', 'MEDIUM', 'HIGH')
  screen: false // true to get your screen as video source instead of your camera
};

function populateDeviceSelection(retval, devices) {
  for (var i = 0; i < devices.length; i++) {
    var deviceInfo = devices[i];
    $a = $("<a>").prop({
      href: "#",
      text: deviceInfo.label
    });
    $a.addClass("mediadevice");
    $a.data("deviceInfo.deviceId", deviceInfo.deviceId);
    $a.data("deviceInfo.kind", deviceInfo.kind);

    $li = $("<li>").append($a);

    if (deviceInfo.kind === "audioinput") {
      $li.addClass("audio");
      $("#audioinput").append($li);
    }

    if (deviceInfo.kind === "videoinput") {
      $li.addClass("video");
      $("#videoinput").append($li);
    }
  }
}

$("body").on("click", "a.mediadevice", function(event) {
  $aref = $(event.target);
  try {
    deviceId = $aref.data("deviceInfo.deviceId");
    deviceInput = $aref.data("deviceInfo.kind");
    deviceType = deviceInput.replace("input", "");
    if (deviceId && deviceType) {
      session.unpublish(publisher);
      publisher = OV.initPublisher("publisher", publisherOptions);
      publisher.stream.outboundOptions.mediaConstraints[deviceType] = {
        deviceId: { exact: deviceId }
      };
      session.publish(publisher);
      $active = $("." + deviceType + ".active");
      if ($active.length == 1) {
        $active.removeClass("active");
      }
      $aref.parent().addClass("active");
      $("#" + deviceInput)
        .parent(".dropdown")
        .removeClass("open");
    }
  } catch (err) {}
  event.preventDefault();
  return false;
});

$("#screenshare").on("click", function() {
  session.unpublish(publisher);
  publisher = OV.initPublisher("publisher", { screen: true }, function(error) {
    if (error.name == "SCREEN_EXTENSION_NOT_INSTALLED") {
      swal({
        title: "Missing Screen Sharing Extension",
        width: "350px",
        type: "error",
        html:
          'Please install <a target="_blank" href="' +
          error.message +
          '">WebRTC Screen Sharing Extension.</a><br>Reload this page and click on <b><i>Screen Sharing</i></b> <i class="fa fa-desktop"></i> button again.'
      });
      console.log(error);
    }
  });
  session.publish(publisher);
});

$("#camselect").on("change", function() {
  session.unpublish(publisher);
  var deviceId = $("#camselect :selected").val();
  publisher = OV.initPublisher("publisher", publisherOptions);
  publisher.stream.outboundOptions.mediaConstraints.video.deviceId = {
    exact: deviceId
  };
  session.publish(publisher);
});

window.addEventListener("load", function() {
  joinRoom();
});

window.addEventListener("beforeunload", function() {
  if (session) session.disconnect();
});

peerstreams = {};

function joinRoom(sessionId) {
  if (!sessionId) {
    sessionId = "#Vu2Vu";
  }
  window.sessionId = sessionId;
  window.userId = window.username;
  OV = new OpenVidu();
  session = OV.initSession(OPENVIDU_URL + sessionId + "?secret=openvidu");

  session.on("streamCreated", function(event) {
    console.log("Got connection from " + event.stream.connection.data);
    peerstreams[event.stream.streamId] = event.stream.connection.data;

    var subscriber = session.subscribe(event.stream, "videos");
    subscriber.on("videoElementCreated", function(event) {
      streamId = event.element.id.replace('remote-video-', '');
      setVideoInPanel(event, peerstreams[streamId], streamId);
    });

    subscriber.on("videoElementDestroyed", function(event) {
      debugger;
    });
  });

  session.on("streamDestroyed", function(event) {
   console.log('disposing stale stream');
   event.stream.dispose();
   $('#panel-'+event.stream.streamId).remove();
   event.stream.connection.dispose();
   delete OV.openVidu.session.remoteStreams[event.stream.streamId];
  });

  var prev_panel_id = null;

  function setVideoInPanel(event, title, streamId) {
    // debugger;

//    if(streamId){
//      did = 'panel-' + streamId;
//      $div = $('<div>').attr('id', did);
//      $div.append('<br>');
//      $('#videos').append($div);
//      container = '#' + did;
//    } else {
//      container = "#publisher";
//    }

// 'panel-' + (streamId || 'local')

    parentpanel = $('#webcam_panel')[0];
    panel_id = 'panel-' + (streamId || 'local');
 
    opts = {
      id: panel_id, 
      headerTitle: title,
      content: event.element,
      container: parentpanel.content,
      syncMargins: true
    };

    if (prev_panel_id) {
      opts['position'] = {
        my: "center-top",
        at: "center-bottom",
        of: "#" + prev_panel_id
      }
    } else {
      opts['position'] = 'center-top';
    }
    prev_panel_id = panel_id;

    panel = getPanel(opts);

    $(panel).css({
      width: "99%"
    });

    $(event.element).css({ width: "100%" });

    panel.resize({height: '200px'});

//    panel.reposition({
//        my: 'left-top',
//        at: 'left-top',
//        offsetX: 0,
//        offsetY: $('#videosection .jsPanel').length * 200
//    });

//    setTimeout(function() {
//      $elm = $("#" + event.element.id);
//      $panel = $elm.closest('.jsPanel');
//      console.log($elm);
//      target_height = $elm.height() + 35;
//      console.log(target_height);
//      console.log($panel);
//      $panel[0].resize({
//        height: target_height
//      });
//    }, 500);

    event.element.play();
  }

  function resiRepo(element){
  }

  session.connect(randomString(), username, function(error) {
    if (!error) {
      publisher = OV.initPublisher("publisher", publisherOptions);
      publisher.on("videoElementCreated", function(event) {
        setVideoInPanel(event, username);
      });
      session.publish(publisher);
      OV.getDevices(populateDeviceSelection);
    } else {
      console.log(
        "There was an error connecting to the session:",
        error.code,
        error.message
      );
    }
  });
  return false;
}

function leaveRoom() {
  session.disconnect();
}

function randomString() {
  return Math.random()
    .toString(36)
    .slice(2);
}
