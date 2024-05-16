// This is the script that will populate `chart-container`

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

const data = [10, 20, 30, 40, 50];
console.log("D3.js script is running")
// Set up SVG dimensions
const width = 400;
const height = 200;

// Create SVG element
const svg = d3.select('#%THIS_IMAGE_ID%')
    .append('svg')
    .attr('width', width)
    .attr('height', height);

// Create a scale for x-axis
const xScale = d3.scaleLinear()
    .domain([0, data.length - 1])
    .range([0, width]);

// Create a scale for y-axis
const yScale = d3.scaleLinear()
    .domain([0, d3.max(data)])
    .range([height, 0]);

// Create a line generator
const line = d3.line()
    .x((d, i) => xScale(i))
    .y(d => yScale(d));

// Append path element to SVG to draw the line
svg.append('path')
    .datum(data)
    .attr('fill', 'none')
    .attr('stroke', 'steelblue')
    .attr('stroke-width', 2)
    .attr('d', line);



  
