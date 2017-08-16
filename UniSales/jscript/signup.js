$(document).ready(function(){

	$("#create_account_button").click(function() {
		var email = $("#email_address").val();
		var firstname = $("#first_name").val();
		var lastname = $("#last_name").val();
		var password = $("#password").val();
		var confirm_password = $("#confirm_password").val();
		var email_regex = new RegExp('^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+.[A-Za-z]{2,4}$');
		if (email.length < 1 || firstname.length < 1 || lastname.length < 1 || password.length < 1 || confirm_password < 1){
			$("#status").empty();
			$("#status").append("Unable to create account: all fields must be filled in.")
		}
		else if (!email_regex.test(email)){
			$("#status").empty();
			$("#status").append("Invalid email format.");
		}
		else if (password != confirm_password){
			$("#status").empty();
			$("#status").append("Passwords do not match.");
		}
		else {
			$.ajax({
				url: "/user",
				type: "POST",
				dataType: "json",
				contentType: "application/json; charset=utf-8",
				data: JSON.stringify( { "email":email, "firstname":firstname, "lastname":lastname, "password":password} ),
				success: function(res) {
					console.log("Successfully created user");
					console.log(JSON.stringify(res));
					setTimeout(function () { window.location.href = "search_result_page.html" }, 3000);
					$("#status").empty();
					$("#status").append("Account created. <br>Log in to start using your account.<br>Redirecting to main page ...");
				},
				error: function(res) {
					$("#status").empty();
					$("#status").append("Unable to create account");
				}
			})

		}
	});
});
