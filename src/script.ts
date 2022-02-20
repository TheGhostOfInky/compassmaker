import { drawCanvas } from "./canvas.js"
import type { color, matrix, corners, axis} from "./types"
const drawbutton = <HTMLButtonElement> document.getElementById("renderbutton")
const legend1radio = <HTMLInputElement> document.getElementById("legend1")
const legend0radio = <HTMLInputElement> document.getElementById("legend0")
const legendholder = <HTMLDivElement> document.getElementById("legendholder")
const canvas = <HTMLCanvasElement> document.getElementById("compasscanvas")
if(legend1radio.checked){
    legendholder.style.display = "block"
}
legend1radio.addEventListener("click", () => legendholder.style.display = "block" )
legend0radio.addEventListener("click", () => legendholder.style.display = "none" )
drawbutton.addEventListener("click", () => buttonClick() )

function buttonClick(): void{
    const corners: corners = {
        tl : {
            r : 0,
            g : 0,
            b : 0
        },
        tr : {
            r : 0,
            g : 0,
            b : 0
        },
        bl : {
            r : 0,
            g : 0,
            b : 0
        },
        br : {
            r : 0,
            g : 0,
            b : 0
        }
    }
    {   
        interface color {
            tl: string,
            tr: string,
            bl: string,
            br: string
        }
        let key: keyof color
        for(key in corners){
            const elm = <HTMLInputElement> document.getElementById(`${key}corner`)
            corners[key] = hex2int(elm.value)
        }
    }
    const axis: axis = {
        x : 0,
        y : 0
    }
    {           
        interface axis {
            x: number,
            y: number,
        }
        let key: keyof axis
        for(key in axis){
            const elm = <HTMLInputElement> document.getElementById(`${key}axis`)
            axis[key] = parseInt(elm.value)
        }
    }
    if(axis["x"]>1 && axis["y"]>1){
        calcCompass(corners,axis)
    } else  {
        alert("Invalid values, both sides must be larger than 1")
    }
    
}

function calcCompass(corners:any,axis:any): void{
    const matrix: matrix = new Array(axis.y).fill(0).map( () => new Array(axis.x).fill(0) )
    const W: number = matrix.length
    const H: number = matrix[0].length
    for(let i: number = 0; i<W; i++){
        for(let j: number = 0; j<H; j++){
            matrix[i][j] = calcColor(corners, i, j, W, H)
        }
    }
    drawCanvas(canvas, matrix)
}

function hex2int(value:string): color{
    interface color{ 
        r: number,
        g: number,
        b: number
    }
    const color: color = {
        r : 0,
        g : 0,
        b : 0,
    }
    if(value.substring(0,1) == "#"){
        value = value.substring(1)
    }
    if(value.length==3){
        let key: keyof color
        let i: number = 0
        for(key in color){
            const v = value.substring(i,i+1)
            color[key] = parseInt(v+v, 16)
            i++
        }
    } else if (value.length==6) {
        let key: keyof color
        let i: number = 0
        for(key in color){
            color[key]= parseInt(value.substring(2*i,2*(i+1)), 16)
            i++
        }
    } else {
        throw new Error("number not valid hex")
    }
    return color
}

function calcRatio(val:number, total:number): number{
    return (val+1)/(total-1)-(1/(total-1))
}

function calcColor(corners:corners,X:number,Y:number,W:number,H:number): color{
    interface color{ 
        r: number,
        g: number,
        b: number
    }
    const color: color = {
        r : 0,
        g : 0,
        b : 0
    }
    const RW: number = calcRatio(X,W)
    const RH: number = calcRatio(Y,H)
    const IW: number = 1 - RW
    const IH: number = 1 - RH
    let key: keyof color
    for(key in color){
        const c: keyof color = key
        let value: number = corners["tl"][c]*IW*IH
        value += corners["tr"][c]*IW*RH
        value += corners["bl"][c]*RW*IH
        value += corners["br"][c]*RW*RH
        color[c] = Math.round(value)
    }
    return color
}
