import type { legend, matrix, params } from "./types"
export function drawCanvas(canvas: HTMLCanvasElement, matrix: matrix, legend: legend, params: params): void{
    const X: number = matrix.length
    const Y: number = matrix[0].length
    const T: number = params.thickness
    const M: number = params.size
    const P: number = params.border
    const borderColor: string = "#"  + col2str(params.bcolor.r) + col2str(params.bcolor.g) + col2str(params.bcolor.b)
    const cwidth: number = M*Y+T+2*P
    const cheight: number = M*X+T+2*P
    if(cwidth*cheight > 124000000) {
        throw new Error("Due to limitations of the HTML5 canvas this compass is limited to 124MP")
    }
    canvas.height = cheight
    canvas.width = cwidth
    const ctx = <CanvasRenderingContext2D> canvas.getContext("2d")
    ctx.fillStyle = "#fff"
    ctx.fillRect(0,0,M*Y+T+2*P,M*X+T+2*P)
    for(let i: number = 0; i<X; i++) {
        ctx.fillStyle = borderColor
        ctx.fillRect(P,P+M*i,T+M*Y,T)
        for(let j: number = 0; j<Y; j++) {
            ctx.fillStyle = borderColor
            ctx.fillRect(P+M*j,P,T,T+M*X)
            const color: string = "#"  + col2str(matrix[i][j].r) + col2str(matrix[i][j].g) + col2str(matrix[i][j].b) 
            ctx.fillStyle = color
            ctx.fillRect(P+T+M*j,P+T+M*i,M-T,M-T)
        }
        ctx.fillStyle = borderColor
        ctx.fillRect(P+M*Y,P,T,T+M*X)
    }
    ctx.fillRect(P,P+M*X,T+M*Y,T)
    if(P>29)
        drawLegend(ctx,cwidth,cheight,P,legend)
}

function drawLegend(ctx: CanvasRenderingContext2D, cwidth: number, cheight: number, border: number, legend:legend): void {
    const bordBuff: number = (border + 10) / 2
    ctx.textAlign = "center"
    ctx.font = "bold 20px 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    ctx.fillText(legend.top, cwidth/2, bordBuff , cwidth)
    ctx.fillText(legend.bottom, cwidth/2, cheight - ((border - 10) / 2), cwidth)
    ctx.rotate(Math.PI/2)
    ctx.translate(0,-cwidth)
    ctx.fillText(legend.right, cheight/2 , bordBuff )
    ctx.rotate(Math.PI)
    ctx.translate(0,-cwidth)
    ctx.fillText(legend.left, - cheight/2 , bordBuff )
}


function col2str(val:number): string{
    if (val>=0 && val<=255) { 
        let v: string = val.toString(16)
        if(v.length == 1) {
            v = "0" + v
        }
        return v
    } else {
        throw new Error ("Invalid hex")
    }
}