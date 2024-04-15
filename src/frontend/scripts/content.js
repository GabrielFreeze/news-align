
function insert_data(selector, txt) {
    const placement_DOM = document.querySelector(selector);
    
    // Guard-Clause if DOM is not found
    if (!placement_DOM){
        console.error("DOM ",selection, "not found!")
        return
    } 
    
    const targetElement = document.createElement("p");
    targetElement.textContent = txt;
    
    //TEMP: Use same styling
    placement_DOM.classList.forEach(
        className => targetElement.classList.add(className)
    );
    
    placement_DOM.insertAdjacentElement("afterend", targetElement);
}


function onDataFetch(data) {
    
    if (data['error'] != "") {
        //TODO: Display some error warnings somewhere for the extension
        console.error("Error in fetched data: ", data['error'])
        return
    }
            
    insert_data(selector="#article-head > div > span",
                txt=`Image-Caption Similarity: ${data['data']['img_txt'][0]}`)
}



//Get API data using current URL
let data;
fetch(`http://127.0.0.1:8000/?url=${window.location.href}`)
    .then(res => res.json())
    .then(data => {
        console.log(data)
        onDataFetch(data)
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
