function getImageCSS(selector,id) {
    return `${selector}:hover + div.image-caption-score#${id} {display: block !important;}`
}
function getImageHTML(score,id) {
    return `<div class="image-caption-score" id="${id}">
                <p>Image Caption Similarity: ${score.toFixed(2)}</p>
            </div>`
}
//Code to execute upon a successful API return
function onDataFetch(data) {
    
    var styleElement = document.createElement('style');

    fetch(chrome.runtime.getURL('elements/image_hover/image_hover.css'))
    .then(response => {
        if (!response.ok)
            throw new Error('Failed to fetch file');
        return response.text();
    })
    .then(css => {
        //Setup Global CSS rules
        styleElement.textContent += css

        //Setup CSS rules to display/hide score on image hover
        styleElement.textContent += data['img_txt'].map(
            element => getImageCSS(element['css-selector'],element['id'])
        ).join("\n");
        
        console.log(styleElement)
        document.head.appendChild(styleElement);
    
        //Setup HTML Score Container for every image.
        data['img_txt'].forEach(element => {
            placementDOM = document.querySelector(element['css-selector'])
            parentDOM    = document.querySelector(element['parent-selector'])

            if (placementDOM && parentDOM) {
                //Set the parent container to have relative positioning
                parentDOM.setAttribute('style', 'position:relative !important');
                
                //Insert the HTML as a child of the parentDOm
                placementDOM.insertAdjacentHTML('afterend',getImageHTML(element['score'], element['id']));
            }
            else console.error(`ERROR: Could not find DOM ${element['css-selector']} or DOM ${element['parent-selector']}`)
        });
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
        start_time = performance.now()
        onDataFetch(data['data'])
        console.log(`JavaScript Processing finished in ${performance.now()-start_time}`)
        
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });



