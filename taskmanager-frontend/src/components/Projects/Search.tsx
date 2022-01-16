import { Accordion, AccordionDetails, AccordionSummary, Grid, Typography } from '@mui/material';
import React, { FC, useEffect, useState } from 'react'
import { SearchTaskProps } from 'core/entities';
import SearchIcon from "@mui/icons-material/Search"
import ChipInput from '@jansedlon/material-ui-chip-input';
import { queryTasks } from 'store/project/thunks';
import { useDispatch } from 'react-redux';
import Editable from 'components/Editable';

const Search: FC<{ title: string, projectId: number, callback?: () => void }> = ({ title, projectId }) => {
    const [active, setActive] = useState<boolean>(false);
    const handleChange = () => { setActive(!active); };
    const [state, setState] = useState<SearchTaskProps>({})
    const dispatch = useDispatch();
    useEffect(() => {
        setState({})
    }, [])
    useEffect(() => {
        dispatch(queryTasks(
            projectId,
            state.query === '' ? undefined : state.query,
            (state.all_tags || []).length === 0 ? undefined : state.all_tags))
    }, [state])

    return (
        <Accordion expanded={active} onChange={handleChange}>
            <AccordionSummary
                expandIcon={<SearchIcon />}
                aria-controls="panel1bh-content"
                id="panel1bh-header"
            >
                <Typography sx={{ width: '33%', flexShrink: 0 }}>
                    {title}
                </Typography>
            </AccordionSummary>
            <AccordionDetails>
                <Grid container component="form" rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} m={2} >
                    <Grid item xs={4}>
                        <Editable
                            text={state.query || ""}
                            label="Query"
                            name="query"
                            placeholder="Filter Tasks"
                            callback={(x: string) => setState({
                                ...state, query: x
                            })}
                            duration={1000}
                        />
                    </Grid>

                    <Grid item xs={4}>

                        <ChipInput
                            defaultValue={state.all_tags}
                            fullWidth
                            placeholder='Type and press enter to add tags'
                            onChange={(chips: string[]) => setState({
                                ...state, all_tags: chips
                            })}
                        />
                    </Grid>
                </Grid>
            </AccordionDetails>
        </Accordion>
    )
}

export default Search