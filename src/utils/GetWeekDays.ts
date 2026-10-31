

interface GetWeekDaysParams {
    short?: boolean | null
    year : number
    month : number
}


export function GetWeekDays ({short = false} : GetWeekDaysParams) {

    const formatter = new Intl.DateTimeFormat('pt-BR', {weekday : "long"})

    return Array.from(Array(7).keys()).map(day =>
        formatter.format(new Date(Date.UTC(2023, 0, day + 1)))
    )
    .map((weekDay) => {
        if(short){
            return weekDay.substring(0,3).toUpperCase()
        }
        return weekDay.substring(0,1).toUpperCase().concat(weekDay.substring(1))
    })

}
