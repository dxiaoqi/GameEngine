var SCREEN_WIDTH=1000,//场景宽
	SCREEN_HEIGHT=800,//场景高
	SCREEN_BACKGROUND='lightblue',	//背景
	GAME_CTX=null,//上下文
	GAME_VIEW=null,//视图
	GAME_OFFSET=null,//离屏
	OFFSET_VIEW=null,//离屏上下文
	MAP='blue',//当前地图
	SCREEN_MAP={};//地图集
// window.onload=function () {
	
// }
class Screen{
	constructor(){
		this.background = SCREEN_BACKGROUND;
		this.width = SCREEN_WIDTH;
		this.height=SCREEN_HEIGHT;
	}
	static View(){				
		if(!Screen.instance){
			return new Screen();
		}else{
			return Screen.instance;
		}
	};

	init(width=SCREEN_WIDTH,height = SCREEN_HEIGHT,background = SCREEN_BACKGROUND){
		var View=document.createElement('canvas');
		var OffectCanvas=document.createElement('canvas');
		OffectCanvas.width=View.width = width;
		OffectCanvas.height=View.height = height;
		View.style.background = background;
		document.body.appendChild(View);
		var ctx=View.getContext('2d');
		if(ctx){
			this.view=View;
			this.ctx=ctx;
			GAME_CTX=ctx;
			GAME_VIEW=View;
			GAME_OFFSET=OffectCanvas;
			OFFSET_VIEW=OffectCanvas.getContext('2d');
		}else{
			console.log('can nor get Context 2d');
		}
	}

}

class Creame {
	constructor(bg,sprites=[]){
		this.bg=false;
		this.position ={
			x:0,
			y:0
		}
		if(GAME_CTX!=null){
			this.view=GAME_VIEW;
			this.ctx=GAME_CTX;
		}else{
			console.log('wrong !!!');
		}
	}

	/*
	设置场景
	 */
	setView(bg,x=0,y=0){
		var bg_type='color';
		/^[^.]\S+[.](jpg|png)/.test(bg)?bg_type='image':bg_type='color';
		switch (bg_type) {
			case 'image':
				MAP=bg;
				SCREEN_MAP =new Image();
				SCREEN_MAP.src=bg;
				SCREEN_MAP.onload=()=>{
					try {
						this.bg=true;
						this.position.x=x;
						this.position.y=y;
						this.ctx.drawImage(SCREEN_MAP,x,y,this.view.width,this.view.height,0,0,this.view.width,this.view.height);
					} catch(e) {
						// statements
						console.log(e);
					}
				}
				break;
			case 'color':
				this.view.style.background = bg;
				break;
			default:
				console.log('我们暂时不支持此类格式');
				break;
		}
	}
	/*
	切换场景
	 */
	toScreen(bg){	
		this.setView(bg);
	}
	move(x,y){
		var n_x=0;
		var n_y=0;
		var self=this;
			if(this.bg){
				this.ctx.save();
				this.ctx.fillStyle='blue';
				this.offsetX=x;
				this.offsetY=y;
				console.log(1)
				var state=new Promise((reslove,reject)=>{
					this.position.x=n_x=this.position.x-x;
					this.position.y=n_y=this.position.y-y;
					this.ctx.fillRect(0,0,this.view.width,this.view.height);
					reslove();
				})
				state.then(function(){
					OutCanvas(n_x,n_y);
					// self.setView(MAP,n_x,n_y);
				});
				
				this.ctx.restore();
			}


	}

}

function OutCanvas(x,y){
	let offsetCan=new Promise(function(reslove,reject){
		var bg_type='color';
		
		/^[^.]\S+[.](jpg|png)/.test(MAP)?bg_type='image':bg_type='color';
		switch (bg_type) {
			case 'image':
				SCREEN_MAP =new Image();
				SCREEN_MAP.src=MAP;
				SCREEN_MAP.onload=()=>{
					try {
						console.log(x);
						OFFSET_VIEW.clearRect(0,0,GAME_OFFSET.width,GAME_OFFSET.height);
						OFFSET_VIEW.drawImage(SCREEN_MAP,x,y,GAME_OFFSET.width,GAME_OFFSET.height,0,0,GAME_OFFSET.width,GAME_OFFSET.height);
					} catch(e) {
						// statements
						console.log(e);
					}
				}
				break;
			case 'color':
				// this.view.style.background = bg;
				break;
			default:
				console.log('我们暂时不支持此类格式');
				break;
		}
		reslove("绘制结束");
	});
	offsetCan.then(function(){
		// document.body.appendChild(GAME_OFFSET);
		try {
			GAME_CTX.drawImage(GAME_OFFSET,0,0,SCREEN_WIDTH,SCREEN_HEIGHT);
		} catch(e) {
			// statements
			console.log(e);
		}
	})
}


function MapMangger(argument) {
	this.Map=[];
}





/**
 * [ImagePainter description]
 * @param {[type]} imageUrl [图片地址]
 */
var ImagePainter = function (imageUrl) {
   this.image = new Image();
   this.image.src = imageUrl;
};

