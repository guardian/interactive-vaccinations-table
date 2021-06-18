import mainHTML from "./atoms/table/server/templates/main.html!text"
import fs from 'fs'
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

	fs.writeFileSync('assets/vaccinations.json', JSON.stringify(allArr));

})

export async function render() {
    return mainHTML;
} 