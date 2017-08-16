$(function () {
    $("#header").load("header.html");
    $("#footer").load("footer.html");

    // Post Comments
    // Main picture upload 

    //user products

      $("#getall").click(function() {
        showAll();
    });
     
        $("#post-product").click(function() {
        postProduct();
    });

  
      $("#put-product").click(function() {
        putProduct();
    });

       $("#delete-product").click(function() {
        deleteProduct();
    });

      $("#clear").click(function() {
        let parent = $('#postbox');
        parent.empty();
    });

      $("#clear2").click(function() {
        let parent = $('#putbox');
        parent.empty();
    });
    
      $("#clear3").click(function() {
        let parent = $('#deletebox');
        parent.empty();
    });

    //user products helper functions

    function postProduct() {
        var productname = $("#product-name").val();
	var price = $("#price").val();
        var category = $("#category").val();
        var description = $("#description").val();
    
        // Clear the text field
        $("#product-name").val("");
        $("#category").val("");
        $("#price").val("");
        $("#description").val("");

        $.ajax({
            url: "/user/products",
            type: "POST",
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify( { "productname": productname, "price": price, "category": category, "description": description } ),
            success: function(response) {
               let parent = $('#postbox');
                parent.empty();
               addProducts(response, parent);
            }
        });
    }

     

     function putProduct() {
        var pid = $("#pid").val();
        var productname = $("#product-name2").val();
	var price = $("#price2").val();
        var category = $("#category2").val();
        var description = $("#description2").val();
    
        // Clear the text field
	$("#pid").val("");
        $("#product-name2").val("");
        $("#category2").val("");
        $("#price2").val("");
        $("#description2").val("");

        
        $.ajax({
            url: "/user/products",
            type: "PUT",
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify( { "productname": productname, "price": price, "category": category, "description": description, "pid": pid} ),
            success: function(response) {
               let parent = $('#putbox');
                parent.empty();
                addProducts(response, parent);
            }
        });
    }


      function deleteProduct() {
    
        var pid = $("#pid2").val();
        // Clear the text field
        $("#pid2").val("");
        
        $.ajax({
            url: "/user/products",
            type: "DELETE",
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify( {"pid": pid} ),
            success: function(response) {
                let parent = $('#deletebox');
                parent.empty();
                var par = '<p>' + response + '</p>'
                parent.append(par);
            }
        });
    }

          function showAll() {
           
          $('#postbox').empty();
          $.ajax({
            url: "/user/products/all",
            type: "GET",
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify( {} ),
            success: function(response) {
                let parent = $('#postbox');
                parent.empty();
                addProducts(response, parent);
          		      
            }
        });
   
    
    }


    function addProducts(response, box)
    {
        $.each(response, function (index, value) {
            console.log(value);
            var div = '<div class="result">'
            div += '<h4> Pid: ' + value._id +'</h4>'
            div += '<h4> Name: ' + value.productname +'</h4>'
	    div += '<h4> Category: ' + value.category +'</h4>'
            div += '<h4> Description: ' + value.description +'</h4>'
            div += '<h4> Price: ' + value.price +'</h4>'
            div += '</div>';
            console.log(div);
            box.append(div);
        });        
    } 



});
