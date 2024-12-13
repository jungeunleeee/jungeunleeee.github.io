document.addEventListener("DOMContentLoaded", function(){
  /* 컨텐츠 내 독립적인 스크립트 */
  /* sec1 + header : 글자 효과 + 스크롤시 헤더 안의 색상 변경 */
  window.addEventListener('load', animateElements);
  window.addEventListener('scroll', function() {
    if (window.scrollY === 0) {
      animateElements();
    } else if(window.scrollY >= 500) {
      resetAnimation();
    }
  });

  function animateElements() {
    // 애니메이션 효과를 적용
    const book = document.querySelector('.book');
    const headings1 = document.querySelector('#sec1 .text-wrap > h2 > span:first-child');
    const headings2 = document.querySelector('#sec1 .text-wrap > h2 > span:last-child');
    const btnWrap = document.querySelector('.btn-wrap');

    // 책 이미지 나타나기
    book.classList.add('show');

    // 첫 번째 헤딩 나타나기
    setTimeout(() => {
      headings1.classList.add('show');
    }, 500); // 0.3초 후에 나타남

    // 두 번째 헤딩 나타나기
    setTimeout(() => {
      headings2.classList.add('show');
    }, 700); // 0.3초 후에 나타남

    // 버튼 나타나기
    setTimeout(() => {
      btnWrap.classList.add('show');
    }, 1000); // 0.9초 후에 나타남
  }
  function resetAnimation() {
    const elements = [
      document.querySelector('.book'),
      document.querySelector('#sec1 .text-wrap > h2 > span:first-child'),
      document.querySelector('#sec1 .text-wrap > h2 > span:last-child'),
      document.querySelector('.btn-wrap')
    ];

    elements.forEach(el => el.classList.remove('show'));
  }

  /* sec2 : 요소가 떨어지는 에니메이션 적용 */
  let animationWrap = document.querySelector('.animation-wrap');
  let descWrap = document.querySelector('#sec2 .desc-wrap');
  let imageWrap = document.querySelector('.image-wrap');
  let card = document.querySelector('.card');
  let imageWrapHeight = imageWrap.clientHeight;
  let isAdded = false; // 클래스 추가 상태를 추적
  const firstScreen = document.querySelector('#sec2 .phone-wrap .first');
  const secondScreen = document.querySelector('#sec2 .phone-wrap .second');
  let hasTransitioned = false; // 애니메이션이 실행되었는지 확인하는 변수
  window.addEventListener('scroll', function () {
    let scrollTop = window.pageYOffset - animationWrap.offsetTop + descWrap.offsetTop / 6;
    let scrollRange = animationWrap.clientHeight - imageWrapHeight;
    let middlePoint = scrollRange * 0.1; // 20% 지점

    // 중간 지점에서 클래스 추가
    if (scrollTop >= middlePoint && scrollTop <= scrollRange) {
      if (!isAdded) {
        card.classList.add('on'); // `on` 클래스 추가
        isAdded = true; // 상태 업데이트
      }
    }

    // 역방향 스크롤 시 클래스 제거
    if (scrollTop < middlePoint && isAdded) {
      // 역방향 스크롤 시 화면 초기화
      firstScreen.style.opacity = 1;
      secondScreen.style.opacity = 0;
      card.classList.remove('on'); // `on` 클래스 제거
      isAdded = false; // 상태 업데이트
    }

    // 마지막 상태에서 이미지 투명 처리
    if (scrollTop > scrollRange - 20) {
      imageWrap.style.top = `${scrollRange - 20}px`;
      card.classList.remove('on'); // `on` 클래스 제거
      imageWrap.style.opacity = 0; // 이미지 사라짐
      // 2초 후에 화면 전환 애니메이션 (두 번째 이미지로 전환)
      setTimeout(() => {
        firstScreen.style.opacity = 0;
        secondScreen.style.opacity = 1;
        hasTransitioned = true; // 애니메이션이 실행되었음을 기록
      }, 0); // 0.5초 후에 화면 전환
    } else {
      // 스크롤 범위 내에서 이미지 다시 나타나기
      firstScreen.style.opacity = 1;
      secondScreen.style.opacity = 0;
      imageWrap.style.opacity = 1;
    }

    // 이미지 위치 업데이트
    if (scrollTop >= 0 && scrollTop <= scrollRange) {
      imageWrap.style.top = `${scrollTop}px`;
    }
  });

// 이미지에 opacity 변화를 부드럽게 하기 위한 transition 추가
  imageWrap.style.transition = 'opacity 0.3s ease-in-out';

  /* sec3 : 요소가 펼처지는 애니메이션 적용 */
  var slideImages = document.querySelectorAll('.slide-image');
  var buttons = document.querySelectorAll('.bullet');
  var descWraps = document.querySelectorAll('#sec3 .desc-wrap');  // 각 설명 요소

  function handleMouseOver() {
    var index = [...slideImages].indexOf(this);


    slideImages.forEach((slideImage, i) => {
      slideImage.classList.remove('active');
      buttons[i].classList.remove('active');
      descWraps[i].classList.remove('active');
    });

    this.classList.add('active');
    buttons[index].classList.add('active');
    descWraps[index].classList.add('active');  // 해당 순번의 설명 활성화
  }
  function handleClick() {
    var index = [...buttons].indexOf(this);

    buttons.forEach((button, i) => {
      button.classList.remove('active');
      slideImages[i].classList.remove('active');
      descWraps[i].classList.remove('active');  // 해당 순번의 설명도 비활성화
    });

    this.classList.add('active');
    slideImages[index].classList.add('active');
    descWraps[index].classList.add('active');  // 해당 순번의 설명 활성화
  }
  slideImages.forEach(slideImage => {
    slideImage.addEventListener('mouseover', handleMouseOver);
  });
  buttons.forEach(button => {
    button.addEventListener('click', handleClick);
  });

  /* sec4,sec5 : 풀페이지 효과 */
  // 필요한 요소들의 참조와 높이를 초기 설정합니다.
  let element, sec4, sec5, sec6;
  let elementTopOffset, elementFullHeight, halfPageHeight;
  setElementReferencesAndSizes();

  // 스크롤 이벤트 최적화를 위한 변수를 설정합니다.
  let lastScrollTop = 0;
  let ticking = false;

  window.addEventListener("scroll", () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        handleScroll();
        ticking = false;
      });
      ticking = true;
    }
  });

  // 요소들의 참조를 설정하고 높이를 계산하는 함수입니다.
  function setElementReferencesAndSizes() {
    element = document.querySelector('#full-wrap');
    sec4 = document.querySelector('#sec4');
    sec5 = document.querySelector('#sec5');
    sec6 = document.querySelector('#sec6');
    // 각 섹션의 높이를 더 줄여서 총 스크롤 길이를 더욱 줄임
    const sec4Height = sec4.clientHeight * 0.6;  // sec4의 높이를 40%로 조정
    const sec5Height = sec5.clientHeight * 0.8;  // sec5의 높이를 40%로 조정
    const sec6Height = sec6.clientHeight * 1.2;  // sec6의 높이를 40%로 조정

    element.style.height = `${sec4Height +sec5Height + sec6Height}px`;
    elementTopOffset = element.offsetTop;
    elementFullHeight = element.offsetHeight;
    halfPageHeight = elementFullHeight / 2;
  }

  // 스크롤 처리 로직
  function handleScroll() {
    const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;

    // 1. 스크롤 방향에 따른 전환 처리
    if (currentScrollTop > lastScrollTop) {
      manageSectionsDown(currentScrollTop);  // 내려감
    } else {
      manageSectionsUp(currentScrollTop);  // 올라감
    }

    // 2. sticky 처리 (해당 범위에서만 고정)
    if (
      currentScrollTop >= elementTopOffset &&
      currentScrollTop < elementTopOffset + halfPageHeight * 2
    ) {
      element.style.position = "sticky";
      element.style.top = "0";
    } else {
      element.style.position = "relative";
    }

    // 스크롤 위치 업데이트
    lastScrollTop = Math.max(0, currentScrollTop);
  }
  // sec4와 sec5 전환 관리
  function manageSectionsDown(scrollTop) {
    var activeHeight = halfPageHeight / 2;
    var sec3 = document.querySelector('#sec3');  // sec3의 참조를 가져옵니다.
    var sec3Height = sec3.clientHeight;  // sec3의 높이를 가져옵니다.
    // 스크롤이 sec4와 sec5 사이에 있는 경우

    if (scrollTop >= elementTopOffset && scrollTop <= elementTopOffset + sec4.clientHeight*0.8) {
      document.getElementById('sec4').classList.add('on');
      document.getElementById('sec5').classList.remove('on');
      activateSection(sec4, sec5);
    }
    // 스크롤이 sec5와 sec6 사이에 있는 경우
    else if (scrollTop > elementTopOffset + sec4.clientHeight*0.8 && scrollTop <= elementTopOffset + sec4.clientHeight + sec5.clientHeight) {
      document.getElementById('sec5').classList.add('on');
      document.getElementById('sec4').classList.remove('on');
      activateSection(sec5, sec4);
    }
      // 스크롤이 sec3과 sec4 사이에 있는 경우
// 스크롤이 sec3과 sec4 사이에 있는 경우
    else if (scrollTop >= elementTopOffset - sec3Height && scrollTop < elementTopOffset) {
      document.getElementById('sec4').classList.remove('on');  // sec4 클래스 제거
      document.getElementById('sec4').classList.remove('active');  // sec4 클래스 제거
    }
  }

  function manageSectionsUp(scrollTop) {
    var activeHeight = halfPageHeight / 2;

    // 스크롤이 sec4와 sec5 사이에 있는 경우
    if (scrollTop >= elementTopOffset && scrollTop < elementTopOffset + sec4.clientHeight) {
      document.getElementById('sec4').classList.add('on');
      document.getElementById('sec5').classList.remove('on');
      activateSection(sec4, sec5);
    }
    // 스크롤이 sec5와 sec6 사이에 있는 경우
    else if (scrollTop >= elementTopOffset + sec4.clientHeight && scrollTop < elementTopOffset + sec4.clientHeight + sec5.clientHeight) {
      document.getElementById('sec5').classList.add('on');
      document.getElementById('sec4').classList.remove('on');
      activateSection(sec5, sec4);
    }
  }
  // 활성화된 섹션을 관리하는 함수
  function activateSection(active, inactive) {
    if (!active.classList.contains("active")) {
      inactive.classList.remove("active");
      active.classList.add("active");
    }
  }

  /* sec6 : 요소 무한롤링 */
  window.addEventListener('load', function() {
    setFlowBanner();
  });
  function setFlowBanner() {
    const wrap = document.querySelector('.flow_banner');
    const list = document.querySelector('.flow_banner .list');
    let wrapWidth = ''; // $wrap의 가로 크기
    let listWidth = ''; // $list의 가로 크기
    let speed = 92; // 1초에 몇 픽셀 이동하는지 설정

    if(window.innerWidth < 1400) {
      speed = 40
    }

    // 리스트 복제
    let clone = list.cloneNode(true);
    wrap.appendChild(clone);
    flowBannerAct();

    // 반응형 :: 디바이스가 변경될 때마다 배너 롤링 초기화

    // 배너 실행 함수
    function flowBannerAct() {
      // 배너 롤링 초기화
      if (wrapWidth !== '') {
        const lists = wrap.querySelectorAll('.list');
        lists.forEach((item, index) => {
          if (index > 0) item.style.animation = 'none'; // 첫 번째 리스트는 유지
        });
        // n+3번째 이후의 리스트 제거 (있을 때만)
        const extraList = wrap.querySelector('.list:nth-of-type(n+3)');
        if (extraList) {
          extraList.remove();
        }
      }

      wrapWidth = wrap.offsetWidth;
      listWidth = list.offsetWidth;

      // 무한 반복을 위해 리스트를 복제 후 배너에 추가
      if (listWidth < wrapWidth) {
        const listCount = Math.ceil(wrapWidth * 2 / listWidth);
        for (let i = 2; i < listCount; i++) {
          clone = list.cloneNode(true);
          wrap.appendChild(clone);
        }
      }

      const listsAfterClone = wrap.querySelectorAll('.list');
      listsAfterClone.forEach(item => {
        item.style.animation = `${listWidth / speed}s linear infinite flowRolling`;
      });
    }
  }

  /* [공통] */
  /* 스파이 스크롤 & 이벤트(텍스트) */
  scrollSlide()
  /* 스파이스 스크롤 */
  function showPage(n) {
    var section = document.querySelectorAll('.sec')[n - 1];
    var scrollAmt = section ? section.offsetTop : 0;

    window.scrollTo({
      top: scrollAmt,
      behavior: 'smooth'
    });
  }
  function checkPageNow() {
    var scrollAmt = document.documentElement.scrollTop || document.body.scrollTop;
    var n = 0;
    document.querySelectorAll('.sec').forEach(function (section, i) {
      var min = section.offsetTop - (window.innerHeight / 2);
      var max = section.offsetTop + section.offsetHeight - (window.innerHeight / 2);

      if (scrollAmt > min && scrollAmt <= max) {
        n = i + 1;
        return false;
      }
    });
    document.querySelectorAll('.sec').forEach(function (section) {
      section.classList.remove('on');
      section.classList.remove('active');
    });
    if (n > 0) {
      document.querySelector('.sec:nth-child(' + n + ')').classList.add('on');
    }

    if (n === 5) {
      /*   document.getElementById('sec4').classList.remove('on');
         document.getElementById('sec5').classList.remove('on');*/
      gsap.utils.toArray('path').forEach(path => { // 문서 내의 모든 path 요소를 배열로 가져옴
        const length = path.getTotalLength(); // 각 path의 총 길이를 계산하여 애니메이션의 기준이 되는 길이를 반환
        path.style.strokeDasharray = length; // path 요소의 strokeDasharray 속성을 경로의 총 길이와 동일하게 설정하여 전체 경로가 동일한 길이의 대시로 구성된 것처럼 보이게 함
        path.style.strokeDashoffset = length; // strokeDashoffset을 경로의 길이로 설정하여 애니메이션 시작 시 숨겨진 상태로 설정

        // gsap.to로 애니메이션을 설정
        gsap.to(path, {
          strokeDashoffset: 0,
          duration: 7, // 애니메이션 지속 시간
          ease: 'expo.out',  // 이징 함수를 'expo.out'로 변경
        });
      });
    } else {
      // 'path'에 대한 모든 애니메이션을 중지
      gsap.utils.toArray('path').forEach(path => {
        gsap.killTweensOf(path); // 각 path 요소에 대해 애니메이션을 중지
      });
    }
  }
  function scrollSlide() {
    window.addEventListener('scroll', checkPageNow);
    window.addEventListener('resize', checkPageNow);
  }
});