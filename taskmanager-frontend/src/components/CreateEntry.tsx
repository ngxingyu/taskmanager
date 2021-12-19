import React, {
    ChangeEventHandler,
    FC,
    useCallback,
    useState,
} from "react";

import {
    Box,
    TextField,
} from "@mui/material";

const CreateEntry: FC<{
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    label: string;
    id: string;
    initValue: string | number | null | boolean;
}> = ({ onSubmit, label, id, initValue }) => {
    const [value, setValue] = useState(initValue);
    const handleSubmit = useCallback(
        (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            onSubmit(event);
            setValue(initValue);
        },
        []
    );
    const handleChange: ChangeEventHandler<HTMLInputElement> = useCallback(
        (e) => {
            setValue(e.currentTarget.value);
        },
        []
    );
    return (
        <Box component="form" noValidate onSubmit={handleSubmit}>
            <TextField
                name={id}
                required
                fullWidth
                id={id}
                label={label}
                value={value}
                onChange={handleChange}
                autoFocus
            />
        </Box>
    );
};
export default CreateEntry;