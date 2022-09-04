// DinoWorks Common JS
$(document).ready(function () {
  preventDefaultAnchor();
  firstAni();

  // a.top을 눌렀을 때 제일 위로 가기
  $('#main > button.top').on('click', function () {
    $('html').stop(true).animate({
      'scrollTop': 0
    }, 500)
  });

  // scrollTop 값이 0일때, header opacity 0으로 고정
  $(window).scroll(function () {
    var scrollTop = $(document).scrollTop();
    if (scrollTop === 0) {
      $('#header').addClass('open');
      firstAni();
    } else {
      $('#header').removeClass('open');
    }
  });

  firstAni();

  function firstAni() {
    if($(document).scrollTop() === 0 || $(document).scrollTop() <= $(window).height) {
      $('section:eq(0)').addClass('on');
    } else {
      $('section:eq(0)').removeClass('on');
    }
  }

  // 함수 작동
  scrollSlide();

  // 함수1: 슬라이드 스파이 스크롤
  function scrollSlide() {
    var numPage = $('section.page').length;
    var pageNow = 0;
    var pageNext = 0;
    var pagePrev = 0;
    var isBlocked = false;
    var timerId = '';

    showPage(1);
    checkPageNow();

    $(window).on('scroll resize', function () {
      checkPageNow();
    });

    $('#header > div.content-box > #nav > ul > li > a').on('click', function () {
      var index = $('#header > div.content-box > #nav > ul > li').index($(this).parent());
      showPage(index + 1);
    });

    $('#main > ul.indicator > li > a').on('click', function () {
      var index = $('#main > ul.indicator > li').index($(this).parent());
      showPage(index + 1);
      // alert(index);
    });

    function showPage(n) {
      var scrollAmt = $('section.page:eq(' + (n - 1) + ')').offset().top;
      $('html').stop(true).animate({
        'scrollTop': scrollAmt
      }, 500);
    }


    function checkPageNow() {
      var scrollAmt = $(document).scrollTop();
      var n = 0;
      $('section.page').each(function (i) {
        var min = $(this).offset().top - ($(window).height() / 2);
        var max = $(this).offset().top + $(this).outerHeight(true) - ($(window).height() / 2);

        if (scrollAmt > min && scrollAmt <= max) {
          n = i + 1;
          return false;
        }
      });

      $('#main > ul.indicator > li').removeClass('on');
      $('#main > ul.indicator > li:eq(' + (n - 1) + ')').addClass('on');
      $('section').removeClass('on');
      $('section.page:eq(' + (n - 1) + ')').addClass('on');

      if(pageNow === 1) {
        firstAni();
      } else {
        return false;
      }

      pageNow = n;
      pagePrev = (n <= 1) ? 1 : (n - 1);
      pageNext = (n >= numPage) ? numPage : (n + 1);
      console.log(pagePrev + '/' + pageNow + '/' + pageNext);
    }
  }

  //함수2: 배너슬라이드 : 아직 안넣음


  // 모바일
$('#header a.menu').on('click', function() {
  $(this).toggleClass('close');
  $('nav').toggleClass('open');
});
  
  
// 서브메뉴 표시
$('#gnb > ul > li').each(function() {
  if ($(this).find('ul').length > 0) {
    $(this).find('> a').append('<i class="fas fa-plus mobile"><span>서브메뉴 있음(열기)</span></i>');
  }
});

// 열기/닫기
$('#nav > ul > li > a').on('click', function(e) {
  var windowWidth = $(window).width();
  if (windowWidth < 1024 && $(this).parent().find('ul').length > 0) {
    e.preventDefault();
    
    var height = 0;
    $(this).next().find('> li').each(function() {
      height += $(this).outerHeight(true);
    });
    $(this).next().css({'height': height + 'px'});
    
    $(this).parent().siblings().each(function() {
      $(this).find('ul').css({'height': '0px'});

    });
  }
});


$(window).on('resize', function() {
  var windowWidth = $(window).width();
  if (windowWidth >= 1024) {
    $('#nav > ul > li > ul').removeAttr('style');
    $('#header a.menu').removeClass('close');
    console.log('+pc');
  } else if(windowWidth < 1024) {
    console.log('+mobile');
    $( '#main-visual ul.image > li' ).removeClass('on');
  }
});

$(window).scroll(function() {
  console.log('s');
  var scrollTop = $(document).scrollTop();

  if(scrollTop >= 150) {
    $('#main-visual > div.content-box > div.box:nth-child(2)').css({'opacity' : 1});
  } else {
    $('#main-visual > div.content-box > div.box:nth-child(2)').css({'opacity' : 0});
  }
});

});


function preventDefaultAnchor() {
  $(document).on('click', 'a[href="#"]', function (e) {
    e.preventDefault();
  });
}
