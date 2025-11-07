
const CACHE_NAME = 'red-shoes-v5';


// LIST ALL FILES REQUIRED FOR THE GAME HERE.
// Crucial: If a file is missing from this list, it won't work offline.
const APP_SHELL = [
    './',              // Alias for the root folder
    'index.html',     // YOUR main html file (instead of index.html)
    'style.css',
    'app.js',
    'story.json',
    'manifest.json',
    'html5-qrcode.min.js',
    'icon-192.png',
    'icon-512.png',

// --- DARKO AUDIO ---
    'audio/darko/DARKO_apology_response.mp3',
    'audio/darko/DARKO_d1a_response.mp3',
    'audio/darko/DARKO_d1b_response.mp3',
    'audio/darko/DARKO_d1b_sub1_response.mp3',
    'audio/darko/DARKO_d1b_sub2_response.mp3',
    'audio/darko/DARKO_d1b_sub3_response.mp3',
    'audio/darko/DARKO_d1b_sub3_response_b.mp3',
    'audio/darko/DARKO_d2a_response.mp3',
    'audio/darko/DARKO_d2a_response_b.mp3',
    'audio/darko/DARKO_d2b_response.mp3',
    'audio/darko/DARKO_d2b_sub1_response.mp3',
    'audio/darko/DARKO_d2b_sub2_response.mp3',
    'audio/darko/DARKO_d3a_confession_response.mp3',
    'audio/darko/DARKO_d3a_response.mp3',
    'audio/darko/DARKO_d3b_response.mp3',
    'audio/darko/DARKO_d3b_sub1_response.mp3',
    'audio/darko/DARKO_d3b_sub1_response_b.mp3',
    'audio/darko/DARKO_d3b_sub1_response_c.mp3',
    'audio/darko/DARKO_d3b_sub1_response_d.mp3',
    'audio/darko/DARKO_d3b_sub1_response_e.mp3',
    'audio/darko/DARKO_d4a_response.mp3',
    'audio/darko/DARKO_d4b_response.mp3',
    'audio/darko/DARKO_d4b_sub1_response.mp3',
    'audio/darko/DARKO_d4b_sub1_response_b.mp3',
    'audio/darko/DARKO_d5b_response.mp3',
    'audio/darko/DARKO_d6b_aggressive_response.mp3',
    'audio/darko/DARKO_d6b_aggressive_response_b.mp3',
    'audio/darko/DARKO_d6b_cunning_response.mp3',
    'audio/darko/DARKO_d6b_cunning_response_b.mp3',
    'audio/darko/DARKO_d6b_cunning_sub1_response.mp3',
    'audio/darko/DARKO_d6b_default_response.mp3',
    'audio/darko/DARKO_d6b_default_sub1_response.mp3',
    'audio/darko/DARKO_d6b_default_sub2_response.mp3',
    'audio/darko/DARKO_d6b_emotional_bluff_response.mp3',
    'audio/darko/DARKO_d6b_emotional_bluff_sub1_response.mp3',
    'audio/darko/DARKO_d6b_emotional_bluff_sub2_response.mp3',
    'audio/darko/DARKO_d6b_emotional_default_response.mp3',
    'audio/darko/DARKO_d1a_response_b.mp3', // Fixed: dla -> d1a
    'audio/darko/DARKO_fine_response.mp3',
    'audio/darko/DARKO_focus_response.mp3',
    'audio/darko/DARKO_intimidate_response.mp3',
    'audio/darko/DARKO_intro.mp3',
    'audio/darko/DARKO_intro_b.mp3',
    'audio/darko/DARKO_intro_c.mp3',
    'audio/darko/DARKO_re_entry_part2.mp3',
    'audio/darko/DARKO_start_part2.mp3',

    // --- DAUMANTAS AUDIO ---
    'audio/daumantas/DAUMANTAS_interrogate_loss.mp3',
    'audio/daumantas/DAUMANTAS_interrogate_prompt_1.mp3',
    'audio/daumantas/DAUMANTAS_interrogate_prompt_2_A.mp3',
    'audio/daumantas/DAUMANTAS_interrogate_start.mp3',
    'audio/daumantas/DAUMANTAS_interrogate_win_1.mp3',
    'audio/daumantas/DAUMANTAS_interrogate_win_2_intro.mp3',
    'audio/daumantas/DAUMANTAS_intro.mp3',
    'audio/daumantas/DAUMANTAS_intro_b.mp3',
    'audio/daumantas/DAUMANTAS_intro_c.mp3',
    'audio/daumantas/DAUMANTAS_part2_q1.mp3',
    'audio/daumantas/DAUMANTAS_player_choices_1_A.mp3',
    'audio/daumantas/DAUMANTAS_post_loss_text.mp3',
    'audio/daumantas/DAUMANTAS_re_entry_part2.mp3',
    'audio/daumantas/DAUMANTAS_speak_human_response.mp3',
    'audio/daumantas/DAUMANTAS_W1_W2_response.mp3',
    'audio/daumantas/DAUMANTAS_W3_narrator_response_A.mp3',
    'audio/daumantas/DAUMANTAS_W3_response.mp3',
    'audio/daumantas/DAUMANTAS_W3_response_2_A.mp3',

    // --- LAUME AUDIO ---
    'audio/laume/LAUME_interrogate_apologize_response_A.mp3',
    'audio/laume/LAUME_interrogate_ask_response_A.mp3',
    'audio/laume/LAUME_interrogate_start_A.mp3',
    'audio/laume/LAUME_interrogate_start_B.mp3',
    'audio/laume/LAUME_interrogate_start_C.mp3',
    'audio/laume/LAUME_interrogate_take_back_A.mp3',
    'audio/laume/LAUME_interrogate_what_now_A.mp3',
    'audio/laume/LAUME_intro.mp3',
    'audio/laume/LAUME_intro_b.mp3',
    'audio/laume/LAUME_La1_response_A.mp3', // Fixed: Lal -> La1
    'audio/laume/LAUME_La2_response_A.mp3',
    'audio/laume/LAUME_La3_response.mp3',
    'audio/laume/LAUME_Lb1_response_A.mp3',
    'audio/laume/LAUME_Lb2_response_A.mp3',
    'audio/laume/LAUME_Lc1_response_A.mp3',
    'audio/laume/LAUME_Lc1_sub1_response_A.mp3',
    'audio/laume/LAUME_Lc1_sub2_response.mp3',
    'audio/laume/LAUME_Lc1_sub3_response_A.mp3',
    'audio/laume/LAUME_Lc2_response.mp3',
    'audio/laume/LAUME_Lc3_response.mp3',
    'audio/laume/LAUME_Ld1_response_A.mp3',
    'audio/laume/LAUME_Ld2_response.mp3',
    'audio/laume/LAUME_Ld3_response.mp3',
    'audio/laume/LAUME_Le1_response_A.mp3',
    'audio/laume/LAUME_Le2_response_A.mp3',
    'audio/laume/LAUME_Le2_sub1_response_A.mp3',
    'audio/laume/LAUME_Le3_response_A.mp3',
    'audio/laume/LAUME_Le3_sub1_response_A.mp3',
    'audio/laume/LAUME_Le4_response_A.mp3',
    'audio/laume/LAUME_Le4_sub1_response_A.mp3',
    'audio/laume/LAUME_Le6_response_A.mp3',
    'audio/laume/LAUME_Le6_sub1_response_A.mp3',
    'audio/laume/LAUME_Le7_response_A.mp3',
    'audio/laume/LAUME_Le7_sub1_response_A.mp3',
    'audio/laume/LAUME_Le7_sub2_response_A.mp3',
    'audio/laume/LAUME_Le7_sub2_response_B.mp3',
    'audio/laume/LAUME_Le7_sub2_response_C.mp3',
    'audio/laume/LAUME_part2_hub_entry_agree.mp3',
    'audio/laume/LAUME_post_loss_text.mp3',
    'audio/laume/LAUME_post_win_text.mp3',
    'audio/laume/LAUME_re_entry_part2.mp3',

    // --- RAPOLAS BODY AUDIO ---
    'audio/rapolas_body/RAPOLAS_BODY_Ba2_A.mp3',
    'audio/rapolas_body/RAPOLAS_BODY_Ba2_B.mp3',
    'audio/rapolas_body/RAPOLAS_BODY_Ba3_A.mp3',
    'audio/rapolas_body/RAPOLAS_BODY_Ba3_B.mp3',
    'audio/rapolas_body/RAPOLAS_BODY_Ba3a_A.mp3',
    'audio/rapolas_body/RAPOLAS_BODY_Ba3a_B.mp3',
    'audio/rapolas_body/RAPOLAS_BODY_Ba4_A.mp3',
    'audio/rapolas_body/RAPOLAS_BODY_Ba6_A.mp3',
    'audio/rapolas_body/RAPOLAS_BODY_end.mp3',
    'audio/rapolas_body/RAPOLAS_BODY_intro.mp3',
    'audio/rapolas_body/RAPOLAS_BODY_re_entry.mp3',

    // --- RICARDAS AUDIO ---
    'audio/ricardas/RICARDAS_interrogate_loss_A.mp3',
    'audio/ricardas/RICARDAS_interrogate_loss_B.mp3',
    'audio/ricardas/RICARDAS_interrogate_start_A.mp3',
    'audio/ricardas/RICARDAS_interrogate_start_B.mp3',
    'audio/ricardas/RICARDAS_interrogate_start_C.mp3',
    'audio/ricardas/RICARDAS_interrogate_win_A.mp3',
    'audio/ricardas/RICARDAS_interrogate_win_q1.mp3',
    'audio/ricardas/RICARDAS_interrogate_win_q2.mp3',
    'audio/ricardas/RICARDAS_intro.mp3',
    'audio/ricardas/RICARDAS_intro_b.mp3',
    'audio/ricardas/RICARDAS_part2_hub_entry.mp3',
    'audio/ricardas/RICARDAS_post_loss_text.mp3',
    'audio/ricardas/RICARDAS_post_win_text.mp3',
    'audio/ricardas/RICARDAS_Ra1_response_A.mp3', // Fixed: Ral -> Ra1
    'audio/ricardas/RICARDAS_Ra2_response_A.mp3',
    'audio/ricardas/RICARDAS_Rb1_response_A.mp3',
    'audio/ricardas/RICARDAS_Rb1_response_B.mp3',
    'audio/ricardas/RICARDAS_Rb1_response_C.mp3',
    'audio/ricardas/RICARDAS_Rb1_response_D.mp3',
    'audio/ricardas/RICARDAS_Rb1_response_E.mp3',
    'audio/ricardas/RICARDAS_Rb1_response_F.mp3',
    'audio/ricardas/RICARDAS_Rc1_response_A.mp3',
    'audio/ricardas/RICARDAS_Rc1_response_B.mp3',
    'audio/ricardas/RICARDAS_Rc1_response_C.mp3',
    'audio/ricardas/RICARDAS_Rc1_response_D.mp3',
    'audio/ricardas/RICARDAS_Rc1_response_E.mp3',
    'audio/ricardas/RICARDAS_Rd1_response_A.mp3',
    'audio/ricardas/RICARDAS_Rd2_response.mp3',
    'audio/ricardas/RICARDAS_Rd3_response_A.mp3',
    'audio/ricardas/RICARDAS_Rd3_response_B.mp3',
    'audio/ricardas/RICARDAS_Rd3_response_C.mp3',
    'audio/ricardas/RICARDAS_Rd3_response_D.mp3',
    'audio/ricardas/RICARDAS_Rd3_response_E.mp3',
    'audio/ricardas/RICARDAS_Rd3_response_F.mp3',
    'audio/ricardas/RICARDAS_re_entry_part2.mp3',
    'audio/ricardas/RICARDAS_Re1_response_A.mp3',
    'audio/ricardas/RICARDAS_Re2_response_A.mp3',
    'audio/ricardas/RICARDAS_Re2_response_B.mp3',
    'audio/ricardas/RICARDAS_Re4_response_A.mp3',
    'audio/ricardas/RICARDAS_Re4_response_B.mp3',
    'audio/ricardas/RICARDAS_Re4_response_C.mp3',
    'audio/ricardas/RICARDAS_Re4_response_D.mp3',
    'audio/ricardas/RICARDAS_Rf1_response.mp3',
    'audio/ricardas/RICARDAS_Rf1_response_c.mp3',

    // --- SIAURINIS AUDIO ---
    'audio/siaurinis/SIAURINIS_interrogate_loss_A.mp3',
    'audio/siaurinis/SIAURINIS_interrogate_loss_B.mp3',
    'audio/siaurinis/SIAURINIS_interrogate_start_A.mp3',
    'audio/siaurinis/SIAURINIS_interrogate_start_A_Sa3.mp3',
    'audio/siaurinis/SIAURINIS_interrogate_start_B.mp3',
    'audio/siaurinis/SIAURINIS_interrogate_start_C.mp3',
    'audio/siaurinis/SIAURINIS_interrogate_win_A.mp3',
    'audio/siaurinis/SIAURINIS_interrogate_win_B.mp3',
    'audio/siaurinis/SIAURINIS_interrogate_win_q1.mp3',
    'audio/siaurinis/SIAURINIS_interrogate_win_q2.mp3',
    'audio/siaurinis/SIAURINIS_intro.mp3',
    'audio/siaurinis/SIAURINIS_part2_hub_entry_1.mp3',
    'audio/siaurinis/SIAURINIS_part2_hub_entry_2.mp3',
    'audio/siaurinis/SIAURINIS_part2_hub_entry_3.mp3',
    'audio/siaurinis/SIAURINIS_part2_hub_entry_4.mp3',
    'audio/siaurinis/SIAURINIS_post_loss_text.mp3',
    'audio/siaurinis/SIAURINIS_post_win_text.mp3',
    'audio/siaurinis/SIAURINIS_re_entry_part2.mp3',
    'audio/siaurinis/SIAURINIS_Sa1_response_A.mp3', // Fixed: Sal -> Sa1
    'audio/siaurinis/SIAURINIS_Sa3_response_A.mp3',
    'audio/siaurinis/SIAURINIS_Sa3_sub1_response_A.mp3',
    'audio/siaurinis/SIAURINIS_Sa3_sub2_response_A.mp3',
    'audio/siaurinis/SIAURINIS_Sb1_response_A.mp3',
    'audio/siaurinis/SIAURINIS_Sb2_response_A.mp3',
    'audio/siaurinis/SIAURINIS_Sc1_response_A.mp3',
    'audio/siaurinis/SIAURINIS_Sc2_response_A.mp3',
    'audio/siaurinis/SIAURINIS_Sc2_sub1_response.mp3',
    'audio/siaurinis/SIAURINIS_Sc2_sub2_response_A.mp3',
    'audio/siaurinis/SIAURINIS_Sc2_sub3_response_A.mp3',
    'audio/siaurinis/SIAURINIS_Sc2_sub4_response_A.mp3',
    'audio/siaurinis/SIAURINIS_Sd1_response_A.mp3',
    'audio/siaurinis/SIAURINIS_Sd1_sub1_response_A.mp3',
    'audio/siaurinis/SIAURINIS_Sd1_sub2_response_A.mp3',
    'audio/siaurinis/SIAURINIS_Se1_response_A.mp3',
    'audio/siaurinis/SIAURINIS_Se2_response_A.mp3',
    'audio/siaurinis/SIAURINIS_Se3_response_A.mp3',
    'audio/siaurinis/SIAURINIS_Se3_response_C.mp3',
    'audio/siaurinis/SIAURINIS_Sf1_response_A.mp3',
    'audio/siaurinis/SIAURINIS_Sf1_sub1_response_A.mp3',
    'audio/siaurinis/SIAURINIS_Sf1_sub2_response_A.mp3',
    'audio/siaurinis/SIAURINIS_Sf1_sub2_response_C.mp3',
    'audio/siaurinis/SIAURINIS_Sf2_response.mp3',
    'audio/siaurinis/SIAURINIS_Sf5_response.mp3',

    // --- VARNALESA AUDIO ---
    'audio/varnalesa/VARNALESA_interrogate_win_2_A.mp3', // Fixed missing 'V'
    'audio/varnalesa/VARNALESA_convenient.mp3',
    'audio/varnalesa/VARNALESA_end_wink_note.mp3',
    'audio/varnalesa/VARNALESA_identity.mp3',
    'audio/varnalesa/VARNALESA_interrogate_1.mp3',
    'audio/varnalesa/VARNALESA_interrogate_2.mp3',
    'audio/varnalesa/VARNALESA_interrogate_3.mp3',
    'audio/varnalesa/VARNALESA_interrogate_loss.mp3',
    'audio/varnalesa/VARNALESA_interrogate_start.mp3',
    'audio/varnalesa/VARNALESA_interrogate_win_1.mp3',
    'audio/varnalesa/VARNALESA_interrogate_win_confession_1.mp3',
    'audio/varnalesa/VARNALESA_interrogate_win_confession_2.mp3',
    'audio/varnalesa/VARNALESA_intro_b.mp3',
    'audio/varnalesa/VARNALESA_knew_what_A.mp3',
    'audio/varnalesa/VARNALESA_messing_with_you_A.mp3',
    'audio/varnalesa/VARNALESA_need_my_help.mp3',
    'audio/varnalesa/VARNALESA_part2_q1_default.mp3',
    'audio/varnalesa/VARNALESA_part2_q1_vc1.mp3',
    'audio/varnalesa/VARNALESA_part2_q2_def_sub1_A.mp3',
    'audio/varnalesa/VARNALESA_part2_q2_def_sub1_C.mp3',
    'audio/varnalesa/VARNALESA_part2_q2_def_sub2_A.mp3',
    'audio/varnalesa/VARNALESA_part2_q2_def_sub2_C.mp3',
    'audio/varnalesa/VARNALESA_part2_q2_def_sub2_E.mp3',
    'audio/varnalesa/VARNALESA_part2_q2_def_sub2_G.mp3',
    'audio/varnalesa/VARNALESA_part2_q2_def_sub3_A.mp3',
    'audio/varnalesa/VARNALESA_part2_q2_default_A.mp3',
    'audio/varnalesa/VARNALESA_part2_q2_vc1_A.mp3',
    'audio/varnalesa/VARNALESA_part2_q2_vc1_sub1.mp3',
    'audio/varnalesa/VARNALESA_part2_q3_default.mp3',
    'audio/varnalesa/VARNALESA_part2_q4_default_A.mp3',
    'audio/varnalesa/VARNALESA_part2_q4_default_C.mp3',
    'audio/varnalesa/VARNALESA_part2_q4_vc1.mp3',
    'audio/varnalesa/VARNALESA_part2_q5_A.mp3',
    'audio/varnalesa/VARNALESA_part2_q5_sub1.mp3',
    'audio/varnalesa/VARNALESA_part2_q5_sub2_A.mp3',
    'audio/varnalesa/VARNALESA_part2_q5_sub2_C.mp3',
    'audio/varnalesa/VARNALESA_part2_q5_sub2_D.mp3',
    'audio/varnalesa/VARNALESA_part2_q5_sub3.mp3',
    'audio/varnalesa/VARNALESA_part2_q5_sub5.mp3',
    'audio/varnalesa/VARNALESA_part2_q5_vc1_A.mp3',
    'audio/varnalesa/VARNALESA_post_loss_text.mp3',
    'audio/varnalesa/VARNALESA_post_win_text.mp3',
    'audio/varnalesa/VARNALESA_promise_A.mp3',
    'audio/varnalesa/VARNALESA_tell_me_A.mp3',
    'audio/varnalesa/VARNALESA_threatening_A.mp3',
    'audio/varnalesa/VARNALESA_Va1_response_A.mp3', // Fixed: Val -> Va1
    'audio/varnalesa/VARNALESA_Va2_sub2_A.mp3',
    'audio/varnalesa/VARNALESA_Vb1_response.mp3',
    'audio/varnalesa/VARNALESA_Vb2_response_A.mp3',
    'audio/varnalesa/VARNALESA_Vb2_sub1_A.mp3',
    'audio/varnalesa/VARNALESA_Vc1_A.mp3',
    'audio/varnalesa/VARNALESA_wink_A.mp3',
    'audio/varnalesa/VARNALESA_wink_B.mp3',
];

