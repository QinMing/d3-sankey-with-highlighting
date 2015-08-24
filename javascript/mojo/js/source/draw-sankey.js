//Author: Ming Qin at Yahoo! Inc.

d3.drawSankey = function (canvas, inputdata, options) {

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
          d3.event.sourceEvent.stopPropagation();
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
        dlink = drawLink(sankey.dlinks(), 'highlight');
      })
      .on("mouseout", function (d) {
        graph.selectAll("g#highlight").remove();
      })
      .append("title")
      .text(function (d) {
        var text = formatNumber(d.value) + '\t' + d.disp + '\n';
        return flowTooltips(text, d);
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

  function drawLink(data, opt) {
    var link = graph.insert("g", ":first-child")
      .attr('id', opt || 'normal')
      .selectAll(".link")
      .data(data)
      .enter().append("path")
      .attr("class", "link" + (" " + opt || ""))
      .attr("d", sankey.link())
      .style("stroke-width", function (d) {
        return Math.max(1, d.dy);
      })
      .sort(function (a, b) {
        return b.dy - a.dy;
      });
    return link;
  }

  function flowTooltips(text, d) {
    var len = d.flows.map(function (f) {
      return formatNumber(f.value).length;
    });
    var maxlen = Math.max.apply(null, len);
    var fmt = d3.format('<' + maxlen + ',.2f');
    d.flows.forEach(function (f) {
      text += '\n' + fmt(f.value) + '\t';
      f.thru.forEach(function (n, ind) {
        if (ind !== 0) text += ' → ';
        text += n.disp || n;
      });
    });
    return text;
  }

  function dragmove(d) {
    d3.select(this).attr("transform",
      "translate(" + (
        d.x = Math.max(0, Math.min(width - d.dx, d3.event.x))
      ) + "," + (
        d.y = Math.max(0, Math.min(height - d.dy, d3.event.y))
      ) + ")");
    sankey.relayout();
    link.attr("d", sankey.link());
    dlink.attr("d", sankey.link());
  }

  var formatNumber = d3.format(",.2f");
  var color = d3.scale.category20();

  var margin = {
      top: 10,
      right: 10,
      bottom: 10,
      left: 10,
    },
    width = options.width - margin.left - margin.right - 15,
    height = options.height - margin.top - margin.bottom - 15;

  var graph = canvas
    .append('svg')
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

  var dlink;
  var node = drawNode(sankey.nodes());
  var link = drawLink(sankey.links());
  link
    .on("mouseover", function (d) {
      sankey.dflows(d.flows);
      dlink = drawLink(sankey.dlinks(), 'highlight');
    })
    .on("mouseout", function (d) {
      graph.selectAll("g#highlight").remove();
      canvas.select('#tooltip-container')
        .style('display', 'none');
    })
    .on('mousemove', function (d) {
      // console.log(d3.event.pageX, d3.event.pageY);
      canvas.select('#tooltip-container')
        .style('display', 'block')
        .style('top', d3.event.pageY + 'px')
        .style('left', d3.event.pageX + 'px');
    })
    .append("title")
    .text(function (d) {
      var text = formatNumber(d.value) + '\t' +
        d.source.disp + " → " + d.target.disp + '\n';
      return flowTooltips(text, d);
    });

  canvas.append('div')
    .attr('id', 'tooltip-container')
    .html(
      '<table class="tooltip"><tbody><tr><th colspan="2">4</th></tr><tr class="tooltip-name-data1"><td class="name"><span style="background-color:#1f77b4"></span>data1</td><td class="value">60</td></tr><tr class="tooltip-name-data2"><td class="name"><span style="background-color:#ff7f0e"></span>data2</td><td class="value">130</td></tr><tr class="tooltip-name-data3"><td class="name"><span style="background-color:#2ca02c"></span>data3</td><td class="value">250</td></tr><tr class="tooltip-name-data4"><td class="name"><span style="background-color:#d62728"></span>data4</td><td class="value">130</td></tr><tr class="tooltip-name-data5"><td class="name"><span style="background-color:#9467bd"></span>data5</td><td class="value">160</td></tr><tr class="tooltip-name-data6"><td class="name"><span style="background-color:#8c564b"></span>data6</td><td class="value">60</td></tr></tbody></table>'
    );
};
