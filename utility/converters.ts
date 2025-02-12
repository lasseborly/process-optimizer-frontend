import { ExperimentData } from "../openapi"
import { CategoricalVariableType, DataPointType, DataPointTypeValue, ExperimentType, ScoreDataPointType, SpaceType, ValueVariableType } from "../types/common"

export const calculateSpace = (experiment: ExperimentType): SpaceType => {
    const numerical: SpaceType = experiment.valueVariables.map(v => { 
      return {type: v.type, name: v.name, from: Number(v.min), to: Number(v.max)}
    })
    const categorical: SpaceType = experiment.categoricalVariables.map((v) => { 
      return {type: "category", name: v.name, categories: v.options} 
    })
    return numerical.concat(categorical)
}

const numPat = / [0-9] + /
export const calculateData = (categoricalValues: CategoricalVariableType[], numericValues: ValueVariableType[], dataPoints: DataPointType[][]): ExperimentData[] => {
    return dataPoints.map((run):ExperimentData => ({xi: run.filter(it => it.name !== "score").map(it => numericValues.find(p => p.name === it.name) ? Number(it.value) : it.value), yi: Number((run.filter(it => it.name === "score")[0] as ScoreDataPointType).value[0])}))
}

export const dataPointsToCSV = (dataPoints: DataPointType[][], separator=";", newline="\n"): string => dataPoints
.reduce((prev, curr, idx) => idx === 0 ? [curr.map(item => item.name).join(separator)] : prev, [] as string[])
.concat(dataPoints
    .map(line => line
        .map(item => item.value)
        .join(separator)))
    .filter(s => "" !== s)
    .join(newline)

const convertValue = (valueHeaders:string[], categorialHeaders:string[], name: string, value: any): DataPointTypeValue => {
    if (valueHeaders.includes(name)) {
        return Number(value)
    } else if (categorialHeaders.includes(name)) {
        return value as string
    } else {
        return Array.isArray(value) ? value : [Number(value)]
    }
}

export const csvToDataPoints = (csv: string, valueVariables:ValueVariableType[], categorialVariables:CategoricalVariableType[], separator=";", newlinePattern=/\r\n|\n/):DataPointType[][] => {
    const valueHeaders = valueVariables.map(x => x.name)
    const categorialHeaders = categorialVariables.map(x => x.name)
    const expectedHeader = valueHeaders.concat(categorialHeaders).concat(['score'])
    const lines = csv.split(newlinePattern)
    if ("" === csv || lines.length < 2) return [[]]
    else {
        const header = lines[0].split(separator)
        if (header.length >= expectedHeader.length && expectedHeader.every((value, _) => header.includes(value))) {
            const data = lines.slice(1)
            return data
            .map(line => line
                .split(separator)
                .map((value, idx) => ({name: header[idx], value: convertValue(valueHeaders, categorialHeaders, header[idx], value)} as DataPointType)))
            .map(data => data.sort((a, b) => expectedHeader.indexOf(a.name) - expectedHeader.indexOf(b.name)))
            .map(data => data.filter(x => expectedHeader.includes(x.name)))
        } else {
            throw new Error(`Headers does not match ${expectedHeader.join(",")} !== ${header.join(",")}`)
        }
    }
}
