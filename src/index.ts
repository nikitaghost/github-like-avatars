import { getRGB, md5 } from "./utils";
import { Canvas, createCanvas } from "canvas";
import fs from "fs";

export class ImageGenerator {
    readonly backgroundColor;
    readonly imgWidth;
    readonly blocks;

    constructor(
        backgroundColor: string = "white",
        imgWidth: number = 1200,
        blocks: number = 12
    ) {
        this.backgroundColor = backgroundColor;
        this.imgWidth = imgWidth;
        this.blocks = blocks;
    }

    public async genImageAndSave(
        username: string = "",
        path: string
    ) {
        let imgCanvas: Canvas = await this._generateImage(username);
        fs.writeFileSync(path, imgCanvas.toBuffer('image/png'));
    }

    public async genImageAndGetBuffer(
        username: string = ""
    ): Promise<Buffer> {
        let imgCanvas = await this._generateImage();

        return imgCanvas.toBuffer('image/png');
    }

    public async genImageAndGetCanvas(): Promise<Canvas> {
        return this._generateImage();
    }

    private async _generateImage(
        username: string = ""
    ): Promise<Canvas> {
        let mainColor = getRGB(md5(username));

        let leftArr = [...Array(this.imgWidth)].map(e => Array(this.imgWidth / 2));
        leftArr = this._fillArray(leftArr);

        let rightArr = this._mirrorArray(leftArr);
        let imageMatrix = this._mergeArrays(leftArr, rightArr);

        const canvas = createCanvas(this.imgWidth, this.imgWidth);
        const context = canvas.getContext('2d');

        let prevX = 0;
        let prevY = 0;
        let blockSize = this.imgWidth / this.blocks;
        for (let i = 0; i < imageMatrix.length; i++) {
            let lastX = (i + 1) * blockSize;
            for (let j = 0; j < imageMatrix[i].length; j++) {
                let lastY = (j + 1) * blockSize;
                for(let n = prevX; n < lastX; n++) {
                    for (let m = prevY; m < lastY; m++) {
                        if (i == 0 || j == 0 || i == imageMatrix.length - 1 || j == imageMatrix[i].length - 1) {
                            context.fillStyle = this.backgroundColor;   
                        } else {
                            context.fillStyle = imageMatrix[i][j] ? mainColor : this.backgroundColor;   
                        }
                        context.fillRect(m, n, 1, 1);
                    }
                }
                prevY = lastY == this.imgWidth ? 0 : lastY;
            }
            prevX = lastX;
        }

        return canvas;
    }

    private _fillArray(array: number[][]): number[][] {
        for (let i = 0; i < array.length; i++) {
            for (let j = 0; j < array[i].length; j++) {
                array[i][j] = Math.floor(Math.random() * 2);
            }
        }
    
        return array;
    }

    private _mirrorArray(array: number[][]): number[][] {
        let rightArr = array;
        return rightArr.map(function (arr) { return arr.reverse(); });
    }

    private _mergeArrays(leftArr: number[][], rightArr: number[][]): number[][] {
        if (leftArr.length != rightArr.length) {
            return [];
        } else if (leftArr[0].length != rightArr[0].length) {
            return [];
        }

        let arr = [...Array(leftArr.length)].map(e => Array(leftArr[0].length * 2));
        for (let i = 0; i < arr.length; i++) {
            arr[i] = leftArr[i].concat(rightArr[i]);
        }

        return arr;
    }
}
