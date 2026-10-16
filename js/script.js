/***************************************************************************
 * js/script.js — Creep Transient Based on Obstacle Distance Virtual Lab
 ***************************************************************************/

/* =========================================================================
 * 1. SPECIMEN DATA & ORIGINAL IMAGE PATHS IN img/
 * ========================================================================= */
const SPECIMEN_DATA = {
  '0.60': {
    id: '0.60',
    label: '0.60 μm',
    fullName: 'Obstacle Distance = 0.60 μm',
    titleGraph: 'Obstacle Distance=0.60μm',
    legendLabel: '—0.60μm',
    xAxisLabel: 'Time (normalised)',
    imgSrc: 'img/obstacle_0.60um.png',
    color: '#437fd1',
    scaleColor: '#00e5ff',
    metalTint: 0x00e5ff,
    emissiveTint: 0x004d5a,
    finalStrain: 0.02320,
    pPrimary: 0.0148,
    pExp: 0.41,
    pSecondary: 0.0084
  },
  '0.88': {
    id: '0.88',
    label: '0.88 μm',
    fullName: 'Obstacle Distance = 0.88 μm',
    titleGraph: 'Obstical Distance=0.88μm',
    legendLabel: '—0.88μm',
    xAxisLabel: 'Time(Normalisation)',
    imgSrc: 'img/obstacle_0.88um.png',
    color: '#7da63f',
    scaleColor: '#00e676',
    metalTint: 0x00e676,
    emissiveTint: 0x004d25,
    finalStrain: 0.02320,
    pPrimary: 0.0156,
    pExp: 0.37,
    pSecondary: 0.0076
  },
  '1.10': {
    id: '1.10',
    label: '1.10 μm',
    fullName: 'Obstacle Distance = 1.10 μm',
    titleGraph: 'Obstacle Distance=1.10μm',
    legendLabel: '—1.10μm',
    xAxisLabel: 'Time(normalized)',
    imgSrc: 'img/obstacle_1.10um.png',
    color: '#b83c35',
    scaleColor: '#ff5252',
    metalTint: 0xff5252,
    emissiveTint: 0x5a0f0f,
    finalStrain: 0.02320,
    pPrimary: 0.0163,
    pExp: 0.34,
    pSecondary: 0.0069
  }
};

// Normalized time points displayed in the Results table
const RESULT_TIME_POINTS = [0.2, 0.4, 0.6, 0.8, 1];

function computeIndividualStrain(specimenId, u) {
  if (!specimenId || u <= 0) return 0;
  const spec = SPECIMEN_DATA[specimenId];
  const clampedU = Math.min(1, Math.max(0, u));
  return spec.pPrimary * Math.pow(clampedU, spec.pExp) + spec.pSecondary * clampedU;
}

/* =========================================================================
 * 2. BILINGUAL TRANSLATIONS & STEP-BY-STEP AUDIO MAPPING
 * ========================================================================= */
const PHASE_TO_STEP_AUDIO = {
  IDLE: 'audio/step1',
  LOADED: 'audio/step2',
  RUNNING: 'audio/step3',
  COMPLETED: 'audio/step4',
  RESULT_SHOWN: 'audio/step5'
};

const I18N = {
  en: {
    mainTitle: 'Creep Transient Based on Obstacle Distance',
    hdrProcedure: 'PROCEDURE & CONTROLS',
    hdrApparatus: 'CREEP TESTING APPARATUS',
    hdrOutput: 'OUTPUT & OBSERVATIONS',
    lblCurrentStepTitle: 'Current Step:',
    lblSpecimenHeading: 'Specimen Selection:',
    tooltip1: 'Click a specimen or drag it',
    tooltip2: 'Click to apply load',
    tooltip3: 'Click to show result',
    tooltip4: 'Click to reset experiment',
    btnApplyLoad: 'APPLY LOAD',
    btnShowResult: 'SHOW RESULT',
    btnUndo: '↶ UNDO',
    btnRedo: '↷ REDO',
    btnReset: 'RESET EXPERIMENT',
    lblTheorySummary: 'Sample Dimensions',
    lblObsTable: 'Results',
    lblResultGraph: 'Result Graph',
    thTime: 'Time (normalized)',
    thStrain: 'Strain ε (dimensionless)',
    dropHere: 'Drop specimen here',
    stepSelect: 'Select a specimen or drag it onto the apparatus.',
    stepLoaded: () => 'Specimen is mounted in the grips. Click APPLY LOAD to attach the weight.',
    stepRunning: () => 'Constant load is applied to the specimen. Observe the wire and colored scale indicator moving downward.',
    stepCompleted: () => 'Creep test completed. Click SHOW RESULT to view the strain–time graph.',
    stepResultShown: () => 'Result graph displayed. Click RESET EXPERIMENT to test another specimen.'
  },
  hi: {
    mainTitle: 'अवरोध दूरी (Obstacle Distance) पर आधारित क्रीप ट्रांजिएंट',
    hdrProcedure: 'प्रक्रिया और नियंत्रण',
    hdrApparatus: 'क्रीप परीक्षण उपकरण',
    hdrOutput: 'आउटपुट और अवलोकन',
    lblCurrentStepTitle: 'वर्तमान चरण:',
    lblSpecimenHeading: 'नमूना चयन:',
    tooltip1: 'स्पेसिमेन पर क्लिक करें या उसे ड्रैग करें',
    tooltip2: 'लोड लगाने के लिए क्लिक करें',
    tooltip3: 'रिज़ल्ट देखने के लिए क्लिक करें',
    tooltip4: 'रीसेट करने के लिए क्लिक करें',
    btnApplyLoad: 'APPLY LOAD',
    btnShowResult: 'SHOW RESULT',
    btnUndo: '↶ UNDO',
    btnRedo: '↷ REDO',
    btnReset: 'RESET EXPERIMENT',
    lblTheorySummary: 'Sample Dimensions',
    lblObsTable: 'Results',
    lblResultGraph: 'Result Graph',
    thTime: 'Time (normalized)',
    thStrain: 'Strain ε (dimensionless)',
    dropHere: 'स्पेसिमेन यहाँ ड्रॉप करें',
    // Exact 5 Hindi step instructions in Devanagari synced to audio/step1 .. audio/step5
    stepSelect: 'एक स्पेसिमेन सिलेक्ट करो या उसे ड्रैग करके अपैरेटस पर प्लेस करो।',
    stepLoaded: () => 'स्पेसिमेन ग्रिप्स में फिक्स हो गया है। वेट लगाने के लिए APPLY LOAD पर क्लिक करो।',
    stepRunning: () => 'स्पेसिमेन पर कॉन्स्टेंट लोड लग गया है। अब ऑब्ज़र्व करो कि वायर और कलर्ड स्केल इंडिकेटर कैसे नीचे मूव कर रहे हैं।',
    stepCompleted: () => 'क्रीप टेस्ट कम्प्लीट हो गया है। SHOW RESULT पर क्लिक करके स्ट्रेन वर्सेस टाइम ग्राफ देखो।',
    stepResultShown: () => 'रिज़ल्ट ग्राफ डिस्प्ले हो गया है। दूसरा स्पेसिमेन टेस्ट करने के लिए RESET EXPERIMENT पर क्लिक करो।'
  }
};

/* =========================================================================
 * 3. EXPERIMENT STATE, AUDIO CONTROLLER & UNDO/REDO HISTORY
 * ========================================================================= */
const state = {
  lang: 'en',
  audio: 'off',
  phase: 'IDLE', // 'IDLE' (Step 1) | 'LOADED' (Step 2) | 'RUNNING' (Step 3) | 'COMPLETED' (Step 4) | 'RESULT_SHOWN' (Step 5)
  selectedSpecimen: null,
  normalizedTime: 0,
  currentStrain: 0,
  finalStrain: null,
  tableRows: [],
  animFrameId: null,
  mountAnimId: null
};

const historyStack = [];
let historyPointer = -1;

let currentHindiAudio = null;

function stopAllAudio() {
  if ('speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
    } catch (e) {}
  }
  if (currentHindiAudio) {
    try {
      currentHindiAudio.pause();
      currentHindiAudio.currentTime = 0;
    } catch (e) {}
    currentHindiAudio = null;
  }
}

