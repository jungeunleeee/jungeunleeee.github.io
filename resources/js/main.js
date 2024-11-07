document.addEventListener("DOMContentLoaded", function(){
  /* [공통 상단] */
  const headerHtml = `
    <header>
        <div class="inner-wrap">
            <h1><a href="/index.html"><img src="/resources/images/header/proKids_logo.svg" alt="ProKids"></a></h1>
            <nav>
                <ul>
                    <li><button id="about" href="#">About</button></li>
                    <li><button id="contact" href="#">Contact us</button></li>
                    <li>
                        <div class="select-box dropdown1 ">
                            <button class="label" data-value="KOR">
                                <img src="/resources/images/header/korea_4.png" alt="한국" class="label-img" />
                                <span>KOR</span>
                            </button>
                            <ul class="option-list"></ul>
                        </div>
                    </li>
                </ul>
            </nav>
        </div>
    </header>
  `;
  const footerHtml = `
    <footer>
      <div class="inner-wrap">
          <div class="logo-wrap">
              <h2><img src="/resources/images/footer/iea.svg" alt="IEA - 아이이에이"/></h2>
          </div>
          <div class="footer-info-wrap">
              <div>
                  <ul class="policy-wrap">
                      <li><a href="/pages/policy/terms-of-policy.html">이용약관</a></li>
                      <li><a href="/pages/policy/privacy-policy.html">개인정보 처리방침</a></li>
                  </ul>
                  <ul class="place-info">
                      <li>주소 : 서울특별시 송파구 법원로8길 8 SKV1 910호 (05855)</li>
                      <li>대표전화 : 02-6269-0630</li>
                      <li class="copyright">Copyright ⓒ IEA. All Rights Reserved.</li>
                  </ul>
              </div>
              <div class="select-box dropdown2">
                  <button class="label" data-value="Family Site">
                      <span>패밀리 사이트</span>
                  </button>
                  <ul class="option-list">
                      <li><a href="#">프로</a></li>
                      <li><a href="#">IEA</a></li>
                      <li><a href="#">제이비트리</a></li>
                  </ul>
              </div>
          </div>
      </div>
  </footer>
  `
  let templateHeader = document.createElement('template');
  let templateFooter = document.createElement('template');
  templateHeader.innerHTML = headerHtml;
  templateFooter.innerHTML = footerHtml;
  document.body.prepend(templateHeader.content);
  document.body.append(templateFooter.content);

  /* 헤더 스크롤 */
  const content = document.querySelector('#contents')
  const header = document.querySelector('header');
  if (content.classList.contains('sub')) {
    header.classList.add('sub','scroll');
  }

  window.addEventListener('scroll', function() {
    if (content.classList.contains('sub')) {
      header.classList.add('scroll');
    } else {
      if (window.scrollY === 0) {
        header.classList.remove('scroll');
      } else if(window.scrollY >= 500) {
        header.classList.add('scroll');
      } else {
        header.classList.add('scroll');
      }
    }
  });

  /* [반응형] */
  /* 관련 함수 */
  function throttle(func, wait) {
    var timeout = null;
    return function() {
      var context = this, args = arguments;
      if (!timeout) {
        timeout = setTimeout(function() {
          timeout = null;
          func.apply(context, args);
        }, wait);
      }
    };
  }
  /* [공통] ########################  */
  /* 1. Dropdown : header, footer
  * 특정 드롭다운을 초기화하는 함수
    @param {HTMLElement} dropdownEl 드롭다운 컨테이너 요소
    @param {Array} options 옵션 배열 (예: ['KOR', 'ENG', 'JPN'])
    @param {Function} renderOption 옵션을 렌더링하는 커스텀 함수
  * */
    function initDropdown(dropdownEl, options, renderOption) {
      const label = dropdownEl.querySelector('.label');
      const labelText = label.querySelector('span');
      const optionList = dropdownEl.querySelector('.option-list');

      // 옵션 렌더링 함수
      function renderOptions(selected) {
        optionList.innerHTML = ''; // 기존 옵션 초기화
        const filteredOptions = options.filter(option => option !== selected);

        filteredOptions.forEach(option => {
          const li = document.createElement('li');
          li.classList.add('option-item');
          li.setAttribute('data-value', option);

          // 외부에서 정의한 렌더링 방식 호출
          renderOption(li, option);

          // 옵션 클릭 이벤트 바인딩
          li.addEventListener('click', (event) => {
            handleSelect(option, event);
          });
          optionList.appendChild(li);
        });
      }

      // 옵션 선택 핸들러
      function handleSelect(option, event) {
        if (typeof option === 'object') {
          // 객체 옵션의 경우 링크 이동
          window.open(option.link, '_blank'); // 링크로 이동
          dropdownEl.classList.remove('active'); // 드롭다운 닫기
        } else {
          console.log(`Selected: ${option}`); // 선택된 옵션 콘솔 출력
          labelText.textContent = option; // 라벨 텍스트 업데이트
          label.setAttribute('data-value', option); // 라벨의 데이터 속성 업데이트

          // 선택한 이미지로 라벨 이미지 업데이트
          const flagImages = {
            KOR: 'resources/images/header/korea.svg',
            ENG: 'resources/images/header/america.svg',
            JPN: 'resources/images/header/japan.svg'
          };
          label.querySelector('.label-img').src = flagImages[option]; // 라벨 이미지 업데이트
          label.querySelector('.label-img').alt = `${option} flag`; // alt 속성 업데이트

          // 드롭다운 닫기 및 옵션 재렌더링
          dropdownEl.classList.remove('active');
          renderOptions(option); // 선택된 항목 제외한 옵션 렌더링
        }
      }

      // 라벨 클릭 핸들러 (드롭다운 열기/닫기)
      label.addEventListener('click', () => {
        const isActive = dropdownEl.classList.toggle('active');
        console.log(`Dropdown ${isActive ? 'opened' : 'closed'}`);
        // 드롭다운을 열 때, 현재 선택된 값으로 옵션 렌더링
        renderOptions(label.getAttribute('data-value') || options[0]);
      });

      // 초기 옵션 렌더링
      renderOptions(label.getAttribute('data-value') || options[0]);
    }
  // 1-1. 이미지 포함 옵션 렌더링 함수
    function renderOptionWithImage(li, option) {
      const img = document.createElement('img');
      const flagImages = {
        KOR: 'resources/images/header/korea_4.png',
        ENG: 'resources/images/header/america_4.png',
        JPN: 'resources/images/header/japan_4.png'
      };
      img.src = flagImages[option];
      img.alt = `${option} flag`;
      img.classList.add('option-img');

      const span = document.createElement('span');
      span.textContent = option;

      li.appendChild(img);
      li.appendChild(span);
    }
  // 1-2. 텍스트만 포함된 옵션 렌더링 함수 (링크 이동)
    function renderOptionTextOnly(li, item) {
      const a = document.createElement('a');
      a.textContent = item.option;
      a.href = item.link;
      a.target = '_blank';
      a.addEventListener('click', (event) => {
        event.stopPropagation(); // 부모 이벤트 전파 방지
        dropdownEl.classList.remove('active'); // 드롭다운 닫기
      });
      li.appendChild(a);
    }
  // 1-3. 각 드롭다운에 맞게 초기화
    // 실행문 : header dropdown
    const dropdown1 = document.querySelector('.dropdown1');
    initDropdown(dropdown1, ['KOR', 'ENG', 'JPN'], renderOptionWithImage);

    // 실행문 : footer dropdown
    const dropdown2 = document.querySelector('.dropdown2');
    initDropdown(dropdown2, [
      {option: '프로', link: 'https://procorp.co.kr/'},
      {option: 'IEA', link: 'https://www.iea.co.kr/'},
      {option: '제이비트리', link: 'https://jbtree.co.kr/'}
    ], renderOptionTextOnly);

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
    const imageWrap = document.querySelector('#sec2 .image-wrap');
    const firstImage = document.querySelector('#sec2 .image-wrap .first');
    const secondImage = document.querySelector('#sec2 .image-wrap .second');
    const firstScreen = document.querySelector('#sec2 .phone-wrap .first');
    const secondScreen = document.querySelector('#sec2 .phone-wrap .second');

    let lastScrollY = 0; // 이전 스크롤 값 저장 (스크롤 방향 확인용)
    let screenSwitched = false; // screen 전환 여부 상태

    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      const animationWrap = document.querySelector('.animation-wrap');
      const animationTop = animationWrap.getBoundingClientRect().top + window.scrollY;
      const cardHeight = document.querySelector('.animation-wrap .image-wrap').offsetHeight
      const triggerPoint = animationTop
      const changePoint = triggerPoint + 350;

      // 1. 스크롤이 이미지 교체 영역에 있는 경우 처리
      if (scrollY >= triggerPoint && scrollY <= changePoint) {
        const distance = changePoint - triggerPoint + 600;
        const topValue = ((scrollY - triggerPoint) / distance) * 978;
        imageWrap.style.top = `${topValue}px`;

        firstImage.style.opacity = 1;
        secondImage.style.opacity = 0;

        // 스크린 전환 상태를 리셋
        screenSwitched = false;
        firstScreen.style.opacity = 1;
        secondScreen.style.opacity = 0;
      }

      // 2. 스크롤이 교체 완료 지점에 도달한 경우
      if (scrollY > changePoint && !screenSwitched) {
        const moveTop = animationWrap.offsetHeight - cardHeight -20  + 'px'
        imageWrap.style.top = moveTop;
        firstImage.style.opacity = 0;
        secondImage.style.opacity = 1;

        // 스크린 전환 처리 (1.5초 지연 후 실행)
        setTimeout(() => {
          if (scrollY > changePoint) { // 스크롤 상태를 다시 확인하여 처리
            firstScreen.style.opacity = 0;
            secondScreen.style.opacity = 1;
            screenSwitched = true; // 전환 완료 상태 업데이트
          }
          // 또 다른 timeout을 설정해 secondScreen의 opacity를 0으로 변경
          setTimeout(() => {
            secondImage.style.opacity = 0;
          }, 0); // 원하는 대기 시간을 설정할 수 있습니다.
        }, 1500);
      }

      // 3. 스크롤이 다시 올라갈 때 초기화 처리
      if (scrollY < triggerPoint) {
        imageWrap.style.top = '0';
        firstImage.style.opacity = 1;
        secondImage.style.opacity = 0;
        firstScreen.style.opacity = 1;
        secondScreen.style.opacity = 0;
        screenSwitched = false; // 전환 상태 리셋
      }

      // 4. 스크롤 방향 업데이트
      lastScrollY = scrollY;
    });

  /* sec3 : 요소가 펼처지는 애니메이션 적용 */
    var slideImages = document.querySelectorAll('.slide-image');
    var buttons = document.querySelectorAll('.bullet');
    function handleMouseOver() {
      var index = [...slideImages].indexOf(this);


      slideImages.forEach((slideImage, i) => {
        slideImage.classList.remove('active');
        buttons[i].classList.remove('active');
      });

      this.classList.add('active');
      buttons[index].classList.add('active');
    }
    function handleClick() {
      var index = [...buttons].indexOf(this);

      buttons.forEach((button, i) => {
        button.classList.remove('active');
        slideImages[i].classList.remove('active');
      });

      this.classList.add('active');
      slideImages[index].classList.add('active');
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
      element.style.height = `${sec4.clientHeight + sec5.clientHeight + (sec6.clientHeight)}px`;
      elementTopOffset = element.offsetTop;
      elementFullHeight = element.offsetHeight;
      halfPageHeight = elementFullHeight / 2;
    }

  // 스크롤 처리 로직
    function handleScroll() {
      const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;

      // 1. 스크롤 방향에 따른 전환 처리
      if (currentScrollTop > lastScrollTop) {
        manageSections(currentScrollTop);
      } else {
        manageSections(currentScrollTop);
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
    function manageSections(scrollTop) {
      var activeHeight = halfPageHeight / 2; // 변경
      if (scrollTop < elementTopOffset + activeHeight) { // 변경
        // sec4 활성화
        document.getElementById('sec4').classList.add('on');
        document.getElementById('sec5').classList.remove('on');
        activateSection(sec4, sec5);
      } else if (scrollTop < elementTopOffset + activeHeight * 2) { // 변경
        // sec5 활성화
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
      });
      if (n > 0) {
        document.querySelector('.sec:nth-child(' + n + ')').classList.add('on');
      }
      if (n > 0 && n < 4) {
        document.getElementById('sec4').classList.remove('on');
        document.getElementById('sec5').classList.remove('on');
      }

      if (n === 5) {
        gsap.utils.toArray('path').forEach(path => { // 문서 내의 모든 path 요소를 배열로 가져옴
          const length = path.getTotalLength(); // 각 path의 총 길이를 계산하여 애니메이션의 기준이 되는 길이를 반환
          path.style.strokeDasharray = length; // path 요소의 strokeDasharray 속성을 경로의 총 길이와 동일하게 설정하여 전체 경로가 동일한 길이의 대시로 구성된 것처럼 보이게 함
          path.style.strokeDashoffset = length; // strokeDashoffset을 경로의 길이로 설정하여 애니메이션 시작 시 숨겨진 상태로 설정

          // gsap.to로 애니메이션을 설정
          gsap.to(path, {
            strokeDashoffset: 0,
            duration: 2, // 애니메이션 지속 시간
            ease: 'power2.inOut', // 애니메이션 이징
          });
        });
      } else {
        // 'path'에 대한 모든 애니메이션을 중지
        gsap.utils.toArray('path').forEach(path => {
          gsap.killTweensOf(path); // 각 path 요소에 대해 애니메이션을 중지
        });
      }


      if (pageNow === 1) {
      } else {
        return false;
      }
      pageNow = n;
      pagePrev = (n <= 1) ? 1 : (n - 1);
      pageNext = (n >= numPage) ? numPage : (n + 1);
      console.log(pagePrev + '/' + pageNow + '/' + pageNext);
    }
    function scrollSlide() {
      window.addEventListener('scroll', checkPageNow);
      window.addEventListener('resize', checkPageNow);
  }

  /* 헤더 상단 바로가기(스크롤) */
    document.getElementById('about').addEventListener('click', function() {
      showPage(1);
    });
    document.getElementById('contact').addEventListener('click', function() {
      showPage(7);
    });
});



