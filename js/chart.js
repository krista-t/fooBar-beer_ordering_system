import Chart from "chart.js/auto";

let data = [];
let label = [];
// chart object
export let chart = new Chart(myChart, {
	//type of charts
	type: "bar",
	//data on X-axis
	data: {
		labels: label,
		//data on Y-axis and their labels
		datasets: [
			{
				data: data,
				backgroundColor: [
					"orange",
					"pink",
					"bisque",
					"teal",
					"green",
					"lightblue",
					"red",
					"lightgreen",
					"yellow",
					"black",
				],
				borderColor: ["none"],
				borderWidth: 0,
			},
		],
	},
	options: {
		responsive: true,
		scales: {
			x: {
				grid: {
					display: false,
				},
			},
			y: {
				grid: {
					display: false,
				},
			},
		},

		animations: {
			tension: {
				duration: 1000,
				easing: "linear",
				from: 1,
				to: 0,
				loop: true,
			},
		},

		plugins: {
			title: {
				display: true,
				text: "POPULAR NOW",
				color: "#00704a",
				font: {
					size: 22,
				},
			},
			legend: {
				display: false,
			},
		},
	},
});
