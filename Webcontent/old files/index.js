$(document).ready(function() {
	$("#homepage").hide();
	$("#order-page").hide();
	$("#item-master").hide();
	$("#employee-master").hide();
	$("#report-view").hide();


	$("#login-submit-button").click(function() {
		var userName = $("#username").val();
		var password = $("#password-input-field").val();
		$.post(
			"validateUser",
			{
				userName: userName,
				password: password
			},
			function(data, textStatus, xhr) {
				if (xhr.readyState == 4 && xhr.status == 200) {
					displayHomepage();
				}
				else {
					$("#instruction-section").innerHTML = "Plese check the username";
				}
			});
	});

	$("#order-master-button").click(function() {
		$("#order-page").show();
	});

	function displayHomepage() {
		$("#login-page").hide();
		$("#homepage").show();
	}
});
function displayLoginPage() {
	$("#homepage").hide();
	$("#order-page").hide();
	$("#item-master").hide();
	$("#employee-master").hide();
	$("#report-view").hide();
	$("#login-page").show();
}
function displayOrderPage() {
	$("#homepage").show();
	$("#order-page").show();
	$("#item-master").hide();
	$("#employee-master").hide();
	$("#report-view").hide();
	$("#login-page").hide();
}