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

  findQuadrantByAngle = (angle): number => {
    const n = angle % 360;

    let q = 0;
    if (n !== 0) {
      q = Math.ceil(n / 90);
    }
    return q;
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

  isDragging: boolean = false;
  lastPosX: number = 0;
  lastPosY: number = 0;

  ngOnInit() {
    const canvas = (this.__canvas = new fabric.Canvas('c'));

    this.__canvas.on('mouse:down', (o: any) => {
      if (o.e.altKey === true || o.button === 2 || o.button === 3) {
        this.isDragging = true;
        this.lastPosX = o.e.clientX;
        this.lastPosY = o.e.clientY;
        this.__canvas.selection = false;
      }
    });

    // this.__canvas.on('mouse:out', (o: any) => {
    //   this.lastPosX = 0;
    //   this.lastPosY = 0;
    // });

    this.__canvas.on('mouse:move', (o: any) => {
      if (this.isDragging) {
        const e = o.e;
        const vpt: any = this.__canvas.viewportTransform;
        const q = this.findQuadrantByAngle(this.angle);

        if (q === 0) {
          vpt[4] += e.clientX - this.lastPosX;
          vpt[5] += e.clientY - this.lastPosY;
        } else if (q === 1) {
          vpt[4] += e.clientY - this.lastPosY;
          vpt[5] -= e.clientX - this.lastPosX;
        } else if (q === 2) {
          vpt[4] -= e.clientX - this.lastPosX;
          vpt[5] -= e.clientY - this.lastPosY;
        } else if (q === 3) {
          vpt[4] -= e.clientY - this.lastPosY;
          vpt[5] += e.clientX - this.lastPosX;
        }

        this.lastPosX = e.clientX;
        this.lastPosY = e.clientY;
        this.__canvas.setViewportTransform(
          this.__canvas.viewportTransform as any
        );
      }
    });

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

    const text = new fabric.Text('hi');

    canvas.add(text);
    2;
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
