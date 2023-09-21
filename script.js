async function fetchData(){
    const url = 'https://api.quran.com/api/v4/verses/random?language=en&words=true&translations=ar';
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
        console.log(verseKey);

        const englishElement = document.getElementById("english");
        let englishText = "";
        result.verse.words.forEach(word => {
            englishText += word.translation.text + " ";
        });
        englishElement.textContent = englishText.trim();

        getArabic(verseKey, englishText);

    } catch (error) {
        console.error(error);
    }
}


async function getArabic(verseKey, englishText){
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

    try {
        const response = await fetch(url, options);
        const result = await response.json();
        console.log(result);

        let arabicText = "";
        if (result) {
            arabicText += result.verses[0].text_indopak;
            //console.log("Arabic Text (Uthmani Simple):", arabicText);
          } else {
            console.error("Invalid or empty response data or schema mismatch.");
        }

         const arabicElement = document.getElementById("arabic");
         arabicElement.textContent = arabicText.trim(); 



    } catch (error) {
        fetchData();
        console.error(error);
    }

    setText(englishText, arabicText);
}

function setText(englishText, arabicText){
    const englishElement = document.getElementById("english");
    const arabicElement = document.getElementById("arabic");
    englishElement.textContent = englishText.trim();
    arabicElement.textContent = arabicText.trim(); 
}

fetchData();