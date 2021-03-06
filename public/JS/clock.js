// jshint esversion:8

function drawHand(ctx, pos, length, width) {
    ctx.beginPath();
    ctx.lineWidth = width;
    ctx.strokeStyle = "#333333";
    ctx.lineCap = "round";
    ctx.moveTo(0, 0);
    ctx.rotate(pos);
    ctx.lineTo(0, -length);
    ctx.stroke();
    ctx.rotate(-pos);
}

function clockToAngles(data = {}) {
    if ($.isEmptyObject(data)) {
        const now = new Date();
        data.hour = now.getHours();
        data.minute = now.getMinutes();
        data.second = now.getSeconds();
    } else {
        // Si data est spécifié on cale les secondes à 00
        data.second = 0;
        // une implémentation de verif de l'objet peut etre prévue ici
    }
    // Calcul des angles
    var hour = data.hour % 12;
    hourAngle = (hour * Math.PI / 6) + (data.minute * Math.PI / (6 * 60)) + (data.second * Math.PI / (360 * 60));
    minuteAngle = (data.minute * Math.PI / 30) + (data.second * Math.PI / (30 * 60));
    //
    return {hourAngle: hourAngle,
            minuteAngle: minuteAngle};
}
//
// creation de l'horloge
function drawClock() {
    // creation du cadran
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, 2 * Math.PI);
    ctx.fillStyle = "#a6a6a6";
    ctx.fill();
    ctx.lineWidth = 10;
    ctx.strokeStyle = "#333333";
    ctx.stroke();

    // creation du centre
    ctx.beginPath();
    ctx.arc(0, 0, radius * 0.04, 0, 2 * Math.PI);
    ctx.fillStyle = '#333';
    ctx.fill();
    //
    // Récupération des angles
    const angles = clockToAngles();
    //
    // Creation des aiguilles
    drawHand(ctx, angles.hourAngle, radius * 0.5, radius * 0.07);
    drawHand(ctx, angles.minuteAngle, radius * 0.8, radius * 0.05);
    //
    if (!$.isEmptyObject(sunriseSunset)) {
        drawArc(sunriseSunset);
    }
}
//
// Creation de l'arc donnant la zone de jour
function drawArc(data) {
    // Recuperation de l'heure actuelle
    const now = new Date();
    const hour = now.getHours();
    const pi = Math.PI;
    const upClock = - pi / 2;
    var startAngle;
    var endAngle;
    //
    // On défini si c'est le matin ou l'apres-midi
    if (hour < 12) {
        const angles = clockToAngles(data.sunset);
        startAngle = - angles.hourAngle;
        endAngle = upClock;
    } else {
        const angles = clockToAngles(data.sunrise);
        startAngle = upClock;
        endAngle = - angles.hourAngle;
    }
    //
    // creation de l'arc
    ctx.beginPath();
    ctx.arc(0, 0, radius * 0.9, startAngle, endAngle);
    ctx.lineWidth = 5;
    ctx.strokeStyle = "#ffcc00";
    ctx.stroke();
}

function showPosition(position) {
    coords.latitude = position.coords.latitude;
    coords.longitude = position.coords.longitude;
    // requete au server
    askSunriseSunset(coords.latitude, coords.longitude).then(function (res) {
        sunriseSunset = res;
    });
}

async function askSunriseSunset(lat, long) {
    const sunriseSunsetData = await $.ajax({ 
        url: '/askSunriseSunset',
        method: 'POST',
        data: {lat: lat, long: long},
        dataType: "json", 
        error: function(jqXHR, textStatus, err){
            console.log('text status '+textStatus+', err '+err);
        }
     });
     return sunriseSunsetData;
}


var sunriseSunset = {};
var coords = {};
//
const canvas = document.getElementById("clockCanvas");
const ctx = canvas.getContext("2d");
var radius = canvas.height / 2;
ctx.translate(radius, radius);
radius = radius * 0.9;
//
drawClock();
//
// Determine la position de l'utilisateur s'il l'accepte
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);    
}
//
// on attend l'arrivée des données de sunriseSunset pour les afficher des que possible
var waitForSunriseSunsetData = function(){
    if($.isEmptyObject(sunriseSunset)){
        setTimeout(waitForSunriseSunsetData, 100); // check again in 100 milliseconds
    }
    else {
        drawClock();
    }
};
waitForSunriseSunsetData();
//
// on lance l'horloge
setInterval(drawClock, 30000);





  