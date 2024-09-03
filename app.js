document.addEventListener('DOMContentLoaded', () => {
    // Page elements
    const balanceElement = document.getElementById('balance');
    const progressElement = document.getElementById('progress');
    const progressBarFill = document.getElementById('progress-bar-fill');
    const coinElement = document.getElementById('coin');
    const timerElement = document.getElementById('timer');
    const timerDisplay = document.getElementById('timer-display');
    const minedTokenElement = document.getElementById('total-mined-coins');
    const activeUsersElement = document.getElementById('active-users');
    const contractAddressElement = document.getElementById('contract-address');
    const copyContractButton = document.getElementById('copy-contract-button');

    // Navigation buttons
    const homeButton = document.getElementById('home-button');
    const referralButton = document.getElementById('referral-button');
    const infoButton = document.getElementById('info-button');

    // Pages
    const homePage = document.getElementById('home-page');
    const referralPage = document.getElementById('referral-page');
    const infoPage = document.getElementById('info-page');

    // Referral section elements
    const totalInvitedUsersElement = document.getElementById('total-invited-users');
    const referralLinkElement = document.getElementById('referral-link');
    const copyButton = document.getElementById('copy-button');

    // Mining variables
    let balance = 0;
    let clicks = 0;
    const totalClicks = 200;
    let miningAllowed = true;
    let coinRotating = false;
    let totalMined = 0;
    let activeUsers = 0;

    // Timer and rotation variables
    let rotationAngle = 0;
    const rotationSpeed = 3; // Degrees per frame

    // Function to update progress bar and balance
    function updateProgress() {
        const percentage = (clicks / totalClicks) * 100;
        progressElement.textContent = `${clicks}/${totalClicks}`;
        progressBarFill.style.width = `${percentage}%`;
    }

    // Function to start the timer
    function startTimer() {
        const endTime = new Date().getTime() + 2 * 60 * 1000; // 2 minutes from now

        function updateTimer() {
            const now = new Date().getTime();
            const timeLeft = endTime - now;

            if (timeLeft <= 0) {
                timerElement.style.display = 'none';
                miningAllowed = true;
                clicks = 0;
                balance = 0;
                updateProgress();
                stopCoinRotation();
                return;
            }

            const minutes = Math.floor((timeLeft % (60 * 60 * 1000)) / (60 * 1000));
            const seconds = Math.floor((timeLeft % (60 * 1000)) / 1000);

            timerDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
            setTimeout(updateTimer, 1000);
        }

        updateTimer();
    }

    // Function to rotate the coin clockwise
    function rotateCoinClockwise() {
        let rotation = 0;
        const interval = setInterval(() => {
            if (!coinRotating) {
                clearInterval(interval);
                return;
            }
            rotation = (rotation + rotationSpeed) % 360;
            coinElement.style.transform = `rotate(${rotation}deg)`;
        }, 16); // 60 FPS
    }

    // Function to rotate the coin anticlockwise
    function rotateCoinAnticlockwise() {
        let rotation = 0;
        const interval = setInterval(() => {
            if (coinRotating) {
                clearInterval(interval);
                return;
            }
            rotation = (rotation - rotationSpeed) % 360;
            coinElement.style.transform = `rotate(${rotation}deg)`;
        }, 16); // 60 FPS
    }

    function startCoinRotation() {
        coinRotating = true;
        rotateCoinClockwise();
    }

    function stopCoinRotation() {
        coinRotating = false;
    }

    // Handle coin click event for mining and rotation
    coinElement.addEventListener('click', () => {
        if (miningAllowed) {
            if (clicks < totalClicks) {
                clicks += 1;
                balance += 1;  // Add 1 STO per click
                totalMined += 1; // Total mined by all users
                balanceElement.textContent = balance;  // Update the balance display
                updateProgress();
            }

            if (clicks >= totalClicks) {
                clicks = 0;  // Reset clicks after reaching totalClicks
                balance = 0; // Reset balance
                updateProgress();
                timerElement.style.display = 'block';
                miningAllowed = false;
                startTimer();
                stopCoinRotation();
                setTimeout(() => {
                    coinRotating = false;
                    rotateCoinAnticlockwise();
                }, 100); // Start anticlockwise rotation after stopping clockwise
            }
        }
    });

    // Navigation function
    function showPage(page) {
        homePage.style.display = 'none';
        referralPage.style.display = 'none';
        infoPage.style.display = 'none';

        page.style.display = 'block';
    }

    // Button click events for navigation
    homeButton.addEventListener('click', () => {
        showPage(homePage);
    });

    referralButton.addEventListener('click', () => {
        showPage(referralPage);
    });

    infoButton.addEventListener('click', () => {
        showPage(infoPage);
    });

    // Copy referral link functionality
    copyButton.addEventListener('click', () => {
        referralLinkElement.select();
        document.execCommand('copy');
        alert('Referral link copied to clipboard!');
    });

    // Copy contract address functionality
    copyContractButton.addEventListener('click', () => {
        const range = document.createRange();
        range.selectNode(contractAddressElement);
        window.getSelection().removeAllRanges();
        window.getSelection().addRange(range);
        document.execCommand('copy');
        window.getSelection().removeAllRanges();
        alert('Contract address copied to clipboard!');
    });

    // Update info section
    function updateInfoSection() {
        minedTokenElement.textContent = totalMined;
        activeUsersElement.textContent = activeUsers;
    }

    // Simulate user activity with random numbers between 5000 and 97000
    function simulateUserActivity() {
        setInterval(() => {
            activeUsers = Math.floor(Math.random() * (97000 - 5000 + 1)) + 5000;
            updateInfoSection();
        }, 60000); // Update every 60 seconds
    }

    simulateUserActivity(); // Start simulating user activity

    // Initialize the app by showing the home page
    showPage(homePage);
});