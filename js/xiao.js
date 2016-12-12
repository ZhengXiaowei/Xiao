window.Xiao = {
    body: $('body'),
    //获取浏览器的宽高
    wins: {
        height: $(document.body).height() || $(document.documentElement).height() || $(window).height(),
        width: $(document.body).width() || $(document.documentElement).width() || $(window).width()
    },
    //判断浏览器类型
    broswer: (function() {
        var ua = navigator.userAgent,
            uaName, uaVersion;
        if (/MSIE ([^;]+)/.test(ua)) {
            uaVersion = parseFloat(RegExp["$1"]);
            uaName = "ie";
        } else if (/Firefox\/(\S+)/.test(ua)) {
            uaVersion = parseFloat(RegExp["$1"]);
            uaName = "firefox";
        } else if (/Chrome\/(\S+)/.test(ua)) {
            uaVersion = parseFloat(RegExp["$1"]);
            uaName = "chrome";
        }
        return {
            uaName: uaName,
            uaVersion: uaVersion
        }
    })()
};
//浏览器窗体变化时获取新的宽高
Xiao.resize = function() {
    Xiao.wins = {
        height: $(document.body).height() || $(document.documentElement).height() || $(window).height(),
        width: $(document.body).width() || $(document.documentElement).width() || $(window).width()
    }
};
(function($) {
    /**
     * 将默认select美化,并实现select的功能
     * param:
     * width 下拉框的宽度 默认100%
     * classname 额外添加的class名
     * itemHoverBgColor 列表项的背景颜色
     * itemHoverTextColor 字体颜色
     * textColor 文本颜色
     * borderColor 边框颜色 默认和文本颜色相同
     * 使用方法: 
     * $(选择器).xSelect();
     * 问题:
     * 貌似不兼容ie9以下
     */
    $.fn.xSelect = function(options) {
        var defaults = {
            classname: '',
            width: 'calc(100% - 2px)', //默认宽度100%
            itemHoverBgColor: '',
            itemHoverTextColor: '#eee',
            textColor: '#000',
            borderColor: ''
        };
        defaults = $.extend(true, defaults, options);
        $.each(this, function(k, v) {
            var optArr = [];
            //循环所有option并取值存入数组
            $.each($(v).find('select option'), function(idx, elm) {
                optArr.push($(elm).text());
            });
            //定义新的下拉框组件
            var selectBox = '<div class="selectBox p_rel ' + defaults.classname + '"><p>' + optArr[0] + '<i class="icon-expand"></i></p>';
            selectBox += '<div class="selectItems p_abs trans"><ul>';
            for ($i = 0; $i < optArr.length; $i++) {
                selectBox += '<li class="trans">' + optArr[$i] + '</li>';
            }
            selectBox += '</ul></div></div>';
            $(selectBox).css('width', defaults.width).appendTo($(v));
            //设置li背景以及文字
            var target = $(defaults.classname ? '.' + defaults.classname : '.selectBox'),
                sObj = {
                    liBgColor: target.find('li'),
                    itemsBorder: target.find('.selectItems'),
                    liTextColor: target
                };
            $(sObj.liBgColor).hover(function() {
                $(this).css({ 'background': defaults.itemHoverBgColor, 'color': defaults.itemHoverTextColor });
            }, function() {
                $(this).css({ 'background': '#fff', 'color': defaults.textColor });
            });
            $(sObj.liTextColor).css({ 'color': defaults.textColor, 'border-color': defaults.borderColor ? defaults.borderColor : defaults.textColor });
            $(sObj.liBgColor).css({ 'color': defaults.textColor, 'border-color': defaults.borderColor ? defaults.borderColor : defaults.textColor });
            $(sObj.itemsBorder).css({ 'border-color': defaults.borderColor ? defaults.borderColor : defaults.textColor, 'transform-origin': 'center top 0px', 'transform': 'rotateX(-90deg)' });
            //鼠标点击显示下拉框事件
            $(v).find('.selectBox').on('click', function() {
                $(this).find('.selectItems').css('opacity', 0).animate({}, function() {
                    $(this).css({
                        'opacity': 1,
                        'transform': 'rotateX(0deg)',
                    })
                })
            });
            //移除隐藏
            $(v).find('.selectBox').on('mouseleave', function() {
                $(this).find('.selectItems').css({ 'opacity': 0 }).animate({}, function() {
                    $(this).css('transform', 'rotateX(-90deg)')
                })
            });
            $.each($(v).find('.selectItems li'), function(idx, elm) {
                $(elm).on('click', function() {
                    $(this).parents('.selectBox').find('p').html($(this).text() + '<i class="icon-expand"></i>');
                })
            });
            //移除本身的select
            $(v).find('select').remove();
        })
    };
    /**
     * radio组件
     * param:
     * size radio的大小
     * obgColor radio外圈的颜色
     * inBgColor radio内圈的颜色
     * checkColor radio选中后的颜色
     * classname 额外添加classname
     * vertical 是否竖直排列
     * 使用方法:
     * $(选择器).xRadio();
     */
    $.fn.xRadio = function(options) {
        var defaults = {
            size: '', //大小
            obgColor: '', //外圈的颜色
            inBgColor: '', //内圈的颜色
            checkColor: '', //选中的颜色
            classname: '',
            vertical: false //是否竖直排列
        }
        defaults = $.extend(true, defaults, options);

        $.each(this, function(k, v) {
            if (defaults.vertical) {
                if ($(v).find('label').length) {
                    $(v).find('label').css({ 'display': 'block', 'margin': '10px 0' });
                } else {
                    $(v).find('input[type=radio]').css({ 'display': 'block', 'margin': '10px 0' });
                }
            }
            $(v).css({ 'font-size': '14px', 'font-family': 'Microsoft Yahei' });
            $(v).find('input[type=radio]').addClass('radioBtn ' + (defaults.classname ? defaults.classname : '')).css({
                'background': defaults.obgColor ? defaults.obgColor : '#ddd',
                'width': defaults.size ? defaults.size + 'px' : '20px',
                'height': defaults.size ? defaults.size + 'px' : '20px'
            });
            if ($('style').length) {
                $('style').append((defaults.classname ? '.' + defaults.classname : '.radioBtn') + ':after{background:' + (defaults.inBgColor ? defaults.inBgColor : '#fff') + ';width:' +
                    (defaults.size ? (defaults.size - 10) : '20-10') + 'px;height:' + (defaults.size ? (defaults.size - 10) : '20-10') + 'px}' +
                    (defaults.classname ? '.' + defaults.classname : '.radioBtn') + ':checked:after{background:' + (defaults.inBgColor ? defaults.checkColor : '#3db5ff') +
                    '}');
            } else {
                $('head').append('<style>' + (defaults.classname ? '.' + defaults.classname : '.radioBtn') + ':after{background:' + (defaults.inBgColor ? defaults.inBgColor : '#fff') + ';width:' +
                    (defaults.size ? (defaults.size - 10) : '20-10') + 'px;height:' + (defaults.size ? (defaults.size - 10) : '20-10') + 'px}' +
                    (defaults.classname ? '.' + defaults.classname : '.radioBtn') + ':checked:after{background:' + (defaults.inBgColor ? defaults.checkColor : '#3db5ff') +
                    '}</style>');
            }
        })
    };
    /**
     * checkbox
     * param:
     * classname 额外的class名称
     * size 组件的大小
     * borderStyle checkbox边框样式
     * initBgColor checkbox的背景颜色
     * checkColor 选中时钩子的颜色
     * borderRadius 圆角百分比
     * showBorder 是否显示边框
     * isAnimate 是否拥有简单的动画效果
     * vertical 是否竖直排列
     * Ps:后期优化加入是否全选
     * 使用方法
     * $(选择器).xCheckBox()
     */
    $.fn.xCheckBox = function(options) {
        var defaults = {
            classname: '',
            size: '',
            borderStyle: 'dotted',
            initBgColor: '',
            checkColor: '',
            borderRadius: '',
            showBorder: true,
            isAnimate: false,
            vertical: false
        };
        defaults = $.extend(true, defaults, options);
        $.each(this, function(k, v) {
            if (defaults.vertical) {
                if ($(v).find('label').length) {
                    $(v).find('label').css({ 'display': 'block', 'margin': '10px 0' });
                } else {
                    $(v).find('input[type=checkbox]').css({ 'display': 'block', 'margin': '10px 0' });
                }
            }
            $(v).css({ 'font-size': '14px', 'font-family': 'Microsoft Yahei' });
            $(v).find('input[type=checkbox]').addClass('icon-ckBox ' + (defaults.classname ? defaults.classname : '')).css({
                'background': defaults.initBgColor ? defaults.initBgColor : '#ddd',
                'color': defaults.initBgColor ? defaults.initBgColor : '#ddd',
                'width': defaults.size ? defaults.size + 'px' : '20px',
                'height': defaults.size ? defaults.size + 'px' : '20px',
                'font-size': defaults.size ? (defaults.size - 2) + 'px' : '18px',
                'border-radius': defaults.borderRadius
            });
            if (defaults.showBorder) {
                $(v).find((defaults.classname ? '.' + defaults.classname : '.icon-ckBox')).css('border-style', defaults.borderStyle);
            } else {
                $(v).find((defaults.classname ? '.' + defaults.classname : '.icon-ckBox')).css('border', '0');
            }
            if (defaults.isAnimate) {
                $(v).find('input[type=checkbox]').addClass('trans');
            }
            if ($('style').length) {
                $('style').append((defaults.classname ? '.' + defaults.classname : '.icon-ckBox') + ':checked:before{color:' + (defaults.checkColor ? defaults.checkColor : '#000') + '}');
            } else {
                $('head').append('<style>' + (defaults.classname ? '.' + defaults.classname : '.icon-ckBox') + ':checked:before{color:' + (defaults.checkColor ? defaults.checkColor : '#000') + '}</style>');
            }
        })
    };
    /**
     * waterfall瀑布流
     * 动画待改进
     * param:
     * padding:内边距的值
     * borderWidth:边框宽度
     * 使用方法：
     * $(选择器).xWaterFall();
     * 
     * Ps:后期加入滚动加载的事件
     */
    $.fn.xWaterFall = function(options) {
        var defaluts = {
            padding: '',
            borderWidth: ''
        }
        defaluts = $.extend(true, defaluts, options);
        var _self = this,
            evLi = this.find('li'),
            evLiWidth = $(evLi).width(), //获取每个li的宽度
            evLiPadding = defaluts.padding ? defaluts.padding : '0', //获取每个li的padding值
            evLiBorder = defaluts.borderWidth ? defaluts.borderWidth : '0', //获取每个li的border宽度
            liLength = $(evLi).length,
            liLenArr = [];
        this.addClass('p_rel m_center');
        //初始化将内容加载，方便后面的dom操作
        function _init() {
            //计算每个li的高度存入数组
            if (evLiBorder == 0) {
                $(evLi).css('border', 0);
            } else {
                $(evLi).css('border', evLiBorder + 'px solid #d5d5d5');
            }
            _getWidth();
            $(evLi).addClass('p_abs trans xWaterfall').css('padding', (defaluts.padding ? defaluts.padding : '0') + 'px');
            _waterFall();
        }
        _init();
        //获取每行显示的个数
        function _getWidth() {
            var liPts = _self.width(), //获取父级的宽度
                liToWidth = evLiWidth + 2 * evLiPadding + 2 * evLiBorder + 10;
            //防止图片的宽度大于父级容器的宽度
            if (liToWidth > liPts) {
                liToWidth = liPts - 20;
                $(evLi).css('width', liPts - 20); //修改图片宽度
            }
            var cols = Math.floor(liPts / liToWidth); //计算每行显示数量
            return cols;
        }
        //瀑布流函数
        function _waterFall() {
            $.each(evLi, function(idx, elm) {
                liLenArr.push(($(evLi[idx]).height() + 2 * evLiPadding));
            });
            //先将第一行排列并将第一列的数据存入新定义的数组中,之后用于获取最短高度
            var firstArr = [];
            for ($i = 0; $i < _getWidth(); $i++) {
                $(evLi[$i]).css({
                    'top': '0px',
                    'left': (evLiWidth + 2 * evLiPadding + 2 * evLiBorder + 10) * $i + 'px',
                    'z-index': 1
                });
                firstArr.push(liLenArr[$i]);
            }
            //用jq会奔溃。不造为啥
            for (var i = _getWidth(); i < liLength; i++) {
                var minHeight = _getMinIndex(firstArr);
                evLi[i].style.top = (firstArr[minHeight] + 10) + 'px';
                evLi[i].style.left = (evLiWidth + 2 * evLiPadding + 2 * evLiBorder + 10) * minHeight + 'px';
                evLi[i].style.zIndex = "1";
                firstArr[minHeight] = liLenArr[i] + firstArr[minHeight] + 10;
            }
            //设置ul的宽度以及高度
            $(evLi).parents('ul').css({
                'height': _getMaxHeight(firstArr),
                'width': (evLiWidth + 2 * evLiPadding + 2 * evLiBorder + 10) * _getWidth(),
                'margin': '0 auto',
                'position': 'relative'
            });
        }
        //当浏览器窗口发生改变的时候重新调用
        var reFun;
        $(window).resize(function() {
                clearTimeout(reFun); //降低性能消耗
                reFun = setTimeout(function() {
                    _getWidth();
                    _waterFall();
                }, 100);
            })
            //数组获取最小高度的索引值
        function _getMinIndex(arr) {
            var temp = arr[0],
                idx = 0;
            for ($i = 0; $i < arr.length; $i++) {
                if (arr[$i] < temp) {
                    temp = arr[$i];
                    idx = $i;
                }
            }
            return idx;
        }
        //获取最高的高度 用于设置ul以及父级容器的高度
        function _getMaxHeight(arr) {
            var temp = arr[0];
            for ($i = 0; $i < arr.length; $i++) {
                if (arr[$i] > temp) {
                    temp = arr[$i];
                }
            }
            return temp;
        }
    };
    /**
     * dialog弹窗
     * param:
     * classname 必填 不然会出现多个弹窗样式覆盖
     * title 选填 弹窗的标题
     * width 选填 弹窗的宽度 默认400
     * height 选填 弹窗的高度 默认自动
     * btn1Text 选填 弹窗的按钮,默认为确认,空则为没有按钮
     * btn2Text 选填 弹窗的按钮,默认无
     * btn1Click 选填 按钮1对应的点击事件
     * btn2Click 选填 按钮2对应的点击事件
     * isMove 判断弹窗是否可拖拽 默认不可拖拽
     * html 必填 弹窗的内容
     * 使用方法:
     * Xiao.xAlert(options)
     * 待完成:
     * 按钮的回调事件
     */
    Xiao.xAlert = function(options) {
        var defaults = {
            classname: '',
            title: '提示',
            width: '400',
            height: '',
            btn1Text: '确认',
            btn2Text: '',
            btn1Click: '',
            btn2Click: '',
            isMove: false,
            html: '<p>这只是一个简单的弹出框</p>',
        }
        defaults = $.extend(true, defaults, options);
        if (typeof defaults.html == 'object') {
            htmlContent = defaults.html;
        } else {
            //插入弹出结构
            htmlContent = $('<div class="xAlert ' + defaults.classname + '"><div class="mask"></div><div class="xAlert_infoBox"><header class="xAlert_header">' +
                defaults.title + '<i class="icon-close"></i></header><div class="xAlert_body">' + defaults.html +
                '</div><div class="xAlert_footer">' + (defaults.btn1Text ? ('<button type="button" class="xAlert_btn isSure">' + defaults.btn1Text +
                    '</button>') : '') + (defaults.btn2Text ? ('<button type="button" class="xAlert_btn isClose">' + defaults.btn2Text + '</button>') : '') + '</div></div></div>');
            $('body').append(htmlContent);
        }
        //通过class得到dom结构
        var target = $(defaults.classname ? ('.' + defaults.classname) : '.xAlert'),
            obj = {
                mask: target.find('.mask'),
                aBox: target.find('.xAlert_infoBox'),
                isSure: target.find('.isSure'),
                isClose: target.find('.isClose'),
                close: target.find('.icon-close'),
                header: target.find('header'),
                targetSelf: target
            },
            //动画属性
            alertAnimate = {
                _in: 'animate-fadeIn',
                _out: 'animate-fadeOut',
                time: 500
            };
        //dom函数事件
        obj.mask.on('click', function(e) {
            _close(this); //点击遮罩层关闭弹窗
        });
        obj.close.on('click', function(e) {
            _close(this); //点击关闭按钮关闭弹窗
        });
        //自定义确认按钮函数
        obj.isSure.on('click', defaults.btn1Click);
        //自定义取消按钮函数
        obj.isClose.on('click', defaults.btn2Click);
        //关闭函数
        function _close(_self) {
            var temp = {
                    target: $(_self).parents('.xAlert')
                },
                length = temp.target.length;
            temp.mask = (length ? temp.target.find('.mask') : obj.mask);
            temp.alertBox = (length ? temp.target.find('.xAlert_infoBox') : obj.aBox);
            !length && (temp.target = target);
            temp.mask.fadeOut();
            temp.alertBox.addClass(alertAnimate._out).removeClass(alertAnimate._in);
            setTimeout(function() {
                temp.alertBox.removeClass(alertAnimate._out).addClass(alertAnimate._in);
                temp.target.css('display', 'none');
                temp.target.remove();
            }, alertAnimate.time);
            // $('body').css('overflow', 'inherit');
        }
        //显示
        function _show() {
            target.css('display', 'block');
            obj.mask.fadeIn();
            obj.aBox.addClass(alertAnimate._in);
            // $('body').css('overflow', 'hidden');
        }
        //初始化弹窗的宽高
        function _initSize() {
            defaults.width ? obj.aBox.width(defaults.width) : '';
            defaults.height ? obj.aBox.height(defaults.height) : '';
        }
        //始终让弹窗水平垂直居中
        function _initPosition() {
            obj.aBox.css({
                'left': '50%',
                'top': '50%',
                'margin-left': -(obj.aBox.width() / 2) + 'px',
                'margin-top': -(obj.aBox.height() / 2) + 'px'
            });
        }

        function init() {
            _show();
            _initSize();
            _initPosition();
        }
        init();
        //改变浏览器窗体大小的时候再次初始化弹窗的位置
        var reFun;
        $(window).resize(function() {
            clearTimeout(reFun);
            reFun = setTimeout(function() {
                _initPosition();
            }, 500);
        });
        //拖拽
        if (defaults.isMove) {
            obj.aBox._move('header');
            obj.header.css('cursor', 'move');
        };

        return {
            show: _show,
            close: _close
        }
    };
    /**
     * 移动的函数,有瑕疵 待完善
     * 第一次拖拽的时候 拖拽点有偏移
     */
    $.fn._move = function(options) {
        var defaults = {
            header: '',
            buff: ''
        };
        $.extend(true, defaults, options);
        typeof options === 'string' && (defaults.header = options);

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
            defaults.header && (target = $(el).find(defaults.header));
            target.on('mousedown', function(e) {
                that.temp.startX = e.clientX;
                that.temp.startY = e.clientY;

                $(window).on('mousemove', function(e) {
                    that.temp.MoveX = that.temp.startX - e.clientX;
                    that.temp.MoveY = that.temp.startY - e.clientY;
                    that.position.mx = Math.min(Xiao.wins.width - that.position.width, Math.max(0, that.position.x - that.temp.MoveX));
                    that.position.my = Math.min(Xiao.wins.height - that.position.height, Math.max(0, that.position.y - that.temp.MoveY));
                    $(el).css({
                        left: that.position.mx - parseFloat($(el).css('margin-left')),
                        top: that.position.my - parseFloat($(el).css('margin-top'))
                    });
                }).on('mouseup', function(e) {
                    $(this).off('mousemove');
                    that.position.x = that.position.mx;
                    that.position.y = that.position.my;
                });
            });
        }
    };
})(jQuery);

