/**
 * Cookie Clicker Game - A simple cookie clicker game with upgrades and achievements.
 * @description: A simple cookie clicker game with upgrades and achievements.
 * @version: 1.0.0
 * @date: 2-28-2026
 * @author: https://github.com/giahaotran0820
 * @license: MIT
 */

var Game = (function () {
  const cookies = document.getElementById("cookies");
  const cookieClickerBtn = document.querySelector(".cookie-clicker-img");
  const cookiePerSecond = document.getElementById("cookie-per-second");

  const buildingUpgradeElement = document.querySelector(".building-upgrades");
  const powerfulUpgradeElement = document.querySelector(".powerful-upgrades");
  const achievementElement = document.querySelector(".achievements");

  const saveBtn = document.querySelector(".btn.save");
  const loadBtn = document.querySelector(".btn.load");
  const resetBtn = document.querySelector(".btn.reset");

  const lastSavedText = document.getElementById("last-saved");
  const loadStatusText = document.getElementById("load-status")

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
      let perSecond = 0;
      for (let i = 0; i < buildingUpgrade.perSecond.length; i++) {
        perSecond += buildingUpgrade.perSecond[i] * buildingUpgrade.level[i];
        stats.cookiePerSecond = perSecond;
      }
      return perSecond;
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
    cost: [10, 100, 800, 6000, 23000, 147000],
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
        updateCookie();
        updateCookiePerSecond();
      } else {
        alert(`Not enough cookies! You need ${round(this.cost[index] - stats.cookieCount)} more cookies to buy this building upgrade!`);
      }
    }
  }

  let powerfulUpgrade = {
    name: [
      "Stone Fingers",
      "Iron Fingers",
      "Click Frenzy"
    ],
    image: [
      "assets/cursor.PNG",
      "assets/cursor.PNG",
      "assets/cookie.PNG"
    ],
    type: [
      "building",
      "building",
      "click"
    ],
    description: [
      "Cursors are twice as effecient",
      "Cursors are twice as effecient",
      "Clicking the big cookie per click gives x2 cookie per click"
    ],
    cost: [300, 1000, 500],
    buildingIndex: [0, 0, -1],
    requirement: [1, 5, 1],
    bonus: [2, 2, 2],
    purchased: [false, false, false],
    purchaseUpgrade: function (index) {
      if (!this.purchased[index] && stats.cookieCount >= this.cost[index]) {
        if (
          this.type[index] == "building" && 
          buildingUpgrade.level[this.buildingIndex[index]] >= this.requirement[index]
        ) {
          stats.cookieCount -= this.cost[index];
          buildingUpgrade.perSecond[this.buildingIndex[index]] *= this.bonus[index];
          this.purchased[index] = true;

          updateBuildingUpgrades();
          updateCookie();
          updateCookiePerSecond();
        } else if (
          this.type[index] == "click" && 
          stats.cookiePerClick >= this.requirement[index]
        ) {
          stats.cookieCount -= this.cost[index];
          stats.cookiePerClick *= this.bonus[index];
          this.purchased[index] = true;

          updateBuildingUpgrades();
          updateCookie();
          updateCookiePerSecond();
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
      "First Powerful Upgrade \"Stone Fingers\"",
      "First Farm",
      "1,000 Cookies",
      "First Mine"
    ],
    description: [
      "Click the cookie for the first time",
      "Get your first cookie",
      "Buy your first grandma",
      "Purchase your first powerful upgrade \"Stone Fingers\"",
      "Buy your first farm",
      "Get 1,000 cookies",
      "Buy your first mine"
    ],
    image: [
      "assets/cookie.PNG",
      "assets/cookie.PNG",
      "assets/grandma.JPG",
      "assets/cursor.PNG",
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

  function updateCookie() {
    cookies.innerHTML = stats.getCookieCount(stats.cookieCount);
  }

  function updateCookiePerSecond() {
    cookiePerSecond.innerHTML = round(stats.getPerSecond());
  }

  function randomNumber(min, max) {
    return round(Math.random() * (max - min) + min);
  }

  function clickerCookieBtn(e) {
    stats.cookieCount += stats.cookiePerClick;
    updateCookie();

    const floatingNum = document.createElement('div');
    floatingNum.classList.add('floating-number');
    floatingNum.textContent = `+${stats.cookiePerClick}`; // e.g., Becomes + Per Click

    const addNumberMovementClicker = cookieClickerBtn.getBoundingClientRect();
    const duration = 1000;

    const randomX = randomNumber(-10, 10);
    const randomY = randomNumber(-10, 10);

    const position = {
      x: e.clientX + randomX - addNumberMovementClicker.left,
      y: e.clientY + randomY - addNumberMovementClicker.top
    }

    // 2. Position it at the mouse click
    floatingNum.style.left = `${position.x}px`;
    floatingNum.style.top = `${position.y}px`;

    // 3. Append it to the screen
    cookieClickerBtn.appendChild(floatingNum);

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

      // Replace placeholders with actual values using regex
      const regex = new RegExp("{{([^}]+)}}", "g"); // Matches {{key}}
      const replacerBuildUpgId = (match, key) => {
        switch (key) {
          case "name": return buildUpg.name[i];
          case "cost": return round(buildUpg.cost[i]);
          case "level": return buildUpg.level[i];
          case "image": return buildUpg.image[i];
          case "id": return buildUpg.name[i].toLowerCase().replace(/\s+/g, "-");
        }
        return match;
      }

      buildingUpgradeElement.innerHTML += `
        <div class="building-upgrade">
          <div class="section-left">
            <img class="building-image" src="{{image}}">
          </div>
          <div class="section-middle">
            <div class="building-text">
              <div class="building-name">{{name}}</div>
              <div class="building-cost" id="{{id}}-cost">
                {{cost}}
                <img class="cookie-cost-image" src="assets/cookie.PNG">
              </div>
            </div>
          </div>
          <div class="section-right">
            <div class="building-level" id="{{id}}-level">{{level}}</div>
          </div>
        </div>
      `;

      buildingUpgradeElement.innerHTML = buildingUpgradeElement.innerHTML.replace(regex, replacerBuildUpgId).replace(/\n/g, "");

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

      // Replace placeholders with actual values using regex
      const regex = new RegExp("{{([^}]+)}}", "g"); // Matches {{key}}
      const replacerPowUpgId = (match, key) => {
        switch (key) {
          case "name": return powUpg.name[i];
          case "image": return powUpg.image[i];
        }
        return match;
      }

      if (!powUpg.purchased[i]) {
        if (
          powUpg.type[i] == "building" && 
          buildingUpgrade.level[powUpg.buildingIndex[i]] >= powUpg.requirement[i]
        ) {
          powerfulUpgradeElement.innerHTML += `
            <div class="powerful-upgrade">
              <img class="powerful-image" src="{{image}}">
              <div class="powerful-name">{{name}}</div>
            </div>
          `;
          document.querySelector(".powerful-upgrade").onclick = () => {
            powerfulUpgrade.purchaseUpgrade(i);
          }
        } else if (
          powUpg.type[i] == "click" && 
          stats.cookiePerClick >= powUpg.requirement[i]
        ) {
           powerfulUpgradeElement.innerHTML += `
             <div class="powerful-upgrade">
               <img class="powerful-image" src="{{image}}">
               <div class="powerful-name">{{name}}</div>
             </div>
           `;
        }
      }

      powerfulUpgradeElement.innerHTML = powerfulUpgradeElement.innerHTML.replace(regex, replacerPowUpgId).replace(/\n/g, "");
      const powerfulUpgradeBtn = document.querySelectorAll(".powerful-upgrade");
      powerfulUpgradeBtn.forEach((btn, index) => {
        btn.onclick = () => {
          const powUpgIndex = Array.from(powUpg.name).indexOf(btn.querySelector(".powerful-name").textContent)
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

      // Replace placeholders with actual values using regex
      const regex = new RegExp("{{([^}]+)}}", "g"); // Matches {{key}}
      const replacerAchId = (match, key) => {
        switch (key) {
          case "name": return ach.name[i];
          case "description": return ach.description[i];
          case "image": return ach.image[i];
          case "status": return statusAch;
        }
        return match;
      }

      if (ach.unlocked[i]) {
        if (ach.name[i] !== "First Powerful Upgrade \"Stone Fingers\"") {
          achievementElement.innerHTML += `
            <div class="achievement">
              <img class="achievement-image" src="{{image}}">
              <div class="achievement-name">{{name}}</div>
              <div class="achievement-description">{{description}}</div>
              <div class="achievement-status">{{status}}</div>
            </div>
          `;
        } else {
          achievementElement.innerHTML += `
            <div class="achievement">
              <img class="achievement-image" src="{{image}}">
              <div class="achievement-name small">{{name}}</div>
              <div class="achievement-description small">{{description}}</div>
              <div class="achievement-status">{{status}}</div>
            </div>
          `;
        }
      }
      achievementElement.innerHTML = achievementElement.innerHTML.replace(regex, replacerAchId).replace(/\n/g, "");
    }
  }

  let fps = 10; // frames per second

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
      version: "1.0.0",
      date: new Date().toLocaleString(),
      author: "https://github.com/giahaotran0820",
      description: "A simple cookie clicker game with upgrades and achievements."
    }

    const gameDataJSON = JSON.stringify(gameData, circlicReplacer()); // Convert the game data to a JSON string to be stored in local storage had to add the circlicReplacer function to prevent circular references

    // save the game data to local storage to gameData so that it can be loaded later
    localStorage.setItem("gameData", gameDataJSON);
    if (localStorage.getItem("gameData") !== null) lastSavedText.innerHTML = gameData.date + " (Saved)";
  }

  function saveServer() {
    const gameDataServer = new Promise((resolve, reject) => {
      resolve();
      reject();
    });

    gameDataServer.then(() => {
      save();
      alert("Game data saved to server!");
    }).catch(() => {
      const err = new Error("Failed to save game data to server!");
      alert(err);
      lastSavedText.innerHTML = "Failed";
    });

    // save the game data to the server
    const response = fetch("https://jsonplaceholder.typicode.com/posts", {
      method: "POST",
      body: JSON.stringify(gameDataServer),
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      },
      mode: "cors"
    });

    response.then((res) => {
      if (!res.ok) throw new Error("Failed to save game data to server!");
      return res.json();
    });

    return gameDataServer;
  }

  function saveServerToSetInterval() {
    const gameDataServer = new Promise((resolve, reject) => {
      resolve();
      reject();
    });

    gameDataServer.then(() => {
      save();
    }).catch(() => {
      const err = new Error("Failed to save game data to server!");
      console.error(err);
      lastSavedText.innerHTML = "Failed";
    });

    // save the game data to the server
    const response = fetch("https://jsonplaceholder.typicode.com/posts", {
      method: "POST",
      body: JSON.stringify(gameDataServer),
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      },
      mode: "cors"
    });

    response.then((res) => {
      if (!res.ok) throw new Error("Failed to save game data to server!");
      return res.json();
    });

    return gameDataServer;
  }

  async function saveGameToSetInterval() { await saveServerToSetInterval(); }

  function reset() {
    if (confirm("Are you sure you want to reset your game?")) {
      localStorage.clear();
      location.reload();
    }
  }

  async function saveGame() { await saveServer(); }

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
    }
  }

  function loadServer() {
    const gameDataServer = new Promise((resolve, reject) => {
      resolve();
      reject();
    });

    gameDataServer.then(() => {
      load();
      alert("Game data loaded from server!");
    }).catch(() => {
      const err = new Error("Failed to load game data from server!");
      alert(err);
      loadStatusText.innerHTML = "Failed";
    });

    const response = fetch("https://jsonplaceholder.typicode.com/posts/", {
      method: "POST",
      body: JSON.stringify(gameDataServer),
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      },
      mode: "cors"
    });

    response.then((res) => {
      if (!res.ok) throw new Error("Failed to load game data from server!");
      return res.json();
    });

    return gameDataServer;
  }

  async function loadGame() { await loadServer(); }

  function loadGameToServer() {
    const gameDataServer = new Promise((resolve, reject) => {
      resolve();
      reject();
    });

    gameDataServer.then(() => {
      load();
      loadStatusText.innerHTML = "Loaded!";
    }).catch(() => {
      const err = new Error("Failed to load game data from server!");
      console.error(err);
      loadStatusText.innerHTML = "Failed";
    });

    const response = fetch("https://jsonplaceholder.typicode.com/posts/", {
      method: "POST",
      body: JSON.stringify(gameDataServer),
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      },
      mode: "cors"
    });

    response.then((res) => {
      if (!res.ok) throw new Error("Failed to load game data from server!");
      return res.json();
    });

    return gameDataServer;
  }

  async function loadGameToServerAsync() { await loadGameToServer(); }

  saveBtn.onclick = () => { saveGame(); }
  loadBtn.onclick = () => { loadGame(); }
  resetBtn.onclick = () => { reset(); }

  // Load the game data when the page load
  return {
    init: function () {
      loadGameToServerAsync();
      updateCookie();
      updateCookiePerSecond();
      updateBuildingUpgrades();

      // Add cookies every second based on the cookie per second
      setInterval(() => {
        stats.cookieCount += stats.getPerSecond() / fps;
        updateCookie();
      }, (1000 / fps));

      // Save the game data every 10 seconds
      setInterval(() => { saveGameToSetInterval(); }, 10000);

      // Check for achievements every 1/2 second for Loading and Saving
      setInterval(() => {
        for (let i = 0; i < achievement.name.length; i++) {
          switch (achievement.type[i]) {
            case "click":
              if (stats.cookieCount >= achievement.reward[i]) achievement.unlockAchievement(i);
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

      updatePowerfulUpgrades();
      updateAchievements();
    }
  }
})();

window.onload = () => { Game.init(); }