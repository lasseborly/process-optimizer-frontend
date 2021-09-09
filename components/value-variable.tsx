import { Box, Button, TextField, Radio, FormControl, FormControlLabel, RadioGroup, Tooltip } from '@material-ui/core'
import { ChangeEvent, useState } from 'react';
import { useForm } from 'react-hook-form';
import useStyles from '../styles/value-variable.style';
import { ValueVariableType } from '../types/common';

type ValueVariableProps = {
  isDisabled: boolean
  onAdded: (data: ValueVariableType) => void
}

export default function ValueVariable(props: ValueVariableProps) {
  const { isDisabled, onAdded } = props
  const classes = useStyles()
  const [type, setType] = useState<string>('continuous')

  const { register, handleSubmit, reset } = useForm<ValueVariableType>()
  
  const onSubmit = async (data: ValueVariableType) => {
    onAdded(data)
    reset()
  }

  const toggleDiscrete = (event: ChangeEvent<HTMLInputElement>) => {
    setType(event.target.value)
  }

  return (
      <>
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            fullWidth
            margin="dense"
            name="name" 
            label="Name" 
            inputRef={register}
            />
          <TextField
            fullWidth
            margin="dense"
            name="description"
            label="Description"
            inputRef={register}
          />
          <Box mb={0} className={classes.narrowInputContainer}>
            <Box className={classes.narrowInput} pr={1}>
              <TextField
                fullWidth
                margin="dense"
                name="min"
                label="Min"
                inputRef={register({valueAsNumber: true})}
              />
            </Box>
            <Box className={classes.narrowInput}>
              <TextField
                fullWidth
                margin="dense"
                name="max"
                label="Max"
                inputRef={register({valueAsNumber: true})}
              />
            </Box>
          </Box>
          <Box mt={1} mb={1}>
            <FormControl component="fieldset">
              <RadioGroup row aria-label="value-type" name="type" value={type} onChange={toggleDiscrete}>
                <Tooltip title="Values include non-integers">
                  <FormControlLabel inputRef={register} value="continuous" control={<Radio />} label="Continuous" />
                </Tooltip>
                <Tooltip title="Values are only integers">
                  <FormControlLabel inputRef={register} value="discrete" control={<Radio />} label="Discrete" />
                </Tooltip>
              </RadioGroup>
            </FormControl>
          </Box>
          <Button size="small" disabled={isDisabled} variant="outlined" type="submit">Add variable</Button>
        </form>
      </>
  )
}