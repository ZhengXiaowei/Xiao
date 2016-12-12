window.JS = {
    canMove: false,
    bd: $('body'),
    color: ['#ff5c8b', '#ff7a9d', '#fb78c5', '#707ff9', '#4791ea', '#38afe8', '#2cb669', '#6acb19', '#e3aa13', '#ff8f57', ' #fd726d', '#ff534f'],
    themeColor: '#ff7a9d',
    colorCurrent: 5,
    colorTemp: 5,
    win: {
        h: $(window).height(),
        w: $(window).width()
    },
    // 浏览器识别
    browser: (function() {
        var name, version, ua = navigator.userAgent;
        if (/MSIE ([^;]+)/.test(ua)) {
            version = parseFloat(RegExp["$1"]);
            name = "ie";
        } else if (/Firefox\/(\S+)/.test(ua)) {
            version = parseFloat(RegExp["$1"]);
            name = "firefox";
        } else if (/Chrome\/(\S+)/.test(ua)) {
            version = parseFloat(RegExp["$1"]);
            name = 'chrome';
        }
        return {
            name: name,
            version: version
        }
    })()
};
JS.resize = function() {
    JS.win = {
        h: $(document.body).height(),
        w: $(window).width()
    };
};

(function($, window) {
    function init() {
        avatar(); //头像
    }
    // nav的头像
    function avatar() {
        var obj = {
            avatar: $(".Ojs-avatar-show"),
            hidBox: $(".hidden-box")
        };
        if (!obj.avatar.length || !obj.hidBox.length) return;
        var p = {
            h1: false,
            h2: false,
            canMove: true,
            _in: "animate-fadeInUp",
            out: "animate-fadeOutUp"
        };
        obj.avatar.hover(function() {
            p.h1 = true;
            if (p.canMove) fadeIn();
        }, function() {
            p.h1 = false;
            setTimeout(function() {
                if (!p.h2) {
                    fadeUp2();
                }
            }, 100);
        });
        obj.hidBox.hover(function() {
            p.h2 = true;
            if (p.canMove) fadeIn();
        }, function() {
            p.h2 = false;
            setTimeout(function() {
                if (!p.h1) {
                    fadeUp2();
                }
            }, 100);
        });

        function fadeUp() {
            obj.hidBox.removeClass(p._in).addClass(p.out);
            p.canMove = false;
            setTimeout(function() {
                obj.hidBox.css('display', 'none').removeClass(p.out).addClass(p._in).css('display', 'none');
                p.canMove = true;
            }, 400);
        }

        function fadeUp2() {
            p.canMove = true;
            obj.hidBox.css('display', 'none');
        }

        function fadeIn() {
            p.canMove = false;
            obj.hidBox.css('display', 'block');
        }
    }
    init();
})(jQuery, window);
!(function($, widnow) {
    $.extend($.easing, {
        backout: function(x, t, b, c, d) {
            var s = 1.7158;
            return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b
        },
        elasout: function(x, t, b, c, d) {
            var s = 1.7010158;
            var p = 0;
            var a = c;
            if (t == 0) return b;
            if ((t /= d) == 1) return b + c;
            if (!p) p = d * .3;
            if (a < Math.abs(c)) {
                a = c;
                var s = p / 4
            } else var s = p / (2 * Math.PI) * Math.asin(c / a);
            return a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b
        },
        easein: function(x, t, b, c, d) {
            return c * (t /= d) * t + b
        },
        easeout: function(x, t, b, c, d) {
            return -c * t * t / (d * d) + 2 * c * t / d + b
        },
        bounceOut: function(t) {
            if (t < 1 / 2.75) {
                return (7.5625 * t * t);
            } else if (t < 2 / 2.75) {
                return (7.5625 * (t -= 1.5 / 2.75) * t + 0.75);
            } else if (t < 2.5 / 2.75) {
                return (7.5625 * (t -= 2.25 / 2.75) * t + 0.9375);
            } else {
                return (7.5625 * (t -= 2.625 / 2.75) * t + 0.984375);
            }
        }
    });
    // 导航的火焰灯
    $.fn.fireLight = function(config) {
        var o = {
            fx: 'backout',
            speed: 800,
            click: function() {}
        }
        o = $.extend(o, config);

        return $(this).each(function(index, el) {
            var self = this,
                $this = $(this),
                noop = function() {},
                back = $('<li class="Ojs-light"><div class="append"></div></li>').appendTo($this),
                lis = $('li', this),
                cur = $('li.cur', this)[0] || lis.eq(0).addClass('cur');
            lis.not('.back').hover(function() {
                move(this);
            }, noop);
            $this.hover(noop, function() {
                move(cur)
            })
            lis.click(function(e) {
                thisl = $(this);
                set(this);
                return o.click.apply(this, [e, this])
            });

            function move(a) {
                back.each(function() {
                    $(this).dequeue()
                }).animate({
                    left: a.offsetLeft,
                    width: a.offsetWidth
                }, o.speed, o.fx)
            }

            function set(a) {
                thisl.addClass('cur').siblings().removeClass('cur');
                cur = a;
            }
        });
    };
    // 搜索框
    $.fn.checkIpt = function(cl) {
        cl = cl || 'cur';
        return $(this).each(function(idx, el) {
            var p = $(el).parent();
            $(window).on('load', check);
            $(el).on('input paste', check);

            function check() {
                if (el.value != 0) {
                    p.addClass(cl);
                } else {
                    p.removeClass(cl);
                }
            }
        });
    };
    /**
     * 对象的移动
     * @param  {$()::object} head 
     */
    $.fn._move = function(config) {
        var o = {
            head: '',
            buff: ''
        };
        $.extend(true, o, config);
        typeof config === 'string' && (o.head = config);

        return this.each(function(idx, el) {
            if (!$(el).data('move')) $(el).data('move', new Move(el));
        });

        function Move(el) {
            var that = this;

            this.position = {
                width: $(el).width(),
                height: $(el).height(),
                x: parseFloat($(el).css('left')),
                y: parseFloat($(el).css('top'))
            };
            this.temp = {};
            var target = $(el);
            o.head && (target = $(el).find(o.head));
            target.on('mousedown', function(e) {
                that.temp.startX = e.clientX;
                that.temp.startY = e.clientY;

                $(window).on('mousemove', function(e) {
                    that.temp.MoveX = that.temp.startX - e.clientX;
                    that.temp.MoveY = that.temp.startY - e.clientY;
                    that.position.mx = Math.min(JS.win.w - that.position.width, Math.max(0, that.position.x - that.temp.MoveX));
                    that.position.my = Math.min(JS.win.h - that.position.height, Math.max(0, that.position.y - that.temp.MoveY));
                    $(el).css({
                        left: that.position.mx,
                        top: that.position.my
                    });
                }).on('mouseup', function(e) {
                    $(this).off('mousemove');
                    that.position.x = that.position.mx;
                    that.position.y = that.position.my;
                });
            });

        }
    }
})(jQuery, window);
!(function($, widnow) {
    JS.toDeg = function(a) {
        return (a / 180 * Math.PI)
    };
    JS.ease = {};
    JS.ease.easeOut = function(t, b, c, d) {
        if (t < d / 2) return 2 * c * t * t / (d * d) + b;
        var a = t - d / 2;
        return -2 * c * a * a / (d * d) + 2 * c * a / d + c / 2 + b
    };
})(jQuery, window);
!(function($, window) {
    // 文件上传并显示图片
    JS.upload = function(config) {
        var o = {
                ul: '',
                button: '',
                apd: '<img></img>',
                type: 'prepend',
                callback: function() {}
            },
            obj, p;
        $.extend(true, o, config);
        obj = {
            ul: $(o.ul),
            button: $(o.button)
        };
        p = {
            type: o.type == 'prepend' ? 1 : 0
        }
        obj.button.change(function(e) {
            var file = this.files[0],
                reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = function(e) {
                var div = $('<div>').addClass('Ojg-uploadImg');
                div.html(o.apd);
                var img = div.find('img');
                img[0].src = this.result;
                if (p.type) {
                    obj.ul.prepend(div);
                } else {
                    obj.ul.append(div);
                }
                o.callback();
            }
        });
    };
    JS.typeChoose = function(config) {
        var o = {
            hidbtn: '',
            button: '',
            data: 'data-value'
        }
        $.extend(true, o, config);
        var obj = {
            hidbtn: $(o.hidbtn),
            button: $(o.button)
        };
        obj.button.on('click', function(e) {
            obj.hidbtn.val(this.value == undefined ? $(this).attr(o.data) : this.value);
        });
    };
    // 选择按钮 点击选择
    JS.checkbox = function(config) {
        var o = {
                checkbox: '',
                input: 'input',
                cl: 'cur',
                callback1: '',
                callback2: '',
                trRow: '',
                typeRow: true
            },
            obj;
        $.extend(true, o, config);
        obj = {
            checkbox: $(o.checkbox),
        };
        obj.ipt = obj.checkbox.find(o.input);
        obj.parent = obj.checkbox.closest('table');
        obj.row = obj.parent.find('.item');

        obj.checkbox.each(function(idx, el) {
            var ipt = $(el).find(o.input);
            ipt.val(0);
            $(el).on('click', function(e) {
                if (idx == 0) {
                    ipt.val() == 0 ? (function() {
                        obj.ipt.val(1);
                        obj.checkbox.addClass(o.cl);
                        obj.checkbox.each(function(idx, $el) {
                            if (idx) {
                                add($el);
                            }
                        });
                    })() : (function() {
                        obj.ipt.val(0);
                        obj.checkbox.removeClass(o.cl);
                        obj.checkbox.each(function(idx, $el) {
                            if (idx) {
                                remove($el);
                            }
                        });
                    })()
                } else {
                    ipt.val() == 0 ? (function() {
                        add(el);
                    })() : (function() {
                        remove(el);
                        obj.ipt.eq(0).val(0);
                        obj.checkbox.eq(0).removeClass('cur');
                    })()
                }

                function add(el) {
                    var ipt = $(el).find(o.input);
                    if (!ipt.val()) {
                        return;
                    }
                    ipt.val(1);
                    $(el).addClass(o.cl);
                    if (typeof o.callback1 == 'function') {
                        o.callback1(el)
                    }
                }

                function remove(el) {
                    var ipt = $(el).find(o.input);
                    if (!ipt.val()) return;
                    ipt.val(0);
                    $(el).removeClass(o.cl);
                    if (typeof o.callback2 == 'function') {
                        o.callback2(el)
                    }
                }
                return false;
            });
        });
        if (o.typeRow) {
            obj.row.each(function(idx, el) {
                $(el).on('click', function(e) {
                    $(el).find(o.checkbox).trigger('click');
                });
            });
        }
    };
    /**
     * 弹窗
     * @param  {object} config 
     * return {close :关闭弹框 show:显示弹框}  type:function
     */
    JS.dialog = function(config) {
        var o = {
            head: '提示',
            content: 'niahapdsa fdasf',
            button1: '保存',
            button2: '',
            btn1Fun: '',
            btn2Fun: '',
            width: 0,
            height: 0,
            classname: '',
            callback: function() {},
            callbackFail: function() {},
            callbackParam: '',
            callbackFailParam: '',
            init: '',
            initParam: '',
            cancel_callBack: '',
            cancel_callBack_param: '',
            formAction: '',
            canMove: true
        };
        $.extend(true, o, config);
        if (typeof o.content === 'object') {
            apd = o.content;
            o.type = 1;
        } else {
            apd = $('<div class="Ojs-dialog uOjs-dialog ' + o.classname + '"><div class="mask"></div><div class="doInfo-box"><header class="Ojs-theme-colotBtn">' + o.head + '<i class="icon-close"></i></header><div class="contain">' + o.content + '</div><div class="footer"><p class="doSave">' + (o.button1 ? ('<span class="save Ojs-theme-colotBtn">' + o.button1 + '</span>') : '') + (o.button2 ? ('<span class="cancel">' + o.button2 + '</span>') : '') + '</p></div></div></div>');
            JS.bd.append(apd);
        };
        var target = $(o.classname ? '.' + o.classname : (o.type ? o.content : '.uOjs-dialog')),
            obj = {
                mask: target.find('.mask'),
                box: target.find('.doInfo-box'),
                sure: target.find('.save'),
                cancel: target.find('.cancel'),
                close: target.find('.icon-close'),
                head: target.find('header'),
                target: target
            },
            p = {
                _in: 'animate-fadeIn',
                out: 'animate-fadeOutUp',
                time: 380
            };

        if (typeof o.init === 'function') {
            o.init(o.initParam);
        };

        obj.mask.on('click', function(e) {
            //           close(this);//点击页面其他地方自动关闭
        });
        obj.close.on('click', function(e) {
            close(this);
        });
        // obj.cancel.on('click', function(e) {
        //     if (typeof o.cancel_callBack === 'function') {
        //         o.cancel_callBack(o.cancel_callBack_param);
        //     }
        //     close(this); //按钮2自动关闭
        // });
//        o.btn1Fun = function() {
//            if (!o.callback(o.callbackParam, obj)) {
//                close(this); //按钮1自动关闭
//            } else {
//                o.callbackFail(o.callbackFailParam, obj)
//            }
//        }
//        o.btn2Fun = function() {
//            if (!o.callback(o.callbackParam, obj)) {
//                close(this); //按钮1自动关闭
//            } else {
//                o.callbackFail(o.callbackFailParam, obj)
//            }
//        }
        obj.cancel.on('click', o.btn2Fun);
        // obj.sure.on('click', function(e) {
        //     if (!o.callback(o.callbackParam, obj)) {
        //         close(this); //按钮1自动关闭
        //     } else {
        //         o.callbackFail(o.callbackFailParam, obj)
        //     }
        // });
        obj.sure.on('click', o.btn1Fun);

        show();
        initWidth();
        initColor();
        initPosition();

        $(window).on('resize', function(e) {
            JS.resize();
            initPosition();
        });

        function close(_self) {
            var temp = {
                    target: $(_self).parents('.Ojs-dialog')
                },
                len = temp.target.length;
            temp.mask = (len ? temp.target.find('.mask') : obj.mask);
            temp.box = (len ? temp.target.find('.doInfo-box') : obj.box);
            !len && (temp.target = target);
            temp.mask.fadeOut();
            temp.box.addClass(p.out).removeClass(p._in);
            setTimeout(function() {
                temp.box.removeClass(p.out).addClass(p._in);
                temp.target.css('display', 'none')
                o.type ? '' : temp.target.remove();
            }, p.time);
        }

        function show() {
            target.css('display', 'block');
            obj.mask.fadeIn();
            obj.box.addClass(p._in);
        }

        function initWidth() {
            o.width ? obj.box.width(o.width) : '';
            o.height ? obj.box.height(o.height) : '';
        }

        function initPosition() {
            box = {
                w: obj.box.width(),
                h: obj.box.height()
            };
            obj.box.css({
                left: (JS.win.w - box.w) / 2,
                top: (JS.win.h - box.h) / 2
            });
        }

        function initColor() {
            obj.head.css('backgroundColor', JS.color[JS.colorCurrent]);
            // obj.sure.css('backgroundColor', JS.color[JS.colorCurrent]);
        }
        if (o.canMove) {
            obj.box._move('header');
            obj.head.css('cursor', 'move');
        }
        return {
            show: show,
            close: close
        }
    };
    // 转换成rgb
    JS.toRGB = function(color, alpha) {
        a = alpha || 1;
        if (typeof(color) === 'string' && color[0] === '#') {
            color = parseInt(color.slice(1), 16);
        }
        var r = r = color >> 16 & 0xff,
            g = color >> 8 & 0xff,
            b = color & 0xff;
        if (alpha === undefined) {
            return "rgb(" + r + ", " + g + ", " + b + ")";
        } else {
            alpha = (alpha < 0) ? 0 : ((alpha > 1) ? 1 : alpha);
            return "rgba(" + r + ", " + g + ", " + b + "," + a + ")";
        }
    };
    // 选择类
    JS.chooseCur = function(config) {
        var o = {
            alis: '',
            blis: '',
            classname: 'cur',
            idx: 0
        };
        $.extend(true, o, config);
        var obj = {
            alis: $(o.alis),
            blis: $(o.blis)
        };
        // 初始化
        eqShow(obj.alis, o.idx);
        eqShow(obj.blis, o.idx);

        obj.alis.each(function(idx, el) {
            $(el).on('click', function(e) {
                if ($(el).html() == '正式库') {
                    loadIndexTree("1", 'dataIndex_tree_zsk');
                } else if ($(el).html() == '临时库') {
                    loadIndexTree("0", 'dataIndex_tree_lsk');
                }
                $(el).addClass(o.classname).siblings().removeClass(o.classname);
                obj.blis.eq(idx).addClass(o.classname).siblings().removeClass(o.classname);
            });
        });

        function eqShow(target, idx) {
            target.eq(idx).addClass(o.classname).siblings().removeClass(o.classname);
        }
    };
    // 获取location的Search
    JS.getSearch = function(name) {
        var search = location.search;
        var keys = ('&' + search.slice(1)).split('&' + name + '=');
        if (keys.length === 2) {
            return keys.pop().split(';').shift();
        }
    };
    // 获取location的Hash
    JS.getHash = function(name) {
            var hash = location.hash;
            var keys = ('#' + hash.slice(1)).split('#' + name + '=');
            if (keys.length === 2) {
                return keys.pop().split(';').shift();
            }
        }
        // 全屏加载 本来是应该把样式放到css文件中的，但是为了只需调用函数就行，就扔到里面了
    JS.fullLoad = function(config) {
        if (!(this instanceof JS.fullLoad)) {
            return new JS.fullLoad(config)
        };
        if ($('#Ojs-pic-loading').length) return;
        this._append = function() {
            var appendLoad = $('<div id="Ojs-pic-loading" class="Ojs-pic-loading"><div id="loading-center"><div id="loading-center-absolute"><div class="object" id="object_one"></div><div class="object" id="object_two"></div><div class="object" id="object_three"></div><div class="object" id="object_four"></div><div class="object" id="object_five"></div><div class="object" id="object_six"></div><div class="object" id="object_seven"></div><div class="object" id="object_eight"></div></div></div></div>');
            var style = $('<style>').append('#Ojs-pic-loading{background-color:rgba(0,0,0,0.2);height:100%;width:100%;position:fixed;z-index:999;margin-top:0px;top:0px;display:none}#Ojs-pic-loading.cur{display:block}.Ojs-pic-loading #loading-center{width:100%;height:100%;position:relative}.Ojs-pic-loading #loading-center-absolute{position:absolute;left:50%;top:50%;height:150px;width:150px;margin-top:-75px;margin-left:-75px;-moz-border-radius:50% 50% 50% 50%;-webkit-border-radius:50% 50% 50% 50%;border-radius:50% 50% 50% 50%}.Ojs-pic-loading .object{width:20px;height:20px;background-color:#0096ff;position:absolute;-moz-border-radius:50% 50% 50% 50%;-webkit-border-radius:50% 50% 50% 50%;border-radius:50% 50% 50% 50%;-webkit-animation:animate 0.8s infinite;animation:animate 0.8s infinite}.Ojs-pic-loading #object_one{top:19px;left:19px}.Ojs-pic-loading #object_two{top:0px;left:65px;-webkit-animation-delay:0.1s;animation-delay:0.1s}.Ojs-pic-loading #object_three{top:19px;left:111px;-webkit-animation-delay:0.2s;animation-delay:0.2s}.Ojs-pic-loading #object_four{top:65px;left:130px;-webkit-animation-delay:0.3s;animation-delay:0.3s}.Ojs-pic-loading #object_five{top:111px;left:111px;-webkit-animation-delay:0.4s;animation-delay:0.4s}.Ojs-pic-loading #object_six{top:130px;left:65px;-webkit-animation-delay:0.5s;animation-delay:0.5s}.Ojs-pic-loading #object_seven{top:111px;left:19px;-webkit-animation-delay:0.6s;animation-delay:0.6s}.Ojs-pic-loading #object_eight{top:65px;left:0px;-webkit-animation-delay:0.7s;animation-delay:0.7s}@-webkit-keyframes animate{25%{-ms-transform:scale(2);-webkit-transform:scale(2);transform:scale(2)}75%{-ms-transform:scale(1);-webkit-transform:scale(1);transform:scale(1)}}@keyframes animate{50%{-ms-transform:scale(2,2);-webkit-transform:scale(2,2);transform:scale(2,2)}100%{-ms-transform:scale(1,1);-webkit-transform:scale(1,1);transform:scale(1,1)}}');
            $('body').append(style).append(appendLoad);
        };
        this.load = function() {
            $('#Ojs-pic-loading').fadeIn();
        }
        this.loaded = function() {
            $('#Ojs-pic-loading').fadeOut();
        }
        this.destory = function() {
            $('#Ojs-pic-loading').remove();
        };
        this._append();
        return this;
    };
    /**
     * 进度条
     * @param  {$() Object} target 添加canvas的父节点
     * @param  {[type]} config
     * var pro = new progress(target,config)
     * pro.update(number,function1(e,fun),function2)
     * function1 中 o是进度fun 为funciton2
     */
    JS.progress = function(target, config) {
        var o = {
                width: 160,
                height: 160,
                radius: 70,
                lineWidth: 8,
                duration: 100,
                percent: 0,
                endAngle: 0,
                startAngle: 0,
                OxrAngle: 0,
                newTime: 0,
                deg: 0
            },
            _circle, fun = {};
        var PI = 3.14;
        $.extend(true, o, config);
        var canvas = $('<canvas>'),
            ctx = canvas[0].getContext('2d');
        canvas.attr({
            width: o.width,
            height: o.height
        });

        function circle() {
            this.color = '#000';
            this.background = '#bbb';
            this.durtation = o.duration;
            this.radius = o.radius;
            this.width = o.lineWidth;
            ctx.strokeStyle = this.background;
            ctx.lineWidth = this.width;
            ctx.beginPath();
            ctx.lineCap = "round";
            ctx.arc(this.radius + this.width, this.radius + this.width, this.radius, -PI / 2, 3 * PI / 2, 0);
            ctx.stroke();
            ctx.closePath();
        };
        circle.prototype.draw = function(nm) {
            ctx.beginPath();
            ctx.fillStyle = this.background;
            ctx.lineCap = "round";
            ctx.arc(this.radius + this.width, this.radius + this.width, this.radius, -PI / 2, 3 * PI / 2, 0);
            ctx.stroke();
            ctx.closePath();

            ctx.save();
            ctx.beginPath();
            ctx.strokeStyle = 'hsl(' + (nm / 3 + 340) + ', 100%, 60%)';
            ctx.arc(this.radius + this.width, this.radius + this.width, this.radius, -PI / 2, -PI / 2 + JS.toDeg(nm), 0);
            ctx.stroke();
            ctx.closePath();
            ctx.restore();
        }

        function init() {
            target.append(canvas);
            _circle = new circle();
            circle();
        };

        function draw() {
            ctx.clearRect(0, 0, o.width, o.height);
            ++o.newTime;
            console.log(JS.ease);
            o.deg = JS.ease.easeOut(o.newTime, o.startAngle, o.OxrAngle, o.duration);
            // o.deg = $.easing.easeout(o.newTime, o.startAngle, o.OxrAngle, o.duration);
            _circle.draw(o.deg);
            if (o.newTime < o.duration) {
                requestAnimationFrame(draw);
                typeof fun.fun1 === 'function' ? fun.fun1(o.deg, fun.fun2) : '';
            }
        }

        function update(nm, fun1, fun2) {
            o.startAngle = o.deg;
            o.endAngle = nm;
            o.newTime = 0;
            o.OxrAngle = o.endAngle - o.startAngle;
            draw();
            fun.fun1 = fun1;
            fun.fun2 = fun2;
        }

        function stop() {
            o.newTime = o.duration;
        }
        init();
        return {
            update: update
        };
    };

    /**
     * 有点显示按钮
     * @param  {fucntion} fun  点击菜单的回调函数
     * @param  {object} config 回调函数的参数
     * target,menu,submenu为jQuery 类名
     * fun 点击菜单的
     */
    JS.contextMenu = function(config) {
            var o = {
                    target: '',
                    menu: '',
                    submenu: '',
                    data: 'data-hidden',
                    lisClassName: 'module-contextMenu-hover',
                    fun: '',
                    param: '',
                    content: ''
                },
                type = 0;
            $.extend(true, o, config);
            o.content ? type = !0 : type = !1;
            var obj = {
                    target: $(o.target),
                    menu: $(o.menu),
                    submenu: $(o.submenu)
                },
                hideArray = [],
                toshow = false;

            obj.target.each(function(idx, el) {
                $(el).on('contextmenu', function(e) {
                    var that = this;
                    if (type) {
                        $('body').append($(o.content))
                    };
                    e.preventDefault();
                    obj.menu = $(o.menu);
                    obj.submenu = $(o.submenu);
                    obj.menu.css({
                        left: e.clientX,
                        top: e.clientY,
                        display: 'block'
                    });
                    // submenu
                    obj.submenu.each(function(idx, el) {
                        var hidTarget = $($(el).attr(o.data)),
                            toShow = false;
                        hideArray.push(hidTarget);
                        obj.menu.on('mousemove', function(e) {
                            if (!$(e.target).is($(el)) && !$(e.target).parents('.' + o.lisClassName).is($(el))) {
                                toShow = false;
                                setTimeout(isShow, 200);
                            }
                        });
                        $(el).on('mouseenter', function() {
                            toShow = true;
                            setTimeout(isShow, 200);
                            return false;
                        });
                        hidTarget.on('mousemove', function() {
                            toShow = true;
                            setTimeout(isShow, 200);
                            return false;
                        });

                        function isShow() {
                            toShow ? hidTarget.css('display', 'block') : hidTarget.css('display', 'none');
                        }
                    });
                    $(document).on('click', close);
                    // obj.target.on('click', close);
                    // 点击触发事件
                    $('.' + o.lisClassName).on('click', function(e) {
                        typeof o.fun === 'function' ? o.fun(this, that, o.param) : '';
                        close();
                        return false;
                    });

                    function close() {
                        if (type) {
                            obj.menu.remove();
                        } else {
                            obj.menu.css('display', 'none');
                            hideArray.forEach(function(el, idx) {
                                el.css('display', 'none');
                            })
                        }
                        // 事件解除
                        $('.' + o.lisClassName).off('click');
                    }
                });
            });

        }
        /**
         * 查询打印签字
         * @param  {srtin || object} target 放置canvas的容器
         * @return {[type]}        [description]
         */
    JS.printInfro = function(config) {
            var o = {
                    target: '', //放置canvas的容器  sring || object
                    width: 600, //canvas 的宽  number
                    height: 400, //canvas 的长  number
                    header: '嘉善县档案馆查阅档案登记表', // 表头  srting
                    textFont: 'Calibri', // 字体  sring 
                    remark: '', //备注信息 string
                    files: '', //档号  类型为srting时 以空格隔开 || 或者为数组
                    showRemark: false, //当没有备注信息时是否显示备注,默认没有备注的时候不显示备注  boolean
                    lineHeight: 25, //行高  number
                    bigFontSize: 20, //title 等的字体大小  number
                    smallFontSize: 16 // 平常文字的字体大小 number
                },
                p = {
                    sectionHeight: 40,
                    startX: 10,
                    startY: 68,
                    remarkX: 50,
                    fileX: 110
                };
            $.extend(true, o, config);
            var canvas = $('<canvas>'),
                ctx = canvas[0].getContext('2d'),
                obj = {
                    target: typeof o.target === 'object' ? o.target : $(o.target)
                }
            canvas.attr({
                width: o.width,
                height: o.height
            });

            function init() {
                ctx.font = o.bigFontSize + 'px ' + o.textFont;
                ctx.fillStyle = '#333';
                writeInfo();
                var img = $('<img>');
                img[0].src = canvas[0].toDataURL();
                obj.target.append(img)
            }

            function writeInfo() {
                ctx.save();
                var headerWidth = ctx.measureText(o.header).width;
                ctx.fillText(o.header, (o.width - headerWidth) / 2, 30);
                if (o.showRemar || o.remark) {
                    ctx.fillText("备注:", p.remarkX, p.startY);
                    ctx.font = o.smallFontSize + 'px ' + o.textFont;
                    writeRemark(o.remark, p.remarkX + 60, p.startY, o.width - p.remarkX - 60);
                    p.startY += p.sectionHeight;
                };
                ctx.font = o.bigFontSize + 'px ' + o.textFont;
                ctx.fillText("档案描述:", p.startX, p.startY);
                ctx.font = o.smallFontSize + 'px ' + o.textFont;
                writeRemark(o.files, p.fileX, p.startY, o.width - p.fileX - 20);
                ctx.fillText("申请查档人签字确认:", o.width - 260, o.height - 30, ' ');
                ctx.restore();
            }

            function writeRemark(text, x, y, width, splite) {
                var line = '';
                type = false;
                if (typeof text === 'string') {
                    splite && (text = text.split(splite), type = true);
                } else if (typeof text === 'object') {
                    type = true;
                }
                for (var i = 0, len = text.length; i < len; i++) {
                    var writeLine = line + text[i] + (type ? '    ' : ''),
                        writeLineWidth = ctx.measureText(writeLine).width;
                    if (writeLineWidth > width) {
                        ctx.fillText(line, x, y);
                        line = text[i] + (type ? '    ' : '');
                        y += o.lineHeight;
                    } else {
                        line = writeLine;
                    }
                }
                ctx.fillText(line, x, y);
                p.startY = y;
            }
            init();
        }
        //  回车下一个
    JS.changeFocus = function(config) {
            var o = {
                inputs: ''
            };
            $.extend(true, o, config);
            var obj = {
                    inputs: $(o.inputs)
                },
                p = {
                    len: obj.inputs.length
                };
            obj.inputs.on('focus', function(e) {
                $(this).on('keypress', function(e) {
                    var temp = $(this).attr('data-index');
                    temp = Math.min(++temp, p.len - 1);
                    if (e.keyCode === 13) {
                        obj.inputs.filter('[data-index =' + temp + ']').focus();
                    }
                });
            });
        }
        // new JS.contextMenu({
        //        target : '#LoadBox',
        //        menu : '.Ojs-contextMenu-test',
        //        submenu : '.Ojs-contextMenu-showHidden',
        //        content: '<div class="Ojs-dialog-contextMenu Ojs-contextMenu-test"><div class="doInfo-box module-contextMenu-box"><ul class="css-contextMenu-ul"><li class="module-contextMenu-hover"><i class="icon-link"></i>123</li><li class="module-contextMenu-hover"><i class="icon-bigB"></i>123</li><li class="module-contextMenu-hover"><i class="icon-copy"></i>123</li><li class="module-contextMenu-hover"><i class="icon-out"></i>123</li><li class="module-contextMenu-hover"><i class="icon-find"></i>更新卷内数据</li><li class="module-contextMenu-hover"><i class="icon-setDocument"></i>批量挂接</li><li class="module-contextMenu-hover"><i class="icon-weidiaocha"></i>批量组卷</li><li class="module-contextMenu-hover"><i class="icon-fenzhubanjie"></i>分组统计</li><li class="module-contextMenu-hover Ojs-contextMenu-showHidden"><i class="icon-zidian"></i>数据字典<i class="icon-youbian"></i></li></ul></div></div>',
        //        fun:function () {
        //            console.log(arguments);
        //        }
        //    }); //右击显示菜单
})(jQuery, window)