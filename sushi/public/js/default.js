var setup = {};

$(document).ready(function() {
    
    setTimeout(function() { music(); }, 1000);

    if (!CSSanim()) {
        $('.header-glass').addClass('header-glass-100');
        $('.header-mallets').addClass('header-mallets-100');
        $('.header-sushi').addClass('header-sushi-100');
    }

	$('.table').find('td:first-child').bind('mouseenter mouseleave click', function(e) {
		var el = $(this);

		if (e.type === 'click') {
			clearTimeout(setup.timeout);
			$('#picture').fadeOut(300);
			return;
		}

		if (e.type === 'mouseleave') {
			clearTimeout(setup.timeout);
			setup.timeout = setTimeout(function() {
				$('#picture').fadeOut(300);
			}, 500);
			return;
		}

		clearTimeout(setup.timeout);
		var pic = $('#picture').css('top', el.offset().top - 70);

		if (!pic.is(':visible'))
			pic.fadeIn(300);
	});

	$('.buy').bind('click', function() {

		var button = $(this);
		var parent = button.parent().parent();
		var name = parent.find('.product-name').html();
		var price = parent.find('.product-price').html();

		var el = $('input[itemid="' + name + '"]');

		if (el.length !== 0) {
			el.val(el.val().parseInt() + 1);
            clearTimeout(setup.refresh);
            setup.refresh = setTimeout(function() { refresh_cart(); }, 500);
			return;
		}

		var container = $('#container');
		var offset = button.offset();

		container.append('<div class="count" style="left:'+ (offset.left + 40) +'px;top:' + (offset.top - 5) + 'px"><input type="text" name="count" itemid="' + name + '" itemprop="' + price + '" value="1" maxlength="2" /><button name="order"></button></div>');
		rebind();
        clearTimeout(setup.refresh);
		setup.refresh = setTimeout(function() { refresh_cart(); }, 500);
	});

    $('button[name="submit"]').bind('click', function(e) {

        e.preventDefault();
        e.stopPropagation();

        var el = $('#f');

        $.post('/xhr/order/', el.serialize(), function(d) {

            if (typeof(d) === 'string')
                d = JSON.parse(d);

            var err = $('#error').hide();
            var success = $('#success').hide();

            if (d instanceof Array) {
                err.empty();
                for (var i = 0; i < d.length; i++)
                    err.append('<div>' + d[i].error + '</div>');
                err.slideDown(300);
                return;
            }

            success.slideDown(300);
            el.trigger('reset');
        });

    });

    init.facebook();

    setup.scroll = setTimeout(function() {
        $('html,body').animate({ scrollTop: 380 }, 700);
    }, 7000);

    $(window).bind('scroll', function() {
        clearTimeout(setup.scroll);
        $(window).unbind('scroll');
    });
});

function CSSanim() {
    var animation = false,
        animationstring = 'animation',
        keyframeprefix = '',
        elm = document.body,
        domPrefixes = 'Webkit Moz O ms Khtml'.split(' '),
        pfx  = '';

    if (elm.style.animationName) { animation = true; }

    if (animation === false) {
      for( var i = 0; i < domPrefixes.length; i++ ) {
        if( elm.style[ domPrefixes[i] + 'AnimationName' ] !== undefined ) {
          pfx = domPrefixes[ i ];
          animationstring = pfx + 'Animation';
          keyframeprefix = '-' + pfx.toLowerCase() + '-';
          animation = true;
          break;
        }
      }
    }
    return animation;
}

function rebind() {
    var el = $('.count input');
    var count = el.length;

	el.unbind('change').bind('change', function() {
		var count = this.value.parseInt();
		if (count <= 0) {
			$(this).parent().remove();
			rebind();
			return;
		}
        clearTimeout(setup.refresh);
        setup.refresh = setTimeout(function() { refresh_cart(); }, 500);
	});

	$('button[name="order"]').unbind('click').bind('click', function() {
		$('html,body').animate({ scrollTop: $('#order').offset().top }, 500);
	});

    $('#order').toggle(count > 0);
}

