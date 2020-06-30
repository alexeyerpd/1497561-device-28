const left = document.querySelector('.range__left');
const right = document.querySelector('.range__right');

const minCost = document.querySelector('.range__min-cost');
const maxCost = document.querySelector('.range__max-cost');

const outputLeft = document.querySelector('.range__output-left');
const outputRight = document.querySelector('.range__output-right');

const indicator = document.querySelector('.range__indicator');

const track = document.querySelector('.range__track');

const trackRect = track.getBoundingClientRect();

const activeList = [];


class RangeSlider {
    constructor(range, track, sliderLeft, sliderRight) {
        this.range = range;
        this.track = track;
        this.sliderLeft = sliderLeft;
        this.sliderRight = sliderRight;

        this.trackLength = 0;
        this.stepLength = 0;
    }

    init() {
        this.trackLength = trackRect.width - this.sliderLeft.boundingData.width * 2;
        this.stepLength = this.range / this.trackLength;

        this.update();
    }

    update() {
        const from = Math.floor(this.stepLength * this.sliderLeft.currentPosition);
        const to = Math.floor((this.trackLength - this.sliderRight.currentPosition) * this.stepLength);

        this.updateIndicator();

        outputLeft.textContent = `от ${from}`;
        outputRight.textContent = `до ${to}`;

        minCost.value = from;
        maxCost.value = to;
    }

    updateIndicator() {
        const indicatorPositionLeft = this.sliderLeft.currentPosition + this.sliderLeft.boundingData.width / 2;
        const indicatorPositionRight = this.sliderRight.currentPosition + this.sliderRight.boundingData.width / 2;

        indicator.style.left = `${indicatorPositionLeft}px`;
        indicator.style.right = `${indicatorPositionRight}px`;
    }

}

class Slider {
    constructor(element, direction) {
        this.element = element;
        this.boundingData = element.getBoundingClientRect();
        this.isMove = false;
        this.direction = direction;

        this.currentPosition = 0;

        this.initialCoord = {
            positionStart: 0,
            clientXStart: 0,
        };


        this.element.addEventListener('mousedown', (e) => {
            this.isMove = true;
            this.updateBounding();
            
            this.updateCurrentCoord();
            this.initialCoord.clientXStart = e.clientX;

            activeList.push(this);
        })
    }

    updateBounding() {
        this.boundingData = this.element.getBoundingClientRect();
    }

    onMove() {
        this.isMove = true;
    }

    onStop() {
        this.isMove = false;
    }

    updateCurrentCoord() {
        this.initialCoord.positionStart = parseFloat(this.element.style[this.direction]) || 0;
    }

    updatePosition(clientX, otherSlider) {
        const { width } = this.boundingData;
        const { positionStart, clientXStart } = this.initialCoord;
        
        let coord;
        const maxValue = trackRect.width - (otherSlider.initialCoord.positionStart + width * 2);

        if (this.direction === 'left') {
            const currentValue = positionStart + (clientX - clientXStart);
            coord = Math.max(0, Math.min(currentValue, maxValue));
        } else {
            const currentValue = positionStart + (-clientX + clientXStart);
            coord = Math.max(0, Math.min(currentValue, maxValue)); 
        }

        this.element.style[this.direction] = `${coord}px`;
        this.currentPosition = coord;
    }

}



const sliderLeft = new Slider(left, 'left');
const sliderRight = new Slider(right, 'right');

const rangeSlider = new RangeSlider(5000, track, sliderLeft, sliderRight);
rangeSlider.init();

function onMove(e) {
    const slider = activeList[0];

    if (!(slider && slider.isMove)) return;

    const otherSlider = sliderLeft === slider ? sliderRight : sliderLeft;

    slider.updatePosition(e.clientX, otherSlider);
    rangeSlider.update();
}


function onForbidden() {
    if (!activeList[0]) return;

    activeList[0].onStop();
    activeList[0].updateCurrentCoord();
    activeList.pop();
}

document.addEventListener('mouseup', onForbidden);
document.addEventListener('mousemove', onMove);