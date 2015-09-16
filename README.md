### Sankey Flow Chart Enhanced at Yahoo!
#### with Flow-Based API and End-to-End Highlighting

**Contributor:** [Ming Qin](http://github.com/QinMing)

**Contributor's Orgnization:** Yahoo Inc.

**The original visualization** is developed by [Ming Qin](http://github.com/QinMing), based on [D3 Sankey plugin](http://bost.ocks.org/mike/sankey/) wrote by [Mike Bostock](http://github.com/mbostock) (<mike@ocks.org>) at The New York Times.

Thanks David Ureña (at MicroStrategy, Inc.) and [Pradyut](http://community.microstrategy.com/t5/user/viewprofilepage/user-id/19497) for inspiration to build the mstr plugin!

**Original Visualization Source Link:** <a href = "" target = "blank">Will publish later</a>

**Usage:** Under the MicroStrategy servlet directory, go to `webapps/<app name>/plugins/`. Clone this repo. Make sure everything is in a new folder named `D3FlowY`. Finally restart the tomcat server.

This visualization needs 2 or more attributes and 1 or more metrics.

**Screenshot:**

![Alt text][screenshot]
[screenshot]: ./asset/screenshot.png?raw=true

Titanic Survivors. Data: [Robert J. MacG. Dawson](http://www.amstat.org/publications/jse/v3n3/datasets.dawson.html)

**Description:**

Sankey diagrams visualize the magnitude of flows between nodes in a network.

In addition to [the original Sankey Diagram](http://bost.ocks.org/mike/sankey/), this plugin has following new features:

_1. Flow-based API and End-to-end highlighting_

The original diagram take `nodes` and `links` as input, while this one has a different API. Instead of `links`, the input data contain `flows`, which have a single weight but multiple nodes in a chain. Here's an example of input data

<!-- The attribute `thru` specify the array of these nodes. -->
<!--   (in `thru`, things can be object references, indices in `nodes` or node `name`) -->

```
{
    nodes: [
      {
        "name": "node0",
        "disp": "A",
      }, {
        "name": "node1",
        "disp": "B",
      }

      ......

    ],

    flows: [
      {
        value: 50,
        thru: [ "node0", "node1"]
      }, {
        value: 30,
        thru: [ 0, 1, 2 ]
      }

      ......

    ]
}
```
Compared to the link API, the flows are easier to construct because our raw data are in a multi-attribute table, where each row corresponds to a `flow`. Moreover, flows retain more information than links. It knows where the flow is coming from at any given place. Thus the end-to-end highlighting is made possible. Whenever the mouse hover over an element, there is a certain subset of `flows` going through it. Then some new links (called `dlinks`) are dynamically computed from this flow subset, and rendered in highlight. The endpoints of `dlinks` are positioned so as to make the highlighted flows look visually consistent. Though the positioning algorithm is coarse and can be improved.

The plugin is also very suitable for visualizing parallel sets. The screenshot shows the same data as [parallel set visualization](https://www.jasondavies.com/parallel-sets/), but notice that their highlighting is very different.

_2. Rich tooltips_

The rich tooltip shows the subset of flows under your mouse. Double click on the diagram to switch between the rich and the simple modes.

_3. Visualization Properties_

You can customize the default tooltip style and number formats in the "visualization properties"

------------------------

Under the MIT License. See LICENSE in the project root for terms
