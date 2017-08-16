$(function () {
    $("#dialog-form-search-products").dialog({
        autoOpen: false,
        modal: true,
    }); 

    // Open get user with username dialog
    $("#header_search_button").click(function () {
        console.log("header_search_button clicked");
        var dialog = $("#dialog-form-search-products").dialog({
        autoOpen: false,
        modal: true,
        });
        dialog.dialog("open");
        return false;
    });    

    $("#header_product_search").click(function () {
        console.log("header_product_search clicked");
        var price = $("#header_price").val();
        var category = $("#header_category").val();
        var name = $("#header_name").val();
        window.location.href = "/search_result_page.html?price="+ price + "&category="+ category + "&name="+name;
    });  
    
          
});