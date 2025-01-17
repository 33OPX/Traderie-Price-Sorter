(function() {
  // Select the divs containing price and listing data
  const listingSelector = '.listing-product-info';

  // Define the runes from Um and above, with each rune's value representing its hierarchy
  const runeValues = {
    Um: 16,
    Mal: 17,
    Ist: 18,
    Gul: 19,
    Vex: 20,
    Ohm: 21,
    Sur: 22,
    Ber: 23,
    Jah: 24,
    Cham: 25,
    Zod: 26
  };

  // Create a function to get the sorted listings
  function getSortedListings() {
    const listings = Array.from(document.querySelectorAll(listingSelector));
    const runeCounts = {};

    // Loop through each listing
    listings.forEach(listing => {
      // Extract the link for the current listing
      const linkElement = listing.querySelector('a.sc-iGgWBj.hCbfch.listing-name.selling-listing');
      const listingUrl = linkElement ? 'https://traderie.com' + linkElement.getAttribute('href') : null;

      // Extract the prices
      const priceElements = Array.from(listing.querySelectorAll('.price-line a.sc-iGgWBj.hCbfch'));
      const prices = priceElements
        .map(price => price.textContent.trim())
        .filter(price => /(\d+)\s*X\s*(Jah|Ber|Ist|Gul|Ohm|Vex|Mal|Pul|Lem|Fal|Um|Ko|Lo|Dol|Sol|Ort|Ral|Tal|Ith|Nef|Tir|Eld|El)\s*Rune/.test(price)); // Only keep valid prices

      // For each valid price, increment the count for the corresponding rune
      prices.forEach(price => {
        const match = price.match(/(\d+)\s*X\s*(Jah|Ber|Ist|Gul|Ohm|Vex|Mal|Pul|Lem|Fal|Um|Ko|Lo|Dol|Sol|Ort|Ral|Tal|Ith|Nef|Tir|Eld|El)\s*Rune/);
        const rune = match && match[2];
        if (rune && runeValues[rune]) {
          if (!runeCounts[rune]) runeCounts[rune] = [];
          runeCounts[rune].push({ url: listingUrl, price: parsePrice(price), prices: prices });
        }
      });
    });

    return runeCounts;
  }

  // Function to parse the price from a string like "18 X Ber Rune"
  function parsePrice(price) {
    const match = price.match(/(\d+)\s*X\s*(Jah|Ber|Ist|Gul|Ohm|Vex|Mal|Pul|Lem|Fal|Um|Ko|Lo|Dol|Sol|Ort|Ral|Tal|Ith|Nef|Tir|Eld|El)\s*Rune/);
    if (match) {
      const quantity = parseInt(match[1], 10);
      switch (match[2]) {
        case 'Ber': return quantity * 100; 
        case 'Ist': return quantity * 50;
        case 'Jah': return quantity * 150;
        case 'Gul': return quantity * 70;
        case 'Ohm': return quantity * 120;
        case 'Vex': return quantity * 110;
        case 'Mal': return quantity * 90;
        case 'Pul': return quantity * 30;
        case 'Lem': return quantity * 20;
        case 'Fal': return quantity * 15;
        case 'Um': return quantity * 10;
        case 'Ko': return quantity * 8;
        case 'Lo': return quantity * 12;
        case 'Dol': return quantity * 5;
        case 'Sol': return quantity * 4;
        case 'Ort': return quantity * 3;
        case 'Ral': return quantity * 2;
        case 'Tal': return quantity * 1;
        case 'Ith': return quantity * 0.5;
        case 'Nef': return quantity * 0.3;
        case 'Tir': return quantity * 0.2;
        case 'Eld': return quantity * 0.1;
        case 'El': return quantity * 0.05;
        default: return 0;
      }
    }
    return 0;
  }

  // Create the container to display the sorted listings
  function createListingContainer() {
    const runeCounts = getSortedListings();

    // Create a container for listings
    const container = document.createElement('div');
    container.className = 'listing-container';
    container.style.position = 'fixed';
    container.style.top = '20px';
    container.style.right = '20px';
    container.style.backgroundColor = '#333';  // Dark background color
    container.style.color = '#fff';  // White text
    container.style.border = '1px solid #444';  // Slightly lighter border
    container.style.padding = '10px';
    container.style.zIndex = 9999;
    container.style.maxWidth = '300px';
    container.style.overflowY = 'auto';
    container.style.maxHeight = '80vh';
    container.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.2)';
    container.style.borderRadius = '8px';  // Rounded corners for a smoother look

    // Title
    const title = document.createElement('h3');
    title.textContent = `Sorted Listings by Price`;
    title.style.fontSize = '16px';
    title.style.marginBottom = '10px';
    container.appendChild(title);

    // Refresh Button
    const refreshButton = document.createElement('button');
    refreshButton.textContent = 'Refresh Listings';
    refreshButton.style.backgroundColor = '#4CAF50';  // Green color for refresh
    refreshButton.style.color = '#fff';
    refreshButton.style.padding = '8px';
    refreshButton.style.border = 'none';
    refreshButton.style.borderRadius = '5px';
    refreshButton.style.cursor = 'pointer';
    refreshButton.style.marginBottom = '10px';
    refreshButton.style.width = '100%';  // Make the button span the full width
    refreshButton.addEventListener('click', function() {
      // Remove the current container and recreate it
      document.body.removeChild(container);
      createListingContainer();  // Re-run the script to reload and display sorted listings
    });
    container.appendChild(refreshButton);

    // Create buttons for each rune with the count of listings
    Object.keys(runeValues).forEach(rune => {
      if (runeCounts[rune] && runeCounts[rune].length > 0) {  // Only show buttons for runes that have listings
        const runeButton = document.createElement('button');
        runeButton.textContent = `${rune} (${runeCounts[rune].length})`;
        runeButton.style.backgroundColor = '#58a6ff';
        runeButton.style.color = '#fff';
        runeButton.style.padding = '8px';
        runeButton.style.marginBottom = '10px';
        runeButton.style.border = 'none';
        runeButton.style.cursor = 'pointer';
        runeButton.style.borderRadius = '5px';
        runeButton.style.width = '100%';  // Make the button span the full width
        runeButton.addEventListener('click', function() {
          // Clear the current listings and display only the selected rune's listings
          displayFilteredListings(rune);
        });
        container.appendChild(runeButton);
      }
    });

    // Append the container to the body of the webpage
    document.body.appendChild(container);
  }

  // Display filtered listings based on the selected rune
  function displayFilteredListings(rune) {
    const container = document.querySelector('.listing-container');
    container.innerHTML = '';  // Clear the current container

    const title = document.createElement('h3');
    title.textContent = `Listings for ${rune}`;
    title.style.fontSize = '16px';
    title.style.marginBottom = '10px';
    container.appendChild(title);

    // Refresh Button
    const refreshButton = document.createElement('button');
    refreshButton.textContent = 'Back to All Listings';
    refreshButton.style.backgroundColor = '#4CAF50';  // Green color for refresh
    refreshButton.style.color = '#fff';
    refreshButton.style.padding = '8px';
    refreshButton.style.border = 'none';
    refreshButton.style.borderRadius = '5px';
    refreshButton.style.cursor = 'pointer';
    refreshButton.style.marginBottom = '10px';
    refreshButton.style.width = '100%';  // Make the button span the full width
    refreshButton.addEventListener('click', function() {
      // Remove the current container and recreate it with all listings
      document.body.removeChild(container);
      createListingContainer();  // Re-run the script to display all listings again
    });
    container.appendChild(refreshButton);

    // Get listings for the selected rune and display them, sorted by price
    const filteredListings = getSortedListings()[rune];
    filteredListings.sort((a, b) => a.price - b.price); // Sort by price (lowest to highest)

    filteredListings.forEach(listing => {
      const listingElement = document.createElement('p');
      listingElement.innerHTML = `<a href="${listing.url}" target="_blank" style="color: #58a6ff; text-decoration: none;">${listing.url}</a> - ${listing.prices.join(' OR ')}`;
      listingElement.style.marginBottom = '8px';
      container.appendChild(listingElement);
    });
  }

  // Create the listing container and display the listings
  createListingContainer();
})();