function getStepTextForPhase(phase, lang) {
  const t = I18N[lang] || I18N.en;
  if (phase === 'IDLE') return t.stepSelect;
  if (phase === 'LOADED') return t.stepLoaded();
  if (phase === 'RUNNING') return t.stepRunning();
  if (phase === 'COMPLETED') return t.stepCompleted();
  if (phase === 'RESULT_SHOWN') return t.stepResultShown();
  return t.stepSelect;
}

function playCurrentStepAudio() {
  stopAllAudio();
  if (state.audio !== 'on') return;

  const stepText = getStepTextForPhase(state.phase, state.lang);

  // English Audio -> Browser Speech Synthesis
  if (state.lang === 'en') {
    if ('speechSynthesis' in window) {
      try {
        const utter = new SpeechSynthesisUtterance(stepText);
        utter.lang = 'en-US';
        utter.rate = 1.0;
        window.speechSynthesis.speak(utter);
      } catch (e) {}
    }
    return;
  }

  // Hindi Audio -> Pre-recorded file in audio/step1 .. audio/step5
  const baseAudioPath = PHASE_TO_STEP_AUDIO[state.phase] || 'audio/step1';
  const candidateExtensions = ['.mp3', '.wav', '.ogg', '.m4a', ''];
  let extIndex = 0;

  function tryNextExtension() {
    if (state.audio !== 'on' || state.lang !== 'hi') return;

    if (extIndex >= candidateExtensions.length) {
      if ('speechSynthesis' in window) {
        try {
          const utter = new SpeechSynthesisUtterance(stepText);
          utter.lang = 'hi-IN';
          utter.rate = 1.0;
          window.speechSynthesis.speak(utter);
        } catch (e) {}
      }
      return;
    }

    const src = baseAudioPath + candidateExtensions[extIndex];
    extIndex++;

    const audioEl = new Audio(src);
    currentHindiAudio = audioEl;

    audioEl.onerror = function () {
      if (currentHindiAudio === audioEl) {
        tryNextExtension();
      }
    };

    const playPromise = audioEl.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        if (currentHindiAudio === audioEl) {
          tryNextExtension();
        }
      });
    }
  }

  tryNextExtension();
}

function saveSnapshot() {
  if (historyPointer < historyStack.length - 1) {
    historyStack.splice(historyPointer + 1);
  }
  historyStack.push({
    phase: state.phase,
    selectedSpecimen: state.selectedSpecimen,
    normalizedTime: state.normalizedTime,
    currentStrain: state.currentStrain,
    finalStrain: state.finalStrain,
    tableRows: JSON.parse(JSON.stringify(state.tableRows))
  });
  historyPointer = historyStack.length - 1;
  updateUndoRedoButtons();
}

function restoreSnapshot(snap) {
  if (state.animFrameId) {
    cancelAnimationFrame(state.animFrameId);
    state.animFrameId = null;
  }
  if (state.mountAnimId) {
    cancelAnimationFrame(state.mountAnimId);
    state.mountAnimId = null;
  }
  state.phase = snap.phase;
  state.selectedSpecimen = snap.selectedSpecimen;
  state.normalizedTime = snap.normalizedTime;
  state.currentStrain = snap.currentStrain;
  state.finalStrain = snap.finalStrain;
  state.tableRows = JSON.parse(JSON.stringify(snap.tableRows));

  syncUIWithState();
  update3DApparatusFromState();
  updateUndoRedoButtons();
  playCurrentStepAudio();
}

function updateUndoRedoButtons() {
  document.getElementById('btnUndo').disabled = historyPointer <= 0 || state.phase === 'RUNNING';
  document.getElementById('btnRedo').disabled = historyPointer >= historyStack.length - 1 || state.phase === 'RUNNING';
}

/* =========================================================================
 * 4. THREE.JS 3D APPARATUS WITH DYNAMIC SCALE FILL & MOUNTING ANIMATION
 * ========================================================================= */
let scene, camera, renderer;
let specimenMesh, topGripJaws, botGripJaws, lowerMovingAssembly, hangingWeightGroup, restingWeightGroup, loadArrowGroup;
let scaleCanvas, scaleCtx, scaleTexture;
let isDraggingCamera = false;
let isPanningCamera = false;
let prevMouse = { x: 0, y: 0 };

const Y_SCALE_ZERO = 4.55; // 0 mm top anchor
const MM_TO_UNITS = 0.012; // 1 mm = 0.012 Three.js units

const camSpherical = {
  radius: 9.6,
  theta: 0.24,
  phi: 1.36,
  target: new THREE.Vector3(0, 2.55, 0)
};

function initDynamicScaleTexture(maxAnisotropy) {
  scaleCanvas = document.createElement('canvas');
  scaleCanvas.width = 1024;
  scaleCanvas.height = 4096;
  scaleCtx = scaleCanvas.getContext('2d');

  scaleTexture = new THREE.CanvasTexture(scaleCanvas);
  scaleTexture.anisotropy = maxAnisotropy || 16;
  scaleTexture.minFilter = THREE.LinearMipmapLinearFilter;
  scaleTexture.magFilter = THREE.LinearFilter;

  drawDynamicScaleTexture(false, 156.0, 0.0, '#00e5ff');
  return scaleTexture;
}

function drawDynamicScaleTexture(showLoadFill, currentLengthMM, currentStrainVal, activeHexColor) {
  if (!scaleCtx || !scaleCanvas) return;
  const ctx = scaleCtx;
  const W = scaleCanvas.width;
  const H = scaleCanvas.height;

  ctx.fillStyle = '#f5f7fb';
  ctx.fillRect(0, 0, W, H);

  ctx.strokeStyle = '#1b2230';
  ctx.lineWidth = 10;
  ctx.strokeRect(5, 5, W - 10, H - 10);

  ctx.fillStyle = '#162035';
  ctx.fillRect(10, 10, W - 20, 110);
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 46px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('SCALE (mm)', W / 2, 65);

  const topPad = 175;
  const botPad = 115;
  const usableH = H - topPad - botPad;
  const maxMM = 220;

  function mmToY(mm) {
    return topPad + (mm / maxMM) * usableH;
  }

  if (showLoadFill) {
    const yStart = mmToY(156);
    const yCurr = mmToY(Math.max(156, Math.min(220, currentLengthMM)));

    ctx.save();
    ctx.fillStyle = activeHexColor;
    ctx.globalAlpha = 0.30;
    ctx.fillRect(16, yStart, W - 32, Math.max(6, yCurr - yStart));
    ctx.restore();

    ctx.fillStyle = activeHexColor;
    ctx.fillRect(W - 140, yStart, 125, Math.max(8, yCurr - yStart));

    ctx.strokeStyle = '#111827';
    ctx.lineWidth = 7;
    ctx.beginPath();
    ctx.moveTo(16, yStart);
    ctx.lineTo(W - 16, yStart);
    ctx.stroke();

    ctx.strokeStyle = activeHexColor;
    ctx.lineWidth = 12;
    ctx.beginPath();
    ctx.moveTo(16, yCurr);
    ctx.lineTo(W - 16, yCurr);
    ctx.stroke();

    const boxW = 540;
    const boxH = 148;
    const boxX = 430;
    const boxY = Math.min(H - boxH - 20, Math.max(135, yCurr - boxH / 2));

    ctx.fillStyle = 'rgba(10, 15, 26, 0.94)';
    ctx.fillRect(boxX, boxY, boxW, boxH);
    ctx.strokeStyle = activeHexColor;
    ctx.lineWidth = 7;
    ctx.strokeRect(boxX, boxY, boxW, boxH);

    ctx.fillStyle = activeHexColor;
    ctx.font = 'bold 46px Courier New, monospace';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(`L = ${currentLengthMM.toFixed(1)} mm`, boxX + 24, boxY + 46);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 40px Courier New, monospace';
    ctx.fillText(`ε = ${currentStrainVal.toFixed(5)}`, boxX + 24, boxY + 104);
  }

  ctx.textBaseline = 'middle';
  for (let mm = 0; mm <= maxMM; mm++) {
    const y = mmToY(mm);
    const isMajor10 = mm % 10 === 0;
    const isMed5 = mm % 5 === 0;

    let tickLen = 42;
    let lineW = 4;
    if (isMajor10) {
      tickLen = 115;
      lineW = 8;
    } else if (isMed5) {
      tickLen = 78;
      lineW = 6;
    }

    ctx.strokeStyle = '#111622';
    ctx.lineWidth = lineW;
    ctx.beginPath();
    ctx.moveTo(W - tickLen, y);
    ctx.lineTo(W - 10, y);
    ctx.moveTo(10, y);
    ctx.lineTo(10 + tickLen * 0.85, y);
    ctx.stroke();

    if (isMajor10) {
      ctx.fillStyle = '#0e131f';
      ctx.font = 'bold 46px Arial';
      ctx.textAlign = 'left';
      ctx.fillText(`${mm} mm`, 125, y);
    }
  }

  if (scaleTexture) {
    scaleTexture.needsUpdate = true;
  }
}

