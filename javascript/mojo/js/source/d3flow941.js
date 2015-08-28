/* global d3 */
/* global mstrmojo */
(function () {
  if (!mstrmojo.plugins.d3flow941) {
    mstrmojo.plugins.d3flow941 = {};
  }
  mstrmojo.requiresCls("mstrmojo.Vis", "mstrmojo._LoadsScript");

  mstrmojo.plugins.d3flow941.d3flow941 = mstrmojo.declare(
    mstrmojo.Vis, [mstrmojo._LoadsScript], {
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
        this.domNode.style.width = parseInt(this.width, 10) + 'px';
        this.domNode.style.height = parseInt(this.height, 10) + 'px';
        //if eg exists then we do not have data
        if (this.model.eg) {
          //displaying No data message
          this.domNode.innerHTML = this.model.eg;
        } else {
          //parsing properties
          // this.properties = this.getProperties();
          this.loadScripts();
        }
      },

      loadScripts: function () {
        var externalLibraries = [
          {
            url: "http://d3js.org/d3.v3.min.js"
              // url: "https://cdnjs.cloudflare.com/ajax/libs/d3/3.5.5/d3.min.js"
          },
          {
            url: "../plugins/d3flow941/javascript/mojo/js/source/sankey.js"
          },
          {
            url: "../plugins/d3flow941/javascript/mojo/js/source/draw-sankey.js"
          },
          // {
          //   url: "https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js"
          // }
                ];
        var me = this;
        // load required external JS files and after that run renderGraph method
        this.requiresExternalScripts(externalLibraries, function () {
          // $(document).ready(function () {
          //     $('head').append('<link href="../plugins/d3flow941/style/global.css" rel="stylesheet" id="styleSheet" />');
          // });
          me.renderGraph();
        });
      },

      /**
       * Reads properties from model
       * @returns properties
       */
      getProperties: function () {
        var prop = {};
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

        var gridData = this.getDataParser();
        // var metricName = gridData.getColHeaders(0).getHeader(0).getName();//not needed
        var negValFound = false;
        var nodeDict = {};
        var data = {
          nodes: [],
          flows: [],
        };

        for (var i = 0; i < gridData.getTotalRows(); i++) {
          var value = gridData.getMetricValue(i, 0).getRawValue();
          if (value <= 0) {
            console.error(
              'Warning: negative value(s) in the metric. Assuming zero.'
            );
            if (!negValFound) {
              negValFound = true;
            }
            continue;
          }
          var f = {
            value: value,
            thru: [],
          };
          for (var j = 0; j < gridData.getRowTitles().size(); j++) {
            var attrTitle = gridData.getRowTitles().getTitle(j).getName();
            var attr = gridData.getRowHeaders(i).getHeader(j).getName();
            if (!attr || attr === '') {
              attr = ' ';
            }
            var name = attr + ' - ' + attrTitle;
            if (!nodeDict[name]) {
              var newnode = {
                name: name,
                disp: attr,
              };
              data.nodes.push(newnode);
              nodeDict[name] = newnode;
            }
            // f.thru.push(data.nodes.indexOf(nodeDict[name])); //both works
            f.thru.push(nodeDict[name]);
          }
          data.flows.push(f);
        }

        var sz = {
          width: parseInt(this.domNode.style.width, 10),
          height: parseInt(this.domNode.style.height, 10),
        };
        var margin = {
          top: 25,
          left: 25,
          bottom: 10,
          right: 10,
        };
        var driver = new SankeyDriver();
        driver.prepare(d3.select(this.domNode), sz, margin);
        driver.draw(data);
      }
    }
  );
}());
