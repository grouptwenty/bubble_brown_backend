import React, { Component } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Badge, DropdownItem, DropdownMenu, DropdownToggle, Nav, NavItem, Row, Col } from 'reactstrap';
import PropTypes from 'prop-types';

import { AppAsideToggler, AppHeaderDropdown, AppNavbarBrand, AppSidebarToggler } from '@coreui/react';
// import sygnet from '../../assets/img/brand/sygnet.svg'
import { connect } from 'react-redux';
import AboutModel from '../../models/AboutModel'
const propTypes = {
  children: PropTypes.node,
};

const defaultProps = {};

var about_model = new AboutModel;
class DefaultHeader extends Component {
  constructor(props) {
    super(props)
    this.state = {
      branch_list: [],
    

  };
    this.renderBranch = this.renderBranch.bind(this);

  }

  async componentDidMount() {
    var branch_list = await about_model.getAboutBy()
    console.log("branch_list", branch_list);


    this.setState({
      branch_list: branch_list.data
    })

    console.log("branch_list", this.state.branch_list);

  }


  renderBranch() {

    if (this.state.branch_list != undefined) {
      var branch = []
      for (var key in this.state.branch_list) {
        branch.push(
        <DropdownItem><i className="fa fa-user"></i>{this.state.branch_list[key].about_name_th}</DropdownItem>
        )
    }
    return branch;
  }
}

  render() {

    // eslint-disable-next-line
    const { children, ...attributes } = this.props;

    return (
      <React.Fragment >
        {/* <AppSidebarToggler className="d-lg-none" display="md" mobile /> */}
        {/* <NavLink to="/dashboard"  > */}
        {/* 
        <AppNavbarBrand
          full={{ src: logo, width: 65, height: 65, alt: 'CoreUI Logo' }}
          minimized={{ src: sygnet, width: 30, height: 30, alt: 'CoreUI Logo' }}
        /> */}
        {/* </NavLink> */}
        <AppSidebarToggler className="d-md-down-none" display="lg" />
        <img src="/logo_bubblebrown.png" height={80} width={80} />

        <Nav className="ml-auto" navbar>

          <AppHeaderDropdown direction="down">
            <DropdownToggle nav>
              <NavLink to="#" className="nav-link">  <i className="fa fa-user"></i> </NavLink>
            </DropdownToggle>
            <DropdownMenu right style={{ right: 'auto' }}>
              {this.renderBranch()}
              <DropdownItem onClick={e => this.props.onLogout(e)}><i className="fa fa-lock"></i> ออกจากระบบ</DropdownItem>
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

