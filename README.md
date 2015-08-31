### Sankey Flow Chart Enhanced at Yahoo!
#### with Flow-Based API and End-to-End Highlighting

**Contributor:** [Ming Qin](http://github.com/QinMing)

**Contributor's Orgnization:** Yahoo! Inc

**Original Authors:** [Ming Qin](http://github.com/QinMing) and [Mike Bostock](http://github.com/mbostock)

**Original Authors' Orgnizations:** Yahoo! Inc. and The New York Times

**Original Visualization Source Link:** <a href = "" target = "blank">Not published yet</a>

The original visualization is developed on top of [D3’s Sankey plugin](http://bost.ocks.org/mike/sankey/) by [Mike Bostock](http://github.com/mbostock) (<mike@ocks.org>) at The New York Times.

Thanks David Ureña (at MicroStrategy, Inc.) and [Pradyut](http://community.microstrategy.com/t5/user/viewprofilepage/user-id/19497) for inspiration to build the mstr plugin!

**Usage:** This visualization needs 2 or more attributes and 1 or more metrics.

**Screenshot:**

![Alt text][screenshot]
[screenshot]: ./style/images/screenshot.png?raw=true

Titanic Survivors. Data: [Robert J. MacG. Dawson](http://www.amstat.org/publications/jse/v3n3/datasets.dawson.html)

**Description:**

Sankey diagrams visualize the magnitude of flow between nodes in a network.

In addition to [the original visualization](http://bost.ocks.org/mike/sankey/), this plugin has following features:

_1. Flow-based API and End-to-end highlighting_

The [original plugin](http://bost.ocks.org/mike/sankey/) take `nodes` and `links` as input, while this one has a different API. Instead of `links`, the input data contain `flows`, which has a single weight but multiple nodes in a chain. The attribute `thru` specify the array of these node objects (it can be object references, indices in `nodes` or node `name`). Here's an example of input data
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
Compared to the link structure, flows are easier to construct because our raw data are in a multi-attribute table, where each row corresponds to a `flow`. Besides flows retain more information than links, so that the end-to-end highlighting is made possible. Whenever the mouse hover over an element, there is a certain subset of `flows` going through it. Then some new links (called `dlinks`) are dynamically computed from this flow subset, and placed on the canvas. The `dlinks` are positioned so as to make the highlighted flows look visually consistent. Although the positioning algorithm is coarse and can be improved.

The plugin is also very suitable for visualizing parallel sets. The data in the screenshot come from this [parallel set visualization](https://www.jasondavies.com/parallel-sets/), but note that their highlighting are very different.

_2. Rich tooltips_

Double click on the diagram to switch between the rich and the simple modes. The rich mode shows the subset of flows under your mouse.

_3. Settings_
You can customize the default tooltip style and number formats in the "visualization properties"