function createWeightLabelTexture() {
  const c = document.createElement('canvas');
  c.width = 512;
  c.height = 128;
  const ctx = c.getContext('2d');
  ctx.fillStyle = '#d4a638';
  ctx.fillRect(0, 0, 512, 128);
  ctx.strokeStyle = '#8c6715';
  ctx.lineWidth = 8;
  ctx.strokeRect(4, 4, 504, 120);
  ctx.fillStyle = '#1a1200';
  ctx.font = 'bold 44px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('772.2 gm LOAD', 256, 64);
  return new THREE.CanvasTexture(c);
}

function initThreeApparatus() {
  const container = document.getElementById('threeCanvasContainer');
  const width = container.clientWidth || 680;
  const height = container.clientHeight || 720;

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x232936);

  camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 100);
  updateCameraTransform();

  renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  container.innerHTML = '';
  container.appendChild(renderer.domElement);

  const maxAniso = renderer.capabilities.getMaxAnisotropy();

  scene.add(new THREE.AmbientLight(0xe4ecff, 0.75));

  const dirLight = new THREE.DirectionalLight(0xffffff, 0.9);
  dirLight.position.set(5, 10, 7);
  dirLight.castShadow = true;
  dirLight.shadow.mapSize.width = 2048;
  dirLight.shadow.mapSize.height = 2048;
  scene.add(dirLight);

  const fillLight = new THREE.DirectionalLight(0x99bbff, 0.38);
  fillLight.position.set(-6, 5, 4);
  scene.add(fillLight);

  // 1. Dark Slate Floor
  const floorMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(40, 40),
    new THREE.MeshStandardMaterial({ color: 0x2a3140, roughness: 0.9, metalness: 0.05 })
  );
  floorMesh.rotation.x = -Math.PI / 2;
  floorMesh.position.y = -1.65;
  floorMesh.receiveShadow = true;
  scene.add(floorMesh);

  // 2. Wooden Lab Table
  const tableGroup = new THREE.Group();
  const woodMat = new THREE.MeshStandardMaterial({ color: 0x6b4423, roughness: 0.72, metalness: 0.05 });

  const topMesh = new THREE.Mesh(new THREE.BoxGeometry(4.6, 0.22, 2.7), woodMat);
  topMesh.castShadow = true;
  topMesh.receiveShadow = true;
  tableGroup.add(topMesh);

  const legGeo = new THREE.BoxGeometry(0.22, 1.65, 0.22);
  [[-2.05, -0.825, -1.1], [2.05, -0.825, -1.1], [-2.05, -0.825, 1.1], [2.05, -0.825, 1.1]].forEach(([lx, ly, lz]) => {
    const leg = new THREE.Mesh(legGeo, woodMat);
    leg.position.set(lx, ly, lz);
    leg.castShadow = true;
    leg.receiveShadow = true;
    tableGroup.add(leg);
  });
  scene.add(tableGroup);

  // 3. Creep Testing Machine Frame
  const frameGroup = new THREE.Group();
  frameGroup.position.set(0, 0.11, 0);

  const blackMetalMat = new THREE.MeshStandardMaterial({ color: 0x15181f, roughness: 0.4, metalness: 0.55 });
  const chromeMat = new THREE.MeshStandardMaterial({ color: 0xd0d7e2, roughness: 0.22, metalness: 0.88 });
  const gripSteelMat = new THREE.MeshStandardMaterial({ color: 0x3b4352, roughness: 0.35, metalness: 0.75 });
  const brassMat = new THREE.MeshStandardMaterial({ color: 0xd4a638, roughness: 0.28, metalness: 0.82 });

  const basePlate = new THREE.Mesh(new THREE.BoxGeometry(1.75, 0.18, 1.25), blackMetalMat);
  basePlate.position.set(0, 0.09, 0);
  basePlate.castShadow = true;
  frameGroup.add(basePlate);

  const colGeo = new THREE.CylinderGeometry(0.07, 0.07, 5.3, 28);
  const leftCol = new THREE.Mesh(colGeo, chromeMat);
  leftCol.position.set(-0.58, 2.78, 0);
  leftCol.castShadow = true;
  frameGroup.add(leftCol);

  const rightCol = new THREE.Mesh(colGeo, chromeMat);
  rightCol.position.set(0.58, 2.78, 0);
  rightCol.castShadow = true;
  frameGroup.add(rightCol);

  const collarGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.16, 24);
  const leftCollar = new THREE.Mesh(collarGeo, blackMetalMat);
  leftCollar.position.set(-0.58, 0.24, 0);
  frameGroup.add(leftCollar);

  const rightCollar = new THREE.Mesh(collarGeo, blackMetalMat);
  rightCollar.position.set(0.58, 0.24, 0);
  frameGroup.add(rightCollar);

  const topBar = new THREE.Mesh(new THREE.BoxGeometry(1.55, 0.20, 0.45), blackMetalMat);
  topBar.position.set(0, 5.42, 0);
  topBar.castShadow = true;
  frameGroup.add(topBar);

  const upperGripPost = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.55, 20), chromeMat);
  upperGripPost.position.set(0, 5.05, 0);
  frameGroup.add(upperGripPost);

  topGripJaws = new THREE.Group();
  const topChuck = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.10, 0.28, 24), gripSteelMat);
  topChuck.position.set(0, 4.69, 0);
  topGripJaws.add(topChuck);

  const jawGeo = new THREE.BoxGeometry(0.06, 0.16, 0.12);
  const leftJaw = new THREE.Mesh(jawGeo, blackMetalMat);
  leftJaw.position.set(-0.08, 4.58, 0);
  leftJaw.name = 'leftJaw';
  topGripJaws.add(leftJaw);

  const rightJaw = new THREE.Mesh(jawGeo, blackMetalMat);
  rightJaw.position.set(0.08, 4.58, 0);
  rightJaw.name = 'rightJaw';
  topGripJaws.add(rightJaw);
  frameGroup.add(topGripJaws);

  // Dynamic Graduated Vertical Scale Ruler
  const scaleTex = initDynamicScaleTexture(maxAniso);
  const rulerHeight = 2.95;
  const rulerCenterY = 3.24;
  const rulerMat = new THREE.MeshBasicMaterial({ map: scaleTex });
  const rulerBodyMat = new THREE.MeshStandardMaterial({ color: 0x2b3342, roughness: 0.5 });

  const rulerMaterials = [
    rulerBodyMat,
    rulerBodyMat,
    rulerBodyMat,
    rulerBodyMat,
    rulerMat,
    rulerBodyMat
  ];
  const rulerMesh = new THREE.Mesh(new THREE.BoxGeometry(0.38, rulerHeight, 0.04), rulerMaterials);
  rulerMesh.position.set(-0.29, rulerCenterY, 0.06);
  frameGroup.add(rulerMesh);

  const strutTop = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.06, 0.08), blackMetalMat);
  strutTop.position.set(-0.46, 4.62, 0.03);
  frameGroup.add(strutTop);

  const strutBot = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.06, 0.08), blackMetalMat);
  strutBot.position.set(-0.46, 1.86, 0.03);
  frameGroup.add(strutBot);

  // 4. High-Contrast Cylindrical Wire Specimen
  const wireGeo = new THREE.CylinderGeometry(0.052, 0.052, 1.0, 28);
  wireGeo.translate(0, -0.5, 0);
  const wireMat = new THREE.MeshStandardMaterial({
    color: 0x00e5ff,
    emissive: 0x004d5a,
    emissiveIntensity: 0.45,
    roughness: 0.22,
    metalness: 0.35
  });
  specimenMesh = new THREE.Mesh(wireGeo, wireMat);
  specimenMesh.position.set(0, Y_SCALE_ZERO, 0);
  specimenMesh.visible = false;
  frameGroup.add(specimenMesh);

  // 5. Lower Movable Grip + Clamping Jaws + Red Scale Pointer + Pull Rod + Weight Hanger Assembly
  lowerMovingAssembly = new THREE.Group();

  botGripJaws = new THREE.Group();
  const botLeftJaw = new THREE.Mesh(jawGeo, blackMetalMat);
  botLeftJaw.position.set(-0.08, -0.02, 0);
  botLeftJaw.name = 'botLeftJaw';
  botGripJaws.add(botLeftJaw);

  const botRightJaw = new THREE.Mesh(jawGeo, blackMetalMat);
  botRightJaw.position.set(0.08, -0.02, 0);
  botRightJaw.name = 'botRightJaw';
  botGripJaws.add(botRightJaw);
  lowerMovingAssembly.add(botGripJaws);

  const botChuck = new THREE.Mesh(new THREE.CylinderGeometry(0.10, 0.13, 0.24, 24), gripSteelMat);
  botChuck.position.set(0, -0.14, 0);
  lowerMovingAssembly.add(botChuck);

  const pointerCollar = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.07, 0.14), blackMetalMat);
  pointerCollar.position.set(0, 0, 0);
  lowerMovingAssembly.add(pointerCollar);

  const redNeedle = new THREE.Mesh(
    new THREE.BoxGeometry(0.16, 0.024, 0.025),
    new THREE.MeshBasicMaterial({ color: 0xff1e1e })
  );
  redNeedle.position.set(-0.08, 0, 0.075);
  lowerMovingAssembly.add(redNeedle);

  const tipConeGeo = new THREE.ConeGeometry(0.030, 0.065, 12);
  tipConeGeo.rotateZ(Math.PI / 2);
  const tipCone = new THREE.Mesh(tipConeGeo, new THREE.MeshBasicMaterial({ color: 0xff1e1e }));
  tipCone.position.set(-0.15, 0, 0.082);
  lowerMovingAssembly.add(tipCone);

  const pullRod = new THREE.Mesh(new THREE.CylinderGeometry(0.032, 0.032, 1.45, 20), chromeMat);
  pullRod.position.set(0, -0.92, 0);
  lowerMovingAssembly.add(pullRod);

  const guideSleeve = new THREE.Mesh(
    new THREE.CylinderGeometry(0.15, 0.15, 1.25, 24),
    new THREE.MeshStandardMaterial({ color: 0x6f7785, roughness: 0.4, metalness: 0.7 })
  );
  guideSleeve.position.set(0, 0.80, 0);
  frameGroup.add(guideSleeve);

  const hangerPan = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 0.06, 28), blackMetalMat);
  hangerPan.position.set(0, -1.65, 0);
  lowerMovingAssembly.add(hangerPan);

  // 6. Hanging 772.2 gm Slotted Brass Weight
  const weightLabelTex = createWeightLabelTexture();
  const weightSideMat = new THREE.MeshStandardMaterial({
    map: weightLabelTex,
    roughness: 0.3,
    metalness: 0.75
  });

  hangingWeightGroup = new THREE.Group();
  const brassCylinder = new THREE.Mesh(
    new THREE.CylinderGeometry(0.24, 0.24, 0.34, 32, 1, false),
    [weightSideMat, brassMat, brassMat]
  );
  brassCylinder.rotation.y = -Math.PI / 2;
  brassCylinder.position.set(0, -1.45, 0);
  hangingWeightGroup.add(brassCylinder);

  loadArrowGroup = new THREE.Group();
  const arrowShaft = new THREE.Mesh(
    new THREE.CylinderGeometry(0.022, 0.022, 0.38, 12),
    new THREE.MeshBasicMaterial({ color: 0xff3b30 })
  );
  arrowShaft.position.set(0.36, -1.42, 0);
  loadArrowGroup.add(arrowShaft);

  const arrowHead = new THREE.Mesh(
    new THREE.ConeGeometry(0.06, 0.14, 16),
    new THREE.MeshBasicMaterial({ color: 0xff3b30 })
  );
  arrowHead.rotation.x = Math.PI;
  arrowHead.position.set(0.36, -1.65, 0);
  loadArrowGroup.add(arrowHead);

  hangingWeightGroup.add(loadArrowGroup);
  hangingWeightGroup.visible = false;
  lowerMovingAssembly.add(hangingWeightGroup);

  frameGroup.add(lowerMovingAssembly);

  // 7. Resting 772.2 gm Brass Weight on Table
  restingWeightGroup = new THREE.Group();
  const restingCyl = new THREE.Mesh(
    new THREE.CylinderGeometry(0.24, 0.24, 0.34, 32),
    [weightSideMat, brassMat, brassMat]
  );
  restingCyl.rotation.y = -Math.PI / 2;
  restingCyl.castShadow = true;
  restingWeightGroup.add(restingCyl);
  restingWeightGroup.position.set(1.25, 0.28, 0.35);
  scene.add(restingWeightGroup);

  scene.add(frameGroup);

  // Camera Orbit, Pan & Zoom Controls
  const domElem = renderer.domElement;
  domElem.addEventListener('contextmenu', (e) => e.preventDefault());

  domElem.addEventListener('mousedown', (e) => {
    if (e.button === 0) isDraggingCamera = true;
    if (e.button === 2) isPanningCamera = true;
    prevMouse.x = e.clientX;
    prevMouse.y = e.clientY;
  });

  window.addEventListener('mouseup', () => {
    isDraggingCamera = false;
    isPanningCamera = false;
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDraggingCamera && !isPanningCamera) return;
    const dx = e.clientX - prevMouse.x;
    const dy = e.clientY - prevMouse.y;
    prevMouse.x = e.clientX;
    prevMouse.y = e.clientY;

    if (isDraggingCamera) {
      camSpherical.theta -= dx * 0.0065;
      camSpherical.phi = Math.max(0.3, Math.min(1.55, camSpherical.phi - dy * 0.0065));
      updateCameraTransform();
    } else if (isPanningCamera) {
      camSpherical.target.y = Math.max(0.4, Math.min(5.0, camSpherical.target.y + dy * 0.006));
      camSpherical.target.x = Math.max(-2.0, Math.min(2.0, camSpherical.target.x - dx * 0.006));
      updateCameraTransform();
    }
  });

  domElem.addEventListener('wheel', (e) => {
    e.preventDefault();
    camSpherical.radius = Math.max(1.6, Math.min(16, camSpherical.radius + e.deltaY * 0.0045));
    updateCameraTransform();
  }, { passive: false });

  domElem.addEventListener('touchstart', (e) => {
    if (e.touches.length === 1) {
      isDraggingCamera = true;
      prevMouse.x = e.touches[0].clientX;
      prevMouse.y = e.touches[0].clientY;
    }
  }, { passive: true });

  domElem.addEventListener('touchmove', (e) => {
    if (!isDraggingCamera || e.touches.length !== 1) return;
    const dx = e.touches[0].clientX - prevMouse.x;
    const dy = e.touches[0].clientY - prevMouse.y;
    prevMouse.x = e.touches[0].clientX;
    prevMouse.y = e.touches[0].clientY;
    camSpherical.theta -= dx * 0.0065;
    camSpherical.phi = Math.max(0.3, Math.min(1.55, camSpherical.phi - dy * 0.0065));
    updateCameraTransform();
  }, { passive: true });

  domElem.addEventListener('touchend', () => {
    isDraggingCamera = false;
  });

  window.addEventListener('resize', handleViewportResize);
}

