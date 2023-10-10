function searchBarInit(){
    // newtab.js
document.getElementById('search-button').addEventListener('click', function() {
    const searchInput = document.getElementById('search-input').value;
    if (searchInput) {
      // Open Google search results in a new tab
      chrome.tabs.create({ url: `https://www.google.com/search?q=${encodeURIComponent(searchInput)}` });
    }
  });
}


function getRandomVerse(){
    fetch('./verses.json')
    .then((response) => response.json())
    .then((json) => console.log(json));
}

async function fetchData(){
    const url = 'https://api.quran.com/api/v4/verses/random?language=en&translations=131';
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': 'd19d1bbdd1mshad2faac6f37714ep1450c1jsn794651fe08c2',
            'X-RapidAPI-Host': 'quran-com.p.rapidapi.com'
        }
    };
    try {
        const response = await fetch(url, options);
        const result = await response.json(); // Parse the JSON response
        console.log(result);
        const verseKey = result.verse.verse_key;
        const englishElement = document.getElementById("english");
        let englishText = "";
        englishText += result.verse.translations[0].text;

        getArabic(verseKey, englishText);

    } catch (error) {
        console.error(error);
    }
}


async function getArabic(verseKey, englishText){//get arabic translation of verse
    //use api to get indopak arabic using the chap and verse number
    const [chapterNumber, verseNumber] = verseKey.split(":");
    const encodedChapterNumber = encodeURIComponent(chapterNumber);
    const encodedVerseNumber = encodeURIComponent(verseNumber);
    console.log(encodedChapterNumber)
    const url = `https://quran-com.p.rapidapi.com/quran/verses/indopak?verse_key=${encodedChapterNumber}%3A${encodedVerseNumber}`;
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': 'd19d1bbdd1mshad2faac6f37714ep1450c1jsn794651fe08c2',
            'X-RapidAPI-Host': 'quran-com.p.rapidapi.com'
        }
    };


    let arabicText = "";
    let error;//later on used to compare wheather there is eroor or not
    try {
        const response = await fetch(url, options);
        const result = await response.json();
        console.log(result);
        if (result) {
            arabicText += result.verses[0].text_indopak;//
          } else {
            console.error("Invalid or empty response data or schema mismatch.");
        }

    } catch (e) {
        error = e;
        fetchData();
        console.error(error);
    }finally{//if no error caught, set the text
        if(!error){
            setText(englishText, arabicText);
        }
    }

    console.log(englishText);
}

function setText(englishText, arabicText){//show text
    let arabText = '';
    let engText = '';
    
    arabText += arabicText;
    engText += englishText;
    const englishElement = document.getElementById("english");
    const arabicElement = document.getElementById("arabic");
    const loadingElement = document.getElementById("loading-msg");
    loadingElement.textContent = "";
    englishElement.textContent = englishText.trim();
    arabicElement.textContent = arabicText.trim(); 
}

//searchBarInit();
getRandomVerse();
fetchData();