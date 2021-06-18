function makeTable(data, tablediv, ophan, parent, searchBoxUsed, columnHeadings) {

    var areas = data;

    function drawtable(areas, sortkey, truncate) {

        tablediv.innerHTML = "";

        areas.sort((a, b) => {
            return b[sortkey] - a[sortkey];
        });

        console.log(areas)

        var nonceAreas;

        if (truncate == true) {
            nonceAreas = areas.slice(0, 10)
        } else { nonceAreas = areas.slice() }

        var headerrow = document.createElement("div");

        headerrow.classList.add("gv-table-header");

        headerrow.innerHTML =
            `<div class="gv-table-column-title gv-country-name">Country</div>
            <div class="gv-table-column-title gv-sortable" id="gv-total-header">
            <span class="gv-table-title-span">${columnHeadings[0]}</span>
            <div class="gv-toggle-wrapper"></div>
            </div>
            <div class="gv-table-column-title" id="gv-fortnight-header">
            <span class="gv-table-title-span">${columnHeadings[1]}<span>
            <div class="gv-toggle-wrapper"></div>
            </div><div class="gv-table-column-title" id="total-deaths-header">
            <span class="gv-table-title-span">${columnHeadings[2]}</span>
            <div class="gv-toggle-wrapper"></div>
            </div>
            <div class="gv-table-column-title" id="fortnight-deaths-header">
            <span class="gv-table-title-span">${columnHeadings[3]}</span>
            <div class="gv-toggle-wrapper"></div>
            </div>`;
        tablediv.appendChild(headerrow);

        nonceAreas.map(r => {
            var row = document.createElement("div");
            row.classList.add("gv-row");
            row.innerHTML = `<div class="gv-cell gv-country-name">${
        r["Country/Region"]
      }</div><div class="gv-cell gv-number-cell">${r.allTime.toLocaleString()}</div>
      <div class="gv-cell gv-number-cell">${r.fortnight.toLocaleString()}</div>
      <div class="gv-cell gv-number-cell">${((r.alltimerate) * 1000000).toLocaleString('en-GB',{maximumFractionDigits: 0})}</div>
      <div class="gv-cell gv-number-cell">${((r.fortnightrate) * 1000000).toLocaleString('en-GB',{maximumFractionDigits: 0})}</div>`;

            tablediv.appendChild(row);
            if (window.resize) {
                window.resize()

            }


        });

        var totalheader = document.querySelector("#gv-total-header");
        totalheader.addEventListener("click", e => {
            ophan("world-coronavirus-table-2020-07", "sort-table")
            drawtable(data, "allTime");
        });

        var fortnightheader = document.querySelector("#gv-fortnight-header");
        fortnightheader.addEventListener("click", e => {
            ophan("world-coronavirus-table-2020-07", "sort-table")

            drawtable(data, "fortnight");
        });

        var totaldeathsheader = document.querySelector("#total-deaths-header");
        totaldeathsheader.addEventListener("click", e => {
            ophan("world-coronavirus-table-2020-07", "sort-table")

            drawtable(data, "alltimerate");
        });

        var fortnightdeathsheader = document.querySelector("#fortnight-deaths-header");
        fortnightdeathsheader.addEventListener("click", e => {
            ophan("world-coronavirus-table-2020-07", "sort-table")

            drawtable(data, "fortnightrate");
        });
    }

    var searchbox = document.querySelector("#gv-country-search");
    searchbox.addEventListener("input", e => {
        if (searchBoxUsed == false) {
            ophan("world-coronavirus-table-2020-07", "searchbox");
            searchBoxUsed = true;
        }
        if (e.target.value.length > 2) {
            var shortlist = data.filter(r =>
                r["Country/Region"].toLowerCase().includes(e.target.value.toLowerCase())
            );
            drawtable(shortlist, "fortnightCases");
        } else if (e.target.value.length == 0) {
            drawtable(data, "fortnightCases");
        }
    });

    searchbox.addEventListener("blur", e => {
        drawtable(data, "fortnightDeaths");
    });

    searchbox.addEventListener("focus", e => {
        e.target.value = "";
    });

    var showall = document.querySelector(".gv-show-all");

    showall.addEventListener("click", e => {
        ophan("world-coronavirus-table-2020-07", "expand-table")

        showall.classList.add("gv-clicked")
        drawtable(data, "fortnight", false)
    })

    drawtable(data, "allTime", true);

    if (window.resize) {
        window.resize();
    }
}

export default makeTable