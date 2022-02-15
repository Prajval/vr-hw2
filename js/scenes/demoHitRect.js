import * as cg from "../render/core/cg.js";
import { controllerMatrix, buttonState } from "../render/core/controllerInput.js";

   let cx, cy, tx, ty, theta;

   let cPlaying = false;
   let dPlaying = false;
   let ePlaying = false;
   let fPlaying = false;
   let gPlaying = false;
   let aPlaying = false;
   let bPlaying = false;

   export const init = async model => {
      cx = 0, cy = 1.5, tx = 0, ty = 0, theta = 0;

      model.control('a', 'left' , () => tx -= .1);
      model.control('s', 'down' , () => ty -= .1);
      model.control('d', 'right', () => tx += .1);
      model.control('w', 'up'   , () => ty += .1);

      model.control('l', 'controller left'  , () => cx -= .1);
      model.control('r', 'controller right' , () => cx += .1);

      model.control('f', 'rotate left'  , () => theta -= .1);
      model.control('g', 'rotate right' , () => theta += .1);

      // CREATE THE TARGET

      let target = model.add();
      //target.add('cube').scale(1,1,.001);

      // CREATE THE LASER BEAMS FOR THE LEFT AND RIGHT CONTROLLERS

      let beamL = model.add();
      beamL.add('cube').color(0,0,1).move(.02,0,0).scale(.02,.005,.005);
      beamL.add('cube').color(0,1,0).move(0,.02,0).scale(.005,.02,.005);
      beamL.add('tubeZ').color(1,0,0).move(0,0,-10).scale(.001,.001,10);

      let beamR = model.add();
      beamR.add('cube').color(1,0,0).move(.02,0,0).scale(.02,.005,.005);
      beamR.add('cube').color(0,0,1).move(0,.02,0).scale(.005,.02,.005);
      beamR.add('tubeZ').color(0,1,0).move(0,0,-10).scale(.001,.001,10);

      let piano = model.add();
      piano.add('cube').color(1,1,1).move(0,1.5,0).scale(0.1,0.2,0.001);
      piano.add('cube').color(1,1,1).move(0.25,1.5,0).scale(0.1,0.2,0.001);
      piano.add('cube').color(1,1,1).move(0.5,1.5,0).scale(0.1,0.2,0.001);
      piano.add('cube').color(1,1,1).move(0.75,1.5,0).scale(0.1,0.2,0.001);
      piano.add('cube').color(1,1,1).move(-0.25,1.5,0).scale(0.1,0.2,0.001);
      piano.add('cube').color(1,1,1).move(-0.5,1.5,0).scale(0.1,0.2,0.001);
      piano.add('cube').color(1,1,1).move(-0.75,1.5,0).scale(0.1,0.2,0.001);
   }

   export const display = model => {
      model.animate(() => {

         // GET THE CURRENT MATRIX AND TRIGGER INFO FOR BOTH CONTROLLERS

         let matrixL  = controllerMatrix.left;
         let triggerL = buttonState.left[0].pressed;

         let matrixR  = controllerMatrix.right;
         let triggerR = buttonState.right[0].pressed;

	 // ANIMATE THE TARGET

         let target = model.child(0);
         target.identity()
               .move(tx, 1.5 + ty, 0)
               .turnY(theta + Math.sin(model.time))
               .scale(.3,.2,1);

         // PLACE THE LASER BEAMS TO EMANATE FROM THE CONTROLLERS
         // IF NOT IN VR MODE, PLACE THE BEAMS IN DEFAULT POSITIONS

         let LM = matrixL.length ? cg.mMultiply(matrixL, cg.mTranslate( .006,0,0)) : cg.mTranslate(cx-.2,cy,1);
         let RM = matrixR.length ? cg.mMultiply(matrixR, cg.mTranslate(-.001,0,0)) : cg.mTranslate(cx+.2,cy,1);

         model.child(1).setMatrix(LM);
         model.child(2).setMatrix(RM);

	 // CHECK TO SEE WHETHER EACH BEAM INTERSECTS WITH THE TARGET

         let hitL = cg.mHitRect(LM, target.getMatrix());
         let hitR = cg.mHitRect(RM, target.getMatrix());

     // CHECK TO SEE WHICH KEYS OF THE PIANO ARE HIT
         let c = model.child(3).child(4);
         let hitCL = cg.mHitRect(LM, c.getMatrix());
         let hitCR = cg.mHitRect(RM, c.getMatrix());

         let d = model.child(3).child(0);
         let hitDL = cg.mHitRect(LM, d.getMatrix());
         let hitDR = cg.mHitRect(RM, d.getMatrix());

         let e = model.child(3).child(1);
         let hitEL = cg.mHitRect(LM, e.getMatrix());
         let hitER = cg.mHitRect(RM, e.getMatrix());

         let f = model.child(3).child(2);
         let hitFL = cg.mHitRect(LM, f.getMatrix());
         let hitFR = cg.mHitRect(RM, f.getMatrix());

         let g = model.child(3).child(3);
         let hitGL = cg.mHitRect(LM, g.getMatrix());
         let hitGR = cg.mHitRect(RM, g.getMatrix());

         let a = model.child(3).child(6);
         let hitAL = cg.mHitRect(LM, a.getMatrix());
         let hitAR = cg.mHitRect(RM, a.getMatrix());

         let b = model.child(3).child(5);
         let hitBL = cg.mHitRect(LM, b.getMatrix());
         let hitBR = cg.mHitRect(RM, b.getMatrix());

         if (hitCL || hitCR) {
            c.color(1,0.6,0);
            if (!cPlaying) {
               var audio = new Audio('media/sound/pianoSounds/C2.m4a');
               audio.play();
               console.log('cPlaying');
            }
            cPlaying = true;
         } else {
            c.color(1,1,1);
            cPlaying = false;
         }

         if (hitDL || hitDR) {
            d.color(1,0.6,0);
            if (!dPlaying) {
               var audio = new Audio('media/sound/pianoSounds/D2.m4a');
               audio.play();
               console.log('dPlaying');
            }
            dPlaying = true;
         } else {
            d.color(1,1,1);
            dPlaying = false;
         }

         if (hitEL || hitER) {
            e.color(1,0.6,0);
            if (!ePlaying) {
               var audio = new Audio('media/sound/pianoSounds/E2.m4a');
               audio.play();
               console.log('ePlaying');
            }
            ePlaying = true;
         } else {
            e.color(1,1,1);
            ePlaying = false;
         }

         if (hitFL || hitFR) {
            f.color(1,0.6,0);
            if (!fPlaying) {
               var audio = new Audio('media/sound/pianoSounds/F2.m4a');
               audio.play();
               console.log('fPlaying');
            }
            fPlaying = true;
         } else {
            f.color(1,1,1);
            fPlaying = false;
         }

         if (hitGL || hitGR) {
            g.color(1,0.6,0);
            if (!gPlaying) {
               var audio = new Audio('media/sound/pianoSounds/G2.m4a');
               audio.play();
               console.log('gPlaying');
            }
            gPlaying = true;
         } else {
            g.color(1,1,1);
            gPlaying = false;
         }

         if (hitAL || hitAR) {
            a.color(1,0.6,0);
            if (!aPlaying) {
               var audio = new Audio('media/sound/pianoSounds/A2.m4a');
               audio.play();
               console.log('aPlaying');
            }
            aPlaying = true;
         } else {
            a.color(1,1,1);
            aPlaying = false;
         }

         if (hitBL || hitBR) {
            b.color(1,0.6,0);
            if (!bPlaying) {
               var audio = new Audio('media/sound/pianoSounds/B2.m4a');
               audio.play();
               console.log('bPlaying');
            }
            bPlaying = true;
         } else {
            b.color(1,1,1);
            bPlaying = false;
         }

	 // CHANGE TARGET COLOR DEPENDING ON WHICH BEAM(S) HIT IT AND WHAT TRIGGERS ARE PRESSED

         target.color(hitL && hitR ? triggerL || triggerR ? [0,0,1] : [.5,.5,1] :
                              hitL ? triggerL             ? [1,0,0] : [1,.5,.5] :
                              hitR ? triggerR             ? [0,1,0] : [.5,1,.5] : [1,1,1]);
      });
   }
