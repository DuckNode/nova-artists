

function randomImage() {
    
                var thediv=$("#hero");  
                var imgarray = ['background1', 'background2', 'background3'];  
                var spot =Math.floor(Math.random()* imgarray.length);  
                thediv.addClass(imgarray[spot])  
                console.log(imgarray[spot])
                   }  

$(document).ready(function(){randomImage()})
