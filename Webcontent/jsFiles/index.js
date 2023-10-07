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
	

	
	$("#item-search-bar").on("input", function(){
		loadItemsInSearchBar();
		var itemSearchBarText = $("#item-search-bar").val();
		if (itemSearchBarText.slice(-1) === '\u2063') {
			var itemName = itemSearchBarText.slice(0, -1);
			loadCategoryList("#edit-item-category-list");
			displayEditItemMenu(itemName);
			$("#item-search-bar").val(itemName);
		}
	});
	
	$("#category-search-bar").on("input", function(){
		var categoryPrefix = $("#category-search-bar").val();
		loadCategoryList("#search-bar-categories", categoryPrefix);
		var categorySearchBarText = $("#category-search-bar").val();
		if (categorySearchBarText.slice(-1) === '\u2063') {
			var categoryName = categorySearchBarText.slice(0, -1);
			displayEditCategoryMenu(categoryName);
			$("#category-search-bar").val(categoryName);
		}
	});

	function displayHomepage() {
		$("#login-page").hide();
		$("#homepage").show();
		$("#order-master-section").show();
		$("#item-master-section").hide();
		$("#edit-category-box").hide();
		$("#edit-item-container").hide();
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
		loadCategoryList("#search-bar-categories", categoryPrefix);
		loadItemsInSearchBar();
	}

	function displayAddItemSection() {
		$("#edit-category-box").hide();
		$("#edit-item-container").hide();
		$("#add-category-box").hide();
		$("#add-item-container").show();
		//Load category dropdown...
		$.get(
			"categories-list",
			function(data, textStatus, xhr) {
				if (xhr.readyState == 4) {
					if (xhr.status == 200) {
						document.querySelector("#add-item-category-list").innerHTML = xhr.responseText;
					}
				}
			});
	}
	function displayAddCategorySection() {
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
					document.querySelector("#add-category-instructions").innerHTML = "Category added successfully!";
				}
				else {
					document.querySelector("#add-category-instructions").innerHTML = "Problem while adding category";
				}
			}).fail(function() {
				document.querySelector("#add-category-instructions").innerHTML = "Problem while adding category";
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
		$("#add-item-name").val("");
		$("#add-item-code").val("");
		document.querySelector("#add-item-instructions").innerHTML = "";
	}

	function addItem() {
		var itemName = $("#add-item-name").val();
		var itemCategory = $("#add-item-category-list").val();
		var itemCode = $("#add-item-code").val();
		var itemAvailability = $("#add-item-availability").val();

		$.post(
			"add-item",
			{
				itemName: itemName,
				itemCategory: itemCategory,
				itemCode: itemCode,
				itemAvailability: itemAvailability
			},
			function(data, textStatus, xhr) {
				if (xhr.readyState == 4 && xhr.status == 200) {
					document.querySelector("#add-item-instructions").innerHTML = "Item added success!";
				}
			}).fail(function() {
				document.querySelector("#add-item-instructions").innerHTML = "Item add failed!";
			});
	}

	function loadCategoryList(categoryListElement, categoryPrefix) {
		$.ajax({
			url: "categories-list",
			type: "GET",
			data: {
				categoryPrefix: categoryPrefix
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

	function loadItemsInSearchBar() {
		var itemPrefix = $("#item-search-bar").val();
		$.ajax({
			url: "items-list",
			type: "GET",
			data: {
				itemPrefix: itemPrefix
			},
			success: function(data, textStatus, xhr) {
				if (xhr.readyState == 4) {
					if (xhr.status == 200) {
						document.querySelector("#search-bar-items").innerHTML = xhr.responseText;
					}
				}
			}
		});
	}
	
	function displayEditItemMenu(itemName){
		$("#add-item-container").hide();
		$("#add-category-box").hide();
		$("#edit-category-box").hide();
		$("#edit-item-container").show();
		
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
		$("#add-item-container").hide();
		$("#add-category-box").hide();
		$("#edit-item-container").hide();
		$("#edit-category-box").show();
		
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
		//$("#edit-item-category-list").value = editFormElements.categoryName;
		$("#edit-item-code").val(editFormElements.itemCode);
		$("#edit-item-availability").value = editFormElements.itemAvailability;
	}
	
	function populateEditCategoryForm(categoryData){
		var editCategoryElements = JSON.parse(categoryData);
		$("#edit-category-name").val(editCategoryElements.categoryName);
		$("#edit-category-code").val(editCategoryElements.categoryCode);
	}
	
});