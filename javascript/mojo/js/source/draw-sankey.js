//Author: Ming Qin at Yahoo! Inc.

d3.drawSankey = function (svg, inputdata) {

  function drawNode(nodes) {
    var node = graph.insert("g", ":first-child").selectAll(".node")
      .data(nodes)
      .enter().append("g")
      .attr("class", "node")
      .attr("transform", function (d) {
        return "translate(" + d.x + "," + d.y + ")";
      })
      .call(d3.behavior.drag()
        .origin(function (d) {
          return d;
        })
        .on("dragstart", function () {
          this.parentNode.appendChild(this);
        })
        .on("drag", dragmove));

    node.append("rect")
      .attr("height", function (d) {
        return d.dy;
      })
      .attr("width", sankey.nodeWidth())
      .style("fill", function (d) {
        d.color = color(d.name.replace(/ .*/, ""));
        return d.color;
      })
      .style("stroke", function (d) {
        return d3.rgb(d.color).darker(2);
      })
      .on("mouseover", function (d) {
        sankey.dflows(d.flows);
        dlink = drawLink(sankey.dlinks(), sankey.link(), 'highlight');
      })
      .on("mouseout", function (d) {
        graph.selectAll("g#highlight").remove();
      })
      .append("title")
      .text(function (d) {
        return d.disp + "\n" + formatNumber(d.value);
      });

    node.append("text")
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

    return node;
  }

  function dragmove(d) {
    d3.select(this).attr("transform", "translate(" + d.x + "," + (d.y = Math.max(
      0, Math.min(height - d.dy, d3.event.y))) + ")");
    sankey.relayout();
    link.attr("d", sankey.link());
    dlink.attr("d", sankey.link());
  }

  function drawLink(data, d_attr, opt) {
    var link = graph.insert("g", ":first-child")
      .attr('id', opt || 'normal')
      .selectAll(".link")
      .data(data)
      .enter().append("path")
      .attr("class", "link" + (" " + opt || ""))
      .attr("d", d_attr)
      .style("stroke-width", function (d) {
        return Math.max(1, d.dy);
      })
      .sort(function (a, b) {
        return b.dy - a.dy;
      });
    return link;
  }

  var margin = {
      top: 1,
      right: 1,
      bottom: 1,
      left: 1
    },
    width = 500 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

  var formatNumber = d3.format(",.0f"),
    color = d3.scale.category20();

  var graph = svg
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var sankey = d3.sankey()
    .nodeWidth(15)
    .nodePadding(10)
    .size([width, height]);

  sankey.nodes(inputdata.nodes)
    .flows(inputdata.flows)
    .layout(32);

  var node = drawNode(sankey.nodes());
  var link = drawLink(sankey.links(), sankey.link());
  link
    .on("mouseover", function (d) {
      sankey.dflows(d.flows);
      dlink = drawLink(sankey.dlinks(), sankey.link(), 'highlight');
    })
    .on("mouseout", function (d) {
      graph.selectAll("g#highlight").remove();
    })
    .append("title")
    .text(function (d) {
      return d.source.disp + " → " + d.target.disp + "\n" + formatNumber(d.value);
    });

  var dlink;
};
