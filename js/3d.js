// THREEJS STUFF
//
//
        var camera, camera2, scene, scene2, renderer, renderer2, group;
	var mesh2, mesh3;

        function init() {
	// FIRST... THE CAR
	// CAMERA
            camera = new THREE.PerspectiveCamera(70,1,0.01,10);
	    camera.position.x = -1;
	    camera.position.y = 0.15;
	    camera.lookAt(0,0,0);
            scene = new THREE.Scene();
	    const material = new THREE.MeshNormalMaterial();
	    material.transparent=true;
	    material.opacity=0.7;
	// CAR
	    group = new THREE.Group();
            var box = new THREE.BoxGeometry(0.8,0.4,0.05);
            var mesh = new THREE.Mesh(box,material);
            var wheel = new THREE.CylinderGeometry(0.15,0.15,0.05,30);
	    group.add(mesh);
            mesh = new THREE.Mesh(wheel,material);
	    mesh.position.set(0.3,0.23,0);
	    group.add(mesh);
            mesh = new THREE.Mesh(wheel,material);
            mesh.position.set(0.3,-0.23,0);
            group.add(mesh);
            mesh = new THREE.Mesh(wheel,material);
            mesh.position.set(-0.3,0.23,0);
            group.add(mesh);
            mesh = new THREE.Mesh(wheel,material);
            mesh.position.set(-0.3,-0.23,0);
            group.add(mesh);
            scene.add(group);
	// CAR TEXT
	    const loader = new THREE.FontLoader();
	    loader.load('https://unpkg.com/three@0.134.0/examples/fonts/droid/droid_sans_bold.typeface.json',function(font){
	    	textGeo = new THREE.TextGeometry("F", { size: 0.2, height: 0.025, curveSegments: 4, font: font });
		textMesh1 = new THREE.Mesh(textGeo,material);
		textMesh1.position.x = -0.4;
		textMesh1.position.y = 0.05;
		textMesh1.position.z = -0.05;
		textMesh1.rotation.x = Math.PI;
		textMesh1.rotation.y = Math.PI / 2;
		textMesh1.rotation.z = Math.PI / 2;
        	group.add(textMesh1);
                textGeo = new THREE.TextGeometry("B", { size: 0.1, height: 0.025, curveSegments: 4, font: font });
                textMesh2 = new THREE.Mesh(textGeo,material);
                textMesh2.position.x = 0.4;
                textMesh2.position.y = 0.05;
                textMesh2.position.z = 0.15;
                textMesh2.rotation.x = Math.PI;
                textMesh2.rotation.y = Math.PI / 2;
                textMesh2.rotation.z = Math.PI / 2;
        	group.add(textMesh2);
	    });
	// RENDER CAR
            renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
            renderer.setSize($("#3dcar").innerWidth(),$("#3dcar").innerHeight());
	    $("#3dcar").append(renderer.domElement);
	// THEN, THE WHEELS
	// CAMERA
            camera2 = new THREE.OrthographicCamera(-1/2,1/2,1/2,-1/2,0.01,10);
            camera2.position.z = -1;
            camera2.lookAt(0,0,0);
            scene2 = new THREE.Scene();
	// WHEELS
            var wheel2 = new THREE.CylinderGeometry(0.2,0.2,0.075,30);
            mesh2 = new THREE.Mesh(wheel2,material);
            mesh2.position.set(0.3,0,0);
	    mesh2.rotation.z = Math.PI / 2;
            mesh3 = new THREE.Mesh(wheel2,material);
            mesh3.position.set(-0.3,0,0);
	    mesh3.rotation.z = Math.PI / 2;
            scene2.add(mesh2);
            scene2.add(mesh3);
	// RENDER WHEELS
            renderer2 = new THREE.WebGLRenderer({ antialias: true, alpha: true });
            renderer2.setSize($("#3dwheels").innerWidth(),$("#3dwheels").innerHeight());
	    $("#3dwheels").append(renderer2.domElement);
        }

        function animate() {
            requestAnimationFrame(animate);
            renderer.render(scene,camera);
            renderer2.render(scene2,camera2);
        }
