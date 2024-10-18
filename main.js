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
    });
});
