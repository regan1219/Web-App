$(function () {
    $("#header").load("/header.html");
    $("#footer").load("/footer.html");

    // Post Comments
    // Main picture upload 
    $('#post_comment_button').on('click', function () {
        console.log("post_comment_button clicked");
        title = $('.comment_title').val();
        detail = $('.comment_detail').val();
        $('.comment_title').val('');
        $('.comment_detail').val('');

        if (title != "" && detail != "") {
            var body = {};
            body.title = title;
            body.message = detail;
            var userid = window.location.href.substring(window.location.href.lastIndexOf('/') + 1);
            var user_email = $('#user_email').html();
            if (user_email)
            {
                body.email = user_email;
            }
            else
            {
                body.userid = userid; 
            }
            console.log(body);
            $.ajax({
                url: "/usercomments",
                type: "POST",
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                data: JSON.stringify(body),
                success: function (response) {
                    console.log(JSON.stringify(response));
                },
                error: function (xhr, status, error) {
                    alert(xhr.responseText);
                }
            });            
        }
        else
        {
            console.log("User didn't enter enough information");
            alert("Please make sure you entered something in both title and message box");
        }
    });

    $('#direct_to_ad_creation_button').on('click', function () {
        console.log("direct_to_ad_creation_button clicked");
        window.location.href='/ad_creation.html';
    }); 

    $(".search_selection").on('click', '.search_result', function ()
    {
        console.log("A product is clicked");
        product_id = this.id;
        if (product_id)
        {
            window.location.href='/products/' + product_id;
        }
        else{
            alert("Sorry this item is unclickable");
        }
    });       
});