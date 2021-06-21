
import {numberWithCommas} from 'shared/js/util.js'
import axios from 'axios'
import csvParse from "csv-parse/lib/es5/sync";

const allArr = []

axios.get("https://interactive.guim.co.uk/2021/jan/vaccinations/vaccinations.csv").then(data => {

	let vaccinations = csvParse(data.data.toString(),{columns: true});

	const countryNames = [... new Set(vaccinations.map(d => d.location))]


	let obj = countryNames.map(country => {

		let countryData = vaccinations.filter(f => f.location === country)

		if(countryData[countryData.length-1].iso_code.length === 3) allArr.push(countryData[countryData.length-1])
	})

	drawtable(allArr, "total_vaccinations_per_hundred", true);

})



var tablediv = document.querySelector(".gv-table#gv-cases");
var searchBoxUsed = false;

const columnHeadings = [
"Country", "Latest daily vaccinations", "Total vaccinations", "Total vaccinations per hundred people"
]

var areas = allArr;

function drawtable(areas, sortkey, truncate) {

	tablediv.innerHTML = "";

	areas.sort((a, b) => {
		return b[sortkey] - a[sortkey];
	});

	var nonceAreas;

	if (truncate == true) {
		nonceAreas = areas.slice(0, 10)
	} else { nonceAreas = areas.slice() }

	var headerrow = document.createElement("div");

	headerrow.classList.add("gv-table-header");

	headerrow.innerHTML =
	`
	<div class="gv-table-column-title gv-sortable" id="gv-countries-header">
		<span class="gv-table-title-span">${columnHeadings[0]}</span>
		<div class="gv-toggle-wrapper"></div>
	</div>
	<div class="gv-table-column-title" id="gv-daily-header">
		<span class="gv-table-title-span">${columnHeadings[1]}<span>
		<div class="gv-toggle-wrapper"></div>
	</div>
	<div class="gv-table-column-title" id="total-vaccinations-header">
		<span class="gv-table-title-span">${columnHeadings[2]}</span>
		<div class="gv-toggle-wrapper"></div>
	</div>
	<div class="gv-table-column-title" id="total-hundred-header">
		<span class="gv-table-title-span">${columnHeadings[3]}</span>
		<div class="gv-toggle-wrapper"></div>
	</div>`;

	tablediv.appendChild(headerrow);

	nonceAreas.map(r => {

		var row = document.createElement("div");

		row.classList.add("gv-row");

		row.innerHTML = `

		<div class="gv-cell gv-country-name">${r.location}</div>
		<div class="gv-cell gv-number-cell">${numberWithCommas(r.daily_vaccinations)}</div>
		<div class="gv-cell gv-number-cell">${numberWithCommas(r.total_vaccinations)}</div>
		<div class="gv-cell gv-number-cell">${numberWithCommas(r.total_vaccinations_per_hundred)}</div>

		`;

		tablediv.appendChild(row);

		if (window.resize) {
			window.resize()
		}


	});

	var countriesHeader = document.querySelector("#gv-countries-header");

	countriesHeader.addEventListener("click", e => {

		let sort = areas.sort((a, b) => {
			return b.location < a.location;
		});

		drawtable(sort, null, true);
	});

	var fortnightheader = document.querySelector("#gv-daily-header");
	fortnightheader.addEventListener("click", e => {

		drawtable(allArr, "daily_vaccinations", true);
	});

	var totaldeathsheader = document.querySelector("#total-vaccinations-header");
	totaldeathsheader.addEventListener("click", e => {

		drawtable(allArr, "total_vaccinations", true);
	});

	var fortnightdeathsheader = document.querySelector("#total-hundred-header");
	fortnightdeathsheader.addEventListener("click", e => {

		drawtable(allArr, "total_vaccinations_per_hundred", true);
	});


	if (window.resize) {
		window.resize();
	}
}



var searchbox = document.querySelector("#gv-country-search");

searchbox.addEventListener("input", e => {

	if (searchBoxUsed == false) {

		searchBoxUsed = true;
	}
	if (e.target.value.length > 2) {

		var shortlist = allArr.filter(r =>

			r.location.toLowerCase().includes(e.target.value.toLowerCase())
			);

		drawtable(shortlist, "total_vaccinations_per_hundred");

	} else if (e.target.value.length == 0) {

		drawtable(allArr, "total_vaccinations_per_hundred");
	}
});

searchbox.addEventListener("blur", e => {
	//drawtable(allArr, "total_vaccinations_per_hundred");
});

searchbox.addEventListener("focus", e => {
	e.target.value = "";
});

var showall = document.querySelector(".gv-show-all");

showall.addEventListener("click", e => {

	showall.classList.add("gv-clicked")


	showall.innerHTML == 'Show all' ? drawtable(allArr, null, false) : drawtable(allArr, null, true);
	showall.innerHTML == 'Show all' ? showall.innerHTML = 'Show less' : showall.innerHTML = 'Show all';


})




