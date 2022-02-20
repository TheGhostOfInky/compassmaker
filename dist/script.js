import { drawCanvas } from "./canvas.js";
const drawbutton = document.getElementById("renderbutton");
const legend1radio = document.getElementById("legend1");
const legend0radio = document.getElementById("legend0");
const legendholder = document.getElementById("legendholder");
const canvas = document.getElementById("compasscanvas");
if (legend1radio.checked) {
    legendholder.style.display = "block";
}
legend1radio.addEventListener("click", () => legendholder.style.display = "block");
legend0radio.addEventListener("click", () => legendholder.style.display = "none");
drawbutton.addEventListener("click", () => buttonClick());
function buttonClick() {
    const corners = {
        tl: {
            r: 0,
            g: 0,
            b: 0
        },
        tr: {
            r: 0,
            g: 0,
            b: 0
        },
        bl: {
            r: 0,
            g: 0,
            b: 0
        },
        br: {
            r: 0,
            g: 0,
            b: 0
        }
    };
    {
        let key;
        for (key in corners) {
            const elm = document.getElementById(`${key}corner`);
            corners[key] = hex2int(elm.value);
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
            axis[key] = parseInt(elm.value);
        }
    }
    if (axis["x"] > 1 && axis["y"] > 1) {
        calcCompass(corners, axis);
    }
    else {
        alert("Invalid values, both sides must be larger than 1");
    }
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
    drawCanvas(canvas, matrix);
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
        throw new Error("number not valid hex");
    }
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