import "./App.css";
import React, { Component } from "react";
import history from "../history"
import { Button , Card, InputGroup, FormControl, Container, Row, Col, Alert } from "react-bootstrap";
import axios from "axios";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      loaded: false,
      placeholder: "Loading",
      page_num: "0",
    };
  }

  GETRequest = (url) => {
    fetch(url)
    .then(response => {
      if (response.status > 400) {
        return this.setState(() => {
          return { placeholder: "Something went wrong!" };
        });
      }
      return response.json();
    })
    .then(data => {
      this.setState(() => {
        return {
          data,
          loaded: true,
          page_num: data[0].page_num,
        };
      });
    });
  }

  POSTRequest = () => {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: toString(this.state.page_num),
    };
    try {
      // (async () => {
      // console.log("Async func");
      const response = fetch("http://192.168.0.104:8000/api/get_links/", options);
      const status = response.status;
      console.log('👉 Returned data:', response.data === "Success" ? response.data : response.detail);
      if (status === 201) {
        this.GETRequest("api/");
      }
    // });
    } catch (e) {
      console.log(`😱 Axios request failed: ${e}`);
    }
  }

  onInputChange = event => {
    this.setState({ page_num: event.target.value });
  };

  onTermSubmit = () => {
    this.POSTRequest();
  };

  componentDidMount() {
    this.GETRequest("api/");
  };

  goToVideo = (video) => {
    if (video.src === "None") {
      history.push('/api/'+video.id+'/get_vid/');
      window.location.assign('/api/'+video.id+'/get_vid/');
    } else {
      history.push('/video', { id: video.id, title: video.title, src: video.src });
      window.location.assign('/video');
    }
  };

  changePage = () => {
      window.location.assign('/api/get_links/');
  };

  getBg = (src) => {
    return src === "None" ? "black-bg" : "cached-bg";
  }

  render() {
    return (
      <div className="black-bg" >
        <Container fluid>
        <Row>
        <Col xs={6} md={4}></Col>  
        <Col xs={6} md={4}>
        <h1 className="page-title">Vids-Hub</h1>
        </Col>
        <Col xs={6} md={4}></Col> 
        </Row>
        <Row xs={2} md={4} lg={6}><Col>
          <Button variant="primary" 
          className="button" 
          onClick={this.changePage} 
          placeholder="Page Num"
          >Change Page</Button>
        </Col><Col>
          <Alert variant="info">
            Page - {this.state.page_num}
          </Alert>      
        </Col>
        </Row>
        </Container>
        <Container fluid>
          <Row className="row-grid">     
              {this.state.data.map(video => {
              return (
                <Col className="col-grid" key={video.id}>
                  <Card style={{ width: '18rem' }}>
                    <Card.Img variant="top" src={video.thumbnail_src} />
                    <Card.Body className={this.getBg(video.src)} >
                      <Card.Title>
                        <h3 className="title-text">{video.title}</h3>
                      </Card.Title>
                      <Row>
                      <Col>
                      <Button variant="primary" className="button" onClick={() => this.goToVideo(video)} >Watch</Button>
                      </Col>
                      </Row>
                    </Card.Body>
                  </Card>
                </Col>
              );
            })}
        </Row>
        </Container>
      </div>
    );
  }
}

export default App;

