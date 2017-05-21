let srv = "http://192.168.1.102:8080";
let globals = {
	bgColor: "#333c43",
	mainColor: "#e16224",
	lightColor: "#f0b091",
	fontStyle: {
		fontFamily: "Verdana, Geneva, sans-serif",
		color: "#CACACA"
	},
	titleFontStyle: {

	}
};

$( document ).ready( () => {
	Highcharts.setOptions( {
		chart: {
				fontFamily: "\"Verdana\", Geneva, sans-serif",
				color: "#FFFFFF"
		}
	} );
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

	// Top 10 posters
	$.get( `${srv}/api/messages/countByAuthor`, ( data ) => {
		console.log( "data" );
		for ( let i = 0; i < data.length; i++ ) {
			if ( i + 1 > 10 ) {
				break;
			}
			$( "#topMessages" ).append( `
				<p>${( i + 1 )} ${data[ i ].authorName}: ${data[ i ].messageCount}</p>
			` );
		}
	} );

	// Top 10 posters
	$.get( `${srv}/api/messages/countByDate`, ( data ) => {
		let chartData = [];
		for ( let entry of data ) {
			chartData.push( [
				Date.parse( entry.date ),
				entry.messageCount
			] );
		}

		Highcharts.chart( "messageCountByDate", {
			chart: {
				backgroundColor: globals.bgColor,
				style: {
					color: "\"#fff\"",
					fontFamily: "\"Verdana\", \"Geneva\", \"sans-serif\"",
				}
			},
			title: {
				text: "Message count by date"
			},
			subtitle: {
				text: "ObeseFinns Discord"
			},
			yAxis: {
				title: {
					text: "Messages sent"
				},
				min: 0
			},
			xAxis: {
				type: "datetime",
				title: {
					text: "Date"
				}
			},
			legend: {
				layout: "vertical",
				align: "right",
				verticalAlign: "middle"
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
				backgroundColor: globals.bgColor,
				type: "spline"
			},
			title: {
				text: "Message count by weekday"
			},
			subtitle: {
				text: "ObeseFinns Discord"
			},
			yAxis: {
				title: {
					text: "Messages sent"
				}
			},
			xAxis: {
				categories: categories,
				title: {
					text: "Hour"
				}
			},
			legend: {
				layout: "vertical",
				align: "right",
				verticalAlign: "middle"
			},
			series: [ {
				name: "Count",
				color: globals.mainColor,
				data: chartData
			} ]
		} );
	} );
}