function updateCameraTransform() {
  if (!camera) return;
  const x = camSpherical.target.x + camSpherical.radius * Math.sin(camSpherical.phi) * Math.sin(camSpherical.theta);
  const y = camSpherical.target.y + camSpherical.radius * Math.cos(camSpherical.phi);
  const z = camSpherical.target.z + camSpherical.radius * Math.sin(camSpherical.phi) * Math.cos(camSpherical.theta);
  camera.position.set(x, y, z);
  camera.lookAt(camSpherical.target);
}

function handleViewportResize() {
  const container = document.getElementById('threeCanvasContainer');
  if (!container || !renderer || !camera) return;
  const w = container.clientWidth;
  const h = container.clientHeight;
  if (w === 0 || h === 0) return;
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  renderer.setSize(w, h);
}

function setGripJawsOffset(offsetX) {
  if (topGripJaws) {
    const lTop = topGripJaws.getObjectByName('leftJaw');
    const rTop = topGripJaws.getObjectByName('rightJaw');
    if (lTop && rTop) {
      lTop.position.x = -offsetX;
      rTop.position.x = offsetX;
    }
  }
  if (botGripJaws) {
    const lBot = botGripJaws.getObjectByName('botLeftJaw');
    const rBot = botGripJaws.getObjectByName('botRightJaw');
    if (lBot && rBot) {
      lBot.position.x = -offsetX;
      rBot.position.x = offsetX;
    }
  }
}

