
function setEventListeners(dict) {
    
    for (const selector in dict) {
        if (dict.hasOwnProperty.call(dict, selector)) {
            dict[selector].forEach((i,score) => { //Display/Hide score on selector hover
                document.querySelector(selector).addEventListener('mouseenter', () => displayScore(selector,score,i));
                document.querySelector(selector).addEventListener('mouseleave', () => hideScore   (selector,score,i));             
            });
        }
    }
}

function displayScore(selector,score,i) {
    console.log(`Entered ${selector} at position ${i}`)
    // Load HTML file
    fetch(chrome.runtime.getURL('../elements/image_hover/image_hover.html'))
        .then(response => response.text())
        .then(html => {
            
            //Get DOM and place target element
            if (placementDOM = document.querySelectorAll(selector)[i]){
                placementDOM.appendChild(targetElement);
                
                //Create element to place
                var container = document.createElement('div');
                container.innerHTML = html;//  Add the score the element   vv
                container.querySelector('.image-caption-score').textContent = `Image Caption Similarity: ${score}`
                targetElement = container.firstChild
                
                //Add the target element's custom CSS to document head
                fetch(chrome.runtime.getURL('../elements/image_hover/image_hover.css'))
                    .then(response => response.text())
                    .then(css => {
                            
                            //TODO: MAKE THE CSS APPENED TO THE HEAD BE FOR ALL POSSIBLE IMAGE TAGS.
                            //TODO: REFER TO OTHER TODO IN MAIN.PY

                            css = css.replace("this_image_css_selector",`${selector}:nth-of-type(${i+1})`)

                            var link = document.createElement('link');
                            link.rel = 'stylesheet';
                            link.type = 'text/css';
                            link.href = css;
                            document.head.appendChild(link);
                        })
            }
        }
    );

   
}

function hideScore(selector,i) {
    if (customElement = document.querySelectorAll(`${selector} .image-caption-score`)[i])
        customElement.remove();
}





//Code to execute upon a successful API return
function onDataFetch(data) {    
    //Setup EventListeners to display/hide score on image hover.
    setEventListeners(data['img_txt'])
}




//Get API data using current URL
let data;
fetch(`http://127.0.0.1:8000/?url=${window.location.href}`)
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
