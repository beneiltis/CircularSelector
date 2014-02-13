/**
 * Created by Benedikt Iltisberger on 11.02.14.
 * Acando GmbH
 */



function setupCircularSelector (elementName, exclude, insideColor, ringColor, indicatorColor, minVal, maxVal, currentVal, text){

    drawCircle(elementName, insideColor, ringColor, indicatorColor, minVal, maxVal, currentVal, text);

    var touchstarted = false;
    $( document ).ready(function() {

        $("#"+exclude).on('touchmove',function(e){
            if(!$("." + elementName).has($(e.target)).length)
                e.preventDefault();
        });

        $("#"+elementName).bind('touchstart vmousedown', function(){
            touchstarted = true;
        })

        $("#"+elementName).bind('touchmove vmousemove', function(event){
            if (touchstarted) {
                setupCircle(event);
            }
        })

        $("#"+elementName).bind('tap', function(event){
            if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
                setupCircle(event);
            }
        });

        $("#"+elementName).bind('touchend vmouseup', function(event){
            touchstarted = false;

            if(! /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
                setupCircle(event);
            }
        });

        function setupCircle (event) {
            var canvas = document.getElementById(elementName);
            var centerX = canvas.width / 2;
            var centerY = canvas.height / 2;
            var angle;
            if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
                var mobileOffsetX = event.pageX - $("#"+elementName).offset().left
                var mobileOffsetY = event.pageY - $("#"+elementName).offset().top
                angle = calcAngleForPosition(mobileOffsetX, mobileOffsetY, centerX, centerY);
            } else {
                angle = calcAngleForPosition(event.offsetX, event.offsetY, centerX, centerY);
            }
            var aVal = regularAngleToPercent(convertToRegularAngle(angle));
            drawCircle(elementName, insideColor, ringColor, indicatorColor, minVal, maxVal, aVal, text);
        }
    });
}

function drawCircle(elementName, insideColor, ringColor, indicatorColor, minVal, maxVal, currentVal, text) {

    // setup basic elements
    var canvas = document.getElementById(elementName);
    var context = canvas.getContext('2d');
    var centerX = canvas.width / 2;
    var centerY = canvas.height / 2;
    var radius = ((canvas.height / 2) - canvas.height*0.1);
    var indicatorLineWidth = 12;
    var radians = degree2Radians(calcAngle(calcPercentage(minVal, maxVal, currentVal)));
    // resets the canvas so we can redraw the canvas
    canvas.width = canvas.width;
    context.webkitImageSmoothingEnabled = true;

    // draw basic circle
    context.beginPath();
    context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
    context.closePath();
    context.lineWidth = indicatorLineWidth;
    context.fillStyle = insideColor;
    context.fill();
    context.strokeStyle = ringColor;
    context.stroke();

    // draw outer indicator
    context.beginPath();
    context.fillStyle = insideColor;
    context.lineWidth = indicatorLineWidth;
    context.strokeStyle = indicatorColor;
    context.fill();
    context.arc(centerX, centerY, radius, 1.5*Math.PI, radians-1.5, false);
    context.stroke();

    // draw colored position indicator
    context.beginPath();
    var startingPoint = angleAndRadiusToPoint(radians-1.5, radius+indicatorLineWidth/2, centerX, centerY);
    context.moveTo(startingPoint.x, startingPoint.y);
    context.strokeStyle = "#FD7025";
    var endingPoint = angleAndRadiusToPoint(radians-1.5, radius-20, centerX, centerY);
    context.lineTo(endingPoint.x, endingPoint.y);
    context.stroke();

    // draw line from last point to center
    context.lineTo(centerX,centerY);
    context.closePath();

    // setup center text
    context.fillStyle = "#FD7025";
    context.strokeStyle = "#F00";
    context.font = "36pt Arial";
    context.textAlign = "center";
    context.fillText(Math.round(currentVal), centerX, centerY-10);

    // setup description text
    if (text !== undefined && text !== '') {
        context.fillStyle = "#000";
        context.strokeStyle = "#F00";
        context.font = "14pt Arial";
        context.textAlign = "center";
        context.fillText(text, centerX, centerY+30);
    }
}

//
function angleAndRadiusToPoint(angle, radius, centerX, centerY) {
    x = centerX + Math.cos(angle) * radius;
    y = centerY + Math.sin(angle) * radius;
    return new Point(x,y);
}

// converts a radians value into a degree value
function radian2Degree (radians) {

    return radians * (180 / Math.PI);
}

// converts a degree value into a radians value
function degree2Radians (degree) {

    return degree * (Math.PI / 180);
}

// calculate percentage value for the 3 given values
function calcPercentage (minVal, maxVal, currentVal) {

    return (currentVal / (maxVal - minVal) * 100);
}

// unsophisticated method to convert a percentage value into a regular angle
function calcAngle (percent) {

    return 3.6 * percent;
}

// calculate angle for a horizontal point cx,cy and a other point ex,ey
function calcAngleForPosition (ex, ey, cx, cy) {
    var dy = ey - cy;
    var dx = ex - cx;
    theta = Math.atan2(dy, dx);
    return radian2Degree(theta);
}

// convert html5/canvas element angle (starts with 0 degrees at 3 o'clock) into
// regular angle (starting at 12 o'clock)
function convertToRegularAngle (angle) {
    // to setup the right startup position (12 o'clock)
    angle = angle + 90;
    if(angle < 0) {
        // we reached the last 90 degrees (9 to 12 o'clock)
        angle = angle + 360;
    }
    return angle;
}

// Calculate a percentage value from a 0 to 360 degree value
function regularAngleToPercent (angle) {
    return (angle / 360) * 100;
}

//
// Helper Classes
//

// Point class
function Point(x, y){
    this.x = x || 0;
    this.y = y || 0;
};