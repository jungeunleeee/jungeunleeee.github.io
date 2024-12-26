document.addEventListener("DOMContentLoaded", function(){
  /* [공통 상단] */
  const originalPath = window.location.pathname === '/' ? '/index' : window.location.pathname.replace('.html', '');
  const path = originalPath.replace('.html', '')

  // console.log(originalPath)
  // 로컬 스토리지에 activeNavPath가 없으면 기본값으로 설정
  let activePath = path || '/index'
    const selectedLanguageOption = localStorage.getItem('selectedOption') || 'KOR';
    const flagImages = {
      KOR: 'korea_4.png',
      ENG: 'america_4.png',
      JPN: 'japan_4.png'
    };
    function rendererHeader(selectedOption) {
      let selectedFlagImage = flagImages[selectedOption];
      // 선택값 또는 이미지 파일명이 유효하지 않다면, 기본값으로 변경
      if(!selectedFlagImage) {
        selectedOption = 'KOR';
      }
      // header html 추가
      const headerHtml = `
        <header>
          <div class="inner-wrap">
            <h1><a href="/"><img src="/resources/images/header/proKids_logo.svg" alt="ProKids"></a></h1>
            <nav>
              <ul>
                <li><a href="/">About</a></li>
                <li><a href="/pages/contact">Contact</a></li>
                <li>
                  <div class="select-box dropdown1">
                    <button class="label" data-value="${selectedOption}">
                      <img src="/resources/images/header/${selectedFlagImage}" alt="" class="label-img" />
                      <span>${selectedOption}</span>
                    </button>
                    <ul class="option-list"></ul>
                  </div>
                </li>
              </ul>
            </nav>
          </div>
        </header>
      `;
      let templateHeader = document.createElement('template');
      templateHeader.innerHTML = headerHtml;

      /* footer */
      const footerHtml = `
      <footer>
        <div class="inner-wrap">
            <div class="logo-wrap">
                <h2><img src="/resources/images/footer/iea.svg" alt="IEA - 아이이에이"/></h2>
            </div>
            <div class="footer-info-wrap">
                <div>
                    <ul class="policy-wrap">
                        <li><a href="/pages/policy/terms-of-policy" data-translate="footer_1">이용약관</a></li>
                        <li><a href="/pages/policy/privacy-policy" data-translate="footer_2">개인정보처리방침</a></li>
                    </ul>
                    <ul class="place-info">
                        <li data-translate="footer_3">주소 : 서울특별시 송파구 법원로8길 8 SKV1 910호 (05855)</li>
                        <li data-translate="footer_4">대표전화 : 02-6269-0630</li>
                        <li class="copyright" data-translate="footer_5">Copyright ⓒ IEA. All Rights Reserved.</li>
                    </ul>
                </div>
                <div class="select-box dropdown2">
                    <button class="label" data-value="Family Site">
                        <span data-translate="footer_6">패밀리 사이트</span>
                    </button>
                    <ul class="option-list">
                        <li><a href="#" data-translate="footer_7">프로</a></li>
                        <li><a href="#" >IEA</a></li>
                        <li><a href="#" data-translate="footer_8">제이비트리</a></li>
                    </ul>
                </div>
            </div>
        </div>
    </footer>
    `
      let templateFooter = document.createElement('template');
      templateFooter.innerHTML = footerHtml;

      /* 실행문 */
      document.body.append(templateFooter.content);
      document.body.prepend(templateHeader.content);
    }
  /* 초기 설정(KOR) : localstorage에 저장된 값이 없을 시 */
    rendererHeader(selectedLanguageOption)
    translateText(selectedLanguageOption, path)

  const navItems = document.querySelectorAll('nav ul li a');
  const logoLink = document.querySelector('h1 a');

  // 페이지 로드 시 저장된 경로를 기준으로 'on' 클래스 적용
  navItems.forEach((item) => {
    // console.log(item.getAttribute('href').replace('.html',''))
    if (item.getAttribute('href').replace('.html','') === activePath) {
      item.parentElement.classList.add('on');
    }
  });

  // 각 <li>의 <a>에 클릭 이벤트 추가하여 로컬 스토리지에 경로 저장
  navItems.forEach((item) => {
    item.addEventListener('click', function() {
      localStorage.setItem('activeNavPath', this.getAttribute('href'));
    });
  });

  // 로고 클릭 시에도 로컬 스토리지에 경로 저장
  if (logoLink) {
    logoLink.addEventListener('click', function() {
      localStorage.setItem('activeNavPath', this.getAttribute('href'));
    });
  }

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
      function handleSelect(option) {
        if (typeof option === 'object') {
          // 객체 옵션의 경우 링크 이동
          window.open(option.link, '_blank'); // 링크로 이동
          dropdownEl.classList.remove('active'); // 드롭다운 닫기
        } else {
          localStorage.setItem('selectedOption', option);
          labelText.textContent = option; // 라벨 텍스트 업데이트
          label.setAttribute('data-value', option); // 라벨의 데이터 속성 업데이트

          // 선택한 이미지로 라벨 이미지 업데이트
          const flagImages = {
            KOR: '/resources/images/header/korea_4.png',
            ENG: '/resources/images/header/america_4.png',
            JPN: '/resources/images/header/japan_4.png'
          };
          label.querySelector('.label-img').src = flagImages[option]; // 라벨 이미지 업데이트
          label.querySelector('.label-img').alt = `${option} flag`; // alt 속성 업데이트

          // 드롭다운 닫기 및 옵션 재렌더링
          dropdownEl.classList.remove('active');
          renderOptions(option); // 선택된 항목 제외한 옵션 렌더링
          // 번역
          translateText(option,path)
        }
      }

      // 라벨 클릭 핸들러 (드롭다운 열기/닫기)
      label.addEventListener('click', () => {
        const isActive = dropdownEl.classList.toggle('active');
        // 드롭다운을 열 때, 현재 선택된 값으로 옵션 렌더링
        renderOptions(localStorage.getItem('selectedOption') || options[0]);
      });
      // 초기 옵션 렌더링
      renderOptions(localStorage.getItem('selectedOption') || options[0]);
    }
    function translateText (option,path) {
      // 번역
      fetch(`/resources/translation-data/${option}.json`)
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          updateLanguage(data, path); // 언어 데이터 업데이트 호출
        })
        .catch(error => {
          console.error('Error fetching translation data:', error);
        });
    }
  // 1-1. 이미지 포함 옵션 렌더링 함수
    function renderOptionWithImage(li, option) {
      const img = document.createElement('img');
      const flagImages = {
        KOR: '/resources/images/header/korea_4.png',
        ENG: '/resources/images/header/america_4.png',
        JPN: '/resources/images/header/japan_4.png'
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
      a.textContent = item.option[localStorage.getItem('selectedOption')];
      a.href = item.link;
      a.target = '_blank';
      a.addEventListener('click', (event) => {
        event.stopPropagation(); // 부모 이벤트 전파 방지
        dropdownEl.classList.remove('active'); // 드롭다운 닫기
      });
      li.appendChild(a);
    }
  // 언어 번역
    function updateLanguage(language, path) {
      switch (path) {
      case "/index":
        indexPageTranslate(language);
        break;
      case "/":
        indexPageTranslate(language);
        break;
      case "/pages/contact":
        contactPageTranslate(language);
        break;
      case "/pages/policy/privacy-policy":
        privacyPolicyPageTranslate(language);
        break;
      case "/pages/policy/terms-of-policy":
        termsOfPolicy(language);
        break;
      default:
        break;
      }
      // 드롭다운의 텍스트도 업데이트
      const dropdown2 = document.querySelector('.dropdown2');
      const options = dropdown2.querySelectorAll('.option-item');

      options.forEach(option => {
        const link = option.querySelector('a');
        const key = link.textContent; // 예를 들어, '프로', 'IEA', '제이비트리'
        const translated = language[key]; // 언어 JSON으로부터 번역된 텍스트 가져오기

        if (translated) {
          link.textContent = translated; // 텍스트 업데이트
          localStorage.setItem('selectedOption', translated);
        }
      });
    }
  // 1-3. 각 드롭다운에 맞게 초기화
    // 실행문 : header dropdown
    const dropdown1 = document.querySelector('.dropdown1');
    initDropdown(dropdown1, ['KOR', 'ENG', 'JPN'], renderOptionWithImage); //['KOR', 'ENG', 'JPN']

    // 실행문 : footer dropdown
    const dropdown2 = document.querySelector('.dropdown2');
    initDropdown(dropdown2, [
      {option: {'KOR':'프로','ENG':'Pro','JPN':'Pro'}, link: 'https://procorp.co.kr/'},
      {option: {'KOR':'IEA','ENG':'IEA','JPN':'IEA'}, link: 'https://www.iea.co.kr/'},
      {option: {'KOR':'제이비트리','ENG':'JBTree','JPN':'JBTree'}, link: 'https://jbtree.co.kr/'}
    ], renderOptionTextOnly);
});


