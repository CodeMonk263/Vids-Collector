import "./App.css";
import React, { Component } from 'react';
import { Button , Card, ListGroup, Container, Row, Col } from 'react-bootstrap';
import history from "../history"

class VidScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            vid_id: this.props.location.state.id,
            vid_title: this.props.location.state.title,
            vid_src: this.props.location.state.src
        };
    }

    componentDidMount = () => {
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
                <Container className="page-main">
                    <Row className="justify-content-md-center">
                        <Col xs lg="2">
                            <video src={this.state.vid_src} controls></video>
                        </Col>
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
            </div>
        );
    };
}

export default VidScreen;