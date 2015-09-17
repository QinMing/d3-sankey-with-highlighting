<!-- ### Sankey Diagram with End-to-End Highlighting -->

<!-- Titanic Survivors. Data source: [Robert J. MacG. Dawson](http://www.amstat.org/publications/jse/v3n3/datasets.dawson.html) -->

This diagram shows the survival statistics of the Titanic disaster. The thickness of ribbons (links) represents the number of people. When you move the mouse over nodes or links, the specific portion of data will be highlighted from end to end, and the data can be read from the tooltips. Double click on the diagram to turn off rich tooltips. This visualization was developed by [Ming Qin](//github.com/QinMing), based on [D3 Sankey plugin](http://bost.ocks.org/mike/sankey/) wrote by [Mike Bostock](//github.com/mbostock) (<mike@ocks.org>).

# Features

## 1. Flow-based API and End-to-end highlighting

The original plugin take `nodes` and `links` as input, while this one has a different API. Instead of `links`, the input data contain `flows`, which have a single weight but multiple nodes in a chain. Here's an example of input data

```javascript
{
    nodes: [
      {
        "name": "node0",
        "disp": "A",
      }, {
        "name": "node1",
        "disp": "B",
      }

      // ......

    ],

    flows: [
      {
        value: 50,
        thru: [ "node0", "node1"]
      }, {
        value: 30,
        thru: [ 0, 1, 2 ]
      }

      // ......

    ]
}
```
Compared to the link API, the flows are easier to construct because our raw data are in a multi-attribute table, where each row corresponds to a `flow`. Moreover, flows retain more information than links. It knows where the flow is coming from at any given place. Thus the end-to-end highlighting is made possible. Whenever the mouse hover over an element, there is a certain subset of `flows` going through it. Then some new links (called `dlinks`) are dynamically computed from this flow subset, and rendered in highlight. The endpoints of `dlinks` are positioned so as to make the highlighted flows look visually consistent. Though the positioning algorithm is coarse and can be improved.

The plugin is also very suitable for visualizing parallel sets. The demo shows the same data as [parallel set visualization](https://www.jasondavies.com/parallel-sets/), but notice that their highlighting is very different.

## 2. Rich tooltips

The rich tooltip shows the subset of flows under your mouse. Double click on the diagram to switch between the rich and the simple modes.

------------------------

Licensed under the MIT License. See LICENSE in the project root for terms
