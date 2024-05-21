function removeDuplicatesByKey(array, key) {
    const seen = new Set();
    return array.filter(item => {
        const val = item[key];
        if (seen.has(val)) {
            console.log(`Filter out ${val}`)
            return false; // This value has already been seen, filter it out
        }
        seen.add(val);
        return true; // This is a unique value, keep it
    });
}

// This is the function that will populate `chart-container`
function displayDashboard(data,dashboardContainerID) {



    //TODO:continue here + download extension on  laptop i dont give a shit 
    //Remove duplicate entries
    // data = removeDuplicatesByKey(data,'url')
    // if ("title_simil" in data[0]){
    //     data = removeDuplicatesByKey(data,'title_simil')
    // } else {

    //     for (let key in Object.keys(data)) {
    //         data[key]['caption_simil'] = data[key]['caption_simil'][0]
    //     }


    //     data = removeDuplicatesByKey(data,'caption_simil')
    // }



    console.table(data)


    // Set up SVG dimensions
    const svgWidth = 700;
    const svgHeight = 150;
    const margin = {
                top:5,
        left:5, /*==*/ right:5,
               bottom:5
    };

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
    line_height = (height/2)

    //Draw spectrum line
    svg.append("line")
       .attr("x1", margin.left)
       .attr("y1", line_height)
       .attr("x2", width + margin.left)
       .attr("y2", line_height)
       .attr("stroke", "#ccc")
       .attr("stroke-width", 1.75);

    //Add data points on spectrum
    svg.selectAll("circle")
       .data(data)
       .enter().append("circle")
       .attr("cx", d => xScale(d.title_simil))
       .attr("cy", line_height)   //On line
       .attr("r", 6.5)              //Radius of the circle
       .on("click", (event, d) => {
            window.open(d.url, '_blank'); //Open article in new tab
        })
        .on("mouseover", (event, d) => {
            d3.select("#d3-preview")
              .style("display", "block")
              .html(`<p>${d.url}</p>`);
        })
        .on("mousemove", function(event) {
            d3.select("#d3-preview")
              .style("display", "block")
              .style("left",(mouseX+10)-parent.offsetWidth+ "px")
              .style("top", (mouseY-10)-parent.offsetWidth+ "px");
        })
        .on("mouseout", function() {
            d3.select("#d3-preview")
              .style("display", "none");
        });
    

    //Add labels on each data point
    svg.selectAll("text")
       .data(data)
       .enter().append("text")
       .attr("x", d => xScale(d.title_simil))
       .attr("y", line_height + 20)
       .text(d => {
            if ('title_simil' in d) {
                // console.log("!!")
                return d.title_simil.toFixed(2)
            }
            else {
                // console.log("??")
                return d.caption_simil[0].toFixed(2)
            }

        }) //TODO:
       .attr("text-anchor", "middle")
       .style("font-size", "1rem");

}


async function setDisplayOnHover(hoverElement,dashboardContainer,data) {  

    //Append dashboardContainer as child to hoverElement
    hoverElement.appendChild(dashboardContainer)
    displayDashboard(data,dashboardContainer.id) //Bring up D3.js dashboard


    // //Display+Hide rules for hoverElement
    // hoverElement.addEventListener('mouseenter', () => {
        
    //     //Append dashboardContainer as child to hoverElement
    //     hoverElement.appendChild(dashboardContainer)
    //     displayDashboard(data,dashboardContainer.id) //Bring up D3.js dashboard
    // });

    // hoverElement.addEventListener('mouseleave', () => {   
    //     if (dashboardContainer) { //Iteratively remove all children (dashboard)
    //         while (child=dashboardContainer.firstChild) {
    //             dashboardContainer.removeChild(child);
    //         }
    //     }
    // });
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
    for (let i=0; i<keys.length; i++) {
        const img_selector = keys[i]
        document.querySelectorAll(img_selector).forEach((hoverElement,j) => {
            
            
            /*This is a list of JSON Object containing information about the current image
            Every element in the list corresponds to another image that is similair to the current image.
            The goal is to display the info of these similar images in the 1-D spectrum.*/
            this_img_info = data['images_info'][img_selector][j]            
            
            //Get CSS Selector of image-group
            selector_id = data['images_info'][img_selector][j]['id']
            
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

    
    console.log(data)


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



