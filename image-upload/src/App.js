import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Card from './Card'
import { Button } from '@material-ui/core';

const styles = {
  root: {
    flexGrow: 1,
  },
};

function SimpleAppBar(props) {
  const { classes } = props;

  return (
    <div className={classes.root}>
      <AppBar position="static" color="default">
        <Toolbar>
          <Typography variant="h6" color="inherit">
            Image Upload
          </Typography>
        </Toolbar>
      </AppBar>
      <Card/>
      <br/>
      <footer style={{textAlign:'right',margin:10}} >
        <Button className={classes.button} href="https://github.com/xuranus">XUranus @ 2018</Button>
      </footer>
    </div>
  );
}

SimpleAppBar.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SimpleAppBar);