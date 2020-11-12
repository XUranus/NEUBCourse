import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import request from 'superagent';

import bannerImage from './banner.jpeg'

const styles = {
  card: {
    margin: '10px',
    display: 'block',
    maxWidth: '100%',
    maxHeight: '100%',
  },
  media: {
    height: 140,
  },
  input: {
    display: 'none',
  },
};

function MediaCard(props) {
  const { classes } = props;
  return (
    <Card className={classes.card}>
      <CardActionArea>
        <CardMedia
          className={classes.media}
          image={bannerImage}
          title="Upload Your Image"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            Upload Image
          </Typography>
          <Typography component="p">
            upload image here and get you url (not more than 1M)
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
      <input
        accept="image/*"
        className={classes.input}
        id="file-select"
        multiple
        type="file"
      />
      <label htmlFor="file-select">
        <Button component="span" className={classes.button }>
          Select Image
        </Button>
      </label>

        <Button 
          variant="contained" 
          color="primary" 
          className={classes.button}
          onClick={handleUpload}
        >
          Upload
        </Button>
        <br/>
        <a id="url"></a>
      </CardActions>
    </Card>
  );
}

function handleUpload() {
  let formData =new FormData();
  let input = document.getElementById('file-select');
  let file = input.files[0];
  formData.append('img',file);
  request
      .post('/upload')
      .send(formData)
      .end((err,res)=>{
          console.log(res.body.url);
          document.getElementById('url').href =  document.URL +'uploads/'+res.body.url;
          document.getElementById('url').innerHTML =  document.URL +'uploads/'+res.body.url;
      });
}



MediaCard.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(MediaCard);