function playSpecimenMountingAnimation(specId) {
  if (!specimenMesh || !lowerMovingAssembly) return;
  if (state.mountAnimId) {
    cancelAnimationFrame(state.mountAnimId);
    state.mountAnimId = null;
  }

  const specData = SPECIMEN_DATA[specId];
  specimenMesh.material.color.setHex(specData.metalTint);
  specimenMesh.material.emissive.setHex(specData.emissiveTint);

  const initialLengthUnits = 156 * MM_TO_UNITS;
  specimenMesh.scale.set(1, initialLengthUnits, 1);
  specimenMesh.visible = true;

  lowerMovingAssembly.position.y = Y_SCALE_ZERO - initialLengthUnits;
  hangingWeightGroup.visible = false;
  restingWeightGroup.visible = true;

  drawDynamicScaleTexture(false, 156.0, 0.0, specData.scaleColor);

  const duration = 700;
  const start = performance.now();

  function animateMountStep(now) {
    const t = Math.min(1, (now - start) / duration);

    if (t < 0.25) {
      const p = t / 0.25;
      setGripJawsOffset(0.048 + p * 0.065);
      specimenMesh.position.set(0.75, Y_SCALE_ZERO - 0.14, 0.55);
      specimenMesh.rotation.z = -0.18 * (1 - p * 0.3);
    } else if (t < 0.75) {
      const p = (t - 0.25) / 0.50;
      const ease = 1 - Math.pow(1 - p, 3);
      setGripJawsOffset(0.113);
      specimenMesh.position.set(
        0.75 * (1 - ease),
        (Y_SCALE_ZERO - 0.14) + 0.14 * ease,
        0.55 * (1 - ease)
      );
      specimenMesh.rotation.z = -0.12 * (1 - ease);
    } else {
      const p = (t - 0.75) / 0.25;
      const ease = 1 - Math.pow(1 - p, 2);
      specimenMesh.position.set(0, Y_SCALE_ZERO, 0);
      specimenMesh.rotation.z = 0;
      setGripJawsOffset(0.113 - ease * (0.113 - 0.046));
    }

    if (t < 1) {
      state.mountAnimId = requestAnimationFrame(animateMountStep);
    } else {
      state.mountAnimId = null;
      specimenMesh.position.set(0, Y_SCALE_ZERO, 0);
      specimenMesh.rotation.z = 0;
      setGripJawsOffset(0.046);
    }
  }

  state.mountAnimId = requestAnimationFrame(animateMountStep);
}

function update3DApparatusFromState() {
  if (!specimenMesh || !lowerMovingAssembly) return;

  const hasSpecimen = Boolean(state.selectedSpecimen);
  const isLoadApplied = (state.phase === 'RUNNING' || state.phase === 'COMPLETED' || state.phase === 'RESULT_SHOWN');

  specimenMesh.visible = hasSpecimen;

  if (!state.mountAnimId) {
    specimenMesh.position.set(0, Y_SCALE_ZERO, 0);
    specimenMesh.rotation.z = 0;
    setGripJawsOffset(hasSpecimen ? 0.046 : 0.085);
  }

  let activeScaleColor = '#00e5ff';
  if (hasSpecimen) {
    const specData = SPECIMEN_DATA[state.selectedSpecimen];
    specimenMesh.material.color.setHex(specData.metalTint);
    specimenMesh.material.emissive.setHex(specData.emissiveTint);
    activeScaleColor = specData.scaleColor;
  }

  const progressRatio = Math.min(1, Math.max(0, state.currentStrain / 0.0232));
  const currentLengthMM = 156 + progressRatio * (196 - 156);
  const currentDiaMM = 1.15 - progressRatio * (1.15 - 1.07);

  const wireLengthUnits = currentLengthMM * MM_TO_UNITS;
  const radialScale = currentDiaMM / 1.15;

  specimenMesh.scale.set(radialScale, wireLengthUnits, radialScale);

  const bottomOfWireY = Y_SCALE_ZERO - wireLengthUnits;
  lowerMovingAssembly.position.y = bottomOfWireY;

  hangingWeightGroup.visible = isLoadApplied;
  restingWeightGroup.visible = !isLoadApplied;

  if (loadArrowGroup) {
    loadArrowGroup.visible = (state.phase === 'RUNNING');
  }

  drawDynamicScaleTexture(isLoadApplied, currentLengthMM, state.currentStrain, activeScaleColor);
}

function animateThreeLoop() {
  requestAnimationFrame(animateThreeLoop);
  if (renderer && scene && camera) {
    renderer.render(scene, camera);
  }
}

/* =========================================================================
 * 5. SAMPLE DEFORMATION, RESULT GRAPH & CREEPSTRAIN-VS-TIME IMAGE RENDERERS
 * ========================================================================= */
function renderSingleSpecimenGraph(specId) {
  const spec = SPECIMEN_DATA[specId];
  if (!spec) return;

  const imgEl = document.getElementById('resultGraphImg');
  const canvas = document.getElementById('resultPlotCanvas');

  drawExactSpecimenGraphOnCanvas(canvas, specId);

  imgEl.onload = function () {
    imgEl.classList.remove('hidden');
    canvas.classList.add('hidden');
  };
  imgEl.onerror = function () {
    imgEl.classList.add('hidden');
    canvas.classList.remove('hidden');
  };
  imgEl.src = spec.imgSrc;
}