ImagePainter.prototype = {
   image: undefined,

   paint: function (sprite) {
      if (this.image !== undefined) {
         if ( ! this.image.complete) {
            this.image.onload = function (e) {
               sprite.width = this.width;
               sprite.height = this.height;
               
               Screen.drawImage(this,  // this is image
                  sprite.left, sprite.top,
                  sprite.width, sprite.height);
            };
         }
         else {
           GAME_CTX.drawImage(this.image, sprite.left, sprite.top,
                             sprite.width, sprite.height); 
         }
      }
   }
};

SpriteSheetPainter = function (cells) {
   this.cells = cells;
};

SpriteSheetPainter.prototype = {
   cells: [],
   cellIndex: 0,

   advance: function () {
      if (this.cellIndex == this.cells.length-1) {
         this.cellIndex = 0;
      }
      else {
         this.cellIndex++;
      }
   },
   
   paint: function (sprite) {
      var cell = this.cells[this.cellIndex];
      GAME_CTX.drawImage(spritesheet, cell.left, cell.top,
                                     cell.width, cell.height,
                                     sprite.left, sprite.top,
                                     cell.width, cell.height);
   }
};


var SpriteAnimator = function (painters, elapsedCallback) {
   this.painters = painters;
   if (elapsedCallback) {
      this.elapsedCallback = elapsedCallback;
   }
};

SpriteAnimator.prototype = {
   painters: [],
   duration: 1000,
   startTime: 0,
   index: 0,
   elapsedCallback: undefined,

   end: function (sprite, originalPainter) {
      sprite.animating = false;

      if (this.elapsedCallback) {
         this.elapsedCallback(sprite);
      }
      else {
         sprite.painter = originalPainter;
      }              
   },
   
   start: function (sprite, duration) {
      var endTime = +new Date() + duration,
          period = duration / (this.painters.length),
          interval = undefined,
          animator = this, 
          originalPainter = sprite.painter;

      this.index = 0;
      sprite.animating = true;
      sprite.painter = this.painters[this.index];

      interval = setInterval(function() {
         if (+new Date() < endTime) {
            sprite.painter = animator.painters[++animator.index];
         }
         else {
            animator.end(sprite, originalPainter);
            clearInterval(interval);
         }
      }, period); 
   },
};

/**
 * [Sprite description]
 * @param {[type]} name      [精灵的名字]
 * @param {[type]} painter   [绘制的行为]
 * @param {[type]} behaviors [行为]
 */
var Sprite = function (name, painter, behaviors) {
   if (name !== undefined)      this.name = name;
   if (painter !== undefined)   this.painter = painter;
   if (behaviors !== undefined) this.behaviors = behaviors;

   return this;
};

Sprite.prototype = {
   left: 0,
   top: 0,
   width: 10,
   height: 10,
	velocityX: 0,
	velocityY: 0,
   visible: true,
   animating: false,
   painter: undefined,
   behaviors: [], 

	paint: function () {
     if (this.painter !== undefined && this.visible) {
        this.painter.paint(this, GAME_CTX);//调用绘制对象的paint的属性来绘制
     }
	},

   update: function (time) {
      for (var i = this.behaviors.length; i > 0; --i) {
         this.behaviors[i-1].execute(this, GAME_CTX, time);
      }
   }
};



/**
 * requestNextAnimationFrame
 */
window.requestNextAnimationFrame =
   (function () {
      var originalWebkitRequestAnimationFrame = undefined,
          wrapper = undefined,
          callback = undefined,
          geckoVersion = 0,
          userAgent = navigator.userAgent,
          index = 0,
          self = this;

      
      if (window.webkitRequestAnimationFrame) {

         wrapper = function (time) {
           if (time === undefined) {
              time = +new Date();
           }
           self.callback(time);
         };

          
         originalWebkitRequestAnimationFrame = window.webkitRequestAnimationFrame;    

         window.webkitRequestAnimationFrame = function (callback, element) {
            self.callback = callback;

            // Browser calls the wrapper and wrapper calls the callback
            
            originalWebkitRequestAnimationFrame(wrapper, element);
         }
      }

      // Workaround for Gecko 2.0, which has a bug in
      // mozRequestAnimationFrame() that restricts animations
      // to 30-40 fps.

      if (window.mozRequestAnimationFrame) {

         
         index = userAgent.indexOf('rv:');

         if (userAgent.indexOf('Gecko') != -1) {
            geckoVersion = userAgent.substr(index + 3, 3);

            if (geckoVersion === '2.0') {
               // Forces the return statement to fall through
               // to the setTimeout() function.

               window.mozRequestAnimationFrame = undefined;
            }
         }
      }
      
      return window.requestAnimationFrame   ||
         window.webkitRequestAnimationFrame ||
         window.mozRequestAnimationFrame    ||
         window.oRequestAnimationFrame      ||
         window.msRequestAnimationFrame     ||

         function (callback, element) {
            var start,
                finish;

            window.setTimeout( function () {
               start = +new Date();
               callback(start);
               finish = +new Date();

               self.timeout = 1000 / 60 - (finish - start);

            }, self.timeout);
         };
      }
   )
();
