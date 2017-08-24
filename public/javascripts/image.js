function randomImage() {
    var theDiv = $("#randomImage");
    var imgArray = ['background1', 'background4', 'background3'];
    var spot = Math.floor(Math.random() * imgArray.length);
    theDiv.addClass(imgArray[spot])
}

$(document).ready(function () { randomImage() })
