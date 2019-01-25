import React from 'react';
import { Link } from 'react-router-dom';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Icon from '@material-ui/core/Icon';
import './style.less';

const menus = [{
  icon: 'camera_front',
  name: 'biocard',
  url: '/',
}];
class LeftMenu extends React.Component {
  goTo(url) {
    this.context.router.push(url);
  }
  render() {
    return (
      <List className="menus">
        {menus.map((item) => {
          return (
            <ListItem button key={item.name} >
              <ListItemIcon>
                <Icon>
                  {item.icon}
                </Icon>
              </ListItemIcon>
              <Link className="link" to={item.url}>{item.name}</Link>
            </ListItem>
          );
        })}
      </List>
    );
  }
}
export default LeftMenu;
