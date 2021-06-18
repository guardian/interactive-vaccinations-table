//import makeTable from 'shared/js/maketable.js'
import data from 'assets/vaccinations.json'
import {numberWithCommas} from 'shared/js/util.js'



var tablediv = document.querySelector(".gv-table#gv-cases");
var searchBoxUsed = false;
var parent = window.parent;
const columnHeadings = [
"Country", "Latest daily vaccinations", "Total vaccinations", "Total vaccinations per hundred people"
]

function ophan(component, value) {
	console.log('not tracking')
        //   var trackingobject = {
        //     component,
        //     value }

    // if (parent.guardian.ophan && parent.guardian.ophan != undefined) {

    //   parent.guardian.ophan.record(trackingobject);
    //   console.log(`sent ${component} ${value} to ophan`)
    // } else {console.log("can't find ophan")}
}




var areas = data;

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
	</div><div class="gv-table-column-title" id="total-vaccinations-header">
	<span class="gv-table-title-span">${columnHeadings[2]}</span>
	<div class="gv-toggle-wrapper"></div>
	</div>
	<div class="gv-table-column-title" id="otal-hundred-header">
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

		drawtable(data, "daily_vaccinations", true);
	});

	var totaldeathsheader = document.querySelector("#total-vaccinations-header");
	totaldeathsheader.addEventListener("click", e => {

		drawtable(data, "total_vaccinations", true);
	});

	var fortnightdeathsheader = document.querySelector("#otal-hundred-header");
	fortnightdeathsheader.addEventListener("click", e => {

		drawtable(data, "total_vaccinations_per_hundred", true);
	});
}

drawtable(data, "total_vaccinations_per_hundred", true);

var searchbox = document.querySelector("#gv-country-search");

searchbox.addEventListener("input", e => {

	if (searchBoxUsed == false) {

		searchBoxUsed = true;
	}
	if (e.target.value.length > 2) {

		var shortlist = data.filter(r =>

			r.location.toLowerCase().includes(e.target.value.toLowerCase())
			);

		drawtable(shortlist, "total_vaccinations_per_hundred");

	} else if (e.target.value.length == 0) {

		drawtable(data, "total_vaccinations_per_hundred");
	}
});

searchbox.addEventListener("blur", e => {
	//drawtable(data, "total_vaccinations_per_hundred");
});

searchbox.addEventListener("focus", e => {
	e.target.value = "";
});

var showall = document.querySelector(".gv-show-all");

showall.addEventListener("click", e => {

	showall.classList.add("gv-clicked")


	showall.innerHTML == 'Show all' ? drawtable(data, null, false) : drawtable(data, null, true);
	showall.innerHTML == 'Show all' ? showall.innerHTML = 'Show less' : showall.innerHTML = 'Show all';


})



if (window.resize) {
	window.resize();
}



/*Country	Latest daily vaccinations	Total vaccinations	Total vaccinations per hundred people
(ordered by total_vaccinations_per_hundred)	Latest figure for daily_vaccinations	Latest figure for total_vaccinations	Latest figure for total_vaccinations_per_hundred*/