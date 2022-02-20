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