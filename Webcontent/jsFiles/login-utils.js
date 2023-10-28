$(document).ready(function(){
	//Directly login to homepage code starts
	displayHomepage();
	$("login-page").hide();
	//direct login to homepage code ends
	
	$("#login-page-submit-button").click(function() {
		var userName = $("#username").val();
		var password = $("#password").val();
		$.post(
			"validate-user",
			{
				userName: userName,
				password: password
			},
			function(data, textStatus, xhr) {
				if (xhr.readyState == 4 && xhr.status == 200) {
					displayHomepage();
				}
				else {

				}
			});
	});
});