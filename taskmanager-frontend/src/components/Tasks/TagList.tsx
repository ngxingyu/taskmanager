import { Box, Chip } from '@mui/material';
import { FC } from 'react';

const TagList: FC<{ tags?: string[] }> = ({ tags }) => {
    return <>
        {tags &&
            <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'flex-start', alignContent: 'space-between', p: 1, m: 1 }} >
                {tags.map((tag, i) => {
                    return (
                        <Chip key={i} label={tag} />
                    );
                })}
            </Box>
        }
    </>
}

export default TagList;