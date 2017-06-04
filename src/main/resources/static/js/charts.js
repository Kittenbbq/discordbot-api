/* global d3, setOptions, globals */

let colors = d3.schemeCategory20;
colors = colors.concat( d3.schemeCategory10 );
colors = colors.concat( d3.schemeCategory20b );

let fill = () => {
	return colors[Math.floor( Math.random() * 49 )];
};


let srv = "/api/";

$( document ).ready( () => {
	// Default dates
	let start = new Date( "2015-09-13" ).toISOString();
	let end = new Date( Date.now() ).toISOString();

	// Set options
	setOptions();

	// Load charts
	loadCharts( start, end );

	// Init datepickers
	initDatePickers( start, end );
} );

let initDatePickers = ( start, end ) => {
	// Load jQuery-ui datepickers
	$( "#dpStart" ).datepicker( {
		dateFormat: "dd.mm.yy"
	} );
	$( "#dpEnd" ).datepicker( {
		dateFormat: "dd.mm.yy"
	} );

	// Show datepickers when span-icon is clicked
	$( "#dpStartIcon" ).click( () => {
		$( "#dpStart" ).datepicker( "show" );
	} );

	$( "#dpEndIcon" ).click( () => {
		$( "#dpEnd" ).datepicker( "show" );
	} );

	// Reload charts on date change
	$( "#dpStart" ).change( () => {
		checkAndUpdate();
	} );

	$( "#dpEnd" ).change( () => {
		checkAndUpdate();
	} );

	// Set initial values
	$( "#dpStart" ).val( dateFormatFi( start ) );
	$( "#dpEnd" ).val( dateFormatFi( end ) );
};

let checkAndUpdate = () => {
	let startDate = $( "#dpStart" ).datepicker( "getDate" );
	let endDate = $( "#dpEnd" ).datepicker( "getDate" );

	// Check if dates are valid
	if ( startDate === undefined || endDate === undefined ) {
		return;
	}

	// Check if timespan is valid
	if ( startDate >= endDate ) {
		return;
	}

	loadCharts( dateFormatEn( startDate ), dateFormatEn( endDate ) );
};

let dateFormatFi = ( dateString ) => {
	let date = new Date( dateString );
	let d = date.getDate();
	d = d < 10 ? `0${d}` : d;
	let m = date.getMonth() + 1;
	m = m < 10 ? `0${m}` : m;
	let y = date.getFullYear();
	return `${d}.${m}.${y}`;
};

let dateFormatEn = ( dateString ) => {
	let date = new Date( dateString );
	let d = date.getDate();
	d = d < 10 ? `0${d}` : d;
	let m = date.getMonth() + 1;
	m = m < 10  ? `0${m}` : m;
	let y = date.getFullYear();
	return `${y}-${m}-${d}`;
};

let loadCharts = ( startDate, endDate ) => {
	let params = `?fromDate=${startDate}&toDate=${endDate}`;

	// Message info
	$.get( `${srv}messages/info${params}`, ( data ) => {
		$( "#totalMessageCount" ).html( `Total messages: ${data.messageCount}` );
		$( "#firstMessage" ).html( `First message: ${dateFormatFi( data.firstMessage )}` );
		$( "#lastMessage" ).html(  `Last message: ${dateFormatFi( data.lastMessage )}` );
	} );

	// Message count by author
	$.get( `${srv}messages/countByAuthor${params}`, ( data ) => {
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
	$.get( `${srv}messages/withUrl${params}`, ( data ) => {
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
	$.get( `${srv}messages/countByDate${params}`, ( data ) => {
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


	$.get( `${srv}messages/countByDayHour${params}`, ( data ) => {
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

	$.get( `${srv}messages/wordCount${params}`, ( data ) => {
		//onsole.log( data );

		updateWordCloud( data );

	} );

	function getSize( d, data ) {
		let total = 0;
		for ( let entry of data ) {
			total += entry.count;
		}
		let pos = d.count / total * 1000;
		pos = Math.floor( pos );
		return pos * 2;
	}

	function updateWordCloud( data ) {
		var layout = d3.layout.cloud()
		.size( [750, 500] )
		.words( data.map( function( d ) {
			return {
				text: d.word,
				size: getSize( d, data ),
				test: "haha"
			};
		} ) )
		.padding( 5 )
		.rotate( function() { return ~~( Math.random() * 2 ) * 90; } )
		.font( "Impact" )
		.fontSize( function( d ) { return d.size; } )
		.on( "end", draw );

		// Function for drawing
		function draw( words ) {
			d3.select( "#messageWordCloud" ).append( "svg" )
			.attr( "width", layout.size()[0] )
			.attr( "height", layout.size()[1] )
			.append( "g" )
			.attr( "transform", "translate( " + layout.size()[0] / 2 + "," + layout.size()[1] / 2 + ")" )
			.selectAll( "text" )
			.data( words )
			.enter().append( "text" )
			.style( "font-size", function( d ) { return d.size + "px"; } )
			.style( "font-family", "Impact" )
			.style( "fill", function() { return fill(); } )
			.attr( "text-anchor", "middle" )
			.attr( "transform", function( d ) {
				return "translate( " + [d.x, d.y] + ")rotate( " + d.rotate + ")";
			} )
			.text( function( d ) { return d.text; } );
		}

		// Clear and draw
		$( "#messageWordCloud" ).html( "" );
		layout.start();
	}
};
