var buildings,renderer,scene,camera,lights,controls,clock,initialized;
var friends;
function init() {
	clock=new THREE.Clock(true);
	buildings=new Array();
	renderer = new THREE.WebGLRenderer();
	scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera(35,800/600,0.1,10000);
	camera.position.set(-50,160,130);
	lights=new Array();
	controls = new THREE.FirstPersonControls( camera );
	renderer. setSize( window.innerWidth, window.innerHeight );
	document.body.appendChild( renderer.domElement );
	$('canvas').attr("style","position:absolute;top:0px;left:0px;z-index:-1;");
	scene.add( camera );
	for(var i=0;i<6;i++) {
		lights.push(new THREE.PointLight( 0xFFFFFF ));
	}
	lights[0].position.set( 1000000, 0, 0 );
	lights[1].position.set( -1000000, 0, 0 );
	lights[2].position.set( 0, 1000000, 0 );
	lights[3].position.set( 0, -1000000, 0 );
	lights[4].position.set( 0, 0, 1000000 );
	lights[5].position.set( 0, 0, -1000000 );
	for(var i=0;i<6;i++) {
		scene.add( lights[i] );
	}
	controls.movementSpeed=50;
	controls.lookSpeed=0.05;
	var plane=new THREE.Mesh(new THREE.PlaneGeometry(10000,10000),new THREE.MeshLambertMaterial( { color: 0xCCCCCC } ));
	plane.rotation.x=-1.57;
	plane.position.set(0,0,0);
	plane.name="ground";
	scene.add(plane);
	animate();
}
function animate() {
	requestAnimationFrame( animate );
	render();
}
function render() {
	controls.update( clock.getDelta() );
	renderer.render( scene, camera );
}

document.addEventListener( 'mousedown', onDocumentMouseDown, false );
function onDocumentMouseDown( event ) {
	if(event.button==2) {
		event.preventDefault();
		var ray = new THREE.Ray(camera.position,null);
		var projector = new THREE.Projector();
		var mouse3D = projector.unprojectVector( new THREE.Vector3( ( event.clientX / renderer.domElement.width ) * 2 - 1, - ( event.clientY / renderer.domElement.height ) * 2 + 1, 0.5 ), camera );
		ray.direction=mouse3D.subSelf(camera.position).normalize();
		var intersects=ray.intersectObjects(scene.__objects);
		if (intersects.length>0&&intersects[0].object.name!="ground") {
			window.open(intersects[0].object.name);
		}
	}
}

function login() {
    FB.login(function(response) {
        if (response.authResponse) {
			getFacebookData();
        } else {
            // cancelled
        }
    }, {scope: 'user_likes'});
}

function getLogin() {
	
	FB.getLoginStatus(function(response) {
	    if (response.status === 'connected') {
			getFacebookData();
	    } else if (response.status === 'not_authorized') {
			$('.login').show();
	    } else {
			$('.login').show();
	    }
	}, true);
}

window.fbAsyncInit = function() {
	initialized=true;
  FB.init({ 
    appId: '237522263048090',
    status: true,
    cookie: true,
    xfbml: true,
    frictionlessRequests: true,
    useCachedDialogs: true,
    oauth: true
  });
getLogin();

};
(function(d){
 var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
 if (d.getElementById(id)) {return;}
 js = d.createElement('script'); js.id = id; js.async = true;
 js.src = "//connect.facebook.net/en_US/all.js";
 ref.parentNode.insertBefore(js, ref);
}(document));
$(function() {
	if(!initialized) {
		window.fbAsyncInit();
	}
});