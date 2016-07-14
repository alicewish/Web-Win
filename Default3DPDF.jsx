runtime.overrideViewChange = true;
activeCamera = scene.cameras.getByIndex( 0 );
bounds = scene.computeBoundingBox();
bounds.center = bounds.max.blend( bounds.min, .5 );
diag = bounds.max.subtract( bounds.min ).length;
dist =(diag * 0.5) / Math.tan(0.6 * activeCamera.fov);
activeCamera.position.set3(bounds.center.x, bounds.center.y, bounds.center.z + dist);
activeCamera.targetPosition.set(bounds.center);
activeCamera.up.set3(0, 1, 0);
activeCamera.roll = 0
scene.lightScheme = scene.LIGHT_MODE_HEADLAMP;
scene.renderMode = scene.RENDER_MODE_SHADED_SOLID_WIRFRAME;
runtime.overrideViewChange = false;
