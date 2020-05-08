$(document).ready(function() {

  var welcome = false;
  var username;

  $("#ask_name button").click(function() {
    startChat();
  });

  $("#ask_name input").keypress(function(e) {
    if (e.which === 13) {                         //enter key
      startChat();
    }
  });

  function startChat() {
    username = $("#ask_name input").val();
    if( username !== "") {
      $("#ask_name").parents(".container").fadeOut().addClass("d-none").removeClass("d-flex");
      socket.emit("user connected", $("#ask_name input").val());
      socket.emit('add user', $("#ask_name input").val());
      $("#enter_message").parents(".container").removeClass("d-none");
      $("#messages").show();
      $("#m").focus();
      if (!welcome) {
        $("#messages").append($("<li>").html("<b>Welcome to the TermenVoxSuperChatServer! Enjoy conversation lad!</b>"));
        welcome = true;
      }
    } else {
      $("#name_error").show();
    }
  }

  var socket = io(); 
  $("#enter_message").submit(function(e) {      //trigger the submit event for the selected elements and attach a function to submited event
    e.preventDefault();             //prevents page reloading and actual submitting of the form
    socket.emit("chat message", $("#m").val(), $("#ask_name input").val());     // .val - get the values of form elements, such as input, select, textarea etc. .emit - Emits an event to the socket identified by the string name. After comma any other parameters can be included. We included a value of the input field. So we emit the event to the socket "chat message" with the parameter - value of the input field
    $("#m").val("");          // then we clean the input field - empty string.
    return false;             // we can cancel the submit action by calling .preventDefault() on the event object or by returning false from our handler. So we did both of them
  });

  socket.on("chat message", function(msg, user_name) {
    $("#messages").append($("<li>").html( function() {
      return "<b>" + user_name + "</b>:" + " &ensp; " + msg;
    }));
  });

  socket.on("user connected", function(user_name) {
    $("#messages").append($("<li>").html( function() {
      return "<i>" + user_name + " connected" + "</i>";
    }));
    
  });


  socket.on("user disconnected", function(user_name) {
    if (user_name) {
      $("#messages").append($("<li>").html( function() {
        return "<i>" + user_name + " disconnected" + "</i>";
      }));
    }
  });

});