'use strict';

/**
 * @ngdoc directive
 * @name d3OnAngularSeedApp.directive:simpleLineChart
 * @description
 * # simpleLineChart
 */
angular.module('d3OnAngularSeedApp')
  .directive('simpleLineChart', ['d3Service', function(d3Service) {
    return {
      restrict: 'EA',
      scope: {
      	items: '=',
      	brush: '='
      },
      link: function(scope, element, attrs) {
        d3Service.d3().then(function(d3) {

        var items = scope.items;

		var lanes = ["Chinese","Japanese","Korean"],
			laneLength = 3;

		var m = [20, 15, 15, 40], //top right bottom left
			w = 500 - m[1] - m[3],
			h = 500 - m[0] - m[2],
			mainHeight = h - 50;

		var x1 = d3.scale.linear()
				.range([0, w]);
		var y1 = d3.scale.linear()
				.domain([0, laneLength])
				.range([0, mainHeight]);

		var chart = d3.select(element[0])
					.append("svg")
					.attr("width", w + m[1] + m[3])
					.attr("height", h + m[0] + m[2])
					.attr("class", "chart");
		
		chart.append("defs").append("clipPath")
			.attr("id", "clip")
			.append("rect")
			.attr("width", w)
			.attr("height", mainHeight);

		var main = chart.append("g")
					.attr("transform", "translate(" + m[3] + "," + m[0] + ")")
					.attr("width", w)
					.attr("height", mainHeight)
					.attr("class", "main");
		
		//main lanes and texts
		main.append("g").selectAll(".laneLines")
			.data(items)
			.enter().append("line")
			.attr("x1", m[1])
			.attr("y1", function(d) {return y1(d.lane);})
			.attr("x2", w)
			.attr("y2", function(d) {return y1(d.lane);})
			.attr("stroke", "lightgray")

		var itemRects = main.append("g")
			.attr("clip-path", "url(#clip)");

		display([d3.min(items.map(function(d) { return d.start; })), d3.max(items.map(function(d) { return d.end; }))]);

	    scope.$watch("brush", function (newValue) { 
	    	if (angular.isUndefined(newValue) || newValue == null) return;           
        	display(newValue);
    	});
		
		function display(extent) {
			var rects, labels;
			if(extent[0] === extent[1]) {
				var minExtent = d3.min(items.map(function(d) { return d.start; })),
					maxExtent = d3.max(items.map(function(d) { return d.start; }));
			} else {
				var minExtent = extent[0],
					maxExtent = extent[1];
			}

			var visItems = items.filter(function(d) {return d.start < maxExtent && d.end > minExtent;});

			//mini.select(".brush")
			//	.call(brush.extent([minExtent, maxExtent]));

			x1.domain([minExtent, maxExtent]);

			//update main item rects
			rects = itemRects.selectAll("rect")
			        .data(visItems, function(d) { return d.id; })
				.attr("x", function(d) {return x1(d.start);})
				.attr("width", function(d) {return x1(d.end) - x1(d.start);});
			
			rects.enter().append("rect")
				.attr("class", function(d) {return "miniItem" + d.lane;})
				.attr("x", function(d) {return x1(d.start);})
				.attr("y", function(d) {return y1(d.lane) + 10;})
				.attr("width", function(d) {return x1(d.end) - x1(d.start);})
				.attr("height", function(d) {return .8 * y1(1);});

			rects.exit().remove();

			//update the item labels
			labels = itemRects.selectAll("text")
				.data(visItems, function (d) { return d.id; })
				.attr("x", function(d) {return x1(Math.max(d.start, minExtent) + 2);});

			labels.enter().append("text")
				.text(function(d) {return d.id;})
				.attr("x", function(d) {return x1(Math.max(d.start, minExtent));})
				.attr("y", function(d) {return y1(d.lane + .5);})
				.attr("text-anchor", "start");

			labels.exit().remove();

		}

        });
      }};
  }]);
