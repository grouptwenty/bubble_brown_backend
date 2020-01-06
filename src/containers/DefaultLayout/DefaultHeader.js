import React, { Component } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Badge, DropdownItem, DropdownMenu, DropdownToggle, Nav, NavItem, Row, Col } from 'reactstrap';
import PropTypes from 'prop-types';

import { AppAsideToggler, AppHeaderDropdown, AppNavbarBrand, AppSidebarToggler } from '@coreui/react';
// import sygnet from '../../assets/img/brand/sygnet.svg'
import { connect } from 'react-redux';
const propTypes = {
  children: PropTypes.node,
};

const defaultProps = {};

class DefaultHeader extends Component {
  constructor(props) {
    super(props)


  }

  

  render() {

    // eslint-disable-next-line
    const { children, ...attributes } = this.props;

    return (
      <React.Fragment>
        {/* <AppSidebarToggler className="d-lg-none" display="md" mobile /> */}
        <NavLink to="/dashboard"  >
          {/* 
        <AppNavbarBrand
          full={{ src: logo, width: 65, height: 65, alt: 'CoreUI Logo' }}
          minimized={{ src: sygnet, width: 30, height: 30, alt: 'CoreUI Logo' }}
        /> */}
        </NavLink>
        <AppSidebarToggler className="d-md-down-none" display="lg" />
        <img src="/logo_bubblebrown.png" height={80} width={80} />

        <Nav className="ml-auto" navbar>
          {/* < AppHeaderDropdown direction="down">
            <DropdownMenu right style={{ right: 'auto' }}>
              <DropdownItem header tag="div" className="text-center"><strong>Notificaation 01</strong></DropdownItem>
              <DropdownItem header tag="div" className="text-center"><strong>Notificaation 02</strong></DropdownItem>
              <DropdownItem header tag="div" className="text-center"><strong>Notificaation 03</strong></DropdownItem>
              <DropdownItem header tag="div" className="text-center"><strong>Notificaation 04</strong></DropdownItem>
              <DropdownItem header tag="div" className="text-center"><strong>Notificaation 05</strong></DropdownItem>
              <DropdownItem header tag="div" className="text-center"><strong>Notificaation 06</strong></DropdownItem>
              <DropdownItem header tag="div" className="text-center"><strong>Notificaation 07</strong></DropdownItem>
              <DropdownItem header tag="div" className="text-center"><strong>Notificaation 08</strong></DropdownItem>
              <DropdownItem header tag="div" className="text-center"><strong>Notificaation 09</strong></DropdownItem>
              <DropdownItem header tag="div" className="text-center"><strong>Notificaation 10</strong></DropdownItem>
              <DropdownItem header tag="div" className="text-center"><strong>See All</strong></DropdownItem>

            </DropdownMenu> */}
          <AppHeaderDropdown direction="down">
            <DropdownToggle nav>
              <NavLink to="#" className="nav-link"> สาขา <i className="fa fa-user"></i> </NavLink>
            </DropdownToggle>
            <DropdownMenu right style={{ right: 'auto' }}>
              <DropdownItem><i className="fa fa-user"></i> Profile</DropdownItem>
              <DropdownItem><i className="fa fa-wrench"></i> Settings</DropdownItem>
              <DropdownItem onClick={e => this.props.onLogout(e)}><i className="fa fa-lock"></i> Logout</DropdownItem>
            </DropdownMenu>
          </AppHeaderDropdown>

          {/* </AppHeaderDropdown> */}
        </Nav>

      </React.Fragment >
    );
  }
}

DefaultHeader.propTypes = propTypes;
DefaultHeader.defaultProps = defaultProps;
const mapStatetoProps = (state) => {
  return {
    user: state.user,
  }
}
export default connect(mapStatetoProps)(DefaultHeader);

