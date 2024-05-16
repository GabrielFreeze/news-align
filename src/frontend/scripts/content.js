// This is the function that will populate `chart-container`
function displayDashboard(data,dashboardContainerID) {

    // const data = {
    //     this:  0.6,
    //     mean:  0.5,
    //     other: [
    //         [
    //             "https://timesofmalta.com/article/who-trying-bury-articles-former-vitals-boss-ram-tumuluri.1092342",
    //             0.3
    //         ],
    //         [
    //             "https://newsbook.com.mt/en/muscat-being-charged-with-bribery-corruption-and-money-laundering/",
    //             0.8
    //         ],
    //         [
    //             "https://www.independent.com.mt/articles/2024-05-12/local-news/10th-edition-of-Valletta-Green-Festival-launched-6736261049",
    //             0.3
    //         ]
    //     ]
    // }

    console.log("D3.js script is running")

    //data = data
    dataPoints = [0.1, 0.2, 0.5, 0.4, 0.8];

    // Set up SVG dimensions
    const svgWidth = 300;
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
       .data(dataPoints)
       .enter().append("circle")
       .attr("cx", d => xScale(d)) //Position along the spectrum
       .attr("cy", line_height)    //On line
       .attr("r", 4);              //Radius of the circle


    //Add labels on each data point
    svg.selectAll("text")
       .data(dataPoints)
       .enter().append("text")
       .attr("x", d => xScale(d))
       .attr("y", line_height + 20) //Positioned just below the points
       .text(d => d.toFixed(1))     //Display the value rounded to 1 decimal place
       .attr("text-anchor", "middle")
       .style("font-size", "1rem");

}




async function setDisplayOnHover(hoverElement,dashboardContainer,data) {  

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

    response = await fetch(chrome.runtime.getURL(f='elements/image_hover/image_hover.js'));
    if (!response.ok) throw new Error(`Failed to fetch ${f}`);
    template_js = await response.text()
    

    //Add pop-up dashboard CSS rules
    var styleElement = document.createElement('style');
    styleElement.textContent += css
    document.head.appendChild(styleElement);
   
    //Loop for every css-selector + image
    const keys = Object.keys(data['img_txt'])
    for (let i=0; i<keys.length; i++) {
        const key = keys[i]
        document.querySelectorAll(key).forEach((hoverElement,j) => {
            
            hoverElement = hoverElement.parentElement


            //i == index of image in article
            //j == index of image in `key` css-selector

            //Get CSS Selector of image-group
            selector_id = data['img_txt'][key][j]['id']
            
            //If it's the first image (thumbnail), display the front-title score instead of the img_txt score.
            if (i == 0 && j == 0)
                this_img_analytics = data['front_title'][0]['score']
            else
                this_img_analytics = data['img_txt'][key][j]['score']
                            
            /*Assign a unique ID to the image (hoverable) and pop-up container (to be displayed).
            This is so we can target them with EventListeners and D3.js charts*/

            //Make the hoverable image have a unique ID based on its selector and position within selector.
            hoverElement.id = `${selector_id}-${j}`

            //This lets the children of hoverElement (dashboardContainer), be displayed on-top of it like a pop-up.
            hoverElement.setAttribute('style', 'position:relative !important');   
            
            //Create container div to hold D3.js chart
            const dashboardContainer = document.createElement('div');
            dashboardContainer.id = `d3-${hoverElement.id}`;
            dashboardContainer.classList.add("d3-dashboard")

            
            //Add EventListeners to inject D3.js chart when hovering on hoverElement
            setDisplayOnHover(
                hoverElement,   /*Element to be hovered on.*/
                dashboardContainer, /*Container Element of pop-up dashboard that will be shown when hoverElement is hovered.*/
                this_img_analytics /*Data for the dashboard to display */
            )
        
        });
    }

    
    console.log(data)


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



