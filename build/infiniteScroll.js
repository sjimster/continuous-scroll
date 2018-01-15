'use strict';

(function ($) {

    $.fn.infiniteScroll = function (options) {

        var settings = $.extend({
            apiUrl: "https://reqres.in/api/users?delay=1",
            itemsOnPage: 3,
            wrapperClass: 'wrapper',
            wrapperInnerClass: 'wrapper__inner',
            numItemsOnPage: 3,
            loaderGifUrl: "http://gifimage.net/wp-content/uploads/2017/08/loading-gif-transparent-2.gif",
            startPage: 1,
            totalPages: 0,
            minHeight: 680

        }, options);

        var items = settings.numItemsOnPage;
        var currentPage = settings.startPage;
        var totalPages = settings.totalPages;
        var gettingPosts = false;

        // Init the plugin and items
        var init = function init() {
            // Get the essential data from the call
            $.ajax({
                url: settings.apiUrl,
                async: false
            }).done(function (resp) {
                currentPage = resp.page;
                totalPages = resp.total_pages;

                if ($(window).innerHeight() > settings.minHeight) {
                    getPosts(items * 2);
                    currentPage++;
                } else {
                    getPosts(items);
                }
            }).fail(function () {
                alert('error');
            });
        };

        var getPosts = function getPosts(items) {

            gettingPosts = true;

            if (currentPage > totalPages) {
                return;
            }

            $('.' + settings.wrapperInnerClass).append('<img class="loader" src="' + settings.loaderGifUrl + '" />');

            $.ajax({
                url: settings.apiUrl,
                method: 'GET',
                data: {
                    "page": currentPage,
                    "per_page": items
                }
            }).then(function (data) {
                $('.loader').remove();
                // $.each(data.data, function ( index, value ) {
                //     $('.' + settings.wrapperInnerClass).append( buildHtmlString( value.first_name, value.id, value.last_name ) );
                // });
                //
                var posts = data.data;
                posts.map(function (post) {
                    $('.' + settings.wrapperInnerClass).append(buildHtmlString(post.first_name, post.id, post.last_name));
                });

                currentPage++;
                gettingPosts = false;
            });
        };

        var buildHtmlString = function buildHtmlString(name, id, last) {
            return '\n                <div class="block">\n                    <h1>' + name + '</h1>\n                    <p>' + id + '</p>\n                    <p>' + last + '</p>\n                </div> ';
        };

        $(window).on('scroll', function () {
            var $el = $('.' + settings.wrapperInnerClass);
            var bottom = $el.outerHeight(true) - $(window).innerHeight();
            var wScroll = $(window).scrollTop();

            if (wScroll > bottom && !gettingPosts) {
                getPosts();
            }
        });

        init();
    };
})(jQuery);