/**
 * 页面切换过度效果
 * 无法在目标页面加入样式或者修改样式
 * 暂缓
 * 兼容性 ie10+
 * */
(function($) {

})(jQuery);

/**
 * 轮播
 */
(function($) {

})(jQuery);

/**
 * 图片上传并显示--未完成 勿用
 * param:
 * parentClass input所在的父级标签 不包含form
 * type 追加类型,prepend和append两种方式,默认prepend
 * isMultiple 是否多图上传 默认单图上传
 * callback 回调函数
 * 
 * 问题:
 * 二次append/prepend失败
 */
(function($) {
    $.fn.xImgUpload = function(options) {
        var defaults = {
                pClassName: '',
                type: 'prepend',
                isMultiple: false,
                callback: function() {}
            },
            pType,
            that = this,
            fileParent, fileList;
        defaults = $.extend(true, defaults, options);
        pType = {
            type: defaults.type == 'prepend' ? 1 : 0
        };
        if (defaults.isMultiple) {
            that.attr('multiple', 'multiple');
        };
        //查找input:file的父级
        fileParent = defaults.pClassName ? that.parents(pClassName) : that.parent();
        //判断父级下是否有无序列表ul的存在,有就让fileList等于这个无序列表,没有就创建添加
        if (fileParent.find('ul').length) {
            fileList = fileParent.find('ul');
        } else {
            fileList = '<ul></ul>';
            if (pType.type) {
                $(fileParent).prepend(fileList);
            } else {
                $(fileParent).append(fileList);
            }
        }
        that.change(function(e) {
            var file = this.files,
                reader = new FileReader();
            //多文件选择时通过循环将文件读取
            $.each(file, function(idx, elm) {
                reader.readAsDataURL(file[idx]);
                reader.onload = function(e) {
                    var fileContent = '<li><img src=' + this.result + '></li>';
                    if (pType.type) {
                        $(fileList).prepend(fileContent);
                    } else {
                        $(fileList).append(fileContent);
                        // console.log($(fileList));
                    }
                }
            })
        });
    }
})(jQuery);

/**
 * 照片墙
 */
(function($) {

})(jQuery);

/**
 * 点击切换tab
 */
(function($) {

})(jQuery);