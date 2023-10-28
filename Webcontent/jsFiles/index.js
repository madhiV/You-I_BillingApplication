$(document).ready(function() {
	$("#homepage").hide();

});
//Common utility functions.!
function loadItemsInSearchBar(itemPrefix, itemListId, appendItemCode) {
	$.ajax({
		url: "items-list",
		type: "GET",
		data: {
			itemPrefix: itemPrefix,
			appendItemCode: appendItemCode
		},
		success: function(data, textStatus, xhr) {
			if (xhr.readyState == 4) {
				if (xhr.status == 200) {
					document.querySelector(itemListId).innerHTML = xhr.responseText;
				}
			}
		}
	});
}
