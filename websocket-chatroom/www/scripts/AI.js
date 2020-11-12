var $messages = $('.messages-content'),
    d, h, m,
    i = 0;

$(window).load(function() {
  $messages.mCustomScrollbar();
  /*setTimeout(function() {
    fakeMessage();
  }, 100);*/
  $('<div class="message new"><figure class="avatar"><img src="bili.jpg" /></figure>' + '啊♂乖乖♂站好♂' + '</div>').appendTo($('.mCSB_container')).addClass('new');
  setDate();
  updateScrollbar();
});


function updateScrollbar() {
  $messages.mCustomScrollbar("update").mCustomScrollbar('scrollTo', 'bottom', {
    scrollInertia: 10,
    timeout: 0
  });
}

function setDate(){
  d = new Date()
  if (m != d.getMinutes()) {
    m = d.getMinutes();
    $('<div class="timestamp">' + d.getHours() + ':' + m + '</div>').appendTo($('.message:last'));
    $('<div class="checkmark-sent-delivered">&check;</div>').appendTo($('.message:last'));
    $('<div class="checkmark-read">&check;</div>').appendTo($('.message:last'));
  }
}

function insertMessage() {
  msg = $('.message-input').val();
  if ($.trim(msg) == '') {
    return false;
  }
  $('<div class="message message-personal">' + msg + '</div>').appendTo($('.mCSB_container')).addClass('new');
  setDate();
  $('.message-input').val(null);
  updateScrollbar();
  setTimeout(function() {
    fakeMessage(msg);
  }, 1000 + (Math.random() * 20) * 100);
  //alert("input"+msg);
}

$('.message-submit').click(function() {
  insertMessage();
});

$(window).on('keydown', function(e) {
  if (e.which == 13) {
    insertMessage();
    return false;
  }
})

var Fake = [
  '丢雷楼某',
  '吔屎了',
  'Fuck ♂ You',
  '啊♂乖乖♂站好♂',
  'boy next door',
  '易♂建♂联',
  '蒙♂古♂牛♂奶',
  'Yes ♂ Sir',
  '',
  'Anyway I\'ve gotta go now',
  'It was a pleasure chat with you',
  '',
  'Bye',
  ':)'
]

function fakeMessage(msg) {
  if ($('.message-input').val() != '') {
    return false;
  }
  $('<div class="message loading new"><figure class="avatar"><img src="bili.jpg" /></figure><span></span></div>').appendTo($('.mCSB_container'));
  updateScrollbar();
  
  url = 'http://www.tuling123.com/openapi/api?key=f9ead0aad301411392637cc46708c5cd&info='+msg;
  var newMsg = '';
  $.getJSON(url,function(data){
    newMsg = data.text;
   // alert(newMsg);
    $('.message.loading').remove();
    $('<div class="message new"><figure class="avatar"><img src="bili.jpg" /></figure>' + newMsg + '</div>').appendTo($('.mCSB_container')).addClass('new');
    setDate();
    updateScrollbar();
  });
 

/*  setTimeout(function() {
    $('.message.loading').remove();
    $('<div class="message new"><figure class="avatar"><img src="bili.jpg" /></figure>' + Fake[i] + '</div>').appendTo($('.mCSB_container')).addClass('new');
    setDate();
    updateScrollbar();
    i++;
  }, 1000 + (Math.random() * 20) * 100);*/

}

$('.button').click(function(){
  $('.menu .items span').toggleClass('active');
   $('.menu .button').toggleClass('active');
});

$('#closePanel').click(function(){
  $('#cusService').hide();
});

$('#showBilly').click(function(){
  $('#cusService').show();
});

$('.dropdown-item').click(function(){
  //alert(this.innerHTML);
  document.getElementById('talkTo').innerHTML = this.innerHTML;
});