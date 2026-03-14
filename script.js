/**
 * Cookie Clicker Game - A simple cookie clicker game with upgrades and achievements.
 * @description: A simple cookie clicker game with upgrades and achievements.
 * @version: 1.1.0
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

  let stats = {
    cookieCount: 0,
    cookiePerClick: 1,
    cookiePerSecond: 0,
    getPerSecond: function () {
      this.cookiePerSecond = 0;
      for (let i = 0; i < buildingUpgrade.perSecond.length; i++) {
        this.cookiePerSecond += buildingUpgrade.perSecond[i] * buildingUpgrade.level[i];
      }
      return this.cookiePerSecond;
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
      buildingUpgradeElement.innerHTML += `
        <div class="building-upgrade">
          <div class="section-left">
            <img class="building-image" src="${buildUpg.image[i]}">
          </div>
          <div class="section-middle">
            <div class="building-text">
              <div class="building-name">${buildUpg.name[i]}</div>
              <div class="building-cost" id="${buildUpg.name[i].toLowerCase()}-cost">
                <span>${buildUpg.cost[i]}</span>
                <img class="cookie-cost-image" src="assets/cookie.PNG">
              </div>
            </div>
          </div>
          <div class="section-right">
            <div class="building-level" id="${buildUpg.name[i].toLowerCase()}-level">${buildUpg.level[i]}</div>
          </div>
        </div>
      `;

      const buildingUpgradeBtn = document.querySelectorAll(".building-upgrade");
      buildingUpgradeBtn.forEach((btn, index) => {
        btn.onclick = () => {
          const buildUpgIndex = Array.from(buildUpg.name).indexOf(btn.querySelector(".building-name").textContent);
          const getIndex = buildUpgIndex !== -1 ? buildUpgIndex : index;
          buildingUpgrade.buyUpgrade(getIndex);
        }
      });
    }
  }

  function updatePowerfulUpgrades() {
    powerfulUpgradeElement.innerHTML = "";
    for (let i = 0; i < powerfulUpgrade.name.length; i++) {
      const powUpg = powerfulUpgrade;
      if (!powUpg.purchased[i]) {
        if (
          powUpg.type[i] == "building" && powUpg.buildingIndex !== -1 &&
          buildingUpgrade.level[powUpg.buildingIndex[i]] >= powUpg.requirement[i]
        ) {
          powerfulUpgradeElement.innerHTML += `
            <div class="powerful-upgrade" id="${powUpg.name[i]}">
              <img class="powerful-image" src="${powUpg.image[i]}">
            </div>
          `;
        } else if (
          powUpg.type[i] == "click" && 
          stats.cookiePerClick >= powUpg.requirement[i]
        ) {
           powerfulUpgradeElement.innerHTML += `
             <div class="powerful-upgrade" id="${powUpg.name[i]}">
               <img class="powerful-image" src="${powUpg.image[i]}">
             </div>
           `;
        }
      }
      const powerfulUpgradeBtn = document.querySelectorAll(".powerful-upgrade");
      powerfulUpgradeBtn.forEach((btn, index) => {
        btn.onclick = () => {
          const powUpgIndex = Array.from(powUpg.name).indexOf(btn.id);
          const getIndex = powUpgIndex !== -1 ? powUpgIndex : index;
          powerfulUpgrade.purchaseUpgrade(getIndex);
        }
      });
    }
  }

  function updateAchievements() {
    achievementElement.innerHTML = "";
    for (let i = 0; i < achievement.name.length; i++) {
      const ach = achievement;
      const statusAch = ach.unlocked[i] ? "Unlocked" : "Locked";
      if (ach.unlocked[i]) {
        if (ach.name[i] == "First Powerful Upgrade") {
          achievementElement.innerHTML += `
            <div class="achievement">
              <img class="achievement-image" src="${ach.image[i]}">
              <div class="achievement-name small">${ach.name[i]}</div>
              <div class="achievement-description small">${ach.description[i]}</div>
              <div class="achievement-status">${statusAch}</div>
            </div>
          `;
        } else {
          achievementElement.innerHTML += `
            <div class="achievement">
              <img class="achievement-image" src="${ach.image[i]}">
              <div class="achievement-name">${ach.name[i]}</div>
              <div class="achievement-description">${ach.description[i]}</div>
              <div class="achievement-status">${statusAch}</div>
            </div>
          `;
        } 
      }
    }
  }

  let fps = 15; // frames per second

  let gameInfo = {
    version: "1.1.0",
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
    versionText.innerHTML = gameInfo.version;
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
        loadStatusText.innerHTML = "Loaded!";
        const loadedTimeOut = setTimeout(() => { 
          loadStatusText.innerHTML = "Never";
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