function refresh_cart() {

	var order = [];
    var sumarize = 0;
	var l = $('#order-items');
    var delivery = 1.5;

    l.find('tr').remove();

	$('input[name="count"]').each(function() {
		var el = $(this);
		var name = el.attr('itemid');
		var price = parseFloat(el.attr('itemprop'));

		if (isNaN(price))
			return;

		var product = { Name: name, Price: price, Count: el.val().parseInt() };

        order.push(product);

        var sum = product.Price * product.Count;
        sumarize += sum;

		l.append('<tr><td>' + name + '</td><td class="right">' + product.Count + 'x</td><td class="right b">' + (sum).format('### ###.##') + ' &euro;</td></tr>');
	});

    $('#sum-delivery').html(delivery.format('### ###.##') + ' &euro;');

    sumarize += delivery;
    order.push({ Name: 'Delivery', Price: delivery, Count: 1 });

    $('#sum').html(sumarize.format('### ###.##') + ' &euro;');
    $('#Products').val($.toJSON(order));

}

String.prototype.parseInt = function (def) {
    var num = 0;
    var str = this.toString();

    if (str.substring(0, 1) === '0')
        num = parseInt(str.replace(/\s/g, '').substring(1));
    else
        num = parseInt(str.replace(/\s/g, ''));

    if (isNaN(num))
        return def || 0;

    return num;
};

Number.prototype.format = function (format) {

    var index = 0;
    var num = this.toString();
    var beg = 0;
    var end = 0;
    var output = '';

    if (typeof (format) === 'string') {

        var d = false;

        for (var i = 0; i < format.length; i++) {
            var c = format.substring(i, i + 1);
            if (c === '#') {
                if (d)
                    end++;
                else
                    beg++;
            }

            if (c === '.')
                d = true;
        }

        var strBeg = num;
        var strEnd = '';

        index = num.indexOf('.');

        if (index !== -1) {
            strBeg = num.substring(0, index);
            strEnd = num.substring(index + 1);
        }

        if (strBeg.length > beg) {
            var max = strBeg.length - beg;
            var tmp = '';
            for (var i = 0; i < max; i++)
                tmp += '#';

            format = tmp + format;
        }

        if (strBeg.length < beg)
            strBeg = strBeg.padLeft(beg, ' ');

        if (strEnd.length < end)
            strEnd = strEnd.padRight(end, '0');

        if (strEnd.length > end)
            strEnd = strEnd.substring(0, end);

        d = false;
        index = 0;

        var skip = true;

        for (var i = 0; i < format.length; i++) {

            var c = format.substring(i, i + 1);

            if (c !== '#') {

                if (skip)
                    continue;

                if (c === '.') {
                    d = true;
                    index = 0;
                }

                output += c;
                continue;
            }

            var value = d ? strEnd.substring(index, index + 1) : strBeg.substring(index, index + 1);

            if (skip)
                skip = [',', ' '].indexOf(value) !== -1;

            if (!skip)
                output += value;

            index++;
        }

        return output;
    }

    output = '### ### ###';
    var beg = num.indexOf('.');
    var max = format || 0;

    if (max === 0 && num != -1)
        max = num.length - (beg + 1);

    if (max > 0) {
        output += '.';
        for (var i = 0; i < max; i++)
            output += '#';
    }

    return this.format(output);
};

function music() {
	if (!window.Audio)
		return;

	var audio = new Audio();
	audio.src = '/music/music' + (audio.canPlayType('audio/ogg') === '' ? '.mp3' : '.ogg');
	audio.volume = 0.5;
	audio.play();
}

String.prototype.padLeft = function (max, c) {
    var self = this.toString();
    return Array(Math.max(0, max - self.length + 1)).join(c || '0') + self;
};

String.prototype.padRight = function (max, c) {
    var self = this.toString();
    return self + Array(Math.max(0, max - self.length + 1)).join(c || '0');
};

