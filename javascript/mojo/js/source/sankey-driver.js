//Author: Ming Qin at Yahoo! Inc.
/*global d3*/

var SankeyDriver = function (){
  var sankey = d3.sankey();
  var formatNumber = d3.format(",.3s");//d3.format(",.2f");
  var color = d3.scale.category20c(); //color function
  var width, height;
  //Caution: width and height must be kept outside of function draw()
  //to avoid closure issues in drag event handler

  var graph;
  function prepareGraph(canvas, opt){
    var margin = {
      top: 25,
      bottom: 10,
      left: 25,
      right: 10,
    };
    width = opt.width - margin.left - margin.right;
    height = opt.height - margin.top - margin.bottom;
    canvas.html(''); //Although emptying html is not a D3 style

    graph = canvas
      .append('svg')
        .attr("width", opt.width)
        .attr("height", opt.height)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  }
    console.log(width);

  this.draw = function (canvas, inputdata, opt) {


    prepareGraph(canvas, opt);

    sankey
      .nodeWidth(15)
      .nodePadding(10)
      .size([width, height]);

    sankey.nodes(inputdata.nodes)
      .flows(inputdata.flows)
      .layout(32);

    drawNode(sankey.nodes());
    drawLink(sankey.links());

    function drawNode(nodes) {
      var group = graph.selectAll('g#node-group').data([0]);
      group.enter().append('g').attr("id", "node-group");
      var node = group.selectAll("g.node").data(nodes);
      node.exit().remove();

      var nodeEnter = node.enter().append("g")
        .attr("class", "node")
        .on("mouseover", funcMouseover)
        .on("mouseout", funcMouseout)
        .call(d3.behavior.drag()
          .origin(function (d) {
            return d;
          })
          .on("dragstart", function () {
            d3.event.sourceEvent.stopPropagation();
            this.parentNode.appendChild(this);
          })
          .on("drag", function dragmove(d) {
            d3.select(this).attr("transform",
              "translate(" + (
                d.x = Math.max(0, Math.min(width - d.dx, d3.event.x))
              ) + "," + (
                d.y = Math.max(0, Math.min(height - d.dy, d3.event.y))
              ) + ")");
            sankey.relayout();
            graph.select('g#normal').selectAll('path').attr("d", sankey.link());
            graph.select('g#highlight').selectAll('path').attr("d", sankey.link());
          })
        );
      nodeEnter.append("rect").append('title');
      nodeEnter.append("text");

      node
        .attr("transform", function (d) {
          return "translate(" + d.x + "," + d.y + ")";
        });

      node.select('rect')
        .attr("height", function (d) {
          return d.dy;
        })
        .attr("width", sankey.nodeWidth())
        .style("fill", function (d) {
          if (!d.color){
            d.color = color(d.disp);// = color(d.name.replace(/ .*/, ""));
          }
          return d.color;
        })
        .style("stroke", function (d) {
          return d3.rgb(d.color).darker(2);
        })
        .select("title")
        .text(function (d) {
          var text = formatNumber(d.value) + '\t' + d.disp;
          return text;
        });

      node.select("text")
        .attr("x", -6)
        .attr("y", function (d) {
          return d.dy / 2;
        })
        .attr("dy", ".35em")
        .attr("text-anchor", "end")
        .attr("transform", null)
        .text(function (d) {
          return d.disp;
        })
        .filter(function (d) {
          return d.x < width / 2;
        })
        .attr("x", 6 + sankey.nodeWidth())
        .attr("text-anchor", "start");
    }

    function drawLink(data) {
      var group = graph.selectAll('g#normal').data([0]);
      group.enter().insert("g", ":first-child").attr('id', 'normal');
      var link = group.selectAll('path.link').data(data);
      link.exit().remove();

      link.enter().append("path")
        .attr("class", "link")
        .on("mouseover", funcMouseover)
        .on("mouseout", funcMouseout)
        // .on('mousemove', funcMousemove)
        // .on('dblclick', funcTooltipToggle);
        .append("title");

      link
        .attr("d", sankey.link())
        .style("stroke-width", function (d) {
          return Math.max(1, d.dy);
        })
        .sort(function (a, b) {
          return b.dy - a.dy;
        });

      link.select('title')
        .text(function (d) {
          var text = formatNumber(d.value) + '\t' +
            d.source.disp + " → " + d.target.disp;
          return text;
        });
    }

    function drawDLink(data) {
      return graph.insert("g", ":first-child")
        .attr('id', 'highlight')
        .selectAll('path')
        .data(data)
        .enter()
        .append("path")
          .attr("class", "link highlight")
          .attr("d", sankey.link())
          .style("stroke-width", function (d) {
            return Math.max(1, d.dy);
          })
          .sort(function (a, b) {
            return b.dy - a.dy;
          });
    }

    function funcMouseover(d) {
      sankey.dflows(d.flows);
      drawDLink(sankey.dlinks());
      // updateTooltip(d);
      // canvas.select('#tooltip-container').style('display', 'block');
    }
    function funcMouseout() {
      graph.selectAll("g#highlight").remove();
      // canvas.select('#tooltip-container').style('display', 'none');
    }
    // function funcMousemove() {
    //   canvas.select('#tooltip-container')
    //     .style('top', d3.event.pageY + 'px')
    //     .style('left', d3.event.pageX + 'px');
    // }
    // function funcTooltipToggle(d){
    //   tooltipsEnable = !tooltipsEnable;
    //   updateTooltip(d);
    // }
  };
}