function drawExactSpecimenGraphOnCanvas(canvas, specId) {
  const spec = SPECIMEN_DATA[specId];
  const ctx = canvas.getContext('2d');
  const W = canvas.width;
  const H = canvas.height;

  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, W, H);

  const padL = 70;
  const padR = 82;
  const padT = 40;
  const padB = 48;
  const plotW = W - padL - padR;
  const plotH = H - padT - padB;

  ctx.fillStyle = '#404040';
  ctx.fillRect(padL, padT, plotW, plotH);

  const yTicks = [0, 0.005, 0.01, 0.015, 0.02, 0.025];
  ctx.font = 'bold 11.5px Arial';
  ctx.textAlign = 'right';
  ctx.textBaseline = 'middle';

  yTicks.forEach((val) => {
    const y = padT + plotH - (val / 0.025) * plotH;
    ctx.strokeStyle = '#777777';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(padL - 4, y);
    ctx.lineTo(padL + plotW, y);
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.fillText(val.toString(), padL - 8, y);
  });

  const xTicks = [0, 0.2, 0.4, 0.6, 0.8, 1];
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  xTicks.forEach((val) => {
    const x = padL + val * plotW;
    ctx.strokeStyle = '#777777';
    ctx.beginPath();
    ctx.moveTo(x, padT + plotH);
    ctx.lineTo(x, padT + plotH + 4);
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.fillText(val.toString(), x, padT + plotH + 7);
  });

  ctx.strokeStyle = '#888888';
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(padL, padT);
  ctx.lineTo(padL, padT + plotH);
  ctx.lineTo(padL + plotW, padT + plotH);
  ctx.stroke();

  ctx.fillStyle = spec.color;
  ctx.font = '19px Calibri, Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.fillText(spec.titleGraph, W / 2, 8);

  ctx.font = '16px Calibri, Arial, sans-serif';
  ctx.fillText(spec.xAxisLabel, padL + plotW / 2, H - 20);

  ctx.save();
  ctx.translate(16, padT + plotH / 2);
  ctx.rotate(-Math.PI / 2);
  ctx.textAlign = 'center';
  ctx.fillText('Strain(ε)', 0, 0);
  ctx.restore();

  ctx.strokeStyle = spec.color;
  ctx.lineWidth = 4.2;
  ctx.lineCap = 'round';
  ctx.beginPath();
  const steps = 120;
  for (let i = 0; i <= steps; i++) {
    const u = i / steps;
    const eps = computeIndividualStrain(specId, u);
    const px = padL + u * plotW;
    const py = padT + plotH - (eps / 0.025) * plotH;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.stroke();

  const legX = padL + plotW + 8;
  const legY = padT + plotH / 2;
  ctx.fillStyle = spec.color;
  ctx.font = '14px Calibri, Arial, sans-serif';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText(spec.legendLabel, legX, legY);
}

/**
 * Loads `img/creepstrain-vs-time` permanently below the Result Graph box.
 */
function initCreepStrainVsTimeImage() {
  const imgEl = document.getElementById('creepStrainVsTimeImg');
  if (!imgEl) return;

  const c = document.createElement('canvas');
  c.width = 460;
  c.height = 285;
  const ctx = c.getContext('2d');

  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, c.width, c.height);

  const padL = 68, padR = 92, padT = 38, padB = 46;
  const plotW = c.width - padL - padR;
  const plotH = c.height - padT - padB;

  ctx.fillStyle = '#7c7c7c';
  ctx.fillRect(padL, padT, plotW, plotH);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 14px Calibri, Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('Obstacle Distance Variation (λ)', c.width / 2, 20);

  const yTicks = [0, 0.005, 0.01, 0.015, 0.02, 0.025];
  ctx.font = 'bold 11px Arial';
  ctx.textAlign = 'right';
  ctx.textBaseline = 'middle';
  yTicks.forEach((val) => {
    const y = padT + plotH - (val / 0.025) * plotH;
    ctx.strokeStyle = '#999999';
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    ctx.moveTo(padL - 4, y);
    ctx.lineTo(padL + plotW, y);
    ctx.stroke();
    ctx.fillStyle = '#ffffff';
    ctx.fillText(val.toString(), padL - 7, y);
  });

  const xTicks = [0, 0.2, 0.4, 0.6, 0.8, 1];
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  xTicks.forEach((val) => {
    const x = padL + val * plotW;
    ctx.strokeStyle = '#999999';
    ctx.beginPath();
    ctx.moveTo(x, padT + plotH);
    ctx.lineTo(x, padT + plotH + 4);
    ctx.stroke();
    ctx.fillStyle = '#ffffff';
    ctx.fillText(val.toString(), x, padT + plotH + 6);
  });

  ctx.save();
  ctx.translate(16, padT + plotH / 2);
  ctx.rotate(-Math.PI / 2);
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 13px Calibri, Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('Strain (ε)', 0, 0);
  ctx.restore();

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 13px Calibri, Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('Time(Normalized)', padL + plotW / 2, c.height - 16);

  const curves = [
    { id: '0.60', maxU: 1.00, color: '#3b78c7', label: '0.60μm' },
    { id: '0.88', maxU: 0.72, color: '#c44440', label: '0.88μm' },
    { id: '1.10', maxU: 0.55, color: '#90b848', label: '1.10μm' }
  ];

  curves.forEach((curve, idx) => {
    ctx.strokeStyle = curve.color;
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.beginPath();
    for (let i = 0; i <= 100; i++) {
      const s = i / 100;
      const xNorm = s * curve.maxU;
      const eps = computeIndividualStrain(curve.id, s);
      const px = padL + xNorm * plotW;
      const py = padT + plotH - (eps / 0.025) * plotH;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();

    const ly = padT + plotH / 2 - 22 + idx * 24;
    ctx.strokeStyle = curve.color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(padL + plotW + 8, ly);
    ctx.lineTo(padL + plotW + 26, ly);
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = '12px Calibri, Arial, sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(curve.label, padL + plotW + 30, ly);
  });

  const fallbackUrl = c.toDataURL('image/png');

  const candidatePaths = [
    'img/creepstrain-vs-time.png',
    'img/creepstrain-vs-time.jpg',
    'img/creepstrain-vs-time.jpeg',
    'img/creepstrain-vs-time.webp',
    'img/creepstrain-vs-time'
  ];
  let pathIdx = 0;

  function tryLoadNext() {
    if (pathIdx >= candidatePaths.length) {
      imgEl.onerror = null;
      imgEl.src = fallbackUrl;
      return;
    }
    const nextSrc = candidatePaths[pathIdx];
    pathIdx++;
    imgEl.onerror = tryLoadNext;
    imgEl.src = nextSrc;
  }

  tryLoadNext();
}

function initSampleDeformationImage() {
  const sampleImg = document.getElementById('sampleDimImg');
  if (!sampleImg) return;

  const c = document.createElement('canvas');
  c.width = 540;
  c.height = 590;
  const ctx = c.getContext('2d');

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, c.width, c.height);

  ctx.fillStyle = '#efefef';
  ctx.fillRect(65, 4, 410, 190);
  ctx.strokeStyle = '#999999';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(65, 194);
  ctx.lineTo(475, 194);
  ctx.stroke();

  ctx.fillStyle = '#111111';
  ctx.font = '17px Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('SAMPLE DEFORMATION', 270, 32);

  ctx.font = 'bold 20px "Times New Roman", Times, serif';
  const specs = [
    'Final Diameter=1.07mm',
    'InitialDiameter=1.15mm',
    'Initial length of wire=156mm',
    'Final length of wire=196mm',
    'Apply weight=772.2gm',
    'Room Temperature=21°c'
  ];
  specs.forEach((line, idx) => {
    ctx.fillText(line, 270, 62 + idx * 24);
  });

  const semY = 200;
  const semH = 342;
  ctx.fillStyle = '#585858';
  ctx.fillRect(2, semY, 536, semH);

  const pores = [
    [42, 228, 22], [112, 235, 15], [202, 222, 24], [308, 220, 22], [435, 248, 22],
    [495, 312, 25], [32, 308, 17], [98, 352, 19], [40, 410, 23], [112, 435, 17],
    [136, 498, 18], [412, 376, 20], [496, 430, 24], [416, 485, 22]
  ];
  pores.forEach(([x, y, r]) => {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = '#474747';
    ctx.fill();
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = '#8e8e8e';
    ctx.stroke();
  });

  ctx.save();
  ctx.beginPath();
  ctx.moveTo(155, 290);
  ctx.quadraticCurveTo(235, 230, 328, 288);
  ctx.lineTo(395, 352);
  ctx.quadraticCurveTo(378, 488, 275, 535);
  ctx.quadraticCurveTo(175, 475, 145, 360);
  ctx.closePath();

  const grad = ctx.createLinearGradient(145, 255, 385, 515);
  grad.addColorStop(0, '#f4f4f4');
  grad.addColorStop(0.5, '#bcbcbc');
  grad.addColorStop(1, '#7a7a7a');
  ctx.fillStyle = grad;
  ctx.fill();
  ctx.strokeStyle = '#e0e0e0';
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.beginPath();
  ctx.ellipse(326, 438, 32, 66, 0.42, 0, Math.PI * 2);
  ctx.fillStyle = '#181818';
  ctx.fill();
  ctx.strokeStyle = '#969696';
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.restore();

  ctx.fillStyle = '#080808';
  ctx.fillRect(2, 542, 536, 46);
  ctx.fillStyle = '#ffffff';
  ctx.font = '11px Arial, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('200 μm', 10, 557);

  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(10, 568);
  ctx.lineTo(42, 568);
  ctx.moveTo(10, 562);
  ctx.lineTo(10, 574);
  ctx.moveTo(42, 562);
  ctx.lineTo(42, 574);
  ctx.stroke();

  ctx.fillText('Mag = 100 X', 145, 560);
  ctx.fillText('Photo No. = 2229', 145, 578);
  ctx.fillText('EHT = 5.00 kV', 240, 569);
  ctx.fillText('Signal A = SE1', 325, 560);
  ctx.fillText('WD = 16.5 mm', 325, 578);
  ctx.fillText('Date :6 Jan 2011', 415, 560);
  ctx.fillText('Time :11:43:16', 415, 578);
  ctx.font = 'bold 12px Arial, sans-serif';
  ctx.fillText('ZEISS', 495, 570);

  const fallbackDataUrl = c.toDataURL('image/png');
  sampleImg.onerror = function () {
    this.onerror = null;
    this.src = fallbackDataUrl;
  };
  if (!sampleImg.complete || sampleImg.naturalWidth === 0) {
    sampleImg.src = fallbackDataUrl;
    const localProbe = new Image();
    localProbe.onload = function () {
      sampleImg.src = 'img/sample_deformation.jpg';
    };
    localProbe.src = 'img/sample_deformation.jpg';
  }
}

