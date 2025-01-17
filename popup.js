document.getElementById("sortByRune").addEventListener("click", function() {
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      function: sortListings
    });
  });
});

function sortListings() {
  // Call the function from your content.js to sort listings
  alert("Sorting Listings...");
  // Example: You could trigger a function from the content script to start sorting
}
