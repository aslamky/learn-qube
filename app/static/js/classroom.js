function getPanel(opts) {
  opts = $.extend({}, {
    position: "center-top",
    theme: "success",
    border: "1px solid",
    contentSize: "99% 590",
    iconfont: "material-icons",
    maxtoScreen: true,
    onbeforemaximize: function() {
      var container = $("#" + this.parentElement.id);
      var container_class = container.attr("class");
      if (container_class == "col-md-12") {
        return false;
      }
      container.data("class", container_class);
      container.removeClass(container_class).addClass("col-md-12");
      this.resize({ width: "100%" });
      return true;
    },
    onbeforenormalize: function() {
      var container = $("#" + this.parentElement.id);
      var container_class = container.data("class");
      container.addClass(container_class).removeClass("col-md-12");
      this.resize({ width: "100%" });
      return true;
    }
  }, opts);
  var panel = jsPanel.create(opts)
  $(panel).css({'width':'99%'});
  return panel;
}

default_panels = [
  {
    header: false,
    headerRemove: true,
    contentSize: "99% 626",
    container: '#webcam_container',
    id: "webcam_panel",
    contentOverflow: 'scroll'
  },
  {
    headerTitle: "Whiteboard",
    container: "#whiteboard_container",
    id: "whiteboard_panel",
    content: `<iframe src="/static/method-draw/editor/index.html" width="100%" height="100%" style="min-height: 500px"></iframe>`
  },
  {
    headerTitle: "Chats",
    container: "#chat_container",
    id: "chat_panel",
    content: `<div style="height:548px; overflow-y: auto;" id="conversations"></div>
              <textarea id="chatinput" rows="2" cols="30" style="width:100%;"></textarea>`
  }
];

$(document).ready(function() {
  $('#username').html(username);
  for (let panel_opts of default_panels) {
    getPanel(panel_opts);
  }

  var parentpanel = $('#webcam_panel')[0];
  $(parentpanel.content).css({ 'overflow': 'auto' });
  window.parentpanel = parentpanel;
});

