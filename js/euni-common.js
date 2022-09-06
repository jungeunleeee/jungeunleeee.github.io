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
    if ($(document).scrollTop() === 0 || $(document).scrollTop() <= $(window).height) {
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

      if (pageNow === 1) {
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
  setBannerSlide('#work div.banner-slide');

  function setBannerSlide(selector) {
    var $selector = $(selector);
    var numBanner = $selector.find('.banner > li').length;
    var bannerNow = 1;
    var bannerPrev = 0;
    var bannerNext = 0;
    var offsetLeft = 0;
    var widthBox = 0;
    var widthBar = 0;
    var offsetLeftMin = 0;
    var loadCounter = 0;
    var startX = 0;
    var startY = 0;
    var delX = 0;
    var delY = 0;
    var offsetX = 0;
    var offsetY = 0;

    setTimeout(function () {
      setStatus();
    }, 800);


    $selector.find('.banner li img').on('load', function () {
      loadCounter++;
      if (loadCounter === $selector.find('.banner li').length) {
        setStatus();
      }
    });

    $selector.find('.control a.prev').on('click', function () {
      if (bannerNow === 1) {
        $selector.find('.banner').css({
          'transition': 'left 0.05s',
          'left': '10px'
        }).one('transitionend', function () {
          $(this).css({
            'transition': 'left 0.1s',
            'left': '0px'
          });
        });
      } else {
        showBanner(bannerPrev);
      }
    });

    // $selector.find('ul.banner').on('mousedown', function(e) {
    //   e.preventDefault();

    //   isBlocked = true;
    //   // 처음클릭한 좌표 값
    //   startX = e.clientX;
    //   startY = e.clientY;
    //   offsetX = $(this).position().left;
    //   offsetY = $(this).position().top;
    //   // console.log(offsetLeft + '/' + offsetY);

    //   $selector.find('ul.banner').on('mousemove', function(e) {
    //     delX = e.clientX - startX;
    //     // 세로로 움직인 값은 저장하지마.
    //     delY = e.clientY - startY;
    //     delY = 0;

    //     console.log(delX + '/' + delY);

    //   });
    // });

    $selector.find('ul.banner').on('mousedown', function (e) {
      e.preventDefault();
      $(this).css({
        'transition': 'none'
      });

      // 초기설정
      isBlocked = true;
      // 처음 마우스를 눌렀을 때의 좌표값
      startX = e.clientX;
      startY = e.clientY;
      // ul.banner의 처음 좌표값
      offsetX = $(this).position().left;
      offsetY = $(this).position().top;

      $(document).on('mousemove', function (e) {
        // 움직인 거리 구하기
        delX = e.clientX - startX;
        delY = e.clientY - startY;
        delY = 0;

        if ((bannerNow === 1 && delX > 0) || (bannerNow === numBanner && delX < 0)) {
          delX = delY / 10;
        }

        // ul.banner의 현재 값 저장
        $selector.find('ul.banner').css({
          'left': (offsetX + delX) + 'px',
          // // 지금 사용하지 않아도됨: 가로만 움직이면 되기에
          // 'top' : (offsetY + delY) + 'px'
        });
        if (Math.abs(delX > 5) || Math.abs(delY > 5)) {
          isBlocked = true;
        }
      });

      // mouse를 누르다가 떼었을 때
      $(document).on('mouseup', function (e) {
        $(document).off('mousemove mouseup');
        if (delX < -50 && bannerNow !== numBanner) {
          showBanner(bannerNext);
        } else if (delX > 50 && bannerNow !== 1) {
          showBanner(bannerPrev);
        } else {
          showBanner(bannerNow);
        }
        delX = delY = 0;
      });

      // ul.banner을 클릭했을 때 이벤트가 작동하지 않게 하기 위해서
      $selector.find('ul.banner').on('click', function (e) {
        if (isBlocked === true) {
          e.preventDefault();
          isBlocked = false;
        }
      });


    });

    $selector.find('.control a.next').on('click', function () {
      if (bannerNow === numBanner) {
        $selector.find('.banner').css({
          'transition': 'left 0.05s',
          'left': (offsetLeftMin - 10) + 'px'
        }).one('transitionend', function () {
          $(this).css({
            'transition': 'left 0.1s',
            'left': offsetLeftMin + 'px'
          });
        });
      } else {
        showBanner(bannerNext);
      }
    });


    $(window).on('resize', function () {
      setStatus();
    });

    function showBanner(n) {
      offsetLeft = -$selector.find('.banner > li:eq(' + (n - 1) + ')').position().left;

      if (offsetLeft <= offsetLeftMin) offsetLeft = offsetLeftMin;
      $selector.find('ul.banner').css({
        'transition': 'left 0.3s',
        'left': offsetLeft + 'px'
      });

      // 숫자 저장
      bannerNow = n;
      bannerPrev = (n === 1) ? 1 : (n - 1);
      bannerNext = (n === numBanner) ? numBanner : (n + 1);
    }

    function setStatus() {
      widthBox = $selector.find('div.box').innerWidth();
      console.log(widthBox);
      widthBar = 0;
      $selector.find('ul.banner > li').each(function () {
        widthBar += $(this).outerWidth(true);
      });
      offsetLeftMin = widthBox - widthBar;
      $selector.find('.banner').css({
        'width': (widthBar + 5) + 'px'
      });

      $selector.find('.banner > li').each(function (i) {
        if (-$(this).position().left <= offsetLeftMin) {
          numBanner = i + 1;
          return false;
        }

      });
      if (numBanner < bannerNow) bannerNow = numBanner;
      showBanner(bannerNow);


    }

  }






  // 모바일
  $('#header a.menu').on('click', function () {
    $(this).toggleClass('close');
    $('nav').toggleClass('open');
  });


  // 서브메뉴 표시
  $('#gnb > ul > li').each(function () {
    if ($(this).find('ul').length > 0) {
      $(this).find('> a').append('<i class="fas fa-plus mobile"><span>서브메뉴 있음(열기)</span></i>');
    }
  });

  // 열기/닫기
  $('#nav > ul > li > a').on('click', function (e) {
    var windowWidth = $(window).width();
    if (windowWidth < 1024 && $(this).parent().find('ul').length > 0) {
      e.preventDefault();

      var height = 0;
      $(this).next().find('> li').each(function () {
        height += $(this).outerHeight(true);
      });
      $(this).next().css({
        'height': height + 'px'
      });

      $(this).parent().siblings().each(function () {
        $(this).find('ul').css({
          'height': '0px'
        });

      });
    }
  });


  $(window).on('resize', function () {
    var windowWidth = $(window).width();
    if (windowWidth >= 1024) {
      $('#nav > ul > li > ul').removeAttr('style');
      $('#header a.menu').removeClass('close');
      console.log('+pc');
    } else if (windowWidth < 1024) {
      console.log('+mobile');
      $('#main-visual ul.image > li').removeClass('on');
    }
  });

  $(window).scroll(function () {
    console.log('s');
    var scrollTop = $(document).scrollTop();

    if (scrollTop >= 150) {
      $('#main-visual > div.content-box > div.box:nth-child(2)').css({
        'opacity': 1
      });
    } else {
      $('#main-visual > div.content-box > div.box:nth-child(2)').css({
        'opacity': 0
      });
    }
  });

});


function preventDefaultAnchor() {
  $(document).on('click', 'a[href="#"]', function (e) {
    e.preventDefault();
  });
}