/* =========================================================================
 * 6. UI SYNCHRONIZATION & BLINKING STEP DIALOG POSITIONING
 * ========================================================================= */
function syncUIWithState() {
  const t = I18N[state.lang];

  document.getElementById('appMainTitle').textContent = t.mainTitle;
  document.getElementById('hdrProcedure').textContent = t.hdrProcedure;
  document.getElementById('hdrApparatus').textContent = t.hdrApparatus;
  document.getElementById('hdrOutput').textContent = t.hdrOutput;
  document.getElementById('lblCurrentStepTitle').textContent = t.lblCurrentStepTitle;
  document.getElementById('lblSpecimenHeading').textContent = t.lblSpecimenHeading;
  document.getElementById('btnApplyLoad').textContent = t.btnApplyLoad;
  document.getElementById('btnShowResult').textContent = t.btnShowResult;
  document.getElementById('btnUndo').textContent = t.btnUndo;
  document.getElementById('btnRedo').textContent = t.btnRedo;
  document.getElementById('btnReset').textContent = t.btnReset;
  document.getElementById('lblTheorySummary').textContent = t.lblTheorySummary;
  document.getElementById('lblObsTable').textContent = t.lblObsTable;
  document.getElementById('lblResultGraph').textContent = t.lblResultGraph;
  document.getElementById('thTime').textContent = t.thTime;
  document.getElementById('thStrain').textContent = t.thStrain;

  // Update blinking tooltip texts
  const tip1 = document.getElementById('tooltipStep1');
  const tip2 = document.getElementById('tooltipStep2');
  const tip3 = document.getElementById('tooltipStep3');
  const tip4 = document.getElementById('tooltipStep4');

  tip1.textContent = t.tooltip1;
  tip2.textContent = t.tooltip2;
  tip3.textContent = t.tooltip3;
  tip4.textContent = t.tooltip4;

  // Move the blinking dialog box across the 4 steps
  tip1.classList.toggle('hidden', state.phase !== 'IDLE');
  tip2.classList.toggle('hidden', state.phase !== 'LOADED');
  tip3.classList.toggle('hidden', state.phase !== 'COMPLETED');
  tip4.classList.toggle('hidden', state.phase !== 'RESULT_SHOWN');

  // Lock specimen cards once a specimen is chosen (until UNDO back to IDLE or RESET EXPERIMENT)
  const isSelectionLocked = state.phase !== 'IDLE';
  document.querySelectorAll('.specimen-card').forEach((card) => {
    const id = card.getAttribute('data-specimen');
    const isSelected = id === state.selectedSpecimen;
    card.classList.toggle('active', isSelected);
    card.classList.toggle('disabled-card', isSelectionLocked && !isSelected);
    card.setAttribute('draggable', isSelectionLocked ? 'false' : 'true');
    card.style.cursor = isSelectionLocked ? (isSelected ? 'default' : 'not-allowed') : 'grab';
  });

  const specLabel = state.selectedSpecimen ? SPECIMEN_DATA[state.selectedSpecimen].label : 'None';

  // Step instruction text
  const stepEl = document.getElementById('txtCurrentStep');
  stepEl.textContent = getStepTextForPhase(state.phase, state.lang);

  // Center Viewport HUD & DropZone
  document.getElementById('hudSpecimen').textContent = `SPECIMEN: ${specLabel}`;

  const dropZone = document.getElementById('dropZone');
  if (state.selectedSpecimen) {
    dropZone.textContent = `Mounted: Obstacle Distance = ${specLabel}`;
  } else {
    dropZone.textContent = t.dropHere;
  }

  // Buttons enable/disable
  document.getElementById('btnApplyLoad').disabled = !(state.phase === 'LOADED');
  document.getElementById('btnShowResult').disabled = !(state.phase === 'COMPLETED' || state.phase === 'RESULT_SHOWN');

  // Progress bar
  const pct = Math.round(state.normalizedTime * 100);
  document.getElementById('progressBarFill').style.width = `${pct}%`;
  const progLbl = document.getElementById('txtProgressStatus');
  if (state.phase === 'IDLE') progLbl.textContent = 'Ready for specimen / load';
  else if (state.phase === 'LOADED') progLbl.textContent = 'Specimen mounted — click APPLY LOAD';
  else if (state.phase === 'RUNNING') progLbl.textContent = `Applying load... Wire stretching (${pct}%)`;
  else progLbl.textContent = 'Completed (100%)';

  // Green-on-Black Digital Terminal
  let statusLabel = 'READY';
  if (state.phase === 'LOADED') statusLabel = 'SPECIMEN MOUNTED';
  else if (state.phase === 'RUNNING') statusLabel = 'CREEP IN PROGRESS';
  else if (state.phase === 'COMPLETED' || state.phase === 'RESULT_SHOWN') statusLabel = 'COMPLETED';

  const progressRatio = Math.min(1, Math.max(0, state.currentStrain / 0.0232));
  const liveWireLenMM = 156.0 + progressRatio * (196.0 - 156.0);

  document.getElementById('termStatus').textContent = `STATUS: ${statusLabel}`;
  document.getElementById('termMaterial').textContent = `OBSTACLE DISTANCE (λ): ${state.selectedSpecimen ? state.selectedSpecimen + ' μm' : 'None'}`;
  document.getElementById('termInitLen').textContent = 'INITIAL LENGTH (L₀): 156 mm';
  document.getElementById('termInitDia').textContent = 'INITIAL DIAMETER (d₀): 1.15 mm';
  document.getElementById('termWeight').textContent = 'APPLIED WEIGHT: 772.2 gm';
  document.getElementById('termTemp').textContent = 'ROOM TEMPERATURE: 21°C';
  document.getElementById('termCurrentWireLen').textContent = `CURRENT WIRE LENGTH: ${liveWireLenMM.toFixed(1)} mm`;
  document.getElementById('termTime').textContent = `NORMALIZED TIME: ${state.normalizedTime.toFixed(3)}`;
  document.getElementById('termStrain').textContent = `CURRENT STRAIN ε: ${state.currentStrain.toFixed(5)}`;
  document.getElementById('termFinalStrain').textContent =
    state.finalStrain !== null ? `FINAL STRAIN ε: ${state.finalStrain.toFixed(5)}` : 'FINAL STRAIN ε: —';

  // Results Table: Show Strain values at 0.2, 0.4, 0.6, 0.8, and 1
  const tbody = document.getElementById('obsTableBody');
  if ((state.phase === 'COMPLETED' || state.phase === 'RESULT_SHOWN') && state.selectedSpecimen) {
    tbody.innerHTML = RESULT_TIME_POINTS.map((pt) => {
      const strainVal = computeIndividualStrain(state.selectedSpecimen, pt);
      return `
        <tr>
          <td class="font-bold text-stone-900">${pt}</td>
          <td class="font-bold text-stone-900">${strainVal.toFixed(5)}</td>
        </tr>`;
    }).join('');
  } else {
    tbody.innerHTML = `
      <tr>
        <td colspan="2" class="py-3 text-stone-600">
          Complete the experiment to populate the table.
        </td>
      </tr>`;
  }

  // Result Graph Section
  const placeholder = document.getElementById('graphPlaceholder');
  const activeWrap = document.getElementById('graphActiveWrapper');
  if (state.phase === 'RESULT_SHOWN' && state.selectedSpecimen) {
    placeholder.classList.add('hidden');
    activeWrap.classList.remove('hidden');
    activeWrap.classList.add('flex');
    renderSingleSpecimenGraph(state.selectedSpecimen);
  } else {
    placeholder.classList.remove('hidden');
    activeWrap.classList.add('hidden');
    activeWrap.classList.remove('flex');
  }
}

