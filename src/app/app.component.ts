import { Component, VERSION, OnInit } from '@angular/core';
import { fabric } from 'fabric';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  __canvas: any;
  rect: any;
  rect1: any;
  angle: number = 0;
  scale: number = 1;
  top: number = 150;
  left: number = 100;
  skewX: number = 0;
  skewY: number = 0;

  findQuadrantByAngle = (angle) => {
    const n = angle % 360;

    let q = 1;
    if (n !== 0) {
      q = Math.ceil(n / 90) + 1;
    }
    console.log('Q', q);
  };

  angleChange(value) {
    this.rect.set('angle', parseInt(value, 10)).setCoords();
    this.__canvas.requestRenderAll();

    const cc = this.__canvas.getObjects();
    console.log(cc);
  }

  scaleChange(value) {
    this.rect.scale(parseFloat(value)).setCoords();
    this.__canvas.requestRenderAll();
  }

  topChange(value) {
    this.rect.set('top', parseInt(value, 10)).setCoords();
    this.__canvas.requestRenderAll();
  }

  leftChange(value) {
    this.rect.set('left', parseInt(value, 10)).setCoords();
    this.__canvas.requestRenderAll();
  }

  skewXChange(value) {
    this.rect.set('skewX', parseInt(value, 10)).setCoords();
    this.__canvas.requestRenderAll();
  }

  skewYChange(value) {
    this.rect.set('skewY', parseInt(value, 10)).setCoords();
    this.__canvas.requestRenderAll();
  }

  ngOnInit() {
    const canvas = (this.__canvas = new fabric.Canvas('c'));

    fabric.Object.prototype.transparentCorners = false;

    this.rect = new fabric.Rect({
      width: 100,
      height: 100,
      top: 100,
      left: 100,
      fill: 'rgba(255,0,0,0.5)',
      scaleX: 1,
      scaleY: 1,
    });

    this.rect1 = new fabric.Rect({
      width: 100,
      height: 100,
      top: 50,
      left: 100,
      fill: 'rgba(255,0,0,0.5)',
    });

    canvas.add(this.rect);
    //canvas.add(this.rect1);

    canvas.on({
      'object:moving': this.onMoving.bind(this),
      'object:scaling': this.updateControls,
      'object:resizing': this.updateControls,
      'object:rotating': this.updateControls,
      'object:skewing': this.updateControls,
    });

    canvas.on({
      'object:modified': function (e) {
        e.target.opacity = 1;
      },
    });
  }

  private onMoving(e) {
    e.target.opacity = 0.5;
    this.updateControls();
  }

  private updateControls() {
    if (!this.rect) return;
    this.scale = this.rect.scaleX;
    this.angle = this.rect.angle;
    this.left = this.rect.left;
    this.top = this.rect.top;
    this.skewX = this.rect.skewX;
    this.skewY = this.rect.skewY;
  }
}
