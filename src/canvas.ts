import type { matrix } from "./types"
export function drawCanvas(canvas: HTMLCanvasElement, matrix: matrix): void{
    const X: number = matrix.length
    const Y: number = matrix[0].length
    const T: number = 10
    const M: number = 200
    const P: number = 60
    canvas.height = M*X+T+2*P
    canvas.width = M*Y+T+2*P
    const ctx = <CanvasRenderingContext2D> canvas.getContext("2d")
    ctx.fillStyle = "#fff"
    ctx.fillRect(0,0,M*Y+T+2*P,M*X+T+2*P)
    for(let i: number = 0; i<X; i++){
        ctx.fillStyle = "#000"
        ctx.fillRect(P,P+M*i,T+M*Y,T)
        for(let j: number = 0; j<Y; j++){
            ctx.fillStyle = "#000"
            ctx.fillRect(P+M*j,P,T,T+M*X)
            const color: string = "#"  + col2str(matrix[i][j].r) + col2str(matrix[i][j].g) + col2str(matrix[i][j].b) 
            ctx.fillStyle = color
            ctx.fillRect(P+T+M*j,P+T+M*i,M-T,M-T)
        }
        ctx.fillStyle = "#000"
        ctx.fillRect(P+M*Y,P,T,T+M*X)
    }
    ctx.fillRect(P,P+M*X,T+M*Y,T)
}

function col2str(val:number): string{
    if (val>=0 && val<=255) { 
        let v: string = val.toString(16)
        if(v.length == 1){
            v = "0" + v
        }
        return v
    } else {
        throw new Error("Invalid hex")
    }
}