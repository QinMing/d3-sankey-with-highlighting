/* global d3 */
/* global mstrmojo */
(function () {
    if (!mstrmojo.plugins.d3flow941) {
        mstrmojo.plugins.d3flow941 = {};
    }
    mstrmojo.requiresCls("mstrmojo.Vis", "mstrmojo._LoadsScript");

    mstrmojo.plugins.d3flow941.d3flow941 = mstrmojo.declare(
        mstrmojo.Vis,
        [mstrmojo._LoadsScript],
        {
            scriptClass: 'mstrmojo.plugins.d3flow941.d3flow941',
            //HTML to render in place of widget
            //ming commented
            // markupString: '<div id="{@id}" style="top:{@top};left:{@left};position:absolute;overflow:hidden;">' +
            // '<div id="chartdiv -{@id}" style="height: 100%;width: 100%;font-size:10pt"></div>	' +
            // '</div>',
            markupString: '<div id="{@id}" style="top:{@top};left:{@left};position:absolute;overflow:scroll;"></div>', //ming

            properties: {},

            postBuildRendering: function () {
                if (this._super) {
                    this._super();
                }
                this.domNode.style.width  = parseInt(this.width, 10) + 'px';
                this.domNode.style.height = parseInt(this.height, 10) + 'px';
                //if eg exists then we do not have data
                if (this.model.eg) {
                    //displaying No data message
                    this.domNode.innerHTML = this.model.eg;
                } else {
                    //parsing properties
                    // this.properties = this.getProperties(); ming
                    this.loadScripts();
                }
            },

            loadScripts: function () {
                // array of required JS files
                var externalLibraries = [
                    {url: "http://d3js.org/d3.v3.min.js"},
                    // {url: "https://cdnjs.cloudflare.com/ajax/libs/d3/3.5.5/d3.min.js"},//ming

                    //{url: "../plugins/d3flow941/javascript/mojo/js/source/sankey.js"},
                    {url: "https://rawgit.com/mstr-dev/Visualization-Plugins/master/D3Flow/javascript/mojo/js/source/sankey.js"},
                    //Ming: temporary fix for Desktop V10

                    {url: "https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js"}
                ];
                var me = this;
                // load required external JS files and after that run renderGraph method
                this.requiresExternalScripts(externalLibraries, function () {
                    $(document).ready(function () {
                        $('head').append('<link href="../plugins/d3flow941/style/global.css" rel="stylesheet" id="styleSheet" />');
                    });
                    me.renderGraph();
                });
            },

            /**
             * Reads properties from model
             * @returns properties
             */
            getProperties: function () {
                var prop = new Object();
                prop.title = prop.defTitle = 'd3flow Integration for 9.4.1';
                prop.type = prop.defType = 'serial';
                prop.theme = prop.defTheme = 'none';
                if (this.model && this.model.vp) {
                    if (this.model.vp.graphTitle) {
                        prop.title = this.model.vp.graphTitle;
                    }
                    if (this.model.vp.graphType) {
                        prop.type = this.model.vp.graphType;
                    }
                    if (this.model.vp.graphTheme) {
                        prop.theme = this.model.vp.graphTheme;
                    }
                }
                return prop;
            },

            useRichTooltip: true,
            reuseDOMNode: true,
            errorDetails: "This visualization requires one or more attributes and one metric.",

            renderGraph: function (type) {
                var lMstrID = this.domNode.parentNode.parentNode.id;
                var lD3ID = "D3Flow-" + lMstrID;
                if ($('#' + lD3ID).length) {
                    $('#' + lD3ID).empty();
                }

                var mWidth = parseInt(this.domNode.style.width, 10),
                    mHeight = parseInt(this.domNode.style.height, 10);

                //Data Expected is an array of Objects key-value pairs like this:
                //  {links: [], nodes: []}
                // link items: {source: XXX, target: YYY, value: VVV}
                // nodes items: {name: XXX}

                var gridData = this.getDataParser();
                var mMyData = {};


                var lMetricName = gridData.getColHeaders(0).getHeader(0).getName();

                var lData_Links = [];

                // Build a Dictionary indicating for each attribute if values are renamed or not
                var mDictAttributes = {};
                for(var lAttrIdx = 0; lAttrIdx < gridData.getRowTitles().size(); lAttrIdx++) {
                    var lAttributeName = gridData.getRowTitles().getTitle(lAttrIdx).getName();
                    var lAttributeValues = gridData.getRowTitles().getTitle(lAttrIdx).getHeaderValues();
                    var lDictValues = {};
                    for(var lElementIdx = 0 ; lElementIdx < lAttributeValues.length; lElementIdx++) {
                        var lElement = lAttributeValues[lElementIdx]['n'];
                        //lElement.replace(' ', '-'); //Ming: in order to add it to classes
                        var lValueNotFound = true;
                        for(var lAttrName in mDictAttributes) {
                            var lAttrDic = mDictAttributes[lAttrName];
                            for(var lElementNm in lAttrDic) {
                                var lElementNewName = lAttrDic[lElementNm];
                                if (lElementNewName == lElement) {
                                    lValueNotFound = false;
                                }
                            }
                        }
                        if (lValueNotFound) {
                            lDictValues[lElement]=lElement;
                        } else {
                            lDictValues[lElement]=lElement + '-' + lAttributeName;
                            //to avoid duplicated attribute names
                        }
                    }
                    mDictAttributes[lAttributeName] = lDictValues;
                }

                var debugNegVal = 0;
                for (var i = 0; i < gridData.getTotalRows(); i++) {

                    var thru = '|';
                    for (var lSrcIdx = 0; lSrcIdx < gridData.getRowTitles().size(); lSrcIdx++) {
                        var lAttribute_Src_Name = gridData.getRowTitles().getTitle(lSrcIdx).getName();
                        var lAttribute_Src = gridData.getRowHeaders(i).getHeader(lSrcIdx).getName();
                        var lNewSrcName = mDictAttributes[lAttribute_Src_Name][lAttribute_Src];
                        thru += lNewSrcName + '|'
                    }
                    for (var lSrcIdx = 0; lSrcIdx < (gridData.getRowTitles().size() - 1); lSrcIdx++) {
                        var lTrgtIdx = lSrcIdx + 1;
                        var lNewLink = {};

                        var lAttribute_Src_Name = gridData.getRowTitles().getTitle(lSrcIdx).getName();
                        var lAttribute_Trgt_Name = gridData.getRowTitles().getTitle(lTrgtIdx).getName();

                        var lAttribute_Src = gridData.getRowHeaders(i).getHeader(lSrcIdx).getName();
                        var lAttribute_Trgt = gridData.getRowHeaders(i).getHeader(lTrgtIdx).getName();
                        var lMetricValue = gridData.getMetricValue(i, 0).getRawValue();

                        var lNewSrcName = mDictAttributes[lAttribute_Src_Name][lAttribute_Src];
                        var lNewTrgtName = mDictAttributes[lAttribute_Trgt_Name][lAttribute_Trgt];
                        lNewLink['source'] = lNewSrcName;
                        lNewLink['target'] = lNewTrgtName;
                        lNewLink['thru'] = thru;

                        if (lMetricValue <0){
                          debugNegVal ++;
                          lNewLink['value'] = 0;
                        }else{
                          lNewLink['value'] = lMetricValue;
                        }
                        lData_Links.push(lNewLink);
                    }
                }
                console.log("nagative values:",debugNegVal);

                var mNodeNames = [];
                for(var lAttrName in mDictAttributes) {
                    var lAttrDic = mDictAttributes[lAttrName];
                    for(var lElementNm in lAttrDic) {
                        var lElementNewName = lAttrDic[lElementNm];
                        var lNode = {};
                        lNode['name'] = lElementNewName;
                        mNodeNames.push(lNode);
                    }
                }
                mMyData['nodes'] = mNodeNames;
                mMyData['links'] = [].concat(lData_Links); //Ming: used to hightlight a perticular portion of a flow

                //If multiple Links have the same source and target, sum the value and only keep one
                var summarisedValue_key = function(src, dst){
                    return src + ' → ' + dst;
                };
                var summarisedValue = {};
                lData_Links.forEach( function(link){
                    var key = summarisedValue_key(link.source, link.target);
                    summarisedValue[key] = summarisedValue[key]+link.value || link.value;
                });

                //D3 Visualisation
                var page = d3.select(this.domNode)
                    .attr("id", lD3ID);

                var units = lMetricName;
                var margin = {top: 20, right: 20, bottom: 20, left: 20},
                    width = mWidth - margin.left - margin.right,
                    height = mHeight - margin.top - margin.bottom;

                var formatNumber = d3.format(",.0f"),    // zero decimal places
                    format = function(d) { return formatNumber(d) + " " + units; },
                    color = d3.scale.category20();

                // append the svg canvas to the page
                // var page = d3.selectAll($('#' + lD3ID).toArray());
                var svg = page.append("svg")
                    .attr("width", mWidth - 2)//debug
                    .attr("height", mHeight - 2)
                    // .attr("width", width + margin.left + margin.right)
                    // .attr("height", height + margin.top + margin.bottom)
                    .append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

                // Set the sankey diagram properties
                var sankey = d3.sankey()
                    .nodeWidth(36)
                    .nodePadding(10)
                    .size([width, height]);
                    //NOTE debug
                    // .size([width-20, height-20]);

                var source = function(x){
                  return x.source.name;
                };
                var target = function(x){
                  return x.target.name;
                };

                var nodeMap = {};
                mMyData.nodes.forEach(function(x) { nodeMap[x.name] = x; });
                var mapping = function(x) {
                    return {
                        source: nodeMap[x.source],
                        target: nodeMap[x.target],
                        thru: x.thru,
                        value: x.value
                    };
                };
                mMyData.links = mMyData.links.map(mapping);

                sankey
                    .nodes(mMyData.nodes)
                    .links(mMyData.links)
                    .layout(32);

                // add in the links
                var link = svg.append("g").selectAll(".link")
                    .data(mMyData.links)
                  .enter().append("path")
                    .attr("class", "link")
                    .attr("source", source)//Ming
                    .attr("target", target)//Ming
                    .attr("thru", function(x){//Ming
                      return x.thru;
                    })
                    .attr("d", sankey.link())
                    .style("stroke-linecap", "butt")
                    .style("stroke-width", function(d) { return Math.max(1, d.dy); })
                    .sort(function(a, b) { return b.dy - a.dy; });

                // add the link titles
                link.append("title")
                    .text(function(d) {
                        var key = summarisedValue_key(d.source.name, d.target.name);
                        return key + "\n" + format(summarisedValue[key]);
                    });

                var setSimilarLinks = function(link, val){
                  // var src = link.source.name,
                  //     trg = link.target.name;
                  // $("svg g .link[source='"+src+"'][target='"+trg+"']")
                  //   .each(function(){
                  //     $(this).attr("id", val);
                  //   });
                  $("svg g .link[thru='" + link.thru + "']").each(function(){
                    $(this).attr("id", val);
                  });
                }
                link.on("mouseover",function(d){
                  setSimilarLinks(d, "highlight-link");
                });
                link.on("mouseout", function(d){
                  setSimilarLinks(d, null);
                })

                // add in the nodes
                var node = svg.append("g").selectAll(".node")
                    .data(mMyData.nodes)
                    .enter().append("g")
                    .attr("class", "node")
                    .attr("transform", function(d) {
                        return "translate(" + d.x + "," + d.y + ")"; })
                    .call(d3.behavior.drag()
                        .origin(function(d) { return d; })
                        .on("dragstart", function(e) {
                            console.log(this);
                            d3.event.sourceEvent.stopPropagation();
                            this.parentNode.appendChild(this); })
                        .on("drag", function(d){
                            d3.select(this).attr("transform",
                                "translate(" + (
                                    d.x = Math.max(0, Math.min(width - d.dx, d3.event.x))
                                ) + "," + (
                                    d.y = Math.max(0, Math.min(height - d.dy, d3.event.y))
                                ) + ")");
                            sankey.relayout();
                            link.attr("d", sankey.link());
                        }));

                // add the rectangles for the nodes
                node.append("rect")
                    .attr("height", function(d) { return d.dy; })
                    .attr("width", sankey.nodeWidth())
                    .style("fill", function(d) {
                        return d.color = color(d.name.replace(/ .*/, "")); })
                    .style("stroke", function(d) {
                        return d3.rgb(d.color).darker(2); })
                    .append("title")
                    .text(function(d) {
                        var str = d.name + "\n" + format(d.value) + "\n";
                        var readLinks = function(srcName, dstName){
                            var key = summarisedValue_key(srcName,dstName);
                            str += "\n" + formatNumber(summarisedValue[key]) +
                                " : " + key;
                        }
                        var occur = {};
                        d.targetLinks.forEach(function(link){
                            if (!occur[link.source.name]){
                              occur[link.source.name] = true;
                              readLinks(link.source.name, d.name);
                            }
                        });
                        occur = {};
                        d.sourceLinks.forEach(function(link){
                            //this d is the source
                            if (!occur[link.target.name]){
                              occur[link.target.name] = true;
                              readLinks(d.name, link.target.name);
                            }
                        });
                        return str;
                    });
                node.on("mouseover",function(d){
                  $("svg g > path[thru*='|" + d.name + "|']").each(function(){
                    $(this).attr("id", "highlight-link");
                  });
                });
                node.on("mouseout",function(d){
                  $("svg g > path[thru*='|" + d.name + "|']").each(function(){
                    $(this).attr("id", null);
                  });
                });

                // add in the title for the nodes
                node.append("text")
                    .attr("x", -6)
                    .attr("y", function(d) { return d.dy / 2; })
                    .attr("dy", ".35em")
                    .attr("text-anchor", "end")
                    .attr("transform", null)
                    .text(function(d) { return d.name; })
                    .style("font-family", "arial")
                    .filter(function(d) { return d.x < width / 2; })
                    .attr("x", 6 + sankey.nodeWidth())
                    .attr("text-anchor", "start");

                console.log('end');
                //IE SVG refresh bug: re-insert SVG node to update/redraw contents.
                // var svgNode = this.domNode.firstChild;
                // this.domNode.insertBefore(svgNode, svgNode);
            }
        }
    );
}());
