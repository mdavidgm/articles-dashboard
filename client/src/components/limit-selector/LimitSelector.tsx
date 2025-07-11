import React, { useState, useMemo } from 'react';
import { Autocomplete, TextField, Box } from '@mui/material';

interface LimitSelectorProps {
    onChange: (value: number) => void;
    initialValue?: string;
  }
const LimitSelector = (props: LimitSelectorProps) => {
  const options = useMemo(() => {
    return Array.from({ length: 10 }, (_, i) => String(1 + i));
  }, []);

  const [value, setValue] = useState<string | undefined>(String(props.initialValue));

  const handleChange = (event: React.SyntheticEvent, newValue: string | null) => {
    event.preventDefault();
    const finalValueString = newValue !== null ? newValue : '10';
    setValue(finalValueString);
    const parsedNum = parseInt(finalValueString, 10);
    
    props.onChange(parsedNum);
  };

  return (
    <Box sx={{ width: 100 }}>
      <Autocomplete
        value={value}
        onChange={handleChange}
        options={options}
        renderInput={(params) => (
          <TextField
            {...params}
            label={'Limit'}
            variant="outlined"
          />
        )}
      />
    </Box>
  );
};

export default LimitSelector;