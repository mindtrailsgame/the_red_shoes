console.log("🚀 App.js is running!");

document.addEventListener('DOMContentLoaded', () => {

    const MOTIVES = [
        "Revenge", "Anger", "Jealousy", "Pleasure", "Self-defence", 
        "Sacrifice to a real or imagined being", "To steal something guarded/possessed by the victim",
        "Under compulsion by someone/something else", "To cover up a crime", "To stop a witness from testifying",
        "To stop the victim from obtaining something", "To stop the victim from revealing something",
        "To send a message to others", "To stop an event from happening", "To cause misdirection",
        "Caused the death by accident", "Tricked by an illusion", "Psychotic break from reality",
        "Serial Killer", "Mistaken identity", "Hired to kill the victim", "To trigger or fulfill a prophecy",
        "To harvest the body for components for a ritual", "To fulfill a promise to the victim",
        "Engineered by the victim to switch bodies", "Criminal territorial dispute",
        "Faked murder, victim isn't really dead", "Faked murder gone wrong",
        "Foreign espionage/Political assassination", "Monster Hunter. The victim was a monster.",
        "Religious fanaticism", "Spurned, or jilted lover", "Terrorism", "To escape captors",
        "To frame someone", "To stop a prophecy", "To punish or hurt someone who cared about the victim",
        "To remove the competition", "Victim tried to apprehend murderer for a crime",
        "Victim tried to stop a crime", "Victim was an imposter", "Victim was possessed",
        "Victim was an unfaithful/traitor", "Vigilante justice", "Wrong place, wrong time",
        "Suicide that looks like murder", "Monster summoning gone wrong",
        "Victim asked to be killed (Euthanasia)", "To collect on a debt"
    ];

    const loadingScreen = document.getElementById('loading-screen');
    const startScreen = document.getElementById('start-screen');
    let isGameLoaded = false;

    // Pagalbinė funkcija krovimo ekranui paslėpti
    function hideLoadingScreen() {
        if (isGameLoaded) return; // Jei jau užkrauta, nieko nedarome
        
        console.log("🎬 Hiding loading screen...");
        isGameLoaded = true;

        // Naudojame "grubią jėgą" - tiesiogiai paslepiame elementą
        if (loadingScreen) {
            loadingScreen.style.display = 'none'; 
        }
        
        // Parodome starto ekraną
        if (startScreen) {
            startScreen.classList.add('active');
        }
    }

    // --- SERVICE WORKER REGISTRATION ---
    if ('serviceWorker' in navigator) {
        // 1. GREITAS STARTAS: Jei žaidėjas grįžta ir SW jau veikia
        if (navigator.serviceWorker.controller) {
            console.log("⚡ Fast start (SW already controlling)");
            hideLoadingScreen();
        }

        navigator.serviceWorker.register('/the_red_shoes/sw.js', { scope: '/the_red_shoes/' })
            .then((registration) => {
                // 2. ANTRAS ŠANSAS: Kartais 'controller' dar nebūna, bet 'active' jau yra
                if (registration.active && !navigator.serviceWorker.controller) {
                     console.log("⚡ Fast start (SW active)");
                     hideLoadingScreen();
                }

                if (registration.installing) {
                    const sw = registration.installing;
                    sw.addEventListener('statechange', (e) => {
                        if (e.target.state === 'activated') {
                            console.log("🎉 SW installed and activated!");
                            showToast("Game ready for offline!");
                            // 3. PORMAS KARTAS: Viskas atsisiuntė, slepiame ekraną
                            hideLoadingScreen();
                        }
                    });
                }
            })
            .catch((error) => {
                console.error('SW registration failed:', error);
                // Svarbu: jei SW nulūžo, vis tiek leidžiame žaisti
                hideLoadingScreen();
            });
    } else {
        // Jei naršyklė sena ir nepalaiko SW
        hideLoadingScreen();
    }

    // --- FAILSAFE (Atsarginis variantas) ---
    // Jei dėl kokių nors priežasčių SW užstringa, po 10 sekundžių vis tiek paleidžiame žaidimą.
    setTimeout(() => {
        if (!isGameLoaded) {
            console.warn("⚠️ Loading timed out, forcing start.");
            hideLoadingScreen();
        }
    }, 30000); // 10 sekundžių limitas
    // --- Story Data ---
    let storyData = {};

    // --- DOM Elements ---
    const dom = {
        
        screens: document.querySelectorAll('.screen'),
        startScreen: document.getElementById('start-screen'),
        gameScreen: document.getElementById('game-screen'),
        endScreen: document.getElementById('end-screen'),
        teamNameInput: document.getElementById('team-name-input'),
        teamNameDisplay: document.getElementById('team-name-display'),
        startBtn: document.getElementById('start-btn'),
        restartBtn: document.getElementById('restart-btn'),
        gameContent: document.getElementById('game-content'),
        dialogueContainer: document.getElementById('dialogue-container'),
        npcDialogue: document.getElementById('npc-dialogue'),
        dialogueHistory: document.getElementById('dialogue-history'),
        dialogueScrollContent: document.querySelector('.dialogue-scroll-content'),
        currentDialogueWrapper: document.getElementById('current-dialogue-wrapper'),
        playerDialogue: document.getElementById('player-dialogue'),
        npcName: document.getElementById('npc-name'),
        npcText: document.getElementById('npc-text'),

        motiveGroup: document.getElementById('motive-group'),
        choiceIndicator: document.getElementById('choice-indicator'),

        playerResponseText: document.getElementById('player-response-text'),
        responseDots: document.getElementById('response-dots'),
        testConvoBtn: document.getElementById('test-convo-btn'),
        caseFilesBtn: document.getElementById('case-files-btn'),
        caseFilesPanel: document.getElementById('case-files-panel'),
        cfTeamName: document.getElementById('cf-team-name'),
        closeCaseFilesBtn: document.getElementById('close-case-files-btn'),
        caseFilesContent: document.getElementById('case-files-content'),

        finalAccusationSection: document.getElementById('final-accusation-section'),
        suspectChecklist: document.getElementById('suspect-checklist'),
        motiveChecklist: document.getElementById('motive-checklist'),
        submitAccusationBtn: document.getElementById('submit-accusation-btn'),
        navBtnSuspects: document.getElementById('nav-btn-suspects'),
        navBtnAccusation: document.getElementById('nav-btn-accusation'),

        qrScanScreen: document.getElementById('qr-scan-screen'),
        qrReader: document.getElementById('qr-reader'),
        scanQrBtn: document.getElementById('scan-qr-btn'),
        cancelScanBtn: document.getElementById('cancel-scan-btn'),
        motiveGroup: document.getElementById('motive-group')
    };

    // --- Game State ---
    let gameState = {};
    const STORAGE_KEY = 'larpGameState';
    let touchStartX = 0;
    let touchEndX = 0;
    let touchStartY = 0; 
    let touchEndY = 0;
    let touchStartScrollTop = 0;
    let html5QrCode = null;
    const voicePlayer = new Audio();


// --- HELPER FUNCTIONS ---


    function setAppHeight() {
        const doc = document.documentElement;
        const viewportHeight = window.visualViewport ? window.visualViewport.height : window.innerHeight;
        doc.style.setProperty('--app-height', `${viewportHeight}px`);
    }

   

    function showToast(message) {
        const toast = document.getElementById('toast-notification');
        if (!toast) return;
        toast.textContent = message;
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    function handleSwipe() {
        const swipeThreshold = 50;
        if (touchEndX < touchStartX - swipeThreshold) cycleChoice(1);
        if (touchEndX > touchStartX + swipeThreshold) cycleChoice(-1);

    }

/**
 * Parodo konkretų "puslapį" bylos skydelyje (Byla arba Kaltinimas)
 * @param {string} viewId - ID elemento, kurį rodyti ('case-files-content' arba 'final-accusation-section')
 */
function showCaseFileView(viewId) {
    // 1. Paslepiame visus puslapius
    dom.caseFilesContent.classList.remove('is-active-view');
    dom.finalAccusationSection.classList.remove('is-active-view');

    // 2. Nuimame aktyvias klases nuo mygtukų
    dom.navBtnSuspects.classList.remove('active');
    dom.navBtnAccusation.classList.remove('active');

    // 3. Rodome norimą puslapį ir pažymime mygtuką kaip aktyvų
    if (viewId === 'final-accusation-section') {
        dom.finalAccusationSection.classList.add('is-active-view');
        dom.navBtnAccusation.classList.add('active');
    } else {
        // Numatytasis yra 'case-files-content' (Byla)
        dom.caseFilesContent.classList.add('is-active-view');
        dom.navBtnSuspects.classList.add('active');
    }
}
    
    // --- QR SCANNER FUNCTIONS ---

/**
 * Sėkmingo nuskaitymo atveju paleidžiama funkcija
 */
function onScanSuccess(decodedText, decodedResult) {
    console.log(`Nuskaitytas kodas: ${decodedText}`);

    // Sustabdome skaitytuvą, kad atlaisvintume kamerą
    stopQrScan().then(() => {
        // Tikriname, ar nuskaitytas tekstas atitinka NPC ID formatą
        if (storyData[`${decodedText}_intro`]) {
            showScreen('game-screen'); // Įsitikiname, kad aktyvus žaidimo ekranas
            startConversation(decodedText); // Pradedame pokalbį!
        } else {
            console.warn(`Nuskaitytas QR kodas "${decodedText}" nėra galiojantis NPC.`);
            showToast(`"${decodedText}" nėra atpažintas.`);
            showScreen('game-screen'); // Grąžiname į žaidimo ekraną
        }
    }).catch(err => {
        console.error("Klaida stabdant skaitytuvą po sėkmės:", err);
        // Vis tiek bandome pradėti pokalbį
        if (storyData[`${decodedText}_intro`]) {
            showScreen('game-screen');
            startConversation(decodedText);
        }
    });
}

/**
 * Nesėkmingo nuskaitymo atveju paleidžiama funkcija (ignoruojame klaidas)
 */
function onScanFailure(error) {
    // Ši funkcija kviečiama kiekvieną kadrą, kai kodas nerandamas.
    // Geriausia ją palikti tuščią, nebent norite derinti (debug).
    // console.warn(`QR kodo nuskaitymo klaida: ${error}`);
}

/**
 * Paleidžia QR kodo skaitytuvą ir parodo nuskaitymo ekraną
 */
function startQrScan() {
    // 1. Pirmiausia parodome ekraną
    showScreen('qr-scan-screen');

    // 2. Duodame šiek tiek laiko naršyklei "nupiešti" ekraną,
    //    kad konteineris turėtų realų dydį prieš paleidžiant kamerą.
    setTimeout(() => {
        const config = {
            fps: 10,
            qrbox: { width: 250, height: 250 }
        };

        // 3. Paleidžiame skaitytuvą TIK po pauzės
        html5QrCode.start(
            { facingMode: "environment" },
            config,
            onScanSuccess,
            onScanFailure
        ).catch(err => {
            console.error("Nepavyko paleisti QR skaitytuvo", err);
            showToast("Nepavyko paleisti kameros.");
            // Jei nepavyko, grįžtame atgal
            showScreen('game-screen');
        });
    }, 300); // 300ms pauzė
}

/**
 * Sustabdo QR kodo skaitytuvą ir grįžta į žaidimo ekraną
 */
function stopQrScan() {
    return html5QrCode.stop().then(() => {
        console.log("QR skaitytuvas sustabdytas.");
        showScreen('game-screen');
    }).catch(err => {
        console.warn("QR skaitytuvo stabdymas nepavyko, bet tęsiame.", err);
        showScreen('game-screen'); // Vis tiek grįžtame į žaidimo ekraną
    });
}

/**
 * Paleidžia balso įrašą, atitinkantį dialogo mazgą.
 * Failo pavadinimas turi atitikti mazgo ID (pvz., audio/NODE_ID.mp3)
 */
// app.js

/**
 * Paleidžia balso įrašą, atitinkantį dialogo mazgą.
 * Failo pavadinimas turi atitikti mazgo ID (pvz., audio/NPC_VARDAS/NODE_ID.mp3)
 */
function playVoiceLine(nodeId) {
    // 1. Sustabdome bet kokį anksčiau grotą įrašą
    if (voicePlayer && !voicePlayer.paused) {
        voicePlayer.pause();
        voicePlayer.currentTime = 0;
    }

    // 2. Gauname mazgo duomenis
    const node = storyData[nodeId];
    if (!node) return;

    // 3. Tikriname, ar šį mazgą reikia įgarsinti
    if (node.text === null || !node.npc || node.npc === "YOU") {
        return;
    }

    // --- PRASIDEDA PAKEISTA LOGIKA ---
    // 4. Sukuriame kelia iki failo pagal naują aplankų struktūrą
    
    // Gauname prefiksą iš mazgo ID (pvz., "DAUMANTAS" iš "DAUMANTAS_intro")
    let folderName = nodeId.split('_')[0].toLowerCase();

        // SPECIALUS ATVEJIS: Rapolo kūnas turi dviejų žodžių aplanką
        if (nodeId.startsWith('RAPOLAS_BODY')) {
            folderName = 'rapolas_body';
        }

        if (nodeId.startsWith('NUSIKALTIMO_VIETA2')) {
            folderName = 'nusikaltimo_vieta2';
        }

    // Sukuriame naują kelią
    const audioSrc = `audio/${folderName}/${nodeId}.mp3`;
    // --- PAKEISTOS LOGIKOS PABAIGA ---


    // 5. Nustatome naują failą ir paleidžiame
    voicePlayer.src = audioSrc;
    
    const playPromise = voicePlayer.play();

    if (playPromise !== undefined) {
        playPromise.catch(error => {
            if (error.name === "NotSupportedError") {
                console.log(`Balso failas nerastas: ${audioSrc}`);
            } else {
                console.error(`Garso klaida mazgui ${nodeId}:`, error);
            }
        });
    }
}

// app.js



/**
 * Inicializuoja skaitytuvo objektą ir priskiria mygtukų paspaudimus
 */
function initializeQrScanner() {
    // Sukuriame naują skaitytuvo objektą, susietą su mūsų HTML elementu
    html5QrCode = new Html5Qrcode("qr-reader");

    // Priskiriame naujų mygtukų paspaudimus
    dom.scanQrBtn.addEventListener('click', startQrScan);
    dom.cancelScanBtn.addEventListener('click', stopQrScan);
}

/**
 * Tikrina, ar dabartinis mazgas yra monologas, ir jį tęsia.
 * @returns {boolean} - Grąžina 'true', jei monologas buvo sėkmingai pratęstas
 * */
    function advanceMonologue() {
        if (!gameState.currentConversation) return false;
        
        const node = storyData[gameState.currentConversation.currentNode];
        if (!node) return false;

        // Tikriname, ar tai monologo mazgas
        const isMonologueNode = node.choices.length === 1 && node.choices[0].text === '...';

        if (isMonologueNode) {
            // Taip, tai monologas. Pereiname prie kito mazgo.
            gameState.currentConversation.history.push({ 
                speaker: (node.npc || gameState.currentConversation.npcId).toUpperCase(), 
                text: node.text // <-- ČIA TURI BŪTI 'node.text', o ne 'currentNode.text'
            });
            
            const nextNodeId = node.choices[0].target_node;
            
            // Įkeliame kitą mazgą
            renderNode(nextNodeId, true, true, null, null);
            return true; // Sėkmingai perėjome
        }
        
        return false; // Tai nebuvo monologo mazgas
    }

    function cycleChoice(direction) {
        const allDots = Array.from(dom.responseDots.querySelectorAll('.response-dot:not(.used)'));
        if (allDots.length <= 1) return;
        const currentIndex = allDots.findIndex(dot => dot.classList.contains('active'));
        let newIndex = (currentIndex + direction + allDots.length) % allDots.length;
        allDots[newIndex].click();
    }

    // --- CORE GAME FUNCTIONS ---

    function showScreen(screenId) {
        dom.screens.forEach(s => s.classList.toggle('active', s.id === screenId));
    }

    function saveGameState() {


        localStorage.setItem(STORAGE_KEY, JSON.stringify(gameState));
        console.log("Game saved! 💾", gameState);
    }

    function loadGameState() {
        const savedStateJSON = localStorage.getItem(STORAGE_KEY);
        if (savedStateJSON) {
            gameState = JSON.parse(savedStateJSON);
            console.log("Found saved game. Loading... ✨", gameState);

            if (!gameState.accusation) {
                gameState.accusation = { suspects: [], motives: [], isFinal: false };
            }

            if (typeof gameState.accusation.isFinal === 'undefined') {
                gameState.accusation.isFinal = false;
            }

            dom.teamNameDisplay.textContent = gameState.teamName;
            showScreen('game-screen');
            if (gameState.currentConversation) {
                renderNode(gameState.currentConversation.currentNode);
            }
            return true;
        }
        console.log("No saved game found.");
        return false;
    }

    function initGame() {
        const teamName = dom.teamNameInput.value.trim();
        if (teamName === "") {
            alert("Please enter a team name!");
            return;
        }

        if (voicePlayer.paused) {
            voicePlayer.play().catch(() => {}); // Bandome paleisti (gali būti tyla)
            voicePlayer.pause(); // Ir iškart sustabdome
        }

        gameState = {
            teamName: teamName,
            currentConversation: null,
            progress: {},
            caseFiles: {},
            accusation: { suspects: [], motives: [], isFinal: false }
        };
        saveGameState();
        dom.teamNameDisplay.textContent = gameState.teamName;
        showScreen('game-screen');
    }

    function restartGame() {
        if (confirm("Are you sure you want to start over? All progress will be lost.")) {
            localStorage.removeItem(STORAGE_KEY);
            window.location.reload();
        }
    }

    // --- DIALOGUE FUNCTIONS ---

// In app.js



// app.js (pakeiskite senąją handleDialogueSwipe versiją šia)

// in app.js
    // REPLACE your old handleDialogueSwipe with this
        function handleDialogueSwipe() {
            const swipeThreshold = 50;

            if (touchEndY > touchStartY + swipeThreshold) {
                dom.dialogueContainer.classList.add('is-expanded');
            }

            if (touchEndY < touchStartY - swipeThreshold) {
                advanceDialogue(); // Just call the new function
            }
        }


        // app.js

        function advanceDialogue() {
            if (!gameState.currentConversation) return;

            const currentNode = storyData[gameState.currentConversation.currentNode];
            if (!currentNode) return;

            // Priority 1: Check for Chain Link behavior.
            if (currentNode.is_chain_link) {
                const validChoice = currentNode.choices.find(choice => !choice.condition || checkCondition(choice.condition));
                if (validChoice) {
                    const nextNodeId = validChoice.target_node;
                    let preselectedChoiceData = null;
                    let keepChoicesVisibleOnNextNode = false; 

                    const nextNode = storyData[nextNodeId];

                    const isNextNodeAMonologue = nextNode && nextNode.choices.length === 1 && nextNode.choices[0].text === '...';

                    if (nextNode && nextNode.choices && nextNode.choices.length > 0 && !nextNode.is_chain_link && !isNextNodeAMonologue) {
                
                        const firstValidChoiceOfNextNode = nextNode.choices.find(c => !c.condition || checkCondition(c.condition));
                        if (firstValidChoiceOfNextNode) {
                            let choiceText = '';
                            if (Array.isArray(firstValidChoiceOfNextNode.text)) {
                                const validTextObject = firstValidChoiceOfNextNode.text.find(t => t.condition ? checkCondition(t.condition) : true) || firstValidChoiceOfNextNode.text[firstValidChoiceOfNextNode.text.length - 1];
                                choiceText = validTextObject.value;
                            } else {
                                choiceText = firstValidChoiceOfNextNode.text;
                            }
                            
                            preselectedChoiceData = {
                                text: choiceText,
                                target_node: firstValidChoiceOfNextNode.target_node,
                                set_flag: firstValidChoiceOfNextNode.set_flag || '',
                                keep_visible: firstValidChoiceOfNextNode.keep_choices_visible || 'false'
                            };
                            
                            keepChoicesVisibleOnNextNode = true; 
                        }
                    }
                    renderNode(nextNodeId, keepChoicesVisibleOnNextNode, true, null, preselectedChoiceData);
                    return;
                } else {
                    console.error(`Chain link node "${gameState.currentConversation.currentNode}" has no valid path.`);
                }
            }

            // Priority 2: Check for traditional Monologue behavior (if not a chain link).
            const isMonologueNode = currentNode.choices.length === 1 && currentNode.choices[0].text === '...';
            if (isMonologueNode) {

                // --- ŠTAI ČIA TURI BŪTI ĮDĖTAS KODAS ---
                gameState.currentConversation.history.push({ 
                    speaker: (currentNode.npc || gameState.currentConversation.npcId).toUpperCase(), 
                    text: currentNode.text 
                });
                // --- KODO PABAIGA ---

                const nextNodeId = currentNode.choices[0].target_node;
                const nextNode = storyData[nextNodeId];
                let keepChoicesVisibleOnNextNode = false;

                if (nextNode && !nextNode.is_chain_link && (nextNode.choices.length > 1 || (nextNode.choices.length === 1 && nextNode.choices[0].text !== '...'))) {
                    keepChoicesVisibleOnNextNode = true;
                }

                renderNode(nextNodeId, keepChoicesVisibleOnNextNode, true, null, null);
                return;
            }

            // Priority 3: Default behavior (show/hide choices).
            if (dom.playerDialogue.classList.contains('is-hidden')) {
                dom.playerDialogue.classList.remove('is-hidden');
                dom.choiceIndicator.classList.remove('is-visible');
            } else {
                dom.dialogueContainer.classList.remove('is-expanded');
            }
        }


    // --- NAUJAS KODAS ---
    function startConversation(npcId) {
        if (!gameState.progress[npcId]) { gameState.progress[npcId] = {}; }

        // --- NAUJA LOGIKA PRADŽIOS MAZGUI ---
        let startNode = `${npcId}_intro`; // Numatytasis pradžios mazgas

        // Speciali logika NPC
       
        if (npcId === 'DAUMANTAS') {
            // Saugiai patikriname, ar egzistuoja `progress` ir vėliavėlė
            const daumantasProgress = gameState.progress.DAUMANTAS;
            
            // Priority 1: Check for the final win/loss states
            if (daumantasProgress?.daumantas_state === 'won') {
                startNode = 'DAUMANTAS_post_win_text';
            } else if (daumantasProgress?.daumantas_state === 'lost') {
                startNode = 'DAUMANTAS_post_loss_text';
            
            // Priority 2: Check for the "part 2" checkpoint
            } else if (daumantasProgress?.daumantas_reached_part2 === true) {
                startNode = 'DAUMANTAS_re_entry_part2';
            }

              } else if (npcId === 'DARKO') {
            const darkoProgress = gameState.progress.DARKO;

            if (darkoProgress?.darko_reached_part2 === true) {
                startNode = 'DARKO_re_entry_part2';
            }

            } else if (npcId === 'VARNALESA') {
                const varnalesaProgress = gameState.progress.VARNALESA;

                // Priority 1: Check for the final win/loss states
                if (varnalesaProgress?.varnalesa_state === 'won') {
                    startNode = 'VARNALESA_post_win_text';
                } else if (varnalesaProgress?.varnalesa_state === 'lost') {
                    startNode = 'VARNALESA_post_loss_text';
                
                // Priority 2: Check for the "part 2" checkpoint
                } else if (varnalesaProgress?.varnalesa_reached_part2 === true) {
                    startNode = 'VARNALESA_re_entry_part2';
                }
            
            
            } else if (npcId === 'RICARDAS') { 
            const ricardasProgress = gameState.progress.RICARDAS;

            // Priority 1: Check for the final win/loss states
            if (ricardasProgress?.ricardas_state === 'won') {
                startNode = 'RICARDAS_post_win_text';
            } else if (ricardasProgress?.ricardas_state === 'lost') {
                startNode = 'RICARDAS_post_loss_text';
            
            // Priority 2: Check for the "part 2" checkpoint
            } else if (ricardasProgress?.ricardas_reached_part2 === true) {
                startNode = 'RICARDAS_re_entry_part2';
            }
        

        } else if (npcId === 'SIAURINIS') { 
            const siaurinisProgress = gameState.progress.SIAURINIS;

            // Priority 1: Check for the final win/loss states
            if (siaurinisProgress?.siaurinis_state === 'won') {
                startNode = 'SIAURINIS_post_win_text';
            } else if (siaurinisProgress?.siaurinis_state === 'lost') {
                startNode = 'SIAURINIS_post_loss_text';
            
            // Priority 2: Check for the "part 2" checkpoint
            } else if (siaurinisProgress?.siaurinis_reached_part2 === true) {
                startNode = 'SIAURINIS_re_entry_part2';
            }
        

        } else if (npcId === 'LAUME') { 
            const laumeProgress = gameState.progress.LAUME;

            // Priority 1: Check for the final win/loss states
            if (laumeProgress?.laume_state === 'won') {
                startNode = 'LAUME_post_win_text';
            } else if (laumeProgress?.laume_state === 'lost') {
                startNode = 'LAUME_post_loss_text';
            
            // Priority 2: Check for the "part 2" checkpoint
            } else if (laumeProgress?.laume_reached_part2 === true) {
                startNode = 'LAUME_re_entry_part2';
            }
        
        
        } else if (npcId === 'RAPOLAS_BODY') { 
            const bodyProgress = gameState.progress.RAPOLAS_BODY;

            // Priority 1: Check if hub has been reached
            if (bodyProgress?.rapolas_body_reached_hub === true) {
                startNode = 'RAPOLAS_BODY_re_entry';
            }
            // Nėra laimėjimo/pralaimėjimo būsenos kūnui
        }
        // If none of the above are true, it will use the default 'DAUMANTAS_intro'

        gameState.currentConversation = {
            npcId: npcId,
            currentNode: startNode,
            history: [], 
            keyStatements: []
        };

        // Show both the NPC panel and the Player choices bar
        dom.gameContent.style.display = 'none';
        dom.dialogueContainer.classList.add('is-active');
        dom.playerDialogue.classList.add('is-active');

        /*updateDialoguePanelPosition();*/
    renderNode(gameState.currentConversation.currentNode, false, false, null, null);
        
    }

    function renderHistory() {
    dom.dialogueHistory.innerHTML = '';
    if (!gameState.currentConversation || !gameState.currentConversation.history) return;
    gameState.currentConversation.history.forEach(entry => {
        const p = document.createElement('p');
        p.classList.add('history-entry', entry.speaker === 'player' ? 'player-line' : 'npc-line');
        const speakerName = entry.speaker === 'player' ? 'YOU' : entry.speaker;
        p.textContent = `${speakerName} - "${entry.text}"`;
        dom.dialogueHistory.appendChild(p);
    });
}

    // app.js

    // app.js

    function renderNode(nodeId, keepChoicesVisible = false, isAnimated = false, questionContext = null, preselectedChoiceData = null) {
        const node = storyData[nodeId];
        if (!node) {
            console.error(`Node "${nodeId}" not found!`);
            return;
        }

        if (node.is_key_statement) {
            gameState.currentConversation.keyStatements.push({
                title: node.statement_title,
                text: node.text,
                question: questionContext
            });
        }

        if (node.set_flag) {
            const [key, value] = node.set_flag.split('=').map(s => s.trim());
            const npcId = gameState.currentConversation.npcId;
            let processedValue = (value === 'true') ? true : (value === 'false') ? false : value;
            gameState.progress[npcId][key] = processedValue;
            console.log(`Flag set by node '${nodeId}': ${npcId}.${key} = ${processedValue}`);
        }

        gameState.currentConversation.currentNode = nodeId;

        playVoiceLine(nodeId);
        
        saveGameState();
        renderHistory();

          if (node.is_end) {
            endConversation();
            return; 
        }

        if (node.text !== null) {
            const npcName = (node.npc || gameState.currentConversation.npcId).toUpperCase();
            const dialogueText = node.text.replace(/(?<!\w)'|'(?!\w)/g, '"');
            const newHtml = `<span class="npc-prefix" data-speaker="${npcName}">${npcName} – </span>${dialogueText}`;
          
            if (isAnimated) {
                const oldTextEl = dom.npcText;
                const newTextEl = document.createElement('p');
                newTextEl.id = 'npc-text';
                newTextEl.innerHTML = newHtml;
                newTextEl.classList.add('is-entering');
                const wrapper = dom.currentDialogueWrapper;
                wrapper.appendChild(newTextEl);
                wrapper.insertBefore(newTextEl, dom.choiceIndicator);
                void newTextEl.offsetHeight;
                oldTextEl.classList.add('is-exiting');
                newTextEl.classList.remove('is-entering');
                dom.npcText = newTextEl;
                oldTextEl.addEventListener('transitionend', () => oldTextEl.remove(), { once: true });
            } else {
                dom.npcText.innerHTML = newHtml;
            }
        }
        
        
        if (keepChoicesVisible) {
            dom.playerDialogue.classList.remove('is-hidden');
        } else {
            dom.playerDialogue.classList.add('is-hidden');
        }

        dom.responseDots.innerHTML = '';

        if (preselectedChoiceData) {
            const processedText = preselectedChoiceData.text.replace(/(?<!\w)'|'(?!\w)/g, '"');
            dom.playerResponseText.innerHTML = `<span class.="player-prefix">YOU – </span>${processedText}`;
            dom.playerResponseText.dataset.targetNode = preselectedChoiceData.target_node;
            dom.playerResponseText.dataset.setFlag = preselectedChoiceData.set_flag;
            dom.playerResponseText.dataset.keepVisible = preselectedChoiceData.keep_visible;
        } else {
            dom.playerResponseText.innerHTML = '';
            dom.playerResponseText.dataset.targetNode = '';
        }
        
        if (!node.is_chain_link) {
            
            // --- NAUJA, PATAISYTA LOGIKA PRASIDEDA ČIA ---
            node.choices.forEach((choice) => {

                // 1. PATIKRA DĖL SCENARIJAUS (ŠAKOJIMOSI)
                // Patikriname, ar yra 'condition' ir ar jis NEĮVYKDYTAS.
                // Tai yra tavo originali logika, kurią grąžinau.
                if (choice.condition && !checkCondition(choice.condition)) {
                    // Jei sąlyga netenkinama (pvz., `varnalesa_approach == vc1` yra false),
                    // šis taškelis neturi būti rodomas. Mes jį praleidžiame.
                    return; 
                }

                // Jei kodas pasiekė čia, vadinasi, parinktis TINKA šiam scenarijui.
                const dot = document.createElement('div');
                dot.classList.add('response-dot');

                // 2. PATIKRA DĖL PANAUDOJIMO (PAPILKINIMO)
                // Dabar patikriname, ar šis klausimas jau buvo "panaudotas",
                // žiūrėdami į jo 'set_flag' reikšmę 'gameState'.
                if (choice.set_flag) {
                    const [key, value] = choice.set_flag.split('=').map(s => s.trim());
                    const npcId = gameState.currentConversation.npcId;
                    
                    // Patikriname, ar 'gameState' jau turi šią vėliavėlę
                    // (pvz., ar 'daumantas_asked_responsible' yra 'true')
                    if (gameState.progress[npcId] && gameState.progress[npcId][key] === true) {
                        dot.classList.add('used');
                    }
                }
                
                // 3. SUKURIAME TAŠKELĮ (likęs kodas)
                let choiceText = '';
                if (Array.isArray(choice.text)) {
                    const validTextObject = choice.text.find(t => t.condition ? checkCondition(t.condition) : true) || choice.text[choice.text.length - 1];
                    choiceText = validTextObject.value;
                } else {
                    choiceText = choice.text;
                }

                dot.dataset.text = choiceText;
                dot.dataset.targetNode = choice.target_node;
                dot.dataset.setFlag = choice.set_flag || '';
                dot.dataset.keepVisible = choice.keep_choices_visible || 'false';
                
                dot.addEventListener('click', () => {
                    document.querySelectorAll('.response-dot.active').forEach(d => d.classList.remove('active'));
                    dot.classList.add('active');
                    const playerText = dot.dataset.text.replace(/(?<!\w)'|'(?!\w)/g, '"');
                    dom.playerResponseText.innerHTML = `<span class="player-prefix">YOU – </span>${playerText}`;
                    dom.playerResponseText.dataset.targetNode = dot.dataset.targetNode;
                    dom.playerResponseText.dataset.setFlag = dot.dataset.setFlag;
                    dom.playerResponseText.dataset.keepVisible = dot.dataset.keepVisible;
                });

                dom.responseDots.appendChild(dot);
            });
            // --- NAUJOS LOGIKOS PABAIGA ---


            if (!preselectedChoiceData) {
                let firstDotToActivate = dom.responseDots.querySelector('.response-dot:not(.used)');
                
                if (!firstDotToActivate) {
                    firstDotToActivate = dom.responseDots.querySelector('.response-dot');
                }

                if (firstDotToActivate) {
                    firstDotToActivate.click();
                }
            } else {
                const firstDot = dom.responseDots.querySelector('.response-dot');
                if(firstDot) firstDot.classList.add('active');
            }
        }

        dom.dialogueContainer.classList.remove('is-expanded');
      
        dom.choiceIndicator.classList.remove('is-visible');
        const choicesAreHidden = dom.playerDialogue.classList.contains('is-hidden');
        const isCurrentNodeMonologue = node.choices.length === 1 && node.choices[0].text === '...';
        
        if (choicesAreHidden) {
            if (isCurrentNodeMonologue) {
                const nextNodeId = node.choices[0].target_node;
                const nextNode = storyData[nextNodeId];
                if (nextNode) {
                    const isNextNodeMonologue = (nextNode.choices.length === 1 && nextNode.choices[0].text === '...');
                    if (!isNextNodeMonologue) {
                        dom.choiceIndicator.classList.add('is-visible');
                    }
                }
            } else if (!node.is_chain_link && node.choices.length > 0) {
                dom.choiceIndicator.classList.add('is-visible');
                }
            }
        }

    function confirmChoice() {
        const targetNode = dom.playerResponseText.dataset.targetNode;
        const flagToSet = dom.playerResponseText.dataset.setFlag;
        const keepVisible = dom.playerResponseText.dataset.keepVisible === 'true'; 
        if (!targetNode) return;

        let questionContext = null;

        if (gameState.currentConversation) {

        // --- 1. NPC EILUTĖS IŠSAUGOJIMAS ---
        const node = storyData[gameState.currentConversation.currentNode];
        if (node && node.text !== null) {
            const npcName = (node.npc || gameState.currentConversation.npcId).toUpperCase();
            const npcText = node.text; 
            gameState.currentConversation.history.push({ speaker: npcName, text: npcText });
        }

        // --- 2. ŽAIDĖJO EILUTĖS IŠSAUGOJIMAS ---
        const activeDot = dom.responseDots.querySelector('.response-dot.active');
        if (activeDot) {
            const playerText = activeDot.dataset.text; // Originalus tekstas
            gameState.currentConversation.history.push({ speaker: 'player', text: playerText });
            questionContext = playerText; // Ši eilutė lieka
        }
    }

        if (flagToSet) {
            const [key, value] = flagToSet.split('=').map(s => s.trim());
            const npcId = gameState.currentConversation.npcId;

            // This logic correctly handles "true", "false", and any other string value.
            let processedValue;
            if (value === 'true') {
                processedValue = true;
            } else if (value === 'false') {
                processedValue = false;
            } else {
                processedValue = value; // Correctly uses the string "friendly", "won", etc.
            }

            // Set the flag in the game state
            gameState.progress[npcId][key] = processedValue;
            console.log(`Flag set by choice: ${npcId}.${key} = ${processedValue}`);
        }
        renderNode(targetNode, keepVisible, false, questionContext, null);
    }

    // in app.js

    // app.js
// PAKEISK SENĄ checkCondition ŠIA NAUJA VERSIJA

    function checkCondition(conditionString) {
        if (!conditionString) return true;

        const npcId = gameState.currentConversation.npcId;
        
        // 1. Išskaidome pagal "&&" (IR)
        const conditions = conditionString.split('&&').map(s => s.trim());
        
        // 2. Tikriname kiekvieną sąlygą atskirai
        for (const condition of conditions) {
            let operator;
            let parts;

            // 3. Ieškome operatoriaus (== arba !=)
            if (condition.includes('!=')) {
                operator = '!=';
                parts = condition.split('!=').map(s => s.trim());
            } else if (condition.includes('==')) {
                operator = '==';
                parts = condition.split('==').map(s => s.trim());
            } else {
                console.error(`Neteisingas sąlygos formatas (nėra == arba !=): "${condition}"`);
                return false; // Saugumo sumetimais grąžiname false
            }

            if (parts.length !== 2) {
                console.error(`Neteisingas sąlygos formatas: "${condition}"`);
                return false; 
            }

            const key = parts[0];
            const valueToCompare = parts[1];
            
            // 4. Gauname vėliavėlės reikšmę (kaip anksčiau)
            // Jei vėliavėlė neegzistuoja, jos reikšmė bus 'false'
            const flagValue = gameState.progress[npcId]?.[key] ?? false;
           
            // 5. Apdorojame reikšmę, su kuria lyginame (kaip anksčiau)
            let processedValueToCompare;
            if (valueToCompare === 'true') {
                processedValueToCompare = true;
            } else if (valueToCompare === 'false') {
                processedValueToCompare = false;
            } else {
                // Paliekame kaip tekstą (pvz., "vc1")
                processedValueToCompare = valueToCompare;
            }

            // 6. Atliekame palyginimą pagal operatorių
            let conditionMet = false;
            if (operator === '==') {
                conditionMet = (flagValue === processedValueToCompare);
            } else if (operator === '!=') {
                conditionMet = (flagValue !== processedValueToCompare);
            }

            // 7. Jei BENT VIENA sąlyga "&&" grandinėje yra neteisinga, grąžiname false
            if (!conditionMet) {
                return false;
            }
        }
        
        // 8. Jei visos sąlygos teisingos, grąžiname true
        return true;
    }

    // in app.js

    function endConversation() {
        showToast("Conversation ended.");

        if (gameState.currentConversation) {
            const npcId = gameState.currentConversation.npcId;
            const npcName = (storyData[`${npcId}_identity`].npc || npcId);

            if (!gameState.caseFiles) {
                gameState.caseFiles = {};
            }
            
          
            // 1. Get the data that already exists in the case file, if any.
            const existingCaseFile = gameState.caseFiles[npcId] || { keyStatements: [] };

            // 2. Get the new information from the conversation that just finished.
            const newKeyStatements = gameState.currentConversation.keyStatements || [];

            // 3. Perform an intelligent merge of key statements to prevent duplicates and data loss.
            // We use a Map to ensure each statement title is unique.
            const statementsMap = new Map();
            
            // First, add all the statements that were already in the case file.
            existingCaseFile.keyStatements.forEach(stmt => statementsMap.set(stmt.text, stmt));
            
            // Next, add all the new statements from the conversation that just ended.
            // If a title already exists, this will overwrite it (useful if a statement can be updated).
            // If the title is new, it will be added.
            newKeyStatements.forEach(stmt => statementsMap.set(stmt.text, stmt));

            // Convert the unique statements from the Map back into an array.
            const allKeyStatements = Array.from(statementsMap.values());
            

            // 4. Save the correctly merged and de-duplicated data back to the case file.
            gameState.caseFiles[npcId] = {
                npcName: npcName,
                keyStatements: allKeyStatements
            };
            
            console.log(`Case file for ${npcId} has been correctly merged and updated.`);
            
          
        }

        // Perform the final save to persist the updated case file.
        saveGameState();

        // Now, clean up the temporary conversation object.
        gameState.currentConversation = null;

        // Hide the UI elements.
        dom.dialogueContainer.classList.remove('is-active', 'is-expanded');
        dom.playerDialogue.classList.remove('is-active');
        dom.gameContent.style.display = 'flex';
    }
    // app.js faile:

function renderCaseFiles() {
 // --- 1. Bylų generavimas (atnaujinta logika) ---
    if (dom.cfTeamName) {
                dom.cfTeamName.textContent = gameState.teamName || '';
            }
    dom.caseFilesContent.innerHTML = ''; // Išvalome seną turinį

    // Patikriname, ar turime IŠ VISO kokių nors įrašų
    const caseFileEntries = gameState.caseFiles ? Object.values(gameState.caseFiles) : [];

    if (caseFileEntries.length === 0) {
        dom.caseFilesContent.innerHTML = '<p>Case file is empty. Talk to the suspects to collect information.</p>';
    } else {
        // Einame per visus išsaugotus įrašus
        caseFileEntries.forEach(entry => {
            const entryDiv = document.createElement('div');
            entryDiv.className = 'suspect-entry';

            let statementsHTML = entry.keyStatements.map(stmt => {
                // Conditionally create the HTML for the question
                const questionHTML = stmt.question 
                    ? `<p class="key-statement-question"><strong>You Asked:</strong> <span>"${stmt.question}"</span></p>` 
                    : '';

                return `
                    <div class="key-statement">
                        ${questionHTML}
                        <p class="key-statement-answer"><strong>${stmt.title}:</strong> <span>"${stmt.text}"</span></p>
                    </div>
                `;
            }).join('');

            if (statementsHTML === '') {
                statementsHTML = '<p><em>No relevant statement(s).</em></p>';
            }


            entryDiv.innerHTML = `
                <h3>${entry.npcName}</h3>
                <h4>Statement(s):</h4>
                ${statementsHTML}
            `;
            dom.caseFilesContent.appendChild(entryDiv);
        });
    }

    // --- 2. Kaltinimų skilties generavimas (NAUJA LOGIKA) ---
    
    // Išvalome senus sąrašus
    dom.suspectChecklist.innerHTML = '';
    dom.motiveChecklist.innerHTML = '';

    // Sukuriame pagalbinę funkciją varnelėms (lieka ta pati)
    const createCheckbox = (value, listType) => {
        const label = document.createElement('label');
        label.className = 'checkbox-item';
        
        const input = document.createElement('input');
        input.type = 'checkbox';
        input.value = value;

        if (gameState.accusation[listType] && gameState.accusation[listType].includes(value)) {
            input.checked = true;
        }
        
        label.appendChild(input);
        label.appendChild(document.createTextNode(` ${value}`));
        return label;
    };

    // 2. Pridedame visus SUTIKTUS įtariamuosius
    caseFileEntries.forEach(entry => {
        if (entry && entry.npcName) {
            // Tiesiog pridedame vardą, kurį radome byloje
            dom.suspectChecklist.appendChild(createCheckbox(entry.npcName, 'suspects'));
        }
    });

    // --- Pildome motyvų sąrašą (lieka tas pats) ---
    MOTIVES.forEach(motive => {
        dom.motiveChecklist.appendChild(createCheckbox(motive, 'motives'));
    });

    // 3. Patikriname, ar kaltinimas galutinis, ir UŽRAKINAME formą
    if (gameState.accusation && gameState.accusation.isFinal) {
            disableAccusationForm(); // Ši funkcija dabar paslėps nepažymėtus
    }

    // 4. Nustatome motyvų skilties matomumą (PAGRINDINIS PAKEITIMAS)
    if (gameState.accusation.isFinal) {
        // Jei kaltinimas galutinis, rodome motyvus, TIK JEI bent vienas buvo pasirinktas
        const anyMotiveChecked = gameState.accusation.motives && gameState.accusation.motives.length > 0;
        dom.motiveGroup.style.display = anyMotiveChecked ? 'block' : 'none';
    } else {
        // Jei kaltinimas NĖRA galutinis, naudojame senąją logiką
        // (rodyti, jei pažymėtas BENT VIENAS įtariamasis)
        const anySuspectChecked = dom.suspectChecklist.querySelector('input[type="checkbox"]:checked');
        dom.motiveGroup.style.display = anySuspectChecked ? 'block' : 'none';
    }
}

    // app.js faile:

    function disableAccusationForm() {
        // 1. Išjungiame visus įtariamųjų pasirinkimus IR PASLEPIAME NEPASIRINKTUS
        dom.suspectChecklist.querySelectorAll('.checkbox-item').forEach(label => {
            const input = label.querySelector('input[type="checkbox"]');
            input.disabled = true;
            if (!input.checked) {
                label.style.display = 'none'; // Paslepiame nepažymėtą
            }
        });

        // 2. Išjungiame visus motyvų pasirinkimus IR PASLEPIAME NEPASIRINKTUS
        dom.motiveChecklist.querySelectorAll('.checkbox-item').forEach(label => {
            const input = label.querySelector('input[type="checkbox"]');
            input.disabled = true;
            if (!input.checked) {
                label.style.display = 'none'; // Paslepiame nepažymėtą
            }
        });

        // 3. Išjungiame pateikimo mygtuką
        dom.submitAccusationBtn.disabled = true;
        dom.submitAccusationBtn.textContent = 'Accusation Saved';
    }

function initializeApp() {
    // Event Listeners
    dom.startBtn.addEventListener('click', initGame);
    dom.restartBtn.addEventListener('click', restartGame);
    dom.playerResponseText.addEventListener('click', confirmChoice);
    /*dom.testConvoBtn.addEventListener('click', () => startConversation('werewolf'));*/

     dom.caseFilesBtn.addEventListener('click', () => {
        renderCaseFiles(); // Sugeneruojame turinį (kaip ir anksčiau)
        dom.caseFilesPanel.classList.add('is-open');
        showCaseFileView('case-files-content'); // <-- NAUJA: Nustatome numatytąjį rodinį
    });

    dom.closeCaseFilesBtn.addEventListener('click', () => {
        dom.caseFilesPanel.classList.remove('is-open');
    });

    dom.submitAccusationBtn.addEventListener('click', () => {
        // 0. Parodome patvirtinimo langą
        const isConfirmed = window.confirm("Are you sure about your decision? It cannot be undone.");

        // 1. Jei vartotojas atšaukė, nieko nedarome
        if (!isConfirmed) {
            return;
        }

        // 2. Vartotojas patvirtino, tęsiame išsaugojimą
        const selectedSuspects = [];
        dom.suspectChecklist.querySelectorAll('input[type="checkbox"]:checked').forEach(input => {
            selectedSuspects.push(input.value);
        });

        const selectedMotives = [];
        dom.motiveChecklist.querySelectorAll('input[type="checkbox"]:checked').forEach(input => {
            selectedMotives.push(input.value);
        });

        // 3. Išsaugome į gameState IR pažymime kaip "final"
        gameState.accusation = {
            suspects: selectedSuspects,
            motives: selectedMotives,
            isFinal: true // <-- PAŽYMIME KALTINIMĄ KAIP GALUTINĮ
        };
        saveGameState();

        // 4. Parodome pranešimą ir "užrakiname" formą
        showToast("Your final accusation is saved!");
        disableAccusationForm(); // <-- IŠKVIEČIAME NAUJĄ FUNKCIJĄ

        // 5. Uzdarome panelę po 1 sekundės, kad žaidėjas pamatytų pakeitimus
        setTimeout(() => {
            dom.caseFilesPanel.classList.remove('is-open');
        }, 1000);
    });

    dom.finalAccusationSection.addEventListener('change', (e) => {
        // Tikriname, ar pasikeitimas įvyko BŪTENT įtariamųjų sąraše
        if (e.target.closest('#suspect-checklist')) {
            
            // Jei forma jau "final", nieko nedarome
            if (gameState.accusation.isFinal) return;

            // Patikriname, ar bent viena varnelė įtariamųjų sąraše yra pažymėta
            const anySuspectChecked = dom.suspectChecklist.querySelector('input[type="checkbox"]:checked');

            if (anySuspectChecked) {
                // Jei taip, parodome motyvų grupę
                dom.motiveGroup.style.display = 'block';
            } else {
                // Jei ne, paslepiame motyvų grupę
                dom.motiveGroup.style.display = 'none';
            }
        }
    });

    dom.navBtnSuspects.addEventListener('click', () => showCaseFileView('case-files-content'));
    dom.navBtnAccusation.addEventListener('click', () => showCaseFileView('final-accusation-section'));

    dom.choiceIndicator.addEventListener('click', advanceDialogue);

    initializeQrScanner();
    // Event Delegation stenogramų rodymui
 

    // Horizontal swipe for choices
    dom.playerDialogue.addEventListener('touchstart', e => { touchStartX = e.changedTouches[0].screenX; }, { passive: true });
    dom.playerDialogue.addEventListener('touchend', e => { touchEndX = e.changedTouches[0].screenX; handleSwipe(); }, { passive: true });

    // Vertical swipe for accordion panel
    dom.dialogueContainer.addEventListener('touchstart', e => {
        touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });
    dom.dialogueContainer.addEventListener('touchend', e => {
        touchEndY = e.changedTouches[0].screenY;
        handleDialogueSwipe();
    }, { passive: true });


    setAppHeight();
    loadGameState();
}
    fetch('story.json')
        .then(response => response.json())
        .then(data => {
            storyData = data;
            console.log("Story data loaded successfully! 📖");
            initializeApp();
        })
        .catch(error => {
            console.error('CRITICAL ERROR: Could not load story.json.', error);
            alert("Failed to load story data. The app cannot start.");
        });
});