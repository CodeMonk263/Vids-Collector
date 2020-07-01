import "./App.css";
import React, { Component } from "react";
import history from "../history"
import { Button , Card, Container, Row, Col, Alert } from "react-bootstrap";
import axios from "axios";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      loaded: false,
      placeholder: "Loading",
      page_num: "0",
      search_term: ""
    };
    this.textInput = React.createRef();
    this.onSearchSubmit = this.onSearchSubmit.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);
    this.onPageSubmit = this.onPageSubmit.bind(this);
    this.handleSearchChange = this.handleSearchChange.bind(this);
  }

  handlePageChange(value) {
    this.setState({page_num: value});
  }

  onPageSubmit(event) {
    this.POSTRequest("http://192.168.0.107:8000/api/get_links/")
    event.preventDefault();
  }

  handleSearchChange(value) {
    this.setState({search_term: value});
  }

  onSearchSubmit(event) {
    this.setState({page_num: "1"});
    this.POSTRequest("http://192.168.0.107:8000/api/get_links/");
    this.setState({search_term: ""});
    event.preventDefault();
  }

  GETRequest = async (url) => {
    const request = await axios.get(url);
    this.setState( { data: request.data, loaded: true, page_num: request.data[0].page_num });
    console.log(this.state.page_num);
    console.log(this.state.search_term);
  }

  POSTRequest = async (url) => {
    this.setState({loaded: false, placeholder: "Loading"});
    await axios.post(url,
    {
      "page_num": this.state.page_num,
      "search": this.state.search_term
    },
    {
    headers: {
        'Content-Type': 'application/json'
    }
    })
    .then(request => {
      if (request.data != "Error") {
        this.GETRequest("http://192.168.0.107:8000/api/");
      } else {
        this.setState( { placeholder: "Error Site Crashed Please Try Again By Searching Again!" });
      }
    })
    .catch(err => console.log(err))
  }

  componentDidMount() {
    this.GETRequest("http://192.168.0.107:8000/api/");
  };

  goToVideo = (video) => {
      history.push('/video', { id: video.id, title: video.title, src: video.src });
      window.location.assign('/video');
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
        <br/>
        <Row>
        <Col></Col>  
        <Col md="auto">
          <img src="https://raw.githubusercontent.com/CodeMonk263/File-Repo/master/logo.png" 
               alt="Logo"
               height="70" width="160" />
        </Col>
        <Col></Col> 
        </Row>
        <br/>
        <Row>
        <Col>
          <form onSubmit={this.onSearchSubmit}>
              <label>
                Search:
                <input type="text" value={this.state.search_term} onChange={(e)=>this.handleSearchChange(e.target.value)} />
              </label>
              <input type="submit" value="Submit" />
          </form>
        </Col>  
        <Col>
          <form onSubmit={this.onPageSubmit}>
            <label>
              Page:       
              <input type="text" value={this.state.page_num} onChange={(e)=>this.handlePageChange(e.target.value)} />
            </label>
            <input type="submit" value="Submit" />
          </form>
        </Col>
        <Col xs lg={2}>
          <Alert variant="info">
            Page - {this.state.page_num}
          </Alert>      
        </Col>
        </Row>
        <br/>
        </Container>
        <Container fluid>
          <Row className="row-grid">     
              {this.state.loaded ? 
              this.state.data.map(video => {
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
              }) : this.state.placeholder !== "Loading" ? <h2>{this.state.placeholder}</h2> : <h2>Loading...</h2>}
        </Row>
        </Container>
      </div>
    );
  }
}

export default App;

