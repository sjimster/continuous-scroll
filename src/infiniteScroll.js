(function($){
    
    $.fn.infiniteScroll = ( options ) => {
        
        const settings = $.extend({
            apiUrl: "https://reqres.in/api/users?delay=1",
            itemsOnPage: 3,
            wrapperClass: 'wrapper',
            wrapperInnerClass: 'wrapper__inner',
            numItemsOnPage: 3,
            loaderGifUrl: "http://gifimage.net/wp-content/uploads/2017/08/loading-gif-transparent-2.gif",
            startPage: 1,
            totalPages: 0,
            minHeight: 680
            
        }, options );
        
        let items = settings.numItemsOnPage;
        let currentPage = settings.startPage;
        let totalPages = settings.totalPages;
        let gettingPosts = false;  
        
        // Init the plugin and items
        let init = () => {
            // Get the essential data from the call
            $.ajax({
                url: settings.apiUrl,
                async: false
            }).done((resp) => {
                currentPage = resp.page;
                totalPages = resp.total_pages;
                
                if( $(window).innerHeight() > settings.minHeight ){
                    getPosts(items * 2);
                    currentPage++;
                } else {
                    getPosts(items);
                }
                
            }).fail(() => {
                alert('error');
            });
            
        };
    
        let getPosts = (items) => {
            
            gettingPosts = true;
            
            if(currentPage > totalPages) {
              return;
            }
            
            $('.' + settings.wrapperInnerClass).append('<img class="loader" src="' + settings.loaderGifUrl + '" />');
            
            $.ajax({
                url: settings.apiUrl,
                method: 'GET',
                data: {
                    "page": currentPage,
                    "per_page": items,
                }
            }).then( (data) => {
                $('.loader').remove();
                // $.each(data.data, function ( index, value ) {
                //     $('.' + settings.wrapperInnerClass).append( buildHtmlString( value.first_name, value.id, value.last_name ) );
                // });
                //
                let posts = data.data;
                posts.map( (post) => {
                    $('.' + settings.wrapperInnerClass).append( buildHtmlString( post.first_name, post.id, post.last_name ) );
                });
                
                currentPage++;
                gettingPosts = false;
            });
        }
       
        let buildHtmlString = (name, id, last) => {
            return `
                <div class="block">
                    <h1>${name}</h1>
                    <p>${id}</p>
                    <p>${last}</p>
                </div> `;
        };
        
        $(window).on('scroll', () => {
            let $el = $('.' + settings.wrapperInnerClass);
            let bottom = $el.outerHeight(true) - $(window).innerHeight();
            let wScroll = $(window).scrollTop();

            if (wScroll > bottom && !gettingPosts) {
                getPosts();
            }
        });
        
        init();
    }
    
    
}(jQuery)); 