(function ($) {
    $.toJSON = function (o) {
        if (typeof (JSON) == 'object' && JSON.stringify) return JSON.stringify(o);
        var type = typeof (o);
        if (o === null) return "null";
        if (type == "undefined") return undefined;
        if (type == "number" || type == "boolean") return o + "";
        if (type == "string") return $.quoteString(o);
        if (type == 'object') {
            if (typeof o.toJSON == "function") return $.toJSON(o.toJSON());
            if (o.constructor === Date) {
                var month = o.getUTCMonth() + 1;
                if (month < 10) month = '0' + month;
                var day = o.getUTCDate();
                if (day < 10) day = '0' + day;
                var year = o.getUTCFullYear();
                var hours = o.getUTCHours();
                if (hours < 10) hours = '0' + hours;
                var minutes = o.getUTCMinutes();
                if (minutes < 10) minutes = '0' + minutes;
                var seconds = o.getUTCSeconds();
                if (seconds < 10) seconds = '0' + seconds;
                var milli = o.getUTCMilliseconds();
                if (milli < 100) milli = '0' + milli;
                if (milli < 10) milli = '0' + milli;
                return '"' + year + '-' + month + '-' + day + 'T' + hours + ':' + minutes + ':' + seconds + '.' + milli + 'Z"';
            }
            if (o.constructor === Array) {

                var l = o.length;

                var ret = [];
                for (var i = 0; i < l; i++)

                    ret.push($.toJSON(o[i]) || "null");
                return "[" + ret.join(",") + "]";

            }

            var pairs = [];
            for (var k in o) {

                var name;
                var type = typeof k;
                if (type == "number")

                    name = '"' + k + '"';
                else if (type == "string")

                    name = $.quoteString(k);
                else continue;
                if (typeof o[k] == "function")

                    continue;
                var val = $.toJSON(o[k]);
                pairs.push(name + ":" + val);

            }

            return "{" + pairs.join(", ") + "}";

        }

    };
    $.evalJSON = function (src) {

        if (typeof (JSON) == 'object' && JSON.parse)
            return JSON.parse(src);

        return eval("(" + src + ")");

    };
    $.secureEvalJSON = function (src) {

        if (typeof (JSON) == 'object' && JSON.parse)

            return JSON.parse(src);
        var filtered = src;
        filtered = filtered.replace(/\\["\\\/bfnrtu]/g, '@');
        filtered = filtered.replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']');
        filtered = filtered.replace(/(?:^|:|,)(?:\s*\[)+/g, '');
        if (/^[\],:{}\s]*$/.test(filtered))
            return eval("(" + src + ")");
        else throw new SyntaxError("Error parsing JSON, source is not valid.");

    };
    $.quoteString = function (string) {

        if (string.match(_escapeable)) {

            return '"' + string.replace(_escapeable, function (a) {
                var c = _meta[a];
                if (typeof c === 'string') return c;
                c = a.charCodeAt();
                return '\\u00' + Math.floor(c / 16)
                    .toString(16) + (c % 16)
                    .toString(16);
            }) + '"';

        }

        return '"' + string + '"';

    };
    var _escapeable = /["\\\x00-\x1f\x7f-\x9f]/g;
    var _meta = {
        '\b': '\\b',
        '\t': '\\t',
        '\n': '\\n',
        '\f': '\\f',
        '\r': '\\r',
        '"': '\\"',
        '\\': '\\\\'
    };

})(jQuery);

var init = {
    facebook: function (lang, appId) {
        lang = lang || 'en_US';
        appId = appId || '346088855483095';
        (function (d, s, id) {
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) return;
            js = d.createElement(s); js.id = id;
            js.src = '//connect.facebook.net/' + lang + '/all.js#xfbml=1&appId=' + appId;
            fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));
    },
    google: function () {
        (function () {
            var po = document.createElement('script'); po.type = 'text/javascript'; po.async = true;
            po.src = 'https://apis.google.com/js/plusone.js';
            var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(po, s);
        })();
    },
    twitter: function () {
        (function () {
            var po = document.createElement('script'); po.type = 'text/javascript'; po.async = true;
            po.src = 'http://platform.twitter.com/widgets.js';
            var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(po, s);
        })();
    }
};
