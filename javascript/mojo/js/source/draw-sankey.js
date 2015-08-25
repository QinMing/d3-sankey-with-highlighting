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
        .on("drag", function dragmove(d) {
          d3.select(this).attr("transform",
            "translate(" + (
              d.x = Math.max(0, Math.min(width - d.dx, d3.event.x))
            ) + "," + (
              d.y = Math.max(0, Math.min(height - d.dy, d3.event.y))
            ) + ")");
          sankey.relayout();
          link.attr("d", sankey.link());
          dlink.attr("d", sankey.link());
        })
      );

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
  // .on("mouseover", function (d) {
  //   sankey.dflows(d.flows);
  //   dlink = drawLink(sankey.dlinks(), 'highlight');
  // })
  // .on("mouseout", function (d) {
  //   graph.selectAll("g#highlight").remove();
  // });
  node
    .on("mouseover", function (d) {
      sankey.dflows(d.flows);
      dlink = drawLink(sankey.dlinks(), 'highlight');

      updateTooltip(d);
      canvas.select('#tooltip-container')
        .style('display', 'block');
    })
    .on("mouseout", function (d) {
      graph.selectAll("g#highlight").remove();

      canvas.select('#tooltip-container')
        .style('display', 'none');
    })
    .on('mousemove', function (d) {
      canvas.select('#tooltip-container')
        .style('top', d3.event.pageY + 'px')
        .style('left', d3.event.pageX + 'px');
    });

  link
    .on("mouseover", function (d) {
      sankey.dflows(d.flows);
      dlink = drawLink(sankey.dlinks(), 'highlight');

      updateTooltip(d);
      canvas.select('#tooltip-container')
        .style('display', 'block');
    })
    .on("mouseout", function (d) {
      graph.selectAll("g#highlight").remove();

      canvas.select('#tooltip-container')
        .style('display', 'none');
    })
    .on('mousemove', function (d) {
      canvas.select('#tooltip-container')
        .style('top', d3.event.pageY + 'px')
        .style('left', d3.event.pageX + 'px');
    });


  ///////////////////////
  //// Tooltips

  sankey.nodes().forEach(function(n){
    n.tooltip = {
      name: n.disp,
      value: formatNumber(n.value),
      head: true,
    };
  });
  sankey.links().forEach(function(l){
    l.tooltip = {
      name: l.source.disp + " → " + l.target.disp,
      value: formatNumber(l.value),
      head: true,
    };
  });
  sankey.flows().forEach(function(f){
    var name = '';
    f.thru.forEach(function (n, ind) {
      if (ind !== 0) name += ' → ';
      name += n.disp || n;
    });
    f.tooltip = {
      name: name,
      value: formatNumber(f.value),
    };
  });

  var tooltips = [];
  var tbody = canvas
    .append('div')
      .attr('id', 'tooltip-container')
    .append('table')
      .attr('class', 'tooltip')
    .append('tbody');

  // var tooltipRow = tbody.selectAll('tr')
  //     .data(tooltips);

  //@input d: data, could be node or link
  function updateTooltip(d){
    tooltips = [d.tooltip];
    d.flows.forEach(function(f){
      tooltips.push(f.tooltip);
    });

    tbody.selectAll('*').remove();
    tooltips.forEach(function(tip){
      var tr = tbody.append('tr');
      tr.append('td')
        .attr('class', 'name')
        .classed('head', 'head' in tip)
        .text(tip.name);

      tr.append('td')
        .attr('class', 'value')
        .classed('head', 'head' in tip)
        .text(tip.value);
    });
  }
};

// function flowTooltips(text, d) {
//   var len = d.flows.map(function (f) {
//     return formatNumber(f.value).length;
//   });
//   var maxlen = Math.max.apply(null, len);
//   var fmt = d3.format('<' + maxlen + ',.2f');
//   d.flows.forEach(function (f) {
//     text += '\n' + fmt(f.value) + '\t';
//     f.thru.forEach(function (n, ind) {
//       if (ind !== 0) text += ' → ';
//       text += n.disp || n;
//     });
//   });
//   return text;
// }
