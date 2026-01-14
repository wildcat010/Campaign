import React from "react";
import { MenuMenu, MenuItem, Menu } from "semantic-ui-react";
import styles from "./Header.module.css";

const Header = (props) => {
  return (
    <div className={styles.menu}>
      <Menu>
        <MenuItem name="ListCampaigns">Found Campaigns</MenuItem>
        <MenuMenu position="right"></MenuMenu>
        <MenuItem name="Campaigns">Campaigns</MenuItem>
        <MenuItem>Add a Campaign</MenuItem>
      </Menu>
    </div>
  );
};
export default Header;
