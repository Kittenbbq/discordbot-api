let globals = {
	bgColor: "#333c43",
	mainColor: "#e16224",
	lightColor: "#f0b091",
	titleFontStyle: {
		fontFamily: "Verdana, Geneva, sans-serif",
		color: "#CCC"
	},
	labelFontStyle: {
		fontFamily: "Verdana, Geneva, sans-serif",
		color: "#999"
	}
};

function setOptions() {
	Highcharts.setOptions( {
		chart: {
			zoomType: "x",
			backgroundColor: globals.bgColor,
			style: {
				color: "#111"
			}
		},
		subtitle: {
			style: globals.labelFontStyle
		},
		title: {
			style: globals.titleFontStyle
		},
		xAxis: {
			title: {
				style: globals.titleFontStyle
			},
			labels: {
				style: globals.labelFontStyle
			}
		},
		yAxis: {
			title: {
				style: globals.titleFontStyle
			},
			labels: {
				style: globals.labelFontStyle
			}
		},
		legend: {
			itemStyle: globals.titleFontStyle,
			itemHoverStyle: globals.labelFontStyle,
			title: {
				style: globals.titleFontStyle
			}
		},
		plotOptions: {
			area: {
				fillColor: {
					linearGradient: {
						x1: 0,
						y1: 0,
						x2: 0,
						y2: 1
					},
					stops: [
						[ 0, globals.mainColor ],
						[ 1, "rgba( 225, 98, 36, 0.1 )" ]
					]
				},
				marker: {
					radius: 2
				},
				lineWidth: 1,
				states: {
					hover: {
						lineWidth: 1
					}
				}
			},
			areaspline: {
				fillColor: {
					linearGradient: {
						x1: 0,
						y1: 0,
						x2: 0,
						y2: 1
					},
					stops: [
						[ 0, globals.mainColor ],
						[ 1, "rgba( 225, 98, 36, 0.1 )" ]
					]
				},
				marker: {
					radius: 2
				},
				lineWidth: 1,
				states: {
					hover: {
						lineWidth: 1
					}
				}
			},
			spline: {
				marker: {
					radius: 2
				},
				lineWidth: 2,
				states: {
					hover: {
						lineWidth: 2
					}
				}
			},
			bar: {
				borderWidth: 0,
				dataLabels: {
					style: {
						color: "#FFF",
						fontFamily: globals.titleFontStyle.fontFamily,
						fontWeight: "normal"
					}
				}
			}
		}
	} );
}
