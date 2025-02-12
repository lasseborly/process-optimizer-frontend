import { Box, Button, Card, CardContent, IconButton, TextareaAutosize, Typography } from '@material-ui/core'
import { ChangeEvent, useEffect, useState } from 'react'
import { useExperiment, saveExperiment } from "../../context/experiment-context"
import useStyles from './json-editor.style'
import { ExperimentType } from '../../types/common'
import CloseIcon from "@material-ui/icons/Close"
import { useGlobal } from '../../context/global-context'

type JsonEditorProps = {
    allowSaveToServer: boolean
}

type DisplayedResults = {
    id: string
    next: (number|string)[],
    expectedMinimum: Array<Array<number>>,
    extras: object
}

export default function JsonEditor(props: JsonEditorProps) {
    const { allowSaveToServer } = props
    const classes = useStyles()
    const [errorMsg, setErrorMsg] = useState('')
    const [displayedExperiment, setDisplayedExperiment] = useState('')
    const { state: { experiment }, dispatch, loading } = useExperiment()
    const global = useGlobal()

    useEffect(() => {
        const displayedExperiment = displayedExperimentFromExperiment(experiment)
        setDisplayedExperiment(displayedExperiment)
    }, [experiment])

    const displayedExperimentFromExperiment = (experiment: ExperimentType): string => {
        const results: DisplayedResults = {
            id: experiment.results.id,
            next: experiment.results.next,
            expectedMinimum: experiment.results.expectedMinimum,
            extras: experiment.results.extras,
        }
        return JSON.stringify({ ...experiment, results }, null, 2)
    }

    const experimentFromDisplayedExperiment = (displayedExperiment: string): ExperimentType => {
        const displayedExperimentObject = JSON.parse(displayedExperiment)
        return {
            ...displayedExperimentObject,
            results: {
                ...displayedExperimentObject.results,
                pickled: experiment.results.pickled,
                plots: experiment.results.plots
            }
        }
    }

    const handleSave = async() => {
        try {
            const experimentToSave: ExperimentType = experimentFromDisplayedExperiment(displayedExperiment)
            if (allowSaveToServer) {
                await saveExperiment(experimentToSave)
            } else {
                dispatch({ type: 'updateExperiment', payload: experimentToSave })
            }
            location.reload()
        } catch (e) {
            setErrorMsg('Error: ' + e.message)
            console.error('Error editing json', e)
        }
    }

    return (
        <Card>
            <CardContent>
                <Box mb={2}>
                  <IconButton 
                    size="small"
                    onClick={() => global.dispatch({ type: 'setShowJsonEditor', payload: false })}>
                    <CloseIcon />
                  </IconButton>
                </Box>
                {loading ? "Loading..." : 
                  <>
                    <Box>
                        <Typography variant="body2">
                            Warning! Only edit this JSON if you know what you are doing.
                        </Typography>
                    </Box>
                    <TextareaAutosize 
                        className={classes.textArea}
                        value={displayedExperiment}
                        onChange={(e: ChangeEvent) => setDisplayedExperiment((e.target as HTMLInputElement).value)} />
                    <Box>
                        <Button 
                            size="small"
                            variant="outlined"
                            onClick={() => handleSave()}>Update experiment</Button>
                    </Box>   
                    <Box mt={1}>
                        <Typography variant="body2" color="error">
                            {errorMsg}
                        </Typography>
                    </Box>
                  </>
                }
            </CardContent>
        </Card>
    )
}