import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { type SelectChangeEvent } from '@mui/material/Select';
import { Fragment, useState } from 'react';

export default function FormSelect({ label, initial, items }: { label: string, initial: string, items: string[] }) {
  const [value, setValue] = useState<string>(initial);

  const handleChange = (event: SelectChangeEvent) => {
    setValue(event.target.value);
  };

  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth>
        <InputLabel id={`${label}-select-lablel`}>{label}</InputLabel>
        <Select
          labelId={`${label}-select-lablel`}
          id={`${label}-select`}
          value={value}
          label={label}
          onChange={handleChange}
        >
          {items.map((item, index) =>
            <Fragment key={index}>
              <MenuItem value={item}>{item}</MenuItem>
            </Fragment>
          )}
        </Select>
      </FormControl>
    </Box>
  );
}