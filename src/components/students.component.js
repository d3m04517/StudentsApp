import React, { Component } from 'react';
import axios from 'axios';
import { Container, Row, Col, Form, Button} from 'react-bootstrap';
import { FaPlus, FaMinus } from 'react-icons/fa';

import '../styling/students.css';

export default class Students extends Component {
    constructor(props) {
        super(props);

        this.getAverage = this.getAverage.bind(this);
        this.updateNameSearchFilter = this.updateNameSearchFilter.bind(this);
        this.updateTagSearchFilter = this.updateTagSearchFilter.bind(this);
        this.isCollapsed = this.isCollapsed.bind(this);
        this.toggleState = this.toggleState.bind(this);

        this.state = {
            students: [],
            nameSearchFilter: '',
            tagSearchFilter: ''
        }

    }

    componentWillMount() {
        axios.get('https://www.hatchways.io/api/assessment/students').then((res,err) => {
            this.setState({
                students: res.data.students.map(student => {
                  student.toggleState = false;
                  student.tags = [];
                  return student; 
                })
            })
        });
    }

    getAverage(grades) {
        let sum = grades.reduce((sum, num) => sum + parseInt(num), 0);
        return sum / grades.length;
    }

    updateNameSearchFilter(e) {
        this.setState({nameSearchFilter: e.target.value.substr(0, 20)});
    }

    updateTagSearchFilter(e) {
        this.setState({tagSearchFilter: e.target.value.substr(0, 20)});
    }

    tagKeyPress(event, index) {
        if (event.charCode === 13) {
            let arr = this.state.students;
            arr[index].tags.push(event.target.value);
            this.setState({
                students: arr
            });
        }
    }

    isCollapsed(index) {
        if (this.state.students[index].toggleState) {
            return (
            <Row>
                <Col sm="3" md="3" lg="3"></Col>
                <Col className="descriptionCol" sm="8" md="8" lg="8">
                    {this.state.students[index].grades.map((grade, i) => {
                        return (
                            <span className="grade" key={i}>Test {i + 1}  {grade}% <br/></span>
                        )
                    })}
                    {this.state.students[index].tags.map((tag, i) => {
                        return (
                            <div className="tag" key={i}>
                            <span>{tag}<br/></span>
                            </div>
                        )
                    })}
                    <Form.Control id="tag-input" onKeyPress={(event) => {this.tagKeyPress(event, index)}} placeholder="Add a tag"></Form.Control>
                </Col>
            </Row>
            )
        }
    }

    toggleState(index) {
        let arr = this.state.students;
        arr[index].toggleState = !arr[index].toggleState
        this.setState({
            students: arr
        });
    }

    render() {
        let filteredStudents = this.state.students.filter((student) => {
            var isTag = this.state.tagSearchFilter === '' ? true : false;
            for (var tag of student.tags) {
                isTag = tag.toLowerCase().indexOf(this.state.tagSearchFilter) !== -1;
                if (isTag) break;
            }
            return (student.firstName.toLowerCase().indexOf(this.state.nameSearchFilter) !== -1 || student.lastName.toLowerCase().indexOf(this.state.nameSearchFilter) !== -1) && isTag;
        });
        return (
            <div className='container'>
                <Form.Control id="name-input" className="searchBar" type="text" placeholder="Search by name" value={this.state.nameSearchFilter} onChange={this.updateNameSearchFilter}></Form.Control>
                <Form.Control id="add-tag-input" className="searchBar" type="text" placeholder="Search by tag" value={this.state.tagSearchFilter} onChange={this.updateTagSearchFilter}></Form.Control>
                {filteredStudents.map((student, index) => {
                    return (
                        <Container className="innerContainer" key={student.id}>
                            <Row>
                                <Col className="avatarCol" sm="3" md="3" lg="3"> 
                                    <img className="avatar center-block" src={student.pic} alt="student pic"></img>
                                </Col>
                                <Col className="descriptionCol" sm="8" md="8" lg="8">
                                    <h3>{student.firstName} {student.lastName}</h3>
                                    <div>Email: {student.email} <br/>
                                    Company: {student.company} <br/>
                                    Skill: {student.skill} <br/>
                                    Average: {this.getAverage(student.grades)}
                                    </div>
                                </Col>
                                <Col sm="1" md="1" lg="1">
                                    <Button className="expand-btn" onClick={() => this.toggleState(index)}>{student.toggleState ? <FaMinus></FaMinus> : <FaPlus></FaPlus>}</Button>
                                </Col>
                            </Row>
                            {this.isCollapsed(index)}
                        </Container>
                    )
                })}
            </div>
        )
    }
}