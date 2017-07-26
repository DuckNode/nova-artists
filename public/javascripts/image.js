

function randomImage() {
    
                var thediv=$("#hero");  
                var imgarray = ['background1', 'background4', 'background3'];  
                var spot =Math.floor(Math.random()* imgarray.length);  
                thediv.addClass(imgarray[spot])  
               
                   }  

$(document).ready(function(){randomImage()})