/* 인덱스 페이지 */
function indexPageTranslate(language) {
  document.querySelector('[data-translate="meta_title"]').innerText = language.meta_title
  /* sec1 번역 */
  document.querySelector('[data-translate="sec1_text1"]') ? document.querySelector('[data-translate="sec1_text1"]').innerText = language.sec1_text1 : "";
  document.querySelector('[data-translate="sec1_text2"]').innerHTML = language.sec1_text2;
  document.querySelector('[data-translate="sec1_apple"]').src = language.sec1_apple.src;
  document.querySelector('[data-translate="sec1_apple"]').alt = language.sec1_apple.alt;
  document.querySelector('[data-translate="sec1_google"]').src = language.sec1_google.src;
  document.querySelector('[data-translate="sec1_google"]').alt = language.sec1_google.alt;
  let elementSec1 = document.querySelector('[data-translate="sec1_class"]');
  let elementSec1ClassNames = [...elementSec1.classList];
  elementSec1ClassNames.forEach(className => {
    if(className !== "inner-wrap") {
      elementSec1.classList.remove(className)
    }
  })
  document.querySelector('[data-translate="sec1_class"]').classList.add(language.sec1_class);
  /* sec2 번역 */
  document.querySelector('[data-translate="sec2_title"]').innerHTML = language.sec2_title;
  document.querySelector('[data-translate="sec2_desc"]').innerHTML = language.sec2_desc;
  document.querySelector('[data-translate="sec2_dress_alt"]').alt = language.sec2_dress_alt;
  document.querySelector('[data-translate="sec2_dress_alt"]').src = language.sec2_dress_src;
  document.querySelector('[data-translate="sec2_cloud1_alt"]').alt = language.sec2_cloud1_alt;
  document.querySelector('[data-translate="sec2_cloud1_alt"]').src = language.sec2_cloud1_src;
  document.querySelector('[data-translate="sec2_cloud2_alt"]').alt = language.sec2_cloud2_alt;
  document.querySelector('[data-translate="sec2_cloud2_alt"]').src = language.sec2_cloud2_src;
  document.querySelector('[data-translate="sec2_phone2"]').src = language.sec2_phone2;
  /* sec3 번역 */
  document.querySelector('[data-translate="sec3_title1"]').innerText = language.sec3_title1;
  document.querySelector('[data-translate="sec3_desc1"]').innerHTML = language.sec3_desc1;
  document.querySelector('[data-translate="sec3_title2"]').innerHTML = language.sec3_title2;
  document.querySelector('[data-translate="sec3_desc2"]').innerHTML = language.sec3_desc2;
  document.querySelector('[data-translate="sec3_title3"]').innerHTML = language.sec3_title3;
  document.querySelector('[data-translate="sec3_desc3"]').innerHTML = language.sec3_desc3;
  /* sec4, sec5 번역 */
  document.querySelector('[data-translate="sec4_title"]').innerText = language.sec4_title;
  document.querySelector('[data-translate="sec4_desc"]').innerHTML = language.sec4_desc;
  document.querySelector('[data-translate="sec4_phone1"]').src = language.sec4_phone1;
  document.querySelector('[data-translate="sec4_phone2"]').src = language.sec4_phone2;
  document.querySelector('[data-translate="sec5_title"]').innerHTML = language.sec5_title;
  document.querySelector('[data-translate="sec5_desc"]').innerHTML = language.sec5_desc;
  document.querySelector('[data-translate="sec5_phone1"]').src = language.sec5_phone1;
  document.querySelector('[data-translate="sec5_phone2"]').src = language.sec5_phone2;
  let elementSec4 = document.querySelector('[data-translate="sec4_class"]');
  let elementSec4ClassNames = [...elementSec4.classList];
  elementSec4ClassNames.forEach(className => {
    if(className !== "image-wrap") {
      elementSec4.classList.remove(className)
    }
  })
  document.querySelector('[data-translate="sec4_class"]').classList.add(language.sec4_class);
  let elementSec5 = document.querySelector('[data-translate="sec5_class"]');
  let elementSec5ClassNames = [...elementSec5.classList];
  elementSec5ClassNames.forEach(className => {
    if(className !== "image-wrap") {
      elementSec5.classList.remove(className)
    }
  })
  document.querySelector('[data-translate="sec5_class"]').classList.add(language.sec5_class);
  /* sec6 */
  document.querySelector('[data-translate="sec6_title"]').innerHTML = language.sec6_title;
  document.querySelector('[data-translate="sec6_desc"]').innerHTML = language.sec6_desc;
  /* sec7 */
  document.querySelector('[data-translate="sec7_title"]').innerHTML = language.sec7_title;
  document.querySelector('[data-translate="sec7_desc"]').innerHTML = language.sec7_desc;
  document.querySelector('[data-translate="sec7_img1"]').src = language.sec7_img1;
  document.querySelector('[data-translate="sec7_img2"]').src = language.sec7_img2;
  document.querySelector('[data-translate="sec7_img3"]').src = language.sec7_img3;
  document.querySelector('[data-translate="sec7_img4"]').src = language.sec7_img4;
  /* sec8 */
  document.querySelector('[data-translate="sec8_star"]').style = language.sec8_star;
  document.querySelector('[data-translate="sec8_btn"]').innerHTML = language.sec8_btn;
  document.querySelector('[data-translate="footer_1"]').innerText = language.footer_1;
  document.querySelector('[data-translate="footer_2"]').innerText = language.footer_2;
  document.querySelector('[data-translate="footer_3"]').innerText = language.footer_3;
  document.querySelector('[data-translate="footer_4"]').innerText = language.footer_4;
  document.querySelector('[data-translate="footer_5"]').innerText = language.footer_5;
  document.querySelector('[data-translate="footer_6"]').innerText = language.footer_6;
  /*document.querySelector('[data-translate="footer_7"]').innerText = language.footer_7;
  document.querySelector('[data-translate="footer_8"]').innerText = language.footer_8;*/
}
/* Contact 페이지 */
function contactPageTranslate (language) {
  document.querySelector('[data-translate="meta_title_contact"]').innerText = language.meta_title_contact
  document.querySelector('[data-translate="contact_1"]').innerHTML = language.contact_1;
  document.querySelector('[data-translate="contact_2"]').innerText = language.contact_2;
  document.querySelector('[data-translate="contact_3"]').innerText = language.contact_3;
  document.querySelector('[data-translate="contact_4"]').placeholder = language.contact_4;
  document.querySelector('[data-translate="contact_5"]').innerText = language.contact_5;
  document.querySelector('[data-translate="contact_6"]').placeholder = language.contact_6;
  document.querySelector('[data-translate="contact_7"]').innerText = language.contact_7;
  document.querySelector('[data-translate="contact_8"]').placeholder = language.contact_8;
  document.querySelector('[data-translate="contact_9"]').innerText = language.contact_9;
  document.querySelector('[data-translate="contact_10"]').placeholder = language.contact_10;
  document.querySelector('[data-translate="contact_11"]').innerHTML = language.contact_11;
  document.querySelector('[data-translate="contact_12"]').placeholder = language.contact_12;
  document.querySelector('[data-translate="contact_13"]').innerHTML = language.contact_13;
  document.querySelector('[data-translate="contact_14"]').placeholder = language.contact_14;
  document.querySelector('[data-translate="contact_15"]').innerHTML = language.contact_15;
  document.querySelector('[data-translate="contact_16"]').placeholder = language.contact_16;
  document.querySelector('[data-translate="contact_17"]').innerText = language.contact_17;
  document.querySelector('[data-translate="contact_18"]').innerHTML = language.contact_18;
  document.querySelector('[data-translate="footer_1"]').innerText = language.footer_1;
  document.querySelector('[data-translate="footer_2"]').innerText = language.footer_2;
  document.querySelector('[data-translate="footer_3"]').innerText = language.footer_3;
  document.querySelector('[data-translate="footer_4"]').innerText = language.footer_4;
  document.querySelector('[data-translate="footer_5"]').innerText = language.footer_5;
  document.querySelector('[data-translate="footer_6"]').innerText = language.footer_6;
}
/* 개인정보처리방침 페이지 */
function privacyPolicyPageTranslate(language) {
  document.querySelector('[data-translate="meta_title_ppt"]').innerText = language.meta_title_ppt
  document.querySelector('[data-translate="ppt_title"]').innerHTML = language.ppt_title;
  document.querySelector('[data-translate="footer_1"]').innerText = language.footer_1;
  document.querySelector('[data-translate="footer_2"]').innerText = language.footer_2;
  document.querySelector('[data-translate="footer_3"]').innerText = language.footer_3;
  document.querySelector('[data-translate="footer_4"]').innerText = language.footer_4;
  document.querySelector('[data-translate="footer_5"]').innerText = language.footer_5;
  document.querySelector('[data-translate="footer_6"]').innerText = language.footer_6;
}
/* 이용약관 페이지 */
function termsOfPolicy(language) {
  document.querySelector('[data-translate="meta_title_top"]').innerText = language.meta_title_top
  document.querySelector('[data-translate="top_title"]').innerHTML = language.top_title;
  document.querySelector('[data-translate="footer_1"]').innerText = language.footer_1;
  document.querySelector('[data-translate="footer_2"]').innerText = language.footer_2;
  document.querySelector('[data-translate="footer_3"]').innerText = language.footer_3;
  document.querySelector('[data-translate="footer_4"]').innerText = language.footer_4;
  document.querySelector('[data-translate="footer_5"]').innerText = language.footer_5;
  document.querySelector('[data-translate="footer_6"]').innerText = language.footer_6;
}