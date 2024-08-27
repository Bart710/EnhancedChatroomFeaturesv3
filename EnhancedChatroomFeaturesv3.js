// ==UserScript==
// @name         Enhanced Chatroom Features (based on Color-Slider by toml12791)
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  An enhanced version of toml12791's Chatroom Color-Slider script. premade messages, and timed messages to UNIT3D tracker chat rooms. Maintains WCAG 2.1 compliance for readability.
// @author       Bart710 (original by toml12791)
// @match        https://infinitylibrary.net/*
// @match        https://blutopia.cc/*
// @match        https://oldtoons.world/*
// @icon         https://i.ibb.co/DL2PsMD/image-removebg-preview.png
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function () {
  "use strict";

  let isBBCodeApplied = false; // Track whether BBCode formatting has been applied to the chat message
  let isButtonGlowing = false; // Track if the button is currently glowing
  let timerInterval;
  let remainingTime = 0;
  let isTimerRunning = false;
  let premadeMessages = JSON.parse(localStorage.getItem("premadeMessages")) || [
    {
      label: "Read the Rules 📜",
      text: "[b][color=#ff0000]📜 Important! Read the RULES! 📜[/color][/b]\n\n[color=#fff]To ensure everyone has a great experience, please check out the [url=https://infinitylibrary.net/pages/1]RULES[/url]. 📝 Following these guidelines helps us all thrive in this community. Thanks for your cooperation![/color]\n\n✨[b][color=#ff0000]Quick Reminder:[/color][/b] [color=#fff]Breaking the rules can result in penalties. Stay informed and respectful to enjoy the best experience possible![/color]",
    },
    {
      label: "Global Freeleech 🌐",
      text: "[b][color=#ff9900]🌐 Global Freeleech Mode is LIVE! 🌐[/color][/b] 🎉\n\n[color=#fff]Boost your ratio and explore tons of new content—Global Freeleech is active until 09/01/24 12:00 PM EST! 💾 Seeding helps everyone, so keep those torrents going strong![/color]\n\n🌟[b][color=#00ff00]Reminder:[/color][/b] [color=#fff]Seeding is essential for our community's success. Enjoy the freeleech and keep those torrents alive![/color]",
    },
    {
      label: "BON Rewards 💰",
      text: "[b][color=#ff00ff]💰 Claim Your 420 BON Reward NOW! 💰[/color][/b] 🎁\n\n[color=#fff]Hey FB friends! Leave a review and like our page to snag a generous 420 BON reward. Your support is crucial for our growth and improvement. 🌟[/color]\n\n⚡[b][color=#ffff00]Limited Time Offer:[/color][/b] [color=#fff]Don’t miss out—grab your bonus points while you can![/color]",
    },
    {
      label: "Community Polls 🗳️",
      text: "[b][color=#00ffcc]🗳️ Share Your Voice in Our Polls! 🗳️[/color][/b] 🗣️\n\n[color=#fff]Participate in our anonymous community polls and help shape the future of our platform! Your feedback is invaluable. 🚀[/color]\n\n🔍[b][color=#ff6600]Get Involved:[/color][/b] [color=#fff]Check out the latest polls and make your opinion count![/color]",
    },
    {
      label: "RARBG Legacy 🏆",
      text: "[b][color=#9933ff]🏆 Building on RARBG's Legacy! 🏆[/color][/b] 🚀\n\n[color=#fff]We’re taking RARBG’s success and enhancing it with faster downloads, a vibrant community, and top-notch features. 🌟[/color]\n\n🌈[b][color=#33ccff]Join the Evolution:[/color][/b] [color=#fff]Be part of our exciting journey and help shape the future of file sharing![/color]",
    },
  ];

  let phrases = [
    {
      label: "🕶️ AFK - Be right back!",
      text: "[b][color=#00ff00]🕶️ AFK - Be right back![/color][/b]",
    },
    {
      label: "👍 Thanks for the upload!",
      text: "[b][color=#00aaff]👍 Thanks for the upload![/color][/b]",
    },
    {
      label: "🌟 Great quality, as always!",
      text: "[b][color=#ffcc00]🌟 Great quality, as always![/color][/b]",
    },
    {
      label: "💪 Seeding for the community!",
      text: "[b][color=#ff0000]💪 Seeding for the community![/color][/b]",
    },
    {
      label: "    🎉 Happy downloading!",
      text: "[b][color=#00ffcc]🎉 Happy downloading![/color][/b]",
    },
    {
      label: "    🔄 Remember to seed, folks!",
      text: "[b][color=#ff6600]🔄 Remember to seed, folks![/color][/b]",
    },
    {
      label: "❤️ Love this tracker!",
      text: "[b][color=#ff33ff]❤️ Love this tracker![/color][/b]",
    },
    {
      label: "🤝 Sharing is caring!",
      text: "[b][color=#00ccff]🤝 Sharing is caring![/color][/b]",
    },
    {
      label: "🌿 Feeling 420-friendly? Enjoy the downloads!",
      text: "[b][color=#00ff99]🌿 Feeling 420-friendly? Enjoy the downloads![/color][/b]",
    },
    {
      label: "🍁 Blaze it and seed it!",
      text: "[b][color=#ff6600]🍁 Blaze it and seed it![/color][/b]",
    },
    {
      label: "😎 Chill vibes and great downloads!",
      text: "[b][color=#00ffcc]😎 Chill vibes and great downloads![/color][/b]",
    },
    {
      label: "🌌 High on content! Thanks for the upload!",
      text: "[b][color=#ff9900]🌌 High on content! Thanks for the upload![/color][/b]",
    },
    {
      label: "💨 Stay lifted and keep those torrents seeding!",
      text: "[b][color=#66ff66]💨 Stay lifted and keep those torrents seeding![/color][/b]",
    },
    {
      label: "🌲 Roll, relax, and enjoy the downloads!",
      text: "[b][color=#ff3399]🌲 Roll, relax, and enjoy the downloads![/color][/b]",
    },
    {
      label: " 🔥 Keep it lit and share the love!",
      text: "[b][color=#ff6666]🔥 Keep it lit and share the love![/color][/b]",
    },
  ];

  function setCursorPosition(inputField, position) {
    if (inputField.setSelectionRange) {
      inputField.focus();
      inputField.setSelectionRange(position, position);
    } else if (inputField.createTextRange) {
      const range = inputField.createTextRange();
      range.collapse(true);
      range.move("character", position);
      range.select();
    }
  }

  function moveToBBCodePosition() {
    const textField = document.querySelector("#chatbox__messages-create");

    if (!textField) return;

    const tags = [
      { start: "[color=", end: "[/color]" },
      { start: "[b]", end: "[/b]" },
      { start: "[i]", end: "[/i]" },
    ];

    const tagPositions = tags.map((tag) => {
      const startPos = textField.value.lastIndexOf(tag.start);
      const endPos = textField.value.indexOf(
        tag.end,
        startPos + tag.start.length
      );

      return { startPos, endPos, tag };
    });

    // Find the most recently added tag
    const mostRecentTag = tagPositions
      .filter((tagPos) => tagPos.startPos !== -1 && tagPos.endPos !== -1)
      .sort((a, b) => b.startPos - a.startPos)[0];

    if (mostRecentTag) {
      const { startPos, endPos, tag } = mostRecentTag;

      if (tag.start === "[color=") {
        // Find the position of the closing bracket for the color tag
        const hexCodeEndPos = textField.value.indexOf(
          "]",
          startPos + tag.start.length
        );
        // The cursor should be placed before the end color tag
        const cursorPosition = endPos; // End position of the closing color tag

        setCursorPosition(textField, cursorPosition);
      } else {
        // For other tags, calculate the end position of text between the tags
        const textBetweenTagsStart = startPos + tag.start.length;
        const textBetweenTagsEnd = endPos;

        // If there is text between the tags, place the cursor at the end of that text
        const cursorPosition = textBetweenTagsEnd;
        setCursorPosition(textField, cursorPosition);
      }
    } else {
      // If no tags, just place the cursor at the end
      setCursorPosition(textField, textField.value.length);
    }
  }

  function createButton(text) {
    const button = document.createElement("button");
    button.textContent = text;
    button.style.padding = "6px 8px";
    button.style.marginLeft = "5px";
    button.style.background = "#333";
    button.style.color = "#bbbbbb";
    button.style.border = "2px outset #444";
    button.style.borderRadius = "6px";
    button.style.cursor = "pointer";
    button.style.fontSize = "14px";
    button.style.textShadow = "1px 1px 2px rgba(0, 0, 0, 0.95)";
    button.style.transition =
      "background 0.15s ease, color 0.15s ease, box-shadow 0.15s ease";

    button.addEventListener("mouseover", () => {
      button.style.background = "linear-gradient(135deg, #444, #313238)";
      button.style.color = "#eee";
    });
    button.addEventListener("mouseout", () => {
      button.style.background = "#333";
      button.style.color = "#bbbbbb";
    });

    button.addEventListener("mousedown", () => {
      button.style.border = "2px inset #444";
    });
    button.addEventListener("mouseup", () => {
      button.style.border = "2px outset #444";
    });

    return button;
  }

  function createDropdown() {
    const dropdown = document.createElement("div");
    dropdown.style.position = "absolute";
    dropdown.style.backgroundColor = "#444";
    dropdown.style.border = "1px solid #666";
    dropdown.style.borderRadius = "3px";
    dropdown.style.padding = "5px";
    dropdown.style.display = "none";
    dropdown.style.zIndex = "1000";
    dropdown.style.width = "250px";
    dropdown.style.flexDirection = "column";
    dropdown.style.gap = "5px";
    dropdown.style.alignItems = "flex-start";
    premadeMessages.forEach((message, index) => {
      const item = document.createElement("div");
      item.textContent = `Message ${index + 1}`;
      item.style.padding = "5px";
      item.style.cursor = "pointer";
      item.style.color = "#eee";
      item.addEventListener("mouseover", () => {
        item.style.backgroundColor = "#555";
      });
      item.addEventListener("mouseout", () => {
        item.style.backgroundColor = "transparent";
      });
      item.addEventListener("click", () => {
        const textField = document.querySelector("#chatbox__messages-create");
        if (textField) {
          textField.value += message;
          textField.focus();
        }
        dropdown.style.display = "none";
      });
      dropdown.appendChild(item);
    });
    updateDropdown(dropdown);
    return dropdown;
  }

  function createPhrasesDropdown() {
    const dropdown = document.createElement("div");
    dropdown.style.position = "absolute";
    dropdown.style.backgroundColor = "#444";
    dropdown.style.border = "1px solid #666";
    dropdown.style.borderRadius = "3px";
    dropdown.style.padding = "5px";
    dropdown.style.display = "none";
    dropdown.style.zIndex = "1000";
    dropdown.style.width = "250px";
    dropdown.style.maxHeight = "300px";
    dropdown.style.overflowY = "auto";

    phrases.forEach((phrase) => {
      const item = document.createElement("div");
      item.textContent = phrase.label;
      item.style.padding = "5px";
      item.style.cursor = "pointer";
      item.style.color = "#eee";
      item.addEventListener("mouseover", () => {
        item.style.backgroundColor = "#555";
      });
      item.addEventListener("mouseout", () => {
        item.style.backgroundColor = "transparent";
      });
      item.addEventListener("click", () => {
        const textField = document.querySelector("#chatbox__messages-create");
        if (textField) {
          textField.value += phrase.text;
          textField.focus();
        }
        dropdown.style.display = "none";
      });
      dropdown.appendChild(item);
    });
    return dropdown;
  }

  function saveMessage() {
    const textField = document.querySelector("#chatbox__messages-create");
    if (textField && textField.value.trim() !== "") {
      const label = prompt("Enter a label for this message:");
      if (label) {
        premadeMessages.push({ label, text: textField.value });
        localStorage.setItem(
          "premadeMessages",
          JSON.stringify(premadeMessages)
        );
        updateDropdown();
      }
    } else {
      alert("Please enter a message before saving.");
    }
  }

  function updateDropdown(dropdown) {
    if (!dropdown) {
      dropdown = document.querySelector("#message-dropdown");
    }
    if (!dropdown) return;

    dropdown.innerHTML = "";
    premadeMessages.forEach((message, index) => {
      const item = document.createElement("div");
      item.textContent = message.label;
      item.addEventListener("click", () => {
        const textField = document.querySelector("#chatbox__messages-create");
        if (textField) {
          textField.value += message.text;
          textField.focus();
        }
        dropdown.style.display = "none";
      });
      dropdown.appendChild(item);
    });
  }

  function startTimer(duration) {
    if (isTimerRunning) {
      clearInterval(timerInterval);
      isTimerRunning = false;
      updateTimerButton();
      return;
    }

    isTimerRunning = true;
    remainingTime = duration;
    updateTimerButton();

    sendMessage();

    timerInterval = setInterval(() => {
      remainingTime--;
      updateTimerButton();

      if (remainingTime <= 0) {
        remainingTime = duration;
        sendMessage();
      }
    }, 1000);
  }

  function updateTimerButton() {
    const timerButton = document.getElementById("timer-button");
    if (timerButton) {
      if (isTimerRunning) {
        timerButton.textContent = `Stop Timer (${remainingTime}s)`;
        timerButton.style.backgroundColor = "#ff4444";
      } else {
        timerButton.textContent = "Set Timer";
        timerButton.style.backgroundColor = "";
      }
    }
  }

  function sendMessage() {
    const textField = document.querySelector("#chatbox__messages-create");
    if (textField && textField.value.trim() !== "") {
      console.log("Attempting to send message:", textField.value);

      const currentMessage = textField.value;

      const enterEvent = new KeyboardEvent("keydown", {
        bubbles: true,
        cancelable: true,
        key: "Enter",
        keyCode: 13,
      });

      textField.dispatchEvent(enterEvent);

      setTimeout(() => {
        textField.value = currentMessage;
      }, 100);
    } else {
      alert("Error: Text field is empty or not found. Timer will be stopped.");
      if (isTimerRunning) {
        clearInterval(timerInterval);
        isTimerRunning = false;
        updateTimerButton();
      }
    }
  }

  function createTimerButton() {
    const timerButton = createButton("Set Timer");
    timerButton.id = "timer-button";
    timerButton.addEventListener("click", (e) => {
      e.preventDefault();
      if (isTimerRunning) {
        startTimer(0);
      } else {
        showTimerDialog();
      }
    });
    return timerButton;
  }

  function showTimerDialog() {
    const dialog = document.createElement("div");
    dialog.style.position = "fixed";
    dialog.style.left = "50%";
    dialog.style.top = "50%";
    dialog.style.transform = "translate(-50%, -50%)";
    dialog.style.backgroundColor = "#333";
    dialog.style.padding = "20px";
    dialog.style.borderRadius = "5px";
    dialog.style.boxShadow = "0 0 10px rgba(0,0,0,0.5)";
    dialog.style.zIndex = "1000";

    const message = document.createElement("p");
    message.textContent = "Choose time unit:";
    message.style.color = "#fff";
    message.style.marginBottom = "10px";

    const minutesButton = createButton("Minutes");
    const secondsButton = createButton("Seconds");

    [minutesButton, secondsButton].forEach((btn) => {
      btn.style.marginRight = "10px";
      btn.addEventListener("click", () => {
        const isMinutes = btn === minutesButton;
        const unit = isMinutes ? "minutes" : "seconds";
        const duration = prompt(`Enter timer duration in ${unit}:`);
        if (duration && !isNaN(duration)) {
          const durationInSeconds = isMinutes
            ? parseInt(duration) * 60
            : parseInt(duration);
          startTimer(durationInSeconds);
        }
        document.body.removeChild(dialog);
      });
    });

    dialog.appendChild(message);
    dialog.appendChild(minutesButton);
    dialog.appendChild(secondsButton);
    document.body.appendChild(dialog);
  }

  function createGifButton() {
    const GIF_SIZE = 200;
    const gifButton = createButton("GIF");
    const gifDropdown = document.createElement("div");
    gifDropdown.style.display = "none";
    gifDropdown.style.position = "absolute";
    gifDropdown.style.backgroundColor = "#333";
    gifDropdown.style.border = "1px solid #555";
    gifDropdown.style.borderRadius = "3px";
    gifDropdown.style.padding = "5px";
    gifDropdown.style.zIndex = "1000";
    gifDropdown.style.maxHeight = "300px";
    gifDropdown.style.overflowY = "auto";
    gifDropdown.style.width = "500px";
    gifDropdown.style.flexWrap = "wrap";
    gifDropdown.style.justifyContent = "space-between";
    gifDropdown.style.transform = "translate(-300px, 10px)";

    const customGifButton = createButton("+");
    customGifButton.style.width = "50px";
    customGifButton.style.height = "50px";
    customGifButton.style.margin = "5px";
    customGifButton.style.fontSize = "24px";
    customGifButton.style.display = "flex";
    customGifButton.style.alignItems = "center";
    customGifButton.style.justifyContent = "center";
    customGifButton.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      const gifUrl = prompt("Enter GIF URL:");
      if (gifUrl) {
        insertGif(gifUrl);
      }
    });
    gifDropdown.appendChild(customGifButton);

    const gifList = [
      "https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExM2VlYmtleDg5OTd4cmhjbWg4ZnZjdDBsZW5tNTF3b3B2NjluamhpOCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/qhqwBvxNoQSUo/giphy.gif",
      "https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExMnJ0ZTJpZjlpbmQzbm12dHVnYmxhMWlrNWl4dHZ3eDNuN3JncjQyYSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/26n6C7xRVAWxt3XNu/giphy.gif",
      "https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExeWJjMTN4ZzNzenphMDQxcHJiZW92cHhuajg4bDNpYTZpZTd5bmE4byZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/kWpkJJ8ttNkfEhD9Mt/giphy.gif",
      "https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExcmtndTYxcmZmZmxhNndnb3h6amdkbnI3NGVsODhtNmtidGo0bHR3NSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/MZOeErgMGAI5q/giphy.gif",
      "https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExbWg3aDhoMG1ibnphNmk5aW1mczJ1azVqeGl5ZWxteDMzbGhnMzFnbCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/JQdJqZ2yuXXJsURxKI/giphy.gif",
      "https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExaGhiYWpvemNiNmk5aHY1aHo3a3cyNjlpbWRpaWVpbmhzeTE2OGd4aiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/iUrRjZHDqEIHMC7KG4/giphy.gif",
      "https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExZ2l1NnhqaWczdXhiOWs1bzRyYmFyMXJsdzNrbTR1YWJxeWU4N3FldCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/VG1tHuNQhF0KhHSaEe/giphy.gif",
      "https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExM2w5c3BheDNqZmk3cnc0czJ0ZW1uNmVpYWZ4dTRjOTZmdnV3dzlqYSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/IbBvjWxe6MMw1mGJ0W/giphy.gif",
      "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExYWU3Nmh3M3Bjam5xanl4OXFneHJoOGh2enIycHdlc3J3enZiYW1qcSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/uQHtUvva9Qljy/giphy.gif",
      "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExYWU3Nmh3M3Bjam5xanl4OXFneHJoOGh2enIycHdlc3J3enZiYW1qcSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/J5nI6P9kzZ7itOSTCJ/giphy.gif",
      "https://media.giphy.com/media/0V85ElBvr4n6tqfaAJ/giphy.gif?cid=790b7611ae76hw3pcjnqjyx9qgxrh8hvzr2pwesrwzvbamjq&ep=v1_gifs_search&rid=giphy.gif&ct=g",
      "https://media.giphy.com/media/5v4hlDwdIKurAURmKW/giphy.gif?cid=790b7611ae76hw3pcjnqjyx9qgxrh8hvzr2pwesrwzvbamjq&ep=v1_gifs_search&rid=giphy.gif&ct=g",
      "https://media.giphy.com/media/TENJY4CegAgh2/giphy.gif?cid=790b7611ae76hw3pcjnqjyx9qgxrh8hvzr2pwesrwzvbamjq&ep=v1_gifs_search&rid=giphy.gif&ct=g",
      "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExMncxcnAyZTlid2puMm5oZWhwbm55dmd1dXY4NnBwZzJsYWozdmQ1biZlcD12MV9naWZzX3NlYXJjaCZjdD1n/pO4UHglOY2vII/giphy.gif",
      "https://media.giphy.com/media/cgW5iwX0e37qg/giphy.gif?cid=790b76112w1rp2e9bwjn2nhehpnnyvguuv86ppg2laj3vd5n&ep=v1_gifs_search&rid=giphy.gif&ct=g",
      "https://media.giphy.com/media/Ga2QjY24XSSha/giphy.gif?cid=790b76112w1rp2e9bwjn2nhehpnnyvguuv86ppg2laj3vd5n&ep=v1_gifs_search&rid=giphy.gif&ct=g",
      "https://media.giphy.com/media/LwB6RLPZlxT0Y/giphy.gif?cid=790b76112w1rp2e9bwjn2nhehpnnyvguuv86ppg2laj3vd5n&ep=v1_gifs_search&rid=giphy.gif&ct=g",
      "https://media.giphy.com/media/lUQxdO6Y7Vmx2/giphy.gif?cid=790b76112w1rp2e9bwjn2nhehpnnyvguuv86ppg2laj3vd5n&ep=v1_gifs_search&rid=giphy.gif&ct=g",
      "https://media.giphy.com/media/f31DK1KpGsyMU/giphy.gif?cid=790b76112w1rp2e9bwjn2nhehpnnyvguuv86ppg2laj3vd5n&ep=v1_gifs_search&rid=giphy.gif&ct=g",
      "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExdmI0eXBxYnowZjRrZzF4eGl4ZTQzeG5ldnFibmxvMThsdWhzb2d1byZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/SS8CqDu20rYuNJcBDf/giphy.gif",
      "https://media.giphy.com/media/l0HlGkNWJbGSm24Te/giphy.gif?cid=790b7611drou3f84zlo0cu5yjoiep1huymfvcjx4ewu61nj1&ep=v1_gifs_search&rid=giphy.gif&ct=g",
      "https://media.giphy.com/media/xIBJDxVKgGvuINP7W0/giphy.gif?cid=790b7611drou3f84zlo0cu5yjoiep1huymfvcjx4ewu61nj1&ep=v1_gifs_search&rid=giphy.gif&ct=g",
      "https://media.giphy.com/media/KeABNFoNacLf2/giphy.gif?cid=790b7611drou3f84zlo0cu5yjoiep1huymfvcjx4ewu61nj1&ep=v1_gifs_search&rid=giphy.gif&ct=g",
      "https://media.giphy.com/media/AJa3b8vBhNDMs/giphy.gif?cid=790b7611drou3f84zlo0cu5yjoiep1huymfvcjx4ewu61nj1&ep=v1_gifs_search&rid=giphy.gif&ct=g",
      "https://media.giphy.com/media/RIk4N0D3xn7G0/giphy.gif?cid=ecf05e479sks8l2lo4335ormj2g4tid0iht653ei2mtzmqnb&ep=v1_gifs_search&rid=giphy.gif&ct=g",
      "https://media.giphy.com/media/kfNWiWkSIpeDu/giphy.gif?cid=ecf05e479sks8l2lo4335ormj2g4tid0iht653ei2mtzmqnb&ep=v1_gifs_search&rid=giphy.gif&ct=g",
      "https://media.giphy.com/media/vu5IHbOBSa1aw/giphy.gif?cid=ecf05e479sks8l2lo4335ormj2g4tid0iht653ei2mtzmqnb&ep=v1_gifs_search&rid=giphy.gif&ct=g",
      "https://media.giphy.com/media/pTzAlZVOKI3ZK/giphy.gif?cid=ecf05e47deswmhxg4c40cnvlba4j5n9prbzgp63d7l0mvna1&ep=v1_gifs_search&rid=giphy.gif&ct=g",
      "https://media.giphy.com/media/E925PHfSIiUXC/giphy.gif?cid=790b7611crfyi8np9wp8wzomtmbfahyhrlahgffsubqmkfka&ep=v1_gifs_search&rid=giphy.gif&ct=g",
      "https://media.giphy.com/media/Q7EzrGOFtQcKDTGigE/giphy.gif?cid=790b7611crfyi8np9wp8wzomtmbfahyhrlahgffsubqmkfka&ep=v1_gifs_search&rid=giphy.gif&ct=g",
      "https://media.giphy.com/media/vguUexif2CZ8xuwgw9/giphy.gif?cid=790b7611crfyi8np9wp8wzomtmbfahyhrlahgffsubqmkfka&ep=v1_gifs_search&rid=giphy.gif&ct=g",
      "https://media.giphy.com/media/SGkuuxIwQezUuplHEg/giphy.gif?cid=790b7611crfyi8np9wp8wzomtmbfahyhrlahgffsubqmkfka&ep=v1_gifs_search&rid=giphy.gif&ct=g",
      "https://media.giphy.com/media/5UwMDARI6OjP388Sbv/giphy.gif?cid=790b7611crfyi8np9wp8wzomtmbfahyhrlahgffsubqmkfka&ep=v1_gifs_search&rid=giphy.gif&ct=g",
      "https://media.giphy.com/media/10LNj580n9OmiI/giphy.gif?cid=ecf05e47j7btxsxt9bbfw626y2d10rm4cenatg2e0yual7qz&ep=v1_gifs_search&rid=giphy.gif&ct=g",
      "https://media.giphy.com/media/HlKxgLJXMasiA/giphy.gif?cid=ecf05e4794m96b22qrp2rv69vjcu5vhknd4wwepovnzibyjk&ep=v1_gifs_related&rid=giphy.gif&ct=g",
      "https://media.giphy.com/media/l2QDLzE4eb3SfPWpO/giphy.gif?cid=ecf05e47eoa4yh7v4kaj1cifcry5wh8eroqvfra4r1fxlab6&ep=v1_gifs_related&rid=giphy.gif&ct=g",
      "https://media.giphy.com/media/im8fCOPSIrHyHts4qR/giphy.gif?cid=ecf05e47eoa4yh7v4kaj1cifcry5wh8eroqvfra4r1fxlab6&ep=v1_gifs_related&rid=giphy.gif&ct=g",
      "https://media.giphy.com/media/oj9YpRSRZxmYFvmaWt/giphy.gif?cid=ecf05e47zxprl9cj9b8q0k4cw4qwu1ddmfeoyn5qn0y0zzvw&ep=v1_gifs_related&rid=giphy.gif&ct=g",
      "https://media.giphy.com/media/3o6wO1h0Naac9CGtj2/giphy.gif?cid=790b7611z9rv2dchoy46hh1hsejx3usge6jf6bdumesehfrz&ep=v1_gifs_search&rid=giphy.gif&ct=g",
      "https://media.giphy.com/media/DKvw9IJ57pn9K/giphy.gif?cid=790b7611z9rv2dchoy46hh1hsejx3usge6jf6bdumesehfrz&ep=v1_gifs_search&rid=giphy.gif&ct=g",
      "https://media.giphy.com/media/3o6wO1nlX9tiL0xWx2/giphy.gif?cid=ecf05e47k6fd652bvxsxpe2g5oe46rhnzwyrc5l2qdizhbvp&ep=v1_gifs_search&rid=giphy.gif&ct=g",
      "https://media.giphy.com/media/3o6wNI8lFrgqBZ1756/giphy.gif?cid=ecf05e47k6fd652bvxsxpe2g5oe46rhnzwyrc5l2qdizhbvp&ep=v1_gifs_search&rid=giphy.gif&ct=g",
      "https://media.giphy.com/media/cbDOuTHqLjWsXaJrXU/giphy.gif?cid=ecf05e47vhd1ao0e3sqvwd2d8pd8onmy6qgovvndqn8zgc95&ep=v1_gifs_search&rid=giphy.gif&ct=g",
      "https://media.giphy.com/media/xT3i14Ddnbl75cEN4A/giphy.gif?cid=ecf05e47asfy92xd9bmgyty6ptzetgmjdmkdo8yhapzambyo&ep=v1_gifs_search&rid=giphy.gif&ct=g",
      "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExdHU1MWZsdnZxMnpzZnVnMjdhN2tocTFvd3pnZjBjNHA2cDh1a2gxNyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/yOhgNO9YsmdsQ/giphy.gif",
      "https://media.giphy.com/media/rjZii4RTL6I0M/giphy.gif?cid=790b7611tu51flvvq2zsfug27a7khq1owzgf0c4p6p8ukh17&ep=v1_gifs_search&rid=giphy.gif&ct=g",
      "https://media.giphy.com/media/jmrK3GlXPr5UA/giphy.gif?cid=790b7611tu51flvvq2zsfug27a7khq1owzgf0c4p6p8ukh17&ep=v1_gifs_search&rid=giphy.gif&ct=g",
      "https://media.giphy.com/media/koPkNVkQAh6py/giphy.gif?cid=790b7611tu51flvvq2zsfug27a7khq1owzgf0c4p6p8ukh17&ep=v1_gifs_search&rid=giphy.gif&ct=g",
      "https://media.giphy.com/media/KhlVSyjsbx18A/giphy.gif?cid=790b7611tu51flvvq2zsfug27a7khq1owzgf0c4p6p8ukh17&ep=v1_gifs_search&rid=giphy.gif&ct=g",
      "https://media.giphy.com/media/MEjt8VY4MksOosuMGu/giphy.gif?cid=ecf05e476hgkij5bfu49mmwzjg12u8pdhihln97cucp7qbg7&ep=v1_gifs_search&rid=giphy.gif&ct=g",
      "https://media.giphy.com/media/i7vxmJ4rjSkcE/giphy.gif?cid=ecf05e476hgkij5bfu49mmwzjg12u8pdhihln97cucp7qbg7&ep=v1_gifs_search&rid=giphy.gif&ct=g",
      "https://media.giphy.com/media/loAnHAy04UviE/giphy.gif?cid=ecf05e476hgkij5bfu49mmwzjg12u8pdhihln97cucp7qbg7&ep=v1_gifs_search&rid=giphy.gif&ct=g",
      "https://media.giphy.com/media/tyaz764xc4KEo/giphy.gif?cid=ecf05e47ctq0ltpv6rpdxf064rr07puub5h04rxrernjl8o1&ep=v1_gifs_search&rid=giphy.gif&ct=g",
      "https://media.giphy.com/media/KltLBiM8R0JwY/giphy.gif?cid=ecf05e479he7xz2mp2o0v43x0tgrkbbtbt9xhsjuvwbkwdwr&ep=v1_gifs_search&rid=giphy.gif&ct=g",
      "https://media.giphy.com/media/W1eM3WYzKPUxW/giphy.gif?cid=ecf05e479he7xz2mp2o0v43x0tgrkbbtbt9xhsjuvwbkwdwr&ep=v1_gifs_search&rid=giphy.gif&ct=g",
      "https://media.giphy.com/media/12ibtoxVcdyTWo/giphy.gif?cid=ecf05e479he7xz2mp2o0v43x0tgrkbbtbt9xhsjuvwbkwdwr&ep=v1_gifs_search&rid=giphy.gif&ct=g",
      "https://media.giphy.com/media/EaqnPTHabTPXdzhvee/giphy.gif?cid=ecf05e47gic13dupgvlyy4xk66rncpduf6ywkl5rdv0fa6kj&ep=v1_gifs_search&rid=giphy.gif&ct=g",
      "https://media.giphy.com/media/CWIRshquAN3BIEFW4a/giphy.gif?cid=ecf05e47gic13dupgvlyy4xk66rncpduf6ywkl5rdv0fa6kj&ep=v1_gifs_search&rid=giphy.gif&ct=g",
      "https://media.giphy.com/media/dvj1WRbJ7e0pkf8Bvm/giphy.gif?cid=ecf05e47y61iuh96tp8rbzyuhijy8shiqftze8x6pcps9evy&ep=v1_gifs_search&rid=giphy.gif&ct=g",
      "https://media.giphy.com/media/17h8tCUFCl5tX6Hjw7/giphy.gif?cid=ecf05e47y61iuh96tp8rbzyuhijy8shiqftze8x6pcps9evy&ep=v1_gifs_search&rid=giphy.gif&ct=g",
      "https://media.giphy.com/media/KyVmJm8DH7ofiPiydR/giphy.gif?cid=ecf05e47y61iuh96tp8rbzyuhijy8shiqftze8x6pcps9evy&ep=v1_gifs_search&rid=giphy.gif&ct=g",
      "https://media.giphy.com/media/F2zYI71L8HiI8/giphy.gif?cid=ecf05e47kcg908v17kpdn01fh4q1f2vs33kqnei1wc5k9cr5&ep=v1_gifs_search&rid=giphy.gif&ct=g",
      "https://media.giphy.com/media/YZeZBarIW1lZe/giphy.gif?cid=ecf05e476ub8pg2hfaupwxzle3i3nd3p8pr5ked754gdptbl&ep=v1_gifs_search&rid=giphy.gif&ct=g",
      "https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExY2hiMWExNWhxd3ZrMWswZGdjYjNleW0yejQ5emp6YnloNGhyNzBqaSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/UVFmWkFrIkCSQ4zsEj/giphy-downsized-large.gif",
      "https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExenZqNW03dnh0aTV1b3libDgzYWZkMjl2dDI3dmUzZnd0OHhyY2NhbCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/8y2KrOe7rmgtyyMjG4/giphy.gif",
      "https://media.giphy.com/media/KGNL7HE6aqkIzol70u/giphy.gif?cid=ecf05e474znc2ian6jsudvpzo8qfahicd5dezzyejcf2dpry&ep=v1_gifs_related&rid=giphy.gif&ct=g",
      "https://media.giphy.com/media/WUBm1NPSJJpcPO7Q1L/giphy.gif?cid=ecf05e474znc2ian6jsudvpzo8qfahicd5dezzyejcf2dpry&ep=v1_gifs_related&rid=giphy.gif&ct=g",
      "https://media.giphy.com/media/WSr6pOoA7xMVNJM4ue/giphy.gif?cid=ecf05e479wnus7soik2cy9kufu1gvanyk1zly4doqnufd3oi&ep=v1_gifs_related&rid=giphy.gif&ct=g",
      "https://media.giphy.com/media/JTUnwSctyAlSfnlmuY/giphy.gif?cid=ecf05e479wnus7soik2cy9kufu1gvanyk1zly4doqnufd3oi&ep=v1_gifs_related&rid=giphy.gif&ct=g",
    ];
    function insertAndSendGif(url) {
      const textField = document.querySelector("#chatbox__messages-create");
      if (textField) {
        textField.value = `[img=${GIF_SIZE}]${url}[/img]`;
        sendMessage();
      }
      gifDropdown.style.display = "none";
    }

    function sendMessage() {
      const textField = document.querySelector("#chatbox__messages-create");
      if (textField && textField.value.trim() !== "") {
        const enterEvent = new KeyboardEvent("keydown", {
          bubbles: true,
          cancelable: true,
          key: "Enter",
          keyCode: 13,
        });
        textField.dispatchEvent(enterEvent);
      }
    }

    gifList.forEach((url) => {
      const gifItem = document.createElement("div");
      gifItem.style.cursor = "pointer";
      gifItem.style.margin = "5px";
      gifItem.style.width = "80px";
      gifItem.style.height = "80px";

      const gifPreview = document.createElement("img");
      gifPreview.src = url;
      gifPreview.alt = "GIF";
      gifPreview.style.width = "100%";
      gifPreview.style.height = "100%";
      gifPreview.style.objectFit = "cover";
      gifPreview.style.borderRadius = "3px";

      gifItem.appendChild(gifPreview);

      gifItem.addEventListener("mouseover", () => {
        gifItem.style.opacity = "0.8";
      });
      gifItem.addEventListener("mouseout", () => {
        gifItem.style.opacity = "1";
      });
      gifItem.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        insertAndSendGif(url);
      });
      gifDropdown.appendChild(gifItem);
    });

    gifButton.appendChild(gifDropdown);
    gifButton.addEventListener("click", (e) => {
      e.preventDefault();
      gifDropdown.style.display =
        gifDropdown.style.display === "none" ? "flex" : "none";
    });

    document.addEventListener("click", (e) => {
      if (!gifButton.contains(e.target)) {
        gifDropdown.style.display = "none";
      }
    });

    return gifButton;
  }

  function createEmojiButton() {
    const emojiButton = createButton("Emoji");
    const emojiList = [
      "😀",
      "😂",
      "😍",
      "🤔",
      "👍",
      "👎",
      "🎉",
      "🔥",
      "❤️",
      "💯",
      "👽",
      "🛸",
      "👻",
      "🧟",
      "🚀",
      "🛠️",
      "🎮",
      "🦄",
      "🌈",
      "🎩",
      "🕵️",
      "🤖",
      "👾",
      "💣",
      "🔮",
      "🌌",
      "🚁",
      "🌋",
    ];

    const emojiMenu = document.createElement("div");
    emojiMenu.style.display = "none";
    emojiMenu.style.position = "absolute";
    emojiMenu.style.backgroundColor = "#333";
    emojiMenu.style.border = "1px solid #555";
    emojiMenu.style.borderRadius = "3px";
    emojiMenu.style.padding = "5px";
    emojiMenu.style.zIndex = "1000";
    emojiMenu.style.width = "250px";
    emojiMenu.style.transform = "translate(-100px, 10px)";
    emojiMenu.style.fontSize = "20px";

    emojiList.forEach((emoji) => {
      const emojiSpan = document.createElement("span");
      emojiSpan.textContent = emoji;
      emojiSpan.style.cursor = "pointer";
      emojiSpan.style.padding = "2px";
      emojiSpan.addEventListener("click", (e) => {
        e.preventDefault(); // Prevent form submission
        e.stopPropagation(); // Prevent event from bubbling up
        const textField = document.querySelector("#chatbox__messages-create");
        if (textField) {
          textField.value += emoji;
          updatePreview();
          emojiMenu.style.display = "none";
        }
      });
      emojiMenu.appendChild(emojiSpan);
    });

    emojiButton.appendChild(emojiMenu);
    emojiButton.addEventListener("click", (e) => {
      e.preventDefault(); // Prevent form submission
      e.stopPropagation();
      emojiMenu.style.display =
        emojiMenu.style.display === "none" ? "block" : "none";
    });

    document.addEventListener("click", () => {
      emojiMenu.style.display = "none";
    });

    return emojiButton;
  }

  function addElements() {
    if (
      document.getElementById("my-custom-button") &&
      document.getElementById("my-custom-slider")
    ) {
      return;
    }

    // Selects the chatbox element using a specific CSS selector. If the chatbox element is not found, it logs an error message and exits the function.
    const chatbox = document.querySelector("#chatbody > div > form > p");
    if (!chatbox) {
      console.error("Chatbox element not found.");
      return;
    }
    // Creates a `div` container element and styles it with flex display, centered alignment, a 10px gap between items, and a 5px top margin.
    const container = document.createElement("div");
    container.style.display = "flex";
    container.style.alignItems = "center";
    container.style.gap = "10px";
    container.style.marginTop = "5px";

    // Creates a `div` element for containing checkboxes, and styles it with flex display, centered alignment, and a 5px gap between items.
    const checkboxContainer = document.createElement("div");
    checkboxContainer.style.display = "flex";
    checkboxContainer.style.alignItems = "center";
    checkboxContainer.style.gap = "5px";

    // Creates checkbox for bold formatting, assigns it an ID, and hides the default checkbox appearance.
    const boldCheckbox = document.createElement("input");
    boldCheckbox.type = "checkbox";
    boldCheckbox.id = "bold-checkbox";
    boldCheckbox.style.display = "none";

    // Creates a label element for the bold checkbox, sets its `for` attribute, styles it with relative positioning, a pointer cursor, and a light gray color.
    const boldLabel = document.createElement("label");
    boldLabel.htmlFor = "bold-checkbox";
    boldLabel.style.position = "relative";
    boldLabel.style.cursor = "pointer";
    boldLabel.style.color = "#e0e0e0";

    // Creates checkbox for italics formatting, assigns it an ID, and hides the default checkbox appearance.
    const italicsCheckbox = document.createElement("input");
    italicsCheckbox.type = "checkbox";
    italicsCheckbox.id = "italics-checkbox";
    italicsCheckbox.style.display = "none"; // Hide the default checkbox

    // Creates a label element for the italics checkbox, sets its `for` attribute, styles it with relative positioning, a pointer cursor, and a light gray color.
    const italicsLabel = document.createElement("label");
    italicsLabel.htmlFor = "italics-checkbox";
    italicsLabel.style.position = "relative";
    italicsLabel.style.cursor = "pointer";
    italicsLabel.style.color = "#e0e0e0";
    italicsLabel.style.fontStyle = "italic";

    // Appends the bold and italics checkboxes and their corresponding labels to the checkbox container.
    checkboxContainer.appendChild(boldCheckbox);
    checkboxContainer.appendChild(boldLabel);
    checkboxContainer.appendChild(italicsCheckbox);
    checkboxContainer.appendChild(italicsLabel);

    // Selects the chat input field element using a specific CSS selector and assigns it to a variable.
    const messageInputField = document.querySelector(
      "#chatbox__messages-create"
    );

    boldCheckbox.addEventListener("change", () => {
      // Adds an event listener to the bold checkbox that triggers when its checked state changes.
      button.style.fontWeight = boldCheckbox.checked ? "bold" : "normal"; // Updates the button's font weight to 'bold' if the bold checkbox is checked, otherwise sets it to 'normal'.

      // Sets focus to textfield after the bold checkbox state changes.
      if (messageInputField) {
        messageInputField.focus();
        updateFormatting();
        moveToBBCodePosition(); // Move cursor after changing bold state.
      }
    });
    italicsCheckbox.addEventListener("change", () => {
      // Adds an event listener to the italic checkbox that triggers when its checked state changes.
      button.style.fontStyle = italicsCheckbox.checked ? "italic" : "normal"; // Updates the button's font weight to 'italic' if the italic checkbox is checked, otherwise sets it to 'normal'.

      // Sets focus to textfield after the italics checkbox state changes.
      if (messageInputField) {
        messageInputField.focus();
        updateFormatting();
        moveToBBCodePosition(); // Move cursor after changing italics state.
      }
    });

    // Creates a button element with specific visual properties.
    const button = document.createElement("button");
    button.id = "my-custom-button";
    button.type = "button";
    button.style.padding = "6px 0px";
    button.style.marginLeft = "5px";
    button.style.background = "#333";
    button.style.color = "#bbbbbb";
    button.style.border = "2px outset #444";
    button.style.borderRadius = "6px";
    button.style.cursor = "pointer";
    button.style.fontSize = "14px";
    button.style.textShadow = "1px 1px 2px rgba(0, 0, 0, 0.95)";
    button.style.width = "100px";
    button.style.fontWeight = "normal";
    button.style.fontStyle = "normal";
    button.textContent = "Adjust Slider";
    button.style.transition =
      "background 0.15s ease, color 0.15s ease, box-shadow 0.15s ease";

    // // Appends the created button element to the body of the document or desired container
    document.body.appendChild(button);

    // Add mousedown event listener to change border style when button is pressed
    button.addEventListener("mousedown", function () {
      button.style.border = "2px inset #444";
    });

    // Add mouseup event listener to revert border style when button is released
    button.addEventListener("mouseup", function () {
      button.style.border = "2px outset #444";
    });

    // Add event listener for the slider
    const mySlider = document.getElementById("my-custom-slider");
    if (mySlider) {
      mySlider.addEventListener("input", () => {
        if (button.textContent === "Adjust Slider") {
          button.textContent = "Apply Color"; // Change button text when slider is touched
        }
      });
    }
    button.addEventListener("mouseover", () => {
      if (!isButtonGlowing) {
        button.style.background = "linear-gradient(135deg, #444, #313238)";
        button.style.color = "#eee";
      }
    });
    button.addEventListener("mouseout", () => {
      if (!isButtonGlowing) {
        button.style.background = "#333";
        button.style.color = "#bbbbbb";
      }
    });
    button.addEventListener("click", function () {
      const sliderValue = document.getElementById("my-custom-slider").value;
      const color = getColorFromSliderValue(sliderValue);
      const textField = document.querySelector("#chatbox__messages-create");
      const isBold = document.getElementById("bold-checkbox").checked;
      const isItalic = document.getElementById("italics-checkbox").checked;

      if (textField) {
        let existingText = textField.value;

        // Remove existing BBCode if already applied
        if (isBBCodeApplied) {
          existingText = existingText.replace(
            /\[color=[^\]]+\](.*?)\[\/color\]/g,
            "$1"
          );
        }

        // Apply new BBCode
        if (!isBBCodeApplied) {
          existingText = `[color=${color}]${existingText}[/color]`;
        }

        textField.value = existingText;
        isBBCodeApplied = !isBBCodeApplied;

        // Update button text with transition
        button.textContent = isBBCodeApplied ? "Remove Color" : "Apply Color";

        // Update button text styling
        button.style.fontWeight = isBold ? "bold" : "normal";
        button.style.fontStyle = isItalic ? "italic" : "normal";

        // Move cursor to the desired position
        moveToBBCodePosition();
      }
    });

    const saveMessageButton = createButton("Save message");
    saveMessageButton.addEventListener("click", (e) => {
      e.preventDefault();
      saveMessage();
    });

    const messageButton = createButton("Messages");
    const dropdown = createDropdown();
    dropdown.id = "message-dropdown";
    messageButton.style.position = "relative";
    messageButton.appendChild(dropdown);
    messageButton.addEventListener("click", (e) => {
      e.preventDefault();
      dropdown.style.display =
        dropdown.style.display === "none" ? "flex" : "none";
      dropdown.style.top = messageButton.offsetHeight + "px";
      dropdown.style.left = "0";
    });

    const phrasesButton = createButton("Phrases");
    const phrasesDropdown = createPhrasesDropdown();
    phrasesDropdown.id = "phrases-dropdown";
    phrasesButton.style.position = "relative";
    phrasesButton.appendChild(phrasesDropdown);
    phrasesButton.addEventListener("click", (e) => {
      e.preventDefault();
      phrasesDropdown.style.display =
        phrasesDropdown.style.display === "none" ? "block" : "none";
      phrasesDropdown.style.top = phrasesButton.offsetHeight + "px";
      phrasesDropdown.style.left = "0";
    });

    const gifButton = createGifButton();
    const emojiButton = createEmojiButton();

    const timerButton = createTimerButton();

    document.addEventListener("click", (e) => {
      if (!messageButton.contains(e.target)) {
        dropdown.style.display = "none";
      }
    });

    document.addEventListener("click", (e) => {
      if (!phrasesButton.contains(e.target)) {
        phrasesDropdown.style.display = "none";
      }
    });

    // Prevent default context menu on right-click for the button
    button.addEventListener("contextmenu", function (event) {
      event.preventDefault();
    });

    // Prevent default context menu on right-click for bold and italics labels
    boldLabel.addEventListener("contextmenu", function (event) {
      event.preventDefault();
    });

    italicsLabel.addEventListener("contextmenu", function (event) {
      event.preventDefault();
    });

    // Add keydown event listener to uncheck checkboxes on Enter or Backspace key press
    const textField = document.querySelector("#chatbox__messages-create");
    if (textField) {
      textField.addEventListener("keydown", function (event) {
        // Check if the pressed key is either Enter or Backspace
        if (event.key === "Enter" || event.key === "Backspace") {
          document.getElementById("bold-checkbox").checked = false;
          document.getElementById("italics-checkbox").checked = false;
          button.classList.remove("glowing");
          button.classList.add("default");
          button.style.boxShadow = initialGlow;
          button.style.color = "#bbbbbb";
          button.style.fontWeight = "normal";
          button.style.fontStyle = "normal";
          isButtonGlowing = false;
          isBBCodeApplied = false; // Ensure this is reset
          updateButtonText("Adjust Slider");
        }
      });
    }

    // Slider visual properties
    const slider = document.createElement("input");
    slider.id = "my-custom-slider";
    slider.type = "range";
    slider.min = "0";
    slider.max = "99";
    slider.value = localStorage.getItem("sliderValue") || "50";
    slider.style.webkitAppearance = "none";
    slider.style.width = "90px";
    slider.style.height = "4px";
    slider.style.marginLeft = "5px"; // Add left margin
    slider.style.backgroundColor = "#8a8a8b";
    slider.style.cursor = "default";
    slider.style.borderRadius = "3px";
    slider.style.outline = "inset";
    slider.style.boxShadow = "0px 1px 4px rgba(0, 0, 0, 0.7)";
    slider.style.position = "relative"; // or 'absolute', 'fixed', 'sticky' depending on your layout needs
    slider.style.zIndex = "10"; // Adjust z-index value as needed

    // Function to focus the text field if it's not already focused
    function focusTextField() {
      const textField = document.querySelector("#chatbox__messages-create"); // Renamed selector for text field
      if (textField && document.activeElement !== textField) {
        textField.focus();
      }
    }
    slider.addEventListener("input", () => {
      const color = getColorFromSliderValue(slider.value);
      const textField = document.querySelector("#chatbox__messages-create");
      const isBold = document.getElementById("bold-checkbox").checked;
      const isItalic = document.getElementById("italics-checkbox").checked;

      if (textField && isBBCodeApplied) {
        let existingText = textField.value;

        // Update BBCode with new color
        existingText = existingText.replace(
          /\[color=[^\]]+\](.*?)\[\/color\]/g,
          `[color=${color}]$1[/color]`
        );
        textField.value = existingText;

        // Update button glow to reflect the new color
        updateButtonGlow(button, slider.value);
      }
      // Call the function to focus the text field and move the cursor
      focusTextField();
      moveToBBCodePosition(); // Move cursor to the correct position
    });
    // Prevent default context menu on right-click
    slider.addEventListener("contextmenu", (event) => {
      event.preventDefault();
    });
    // Initial glow set to 0 so it's not visible until the slider is adjusted
    const initialGlow = "0 0 0 rgba(0, 0, 0, 0)";
    button.style.boxShadow = initialGlow;

    slider.addEventListener("input", () => {
      const sliderValue = slider.value;
      updateButtonGlow(button, sliderValue);
      localStorage.setItem("sliderValue", sliderValue);

      if (!isBBCodeApplied) {
        updateButtonText("Apply Color");
      }
      // Call the function to focus the text field
      focusTextField();
    });
    // Function to update button text
    function updateButtonText(text) {
      button.textContent = text;
    }
    // Function to convert HSL to HEX
    function hslToHex(h, s, l) {
      s /= 100;
      l /= 100;

      const a = s * Math.min(l, 1 - l);
      const f = (n, k = (n + h / 30) % 12) =>
        l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return `#${(0 | (255 * f(0))).toString(16).padStart(2, "0")}${(
        0 |
        (255 * f(8))
      )
        .toString(16)
        .padStart(2, "0")}${(0 | (255 * f(4))).toString(16).padStart(2, "0")}`;
    }
    // Function to calculate contrast ratio
    function getContrastRatio(color1, color2) {
      function luminance(hex) {
        const rgb = parseInt(hex.slice(1), 16);
        const r = ((rgb >> 16) & 0xff) / 255;
        const g = ((rgb >> 8) & 0xff) / 255;
        const b = ((rgb >> 0) & 0xff) / 255;
        const a = [r, g, b].map((c) =>
          c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
        );
        return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
      }
      const lum1 = luminance(color1);
      const lum2 = luminance(color2);
      const ratio =
        (Math.max(lum1, lum2) + 0.05) / (Math.min(lum1, lum2) + 0.05);
      return ratio;
    }
    // Function to generate colors for a background with the HEX value #373737
    function generateRainbowHexColors(numColors) {
      const colors = [];
      const background = "#373737";

      for (let i = 0; i < numColors; i++) {
        const hue = (i / numColors) * 360;
        const color = hslToHex(hue, 100, 60);

        // Check contrast ratio
        const contrastRatio = getContrastRatio(color, background);

        // Ensure compliance
        if (contrastRatio >= 4.5) {
          colors.push(color);
        } else {
          // Adjust lightness if not compliant
          const adjustedColor = hslToHex(hue, 100, 70); // Increase lightness
          colors.push(adjustedColor);
        }
      }

      return colors;
    }
    // Generate 50 rainbow colors
    const rainbowColorsHex = generateRainbowHexColors(50);

    // Apply the colors to your slider
    function getColorFromSliderValue(value) {
      const index = Math.floor(value / (100 / rainbowColorsHex.length));
      return rainbowColorsHex[index];
    }
    // Log the generated colors for verification
    console.log(rainbowColorsHex);

    // Causes the button and its text to glow once the slider has been adjusted
    function updateButtonGlow(button, value) {
      const color = getColorFromSliderValue(value);
      button.style.boxShadow = `0 0 3px ${color}`;
      button.style.color = color;
      isButtonGlowing = true; // Set the glow state
    }
    const chatInputField = document.querySelector("#chatbox__messages-create");
    if (chatInputField) {
      chatInputField.addEventListener("input", function () {
        if (chatInputField.value.trim() === "") {
          // If the text field is empty, reset the button to 'Apply Color'
          button.textContent = "Apply Color";
          isBBCodeApplied = false;
          localStorage.removeItem("sliderValue"); // Optional: clear saved slider value
        }
      });
    }
    function createStyleSheet(id, styles) {
      const style = document.createElement("style");
      style.id = id;
      style.type = "text/css";
      style.innerText = styles;
      document.head.appendChild(style);
    }

    // This is what makes the slider thumb look nice
    const sliderStyle = `
              #${slider.id}::-webkit-slider-thumb {
              -webkit-appearance: none;
              appearance: none;
              width: 14px;
              height: 14px;
              background: linear-gradient(135deg, #2595e7, #4068a3); /* Blue gradient */
              border: 2px outset #6f93c9; /* Blue border */
              border-radius: 50%;
              cursor: pointer;
              transition: background 0.3s, box-shadow 0.3s, border 0.3s; /* Transition for all relevant properties */
              position: relative; /* Ensures z-index takes effect */
              z-index: 10; /* Adjust as needed */
      }
              #${slider.id}::-webkit-slider-thumb:active {
              background: linear-gradient(135deg, #4068a3, #5da5d9); /* Lighter gradient when active */
              box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.9); /* Enhanced shadow when active */
              border: 2px inset #4068a3; /* Inset border when active */
      }
              #${slider.id}::-webkit-slider-thumb:hover {
              box-shadow: 0px 2px 3px rgba(0, 0, 0, 0.9); /* Slight shadow on hover */
      }

              #${slider.id}::-moz-range-thumb {
              width: 17px;
              height: 17px;
              background: linear-gradient(135deg, #e0e0e0, #b0b0b0); /* Gray gradient */
              border: 2px solid #333; /* Dark border */
              border-radius: 50%;
              cursor: pointer;
      }
              #${slider.id}::-moz-range-thumb:active {
              background: linear-gradient(135deg, #2196f3, #4caf50); /* Green gradient when active */
              box-shadow: 0 0 8px rgba(0, 0, 0, 0.4); /* Light shadow when active */
      }
              #${slider.id}::-moz-range-thumb:hover {
              box-shadow: 0 0 4px rgba(0, 0, 0, 0.2); /* Slight shadow on hover */
      }

              #${slider.id}::-ms-thumb {
              width: 17px;
              height: 17px;
              background: linear-gradient(135deg, #e0e0e0, #b0b0b0); /* Gray gradient */
              border: 2px solid #333; /* Dark border */
              border-radius: 50%;
              cursor: pointer;
      }
              #${slider.id}::-ms-thumb:active {
              background: linear-gradient(135deg, #2196f3, #4caf50); /* Green gradient when active */
              box-shadow: 0 0 7px rgba(0, 0, 0, 0.4); /* Light shadow when active */
      }
              #${slider.id}::-ms-thumb:hover {
              box-shadow: 0 0 4px rgba(0, 0, 0, 0.2); /* Slight shadow on hover */
      }
    `;

    // This is what makes the checkbox look nice
    const checkboxStyle = `
              #bold-checkbox + label::before,
              #italics-checkbox + label::before {
              content: '';
              display: inline-flex;
              align-items: center;
              justify-content: center;
              width: 20px;
              height: 20px;
              background: #333;
              border: 2px outset #444;
              border-radius: 4px;
              vertical-align: middle;
              margin-right: 0px;
              margin-bottom: 2px;
              margin-left: 7px;
              position: relative;
              font-size: 14px;
              font-weight: bold;
              color: #8a8a8a;
              text-align: center;
              padding-bottom: 1px;
              text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.95);

      }
              /* Apply the text for the 'B' and 'I' indicators */
              #bold-checkbox + label::before {
              content: 'B';
      }
              #italics-checkbox + label::before {
              content: 'I';
      }
              /* Styles for checked state */
              #bold-checkbox:checked + label::before,
              #italics-checkbox:checked + label::before {
              background: #3e593d; /* Green background when checked */
              border-color: #4caf50; /* Green border when checked */
              color: #fff; /* White text color when checked */
              text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8); /* Slightly more pronounced text shadow on hover for unchecked state */
              box-shadow: 1px 1px 2px rgba(0, 0, 0, 0.75); /* Enhanced box shadow when checked */
      }
              /* Hover effects */
              #bold-checkbox:not(:checked) + label:hover::before,
              #italics-checkbox:not(:checked) + label:hover::before {
              background: linear-gradient(135deg, #444, #313238); /* Gradient background on hover for unchecked state */
              border-color: #555; /* Lighter border color on hover for unchecked state */
              color: #fff; /* White text color on hover for unchecked state */
              text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8); /* Slightly more pronounced text shadow on hover for unchecked state */

      }
              /* Border switch on mouse down (active state) */
              #bold-checkbox:active + label::before,
              #italics-checkbox:active + label::before {
              border-style: inset; /* Switch to inset border on mouse down */
              background: #2a2a2a; /* Darker background when active */
      }

              /* Optional: Switch back to outset border on mouse up */
              #bold-checkbox:not(:active) + label::before,
              #italics-checkbox:not(:active) + label::before {
             border-style: outset; /* Ensure outset border when not active */
      }
    `;

    // Apply styles
    createStyleSheet("slider-style", sliderStyle);
    createStyleSheet("checkbox-style", checkboxStyle);

    function updateFormatting() {
      const textField = document.querySelector("#chatbox__messages-create");
      const isBold = document.getElementById("bold-checkbox").checked;
      const isItalic = document.getElementById("italics-checkbox").checked;

      if (textField) {
        let existingText = textField.value;

        // Remove existing BBCode formatting
        existingText = existingText.replace(/\[b\](.*?)\[\/b\]/g, "$1");
        existingText = existingText.replace(/\[i\](.*?)\[\/i\]/g, "$1");

        // Apply new BBCode formatting based on checkbox states
        if (isBold) {
          existingText = `[b]${existingText}[/b]`;
        }
        if (isItalic) {
          existingText = `[i]${existingText}[/i]`;
        }

        textField.value = existingText;
      }
    }

    // Creates and injects the CSS styles into the page for the checkboxes
    const checkboxStyleSheet = document.createElement("style");
    checkboxStyleSheet.type = "text/css";
    checkboxStyleSheet.innerText = checkboxStyle;
    document.head.appendChild(checkboxStyleSheet);
    // CSS class for text transition
    const transitionStyle = `
              .text-transition {
              transition: opacity 0.3s ease;
              opacity: 0;
          }
          `;
    // Creates and injects the CSS styles into the page for the text transition
    const transitionStyleSheet = document.createElement("style");
    transitionStyleSheet.type = "text/css";
    transitionStyleSheet.innerText = transitionStyle;
    document.head.appendChild(transitionStyleSheet);
    container.appendChild(checkboxContainer);
    container.appendChild(button);
    container.appendChild(slider);
    container.appendChild(saveMessageButton);
    container.appendChild(messageButton);
    container.appendChild(phrasesButton);
    container.appendChild(gifButton);
    container.appendChild(emojiButton);
    container.appendChild(timerButton);
    chatbox.appendChild(container);
  }
  const observerAddElements = new MutationObserver((mutationsList) => {
    for (const mutation of mutationsList) {
      if (mutation.type === "childList") {
        addElements();
      }
    }
  });

  observerAddElements.observe(document.body, {
    childList: true,
    subtree: true,
  });

  addElements();
})();
