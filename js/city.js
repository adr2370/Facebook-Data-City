function makeCity(numbers,labels) {
	var buildingArray,buildingSpace,currX,currZ;
	initializeCity();
	return buildingArray;
	function initializeCity() {
		buildingSpace=15;
		currX=0;
		currZ=0;
		buildingArray=new Array();
		for(var i=0;i<numbers.length;i++) {
			makeBuilding(currX,0,currZ,5,numbers[i],1);
			var step=i+2;
			var s=Math.floor(Math.sqrt(step));
			if(s%2==0) s--;
			var diff=step-s*s;
			if(diff<=1) {
				currZ+=15;
			} else if(diff<=s+1) {
				currX+=buildingSpace;
			} else if(diff<=s*2+2) {
				currZ-=buildingSpace;
			} else if(diff<=s*3+3) {
				currX-=buildingSpace;
			} else {
				currZ+=buildingSpace;
			}
		}
	}
	function makeBuilding(x,y,z,windows,floors,squareSize) {
		var buildingColor=Math.floor(Math.random()*0xEEEEEE);
		var height=squareSize*(floors*3);
		var side=(windows*2+1)*squareSize;
		var texture = new THREE.Texture();
		texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
		texture.repeat.set( 1, floors );
		var loader = new THREE.ImageLoader();
		loader.addEventListener( 'load', function ( event ) {
			texture.image = event.content;
			texture.needsUpdate = true;
		} );
		loader.load( 'img/building.png' );
		var canvas1=document.createElement('canvas');
		canvas1.width=100;
		canvas1.height=100;
		var ctx=canvas1.getContext("2d");
		ctx.rect(0,0,canvas1.width,canvas1.height);
		ctx.fillStyle="rgba(0,0,0,1)";
		ctx.fill();
		ctx.fillStyle = "rgba(255,255,255,1)";
		ctx.textAlign = 'center';
		if(labels[0] instanceof Array) {
			if(labels.length>=2) {
				var currSize=21;
				do
				{
					currSize--;
					ctx.font="Bold "+currSize+"px Arial";
				} while(ctx.measureText(labels[buildingArray.length][0]).width>100);
				ctx.fillText(labels[buildingArray.length][0],50,40);
				currSize=21;
				do
				{
					currSize--;
					ctx.font="Bold "+currSize+"px Arial";
				} while(ctx.measureText(labels[buildingArray.length][1]).width>100);
				ctx.fillText(labels[buildingArray.length][1],50,70);
			} else {
				var currSize=21;
				do
				{
					currSize--;
					ctx.font="Bold "+currSize+"px Arial";
				} while(ctx.measureText(labels[buildingArray.length][0]).width>100);
				ctx.fillText(labels[buildingArray.length][0],50,55);
			}
		} else {
			var currSize=21;
			do
			{
				currSize--;
				ctx.font="Bold "+currSize+"px Arial";
			} while(ctx.measureText(labels[buildingArray.length]).width>100);
			ctx.fillText(labels[buildingArray.length],50,55);
		}
		var texture2 = new THREE.Texture(canvas1);
		texture2.needsUpdate = true;
		var sideFace=new THREE.MeshBasicMaterial({map: texture});
		var topFace=new THREE.MeshBasicMaterial({map: texture2, transparent: false});
		var bottomFace=new THREE.MeshBasicMaterial({color: 0x000000});
		var materials = [];
		for (var i=0; i<6; i++) {
			if(i<2||i>3) {
				materials.push(sideFace);
			} else if(i==2) {
				materials.push(topFace);
			} else {
				materials.push(bottomFace);
			}
		}
		var cubeGeo = new THREE.CubeGeometry(side,height,side);
		var cube = new THREE.Mesh(cubeGeo, new THREE.MeshFaceMaterial(materials));
		cube.position.x=x+side/2;
		cube.position.y=y+height/2;
		cube.position.z=z+side/2;
		buildingArray.push(cube);
	}
	function makeCoolBuilding(x,y,z,windows,floors,squareSize) {
		var buildingColor=Math.floor(Math.random()*0xEEEEEE);
		var currX=x;
		var currY=y;
		var currZ=z;
		var cube;
		var height=squareSize*(floors*3);
		var length=windows*2+1;
		var side=length*squareSize;
		var buildingGeometry = new THREE.CubeGeometry( 0, 0, 0 );
		var windowGeometry = new THREE.CubeGeometry( 0, 0, 0 );
		for(currY=y;currY<=height+y;currY+=squareSize) {
			var currLevel=currY-y;
			currLevel/=squareSize;
			for(currX=x;currX<x+side;currX+=squareSize) {
				for(currZ=z;currZ<z+side;currZ+=squareSize) {
					if(currY==y||currY==height+y||currX==x||currX==x+side-squareSize||currZ==z||currZ==z+side-squareSize) {
						var color1=buildingColor;
						var shouldChange=false;
						if((currX==x||currX==x+side-squareSize)&&((currZ-z)/squareSize)%2==1) shouldChange=true;
						if((currZ==z||currZ==z+side-squareSize)&&((currX-x)/squareSize)%2==1) shouldChange=true;
						if(shouldChange&&(currLevel%3==1||currLevel%3==2)) {
							color1=0x000000;
						}	
						cube = new THREE.Mesh(
						                        new THREE.CubeGeometry( squareSize, squareSize, squareSize ),
						                        new THREE.MeshLambertMaterial( { color: color1 } )
						                    );
						cube.position.x=currX;
						cube.position.y=currY;
						cube.position.z=currZ;
						if(color1==0x000000) {
							THREE.GeometryUtils.merge(windowGeometry, cube);
						} else {
							THREE.GeometryUtils.merge(buildingGeometry, cube);
						}
					}
				}
			}
		}
		for(currY=height+y;currY<height+y+side;currY+=squareSize) {
			var diff=(currY-height-y)/2;
			for(currX=x+diff;currX<x+side-diff;currX+=squareSize) {
				for(currZ=z+diff;currZ<z+side-diff;currZ+=squareSize) {
					var color1=buildingColor;
					cube = new THREE.Mesh(
					                        new THREE.CubeGeometry( squareSize, squareSize, squareSize ),
					                        new THREE.MeshLambertMaterial( { color: color1 } )
					                    );
					cube.position.x=currX;
					cube.position.y=currY;
					cube.position.z=currZ;
					if(color1==0x000000) {
						THREE.GeometryUtils.merge(windowGeometry, cube);
					} else {
						THREE.GeometryUtils.merge(buildingGeometry, cube);
					}
				}
			}
		}
		buildingArray.push(new THREE.Mesh( buildingGeometry, new THREE.MeshLambertMaterial( { color: buildingColor } ) ));
		buildingArray.push(new THREE.Mesh( windowGeometry, new THREE.MeshLambertMaterial( { color: 0x000000 } ) ));
	}
}