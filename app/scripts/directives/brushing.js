'use strict';

/**
 * @ngdoc directive
 * @name d3OnAngularSeedApp.directive:brushing
 * @description
 * # brushing
 */
angular.module('d3OnAngularSeedApp')
  .directive('brushing', ['d3Service', function(d3Service) {
    return {
      restrict: 'EA',
      scope: {
      	items: '=',
      	brushed: '&'
      },
      link: function postLink(scope, element, attrs) {
        
        d3Service.d3().then(function(d3) {

	        var items = scope.items;
	        console.log(items);

			var lanes = ["Chinese","Japanese","Korean"],
				laneLength = 3,
				timeBegin = 0,
				timeEnd = 2000;

			var m = [20, 15, 15, 40], //top right bottom left
				w = 500 - m[1] - m[3],
				h = 500 - m[0] - m[2],
				miniHeight = laneLength * 12 + 50,
				mainHeight = h - miniHeight - 50;

				var x = d3.scale.linear()
				.domain([timeBegin, timeEnd])
				.range([0, w]);
			var y2 = d3.scale.linear()
					.domain([0, laneLength])
					.range([0, miniHeight]);

			var chart = d3.select(element[0])
						.append("svg")
						.attr("width", w + m[1] + m[3])
						.attr("height", h + m[0] + m[2])
						.attr("class", "chart");

			var mini = chart.append("g")
				.attr("transform", "translate(" + m[3] + ",0)")
				.attr("width", w)
				.attr("height", miniHeight)
				.attr("class", "mini");

						//mini lanes and texts
		mini.append("g").selectAll(".laneLines")
			.data(items)
			.enter().append("line")
			.attr("x1", m[1])
			.attr("y1", function(d) {return y2(d.lane);})
			.attr("x2", w)
			.attr("y2", function(d) {return y2(d.lane);})
			.attr("stroke", "lightgray");

					//mini item rects
		mini.append("g").selectAll("miniItems")
			.data(items)
			.enter().append("rect")
			.attr("class", function(d) {return "miniItem" + d.lane;})
			.attr("x", function(d) {return x(d.start);})
			.attr("y", function(d) {return y2(d.lane + .5) - 5;})
			.attr("width", function(d) {return x(d.end - d.start);})
			.attr("height", 10);

		//mini labels
		mini.append("g").selectAll(".miniLabels")
			.data(items)
			.enter().append("text")
			.text(function(d) {return d.id;})
			.attr("x", function(d) {return x(d.start);})
			.attr("y", function(d) {return y2(d.lane + .5);})
			.attr("dy", ".5ex");

		//brush
		var brush = d3.svg.brush()
			.x(x)
			.on("brush", brushed);


		mini.append("g")
			.attr("class", "x brush")
			.call(brush)
			.selectAll("rect")
			.attr("y", 1)
			.attr("height", miniHeight - 1);

			function brushed() {
				scope.brushed({brush:brush.extent()});
			}

		});

      }
    };
  }]);
