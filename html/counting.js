var cDD = new Date("Dec 20, 2019 00:00:00").getTime();
var cDf = setInterval(function(){
    var now = new Date().getTime();
    var distance =  cDD - now;
    var days = Math.floor(distance / (1000*60*60*24));
    var hours = Math.floor((distance % (1000*60*60*24))/ (1000*60*60));
    var minutes = Math.floor((distance % (1000*60*60))/ (1000*60));
    var seconds = Math.floor((distance % (1000* 60))/ 1000);

    document.getElementById("demo").innerHTML = days + "d " + hours + "h " + minutes + "m " + seconds + "s ";


    if (distance < 0 ){
        clearInterval(cDf);
        document.getElementById("demo").innerHTML = "HAppy New Year";
    }
},1000);
