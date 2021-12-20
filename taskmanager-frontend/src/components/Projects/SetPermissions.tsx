import { UserRole, PermissionProps } from "core/entities";
import { FC, useState } from "react";
import AddPermission from "./AddPermissions";
import EditPermission from "./EditPermission";

export const SetPermissions: FC<{
    permissions: UserRole[],
    callback: (permissions: UserRole[]) => void;
}> = ({ permissions, callback }) => {
    const [state, setState] = useState(permissions)
    const handleUpdate = (i: number) => (newPermission?: PermissionProps) => {
        let newState;
        if (newPermission !== undefined) {
            newState = state.map((item, idx) => idx === i ? newPermission : item)
        } else {
            newState = state.filter((_, idx) => idx !== i)
        }
        setState(newState);
        callback(newState);
    }
    const handleCreate = (newPermissions: PermissionProps[]) => {
        if (newPermissions.length !== 0) {
            const newState = [...state, ...newPermissions]
            setState(newState)
            callback(newState);
        }
    }

    return <>{permissions.map((x, i) => {
        return <EditPermission key={x.email} permission={x} callback={handleUpdate(i)} />
    })}
        <AddPermission callback={handleCreate} />
    </>
}
