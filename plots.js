function init() {
    var selector = d3.select("#selDataset");
  
    d3.json("samples.json").then((data) => {
      console.log(data);
      var sampleNames = data.names;
      sampleNames.forEach((sample) => {
        selector
          .append("option")
          .text(sample)
          .property("value", sample);
      });
  })}
  
init();

function optionChanged(newSample) {
    buildMetadata(newSample);
    buildCharts(newSample);
  }
  
function buildMetadata(sample) {
    d3.json("samples.json").then((data) => {
      var metadata = data.metadata;
      var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
      var result = resultArray[0];
      var PANEL = d3.select("#sample-metadata");
  
      PANEL.html("");
      PANEL.append("h6").text("ID: " + result.id);
      PANEL.append("h6").text("Ethnicity: " + result.ethnicity);
      PANEL.append("h6").text("Gender: " + result.gender);
      PANEL.append("h6").text("Age: " + result.age);
      PANEL.append("h6").text("Location: " + result.location);
      PANEL.append("h6").text("BBType: " + result.bbtype);
      PANEL.append("h6").text("Wfreq: " + result.wfreq);

      var gauge={
        domain: {x: [0,1], y:[0,1]},
        value: result.wfreq,
        title: {text: "Belly Button Washing Frequency"},
        type: "indicator",
        mode: "gauge+number",
        gauge: {
          axis: {range: [null,9]},
          bgcolor: "white",
          steps: [
            {range:[0,1]},
            {range:[1,2]},
            {range:[2,3]},
            {range:[3,4]},
            {range:[4,5]},
            {range:[5,6]},
            {range:[6,7]},
            {range:[7,8]},
            {range:[8,9]}
          ]
        }  
      }

      var layout = { width: 600, height: 450, margin: { t: 0, b: 0 } };

      Plotly.newPlot("gauge",[gauge],layout);
    });
  }

function buildCharts(sample){
    d3.json("samples.json").then((data) => {
      var samples = data.samples
      var resultArray = samples.filter(sampleObj => sampleObj.id == sample);
      var result = resultArray[0]
      var xvalues = result.sample_values.slice(0,10)
      xvalues = xvalues.reverse();

      var yvalues = result.otu_ids.slice(0,10);
      yvalues = yvalues.reverse();
      yvalues = yvalues.map(i => "OTU " + i);
    
      var trace1 = {
        x: xvalues,
        y: yvalues,
        text: yvalues,
        name: "Bacteria",
        type: "bar",
        orientation: "h"
      };

      var layout = {
        title: "Top 10 OTUs",
        margin: {
          l: 100,
          r: 100,
          t: 100,
          b: 100
        }
      };
      
      Plotly.newPlot("bar", [trace1], layout);

      var trace2 = {
        x: result.otu_ids,
        y: result.sample_values,
        text: result.otu_labels,
        mode: 'markers',
        marker:{
          size: result.sample_values,
          color: result.otu_ids,
          colorscale: 'RdBu'
        }
      };

      var layout2 = {
        xaxis: {title: "OTU ID"}
    };

        Plotly.newPlot("bubble", [trace2], layout2);
      

    });
}
