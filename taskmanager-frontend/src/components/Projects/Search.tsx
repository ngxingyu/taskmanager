import { Accordion, AccordionDetails, AccordionSummary, Divider, IconButton, InputBase, Paper, Typography } from '@mui/material';
import React, { FC, useState } from 'react'
import SearchIcon from '@mui/icons-material/Search';
import { SearchTaskProps } from 'core/entities';
import ChipInput from '@jansedlon/material-ui-chip-input';

const Search: FC<{ title: string, callback?: () => void }> = ({ title }) => {
    const [active, setActive] = useState<boolean>(false);
    const handleChange = () => { setActive(!active); };
    const [state, setState] = useState<SearchTaskProps>({})

    return (
        <Accordion expanded={active} onChange={handleChange}>
            <AccordionSummary
                // expandIcon={<SearchIcon />}
                aria-controls="panel1bh-content"
                id="panel1bh-header"
            >
                <Typography sx={{ width: '33%', flexShrink: 0 }}>
                    {title}
                </Typography>
            </AccordionSummary>
            <AccordionDetails>
                <Paper
                    component="form"
                    sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 400 }}
                >
                    <InputBase
                        sx={{ ml: 1, flex: 1 }}
                        placeholder="Filter Tasks"
                        inputProps={{ 'aria-label': 'filter tasks' }}
                    />
                    <ChipInput
                        defaultValue={state.all_tags}
                        fullWidth
                        placeholder='Type and press enter to add tags'
                        onChange={(chips: string[]) => setState({
                            ...state, all_tags: chips
                        })}
                    />
                    <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
                    <IconButton type="submit" sx={{ p: '10px' }} aria-label="search">
                        <SearchIcon />
                    </IconButton>
                </Paper>
            </AccordionDetails>
        </Accordion>
    )
}

export default Search