self.addEventListener('install', (event) => {
    console.log('[Service Worker] Installing...');
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('[Service Worker] Caching App Shell');
            return cache.addAll(APP_SHELL);
        })
    );
});

// 2. ACTIVATE: Clean up old caches if you update the CACHE_NAME version
self.addEventListener('activate', (event) => {
    console.log('[Service Worker] Activating...');
    event.waitUntil(
        caches.keys().then((keyList) => {
            return Promise.all(keyList.map((key) => {
                if (key !== CACHE_NAME) {
                    console.log('[Service Worker] Removing old cache', key);
                    return caches.delete(key);
                }
            }));
        })
    );
    // Allows the newly active SW to control any open clients immediately
    return self.clients.claim();
});

// 3. FETCH: Intercept requests and serve from cache first
self.addEventListener('fetch', (event) => {
    // We only want to handle standard GET requests
    if (event.request.method !== 'GET') return;

    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            // Return cached response if found
            if (cachedResponse) {
                // Optional: console.log('[Service Worker] Serving from cache:', event.request.url);
                return cachedResponse;
            }

            // If not in cache, try to fetch from network
            return fetch(event.request).then((networkResponse) => {
                // Check if we received a valid response
                if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
                    return networkResponse;
                }

                // Clone the response (streams can only be consumed once)
                const responseToCache = networkResponse.clone();

                // Dynamically cache new files (like audio files you didn't pre-cache)
                caches.open(CACHE_NAME).then((cache) => {
                    cache.put(event.request, responseToCache);
                });

                return networkResponse;
            }).catch((error) => {
                console.error('[Service Worker] Fetch failed; completely offline and asset not cached:', event.request.url);
                // Optional: You could return a generic offline fallback page here if it was a navigation request
            });
        })
    );

});


