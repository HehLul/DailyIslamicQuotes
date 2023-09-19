async function fetchData(){
    const url = 'https://quran-com.p.rapidapi.com/verses/random?language=en&words=true';
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

        // Check if 'verse' property exists before accessing 'id'
        if (result.verse) {
        const english = document.getElementById("english");
        english.textContent = result.verse.id;
        console.log("Verse ID: " + result.verse.id);
        } else {
        console.error("'verse' property not found in the JSON data");
        }
    } catch (error) {
        console.error(error);
    }
}

fetchData();

