


// function setEventListeners(dict) {
    
    //     for (const selector in dict) {
        //         if (dict.hasOwnProperty.call(dict, selector)) {
            //             dict[selector].forEach((i,score) => { //Display/Hide score on selector hover
            //                 document.querySelector(selector).addEventListener('mouseenter', () => displayScore(selector,score,i));
            //                 document.querySelector(selector).addEventListener('mouseleave', () => hideScore   (selector,score,i));             
            //             });
            //         }
            //     }
            // }
            
            
            
            
            // function hideScore(selector,i) {
                //     if (customElement = document.querySelectorAll(`${selector} .image-caption-score`)[i])
                //         customElement.remove();
                // }
                
                
                
//TODO: CSS selector is not working for images that are not thumbnail
//TODO: ToM bug where every hover repeats sript size causing bloat,

function getImageCSS(selector,id) {
    return `${selector}:hover + h3.image-caption-score#${id} {display: block;}`
}
function getImageHTML(score,id) {
    return `<h3 class="image-caption-score" id="${id}">Image Caption Similarity: ${score}</h3>`
}
//Code to execute upon a successful API return
function onDataFetch(data) {    
    
    var styleElement = document.createElement('style');

    //Setup Global CSS rules
    styleElement.textContent += "h3.image-caption-score {display: none;color:black}\n"

    //Setup CSS rules to display/hide score on image hover
    styleElement.textContent += data['img_txt'].map(
        element => getImageCSS(element['css-selector'],element['id'])
    ).join("\n");
    
    console.log(styleElement)
    document.head.appendChild(styleElement);

    //Setup HTML Score Container for every image.
    data['img_txt'].forEach(element => {
        if (placementDOM = document.querySelector(element['css-selector'])) {
            placementDOM.insertAdjacentHTML('afterend',getImageHTML(element['score'], element['id']));
        }
    });
}




//Get API data using current URL
let data;
fetch(`http://127.0.0.1:8000/?url=${window.location.href}`)
    .then(res => res.json())
    .then(data => {

        if (data['error'] != "") {
            throw new Error(`Error while processing data: ${data['error']}`)
        } 
        console.log(data['data'])
        onDataFetch(data['data'])
        
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });



