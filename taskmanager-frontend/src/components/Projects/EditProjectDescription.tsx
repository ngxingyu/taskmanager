import { Box } from "@mui/material";
import Editable from "components/Editable";
import { ProjectProps, UserRole } from "core/entities";
import { FC } from "react";
import { SetPermissions } from "./SetPermissions";

export const EditProjectDescription: FC<{ project: ProjectProps, onChange: (project: ProjectProps) => void }> = ({ project, onChange }) => {
    const update = (newProjectState: ProjectProps) => {
        onChange(newProjectState);
    }
    return (
        <Box sx={{ mx: 'auto', p: 1, m: 1, borderRadius: 1, textAlign: 'center', }}>
            <Editable
                text={project.name || ""}
                label="Name: "
                name="title"
                placeholder="Project name"
                callback={(x: string) => update({ ...project, name: x })}
            />
            <SetPermissions permissions={project.permissions || []} callback={(x: UserRole[]) => update({ ...project, permissions: x })} />
        </Box>
    )
}