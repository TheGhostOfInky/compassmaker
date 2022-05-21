export type color = {
    "r" : number;
    "g" : number;
    "b" : number
}

export type matrix = Array<Array<color>>

export type corners = {
    "tl" : color;
    "tr" : color;
    "bl" : color;
    "br" : color
}

export type axis = {
    "x": number;
    "y": number
}

export type legend = {
    "top"    : string;
    "bottom" : string;
    "left"   : string;
    "right"  : string
}

export type params = {
    "thickness" : number;
    "size"      : number;
    "border"    : number;
    "bcolor"    : color
}