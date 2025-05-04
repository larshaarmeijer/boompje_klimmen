document.addEventListener('DOMContentLoaded', () => {
    const setupDiv = document.getElementById('setupScreen');
    const gameDiv = document.getElementById('gameArea');
    const numPlayersInput = document.getElementById('numPlayers');
    const playerNamesContainer = document.getElementById('playerNamesContainer');
    const maxRoundsInput = document.getElementById('maxRounds');
    const startGameBtn = document.getElementById('startGameBtn');
    const newGameBtn = document.getElementById('newGameBtn');
    const roundInfoHeading = document.getElementById('roundInfo');
    const bidsContainer = document.getElementById('bidsContainer');
    const tricksContainer = document.getElementById('tricksContainer');
    const scoreHeader = document.getElementById('scoreHeader');
    const scoreBody = document.getElementById('scoreBody');
    const scoreTotal = document.getElementById('scoreTotal');
    const biddingScreen = document.getElementById('biddingScreen');
    const tricksScreen = document.getElementById('tricksScreen');
    const scoreboardScreen = document.getElementById('scoreboardScreen');
    const confirmBidsBtn = document.getElementById('confirmBidsBtn');
    const confirmTricksBtn = document.getElementById('confirmTricksBtn');
    const toggleScoreboardBtn = document.getElementById('toggleScoreboardBtn');
    const hideScoreboardBtn = document.getElementById('hideScoreboardBtn');
    const startNextRoundFromScoreboardBtn = document.getElementById('startNextRoundFromScoreboardBtn');
    const toggleBidLogFromScoreboardBtn = document.getElementById('toggleBidLogFromScoreboardBtn');
    const bidLogScreen = document.getElementById('bidLogScreen');
    const bidLogHeader = document.getElementById('bidLogHeader');
    const bidLogBody = document.getElementById('bidLogBody');
    const bidLogTotal = document.getElementById('bidLogTotal');
    const toggleBidLogBtn = document.getElementById('toggleBidLogBtn');
    const hideBidLogBtn = document.getElementById('hideBidLogBtn');
    const totalBidsDisplay = document.getElementById('totalBidsDisplay');
    const totalTricksDisplay = document.getElementById('totalTricksDisplay');
    const totalBidsDiv = document.querySelector('#biddingScreen .total-bids');
    const totalTricksDiv = document.querySelector('#tricksScreen .total-tricks');
    const menuBtn = document.getElementById('menuBtn');
    const sideMenu = document.getElementById('sideMenu');
    const closeMenuBtn = document.getElementById('closeMenuBtn');
    const penaltyBtn = document.getElementById('penaltyBtn');
    const resetScoreBtn = document.getElementById('resetScoreBtn');
    const actionModal = document.getElementById('actionModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalFormContent = document.getElementById('modalFormContent');
    const confirmActionBtn = document.getElementById('confirmActionBtn');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const finalRankingScreen = document.getElementById('finalRankingScreen');
    const finalRankingList = document.getElementById('finalRankingList');
    const newGameFromFinalBtn = document.getElementById('newGameFromFinalBtn');
    const exportPdfBtn = document.getElementById('exportPdfBtn'); // New button reference
    const viewScoreboardFromFinalBtn = document.getElementById('viewScoreboardFromFinalBtn');
    const viewBidLogFromFinalBtn = document.getElementById('viewBidLogFromFinalBtn');

    let players = [];
    let maxCards = 0;
    let rounds = [];
    let currentRoundIndex = 0;
    let scores = {};
    let totals = {};
    let bidLog = {};
    let bidTotals = {};
    let dealerIndex = 0;
    let gameState = 'setup';
    let scoreAdjustments = [];

    const STORAGE_KEY = 'boompjeKlimmenGameState';

    function saveGameState() {
        const stateToSave = {
            players,
            maxCards,
            rounds,
            currentRoundIndex,
            scores,
            totals,
            bidLog,
            bidTotals,
            dealerIndex,
            scoreAdjustments,
            gameState
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
        console.log("Game state saved.");
    }

    function loadGameState() {
        const savedState = localStorage.getItem(STORAGE_KEY);
        if (savedState) {
            try {
                const state = JSON.parse(savedState);
                players = state.players || [];
                maxCards = state.maxCards || 0;
                rounds = state.rounds || [];
                currentRoundIndex = state.currentRoundIndex || 0;
                scores = state.scores || {};
                totals = state.totals || {};
                bidLog = state.bidLog || {};
                bidTotals = state.bidTotals || {};
                dealerIndex = state.dealerIndex || 0;
                scoreAdjustments = state.scoreAdjustments || [];
                gameState = state.gameState || 'setup';

                console.log("Game state loaded:", gameState);

                if (players.length > 0 && gameState !== 'setup') {
                    setupDiv.style.display = 'none';
                    gameDiv.style.display = 'block';
                    setupScoreTableHeaders();
                    rebuildScoreTable();
                    setupBidLogTableHeaders();
                    rebuildBidLogTable();
                    restoreUIState();
                } else {
                    resetGameVariables();
                    showScreen('setup');
                }
            } catch (e) {
                console.error("Error loading game state:", e);
                localStorage.removeItem(STORAGE_KEY);
                showScreen('setup');
            }
        } else {
            console.log("No saved game state found.");
            showScreen('setup');
        }
    }

    function resetGame() {
        if (confirm("Weet je zeker dat je een nieuw spel wilt starten? Alle huidige voortgang gaat verloren.")) {
            localStorage.removeItem(STORAGE_KEY);
            resetGameVariables();
            playerNamesContainer.innerHTML = '';
            scoreHeader.innerHTML = '<th>Ronde</th>';
            scoreBody.innerHTML = '';
            scoreTotal.innerHTML = '<td>Totaal</td>';
            bidLogHeader.innerHTML = '<th>Ronde</th>';
            bidLogBody.innerHTML = '';
            bidLogTotal.innerHTML = '<td>Totaal Geboden</td>';
            numPlayersInput.value = 3;
            maxRoundsInput.value = 7;
            updatePlayerNameInputs();
            finalRankingScreen.style.display = 'none';
            showScreen('setup');
            console.log("Game reset.");
        }
    }

    function resetGameVariables() {
        players = [];
        maxCards = 0;
        rounds = [];
        currentRoundIndex = 0;
        scores = {};
        totals = {};
        bidLog = {};
        bidTotals = {};
        dealerIndex = 0;
        scoreAdjustments = [];
        gameState = 'setup';
    }

    function showScreen(screenName) {
        setupDiv.style.display = 'none';
        gameDiv.style.display = 'none';
        biddingScreen.style.display = 'none';
        tricksScreen.style.display = 'none';
        scoreboardScreen.style.display = 'none';
        bidLogScreen.style.display = 'none';
        finalRankingScreen.style.display = 'none';

        gameState = screenName;

        switch (screenName) {
            case 'setup':
                setupDiv.style.display = 'block';
                break;
            case 'bidding':
                gameDiv.style.display = 'block';
                biddingScreen.style.display = 'block';
                break;
            case 'tricks':
                gameDiv.style.display = 'block';
                tricksScreen.style.display = 'block';
                break;
            case 'scoreboard':
                if (currentRoundIndex >= rounds.length) {
                    document.querySelector('#scoreboardScreen h2').textContent = "Eindscore";
                    hideScoreboardBtn.style.display = 'inline-block';
                    startNextRoundFromScoreboardBtn.style.display = 'none';
                } else {
                    document.querySelector('#scoreboardScreen h2').textContent = "Score Overzicht";
                    hideScoreboardBtn.style.display = 'none';
                    startNextRoundFromScoreboardBtn.style.display = 'inline-block';
                }
                scoreboardScreen.style.display = 'block';
                break;
            case 'bidlog':
                bidLogScreen.style.display = 'block';
                break;
            case 'ended':
                document.querySelector('#scoreboardScreen h2').textContent = "Eindscore";
                hideScoreboardBtn.style.display = 'inline-block';
                startNextRoundFromScoreboardBtn.style.display = 'none';
                scoreboardScreen.style.display = 'block';
                break;
            case 'finalRanking':
                finalRankingScreen.style.display = 'block';
                displayFinalRanking();
                break;
            default:
                console.error("Unknown screen name:", screenName);
                setupDiv.style.display = 'block';
                gameState = 'setup';
        }
        if (document.readyState === 'complete') {
            saveGameState();
        }
    }

    function restoreUIState() {
        console.log("Restoring UI for state:", gameState);
        if (gameState === 'bidding' || gameState === 'tricks') {
            displayCurrentRound(true);
        } else {
            if (gameState === 'ended' || gameState === 'finalRanking') {
                gameState = 'finalRanking';
                showScreen('finalRanking');
            } else {
                showScreen(gameState);
            }
        }
    }

    function createPlayerInputControls(container, type, playerName, maxVal, isDealer = false) {
        const controlDiv = document.createElement('div');
        controlDiv.className = 'player-input-controls';
        controlDiv.id = `${type}-control-${playerName}`;

        const nameLabel = document.createElement('span');
        nameLabel.textContent = `${playerName}: `;
        nameLabel.className = 'player-name-label';

        if (type === 'bid' && isDealer) {
            nameLabel.classList.add('dealer-label');
        }

        const decrementBtn = document.createElement('button');
        decrementBtn.textContent = '-';
        decrementBtn.className = 'adjust-btn decrement-btn';
        decrementBtn.type = 'button';

        const input = document.createElement('input');
        input.type = 'number';
        input.id = `${type}-${playerName}`;
        input.min = '0';
        input.max = maxVal;
        input.required = true;
        input.value = '0';

        const incrementBtn = document.createElement('button');
        incrementBtn.textContent = '+';
        incrementBtn.className = 'adjust-btn increment-btn';
        incrementBtn.type = 'button';

        decrementBtn.addEventListener('click', () => {
            let currentValue = parseInt(input.value) || 0;
            if (currentValue > 0) {
                input.value = currentValue - 1;
                input.dispatchEvent(new Event('input'));
            }
        });

        incrementBtn.addEventListener('click', () => {
            let currentValue = parseInt(input.value) || 0;
            if (currentValue < maxVal) {
                input.value = currentValue + 1;
                input.dispatchEvent(new Event('input'));
            }
        });

        input.addEventListener('input', type === 'bid' ? updateTotalBidsDisplay : updateTotalTricksDisplay);

        controlDiv.appendChild(nameLabel);
        controlDiv.appendChild(decrementBtn);
        controlDiv.appendChild(input);
        controlDiv.appendChild(incrementBtn);

        container.appendChild(controlDiv);
    }

    numPlayersInput.addEventListener('change', updatePlayerNameInputs);

    function updatePlayerNameInputs() {
        playerNamesContainer.innerHTML = '';
        const numPlayers = parseInt(numPlayersInput.value);
        for (let i = 0; i < numPlayers; i++) {
            const div = document.createElement('div');
            const label = document.createElement('label');
            label.textContent = `Naam Speler ${i + 1}:`;
            label.htmlFor = `player${i}`;
            const input = document.createElement('input');
            input.type = 'text';
            input.id = `player${i}`;
            input.value = '';
            input.placeholder = `Speler ${i + 1}`;
            div.appendChild(label);
            div.appendChild(input);
            playerNamesContainer.appendChild(div);
        }
    }

    startGameBtn.addEventListener('click', startGame);
    newGameBtn.addEventListener('click', resetGame);

    function startGame() {
        resetGameVariables();

        players = [];
        const numPlayers = parseInt(numPlayersInput.value);
        for (let i = 0; i < numPlayers; i++) {
            const playerNameInput = document.getElementById(`player${i}`);
            const name = playerNameInput.value.trim() || `Speler ${i + 1}`;
            players.push(name);
            scores[name] = [];
            totals[name] = 0;
            bidLog[name] = [];
            bidTotals[name] = 0;
        }

        maxCards = parseInt(maxRoundsInput.value);
        if (isNaN(maxCards) || maxCards < 1) {
            alert("Voer een geldig maximum aantal kaarten in.");
            resetGameVariables();
            showScreen('setup');
            return;
        }

        dealerIndex = 0;
        generateRounds();
        setupScoreTableHeaders();
        setupBidLogTableHeaders();
        currentRoundIndex = 0;
        gameState = 'bidding';
        saveGameState();
        displayCurrentRound();
    }

    function generateRounds() {
        rounds = [];
        for (let i = 1; i <= maxCards; i++) {
            rounds.push({ cards: i, trump: true, name: `${i} kaarten` });
        }
        rounds.push({ cards: maxCards, trump: false, name: `${maxCards} kaarten (zonder troef)` });
        for (let i = maxCards; i >= 1; i--) {
            rounds.push({ cards: i, trump: true, name: `${i} kaarten` });
        }
    }

    function setupScoreTableHeaders() {
        scoreHeader.innerHTML = '<th>Ronde</th>';
        scoreTotal.innerHTML = '<td>Totaal</td>';
        if (!players || players.length === 0) return;
        players.forEach(name => {
            const th = document.createElement('th');
            th.textContent = name;
            scoreHeader.appendChild(th);

            const td = document.createElement('td');
            td.id = `total-${name}`;
            td.textContent = totals[name] !== undefined ? totals[name] : '0';
            scoreTotal.appendChild(td);
        });
    }

    function rebuildScoreTable() {
        scoreBody.innerHTML = '';
        if (!rounds || rounds.length === 0 || !players || players.length === 0) return;

        const roundsToShow = gameState === 'ended' ? rounds.length : currentRoundIndex;

        for (let i = 0; i < roundsToShow; i++) {
            const round = rounds[i];
            const scoreRow = document.createElement('tr');
            const roundCell = document.createElement('td');
            roundCell.textContent = round.name;
            scoreRow.appendChild(roundCell);

            players.forEach(name => {
                const scoreCell = document.createElement('td');
                const score = (scores[name] && scores[name][i] !== undefined) ? scores[name][i] : '-';
                scoreCell.textContent = score;
                scoreRow.appendChild(scoreCell);
            });
            scoreBody.appendChild(scoreRow);
        }

        scoreAdjustments.forEach(adj => {
            const adjRow = document.createElement('tr');
            const descCell = document.createElement('td');
            descCell.textContent = adj.description;
            descCell.style.fontStyle = 'italic';
            adjRow.appendChild(descCell);

            players.forEach(name => {
                const adjCell = document.createElement('td');
                adjCell.textContent = adj.values[name] !== undefined ? adj.values[name] : '-';
                adjCell.style.fontStyle = 'italic';
                adjRow.appendChild(adjCell);
            });
            scoreBody.appendChild(adjRow);
        });

        players.forEach(name => {
            document.getElementById(`total-${name}`).textContent = totals[name] || '0';
        });
    }

    function setupBidLogTableHeaders() {
        bidLogHeader.innerHTML = '<th>Ronde</th>';
        bidLogTotal.innerHTML = '<td>Totaal Geboden</td>';
        if (!players || players.length === 0) return;
        players.forEach(name => {
            const th = document.createElement('th');
            th.textContent = name;
            bidLogHeader.appendChild(th);

            const td = document.createElement('td');
            td.id = `bid-total-${name}`;
            td.textContent = bidTotals[name] !== undefined ? bidTotals[name] : '0';
            bidLogTotal.appendChild(td);
        });
    }

    function rebuildBidLogTable() {
        bidLogBody.innerHTML = '';
        if (!rounds || rounds.length === 0 || !players || players.length === 0) return;

        const roundsToShow = gameState === 'ended' ? rounds.length : currentRoundIndex;

        for (let i = 0; i < roundsToShow; i++) {
            const round = rounds[i];
            const bidLogRow = document.createElement('tr');
            const roundCell = document.createElement('td');
            roundCell.textContent = round.name;
            bidLogRow.appendChild(roundCell);

            players.forEach(name => {
                const bidCell = document.createElement('td');
                const bid = (bidLog[name] && bidLog[name][i] !== undefined) ? bidLog[name][i] : '-';
                bidCell.textContent = bid;
                bidLogRow.appendChild(bidCell);
            });
            bidLogBody.appendChild(bidLogRow);
        }
        players.forEach(name => {
            document.getElementById(`bid-total-${name}`).textContent = bidTotals[name] || '0';
        });
    }

    function displayCurrentRound(isRestoring = false) {
        if (currentRoundIndex >= rounds.length) {
            gameState = 'finalRanking';
            showScreen('finalRanking');
            saveGameState();
            return;
        }

        const round = rounds[currentRoundIndex];
        roundInfoHeading.textContent = `Ronde ${currentRoundIndex + 1}: ${round.name}`;
        document.getElementById('cardsInRoundBid').textContent = round.cards;
        document.getElementById('cardsInRoundTrick').textContent = round.cards;

        bidsContainer.innerHTML = '';
        tricksContainer.innerHTML = '';

        const playerOrder = [];
        for (let i = 0; i < players.length; i++) {
            playerOrder.push(players[(dealerIndex + i) % players.length]);
        }

        playerOrder.forEach(name => {
            const isCurrentDealer = name === players[dealerIndex];
            createPlayerInputControls(bidsContainer, 'bid', name, round.cards, isCurrentDealer);
            createPlayerInputControls(tricksContainer, 'trick', name, round.cards);
        });

        updateTotalBidsDisplay();
        updateTotalTricksDisplay();

        if (!isRestoring) {
            showScreen('bidding');
        } else {
            if (gameState === 'bidding') {
                biddingScreen.style.display = 'block';
                tricksScreen.style.display = 'none';
            } else if (gameState === 'tricks') {
                biddingScreen.style.display = 'none';
                tricksScreen.style.display = 'block';
                restoreBidsOnTricksScreen();
            }
        }

        confirmBidsBtn.disabled = true;
        confirmTricksBtn.disabled = true;
        updateTotalBidsDisplay();
        updateTotalTricksDisplay();
    }

    function updateTotalBidsDisplay() {
        let total = 0;
        let allFilled = true;
        players.forEach(name => {
            const bidInput = document.getElementById(`bid-${name}`);
            if (!bidInput || bidInput.value === '') {
                allFilled = false;
            }
            total += parseInt(bidInput.value) || 0;
        });
        totalBidsDisplay.textContent = total;
        const round = rounds[currentRoundIndex];
        confirmBidsBtn.disabled = !allFilled || (total === round.cards);

        if (allFilled && total === round.cards) {
            totalBidsDiv.style.color = 'red';
            totalBidsDiv.style.fontWeight = 'bold';
        } else {
            totalBidsDiv.style.color = '';
            totalBidsDiv.style.fontWeight = '';
        }
    }

    function updateTotalTricksDisplay() {
        let total = 0;
        let allFilled = true;
        players.forEach(name => {
            const trickInput = document.getElementById(`trick-${name}`);
            if (!trickInput || trickInput.value === '') {
                allFilled = false;
            }
            total += parseInt(trickInput.value) || 0;
        });
        totalTricksDisplay.textContent = total;
        const round = rounds[currentRoundIndex];
        confirmTricksBtn.disabled = !allFilled || (total !== round.cards);

        if (allFilled && total !== round.cards) {
            totalTricksDiv.style.color = 'red';
            totalTricksDiv.style.fontWeight = 'bold';
        } else {
            totalTricksDiv.style.color = '';
            totalTricksDiv.style.fontWeight = '';
        }
    }

    confirmBidsBtn.addEventListener('click', () => {
        const round = rounds[currentRoundIndex];
        let totalBids = 0;
        let validInputs = true;
        const currentRoundBids = {};

        players.forEach(name => {
            const bidInput = document.getElementById(`bid-${name}`);
            const bid = parseInt(bidInput.value);
            if (isNaN(bid) || bid < 0 || bid > round.cards) {
                validInputs = false;
            }
            totalBids += bid;
            currentRoundBids[name] = bid;
        });

        if (!validInputs) {
            alert("Voer geldige biedingen in (0 tot " + round.cards + ").");
            return;
        }

        if (totalBids === round.cards) {
            alert(`Het totaal aantal biedingen (${totalBids}) mag niet gelijk zijn aan het aantal kaarten (${round.cards}).`);
            return;
        }

        const bidLogRow = document.createElement('tr');
        const roundCell = document.createElement('td');
        roundCell.textContent = round.name;
        bidLogRow.appendChild(roundCell);

        players.forEach(name => {
            const bid = currentRoundBids[name];
            if (!bidLog[name]) bidLog[name] = [];
            if (bidLog[name].length === currentRoundIndex) {
                bidLog[name].push(bid);
                bidTotals[name] = (bidTotals[name] || 0) + bid;
            }

            const bidCell = document.createElement('td');
            bidCell.textContent = bid;
            bidLogRow.appendChild(bidCell);

            document.getElementById(`bid-total-${name}`).textContent = bidTotals[name];
        });
        if (bidLogBody.children.length === currentRoundIndex) {
            bidLogBody.appendChild(bidLogRow);
        }

        displayBidsOnTricksScreen(currentRoundBids);

        gameState = 'tricks';
        saveGameState();
        showScreen('tricks');
        updateTotalTricksDisplay();
    });

    function displayBidsOnTricksScreen(bidsToDisplay) {
        players.forEach(name => {
            const bid = bidsToDisplay[name];
            const trickControlDiv = document.getElementById(`trick-control-${name}`);
            if (trickControlDiv) {
                let bidDisplaySpan = trickControlDiv.querySelector('.bid-display-trick-screen');
                if (!bidDisplaySpan) {
                    bidDisplaySpan = document.createElement('span');
                    bidDisplaySpan.className = 'bid-display-trick-screen';
                    trickControlDiv.appendChild(bidDisplaySpan);
                }
                bidDisplaySpan.textContent = ` (${bid !== undefined ? bid : '?'})`;
            }
        });
    }

    function restoreBidsOnTricksScreen() {
        const currentRoundBids = {};
        players.forEach(name => {
            if (bidLog[name] && bidLog[name][currentRoundIndex] !== undefined) {
                currentRoundBids[name] = bidLog[name][currentRoundIndex];
            } else {
                currentRoundBids[name] = '?';
            }
        });
        displayBidsOnTricksScreen(currentRoundBids);
    }

    confirmTricksBtn.addEventListener('click', () => {
        const round = rounds[currentRoundIndex];
        const roundScores = {};
        let totalTricks = 0;
        let validInputs = true;
        const bids = {};
        const tricksTaken = {};

        players.forEach(name => {
            const bidInput = document.getElementById(`bid-${name}`);
            const trickInput = document.getElementById(`trick-${name}`);
            if (!bidInput || !trickInput) {
                console.error(`Input fields for player ${name} not found.`);
                validInputs = false;
                return;
            }
            const bid = (bidLog[name] && bidLog[name][currentRoundIndex] !== undefined) ? bidLog[name][currentRoundIndex] : 0;
            const tricks = parseInt(trickInput.value);

            if (isNaN(tricks) || tricks < 0 || tricks > round.cards) {
                validInputs = false;
            }

            bids[name] = bid;
            tricksTaken[name] = tricks;
            totalTricks += tricks;
        });

        if (!validInputs) {
            alert("Ongeldige invoer voor slagen.");
            return;
        }

        if (totalTricks !== round.cards) {
            alert(`Totaal aantal slagen (${totalTricks}) moet gelijk zijn aan het aantal kaarten (${round.cards}).`);
            return;
        }

        players.forEach(name => {
            const bid = bids[name];
            const tricks = tricksTaken[name];
            if (tricks === undefined) return;

            let score = 0;
            if (bid === tricks) {
                score = 10 + (tricks * 3);
            } else {
                const difference = Math.abs(bid - tricks);
                score = -(difference * 3);
            }
            roundScores[name] = score;
        });

        players.forEach(name => {
            const score = roundScores[name];
            if (!scores[name]) scores[name] = [];

            if (scores[name].length === currentRoundIndex) {
                scores[name].push(score);
                totals[name] = (totals[name] || 0) + score;
            } else if (scores[name].length > currentRoundIndex) {
                console.warn(`Score for round ${currentRoundIndex} already exists for ${name}.`);
            }
        });

        dealerIndex = (dealerIndex + 1) % players.length;
        currentRoundIndex++;

        rebuildScoreTable();

        if (currentRoundIndex >= rounds.length) {
            gameState = 'finalRanking';
            saveGameState();
            showScreen('finalRanking');
        } else {
            gameState = 'scoreboard';
            saveGameState();
            showScreen('scoreboard');
        }
    });

    menuBtn.addEventListener('click', () => {
        sideMenu.classList.add('open');
    });

    closeMenuBtn.addEventListener('click', () => {
        sideMenu.classList.remove('open');
    });

    document.addEventListener('click', (event) => {
        if (sideMenu.classList.contains('open') && !sideMenu.contains(event.target) && !menuBtn.contains(event.target)) {
            sideMenu.classList.remove('open');
        }
    });

    function showActionModal(type) {
        modalFormContent.innerHTML = '';
        actionModal.style.display = 'flex';
        actionModal.dataset.actionType = type;

        if (type === 'penalty') {
            modalTitle.textContent = 'Strafpunten Geven';
            const playerSelectLabel = document.createElement('label');
            playerSelectLabel.textContent = 'Speler: ';
            playerSelectLabel.htmlFor = 'penaltyPlayerSelect';
            const playerSelect = document.createElement('select');
            playerSelect.id = 'penaltyPlayerSelect';
            players.forEach(name => {
                const option = document.createElement('option');
                option.value = name;
                option.textContent = name;
                playerSelect.appendChild(option);
            });
            modalFormContent.appendChild(playerSelectLabel);
            modalFormContent.appendChild(playerSelect);
            modalFormContent.appendChild(document.createElement('br'));

            const pointsInputLabel = document.createElement('label');
            pointsInputLabel.textContent = 'Strafpunten (positief getal): ';
            pointsInputLabel.htmlFor = 'penaltyPointsInput';
            const pointsInput = document.createElement('input');
            pointsInput.type = 'number';
            pointsInput.id = 'penaltyPointsInput';
            pointsInput.min = '1';
            pointsInput.value = '10';
            modalFormContent.appendChild(pointsInputLabel);
            modalFormContent.appendChild(pointsInput);

        } else if (type === 'reset') {
            modalTitle.textContent = 'Score(s) naar 0 Zetten';
            const info = document.createElement('p');
            info.textContent = 'Selecteer speler(s) om de score te resetten:';
            modalFormContent.appendChild(info);

            players.forEach(name => {
                const checkboxDiv = document.createElement('div');
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.id = `resetPlayer-${name}`;
                checkbox.value = name;
                const label = document.createElement('label');
                label.htmlFor = `resetPlayer-${name}`;
                label.textContent = ` ${name} (Huidig: ${totals[name] || 0})`;
                label.style.marginLeft = '5px';

                checkboxDiv.appendChild(checkbox);
                checkboxDiv.appendChild(label);
                modalFormContent.appendChild(checkboxDiv);
            });
        }
        sideMenu.classList.remove('open');
    }

    function hideActionModal() {
        actionModal.style.display = 'none';
        modalFormContent.innerHTML = '';
        delete actionModal.dataset.actionType;
    }

    closeModalBtn.addEventListener('click', hideActionModal);

    penaltyBtn.addEventListener('click', () => showActionModal('penalty'));
    resetScoreBtn.addEventListener('click', () => showActionModal('reset'));

    confirmActionBtn.addEventListener('click', () => {
        const actionType = actionModal.dataset.actionType;
        if (actionType === 'penalty') {
            applyPenalty();
        } else if (actionType === 'reset') {
            applyReset();
        }
        hideActionModal();
        rebuildScoreTable();
        saveGameState();
    });

    function applyPenalty() {
        const playerSelect = document.getElementById('penaltyPlayerSelect');
        const pointsInput = document.getElementById('penaltyPointsInput');
        const selectedPlayer = playerSelect.value;
        const points = parseInt(pointsInput.value);

        if (!selectedPlayer || isNaN(points) || points <= 0) {
            alert("Selecteer een speler en voer een geldig positief aantal strafpunten in.");
            return;
        }

        const penaltyValue = -points;
        const adjustment = {
            type: 'penalty',
            description: `Strafpunten ${selectedPlayer}: ${penaltyValue}`,
            values: { [selectedPlayer]: penaltyValue }
        };
        scoreAdjustments.push(adjustment);

        totals[selectedPlayer] = (totals[selectedPlayer] || 0) + penaltyValue;
        rebuildScoreTable();
        console.log(`Applied penalty: ${penaltyValue} to ${selectedPlayer}`);
    }

    function applyReset() {
        const selectedPlayers = [];
        players.forEach(name => {
            const checkbox = document.getElementById(`resetPlayer-${name}`);
            if (checkbox && checkbox.checked) {
                selectedPlayers.push(name);
            }
        });

        if (selectedPlayers.length === 0) {
            alert("Selecteer ten minste één speler om de score te resetten.");
            return;
        }

        const adjustment = {
            type: 'reset',
            description: `Score reset naar 0`,
            values: {}
        };

        selectedPlayers.forEach(name => {
            const currentValue = totals[name] || 0;
            const resetValue = -currentValue;
            adjustment.values[name] = resetValue;

            totals[name] = 0;
            console.log(`Reset score for ${name}. Applied adjustment: ${resetValue}`);
        });

        scoreAdjustments.push(adjustment);
        rebuildScoreTable();
    }

    toggleScoreboardBtn.addEventListener('click', () => {
        hideScoreboardBtn.dataset.returnScreen = gameState;
        showScreen('scoreboard');
    });

    hideScoreboardBtn.addEventListener('click', () => {
        // Check if the game has ended before deciding where to return
        if (gameState === 'finalRanking' || currentRoundIndex >= rounds.length) {
            showScreen('finalRanking');
        } else {
            // Original logic for returning during the game
            const returnToState = hideScoreboardBtn.dataset.returnScreen || 'bidding';
            delete hideScoreboardBtn.dataset.returnScreen;
            showScreen(returnToState);
            if (currentRoundIndex < rounds.length) {
                displayCurrentRound(true);
            }
        }
    });

    startNextRoundFromScoreboardBtn.addEventListener('click', () => {
        displayCurrentRound();
    });

    toggleBidLogBtn.addEventListener('click', () => {
        hideBidLogBtn.dataset.returnScreen = gameState;
        hideBidLogBtn.dataset.returnTo = 'game';
        showScreen('bidlog');
    });

    toggleBidLogFromScoreboardBtn.addEventListener('click', () => {
        hideBidLogBtn.dataset.returnScreen = gameState;
        hideBidLogBtn.dataset.returnTo = 'scoreboard';
        showScreen('bidlog');
    });

    hideBidLogBtn.addEventListener('click', () => {
        const returnTo = hideBidLogBtn.dataset.returnTo;
        const returnState = hideBidLogBtn.dataset.returnScreen;
        delete hideBidLogBtn.dataset.returnTo;
        delete hideBidLogBtn.dataset.returnScreen;

        // Check if the game has ended before deciding where to return
        if (gameState === 'finalRanking' || currentRoundIndex >= rounds.length) {
            showScreen('finalRanking');
        } else if (returnTo === 'scoreboard') {
            showScreen('scoreboard');
        } else if (returnTo === 'game' && returnState && returnState !== 'setup') {
            showScreen(returnState);
            if (currentRoundIndex < rounds.length) {
                displayCurrentRound(true);
            }
        } else {
            // Fallback to setup if something is wrong, but ideally should not happen
            showScreen('setup');
        }
    });

    function displayFinalRanking() {
        finalRankingList.innerHTML = '';

        const rankedPlayers = players.map(name => ({
            name: name,
            score: totals[name] || 0
        })).sort((a, b) => b.score - a.score);

        let rank = 0;
        let lastScore = Infinity;
        rankedPlayers.forEach((player, index) => {
            if (player.score < lastScore) {
                rank = index + 1;
                lastScore = player.score;
            }
            const listItem = document.createElement('li');
            listItem.textContent = `${rank}${getRankSuffix(rank)}: ${player.name} (${player.score})`;
            finalRankingList.appendChild(listItem);
        });
    }

    function getRankSuffix(rank) {
        if (rank === 1) return 'e';
        return 'e';
    }

    function exportToPdf() {
        if (typeof jspdf === 'undefined' || typeof jspdf.jsPDF === 'undefined') {
            console.error("jsPDF library not loaded.");
            alert("Kon PDF niet genereren: jsPDF bibliotheek niet gevonden.");
            return;
        }

        const { jsPDF } = jspdf;

        // Corrected check for jsPDF-AutoTable plugin
        if (typeof jsPDF.API === 'undefined' || typeof jsPDF.API.autoTable !== 'function') {
            console.error("jsPDF-AutoTable plugin not loaded or not attached correctly.");
            alert("Kon PDF niet genereren: jsPDF-AutoTable plugin niet gevonden of niet correct geladen. Controleer de console voor details.");
            return;
        }

        const doc = new jsPDF({ orientation: 'landscape' });

        doc.setFontSize(18);
        doc.text("Boompje Klimmen - Scores & Biedingen", 14, 22);
        doc.setFontSize(11);
        doc.setTextColor(100);

        // Prepare table data
        const head = [['Ronde']];
        players.forEach(name => {
            head[0].push(`${name} Bod`);
            head[0].push(`${name} Score`);
        });

        const bodyData = [];
        rounds.forEach((round, i) => {
            const row = [round.name];
            players.forEach(name => {
                const bid = (bidLog[name] && bidLog[name][i] !== undefined) ? bidLog[name][i] : '-';
                const score = (scores[name] && scores[name][i] !== undefined) ? scores[name][i] : '-';
                row.push(bid);
                row.push(score);
            });
            bodyData.push(row);
        });

        // Add adjustment rows if any
        scoreAdjustments.forEach(adj => {
            const row = [adj.description];
            players.forEach(name => {
                const value = adj.values[name] !== undefined ? adj.values[name] : '-';
                row.push('-'); // No bid for adjustments
                row.push(value);
            });
            bodyData.push(row);
        });

        // Add total row
        const totalRow = ['Totaal'];
        players.forEach(name => {
            totalRow.push(bidTotals[name] || '0');
            totalRow.push(totals[name] || '0');
        });
        bodyData.push(totalRow);

        doc.autoTable({
            head: head,
            body: bodyData,
            startY: 30,
            theme: 'grid',
            headStyles: { fillColor: [22, 160, 133] }, // Teal color for header
            footStyles: { fillColor: [211, 211, 211], fontStyle: 'bold' }, // Light gray for footer
            didParseCell: function (data) {
                // Style adjustment rows
                if (scoreAdjustments.some(adj => adj.description === data.row.raw[0])) {
                    if (data.cell.raw !== '-') { // Don't style the '-' bid cell
                         data.cell.styles.fontStyle = 'italic';
                         data.cell.styles.textColor = [100, 100, 100];
                    }
                }
                // Style total row
                if (data.row.raw[0] === 'Totaal') {
                    data.cell.styles.fontStyle = 'bold';
                }
            }
        });

        // Add final ranking below the table
        let tableEndY = doc.lastAutoTable.finalY;
        const pageHeight = doc.internal.pageSize.height;
        const margin = 20; // Define a margin
        const rankingLineHeight = 5; // Estimated height per ranking line
        const rankingTitleHeight = 10; // Estimated height for the title
        const initialOffsetY = 7; // Initial offset below title
        const estimatedRankingHeight = rankingTitleHeight + initialOffsetY + (players.length * rankingLineHeight);

        let rankingStartY;

        // Check if the ranking fits on the current page
        if (tableEndY + estimatedRankingHeight + margin > pageHeight) {
            doc.addPage();
            rankingStartY = margin; // Start near the top of the new page
        } else {
            rankingStartY = tableEndY + 10; // Start below the table on the same page
        }

        doc.setFontSize(14);
        doc.text("Eindstand:", 14, rankingStartY);
        doc.setFontSize(10);
        const rankedPlayers = players.map(name => ({
            name: name,
            score: totals[name] || 0
        })).sort((a, b) => b.score - a.score);

        let rank = 0;
        let lastScore = Infinity;
        let rankY = rankingStartY + initialOffsetY; // Use the calculated start Y
        rankedPlayers.forEach((player, index) => {
            // Check if adding this line would exceed the page height on a new page
            if (rankY + rankingLineHeight > pageHeight - margin && rankingStartY === margin) {
                doc.addPage();
                rankY = margin; // Reset Y for the new page
                // Optionally re-add the title on the new page if desired
                // doc.setFontSize(14);
                // doc.text("Eindstand (vervolg):", 14, rankY);
                // doc.setFontSize(10);
                // rankY += initialOffsetY;
            }

            if (player.score < lastScore) {
                rank = index + 1;
                lastScore = player.score;
            }
            doc.text(`${rank}${getRankSuffix(rank)}: ${player.name} (${player.score})`, 14, rankY);
            rankY += rankingLineHeight;
        });

        doc.save('BoompjeKlimmen_Scores.pdf');
    }

    newGameFromFinalBtn.addEventListener('click', resetGame);
    exportPdfBtn.addEventListener('click', exportToPdf); // Add event listener

    // Add listeners for buttons on the final ranking screen
    viewScoreboardFromFinalBtn.addEventListener('click', () => {
        showScreen('scoreboard');
    });

    viewBidLogFromFinalBtn.addEventListener('click', () => {
        showScreen('bidlog');
    });

    updatePlayerNameInputs();
    loadGameState();
});
