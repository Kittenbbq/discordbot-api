/* global setOptions, globals */

let srv = "http://192.168.1.102:8080";

$( document ).ready( () => {
	setOptions();
	// Load charts
	loadCharts();
} );

function dateFormat( dateString ) {
	let date = new Date( dateString );
	let d = date.getDate();
	let m = date.getMonth() + 1;
	let y = date.getFullYear();
	return `${d}.${m}.${y}`;
}

function loadCharts() {

	// Message info
	$.get( `${srv}/api/messages/info`, ( data ) => {
		$( "#totalMessageCount" ).append( data.messageCount );
		$( "#firstMessage" ).append( dateFormat( data.firstMessage ) );
		$( "#lastMessage" ).append( dateFormat( data.lastMessage ) );
	} );

	// Message count by author
	$.get( `${srv}/api/messages/countByAuthor`, ( data ) => {
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

	// Message count by author
	$.get( `${srv}/api/messages/withUrl`, ( data ) => {
		let chartData = [];
		let cats = [];
		for ( let i = 0; i < data.length; i++ ) {
			if ( i + 1 > 10 ) {
				break;
			}
			chartData.push( [
					data[i].url, data[i].hits
			] );
			cats.push( data[i].url );
		}
		Highcharts.chart( "topUrls", {
			title: {
				text: "Top linked URLs",
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
				categories.push( `${day} ${hourString}:00` );
				let value = data.find( ( entry ) => {
					return entry.day === day && entry.hour === i;
				} );
				chartData.push( value ? value.messageCount : 0 );
			}
		}

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
				type: "areaspline",
				color: globals.mainColor,
				data: chartData
			} ]
		} );
	} );
}
