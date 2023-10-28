$(document).ready(function(){
	
	$("#order-master-menu-button").click(function() {
		displayHomepage();
	});

	$("#item-master-menu-button").click(function() {
		displayItemMasterSection();
	});
});
//Order master section is present in homepage... (homepage == ordermaster section)
function displayHomepage() {
	$("#login-page").hide();
	$("#homepage").show();
	$("#order-master-section").show();
	$("#item-master-section").hide();
	$("#edit-category-box").hide();
	$("#edit-item-container").hide();

	var itemPrefix = $("#order-master-search-bar").val();
	var itemList = "#order-master-search-bar-items";
	loadItemsInSearchBar(itemPrefix, itemList, true);
}