function getRandomVerseNumber(verses, lastVerseIndex){
    const x = Math.floor((Math.random() * verses.verses.length) + 1);
    if(x == lastVerseIndex){
        getRandomVerseNumber(verses, lastVerseIndex)
    }
    return x
}

async function getRandomVerse(){ //get random verse from json
    //fetch json file
    let verses;
    try {
        const response = await fetch('/verses.json');
        verses = await response.json();
        
        if (verses && verses.verses) {
          console.log("verses length is: " + verses.verses.length);
          console.log(verses.verses);
        } else {
          console.log("Error: JSON data is not structured as expected.");
        }
      } catch (error) {
        console.error("Error fetching JSON data:", error);
      }
    //pick random verse
    let lastVerseIndex
    lastVerseIndex = getRandomVerseNumber(verses, lastVerseIndex);
    let currVerseNumber = verses.verses[lastVerseIndex];
    //call fatchdata and send in verse numbers as parameter

    fetchData(currVerseNumber);


}

async function fetchData(currVerseNumber){//fetch english
    console.log("currVerseNumber in fetch data:" + currVerseNumber)
    if(currVerseNumber === undefined){getRandomVerse();}
    // Split the currVerseNumber into chapter and verse parts
    const [chapterNumber, verseNumber] = currVerseNumber.split(":");
    const encodedChapterNumber = encodeURIComponent(chapterNumber);
    const encodedVerseNumber = encodeURIComponent(verseNumber);
    const url =  `https://quran-com.p.rapidapi.com/quran/translations/131?verse_key=${encodedChapterNumber}%3A${encodedVerseNumber}`;
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': 'd19d1bbdd1mshad2faac6f37714ep1450c1jsn794651fe08c2',
            'X-RapidAPI-Host': 'quran-com.p.rapidapi.com'
        }
    };

    
    let error;//later on used to compare wheather there is eroor or not
    let engText;
    try {
        const response = await fetch(url, options);
        const result = await response.json();//await response

        console.log("result from fetch data: ");
        console.log(result);

        engText = result.translations[0].text;//verse in english
        console.log("translation in fethcdata: "+engText);


    } catch (e) {//error handling
        error = e;
        fetchData(currVerseNumber);
        console.error("Got error :( " + error);
    }
    finally{//if no error caught, set the text
        if(!error){
        console.log("No error!");
        }
    }

    getArabic(currVerseNumber, engText);//featch arabic text for same verse

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
        getArabic(verseKey, englishText);
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
    
    arabText +=  removeSpecialCharacters(arabicText);
    engText += removeHtmlTags(englishText) ;
    const englishElement = document.getElementById("english");
    const arabicElement = document.getElementById("arabic");
    const loadingElement = document.getElementById("loading-msg");
    loadingElement.textContent = "";
    englishElement.textContent = englishText.trim();
    arabicElement.textContent = arabicText.trim(); 
}

function removeHtmlTags(inputText) {
    return inputText.replace(/<[^>]+>/g, ''); // Removes all HTML tags
  }
function removeSpecialCharacters(inputText) {
    return inputText.replace(//g, ''); // Replace the specific character with an empty string
  }

getRandomVerse();
