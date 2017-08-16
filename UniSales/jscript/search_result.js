$(function () {
    $("#header").load("header.html");
    $("#footer").load("footer.html");

    var length = window.location.search.length;
    var query = {};
    if (length)
    {
        console.log("Given input query");
        var price = getUrlVars()["price"];
        var category = getUrlVars()["category"];
        var name = getUrlVars()["name"];
        if (price != "")
        {
            query.price = price;
        }
        if (category != "")
        {
            query.category = category;
        }
        if (name != "")
        {
            query.productname = name;
        }         
        console.log(query);
        searchProduct(query);
    }
    searchProduct(query);
    // Update the user
    $("#search_result_page_search_button").click(function () {
        console.log("Called search_result_page_search_button");
        var query = {};
        if ($("#search_result_page_price").val() != "")
        {
            query.price = $("#search_result_page_price").val();
        }
        if ($("#search_result_page_category").val() != "")
        {
            query.category = $("#search_result_page_category").val();
        }
        if ($("#search_result_page_product_name").val() != "")
        {
            query.productname = $("#search_result_page_product_name").val();
        }        
        $("#search_result_page_price").val("");
        $("#search_result_page_category").val("");
        $("#search_result_page_product_name").val("");
        searchProduct(query);
    });  

    $(".search_box").on('click', '.search_result', function ()
    {
        console.log("A product is clicked");
        product_id = this.id;
        if (product_id)
        {
            window.location.href='products/' + product_id;
        }
        else{
            alert("Sorry this item is unclickable");
        }
    });
    function searchProduct(query) {
        $.ajax({
            url: "/products",
            type: "POST",
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(query),
            success: function (response) {
                console.log("Successfully search products")
                console.log(JSON.stringify(response));
                $('#search_box').empty();
                addProducts(response);
            },
            error: function (xhr, status, error) {
                alert(xhr.responseText);
            }
        });
    }

    function addProducts(response)
    {
        $.each(response, function (index, value) {
            console.log(value);
            var div = '<div class="search_result"' + " " + "id=" + value._id + " " + ">";
            div += '<img src="img/fake_item.png" alt="item phto" />';
            div += '<h4> Name: ' + value.productname +'</h4>';
            div += '<h4> Category: ' + value.category +'</h4>';
            div += '<h4> Price: $' + value.price +'</h4>';
            div += '</div>';
            console.log(div);
            $("#search_box").append(div);
        });        
    } 
    
    function getUrlVars()
    {
        var vars = [], hash;
        var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
        for(var i = 0; i < hashes.length; i++)
        {
            hash = hashes[i].split('=');
            vars.push(hash[0]);
            vars[hash[0]] = hash[1];
        }
        return vars;
    }             
});