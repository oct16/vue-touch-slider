;(function () {

    var vueTouchSlider = {}

    vueTouchSlider.install = function (Vue) {

        Vue.directive('touch-slider', {

            bind : function(){
                    var slider = document.querySelector('#vue-touch-slider');
                    if(slider){
                        slider.parentNode.removeChild(slider)
                    }

                var self = this;
                var getSingle = function (fn) {
                    var result;
                    return function () {
                        return result || (result = fn.apply(this, arguments))
                    }
                }

                setTimeout(function(){

                    var createSingleSliderLayer = getSingle(createSliderLayer),
                        images = self.el.getElementsByTagName('img');

                    for (var j = 0, length = images.length; j < length; j++) {
                        images[j].addEventListener('click', (function (j) {
                            return function () {
                                var sliderLayer = createSingleSliderLayer(images);
                                sliderLayer.goIndex(j);
                                if (sliderLayer.container.style.display == 'none') {
                                    sliderLayer.container.className = 'animated fadeIn';
                                    sliderLayer.container.style.display = 'block';
                                }
                            }
                        })(j), false)
                    }

                    function createSliderLayer(images) {
                        function Slider() {
                            this.init();
                            this.renderDOM();
                            this.bindDOM();
                        }

                        Slider.prototype.init = function () {
                            this.container = document.createElement('div');
                            this.container.id = 'vue-touch-slider';
                            this.container.className = 'animated fadeIn';
                            this.container.innerHTML =
                                '<style>' +
                                '#vue-touch-slider{height: 100%;width: 100%;position:fixed;top:0px;background:black;z-index:100}\n' +
                                '#vue-touch-slider .vue-touch-slider-li,#vue-touch-slider .vue-touch-slider-ul{list-style: none;margin: 0;padding: 0;height: 100%;overflow: hidden;}\n' +
                                '#vue-touch-slider .vue-touch-slider-li{background:black;position: absolute;display: -webkit-box;-webkit-box-pack: center;-webkit-box-align: center;}\n' +
                                '#vue-touch-slider .vue-touch-slider-li:last-child{padding-right:600px}\n' +
                                '#vue-touch-slider .vue-touch-slider-li img {max-width: 100%;max-height: 100%;}\n' +
                                '#vue-touch-slider #vue-touch-slider-head {position:absolute;width:100%;z-index:11;color:white;text-align:center}\n' +
                                '#vue-touch-slider #vue-touch-slider-count {color:white;text-align:center}\n\r' +
                                '.animated {-webkit-animation-duration:.45s;animation-duration:.45s;-webkit-animation-fill-mode:both;animation-fill-mode: both;}\n' +
                                '.fadeIn {-webkit-animation-name: fadeIn;animation-name:fadeIn;}\n' +
                                '@-webkit-keyframes fadeIn{from{opacity:0;}to{opacity: 1;}}@keyframes fadeIn{from{opacity:0;}to{opacity:1;}}\n' +
                                '.fadeOut {-webkit-animation-name:fadeOut;animation-name:fadeOut;}\n' +
                                '@-webkit-keyframes fadeOut{from{opacity:1;}to{opacity:0;}}@keyframes fadeOut{from {opacity:1;}to{opacity:0;}}\n' +
                                '</style>';
                            document.body.appendChild(this.container);

                            this.radio = window.innerHeight / window.innerWidth;
                            this.deviceW = window.innerWidth;
                            this.deviceH = window.innerHeight;
                            this.index = 0;
                            this.images = images;
                        };

                        Slider.prototype.renderDOM = function () {
                            var container = this.container, self = this;
                            this.ul = document.createElement('ul');
                            this.ul.className = 'vue-touch-slider-ul';
                            this.head = document.createElement('div');
                            this.count = document.createElement('span');
                            this.head.id = 'vue-touch-slider-head';
                            this.count.id = 'vue-touch-slider-count';
                            this.head.appendChild(this.count);
                            this.container.appendChild(this.head);

                            for (var i = 0; i < this.images.length; i++) {
                                var li = document.createElement('li');
                                li.style.width = this.deviceW + 'px';
                                li.className += 'vue-touch-slider-li';

                                var imageObj = new Image();
                                imageObj.src = this.images[i].src;
                                (function (li) {
                                    imageObj.onload = function () {
                                        if (this.height / this.width > self.radio) {
                                            li.innerHTML += '<img height = ' + self.deviceH + ' src="' + this.src + '">'
                                        } else {
                                            li.innerHTML += '<img width = ' + self.deviceW + ' src="' + this.src + '">'
                                        }
                                    };
                                })(li);

                                this.ul.appendChild(li);
                            }
                            this.ul.style.cssText = 'width:' + this.deviceW + 'px';
                            container.style.height = this.deviceH + 'px';
                            container.appendChild(this.ul);
                        };

                        Slider.prototype.goIndex = function (n) {
                            var go,
                                li = this.ul.getElementsByTagName('li'),
                                len = li.length;

                            if (typeof n == 'number') {
                                go = n;
                                for (var i = 0; i < li.length; i++) {
                                    li[i].style.webkitTransform = 'translate3d(' + i * this.deviceW + 'px, 0, 0)';
                                }
                                this.container.style.height = window.innerHeight + 'px';
                            } else if (typeof n == 'string') {
                                go = this.index + n * 1;
                            }

                            if (go > len - 1) {
                                go = len - 1;
                            } else if (go < 0) {
                                go = 0;
                            }

                            li[go].style.webkitTransition = '-webkit-transform 0.2s ease-out';
                            li[go - 1] && (li[go - 1].style.webkitTransition = '-webkit-transform 0.2s ease-out');
                            li[go + 1] && (li[go + 1].style.webkitTransition = '-webkit-transform 0.2s ease-out');
                            li[go].style.webkitTransform = 'translate3d(0, 0, 0)';
                            li[go - 1] && (li[go - 1].style.webkitTransform = 'translate3d(-' + this.deviceW + 'px, 0, 0)');
                            li[go + 1] && (li[go + 1].style.webkitTransform = 'translate3d(' + this.deviceW + 'px, 0, 0)');

                            this.index = go;
                            this.count.innerHTML = (go + 1) + '/' + len;
                        };

                        Slider.prototype.bindDOM = function () {
                            var self = this,
                                ul = self.ul,
                                li = ul.getElementsByTagName('li');

                            var startHandler = function (evt) {
                                var target = evt.target;
                                self.startTime = new Date() * 1;
                                self.startX = evt.touches[0].pageX;
                                self.offsetX = 0;
                                while (target.nodeName != 'LI' && target.nodeName != 'BODY') {
                                    target = target.parentNode;
                                }
                                self.target = target;
                            };

                            var moveHandler = function (evt) {
                                evt.preventDefault();
                                self.offsetX = evt.targetTouches[0].pageX - self.startX;
                                var i = self.index - 1,
                                    m = i + 3;
                                for (i; i < m; i++) {
                                    li[i] && (li[i].style.webkitTransition = '-webkit-transform 0s ease-out');
                                    li[i] && (li[i].style.webkitTransform = 'translate3d(' + ((i - self.index) * self.deviceW + self.offsetX) + 'px, 0, 0)');
                                }
                            };

                            var endHandler = function () {
                                var boundary = self.deviceW / 6,
                                    endTime = new Date() * 1;
                                if (endTime - self.startTime > 300) {
                                    if (self.offsetX >= boundary) {
                                        self.goIndex('-1');
                                    } else if (self.offsetX < 0 && self.offsetX < -boundary) {
                                        self.goIndex('+1');
                                    } else {
                                        self.goIndex('0');
                                    }
                                } else {
                                    if (self.offsetX > 50) {
                                        self.goIndex('-1');
                                    } else if (self.offsetX < -50) {
                                        self.goIndex('+1');
                                    } else {
                                        self.goIndex('0');
                                    }
                                }
                            };

                            ul.addEventListener('touchstart', startHandler);
                            ul.addEventListener('touchmove', moveHandler);
                            ul.addEventListener('touchend', endHandler);

                            document.body.appendChild(this.container);

                            this.container.onclick = function () {
                                var _this = this;
                                this.className = 'animated fadeOut';
                                setTimeout(function () {
                                    _this.style.display = 'none';
                                }, 450)
                            }
                        };

                        return new Slider;
                    }
                },0)
            }
        })
    }

    if (typeof exports == "object") {
        module.exports = vueTouchSlider
    } else if (typeof define == "function" && define.amd) {
        define([], function(){ return vueTouchSlider })
    } else if (window.Vue) {
        window.vueTouchSlider = vueTouchSlider
        Vue.use(vueTouchSlider)
    }

})()