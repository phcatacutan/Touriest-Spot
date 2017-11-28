var c = document.getElementById('c'),
    ctx = c.getContext('2d'),
    current = {x: null, y: null},
    last = {x: null, y: null},
    pressed = false,
    s = { 
        'bg color': '#000',
        'brush color': '#00d1ff',
        'flood color': '#8600ff',
        'brush size': 4,
        'draw': true,
        'flood fill': false,
        'clear': clear
    };

var gui = new dat.GUI();
gui.addColor(s, 'bg color').onChange(fill);
gui.addColor(s, 'brush color');
gui.addColor(s, 'flood color');
gui.add(s, 'brush size', 1, 10, 1);
gui.add(s, 'draw').listen().onChange(resetCheck);
gui.add(s, 'flood fill').listen().onChange(resetCheck);
gui.add(s, 'clear');

function draw(e) {
    if (pressed && s['draw']) {
        current.x = e.touches ? e.touches[0].clientX : e.clientX,
        current.y = e.touches ? e.touches[0].clientY : e.clientY;
        drawLine();
    }    
}

function drawLine() {
    ctx.lineCap = 'round';
    ctx.lineWidth = s['brush size'];
    ctx.strokeStyle = s['brush color'];
    
    if (last.x != null && last.y != null) {
        ctx.beginPath();
        ctx.moveTo(last.x, last.y);
        ctx.lineTo(current.x, current.y);
        ctx.stroke();
    }
    
    last.x = current.x;
    last.y = current.y;
}

function floodFill(x, y) {
    if (s['flood fill']) {
        if (x > 0 && x < c.width && y > 0 && y < c.height) {
            var imgData = ctx.getImageData(x, y, 1, 1),
                pixel = imgData.data;

            var bg = hexToRgb(s['bg color']);

            if (pixel[0] != bg.r || pixel[1] != bg.g || pixel[2] != bg.b) {
                return;
            }

            var flood = hexToRgb(s['flood color']);

            pixel[0] = flood.r;
            pixel[1] = flood.g;
            pixel[2] = flood.b;
            pixel[3] = 255;

            ctx.putImageData(imgData, x, y);

            setTimeout(function() {
                floodFill(x + 1, y);
                floodFill(x - 1, y);
                floodFill(x, y + 1);
                floodFill(x, y - 1);  
            }, 1);
        }
    }
}

function hexToRgb(hex) {
    hex = hex.replace('#', '');
    hex = hex.match(new RegExp('(.{' + hex.length / 3 + '})', 'g'));

    for(var i=0; i < hex.length; i++) {
        hex[i] = parseInt(hex[i].length == 1 ? (hex[i] + hex[i]) : hex[i], 16);
    }

    return {r: hex[0], g: hex[1], b: hex[2]}
}

function ispressed () {
    pressed = true;
}

function reset() {
    pressed = false;
    last.x = null;
    last.y = null;
}

function fill() {
    ctx.fillStyle = s['bg color'];
    ctx.fillRect(0, 0, c.width, c.height);
}

function clear() {
    s['flood fill'] = false;
    s['draw'] = true;
    fill();
}

function resetCheck() {
    if (this.property == "draw") {
        if (this.__checkbox.checked) {
            s['flood fill'] = false;
            s['draw'] = true;
        }
    } else {
        if (this.__checkbox.checked) {
            s['draw'] = false;
            s['flood fill'] = true;
        }
    }
}

function resize() {
    c.width = window.innerWidth;
    c.height = window.innerHeight;
    fill();
};
window.addEventListener("resize", resize);

c.addEventListener('mousedown', ispressed);
c.addEventListener('touchstart', ispressed);
c.addEventListener('mousemove', draw);
c.addEventListener('touchmove', draw);
c.addEventListener('mouseup', reset);
c.addEventListener('touchend', reset);

c.addEventListener('click', function (e) {
    var x = e.touches ? e.touches[0].clientX : e.clientX,
        y = e.touches ? e.touches[0].clientY : e.clientY;
    
    floodFill(x, y);
});

resize();