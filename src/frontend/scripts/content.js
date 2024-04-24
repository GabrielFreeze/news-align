function getImageHTML(score,id) {
    return `<div class="image-caption-score" id="${id}">
                <p>Image Caption Similarity: ${score.toFixed(2)}</p>
            </div>`
}

function setDisplayOnHover(hoverSelectorID, displaySelectorID) {
    
    const hoverElement   = document.getElementById(hoverSelectorID);
    const displayElement = document.getElementById(displaySelectorID);

    //Display+Hide rules for hoverElement
    hoverElement.addEventListener('mouseenter', () => {
        displayElement.style.display = 'block';
    });
    hoverElement.addEventListener('mouseleave', () => {
        displayElement.style.display = 'none';
    });

    //Display+Hide rules for displayElement (to avoid flickering)
    displayElement.addEventListener('mouseenter', () => {
        displayElement.style.display = 'block';
    });
    displayElement.addEventListener('mouseleave', () => {
        displayElement.style.display = 'none';
    });
    

    
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
        document.head.appendChild(styleElement);
        
        for (const key in data['img_txt']) {
            document.querySelectorAll(key).forEach((imageDOM,i) => {
                                
                /*Assign a unique ID to the image (and their parent) elements.
                This is so we can target them with CSS rules*/

                //Get values pointed to by key
                selector_id = data['img_txt'][key][i]['id']
                score = data['img_txt'][key][i]['score']
                
                //Update image id
                imageDOM.id = `${selector_id}-${i}`

                //Update container id
                containerDOM = imageDOM.parentNode

                //Setup HTML Score Container for every image.
                //Set the container to have relative positioning
                containerDOM.setAttribute('style', 'position:relative !important');
                
                //Insert the HTML as a child of the containerDOM
                score_id = `score-${imageDOM.id}`
                imageDOM.insertAdjacentHTML('afterend',getImageHTML(score, score_id));

                //Add EventListeners to display score when hovering on imageDOM
                setDisplayOnHover(hoverSelectorID=imageDOM.id,displaySelectorID=score_id)
            
            });
        }

        
        console.log(data)
        

    
        // //Setup HTML Score Container for every image.
        // data['img_txt'].forEach(element => {
        //     placementDOM = document.querySelector(element['css-selector'])
        //     parentDOM    = document.querySelector(element['parent-selector'])

        //     if (placementDOM && parentDOM) {
        //         //Set the parent container to have relative positioning
        //         parentDOM.setAttribute('style', 'position:relative !important');
                
        //         //Insert the HTML as a child of the parentDOm
        //         placementDOM.insertAdjacentHTML('afterend',getImageHTML(element['score'], element['id']));
        //     }
        //     else console.error(`ERROR: Could not find DOM ${element['css-selector']} or DOM ${element['parent-selector']}`)
        // });
    });

}


let data;
//TODO: Don't hardcode access token.
let token = '2752a8aef8c313eb3735511fa8a6931e'

//Get API data using current URL
fetch(`http://localhost/${token}/?url=${window.location.href}`)
    .then(res => res.json())
    .then(data => {

        if (data['error'] != "") {
            throw new Error(`Error while processing data: ${data['error']}`)
        } 
        
        onDataFetch(data['data'])
        
        
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });



