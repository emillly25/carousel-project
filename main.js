const imageSlideDatas = [
    { src: 'images/image1.jpg', alt: 'Slide 1' },
    { src: 'images/image2.jpg', alt: 'Slide 2' },
    { src: 'images/image3.jpg', alt: 'Slide 3' },
    { src: 'images/image4.jpg', alt: 'Slide 4' },
    { src: 'images/image5.jpg', alt: 'Slide 5' },
    { src: 'images/image6.jpg', alt: 'Slide 6' },
];

const DEFAULT_INTERVAL_TIME = 2000;
const SWIPE_THRESHOLD = 50;

const slidesContainer = document.querySelector('.slide-container'); //ul
const indicatorsContainer = document.querySelector('.indicator-container');

const carouselMoveButtons = document.querySelectorAll('.carousel-button');
const toggleAutoplayButton = document.getElementById('toggle-autoplay');
const intervalDropdown = document.getElementById('interval-time');

let intervalTime = DEFAULT_INTERVAL_TIME;
let autoplay = true;
let autoplayInterval;

let startX = 0; // 터치시작지점 X 좌표
let endX = 0; // 터치종료지점 X 좌표

// 슬라이드 동적 생성
function createSlide(slide, index) {
    // 슬라이드 추가
    const slideElement = document.createElement('li');
    slideElement.classList.add('slide');

    // 이미지 추가
    const imgElement = document.createElement('img');
    imgElement.src = slide.src;
    imgElement.alt = slide.alt;

    slideElement.appendChild(imgElement);

    // 첫 번째 슬라이드는 active 상태로
    if (index === 0) {
        slideElement.dataset.active = true;
    }
    return slideElement;
}

// 인디케이터 동적 생성
function createIndicator(index) {
    // 인디케이터 추가
    const indicator = document.createElement('li');
    indicator.classList.add('indicator');
    indicator.dataset.index = index;

    // 첫 번째 인디케이터는 active 상태로
    if (index === 0) {
        indicator.classList.add('active');
    }
    return indicator;
}

// 페이지 로드시 캐러셀 시작
function initCarousel() {
    // 이미지 동적으로 추가
    imageSlideDatas.forEach((slide, index) => {
        slidesContainer.appendChild(createSlide(slide, index));
        indicatorsContainer.appendChild(createIndicator(index));
    });
    startAutoplay(); // 자동 슬라이드 시작
}

// prev & next 버튼 클릭 이벤트 함수
function handleMoveButtonClick(e) {
    const offset = e.target.dataset.carouselButton === 'next' ? 1 : -1;
    moveToSlide(offset);
    resetAutoplay();
}

// 슬라이드 이동(prev/next)
function moveToSlide(offset) {
    // slides에서 현재 active slide 찾기
    const activeSlide = slidesContainer.querySelector('[data-active]');

    // active slide 는 slides에서 현재 몇번째 인덱스인가
    const activeSliceIndex = [...slidesContainer.children].indexOf(activeSlide);

    let newSlideIndex = activeSliceIndex + offset;

    // 첫번째 -> 마지막
    if (newSlideIndex < 0) {
        newSlideIndex = slidesContainer.children.length - 1;
    }
    // 마지막 -> 첫번째
    if (newSlideIndex >= slidesContainer.children.length) {
        newSlideIndex = 0;
    }

    moveToSpecificSlide(newSlideIndex);
}

// 특정 슬라이드로 이동
function moveToSpecificSlide(index) {
    const activeSlide = slidesContainer.querySelector('[data-active]');

    // 인디케이터 클릭 시 해당 슬라이드를 active로 변경
    slidesContainer.children[index].dataset.active = true;

    // 기존 activeSlide는 active 삭제
    delete activeSlide.dataset.active;

    // 인디케이터 업데이트
    updateIndicators(index);
}

// 인디케이터 업데이트
function updateIndicators(activeIndex) {
    const indicators = document.querySelectorAll('.indicator');
    indicators.forEach((indicator, index) => {
        if (index === activeIndex) {
            indicator.classList.add('active');
        } else {
            indicator.classList.remove('active');
        }
    });
}

// 인디케이터 클릭 이벤트
function handleIndicatorClick(e) {
    //선택된 인디케이터의 인덱스
    const selectedIndicatorIndex = parseInt(e.target.dataset.index);
    moveToSpecificSlide(selectedIndicatorIndex);
    resetAutoplay();
}

// 슬라이드 속도 변경
function handleDropdownChange(e) {
    intervalTime = parseInt(e.target.value);
    resetAutoplay();
}

// 자동 슬라이드 상태를 토글하는 함수
function toggleAutoplay() {
    if (autoplay) {
        stopAutoplay();
    } else {
        startAutoplay();
    }
    autoplay = !autoplay;
}

// 재생토글 버튼 아이콘 업데이트
function updateAutoplayButtonIcon(isPlaying) {
    toggleAutoplayButton.innerHTML = isPlaying
        ? '<img src="public/assets/icon_pause.svg" alt="Pause icon" />'
        : '<img src="public/assets/icon_play.svg" alt="Play icon" />';
}

// 자동 슬라이드 시작 함수
function startAutoplay() {
    autoplayInterval = setInterval(() => {
        moveToSlide(1);
    }, intervalTime);

    updateAutoplayButtonIcon(true);
}

// 자동 슬라이드 중지 함수
function stopAutoplay() {
    clearInterval(autoplayInterval);
    updateAutoplayButtonIcon(false);
}

// 자동 슬라이드 재설정 함수
function resetAutoplay() {
    stopAutoplay();
    if (autoplay) {
        startAutoplay();
    }
}

function handleTouchStart(e) {
    startX = e.touches[0].clientX; // 터치시작 x좌표
}

function handleTouchMove(e) {
    endX = e.touches[0].clientX; // 터치종료 x좌표
}

function handleTouchEnd() {
    handleSwipeGesture();
}

// 스와이프 제스처 처리 함수
function handleSwipeGesture() {
    const swipeDistance = startX - endX; //이동거리

    // 오른쪽에서 왼쪽으로 스와이프 (next로)
    if (swipeDistance > SWIPE_THRESHOLD) {
        moveToSlide(1); // 다음 슬라이드로 이동
        resetAutoplay();
    }
    // 왼쪽에서 오른쪽으로 스와이프 (prev로)
    if (swipeDistance < -SWIPE_THRESHOLD) {
        moveToSlide(-1); // 이전 슬라이드로 이동
        resetAutoplay();
    }
}

///////////////////////////////////////////////////////////
// ---------------- 이벤트 리스너 -----------------------------
///////////////////////////////////////////////////////////

// prev & next 버튼에 이벤트 추가
carouselMoveButtons.forEach((button) => {
    button.addEventListener('click', handleMoveButtonClick);
});

// 인디케이터 클릭 이벤트 추가
indicatorsContainer.addEventListener('click', handleIndicatorClick);

// 전환 시간 변경 시 자동 슬라이드 재설정
intervalDropdown.addEventListener('change', handleDropdownChange);

// 자동 슬라이드 토글 버튼에 이벤트 추가
toggleAutoplayButton.addEventListener('click', toggleAutoplay);

// 터치 시작 시 이벤트 처리
slidesContainer.addEventListener('touchstart', handleTouchStart);
// 터치가 이동하는 동안 이벤트 처리
slidesContainer.addEventListener('touchmove', handleTouchMove);
// 터치가 끝났을 때 이벤트 처리
slidesContainer.addEventListener('touchend', handleTouchEnd);

// 최초 로드시 실행
document.addEventListener('DOMContentLoaded', initCarousel);
