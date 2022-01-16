/* eslint-disable no-console */
import React, { Dispatch } from "react";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ListSubheader from "@mui/material/ListSubheader";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PeopleIcon from "@mui/icons-material/People";
import BarChartIcon from "@mui/icons-material/BarChart";
import LayersIcon from "@mui/icons-material/Layers";
import AssignmentIcon from "@mui/icons-material/Assignment";
import { setActiveProject } from "store/project/thunks";
import { ListItemButton } from "@mui/material";
import { FC } from "react";
import { ProjectStateProps } from "store/project/reducer";
import { AnyAction } from "redux";
import { push } from "redux-first-history";

export const projectsListItems: FC<{
  searching: boolean,
  setSearching: React.Dispatch<React.SetStateAction<boolean>>
  projects: { [key: number]: ProjectStateProps };
  dispatch: Dispatch<AnyAction>;
  error?: string;
  activeProjectId: number | undefined;
}> = ({ searching, setSearching, projects, dispatch, error, activeProjectId }) => {
  const handleClick = (id: number) => {
    if (!searching) {
      setSearching(true);
      dispatch(setActiveProject(id));
      dispatch(push(`/projects/${id}`));
    }
  };
  return (
    <>
      {searching
        ? (<div>Loading...</div>)
        : error
          ? (<div>Error! {error.toString()}</div>)
          : (Object.entries(projects).map(([, v], i) => {
            return (
              // eslint-disable-next-line react/jsx-no-bind
              <ListItemButton
                key={i}
                selected={v.id === activeProjectId}
                onClick={() => handleClick(v.id || -1)}>
                <ListItemText primary={v.name || ""} />
              </ListItemButton>
            );
          }))}
    </>
  );
};

export const mainListItems = (
  <div>
    <ListItem button>
      <ListItemIcon>
        <DashboardIcon />
      </ListItemIcon>
      <ListItemText primary="Dashboard" />
    </ListItem>
    <ListItem button>
      <ListItemIcon>
        <ShoppingCartIcon />
      </ListItemIcon>
      <ListItemText primary="Orders" />
    </ListItem>
    <ListItem button>
      <ListItemIcon>
        <PeopleIcon />
      </ListItemIcon>
      <ListItemText primary="Customers" />
    </ListItem>
    <ListItem button>
      <ListItemIcon>
        <BarChartIcon />
      </ListItemIcon>
      <ListItemText primary="Reports" />
    </ListItem>
    <ListItem button>
      <ListItemIcon>
        <LayersIcon />
      </ListItemIcon>
      <ListItemText primary="Integrations" />
    </ListItem>
  </div>
);

export const secondaryListItems = (
  <div>
    <ListSubheader inset>Saved reports</ListSubheader>
    <ListItem button>
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
      <ListItemText primary="Current month" />
    </ListItem>
    <ListItem button>
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
      <ListItemText primary="Last quarter" />
    </ListItem>
    <ListItem button>
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
      <ListItemText primary="Year-end sale" />
    </ListItem>
  </div>
);
