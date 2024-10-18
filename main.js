const imageSlideDatas = [
    { src: 'images/image1.jpg', alt: 'Slide 1' },
    { src: 'images/image2.jpg', alt: 'Slide 2' },
    { src: 'images/image3.jpg', alt: 'Slide 3' },
    { src: 'images/image4.jpg', alt: 'Slide 4' },
    { src: 'images/image5.jpg', alt: 'Slide 5' },
    { src: 'images/image6.jpg', alt: 'Slide 6' },
];

const slidesContainer = document.querySelector('.slide-container');
const indicatorsContainer = document.querySelector('.indicators');

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
    const indicator = document.createElement('span');
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

const buttons = document.querySelectorAll('.carousel-button');

buttons.forEach((button) => {
    button.addEventListener('click', () => {
        //1. 이전이냐 다음이냐 결정
        const offset = button.dataset.carouselButton === 'next' ? 1 : -1;

        //2. ul 찾기 = slides
        const slides = document.querySelector('ul');

        //3. ul안에서 현재 active slide 찾기
        const activeSlide = slides.querySelector('[data-active]');

        //4. active slide 는 ul안에서 현재 몇번째 인덱스인가
        const activeSliceIndex = [...slides.children].indexOf(activeSlide);

        let newSlideIndex = activeSliceIndex + offset;
        //5. 첫번째 -> 마지막
        if (newSlideIndex < 0) {
            newSlideIndex = slides.children.length - 1;
        }
        //6. 마지막 -> 첫번째
        if (newSlideIndex >= slides.children.length) {
            newSlideIndex = 0;
        }

        //7. 새로운 active slide의 dataset 설정
        slides.children[newSlideIndex].dataset.active = true;

        //8. 현재 active slide는 active 삭제
        delete activeSlide.dataset.active;

        // 9.인디케이터 업데이트
        updateIndicators(newSlideIndex);
    });
});

// 인디케이터 클릭 기능
indicatorsContainer.addEventListener('click', (e) => {
    //선택된 인디케이터의 인덱스
    const selectedIndicatorIndex = parseInt(e.target.dataset.index);

    const slides = document.querySelector('.slide-container');
    const activeSlide = slides.querySelector('[data-active]');

    // 인디케이터 클릭 시 해당 슬라이드를 active로 변경
    slides.children[selectedIndicatorIndex].dataset.active = true;

    //기존 activeSlide는 active 삭제
    delete activeSlide.dataset.active;

    // 인디케이터 업데이트
    updateIndicators(selectedIndicatorIndex);
});

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
