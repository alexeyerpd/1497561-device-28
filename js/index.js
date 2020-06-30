// Write us

function getElementBySelector(className, parent = document) {
    return parent.querySelector(className);
}

function getElementsBySelector(className, parent = document) {
    return [...parent.querySelectorAll(className)];
}

const btnWriteUs = getElementBySelector('button.about-site__link-button');
const writeUsModule = getElementBySelector('.write-us');
const aboutSiteModule = getElementBySelector('.about-site');
const btnCloseWriteUs = getElementBySelector('.write-us__button-close');
const btnCloseMap = getElementBySelector('.about-site__button-close');
const map = getElementBySelector('.about-site__map');
const writeUsNameField = getElementBySelector('.write-us__input[name=name]');
const writeUsEmailField = getElementBySelector('.write-us__input[name=email]');
const writeUsForm = getElementBySelector('.write-us__form');


const listeners = [
    {
        evt: 'click',
        mainElement: writeUsModule,
        elementForOpen: btnWriteUs,
        elementForClose: btnCloseWriteUs,
        className: 'write-us--visible',
        
    },
    {
        evt: 'click',
        mainElement: aboutSiteModule,
        elementForOpen: map,
        elementForClose: btnCloseMap,
        className: 'about-site--active'
    },
];

listeners.forEach(listener => {
    const {
        evt,
        mainElement,
        elementForOpen,
        elementForClose,
        className, 
    } = listener;

    elementForOpen.addEventListener(evt, () => {
        if (!mainElement.classList.contains(className)) {
            mainElement.classList.add(className);
        }
    });

    elementForClose.addEventListener(evt, () => {
        if (mainElement.classList.contains(className)) {
            mainElement.classList.remove(className);
            mainElement.classList.remove('module-show');
            mainElement.classList.remove('module-error');
        }
    });
})

btnWriteUs.addEventListener('click', (e) => {
    writeUsModule.classList.add('module-show');
    setTimeout(() => {
        writeUsModule.classList.remove('module-show');
    }, 600);

    writeUsNameField.focus();
    if (localStorage && localStorage.email) {
        writeUsEmailField.value = localStorage.email;
    }
});

function clearForm() {
    const fields = [...getElementsBySelector('input', writeUsForm), ...getElementsBySelector('textarea', writeUsForm)];
    fields.forEach(field => field.value = '');
}

writeUsForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const fieldsData = [...formData.entries()];

    if ( fieldsData.some(([k, value]) => !value) ) {
        writeUsModule.classList.add('module-error');
        setTimeout(() => {
            writeUsModule.classList.remove('module-error');
        }, 600);
    } else {
        localStorage.email = formData.get('email');
        console.log(`sended: ${fieldsData.reduce((memo, [k, v]) => memo + `${k} - ${v}, `, '').trim()}`)
        clearForm();
    }
})

// Carousel


function goodsSlider() {
    function removeClassItems(list, className) {
        list.forEach(item => {
            if (item.classList.contains(className)) {
                item.classList.remove(className);
            }
        })
    }

    const sliderItems = getElementsBySelector('.slider__list .slider__item');
    
    sliderItems.forEach((sliderItem) => {
        const carouselItems = getElementsBySelector('.carousel__item', sliderItem);
    
        carouselItems.forEach((carouselItem, carouselItemIndex) => {
            carouselItem.addEventListener('click', (e) => {
                if (carouselItem.classList.contains('carousel__item--active')) return;
        
                const activeSliderItem = getElementBySelector('.slider__item--active');
                activeSliderItem.classList.remove('slider__item--active');
    
                const nextActiveSliderItem = sliderItems[carouselItemIndex];
                nextActiveSliderItem.classList.add('slider__item--active');
    
                const carouselItems = getElementsBySelector('.carousel__item', nextActiveSliderItem);
                removeClassItems(carouselItems, 'carousel__item--active');
                carouselItems[carouselItemIndex].classList.add('carousel__item--active');
            });
        });
    });
}

goodsSlider();

// Services slider

function servicesSlider() {
    function removeClassItems(className, parent = document) {
        const items = getElementsBySelector(`.${className}`, parent);
        items.forEach(item => item.classList.remove(className));
    }

    const services = getElementBySelector('.services');
    const serviceItems = getElementsBySelector('.services__list .services__item');
    const contentItems = getElementsBySelector('.services__content-list .services__content-item');

    serviceItems.forEach((serviceItem, index) => {

            serviceItem.addEventListener('click', (e) => {
                if (serviceItem.classList.contains('services__item--current')) return;
        
                removeClassItems('services__item--current');
                removeClassItems('services__content-item--active');

                serviceItem.classList.add('services__item--current');
                contentItems[index].classList.add('services__content-item--active')
            });
        });
}

servicesSlider();
