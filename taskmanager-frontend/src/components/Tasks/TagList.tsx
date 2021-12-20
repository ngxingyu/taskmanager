import { Stack, Chip } from '@mui/material';
import { FC } from 'react';

const TagList: FC<{ tags?: string[] }> = ({ tags }) => {
    return <>{tags && <Stack direction="row" spacing={1}>
        {tags.map((tag, i) => {
            return (
                <Chip key={i} label={tag} />
            );
        })}
    </Stack>
    }</>
}

export default TagList;