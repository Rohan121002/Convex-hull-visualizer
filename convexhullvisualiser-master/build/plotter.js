/*! ConvexHullDemo 2022-04-29 */

const LABEL_PREFIX = "p";

define(["geom"], function(a) {
    function b(b, c, d, e) {
        for (var f, g, h, i, j = e ? Plotly.newPlot : Plotly.plot, k = [], l = [], m = [], n = 0; n < b.length; n++) {
            f = b[n];
            f instanceof a.Vec ? (k.push(f.x), l.push(f.y)) : (k.push(f[0]), l.push(f[1]));
            m.push(LABEL_PREFIX + n);
        }
        g = {
            x: k,
            y: l,
            mode: c
        };
        if (d.line && d.line.name) {
            g.name = d.line.name;
        } else {
            g.showlegend = !1;
        }
        for (var o in d) {
            g[o] = d[o];
        }
        if (c.includes("text")) {
            g.text = m;
            g.textposition = "middle right";
        }
        h = {
            xaxis: {
                title: "x",
                range: [-1, 101],
                scaleanchor: "y"
            },
            yaxis: {
                title: "y",
                range: [-1, 101]
            },
            width: 800,
            height: 670,
            showlegend: !0,
            legend: {
                x: .3,
                y: 1.05,
                orientation: "h"
            },
            margin: {
                l: 60,
                r: 30,
                b: 60,
                t: 60,
                pad: 0
            },
            font: {
                size: 24
            }
        };
        i = {
            displayModeBar: !1,
            staticPlot: !0
        };
        j("convexhull", [g], h, i);
    }
    return {
        plot: b
    };
});
