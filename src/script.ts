import { drawCanvas } from "./canvas.js"
import type { color, matrix, corners, axis, params, legend } from "./types"
const drawbutton = <HTMLButtonElement> document.getElementById("renderbutton")
const canvas = <HTMLCanvasElement> document.getElementById("compasscanvas")

const legendtoggle = <HTMLInputElement> document.getElementById("legend")
const legendholder = <HTMLDivElement> document.getElementById("legendholder")

if(legendtoggle.checked){
    legendholder.style.display = "block"
}
legendtoggle.addEventListener("click", () => {
    if(legendtoggle.checked){
        legendholder.style.display = "block"
    } else {
        legendholder.style.display = "none" 
    }
})

const paramtoggle = <HTMLInputElement> document.getElementById("paramtg")
const paramholder = <HTMLDivElement> document.getElementById("paramholder")

if(paramtoggle.checked){
    paramholder.style.display = "block"
}
paramtoggle.addEventListener("click", () => {
    console.log(paramtoggle.checked)
    if(paramtoggle.checked){
        paramholder.style.display = "block"
    } else {
        paramholder.style.display = "none" 
    }
})


drawbutton.addEventListener("click", () => buttonClick() )

function buttonClick(): void{
    const corners: corners = {
        tl : {} as color,
        tr : {} as color,
        bl : {} as color,
        br : {} as color
    }
    {   
        interface corners {
            tl: string,
            tr: string,
            bl: string,
            br: string
        }
        let key: keyof corners
        for(key in corners){
            const elm = <HTMLInputElement> document.getElementById(`${key}corner`)
            try {
                corners[key] = hex2int(elm.value)
            } catch(e:any) {
                alert(e)
            } 
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
        for (key in axis) {
            const elm = <HTMLInputElement> document.getElementById(`${key}axis`)
            try {
                axis[key] = parseInt(elm.value)
            } catch(e:any) {
                alert(e)
            }
        }
    }

    if(axis["x"]>1 && axis["y"]>1) {
        calcCompass(corners,axis)
    } else {
        alert("Invalid values, both sides must be larger than 1")
    }
}

function getLegend(): legend {
    if(!legendtoggle.checked)
        return {
            "top"    : "",
            "bottom" : "",
            "left"   : "",
            "right"  : ""
        }
    const top    = <HTMLInputElement> document.getElementById("top")
    const bottom = <HTMLInputElement> document.getElementById("bottom")
    const left   = <HTMLInputElement> document.getElementById("left")
    const right  = <HTMLInputElement> document.getElementById("right")
    return {
        "top"    : top.value,
        "bottom" : bottom.value,
        "left"   : left.value,
        "right"  : right.value
    }
}

function getParams(): params {
    const thickness_str = <HTMLInputElement> document.getElementById("thickness")
    const size_str      = <HTMLInputElement> document.getElementById("size")
    const border_str    = <HTMLInputElement> document.getElementById("border")
    const bcolor        = <HTMLInputElement> document.getElementById("bcolor")
    const color: color      = hex2int(bcolor.value)
    const thickness: number = parseInt(thickness_str.value)
    const size: number      = parseInt(size_str.value)
    const border: number    = parseInt(border_str.value)
    if( thickness < 1 || size < 25 || border < 0)
        throw new Error("Invalid parameters")
    return {
        "thickness" : thickness,
        "size"      : size,
        "border"    : border,
        "bcolor"    : color
    }
}

function calcCompass(corners:any,axis:any): void {
    const matrix: matrix = new Array(axis.y).fill(0).map( () => new Array(axis.x).fill(0) )
    const W: number = matrix.length
    const H: number = matrix[0].length
    for(let i: number = 0; i<W; i++){
        for(let j: number = 0; j<H; j++){
            matrix[i][j] = calcColor(corners, i, j, W, H)
        }
    }
    try {
        const params: params = getParams()
        const legend: legend = getLegend()
        drawCanvas(canvas, matrix, legend, params)
        canvas.style.display = "block"
    } catch (e:any) {
        canvas.style.display = "none"
        console.error(e)
        alert(e)
    }
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
    if(value.substring(0,1) == "#") {
        value = value.substring(1)
    }
    if(value.length==3) {
        let key: keyof color
        let i: number = 0
        for(key in color) {
            const v: string = value.substring(i,i+1)
            color[key] = parseInt(v+v, 16)
            i++
        }
    } else if (value.length==6) {
        let key: keyof color
        let i: number = 0
        for(key in color) {
            color[key] = parseInt(value.substring(2*i,2*(i+1)), 16)
            i++
        }
    } else {
        throw new Error(`#${value} is not a valid color hex`)
    }
    console.log(color)
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
