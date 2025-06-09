export async function fetchShiftCounts(startDate,endDate){
    const baseUrl = 'https://backend-cpgmbqdydya8d6et.westeurope-01.azurewebsites.net/api'
    try {
        const start = startDate.toLocaleDateString('en-CA').slice(0,10)
        const end = endDate.toLocaleDateString('en-CA').slice(0,10)
        const shifts = await fetch(`${baseUrl}/projects/all?startDate=${start}&endDate=${end}`
        )

        if(!shifts.ok) throw new Error('Unable to fetch shifts')
        const res = await shifts.json()
        return res
        
    } catch (error) {
        console.error(error)
    }
}

