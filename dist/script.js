import { drawCanvas } from "./canvas.js";
const drawbutton = document.getElementById("renderbutton");
const canvas = document.getElementById("compasscanvas");
const legendtoggle = document.getElementById("legend");
const legendholder = document.getElementById("legendholder");
if (legendtoggle.checked) {
    legendholder.style.display = "block";
}
legendtoggle.addEventListener("click", () => {
    if (legendtoggle.checked) {
        legendholder.style.display = "block";
    }
    else {
        legendholder.style.display = "none";
    }
});
const paramtoggle = document.getElementById("paramtg");
const paramholder = document.getElementById("paramholder");
if (paramtoggle.checked) {
    paramholder.style.display = "block";
}
paramtoggle.addEventListener("click", () => {
    console.log(paramtoggle.checked);
    if (paramtoggle.checked) {
        paramholder.style.display = "block";
    }
    else {
        paramholder.style.display = "none";
    }
});
drawbutton.addEventListener("click", () => buttonClick());
function buttonClick() {
    const corners = {
        tl: {},
        tr: {},
        bl: {},
        br: {}
    };
    {
        let key;
        for (key in corners) {
            const elm = document.getElementById(`${key}corner`);
            try {
                corners[key] = hex2int(elm.value);
            }
            catch (e) {
                alert(e);
            }
        }
    }
    const axis = {
        x: 0,
        y: 0
    };
    {
        let key;
        for (key in axis) {
            const elm = document.getElementById(`${key}axis`);
            try {
                axis[key] = parseInt(elm.value);
            }
            catch (e) {
                alert(e);
            }
        }
    }
    if (axis["x"] > 1 && axis["y"] > 1) {
        calcCompass(corners, axis);
    }
    else {
        alert("Invalid values, both sides must be larger than 1");
    }
}
function getLegend() {
    if (!legendtoggle.checked)
        return {
            "top": "",
            "bottom": "",
            "left": "",
            "right": ""
        };
    const top = document.getElementById("top");
    const bottom = document.getElementById("bottom");
    const left = document.getElementById("left");
    const right = document.getElementById("right");
    return {
        "top": top.value,
        "bottom": bottom.value,
        "left": left.value,
        "right": right.value
    };
}
function getParams() {
    const thickness_str = document.getElementById("thickness");
    const size_str = document.getElementById("size");
    const border_str = document.getElementById("border");
    const bcolor = document.getElementById("bcolor");
    const color = hex2int(bcolor.value);
    const thickness = parseInt(thickness_str.value);
    const size = parseInt(size_str.value);
    const border = parseInt(border_str.value);
    if (thickness < 1 || size < 25 || border < 0)
        throw new Error("Invalid parameters");
    return {
        "thickness": thickness,
        "size": size,
        "border": border,
        "bcolor": color
    };
}
function calcCompass(corners, axis) {
    const matrix = new Array(axis.y).fill(0).map(() => new Array(axis.x).fill(0));
    const W = matrix.length;
    const H = matrix[0].length;
    for (let i = 0; i < W; i++) {
        for (let j = 0; j < H; j++) {
            matrix[i][j] = calcColor(corners, i, j, W, H);
        }
    }
    try {
        const params = getParams();
        const legend = getLegend();
        drawCanvas(canvas, matrix, legend, params);
        canvas.style.display = "block";
    }
    catch (e) {
        canvas.style.display = "none";
        console.error(e);
        alert(e);
    }
}
function hex2int(value) {
    const color = {
        r: 0,
        g: 0,
        b: 0,
    };
    if (value.substring(0, 1) == "#") {
        value = value.substring(1);
    }
    if (value.length == 3) {
        let key;
        let i = 0;
        for (key in color) {
            const v = value.substring(i, i + 1);
            color[key] = parseInt(v + v, 16);
            i++;
        }
    }
    else if (value.length == 6) {
        let key;
        let i = 0;
        for (key in color) {
            color[key] = parseInt(value.substring(2 * i, 2 * (i + 1)), 16);
            i++;
        }
    }
    else {
        throw new Error(`#${value} is not a valid color hex`);
    }
    console.log(color);
    return color;
}
function calcRatio(val, total) {
    return (val + 1) / (total - 1) - (1 / (total - 1));
}
function calcColor(corners, X, Y, W, H) {
    const color = {
        r: 0,
        g: 0,
        b: 0
    };
    const RW = calcRatio(X, W);
    const RH = calcRatio(Y, H);
    const IW = 1 - RW;
    const IH = 1 - RH;
    let key;
    for (key in color) {
        const c = key;
        let value = corners["tl"][c] * IW * IH;
        value += corners["tr"][c] * IW * RH;
        value += corners["bl"][c] * RW * IH;
        value += corners["br"][c] * RW * RH;
        color[c] = Math.round(value);
    }
    return color;
}
//# sourceMappingURL=script.js.map