$(function () {
    $("#header").load("header.html");
    $("#footer").load("footer.html");
});

$(function() {
	var acc = document.getElementsByClassName("expand");
	var i;

	for (i = 0; i < acc.length; i++) {
    	acc[i].onclick = function(){
        	this.classList.toggle("active");
        	var panel = this.nextElementSibling;
        	if (panel.style.display === "block") {
            	panel.style.display = "none";
        	} else {
            	panel.style.display = "block";
        	}
    	}
	}
});