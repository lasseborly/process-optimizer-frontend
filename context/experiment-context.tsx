import * as React from 'react'
import { versionInfo } from '../components/version-info'
import { useLocalStorageReducer } from '../hooks/useLocalStorageReducer'
import { Dispatch, rootReducer } from '../reducers/reducers'
import { initialState, State } from '../store'
import { ExperimentResultType, ExperimentType } from '../types/common'
import { migrate } from '../utility/migration/migration'
import { useGlobal } from './global-context'

const ExperimentContext = React.createContext<
    { state: State, dispatch: Dispatch, loading: boolean } | undefined
>(undefined)

type ExperimentProviderProps = {
    experimentId: string
    useLocalStorage: boolean
    children: any
}

function ExperimentProvider({ experimentId, useLocalStorage = false, children }: ExperimentProviderProps) {
    console.log(`Creating context ${experimentId} ${useLocalStorage}`)
    const storageKey = experimentId === undefined ? 'unknown' : experimentId
    const initialExperimentState = { ...initialState, experiment: { ...initialState.experiment, id: experimentId } }
    const [state, dispatch] = useLocalStorage ? useLocalStorageReducer(rootReducer, initialExperimentState, storageKey, (a:State) => ({...a, experiment: migrate(a.experiment)})) : React.useReducer(rootReducer, { ...initialExperimentState })
    const [loading, setLoading] = React.useState(true)
    const global = useGlobal()

    React.useEffect(() => {
        (async () => {
            if (!useLocalStorage) {
                console.log(`Fetching data from API backend for ${experimentId}`)
                const result = await fetch(`/api/experiment/${experimentId}`)
                if (result.ok) {
                    console.log(`Received data from backend for ${experimentId}`)
                    dispatch({
                        type: 'updateExperiment',
                        payload: migrate(await result.json())
                    })
                } else if (result.status === 404) {
                    console.log(`Experiment not found on server ${experimentId}`)
                } else {
                    console.log(`Error fetching expriment ${experimentId}`)
                }
            } else {
                if (state?.experiment?.info?.swVersion !== versionInfo.version) {
                    dispatch({type: 'setSwVersion', payload: versionInfo.version})
                }
                global.dispatch({
                    type: 'storeExperimentId',
                    payload: experimentId
                })
            }
            setLoading(false)
        })()
    }, [dispatch, experimentId, useLocalStorage, state])

    const getValue = (callback: (state: State) => any) => callback(state)

    const value = { state, dispatch, getValue, loading }
    return <ExperimentContext.Provider value={value}>{children}</ExperimentContext.Provider>
}

function TestExperimentProvider({ value, children }) {
    return (
        <ExperimentContext.Provider value={value}>
            {children}
        </ExperimentContext.Provider>
    )
}

function useExperiment() {
    const context = React.useContext(ExperimentContext)
    if (context === undefined) {
        throw new Error('useExperiment must be used within an ExperimentProvider')
    }
    return context
}

async function saveExperiment(experiment: ExperimentType) {
    return fetch(`/api/experiment/${experiment.id}`, { method: 'PUT', body: JSON.stringify(experiment) })
}

async function runExperiment(dispatch: Dispatch, experiment: ExperimentType) {
    const response: Response = await fetch(`/api/experiment/${experiment.id}`, { method: 'POST', body: JSON.stringify(experiment) })
    const result: ExperimentResultType = await response.json()
    dispatch({ type: 'registerResult', payload: result })
}

export { ExperimentProvider, TestExperimentProvider, useExperiment, saveExperiment, runExperiment }