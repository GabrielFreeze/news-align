
function insert_data(selector, txt) {
    const placementDOMs = document.querySelectorAll(selector);
    
    placementDOMs.forEach((placementDOM,i) => {
        const targetElement = document.createElement("p");
        targetElement.textContent = txt[i];

        //TEMP: Use same styling
        placementDOM.classList.forEach(
            className => targetElement.classList.add(className)
        );
    
        placementDOM.insertAdjacentElement("afterend", targetElement);
    });


    // // Guard-Clause if DOM is not found
    // if (!placement_DOM){
    //     console.error("DOM ",selector, "not found!")
    //     return
    // } 
    
    // const targetElement = document.createElement("p");
    // targetElement.textContent = txt;
    
    // //TEMP: Use same styling
    // placement_DOM.classList.forEach(
    //     className => targetElement.classList.add(className)
    // );
    
    // placement_DOM.insertAdjacentElement("afterend", targetElement);
}


function onDataFetch(data) {
    
    for (const css in data['img_txt']) {
        console.log(css)
        insert_data(css, data['img_txt'][css].map(score => `Image-Caption Similarity: ${score.toFixed(2)}`))
    }

}



//Get API data using current URL
let data;
fetch(`http://127.0.0.1:8000/?url=${window.location.href}`)
    .then(res => res.json())
    .then(data => {
        if (data['error'] != "") {
            //TODO: Display some error warnings somewhere for the extension
            console.error("Error in fetched data: ", data['error'])
        } else {
            console.log(data['data'])
            onDataFetch(data['data'])
        }
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });


// if (thumbnail_txt && thumbnail_img) {
    
//     //Insert API data underneath thumbnail image
//     const targetElement = document.createElement("p");

//     console.log(data)

//     targetElement.textContent = `Image-Caption Similarity ${data['img_txt'][0]}`;

//     thumbnail_txt.classList.forEach(
//         className => targetElement.classList.add(className)
//     );

//     thumbnail_txt.insertAdjacentElement("afterend", targetElement);
// }
