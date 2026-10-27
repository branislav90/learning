const sheet = document.styleSheets[0];
sheet.insertRule(".toast { opacity: 0 }", sheet.cssRules.length); // mutate CSSOM
document.documentElement.style.setProperty("--accent", "tomato"); // inline custom property
