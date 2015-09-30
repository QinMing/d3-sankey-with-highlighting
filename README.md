### Sankey Flow Chart at Yahoo
#### with Flow-Based API and End-to-End Highlighting

**Contributor:** Ming Qin ([QinMing]([1]))
, Thukaram Katare ([sntrao](//github.com/sntrao))

**Contributor's Email:** mingqin at ucsd dot edu

**Contributor's Orgnization:** Yahoo Inc.

**The original visualization** is developed by [Ming Qin](http://github.com/QinMing), based on [D3 Sankey plugin](http://bost.ocks.org/mike/sankey/) wrote by [Mike Bostock](http://github.com/mbostock) (<mike@ocks.org>) at The New York Times.

Thanks David Ureña (at MicroStrategy, Inc.) and [Pradyut](http://community.microstrategy.com/t5/user/viewprofilepage/user-id/19497) for inspiration to build the mstr plugin!

**Original Visualization Source Link:** [Source]([3]), [demo]([2])

**Screenshot:**

![Alt text][screenshot]
[screenshot]: ./style/images/screenshot.png?raw=true

**Description:**

Compared to Mike's Sankey Plugin, this visualization has a flow-based data API and supports end-to-end highlighting feature. It shows rich tooltips when mouseover. [See the original page for detailed introduction]([2]).

**Usage:** Under the MicroStrategy servlet directory, go to `webapps/<app name>/plugins/`. Clone this repo. Make sure everything is in a new folder named `D3FlowY`. Finally restart the tomcat server.

This visualization needs 2 or more attributes and 1 or more metrics. You can customize the default tooltip style and number formats in the "visualization properties"

------------------------

Under the MIT License. See LICENSE in the project root for terms

[1]: http://github.com/QinMing
[2]: http://qinming.github.io/sankey
[3]: http://github.com/qinming/d3-sankey-with-highlighting
