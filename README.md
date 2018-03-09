# GameEngine
基于canvas的游戏引擎
进度:相机的生成与移动，以及小精灵的绘制，目前正在完善精灵与动画部分
```javascript
	var c=Screen.View();    //创建视图
		c.init();             //视图初始化
		var s=new Creame();   //生成相机
		// s.setView('star.jpg',200,10);这里可以设置背景图片或者颜色
		var draw=new Sprite('draw',{//在paint里绘制
			paint:function(sprite,ctx){
				ctx.save();
				sprite.left=500;
				sprite.top=400;
				sprite.width=200;
				sprite.height=300;
				ctx.fillStyle='white';
				ctx.strokeStyle='rgb(100,100,195)';
				ctx.fillRect(sprite.left,sprite.top,sprite.width,sprite.height);
           		ctx.shadowColor = 'rgb(120,0,0)';
            	ctx.shadowOffsetX = -4;
            	ctx.shadowOffsetY = -4;
            	ctx.shadowBlur = 8;
            	ctx.fill();
            	ctx.stroke();
            	ctx.restore();

			}
		});
		draw.paint();//执行绘制，也可以使用sprite.x等来操作属性
```
