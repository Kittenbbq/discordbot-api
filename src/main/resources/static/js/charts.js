let srv = "http://192.168.1.102:8080";
let globals = {
	bgColor: "#333c43",
	mainColor: "#e16224",
	lightColor: "#f0b091",
	titleFontStyle: {
		fontFamily: "Verdana, Geneva, sans-serif",
		color: "#BBB"
	},
	labelFontStyle: {
		fontFamily: "Verdana, Geneva, sans-serif",
		color: "#999"
	}
};

$( document ).ready( () => {
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

	// Load charts
	loadCharts();
} );

function loadCharts() {
	console.log( "Loading charts" );

	// Message info
	$.get( `${srv}/api/messages/info`, ( data ) => {
		console.log( data );
		$( "#totalMessageCount" ).append( data.messageCount );
		$( "#firstMessage" ).append( data.firstMessage );
		$( "#lastMessage" ).append( data.lastMessage );
	} );

	// Message count by author
	$.get( `${srv}/api/messages/countByAuthor`, ( data ) => {
		console.log( "data" );
		let chartData = [];
		let cats = [];
		for ( let i = 0; i < data.length; i++ ) {
			if ( i + 1 > 10 ) {
				break;
			}
			chartData.push( [
					data[i].authorName, data[i].messageCount
			] );
			cats.push( data[i].authorName );
		}
		Highcharts.chart( "topMessagers", {
			title: {
				text: "Top messages sent",
				align: "left"
			},
			legend: {
				floating: true,
				enabled: false
			},
			plotOptions: {
				bar: {
					dataLabels: {
						align: "right",
						enabled: true,
					}
				}
			},
			xAxis: {
				categories: cats,
			},
			yAxis: {
				title: ""
			},
			series: [ {
				type: "bar",
				name: "Count",
				color: globals.mainColor,
				data: chartData
			} ]
		} );
	} );

	// Message count by date
	$.get( `${srv}/api/messages/countByDate`, ( data ) => {
		let chartData = [];
		for ( let entry of data ) {
			chartData.push( [
				Date.parse( entry.date ),
				entry.messageCount
			] );
		}

		Highcharts.chart( "messageCountByDate", {
			title: {
				text: "Message count by date",
			},
			subtitle: {
				text: "ObeseFinns Discord",
			},
			yAxis: {
				title: {
					text: ""
				},
				min: 0
			},
			xAxis: {
				type: "datetime",
				title: {
					text: ""
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
					},
					threshold: null
				}
			},
			series: [ {
				type: "area",
				name: "Count",
				color: globals.mainColor,
				data: chartData
			} ]
		} );
	} );


	$.get( `${srv}/api/messages/countByDayHour`, ( data ) => {
		let chartData = [];
		let weekdays = [
			"Monday",
			"Tuesday",
			"Wednesday",
			"Thursday",
			"Friday",
			"Saturday",
			"Sunday"
		];

		let categories = [];
		for ( let day of weekdays ) {
			for ( let i = 0; i < 24; i++ ) {
				let hourString = i.length === 1 ? `0${i}` : i;
				console.log( "day is " + day );
				categories.push( `${day} ${hourString}:00` );
				let value = data.find( ( entry ) => {
					return entry.day === day && entry.hour === i;
				} );
				chartData.push( value ? value.messageCount : 0 );
			}
		}

		console.log( categories );
		console.log( chartData );

		Highcharts.chart( "messageCountByDayHour", {
			chart: {

			},
			title: {
				text: "Message count by weekday"
			},
			subtitle: {
				text: "ObeseFinns Discord"
			},
			yAxis: {
				title: {
					text: ""
				}
			},
			xAxis: {
				categories: categories,
				title: {
					text: ""
				}
			},
			series: [ {
				name: "Count",
				style: globals.fontStyle,
				type: "spline",
				color: globals.mainColor,
				data: chartData
			} ]
		} );
	} );
}
