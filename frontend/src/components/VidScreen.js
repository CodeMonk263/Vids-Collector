import "./App.css";
import React, { Component } from 'react';
import { Button , Card, ListGroup, Container, Row, Col } from 'react-bootstrap';
import history from "../history"
import axios from "axios";

class VidScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            vid_id: this.props.location.state.id,
            vid_title: this.props.location.state.title,
            vid_src: this.props.location.state.src
        };
    }

    GETRequest = async (url) => {
        const request = await axios.get(url);
        if (request.data !== "Error") {
            this.setState( { vid_src: request.data.src });
        } else {
            this.setState( { vid_src: request.data });
        }
    }

    componentDidMount = () => {
        if (this.state.vid_src === "None") {
            this.GETRequest("http://192.168.0.107:8000/api/"+this.state.vid_id+"/get_vid/");
        }
        console.log(this.props.location.state.id);
    };

    render() {
        return (
            <div className="wrapper" >
                <Container fluid className="page-footer">
                    <br/>
                    <Row xs={2} md={4} lg={6}>
                        <Col >
                            <Button className="button" variant="secondary" onClick={event => history.goBack()}>Back</Button>
                        </Col>
                    </Row>
                    <br/>
                    <Row>
                        <h1 className="title-text"> {this.state.vid_title} </h1>
                    </Row>
                    <Row>
                        <Col></Col>
                    </Row>
                </Container>
                {this.state.vid_src === "Error" ? 
                <h2>Video has been removed! Please try other video :(</h2> :
                this.state.vid_src !== "None" ? 
                <div>
                    <Container className="page-main">
                        <Row>
                            <Col xs lg="2">
                                <video src={this.state.vid_src} controls></video>
                            </Col>
                            <Col xs lg="2"></Col>
                        </Row>
                    </Container>
                    <Container className="page-footer">
                        <Row className="justify-content-md-center">
                            <Col xs lg="2"></Col>
                            <Col md="auto">
                            <Button className="button" variant="light" onClick={event => window.location.assign(this.state.vid_src)}>DOWNLOAD</Button>
                            </Col>
                            <Col xs lg="2"></Col>
                        </Row>
                    </Container>
                </div> : <h2>Loading...</h2>
                }
            </div>
        );
    };
}

export default VidScreen;