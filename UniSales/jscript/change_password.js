$(function () {
    $("#header").load("loginheader.html");
    $("#footer").load("footer.html");
     
     $("#put-user").click(function() {
        putUser();
    });

      function putUser() {
        var password = $("#np").val();
        var confirmation = $("#c").val();

    
        // Clear the text field
	$("#np").val("");
        $("#c").val("");
        if(password === confirmation){
        $.ajax({
            url: "/user",
            type: "PUT",
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify( { "password": password} ),
            success: function(response) {
               let parent = $('#resultbox');
                parent.empty();
		var par = '<p>' + response + '</p>'
                parent.append(par);
               
            }
        });
	
	}

        else{
           let parent = $('#resultbox');
                parent.empty();
                parent.append("<p>Two passwords do not match</p>");
	}

    }

});
