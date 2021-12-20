
import { TextField } from "@mui/material";
import { debounce, DebouncedFunc } from "lodash";
import React, { ChangeEventHandler, FC, useCallback, useState } from "react";

const Editable: FC<{
    text: string,
    name: string,
    label: string,
    placeholder: string,
    callback: (v: string) => void
}> = ({
    text,
    name,
    label,
    placeholder,
    callback,
    ...props
}) => {
        const [isEditing, setEditing] = useState(false);
        const [value, setValue] = useState(text);

        const handleChange: DebouncedFunc<ChangeEventHandler<HTMLInputElement>> = useCallback(
            debounce((e) => {
                callback(e.target.value);
            }, 2000),
            []
        );

        return (
            <section {...props}>
                {isEditing ? (
                    <TextField
                        name={name}
                        required
                        fullWidth
                        id={name}
                        label={label}
                        value={value}
                        placeholder={placeholder}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            setValue(e.target.value);
                            handleChange(e);
                        }}
                        autoFocus
                        onBlur={() => setEditing(false)}
                    />
                ) : (
                    <TextField
                        name={name}
                        required
                        fullWidth
                        id={name}
                        label={label}
                        value={value}
                        placeholder={placeholder}
                        onClick={() => setEditing(true)}
                        disabled
                    />
                )}
            </section>
        );
    };

export default Editable;