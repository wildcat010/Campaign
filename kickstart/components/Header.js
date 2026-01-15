import React from "react";
import { MenuMenu, MenuItem, Menu } from "semantic-ui-react";
import styles from "./Header.module.css";

import { Link } from "./../routes";

const Header = (props) => {
  return (
    <div className={styles.menu}>
      <Menu>
        <Link route="/">
          <a className="item">Home</a>
        </Link>
        <MenuMenu position="right">
          <Link route="/">
            <a className="item">Campaigns</a>
          </Link>
          <Link route="/campaigns/new">
            <a className="item">Campaigns</a>
          </Link>
        </MenuMenu>
      </Menu>
    </div>
  );
};
export default Header;