/* =========================================================================
 * 7. EXPERIMENT WORKFLOW ACTIONS (WITH SPECIMEN LOCK & STEP AUDIO SYNC)
 * ========================================================================= */
function selectSpecimen(specId) {
  // Block changing specimen once one has been chosen until UNDO (to IDLE) or RESET EXPERIMENT
  if (state.phase !== 'IDLE') return;
  if (!SPECIMEN_DATA[specId]) return;

  state.selectedSpecimen = specId;
  state.phase = 'LOADED'; // Step 2
  state.normalizedTime = 0;
  state.currentStrain = 0;
  state.finalStrain = null;
  state.tableRows = [];

  syncUIWithState();
  playSpecimenMountingAnimation(specId);
  saveSnapshot();
  playCurrentStepAudio();
}

function startCreepExperiment() {
  if (state.phase !== 'LOADED' || !state.selectedSpecimen) return;

  if (state.mountAnimId) {
    cancelAnimationFrame(state.mountAnimId);
    state.mountAnimId = null;
  }

  state.phase = 'RUNNING'; // Step 3
  state.normalizedTime = 0;
  state.currentStrain = 0;
  state.finalStrain = null;
  state.tableRows = [];
  syncUIWithState();
  update3DApparatusFromState();
  updateUndoRedoButtons();
  playCurrentStepAudio();

  const specId = state.selectedSpecimen;
  const durationMs = 4500;
  const startTime = performance.now();

  function stepFrame(now) {
    const elapsed = now - startTime;
    const u = Math.min(1, elapsed / durationMs);

    state.normalizedTime = u;
    state.currentStrain = computeIndividualStrain(specId, u);

    const progressRatio = Math.min(1, Math.max(0, state.currentStrain / 0.0232));
    const liveWireLenMM = 156.0 + progressRatio * (196.0 - 156.0);

    document.getElementById('termCurrentWireLen').textContent = `CURRENT WIRE LENGTH: ${liveWireLenMM.toFixed(1)} mm`;
    document.getElementById('termTime').textContent = `NORMALIZED TIME: ${state.normalizedTime.toFixed(3)}`;
    document.getElementById('termStrain').textContent = `CURRENT STRAIN ε: ${state.currentStrain.toFixed(5)}`;

    const pct = Math.round(u * 100);
    document.getElementById('progressBarFill').style.width = `${pct}%`;
    document.getElementById('txtProgressStatus').textContent =
      `Applying load... Wire stretching downward (${pct}%)`;

    update3DApparatusFromState();

    if (u < 1) {
      state.animFrameId = requestAnimationFrame(stepFrame);
    } else {
      state.animFrameId = null;
      completeCreepExperiment();
    }
  }

  state.animFrameId = requestAnimationFrame(stepFrame);
}

function completeCreepExperiment() {
  const specId = state.selectedSpecimen;
  state.phase = 'COMPLETED'; // Step 4
  state.normalizedTime = 1.0;
  state.currentStrain = computeIndividualStrain(specId, 1.0);
  state.finalStrain = state.currentStrain;

  state.tableRows = RESULT_TIME_POINTS.map((pt) => ({
    time: pt,
    strain: computeIndividualStrain(specId, pt)
  }));

  syncUIWithState();
  update3DApparatusFromState();
  saveSnapshot();
  playCurrentStepAudio();
}

function showExperimentResult() {
  if (state.phase !== 'COMPLETED' && state.phase !== 'RESULT_SHOWN') return;
  state.phase = 'RESULT_SHOWN'; // Step 5
  syncUIWithState();
  saveSnapshot();
  playCurrentStepAudio();
}

function resetExperiment() {
  if (state.animFrameId) {
    cancelAnimationFrame(state.animFrameId);
    state.animFrameId = null;
  }
  state.phase = 'IDLE'; // Step 1
  state.selectedSpecimen = null;
  state.normalizedTime = 0;
  state.currentStrain = 0;
  state.finalStrain = null;
  state.tableRows = [];

  syncUIWithState();
  update3DApparatusFromState();
  saveSnapshot();
  playCurrentStepAudio();
}

/* =========================================================================
 * 8. INITIALIZATION & EVENT LISTENERS
 * ========================================================================= */
window.addEventListener('DOMContentLoaded', function () {
  initSampleDeformationImage();
  initCreepStrainVsTimeImage();
  initThreeApparatus();
  animateThreeLoop();

  saveSnapshot();
  syncUIWithState();
  update3DApparatusFromState();

  // Specimen Cards Click & Drag-and-Drop (Only allowed in IDLE phase)
  const cards = document.querySelectorAll('.specimen-card');
  const dropZone = document.getElementById('dropZone');
  const viewportWrapper = document.getElementById('viewportWrapper');

  cards.forEach((card) => {
    const specId = card.getAttribute('data-specimen');

    card.addEventListener('click', () => {
      if (state.phase !== 'IDLE') return;
      selectSpecimen(specId);
    });

    card.addEventListener('keydown', (e) => {
      if (state.phase !== 'IDLE') return;
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        selectSpecimen(specId);
      }
    });

    card.addEventListener('dragstart', (e) => {
      if (state.phase !== 'IDLE') {
        e.preventDefault();
        return;
      }
      e.dataTransfer.setData('text/plain', specId);
      dropZone.classList.add('drag-over');
    });

    card.addEventListener('dragend', () => {
      dropZone.classList.remove('drag-over');
    });
  });

  [dropZone, viewportWrapper].forEach((target) => {
    target.addEventListener('dragover', (e) => {
      if (state.phase !== 'IDLE') return;
      e.preventDefault();
      dropZone.classList.add('drag-over');
    });

    target.addEventListener('dragleave', () => {
      dropZone.classList.remove('drag-over');
    });

    target.addEventListener('drop', (e) => {
      dropZone.classList.remove('drag-over');
      if (state.phase !== 'IDLE') return;
      e.preventDefault();
      const specId = e.dataTransfer.getData('text/plain');
      if (specId) selectSpecimen(specId);
    });
  });

  // Main Action Buttons
  document.getElementById('btnApplyLoad').addEventListener('click', startCreepExperiment);
  document.getElementById('btnShowResult').addEventListener('click', showExperimentResult);
  document.getElementById('btnReset').addEventListener('click', resetExperiment);

  document.getElementById('btnUndo').addEventListener('click', () => {
    if (historyPointer > 0 && state.phase !== 'RUNNING') {
      historyPointer--;
      restoreSnapshot(historyStack[historyPointer]);
    }
  });

  document.getElementById('btnRedo').addEventListener('click', () => {
    if (historyPointer < historyStack.length - 1 && state.phase !== 'RUNNING') {
      historyPointer++;
      restoreSnapshot(historyStack[historyPointer]);
    }
  });

  // Language Selector
  document.getElementById('langSelect').addEventListener('change', (e) => {
    state.lang = e.target.value;
    syncUIWithState();
    if (state.audio === 'on') {
      playCurrentStepAudio();
    }
  });

  // Audio Selector
  document.getElementById('audioSelect').addEventListener('change', (e) => {
    state.audio = e.target.value;
    if (state.audio === 'on') {
      playCurrentStepAudio();
    } else {
      stopAllAudio();
    }
  });
});