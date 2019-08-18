import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import WorkSpace from '$containers/work-space';
import MainContent from '$containers/main-content';
import LeftMenu from '$containers/left-menu';
import '$styles/normalize.less';
import Biocard from '$containers/biocard';
import Header from '$components/header-bar/index.jsx';

const config = [
  { path: '', component: Biocard },
];
const BasicExample = () => (
  <Router>
    <WorkSpace>
      <Header />
      <MainContent
        leftMenu={<LeftMenu />}
      >
        {config.map((item) => {
          return (
            <Route exact path={item.path} component={item.component} key={item.path} />
          );
        })}
      </MainContent>
    </WorkSpace>
  </Router>
);
export default BasicExample;
