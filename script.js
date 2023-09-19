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


        // Assuming you have an element with the id "arabic" for Arabic text
        const arabicElement = document.getElementById("arabic");

        // Assuming you have an element with the id "english" for English text
        const englishElement = document.getElementById("english");

        // Initialize variables to store Arabic and English text
        let arabicText = "";
        let englishText = "";

        // Loop through the words array and concatenate Arabic and English text
        result.verse.words.forEach(word => {
            const parser = new DOMParser();
            const decodedText = parser.parseFromString(word.transliteration.text, "text/html").body.textContent;
            //arabicElement.innerHTML += word.transliteration.text + " ";
            arabicText += decodedText + " ";
            englishText += word.translation.text + " ";
        });

        // Set the content of the HTML elements
        arabicElement.textContent = arabicText.trim(); // trim to remove extra spaces
        englishElement.textContent = englishText.trim();

    } catch (error) {
        console.error(error);
    }
}

fetchData();

