const imageSlideDatas = [
    { src: 'images/image1.jpg', alt: 'Slide 1' },
    { src: 'images/image2.jpg', alt: 'Slide 2' },
    { src: 'images/image3.jpg', alt: 'Slide 3' },
    { src: 'images/image4.jpg', alt: 'Slide 4' },
    { src: 'images/image5.jpg', alt: 'Slide 5' },
    { src: 'images/image6.jpg', alt: 'Slide 6' },
];

const slidesContainer = document.querySelector('.slide-container'); //ul
const indicatorsContainer = document.querySelector('.indicators');
const buttons = document.querySelectorAll('.carousel-button');
const toggleAutoplayButton = document.getElementById('toggle-autoplay');
const intervalDropdown = document.getElementById('interval-time');

let intervalTime = 2000; //default
let autoplay = true; //default
let autoplayInterval;

let startX = 0; // 터치시작지점 X 좌표
let endX = 0; // 터치종료지점 X 좌표

//이미지 동적으로 추가
imageSlideDatas.forEach((slide, index) => {
    // 슬라이드 추가
    const slideElement = document.createElement('li');
    slideElement.classList.add('slide');

    // 이미지 추가
    const imgElement = document.createElement('img');
    imgElement.src = slide.src;
    imgElement.alt = slide.alt;

    // 인디케이터 추가
    const indicator = document.createElement('li');
    indicator.classList.add('indicator');
    indicator.dataset.index = index;

    // 첫 번째 슬라이드는 active 상태로
    if (index === 0) {
        slideElement.dataset.active = true;
        indicator.classList.add('active');
    }

    slideElement.appendChild(imgElement);
    slidesContainer.appendChild(slideElement);
    indicatorsContainer.appendChild(indicator);
});

buttons.forEach((button) => {
    button.addEventListener('click', () => {
        //prev or next
        const offset = button.dataset.carouselButton === 'next' ? 1 : -1;

        moveToSlide(offset);
        resetAutoplay();
    });
});

// 인디케이터 클릭 기능
indicatorsContainer.addEventListener('click', (e) => {
    //선택된 인디케이터의 인덱스
    const selectedIndicatorIndex = parseInt(e.target.dataset.index);

    moveToSpecificSlide(selectedIndicatorIndex);
    resetAutoplay();
});

// 전환 시간 변경 시 자동 슬라이드 재설정
intervalDropdown.addEventListener('change', (e) => {
    intervalTime = parseInt(e.target.value); //시간 (ms단위)
    resetAutoplay();
});

// 자동 슬라이드 토글 버튼에 이벤트 추가
toggleAutoplayButton.addEventListener('click', toggleAutoplay);

// 터치 시작 시 이벤트 처리
slidesContainer.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX; // 터치시작 x좌표
});

// 터치가 이동하는 동안 이벤트 처리
slidesContainer.addEventListener('touchmove', (e) => {
    endX = e.touches[0].clientX; // 터치이동 x좌표
});

// 터치가 끝났을 때 이벤트 처리
slidesContainer.addEventListener('touchend', () => {
    handleSwipeGesture();
});

// 페이지 로드 시 자동 슬라이드 시작
startAutoplay();

// 슬라이드 이동(prev/next)
function moveToSlide(offset) {
    // slides 찾기 (ul)
    const slides = document.querySelector('.slide-container');

    // slides에서 현재 active slide 찾기
    const activeSlide = slides.querySelector('[data-active]');

    // active slide 는 slides에서 현재 몇번째 인덱스인가
    const activeSliceIndex = [...slides.children].indexOf(activeSlide);

    let newSlideIndex = activeSliceIndex + offset;

    // 첫번째 -> 마지막
    if (newSlideIndex < 0) {
        newSlideIndex = slides.children.length - 1;
    }
    // 마지막 -> 첫번째
    if (newSlideIndex >= slides.children.length) {
        newSlideIndex = 0;
    }

    // 새로운 active slide의 dataset 설정
    slides.children[newSlideIndex].dataset.active = true;
    // 현재 active slide는 active 삭제
    delete activeSlide.dataset.active;
    // 인디케이터 업데이트
    updateIndicators(newSlideIndex);
}

// 특정 슬라이드로 이동
function moveToSpecificSlide(index) {
    const slides = document.querySelector('.slide-container');
    const activeSlide = slides.querySelector('[data-active]');

    // 인디케이터 클릭 시 해당 슬라이드를 active로 변경
    slides.children[index].dataset.active = true;

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

// 자동 슬라이드 시작 함수
function startAutoplay() {
    autoplayInterval = setInterval(() => {
        moveToSlide(1);
    }, intervalTime);

    toggleAutoplayButton.innerHTML =
        '<img src="public/assets/icon_pause.svg" alt="Play icon" />';
}

// 자동 슬라이드 중지 함수
function stopAutoplay() {
    clearInterval(autoplayInterval);

    toggleAutoplayButton.innerHTML =
        '<img src="public/assets/icon_play.svg" alt="Play icon" />';
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

// 자동 슬라이드 재설정 함수
function resetAutoplay() {
    stopAutoplay();
    if (autoplay) {
        startAutoplay();
    }
}
// 스와이프 제스처 처리 함수
function handleSwipeGesture() {
    const swipeThreshold = 50; // 스와이프가 인식되는 최소 거리 (px)
    const swipeDistance = startX - endX; //이동거리

    // 오른쪽에서 왼쪽으로 스와이프 (next로)
    if (swipeDistance > swipeThreshold) {
        moveToSlide(1); // 다음 슬라이드로 이동
        resetAutoplay();
    }
    // 왼쪽에서 오른쪽으로 스와이프 (prev로)
    if (swipeDistance < -swipeThreshold) {
        moveToSlide(-1); // 이전 슬라이드로 이동
        resetAutoplay();
    }
}
