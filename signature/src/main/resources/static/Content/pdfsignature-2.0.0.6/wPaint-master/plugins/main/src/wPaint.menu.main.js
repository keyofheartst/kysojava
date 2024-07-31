(function ($) {

  // setup menu
  $.fn.wPaint.menus.main = {
    img: 'plugins/main/img/icons-menu-main.png',
    items: {
      undo: {
        icon: 'generic',
        title: 'Undo',
        index: 0,
        callback: function () { this.undo(); }
      },
      redo: {
        icon: 'generic',
        title: 'Redo',
        index: 0,
        callback: function () { this.redo(); }
      },
      clear: {
          icon: 'generic',
        title: 'Clear',
        index: 0,
        callback: function () { this.clear(); }
      },
        pencil: {
        icon: 'activate',
        title: 'Pencil',
        index: 0,
        callback: function () { this.setMode('pencil'); }
      },
        highlight: {
        title: 'Highlight',
            icon: 'activate',
            index: 0,
            callback: function () { this.setMode('highlight'); }
        },
        lineWidth: {
            icon: 'select',
            title: 'Stroke Width',
            range: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
            value: 1,
            callback: function (width) { this.setLineWidth(width); }
        },
      strokeStyle: {
        icon: 'colorPicker',
        title: 'Stroke Color',
        callback: function (color) { this.setStrokeStyle(color); }
      }      
    }
  };

  // extend cursors
  $.extend($.fn.wPaint.cursors, {
    'default': {path: 'plugins/main/img/cursor-crosshair.png', left: 7, top: 7},
    dropper:   {path: 'plugins/main/img/cursor-dropper.png', left: 0, top: 12},
    pencil:    {path: 'plugins/main/img/cursor-pencil.png', left: 0, top: 11.99},
    bucket:    {path: 'plugins/main/img/cursor-bucket.png', left: 0, top: 10},
    eraser1:   {path: 'plugins/main/img/cursor-eraser1.png', left: 1, top: 1},
    eraser2:   {path: 'plugins/main/img/cursor-eraser2.png', left: 2, top: 2},
    eraser3:   {path: 'plugins/main/img/cursor-eraser3.png', left: 2, top: 2},
    eraser4:   {path: 'plugins/main/img/cursor-eraser4.png', left: 3, top: 3},
    eraser5:   {path: 'plugins/main/img/cursor-eraser5.png', left: 3, top: 3},
    eraser6:   {path: 'plugins/main/img/cursor-eraser6.png', left: 4, top: 4},
    eraser7:   {path: 'plugins/main/img/cursor-eraser7.png', left: 4, top: 4},
    eraser8:   {path: 'plugins/main/img/cursor-eraser8.png', left: 5, top: 5 },
    eraser9:   {path: 'plugins/main/img/cursor-eraser9.png', left: 5, top: 5},
    eraser10:  {path: 'plugins/main/img/cursor-eraser10.png', left: 6, top: 6}
  });

  // extend defaults
  $.extend($.fn.wPaint.defaults, {
    mode:        'pencil2',  // set mode
    lineWidth:   '1',       // starting line width
    fillStyle:   '#FFFFFF', // starting fill style
    strokeStyle: '#FFFF00'  // start stroke style
  });

  // extend functions
  $.fn.wPaint.extend({
    //undoCurrent: -1,
    //undoArray: [],
    setUndoFlag: true,
      drawPencil: false,

    generate: function () {
      this.menus.all.main = this._createMenu('main', {
        offsetLeft: this.options.menuOffsetLeft,
        offsetTop: this.options.menuOffsetTop
      });
    },

    _init: function () {
      // must add undo on init to set the first undo as the initial drawing (bg or blank)
      this._addUndo();
        //this.menus.all.main._setIconDisabled('clear', true);
        this.memCanvas.width = this.canvasContent.context.width;
        this.memCanvas.height = this.canvasContent.context.height;
        this.memCtx.strokeStyle = this.options.strokeStyle;
        this.memCtx.fillStyle = this.options.strokeStyle;
        this.memCtx.lineWidth = this.options.lineWidth;

        this.ctx.lineJoin = 'round';
        this.ctx.lineCap = 'round';
        this.ctx.strokeStyle = this.options.strokeStyle;
        this.ctx.fillStyle = this.options.strokeStyle;
        this.ctx.lineWidth = this.options.lineWidth;

        //$(".wPaint-menu-select").mCustomScrollbar({
        //    theme: "minimal-dark"
        //});
    },

      setStrokeStyle: function (color) {
          if (this.options.mode === 'pencil' || this.options.mode === 'text') {
              this.options.strokeStyle = color;
          } else {
              this.previousPencilColor = color;
          }
      //this.menus.all.main._setColorPickerValue('strokeStyle', color);
      },

      getStrokeStyle: function () {
          return this.options.strokeStyle;
      },

    setLineWidth: function (width) {
      this.options.lineWidth = width;
      //this.menus.all.main._setSelectValue('lineWidth', width);

      this.setCursor(this.options.mode);
      },
      getLineWidth: function () {
          return this.options.lineWidth;
      },
      setHighlight: function () {
          this.setLineWidth(15);
      },

      setFillStyle: function (color) {
      this.options.fillStyle = color;
      //this.menus.all.main._setColorPickerValue('fillStyle', color);
      },

      setRatio: function (ratio) {
          this.ratio = ratio;
      },

    setCursor: function (cursor) {
      if (cursor === 'eraser') {
        this.setCursor('eraser' + this.options.lineWidth);
      }
    },

    /****************************************
     * undo / redo
     ****************************************/
      undo: function () {
          if (this.menus.all.main._isIconDisabled('undo')) {
              return;
          }
          this.undoArrayPoints.push(this.arrayPoints.pop());
          this._redraw();
      //if (this.undoArray[this.undoCurrent - 1]) {
      //  this._setUndo(--this.undoCurrent);
      //}

      this._undoToggleIcons();
    },

      redo: function () {
          if (this.menus.all.main._isIconDisabled('redo')) {
              return;
          }
          this.arrayPoints.push(this.undoArrayPoints.pop());
          this._redraw();
      //if (this.undoArray[this.undoCurrent + 1]) {
      //  this._setUndo(++this.undoCurrent);
      //}

      this._undoToggleIcons();
      },

      _redrawText: function (text) {
          this.ctx.clearRect(0, 0, this.width, this.height);
          this.ctx.strokeStyle = this.options.strokeStyle;
          this.ctx.fillStyle = this.options.strokeStyle;
          this.ctx.font = '36px ' + $('.template-sign-type.active').data('font');
          let x = this.ctx.measureText(text);
          let textWidth = this.ctx.measureText(text).width,
              textHeight = this.ctx.measureText(text).height;
          this.ctx.fillText(text, this.width / 2 - textWidth / 2, this.height / 2 + 10);
          this.options.onTextUp.apply(this);
      },

      _redraw: function () {
          let p = this;
          this.ctx.clearRect(0, 0, this.width, this.height);
          this.memCtx.clearRect(0, 0, this.width, this.height);
          $.each(this.arrayPoints, function (index, points) {
              p.options.lineWidth = points.width;
              p.options.strokeStyle = points.style;

              p.ctx.clearRect(0, 0, p.canvasContent.context.width, p.canvasContent.context.height);
              p.ctx.drawImage(p.memCanvas, 0, 0);
              p._drawPoints(p.ctx, points.points);
              p.ctx.closePath();
              p.memCtx.clearRect(0, 0, p.memCanvas.width, p.memCanvas.height);
              p.memCtx.drawImage(p.canvasContent.context, 0, 0);
          });
          if (this.arrayPoints.length === 0) {
              this.menus.all.main._setIconDisabled('clear', true);
          } else {
              this.menus.all.main._setIconDisabled('clear', false);
          }
      },


      isStylus: function () {
          if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
              $('#console').text('Mobile browser');
          }
          console.log('Not mobile browser');
          return true;
      },

      _addUndo: function (init) {
          if (this.points.length === 0) {
              return;
          }
          let d = {
              width: this.options.lineWidth,
              style: this.options.strokeStyle,
              points: this.points
          };
          this.arrayPoints.push(d);
          this._undoToggleIcons();
          this.menus.all.main._setIconDisabled('clear', false);
          return;


      //if it's not at the end of the array we need to repalce the current array position
      //if (this.undoCurrent < this.undoArray.length - 1) {
      //    this.undoArray[++this.undoCurrent] = this.getImage(false);
      //}
      //else { // owtherwise we push normally here
      //    this.undoArray.push(this.getImage(false));
      //    if (init) {
      //        this.undoArrayPoints.push(this.points);
      //    }

      //  //if we're at the end of the array we need to slice off the front - in increment required
      //  if (this.undoArray.length > this.undoMax) {
      //    this.undoArray = this.undoArray.slice(1, this.undoArray.length);
      //  }
      //  //if we're NOT at the end of the array, we just increment
      //  else { this.undoCurrent++; }
      //}

      ////for undo's then a new draw we want to remove everything afterwards - in most cases nothing will happen here
      //    let loop = 1;
      //    while (this.undoCurrent !== this.undoArray.length - 1) {
      //        if (loop > 100) {
      //            console.error('Infinity loop');
      //            break;
      //        }
      //        this.undoArray.pop();
      //        loop++;
      //  }

      //this._undoToggleIcons();
      //this.menus.all.main._setIconDisabled('clear', false);
    },

      _undoToggleIcons: function () {
      var undoIndex = (this.undoCurrent > 0 && this.undoArray.length > 1) ? 0 : 1,
              redoIndex = (this.undoCurrent < this.undoArray.length - 1) ? 2 : 3;
          undoIndex = this.arrayPoints.length > 0 ? 0 : 1;
          redoIndex = this.undoArrayPoints.length > 0 ? 2 : 3;
          

      this.menus.all.main._setIconDisabled('undo', undoIndex === 1 ? true : false);
      this.menus.all.main._setIconDisabled('redo', redoIndex === 3 ? true : false);
    },

    _setUndo: function (undoCurrent) {
      this.setImage(this.undoArray[undoCurrent], null, null, true);
    },

    /****************************************
     * clear
     ****************************************/
    clear: function () {

      // only run if not disabled (make sure we only run one clear at a time)
      if (!this.menus.all.main._isIconDisabled('clear')) {
          this.ctx.clearRect(0, 0, this.width, this.height);
          this.memCtx.clearRect(0, 0, this.width, this.height);
          //this._addUndo();
          this.arrayPoints = [];
          this.undoArrayPoints = [];
          this._undoToggleIcons();
        this.menus.all.main._setIconDisabled('clear', true);
      }
      },

    /**
     * rectangle
     * @param {any} e rectangle
     */
    _drawRectangleDown: function (e) { this._drawShapeDown(e); },

    _drawRectangleMove: function (e) {
      this._drawShapeMove(e);

      this.ctxTemp.rect(e.x, e.y, e.w, e.h);
      this.ctxTemp.stroke();
      this.ctxTemp.fill();
    },

    _drawRectangleUp: function (e) {
      this._drawShapeUp(e);
      this._addUndo();
    },

    /**
     * ellipse
     * @param {any} e ellipse
     */
    _drawEllipseDown: function (e) { this._drawShapeDown(e); },

    _drawEllipseMove: function (e) {
      this._drawShapeMove(e);

      this.ctxTemp.ellipse(e.x, e.y, e.w, e.h);
      this.ctxTemp.stroke();
      this.ctxTemp.fill();
    },

    _drawEllipseUp: function (e) {
      this._drawShapeUp(e);
      this._addUndo();
    },

    /**
     * line
     * @param {any} e any
     */
    _drawLineDown: function (e) { this._drawShapeDown(e); },

    _drawLineMove: function (e) {
      this._drawShapeMove(e, 1);

      var xo = this.canvasTempLeftOriginal;
      var yo = this.canvasTempTopOriginal;
      
      if (e.pageX < xo) { e.x = e.x + e.w; e.w = e.w * - 1; }
      if (e.pageY < yo) { e.y = e.y + e.h; e.h = e.h * - 1; }
      
      this.ctxTemp.lineJoin = 'round';
      this.ctxTemp.beginPath();
      this.ctxTemp.moveTo(e.x, e.y);
      this.ctxTemp.lineTo(e.x + e.w, e.y + e.h);
      this.ctxTemp.closePath();
      this.ctxTemp.stroke();
    },

    _drawLineUp: function (e) {
      this._drawShapeUp(e);
      this._addUndo();
      },

      /**
       * pencil
       * @param {any} e any
       */
      _drawHighlightDown: function (e) {
          this.drawPencil = true;
          this.points = [];
          this.points.push({
              x: e.pageX * 1.0 / this.ratio,
              y: e.pageY * 1.0 / this.ratio
          });
          this._drawPoints(this.ctx, this.points);
      },

      _drawHighlightMove: function (e) {
          if (this.drawPencil) {
              this.ctx.clearRect(0, 0, this.canvasContent.context.width, this.canvasContent.context.height);
              this.ctx.drawImage(this.memCanvas, 0, 0);
              this.points.push({
                  x: e.pageX * 1.0 / this.ratio,
                  y: e.pageY * 1.0 / this.ratio
              });
              this._drawPoints(this.ctx, this.points);
          }
      },

      _drawHighlightUp: function () {
          this.ctx.closePath();
          if (this.drawPencil) {
              this.drawPencil = false;
              this.memCtx.clearRect(0, 0, this.memCanvas.width, this.memCanvas.height);
              this.memCtx.drawImage(this.canvasContent.context, 0, 0);
          }
          this._addUndo();
      },



    /**
     * pencil
     * @param {any} e any
     */
      _drawPencilDown: function (e) {
          $('#console').text(e.type);
          this.drawPencil = true;
          this.points = [];
          this.points.push({
              x: e.pageX * 1.0 / this.ratio,
              y: e.pageY * 1.0 / this.ratio
        });
        this._drawPoints(this.ctx, this.points);
      },
    
    _drawPencilMove: function (e) {
        if (this.drawPencil) {
            this.ctx.clearRect(0, 0, this.canvasContent.context.width, this.canvasContent.context.height);
            this.ctx.drawImage(this.memCanvas, 0, 0);
            this.points.push({
                x: e.pageX * 1.0 / this.ratio,
                y: e.pageY * 1.0 / this.ratio
            });
            this._drawPoints(this.ctx, this.points);
        }
      },

      _drawPencilUp: function () {
          this.ctx.closePath();
          if (this.drawPencil) {
              this.drawPencil = false;
              this.memCtx.clearRect(0, 0, this.memCanvas.width, this.memCanvas.height);
              this.memCtx.drawImage(this.canvasContent.context, 0, 0);
          }
          this._addUndo();
      },

      _drawPoints(ctx, points) {
          // draw a bunch of quadratics, using the average of two points as the control point
          ctx.lineWidth = this.options.lineWidth * this.ratio;
          if (ctx.lineWidth < 1.0) {
              ctx.lineWidth = 1.0;
          }
          ctx.strokeStyle = this.options.strokeStyle;
          ctx.fillStyle = this.options.strokeStyle;
          ctx.shadowBlur = 0;
          // draw a basic circle instead
          if (points.length < 3) {
              var b = points[0];
              ctx.beginPath(), ctx.arc(b.x * this.ratio, b.y * this.ratio, ctx.lineWidth / 4, 0, Math.PI * 2, !0), ctx.fill(), ctx.closePath();
              return;
          }
          ctx.beginPath(), ctx.moveTo(points[0].x * this.ratio, points[0].y * this.ratio);

          for (i = 1; i < points.length - 2; i++) {
              var c = (points[i].x * this.ratio + points[i + 1].x * this.ratio) / 2,
                  d = (points[i].y * this.ratio + points[i + 1].y * this.ratio) / 2;
              ctx.quadraticCurveTo(points[i].x * this.ratio, points[i].y * this.ratio, c, d);
          }
          ctx.quadraticCurveTo(points[i].x * this.ratio, points[i].y * this.ratio, points[i + 1].x * this.ratio, points[i + 1].y * this.ratio), ctx.stroke();
      },

      _drawPointsRatio(ctx, points) {
          // draw a bunch of quadratics, using the average of two points as the control point
          ctx.lineWidth = this.options.lineWidth;
          if (ctx.lineWidth < 1.0) {
              ctx.lineWidth = 1.0;
          }
          ctx.strokeStyle = this.options.strokeStyle;
          ctx.fillStyle = this.options.strokeStyle;
          ctx.shadowBlur = 0;
          // draw a basic circle instead
          if (points.length < 3) {
              var b = points[0];
              ctx.beginPath(), ctx.arc(b.x, b.y, ctx.lineWidth / 4, 0, Math.PI * 2, !0), ctx.fill(), ctx.closePath();
              return;
          }
          ctx.beginPath(), ctx.moveTo(points[0].x, points[0].y);

          for (i = 1; i < points.length - 2; i++) {
              var c = (points[i].x + points[i + 1].x) / 2,
                  d = (points[i].y + points[i + 1].y) / 2;
              ctx.quadraticCurveTo(points[i].x, points[i].y, c, d);
          }
          ctx.quadraticCurveTo(points[i].x, points[i].y, points[i + 1].x, points[i + 1].y), ctx.stroke();
      },

    /**
     * eraser
     * @param {any} e any
     */
    _drawEraserDown: function (e) {
      this.ctx.save();
        this.ctx.globalCompositeOperation = 'destination-out';
      this._drawPencilDown(e);
    },
    
    _drawEraserMove: function (e) {
      this._drawPencilMove(e);
    },
    
    _drawEraserUp: function (e) {
        this._drawPencilUp(e);
        this.memCtx.restore();
      this.ctx.restore();
    },

    /**
     * 
     * @param {any} e any
     */
    _drawBucketDown: function (e) {
      this.ctx.fillArea(e.pageX, e.pageY, this.options.fillStyle);
      this._addUndo();
    }
  });
})(jQuery);
