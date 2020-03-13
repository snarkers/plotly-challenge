function buildMetadata(sample) {

// Use `d3.json` to fetch the metadata for a sample
// Use d3 to select the panel with id of `#sample-metadata`
// Use `.html("") to clear any existing metadata
// Use `Object.entries` to add each key and value pair to the panel

let url = "/metadata/" + sample;
d3.json(url).then(function(sample_data){
  let sample_metadata = d3.select("#sample-metadata")
  sample_metadata.html("");
  Object.entries(sample_data).forEach(function ([key,value]){
    var row = sample_metadata.append("p");
    row.text(`${key}: ${value}`);
  });
});
    

    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
}

function buildCharts(sample) {

// @TODO: Use `d3.json` to fetch the sample data for the plots
// @TODO: Build a Bubble Chart using the sample data
// @TODO: Build a Pie Chart
let url2 = "/samples/" + sample;
d3.json(url2).then(function(data){
  let trace1 = [{
    x: data.otu_ids,
    y: data.sample_values,
    text: data.otu_labels,
    mode: "markers",
    marker:{
      color: data.otu_ids,
      size: data.sample_values,
      colorscale: "Hot"
    }
  }];

  let bubble_layout = {
    title: "otu_id",
    height: 500,
    width: 900
  };
  Plotly.newPlot("bubble", trace1, bubble_layout)

  let trace2 = [{
    values: data.sample_values.slice(0, 10),
    labels: data.otu_ids.slice(0,10),
    hovertext: data.otu_labels.slice(0,10),
    type: "pie",
  }];
  let pie_layout = {
    showlegend: true,
    height: 500,
    width: 500
  };
  Plotly.newPlot("pie", trace2, pie_layout)
})
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
