$(document).ready(function() {
	$("#homepage").hide();
	//Direct login start
	displayHomepage();
	$("login-page").hide();
	//Direct login end
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

	$("#order-master-menu-button").click(function() {
		displayHomepage();
	});

	$("#item-master-menu-button").click(function() {
		displayItemMasterSection();
	});

	$("#item-master-add-item-button").click(function() {
		displayAddItemSection();
	});

	$("#item-master-add-category-button").click(function() {
		displayAddCategorySection();
	});


	$(".item-master-close-option").click(function() {
		hideAllItemMasterSections();
		resetItemForm();
		resetCategoryForm();
	});

	$("#add-item-button").click(function() {
		addItem();
	});


	$("#add-category-button").click(function() {
		addCategory();
	});
	
	
	$("#edit-item-save-button").click(function(){
		editItem();
	});
	
	$("#edit-category-save-button").click(function(){
		editCategory();
	});
	
	$("#edit-category-delete-button").click(function(){
		deleteCategory();
	});
	
	$("#edit-item-delete-button").click(function(){
		deleteItem();
	});

	$("#order-master-search-bar").on("input", function() {
		var itemSearchBarText = $("#order-master-search-bar").val();
		var itemList = "#order-master-search-bar-items";
		loadItemsInSearchBar(itemSearchBarText, itemList, true);
		if (itemSearchBarText.slice(-1) === '\u2063') {
			var itemName = itemSearchBarText.slice(0, -1).split("    ")[0];
			addItemToBillSection(itemName);
			$("#order-master-search-bar").val("");
			loadItemsInSearchBar("", itemList, true);
		}
	});

	$("#item-master-item-search-bar").on("input", function(){
		var itemPrefix = $("#item-master-item-search-bar").val();
		var itemList = "#search-bar-items";
		loadItemsInSearchBar(itemPrefix, itemList, false);
		var itemSearchBarText = $("#item-master-item-search-bar").val();
		if (itemSearchBarText.slice(-1) === '\u2063') {
			var itemName = itemSearchBarText.slice(0, -1);
			loadCategoryList("#edit-item-category-list", false);
			displayEditItemMenu(itemName);
			$("#item-master-item-search-bar").val("");
		}
	});
	
	$("#category-search-bar").on("input", function(){
		var categoryPrefix = $("#category-search-bar").val();
		loadCategoryList("#search-bar-categories", true, categoryPrefix);
		var categorySearchBarText = $("#category-search-bar").val();
		if (categorySearchBarText.slice(-1) === '\u2063') {
			var categoryName = categorySearchBarText.slice(0, -1);
			displayEditCategoryMenu(categoryName);
			$("#category-search-bar").val(categoryName);
		}
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
	function displayItemMasterSection() {
		$("#homepage").show();
		$("#order-master-section").hide();
		$("#item-master-section").show();
		$("#add-item-container").hide();
		$("#edit-category-box").hide();
		$("#add-category-box").hide();
		$("#edit-item-container").hide();
		
		var categoryPrefix = $("#category-search-bar").val();
		loadCategoryList("#search-bar-categories", true, categoryPrefix);
		var itemPrefix = $("#item-master-item-search-bar").val();
		var itemList = "#search-bar-items";
		loadItemsInSearchBar(itemPrefix, itemList, false);
	}

	function displayAddItemSection() {
		$("#add-item-instructions").innerHTML = "";
		$("#edit-category-box").hide();
		$("#edit-item-container").hide();
		$("#add-category-box").hide();
		$("#add-item-container").show();
		//Load category dropdown...
		$.get(
			"categories-list",
			{
				categoryPrefix: "",
				appendInvisibleChar: false
			},
			function(data, textStatus, xhr) {
				if (xhr.readyState == 4) {
					if (xhr.status == 200) {
						document.querySelector("#add-item-category-list").innerHTML = xhr.responseText;
					}
				}
			});
	}
	function displayAddCategorySection() {
		$("#add-category-instructions").innerHTML = "";
		$("#add-item-container").hide();
		$("#edit-category-box").hide();
		$("#edit-item-container").hide();
		$("#add-category-box").show();
	}
	function hideAllItemMasterSections() {
		$("#add-category-box").hide();
		$("#add-item-container").hide();
		$("#edit-category-box").hide();
		$("#edit-item-container").hide();
	}
	

	function addCategory() {
		$("#add-category-instructions").innerHTML = "";
		var categoryName = $("#add-category-name").val();
		var categoryCode = $("#add-category-code").val();
		$.post(
			"add-category",
			{
				categoryName: categoryName,
				categoryCode: categoryCode
			},
			function(data, textStatus, xhr) {
				if (xhr.readyState == 4 && xhr.status == 200) {
					document.querySelector("#add-category-instructions").innerHTML = "Category add success!";
				}
				else {
					document.querySelector("#add-category-instructions").innerHTML = "Category add failed";
				}
			}).fail(function() {
				document.querySelector("#add-category-instructions").innerHTML = "Category add failed";
			});
	}
	
	function editCategory() {
		$("#edit-category-instructions").innerHTML = "";
		var categoryName = $("#edit-category-name").val();
		var categoryCode = $("#edit-category-code").val();
		var categoryOldName = $("#edit-category-old-name").val();
		
		$.post(
			"edit-category",
			{
				categoryName: categoryName,
				categoryCode: categoryCode,
				categoryOldName: categoryOldName
			},
			function(data, textStatus, xhr) {
				if (xhr.readyState == 4 && xhr.status == 200) {
					document.querySelector("#edit-category-instructions").innerHTML = "Category edit success!";
				}
				else {
					document.querySelector("#edit-category-instructions").innerHTML = "Category edit failed";
				}
			}).fail(function() {
				document.querySelector("#edit-category-instructions").innerHTML = "Category edit failed";
			});
	}
	
	function deleteCategory() {
		$("#edit-category-instructions").innerHTML = "";
		var categoryName = $("#edit-category-old-name").val();
		
		//TODO: Are you sure you want to delete the category instruction!
		
		$.post(
			"delete-category",
			{
				categoryName: categoryName
			},
			function(data, textStatus, xhr) {
				if (xhr.readyState == 4 && xhr.status == 200) {
					resetCategoryForm();
					document.querySelector("#edit-category-instructions").innerHTML = "Category delete success!";
				}
				else {
					document.querySelector("#edit-category-instructions").innerHTML = "Category delete failed";
				}
			}).fail(function() {
				document.querySelector("#edit-category-instructions").innerHTML = "Category delete failed";
			});
	}

	function resetCategoryForm() {
		$("#add-category-name").val("");
		$("#add-category-code").val("");
		$("#edit-category-name").val("");
		$("#edit-category-code").val("");
		document.querySelector("#add-category-instructions").innerHTML = "";
	}
	function resetItemForm() {
		document.querySelector("#add-item-instructions").innerHTML = "";
		$("#add-item-name").val("");
		$("#add-item-code").val("");
	}

	function addItem() {
		$("#add-item-instructions").innerHTML = "";
		var itemName = $("#add-item-name").val();
		var itemCategory = $("#add-item-category-list").val();
		var itemCode = $("#add-item-code").val();
		var itemAvailability = $("#add-item-availability").val();
		var itemPrice = $("#add-item-price").val();
		alert(itemPrice);

		$.post(
			"add-item",
			{
				itemName: itemName,
				itemCategory: itemCategory,
				itemCode: itemCode,
				itemAvailability: itemAvailability, 
				itemPrice: itemPrice
			},
			function(data, textStatus, xhr) {
				if (xhr.readyState == 4 && xhr.status == 200) {
					document.querySelector("#add-item-instructions").innerHTML = "Item added success!";
				}
			}).fail(function() {
				document.querySelector("#add-item-instructions").innerHTML = "Item add failed!";
			});
	}
	
	function editItem() {
		$("#edit-item-instructions").innerHTML = "";
		var itemName = $("#edit-item-name").val();
		var itemCategory = $("#edit-item-category-list").val();
		var itemCode = $("#edit-item-code").val();
		var itemAvailability = $("#edit-item-availability").val();
		var oldItemName = $("#edit-selected-item-name").val();
		var itemPrice = $("#edit-item-price").val();

		$.post(
			"edit-item",
			{
				itemName: itemName,
				itemCategory: itemCategory,
				itemCode: itemCode,
				itemAvailability: itemAvailability,
				oldItemName: oldItemName,
				itemPrice: itemPrice
			},
			function(data, textStatus, xhr) {
				if (xhr.readyState == 4 && xhr.status == 200) {
					document.querySelector("#edit-item-instructions").innerHTML = "Item edit success!";
				}
			}).fail(function() {
				document.querySelector("#edit-item-instructions").innerHTML = "Item edit failed!";
			});
	}
	
	function deleteItem() {
		$("#edit-item-instructions").innerHTML = "";
		var itemName = $("#edit-selected-item-name").val();
		
		//TODO: Are you sure you want to delete the category instruction!
		
		$.post(
			"delete-item",
			{
				itemName: itemName
			},
			function(data, textStatus, xhr) {
				if (xhr.readyState == 4 && xhr.status == 200) {
					resetItemForm();
					document.querySelector("#edit-item-instructions").innerHTML = "Item delete success!";
				}
				else {
					document.querySelector("#edit-item-instructions").innerHTML = "Item delete failed";
				}
			}).fail(function() {
				document.querySelector("#edit-item-instructions").innerHTML = "Item delete failed";
			});
	}

	function loadCategoryList(categoryListElement, appendInvisibleChar, categoryPrefix) {
		//&#8291 is invisible char added which helps in checking input completion. -> appendInvisibleChar
		$.ajax({
			url: "categories-list",
			type: "GET",
			data: {
				categoryPrefix: categoryPrefix,
				appendInvisibleChar: appendInvisibleChar
			},
			success: function(data, textStatus, xhr) {
				if (xhr.readyState == 4) {
					if (xhr.status == 200) {
						document.querySelector(categoryListElement).innerHTML = xhr.responseText;
					}
				}
			}
		});
	}

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
	
	function displayEditItemMenu(itemName){
		$("#edit-item-instructions").innerHTML = "";
		$("#add-item-container").hide();
		$("#add-category-box").hide();
		$("#edit-category-box").hide();
		$("#edit-item-container").show();
		$("#edit-selected-item-name").val(itemName);
		
		//TODO: Handle unspecified category !
		$.ajax({
			url: "item-details",
			type: "GET",
			data: {
				itemName: itemName
			},
			success: function(data, textStatus, xhr) {
				if (xhr.readyState == 4) {
					if (xhr.status == 200) {
						populateEditItemForm(xhr.responseText);
					}
				}
			}
		});
	}

	function displayEditCategoryMenu(categoryName){
		$("#edit-category-instructions").innerHTML = "";
		$("#add-item-container").hide();
		$("#add-category-box").hide();
		$("#edit-item-container").hide();
		$("#edit-category-box").show();
		$("#edit-category-old-name").val(categoryName);
		
		$.ajax({
			url: "category-details",
			type: "GET",
			data: {
				categoryName: categoryName
			},
			success: function(data, textStatus, xhr) {
				if (xhr.readyState == 4) {
					if (xhr.status == 200) {
						populateEditCategoryForm(xhr.responseText);
					}
				}
			}
		});
	}
	
	function populateEditItemForm(itemJsonData){
		var editFormElements = JSON.parse(itemJsonData);
		
		$("#edit-item-name").val(editFormElements.itemName);
		$("#edit-item-category-list").val(editFormElements.categoryName);
		$("#edit-item-code").val(editFormElements.itemCode);
		$("#edit-item-availability").val(editFormElements.itemAvailability.toString());
		$("#edit-item-price").val(editFormElements.itemPrice);
		$("#edit-item-instructions").innerHTML = "";
	}
	
	function populateEditCategoryForm(categoryData){
		var editCategoryElements = JSON.parse(categoryData);
		$("#edit-category-name").val(editCategoryElements.categoryName);
		$("#edit-category-code").val(editCategoryElements.categoryCode);
		$("#edit-category-instructions").innerHTML = "";
	}
	
	function addItemToBillSection(itemName){
		$.ajax({
			url: "item-details",
			type: "GET",
			data: {
				itemName: itemName
			},
			success: function(data, textStatus, xhr) {
				if (xhr.readyState == 4) {
					if (xhr.status == 200) {
						addItemtoOrderBillSection(xhr.responseText);
					}
				}
			}
		});
	}
	
	function addItemtoOrderBillSection(itemJsonData){
		var itemData = JSON.parse(itemJsonData);
		var orderTable = document.getElementById("order-master-billing-section-table");
		if(itemAddedAlready(orderTable, itemData.itemName)){
			//Item Already Added instruction.!
			return;	
		}
		//Add new row
		var newRow = orderTable.insertRow();
		newRow.insertCell().innerHTML = orderTable.rows.length - 1;
		newRow.insertCell().innerHTML = itemData.itemName;
		newRow.insertCell().innerHTML = itemData.categoryName;
		newRow.insertCell().innerHTML = 1
		newRow.insertCell().innerHTML = itemData.itemPrice;
		newRow.insertCell().innerHTML = "false";
	}
	
	function itemAddedAlready(orderTable, itemName){
		var itemNameColumn = 1;
		for(var i = 1; i < orderTable.rows.length; i++){
			//Item is present in 2nd column
			if(orderTable.rows[i].cells[itemNameColumn].innerHTML === itemName){
				return true;
			}
		}
		return false;
	}
	
	function createTableCell(content){
		return "<td>"+content+"</td>";
	}
	
});