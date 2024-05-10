async function setDisplayOnHover(hoverID, displayID, analytics) {  

    const response = await fetch(chrome.runtime.getURL('elements/image_hover/image_hover.html'));
    html = await response.text()

    //Replace the placeholder values in `image_hover.html` with values received from the server-side
    html = html.replace("%THIS_IMAGE_ID%",displayID)
               .replace("%SCORE%",analytics)

    //Create container div to hold D3.js chart
    const displayElement = document.createElement('div');
    displayElement.setAttribute('style', 'position:relative !important');
    displayElement.id = displayID;
    displayElement.innerHTML = html;

    const hoverElement = document.getElementById(hoverID);

    //Display+Hide rules for hoverElement
    hoverElement.addEventListener('mouseenter', () => {
        hoverElement.parentNode.appendChild(displayElement)
    });
    hoverElement.addEventListener('mouseleave', () => {
        if (displayElement) {displayElement.remove();}
    });

    //Display+Hide rules for displayElement (to avoid flickering)
    displayElement.addEventListener('mouseenter', () => {
        hoverElement.parentNode.appendChild(displayElement)
    });
    displayElement.addEventListener('mouseleave', () => {
        if (displayElement) {displayElement.remove();}
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

                //Get CSS Selector of image-group
                selector_id = data['img_txt'][key][i]['id']
                
                //If it's the first image (thumbnail), display the front-title score instead of the img_txt score.
                if (i == 0)
                    this_img_analytics = data['front_title'][0]['score']
                else
                    this_img_analytics = data['img_txt'][key][i]['score']
                                
                //Make the hoverable image have a unique ID based on its selector and position within selector.
                imageDOM.id = `${selector_id}-${i}`

                analytics_id = `analytics-${imageDOM.id}`

                //Add EventListeners to inject D3.js chart when hovering on imageDOM
                setDisplayOnHover(
                    hoverID=imageDOM.id   , /*ID of imageDOM to be hovered on.*/
                    displayID=analytics_id, /*ID of pop-up dashboard that will be shown when imageDOM is hovered.*/
                    analytics=this_img_analytics     /*Values received from server-side to display in pop-up dashboard. */
                )
            
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
fetch(`http://10.59.16.3/${token}/?url=${window.location.href}`)
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



