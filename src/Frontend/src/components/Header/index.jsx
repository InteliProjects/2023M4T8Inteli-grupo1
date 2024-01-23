import React, { Component } from 'react';
import { Navbar } from 'reactstrap';
import '@mui/icons-material'
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import './Header.css';
import StyledGrid from './Header.styles';
import {MdLogout} from 'react-icons/md';
import { userLogout } from '../../store/reducers/reducerAuthentications';
import { connect } from 'react-redux';
import { TitleContext } from '../../context/TitleContext';

class Header extends Component {
  static contextType = TitleContext;
  constructor(props) {
    super(props);
    this.handleLogout = this.handleLogout.bind(this);
  }
  handleLogout() {
    this.props.dispatch(userLogout());
    window.location.reload();
  }

  render() {
    return (
      <React.Fragment>
        <Navbar dark>
          <div className="header">
            <h1 className="title">{this.context.title}</h1>
            <div className="header-icons" onClick={this.handleLogout}>
              <StyledGrid container spacing={1} alignItems="center" justifyContent="center">
                <Grid item>
                  <MdLogout size="25px" className="logout"/>
                </Grid>
                <Grid item>
                <Typography variant="h6" paddingBottom="3px" className="logout">Logout</Typography>
                </Grid>
              </StyledGrid>
            </div>
          </div>
        </Navbar>
      </React.Fragment>
    );
  }
}


export default connect()(Header);
