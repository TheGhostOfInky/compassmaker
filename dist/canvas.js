export function drawCanvas(canvas, matrix) {
    const X = matrix.length;
    const Y = matrix[0].length;
    const T = 10;
    const M = 200;
    const P = 60;
    canvas.height = M * X + T + 2 * P;
    canvas.width = M * Y + T + 2 * P;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, M * Y + T + 2 * P, M * X + T + 2 * P);
    for (let i = 0; i < X; i++) {
        ctx.fillStyle = "#000";
        ctx.fillRect(P, P + M * i, T + M * Y, T);
        for (let j = 0; j < Y; j++) {
            ctx.fillStyle = "#000";
            ctx.fillRect(P + M * j, P, T, T + M * X);
            const color = "#" + col2str(matrix[i][j].r) + col2str(matrix[i][j].g) + col2str(matrix[i][j].b);
            ctx.fillStyle = color;
            ctx.fillRect(P + T + M * j, P + T + M * i, M - T, M - T);
        }
        ctx.fillStyle = "#000";
        ctx.fillRect(P + M * Y, P, T, T + M * X);
    }
    ctx.fillRect(P, P + M * X, T + M * Y, T);
}
function col2str(val) {
    if (val >= 0 && val <= 255) {
        let v = val.toString(16);
        if (v.length == 1) {
            v = "0" + v;
        }
        return v;
    }
    else {
        throw new Error("Invalid hex");
    }
}
//# sourceMappingURL=canvas.js.map