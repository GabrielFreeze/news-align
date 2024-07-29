function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1)
}

function removeDuplicatesByKey(array, key) {
    const seen = new Set();
    return array.filter(item => {
        const val = item[key];
        if (seen.has(val)) {
            return false; // This value has already been seen, filter it out
        }
        seen.add(val);
        return true; // This is a unique value, keep it
    });
}

function calculateYOffsets(xValues, yOffsetStep) {
    let yOffsets = new Array(xValues.length).fill(0);
    for (let i = 1; i < xValues.length; i++) {
        if (xValues[i] - xValues[i - 1] < 0.05) {
            yOffsets[i] = (i%2 * 2 -1) * ((Math.abs(yOffsets[i - 1])+yOffsetStep) % (yOffsetStep*3));
        }
    }
    return yOffsets;
}


// This is the function that will populate `chart-container`
function displayDashboard(data,dashboardContainerID) {

    // Remove duplicate entries
    data = removeDuplicatesByKey(data,'url')
    if ("title_simil" in data[0]){
        for (let i = 0; i < data.length; i++) {
            data[i]['score'] = data[i]['title_simil']
        }
        data = removeDuplicatesByKey(data,'score')
    } else {

        for (let i = 0; i < data.length; i++) {
            data[i]['score'] = data[i]['caption_simil'][0]
        }

        data = removeDuplicatesByKey(data,'score')

    }    

    console.table(data)
    
    
    // Set up SVG dimensions
    imgWidth = document.getElementById(`${data[0].selector_id}-0`).querySelector('img').getAttribute('width')
    const svgWidth = imgWidth !== null? imgWidth:600
    const svgHeight = 150;
    const margin = {top:15,left:15,right:15,bottom:15};
    const width  = svgWidth  - margin.left - margin.right;
    const height = svgHeight - margin.top  - margin.bottom;

   
    // Create SVG element
    const svg = d3.select(`#${dashboardContainerID}`)
        .append('svg')
        .attr('width' ,svgWidth)
        .attr('height',svgHeight);

    // Create a scale for x-axis
    const xScale = d3.scaleLinear()
        .domain([0,1])
        .range([margin.left, width+margin.left]);

    y_spacing   = 8
    line_height = height - (height/3)

    //Define marker for arrow
    svg.append("defs").append("marker")
       .attr("id", "arrow")
       .attr("viewBox", "0 0 10 10")
       .attr("refX", 5)
       .attr("refY", 5)
       .attr("markerWidth", 3)
       .attr("markerHeight", 3)
       .attr("orient", "auto-start-reverse")
       .append("path")
       .attr("d", "M 0 0 L 10 5 L 0 10 z")
       .attr("fill", "#333");

    // Define the marker for tick
    svg.append("defs").append("marker")
                      .attr("id", "tick")
                      .attr("viewBox", "0 0 10 10")
                      .attr("refX", 5)
                      .attr("refY", 5)
                      .attr("markerWidth", 4)
                      .attr("markerHeight", 4)
                      .attr("orient", "auto")
                      .append("path")
                      .attr("d", "M 5 0 L 5 10")
                      .attr("stroke", "#333")
                      .attr("stroke-width", 2);
    
    const imageWidth  = 300
    const imageHeight = 50

    const imageUrl = chrome.runtime.getURL("images/um-crest-ai.png");  // Get the correct path to the image
    svg.append("image")
        .attr("xlink:href", imageUrl)
        .attr("width", imageWidth)
        .attr("height", imageHeight)
        .attr("x", (svgWidth - imageWidth) / 2)       
        .attr("y", svgHeight - imageHeight - margin.bottom / 2)
        .attr("preserveAspectRatio", "xMidYMid meet");



    // Add title
    svg.append("text")
       .attr("x", svgWidth/2)       
       .attr("y", svgHeight/4)     
       .attr("text-anchor", "middle") 
       .attr("font-size", "2rem")     
       .attr("font-weight", "bold")   
       .attr("fill", "#BA0C2F")     
       .text("title_simil" in data[0]?
             "Image-Title Similarity":
             "Image-Caption Similarity");       

    //Draw spectrum line
    svg.append("line")
       .attr("x1", margin.left)
       .attr("y1", line_height)
       .attr("x2", width + margin.left)
       .attr("y2", line_height)
       .attr("marker-start","url(#tick)")
       .attr("marker-end","url(#arrow)")
       .attr("stroke", "#333")
       .attr("stroke-width", 4);

    //Sort by score
    data.sort((a, b) => a.score - b.score);
    //Assign a new variable to d called `y` that will dictate the position of the height point
    //If two points have a close x value (i.e they will be placed close together), we will make the points
    xValues = data.map(d => d.score)
    yOffsets = calculateYOffsets(xValues, 20)
    for (let i = 0; i < data.length; i++) {
        data[i]['y'] = yOffsets[i];
    }

    //Add data points on spectrum
    svg.selectAll("circle")
       .data(data)
       .enter().append("circle")
       .attr("cx", d => xScale(d.score))
       .attr("cy", (d,i) => line_height + yOffsets[i])
       .attr("r", 5.5)
       .attr("fill", d => d.url === window.location.href ?"green" : "steelblue")
       .on("click", (event, d) => {
            window.open(d.url, '_blank'); //Open article in new tab
        })
        .on("mouseover", (event, d) => {
            d3.select("#d3-preview")
              .style("display", "block")
              .html(`<p>${capitalize(d.newspaper)} - ${d.title}</p>`);
        })
        .on("mousemove", function(event) {
            d3.select("#d3-preview")
              .style("left",(mouseX+10)-parent.offsetWidth+ "px")
              .style("top", (mouseY-10)-parent.offsetWidth+ "px");
        })
        .on("mouseout", function() {
            d3.select("#d3-preview")
              .style("display", "none");
        });
    

    //Add labels on each data point
    svg.selectAll("text.label")
       .data(data)
       .enter().append("text")
       .attr("x", d => xScale(d.score))
       .attr("y", (d,i) => 20 + line_height + yOffsets[i])
       .text(d => d.score.toFixed(2))
       .attr("text-anchor", "middle")
       .style("font-size", "1rem");

    //Add text boxes at each end of the line
    svg.append("text")
       .attr("x", margin.left)
       .attr("y", height / 2 + margin.top - 10)
       .attr("text-anchor", "start")
       .attr("font-size", "12px")
       .attr("fill", "black")
       .text("Weak Match")
       .style("font-size", "1rem");
   
       svg.append("text")
       .attr("x", width + margin.left)
       .attr("y", height / 2 + margin.top - 10)
       .attr("text-anchor", "end")
       .attr("font-size", "12px")
       .attr("fill", "black")
       .text("Strong Match")
       .style("font-size", "1rem");

}


