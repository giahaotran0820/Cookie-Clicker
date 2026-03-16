/**
 * Cookie Clicker Game - A simple cookie clicker game with upgrades and achievements.
 * @description: A simple cookie clicker game with upgrades and achievements.
 * @version: 1.1.1 Beta
 * @date: 3-7-2026
 * @author: https://github.com/giahaotran0820
 * @license: MIT
 */

var Game = (function () {
  const cookies = document.getElementById("cookies");
  const cookieClickerBtn = document.querySelector(".cookie-clicker-img");
  const cookiePerSecond = document.getElementById("cookie-per-second");
  const floatingNumber = document.querySelector(".floating-number");

  const buildingUpgradeElement = document.querySelector(".building-upgrades");
  const powerfulUpgradeElement = document.querySelector(".powerful-upgrades");
  const achievementElement = document.querySelector(".achievements");

  const saveBtn = document.querySelector(".btn.save");
  const loadBtn = document.querySelector(".btn.load");
  const resetBtn = document.querySelector(".btn.reset");

  const lastSavedText = document.getElementById("last-saved");
  const loadStatusText = document.getElementById("load-status");
  const versionText = document.getElementById("version");

  let million = Math.pow(10, 6);

  function round(num) {
    return Math.round(num * 10) / 10;
  }

  function formatNumber(num) {
    const number = round(num);
    const suffixes = ["", "", "Million", "Billion", "Trillion", "Quadrillion", "Quintillion", "Sextillion", "Septillion", "Octillion", "Nonillion", "Decillion"]; // Add more suffixes as needed
    const tier = Math.log10(Math.abs(number)) / 3 | 0;
    const scaled = number / Math.pow(10, tier * 3);
    const suffix = suffixes[tier];
    
    if (tier == suffixes.length) {
      const exponent = Math.floor(Math.log10(Math.abs(number)));
      const mantissa = number / Math.pow(10, exponent);
      return mantissa.toFixed(2) + "e+" + exponent;
    } else return scaled.toFixed(3) + " " + suffix;
  }

  /**
   * Stats object to store the game stats
   * @param {number} cookieCount - The number of cookies the player has to click
   * @param {number} cookiePerClick - The number of cookies the player gets per click
   * @param {number} cookiePerSecond - The number of cookies the player gets per second
   */

  let stats = {
    cookieCount: 0,
    cookiePerClick: 1,
    cookiePerSecond: 0,
    getPerSecond: function () {
      stats.cookiePerSecond = 0;
      for (let i = 0; i < buildingUpgrade.name.length; i++) {
        stats.cookiePerSecond += buildingUpgrade.perSecond[i] * buildingUpgrade.level[i];
      }
      return stats.cookiePerSecond;
    },
    getCookieCount: function (count) {
      const setCookieCount = round(count) > 1 ? round(count) + " Cookies" : round(count) + " Cookie"; // if cookieCount is greater than 1, then add an "s" to the end of "Cookie" (this is to make the game display "Cookies" instead of "Cookie" when the cookieCount is greater than 1)

      const zeroCookieCount = round(count) == 0 ? "0 Cookies" : setCookieCount; // if cookieCount is 0, then set it to "0 Cookies" (this is to prevent the game from displaying "0 Cookie" when the stats.cookieCount is 0)

      const defaultCookieCount = round(count) < 0 ? "0 Cookies" : zeroCookieCount; // if cookieCount is less than 0, then set it to "0 Cookies" (negative cookies are not allowed)

      const commaCookieCount = String(defaultCookieCount).replace(/\B(?=(\d{3})+(?!\d))/g, ","); // add commas to the cookieCount (this is to make the game display "1,000 Cookies" instead of "1000 Cookies")
      
      const formattedCookieCount = formatNumber(count) + " Cookies"; // format the cookieCount to display "1.000 Million Cookies" instead of "1000000 Cookies" when the cookieCount is greater than or equal to 1,000,000
      
      const cookieCount = count >= million ? formattedCookieCount : commaCookieCount; // if cookieCount is greater than or equal to 1,000,000, then format the cookieCount to display "1.000 Million Cookies" instead of "1,000,000 Cookies"
      
      return cookieCount;
    }
  }
  
  let buildingUpgrade = {
    name: [
      "Cursor",
      "Grandma",
      "Farm",
      "Mine",
      "Factory",
      "Bank"
    ],
    cost: [10, 100, 800, 4700, 26000, 140000],
    level: [0, 0, 0, 0, 0, 0],
    perSecond: [0.1, 1, 8, 47, 260, 1400],
    image: [
      "assets/cursor.PNG",
      "assets/grandma.JPG",
      "assets/farm.JPG",
      "assets/mine.PNG",
      "assets/factory.JPG",
      "assets/bank.PNG"
    ],
    costMultiplier: [1.15, 1.16, 1.14, 1.18, 1.17, 1.2],
    buyUpgrade: function (index) {
      if (stats.cookieCount >= this.cost[index]) {
        stats.cookieCount -= this.cost[index];
        this.level[index]++;
        this.cost[index] = Math.round(this.cost[index] * this.costMultiplier[index]);

        updateBuildingUpgrades();
        updateScore();
      } else {
        alert(`Not enough cookies! You need ${round(this.cost[index] - stats.cookieCount)} more cookies to buy this building upgrade!`);
      }
    }
  }

  let powerfulUpgrade = {
    name: [
      "Reinforced Index Finger",
      "Carpal Tunnel Prevention Cream",
      "Forwards From Grandma"
    ],
    image: [
      "assets/reinforced_index_finger.jpg",
      "assets/carpal_tunnel_prevention_cream.jpg",
      "assets/forwards_from_grandma.jpg"
    ],
    type: [
      "building",
      "building",
      "building"
    ],
    description: [
      "The mouse and cursors are twice as efficient.",
      "The mouse and cursors are twice as efficient.",
      "Grandmas are twice as efficient."
    ],
    cost: [300, 500, 1000],
    buildingIndex: [0, 0, 1],
    requirement: [1, 1, 1],
    bonus: [2, 2, 2],
    purchased: [false, false, false],
    purchaseUpgrade: function (index) {
      if (!this.purchased[index] && stats.cookieCount >= this.cost[index]) {
        if (
          this.type[index] == "building" && this.buildingIndex !== -1 &&
          buildingUpgrade.level[this.buildingIndex[index]] >= this.requirement[index]
        ) {
          if (buildingUpgrade.name[this.buildingIndex[index]] == "Cursor") {
            stats.cookieCount -= this.cost[index];
            stats.cookiePerClick *= this.bonus[index];
            this.purchased[index] = true;

            updateBuildingUpgrades();
            updateScore();
          } else {
            stats.cookieCount -= this.cost[index];
            buildingUpgrade.perSecond[this.buildingIndex[index]] *= this.bonus[index];
            this.purchased[index] = true;

            updateBuildingUpgrades();
            updateScore();
          }
        } else if (
          this.type[index] == "click" && 
          stats.cookiePerClick >= this.requirement[index]
        ) {
          stats.cookieCount -= this.cost[index];
          stats.cookiePerClick *= this.bonus[index];
          this.purchased[index] = true;

          updateBuildingUpgrades();
          updateScore();
        }
      } else {
        alert(`Not enough cookies! You need ${round(this.cost[index] - stats.cookieCount)} more cookies to buy this powerful upgrade!`);
      }
    }
  }

  let achievement = {
    name: [
      "First Click",
      "First Cookie",
      "First Grandma",
      "First Powerful Upgrade",
      "First Farm",
      "1,000 Cookies",
      "First Mine"
    ],
    description: [
      "Click the cookie for the first time",
      "Get your first cookie",
      "Buy your first grandma",
      "Purchase your first powerful upgrade",
      "Buy your first farm",
      "Get 1,000 cookies",
      "Buy your first mine"
    ],
    image: [
      "assets/cookie.PNG",
      "assets/cookie.PNG",
      "assets/grandma.JPG",
      "assets/reinforced_index_finger.jpg",
      "assets/farm.JPG",
      "assets/cookie.PNG",
      "assets/mine.PNG"
    ],
    type: [
      "click",
      "cookie",
      "building",
      "upgrade",
      "building",
      "cookie",
      "building"
    ],
    reward: [1, 1, 1, null, 1, 1000, 1],
    objectIndex: [-1, -1, 1, 0, 2, -1, 3],
    unlocked: [
      false, 
      false, 
      false, 
      false, 
      false, 
      false,
      false
    ],
    unlockAchievement: function (index) {
      this.unlocked[index] = true;
      updateAchievements();
    }
  }

  function updateCookie() { cookies.textContent = stats.getCookieCount(stats.cookieCount); }
  function updateCookiePerSecond() { cookiePerSecond.textContent = round(stats.getPerSecond()); }

  function updateScore() {
    updateCookie();
    updateCookiePerSecond();
  }

  function randomNumber(min, max) {
    return round(Math.random() * (max - min) + min);
  }

  function clickerCookieBtn(e) {
    stats.cookieCount += stats.cookiePerClick;
    updateScore();

    const floatingNum = document.createElement('div');
    floatingNum.classList.add('floating-number');
    floatingNum.textContent = `+${stats.cookiePerClick}`; // e.g., Becomes + Per Click

    const addNumberMovementClicker = cookieClickerBtn.getBoundingClientRect();
    const duration = 1000;

    const randomX = randomNumber(-10, 10);
    const randomY = randomNumber(-10, 10);

    const position = {
      x: e.clientX + randomX - addNumberMovementClicker.left,
      y: e.clientY + randomY - addNumberMovementClicker.top - cookieClickerBtn.height
    }

    // 2. Position it at the mouse click
    floatingNum.style.left = `${position.x}px`;
    floatingNum.style.top = `${position.y}px`;

    // 3. Append it to the screen
    floatingNumber.appendChild(floatingNum);

    // 4. Remove after animation (usually 1-2 seconds)
    let timeoutId = setTimeout(() => {
      floatingNum.remove();
      clearTimeout(timeoutId);
    }, duration);
  }

  cookieClickerBtn.onclick = (e) => {
    e.preventDefault();
    clickerCookieBtn(e);
  }

  function updateBuildingUpgrades() {
    buildingUpgradeElement.innerHTML = "";
    for (let i = 0; i < buildingUpgrade.name.length; i++) {
      const buildUpg = buildingUpgrade;

      const buildingContainer = document.createElement("div");
      buildingContainer.className = "building-upgrade";

      const sectionLeft = document.createElement("div");
      sectionLeft.className = "section-left";
      
      const buildingImg = document.createElement("img");
      buildingImg.className = "building-image";
      
      buildingImg.src = buildUpg.image[i];
      sectionLeft.appendChild(buildingImg);

      const sectionMiddle = document.createElement("div");
      sectionMiddle.className = "section-middle";
      
      const buildingText = document.createElement("div");
      buildingText.className = "building-text";
      
      const buildingName = document.createElement("div");
      buildingName.className = "building-name";
      buildingName.textContent = buildUpg.name[i];
      
      const buildingCost = document.createElement("div");
      buildingCost.className = "building-cost";
      buildingCost.id = buildUpg.name[i].toLowerCase() + "-cost";
      
      const costSpan = document.createElement("span");
      costSpan.textContent = buildUpg.cost[i];
      
      const cookieImg = document.createElement("img");
      cookieImg.className = "cookie-cost-image";
      cookieImg.src = "assets/cookie.PNG";
      
      buildingCost.appendChild(costSpan);
      buildingCost.appendChild(cookieImg);
      buildingText.appendChild(buildingName);
      buildingText.appendChild(buildingCost);
      sectionMiddle.appendChild(buildingText);

      const sectionRight = document.createElement("div");
      sectionRight.className = "section-right";
      
      const buildingLevel = document.createElement("div");
      buildingLevel.className = "building-level";
      
      buildingLevel.id = buildUpg.name[i].toLowerCase() + "-level";
      buildingLevel.textContent = buildUpg.level[i];
      sectionRight.appendChild(buildingLevel);

      buildingContainer.appendChild(sectionLeft); // Append the Section Left to the buildingContainer
      buildingContainer.appendChild(sectionMiddle); // Append the Section Middle to the buildingContainer
      buildingContainer.appendChild(sectionRight); // Append the Section Right to the buildingContainer
      
      buildingUpgradeElement.appendChild(buildingContainer); // Append Building Container to the DOM (buildingUpgradeElement) with the class of "building-upgrades" instead of "building-upgrade"
      const buildingUpgradeBtn = document.querySelectorAll(".building-upgrade");
      buildingUpgradeBtn.forEach((btn, index) => {
        btn.onclick = () => {
          const arrayIndex = Array.from(buildUpg.name).indexOf(btn.querySelector(".building-name").textContent);
          const isIndex = arrayIndex !== -1 ? arrayIndex : index;
          buildUpg.buyUpgrade(isIndex);
        }
      });
    }
  }

  function updatePowerfulUpgrades() {
    powerfulUpgradeElement.innerHTML = "";
    for (let i = 0; i < powerfulUpgrade.name.length; i++) {
      const buildUpg = buildingUpgrade;
      const powUpg = powerfulUpgrade;
      
      if (!powUpg.purchased[i]) {
        if (
          powUpg.type[i] == "building" && 
          powUpg.buildingIndex !== -1 &&
          buildUpg.level[powUpg.buildingIndex[i]] >= powUpg.requirement[i]
        ) {
          const div = document.createElement("div");
          div.className = "powerful-upgrade";
          div.id = powUpg.name[i];
          
          const img = document.createElement("img");
          img.className = "powerful-image";
          img.src = powUpg.image[i];
          
          div.appendChild(img);
          powerfulUpgradeElement.appendChild(div);
        } else if (
          powUpg.type[i] == "click" && 
          stats.cookiePerClick >= powUpg.requirement[i]
        ) {
          const div = document.createElement("div");
          div.className = "powerful-upgrade";
          div.id = powUpg.name[i];

          const img = document.createElement("img");
          img.className = "powerful-image";
          img.src = powUpg.image[i];

          div.appendChild(img);
          powerfulUpgradeElement.appendChild(div);
        }
      }
      
      const powerfulUpgradeBtn = document.querySelectorAll(".powerful-upgrade");
      powerfulUpgradeBtn.forEach((btn, index) => {
        btn.onclick = () => {
          const arrayIndex = Array.from(powUpg.name).indexOf(btn.id);
          const isIndex = arrayIndex !== -1 ? arrayIndex : index;
          powUpg.purchaseUpgrade(isIndex);
        }
      });
    }
  }

  function updateAchievements() {
    achievementElement.innerHTML = "";
    for (let i = 0; i < achievement.name.length; i++) {
      const ach = achievement;
      const status = ach.unlocked[i] ? "Unlocked" : "Locked";
      
      if (ach.unlocked[i] && status == "Unlocked") {
        const isSmall = ach.name[i] == "First Powerful Upgrade";

        const achDiv = document.createElement("div");
        achDiv.className = "achievement";

        const img = document.createElement("img");
        img.className = "achievement-image";
        img.src = ach.image[i];

        const nameDiv = document.createElement("div");
        nameDiv.className = isSmall ? "achievement-name small" : "achievement-name";
        nameDiv.textContent = ach.name[i];

        const descDiv = document.createElement("div");
        descDiv.className = isSmall ? "achievement-description small" : "achievement-description";
        descDiv.textContent = ach.description[i];

        const statusDiv = document.createElement("div");
        statusDiv.className = "achievement-status";
        statusDiv.textContent = status;

        achDiv.appendChild(img);
        achDiv.appendChild(nameDiv);
        achDiv.appendChild(descDiv);
        achDiv.appendChild(statusDiv);
      
        achievementElement.appendChild(achDiv);
      }
    }
  }

  let fps = 15; // frames per second

  let gameInfo = {
    version: "1.1.1 Beta",
    date: new Date().toLocaleString(),
    author: "https://github.com/giahaotran0820",
    description: "A simple cookie clicker game with upgrades and achievements."
  }

  // Prevent circular references
  function circlicReplacer() {
    const seen = new WeakSet();
    return (key, value) => {
      if (typeof value === "object" && value !== null) {
        if (seen.has(value)) {
          return; // Discord circular references
        }
        seen.add(value); // Add the object to the set of seen objects
      }
      return value;
    }
  }

  function save() {
    const gameData = {
      cookieCount: stats.cookieCount,
      cookiePerClick: stats.cookiePerClick,
      cookiePerSecond: stats.cookiePerSecond,
      buildingUpgradeCost: buildingUpgrade.cost,
      buildingUpgradeLevel: buildingUpgrade.level,
      buildingUpgradePerSecond: buildingUpgrade.perSecond,
      powerfulUpgradePurchased: powerfulUpgrade.purchased,
      achievementUnlocked: achievement.unlocked,
      version: gameInfo.version,
      date: gameInfo.date,
      author: gameInfo.author,
      description: gameInfo.description
    }

    const gameDataJSON = JSON.stringify(gameData, circlicReplacer()); // Convert the game data to a JSON string to be stored in local storage had to add the circlicReplacer function to prevent circular references

    // save the game data to local storage to gameData so that it can be loaded later
    localStorage.setItem("gameData", gameDataJSON);
  }

  async function saveToServer() {
    try {
      const response = await fetch("https://jsonplaceholder.typicode.com/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          title: "Cookie Clicker - Game Data",
          body: localStorage.getItem("gameData"),
          userId: 1
        }),
        mode: "cors",
        cache: "no-cache"
      });

      if (!response.ok) {
        throw new Error("Failed to save game data to the server!");
      }

      const data = await response.json();

      if (data) {
        save();
        if (localStorage.getItem("gameData") !== null) lastSavedText.innerHTML = JSON.parse(localStorage.getItem("gameData")).date + " (Saved)";
      }
    }
    catch (error) {
      console.error(error.message);
    }
  }

  function reset() {
    if (confirm("Are you sure you want to reset your game?")) {
      localStorage.clear();
      location.reload();
    }
  }

  function load() {
    let savedData = JSON.parse(localStorage.getItem("gameData"));
    if (localStorage.getItem("gameData") !== null) {
      if (typeof savedData.cookieCount !== "undefined") stats.cookieCount = savedData.cookieCount;
      if (typeof savedData.cookiePerClick !== "undefined") stats.cookiePerClick = savedData.cookiePerClick;
      if (typeof savedData.cookiePerSecond !== "undefined") stats.cookiePerSecond = savedData.cookiePerSecond;

      // building upgrades cost as an array
      if (typeof savedData.buildingUpgradeCost !== "undefined") {
        for (let i = 0; i < savedData.buildingUpgradeCost.length; i++) {
          buildingUpgrade.cost[i] = savedData.buildingUpgradeCost[i];
        }
      }

      // building upgrades level as an array
      if (typeof savedData.buildingUpgradeLevel !== "undefined") {
        for (let i = 0; i < savedData.buildingUpgradeLevel.length; i++) {
          buildingUpgrade.level[i] = savedData.buildingUpgradeLevel[i];
        }
      }

      // building upgrades per second as an array
      if (typeof savedData.buildingUpgradePerSecond !== "undefined") {
        for (let i = 0; i < savedData.buildingUpgradePerSecond.length; i++) {
          buildingUpgrade.perSecond[i] = savedData.buildingUpgradePerSecond[i];
        }
      }

      // powerful upgrades purchased as an array
      if (typeof savedData.powerfulUpgradePurchased !== "undefined") {
        for (let i = 0; i < savedData.powerfulUpgradePurchased.length; i++) {
          powerfulUpgrade.purchased[i] = savedData.powerfulUpgradePurchased[i];
        }
      }

      // achievement unlocked as an array
      if (typeof savedData.achievementUnlocked !== "undefined") {
        for (let i = 0; i < savedData.achievementUnlocked.length; i++) {
          achievement.unlocked[i] = savedData.achievementUnlocked[i];
        }
      }

      if (typeof savedData.version !== "undefined") gameInfo.version = savedData.version;
      if (typeof savedData.date !== "undefined") gameInfo.date = savedData.date;
      if (typeof savedData.author !== "undefined") gameInfo.author = savedData.author;
      if (typeof savedData.description !== "undefined") gameInfo.description = savedData.description;
    }
  }

  function loadGame() {
    load();
    updateScore();
    updateBuildingUpgrades();
    updatePowerfulUpgrades();
    updateAchievements();
    versionText.textContent = gameInfo.version;
  }

  async function loadToServer() {
    try {
      const response = await fetch("https://jsonplaceholder.typicode.com/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          title: "Cookie Clicker - Game Data",
          body: localStorage.getItem("gameData"),
          userId: 1
        }),
        mode: "cors",
        cache: "no-cache"
      });

      if (!response.ok) {
        throw new Error("Failed to save game data to the server!");
      }

      const data = await response.json();
      
      if (data) {
        loadGame();
        loadStatusText.textContent = "Loaded!";
        const loadedTimeOut = setTimeout(() => { 
          loadStatusText.textContent = "Never";
          clearTimeout(loadedTimeOut);
        }, 2000);
      }
    }
    catch (error) {
      console.error(error.message);
    }
  }

  saveBtn.onclick = () => { saveToServer(); }
  loadBtn.onclick = () => { loadToServer(); }
  resetBtn.onclick = () => { reset(); }

  // Load the game data when the page load
  return {
    init: function () {
      // Add cookies every second based on the cookie per second
      setInterval(() => {
        stats.cookieCount += stats.getPerSecond() / fps;
        updateScore();
      }, (1000 / fps));

      // Save the game data every 10 seconds
      setInterval(() => { saveToServer(); }, 10000);

      // Check for achievements every 1/2 second for Loading and Saving
      setInterval(() => {
        for (let i = 0; i < achievement.name.length; i++) {
          switch (achievement.type[i]) {
            case "click":
              if (stats.cookiePerClick >= achievement.reward[i]) achievement.unlockAchievement(i);
              break;
            case "cookie":
              if (stats.cookieCount >= achievement.reward[i]) achievement.unlockAchievement(i);
              break;
            case "building":
              if (buildingUpgrade.level[achievement.objectIndex[i]] >= achievement.reward[i]) achievement.unlockAchievement(i);
              break;
            case "upgrade":
              if (powerfulUpgrade.purchased[achievement.objectIndex[i]] == true) achievement.unlockAchievement(i);
              break;
          }
        }
        updatePowerfulUpgrades();
      }, 500);

      // load when the page load to server take check if the game data is saved
      loadToServer();
    }
  }
})();

window.onload = () => { Game.init(); }