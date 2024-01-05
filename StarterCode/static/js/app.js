// Save the URL to a variable
const URL = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// initialize the demographics callout
function demographics(sample){
    d3.json(URL).then(function(rawData){
    // set variable accessing the metadata
    let meta = rawData.metadata;

    // filter the result to the specific ID and select the data
    let filtereddata = meta.filter(result => result.id == sample);
    let result = filtereddata[0];

    // access the demographic panel from index.html
    d3.select("#sample-metadata").html("");

    // append each key value pair for a sample to the panel
    Object.entries(result).forEach(function([key,value]){
        d3.select("#sample-metadata")
        .append("p").text(`${key}: ${value}`);
    });
})};

// Initialize all the plots and the demographic panel
function initAll(){
    d3.json(URL).then(function(rawData){

    // select the dropdown menu from the HTML and add an option for each value in "names"
    let selector = d3.select("#selDataset");
    let names = rawData.names;

    names.forEach(function(sample){
        selector
        .append("option")
        .text(sample)
        .property("value",sample)
    });

    // set the initializing sample to be the first ID number in "names"
    sampleZero = names[0];
    
    // call each function to produce the initial plots
    initBar(sampleZero);
    initBubble(sampleZero);
    demographics(sampleZero);
})};

// Initialize bar chart with one sample's data 
function initBar(sample){
    d3.json(URL).then(function(rawData){
    // set variables accessing the "samples" section of the data 
    // for the specific sample id # that in the function input
    let sampleData = rawData.samples.filter(result => result.id == sample);

    // access OTU id numbers, lables, and sample values
    let otuIDs = sampleData[0].otu_ids;
    let otuLabels = sampleData[0].otu_labels;
    let sampleValues = sampleData[0].sample_values;

    // print values
    console.log(otuIDs, otuLabels, sampleValues);

    // obtain first 10 values and add text "OTU " to the OTU ids
    let yValues = otuIDs.slice(0,10).map(d => "OTU " + d).reverse();
    let xValues = sampleValues.slice(0,10).reverse();
    let labels = otuLabels.slice(0,10).reverse();

    let traceBar = {
        x: xValues,
        y: yValues,
        text: labels,
        type: "bar",
        orientation: "h"
    };

    let layout = {
        title: "Top 10 OTUs in the Sample"
    };

    let data = [traceBar];

Plotly.newPlot("bar", data, layout);
})};

// Initialize bubble chart
function initBubble(sample){
    d3.json(URL).then(function(rawData){
    // same variable set up as for the bar chart
    let sampleData = rawData.samples.filter(result => result.id == sample);

    // access OTU id numbers, lables, and sample values
    let otuIDs = sampleData[0].otu_ids;
    let otuLabels = sampleData[0].otu_labels;
    let sampleValues = sampleData[0].sample_values;

    // print values
    console.log(otuIDs, otuLabels, sampleValues);

    let traceBubble = {
        x: otuIDs,
        y: sampleValues,
        text: otuLabels,
        mode: 'markers',
        marker: {
            size: sampleValues,
            color: otuIDs
        },
    };

    let data = [traceBubble];
    let layout = {
        xaxis: {
            title: {
                text: 'OTU IDs'}}};

Plotly.newPlot("bubble", data, layout)
})};

// create the function to update charts each time a new sample is selected
function optionChanged(value){
    initBubble(value)
    initBar(value)
    demographics(value)
};

initAll();