async function setDisplayOnHover(hoverElement,dashboardContainer,data) {  

    // // Append dashboardContainer as child to hoverElement
    // hoverElement.appendChild(dashboardContainer)
    // displayDashboard(data,dashboardContainer.id) //Bring up D3.js dashboard


    //Display+Hide rules for hoverElement
    hoverElement.addEventListener('mouseenter', () => {
        
        //Append dashboardContainer as child to hoverElement
        hoverElement.appendChild(dashboardContainer)
        displayDashboard(data,dashboardContainer.id) //Bring up D3.js dashboard
    });

    hoverElement.addEventListener('mouseleave', () => {   
        if (dashboardContainer) { //Iteratively remove all children (dashboard)
            while (child=dashboardContainer.firstChild) {
                dashboardContainer.removeChild(child);
            }
        }
    });
}


//Code to execute upon a successful API return
async function onDataFetch(data) {
    
    //Fetch HTML, CSS, and JS files for pop-up dashboard    
    response = await fetch(chrome.runtime.getURL(f='elements/image_hover/image_hover.html'));
    if (!response.ok) throw new Error(`Failed to fetch ${f}`);
    template_html = await response.text()
    
    response = await fetch(chrome.runtime.getURL(f='elements/image_hover/image_hover.css'));
    if (!response.ok) throw new Error(`Failed to fetch ${f}`);
    css = await response.text()    

    //Add pop-up dashboard CSS rules
    var styleElement = document.createElement('style');
    styleElement.textContent += css
    document.head.appendChild(styleElement);

    //Setup 1-D thumbnailInfo spectrum on the thumbnail
    thumbnailInfo   = data['thumbnail_info'] //List of dicts
    imagesInfo_keys = Object.keys(data['images_info']) //List of keys to dict
    
    thumbnailElement = document.querySelector(thumbnailInfo[0].selector)
    //                                        ^^^^^^^^^^^^^^^^^^^^^^^^^
    //First element of thumbnailInfo is the info about the current article's thumbnail
    
    //Specify the hoverable element        
    hoverElement = thumbnailElement.parentElement //  vv Because its the first element
    hoverElement.id = `${thumbnailInfo[0].selector_id}-0`
    hoverElement.setAttribute('style', 'position:relative !important');   

    //Create container div to hold D3.js chart
    dashboardContainer = document.createElement('div');
    dashboardContainer.id = `d3-${hoverElement.id}`;
    dashboardContainer.classList.add("d3-dashboard")
    
    //Append a preview container that will display the target articles on hover
    previewContainer = document.createElement('div')
    previewContainer.id = "d3-preview"
    hoverElement.appendChild(previewContainer)

    // Add EventListeners to inject D3.js chart when hovering on hoverElement
    setDisplayOnHover(
        hoverElement,        /*Element to be hovered on.                                                             */
        dashboardContainer, /*Container Element of pop-up dashboard that will be shown when hoverElement is hovered.*/
        thumbnailInfo      /*Data for the dashboard to display                                                     */
    )


    //Setup 1-D imageInfo spectrum for every image in article (including thumbnail)
    //Loop for every css-selector + image
    const keys = Object.keys(data['images_info'])
    /*TODO: We are currently ignoring image_info for the first image (thumbnail)
    as the UI conflicts with the previous 1-d spectrum set above*/
    for (let i=1; i<keys.length; i++) {
        const img_selector = keys[i]
        document.querySelectorAll(img_selector).forEach((hoverElement,j) => {
            
            /*This is a list of JSON Object containing information about the current image
            Every element in the list corresponds to another image that is similair to the current image.
            The goal is to display the info of these similar images in the 1-D spectrum.*/
            this_img_info = data['images_info'][img_selector][j]            
            
            //Get CSS Selector of image-group
            //The first image is the query image. Hence its selector_id is where the spectrum will be shown
            selector_id = data['images_info'][img_selector][j][0]['selector_id']
            
            /*Assign a unique ID to the image (hoverable) and pop-up container (to be displayed).
            This is so we can target them with EventListeners and D3.js charts*/
            hoverElement = hoverElement.parentElement
            //Make the hoverable image have a unique ID based on its selector and position within selector.
            hoverElement.id = `${selector_id}-${j}`
            //This lets the children of hoverElement (dashboardContainer), be displayed on-top of it like a pop-up.
            hoverElement.setAttribute('style', 'position:relative !important');   

            //Create container div to hold D3.js chart
            dashboardContainer = document.createElement('div');
            dashboardContainer.id = `d3-${hoverElement.id}`;
            dashboardContainer.classList.add("d3-dashboard")
            
            //Add EventListeners to inject D3.js chart when hovering on hoverElement
            setDisplayOnHover(
                hoverElement,   /*Element to be hovered on.*/
                dashboardContainer, /*Container Element of pop-up dashboard that will be shown when hoverElement is hovered.*/
                this_img_info /*Data for the dashboard to display */
            )
        
        });
    }

}

document.addEventListener('mousemove', function(event) {
    mouseX = event.clientX;
    mouseY = event.clientY;
});


let data;
//TODO: Don't hardcode access token.
let token = '2752a8aef8c313eb3735511fa8a6931e'

//Get API data using current URL
fetch(`http://nbxai.research.um.edu.mt/${token}/?url=${window.location.href}`)
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



