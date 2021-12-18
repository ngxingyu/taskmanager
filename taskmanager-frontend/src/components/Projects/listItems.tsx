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
import { getProjectById } from "store/project/thunks";
import { ListItemButton } from "@mui/material";
import { FC } from "react";
import { ThunkAction } from "redux-thunk";
import { ProjectStateProps } from "store/project/reducer";

export const projectsListItems: FC<{
  loading: boolean;
  projects: { [key: number]: ProjectStateProps };
  dispatch: Dispatch<ThunkAction<Promise<void>, any, any, any>>;
  error?: string;
}> = ({ loading, projects, dispatch, error }) => {
  const handleClick = (id: number) => dispatch(getProjectById(id));
  return (
    <>
      {error && <div>Error! {error.toString()}</div>}
      {loading ? (
        <div>Loading...</div>
      ) : (
        Object.entries(projects).map(([, v], i) => {
          return (
            // eslint-disable-next-line react/jsx-no-bind
            <ListItemButton key={i} onClick={() => handleClick(v.id || -1)}>
              <ListItemText primary={v.name || ""} />
            </ListItemButton>
          );
        })
      )}
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
