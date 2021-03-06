import React, { Component } from 'react';
import { Card, CardImg, CardText, CardBody, CardTitle, Breadcrumb, BreadcrumbItem,
        Button, Modal, ModalBody, Label, Col, Row, ModalHeader} from 'reactstrap';
import { Link } from 'react-router-dom';
import { Control, Errors, LocalForm} from 'react-redux-form';
import { Loading } from './LoadingComponent';
import { baseUrl } from '../shared/baseUrl';
import { FadeTransform, Fade, Stagger } from 'react-animation-components';


const required = (val) => val && (val.length);
const maxLength = (len) => (val) => !(val) || (val.length <= len);
const minLength = (len) => (val) => !(val) || (val.length >= len);

    function RenderDish({dish}) {

            return(
                <div>
                    <FadeTransform
                        in
                        transformProps={{
                            exitTransform: 'scale(0.5) translateY(-50%)'
                        }}>
                    <Card>
                        <CardImg width="100%" src={baseUrl + dish.image} alt={dish.name} />
                        <CardBody>
                            <CardTitle>{dish.name}</CardTitle>
                            <CardText>{dish.description}</CardText>
                        </CardBody>
                    </Card>
                    </FadeTransform>
                </div>
                
            );
    }

    class CommentForm extends Component{
        constructor(props){
            super(props);
            this.state = {
                isModalOpen: false
            };
            this.toggleModal = this.toggleModal.bind(this);
            this.handleSubmit = this.handleSubmit.bind(this);
        }

        toggleModal(){
            this.setState({
                isModalOpen: !this.state.isModalOpen
            });
        }

        handleSubmit(values){
            this.toggleModal();
            // alert('Current state is: ' + JSON.stringify(values));
            this.props.postComment(this.props.dishId, values.rating, values.author,
                 values.comments);
        }

        render(){
            return(<>
            <Modal isOpen={this.state.isModalOpen} toggle={this.toggleModal}>
                <ModalHeader toggle={this.toggleModal}>Submit Comment</ModalHeader>
                <ModalBody>
                <div className="col-12 col-md-9">
                    <LocalForm onSubmit={(values => this.handleSubmit(values))} >
                        <Row className="form-group">
                            <Label htmlFor="rating">Rating</Label>
                            <Control.select model=".rating" name="rating"
                            className="form-control" validators={{required}}
                            >
                                <option>1</option>
                                <option>2</option>
                                <option>3</option>
                                <option>4</option>
                                <option>5</option>
                            </Control.select>
                            <Errors className="text-danger"
                            show='touched'
                            model=".rating"
                            messages={{
                                required: 'Please Rate the dish'
                            }}
                            />
                        </Row>
                        <Row className="form-group">
                            <Label htmlFor="author">Your Name</Label>
                            <Control.text model=".author" name="author" id="author"
                            placeholder="Your Name"
                            className="form-control"
                            validators={{
                                required, minLength: minLength(3), maxLength: maxLength(15)
                            }}
                            />
                            <Errors 
                            className="text-danger"
                            show="touched"
                            model=".author"
                            messages={{
                                required: 'Required',
                                minLength: 'Must be greater than 2 characters',
                                maxLength: 'Must be less than 15 characters'
                            }}
                            />
                        </Row>
                        <Row className="form-group">
                            <Label htmlFor="comments">Comment</Label>
                            <Control.textarea model=".comments" id="comments" name="comments"
                            placeholder="Write your Comment"
                            className="form-control"
                            rows="6"
                            validators={{
                                required
                            }}
                            />
                            <Errors 
                            className="text-danger"
                            model=".comments"
                            show="touched"
                            messages={{
                                required: "Required"
                            }}
                            />
                        </Row>
                        <Row className="form-group">
                                <Col md={{size: 10}}>
                                    <Button type="submit" color="primary">Submit</Button>
                                </Col>
                            </Row>
                    </LocalForm>

                </div>
                </ModalBody>

            </Modal>
                <div>
                    <Button outline onClick={this.toggleModal}><span className="fa fa-comments fa-lg"></span> Comments</Button>
                </div>
                
                </>
            );
        }

    } 

    


    function RenderComments({comments, postComment, dishId}) {
        if(comments != null)
            return (
                <div className="col-12 col-md-5 m-1">
                    <h4>Comments</h4>
                    <ul className="list-unstyled">
                        <Stagger in>
                    {comments.map((comment) => {
                        return(
                            <Fade in>
                            <li key={comment.id}>
                                <p>{comment.comment}</p>
                                <p>-- {comment.author} , 
                                    {new Intl.DateTimeFormat("en-GB", {
                                        year: "numeric",
                                        month: "short",
                                        day: "2-digit"
                                    }).format(Date.parse(comment.date))}
                                </p>
                            </li>
                            </Fade>
                        );
                                })}
                        </Stagger>
                    </ul>
                    <CommentForm postComment={postComment} dishId={dishId}  />
                </div>
            );
            else{
                return(
                    <div></div>
                );
            }
               
                
        }
    
    const DishDetail = (props) => {
        if (props.isLoading) {
            return(
                <div className="container">
                    <div className="row">
                        <Loading />
                    </div>
                </div>
            );
        }
        else if (props.errMess) {
            return(
                <div className="container">
                    <div className="row">
                        <h4>{props.errMess}</h4>
                    </div>
                </div>
            );
        }
        
        if(props.dish != null){
            return(
                <div className="container">
                <div className="row">
                    <Breadcrumb>
    
                        <BreadcrumbItem><Link to="/menu">Menu</Link></BreadcrumbItem>
                        <BreadcrumbItem active>{props.dish.name}</BreadcrumbItem>
                    </Breadcrumb>
                    <div className="col-12">
                        <h3>{props.dish.name}</h3>
                        <hr />
                    </div>                
                </div>
                <div className="row">
                    <div className="col-12 col-md-5 m-1">
                        <RenderDish dish={props.dish} />
                    </div>
                    <RenderComments comments={props.comments} postComment={props.postComment}
                            dishId={props.dish.id} />
                </div>
                </div>    
            );
        }
        else {
            return(
                <div>

                </div>
            );

        }
       
    }


export default DishDetail;