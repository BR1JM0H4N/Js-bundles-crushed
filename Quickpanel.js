/*******************************************************
 * SCRAPER + VIEWER + QUICK COMMENTER (FIXED LIKE)    *
 *******************************************************/

(function() { 

    // --- CONFIGURATION ---
    let profileUrls = [
        "https://creator.nightcafe.studio/u/Sabaku_Neko",
        "https://creator.nightcafe.studio/u/Freyja-Lilith",
        "https://creator.nightcafe.studio/u/sampaio",
        "https://creator.nightcafe.studio/u/Rabbit-on-the-Moon",
        "https://creator.nightcafe.studio/u/KitsuWolfie",
        "https://creator.nightcafe.studio/u/yvettefrancaise",
        "https://creator.nightcafe.studio/u/AzdSAM",
        "https://creator.nightcafe.studio/u/Lethalbiscuit",
        "https://creator.nightcafe.studio/u/Novinci",
        "https://creator.nightcafe.studio/u/Tara618",
        "https://creator.nightcafe.studio/u/Megansamantha"
    ];
    
    const comments = [
  "❤️😇 very beautiful",
  "(⁠◍⁠•⁠ᴗ⁠•⁠◍⁠)⁠❤ very pretty",
  "✨🤩 mesmerizing",
  "Absolutely mesmerizing! (∩˃o˂∩)❤️",
  "So radiant and beautiful ε(´｡•᎑•`)っ 💕",
  " very charming 😍💛",
  "(∩˃o˂∩)❤️✨super cuteeeee",
  "꒰ঌ😇👌໒꒱ perfect",
   "P𝗲𝗿𝗳𝗲𝗰𝘁!🎀",
  "ദ്ദി(˵ •̀ ᴗ - ˵ ) ✨ PERFECTION",
 "꧁⎝ 𓆩༺COOL༻𓆪 ⎠꧂",
  "..VERY PRETTY𓂃 ࣪ ִֶָ🦋་༘࿐",
  "very cute 🥰 🥰 ",
  "absolutely adorable",
  "❤️😇 very beautiful 🐱",  
  "(⁠◍⁠•⁠ᴗ⁠•⁠◍⁠)⁠❤ very pretty 🐈",  
  "✨🤩 mesmerizing 🐱",  
  "Absolutely mesmerizing! (∩˃o˂∩)❤️ 🐈‍⬛",  
  "So radiant and beautiful ε(´｡•᎑•`)っ 💕 🐱",  
  " very charming 😍💛 🐈",  
  "(∩˃o˂∩)❤️✨super cuteeeee 🐱",  
  "꒰ঌ😇👌໒꒱ perfect 🐈‍⬛",  
  "very cute 🥰 🥰 🐱",  
  "absolutely adorable 🐈",
  "❤️😇 very beautiful 🐰🌕",  
  "(⁠◍⁠•⁠ᴗ⁠•⁠◍⁠)⁠❤ very pretty 🌕🐇",  
  "✨🤩 mesmerizing 🐰🌝",  
  "Absolutely mesmerizing! (∩˃o˂∩)❤️ 🌕🐰",  
  "So radiant and beautiful ε(´｡•᎑•`)っ 💕 🐇🌕",  
  " very charming 😍💛 🌝🐰",  
  "(∩˃o˂∩)❤️✨super cuteeeee 🐰🌕",  
  "꒰ঌ😇👌໒꒱ perfect 🌕🐇",  
  "very cute 🥰 🥰 🐰🌝",  
  "absolutely adorable 🐇🌕",
 "❤️😇 very beautiful 🐺",  
  "(⁠◍⁠•⁠ᴗ⁠•⁠◍⁠)⁠❤ very pretty 🐺",  
  "✨🤩 mesmerizing 🐺",  
  "Absolutely mesmerizing! (∩˃o˂∩)❤️ 🐺",  
  "So radiant and beautiful ε(´｡•᎑•`)っ 💕 🐺",  
  " very charming 😍💛 🐺",  
  "(∩˃o˂∩)❤️✨super cuteeeee 🐺",  
  "꒰ঌ😇👌໒꒱ perfect 🐺",  
  "very cute 🥰 🥰 🐺",  
  "absolutely adorable 🐺"
];

    console.log("Collected profile URLs:", profileUrls);
    
    // --- STEP 1: INPUT ---
    let num;
    do {
        num = prompt("How many creations to scrape per person? (Enter a number > 0):");
        if(num === null) return; 
    } while (num.trim() === "" || isNaN(num) || Number(num) === 0);
    
    alert(`Starting scrape for ${num} creations per profile. Please wait...`);

    // --- STEP 2: SCRAPER UI ---
    const scraperContainer = document.createElement("div");
    scraperContainer.style = `
        position: fixed; top: 50%; left: 50%; width: 95vw; height: 68vh;
        z-index: 999999; background: white; border: 2px solid #333;
        box-shadow: 0 4px 15px rgba(0,0,0,0.3); border-radius: 10px;
        overflow: hidden; transform: translate(-50%, -50%);
        display: flex; flex-direction: column; pointer-events: none; opacity: 0.8;
    `;
    const scraperFrame = document.createElement("iframe");
    scraperFrame.style = "width: 100%; height: 100%; border: none;";
    scraperContainer.appendChild(scraperFrame);
    document.body.appendChild(scraperContainer);

    let collectedHrefs = [];

    // --- STEP 3: SCRAPER LOGIC ---
    function scrapeProfile(profileIndex) {
        if (profileIndex >= profileUrls.length) {
            console.log("✅ All profiles scraped!", collectedHrefs);
            if (scraperContainer.parentElement) scraperContainer.remove();
            openViewerWithComments(collectedHrefs); 
            return;
        }

        scraperFrame.src = profileUrls[profileIndex];
        scraperFrame.onload = () => {
            const iframeDoc = scraperFrame.contentDocument || scraperFrame.contentWindow.document;

            setTimeout(() => {
                // Try to click Recent tab
                const recentBtn = iframeDoc.querySelector('button[data-btnkey="Recent"]');
                if (recentBtn) recentBtn.click();

                let tries = 0;
                let hrefSet = new Set();
                const scrollInterval = setInterval(() => {
                    tries++;
                    iframeDoc.scrollingElement.scrollBy(0, 600);
                    const items = iframeDoc.querySelectorAll('.renderIfVisible');
                    Array.from(items).forEach(el => {
                        const link = el.querySelector('a');
                        if (link && link.href) hrefSet.add(link.href);
                    });

                    console.log(`(${profileUrls[profileIndex]}) found ${hrefSet.size}/${num}`);

                    if (hrefSet.size >= num || tries >= 30) {
                        clearInterval(scrollInterval);
                        const firstFive = Array.from(hrefSet).slice(0, Number(num));
                        collectedHrefs.push(...firstFive);
                        scrapeProfile(profileIndex + 1);
                    }
                }, 1500);
            }, 5000);
        };
    }

    // --- STEP 4: VIEWER + COMMENTER LOGIC ---
    function openViewerWithComments(links) {
        if(links.length === 0) {
            alert("No links collected. Check console.");
            return;
        }

        let currentIndex = 0;
        let loadTimeoutId = null;

        // 1. Viewer Container
        const viewerContainer = document.createElement("div");
        viewerContainer.style = `
            position: fixed; top: 50%; left: 50%; width: 95vw; height: 85vh;
            z-index: 999990; background: #121212; border: 2px solid #555;
            box-shadow: 0 4px 20px rgba(0,0,0,0.5); border-radius: 10px;
            overflow: hidden; transform: translate(-50%, -50%);
            display: flex; flex-direction: column;
        `;

        // 2. The Iframe
        const viewerFrame = document.createElement("iframe");
        viewerFrame.style = "width: 100%; flex-grow: 1; border: none; background: #000;";
        viewerContainer.appendChild(viewerFrame);

        // 3. Control Bar
        const controlBar = document.createElement("div");
        controlBar.style = `
            display: flex; justify-content: space-between; align-items: center;
            padding: 10px; background: #222; color: white; height: 70px; flex-shrink: 0;
        `;

        const nextBtn = document.createElement("button");
        nextBtn.innerText = "Next Creation (Skip)";
        nextBtn.style = `
            margin: 5px; border: none; background: #007bff; color: white;
            cursor: pointer; padding: 10px 20px; border-radius: 8px;
            font-size: 18px; font-weight: bold;
        `;

        const closeBtn = document.createElement("button");
        closeBtn.innerText = "Close App";
        closeBtn.style = `
            margin: 5px; border: none; background: #dc3545; color: white;
            cursor: pointer; padding: 10px 15px; border-radius: 8px; font-size: 16px;
        `;

        closeBtn.onclick = function() {
            document.body.removeChild(viewerContainer);
            const styleTag = document.head.querySelector("style[data-spinner-style]");
            if (styleTag) styleTag.remove();
        };

        controlBar.appendChild(closeBtn);
        controlBar.appendChild(nextBtn);
        viewerContainer.appendChild(controlBar);

        // 4. Spinner
        const loaderOverlay = document.createElement("div");
        loaderOverlay.innerHTML = `<div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);border:6px solid #f3f3f3;border-top:6px solid #007bff;border-radius:50%;width:40px;height:40px;animation:spin 1s linear infinite;"></div>`;
        loaderOverlay.style = "position:absolute;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.9);z-index:1000000;display:none;";
        viewerContainer.appendChild(loaderOverlay);

        const styleTag = document.createElement("style");
        styleTag.textContent = "@keyframes spin{0%{transform:translate(-50%,-50%) rotate(0deg);}100%{transform:translate(-50%,-50%) rotate(360deg);}}";
        styleTag.setAttribute("data-spinner-style", "");
        document.head.appendChild(styleTag);

        document.body.appendChild(viewerContainer);

        // --- STEP 5: COMMENT PANEL ---
        const commentPanel = document.createElement('div');
        commentPanel.style = `
            position: absolute; bottom: 90px; left: 50%; transform: translateX(-50%);
            width: 90%; max-width: 600px; background: rgba(30, 30, 47, 0.95);
            border-radius: 16px; padding: 12px; display: flex; flex-direction: column;
            z-index: 1000001; box-shadow: 0 10px 30px rgba(0,0,0,0.5);
            backdrop-filter: blur(5px); border: 1px solid rgba(255,255,255,0.1);
        `;
        
        const panelTitle = document.createElement('div');
        panelTitle.innerText = "Quick Comment & Auto-Like";
        panelTitle.style = "color: #fff; font-size: 12px; text-align: center; margin-bottom: 8px; opacity: 0.7;";
        commentPanel.appendChild(panelTitle);

        const btnContainer = document.createElement('div');
        btnContainer.style = "display: flex; overflow-x: auto; gap: 8px; padding-bottom: 5px; justify-content: center;";
        
        const delay = ms => new Promise(res => setTimeout(res, ms));

        // *** FIXED INTERACTION FUNCTION ***
        async function performActionInFrame(commentText) {
            try {
                const frameDoc = viewerFrame.contentDocument || viewerFrame.contentWindow.document;
                if (!frameDoc) return;

                // --- FIX STARTS HERE: ROBUST LIKE BUTTON FINDER ---
                // Find all buttons, look for one that contains "Like" text (e.g. "Like (6)")
                const allButtons = Array.from(frameDoc.querySelectorAll('button'));
                const likeButton = allButtons.find(btn => btn.textContent && btn.textContent.includes("Like"));

                if (likeButton) {
                    likeButton.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: viewerFrame.contentWindow }));
                    console.log("❤️ Like clicked");
                } else {
                    console.warn("Could not find button with text 'Like'");
                }
                // --- FIX ENDS HERE ---
                
                await delay(300); 

                // 2. Fill Textarea
                const textarea = frameDoc.querySelector('textarea[placeholder="What do you like about this creation?"]');
                if (textarea) {
                    const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value').set;
                    nativeSetter.call(textarea, commentText);
                    textarea.dispatchEvent(new Event('input', { bubbles: true }));
                    console.log("📝 Comment filled");
                } else {
                    console.warn("Textarea not found");
                }

                await delay(300);

                // 3. Click Submit
                // Refetch buttons in case DOM updated
                const currentButtons = Array.from(frameDoc.querySelectorAll('button'));
                const submitButton = currentButtons.find(b => b.textContent.trim() === 'Submit');
                
                if (submitButton) {
                    submitButton.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: viewerFrame.contentWindow }));
                    console.log("🚀 Submit clicked");
                    
                    panelTitle.innerText = "Sent! Loading next...";
                    panelTitle.style.color = "#4ecdc4";
                    
                    setTimeout(() => { 
                        panelTitle.innerText = "Quick Comment & Auto-Like"; 
                        panelTitle.style.color = "#fff";
                        loadCurrentLink();
                    }, 2000);
                } else {
                    console.warn("Submit button not found");
                }

            } catch (err) {
                console.error("Error interacting with frame:", err);
            }
        }

        const buttonColors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ce8c', '#ffe66d'];
        
        comments.forEach((text, index) => {
            const btn = document.createElement('button');
            btn.textContent = text;
            btn.style = `
                flex: 0 0 auto; padding: 8px 16px; border: none; border-radius: 20px;
                background: ${buttonColors[index % buttonColors.length]}; color: #1a1a1a;
                font-size: 13px; font-weight: bold; cursor: pointer; white-space: nowrap;
                transition: transform 0.2s;
            `;
            btn.onmouseenter = () => btn.style.transform = "scale(1.05)";
            btn.onmouseleave = () => btn.style.transform = "scale(1)";
            
            btn.onclick = (e) => {
                e.preventDefault(); 
                performActionInFrame(text);
            };
            
            btnContainer.appendChild(btn);
        });

        commentPanel.appendChild(btnContainer);
        viewerContainer.appendChild(commentPanel);

        // --- STEP 6: NAVIGATION LOGIC ---
        function loadCurrentLink() {
            if (currentIndex < links.length) {
                loaderOverlay.style.display = "block";
                nextBtn.disabled = true;

                viewerFrame.src = links[currentIndex];
                console.log(`Loading: ${links[currentIndex]}`);
                currentIndex++;

                clearTimeout(loadTimeoutId);
                loadTimeoutId = setTimeout(() => {
                    loaderOverlay.style.display = "none";
                    nextBtn.disabled = false;
                }, 5000); 
            } else {
                alert("No more links! Closing viewer.");
                document.body.removeChild(viewerContainer);
            }
        }

        nextBtn.onclick = loadCurrentLink;
        
        viewerFrame.onload = function() {
            clearTimeout(loadTimeoutId);
            loaderOverlay.style.display = "none";
            nextBtn.disabled = false;
        };

        // Start
        loadCurrentLink();
    }

    // Start execution
    scrapeProfile(0);

})();
